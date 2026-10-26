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
import vm from 'node:vm';
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

  const stackRegex = /(?:at\s+(?:async\s+)?([^\s(]+)?\s*\(?|\blocation:\s*['"]?)(file:\/\/\/.+?|[a-zA-Z]:[\\/].+?|\/[^\s:)]+?):(\d+):(\d+)/g;
  const errorRegex = /(?:^|\n|\r)\s*(?:error:\s*|- |not ok \d+ - [^\r\n]*\r?\n\s+)?([A-Za-z]+Error|Error):\s*([^\r\n]+)/g;

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
    const existing = failures.find(f => `${f.file}:${f.line}:${f.col}` === locKey);
    if (!existing) {
      seenLocations.add(locKey);
      failures.push({
        caller,
        file: filePath,
        line,
        col,
        error: errors[failures.length] || errors[0] || { type: 'RuntimeError', message: 'Test assertion or execution failure' }
      });
    } else if (existing.caller === 'anonymous' && caller !== 'anonymous') {
      existing.caller = caller;
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
    } else if (
      (failure.error.type === 'TypeError' && failure.error.message.includes('is not a function')) ||
      failure.error.message.includes('requires Node.js >=') ||
      failure.error.message.includes('stripTypeScriptTypes')
    ) {
      const funcMatch = failure.error.message.match(/([a-zA-Z0-9_$]+(?:\.[a-zA-Z0-9_$]+)*)\s+is not a function/);
      const targetApi = funcMatch ? funcMatch[1] : 'Runtime API';
      diagnosis.rootCause = `Node.js runtime API incompatibility detected: '${targetApi}' is not supported in the active Node version. Feature detection fallback required.`;
      diagnosis.suggestedPatch = `// Add feature detection and graceful fallback for older Node LTS versions:\n- ${failingLineContent.trim()}\n+ typeof ${targetApi} === 'function' ? ${failingLineContent.trim()} : fallbackImplementation()`;
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

export const ALLOWED_TEST_RUNNERS = [
  'npm test',
  'npm run test',
  'npm run',
  'pnpm test',
  'pnpm run test',
  'pnpm run',
  'bun test',
  'yarn test',
  'node -v',
  'node --version',
  'node --test',
  'node',
  'npx vitest',
  'vitest',
  'npx jest',
  'jest',
  'npx playwright test',
  'playwright test',
  'pytest',
  'cargo test',
  'go test'
];

/**
 * Validates and sanitizes a test command to prevent command injection and unauthorized execution.
 * @param {string} rawCommand
 * @returns {{ valid: boolean, command?: string, error?: string }}
 */
export function validateTestCommand(rawCommand) {
  if (!rawCommand || typeof rawCommand !== 'string') {
    return { valid: true, command: 'npm test' };
  }
  const trimmed = rawCommand.trim();
  if (!trimmed) {
    return { valid: true, command: 'npm test' };
  }

  // Reject shell metacharacters and control characters that enable command chaining or shell injection
  if (/[;&|`$><\\!]/g.test(trimmed) || /[\r\n]/.test(trimmed)) {
    return {
      valid: false,
      error: 'Security Error: Command contains prohibited shell metacharacters (; & | ` $ > < \\ !) or newlines.'
    };
  }

  // Enforce permitted test runner prefix
  const isAllowed = ALLOWED_TEST_RUNNERS.some(runner => 
    trimmed === runner || trimmed.startsWith(runner + ' ')
  );

  if (!isAllowed) {
    return {
      valid: false,
      error: `Security Error: Command '${trimmed}' is not an authorized test runner. Permitted runners: ${ALLOWED_TEST_RUNNERS.join(', ')}`
    };
  }

  return { valid: true, command: trimmed };
}

/**
 * Safely applies a formulated remediation patch with syntax verification and automated rollback
 * @param {Object} diagnosis
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function applySafeRemediation(diagnosis, options = {}) {
  const filePath = diagnosis.file;
  if (!filePath || filePath === 'unknown') {
    return { success: false, error: 'Unknown target file path' };
  }
  const backupPath = `${filePath}.bak`;
  try {
    const originalContent = await fs.readFile(filePath, 'utf8');
    await fs.writeFile(backupPath, originalContent, 'utf8');

    const diffLines = diagnosis.suggestedPatch.split('\n');
    const removeLines = diffLines.filter(l => l.startsWith('- ')).map(l => l.slice(2).trim());
    const addLines = diffLines.filter(l => l.startsWith('+ ')).map(l => l.slice(2).trim());

    if (removeLines.length > 0 && addLines.length > 0) {
      let patched = originalContent;
      for (let i = 0; i < removeLines.length; i++) {
        const target = removeLines[i];
        const replacement = addLines[i] || '';
        if (patched.includes(target)) {
          patched = patched.replace(target, replacement);
        }
      }

      // Syntax check with vm.Script (sanitizing ESM export/import keywords for script parser)
      try {
        const testScript = patched
          .replace(/^\s*export\s+(?:default\s+)?/gm, '')
          .replace(/^\s*import\s+.*?;\s*$/gm, '');
        new vm.Script(testScript, { filename: path.basename(filePath) });
      } catch (syntaxErr) {
        await fs.writeFile(filePath, originalContent, 'utf8');
        await fs.unlink(backupPath).catch(() => {});
        return { success: false, error: `Syntax verification failed after patch: ${syntaxErr.message}`, rolledBack: true };
      }

      await fs.writeFile(filePath, patched, 'utf8');
      await fs.unlink(backupPath).catch(() => {});
      return { success: true, file: filePath, patched: true };
    }

    await fs.unlink(backupPath).catch(() => {});
    return { success: false, error: 'Patch does not contain explicit +/- replacement lines' };
  } catch (err) {
    if (await fs.access(backupPath).then(() => true).catch(() => false)) {
      const backupContent = await fs.readFile(backupPath, 'utf8');
      await fs.writeFile(filePath, backupContent, 'utf8');
      await fs.unlink(backupPath).catch(() => {});
    }
    return { success: false, error: err.message, rolledBack: true };
  }
}

/**
 * Scaffolds an autonomous CI Auto-Healer GitHub Actions workflow
 * @param {string} targetDir
 * @returns {Promise<{ workflowPath: string, created: boolean }>}
 */
export async function scaffoldCiHealWorkflow(targetDir = process.cwd()) {
  const workflowsDir = path.join(targetDir, '.github', 'workflows');
  await fs.mkdir(workflowsDir, { recursive: true });
  const workflowPath = path.join(workflowsDir, 'vibes-self-heal.yml');

  const content = `name: VibesPlug CI Auto-Healer

on:
  workflow_run:
    workflows: ["VibesPlug CI & Anti-Slop Gate"]
    types: [completed]

jobs:
  auto-heal:
    if: \${{ github.event.workflow_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22.x
      - name: Install dependencies
        run: npm ci
      - name: Run Autonomous Self-Healer
        run: |
          node scripts/self-healer.mjs --apply || true
`;

  await fs.writeFile(workflowPath, content, 'utf8');
  return { workflowPath, created: true };
}

/**
 * Runs a test suite, command, or log file, detects failures, and produces an autonomous healing plan
 * @param {string} [commandOrFile] 
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function diagnoseAndHeal(commandOrFile, options = {}) {
  const cwd = options.cwd || process.cwd();
  const dryRun = options.dryRun !== false; // Default dry-run is true for safety

  let stdout = '';
  let stderr = '';
  let exitCode = 0;
  let isLogFile = false;
  let cmd = typeof commandOrFile === 'string' ? commandOrFile.trim() : 'npm test';

  // Check if input is a path to an existing log file
  if (cmd) {
    try {
      const resolved = path.isAbsolute(cmd) ? cmd : path.resolve(cwd, cmd);
      const stat = await fs.stat(resolved).catch(() => null);
      if (stat && stat.isFile()) {
        isLogFile = true;
        stdout = await fs.readFile(resolved, 'utf8');
      }
    } catch (_err) {
      isLogFile = false;
    }
  }

  if (!isLogFile) {
    const validation = validateTestCommand(cmd);
    if (!validation.valid) {
      return {
        command: cmd,
        status: 'REJECTED',
        passed: false,
        failuresDetected: 0,
        diagnoses: [],
        summary: validation.error,
        dryRun
      };
    }
    cmd = validation.command;
  }

  const report = {
    command: cmd,
    status: 'UNKNOWN',
    passed: false,
    failuresDetected: 0,
    diagnoses: [],
    remediationsApplied: 0,
    summary: '',
    dryRun
  };

  if (!isLogFile) {
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
  }

  report.status = 'FAILED';
  report.passed = false;

  const combinedOutput = `${stdout}\n${stderr}`;
  const failures = parseFailureOutput(combinedOutput);
  report.failuresDetected = failures.length;

  for (const failure of failures) {
    const diag = await diagnoseFailure(failure, cwd);
    if (!dryRun && diag.suggestedPatch.includes('+ ')) {
      const remediation = await applySafeRemediation(diag, { cwd });
      diag.remediation = remediation;
      if (remediation.success) {
        report.remediationsApplied += 1;
      }
    }
    report.diagnoses.push(diag);
  }

  if (report.diagnoses.length > 0) {
    report.summary = `Detected ${report.diagnoses.length} failure point(s). Formulated root-cause diagnoses and patch suggestions.`;
    if (!dryRun && report.remediationsApplied > 0) {
      report.summary += ` Applied ${report.remediationsApplied} verified remediation patch(es).`;
    }
  } else {
    report.summary = isLogFile
      ? 'Log file inspected, but no recognizable stack frames were parsed.'
      : `Command failed with exit code ${exitCode}, but no specific stack frames were parsed. Inspect output manually.`;
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
  const jsonMode = args.includes('--json');
  const scaffoldWorkflow = args.includes('--init-workflow');

  if (scaffoldWorkflow) {
    const outcome = await scaffoldCiHealWorkflow(process.cwd());
    console.log(`\n✅ Scaffolded CI Auto-Healer workflow at: ${outcome.workflowPath}\n`);
    process.exit(0);
  }

  const dryRun = !args.includes('--apply');
  const target = args.find(a => !a.startsWith('--')) || 'npm test';

  if (!jsonMode) {
    console.log(`\n🩺 Vibes-Plug Autonomous Self-Healer`);
    console.log(`Target Command : ${target}`);
    console.log(`Mode           : ${dryRun ? 'DRY-RUN (Safe Analysis)' : 'AUTO-APPLY'}\n`);
  }

  try {
    const rep = await diagnoseAndHeal(target, { dryRun });
    if (jsonMode) {
      console.log(JSON.stringify(rep, null, 2));
      process.exit(rep.passed ? 0 : 1);
    }

    if (rep.status === 'REJECTED') {
      console.error(`🛡️ ${rep.summary}\n`);
      process.exit(1);
    }
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
