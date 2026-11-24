#!/usr/bin/env node

/**
 * Vibes-Plug Zero-Bloat Skill Compression & Overlap Analyzer
 *
 * Audits `skills/<name>/SKILL.md` files for:
 * 1. Token footprint & oversized skills that can be distilled into Micro-Delta rules.
 * 2. Pairwise semantic/keyword overlap (Jaccard similarity) across skills to spot redundancy.
 *
 * Usage:
 *   node scripts/audit-skill-bloat.mjs [--json] [--max-tokens 2500] [--threshold 0.42] [--top 10]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

const STOPWORDS = new Set([
  'with', 'from', 'that', 'this', 'your', 'have', 'will', 'when', 'must', 'should',
  'they', 'them', 'their', 'into', 'only', 'also', 'more', 'than', 'then', 'code',
  'using', 'used', 'uses', 'skill', 'skills', 'agent', 'agents', 'always', 'never',
  'ensure', 'every', 'make', 'file', 'files', 'data', 'type', 'types', 'untuk',
  'yang', 'dengan', 'atau', 'pada', 'dari', 'akan', 'harus', 'dalam', 'bisa',
  'orchestration', 'integration', 'integrasi', 'orkestrasi', 'example', 'examples'
]);

function tokenizeForSimilarity(text) {
  const cleaned = text
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .toLowerCase();

  const words = cleaned.match(/[a-z][a-z0-9_-]{3,}/g) || [];
  const tokens = new Set();
  for (const w of words) {
    if (!STOPWORDS.has(w)) {
      tokens.add(w);
    }
  }
  return tokens;
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  const [smaller, larger] = setA.size <= setB.size ? [setA, setB] : [setB, setA];
  for (const item of smaller) {
    if (larger.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export async function auditSkillBloat(options = {}) {
  const skillsDir = options.skillsDir || path.join(PLUGIN_ROOT, 'skills');
  const maxTokens = options.maxTokens ?? 2500;
  const overlapThreshold = options.overlapThreshold ?? 0.42;
  const topLimit = options.top ?? 10;

  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  const skillNames = entries.filter(e => e.isDirectory()).map(e => e.name).sort();

  const metrics = [];
  for (const name of skillNames) {
    const filePath = path.join(skillsDir, name, 'SKILL.md');
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const approxTokens = Math.ceil(content.length / 4);
      const lines = content.split(/\r?\n/).length;
      const tokenSet = tokenizeForSimilarity(content);
      metrics.push({ name, approxTokens, lines, uniqueTerms: tokenSet.size, tokenSet });
    } catch {
      // Skip directories without SKILL.md
    }
  }

  const totalTokens = metrics.reduce((acc, m) => acc + m.approxTokens, 0);
  const avgTokens = metrics.length > 0 ? Math.round(totalTokens / metrics.length) : 0;

  const oversized = metrics
    .filter(m => m.approxTokens > maxTokens)
    .sort((a, b) => b.approxTokens - a.approxTokens || a.name.localeCompare(b.name))
    .map(({ tokenSet, ...rest }) => rest);

  const overlaps = [];
  for (let i = 0; i < metrics.length; i++) {
    for (let j = i + 1; j < metrics.length; j++) {
      const sim = jaccardSimilarity(metrics[i].tokenSet, metrics[j].tokenSet);
      if (sim >= overlapThreshold) {
        overlaps.push({
          skillA: metrics[i].name,
          skillB: metrics[j].name,
          similarity: Number(sim.toFixed(3))
        });
      }
    }
  }
  overlaps.sort((a, b) => b.similarity - a.similarity || a.skillA.localeCompare(b.skillA) || a.skillB.localeCompare(b.skillB));

  const heaviest = [...metrics]
    .sort((a, b) => b.approxTokens - a.approxTokens || a.name.localeCompare(b.name))
    .slice(0, topLimit)
    .map(({ tokenSet, ...rest }) => rest);

  return {
    skillCount: metrics.length,
    totalApproxTokens: totalTokens,
    avgApproxTokens: avgTokens,
    maxTokensBudget: maxTokens,
    overlapThreshold,
    oversizedCount: oversized.length,
    oversized: oversized.slice(0, topLimit),
    heaviest,
    highOverlapCount: overlaps.length,
    highOverlaps: overlaps.slice(0, topLimit)
  };
}

async function main() {
  const args = process.argv.slice(2);
  const isJson = args.includes('--json');

  const getNumArg = (flag, fallback) => {
    const idx = args.indexOf(flag);
    if (idx !== -1 && args[idx + 1]) {
      const parsed = Number(args[idx + 1]);
      if (!Number.isNaN(parsed) && parsed > 0) return parsed;
    }
    return fallback;
  };

  const report = await auditSkillBloat({
    maxTokens: getNumArg('--max-tokens', 2500),
    overlapThreshold: getNumArg('--threshold', 0.42),
    top: getNumArg('--top', 10)
  });

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log('\n🔬 Vibes-Plug Zero-Bloat Skill & Overlap Audit');
  console.log('------------------------------------------------------------');
  console.log(`Total Skills Analyzed : ${report.skillCount}`);
  console.log(`Total Approx Tokens   : ${report.totalApproxTokens.toLocaleString()}`);
  console.log(`Average Tokens/Skill  : ${report.avgApproxTokens}`);
  console.log(`Oversized (>${report.maxTokensBudget}t)   : ${report.oversizedCount}`);
  console.log(`High-Overlap Pairs    : ${report.highOverlapCount} (>= ${report.overlapThreshold})`);

  if (report.heaviest.length > 0) {
    console.log('\n📦 Top Heaviest Skills (Micro-Delta Compression Candidates):');
    for (const s of report.heaviest.slice(0, 5)) {
      console.log(`  - ${s.name.padEnd(38)} ~${s.approxTokens} tokens (${s.lines} lines)`);
    }
  }

  if (report.highOverlaps.length > 0) {
    console.log('\n🔁 Top Overlapping Skill Pairs:');
    for (const o of report.highOverlaps.slice(0, 5)) {
      console.log(`  - ${o.skillA} <-> ${o.skillB} (similarity: ${o.similarity})`);
    }
  } else {
    console.log('\n✅ Zero high-overlap redundancy detected above threshold.');
  }
  console.log('');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch(err => {
    console.error(`❌ Skill bloat audit error: ${err.message}`);
    process.exit(1);
  });
}
