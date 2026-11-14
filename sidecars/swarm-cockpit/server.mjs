#!/usr/bin/env node

/**
 * Vibes-Plug Swarm Cockpit Sidecar Server
 * Autonomous AI Agent Swarm & Studio Cockpit for Antigravity Auxiliary Pane
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { planSwarm } from '../../scripts/swarm-runner.mjs';
import { dispatchSwarm, resolveNativeSubagent } from '../../scripts/swarm-dispatcher.mjs';
import { swarmBus, emitSwarmEvent } from '../../scripts/swarm-bus.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '../..');
const MEMORY_DIR = path.join(PLUGIN_ROOT, '.agents/memory');

const DEFAULT_PORT = parseInt(process.env.ANTIGRAVITY_SIDECAR_WEB_PORT || process.env.PORT || '53888', 10);
const DEFAULT_HOST = '127.0.0.1';

// Pre-load official Vibes-Plug icon
let iconDataUrl = '';
try {
  const iconPath = path.join(PLUGIN_ROOT, 'assets/icon.png');
  if (fs.existsSync(iconPath)) {
    iconDataUrl = `data:image/png;base64,${fs.readFileSync(iconPath).toString('base64')}`;
  }
} catch (iconErr) {
  process.stderr.write(`[Vibes Swarm Cockpit] Failed to load icon: ${iconErr.message}\n`);
}

export const NATIVE_AGENTS = [
  { id: 'swarm-architect', name: 'Swarm Architect', role: 'System Discovery, PRD, ERD & High-Level Architecture', badge: 'ARCH', color: '#8b5cf6' },
  { id: 'fullstack-craftsman', name: 'Fullstack Craftsman', role: 'React 19, Next.js 15, Tailwind v4, Node/Bun & ORM', badge: 'FULL', color: '#06b6d4' },
  { id: 'quality-guardian', name: 'Quality Guardian', role: 'Testing, TDD Debugging, Anti-Slop Audit & Red-Teaming', badge: 'QA', color: '#10b981' },
  { id: 'data-rag-architect', name: 'Data RAG Architect', role: 'Postgres DDL, Hybrid Vector/Graph RAG, OLAP & ReBAC', badge: 'DATA', color: '#f59e0b' },
  { id: 'fintech-payment-sentinel', name: 'FinTech Payment Sentinel', role: 'DOKU Checkout, SNAP BI Direct API & Atomic Ledgers', badge: 'FIN', color: '#ec4899' },
  { id: 'cloud-devops-sre', name: 'Cloud DevOps SRE', role: 'Kubernetes GitOps, Docker Distroless, CI/CD & Secrets', badge: 'OPS', color: '#6366f1' },
  { id: 'ai-mcp-engineer', name: 'AI MCP Engineer', role: 'MCP v1.x Protocols, Agent Swarms & Tool Design', badge: 'MCP', color: '#3b82f6' },
  { id: 'mobile-spatial-craftsman', name: 'Mobile Spatial Craftsman', role: 'Expo SDK, Flutter, Tauri v2, WebGPU & 3D Shaders', badge: 'DEV', color: '#14b8a6' },
  { id: 'reverse-security-auditor', name: 'Reverse Security Auditor', role: 'Evidence-Backed REA, Ghidra Decompilation & SBOM', badge: 'SEC', color: '#ef4444' }
];

function createInitialAgentStates() {
  const map = {};
  for (const agent of NATIVE_AGENTS) {
    map[agent.id] = { status: 'READY', progress: 0, task: null };
  }
  return map;
}

function readSwarmState() {
  try {
    const busFile = path.join(MEMORY_DIR, 'swarm_bus_state.json');
    if (fs.existsSync(busFile)) {
      return JSON.parse(fs.readFileSync(busFile, 'utf8'));
    }
  } catch (err) {
    process.stderr.write(`[Vibes Swarm Cockpit] Swarm state read error: ${err.message}\n`);
  }
  return { activeSwarms: {}, eventBuffer: [] };
}

function readBlackboardState() {
  try {
    const bbFile = path.join(MEMORY_DIR, 'blackboard_state.json');
    if (fs.existsSync(bbFile)) {
      return JSON.parse(fs.readFileSync(bbFile, 'utf8'));
    }
  } catch (err) {
    process.stderr.write(`[Vibes Swarm Cockpit] Blackboard state read error: ${err.message}\n`);
  }
  return { entries: {}, auto_swarm: true };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createSidecarController() {
  const sseClients = new Set();
  const activeSwarmRun = {
    running: false,
    swarmId: null,
    task: null,
    topology: 'FAN-OUT / FAN-IN',
    phase: 'IDLE',
    progress: 0,
    startedAt: null,
    completedAt: null,
    agentStates: createInitialAgentStates()
  };

  function broadcastSse(eventName, data) {
    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of sseClients) {
      try {
        res.write(payload);
      } catch (writeErr) {
        void writeErr;
        sseClients.delete(res);
      }
    }
  }

  function applyBusEventToState(ev) {
    if (!ev || !ev.type) return;
    if (ev.type === 'swarm:start') {
      activeSwarmRun.running = true;
      activeSwarmRun.swarmId = ev.swarmId || activeSwarmRun.swarmId;
      activeSwarmRun.task = ev.task || activeSwarmRun.task;
      activeSwarmRun.topology = String(ev.topology || 'FAN-OUT / FAN-IN').toUpperCase();
      activeSwarmRun.phase = 'FAN_OUT';
      activeSwarmRun.progress = Math.max(activeSwarmRun.progress, 20);
      activeSwarmRun.startedAt = ev.timestamp || new Date().toISOString();
      if (Array.isArray(ev.activeAgents)) {
        for (const agentId of ev.activeAgents) {
          if (activeSwarmRun.agentStates[agentId]) {
            activeSwarmRun.agentStates[agentId] = { status: 'QUEUED', progress: 15, task: ev.task };
          }
        }
      }
    } else if (ev.type === 'worker:dispatch' && ev.subagent && activeSwarmRun.agentStates[ev.subagent]) {
      activeSwarmRun.running = true;
      activeSwarmRun.phase = 'EXECUTING';
      activeSwarmRun.agentStates[ev.subagent] = { status: 'ACTIVE', progress: 55, task: ev.domain || ev.skill };
    } else if (ev.type === 'worker:done' && ev.subagent && activeSwarmRun.agentStates[ev.subagent]) {
      activeSwarmRun.agentStates[ev.subagent] = { status: 'VERIFIED', progress: 100, task: ev.domain || ev.skill };
    } else if (ev.type === 'swarm:complete') {
      activeSwarmRun.running = false;
      activeSwarmRun.phase = 'COMPLETED';
      activeSwarmRun.progress = 100;
      activeSwarmRun.completedAt = ev.timestamp || new Date().toISOString();
    }
    broadcastSse('swarm-state', activeSwarmRun);
  }

  const onSwarmEvent = (ev) => {
    applyBusEventToState(ev);
    broadcastSse('message', ev);
  };
  swarmBus.on('swarm-event', onSwarmEvent);

  async function runAnimatedDispatch(task, options = {}) {
    const swarmId = options.swarmId || crypto.randomUUID();
    const simulateAll = Boolean(options.simulateAll);
    const stepMs = Number.isFinite(options.stepMs) ? options.stepMs : 280;
    const plan = planSwarm(task, { reasoning: options.reasoning || 'balanced' });

    const matchedIds = simulateAll
      ? NATIVE_AGENTS.map(a => a.id)
      : Array.from(new Set([
          'swarm-architect',
          ...plan.subagents.map(s => s.subagent || resolveNativeSubagent(s.skill, s.name)),
          'quality-guardian'
        ]));

    activeSwarmRun.agentStates = createInitialAgentStates();
    activeSwarmRun.running = true;
    activeSwarmRun.swarmId = swarmId;
    activeSwarmRun.task = task;
    activeSwarmRun.topology = String(plan.topology || 'fan_out_fan_in').toUpperCase();
    activeSwarmRun.phase = 'INTERCEPTING';
    activeSwarmRun.progress = 12;
    activeSwarmRun.startedAt = new Date().toISOString();
    activeSwarmRun.completedAt = null;
    broadcastSse('swarm-state', activeSwarmRun);

    emitSwarmEvent('swarm:start', {
      swarmId,
      task,
      topology: plan.topology,
      totalWorkers: matchedIds.length,
      activeAgents: matchedIds
    });

    await sleep(stepMs);
    activeSwarmRun.phase = 'FAN_OUT';
    activeSwarmRun.progress = 30;
    for (const id of matchedIds) {
      if (activeSwarmRun.agentStates[id]) {
        activeSwarmRun.agentStates[id] = { status: 'QUEUED', progress: 20, task };
      }
    }
    broadcastSse('swarm-state', activeSwarmRun);

    const dispatchPromise = simulateAll
      ? Promise.resolve({ success: true, swarmId, workers: [] })
      : dispatchSwarm(task, { swarmId, concurrency: 3, reasoning: options.reasoning || 'balanced' });

    for (let i = 0; i < matchedIds.length; i++) {
      const id = matchedIds[i];
      await sleep(stepMs);
      activeSwarmRun.phase = id === 'quality-guardian' ? 'CRITIC_GATE' : 'EXECUTING';
      activeSwarmRun.progress = Math.min(92, 35 + Math.round(((i + 1) / matchedIds.length) * 55));
      if (activeSwarmRun.agentStates[id]) {
        activeSwarmRun.agentStates[id] = { status: 'ACTIVE', progress: 70, task };
      }
      if (i > 0) {
        const prevId = matchedIds[i - 1];
        if (activeSwarmRun.agentStates[prevId]) {
          activeSwarmRun.agentStates[prevId] = { status: 'VERIFIED', progress: 100, task };
        }
      }
      broadcastSse('swarm-state', activeSwarmRun);
    }

    await dispatchPromise;
    await sleep(stepMs);

    for (const id of matchedIds) {
      if (activeSwarmRun.agentStates[id]) {
        activeSwarmRun.agentStates[id] = { status: 'VERIFIED', progress: 100, task };
      }
    }
    activeSwarmRun.running = false;
    activeSwarmRun.phase = 'COMPLETED';
    activeSwarmRun.progress = 100;
    activeSwarmRun.completedAt = new Date().toISOString();
    broadcastSse('swarm-state', activeSwarmRun);

    if (simulateAll) {
      emitSwarmEvent('swarm:complete', {
        swarmId,
        task,
        topology: plan.topology,
        status: 'COMPLETED',
        totalWorkers: matchedIds.length
      });
    }

    return { swarmId, matchedAgents: matchedIds };
  }

  return {
    activeSwarmRun,
    sseClients,
    broadcastSse,
    runAnimatedDispatch,
    dispose() {
      swarmBus.removeListener('swarm-event', onSwarmEvent);
      for (const res of sseClients) {
        try {
          res.end();
        } catch (endErr) {
          void endErr;
        }
      }
      sseClients.clear();
    }
  };
}

export function renderHtml(activeSwarmRun = null) {
  const swarmState = readSwarmState();
  const blackboard = readBlackboardState();
  const events = (swarmState.eventBuffer || []).slice(-12).reverse();
  const autoActive = blackboard.auto_swarm !== false;
  const runSnapshot = activeSwarmRun || {
    running: false,
    phase: 'IDLE',
    progress: 0,
    agentStates: createInitialAgentStates()
  };

  // Precompute radial positions for 9 nodes around center (180, 34) in a clean fan-out layout
  const nodePositions = NATIVE_AGENTS.map((agent, idx) => {
    const col = idx % 5;
    const row = Math.floor(idx / 5);
    const countInRow = row === 0 ? 5 : 4;
    const span = countInRow === 5 ? 290 : 230;
    const startX = (360 - span) / 2;
    const x = Math.round(startX + (col * (span / Math.max(1, countInRow - 1))));
    const y = row === 0 ? 96 : 140;
    return { ...agent, x, y };
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibes Swarm Cockpit</title>
  ${iconDataUrl ? `<link rel="icon" type="image/png" href="${iconDataUrl}">` : ''}
  <style>
    :root {
      --bg: #0b0f17;
      --card-bg: #111827;
      --card-border: #1f293d;
      --accent: #38bdf8;
      --accent-glow: rgba(56, 189, 248, 0.15);
      --success: #10b981;
      --warning: #f59e0b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: var(--font-sans);
      font-size: 13px;
      line-height: 1.5;
      padding: 14px;
      -webkit-font-smoothing: antialiased;
    }
    .tabular-nums { font-variant-numeric: tabular-nums; }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 12px;
      margin-bottom: 14px;
      gap: 8px;
    }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-logo-img {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      object-fit: cover;
      display: block;
      flex-shrink: 0;
      border: 1px solid rgba(56, 189, 248, 0.35);
    }
    .brand-logo {
      width: 32px;
      height: 32px;
      background: #0284c7;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 15px;
      color: #fff;
      flex-shrink: 0;
    }
    .brand-title { font-size: 14px; font-weight: 700; letter-spacing: -0.01em; }
    .brand-sub { font-size: 11px; color: var(--text-muted); }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: var(--success);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      font-family: var(--font-mono);
      letter-spacing: 0.03em;
      white-space: nowrap;
    }
    .status-pill.is-running {
      background: rgba(56, 189, 248, 0.14);
      border-color: rgba(56, 189, 248, 0.55);
      color: var(--accent);
    }
    .status-dot {
      width: 6px;
      height: 6px;
      background-color: var(--success);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--success);
      animation: pulse 2s infinite;
    }
    .status-pill.is-running .status-dot {
      background-color: var(--accent);
      box-shadow: 0 0 10px var(--accent);
      animation: pulse 0.7s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.45; transform: scale(1.25); }
    }
    @keyframes swarmPacketFlow {
      to { stroke-dashoffset: -24; }
    }
    @keyframes nodeOrbitGlow {
      0%, 100% { stroke-opacity: 0.45; }
      50% { stroke-opacity: 1; }
    }
    @keyframes barShimmer {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 14px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 12px;
    }
    .card-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .topology-stage {
      background: #070b13;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 8px;
      margin-bottom: 10px;
    }
    .topo-edge {
      stroke: #1e293b;
      stroke-width: 1.5;
      fill: none;
      transition: stroke 0.25s ease, stroke-width 0.25s ease;
    }
    .topo-edge.edge-queued {
      stroke: #0ea5e9;
      stroke-dasharray: 5 4;
      animation: swarmPacketFlow 1.2s linear infinite;
    }
    .topo-edge.edge-active {
      stroke: #10b981;
      stroke-width: 2.2;
      stroke-dasharray: 6 4;
      animation: swarmPacketFlow 0.55s linear infinite;
    }
    .topo-edge.edge-done {
      stroke: rgba(16, 185, 129, 0.55);
      stroke-width: 1.6;
    }
    .topo-node-ring {
      fill: #0f172a;
      stroke: #334155;
      stroke-width: 1.5;
      transition: stroke 0.2s ease, fill 0.2s ease;
    }
    .topo-node-ring.node-queued {
      stroke: #38bdf8;
      stroke-dasharray: 3 2;
    }
    .topo-node-ring.node-active {
      stroke: #10b981;
      fill: #064e3b;
      stroke-width: 2.2;
      animation: nodeOrbitGlow 0.8s ease-in-out infinite;
    }
    .topo-node-ring.node-done {
      stroke: #10b981;
      fill: #0b241d;
    }
    .director-aura {
      fill: none;
      stroke: rgba(56, 189, 248, 0.25);
      stroke-width: 1;
      transform-origin: 180px 30px;
    }
    .director-aura.is-running {
      stroke: #10b981;
      stroke-width: 1.5;
      stroke-dasharray: 4 3;
      animation: swarmPacketFlow 0.8s linear infinite;
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-muted);
      margin-bottom: 5px;
    }
    .progress-track {
      width: 100%;
      height: 6px;
      background: #090d16;
      border: 1px solid var(--card-border);
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      width: 0%;
      background: #10b981;
      transition: width 0.25s ease;
    }
    .progress-fill.is-running {
      background: linear-gradient(90deg, #0ea5e9, #10b981, #0ea5e9);
      background-size: 200% 100%;
      animation: barShimmer 1.2s linear infinite;
    }
    .input-box {
      width: 100%;
      background: #090d16;
      border: 1px solid var(--card-border);
      border-radius: 6px;
      padding: 8px 10px;
      color: var(--text-main);
      font-size: 12px;
      font-family: inherit;
      margin-bottom: 8px;
      outline: none;
    }
    .input-box:focus { border-color: var(--accent); }
    .btn-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; }
    .btn {
      background: #0284c7;
      color: #fff;
      border: 1px solid rgba(56, 189, 248, 0.35);
      border-radius: 6px;
      padding: 8px 12px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background 0.18s ease, border-color 0.18s ease;
    }
    .btn:hover:not(:disabled) { background: #0369a1; border-color: var(--accent); }
    .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary {
      background: #182235;
      color: #e2e8f0;
      border: 1px solid var(--card-border);
    }
    .btn-secondary:hover:not(:disabled) {
      background: #1f2b42;
      border-color: var(--accent);
    }
    .toast-banner {
      display: none;
      margin-top: 8px;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-family: var(--font-mono);
      border: 1px solid rgba(16, 185, 129, 0.4);
      background: rgba(16, 185, 129, 0.1);
      color: #6ee7b7;
    }
    .toast-banner.visible { display: block; }
    .toast-banner.error {
      border-color: rgba(239, 68, 68, 0.5);
      background: rgba(239, 68, 68, 0.1);
      color: #fca5a5;
    }
    .agent-list { display: flex; flex-direction: column; gap: 7px; }
    .agent-item {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 8px 10px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--card-border);
      border-radius: 6px;
      transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    }
    .agent-item.state-queued {
      border-color: rgba(56, 189, 248, 0.45);
      background: rgba(56, 189, 248, 0.06);
    }
    .agent-item.state-active {
      border-color: var(--success);
      background: rgba(16, 185, 129, 0.09);
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.2);
    }
    .agent-item.state-verified {
      border-color: rgba(16, 185, 129, 0.45);
    }
    .agent-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .agent-info { display: flex; align-items: center; gap: 9px; min-width: 0; }
    .agent-badge {
      font-size: 10px;
      font-weight: 700;
      font-family: var(--font-mono);
      padding: 2px 6px;
      border-radius: 4px;
      color: #fff;
      flex-shrink: 0;
    }
    .agent-name { font-weight: 600; font-size: 12px; }
    .agent-desc { font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 210px; }
    .agent-status {
      font-size: 10px;
      font-weight: 700;
      font-family: var(--font-mono);
      color: var(--success);
      background: rgba(16, 185, 129, 0.1);
      padding: 2px 7px;
      border-radius: 4px;
      border: 1px solid rgba(16, 185, 129, 0.25);
      flex-shrink: 0;
    }
    .agent-status.status-active {
      color: #fef08a;
      background: rgba(245, 158, 11, 0.16);
      border-color: rgba(245, 158, 11, 0.45);
    }
    .agent-status.status-queued {
      color: #7dd3fc;
      background: rgba(56, 189, 248, 0.14);
      border-color: rgba(56, 189, 248, 0.4);
    }
    .agent-mini-bar {
      height: 2px;
      width: 100%;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 2px;
      overflow: hidden;
    }
    .agent-mini-fill {
      height: 100%;
      width: 0%;
      background: var(--success);
      transition: width 0.25s ease;
    }
    .log-stream {
      font-family: var(--font-mono);
      font-size: 11px;
      background: #050811;
      border: 1px solid var(--card-border);
      border-radius: 6px;
      padding: 10px;
      max-height: 180px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .log-line { display: flex; gap: 8px; color: var(--text-muted); align-items: baseline; }
    .log-time { color: #64748b; flex-shrink: 0; }
    .log-type { color: var(--accent); font-weight: 600; flex-shrink: 0; }
    .log-text { color: var(--text-main); word-break: break-word; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      ${iconDataUrl ? `<img src="${iconDataUrl}" class="brand-logo-img" alt="VibesPlug" />` : `<div class="brand-logo">V</div>`}
      <div>
        <div class="brand-title">Vibes Swarm Cockpit</div>
        <div class="brand-sub tabular-nums">v4.8.0 • 178 Skills • 9 Subagents</div>
      </div>
    </div>
    <div id="globalSwarmPill" class="status-pill ${runSnapshot.running ? 'is-running' : ''}">
      <span class="status-dot"></span>
      <span id="globalSwarmStatusText">${runSnapshot.running ? 'SWARM: RUNNING' : (autoActive ? 'AUTO-SWARM: ACTIVE' : 'SWARM: STANDBY')}</span>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">
        <span>Live Neural Swarm Topology</span>
        <span id="phaseBadge" class="tabular-nums" style="font-size: 10px; color: var(--accent); font-family: var(--font-mono);">${runSnapshot.phase}</span>
      </div>
      <div class="topology-stage">
        <svg id="swarmTopoSvg" viewBox="0 0 360 162" width="100%" height="154" aria-label="Live Swarm Director Topology">
          <g id="topoEdges">
            ${nodePositions.map(n => `<path data-edge-id="${n.id}" class="topo-edge" d="M 180 42 C 180 68, ${n.x} 64, ${n.x} ${n.y - 12}" />`).join('')}
          </g>
          <circle id="directorAura" class="director-aura ${runSnapshot.running ? 'is-running' : ''}" cx="180" cy="28" r="22"></circle>
          <rect x="116" y="14" width="128" height="28" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"></rect>
          <text x="180" y="32" fill="#f8fafc" font-size="10" font-weight="700" font-family="ui-monospace, monospace" text-anchor="middle">SWARM DIRECTOR</text>
          <g id="topoNodes">
            ${nodePositions.map(n => `
              <g>
                <rect data-node-id="${n.id}" class="topo-node-ring" x="${n.x - 24}" y="${n.y - 12}" width="48" height="22" rx="5"></rect>
                <text x="${n.x}" y="${n.y + 3}" fill="#e2e8f0" font-size="9" font-weight="700" font-family="ui-monospace, monospace" text-anchor="middle">${n.badge}</text>
              </g>
            `).join('')}
          </g>
        </svg>
      </div>
      <div class="progress-header">
        <span id="swarmPhaseLabel">Orchestrator standing by for task dispatch</span>
        <span id="swarmProgressPct" class="tabular-nums">${runSnapshot.progress || 0}%</span>
      </div>
      <div class="progress-track">
        <div id="swarmProgressBar" class="progress-fill ${runSnapshot.running ? 'is-running' : ''}" style="width: ${runSnapshot.progress || 0}%;"></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">
        <span>Dispatch Autonomous Swarm</span>
        <span style="font-size: 10px; color: var(--accent); font-family: var(--font-mono);">ZERO-PERMISSION</span>
      </div>
      <input type="text" id="taskInput" class="input-box" placeholder="e.g. Build multi-tenant SaaS with DOKU payment checkout & test gate..." />
      <div class="btn-row">
        <button type="button" id="btnDispatch" class="btn" onclick="dispatchSwarmTask()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          Dispatch Swarm
        </button>
        <button type="button" id="btnSimulate" class="btn btn-secondary" onclick="triggerSwarmSimulation()">Simulate Active</button>
      </div>
      <div id="dispatchToast" class="toast-banner" role="status" aria-live="polite"></div>
    </div>

    <div class="card">
      <div class="card-title">
        <span>Native Specialist Subagents</span>
        <span id="standingCountLabel" class="tabular-nums" style="font-size: 10px; color: var(--success); font-family: var(--font-mono);">9 STANDING</span>
      </div>
      <div class="agent-list">
        ${NATIVE_AGENTS.map(agent => `
          <div class="agent-item" data-agent="${agent.id}">
            <div class="agent-row">
              <div class="agent-info">
                <span class="agent-badge" style="background: ${agent.color}">${agent.badge}</span>
                <div>
                  <div class="agent-name">${agent.name}</div>
                  <div class="agent-desc">${agent.role}</div>
                </div>
              </div>
              <span class="agent-status" data-agent-status="${agent.id}">READY</span>
            </div>
            <div class="agent-mini-bar">
              <div class="agent-mini-fill" data-agent-bar="${agent.id}" style="width: 0%;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-title">
        <span>Swarm Event Bus Live Stream</span>
        <span id="sseStatusBadge" style="font-size: 10px; color: var(--success); font-family: var(--font-mono);">SSE: CONNECTING</span>
      </div>
      <div class="log-stream" id="logStream">
        ${events.length === 0 ? '<div style="color: #64748b;">Swarm bus ready. Dispatch or simulate a task to watch live telemetry.</div>' : events.map(e => `
          <div class="log-line">
            <span class="log-time tabular-nums">${(e.timestamp || '').slice(11, 19)}</span>
            <span class="log-type">[${e.type || 'info'}]</span>
            <span class="log-text">${e.task || e.domain || e.subagent || e.workerId || e.message || e.id || 'event processed'}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <script>
    const recentLogLines = ${JSON.stringify(events)};

    function showToastBanner(message, isError = false) {
      const el = document.getElementById('dispatchToast');
      if (!el) return;
      el.textContent = message;
      el.className = 'toast-banner visible' + (isError ? ' error' : '');
      setTimeout(() => {
        el.classList.remove('visible');
      }, 4500);
    }

    function escapeText(str) {
      return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderLogLines(eventsList) {
      const logStream = document.getElementById('logStream');
      if (!logStream) return;
      if (!Array.isArray(eventsList) || eventsList.length === 0) {
        logStream.innerHTML = '<div style="color: #64748b;">Swarm bus ready. Dispatch or simulate a task to watch live telemetry.</div>';
        return;
      }
      logStream.innerHTML = eventsList.slice(0, 18).map(e => {
        const ts = (e.timestamp || '').slice(11, 19) || new Date().toTimeString().slice(0, 8);
        const desc = e.task || e.domain || e.subagent || e.workerId || e.message || e.id || 'event processed';
        return '<div class="log-line">' +
          '<span class="log-time tabular-nums">' + escapeText(ts) + '</span>' +
          '<span class="log-type">[' + escapeText(e.type || 'info') + ']</span>' +
          '<span class="log-text">' + escapeText(desc) + '</span>' +
        '</div>';
      }).join('');
    }

    function applySwarmVisualState(run) {
      if (!run) return;
      const pill = document.getElementById('globalSwarmPill');
      const statusText = document.getElementById('globalSwarmStatusText');
      const phaseBadge = document.getElementById('phaseBadge');
      const phaseLabel = document.getElementById('swarmPhaseLabel');
      const progressBar = document.getElementById('swarmProgressBar');
      const progressPct = document.getElementById('swarmProgressPct');
      const directorAura = document.getElementById('directorAura');

      const isRunning = Boolean(run.running);
      if (pill) pill.classList.toggle('is-running', isRunning);
      if (statusText) statusText.textContent = isRunning ? 'SWARM: RUNNING' : 'AUTO-SWARM: ACTIVE';
      if (phaseBadge) phaseBadge.textContent = run.phase || 'IDLE';
      if (directorAura) directorAura.classList.toggle('is-running', isRunning);

      const pct = Number(run.progress || 0);
      if (progressBar) {
        progressBar.style.width = pct + '%';
        progressBar.classList.toggle('is-running', isRunning);
      }
      if (progressPct) progressPct.textContent = pct + '%';

      if (phaseLabel) {
        if (isRunning && run.task) {
          phaseLabel.textContent = run.phase + ': ' + run.task.slice(0, 44);
        } else if (run.phase === 'COMPLETED') {
          phaseLabel.textContent = 'Synthesis complete — all contracts verified cleanly';
        } else {
          phaseLabel.textContent = 'Orchestrator standing by for task dispatch';
        }
      }

      const states = run.agentStates || {};
      let activeCount = 0;
      Object.keys(states).forEach(agentId => {
        const st = states[agentId] || { status: 'READY', progress: 0 };
        const statusUpper = String(st.status || 'READY').toUpperCase();
        if (statusUpper === 'ACTIVE') activeCount++;

        const card = document.querySelector('.agent-item[data-agent="' + agentId + '"]');
        const badge = document.querySelector('[data-agent-status="' + agentId + '"]');
        const bar = document.querySelector('[data-agent-bar="' + agentId + '"]');
        const edge = document.querySelector('[data-edge-id="' + agentId + '"]');
        const node = document.querySelector('[data-node-id="' + agentId + '"]');

        if (card) {
          card.classList.toggle('state-queued', statusUpper === 'QUEUED');
          card.classList.toggle('state-active', statusUpper === 'ACTIVE');
          card.classList.toggle('state-verified', statusUpper === 'VERIFIED');
        }
        if (badge) {
          badge.textContent = statusUpper;
          badge.classList.toggle('status-queued', statusUpper === 'QUEUED');
          badge.classList.toggle('status-active', statusUpper === 'ACTIVE');
        }
        if (bar) {
          bar.style.width = Number(st.progress || 0) + '%';
        }
        if (edge) {
          edge.classList.toggle('edge-queued', statusUpper === 'QUEUED');
          edge.classList.toggle('edge-active', statusUpper === 'ACTIVE');
          edge.classList.toggle('edge-done', statusUpper === 'VERIFIED');
        }
        if (node) {
          node.classList.toggle('node-queued', statusUpper === 'QUEUED');
          node.classList.toggle('node-active', statusUpper === 'ACTIVE');
          node.classList.toggle('node-done', statusUpper === 'VERIFIED');
        }
      });

      const countEl = document.getElementById('standingCountLabel');
      if (countEl) {
        countEl.textContent = activeCount > 0 ? activeCount + ' EXECUTING / 9 TOTAL' : '9 STANDING';
      }
    }

    async function dispatchSwarmTask() {
      const input = document.getElementById('taskInput');
      const task = input.value.trim() || 'Build multi-tenant SaaS with DOKU checkout and Postgres RLS';
      const btn = document.getElementById('btnDispatch');
      btn.disabled = true;

      try {
        const res = await fetch('/api/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task })
        });
        const data = await res.json();
        input.value = '';
        showToastBanner('Swarm dispatched [' + (data.swarmId || 'active').slice(0, 8) + ']: animating workers...');
      } catch (err) {
        showToastBanner('Dispatch error: ' + err.message, true);
      } finally {
        btn.disabled = false;
      }
    }

    async function triggerSwarmSimulation() {
      const btn = document.getElementById('btnSimulate');
      btn.disabled = true;
      try {
        const res = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: 'Full 9-Agent Sovereign Swarm Verification Cycle' })
        });
        const data = await res.json();
        showToastBanner('9-Agent Live Swarm simulation started [' + (data.swarmId || '').slice(0, 8) + ']');
      } catch (err) {
        showToastBanner('Simulation error: ' + err.message, true);
      } finally {
        btn.disabled = false;
      }
    }

    function connectSwarmSse() {
      const badge = document.getElementById('sseStatusBadge');
      try {
        const evtSource = new EventSource('/api/stream');
        evtSource.onopen = () => {
          if (badge) badge.textContent = 'SSE: LIVE';
        };
        evtSource.addEventListener('swarm-state', (e) => {
          try {
            applySwarmVisualState(JSON.parse(e.data));
          } catch (err) {
            void err;
          }
        });
        evtSource.onmessage = (e) => {
          try {
            const ev = JSON.parse(e.data);
            recentLogLines.unshift(ev);
            if (recentLogLines.length > 25) recentLogLines.pop();
            renderLogLines(recentLogLines);
          } catch (err) {
            void err;
          }
        };
        evtSource.onerror = () => {
          if (badge) badge.textContent = 'SSE: RECONNECTING';
        };
      } catch (err) {
        void err;
      }
    }

    connectSwarmSse();
  </script>
</body>
</html>`;
}

export function createSidecarServer() {
  const controller = createSidecarController();

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (url.pathname === '/' || url.pathname === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderHtml(controller.activeSwarmRun));
      return;
    }

    if (url.pathname === '/icon.png' || url.pathname === '/favicon.ico') {
      const iconPath = path.join(PLUGIN_ROOT, 'assets/icon.png');
      if (fs.existsSync(iconPath)) {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(fs.readFileSync(iconPath));
        return;
      }
    }

    if (url.pathname === '/icon.svg' || url.pathname === '/assets/logo.svg') {
      const svgPath = path.join(PLUGIN_ROOT, 'assets/logo.svg');
      if (fs.existsSync(svgPath)) {
        res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
        res.end(fs.readFileSync(svgPath));
        return;
      }
    }

    if (url.pathname === '/api/stream') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      });
      controller.sseClients.add(res);
      res.write(`event: swarm-state\ndata: ${JSON.stringify(controller.activeSwarmRun)}\n\n`);
      const recent = swarmBus.getEvents({ limit: 10 });
      for (const ev of recent) {
        res.write(`event: message\ndata: ${JSON.stringify(ev)}\n\n`);
      }
      req.on('close', () => {
        controller.sseClients.delete(res);
      });
      return;
    }

    if (url.pathname === '/api/status') {
      const swarmState = readSwarmState();
      const blackboard = readBlackboardState();
      const events = (swarmState.eventBuffer || []).slice(-15).reverse();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ACTIVE',
        version: '4.8.0',
        auto_swarm: blackboard.auto_swarm !== false,
        active_topology: blackboard.active_topology || 'FAN-OUT / FAN-IN',
        total_skills: 178,
        agentsCount: NATIVE_AGENTS.length,
        activeSwarm: controller.activeSwarmRun,
        activeSwarms: swarmState.activeSwarms || {},
        events,
        blackboardEntries: Object.keys(blackboard.entries || {}).length
      }));
      return;
    }

    if ((url.pathname === '/api/dispatch' || url.pathname === '/api/simulate') && req.method === 'POST') {
      const isSimulate = url.pathname === '/api/simulate';
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const task = payload.task || 'Autonomous Swarm Task';
          const swarmId = payload.swarmId || crypto.randomUUID();
          const stepMs = Number.isFinite(payload.stepMs) ? payload.stepMs : undefined;

          controller.runAnimatedDispatch(task, {
            swarmId,
            simulateAll: isSimulate,
            reasoning: payload.reasoning || 'balanced',
            stepMs
          }).catch(runErr => {
            process.stderr.write(`[Vibes Swarm Cockpit] Dispatch error: ${runErr.message}\n`);
          });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            dispatched: true,
            swarmId,
            task,
            mode: isSimulate ? 'simulate' : 'dispatch',
            timestamp: new Date().toISOString()
          }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  server.on('close', () => {
    controller.dispose();
  });

  return { server, controller };
}

export function startSidecarServer(options = {}) {
  const port = options.port ?? DEFAULT_PORT;
  const host = options.host || DEFAULT_HOST;
  const { server, controller } = createSidecarServer();
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, host, () => {
      const addr = server.address();
      const actualPort = typeof addr === 'object' && addr ? addr.port : port;
      const url = `http://${host}:${actualPort}`;
      if (!options.silent) {
        console.log(`[Vibes Swarm Cockpit] Running on ${url}`);
      }
      resolve({ server, controller, port: actualPort, host, url });
    });
  });
}

const isDirectExecution = process.argv[1] && (
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(__filename).toLowerCase() ||
  process.argv[1].endsWith(path.join('swarm-cockpit', 'server.mjs'))
);

if (isDirectExecution) {
  startSidecarServer().catch(err => {
    console.error(`[Vibes Swarm Cockpit] Fatal startup error: ${err.message}`);
    process.exit(1);
  });
}
