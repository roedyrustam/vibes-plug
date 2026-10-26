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
import { types } from 'node:util';
import nodeModule from 'node:module';

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

// Host objects must never cross into the sandbox realm: any host function exposes the host
// Function constructor via .constructor, which compiles code with full process access.
// The sandbox global is therefore null-prototype, console is defined inside the context,
// and only primitives (strings/numbers) are ever read back out.
const CONSOLE_BOOTSTRAP = `
(() => {
  const logs = [];
  const fmt = (args) => args.map((a) => {
    if (typeof a === 'string') return a;
    try { return typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a); }
    catch { return '[unserializable]'; }
  }).join(' ');
  Object.defineProperty(globalThis, '__vibesLogs', { value: logs, enumerable: false });
  globalThis.console = Object.freeze({
    log: (...a) => { logs.push(fmt(a)); },
    info: (...a) => { logs.push(fmt(a)); },
    warn: (...a) => { logs.push('[WARN] ' + fmt(a)); },
    error: (...a) => { logs.push('[ERROR] ' + fmt(a)); }
  });
})();
`;

const READ_LOGS = 'JSON.stringify(globalThis.__vibesLogs)';
const READ_RESULT = '(() => { try { const s = JSON.stringify(globalThis.__vibesResult); return s === undefined ? "null" : s; } catch (e) { return JSON.stringify("[unserializable: " + (e && e.message) + "]"); } })()';

export function createIsolatedSandbox(options = {}) {
  const timeoutMs = typeof options.timeoutMs === 'number' ? options.timeoutMs : 1000;
  const context = vm.createContext(Object.create(null), {
    name: 'vibes-ephemeral-sandbox',
    codeGeneration: { strings: false, wasm: Boolean(options.allowWasm) },
    microtaskMode: 'afterEvaluate'
  });
  vm.runInContext(CONSOLE_BOOTSTRAP, context, { timeout: timeoutMs });

  const readLogs = () => {
    try {
      const raw = vm.runInContext(READ_LOGS, context, { timeout: 50 });
      return typeof raw === 'string' ? JSON.parse(raw) : [];
    } catch (err) {
      return [`[sandbox] log extraction failed: ${err.message}`];
    }
  };

  return { context, timeoutMs, readLogs };
}

/**
 * Extracts a message from a value thrown inside the sandbox without invoking any
 * sandbox-defined getter, toString, or Proxy trap (which could hang the host).
 */
function safeErrorMessage(err) {
  if (err === null || (typeof err !== 'object' && typeof err !== 'function')) {
    return `Sandbox threw a non-Error value: ${String(err)}`;
  }
  if (types.isProxy(err)) return 'Sandbox threw a Proxy object';
  const desc = Object.getOwnPropertyDescriptor(err, 'message');
  if (desc && typeof desc.value === 'string') return desc.value;
  return 'Sandbox threw an object without a string message';
}

/**
 * Strips TypeScript syntax using Node's native type stripper (Node >= 22.13).
 * Enums and namespaces are transformed rather than rejected.
 */
export function stripTypeScript(code) {
  if (typeof nodeModule.stripTypeScriptTypes !== 'function') {
    throw new Error(`TypeScript execution requires Node.js >= 22.13 (current: ${process.version})`);
  }
  const previous = process.emitWarning;
  process.emitWarning = (warning, ...rest) => {
    const text = typeof warning === 'string' ? warning : warning?.message;
    if (text && text.includes('stripTypeScriptTypes')) return;
    return previous.call(process, warning, ...rest);
  };
  try {
    return nodeModule.stripTypeScriptTypes(code, { mode: 'transform' });
  } finally {
    process.emitWarning = previous;
  }
}

function looksLikeTypeScript(code) {
  return /\b(interface|enum|namespace)\s+[A-Za-z_$]/.test(code)
    || /\btype\s+[A-Za-z_$][\w$]*\s*(<[^>]*>)?\s*=/.test(code)
    || /(?:\b(?:const|let|var)\s+[A-Za-z_$][\w$]*|\))\s*:\s*[A-Za-z_$][\w$<>\[\]|, ]*\s*[=,){]/.test(code)
    || /\bas\s+(?:const|[A-Z][\w$]*)\b/.test(code);
}

export function executeInSandbox(code, options = {}) {
  const startTime = performance.now();
  const elapsed = () => parseFloat((performance.now() - startTime).toFixed(3));

  if (typeof code !== 'string' || !code.trim()) {
    return { success: false, error: 'Code must be a non-empty string', executionTimeMs: 0, logs: [], result: null };
  }

  // Fast-fail lint for obvious intent. Not a security boundary: string concatenation bypasses it.
  // Isolation is enforced by the null-prototype realm and codeGeneration lockdown below.
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

  let source = code;
  let transpiled = false;
  const wantsTs = options.language === 'typescript' || options.language === 'ts';
  if (wantsTs || (options.language === undefined && looksLikeTypeScript(code))) {
    try {
      source = stripTypeScript(code);
      transpiled = source !== code;
    } catch (err) {
      if (wantsTs) {
        return { success: false, error: `TypeScript transform failed: ${err.message}`, executionTimeMs: elapsed(), logs: [], result: null };
      }
      source = code;
    }
  }

  let sandbox;
  try {
    sandbox = createIsolatedSandbox(options);
  } catch (err) {
    return { success: false, error: `Sandbox bootstrap failed: ${err.message}`, executionTimeMs: elapsed(), logs: [], result: null };
  }
  const { context, timeoutMs, readLogs } = sandbox;

  // Syntax-check standalone first: a program that is valid on its own cannot close the
  // wrapper block below, so user code cannot escape the in-realm catch.
  try {
    new vm.Script(source, { filename: 'ephemeral-sandbox.js' });
  } catch (err) {
    return { success: false, error: err.message, executionTimeMs: elapsed(), logs: [], result: null, transpiled };
  }

  // Thrown values are inspected inside the realm (under the timeout). Letting a hostile
  // object propagate to the host would let Node's error decoration trigger its getters
  // outside the watchdog and hang the process.
  const wrapped = 'try {\n' + source + '\n} catch (__vibesErr) {\n'
    + '  globalThis.__vibesThrew = true;\n'
    + '  let __m;\n'
    + '  try { __m = (__vibesErr !== null && typeof __vibesErr === "object") ? String(__vibesErr.message) : String(__vibesErr); }\n'
    + '  catch (__x) { __m = "Sandbox threw an unserializable error"; }\n'
    + '  globalThis.__vibesErrMsg = __m;\n'
    + '}';

  try {
    const script = new vm.Script(wrapped, { filename: 'ephemeral-sandbox.js', lineOffset: -1 });
    const value = script.runInContext(context, { timeout: timeoutMs, breakOnSigint: true });

    if (vm.runInContext('globalThis.__vibesThrew === true', context, { timeout: 50 }) === true) {
      const msg = vm.runInContext('typeof globalThis.__vibesErrMsg === "string" ? globalThis.__vibesErrMsg : "Sandbox error"', context, { timeout: 50 });
      return { success: false, error: String(msg), executionTimeMs: elapsed(), logs: readLogs(), result: null, transpiled };
    }

    let result = null;
    if (value === null || value === undefined) {
      result = null;
    } else if (typeof value === 'object' || typeof value === 'function') {
      context.__vibesResult = value;
      const serialized = vm.runInContext(READ_RESULT, context, { timeout: Math.max(50, timeoutMs) });
      result = typeof serialized === 'string' ? JSON.parse(serialized) : null;
    } else if (typeof value === 'symbol') {
      result = value.toString();
    } else if (typeof value === 'bigint') {
      result = value.toString();
    } else {
      result = value;
    }

    return { success: true, result, executionTimeMs: elapsed(), logs: readLogs(), error: null, transpiled };
  } catch (err) {
    const isHostError = err instanceof Error && !types.isProxy(err);
    const message = isHostError ? err.message : safeErrorMessage(err);
    return { success: false, error: message, executionTimeMs: elapsed(), logs: readLogs(), result: null, transpiled };
  }
}

/**
 * Executes an exported function of a WebAssembly module inside the isolated realm.
 * The module receives no imports, so it can only compute over its own linear memory.
 * @param {Uint8Array|Buffer|number[]} wasmBytes
 * @param {{ exportName?: string, args?: Array<number>, timeoutMs?: number }} [options]
 */
export function executeWasmModule(wasmBytes, options = {}) {
  const startTime = performance.now();
  const elapsed = () => parseFloat((performance.now() - startTime).toFixed(3));
  const exportName = options.exportName || 'main';
  const args = Array.isArray(options.args) ? options.args : [];

  if (!/^[A-Za-z_$][\w$]*$/.test(exportName)) {
    return { success: false, error: `Invalid export name '${exportName}'`, executionTimeMs: 0, result: null };
  }
  if (!args.every((a) => typeof a === 'number' && Number.isFinite(a))) {
    return { success: false, error: 'WASM arguments must be finite numbers', executionTimeMs: 0, result: null };
  }

  const bytes = Array.from(wasmBytes || []);
  if (bytes.length < 8 || bytes[0] !== 0x00 || bytes[1] !== 0x61 || bytes[2] !== 0x73 || bytes[3] !== 0x6d) {
    return { success: false, error: 'Input is not a WebAssembly binary (missing \\0asm magic header)', executionTimeMs: 0, result: null };
  }

  const { context, timeoutMs } = createIsolatedSandbox({ timeoutMs: options.timeoutMs ?? 1000, allowWasm: true });
  // Payloads cross as JSON strings so no host typed arrays leak into the realm.
  context.__wasmBytes = JSON.stringify(bytes);
  context.__wasmArgs = JSON.stringify(args);
  context.__wasmExport = exportName;

  const runner = `(() => {
    const mod = new WebAssembly.Module(new Uint8Array(JSON.parse(globalThis.__wasmBytes)));
    const inst = new WebAssembly.Instance(mod, {});
    const fn = inst.exports[globalThis.__wasmExport];
    if (typeof fn !== 'function') {
      return JSON.stringify({ error: 'Export not found or not a function', exports: Object.keys(inst.exports) });
    }
    const out = fn(...JSON.parse(globalThis.__wasmArgs));
    return JSON.stringify({ value: typeof out === 'bigint' ? out.toString() : out, exports: Object.keys(inst.exports) });
  })()`;

  try {
    const raw = vm.runInContext(runner, context, { timeout: timeoutMs });
    const parsed = JSON.parse(raw);
    if (parsed.error) {
      return { success: false, error: parsed.error, exports: parsed.exports, executionTimeMs: elapsed(), result: null };
    }
    return { success: true, result: parsed.value ?? null, exports: parsed.exports, executionTimeMs: elapsed(), error: null };
  } catch (err) {
    const message = err instanceof Error && !types.isProxy(err) ? err.message : safeErrorMessage(err);
    return { success: false, error: message, executionTimeMs: elapsed(), result: null };
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
  let filePath = options.filePath || null;

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
    const isTsOrJsx = /^\s*(import|export)\b/m.test(code) || /\b(interface|type|enum)\s+[A-Za-z0-9_$]+/m.test(code) || /<[A-Za-z0-9_$-]+[^>]*>/m.test(code);
    if (!isTsOrJsx) {
      report.syntaxValid = false;
      report.syntaxError = err.message;
      report.verdict = 'REJECTED';
      report.canPersistToDisk = false;
    }
  }

  // 2. Anti-Slop Directive validation
  const { criticValidate } = await import('./critic-validator.mjs');
  let lang = options.language;
  if (!lang && filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.ts') lang = 'typescript';
    else if (ext === '.tsx') lang = 'tsx';
    else if (ext === '.jsx') lang = 'jsx';
    else if (['.js', '.mjs', '.cjs'].includes(ext)) lang = 'javascript';
    else if (ext === '.py') lang = 'python';
    else if (ext === '.go') lang = 'go';
    else if (ext === '.rs') lang = 'rust';
    else if (ext === '.html') lang = 'html';
  }
  const antiSlopReport = criticValidate(code, { language: lang || 'typescript', strictness: options.strictness || 'strict' });
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
  const isMarkupFile = /\.(tsx|jsx|html|vue|svelte)$/i.test(filePath || '');
  const hasUiMarkup = isMarkupFile || (/<[a-z0-9]+[^>]*className=|<button\s+[^>]*>|<form\s+[^>]*>/i.test(code) && !code.includes('export function criticValidate'));
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
