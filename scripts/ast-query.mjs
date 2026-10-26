#!/usr/bin/env node

/**
 * Vibes-Plug AST Subgraph & Call-Graph Digraph Engine (2026 Edition)
 *
 * Part of P3: Living Codebase AST Graph & Surgical Context Slicing.
 * Extracts multi-language symbols (TS/JS/Python/Go/Rust), multiline generic signatures,
 * class methods, import/export dependency edges, and computes transitive BFS blast radius
 * across the workspace dependency digraph without flooding the LLM context window.
 */

import fs from 'fs/promises';
import fssync from 'fs';
import path from 'path';

const JS_TS_EXTS = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx']);
const ALL_SOURCE_EXTS = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.go', '.rs']);
const CONTROL_KEYWORDS = new Set([
  'if', 'for', 'while', 'switch', 'catch', 'return', 'throw', 'new', 'typeof', 'delete', 'await', 'yield', 'super', 'import'
]);

/**
 * Resolves a relative import specifier to an actual file on disk if possible.
 */
function resolveImportTarget(fromFile, specifier) {
  if (!specifier || !specifier.startsWith('.')) return null;
  const baseDir = path.dirname(fromFile);
  const candidateBase = path.resolve(baseDir, specifier);
  const probeExts = ['', '.mjs', '.js', '.ts', '.tsx', '.jsx', '.cjs', '/index.ts', '/index.mjs', '/index.js'];

  for (const suffix of probeExts) {
    const full = candidateBase + suffix;
    try {
      const stat = fssync.statSync(full);
      if (stat.isFile()) return full;
    } catch {
      // continue probing
    }
  }
  return candidateBase;
}

/**
 * Extracts static ESM imports, re-exports, and CommonJS require() edges from JS/TS source.
 */
export function parseImportEdges(content, filePath) {
  const imports = [];
  const stripped = content.replace(/\/\*[\s\S]*?\*\//g, (m) => '\n'.repeat((m.match(/\n/g) || []).length));

  // 1. ESM import declarations (supports multiline { ... } blocks)
  const esmRegex = /\b(?:import|export)\s+(?:type\s+)?([\s\S]*?)\s+from\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = esmRegex.exec(stripped)) !== null) {
    const clause = match[1].trim();
    const source = match[2].trim();
    if (clause.includes(';') || clause.split('\n').length > 12) continue;

    const line = stripped.slice(0, match.index).split(/\r?\n/).length;
    const specifiers = [];
    const namedMatch = clause.match(/\{([\s\S]*?)\}/);
    if (namedMatch) {
      namedMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((part) => {
          const cleaned = part.replace(/^type\s+/, '').trim();
          const aliasParts = cleaned.split(/\s+as\s+/);
          specifiers.push(aliasParts[0].trim());
        });
    }
    const defaultPart = clause.replace(/\{[\s\S]*?\}/, '').replace(/,/g, '').trim();
    if (defaultPart && !defaultPart.startsWith('*')) {
      specifiers.push(defaultPart.replace(/^type\s+/, '').trim());
    } else if (defaultPart.startsWith('*')) {
      specifiers.push('*');
    }

    imports.push({
      source,
      specifiers,
      resolvedPath: resolveImportTarget(filePath, source),
      line
    });
  }

  // 2. CommonJS require('...')
  const cjsRegex = /(?:const|let|var)\s+([\w${}\s,:]+?)\s*=\s*require\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = cjsRegex.exec(stripped)) !== null) {
    const binding = match[1].trim();
    const source = match[2].trim();
    const line = stripped.slice(0, match.index).split(/\r?\n/).length;
    const specifiers = [];
    const destructured = binding.match(/\{([\s\S]*?)\}/);
    if (destructured) {
      destructured[1]
        .split(',')
        .map((s) => s.split(':')[0].trim())
        .filter(Boolean)
        .forEach((s) => specifiers.push(s));
    } else {
      specifiers.push(binding);
    }

    imports.push({
      source,
      specifiers,
      resolvedPath: resolveImportTarget(filePath, source),
      line
    });
  }

  return imports;
}

/**
 * Collapses a multiline function signature starting at lineIdx into a normalized single-line parameter string.
 */
function readMultilineParams(lines, lineIdx, startAfterParen) {
  let acc = startAfterParen;
  let depth = 1;
  for (const ch of startAfterParen) {
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) {
        return acc.slice(0, acc.indexOf(')')).trim();
      }
    }
  }
  for (let j = lineIdx + 1; j < Math.min(lines.length, lineIdx + 8); j++) {
    const seg = lines[j].replace(/\/\/.*$/, '').trim();
    acc += ' ' + seg;
    for (const ch of seg) {
      if (ch === '(') depth++;
      else if (ch === ')') {
        depth--;
        if (depth === 0) {
          const closeIdx = acc.lastIndexOf(')');
          return acc.slice(0, closeIdx).replace(/\s+/g, ' ').trim();
        }
      }
    }
  }
  return acc.replace(/\s+/g, ' ').trim();
}

export async function parseSymbols(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const ext = path.extname(filePath);
  const lines = content.split(/\r?\n/);
  const symbols = [];
  const exportedNames = new Set();

  let currentClass = null;
  let braceDepth = 0;
  let classBaseDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.replace(/\/\/.*$/, '');
    const trimmed = line.trim();
    const lineNum = i + 1;

    if (!trimmed || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      continue;
    }

    // TypeScript / JavaScript
    if (JS_TS_EXTS.has(ext)) {
      const isExported = /^\s*export\b/.test(line);

      // 1. Standard & Generic Functions (supports multiline params)
      const fnMatch = line.match(/^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*(\w+)\s*(?:<[^>]*>)?\s*\((.*)$/);
      if (fnMatch) {
        const name = fnMatch[1];
        const params = readMultilineParams(lines, i, fnMatch[2]);
        symbols.push({
          name,
          type: 'function',
          exported: isExported,
          signature: `function ${name}(${params})`,
          line: lineNum
        });
        if (isExported) exportedNames.add(name);
      } else {
        // 2. Arrow functions / const declarations (supports TS type annotations and generics)
        const arrowMatch = line.match(/^(?:export\s+)?(?:const|let)\s+(\w+)(?:\s*:[^=]+)?\s*=\s*(?:async\s*)?(?:<[^>]*>\s*)?\(([^)]*)\)(?:\s*:[^=]+)?\s*=>/);
        if (arrowMatch) {
          const name = arrowMatch[1];
          symbols.push({
            name,
            type: 'arrow-function',
            exported: isExported,
            signature: `const ${name} = (${arrowMatch[2].trim()}) =>`,
            line: lineNum
          });
          if (isExported) exportedNames.add(name);
        } else {
          // 3. Classes
          const classMatch = line.match(/^(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+(\w+)(?:<[^>]*>)?(?:\s+extends\s+[\w.<>]+)?/);
          if (classMatch) {
            const name = classMatch[1];
            currentClass = name;
            classBaseDepth = braceDepth;
            symbols.push({
              name,
              type: 'class',
              exported: isExported,
              signature: trimmed.replace(/\s*\{.*$/, ''),
              line: lineNum
            });
            if (isExported) exportedNames.add(name);
          } else {
            // 4. TypeScript Interfaces, Types, Enums
            const ifaceMatch = line.match(/^(?:export\s+)?interface\s+(\w+)/);
            if (ifaceMatch) {
              symbols.push({ name: ifaceMatch[1], type: 'interface', exported: isExported, signature: trimmed.replace(/\s*\{.*$/, ''), line: lineNum });
              if (isExported) exportedNames.add(ifaceMatch[1]);
            } else {
              const typeMatch = line.match(/^(?:export\s+)?type\s+(\w+)\s*(?:<[^>]*>)?\s*=/);
              if (typeMatch) {
                symbols.push({ name: typeMatch[1], type: 'type', exported: isExported, signature: trimmed, line: lineNum });
                if (isExported) exportedNames.add(typeMatch[1]);
              } else {
                const enumMatch = line.match(/^(?:export\s+)?(?:const\s+)?enum\s+(\w+)/);
                if (enumMatch) {
                  symbols.push({ name: enumMatch[1], type: 'enum', exported: isExported, signature: trimmed.replace(/\s*\{.*$/, ''), line: lineNum });
                  if (isExported) exportedNames.add(enumMatch[1]);
                } else if (currentClass && braceDepth === classBaseDepth + 1) {
                  // 5. Class Methods inside active class body
                  const methodMatch = trimmed.match(/^(?:(?:public|private|protected|static|readonly|override|async|get|set)\s+)*(\w+)\s*(?:<[^>]*>)?\s*\(([^)]*)\)\s*(?::\s*[^{]+)?\{/);
                  if (methodMatch && !CONTROL_KEYWORDS.has(methodMatch[1])) {
                    const mName = methodMatch[1];
                    symbols.push({
                      name: `${currentClass}.${mName}`,
                      methodName: mName,
                      className: currentClass,
                      type: 'method',
                      exported: true,
                      signature: `${currentClass}.${mName}(${methodMatch[2].trim()})`,
                      line: lineNum
                    });
                  }
                }
              }
            }
          }
        }
      }

      // Track brace depth for class method scoping
      const strippedStrings = line.replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, '');
      for (const ch of strippedStrings) {
        if (ch === '{') braceDepth++;
        else if (ch === '}') {
          braceDepth = Math.max(0, braceDepth - 1);
          if (currentClass && braceDepth <= classBaseDepth) {
            currentClass = null;
          }
        }
      }
    }

    // Python
    if (ext === '.py') {
      const pyFn = rawLine.match(/^\s*(?:async\s+)?def\s+(\w+)\s*\(([^)]*)\)/);
      if (pyFn) {
        symbols.push({ name: pyFn[1], type: 'function', signature: `def ${pyFn[1]}(${pyFn[2]}):`, line: lineNum });
        continue;
      }
      const pyClass = rawLine.match(/^\s*class\s+(\w+)(?:\([^)]*\))?:/);
      if (pyClass) {
        symbols.push({ name: pyClass[1], type: 'class', signature: rawLine.trim(), line: lineNum });
        continue;
      }
    }

    // Go
    if (ext === '.go') {
      const goMethod = rawLine.match(/^func\s+\(([^)]+)\)\s*(\w+)\s*\(([^)]*)\)/);
      if (goMethod) {
        symbols.push({ name: goMethod[2], type: 'method', signature: rawLine.trim().replace(/\s*\{.*$/, ''), line: lineNum });
        continue;
      }
      const goFn = rawLine.match(/^func\s+(\w+)\s*\(([^)]*)\)/);
      if (goFn) {
        symbols.push({ name: goFn[1], type: 'function', signature: `func ${goFn[1]}(${goFn[2]})`, line: lineNum });
        continue;
      }
      const goType = rawLine.match(/^type\s+(\w+)\s+(struct|interface)\b/);
      if (goType) {
        symbols.push({ name: goType[1], type: goType[2], signature: rawLine.trim().replace(/\s*\{.*$/, ''), line: lineNum });
        continue;
      }
    }

    // Rust
    if (ext === '.rs') {
      const rsFn = rawLine.match(/^\s*(?:pub(?:\([^)]*\))?\s+)?(?:async\s+)?fn\s+(\w+)\s*(?:<[^>]*>)?\s*\(([^)]*)\)/);
      if (rsFn) {
        symbols.push({ name: rsFn[1], type: 'function', signature: `fn ${rsFn[1]}(${rsFn[2]})`, line: lineNum });
        continue;
      }
      const rsType = rawLine.match(/^\s*(?:pub(?:\([^)]*\))?\s+)?(struct|enum|trait)\s+(\w+)/);
      if (rsType) {
        symbols.push({ name: rsType[2], type: rsType[1], signature: rawLine.trim().replace(/\s*\{.*$/, ''), line: lineNum });
        continue;
      }
    }
  }

  const imports = JS_TS_EXTS.has(ext) ? parseImportEdges(content, filePath) : [];

  return {
    filePath,
    symbols,
    imports,
    exports: Array.from(exportedNames),
    totalLines: lines.length
  };
}

export async function extractSymbolCode(filePath, symbolName) {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const parsed = await parseSymbols(filePath);
  const lower = symbolName.toLowerCase();
  const target = parsed.symbols.find(
    (s) => s.name.toLowerCase() === lower || (s.methodName && s.methodName.toLowerCase() === lower)
  );

  if (!target) {
    return { found: false, error: `Symbol '${symbolName}' not found in ${filePath}` };
  }

  const startIdx = target.line - 1;
  let endIdx = startIdx;
  let bracketCount = 0;
  let started = false;

  for (let i = startIdx; i < lines.length; i++) {
    const strippedLine = lines[i]
      .replace(/\/\/.*$/, '')
      .replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, '');
    for (const char of strippedLine) {
      if (char === '{') {
        bracketCount++;
        started = true;
      } else if (char === '}') {
        bracketCount--;
      }
    }
    if (started && bracketCount === 0) {
      endIdx = i;
      break;
    }
    if (i > startIdx + 500) {
      endIdx = i;
      break;
    }
  }

  const codeSlice = lines.slice(startIdx, endIdx + 1).join('\n');
  return {
    found: true,
    symbol: target,
    startLine: target.line,
    endLine: endIdx + 1,
    code: codeSlice
  };
}

export async function calculateBlastRadius(rootDir, targetFile, options = {}) {
  const resolvedTarget = path.resolve(targetFile);
  const targetBase = path.basename(targetFile, path.extname(targetFile));
  const targetRel = path.relative(rootDir, resolvedTarget).replace(/\\/g, '/');

  let targetExportedSymbols = [];
  try {
    const parsedTarget = await parseSymbols(resolvedTarget);
    targetExportedSymbols = parsedTarget.symbols.map((s) => s.methodName || s.name);
  } catch {
    // Target might not exist or be non-code
  }
  if (options.symbolName) {
    targetExportedSymbols = [options.symbolName];
  }

  const results = [];
  const reverseImportGraph = new Map(); // resolvedTargetFile -> Set<{ file, relFile, specifiers, line }>
  const allScannedFiles = [];

  async function scanDir(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const e of entries) {
      if (['node_modules', '.git', '.next', 'dist', '.agents', '.cursor', '.claude', '.codex'].includes(e.name)) continue;
      const fullPath = path.join(currentDir, e.name);
      if (e.isDirectory()) {
        await scanDir(fullPath);
      } else if (['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.json'].includes(path.extname(e.name))) {
        allScannedFiles.push(fullPath);
      }
    }
  }

  await scanDir(rootDir);

  for (const fullPath of allScannedFiles) {
    if (fullPath === resolvedTarget) continue;
    try {
      const content = await fs.readFile(fullPath, 'utf8');
      const relFile = path.relative(rootDir, fullPath);
      const ext = path.extname(fullPath);

      // 1. Build reverse import digraph edges
      let importsTargetDirectly = false;
      let importedSymbolSet = new Set();

      if (JS_TS_EXTS.has(ext)) {
        const edges = parseImportEdges(content, fullPath);
        for (const edge of edges) {
          if (edge.resolvedPath) {
            if (!reverseImportGraph.has(edge.resolvedPath)) {
              reverseImportGraph.set(edge.resolvedPath, []);
            }
            reverseImportGraph.get(edge.resolvedPath).push({
              file: fullPath,
              dependentFile: relFile,
              specifiers: edge.specifiers,
              line: edge.line
            });
            if (edge.resolvedPath === resolvedTarget) {
              importsTargetDirectly = true;
              edge.specifiers.forEach((s) => importedSymbolSet.add(s));
            }
          }
        }
      }

      // 2. Collect line-level usages (import statements, call-sites of imported symbols, or basename references)
      if (importsTargetDirectly || content.includes(targetBase)) {
        const lines = content.split(/\r?\n/);
        lines.forEach((l, idx) => {
          const matchesBase = l.includes(targetBase);
          let matchesImportedSymbol = false;
          if (importsTargetDirectly && importedSymbolSet.size > 0) {
            for (const sym of importedSymbolSet) {
              if (sym !== '*' && new RegExp(`\\b${sym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(l)) {
                matchesImportedSymbol = true;
                break;
              }
            }
          }
          if (matchesBase || matchesImportedSymbol) {
            results.push({
              dependentFile: relFile,
              line: idx + 1,
              kind: matchesBase ? 'module-reference' : 'symbol-callsite',
              snippet: l.trim()
            });
          }
        });
      }
    } catch {
      // Skip unreadable files
    }
  }

  // 3. Compute Transitive Closure via BFS over the reverse import digraph
  const transitiveDependents = [];
  const visitedFiles = new Set([resolvedTarget]);
  const queue = [{ file: resolvedTarget, depth: 0, via: null }];

  while (queue.length > 0) {
    const current = queue.shift();
    const callers = reverseImportGraph.get(current.file) || [];
    for (const caller of callers) {
      if (!visitedFiles.has(caller.file)) {
        visitedFiles.add(caller.file);
        const hop = {
          dependentFile: caller.dependentFile,
          depth: current.depth + 1,
          importedSymbols: caller.specifiers,
          importLine: caller.line,
          via: current.depth === 0 ? targetRel : path.relative(rootDir, current.file).replace(/\\/g, '/')
        };
        transitiveDependents.push(hop);
        queue.push({ file: caller.file, depth: current.depth + 1, via: caller.dependentFile });
      }
    }
  }

  const allImpactedSet = new Set([
    ...results.map((r) => r.dependentFile),
    ...transitiveDependents.map((t) => t.dependentFile)
  ]);

  return {
    target: targetFile,
    exportedSymbols: targetExportedSymbols,
    directImportersCount: transitiveDependents.filter((t) => t.depth === 1).length,
    transitiveDependents,
    dependentUsages: results,
    totalImpactedFiles: allImpactedSet.size
  };
}

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];

  if (!action || action === 'help') {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║    Vibes-Plug AST Subgraph Query Engine (P3 Engine)      ║
╚══════════════════════════════════════════════════════════╝

Usage:
  node scripts/ast-query.mjs symbols <filePath>
  node scripts/ast-query.mjs inspect <filePath> <symbolName>
  node scripts/ast-query.mjs blast-radius <filePath>

Examples:
  node scripts/ast-query.mjs symbols scripts/install.js
  node scripts/ast-query.mjs inspect scripts/install.js installForCodex
  node scripts/ast-query.mjs blast-radius scripts/install.js
`);
    return;
  }

  if (action === 'symbols') {
    const target = path.resolve(process.cwd(), args[1] || 'scripts/install.js');
    const res = await parseSymbols(target);
    console.log(`\n🔍 Symbols in ${path.basename(target)} (${res.symbols.length} detected across ${res.totalLines} lines, ${res.imports.length} import edges):\n`);
    res.symbols.forEach((s) => {
      console.log(`  • [Line ${String(s.line).padStart(3)}] \x1b[36m${s.type.padEnd(14)}\x1b[0m \x1b[32m${s.name}\x1b[0m (${s.signature})`);
    });
    console.log('');
  } else if (action === 'inspect') {
    const target = path.resolve(process.cwd(), args[1]);
    const symbol = args[2];
    const res = await extractSymbolCode(target, symbol);
    if (!res.found) {
      console.error(`\n❌ ${res.error}\n`);
      process.exit(1);
    }
    console.log(`\n🎯 Extracted '${res.symbol.name}' [Lines ${res.startLine}-${res.endLine}]:\n`);
    console.log(res.code);
    console.log('\n✅ Surgical extract complete. Zero token context bloat.\n');
  } else if (action === 'blast-radius') {
    const target = path.resolve(process.cwd(), args[1]);
    const res = await calculateBlastRadius(process.cwd(), target);
    console.log(`\n💥 Blast Radius Analysis for: ${path.basename(target)}`);
    console.log(`   Impacted Files: ${res.totalImpactedFiles} | Direct Importers: ${res.directImportersCount} | Transitive Hops: ${res.transitiveDependents.length} | References: ${res.dependentUsages.length}\n`);
    if (res.transitiveDependents.length > 0) {
      console.log('   Dependency Digraph (Transitive Closure):');
      res.transitiveDependents.forEach((t) => {
        console.log(`     [Hop ${t.depth}] ${t.dependentFile}:${t.importLine} (imports: ${t.importedSymbols.join(', ') || '*'} via ${t.via})`);
      });
      console.log('');
    }
    res.dependentUsages.forEach((d) => {
      console.log(`  • \x1b[33m${d.dependentFile}:${d.line}\x1b[0m -> ${d.snippet}`);
    });
    console.log('');
  }
}

if (process.argv[1] && process.argv[1].endsWith('ast-query.mjs')) {
  main().catch((err) => {
    console.error(`\n❌ Error during AST query: ${err.message}`);
    process.exit(1);
  });
}
