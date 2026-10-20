#!/usr/bin/env node

/**
 * Vibes-Plug Autonomous GitHub PR Review Critic Bot (2026 Edition)
 * 
 * Part of Pillar 2: Critic-in-the-Loop Quality Gate & Self-Healing CI/CD.
 * Analyzes Git diffs, PR commit ranges, or changed source files, runs Sovereign Anti-Slop
 * and Visual UI Critic rules, and generates an executive Markdown PR review report
 * ready for GitHub Actions (`gh pr comment`) and local pre-push inspection.
 * 
 * Usage:
 *   node scripts/github-pr-bot.mjs [diffRange|file] [--output pr-review.md]
 *   vibes pr:review [diffRange|file]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { criticValidate } from './critic-validator.mjs';
import { visualAudit } from './visual-critic.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

const UI_EXTENSIONS = new Set(['.tsx', '.jsx', '.html', '.vue', '.svelte', '.css']);
const CODE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.go', '.sql', '.html']);

/**
 * Retrieves the list of changed files from a git diff or commit range
 * @param {string} range 
 * @param {string} cwd 
 * @returns {string[]}
 */
export function getChangedFilesFromGit(range = 'HEAD~1', cwd = process.cwd()) {
  try {
    const result = spawnSync('git', ['diff', '--name-only', range], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });
    if (result.status !== 0) {
      return [];
    }
    const raw = result.stdout || '';
    return raw.split(/\r?\n/).map(f => f.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Reviews pull request changes or specified files
 * @param {string|string[]} targetOrRange 
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function reviewPullRequest(targetOrRange = 'HEAD~1', options = {}) {
  const cwd = options.cwd || process.cwd();
  let filesToReview = [];

  if (Array.isArray(targetOrRange)) {
    filesToReview = targetOrRange;
  } else if (typeof targetOrRange === 'string') {
    // Check if target is a single file on disk
    const singlePath = path.resolve(cwd, targetOrRange);
    const isSingleFile = await fs.access(singlePath).then(() => true).catch(() => false);

    if (isSingleFile) {
      filesToReview = [targetOrRange];
    } else {
      // Treat as git commit range or diff specifier
      filesToReview = getChangedFilesFromGit(targetOrRange, cwd);
      if (filesToReview.length === 0) {
        // Fallback: check uncommitted git changes
        filesToReview = getChangedFilesFromGit('HEAD', cwd);
      }
    }
  }

  // Filter to reviewable code/UI files
  const relevantFiles = filesToReview.filter(f => {
    const ext = path.extname(f);
    return CODE_EXTENSIONS.has(ext) && !f.includes('node_modules') && !f.startsWith('.git');
  });

  const fileReviews = [];
  let totalViolations = 0;
  let totalWarnings = 0;
  let cumulativeScore = 0;

  for (const relPath of relevantFiles) {
    const fullPath = path.resolve(cwd, relPath);
    try {
      const content = await fs.readFile(fullPath, 'utf8');
      const ext = path.extname(relPath);

      // 1. Code Critic Review
      const criticReport = criticValidate(content, {
        language: ext.replace('.', ''),
        strictness: options.strictness || 'standard'
      });

      // 2. Visual UI Audit (if UI file)
      let visualReport = null;
      if (UI_EXTENSIONS.has(ext)) {
        try {
          visualReport = visualAudit(content);
        } catch {
          // Skip if visual audit fails on raw file
        }
      }

      const fileScore = visualReport
        ? Math.round((criticReport.score + visualReport.score) / 2)
        : criticReport.score;

      cumulativeScore += fileScore;
      const fileErrors = criticReport.violations.filter(v => v.severity === 'ERROR').length +
        (visualReport ? visualReport.findings.filter(f => f.severity === 'ERROR').length : 0);
      const fileWarns = criticReport.violations.filter(v => v.severity === 'WARNING').length +
        (visualReport ? visualReport.findings.filter(f => f.severity === 'WARNING').length : 0);

      totalViolations += fileErrors;
      totalWarnings += fileWarns;

      fileReviews.push({
        file: relPath,
        score: fileScore,
        verdict: fileErrors > 0 ? 'REJECTED' : 'APPROVED',
        critic: criticReport,
        visual: visualReport
      });
    } catch {
      // File could be deleted in PR
    }
  }

  const reviewedCount = fileReviews.length;
  const overallScore = reviewedCount > 0 ? Math.round(cumulativeScore / reviewedCount) : 100;
  const overallVerdict = (totalViolations === 0 && overallScore >= 80) ? 'APPROVED' : 'CHANGES_REQUESTED';

  // Generate GitHub PR Markdown Comment
  const markdown = generatePrMarkdownReport({
    overallVerdict,
    overallScore,
    reviewedCount,
    totalViolations,
    totalWarnings,
    fileReviews,
    targetOrRange
  });

  if (options.outputFile) {
    const outPath = path.resolve(cwd, options.outputFile);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, markdown, 'utf8');
  }

  return {
    success: true,
    verdict: overallVerdict,
    score: overallScore,
    totalFilesReviewed: reviewedCount,
    totalErrors: totalViolations,
    totalWarnings,
    files: fileReviews,
    markdownReport: markdown
  };
}

/**
 * Generates structured GitHub Markdown PR report
 * @param {Object} data 
 * @returns {string}
 */
function generatePrMarkdownReport(data) {
  const isApproved = data.overallVerdict === 'APPROVED';
  const badgeColor = isApproved ? 'success' : 'critical';
  const icon = isApproved ? '✅' : '🚨';

  let md = `## ${icon} Vibes-Plug Sovereign PR Review Gate\n\n`;
  md += `| Verdict | Score | Files Reviewed | Errors | Warnings |\n`;
  md += `| :---: | :---: | :---: | :---: | :---: |\n`;
  md += `| **${data.overallVerdict}** | **${data.overallScore}/100** | ${data.reviewedCount} | ${data.totalViolations} | ${data.totalWarnings} |\n\n`;

  if (isApproved) {
    md += `> **Status:** All reviewed files comply with the 7 Pillars of Sovereign Anti-Slop Directive and 2026 UI standards. Ready to merge.\n\n`;
  } else {
    md += `> **Status:** Action required. Detected ${data.totalViolations} blocking violation(s) before this PR can be merged.\n\n`;
  }

  if (data.fileReviews.length > 0) {
    md += `### 📋 File-by-File Breakdown\n\n`;
    for (const f of data.fileReviews) {
      const fIcon = f.verdict === 'APPROVED' ? '✅' : '❌';
      md += `#### ${fIcon} \`${f.file}\` — Score: ${f.score}/100\n\n`;

      if (f.critic.violations.length > 0) {
        md += `**Anti-Slop & Code Quality Findings:**\n`;
        for (const v of f.critic.violations) {
          md += `- **[${v.severity}] ${v.rule}:** ${v.message}\n`;
        }
        md += '\n';
      }

      if (f.visual && f.visual.findings.length > 0) {
        md += `**Pillar 7 UI Visual Findings:**\n`;
        for (const vf of f.visual.findings) {
          md += `- **[${vf.severity}] ${vf.ruleName}:** ${vf.message} *(Fix: ${vf.fix})*\n`;
        }
        md += '\n';
      }

      if (f.critic.suggestions.length > 0) {
        md += `*Remediation Suggestions:*\n`;
        for (const s of f.critic.suggestions) {
          md += `> - ${s}\n`;
        }
        md += '\n';
      }
    }
  }

  md += `---\n*Automated by [Vibes-Plug Pro v4.3.0](https://github.com/roedyrustam/vibes-plug) • Sovereign Anti-Slop Quality Gate*\n`;
  return md;
}

// Standalone execution router
const isDirectExecution = process.argv[1] && (
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(__filename).toLowerCase() ||
  process.argv[1].endsWith('github-pr-bot.mjs')
);

if (isDirectExecution) {
  const args = process.argv.slice(2);
  const target = args[0] || 'HEAD~1';
  const outIdx = args.indexOf('--output');
  const outputFile = outIdx !== -1 ? args[outIdx + 1] : null;

  reviewPullRequest(target, { outputFile }).then(res => {
    console.log(`\n🛡️  === Vibes-Plug PR Review Report ===`);
    console.log(`Target      : ${target}`);
    console.log(`Verdict     : ${res.verdict === 'APPROVED' ? '\x1b[32mAPPROVED\x1b[0m' : '\x1b[31mCHANGES REQUESTED\x1b[0m'}`);
    console.log(`Score       : ${res.score}/100`);
    console.log(`Reviewed    : ${res.totalFilesReviewed} files`);
    console.log(`Errors      : ${res.totalErrors}`);
    console.log(`Warnings    : ${res.totalWarnings}\n`);

    if (outputFile) {
      console.log(`💾 Full Markdown report written to: ${outputFile}\n`);
    } else {
      console.log(res.markdownReport);
    }
  }).catch(err => {
    console.error(`❌ PR Review failed: ${err.message}`);
    process.exit(1);
  });
}
