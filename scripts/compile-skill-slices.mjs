#!/usr/bin/env node
/**
 * scripts/compile-skill-slices.mjs
 * Sovereign Skill Micro-Slice Compiler (v4.8.0)
 *
 * Compiles all 178 SKILL.md specifications into ultra-compact (<350 tokens/skill)
 * contract slices in `.skill-slices.json` for 90%+ token reduction during Swarm Fan-Out.
 * Uses concurrent Promise.all file I/O for sub-100ms compilation.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSkillAdapter } from './skill-dispatcher.mjs';
import { extractSmartCodeSnippet, extractDeclarativeRulesFromSkill } from './skill-rules-engine.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');
const OUTPUT_FILE = path.join(PLUGIN_ROOT, '.skill-slices.json');

export async function compileSkillSlices() {
  const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const skillNames = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.')).map((e) => e.name).sort();

  const slices = {};
  const domainSummary = {};
  let totalFullBytes = 0;
  let totalSliceBytes = 0;
  let totalBlueprints = 0;

  const compiledEntries = await Promise.all(
    skillNames.map(async (skillName) => {
      const filePath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
      const content = await fs.readFile(filePath, 'utf8');
      const fullBytes = Buffer.byteLength(content, 'utf8');

      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const fm = fmMatch ? fmMatch[1] : '';
      const version = fm.match(/version:\s*"([^"]+)"/)?.[1] || '4.8.0';
      const description = fm.match(/description:\s*"?([^"\r\n]+)"?/)?.[1]?.trim() || '';

      const codeBlocks = [];
      const codeRegex = /```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;
      let match;
      while ((match = codeRegex.exec(content)) !== null) {
        const beforeBlock = content.slice(Math.max(0, match.index - 220), match.index);
        const headingMatches = [...beforeBlock.matchAll(/#{2,4}\s+([^\r\n]+)/g)];
        const title = headingMatches.length > 0 ? headingMatches[headingMatches.length - 1][1].trim() : 'Blueprint';
        codeBlocks.push({
          title,
          language: (match[1] || 'text').trim(),
          lines: match[2].trim().split(/\r?\n/).length,
          preview: extractSmartCodeSnippet(match[2], 6)
        });
      }

      const orchMatch = content.match(/(?:##|###)\s*(?:Orchestration & Integration|Integrasi Orkestrasi)[\s\S]*?(?=\r?\n(?:##|###)\s|$)/i);
      const allConnectedSkills = orchMatch
        ? [...new Set(Array.from(orchMatch[0].matchAll(/`([a-z0-9-]+)`/g)).map((m) => m[1]).filter((s) => s !== skillName))]
        : [];
      const connectedSkills = allConnectedSkills.slice(0, 12);

      const firstCodeMatch = content.match(/```([a-zA-Z0-9_-]+)\r?\n([\s\S]*?)```/);
      const primarySnippet = firstCodeMatch
        ? {
            lang: firstCodeMatch[1].trim(),
            code: extractSmartCodeSnippet(firstCodeMatch[2], 18)
          }
        : null;

      const adapter = resolveSkillAdapter(skillName);
      const rulesProfile = await extractDeclarativeRulesFromSkill(skillName, content);
      const supportedActions = [...new Set([...adapter.supportedActions, 'blueprint', 'slice', 'extract-code', 'rules', 'read', 'health', 'budget'])];

      const sliceObj = {
        skill: skillName,
        version,
        domain: adapter.domain,
        description: description.split(' / ')[0],
        actions: adapter.supportedActions,
        supportedActions,
        guardRulesCount: rulesProfile.astGuardRulesCount + rulesProfile.declarativeMandatesCount,
        nfrContract: rulesProfile.nfrContract,
        codeBlueprintsCount: codeBlocks.length,
        languagesAvailable: [...new Set(codeBlocks.map((b) => b.language))],
        codeBlueprints: codeBlocks.slice(0, 5),
        connectedSkillsCount: allConnectedSkills.length,
        connectedSkills,
        fallback: 'Gemini 4 -> Gemini 3.8 Flash | Claude Opus 5.5 -> Claude Opus 4.6',
        cli: `vibes skill exec ${skillName} verify`,
        snippet: primarySnippet
      };

      const serializedSlice = JSON.stringify(sliceObj);
      const sliceBytes = Buffer.byteLength(serializedSlice, 'utf8');
      return { skillName, sliceObj, fullBytes, sliceBytes };
    })
  );

  for (const item of compiledEntries) {
    totalFullBytes += item.fullBytes;
    totalSliceBytes += item.sliceBytes;
    totalBlueprints += item.sliceObj.codeBlueprintsCount;
    slices[item.skillName] = item.sliceObj;
    const dom = item.sliceObj.domain;
    if (!domainSummary[dom]) {
      domainSummary[dom] = { count: 0, blueprints: 0, skills: [] };
    }
    domainSummary[dom].count += 1;
    domainSummary[dom].blueprints += item.sliceObj.codeBlueprintsCount;
    domainSummary[dom].skills.push(item.skillName);
  }

  const fullTokensApprox = Math.ceil(totalFullBytes / 4);
  const sliceTokensApprox = Math.ceil(totalSliceBytes / 4);
  const reductionPct = Math.round(((fullTokensApprox - sliceTokensApprox) / fullTokensApprox) * 100);

  const payload = {
    schema: 'vibes-skill-slices/v4.8.0',
    version: '4.8.0',
    compiledAt: new Date().toISOString(),
    totalSkills: skillNames.length,
    totalCodeBlueprints: totalBlueprints,
    domains: domainSummary,
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
