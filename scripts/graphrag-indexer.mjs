#!/usr/bin/env node

/**
 * Vibes-Plug Codebase AST Symbol Knowledge Graph Indexer (2026 Edition)
 * 
 * Part of Pillar 1: Living Codebase AST Graph & High-Performance Surgical Context Slicing.
 * Recursively scans project source code, indexes exported functions, classes, interfaces,
 * and types into .agents/graph/symbol_graph.json, and enables sub-millisecond symbol queries
 * without flooding LLM context windows.
 * 
 * Usage:
 *   node scripts/graphrag-indexer.mjs build [rootDir]
 *   node scripts/graphrag-indexer.mjs query <symbolName>
 *   vibes graph:build [rootDir]
 *   vibes graph:query <symbolName>
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSymbols } from './ast-query.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

const DEFAULT_GRAPH_DIR = path.resolve(process.cwd(), '.agents', 'graph');
const DEFAULT_GRAPH_FILE = path.join(DEFAULT_GRAPH_DIR, 'symbol_graph.json');

const SOURCE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.go']);
const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'out',
  '.agents',
  '.claude',
  '.cursor',
  'coverage',
  '.turbo'
]);

/**
 * Recursively collects source files from a directory
 * @param {string} dir 
 * @param {string[]} fileList 
 * @returns {Promise<string[]>}
 */
export async function collectSourceFiles(dir, fileList = []) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) {
          await collectSourceFiles(fullPath, fileList);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (SOURCE_EXTENSIONS.has(ext)) {
          fileList.push(fullPath);
        }
      }
    }
  } catch {
    // Ignore unreadable dirs
  }
  return fileList;
}

/**
 * Builds the AST symbol knowledge graph across a project codebase
 * @param {string} rootDir 
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function buildSymbolGraph(rootDir = process.cwd(), options = {}) {
  const targetDir = path.resolve(rootDir);
  const graphFile = options.outputFile || DEFAULT_GRAPH_FILE;
  const files = await collectSourceFiles(targetDir);

  const graph = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    rootDir: targetDir,
    totalFilesIndexed: files.length,
    totalSymbolsIndexed: 0,
    symbols: {},
    files: {}
  };

  for (const filePath of files) {
    try {
      const parsed = await parseSymbols(filePath);
      const relativePath = path.relative(targetDir, filePath).replace(/\\/g, '/');

      graph.files[relativePath] = {
        totalLines: parsed.totalLines,
        symbolCount: parsed.symbols.length
      };

      for (const sym of parsed.symbols) {
        if (!graph.symbols[sym.name]) {
          graph.symbols[sym.name] = [];
        }
        graph.symbols[sym.name].push({
          file: relativePath,
          line: sym.line,
          type: sym.type,
          signature: sym.signature
        });
        graph.totalSymbolsIndexed++;
      }
    } catch {
      // Skip unparseable files
    }
  }

  // Persist graph to disk
  await fs.mkdir(path.dirname(graphFile), { recursive: true });
  await fs.writeFile(graphFile, JSON.stringify(graph, null, 2), 'utf8');

  return graph;
}

/**
 * Loads persisted symbol graph or builds fresh one if missing
 * @param {string} [graphFile]
 * @returns {Promise<Object>}
 */
export async function loadSymbolGraph(graphFile = DEFAULT_GRAPH_FILE) {
  try {
    const raw = await fs.readFile(graphFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    return buildSymbolGraph(process.cwd(), { outputFile: graphFile });
  }
}

/**
 * Queries the AST symbol graph for a specific symbol or pattern
 * @param {string} symbolName 
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function querySymbolGraph(symbolName, options = {}) {
  const graph = await loadSymbolGraph(options.graphFile);
  const target = String(symbolName || '').trim();

  if (!target) {
    return {
      success: false,
      error: 'Symbol name is required',
      query: target,
      matches: []
    };
  }

  // Exact match first
  if (graph.symbols[target]) {
    return {
      success: true,
      query: target,
      matchType: 'exact',
      count: graph.symbols[target].length,
      matches: graph.symbols[target]
    };
  }

  // Case-insensitive or partial match
  const lower = target.toLowerCase();
  const partialMatches = [];
  for (const [name, occurrences] of Object.entries(graph.symbols)) {
    if (name.toLowerCase().includes(lower)) {
      for (const occ of occurrences) {
        partialMatches.push({ name, ...occ });
      }
    }
  }

  return {
    success: true,
    query: target,
    matchType: 'partial',
    count: partialMatches.length,
    matches: partialMatches
  };
}

// CLI Execution Router
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'build';

  if (cmd === 'build') {
    const targetDir = args[1] || process.cwd();
    console.log(`\n🔍 Building Codebase AST Symbol Knowledge Graph for: ${targetDir}...`);
    const start = performance.now();
    buildSymbolGraph(targetDir).then(graph => {
      const elapsed = Math.round(performance.now() - start);
      console.log(`✅ Symbol Knowledge Graph built in ${elapsed}ms`);
      console.log(`📁 Files Indexed   : ${graph.totalFilesIndexed}`);
      console.log(`🏷️  Symbols Indexed : ${graph.totalSymbolsIndexed}`);
      console.log(`💾 Saved to        : .agents/graph/symbol_graph.json\n`);
    }).catch(err => {
      console.error(`❌ Build failed: ${err.message}`);
      process.exit(1);
    });
  } else if (cmd === 'query') {
    const symName = args[1];
    if (!symName) {
      console.error('❌ Error: Symbol name is required (e.g. node scripts/graphrag-indexer.mjs query startStudioServer)');
      process.exit(1);
    }
    querySymbolGraph(symName).then(result => {
      console.log(`\n🔎 Query: "${symName}" (Match: ${result.matchType.toUpperCase()})`);
      if (result.matches.length === 0) {
        console.log('❌ No symbol matches found in project knowledge graph.');
      } else {
        console.log(`Found ${result.count} occurrences:\n`);
        for (const m of result.matches) {
          const symLabel = m.name ? `${m.name} (${m.type})` : m.type;
          console.log(`  • [${symLabel}] in ${m.file}:${m.line}`);
          if (m.signature) console.log(`    ${m.signature}`);
        }
        console.log('');
      }
    }).catch(err => {
      console.error(`❌ Query error: ${err.message}`);
      process.exit(1);
    });
  } else {
    console.log(`Usage:\n  node scripts/graphrag-indexer.mjs build [rootDir]\n  node scripts/graphrag-indexer.mjs query <symbolName>`);
  }
}
