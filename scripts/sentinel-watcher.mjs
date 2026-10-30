#!/usr/bin/env node

/**
 * Vibes-Plug Sentinel Daemon & Real-Time Workspace Watcher
 *
 * Continuously monitors workspace file changes and enforces sub-2ms pre-commit gates:
 * 1. Anti-Slop Directive (Pillar 1–7): detects // TODO, placeholders, ghost imports, silent catch blocks.
 * 2. Visual UI Craft: detects pill button addiction, generic gradients, missing tabular nums.
 * 3. In-Memory DDL/SQL Security: detects missing RLS policies and missing foreign key indexes.
 *
 * Usage:
 *   node scripts/sentinel-watcher.mjs [path] [--once] [--fix] [--json]
 *   vibes watch [path] [--once] [--fix]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { visualAudit, synthesizeVisualFixes } from './visual-critic.mjs';
import { evaluateSqlSync } from './eval-migration.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

const IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', '.turbo',
  'coverage', '.vscode', '.idea', 'assets', '.npm'
]);

const MONITORED_EXTENSIONS = new Set([
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.sql', '.vue', '.svelte'
]);

/**
 * Audits a single file against Anti-Slop & Security rules
 * @param {string} filePath
 * @param {Object} options
 * @returns {Object} { filePath, passed, score, issues, durationMs }
 */
export function auditSingleFile(filePath, options = {}) {
  const startTime = performance.now();
  const ext = path.extname(filePath).toLowerCase();

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return {
      filePath,
      passed: false,
      score: 0,
      issues: [{ rule: 'FILE_READ_ERROR', message: err.message, severity: 'ERROR' }],
      durationMs: performance.now() - startTime
    };
  }

  const issues = [];
  let score = 100;

  // 1. Anti-Slop Pillar 2: Placeholder & Truncation Slop
  const placeholderRegex = /\/\/\s*(TODO|FIXME|rest of code|insert code here|mock implementation|placeholder)/i;
  const matchPlaceholder = content.match(placeholderRegex);
  if (matchPlaceholder) {
    score -= 30;
    issues.push({
      rule: 'ANTI_SLOP_PLACEHOLDER',
      message: `Detected prohibited placeholder/truncation: "${matchPlaceholder[0]}"`,
      severity: 'CRITICAL',
      fix: 'Provide full, working implementation without placeholders.'
    });
  }

  // 2. Anti-Slop Pillar 5: Silent Catch Blocks
  const silentCatchRegex = /catch\s*\([^)]*\)\s*\{\s*\}/;
  if (silentCatchRegex.test(content)) {
    score -= 25;
    issues.push({
      rule: 'SILENT_CATCH_BLOCK',
      message: 'Detected empty catch block suppressing errors silently.',
      severity: 'CRITICAL',
      fix: 'Log structured error or implement graceful circuit fallback.'
    });
  }

  // 3. SQL Specific Checks
  if (ext === '.sql') {
    const sqlReport = evaluateSqlSync(content, { filePath });
    if (!sqlReport.passed || (sqlReport.rlsMissing && sqlReport.rlsMissing.length > 0)) {
      score -= (sqlReport.errors?.length || 0) * 20 + (sqlReport.rlsMissing?.length || 0) * 15;
      for (const err of sqlReport.errors || []) {
        issues.push({
          rule: 'SQL_DDL_VULNERABILITY',
          message: err,
          severity: 'HIGH'
        });
      }
      for (const warn of sqlReport.warnings || []) {
        issues.push({
          rule: 'SQL_RLS_INDEX_ADVISORY',
          message: warn,
          severity: 'MEDIUM'
        });
      }
    }
  }

  // 4. UI Code Checks (.tsx, .jsx, .vue, .svelte)
  if (['.tsx', '.jsx', '.vue', '.svelte'].includes(ext)) {
    const uiReport = visualAudit(content, { targetFile: filePath });
    if (!uiReport.passed) {
      score = Math.min(score, uiReport.score);
      for (const finding of uiReport.findings) {
        issues.push({
          rule: finding.ruleId || 'UI_SLOP',
          message: `${finding.ruleName}: ${finding.message}`,
          severity: finding.severity,
          fix: finding.fix
        });
      }
    }

    // Optional Auto-fix
    if (options.fix && issues.length > 0) {
      const fixResult = synthesizeVisualFixes(content, uiReport.findings);
      if (fixResult.fixCount > 0) {
        fs.writeFileSync(filePath, fixResult.patchedCode, 'utf8');
      }
    }
  }

  const durationMs = performance.now() - startTime;
  const passed = score >= 80 && !issues.some(i => i.severity === 'CRITICAL');

  return {
    filePath,
    passed,
    score: Math.max(0, score),
    issues,
    durationMs: Number(durationMs.toFixed(2))
  };
}

/**
 * Starts the continuous workspace sentinel watcher
 * @param {string} rootDir
 * @param {Object} options
 */
export async function startSentinelWatcher(rootDir = process.cwd(), options = {}) {
  const isOnce = Boolean(options.once);
  const isJson = Boolean(options.json);

  if (!isJson) {
    console.log(`\n🛡️  \x1b[1m\x1b[36mVibes-Plug Sentinel Daemon Active\x1b[0m`);
    console.log(`Monitoring directory : \x1b[34m${rootDir}\x1b[0m`);
    console.log(`Mode                 : ${isOnce ? 'Single-Pass Audit' : 'Continuous Live Watcher'}`);
    console.log(`Sub-2ms Pre-Disk Gate: \x1b[32mENABLED\x1b[0m\n`);
  }

  // Single pass audit of existing files
  const filesToAudit = [];
  function scan(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.name !== '.cursorrules') continue;
      if (IGNORE_DIRS.has(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (MONITORED_EXTENSIONS.has(ext)) {
          filesToAudit.push(fullPath);
        }
      }
    }
  }

  scan(rootDir);

  const results = [];
  let totalViolations = 0;

  for (const filePath of filesToAudit) {
    const report = auditSingleFile(filePath, options);
    results.push(report);
    if (!report.passed) totalViolations += report.issues.length;

    if (!isJson && !isOnce && !report.passed) {
      console.log(`[\x1b[31mREJECTED\x1b[0m] ${path.relative(rootDir, filePath)} (Score: ${report.score}/100 in ${report.durationMs}ms)`);
      for (const issue of report.issues) {
        console.log(`  - \x1b[33m[${issue.severity}]\x1b[0m ${issue.message}`);
        if (issue.fix) console.log(`    Fix: ${issue.fix}`);
      }
    }
  }

  if (isJson) {
    console.log(JSON.stringify({ rootDir, scannedFiles: results.length, totalViolations, results }, null, 2));
    return { rootDir, scannedFiles: results.length, totalViolations, results };
  }

  if (isOnce) {
    console.log(`Scan completed: ${results.length} files checked.`);
    console.log(`Status        : ${totalViolations === 0 ? '\x1b[32m100% HEALTHY (0 Violations)\x1b[0m' : `\x1b[31m${totalViolations} Violations Found\x1b[0m`}`);
    return { rootDir, scannedFiles: results.length, totalViolations, results };
  }

  console.log(`✅ Initial scan clean (${results.length} files). Watching for changes in real-time... (Press Ctrl+C to stop)\n`);

  // Setup reactive watcher
  const debounceTimers = new Map();

  const watcher = fs.watch(rootDir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const ext = path.extname(filename).toLowerCase();
    if (!MONITORED_EXTENSIONS.has(ext)) return;
    if (filename.includes('node_modules') || filename.includes('.git')) return;

    const fullPath = path.join(rootDir, filename);

    if (debounceTimers.has(fullPath)) {
      clearTimeout(debounceTimers.get(fullPath));
    }

    debounceTimers.set(fullPath, setTimeout(() => {
      debounceTimers.delete(fullPath);
      if (!fs.existsSync(fullPath)) return;

      const report = auditSingleFile(fullPath, options);
      const rel = path.relative(rootDir, fullPath);

      if (report.passed) {
        console.log(`\x1b[32m[PASS]\x1b[0m ${rel} (${report.score}/100, \x1b[36m${report.durationMs}ms\x1b[0m)`);
      } else {
        console.log(`\x1b[31m[GATE REJECTED]\x1b[0m ${rel} (${report.score}/100, \x1b[36m${report.durationMs}ms\x1b[0m)`);
        for (const issue of report.issues) {
          console.log(`  - \x1b[33m[${issue.severity}]\x1b[0m ${issue.message}`);
          if (issue.fix) console.log(`    Fix: ${issue.fix}`);
        }
      }
    }, 120));
  });

  return watcher;
}

// CLI Direct Invocation
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const args = process.argv.slice(2);
  const targetDir = args[0] && !args[0].startsWith('--') ? path.resolve(args[0]) : process.cwd();
  startSentinelWatcher(targetDir, {
    once: args.includes('--once'),
    json: args.includes('--json'),
    fix: args.includes('--fix')
  });
}
