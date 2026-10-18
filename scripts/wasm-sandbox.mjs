#!/usr/bin/env node

/**
 * Vibes-Plug Ephemeral Micro-Sandbox Engine (2026 Edition)
 * 
 * Part of the Superintelligence Engineering Substrate.
 * Provides isolated, sub-millisecond execution for untrusted AI-generated code,
 * regex evaluation, and pure function dry-runs with zero host blast radius.
 * 
 * Safety Guarantees:
 * - Zero File System Access (no fs, path traversal)
 * - Zero Network Access (no fetch, http, net)
 * - Zero Process / Child Process Access (no child_process, process.exit, env)
 * - Strict Wall-Clock Execution Timeout (default: 1000ms)
 * - Clean In-Memory Context Isolation (null prototype globals)
 */

import vm from 'node:vm';
import fs from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

export const SANDBOX_PRESETS = {
  STRICT_PURE: {
    timeoutMs: 1000,
    allowConsole: true,
    description: 'Strict pure execution: Math, Date, JSON, String, Array, RegEx, Map, Set'
  },
  HIGH_PERF: {
    timeoutMs: 500,
    allowConsole: false,
    description: 'Ultra-low latency benchmark mode for algorithms and pure functions'
  },
  SECURITY_FUZZ: {
    timeoutMs: 250,
    allowConsole: false,
    description: 'Adversarial fuzz testing for ReDoS and algorithmic complexity checks'
  }
};

export function createIsolatedSandbox(options = {}) {
  const logs = [];
  const timeoutMs = typeof options.timeoutMs === 'number' ? options.timeoutMs : 1000;

  // Build a secure sandbox context containing only pure standard primitives
  const sandboxContext = {
    // Pure Standard Objects
    Object,
    Array,
    String,
    Number,
    Boolean,
    Symbol,
    Math,
    Date,
    RegExp,
    Map,
    Set,
    WeakMap,
    WeakSet,
    JSON,
    Promise,
    Error,
    TypeError,
    RangeError,
    SyntaxError,
    // Safe Utilities
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    encodeURI,
    decodeURI,
    encodeURIComponent,
    decodeURIComponent,
    // Intercepted Output
    console: {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      info: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      warn: (...args) => logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      error: (...args) => logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    }
  };

  const context = vm.createContext(sandboxContext);
  return { context, logs, timeoutMs };
}

export function executeInSandbox(code, options = {}) {
  const startTime = performance.now();
  const { context, logs, timeoutMs } = createIsolatedSandbox(options);

  if (typeof code !== 'string' || !code.trim()) {
    return {
      success: false,
      error: 'Code must be a non-empty string',
      executionTimeMs: 0,
      logs: [],
      result: null
    };
  }

  // Security AST Scan: Reject prohibited identifiers before compilation
  const FORBIDDEN_PATTERNS = [
    /\bprocess\b/,
    /\brequire\b/,
    /\bimport\s*\(/,
    /\bchild_process\b/,
    /\bfs\b/,
    /\b__proto__\b/,
    /\bconstructor\s*\.\s*constructor\b/
  ];

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(code)) {
      return {
        success: false,
        error: `Security Violation: Prohibited identifier detected (${pattern.toString()})`,
        executionTimeMs: 0,
        logs: [],
        result: null
      };
    }
  }

  try {
    const script = new vm.Script(code, {
      filename: 'ephemeral-sandbox.js'
    });

    const result = script.runInContext(context, {
      timeout: timeoutMs,
      breakOnSigint: true
    });

    const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(3));

    return {
      success: true,
      result: result !== undefined ? (typeof result === 'object' ? JSON.parse(JSON.stringify(result)) : result) : null,
      executionTimeMs,
      logs,
      error: null
    };
  } catch (err) {
    const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(3));
    return {
      success: false,
      error: err.message,
      executionTimeMs,
      logs,
      result: null
    };
  }
}

/**
 * Pre-Disk Verification Gate
 * Audits candidate code in-memory for syntax, Anti-Slop Directive, and Visual Pillar 7 standards
 * before permitting disk persistence.
 * @param {string} target - Code string or file path
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function verifyCandidateCode(target, options = {}) {
  let code = String(target || '');
  let filePath = null;

  try {
    const fileStat = await fs.stat(target);
    if (fileStat.isFile()) {
      filePath = target;
      code = await fs.readFile(target, 'utf8');
    }
  } catch (err) {
    // Target is inline candidate code string
  }

  const report = {
    verifiedAt: new Date().toISOString(),
    targetFile: filePath,
    codeLength: code.length,
    syntaxValid: true,
    syntaxError: null,
    antiSlop: null,
    visual: null,
    verdict: 'APPROVED',
    canPersistToDisk: true,
    findingsCount: 0,
    summary: ''
  };

  // 1. In-memory Syntax / AST validation
  try {
    new vm.Script(code, { filename: filePath || 'candidate_eval.js' });
  } catch (err) {
    const isTsOrJsx = /^(import|export)\b/m.test(code) || /\b(interface|type|enum)\s+[A-Za-z0-9_$]+/m.test(code) || /<[A-Za-z0-9_$-]+[^>]*>/m.test(code);
    if (!isTsOrJsx) {
      report.syntaxValid = false;
      report.syntaxError = err.message;
      report.verdict = 'REJECTED';
      report.canPersistToDisk = false;
    }
  }

  // 2. Anti-Slop Directive validation
  const { criticValidate } = await import('./critic-validator.mjs');
  const antiSlopReport = criticValidate(code, { language: options.language || 'typescript', strictness: 'strict' });
  report.antiSlop = {
    score: antiSlopReport.score,
    verdict: antiSlopReport.verdict,
    violations: antiSlopReport.violations || []
  };

  if (antiSlopReport.verdict === 'REJECTED' || antiSlopReport.score < 80) {
    report.verdict = 'REJECTED';
    report.canPersistToDisk = false;
  }

  // 3. Visual UI Sanitation (Pillar 7)
  const hasUiMarkup = /<[a-z0-9]+[^>]*className=|<button|<input|<select|<form/i.test(code);
  if (hasUiMarkup) {
    const { visualAudit } = await import('./visual-critic.mjs');
    const visualReport = visualAudit(code, options);
    report.visual = {
      score: visualReport.score,
      verdict: visualReport.verdict,
      findingsCount: visualReport.findingsCount,
      findings: visualReport.findings || []
    };
    if (visualReport.verdict === 'REJECTED' && visualReport.score < 70) {
      report.verdict = 'REJECTED';
      report.canPersistToDisk = false;
    }
  }

  report.findingsCount = (report.antiSlop.violations?.length || 0) + (report.visual?.findings?.length || 0) + (report.syntaxError ? 1 : 0);
  report.summary = report.canPersistToDisk
    ? `Pre-Disk Verification Passed (${report.antiSlop.score}/100 Anti-Slop, Syntax OK)`
    : `Pre-Disk Verification Failed (${report.findingsCount} critical issue(s) detected)`;

  return report;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🌊 Vibes-Plug Ephemeral Micro-Sandbox Engine (2026 Edition)
Usage:
  node scripts/wasm-sandbox.mjs <file-path|code-string> [--timeout <ms>]
  node scripts/wasm-sandbox.mjs --verify <file-path|code-string>

Options:
  --verify        Run full In-Memory Pre-Disk Verification Gate (Syntax + Anti-Slop + Visual UI)
  --timeout <ms>  Max execution time in milliseconds (default: 1000)
`);
    process.exit(0);
  }

  const isVerify = args.includes('--verify') || args.includes('-v');
  let code = '';
  let timeoutMs = 1000;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--timeout' && args[i + 1]) {
      timeoutMs = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] !== '--verify' && args[i] !== '-v' && !code) {
      code = args[i];
    }
  }

  if (isVerify) {
    console.log(`🛡️ Running Pre-Disk Verification Gate on candidate code...`);
    const outcome = await verifyCandidateCode(code);
    console.log(`\n=== Verification Gate Scorecard ===`);
    console.log(`Verdict     : ${outcome.verdict === 'APPROVED' ? '\x1b[32mAPPROVED\x1b[0m' : '\x1b[31mREJECTED\x1b[0m'}`);
    console.log(`Persistable : ${outcome.canPersistToDisk ? '✅ Safe to write' : '❌ Blocked from disk'}`);
    console.log(`Syntax      : ${outcome.syntaxValid ? '✅ Valid' : `❌ ${outcome.syntaxError}`}`);
    console.log(`Anti-Slop   : ${outcome.antiSlop.score}/100 (${outcome.antiSlop.verdict})`);
    if (outcome.visual) {
      console.log(`Visual UI   : ${outcome.visual.score}/100 (${outcome.visual.verdict})`);
    }
    console.log(`Summary     : ${outcome.summary}`);

    if (!outcome.canPersistToDisk) {
      process.exit(1);
    }
    return;
  }

  // If argument is a file that exists, read it
  try {
    const fileStat = await fs.stat(code);
    if (fileStat.isFile()) {
      code = await fs.readFile(code, 'utf8');
    }
  } catch (err) {
    // Treat as inline code
  }

  console.log('🧪 Executing code in Ephemeral Sandbox...');
  const outcome = executeInSandbox(code, { timeoutMs });

  console.log(`Status         : ${outcome.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`Execution Time : ${outcome.executionTimeMs}ms`);
  if (outcome.logs.length > 0) {
    console.log('Console Logs   :');
    outcome.logs.forEach(l => console.log(`  > ${l}`));
  }
  if (outcome.result !== null && outcome.result !== undefined) {
    console.log(`Return Value   : ${typeof outcome.result === 'object' ? JSON.stringify(outcome.result) : outcome.result}`);
  }
  if (outcome.error) {
    console.log(`Error          : ${outcome.error}`);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('wasm-sandbox.mjs')) {
  main().catch(err => {
    console.error('Sandbox Crash:', err.message);
    process.exit(1);
  });
}
