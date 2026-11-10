#!/usr/bin/env node

/**
 * Vibes-Plug Swarm Cockpit Sidecar Server
 * Autonomous AI Agent Swarm & Studio Cockpit for Antigravity Auxiliary Pane
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '../..');
const AGENTS_DIR = path.join(PLUGIN_ROOT, 'agents');
const MEMORY_DIR = path.join(PLUGIN_ROOT, '.agents/memory');

const PORT = parseInt(process.env.ANTIGRAVITY_SIDECAR_WEB_PORT || process.env.PORT || '53888', 10);
const HOST = '127.0.0.1';
const TOKEN = process.env.ANTIGRAVITY_SIDECAR_UI_TOKEN || '';

// Pre-load official Vibes-Plug icon
let iconDataUrl = '';
try {
  const iconPath = path.join(PLUGIN_ROOT, 'assets/icon.png');
  if (fs.existsSync(iconPath)) {
    iconDataUrl = `data:image/png;base64,${fs.readFileSync(iconPath).toString('base64')}`;
  }
} catch (e) {}

const NATIVE_AGENTS = [
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

function readSwarmState() {
  try {
    const busFile = path.join(MEMORY_DIR, 'swarm_bus_state.json');
    if (fs.existsSync(busFile)) {
      return JSON.parse(fs.readFileSync(busFile, 'utf8'));
    }
  } catch (err) {}
  return { activeSwarms: {}, eventBuffer: [] };
}

function readBlackboardState() {
  try {
    const bbFile = path.join(MEMORY_DIR, 'blackboard_state.json');
    if (fs.existsSync(bbFile)) {
      return JSON.parse(fs.readFileSync(bbFile, 'utf8'));
    }
  } catch (err) {}
  return { entries: {}, auto_swarm: true };
}

function renderHtml() {
  const swarmState = readSwarmState();
  const blackboard = readBlackboardState();
  const events = (swarmState.eventBuffer || []).slice(-10).reverse();
  const activeCount = Object.keys(swarmState.activeSwarms || {}).length;

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
      padding: 16px;
      -webkit-font-smoothing: antialiased;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-logo-img {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
      object-fit: cover;
      display: block;
      flex-shrink: 0;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    .brand-logo {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #0284c7, #38bdf8);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 15px;
      color: #fff;
      flex-shrink: 0;
    }
    .brand-title {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .brand-sub {
      font-size: 11px;
      color: var(--text-muted);
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: var(--success);
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      background-color: var(--success);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--success);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 12px;
    }
    .card-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .agent-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .agent-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--card-border);
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    .agent-item:hover {
      border-color: var(--accent);
      background: var(--accent-glow);
    }
    .agent-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .agent-badge {
      font-size: 10px;
      font-weight: 700;
      font-family: var(--font-mono);
      padding: 2px 6px;
      border-radius: 4px;
      color: #fff;
    }
    .agent-name {
      font-weight: 600;
      font-size: 12px;
    }
    .agent-desc {
      font-size: 10px;
      color: var(--text-muted);
    }
    .agent-status {
      font-size: 10px;
      font-weight: 600;
      color: var(--success);
      background: rgba(16, 185, 129, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba(16, 185, 129, 0.2);
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
    .input-box:focus {
      border-color: var(--accent);
    }
    .btn {
      width: 100%;
      background: #0284c7;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 8px 12px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background 0.2s ease;
    }
    .btn:hover {
      background: #0369a1;
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
    .log-line {
      display: flex;
      gap: 8px;
      color: var(--text-muted);
    }
    .log-time {
      color: #64748b;
    }
    .log-type {
      color: var(--accent);
      font-weight: 600;
    }
    .log-text {
      color: var(--text-main);
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      ${iconDataUrl ? `<img src="${iconDataUrl}" class="brand-logo-img" alt="VibesPlug" />` : `<div class="brand-logo">V</div>`}
      <div>
        <div class="brand-title">Vibes Swarm Cockpit</div>
        <div class="brand-sub">178 Skills • 9 Autonomous Subagents</div>
      </div>
    </div>
    <div class="status-pill">
      <span class="status-dot"></span>
      AUTO-SWARM: ACTIVE
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">
        <span>Dispatch Autonomous Swarm</span>
        <span style="font-size: 10px; color: var(--accent); font-family: var(--font-mono);">ZERO-PERMISSION</span>
      </div>
      <input type="text" id="taskInput" class="input-box" placeholder="e.g. Build multi-tenant SaaS with DOKU payment checkout & test gate..." />
      <button class="btn" onclick="dispatchSwarm()">
        <span>⚡</span> Dispatch Multi-Agent Swarm
      </button>
    </div>

    <div class="card">
      <div class="card-title">
        <span>Native Specialist Subagents</span>
        <span style="font-size: 10px; color: var(--success); font-family: var(--font-mono);">9 STANDING</span>
      </div>
      <div class="agent-list">
        ${NATIVE_AGENTS.map(agent => `
          <div class="agent-item">
            <div class="agent-info">
              <span class="agent-badge" style="background: ${agent.color}">${agent.badge}</span>
              <div>
                <div class="agent-name">${agent.name}</div>
                <div class="agent-desc">${agent.role}</div>
              </div>
            </div>
            <span class="agent-status">READY</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-title">
        <span>Swarm Event Bus Live Stream</span>
        <span style="font-size: 10px; color: var(--text-muted); font-family: var(--font-mono);">EVENT-DRIVEN</span>
      </div>
      <div class="log-stream" id="logStream">
        ${events.length === 0 ? '<div style="color: #64748b;">No recent events. Swarm engine is idling and ready.</div>' : events.map(e => `
          <div class="log-line">
            <span class="log-time">${(e.timestamp || '').slice(11, 19)}</span>
            <span class="log-type">[${e.type || 'info'}]</span>
            <span class="log-text">${e.task || e.workerId || e.id || 'event processed'}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <script>
    async function dispatchSwarm() {
      const input = document.getElementById('taskInput');
      const task = input.value.trim();
      if (!task) return;
      
      const btn = document.querySelector('.btn');
      btn.innerText = 'Dispatching Swarm...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task })
        });
        const data = await res.json();
        input.value = '';
        alert('⚡ Swarm successfully dispatched: ' + (data.swarmId || 'Active'));
        location.reload();
      } catch (err) {
        alert('Dispatch error: ' + err.message);
      } finally {
        btn.innerHTML = '<span>⚡</span> Dispatch Multi-Agent Swarm';
        btn.disabled = false;
      }
    }

    // Auto-refresh event logs every 5 seconds
    setInterval(async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        if (data && data.events) {
          const logStream = document.getElementById('logStream');
          if (data.events.length > 0) {
            logStream.innerHTML = data.events.map(e => \`
              <div class="log-line">
                <span class="log-time">\${(e.timestamp || '').slice(11, 19)}</span>
                <span class="log-type">[\${e.type || 'info'}]</span>
                <span class="log-text">\${e.task || e.workerId || e.id || 'event processed'}</span>
              </div>
            \`).join('');
          }
        }
      } catch (e) {}
    }, 4000);
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // CORS headers
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
    res.end(renderHtml());
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

  if (url.pathname === '/api/status') {
    const swarmState = readSwarmState();
    const blackboard = readBlackboardState();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ACTIVE',
      auto_swarm: true,
      agentsCount: NATIVE_AGENTS.length,
      activeSwarms: swarmState.activeSwarms || {},
      events: (swarmState.eventBuffer || []).slice(-15).reverse(),
      blackboardEntries: Object.keys(blackboard.entries || {}).length
    }));
    return;
  }

  if (url.pathname === '/api/dispatch' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const task = payload.task || 'Autonomous Swarm Task';
        
        // Spawn headless swarm-dispatcher
        const dispatcherScript = path.join(PLUGIN_ROOT, 'scripts/swarm-dispatcher.mjs');
        const child = spawn(process.execPath, [dispatcherScript, task, '--concurrency', '3'], {
          cwd: PLUGIN_ROOT,
          detached: true,
          stdio: 'ignore'
        });
        child.unref();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          dispatched: true,
          task,
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

server.listen(PORT, HOST, () => {
  console.log(`[Vibes Swarm Cockpit] Running on http://${HOST}:${PORT}`);
});
