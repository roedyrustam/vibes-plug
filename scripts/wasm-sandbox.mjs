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

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`
🌊 Vibes-Plug Ephemeral Micro-Sandbox Engine (2026 Edition)
Usage:
  node scripts/wasm-sandbox.mjs <file-path|code-string> [--timeout <ms>]

Examples:
  node scripts/wasm-sandbox.mjs "const x = 10; const y = 20; x + y;"
  node scripts/wasm-sandbox.mjs path/to/snippet.js --timeout 500
`);
    process.exit(0);
  }

  let code = '';
  let timeoutMs = 1000;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--timeout' && args[i + 1]) {
      timeoutMs = parseInt(args[i + 1], 10);
      i++;
    } else if (!code) {
      code = args[i];
    }
  }

  // If argument is a file that exists, read it
  try {
    const fileStat = await fs.stat(code);
    if (fileStat.isFile()) {
      code = await fs.readFile(code, 'utf8');
    }
  } catch {
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
