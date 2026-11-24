#!/usr/bin/env node

/**
 * Vibes-Plug Cross-Platform Sovereign Guard Orchestrator (scripts/run-guard.mjs)
 *
 * Eliminates shell-chaining (`&&`) friction across Windows PowerShell, CMD, and POSIX shells,
 * synchronizes deterministic artifacts first, and executes independent verification gates
 * concurrently with millisecond telemetry.
 *
 * Usage:
 *   node scripts/run-guard.mjs [--fast] [--json]
 *   vibes guard [--fast] [--json]
 */

import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { compileCache } from './compile-cache.mjs';
import { compileSkillSlices } from './compile-skill-slices.mjs';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

async function runNodeGate(id, scriptRelPath, args = []) {
  const start = performance.now();
  try {
    await execFileAsync(process.execPath, [path.join(PLUGIN_ROOT, scriptRelPath), ...args], {
      cwd: PLUGIN_ROOT,
      maxBuffer: 25 * 1024 * 1024
    });
    return {
      id,
      passed: true,
      durationMs: Math.round(performance.now() - start)
    };
  } catch (err) {
    return {
      id,
      passed: false,
      durationMs: Math.round(performance.now() - start),
      error: (err.stderr || err.stdout || err.message || 'Gate failed').toString().trim().slice(0, 600)
    };
  }
}

export async function runGuard(options = {}) {
  const fast = options.fast === true;
  const startTotal = performance.now();
  const stages = [];

  // Stage 1: Deterministic Artifact Synchronization (In-Process)
  const syncStart = performance.now();
  await compileCache({ quiet: true });
  await compileSkillSlices();
  stages.push({
    id: 'artifact-sync (cache-prefix + skill-slices)',
    passed: true,
    durationMs: Math.round(performance.now() - syncStart)
  });

  // Stage 2: Parallel Static, Supply-Chain & Invariant Gates
  const parallelGates = [
    ['audit-graph', 'scripts/audit-graph.mjs', []],
    ['validate-skills', 'scripts/validate-skills.mjs', []],
    ['verify-snippets', 'scripts/verify-skill-snippets.mjs', []],
    ['anti-slop-strict', 'scripts/check-anti-slop.js', ['--strict']],
    ['audit-tarball', 'scripts/audit-tarball.mjs', ['--json']],
    ['eval-skills', 'scripts/eval-skills.mjs', ['--json']],
    ['eval-migration', 'scripts/eval-migration.mjs', []],
    ['verify-invariants', 'scripts/verify-invariants.mjs', []]
  ];

  const parallelResults = await Promise.all(
    parallelGates.map(([id, script, gateArgs]) => runNodeGate(id, script, gateArgs))
  );
  stages.push(...parallelResults);

  // Stage 3: Full CLI Integration Test Suite (unless --fast)
  if (!fast) {
    const cliTestStart = performance.now();
    try {
      await execFileAsync(process.execPath, ['--test', path.join(PLUGIN_ROOT, 'scripts/test-cli.mjs')], {
        cwd: PLUGIN_ROOT,
        maxBuffer: 50 * 1024 * 1024
      });
      stages.push({
        id: 'test-cli-suite',
        passed: true,
        durationMs: Math.round(performance.now() - cliTestStart)
      });
    } catch (err) {
      stages.push({
        id: 'test-cli-suite',
        passed: false,
        durationMs: Math.round(performance.now() - cliTestStart),
        error: (err.stderr || err.stdout || err.message || 'CLI test suite failed').toString().trim().slice(-600)
      });
    }
  }

  const failedStages = stages.filter(s => !s.passed);
  return {
    passed: failedStages.length === 0,
    mode: fast ? 'fast' : 'full',
    totalDurationMs: Math.round(performance.now() - startTotal),
    passedCount: stages.length - failedStages.length,
    totalGates: stages.length,
    stages
  };
}

async function main() {
  const args = process.argv.slice(2);
  const fast = args.includes('--fast');
  const isJson = args.includes('--json');

  const report = await runGuard({ fast });

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`\n🛡️  Vibes-Plug Sovereign Guard (${report.mode.toUpperCase()} MODE)`);
    console.log('------------------------------------------------------------');
    for (const s of report.stages) {
      const icon = s.passed ? '✅' : '❌';
      console.log(`  ${icon} ${s.id.padEnd(42)} ${String(s.durationMs).padStart(5)} ms`);
      if (!s.passed && s.error) {
        console.error(`     ↳ ${s.error.split(/\r?\n/)[0]}`);
      }
    }
    console.log('------------------------------------------------------------');
    console.log(`Result: ${report.passedCount}/${report.totalGates} gates passed in ${(report.totalDurationMs / 1000).toFixed(2)}s\n`);
  }

  if (!report.passed) {
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch(err => {
    console.error(`❌ Sovereign Guard fatal error: ${err.message}`);
    process.exit(1);
  });
}
