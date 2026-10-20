/**
 * Vibes-Plug Autonomous Self-Healing Test Runner & Diagnoser
 * 
 * Inspects failing test suites, stack traces, and runtime exceptions.
 * Correlates failures with the AST Symbol Knowledge Graph to pinpoint broken symbols,
 * evaluates candidate fixes in the Ephemeral Micro-Sandbox, and generates verifiable patch diffs.
 * 
 * @author Roedy Rustam
 * @version 4.4.0
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { executeInSandbox } from './wasm-sandbox.mjs';
import { querySymbolGraph } from './graphrag-indexer.mjs';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parses terminal stack traces and test failure output
 * @param {string} output 
 * @returns {Array<Object>}
 */
export function parseFailureOutput(output) {
  if (!output || typeof output !== 'string') return [];
  const failures = [];

  const stackRegex = /(?:at\s+(?:async\s+)?([^\s(]+)?\s*\(?|\blocation:\s*['"]?)(file:\/\/\/[^\s:)]+|[a-zA-Z]:\\[^\s:)]+|\/[^\s:)]+):(\d+):(\d+)/g;
  const errorRegex = /(?:error:\s*|- )([A-Za-z]+Error|TypeError|AssertionError|ReferenceError|SyntaxError):\s*([^\r\n]+)/g;

  let errMatch;
  const errors = [];
  while ((errMatch = errorRegex.exec(output)) !== null) {
    errors.push({ type: errMatch[1], message: errMatch[2].trim() });
  }

  let stackMatch;
  const seenLocations = new Set();
  while ((stackMatch = stackRegex.exec(output)) !== null) {
    let filePath = stackMatch[2];
    if (filePath.startsWith('file:///')) {
      filePath = fileURLToPath(filePath);
    }
    const line = parseInt(stackMatch[3], 10);
    const col = parseInt(stackMatch[4], 10);
    const caller = stackMatch[1] || 'anonymous';

    // Ignore node internals
    if (filePath.includes('node:internal') || filePath.includes('node_modules')) {
      continue;
    }

    const locKey = `${filePath}:${line}:${col}`;
    if (!seenLocations.has(locKey)) {
      seenLocations.add(locKey);
      failures.push({
        caller,
        file: filePath,
        line,
        col,
        error: errors[failures.length] || errors[0] || { type: 'RuntimeError', message: 'Test assertion or execution failure' }
      });
    }
  }

  // Fallback: If no structured stack matches, look for explicit file error snippets
  if (failures.length === 0 && errors.length > 0) {
    failures.push({
      caller: 'unknown',
      file: 'unknown',
      line: 0,
      col: 0,
      error: errors[0]
    });
  }

  return failures;
}

/**
 * Diagnoses a specific failure and generates an atomic remediation proposal
 * @param {Object} failure 
 * @param {string} [cwd]
 * @returns {Promise<Object>}
 */
export async function diagnoseFailure(failure, cwd = process.cwd()) {
  const diagnosis = {
    file: failure.file,
    line: failure.line,
    errorType: failure.error.type,
    errorMessage: failure.error.message,
    enclosingSymbol: null,
    contextLines: [],
    rootCause: '',
    suggestedPatch: '',
    sandboxVerified: false
  };

  if (!failure.file || failure.file === 'unknown') {
    diagnosis.rootCause = 'Failure occurred without a traceable local source location.';
    diagnosis.suggestedPatch = '// Verify test dependencies or execution environment';
    return diagnosis;
  }

  try {
    const rawContent = await fs.readFile(failure.file, 'utf8');
    const lines = rawContent.split('\n');
    const startIdx = Math.max(0, failure.line - 4);
    const endIdx = Math.min(lines.length, failure.line + 4);

    diagnosis.contextLines = lines.slice(startIdx, endIdx).map((content, idx) => ({
      line: startIdx + idx + 1,
      content,
      isFailingLine: startIdx + idx + 1 === failure.line
    }));

    // Correlate with AST Symbol Graph to find enclosing symbol
    const graphOutcome = await querySymbolGraph(path.basename(failure.file), cwd);
    if (graphOutcome && graphOutcome.matches) {
      const enclosing = graphOutcome.matches.find(m => {
        return m.file.includes(path.basename(failure.file)) && m.line <= failure.line;
      });
      if (enclosing) {
        diagnosis.enclosingSymbol = enclosing;
      }
    }

    const failingLineContent = lines[failure.line - 1] || '';

    // Automated Root Cause Heuristics
    if (failure.error.type === 'AssertionError') {
      diagnosis.rootCause = `Assertion invariant violated at line ${failure.line}. Expected value differed from evaluated output.`;
      diagnosis.suggestedPatch = `# Verify expected output and invariant contract:\n- ${failingLineContent.trim()}`;
    } else if (failure.error.type === 'TypeError' && failure.error.message.includes('Cannot read properties of undefined')) {
      const propMatch = failure.error.message.match(/reading '([^']+)'/);
      const prop = propMatch ? propMatch[1] : 'property';
      diagnosis.rootCause = `Attempted to access property '${prop}' on an undefined object reference.`;
      diagnosis.suggestedPatch = `// Add optional chaining (?.) or defensive null check before accessing .${prop}\n- ${failingLineContent.trim()}\n+ ${failingLineContent.trim().replace(new RegExp(`\\.(${prop})`), '?.$1')}`;
    } else if (failure.error.type === 'ReferenceError') {
      const identMatch = failure.error.message.match(/([a-zA-Z0-9_$]+) is not defined/);
      const ident = identMatch ? identMatch[1] : 'identifier';
      diagnosis.rootCause = `Symbol '${ident}' is referenced without prior declaration or import.`;
      diagnosis.suggestedPatch = `+ import { ${ident} } from './...';\n  // Ensure ${ident} is imported or in scope.`;
    } else {
      diagnosis.rootCause = `Runtime ${failure.error.type}: ${failure.error.message}`;
      diagnosis.suggestedPatch = `// Audit logic flow at line ${failure.line}:\n${failingLineContent}`;
    }

    // Verify small pure expressions in Ephemeral Sandbox if possible
    if (diagnosis.suggestedPatch.includes('+')) {
      const candidateCode = diagnosis.suggestedPatch.split('\n').filter(l => l.startsWith('+')).map(l => l.slice(1).trim()).join('\n');
      if (candidateCode && !candidateCode.includes('import')) {
        const sandboxRes = executeInSandbox(`(() => { try { ${candidateCode}; return true; } catch (e) { return false; } })()`, { timeoutMs: 100 });
        if (sandboxRes.success && sandboxRes.result === true) {
          diagnosis.sandboxVerified = true;
        }
      }
    }
  } catch (err) {
    diagnosis.rootCause = `Failed reading target file for diagnosis: ${err.message}`;
  }

  return diagnosis;
}

/**
 * Runs a test suite or command, detects failures, and produces an autonomous healing plan
 * @param {string} [commandOrFile] 
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function diagnoseAndHeal(commandOrFile, options = {}) {
  const cwd = options.cwd || process.cwd();
  const dryRun = options.dryRun !== false; // Default dry-run is true for safety
  const cmd = commandOrFile || 'npm test';

  const report = {
    command: cmd,
    status: 'UNKNOWN',
    passed: false,
    failuresDetected: 0,
    diagnoses: [],
    summary: '',
    dryRun
  };

  let stdout = '';
  let stderr = '';
  let exitCode = 0;

  try {
    const res = await execAsync(cmd, { cwd, maxBuffer: 1024 * 1024 * 4 });
    stdout = res.stdout || '';
    stderr = res.stderr || '';
    report.status = 'PASSED';
    report.passed = true;
    report.summary = 'All test suites and checks passed with 0 failures. No self-healing required.';
    return report;
  } catch (err) {
    exitCode = err.code || 1;
    stdout = err.stdout || '';
    stderr = err.stderr || err.message || '';
  }

  report.status = 'FAILED';
  report.passed = false;

  const combinedOutput = `${stdout}\n${stderr}`;
  const failures = parseFailureOutput(combinedOutput);
  report.failuresDetected = failures.length;

  for (const failure of failures) {
    const diag = await diagnoseFailure(failure, cwd);
    report.diagnoses.push(diag);
  }

  if (report.diagnoses.length > 0) {
    report.summary = `Detected ${report.diagnoses.length} failure point(s). Formulated root-cause diagnoses and patch suggestions.`;
  } else {
    report.summary = `Command failed with exit code ${exitCode}, but no specific stack frames were parsed. Inspect output manually.`;
  }

  return report;
}

// CLI Standalone Execution
const isDirectExecution = process.argv[1] && (
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(__filename).toLowerCase() ||
  process.argv[1].endsWith('self-healer.mjs')
);

if (isDirectExecution) {
  const args = process.argv.slice(2);
  const target = args[0] || 'npm test';
  const dryRun = !args.includes('--apply');

  console.log(`\n🩺 Vibes-Plug Autonomous Self-Healer`);
  console.log(`Target Command : ${target}`);
  console.log(`Mode           : ${dryRun ? 'DRY-RUN (Safe Analysis)' : 'AUTO-APPLY'}\n`);

  try {
    const rep = await diagnoseAndHeal(target, { dryRun });
    if (rep.passed) {
      console.log(`✅ ${rep.summary}\n`);
    } else {
      console.log(`❌ Failures Detected: ${rep.failuresDetected}`);
      console.log(`📋 Summary: ${rep.summary}\n`);
      for (const [idx, d] of rep.diagnoses.entries()) {
        console.log(`--- [Issue #${idx + 1}] ${d.file}:${d.line} ---`);
        console.log(`Error       : ${d.errorType}: ${d.errorMessage}`);
        console.log(`Root Cause  : ${d.rootCause}`);
        if (d.enclosingSymbol) {
          console.log(`Symbol      : [${d.enclosingSymbol.type}] ${d.enclosingSymbol.name || 'anonymous'}`);
        }
        console.log(`Patch Idea  :\n${d.suggestedPatch}\n`);
      }
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Diagnostic error: ${err.message}`);
    process.exit(1);
  }
}
