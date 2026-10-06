#!/usr/bin/env node

/**
 * Vibes-Plug AST Subgraph Query Engine (2026 Edition)
 * 
 * Part of P3: Living Codebase AST Graph & Surgical Context Slicing
 * Extracts symbols, functions, classes, interfaces, and blast radii
 * without flooding the Transformer's context window.
 */

import fs from 'fs/promises';
import path from 'path';

export async function parseSymbols(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const ext = path.extname(filePath);
  const lines = content.split(/\r?\n/);
  const symbols = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // TypeScript / JavaScript
    if (['.js', '.mjs', '.ts', '.tsx', '.jsx'].includes(ext)) {
      // Functions
      const fnMatch = line.match(/(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/);
      if (fnMatch) {
        symbols.push({ name: fnMatch[1], type: 'function', signature: `function ${fnMatch[1]}(${fnMatch[2]})`, line: lineNum });
        continue;
      }

      // Arrow functions / const declarations
      const arrowMatch = line.match(/(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/);
      if (arrowMatch) {
        symbols.push({ name: arrowMatch[1], type: 'arrow-function', signature: `const ${arrowMatch[1]} = (${arrowMatch[2]}) =>`, line: lineNum });
        continue;
      }

      // Classes
      const classMatch = line.match(/(?:export\s+)?class\s+(\w+)(?:\s+extends\s+\w+)?/);
      if (classMatch) {
        symbols.push({ name: classMatch[1], type: 'class', signature: line.trim(), line: lineNum });
        continue;
      }

      // TypeScript Interfaces & Types
      const ifaceMatch = line.match(/(?:export\s+)?interface\s+(\w+)/);
      if (ifaceMatch) {
        symbols.push({ name: ifaceMatch[1], type: 'interface', signature: line.trim(), line: lineNum });
        continue;
      }

      const typeMatch = line.match(/(?:export\s+)?type\s+(\w+)\s*=/);
      if (typeMatch) {
        symbols.push({ name: typeMatch[1], type: 'type', signature: line.trim(), line: lineNum });
        continue;
      }
    }

    // Python
    if (ext === '.py') {
      const pyFn = line.match(/^def\s+(\w+)\s*\(([^)]*)\):/);
      if (pyFn) {
        symbols.push({ name: pyFn[1], type: 'function', signature: `def ${pyFn[1]}(${pyFn[2]}):`, line: lineNum });
        continue;
      }
      const pyClass = line.match(/^class\s+(\w+)(?:\([^)]*\))?:/);
      if (pyClass) {
        symbols.push({ name: pyClass[1], type: 'class', signature: line.trim(), line: lineNum });
        continue;
      }
    }
  }

  return { filePath, symbols, totalLines: lines.length };
}

export async function extractSymbolCode(filePath, symbolName) {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const parsed = await parseSymbols(filePath);
  const target = parsed.symbols.find(s => s.name.toLowerCase() === symbolName.toLowerCase());

  if (!target) {
    return { found: false, error: `Symbol '${symbolName}' not found in ${filePath}` };
  }

  // Slice around the symbol's definition
  const startIdx = target.line - 1;
  let endIdx = startIdx;
  let bracketCount = 0;
  let started = false;

  for (let i = startIdx; i < lines.length; i++) {
    const l = lines[i];
    for (const char of l) {
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
    if (i > startIdx + 100) { // Safety ceiling
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

export async function calculateBlastRadius(rootDir, targetFile) {
  const targetBase = path.basename(targetFile, path.extname(targetFile));
  const results = [];

  async function scanDir(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const e of entries) {
      if (['node_modules', '.git', '.next', 'dist'].includes(e.name)) continue;
      const fullPath = path.join(currentDir, e.name);
      if (e.isDirectory()) {
        await scanDir(fullPath);
      } else if (['.js', '.mjs', '.ts', '.tsx', '.json'].includes(path.extname(e.name))) {
        if (fullPath === path.resolve(targetFile)) continue;
        try {
          const content = await fs.readFile(fullPath, 'utf8');
          if (content.includes(targetBase)) {
            // Find specific matching lines
            const lines = content.split(/\r?\n/);
            lines.forEach((l, idx) => {
              if (l.includes(targetBase)) {
                results.push({
                  dependentFile: path.relative(rootDir, fullPath),
                  line: idx + 1,
                  snippet: l.trim()
                });
              }
            });
          }
        } catch (readErr) {
          // Skip binary, unreadable or system locked files during recursive AST scan
        }
      }
    }
  }

  await scanDir(rootDir);
  return { target: targetFile, dependentUsages: results, totalImpactedFiles: new Set(results.map(r => r.dependentFile)).size };
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
    console.log(`\n🔍 Symbols in ${path.basename(target)} (${res.symbols.length} detected across ${res.totalLines} lines):\n`);
    res.symbols.forEach(s => {
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
    console.log(`   Impacted Files: ${res.totalImpactedFiles} | Total References: ${res.dependentUsages.length}\n`);
    res.dependentUsages.forEach(d => {
      console.log(`  • \x1b[33m${d.dependentFile}:${d.line}\x1b[0m -> ${d.snippet}`);
    });
    console.log('');
  }
}

if (process.argv[1] && process.argv[1].endsWith('ast-query.mjs')) {
  main().catch(err => {
    console.error(`\n❌ Error during AST query: ${err.message}`);
    process.exit(1);
  });
}
