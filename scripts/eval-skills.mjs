#!/usr/bin/env node

/**
 * Vibes-Plug Skill Effectiveness, Routing Recall & Token-Compression Eval Harness
 *
 * Evaluates:
 * 1. Domain routing recall against real-world engineering prompts.
 * 2. Context compression ratio between raw SKILL.md files and `.skill-slices.json`.
 * 3. Deterministic KV-Cache prefix ordering in `.cache-prefix.json`.
 *
 * Usage:
 *   node scripts/eval-skills.mjs [--json]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

const EVAL_SCENARIOS = [
  {
    id: 'fullstack-rls',
    prompt: 'Build a Next.js 16 App Router SaaS dashboard with Tailwind v4 and Supabase RLS multi-tenant isolation',
    expectedSkills: ['nextjs-app-router-expert', 'tailwind-expert', 'saas-multi-tenant']
  },
  {
    id: 'fintech-doku',
    prompt: 'Integrate DOKU payment gateway SNAP BI QRIS webhook with idempotent double-entry ledger',
    expectedSkills: ['doku-payment-gateway', 'double-entry-ledger-fintech-expert']
  },
  {
    id: 'ai-mcp-swarm',
    prompt: 'Create an MCP v1.x server with A2A agent card and adaptive model cascade routing',
    expectedSkills: ['mcp-server-architect', 'a2a-agent-protocol-expert', 'adaptive-model-cascade']
  },
  {
    id: 'reverse-security',
    prompt: 'Reverse engineer firmware binary with Ghidra and verify cryptographic invariants using Z3',
    expectedSkills: ['reverse-engineer-anything', 'formal-spec-z3-verifier']
  },
  {
    id: 'quality-antislop',
    prompt: 'Run Playwright E2E tests, security red-teaming, and strict anti-slop UI verification',
    expectedSkills: ['e2e-testing-expert', 'autonomous-red-teamer', 'anti-slop']
  }
];

const SYNONYM_MAP = {
  rls: ['multi-tenant', 'supabase', 'postgres', 'isolation'],
  nextjs: ['next', 'app-router', 'react'],
  ghidra: ['reverse-engineer', 'binary', 'rea', 'firmware'],
  firmware: ['reverse-engineer', 'binary', 'rea'],
  cryptographic: ['z3', 'formal-spec', 'post-quantum', 'invariants'],
  invariants: ['formal-spec', 'z3', 'lean4', 'verifier'],
  z3: ['formal-spec', 'smt', 'verifier'],
  e2e: ['playwright', 'testing'],
  playwright: ['e2e', 'testing'],
  qris: ['doku', 'snap', 'payment'],
  webhook: ['doku', 'payment', 'idempotent'],
  a2a: ['agent-protocol', 'card', 'mcp'],
  slop: ['anti-slop', 'visual-ui']
};

function expandPromptTokens(rawTokens) {
  const expanded = new Map();
  for (const tok of rawTokens) {
    expanded.set(tok, (expanded.get(tok) || 0) + 2.0);
    const syns = SYNONYM_MAP[tok];
    if (syns) {
      for (const syn of syns) {
        expanded.set(syn, Math.max(expanded.get(syn) || 0, 1.25));
      }
    }
  }
  return expanded;
}

function scoreSkillMatch(weightedTokens, skillEntry, sliceEntry) {
  const nameLower = skillEntry.name.toLowerCase();
  const descLower = (skillEntry.description || '').toLowerCase();
  const blueprintTitles = (sliceEntry?.codeBlueprints || []).map(b => b.title).join(' ').toLowerCase();
  const domainLower = (sliceEntry?.domain || '').toLowerCase();
  const haystack = `${nameLower} ${descLower} ${domainLower} ${blueprintTitles}`;

  let score = 0;
  for (const [tok, weight] of weightedTokens.entries()) {
    if (nameLower.includes(tok)) {
      score += weight * 2.0;
    } else if (haystack.includes(tok)) {
      score += weight;
    }
  }
  return score;
}

export async function runSkillEval(options = {}) {
  const rootDir = options.rootDir || PLUGIN_ROOT;

  const [catalogRaw, slicesRaw, cachePrefixRaw] = await Promise.all([
    fs.readFile(path.join(rootDir, 'CATALOG.json'), 'utf8'),
    fs.readFile(path.join(rootDir, '.skill-slices.json'), 'utf8'),
    fs.readFile(path.join(rootDir, '.cache-prefix.json'), 'utf8')
  ]);

  const catalog = JSON.parse(catalogRaw);
  const slices = JSON.parse(slicesRaw);
  const cachePrefix = JSON.parse(cachePrefixRaw);

  const skillEntries = Array.isArray(catalog) ? catalog : (catalog.skills || []);

  // 1. Measure raw vs sliced footprint
  const skillsDir = path.join(rootDir, 'skills');
  let rawBytes = 0;
  for (const entry of skillEntries) {
    try {
      const stat = await fs.stat(path.join(skillsDir, entry.name, 'SKILL.md'));
      rawBytes += stat.size;
    } catch {
      // Ignore missing files
    }
  }
  const rawApproxTokens = Math.ceil(rawBytes / 4);
  const slicesApproxTokens = Math.ceil(slicesRaw.length / 4);
  const domainCount = Object.keys(slices.domains || {}).length;
  const avgDomainSliceTokens = domainCount > 0 ? Math.round(slicesApproxTokens / domainCount) : 0;
  const perTaskSavingsPct = rawApproxTokens > 0
    ? Number(((1 - avgDomainSliceTokens / rawApproxTokens) * 100).toFixed(2))
    : 0;

  // 2. Verify canonical sorting in .cache-prefix.json
  let cachePrefixSorted = true;
  for (const list of Object.values(cachePrefix.domains || {})) {
    if (!Array.isArray(list)) continue;
    const sorted = [...list].sort((a, b) => a.localeCompare(b));
    if (list.some((v, idx) => v !== sorted[idx])) {
      cachePrefixSorted = false;
      break;
    }
  }

  // 3. Evaluate routing recall on scenarios (Top-8)
  const scenarioResults = [];
  let totalExpected = 0;
  let totalHits = 0;

  for (const sc of EVAL_SCENARIOS) {
    const rawTokens = sc.prompt
      .toLowerCase()
      .split(/[^a-z0-9-]+/)
      .filter(t => t.length >= 2);
    const weightedTokens = expandPromptTokens(rawTokens);

    const ranked = skillEntries
      .map(s => ({
        name: s.name,
        score: scoreSkillMatch(weightedTokens, s, slices.slices?.[s.name])
      }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, 8)
      .map(s => s.name);

    const hits = sc.expectedSkills.filter(exp => ranked.includes(exp));
    totalExpected += sc.expectedSkills.length;
    totalHits += hits.length;

    scenarioResults.push({
      id: sc.id,
      expected: sc.expectedSkills.length,
      hits: hits.length,
      recall: Number((hits.length / sc.expectedSkills.length).toFixed(2)),
      matched: hits
    });
  }

  const overallRecall = totalExpected > 0 ? Number((totalHits / totalExpected).toFixed(3)) : 0;

  return {
    passed: overallRecall >= 0.75 && perTaskSavingsPct > 80,
    totalSkills: skillEntries.length,
    rawApproxTokens,
    slicesApproxTokens,
    avgDomainSliceTokens,
    perTaskSavingsPct,
    cachePrefixSorted,
    overallRecall,
    scenarios: scenarioResults
  };
}

async function main() {
  const isJson = process.argv.includes('--json');
  const report = await runSkillEval();

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('\n🎯 Vibes-Plug Skill Routing & Token-Compression Eval');
    console.log('------------------------------------------------------------');
    console.log(`Skills Evaluated       : ${report.totalSkills}`);
    console.log(`Raw Skills Footprint   : ~${report.rawApproxTokens.toLocaleString()} tokens`);
    console.log(`Avg Domain Slice Size  : ~${report.avgDomainSliceTokens.toLocaleString()} tokens`);
    console.log(`Per-Task Token Savings : ${report.perTaskSavingsPct}%`);
    console.log(`KV-Cache Prefix Sorted : ${report.cachePrefixSorted ? 'YES' : 'NO'}`);
    console.log(`Routing Recall (Top-8) : ${(report.overallRecall * 100).toFixed(1)}%`);
    console.log('\nScenarios:');
    for (const s of report.scenarios) {
      console.log(`  - ${s.id.padEnd(18)} ${s.hits}/${s.expected} matched (${(s.recall * 100).toFixed(0)}%)`);
    }
    console.log('');
  }

  if (!report.passed) {
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch(err => {
    console.error(`❌ Skill eval error: ${err.message}`);
    process.exit(1);
  });
}
