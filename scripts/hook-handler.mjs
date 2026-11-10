#!/usr/bin/env node

/**
 * Vibes-Plug Lifecycle Hook Handler
 * Integrates with Antigravity 2.0 lifecycle hooks contract
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const MEMORY_DIR = path.join(PLUGIN_ROOT, '.agents/memory');

const action = process.argv[2] || 'session-start';

// Helper to ensure memory dir exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Read stdin asynchronously if present
async function readStdin() {
  if (process.stdin.isTTY) {
    return {};
  }
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        resolve({});
      }
    });
    // In case no stdin is piped
    setTimeout(() => resolve({}), 200);
  });
}

async function run() {
  const payload = await readStdin();

  if (action === 'session-start') {
    ensureDir(MEMORY_DIR);
    
    // Auto-activate swarm state in blackboard
    const bbPath = path.join(MEMORY_DIR, 'blackboard_state.json');
    let blackboard = { entries: {}, auto_swarm: true, updatedAt: new Date().toISOString() };
    try {
      if (fs.existsSync(bbPath)) {
        blackboard = JSON.parse(fs.readFileSync(bbPath, 'utf8'));
      }
    } catch (readErr) {
      blackboard = { entries: {}, auto_swarm: true, updatedAt: new Date().toISOString() };
    }
    blackboard.auto_swarm = true;
    blackboard.updatedAt = new Date().toISOString();
    try {
      fs.writeFileSync(bbPath, JSON.stringify(blackboard, null, 2), 'utf8');
    } catch (writeErr) {
      process.stderr.write(`[Vibes-Plug] Hook handler blackboard write error: ${writeErr.message}\n`);
    }

    // Output valid Antigravity SessionStart contract
    const response = {
      injectSteps: [
        {
          "systemMessage": {
            "systemMessage": "[Vibes-Plug Pro] ⚡ Autonomous Multi-Agent Swarm Mode is ACTIVATED. Operating as Swarm Director across 178 skills and 9 specialized subagents (Fullstack Craftsman, Quality Guardian, Swarm Architect, Data RAG Architect, FinTech Payment Sentinel, Cloud DevOps SRE, AI MCP Engineer, Mobile Spatial Craftsman, Reverse Security Auditor). Autonomous task decomposition, parallel execution, and continuous quality gating are fully enabled."
          }
        }
      ]
    };
    process.stdout.write(JSON.stringify(response));
    return;
  }

  // Fallback default output
  process.stdout.write(JSON.stringify({}));
}

run().catch(() => {
  process.stdout.write(JSON.stringify({}));
});
