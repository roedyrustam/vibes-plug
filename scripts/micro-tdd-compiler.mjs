#!/usr/bin/env node
/**
 * scripts/micro-tdd-compiler.mjs
 * In-Memory Hot-Loop TDD & Micro-Spec Compiler Engine (v4.6.0)
 *
 * Provides ultra-fast (<15ms) in-memory contract verification and test execution:
 * - Direct in-memory transpilation and isolated VM evaluation
 * - Instant invariant checking without disk I/O bottlenecks or child-process overhead
 * - Auto-detects runtime exceptions, assertion errors, and syntax violations
 * - Returns structured diagnostic payloads for agentic self-healing loops
 */

import vm from 'node:vm';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

/**
 * Strips basic TypeScript type annotations for fast in-memory JavaScript VM evaluation
 * @param {string} tsCode 
 * @returns {string}
 */
export function stripTsTypes(tsCode = '') {
  let js = tsCode;

  // Remove interface and type declarations
  js = js.replace(/export\s+interface\s+[A-Za-z0-9_]+[\s\S]*?\{[\s\S]*?\}/g, '');
  js = js.replace(/interface\s+[A-Za-z0-9_]+[\s\S]*?\{[\s\S]*?\}/g, '');
  js = js.replace(/export\s+type\s+[A-Za-z0-9_]+\s*=\s*[^;]+;/g, '');
  js = js.replace(/type\s+[A-Za-z0-9_]+\s*=\s*[^;]+;/g, '');

  // Strip generic parameter signatures like <T, U extends string>
  js = js.replace(/<[A-Za-z0-9_,\s=]+>(?=\s*\()/g, '');

  // Strip inline function return type annotations `: ReturnType`
  js = js.replace(/\):\s*[A-Za-z0-9_<>\[\]|&\s]+\s*=>/g, ') =>');
  js = js.replace(/\):\s*[A-Za-z0-9_<>\[\]|&\s]+\s*\{/g, ') {');

  // Strip variable and parameter type annotations `: Type`
  js = js.replace(/:\s*[A-Za-z0-9_<>\[\]|&]+(\s*[,=)])/g, '$1');

  // Strip export / import keywords for isolated script execution
  js = js.replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?/gm, '');
  js = js.replace(/^export\s+(default\s+)?/gm, '');

  return js;
}

/**
 * Runs code and test specs inside an in-memory isolated sandbox
 * @param {string} sourceCode 
 * @param {string} [specCode='']
 * @param {Object} [options]
 * @returns {{ passed: boolean, durationMs: number, syntaxValid: boolean, testsCount: number, failures: Array<{ error: string, message: string }> }}
 */
export function compileAndVerifyMicroTdd(sourceCode = '', specCode = '', options = {}) {
  const start = performance.now();
  const failures = [];
  let syntaxValid = true;
  let testsCount = 0;

  // 1. Bracket & Structural Balance Check
  let curly = 0, paren = 0, bracket = 0;
  for (const ch of sourceCode) {
    if (ch === '{') curly++;
    else if (ch === '}') curly--;
    else if (ch === '(') paren++;
    else if (ch === ')') paren--;
    else if (ch === '[') bracket++;
    else if (ch === ']') bracket--;
  }

  if (curly !== 0 || paren !== 0 || bracket !== 0) {
    syntaxValid = false;
    failures.push({
      error: 'SYNTAX_IMBALANCE',
      message: `Unbalanced syntax delimiters (curly: ${curly}, paren: ${paren}, bracket: ${bracket})`
    });
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    return { passed: false, durationMs, syntaxValid, testsCount, failures };
  }

  // 2. Transpile TS to executable JS
  const executableJs = stripTsTypes(sourceCode);
  const executableSpec = stripTsTypes(specCode);

  // 3. Isolated Context Sandbox
  const sandbox = {
    assert,
    console: {
      log: () => {},
      warn: () => {},
      error: () => {}
    },
    setTimeout: (fn) => fn(),
    clearTimeout: () => {},
    crypto: globalThis.crypto,
    Math: globalThis.Math,
    JSON: globalThis.JSON,
    Date: globalThis.Date,
    Array: globalThis.Array,
    Object: globalThis.Object,
    String: globalThis.String,
    Number: globalThis.Number,
    Boolean: globalThis.Boolean,
    RegExp: globalThis.RegExp,
    testResults: []
  };

  const context = vm.createContext(sandbox);

  try {
    // Execute Source Code
    const sourceScript = new vm.Script(executableJs, { filename: 'source.js' });
    sourceScript.runInContext(context, { timeout: options.timeoutMs || 250 });

    // Execute Specs if provided
    if (executableSpec.trim()) {
      testsCount++;
      const specScript = new vm.Script(executableSpec, { filename: 'spec.js' });
      specScript.runInContext(context, { timeout: options.timeoutMs || 250 });
    }
  } catch (err) {
    failures.push({
      error: err.name || 'EXECUTION_ERROR',
      message: err.message
    });
  }

  const durationMs = Math.round((performance.now() - start) * 100) / 100;
  return {
    passed: failures.length === 0,
    durationMs,
    syntaxValid,
    testsCount,
    failures
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: vibes tdd:micro <file.ts|file.js> [--spec <specCode>]');
    return;
  }

  const targetFile = args[0];
  const specIdx = args.indexOf('--spec');
  const specCode = specIdx !== -1 ? args[specIdx + 1] : '';

  try {
    const raw = await fs.readFile(targetFile, 'utf8');
    const result = compileAndVerifyMicroTdd(raw, specCode);

    console.log(`\n⚡ Vibes-Plug In-Memory Micro-TDD Results (${result.durationMs}ms):\n`);
    console.log(`  • Status       : ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`  • Syntax Valid : ${result.syntaxValid}`);
    console.log(`  • Tests Count  : ${result.testsCount}`);

    if (result.failures.length > 0) {
      console.log('\n🚨 Failures:');
      for (const f of result.failures) {
        console.log(`   [${f.error}] ${f.message}`);
      }
      process.exit(1);
    }
  } catch (err) {
    console.error(`\n❌ Micro-TDD Error: ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('micro-tdd-compiler.mjs')) {
  main();
}

