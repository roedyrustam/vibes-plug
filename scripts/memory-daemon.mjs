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
  const tmpPath = `${filePath}.${process.pid}.${Math.random().toString(36).slice(2, 8)}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await fs.rename(tmpPath, filePath);
      return;
    } catch (err) {
      if (attempt === 4 || !['EPERM', 'EBUSY', 'EACCES', 'UNKNOWN'].includes(err.code)) {
        await fs.unlink(tmpPath).catch(() => {});
        throw err;
      }
      await new Promise(r => setTimeout(r, 40 * (attempt + 1)));
    }
  }
}

const DEFAULT_TTL_DAYS = 90;
const MS_PER_DAY = 86_400_000;

export function computeEffectiveConfidence(decision, nowMs = Date.now()) {
  const ttlDays = typeof decision.ttlDays === 'number' ? decision.ttlDays : DEFAULT_TTL_DAYS;
  if (ttlDays <= 0) return 0;

  const baseConfidence = typeof decision.confidence === 'number' ? decision.confidence : 1.0;
  const refTime = Date.parse(decision.lastAccessedAt || decision.timestamp || '');
  if (Number.isNaN(refTime)) return baseConfidence;

  const ageDays = Math.max(0, (nowMs - refTime) / MS_PER_DAY);
  if (ageDays >= ttlDays) return 0;
  return Number(Math.max(0, baseConfidence * (1 - ageDays / ttlDays)).toFixed(4));
}

export async function recordDecision(decisionText, metadata = {}, cwd = process.cwd()) {
  const memory = await loadMemory(cwd);
  const nowIso = new Date().toISOString();
  const ttlDays = typeof metadata.ttlDays === 'number' && metadata.ttlDays > 0
    ? metadata.ttlDays
    : DEFAULT_TTL_DAYS;

  const item = {
    id: `MEM_${Date.now()}`,
    timestamp: nowIso,
    lastAccessedAt: nowIso,
    accessCount: 1,
    ttlDays,
    confidence: typeof metadata.confidence === 'number' ? metadata.confidence : 1.0,
    decision: decisionText,
    category: metadata.category || 'Architecture',
    skillsInvolved: metadata.skills || [],
    rationale: metadata.rationale || 'Architectural consensus'
  };

  memory.decisions.push(item);
  await saveMemory(memory, cwd);
  return item;
}

export async function queryMemory(keyword, cwd = process.cwd(), options = {}) {
  const memory = await loadMemory(cwd);
  const q = keyword.toLowerCase();
  const nowMs = options.nowMs ?? Date.now();
  const minConfidence = options.minConfidence ?? 0.1;
  const includeExpired = options.includeExpired === true;

  const matched = [];
  let dirty = false;

  for (const d of memory.decisions) {
    const effective = computeEffectiveConfidence(d, nowMs);
    if (!includeExpired && effective <= minConfidence) continue;

    const isMatch =
      d.decision.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.skillsInvolved.some(s => s.toLowerCase().includes(q));

    if (isMatch) {
      d.lastAccessedAt = new Date(nowMs).toISOString();
      d.accessCount = (d.accessCount || 1) + 1;
      d.confidence = Number(Math.min(1.0, (d.confidence ?? 1.0) + 0.05).toFixed(4));
      dirty = true;
      matched.push({ ...d, effectiveConfidence: effective });
    }
  }

  if (dirty) {
    await saveMemory(memory, cwd);
  }
  return matched;
}

export async function pruneExpired(options = {}, cwd = process.cwd()) {
  const memory = await loadMemory(cwd);
  const nowMs = options.nowMs ?? Date.now();
  const minConfidence = options.minConfidence ?? 0.2;
  const dryRun = options.dryRun === true;

  const kept = [];
  const pruned = [];

  for (const d of memory.decisions) {
    const effective = computeEffectiveConfidence(d, nowMs);
    if (effective < minConfidence) {
      pruned.push({ id: d.id, decision: d.decision, effectiveConfidence: effective });
    } else {
      kept.push(d);
    }
  }

  if (!dryRun && pruned.length > 0) {
    memory.decisions = kept;
    await saveMemory(memory, cwd);
  }

  return {
    beforeCount: memory.decisions.length + (dryRun ? 0 : pruned.length),
    afterCount: kept.length,
    prunedCount: pruned.length,
    dryRun,
    pruned
  };
}

export async function generateCompactCheckpoint(cwd = process.cwd()) {
  const memory = await loadMemory(cwd);
  const nowMs = Date.now();
  const nonExpired = memory.decisions.filter(d => computeEffectiveConfidence(d, nowMs) >= 0.2);
  const activeDecisions = nonExpired.slice(-5); // Keep top 5 latest non-expired decisions

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
  node scripts/memory-daemon.mjs record "<decision text>" [--category <cat>] [--skills <skill1,skill2>] [--ttl <days>]
  node scripts/memory-daemon.mjs query "<keyword>"
  node scripts/memory-daemon.mjs prune [--dry-run] [--min-confidence <0..1>]
  node scripts/memory-daemon.mjs checkpoint
  node scripts/memory-daemon.mjs list

Examples:
  node scripts/memory-daemon.mjs record "Use Drizzle ORM instead of Prisma for edge serverless latency" --category Database --skills database-orm-expert --ttl 90
  node scripts/memory-daemon.mjs query "Drizzle"
  node scripts/memory-daemon.mjs prune --dry-run
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
    const ttlIdx = args.indexOf('--ttl');
    const category = catIdx !== -1 ? args[catIdx + 1] : 'Architecture';
    const skills = skillsIdx !== -1 ? args[skillsIdx + 1].split(',').map(s => s.trim()) : [];
    const ttlDays = ttlIdx !== -1 ? Number(args[ttlIdx + 1]) : DEFAULT_TTL_DAYS;

    const recorded = await recordDecision(text, { category, skills, ttlDays });
    console.log(`✅ Decision Recorded [${recorded.id}]:`);
    console.log(`   "${recorded.decision}" (Category: ${recorded.category}, TTL: ${recorded.ttlDays}d)`);
  } else if (action === 'prune') {
    const dryRun = args.includes('--dry-run');
    const minIdx = args.indexOf('--min-confidence');
    const minConfidence = minIdx !== -1 ? Number(args[minIdx + 1]) : 0.2;
    const res = await pruneExpired({ dryRun, minConfidence });
    console.log(`🧹 Memory Prune (${dryRun ? 'DRY RUN' : 'APPLIED'}):`);
    console.log(`   Before: ${res.beforeCount} | After: ${res.afterCount} | Pruned: ${res.prunedCount}\n`);
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
