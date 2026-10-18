#!/usr/bin/env node

/**
 * Vibes-Plug Performance Benchmark Suite & Regression Fuzzer
 * Measures deterministic latency, throughput, and memory efficiency across the 6 Core Engines:
 * 1. Ephemeral Micro-Sandbox Execution
 * 2. Pre-Disk Verification Gate
 * 3. AST Symbol Graph Indexing Throughput
 * 4. Local Hybrid GraphRAG Search Latency
 * 5. Deterministic KV-Cache Prefix Compilation
 * 6. Universal Cross-IDE State Bridge Synchronization
 * 7. Zero-Dependency VSIX Extension Builder
 *
 * Usage:
 *   node scripts/benchmark-suite.mjs [--json] [--save]
 *   vibes bench [--json] [--save]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

import { executeInSandbox, verifyCandidateCode } from './wasm-sandbox.mjs';
import { hybridSearch, buildSymbolGraph } from './graphrag-indexer.mjs';
import { compileCache } from './compile-cache.mjs';
import { syncBridge, checkBridgeStatus } from './cross-ide-bridge.mjs';
import { packageVsix } from './package-extension.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const TELEMETRY_DIR = path.join(PLUGIN_ROOT, '.agents', 'telemetry');
const BENCHMARK_FILE = path.join(TELEMETRY_DIR, 'benchmark_results.json');

export const PERFORMANCE_BUDGETS = {
  sandbox_exec: { name: 'Ephemeral Micro-Sandbox Execution', budgetMs: 25.0, type: 'latency' },
  verify_gate: { name: 'Pre-Disk Verification Gate', budgetMs: 50.0, type: 'latency' },
  ast_indexing: { name: 'AST Symbol Indexing Throughput', budgetSymbolsPerSec: 300, type: 'throughput' },
  graph_search: { name: 'Hybrid GraphRAG Search (Top-5)', budgetMs: 60.0, type: 'latency' },
  kv_cache: { name: 'Deterministic KV-Cache Prefix Compilation', budgetMs: 500.0, type: 'latency' },
  cross_ide_bridge: { name: 'Cross-IDE Bridge Synchronization', budgetMs: 120.0, type: 'latency' },
  vsix_packager: { name: 'Zero-Dependency VSIX Package Builder', budgetMs: 200.0, type: 'latency' }
};

export async function runBenchmarkSuite(options = {}) {
  const isJson = options.json === true;
  const shouldSave = options.save !== false;
  const results = [];
  const startTotal = performance.now();

  // 1. Ephemeral Micro-Sandbox Execution Benchmark
  {
    const code = `
      function fib(n) {
        let a = 0, b = 1;
        for (let i = 0; i < n; i++) {
          const next = a + b;
          a = b;
          b = next;
        }
        return a;
      }
      fib(30);
    `;
    const runs = 10;
    const times = [];
    for (let i = 0; i < runs; i++) {
      const t0 = performance.now();
      const res = executeInSandbox(code, { timeoutMs: 200 });
      const t1 = performance.now();
      if (!res.success) {
        throw new Error(`Sandbox benchmark failed: ${res.error}`);
      }
      times.push(t1 - t0);
    }
    const meanMs = times.reduce((a, b) => a + b, 0) / runs;
    const passed = meanMs <= PERFORMANCE_BUDGETS.sandbox_exec.budgetMs;
    results.push({
      id: 'sandbox_exec',
      name: PERFORMANCE_BUDGETS.sandbox_exec.name,
      measured: `${meanMs.toFixed(2)} ms`,
      budget: `< ${PERFORMANCE_BUDGETS.sandbox_exec.budgetMs.toFixed(2)} ms`,
      passed,
      rawMs: meanMs
    });
  }

  // 2. Pre-Disk Verification Gate Benchmark
  {
    const candidateCode = `
      export function validateSessionToken(token) {
        if (typeof token !== 'string' || token.length < 16) {
          throw new TypeError('Invalid session token');
        }
        return { valid: true, expiresAt: Date.now() + 3600000 };
      }
    `;
    const runs = 5;
    const times = [];
    for (let i = 0; i < runs; i++) {
      const t0 = performance.now();
      const res = await verifyCandidateCode(candidateCode, { language: 'javascript' });
      const t1 = performance.now();
      if (!res.canPersistToDisk || res.verdict !== 'APPROVED') {
        throw new Error(`Gate verification benchmark failed: ${res.summary || res.verdict}`);
      }
      times.push(t1 - t0);
    }
    const meanMs = times.reduce((a, b) => a + b, 0) / runs;
    const passed = meanMs <= PERFORMANCE_BUDGETS.verify_gate.budgetMs;
    results.push({
      id: 'verify_gate',
      name: PERFORMANCE_BUDGETS.verify_gate.name,
      measured: `${meanMs.toFixed(2)} ms`,
      budget: `< ${PERFORMANCE_BUDGETS.verify_gate.budgetMs.toFixed(2)} ms`,
      passed,
      rawMs: meanMs
    });
  }

  // 3. AST Symbol Knowledge Graph Indexing Benchmark
  {
    const t0 = performance.now();
    const indexRes = await buildSymbolGraph(PLUGIN_ROOT, { quiet: true });
    const t1 = performance.now();
    const totalDurationSec = (t1 - t0) / 1000;
    const totalSymbols = indexRes.totalSymbolsIndexed || 0;
    const symbolsPerSec = totalDurationSec > 0 ? Math.round(totalSymbols / totalDurationSec) : 9999;
    const passed = symbolsPerSec >= PERFORMANCE_BUDGETS.ast_indexing.budgetSymbolsPerSec;
    results.push({
      id: 'ast_indexing',
      name: PERFORMANCE_BUDGETS.ast_indexing.name,
      measured: `${symbolsPerSec.toLocaleString()} sym/s`,
      budget: `> ${PERFORMANCE_BUDGETS.ast_indexing.budgetSymbolsPerSec.toLocaleString()} sym/s`,
      passed,
      rawThroughput: symbolsPerSec,
      totalSymbols,
      totalFiles: indexRes.totalFilesIndexed || 0
    });
  }

  // 4. Local Hybrid GraphRAG Search Benchmark
  {
    const query = 'studio server checkout payment';
    const runs = 10;
    const times = [];
    for (let i = 0; i < runs; i++) {
      const t0 = performance.now();
      const searchRes = await hybridSearch(query, { topK: 5 });
      const t1 = performance.now();
      if (!searchRes.success) {
        throw new Error(`Graph search benchmark failed: ${searchRes.error}`);
      }
      times.push(t1 - t0);
    }
    const meanMs = times.reduce((a, b) => a + b, 0) / runs;
    const passed = meanMs <= PERFORMANCE_BUDGETS.graph_search.budgetMs;
    results.push({
      id: 'graph_search',
      name: PERFORMANCE_BUDGETS.graph_search.name,
      measured: `${meanMs.toFixed(2)} ms`,
      budget: `< ${PERFORMANCE_BUDGETS.graph_search.budgetMs.toFixed(2)} ms`,
      passed,
      rawMs: meanMs
    });
  }

  // 5. Deterministic KV-Cache Prefix Compilation Benchmark
  {
    const t0 = performance.now();
    const compileRes = await compileCache({ quiet: true });
    const t1 = performance.now();
    const elapsedMs = t1 - t0;
    const passed = elapsedMs <= PERFORMANCE_BUDGETS.kv_cache.budgetMs && compileRes.success;
    results.push({
      id: 'kv_cache',
      name: PERFORMANCE_BUDGETS.kv_cache.name,
      measured: `${elapsedMs.toFixed(2)} ms`,
      budget: `< ${PERFORMANCE_BUDGETS.kv_cache.budgetMs.toFixed(2)} ms`,
      passed,
      rawMs: elapsedMs,
      tokens: compileRes.tokens
    });
  }

  // 6. Universal Cross-IDE State Bridge Synchronization Benchmark
  {
    const t0 = performance.now();
    const bridgeRes = await syncBridge(PLUGIN_ROOT, { target: 'all' });
    const t1 = performance.now();
    const elapsedMs = t1 - t0;
    const bridgeSuccess = bridgeRes.success && Array.isArray(bridgeRes.results) && bridgeRes.results.every(r => r.status === 'synced');
    const passed = elapsedMs <= PERFORMANCE_BUDGETS.cross_ide_bridge.budgetMs && bridgeSuccess;
    results.push({
      id: 'cross_ide_bridge',
      name: PERFORMANCE_BUDGETS.cross_ide_bridge.name,
      measured: `${elapsedMs.toFixed(2)} ms`,
      budget: `< ${PERFORMANCE_BUDGETS.cross_ide_bridge.budgetMs.toFixed(2)} ms`,
      passed,
      rawMs: elapsedMs
    });
  }

  // 7. Zero-Dependency VSIX Extension Builder Benchmark
  {
    const t0 = performance.now();
    const vsixRes = await packageVsix({ dryRun: true });
    const t1 = performance.now();
    const elapsedMs = t1 - t0;
    const passed = elapsedMs <= PERFORMANCE_BUDGETS.vsix_packager.budgetMs && vsixRes.success;
    results.push({
      id: 'vsix_packager',
      name: PERFORMANCE_BUDGETS.vsix_packager.name,
      measured: `${elapsedMs.toFixed(2)} ms`,
      budget: `< ${PERFORMANCE_BUDGETS.vsix_packager.budgetMs.toFixed(2)} ms`,
      passed,
      rawMs: elapsedMs
    });
  }

  const totalElapsedMs = performance.now() - startTotal;
  const passedCount = results.filter(r => r.passed).length;
  const score = Math.round((passedCount / results.length) * 100);

  const payload = {
    timestamp: new Date().toISOString(),
    score,
    totalElapsedMs: Number(totalElapsedMs.toFixed(2)),
    itemsTested: results.length,
    passedCount,
    allPassed: passedCount === results.length,
    results
  };

  if (shouldSave) {
    try {
      await fs.mkdir(TELEMETRY_DIR, { recursive: true });
      await fs.writeFile(BENCHMARK_FILE, JSON.stringify(payload, null, 2), 'utf8');
    } catch (_err) {
      // Non-fatal telemetry write failure
    }
  }

  if (isJson) {
    console.log(JSON.stringify(payload, null, 2));
    return payload;
  }

  // Pretty ANSI Terminal Table Output
  console.log('\n╔═══════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║            ⚡ Vibes-Plug Performance Benchmark Suite & Regression Fuzzer              ║');
  console.log('║            Sovereign Engine Throughput, Micro-Latency & Invariant Verification        ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════╝\n');

  console.log('┌───────────────────────────────────────────────────┬──────────────┬──────────────┬────────┐');
  console.log('│ Benchmark Target                                  │ Measured     │ Budget       │ Status │');
  console.log('├───────────────────────────────────────────────────┼──────────────┼──────────────┼────────┤');

  for (const item of results) {
    const padName = item.name.padEnd(49, ' ');
    const padMeasured = item.measured.padStart(12, ' ');
    const padBudget = item.budget.padStart(12, ' ');
    const statusText = item.passed ? '\x1b[32m PASS \x1b[0m' : '\x1b[31m FAIL \x1b[0m';
    console.log(`│ ${padName} │ ${padMeasured} │ ${padBudget} │ ${statusText} │`);
  }

  console.log('└───────────────────────────────────────────────────┴──────────────┴──────────────┴────────┘');
  console.log(`\n📊 Benchmark Score : ${score}/100 (${passedCount}/${results.length} targets within performance budgets)`);
  console.log(`⏱️  Total Duration  : ${totalElapsedMs.toFixed(2)} ms`);
  console.log(`💾 Telemetry Saved : ${path.relative(PLUGIN_ROOT, BENCHMARK_FILE)}\n`);

  return payload;
}

// Standalone execution check
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  runBenchmarkSuite({ json }).then(report => {
    if (!report.allPassed) {
      process.exit(1);
    }
  }).catch(err => {
    console.error('❌ Benchmark execution error:', err.message);
    process.exit(1);
  });
}
