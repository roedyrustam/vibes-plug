#!/usr/bin/env node

/**
 * scripts/generate-llms-txt.mjs
 * Generates llms.txt and llms-full.txt following the llmstxt.org standard.
 * Optimizes Vibes-Plug for Large Language Models (LLMO / Generative Engine Optimization).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

const SHOWCASE_SKILLS_PATH = path.join(PLUGIN_ROOT, 'showcase', 'skills-data.js');

async function main() {
  console.log('🤖 Compiling LLMO artifacts (llms.txt and llms-full.txt)...');

  const fileContent = await fs.readFile(SHOWCASE_SKILLS_PATH, 'utf8');
  // Extract SKILLS_DATA JSON
  const jsonMatch = fileContent.match(/export const SKILLS_DATA = (\[[\s\S]*?\]);/);
  if (!jsonMatch) {
    throw new Error('Failed to parse SKILLS_DATA from showcase/skills-data.js');
  }

  const skills = JSON.parse(jsonMatch[1]);
  console.log(`Loaded ${skills.length} skills from registry.`);

  // Group skills by domain
  const domainGroups = {};
  for (const skill of skills) {
    const domainKey = skill.domainLabel || skill.domain || 'General';
    if (!domainGroups[domainKey]) {
      domainGroups[domainKey] = [];
    }
    domainGroups[domainKey].push(skill);
  }

  // 1. Generate llms.txt (Concise / Root & Showcase)
  const llmsTxtContent = `# Vibes-Plug Pro

> The Universal Sovereign AI Agent Swarm & 178 Skill Ecosystem for Antigravity, Claude Code, Cursor, Windsurf, Trae, and OpenAI Codex.

Vibes-Plug is a production-grade, zero-slop developer plugin, CLI toolchain, and Model Context Protocol (MCP) server that equips frontier AI coding assistants with 178 specialized domain skills, deterministic KV-cache prompt prefix pinning, local sub-millisecond in-memory tools, and multi-agent swarm orchestration.

## Key Capabilities

- **178 Verified Domain Skills**: Spanning Frontend (React 19, Tailwind v4), Backend (Axum 0.8, Hono, Bun), FinTech (SNAP BI, DOKU), AI & MCP, Security, DevOps, and Formal Verification.
- **Universal 6-IDE Compatibility**: Single unified configuration synchronizing Antigravity (\`AGENTS.md\`), Claude Code (\`CLAUDE.md\`), Cursor (\`.cursorrules\`), Windsurf (\`.windsurfrules\`), Trae (\`.traerules\`), and OpenAI Codex (\`CODEX.md\`).
- **Sovereign Anti-Slop Directive**: Strict zero-placeholder code enforcement, banning \`// TODO\` or fake mocks, verified via automated CI scanner (\`vibes audit\`).
- **Deterministic KV-Cache Prefix Pinning**: Slashes LLM token consumption and latency by 75-90% through byte-identical static instruction headers.
- **Native MCP Server (Stdio & SSE)**: High-performance Model Context Protocol server exposing 40+ local analysis and repair tools.
- **Flow-Sensitive Permissions & Brown Ownership Model**: State-of-the-art Rust 2024 and systems programming guidance.
- **Zero-to-Prod 8-Phase Lifecycle**: Master orchestrator guiding apps from Discovery, Foundation, DB/Security, Backend, Frontend, Testing, DevOps, to Production.

## Quickstart

\`\`\`bash
# Initialize a new zero-to-prod project with curated skills
npx vibes-plug init my-project
cd my-project

# Or inject skills into an existing codebase
npx vibes-plug sync
npx vibes-plug doctor
\`\`\`

## Documentation & Skill Index

- [Full 178-Skill Catalog (llms-full.txt)](llms-full.txt): Complete machine-readable catalog of all 178 domain skills with trigger contracts and technical specifications.
- [GitHub Repository](https://github.com/roedyrustam/vibes-plug): Source code, issue tracker, and releases.
- [npm Package](https://www.npmjs.com/package/vibes-plug): Official npm package distribution.
- [Web Showcase & Interactive Studio](https://roedyrustam.github.io/vibes-plug/): Interactive skill explorer and terminal simulator.

## Essential Core Skills

- [Zero-to-Prod Swarm Orchestrator](https://github.com/roedyrustam/vibes-plug/blob/main/skills/zero-to-prod-orchestrator/SKILL.md): 8-Phase application lifecycle orchestrator from discovery to deployment.
- [Sovereign Anti-Slop Engine](https://github.com/roedyrustam/vibes-plug/blob/main/skills/anti-slop/SKILL.md): 7 pillars of zero AI slop, crisp UI craft, and production-grade code generation.
- [Rust Programming Expert](https://github.com/roedyrustam/vibes-plug/blob/main/skills/rust-programming-expert/SKILL.md): Rust 2024, Brown University Grounded Permissions Model, and Axum 0.8 APIs.
- [DOKU & SNAP BI Payment Gateway](https://github.com/roedyrustam/vibes-plug/blob/main/skills/doku-payment-gateway/SKILL.md): Indonesian FinTech SNAP BI, QRIS, Virtual Accounts, and atomic double-entry ledgers.
- [Senior Frontend Craft](https://github.com/roedyrustam/vibes-plug/blob/main/skills/senior-frontend/SKILL.md): React 19, Next.js 15, Tailwind CSS v4, and WCAG 2.2 accessibility.
`;

  // 2. Generate llms-full.txt (Comprehensive / All 178 Skills)
  let llmsFullContent = `# Vibes-Plug Pro — Full 178 Domain Skill Ecosystem Catalog

> Complete machine-readable index of all 178 verified domain skills, triggers, and architectural contracts.
> Official Website: https://roedyrustam.github.io/vibes-plug/
> GitHub: https://github.com/roedyrustam/vibes-plug
> Author: Roedy Rustam
> Version: 4.7.0

---

## Architecture Overview

Vibes-Plug functions as the Primary Trigger and Master Conductor for frontier AI coding assistants across 6 major IDE environments:
1. Antigravity (\`AGENTS.md\`)
2. Claude Code (\`CLAUDE.md\`)
3. Cursor IDE (\`.cursorrules\`)
4. Windsurf (\`.windsurfrules\`)
5. Trae (\`.traerules\`)
6. OpenAI Codex (\`CODEX.md\`)

Every skill operates under the Sovereign Anti-Slop Directive, enforcing 100% complete, runnable, and strictly typed code without placeholders or stubs.

---

## 178 Verified Domain Skills Directory

`;

  for (const [domainLabel, skillList] of Object.entries(domainGroups)) {
    llmsFullContent += `### Domain: ${domainLabel} (${skillList.length} Skills)\n\n`;

    for (const s of skillList) {
      llmsFullContent += `#### \`${s.name}\` (v${s.version})\n`;
      llmsFullContent += `- **Native Prompt Trigger**: \`${s.trigger}\`\n`;
      llmsFullContent += `- **English Summary**: ${s.summaryEn}\n`;
      llmsFullContent += `- **Indonesian Summary**: ${s.summaryId}\n`;
      llmsFullContent += `- **Tags**: ${s.tags.map(t => `#${t}`).join(', ')}\n`;
      llmsFullContent += `- **Repository Path**: [\`skills/${s.name}/SKILL.md\`](https://github.com/roedyrustam/vibes-plug/blob/main/skills/${s.name}/SKILL.md)\n\n`;
    }
    llmsFullContent += `---\n\n`;
  }

  // Write files to root and showcase/
  await fs.writeFile(path.join(PLUGIN_ROOT, 'llms.txt'), llmsTxtContent, 'utf8');
  await fs.writeFile(path.join(PLUGIN_ROOT, 'showcase', 'llms.txt'), llmsTxtContent, 'utf8');
  await fs.writeFile(path.join(PLUGIN_ROOT, 'llms-full.txt'), llmsFullContent, 'utf8');
  await fs.writeFile(path.join(PLUGIN_ROOT, 'showcase', 'llms-full.txt'), llmsFullContent, 'utf8');

  console.log('✅ Successfully generated:');
  console.log('  - /llms.txt');
  console.log('  - /llms-full.txt');
  console.log('  - /showcase/llms.txt');
  console.log('  - /showcase/llms-full.txt');
}

main().catch(err => {
  console.error('❌ Error generating llms.txt:', err);
  process.exit(1);
});

