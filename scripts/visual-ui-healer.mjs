#!/usr/bin/env node
/**
 * scripts/visual-ui-healer.mjs
 * Multimodal Vision UI & Responsive Layout Self-Healing Engine (v4.7.0)
 *
 * Audits UI components for Pillar 7 Visual Sanitation and 40 Mandatory Anti-Slop Rules:
 * 1. Touch target accessibility (minimum 44x44px / 48x48px on interactive buttons/links)
 * 2. Unstyled naked focus rings (`focus:outline-none` without `focus-visible:ring`)
 * 3. Horizontal container overflow (`w-screen` in nested grids/flex)
 * 4. Tabular numerals for financial metrics and statistics
 * 5. Generic AI gradients and neon orbs eradication
 * 6. Unsized media CLS prevention (Anti-Slop R-40)
 * 7. Decorative fake radar dots & animate-ping eradication
 * 8. Distracting endless loop animations (pulse/bounce) on static CTAs
 * 9. Dead navigation anchor links (href="#") remediation
 * 10. Synthesizes drop-in production CSS/Tailwind patches
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

/**
 * @typedef {Object} VisualIssue
 * @property {'TOUCH_TARGET' | 'FOCUS_RING' | 'CONTAINER_OVERFLOW' | 'TABULAR_NUMS' | 'SLOP_GRADIENT' | 'PILL_BUTTON' | 'UNSIZED_MEDIA' | 'FAKE_STATUS_DOT' | 'ENDLESS_LOOP' | 'DEAD_ANCHOR'} kind
 * @property {string} description
 * @property {'error' | 'warning'} severity
 * @property {number} [line]
 */

/**
 * Audits and synthesizes visual self-healing patches for UI code
 * @param {string} code 
 * @param {string} [fileName='component.tsx']
 * @returns {{ valid: boolean, score: number, issues: VisualIssue[], patchedCode: string, fixCount: number }}
 */
export function auditAndHealVisualUi(code = '', fileName = 'component.tsx') {
  const issues = [];
  let patched = code;
  let fixCount = 0;

  // 1. Touch Target Accessibility (<button>, <a role="button"> with small heights or missing min dimensions)
  const buttonRegex = /<(button|a)\s+([^>]*?)className=["']([^"']*)["']([^>]*)>/g;
  patched = patched.replace(buttonRegex, (match, tag, pre, classes, post) => {
    let newClasses = classes;

    // Check for small heights without touch floor
    if (/\b(h-6|h-7|h-8|py-1|py-0\.5|p-1)\b/.test(classes) && !/min-h-\[4[48]px\]|min-w-\[4[48]px\]|min-h-11|min-h-12/.test(classes)) {
      issues.push({
        kind: 'TOUCH_TARGET',
        description: `Interactive <${tag}> touch target is below WCAG 2.2 / Apple 44px threshold`,
        severity: 'warning'
      });
      newClasses += ' min-h-[44px] min-w-[44px] inline-flex items-center justify-center';
      fixCount++;
    }

    // Check for naked focus:outline-none without focus-visible ring
    if (/focus:outline-none/.test(classes) && !/focus-visible:ring/.test(classes)) {
      issues.push({
        kind: 'FOCUS_RING',
        description: 'Naked focus:outline-none disables keyboard navigation accessibility',
        severity: 'error'
      });
      newClasses = newClasses.replace(/focus:outline-none/g, 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2');
      fixCount++;
    }

    // Check for pill buttons (rounded-full on rectangular action triggers)
    if (/\brounded-full\b/.test(classes) && !/avatar|badge|icon-only|p-1/i.test(classes)) {
      issues.push({
        kind: 'PILL_BUTTON',
        description: 'Generic AI slop rounded-full on standard action button',
        severity: 'error'
      });
      newClasses = newClasses.replace(/\brounded-full\b/g, 'rounded-lg border border-border/40 shadow-xs');
      fixCount++;
    }

    return `<${tag} ${pre}className="${newClasses.trim()}"${post}>`;
  });

  // 2. Horizontal Overflow: w-screen inside nested container
  if (/className=["'][^"']*\bw-screen\b[^"']*["']/.test(patched)) {
    issues.push({
      kind: 'CONTAINER_OVERFLOW',
      description: 'w-screen in nested layout triggers horizontal scrollbar jitter',
      severity: 'error'
    });
    patched = patched.replace(/\bw-screen\b/g, 'w-full max-w-full');
    fixCount++;
  }

  // 3. Slop Gradients: generic blue-purple neon gradients
  const slopGradRegex = /bg-gradient-to-[a-z]+\s+(from-blue-600\s+to-purple-600|from-indigo-500\s+to-purple-500)/g;
  if (slopGradRegex.test(patched)) {
    issues.push({
      kind: 'SLOP_GRADIENT',
      description: 'Generic AI blue-purple gradient detected (Pillar 7 violation)',
      severity: 'error'
    });
    patched = patched.replace(slopGradRegex, 'bg-card border border-border/60 shadow-xs');
    fixCount++;
  }

  // 4. Tabular Numerals for metrics, counters, and prices
  const metricRegex = /<(span|p|div)\s+([^>]*?)className=["']([^"']*)["']([^>]*)>\s*(\$?\d+[\d,.]*\b)/g;
  patched = patched.replace(metricRegex, (match, tag, pre, classes, post, num) => {
    if (!classes.includes('tabular-nums') && num.length >= 2) {
      issues.push({
        kind: 'TABULAR_NUMS',
        description: `Numeric counter "${num}" missing tabular-nums alignment`,
        severity: 'warning'
      });
      fixCount++;
      return `<${tag} ${pre}className="${classes} tabular-nums"${post}>${num}`;
    }
    return match;
  });

  // 5. Unsized Media (Anti-Slop R-40 & Core Web Vitals CLS prevention)
  const imgRegex = /<img\s+([^>]*?)>/g;
  patched = patched.replace(imgRegex, (match, attrs) => {
    const hasDimensions = /\b(width=[\'\"\d]|height=[\'\"\d]|aspect-)/.test(attrs);
    if (!hasDimensions) {
      issues.push({
        kind: 'UNSIZED_MEDIA',
        description: '<img> tag missing explicit width/height or aspect-ratio causes Cumulative Layout Shift (CLS)',
        severity: 'warning'
      });
      fixCount++;
      if (/className=["']/.test(attrs)) {
        return `<img ${attrs.replace(/className=["']([^"']*)["']/, 'className="$1 aspect-video object-cover"')}>`;
      }
      return `<img className="aspect-video object-cover" ${attrs}>`;
    }
    return match;
  });

  // 6. Fake Status Dot / Radar Ping Slop (Anti-Slop Decorative Rules)
  if (/\banimate-ping\b/.test(patched)) {
    issues.push({
      kind: 'FAKE_STATUS_DOT',
      description: 'Decorative animate-ping radar dot without live telemetry creates visual slop',
      severity: 'warning'
    });
    patched = patched.replace(/\banimate-ping\b/g, 'relative inline-flex h-2 w-2 bg-emerald-500');
    fixCount++;
  }

  // 7. Endless Loop Animations on Static Elements (Anti-Slop Motion Slop)
  const endlessLoopRegex = /<(button|div|span|a)\s+([^>]*?)className=["']([^"']*\b(?:animate-pulse|animate-bounce)\b[^"']*)["']([^>]*)>/g;
  patched = patched.replace(endlessLoopRegex, (match, tag, pre, classes, post) => {
    issues.push({
      kind: 'ENDLESS_LOOP',
      description: `Endless looping animation on <${tag}> creates distracting visual slop`,
      severity: 'warning'
    });
    const cleanedClasses = classes.replace(/\b(animate-pulse|animate-bounce)\b/g, 'transition-transform duration-200 hover:scale-[1.01]');
    fixCount++;
    return `<${tag} ${pre}className="${cleanedClasses.trim()}"${post}>`;
  });

  // 8. Dead Navigation Anchor Links (Anti-Slop R-39 Accessible Affordances)
  const deadAnchorRegex = /<a\s+([^>]*?)href=["']#["']([^>]*)>/g;
  patched = patched.replace(deadAnchorRegex, (match, pre, post) => {
    issues.push({
      kind: 'DEAD_ANCHOR',
      description: 'Dead anchor link href="#" breaks keyboard accessibility and navigation',
      severity: 'warning'
    });
    fixCount++;
    return `<a ${pre}href="#main-content" role="button"${post}>`;
  });

  const penalty = issues.reduce((acc, issue) => acc + (issue.severity === 'error' ? 20 : 10), 0);
  const score = Math.max(0, 100 - penalty);

  return {
    valid: issues.filter(i => i.severity === 'error').length === 0,
    score,
    issues,
    patchedCode: patched,
    fixCount
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: vibes visual:heal <file.tsx|file.jsx|file.html>');
    return;
  }

  const targetFile = args[0];
  try {
    const raw = await fs.readFile(targetFile, 'utf8');
    const result = auditAndHealVisualUi(raw, path.basename(targetFile));

    console.log(`\n🎨 Vibes-Plug Visual UI Audit & Self-Healing (${path.basename(targetFile)}):\n`);
    console.log(`  • Visual Score : ${result.score}/100 [${result.valid ? 'CLEAN' : 'NEEDS_PATCH'}]`);
    console.log(`  • Issues Found : ${result.issues.length}`);
    console.log(`  • Fixes Applied: ${result.fixCount}`);

    if (result.issues.length > 0) {
      console.log('\nAudit Findings:');
      for (const iss of result.issues) {
        console.log(`  [${iss.severity.toUpperCase()}] ${iss.kind}: ${iss.description}`);
      }
    }

    if (result.fixCount > 0 && args.includes('--write')) {
      await fs.writeFile(targetFile, result.patchedCode, 'utf8');
      console.log(`\n✅ Patched visual improvements written directly to: ${targetFile}`);
    }
  } catch (err) {
    console.error(`\n❌ Visual UI Healer Error: ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('visual-ui-healer.mjs')) {
  main();
}

