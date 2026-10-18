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

/**
 * Tokenizes text into normalized lexical terms with camelCase and snake_case splitting
 * @param {string} text 
 * @returns {string[]}
 */
export function tokenizeCode(text = '') {
  if (!text) return [];
  // Split camelCase: fooBar -> foo Bar
  const decamel = text.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Replace non-alphanumeric with space
  const words = decamel.toLowerCase().split(/[^a-z0-9]+/);
  return words.filter(w => w.length > 1);
}

/**
 * Performs local hybrid GraphRAG search combining BM25 lexical ranking,
 * vector space cosine similarity, and AST graph symbol associations.
 * 
 * @param {string} query 
 * @param {Object} [options]
 * @param {number} [options.topK=5]
 * @param {string} [options.graphFile]
 * @returns {Promise<Object>}
 */
export async function hybridSearch(query, options = {}) {
  const target = String(query || '').trim();
  const topK = Number(options.topK) || 5;

  if (!target) {
    return {
      success: false,
      error: 'Query string is required',
      query: target,
      totalMatches: 0,
      results: []
    };
  }

  const graph = await loadSymbolGraph(options.graphFile);
  const queryTokens = tokenizeCode(target);
  if (queryTokens.length === 0) {
    return {
      success: false,
      error: 'Query contains no searchable tokens',
      query: target,
      totalMatches: 0,
      results: []
    };
  }

  // 1. Flatten all symbols into a search corpus
  const documents = [];
  let docIndex = 0;

  for (const [symName, occurrences] of Object.entries(graph.symbols || {})) {
    for (const occ of occurrences) {
      const docText = `${symName} ${occ.type} ${occ.signature || ''} ${occ.file}`;
      const tokens = tokenizeCode(docText);
      documents.push({
        id: `doc-${docIndex++}`,
        name: symName,
        file: occ.file,
        line: occ.line,
        type: occ.type,
        signature: occ.signature,
        tokens,
        tokenFreqs: new Map()
      });
    }
  }

  const N = documents.length;
  if (N === 0) {
    return {
      success: true,
      query: target,
      totalMatches: 0,
      results: []
    };
  }

  // 2. Precompute BM25 statistics
  let totalLength = 0;
  const docFreq = new Map();

  for (const doc of documents) {
    totalLength += doc.tokens.length;
    const seen = new Set();
    for (const t of doc.tokens) {
      doc.tokenFreqs.set(t, (doc.tokenFreqs.get(t) || 0) + 1);
      if (!seen.has(t)) {
        seen.add(t);
        docFreq.set(t, (docFreq.get(t) || 0) + 1);
      }
    }
  }

  const avgdl = totalLength / N;
  const k1 = 1.2;
  const b = 0.75;

  // Precompute IDF for query terms
  const queryTermIdf = new Map();
  for (const qTerm of queryTokens) {
    const df = docFreq.get(qTerm) || 0;
    const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
    queryTermIdf.set(qTerm, Math.max(0.1, idf));
  }

  // Compute query vector magnitude for cosine similarity
  let queryNormSq = 0;
  for (const qTerm of queryTokens) {
    const idf = queryTermIdf.get(qTerm) || 0.1;
    queryNormSq += idf * idf;
  }
  const queryNorm = Math.sqrt(queryNormSq) || 1;

  // 3. Score every document
  const scoredDocs = [];

  for (const doc of documents) {
    let bm25Score = 0;
    let dotProduct = 0;
    let docNormSq = 0;
    const dl = doc.tokens.length;

    for (const qTerm of queryTokens) {
      const tf = doc.tokenFreqs.get(qTerm) || 0;
      if (tf > 0) {
        const idf = queryTermIdf.get(qTerm);
        const numerator = tf * (k1 + 1);
        const denominator = tf + k1 * (1 - b + b * (dl / avgdl));
        bm25Score += idf * (numerator / denominator);
        dotProduct += (tf * idf) * idf;
      }
    }

    const lowerName = doc.name.toLowerCase();
    const exactNameMatch = lowerName === target.toLowerCase();
    const nameContainsQuery = lowerName.includes(target.toLowerCase());

    if (exactNameMatch) {
      bm25Score *= 2.0;
    } else if (nameContainsQuery) {
      bm25Score *= 1.35;
    }

    for (const [t, tf] of doc.tokenFreqs.entries()) {
      const termIdf = queryTermIdf.get(t) || 0.5;
      const weight = tf * termIdf;
      docNormSq += weight * weight;
    }
    const docNorm = Math.sqrt(docNormSq) || 1;
    const vectorScore = dotProduct / (queryNorm * docNorm);

    if (bm25Score > 0 || vectorScore > 0) {
      scoredDocs.push({
        doc,
        bm25Score,
        vectorScore
      });
    }
  }

  if (scoredDocs.length === 0) {
    return {
      success: true,
      query: target,
      totalMatches: 0,
      results: []
    };
  }

  const maxBm25 = Math.max(...scoredDocs.map(s => s.bm25Score), 1);
  const maxVector = Math.max(...scoredDocs.map(s => s.vectorScore), 1);

  const results = scoredDocs.map(({ doc, bm25Score, vectorScore }) => {
    const normBm25 = bm25Score / maxBm25;
    const normVector = vectorScore / maxVector;
    const hybridScore = Number(((normBm25 * 0.55) + (normVector * 0.45)).toFixed(4));
    const fileStats = graph.files?.[doc.file] || { symbolCount: 1 };

    return {
      name: doc.name,
      file: doc.file,
      line: doc.line,
      type: doc.type,
      signature: doc.signature,
      score: hybridScore,
      bm25Score: Number(normBm25.toFixed(4)),
      vectorScore: Number(normVector.toFixed(4)),
      context: {
        fileSiblingSymbols: fileStats.symbolCount,
        category: doc.file.startsWith('scripts') ? 'core-engine' : doc.file.startsWith('bin') ? 'cli-interface' : 'source-module'
      }
    };
  });

  results.sort((a, b) => b.score - a.score);

  return {
    success: true,
    query: target,
    totalMatches: results.length,
    results: results.slice(0, topK)
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
  } else if (cmd === 'search') {
    const queryWords = args.slice(1).filter(a => !a.startsWith('--'));
    const searchQuery = queryWords.join(' ');
    if (!searchQuery) {
      console.error('❌ Error: Search query is required (e.g. node scripts/graphrag-indexer.mjs search "payment checkout")');
      process.exit(1);
    }
    const topKIdx = args.indexOf('--top-k');
    const topK = topKIdx !== -1 ? parseInt(args[topKIdx + 1], 10) : 5;

    hybridSearch(searchQuery, { topK }).then(result => {
      console.log(`\n🔎 Hybrid GraphRAG Search: "${searchQuery}" (Matches: ${result.totalMatches})`);
      if (result.results.length === 0) {
        console.log('❌ No matching symbols or files found in graph.');
      } else {
        console.log(`Top ${result.results.length} ranked matches:\n`);
        for (const r of result.results) {
          console.log(`  • [Score: ${r.score.toFixed(4)}] ${r.name} (${r.type})`);
          console.log(`    File: ${r.file}:${r.line} (BM25: ${r.bm25Score.toFixed(4)}, Vector: ${r.vectorScore.toFixed(4)})`);
          if (r.signature) console.log(`    Sig : ${r.signature}`);
        }
        console.log('');
      }
    }).catch(err => {
      console.error(`❌ Search error: ${err.message}`);
      process.exit(1);
    });
  } else {
    console.log(`Usage:\n  node scripts/graphrag-indexer.mjs build [rootDir]\n  node scripts/graphrag-indexer.mjs query <symbolName>\n  node scripts/graphrag-indexer.mjs search <query> [--top-k 5]`);
  }
}
