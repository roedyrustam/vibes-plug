#!/usr/bin/env node

/**
 * Vibes-Plug Custom Agent Scaffolder
 * Generates custom agents bound to the 147 skills for Antigravity, Cursor, and Claude Code.
 * 
 * Usage:
 *   node scripts/create-agent.mjs --name my-specialist --skills "senior-frontend,tailwind-expert"
 *   vibes create-agent <name>
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');

async function getAvailableSkills() {
  try {
    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
    return entries.filter(e => e.isDirectory()).map(e => e.name);
  } catch {
    return [];
  }
}

export async function createCustomAgent(options = {}) {
  const {
    name = 'custom-agent',
    description = 'Specialist agent created with vibes-plug',
    skills = [],
    platform = 'all',
    targetDir = process.cwd()
  } = options;

  const validSkills = await getAvailableSkills();
  const selectedSkills = skills.length > 0 ? skills : ['senior-frontend', 'anti-slop'];
  const skillListText = selectedSkills.map(s => `- \`${s}\``).join('\n');

  console.log(`\n🤖 Creating Custom Agent: [${name}]`);
  console.log(`📦 Bound Skills (${selectedSkills.length}): ${selectedSkills.join(', ')}`);

  // 1. Antigravity Agent (.agents/agents/<name>.md)
  if (platform === 'all' || platform === 'antigravity') {
    const agyDir = path.join(targetDir, '.agents', 'agents');
    await fs.mkdir(agyDir, { recursive: true });
    const agyPath = path.join(agyDir, `${name}.md`);

    const agyContent = `---
name: ${name}
description: "${description}"
tools:
  - view_file
  - write_to_file
  - replace_file_content
  - grep_search
  - find_by_name
  - list_dir
  - run_command
mainAgent: true
subagent: true
commandExecutionPolicy: auto
---

# ${name.toUpperCase()} Agent Persona

You are an expert specialist agent powered by the **vibes-plug** ecosystem. Your mission is: ${description}.

---

## Core Bound Skills
Whenever you are tasked with actions in your domain, adhere strictly to the guidelines and standards defined in:
${skillListText}

---

## Operating Protocol
1. **Zero-Placeholder Invariant**: Deliver 100% complete, runnable code on the first try. Never leave \`// TODO\` or stubs.
2. **Domain Focus**: Rely on your bound skills and delegate out-of-scope tasks back to the parent swarm.
3. **Continuous Verification**: Actively verify your outputs using test commands and anti-slop guidelines.
`;
    await fs.writeFile(agyPath, agyContent, 'utf-8');
    console.log(`  ✅ [Antigravity] Generated: ${path.relative(targetDir, agyPath)}`);
  }

  // 2. Cursor IDE Rule (.cursor/rules/<name>.mdc)
  if (platform === 'all' || platform === 'cursor') {
    const cursorDir = path.join(targetDir, '.cursor', 'rules');
    await fs.mkdir(cursorDir, { recursive: true });
    const cursorPath = path.join(cursorDir, `${name}.mdc`);

    const cursorContent = `---
description: "${description}"
globs: ["*"]
alwaysApply: false
---

# ${name} Specialist Rule

Role: ${description}

Bound Vibes-Plug Skills:
${skillListText}

Guidelines:
- Follow 2026 production-grade patterns.
- Enforce Anti-Slop Directive (no unfinished code, no generic UI clichés).
- Strictly adhere to the architectural invariants in the listed skills.
`;
    await fs.writeFile(cursorPath, cursorContent, 'utf-8');
    console.log(`  ✅ [Cursor IDE] Generated: ${path.relative(targetDir, cursorPath)}`);
  }

  // 3. Claude Code Rule (.claude/rules/<name>.md)
  if (platform === 'all' || platform === 'claude') {
    const claudeDir = path.join(targetDir, '.claude', 'rules');
    await fs.mkdir(claudeDir, { recursive: true });
    const claudePath = path.join(claudeDir, `${name}.md`);

    const claudeContent = `# ${name} Specialist Agent

Description: ${description}

Active Skills:
${skillListText}

Instructions:
1. Act as a specialized agent when addressing tasks related to this domain.
2. Adhere strictly to the Sovereign Anti-Slop directive.
3. Keep conversational output concise, high-density, and code-first.
`;
    await fs.writeFile(claudePath, claudeContent, 'utf-8');
    console.log(`  ✅ [Claude Code] Generated: ${path.relative(targetDir, claudePath)}`);
  }

  console.log(`\n✨ Custom agent [${name}] created successfully across platforms!\n`);
}

// CLI Execution
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  let name = 'custom-specialist';
  let skills = [];
  let platform = 'all';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' || args[i] === '-n') {
      name = args[++i];
    } else if (args[i] === '--skills' || args[i] === '-s') {
      skills = args[++i].split(',').map(s => s.trim());
    } else if (args[i] === '--platform' || args[i] === '-p') {
      platform = args[++i];
    }
  }

  createCustomAgent({ name, skills, platform }).catch(err => {
    console.error('❌ Error generating agent:', err.message);
    process.exit(1);
  });
}
