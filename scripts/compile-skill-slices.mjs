#!/usr/bin/env node
/**
 * scripts/compile-skill-slices.mjs
 * Sovereign Skill Micro-Slice Compiler (v4.5.0)
 *
 * Compiles all 171 SKILL.md specifications into ultra-compact (<350 tokens/skill)
 * contract slices in `.skill-slices.json` for 80%+ token reduction during Swarm Fan-Out.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSkillAdapter } from './skill-dispatcher.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');
const OUTPUT_FILE = path.join(PLUGIN_ROOT, '.skill-slices.json');

export async function compileSkillSlices() {
  const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const skillNames = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();

  const slices = {};
  let totalFullBytes = 0;
  let totalSliceBytes = 0;

  for (const skillName of skillNames) {
    const filePath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
    const content = await fs.readFile(filePath, 'utf8');
    totalFullBytes += Buffer.byteLength(content, 'utf8');

    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const fm = fmMatch ? fmMatch[1] : '';
    const version = fm.match(/version:\s*"([^"]+)"/)?.[1] || '4.4.2';
    const description = fm.match(/description:\s*"?([^"\r\n]+)"?/)?.[1]?.trim() || '';

    const orchMatch = content.match(/(?:##|###)\s*(?:Orchestration & Integration|Integrasi Orkestrasi)[\s\S]*?(?=\r?\n(?:##|###)\s|$)/i);
    const connectedSkills = orchMatch
      ? [...new Set(Array.from(orchMatch[0].matchAll(/`([a-z0-9-]+)`/g)).map((m) => m[1]).filter((s) => s !== skillName))].slice(0, 8)
      : [];

    const firstCodeMatch = content.match(/```([a-zA-Z0-9_-]+)\r?\n([\s\S]*?)```/);
    const primarySnippet = firstCodeMatch
      ? {
          lang: firstCodeMatch[1].trim(),
          code: firstCodeMatch[2].trim().split(/\r?\n/).slice(0, 14).join('\n')
        }
      : null;

    const adapter = resolveSkillAdapter(skillName);

    const sliceObj = {
      skill: skillName,
      version,
      domain: adapter.domain,
      description: description.split(' / ')[0],
      actions: adapter.supportedActions,
      connectedSkills,
      fallback: 'Gemini 4 -> Gemini 3.8 Flash | Claude Opus 5.5 -> Claude Opus 4.6',
      cli: `vibes skill exec ${skillName} verify`,
      snippet: primarySnippet
    };

    const serializedSlice = JSON.stringify(sliceObj);
    totalSliceBytes += Buffer.byteLength(serializedSlice, 'utf8');
    slices[skillName] = sliceObj;
  }

  const fullTokensApprox = Math.ceil(totalFullBytes / 4);
  const sliceTokensApprox = Math.ceil(totalSliceBytes / 4);
  const reductionPct = Math.round(((fullTokensApprox - sliceTokensApprox) / fullTokensApprox) * 100);

  const payload = {
    schema: 'vibes-skill-slices/v4.5.0',
    compiledAt: new Date().toISOString(),
    totalSkills: skillNames.length,
    metrics: {
      fullRegistryTokensApprox: fullTokensApprox,
      compiledSlicesTokensApprox: sliceTokensApprox,
      avgTokensPerSlice: Math.round(sliceTokensApprox / skillNames.length),
      tokenReductionPercent: `${reductionPct}%`
    },
    slices
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf8');
  return payload;
}

const isMain = process.argv[1] && (
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(__filename).toLowerCase() ||
  process.argv[1].endsWith('compile-skill-slices.mjs')
);

if (isMain) {
  compileSkillSlices().then((res) => {
    console.log(`⚡ Compiled ${res.totalSkills} Skill Micro-Slices to .skill-slices.json`);
    console.log(`   • Full Registry Tokens   : ~${res.metrics.fullRegistryTokensApprox.toLocaleString()} tokens`);
    console.log(`   • Compiled Slices Tokens : ~${res.metrics.compiledSlicesTokensApprox.toLocaleString()} tokens`);
    console.log(`   • Avg Tokens / Slice     : ~${res.metrics.avgTokensPerSlice} tokens`);
    console.log(`   • Fan-Out Token Savings  : ${res.metrics.tokenReductionPercent}`);
  });
}
