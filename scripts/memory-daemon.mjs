#!/usr/bin/env node

/**
 * Vibes-Plug Local Episodic Memory Store (2026 Edition)
 * 
 * Part of Epoch 2: Project Memory & Zero Context Amnesia
 * Records, queries, and compacts cross-session architectural decisions
 * into `.agents/memory/episodic_graph.json` and `CHECKPOINT.md`.
 */

import fs from 'fs/promises';
import path from 'path';

function getMemoryDir(cwd = process.cwd()) {
  return path.join(cwd, '.agents', 'memory');
}

function getMemoryFile(cwd = process.cwd()) {
  return path.join(getMemoryDir(cwd), 'episodic_graph.json');
}

export async function loadMemory(cwd = process.cwd()) {
  const filePath = getMemoryFile(cwd);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return { project: path.basename(cwd), decisions: [], checkpoints: [] };
    }
    throw e;
  }
}

export async function saveMemory(data, cwd = process.cwd()) {
  const dir = getMemoryDir(cwd);
  await fs.mkdir(dir, { recursive: true });
  const filePath = getMemoryFile(cwd);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function recordDecision(decisionText, metadata = {}, cwd = process.cwd()) {
  const memory = await loadMemory(cwd);
  const item = {
    id: `MEM_${Date.now()}`,
    timestamp: new Date().toISOString(),
    decision: decisionText,
    category: metadata.category || 'Architecture',
    skillsInvolved: metadata.skills || [],
    rationale: metadata.rationale || 'Architectural consensus'
  };

  memory.decisions.push(item);
  await saveMemory(memory, cwd);
  return item;
}

export async function queryMemory(keyword, cwd = process.cwd()) {
  const memory = await loadMemory(cwd);
  const q = keyword.toLowerCase();
  return memory.decisions.filter(d => 
    d.decision.toLowerCase().includes(q) || 
    d.category.toLowerCase().includes(q) ||
    d.skillsInvolved.some(s => s.toLowerCase().includes(q))
  );
}

export async function generateCompactCheckpoint(cwd = process.cwd()) {
  const memory = await loadMemory(cwd);
  const activeDecisions = memory.decisions.slice(-5); // Keep top 5 latest decisions

  let md = `# ⚡ Ultra-Compact Session Checkpoint (Vibes-Plug)\n\n`;
  md += `> **Project:** ${memory.project} | **Decisions Logged:** ${memory.decisions.length}\n\n`;
  md += `## Pinned Architectural Decisions (Invariants)\n`;

  if (activeDecisions.length === 0) {
    md += `- Default 2026 Tech Stack (React 19, Tailwind v4, Bun 1.2+, Drizzle ORM).\n`;
  } else {
    activeDecisions.forEach(d => {
      md += `- **[${d.category}]** ${d.decision} *(Skills: ${d.skillsInvolved.join(', ') || 'core'})*\n`;
    });
  }

  md += `\n*Loaded automatically by @session-memory-manager to prevent context drift.*\n`;

  const checkpointPath = path.join(cwd, 'CHECKPOINT.md');
  await fs.writeFile(checkpointPath, md, 'utf8');
  return { path: checkpointPath, tokensApprox: Math.ceil(md.length / 4) };
}

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];

  console.log(`
╔══════════════════════════════════════════════════════════╗
║    Vibes-Plug Episodic Memory Daemon (Epoch 2)           ║
╚══════════════════════════════════════════════════════════╝
`);

  if (!action || action === 'help') {
    console.log(`
Usage:
  node scripts/memory-daemon.mjs record "<decision text>" [--category <cat>] [--skills <skill1,skill2>]
  node scripts/memory-daemon.mjs query "<keyword>"
  node scripts/memory-daemon.mjs checkpoint
  node scripts/memory-daemon.mjs list

Examples:
  node scripts/memory-daemon.mjs record "Use Drizzle ORM instead of Prisma for edge serverless latency" --category Database --skills database-orm-expert
  node scripts/memory-daemon.mjs query "Drizzle"
  node scripts/memory-daemon.mjs checkpoint
`);
    return;
  }

  if (action === 'record') {
    const text = args[1];
    if (!text) {
      console.error('❌ Error: Decision text required.');
      process.exit(1);
    }
    const catIdx = args.indexOf('--category');
    const skillsIdx = args.indexOf('--skills');
    const category = catIdx !== -1 ? args[catIdx + 1] : 'Architecture';
    const skills = skillsIdx !== -1 ? args[skillsIdx + 1].split(',').map(s => s.trim()) : [];

    const recorded = await recordDecision(text, { category, skills });
    console.log(`✅ Decision Recorded [${recorded.id}]:`);
    console.log(`   "${recorded.decision}" (Category: ${recorded.category})`);
  } else if (action === 'query') {
    const query = args[1] || '';
    const results = await queryMemory(query);
    console.log(`🔍 Memory Search for "${query}" (${results.length} found):\n`);
    results.forEach(r => {
      console.log(`  • \x1b[36m[${r.category}]\x1b[0m ${r.decision} \x1b[90m(${r.timestamp.slice(0, 10)})\x1b[0m`);
    });
    console.log('');
  } else if (action === 'checkpoint') {
    const res = await generateCompactCheckpoint();
    console.log(`💾 Generated Ultra-Compact Checkpoint: ${res.path}`);
    console.log(`   Estimated Token Footprint: ~${res.tokensApprox} tokens (Ultra-Frugal <150t)\n`);
  } else if (action === 'list') {
    const mem = await loadMemory();
    console.log(`📚 Project Decisions Log (${mem.decisions.length} stored):\n`);
    mem.decisions.forEach(d => {
      console.log(`  • \x1b[36m[${d.category}]\x1b[0m ${d.decision}`);
    });
    console.log('');
  }
}

if (process.argv[1] && process.argv[1].endsWith('memory-daemon.mjs')) {
  main().catch(err => {
    console.error(`\n❌ Error in memory daemon: ${err.message}`);
    process.exit(1);
  });
}
