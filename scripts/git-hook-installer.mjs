#!/usr/bin/env node

/**
 * Vibes-Plug Sovereign Git Pre-Commit Hook Manager & Gate Runner
 * Installs, inspects, and executes strict pre-commit verification:
 * 1. Staged file diff inspection (git diff --cached)
 * 2. Strict Anti-Slop Directive validation (scripts/check-anti-slop.js)
 * 3. In-Memory Pre-Disk Verification Gate (scripts/wasm-sandbox.mjs)
 * 4. Micro-latency zero-dependency execution
 *
 * Usage:
 *   node scripts/git-hook-installer.mjs install [dir]
 *   node scripts/git-hook-installer.mjs remove [dir]
 *   node scripts/git-hook-installer.mjs status [dir]
 *   node scripts/git-hook-installer.mjs --run [dir]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';
import { verifyCandidateCode } from './wasm-sandbox.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

const HOOK_MARKER = '# Installed by vibes-plug — Sovereign Anti-Slop Pre-Commit Gate';

/**
 * Checks Git repository status and pre-commit hook installation
 * @param {string} [targetDir]
 * @returns {Promise<Object>}
 */
export async function checkHookStatus(targetDir = process.cwd()) {
  const gitDir = path.join(targetDir, '.git');
  let isGitRepo = false;
  try {
    const stat = await fs.stat(gitDir);
    isGitRepo = stat.isDirectory();
  } catch {
    isGitRepo = false;
  }

  if (!isGitRepo) {
    return {
      isGitRepo: false,
      installed: false,
      managedByVibes: false,
      hookPath: null,
      message: 'Not a git repository (missing .git directory).'
    };
  }

  const hookPath = path.join(gitDir, 'hooks', 'pre-commit');
  let installed = false;
  let managedByVibes = false;

  try {
    const content = await fs.readFile(hookPath, 'utf8');
    installed = true;
    managedByVibes = content.includes('vibes-plug') || content.includes(HOOK_MARKER);
  } catch {
    installed = false;
  }

  return {
    isGitRepo: true,
    installed,
    managedByVibes,
    hookPath,
    message: installed
      ? (managedByVibes ? 'Vibes-Plug pre-commit hook is ACTIVE and managed.' : 'Custom pre-commit hook exists (not managed by vibes-plug).')
      : 'No pre-commit hook currently installed.'
  };
}

/**
 * Installs the sovereign pre-commit hook into the target Git repository
 * @param {string} [targetDir]
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function installGitHook(targetDir = process.cwd(), options = {}) {
  const status = await checkHookStatus(targetDir);
  if (!status.isGitRepo) {
    throw new Error(`Cannot install git hook: '${targetDir}' is not a git repository.`);
  }

  const hooksDir = path.dirname(status.hookPath);
  await fs.mkdir(hooksDir, { recursive: true });

  const installerPath = path.resolve(__filename).replace(/\\/g, '/');

  const hookScript = `#!/bin/sh
${HOOK_MARKER}
# Rejects commits containing lazy placeholders, syntax errors, or anti-slop violations.

if command -v node >/dev/null 2>&1; then
  node "${installerPath}" --run || exit 1
else
  echo "⚠️  Node.js not found in PATH; skipping Vibes-Plug pre-commit validation."
fi
`;

  // Write with executable permissions (0o755)
  await fs.writeFile(status.hookPath, hookScript, { mode: 0o755 });

  return {
    success: true,
    hookPath: status.hookPath,
    message: 'Vibes-Plug pre-commit hook installed successfully.'
  };
}

/**
 * Removes the Vibes-Plug pre-commit hook
 * @param {string} [targetDir]
 * @returns {Promise<Object>}
 */
export async function removeGitHook(targetDir = process.cwd()) {
  const status = await checkHookStatus(targetDir);
  if (!status.isGitRepo) {
    throw new Error(`Cannot remove git hook: '${targetDir}' is not a git repository.`);
  }

  if (!status.installed) {
    return {
      success: true,
      removed: false,
      message: 'No pre-commit hook was found to remove.'
    };
  }

  if (!status.managedByVibes) {
    return {
      success: false,
      removed: false,
      message: 'Pre-commit hook is not managed by vibes-plug; removal aborted for safety.'
    };
  }

  await fs.rm(status.hookPath, { force: true });
  return {
    success: true,
    removed: true,
    message: 'Vibes-Plug pre-commit hook removed successfully.'
  };
}

/**
 * Runs the pre-commit gate validation on staged files
 * @param {string} [targetDir]
 * @returns {Promise<Object>}
 */
export async function runPreCommitGate(targetDir = process.cwd()) {
  console.log('🛡️  Vibes-Plug Sovereign Pre-Commit Gate running...');

  let stagedRaw = '';
  try {
    stagedRaw = execSync('git diff --cached --name-only --diff-filter=ACM', {
      cwd: targetDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
  } catch (err) {
    console.error(`❌ Failed to retrieve staged git files: ${err.message}`);
    return { success: false, passed: false, error: err.message };
  }

  const stagedFiles = stagedRaw
    .split(/\r?\n/)
    .map(f => f.trim())
    .filter(Boolean)
    .filter(f => !f.startsWith('.git/'));

  if (stagedFiles.length === 0) {
    console.log('ℹ️  No staged files detected. Pre-commit check bypassed.');
    return { success: true, passed: true, stagedCount: 0, violations: [] };
  }

  console.log(`🔍 Inspecting ${stagedFiles.length} staged file(s) for quality & anti-slop conformance...`);

  const violations = [];
  const slopScript = path.join(PLUGIN_ROOT, 'scripts', 'check-anti-slop.js');

  for (const file of stagedFiles) {
    const fullPath = path.resolve(targetDir, file);
    let content = '';
    try {
      content = await fs.readFile(fullPath, 'utf8');
    } catch {
      // File might have been deleted or inaccessible, skip
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    const isCode = ['.js', '.ts', '.mjs', '.cjs', '.jsx', '.tsx', '.py', '.go', '.rs'].includes(ext);

    // 1. Run Anti-Slop file checker
    const slopCheck = spawnSync(process.execPath, [slopScript, fullPath, '--strict', '--summary'], {
      cwd: PLUGIN_ROOT,
      encoding: 'utf8'
    });

    if (slopCheck.status !== 0) {
      violations.push({
        file,
        stage: 'Anti-Slop Directive',
        reason: slopCheck.stderr || slopCheck.stdout || 'Strict anti-slop rules violated.'
      });
      continue;
    }

    // 2. Run Pre-Disk Verification Gate on JS/TS/TSX candidate code
    const isMetaRuleFile = file.includes('critic-validator') || file.includes('check-anti-slop') || file.includes('studio-server') || file.includes('test-cli');
    if (['.js', '.ts', '.mjs', '.cjs', '.jsx', '.tsx'].includes(ext) && !isMetaRuleFile) {
      try {
        const gateRes = await verifyCandidateCode(content, { filePath: file });
        if (!gateRes.canPersistToDisk || gateRes.verdict === 'REJECTED') {
          violations.push({
            file,
            stage: 'Pre-Disk Verification Gate',
            reason: gateRes.summary || `Failed security, syntax, or visual UI verification (${gateRes.reasons?.join(', ') || 'Unknown'})`
          });
        }
      } catch (err) {
        violations.push({
          file,
          stage: 'Gate Verification Error',
          reason: err.message
        });
      }
    }
  }

  if (violations.length > 0) {
    console.error('\n╔═══════════════════════════════════════════════════════════════════════════════════════╗');
    console.error('║                 ❌ COMMIT REJECTED: QUALITY GATE VIOLATIONS DETECTED                  ║');
    console.error('╚═══════════════════════════════════════════════════════════════════════════════════════╝\n');
    for (const v of violations) {
      console.error(`  • [${v.stage}] ${v.file}`);
      console.error(`    Details: ${v.reason.trim()}\n`);
    }
    console.error('💡 Fix the above issues or verify with: node scripts/check-anti-slop.js --strict\n');
    return { success: false, passed: false, stagedCount: stagedFiles.length, violations };
  }

  console.log(`✅ Vibes-Plug Pre-Commit Gate PASSED: ${stagedFiles.length} file(s) approved for commit.\n`);
  return { success: true, passed: true, stagedCount: stagedFiles.length, violations: [] };
}

// Standalone CLI Router
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';
  const targetDir = args[1] ? path.resolve(args[1]) : process.cwd();

  if (command === '--run' || command === 'run') {
    runPreCommitGate(targetDir).then(res => {
      if (!res.passed) {
        process.exit(1);
      }
    }).catch(err => {
      console.error('❌ Pre-commit execution error:', err.message);
      process.exit(1);
    });
  } else if (command === 'install') {
    installGitHook(targetDir).then(res => {
      console.log(`✅ ${res.message} (${res.hookPath})`);
    }).catch(err => {
      console.error(`❌ Install failed: ${err.message}`);
      process.exit(1);
    });
  } else if (command === 'remove') {
    removeGitHook(targetDir).then(res => {
      console.log(`✅ ${res.message}`);
    }).catch(err => {
      console.error(`❌ Removal failed: ${err.message}`);
      process.exit(1);
    });
  } else if (command === 'status') {
    checkHookStatus(targetDir).then(status => {
      console.log('\n🪝 Vibes-Plug Git Pre-Commit Hook Status:');
      console.log(`  Git Repository   : ${status.isGitRepo ? 'Yes' : 'No'}`);
      console.log(`  Hook Installed   : ${status.installed ? 'Yes' : 'No'}`);
      console.log(`  Managed by Vibes : ${status.managedByVibes ? 'Yes' : 'No'}`);
      if (status.hookPath) {
        console.log(`  Hook Location    : ${status.hookPath}`);
      }
      console.log(`  Status Message   : ${status.message}\n`);
    }).catch(err => {
      console.error(`❌ Status check failed: ${err.message}`);
      process.exit(1);
    });
  } else {
    console.error('Usage: node scripts/git-hook-installer.mjs [install|remove|status|--run] [targetDir]');
    process.exit(1);
  }
}
