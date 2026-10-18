#!/usr/bin/env node

/**
 * Vibes-Plug Studio Cockpit Server
 * Lightweight, zero-dependency local web dashboard for Vibes-Plug Pro.
 * Visualizes the 155 AI domain skills, subagent swarm topologies, superintelligence engines,
 * Visual Recipe Builder, Remote Model Context Protocol (MCP v1.x) SSE transport,
 * Autonomous Swarm Planner & Simulator, Visual Agent Builder, and Episodic Memory Manager.
 * 
 * Usage:
 *   node scripts/studio-server.mjs [--port 3888] [--no-open]
 *   vibes studio [--port 3888] [--no-open]
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

import { TOOLS as MCP_TOOLS, handleRpcRequest } from '../bin/mcp-server.mjs';
import { createCustomAgent } from './create-agent.mjs';
import { planSwarm, executeSwarm } from './swarm-runner.mjs';
import { loadMemory, recordDecision, queryMemory, generateCompactCheckpoint } from './memory-daemon.mjs';
import { compileCache, getCacheStatus } from './compile-cache.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');
const AGENTS_DIR = path.join(PLUGIN_ROOT, 'agents');

const DEFAULT_PORT = 3888;

const DOMAIN_CATEGORIES = {
  frontend: {
    id: 'frontend',
    label: 'Frontend & Mobile UI/UX',
    icon: 'UI',
    color: '#06b6d4'
  },
  backend: {
    id: 'backend',
    label: 'Backend & System Design',
    icon: 'SYS',
    color: '#3b82f6'
  },
  ai: {
    id: 'ai',
    label: 'Frontier AI, LLM & MCP',
    icon: 'AI',
    color: '#a855f7'
  },
  saas: {
    id: 'saas',
    label: 'SaaS, FinTech & Growth',
    icon: 'BIZ',
    color: '#10b981'
  },
  security: {
    id: 'security',
    label: 'Testing, Security & Anti-Slop',
    icon: 'SEC',
    color: '#ef4444'
  },
  data: {
    id: 'data',
    label: 'Data, Media & Orchestration',
    icon: 'DATA',
    color: '#f59e0b'
  }
};

const SKILL_DOMAIN_MAP = {
  // Frontend
  'angular-expert': 'frontend', 'apple-ecosystem-expert': 'frontend', 'astro-framework-expert': 'frontend',
  'blockchain-web3-expert': 'frontend', 'browser-extension-mv3-pro': 'frontend', 'design-system-architect': 'frontend',
  'desktop-electron-expert': 'frontend', 'ephemeral-generative-ui-architect': 'frontend', 'form-validation-expert': 'frontend',
  'global-a11y-i18n-expert': 'frontend', 'glsl-shader-expert': 'frontend', 'hig': 'frontend', 'micro-frontend-architect': 'frontend',
  'mobile-expo-expert': 'frontend', 'modern-css-native-expert': 'frontend', 'mpa-orchestrator': 'frontend',
  'multimodal-spatial-video-cloner': 'frontend', 'nextjs-app-router-expert': 'frontend', 'pwa-offline-first-expert': 'frontend',
  'rich-text-editor-expert': 'frontend', 'screenshot-to-code-expert': 'frontend', 'senior-frontend': 'frontend',
  'solidjs-expert': 'frontend', 'spa-orchestrator': 'frontend', 'state-management-expert': 'frontend',
  'svg-animation-motion-expert': 'frontend', 'svelte-sveltekit-expert': 'frontend', 'tailwind-expert': 'frontend',
  'tanstack-query-expert': 'frontend', 'tauri-expert': 'frontend', 'ui-ux-pro-max': 'frontend', 'vue-frontend-expert': 'frontend',
  'visual-ui-auditor': 'frontend', 'performance-web-vitals': 'frontend', 'web-3d-graphics-expert': 'frontend', 'webxr-ar-vr-expert': 'frontend',

  // Backend
  'api-design-expert': 'backend', 'api-gateway-proxy-expert': 'backend', 'async-queue-temporal-expert': 'backend',
  'autonomous-api-drift-healer': 'backend', 'bun-runtime-expert': 'backend', 'composable-mach-architect': 'backend',
  'cron-scheduler-expert': 'backend', 'domain-driven-design-expert': 'backend', 'ephemeral-wasm-sandbox-executor': 'backend',
  'event-driven-architect': 'backend', 'fullstack-expert': 'backend', 'go-programming-expert': 'backend',
  'graphql-apollo-expert': 'backend', 'js-backend-expert': 'backend', 'legacy-code-translator': 'backend',
  'living-codebase-ast-graph': 'backend', 'monorepo-architect': 'backend', 'mvc-expert': 'backend',
  'openapi-swagger-codegen-expert': 'backend', 'python-programming-expert': 'backend', 'rust-programming-expert': 'backend',
  'scalability-clean-code': 'backend', 'spec-driven-development-expert': 'backend', 'typescript-expert': 'backend',
  'wasm-edge-computing-expert': 'backend', 'web-game-engine-expert': 'backend', 'structured-output-contracts': 'backend',

  // AI & LLM
  'adaptive-model-cascade': 'ai', 'affective-computing-emotion-ai': 'ai', 'agentic-coding-workflow-expert': 'ai',
  'agentic-memory-architect': 'ai', 'agentic-micro-economy-architect': 'ai', 'ai-llm-integration-expert': 'ai',
  'ai-media-generation-expert': 'ai', 'ai-prompt-engineering-expert': 'ai', 'ai-safety-governance-expert': 'ai',
  'context-window-engineer': 'ai', 'deep-research-analyst': 'ai', 'doku-mcp-server': 'ai',
  'frontier-ai-models-expert': 'ai', 'gemini-agent-booster': 'ai', 'graph-rag-knowledge-expert': 'ai',
  'kv-cache-prefix-optimizer': 'ai', 'llm-finops-router': 'ai', 'llm-observability-expert': 'ai',
  'local-slm-edge-ai-expert': 'ai', 'mcp-server-architect': 'ai', 'multi-agent-orchestration': 'ai',
  'pydantic-ai-expert': 'ai', 'speculative-multi-draft-synthesizer': 'ai', 'synthetic-data-finetuning-expert': 'ai',
  'test-time-compute-optimizer': 'ai', 'vector-db-rag-expert': 'ai', 'vercel-ai-sdk-expert': 'ai', 'voice-ai-realtime-agent': 'ai',
  'thinking-budget-orchestrator': 'ai', 'parallel-tool-orchestrator': 'ai',

  // SaaS & FinTech
  'agentic-m2m-settlement': 'saas', 'app-promo-media-expert': 'saas', 'chatbot-messaging-expert': 'saas',
  'doku-payment-gateway': 'saas', 'ecommerce-expert': 'saas', 'email-notification-expert': 'saas',
  'feature-flag-analytics-expert': 'saas', 'headless-cms-expert': 'saas', 'n8n-automation-expert': 'saas',
  'payment-gateway-expert': 'saas', 'saas-architect': 'saas', 'saas-billing': 'saas', 'saas-multi-tenant': 'saas',
  'seo': 'saas', 'data-telemetry-expert': 'saas', 'wordpress-headless-expert': 'saas',

  // Testing & Security
  'accessibility-testing-expert': 'security', 'ai-code-review-autonomous': 'security', 'anti-slop': 'security',
  'authentication-identity-expert': 'security', 'autonomous-red-teamer': 'security', 'autonomous-tdd-debugger': 'security',
  'biome-linter-formatter-expert': 'security', 'compliance-gdpr-privacy-expert': 'security', 'e2e-testing-expert': 'security',
  'error-resilience-expert': 'security', 'firebase-security-expert': 'security', 'formal-spec-z3-verifier': 'security',
  'logging-error-tracking-expert': 'security', 'post-quantum-crypto-migrator': 'security', 'prompt-injection-firewall': 'security',
  'property-mutation-testing-expert': 'security', 'rate-limit-abuse-prevention': 'security', 'supabase-security-expert': 'security',
  'zero-tech-debt-auditor': 'security', 'zero-trust-secret-vault': 'security', 'coderabbit': 'security', 'app-analyzer-optimizer': 'security',
  'mcp-sampling-critic': 'security',

  // Data & Orchestration
  'agy-customizations': 'data', 'brainstorming': 'data', 'browser-automation-expert': 'data',
  'ci-cd-devops-architect': 'data', 'cloud-hosting-expert': 'data', 'data-pipeline-etl-expert': 'data',
  'data-visualization-expert': 'data', 'database-orm-expert': 'data', 'dependency-upgrade-migrator': 'data',
  'documentation-site-expert': 'data', 'file-upload-media-expert': 'data', 'geospatial-maps-expert': 'data',
  'pdf-document-generation-expert': 'data', 'prd-architect': 'data', 'proactive-background-watcher': 'data',
  'production-ready-hardener': 'data', 'search-engine-expert': 'data', 'self-healing-cloud-orchestrator': 'data',
  'session-memory-manager': 'data', 'realtime-collaboration-expert': 'data', 'sse-websocket-streaming-expert': 'data', 'web-scraper': 'data', 'website-design-cloner': 'data', 'zero-to-prod-orchestrator': 'data'
};

const RECIPES = {
  'spec-driven-api': {
    title: 'Spec-Driven API',
    description: 'Contract-first API architecture with TypeSpec, OpenAPI 3.1, BDD Gherkin, and Pact contract testing',
    skills: ['spec-driven-development-expert', 'openapi-swagger-codegen-expert', 'api-design-expert', 'autonomous-api-drift-healer', 'formal-spec-z3-verifier', 'e2e-testing-expert']
  },
  'agentic-commerce': {
    title: 'Agentic Commerce',
    description: 'Autonomous M2M commerce: micro-economies, DOKU Checkout & SNAP BI, dual-rail settlement, and billing state machines',
    skills: ['agentic-micro-economy-architect', 'agentic-m2m-settlement', 'doku-payment-gateway', 'doku-mcp-server', 'saas-billing', 'payment-gateway-expert', 'formal-spec-z3-verifier']
  },
  'frontier-ai': {
    title: 'Frontier AI & MCP',
    description: 'Frontier AI models (Gemini 4 Pro / Claude 5.1), KV-cache prefixing, model cascading, test-time compute, and MCP servers',
    skills: ['frontier-ai-models-expert', 'gemini-agent-booster', 'mcp-server-architect', 'kv-cache-prefix-optimizer', 'adaptive-model-cascade', 'test-time-compute-optimizer']
  },
  'ai-stack': {
    title: 'AI Fullstack',
    description: 'Full AI/LLM integration stack with RAG, vector DB, prompt engineering, and agent orchestration',
    skills: ['ai-llm-integration-expert', 'vector-db-rag-expert', 'vercel-ai-sdk-expert', 'ai-prompt-engineering-expert', 'multi-agent-orchestration']
  },
  'fullstack-pro': {
    title: 'Fullstack Pro',
    description: 'Production-grade fullstack: Next.js 15, auth, DB, payments, E2E testing, and error resilience',
    skills: ['senior-frontend', 'tailwind-expert', 'js-backend-expert', 'database-orm-expert', 'authentication-identity-expert', 'e2e-testing-expert', 'error-resilience-expert']
  },
  'sovereign-guard': {
    title: 'Sovereign Quality Guard',
    description: 'Zero-slop verification: dynamic fuzzing, invariant proving, AST queries, and automated self-healing CI',
    skills: ['anti-slop', 'autonomous-red-teamer', 'formal-spec-z3-verifier', 'living-codebase-ast-graph', 'autonomous-tdd-debugger', 'zero-tech-debt-auditor']
  }
};

const SUBAGENTS = [
  {
    id: 'swarm-architect',
    name: 'Swarm Architect',
    role: 'System Discovery, PRD, ERD, and High-Level Architecture',
    skills: ['brainstorming', 'prd-architect', 'domain-driven-design-expert', 'saas-architect'],
    topology: 'Lead System Director'
  },
  {
    id: 'fullstack-craftsman',
    name: 'Fullstack Craftsman',
    role: 'Frontend, Backend, Design Systems & Database Implementation',
    skills: ['senior-frontend', 'tailwind-expert', 'design-system-architect', 'js-backend-expert', 'database-orm-expert'],
    topology: 'Primary Implementer'
  },
  {
    id: 'quality-guardian',
    name: 'Quality Guardian',
    role: 'Testing, Security Fuzzing, Invariants, and Anti-Slop Enforcement',
    skills: ['anti-slop', 'autonomous-tdd-debugger', 'e2e-testing-expert', 'autonomous-red-teamer', 'formal-spec-z3-verifier'],
    topology: 'Critic & Security Gate'
  },
  {
    id: 'fintech-payment-sentinel',
    name: 'FinTech Payment Sentinel',
    role: 'Payment Gateways, SNAP BI, Subscriptions & Micro-Clearing',
    skills: ['doku-payment-gateway', 'saas-billing', 'payment-gateway-expert', 'agentic-m2m-settlement', 'formal-spec-z3-verifier'],
    topology: 'Atomic Idempotency Sentinel'
  },
  {
    id: 'ai-mcp-engineer',
    name: 'AI & MCP Engineer',
    role: 'Model Context Protocol, Frontier LLMs & Prompt Prefixing',
    skills: ['mcp-server-architect', 'ai-llm-integration-expert', 'gemini-agent-booster', 'frontier-ai-models-expert', 'kv-cache-prefix-optimizer', 'adaptive-model-cascade'],
    topology: 'Agentic Tool Router'
  }
];

export const DAG_PRESETS = {
  'zero-to-prod': {
    id: 'zero-to-prod',
    name: '8-Phase Zero-to-Prod Saga',
    description: 'Autonomous sequential pipeline from product discovery to production release.',
    nodes: [
      { id: 'phase1', label: '1. Discovery & PRD', skill: 'prd-architect', domain: 'data', budget: '8K' },
      { id: 'phase2', label: '2. System Blueprint', skill: 'brainstorming', domain: 'data', budget: '8K' },
      { id: 'phase3', label: '3. DB Isolation & RLS', skill: 'database-orm-expert', domain: 'backend', budget: '16K' },
      { id: 'phase4', label: '4. Spec-Driven APIs', skill: 'spec-driven-development-expert', domain: 'backend', budget: '16K' },
      { id: 'phase5', label: '5. Frontend UI/UX', skill: 'senior-frontend', domain: 'frontend', budget: '16K' },
      { id: 'phase6', label: '6. TDD & Anti-Slop', skill: 'anti-slop', domain: 'security', budget: '32K' },
      { id: 'phase7', label: '7. DevOps & CI/CD', skill: 'ci-cd-devops-architect', domain: 'data', budget: '8K' },
      { id: 'phase8', label: '8. Production Gate', skill: 'production-ready-hardener', domain: 'security', budget: '64K' }
    ],
    edges: [
      { from: 'phase1', to: 'phase2' },
      { from: 'phase2', to: 'phase3' },
      { from: 'phase3', to: 'phase4' },
      { from: 'phase4', to: 'phase5' },
      { from: 'phase5', to: 'phase6' },
      { from: 'phase6', to: 'phase7' },
      { from: 'phase7', to: 'phase8' }
    ]
  },
  'critic-validator': {
    id: 'critic-validator',
    name: 'Critic-Validator Gate',
    description: 'Zero-tolerance iterative verification loop: Implementer -> Auditor -> Invariant Proof.',
    nodes: [
      { id: 'impl', label: 'Implementer Agent', skill: 'fullstack-expert', domain: 'backend', budget: '16K' },
      { id: 'slop', label: 'Sovereign Anti-Slop', skill: 'anti-slop', domain: 'security', budget: '16K' },
      { id: 'smt', label: 'SMT Invariant Verifier', skill: 'formal-spec-z3-verifier', domain: 'security', budget: '32K' },
      { id: 'vis', label: 'Visual UI Auditor', skill: 'visual-ui-auditor', domain: 'frontend', budget: '8K' },
      { id: 'gate', label: 'Approved Release Gate', skill: 'zero-tech-debt-auditor', domain: 'security', budget: '16K' }
    ],
    edges: [
      { from: 'impl', to: 'slop' },
      { from: 'slop', to: 'smt' },
      { from: 'slop', to: 'vis' },
      { from: 'smt', to: 'gate' },
      { from: 'vis', to: 'gate' }
    ]
  },
  'agentic-commerce': {
    id: 'agentic-commerce',
    name: 'Agentic M2M & FinTech Settlement Flow',
    description: 'Dual-Rail commerce flow: DOKU SNAP BI QRIS/VA + M2M Agent Wallets & cryptographic invoicing.',
    nodes: [
      { id: 'order', label: 'Agent Cart & Intent', skill: 'doku-mcp-server', domain: 'ai', budget: '8K' },
      { id: 'settle', label: 'M2M Settlement Clearning', skill: 'agentic-m2m-settlement', domain: 'saas', budget: '32K' },
      { id: 'doku', label: 'DOKU SNAP BI Gateway', skill: 'doku-payment-gateway', domain: 'saas', budget: '16K' },
      { id: 'idem', label: 'Atomic Lock & Idempotency', skill: 'database-orm-expert', domain: 'backend', budget: '16K' },
      { id: 'audit', label: 'Audit Trail & Telemetry', skill: 'data-telemetry-expert', domain: 'saas', budget: '8K' }
    ],
    edges: [
      { from: 'order', to: 'settle' },
      { from: 'settle', to: 'doku' },
      { from: 'doku', to: 'idem' },
      { from: 'idem', to: 'audit' }
    ]
  }
};

async function loadSkillsCatalog() {
  try {
    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
    const skillDirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();
    
    // Check locally installed skills
    const localAgentsDir = path.join(process.cwd(), '.agents', 'skills');
    const installedSet = new Set();
    try {
      const localEntries = await fs.readdir(localAgentsDir, { withFileTypes: true });
      localEntries.filter(e => e.isDirectory()).forEach(e => installedSet.add(e.name));
    } catch {
      // Local dir not yet initialized
    }

    const skills = [];

    for (const name of skillDirs) {
      const skillPath = path.join(SKILLS_DIR, name, 'SKILL.md');
      try {
        const content = await fs.readFile(skillPath, 'utf8');
        const fmMatch = content.match(/---[\r\n]+([\s\S]*?)[\r\n]+---/);
        let description = 'Specialized AI domain skill';
        let author = 'Roedy Rustam';
        let version = '4.3.0';

        if (fmMatch) {
          const fm = fmMatch[1];
          const descMatch = fm.match(/description:\s*["']?([^"'\r\n]+)["']?/);
          const authMatch = fm.match(/author:\s*["']?([^"'\r\n]+)["']?/);
          const verMatch = fm.match(/version:\s*["']?([^"'\r\n]+)["']?/);
          if (descMatch) description = descMatch[1].trim();
          if (authMatch) author = authMatch[1].trim();
          if (verMatch) version = verMatch[1].trim();
        }

        const domainKey = SKILL_DOMAIN_MAP[name] || 'data';
        const domain = DOMAIN_CATEGORIES[domainKey] || DOMAIN_CATEGORIES.data;

        skills.push({
          name,
          description,
          author,
          version,
          domain: domain.id,
          domainLabel: domain.label,
          domainIcon: domain.icon,
          domainColor: domain.color,
          isInstalled: installedSet.has(name)
        });
      } catch {
        // Fallback for missing file
      }
    }

    return skills;
  } catch (err) {
    return [];
  }
}

async function getSkillDetails(name) {
  const skillPath = path.join(SKILLS_DIR, name, 'SKILL.md');
  try {
    const content = await fs.readFile(skillPath, 'utf8');
    const localPath = path.join(process.cwd(), '.agents', 'skills', name);
    let isInstalled = false;
    try {
      await fs.access(localPath);
      isInstalled = true;
    } catch {
      isInstalled = false;
    }

    return {
      name,
      content,
      isInstalled
    };
  } catch (err) {
    return null;
  }
}

async function getSystemStatus() {
  const pkgRaw = await fs.readFile(path.join(PLUGIN_ROOT, 'package.json'), 'utf8');
  const pkg = JSON.parse(pkgRaw);

  const cachePath = path.join(PLUGIN_ROOT, '.cache-prefix.json');
  let cacheStatus = { exists: false, size: 0, tokens: 0 };
  try {
    const stat = await fs.stat(cachePath);
    const content = await fs.readFile(cachePath, 'utf8');
    const parsed = JSON.parse(content);
    cacheStatus = {
      exists: true,
      size: stat.size,
      tokens: parsed.tokenEstimate || 1468
    };
  } catch {
    // Cache prefix not compiled yet
  }

  const localAgentsDir = path.join(process.cwd(), '.agents', 'skills');
  let installedCount = 0;
  try {
    const localEntries = await fs.readdir(localAgentsDir, { withFileTypes: true });
    installedCount = localEntries.filter(e => e.isDirectory()).length;
  } catch {
    installedCount = 0;
  }

  let totalSkills = 155;
  try {
    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
    totalSkills = entries.filter(e => e.isDirectory()).length;
  } catch {
    totalSkills = 155;
  }

  return {
    version: pkg.version,
    totalSkills,
    installedCount,
    nodeVersion: process.version,
    platform: process.platform,
    workingDirectory: process.cwd(),
    cachePrefix: cacheStatus,
    mcpToolsCount: MCP_TOOLS.length
  };
}

function generateStudioHtml(currentPort) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibes-Plug Studio Cockpit | 155-Skill Swarm Architecture</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #070b13;
      --card-bg: #0d1527;
      --card-hover: #121c33;
      --card-border: rgba(255, 255, 255, 0.08);
      --card-border-active: rgba(6, 182, 212, 0.4);
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --primary: #06b6d4;
      --primary-glow: rgba(6, 182, 212, 0.2);
      --accent: #8b5cf6;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', Consolas, monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      line-height: 1.5;
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    /* Header */
    header {
      background: rgba(13, 21, 39, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--card-border);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 12px 24px;
    }

    .header-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
    }

    .brand-badge {
      background: linear-gradient(135deg, #06b6d4, #8b5cf6);
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 800;
      font-family: var(--font-mono);
      box-shadow: 0 4px 12px var(--primary-glow);
    }

    .brand-title {
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
      background: linear-gradient(180deg, #ffffff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-tag {
      font-size: 0.75rem;
      color: var(--primary);
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.25);
      padding: 2px 8px;
      border-radius: 9999px;
      font-family: var(--font-mono);
      font-weight: 600;
    }

    .header-stats {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-chip {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--card-border);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-family: var(--font-mono);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stat-chip span.num {
      color: var(--primary);
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }

    /* Navigation Tabs */
    nav.tab-nav {
      max-width: 1400px;
      margin: 16px auto 0;
      padding: 0 24px;
      display: flex;
      gap: 8px;
      border-bottom: 1px solid var(--card-border);
      width: 100%;
      overflow-x: auto;
    }

    .tab-btn {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-muted);
      font-family: var(--font-sans);
      font-size: 0.9rem;
      font-weight: 600;
      padding: 10px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .tab-btn:hover {
      color: var(--text);
    }

    .tab-btn.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    /* Main Container */
    main {
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 24px;
      flex: 1;
    }

    /* View Sections */
    .view-pane {
      display: none;
    }
    .view-pane.active {
      display: block;
      animation: fadeIn 0.2s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Filter Bar */
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
      max-width: 420px;
    }

    .search-input {
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text);
      font-family: var(--font-sans);
      font-size: 0.9rem;
      padding: 10px 16px 10px 38px;
      border-radius: 8px;
      outline: none;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-glow);
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      font-size: 13px;
      font-family: var(--font-mono);
      pointer-events: none;
    }

    .category-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill-btn {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }

    .pill-btn:hover {
      background: var(--card-hover);
      color: var(--text);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .pill-btn.active {
      background: rgba(6, 182, 212, 0.15);
      color: var(--primary);
      border-color: var(--primary);
      font-weight: 600;
    }

    /* Skills Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .skill-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
      transition: all 0.2s ease;
      cursor: pointer;
      position: relative;
    }

    .skill-card:hover {
      background: var(--card-hover);
      border-color: var(--card-border-active);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }

    .skill-card.selected {
      border-color: var(--primary);
      background: rgba(6, 182, 212, 0.08);
      box-shadow: 0 0 0 1px var(--primary);
    }

    .skill-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .skill-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .skill-select-box {
      width: 16px;
      height: 16px;
      accent-color: var(--primary);
      cursor: pointer;
    }

    .skill-title {
      font-family: var(--font-mono);
      font-weight: 600;
      font-size: 0.95rem;
      color: #fff;
    }

    .skill-badge {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 600;
      border: 1px solid transparent;
      white-space: nowrap;
    }

    .skill-desc {
      font-size: 0.84rem;
      color: var(--text-muted);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.45;
    }

    .skill-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.78rem;
    }

    .installed-status {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .status-dot.installed { background-color: var(--success); box-shadow: 0 0 8px var(--success); }
    .status-dot.available { background-color: rgba(255, 255, 255, 0.2); }

    .btn-action {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--card-border);
      color: var(--text);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .btn-action:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.3);
    }

    /* Subagents Topology Section */
    .subagent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .subagent-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .subagent-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .subagent-name {
      font-weight: 700;
      font-size: 1.05rem;
      color: #fff;
    }

    .subagent-topology {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--accent);
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.3);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .subagent-role {
      font-size: 0.88rem;
      color: var(--text-muted);
    }

    .subagent-skills-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .subagent-skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .subagent-skill-tag {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 4px;
      color: #cbd5e1;
    }

    /* Superintelligence Engines (P1-P5) */
    .engine-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .engine-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .engine-tier {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--primary);
    }

    .engine-title {
      font-weight: 700;
      font-size: 1.05rem;
      color: #fff;
    }

    .engine-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.45;
    }

    .engine-status-badge {
      font-size: 0.75rem;
      font-family: var(--font-mono);
      padding: 4px 10px;
      border-radius: 6px;
      width: fit-content;
      font-weight: 600;
      margin-top: auto;
    }

    /* Curated Recipes */
    .recipe-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
    }

    .recipe-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 14px;
    }

    .recipe-title {
      font-weight: 700;
      font-size: 1.1rem;
      color: #fff;
    }

    .recipe-desc {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.45;
    }

    /* Floating Recipe Builder Drawer */
    .recipe-drawer {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #0d1527;
      border: 1px solid var(--primary);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.65), 0 0 20px var(--primary-glow);
      border-radius: 14px;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      z-index: 100;
      animation: slideUp 0.25s ease-out;
      max-width: 90vw;
    }

    @keyframes slideUp {
      from { transform: translate(-50%, 40px); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }

    .drawer-count {
      font-family: var(--font-mono);
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--primary);
      white-space: nowrap;
    }

    .drawer-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
      white-space: nowrap;
      font-family: var(--font-sans);
    }

    .btn-primary {
      background: var(--primary);
      color: #070b13;
    }
    .btn-primary:hover {
      background: #22d3ee;
      box-shadow: 0 0 12px var(--primary-glow);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--card-border);
      color: var(--text);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.14);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-muted);
    }
    .btn-ghost:hover {
      color: var(--danger);
    }

    /* General Layout Panels */
    .panel-box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .panel-box h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #fff;
    }

    .grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 900px) {
      .grid-2col { grid-template-columns: 1fr; }
    }

    /* Visual Topological DAG Canvas */
    .dag-node {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 14px 18px;
      min-width: 170px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      transition: all 0.25s ease;
      cursor: pointer;
      position: relative;
    }
    .dag-node:hover {
      border-color: var(--primary);
      transform: translateY(-3px);
      box-shadow: 0 8px 24px var(--primary-glow);
    }
    .dag-node.active-step {
      border-color: #10b981;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
    }
    .dag-node-header {
      font-size: 0.82rem;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .dag-node-skill {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--primary);
    }
    .dag-node-budget {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      background: rgba(255,255,255,0.06);
      padding: 2px 6px;
      border-radius: 4px;
      color: #cbd5e1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .select-input, .text-input, .textarea-input {
      width: 100%;
      background: #090e1a;
      border: 1px solid var(--card-border);
      color: var(--text);
      font-family: var(--font-mono);
      font-size: 0.85rem;
      padding: 10px 14px;
      border-radius: 8px;
      outline: none;
    }

    .select-input:focus, .text-input:focus, .textarea-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-glow);
    }

    .textarea-input {
      min-height: 120px;
      resize: vertical;
      line-height: 1.4;
    }

    .result-terminal {
      background: #05080e;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: #cbd5e1;
      min-height: 200px;
      max-height: 480px;
      overflow-y: auto;
      white-space: pre-wrap;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(6px);
      z-index: 150;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-backdrop.open {
      display: flex;
      animation: modalFade 0.2s ease-out;
    }

    @keyframes modalFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: #0d1527;
      border: 1px solid var(--card-border);
      border-radius: 14px;
      width: 100%;
      max-width: 840px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
      overflow: hidden;
    }

    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.02);
    }

    .modal-header h2 {
      font-size: 1.25rem;
      font-family: var(--font-mono);
      font-weight: 700;
      color: #fff;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .close-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }

    .modal-body {
      padding: 24px;
      overflow-y: auto;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #cbd5e1;
    }

    .modal-body pre {
      background: rgba(0, 0, 0, 0.4);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      margin: 16px 0;
      border: 1px solid rgba(255, 255, 255, 0.08);
      white-space: pre-wrap;
    }

    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.02);
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1e293b;
      border: 1px solid var(--primary);
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 500;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      z-index: 200;
      display: none;
      align-items: center;
      gap: 10px;
      animation: slideIn 0.25s ease-out;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    footer {
      border-top: 1px solid var(--card-border);
      padding: 20px 24px;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: auto;
    }
  </style>
</head>
<body>

  <!-- Sticky Header -->
  <header>
    <div class="header-inner">
      <div class="brand">
        <div class="brand-badge">VP</div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="brand-title">VibesPlug Pro Studio</div>
            <div class="brand-tag">v4.3.0</div>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Autonomous 155-Agent Swarm Operating System</div>
        </div>
      </div>

      <div class="header-stats">
        <div class="stat-chip">
          <span>Skills:</span>
          <span class="num" id="stat-total-skills">155</span>
        </div>
        <div class="stat-chip">
          <span>Installed:</span>
          <span class="num" id="stat-installed-skills">0</span>
        </div>
        <div class="stat-chip">
          <span>MCP Transport:</span>
          <span class="num" style="color: var(--success);">SSE ACTIVE</span>
        </div>
        <div class="stat-chip">
          <span>KV-Cache:</span>
          <span class="num" id="stat-cache-status">LOCKED (P1)</span>
        </div>
        <div class="stat-chip">
          <span>FinOps Saved:</span>
          <span class="num" id="stat-finops-saved" style="color: #4ade80;">$0.000</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Tab Navigation -->
  <nav class="tab-nav">
    <button type="button" class="tab-btn active" data-tab="tab-arsenal">155-Skill Arsenal</button>
    <button type="button" class="tab-btn" data-tab="tab-subagents">Swarm &amp; Agent Studio</button>
    <button type="button" class="tab-btn" data-tab="tab-dag">Visual DAG Canvas</button>
    <button type="button" class="tab-btn" data-tab="tab-engines">Superintelligence (P1–P6)</button>
    <button type="button" class="tab-btn" data-tab="tab-recipes">Curated Recipes</button>
    <button type="button" class="tab-btn" data-tab="tab-mcp">Remote MCP (SSE)</button>
    <button type="button" class="tab-btn" data-tab="tab-memory">Memory &amp; Checkpoints</button>
  </nav>

  <!-- Main Content -->
  <main>
    <!-- View 1: 155-Skill Arsenal -->
    <div id="tab-arsenal" class="view-pane active">
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <span class="search-icon">Search:</span>
          <input type="text" id="skill-search" class="search-input" placeholder="Search 155 skills (press '/' to focus)...">
        </div>
        <div class="category-pills">
          <button type="button" class="pill-btn active" data-category="all">All Domains (155)</button>
          <button type="button" class="pill-btn" data-category="frontend">Frontend &amp; UI</button>
          <button type="button" class="pill-btn" data-category="backend">Backend &amp; API</button>
          <button type="button" class="pill-btn" data-category="ai">Frontier AI &amp; MCP</button>
          <button type="button" class="pill-btn" data-category="saas">SaaS &amp; FinTech</button>
          <button type="button" class="pill-btn" data-category="security">Testing &amp; Security</button>
          <button type="button" class="pill-btn" data-category="data">Data &amp; DevOps</button>
        </div>
      </div>

      <div id="skills-container" class="skills-grid">
        <!-- Rendered by JavaScript -->
      </div>
    </div>

    <!-- View 2: Swarm & Agent Studio -->
    <div id="tab-subagents" class="view-pane">
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Swarm Planner & Topology Simulator -->
        <div class="panel-box">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3>Autonomous Swarm Planner &amp; Topology Simulator</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                Enter a task to dynamically synthesize topology (Fan-Out/Fan-In, Pipeline Saga, or Critic-Validator) and map domain workers.
              </p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn btn-secondary" onclick="setSwarmPreset('saas')">SaaS &amp; Billing</button>
              <button type="button" class="btn btn-secondary" onclick="setSwarmPreset('api')">Contract API</button>
              <button type="button" class="btn btn-secondary" onclick="setSwarmPreset('audit')">Security Audit</button>
            </div>
          </div>

          <div class="grid-2col" style="margin-top: 12px; margin-bottom: 12px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label for="swarm-task-input">Task Specification</label>
              <input type="text" id="swarm-task-input" class="text-input" placeholder="e.g. Build multi-tenant SaaS with DOKU QRIS billing, Next.js 15 UI, and PostgreSQL RLS" />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label for="swarm-reasoning-select">Thinking Budget Profile (Reasoning Depth)</label>
              <select id="swarm-reasoning-select" class="text-input" style="background: rgba(15,23,42,0.7); color: #fff;">
                <option value="auto">Auto-Detect (Adaptive Complexity Cascade)</option>
                <option value="speed">Speed (Flash-Lite / Haiku — 1K tokens)</option>
                <option value="balanced" selected>Balanced (Flash / Sonnet — 8K tokens)</option>
                <option value="deep">Deep Thinking (Pro / Opus / o3 — 32K tokens)</option>
                <option value="exhaustive">Exhaustive Invariant Prover (Pro Ext / o3 High — 64K tokens)</option>
              </select>
            </div>
          </div>

          <div style="display: flex; gap: 12px;">
            <button type="button" id="btn-plan-swarm" class="btn btn-primary" onclick="runSwarmPlan()">Plan Swarm Topology</button>
            <button type="button" id="btn-exec-swarm" class="btn btn-secondary" onclick="runSwarmExecute()">Simulate Execution</button>
          </div>

          <div id="swarm-plan-output" class="result-terminal">// Enter a task and click 'Plan Swarm Topology' to inspect execution topology...</div>
        </div>

        <!-- Visual Subagent Creator -->
        <div class="panel-box">
          <h3>Visual Custom Specialist Agent Builder</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            Scaffold customized specialist subagents bound to skills, formatted universally for Antigravity, Claude Code, and Cursor.
          </p>

          <div class="grid-2col">
            <div class="form-group">
              <label for="agent-name-input">Agent Name (kebab-case)</label>
              <input type="text" id="agent-name-input" class="text-input" placeholder="e.g. fintech-auditor" />
            </div>
            <div class="form-group">
              <label for="agent-platform-select">Target Platform</label>
              <select id="agent-platform-select" class="select-input">
                <option value="all">Universal (Antigravity, Claude Code, Cursor)</option>
                <option value="antigravity">Antigravity (.agents/agents/)</option>
                <option value="claude">Claude Code (.claude/agents/)</option>
                <option value="cursor">Cursor IDE (.cursor/rules/)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="agent-desc-input">Agent Role &amp; Mission Description</label>
            <input type="text" id="agent-desc-input" class="text-input" placeholder="e.g. Specialist for payment gateways, SNAP BI idempotency, and audit compliance" />
          </div>

          <div class="form-group">
            <label>Select Active Skills (click cards or type comma-separated)</label>
            <input type="text" id="agent-skills-input" class="text-input" placeholder="senior-frontend, doku-payment-gateway, anti-slop" />
          </div>

          <div>
            <button type="button" class="btn btn-primary" onclick="createCustomAgentFromUi()">Scaffold Custom Subagent</button>
          </div>
        </div>

        <!-- Native Subagents Cards -->
        <div>
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 16px;">Core Native Subagent Registry (Swarm Topologies)</h3>
          <div id="subagents-container" class="subagent-grid">
            <!-- Rendered by JavaScript -->
          </div>
        </div>
      </div>
    </div>

    <!-- View: Visual DAG Canvas -->
    <div id="tab-dag" class="view-pane">
      <div class="panel-box">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
          <div>
            <h3>Visual Topological DAG Swarm Canvas</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Interactive directed acyclic graph editor. Design and simulate multi-agent pipelines with dynamic thinking budgets.
            </p>
          </div>
          <div style="display: flex; gap: 10px;">
            <select id="dag-preset-select" class="form-input" style="width: auto; padding: 6px 14px;" onchange="loadDagPreset(this.value)">
              <option value="zero-to-prod">8-Phase Zero-to-Prod Saga</option>
              <option value="critic-validator">Critic-Validator Gate</option>
              <option value="agentic-commerce">Agentic M2M &amp; FinTech Settlement</option>
            </select>
            <button type="button" class="btn btn-primary" onclick="simulateDagExecution()">▶ Run DAG Simulation</button>
          </div>
        </div>

        <div id="dag-canvas-container" style="background: rgba(0,0,0,0.3); border: 1px solid var(--card-border); border-radius: 12px; min-height: 400px; position: relative; overflow-x: auto; padding: 24px;">
          <svg id="dag-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"></svg>
          <div id="dag-nodes-container" style="display: flex; align-items: center; justify-content: space-around; min-height: 350px; position: relative; z-index: 2; gap: 24px; flex-wrap: wrap;"></div>
        </div>

        <div id="dag-trace-box" style="margin-top: 20px; display: none;">
          <h4 style="font-size: 0.9rem; margin-bottom: 8px; color: var(--primary);">Execution Trace &amp; Topological Sequence:</h4>
          <pre id="dag-trace-output" style="background: rgba(0,0,0,0.5); padding: 14px; border-radius: 8px; font-family: var(--font-mono); font-size: 0.82rem; color: #a5f3fc; border: 1px solid var(--card-border); max-height: 200px; overflow-y: auto;"></pre>
        </div>
      </div>
    </div>

    <!-- View 3: Superintelligence (P1-P5) -->
    <div id="tab-engines" class="view-pane">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 1.2rem; font-weight: 700; color: #fff;">Sovereign Superintelligence Engines (P1–P6)</h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">
          Sub-millisecond static verification, deterministic caching, AST symbol inspection, and theorem-proving engines.
        </p>
      </div>
      <div class="engine-grid">
        <div class="engine-card">
          <div class="engine-tier">P1 ENGINE</div>
          <div class="engine-title">KV-Cache Prefix Optimizer</div>
          <p class="engine-desc">
            Locks deterministic >1024 token prompt prefix for Gemini 4 Pro, Claude 5.1, and GPT-5 to slash billing by 75-90% and achieve 10x TTFT.
          </p>
          <div class="engine-status-badge" style="background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid var(--success);">
            ACTIVE (1468 Tokens)
          </div>
        </div>

        <div class="engine-card">
          <div class="engine-tier">P2 ENGINE</div>
          <div class="engine-title">In-Memory SQL Sandbox</div>
          <p class="engine-desc">
            Simulates PostgreSQL DDL, validates schema migrations in-memory, detects destructive drops, and enforces Row-Level Security (RLS).
          </p>
          <div class="engine-status-badge" style="background: rgba(6, 182, 212, 0.15); color: var(--primary); border: 1px solid var(--primary);">
            READY (vibes db:eval)
          </div>
        </div>

        <div class="engine-card">
          <div class="engine-tier">P3 ENGINE</div>
          <div class="engine-title">Living AST Codebase Graph</div>
          <p class="engine-desc">
            Parses TypeScript, Python, and Go symbols surgically. Extracts function bodies and calculates dependency blast-radius without context dumping.
          </p>
          <div class="engine-status-badge" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid #3b82f6);">
            READY (vibes ast)
          </div>
        </div>

        <div class="engine-card">
          <div class="engine-tier">P4 ENGINE</div>
          <div class="engine-title">Process Reward Arbiter (PRM)</div>
          <p class="engine-desc">
            Multi-draft speculative consensus engine. Scores competing AI code generations across Type Safety, Anti-Slop, and Resilience.
          </p>
          <div class="engine-status-badge" style="background: rgba(168, 85, 247, 0.15); color: var(--accent); border: 1px solid var(--accent);">
            READY (vibes arbitrate)
          </div>
        </div>

        <div class="engine-card">
          <div class="engine-tier">P5 ENGINE</div>
          <div class="engine-title">Neuro-Symbolic Invariant SMT</div>
          <p class="engine-desc">
            Mathematically proves state machine transitions, reachability, and deadlock freedom, generating formal SMT-LIB 2.0 specs for Z3.
          </p>
          <div class="engine-status-badge" style="background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid var(--danger);">
            READY (vibes verify)
          </div>
        </div>

        <div class="engine-card">
          <div class="engine-tier">P6 ENGINE</div>
          <div class="engine-title">Ephemeral WASM/VM Sandbox</div>
          <p class="engine-desc">
            Ultra-low latency (&lt;2ms) isolated micro-sandbox for evaluating AI-generated code with wall-clock timeout kill and zero host access.
          </p>
          <div class="engine-status-badge" style="background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid var(--success);">
            READY (vibes sandbox)
          </div>
        </div>
      </div>

      <!-- Interactive Ephemeral Sandbox Playground -->
      <div class="panel-box" style="margin-top: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1.1rem; color: #fff; font-weight: 700;">Ephemeral Micro-Sandbox Playground (P6)</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Dry-run arbitrary untrusted JavaScript/TypeScript logic in an isolated micro-sandbox with sub-millisecond execution.
            </p>
          </div>
          <button type="button" id="btn-eval-sandbox" class="btn btn-primary" onclick="evalSandboxFromUi()">▶ Run in Sandbox</button>
        </div>

        <div class="grid-2col">
          <div class="form-group" style="margin-bottom: 0;">
            <label for="sandbox-code-input">Sandbox Code (JavaScript)</label>
            <textarea id="sandbox-code-input" class="textarea-input" style="height: 120px; font-family: var(--font-mono); font-size: 0.82rem;">const nums = [1, 2, 3, 4, 5];
nums.map(n => n * 2).filter(n => n > 4);</textarea>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>Sandbox Output &amp; Diagnostics</label>
            <div id="sandbox-output-terminal" class="result-terminal" style="height: 120px; min-height: 120px; padding: 12px; font-size: 0.8rem;">// Click 'Run in Sandbox' to execute logic in isolated micro-sandbox...</div>
          </div>
        </div>
      </div>

      <!-- Token Economics & KV-Cache Monitor -->
      <div class="panel-box" style="margin-top: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1.1rem; color: #fff; font-weight: 700;">Prompt Cache Hit Rate &amp; Local FinOps Telemetry</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Empirical cost savings and TTFT acceleration across Gemini, Claude, and OpenAI via deterministic prefix pinning.
            </p>
          </div>
          <button type="button" id="btn-recompile-cache" class="btn btn-secondary" onclick="recompileCacheFromUi()">Recompile Prefix</button>
        </div>

        <div class="grid-2col">
          <div style="background: rgba(15,23,42,0.6); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">Active Prefix Status</div>
            <div id="cache-stats-text" style="font-family: var(--font-mono); font-size: 0.88rem; color: #38bdf8; line-height: 1.6;">
              Prefix Size: ~1,468 tokens (5,576 bytes)<br>
              TTFT Speedup: 10x (&lt;100ms first token)<br>
              Status: Locked (.cache-prefix.json)
            </div>
          </div>
          <div style="background: rgba(15,23,42,0.6); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted);">Realized Session FinOps</span>
              <button type="button" class="btn-action" onclick="resetFinOpsFromUi()">Reset Telemetry</button>
            </div>
            <div id="finops-realized-text" style="font-family: var(--font-mono); font-size: 0.88rem; color: #4ade80; line-height: 1.6;">
              Realized Savings: $0.000 USD<br>
              Cached Tokens: 0 / 0 (0.0% hit ratio)<br>
              Total Turns Tracked: 0
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View 4: Curated Recipes -->
    <div id="tab-recipes" class="view-pane">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 1.2rem; font-weight: 700; color: #fff;">Curated Skill Bundles &amp; Recipes</h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">
          Pre-assembled production bundles designed to instantly equip AI agents for specialized domains.
        </p>
      </div>
      <div id="recipes-container" class="recipe-grid">
        <!-- Rendered by JavaScript -->
      </div>
    </div>

    <!-- View 5: Remote MCP Console -->
    <div id="tab-mcp" class="view-pane">
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1)); border: 1px solid var(--card-border-active); border-radius: 12px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
          <div>
            <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">Remote Model Context Protocol (MCP v1.x)</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Server-Sent Events (SSE) stream active. Connect Claude Desktop, Cursor, or remote agents to access the 155 skills and P1–P6 engines.
            </p>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.9rem; background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.12); padding: 8px 14px; border-radius: 8px; color: var(--primary); display: flex; align-items: center; gap: 12px;">
            <span>http://localhost:${currentPort}/sse</span>
            <button type="button" class="btn-action" onclick="copyMcpUrl()">Copy URL</button>
          </div>
        </div>

        <div class="grid-2col">
          <div class="panel-box">
            <h3>Interactive MCP Tool Runner</h3>
            <div class="form-group">
              <label for="mcp-tool-select">Select MCP Tool</label>
              <select id="mcp-tool-select" class="select-input" onchange="onMcpToolChange()">
                <option value="vibes_list_skills">vibes_list_skills (Discover 155 skills)</option>
                <option value="vibes_get_skill">vibes_get_skill (Inspect skill markdown)</option>
                <option value="vibes_ast_query">vibes_ast_query (P3 AST symbol query)</option>
                <option value="vibes_eval_sql">vibes_eval_sql (P2 In-memory SQL simulator)</option>
                <option value="vibes_arbitrate_code">vibes_arbitrate_code (P4 PRM draft arbiter)</option>
                <option value="vibes_verify_invariants">vibes_verify_invariants (P5 Invariant prover)</option>
                <option value="vibes_compile_cache">vibes_compile_cache (P1 Cache prefix compiler)</option>
                <option value="vibes_memory">vibes_memory (Episodic project memory)</option>
                <option value="vibes_swarm">vibes_swarm (Autonomous multi-agent swarm)</option>
                <option value="vibes_batch">vibes_batch (Parallel multi-tool execution)</option>
                <option value="vibes_critic_validate">vibes_critic_validate (Critic-in-the-Loop Quality Gate)</option>
                <option value="vibes_visual_audit">vibes_visual_audit (Pillar 7 UI visual critic)</option>
                <option value="vibes_eval_sandbox">vibes_eval_sandbox (Ephemeral WASM/VM sandbox)</option>
                <option value="vibes_swarm_dispatch">vibes_swarm_dispatch (Headless concurrent swarm)</option>
                <option value="vibes_finops_report">vibes_finops_report (Local FinOps token tracker)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="mcp-payload-input">Tool Arguments (JSON)</label>
              <textarea id="mcp-payload-input" class="textarea-input">{}</textarea>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span id="mcp-elapsed" style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); font-variant-numeric: tabular-nums;">
                Latency: 0ms
              </span>
              <button type="button" id="mcp-exec-btn" class="btn btn-primary" onclick="executeMcpTool()">
                Execute Tool
              </button>
            </div>
          </div>

          <div class="panel-box">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <h3>Tool Execution Output</h3>
              <button type="button" class="btn-action" onclick="copyMcpOutput()">Copy JSON</button>
            </div>
            <div id="mcp-output-terminal" class="result-terminal">// Select a tool and click 'Execute Tool' to inspect live response...</div>

            <div style="border-top: 1px solid var(--card-border); padding-top: 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted);">IDE MCP Config (Claude Desktop / Cursor)</span>
                <button type="button" class="btn-action" onclick="copyIdeConfig()">Copy Config</button>
              </div>
              <pre style="background: rgba(0,0,0,0.5); padding: 10px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.75rem; color: #94a3b8; overflow-x: auto;">{
  "mcpServers": {
    "vibes-plug": {
      "url": "http://localhost:${currentPort}/sse"
    }
  }
}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View 6: Memory & Checkpoints -->
    <div id="tab-memory" class="view-pane">
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="panel-box">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3>Episodic Project Memory &amp; Checkpoint Manager</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                Zero Context Amnesia: Record architectural decisions and compile ultra-compact handoff checkpoints (&lt;150t) into CHECKPOINT.md.
              </p>
            </div>
            <button type="button" class="btn btn-primary" onclick="generateCheckpointFromUi()">Generate Compact Checkpoint</button>
          </div>

          <!-- Add Decision Inline -->
          <div class="grid-2col" style="margin-top: 8px;">
            <div class="form-group">
              <label for="mem-text-input">Architectural Decision</label>
              <input type="text" id="mem-text-input" class="text-input" placeholder="e.g. Use Drizzle ORM instead of Prisma for sub-millisecond edge cold-starts" />
            </div>
            <div class="form-group">
              <label for="mem-cat-select">Category</label>
              <select id="mem-cat-select" class="select-input">
                <option value="Architecture">Architecture</option>
                <option value="Database">Database &amp; Schema</option>
                <option value="Security">Security &amp; Auth</option>
                <option value="FinTech">FinTech &amp; Billing</option>
                <option value="Frontend">Frontend &amp; UI</option>
              </select>
            </div>
          </div>

          <div>
            <button type="button" class="btn btn-secondary" onclick="recordDecisionFromUi()">Record Architectural Decision</button>
          </div>
        </div>

        <!-- Decisions Log -->
        <div class="panel-box">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h3>Recorded Project Decisions</h3>
            <span id="mem-count-badge" class="stat-chip">0 decisions logged</span>
          </div>

          <div id="memory-log-container" class="result-terminal" style="min-height: 240px;">
            // Loading project memory graph...
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Floating Recipe Builder Drawer (Multi-select) -->
  <div id="recipe-builder-drawer" class="recipe-drawer" style="display: none;">
    <div class="drawer-count">
      <span id="drawer-selected-count">0</span> Skills Selected
    </div>
    <div class="drawer-actions">
      <button type="button" class="btn btn-primary" onclick="injectSelectedSkills()">Inject to Project</button>
      <button type="button" class="btn btn-secondary" onclick="exportSelectedJson()">Export JSON</button>
      <button type="button" class="btn btn-secondary" onclick="copySelectedCli()">Copy CLI</button>
      <button type="button" class="btn btn-ghost" onclick="clearSelectedSkills()">Clear</button>
    </div>
  </div>

  <!-- Skill Detail Modal -->
  <div id="skill-modal" class="modal-backdrop">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-skill-title">skill-name</h2>
        <button type="button" id="modal-close" class="close-btn" aria-label="Close modal">&times;</button>
      </div>
      <div id="modal-skill-body" class="modal-body">
        <!-- Content -->
      </div>
      <div class="modal-footer">
        <button type="button" id="modal-copy-prompt" class="btn btn-secondary">Copy Trigger Prompt</button>
        <button type="button" id="modal-inject-btn" class="btn btn-primary">Inject into Local Project</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="toast">
    <span id="toast-message">Message</span>
  </div>

  <footer>
    <p>Vibes-Plug Pro v4.3.0 &bull; Model-Agnostic AI Swarm Architecture &bull; Roedy Rustam &bull; 155 Skills</p>
  </footer>

  <script>
    let allSkills = [];
    let currentCategory = 'all';
    let searchQuery = '';
    let activeModalSkill = null;
    const selectedSkills = new Set();
    const studioPort = ${currentPort};

    function showToast(message) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-message').textContent = message;
      toast.style.display = 'flex';
      setTimeout(() => { toast.style.display = 'none'; }, 3500);
    }

    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');
        if (targetId === 'tab-memory') loadMemoryView();
        if (targetId === 'tab-dag') loadDagPreset(currentDagPreset);
        if (targetId === 'tab-engines') { loadCacheStatus(); loadFinOpsStatus(); }
      });
    });

    // Category Filter Pills
    document.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        renderSkills();
      });
    });

    // Search input
    const searchInput = document.getElementById('skill-search');
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderSkills();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // Modal controls
    const modal = document.getElementById('skill-modal');
    document.getElementById('modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    function closeModal() {
      modal.classList.remove('open');
      activeModalSkill = null;
    }

    async function openSkillModal(skillName) {
      try {
        const res = await fetch(\`/api/skills/\${skillName}\`);
        if (!res.ok) throw new Error('Failed to load skill details');
        const data = await res.json();
        activeModalSkill = data;

        document.getElementById('modal-skill-title').textContent = data.name;
        document.getElementById('modal-skill-body').innerHTML = \`<pre>\${escapeHtml(data.content)}</pre>\`;
        
        const injectBtn = document.getElementById('modal-inject-btn');
        if (data.isInstalled) {
          injectBtn.textContent = 'Already Installed Locally';
          injectBtn.style.opacity = '0.7';
          injectBtn.disabled = true;
        } else {
          injectBtn.textContent = 'Inject into Local Project (.agents/skills)';
          injectBtn.style.opacity = '1';
          injectBtn.disabled = false;
        }

        modal.classList.add('open');
      } catch (err) {
        showToast('Error loading skill: ' + err.message);
      }
    }

    document.getElementById('modal-copy-prompt').addEventListener('click', () => {
      if (!activeModalSkill) return;
      const promptText = \`Use the \${activeModalSkill.name} skill to execute this task following standard operating procedures.\`;
      navigator.clipboard.writeText(promptText);
      showToast('Copied trigger prompt to clipboard!');
    });

    document.getElementById('modal-inject-btn').addEventListener('click', async () => {
      if (!activeModalSkill) return;
      try {
        const res = await fetch('/api/inject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skill: activeModalSkill.name })
        });
        const result = await res.json();
        if (result.success) {
          showToast(\`Injected '\${activeModalSkill.name}' successfully!\`);
          activeModalSkill.isInstalled = true;
          document.getElementById('modal-inject-btn').textContent = 'Already Installed Locally';
          document.getElementById('modal-inject-btn').disabled = true;
          loadData();
        } else {
          showToast(result.error || 'Failed to inject');
        }
      } catch (err) {
        showToast('Error injecting skill: ' + err.message);
      }
    });

    function escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Multi-select Recipe Builder Handlers
    function toggleSkillSelection(skillName, e) {
      if (e) e.stopPropagation();
      if (selectedSkills.has(skillName)) {
        selectedSkills.delete(skillName);
      } else {
        selectedSkills.add(skillName);
      }
      updateDrawer();
      renderSkills();
    }

    function updateDrawer() {
      const drawer = document.getElementById('recipe-builder-drawer');
      const countEl = document.getElementById('drawer-selected-count');
      countEl.textContent = selectedSkills.size;
      drawer.style.display = selectedSkills.size > 0 ? 'flex' : 'none';
    }

    function clearSelectedSkills() {
      selectedSkills.clear();
      updateDrawer();
      renderSkills();
    }

    async function injectSelectedSkills() {
      if (selectedSkills.size === 0) return;
      try {
        const res = await fetch('/api/recipes/inject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills: Array.from(selectedSkills) })
        });
        const result = await res.json();
        if (result.success) {
          showToast(\`Successfully injected \${result.count} skills into .agents/skills/\`);
          clearSelectedSkills();
          loadData();
        } else {
          showToast('Injection failed: ' + result.error);
        }
      } catch (err) {
        showToast('Error: ' + err.message);
      }
    }

    function exportSelectedJson() {
      const payload = {
        name: 'custom-bundle',
        version: '1.0.0',
        skills: Array.from(selectedSkills)
      };
      const jsonStr = JSON.stringify(payload, null, 2);
      navigator.clipboard.writeText(jsonStr);
      showToast('Copied recipe JSON bundle to clipboard!');
    }

    function copySelectedCli() {
      const skillList = Array.from(selectedSkills).join(' ');
      const cmd = \`vibes add \${skillList}\`;
      navigator.clipboard.writeText(cmd);
      showToast(\`Copied CLI command: "\${cmd}"\`);
    }

    // Render Skills Grid
    function renderSkills() {
      const container = document.getElementById('skills-container');
      const filtered = allSkills.filter(s => {
        const matchesCategory = (currentCategory === 'all' || s.domain === currentCategory);
        const matchesQuery = !searchQuery || s.name.toLowerCase().includes(searchQuery) || s.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesQuery;
      });

      if (filtered.length === 0) {
        container.innerHTML = \`<div style="grid-column: 1 / -1; padding: 48px; text-align: center; color: var(--text-muted);">
          No skills found matching your filter criteria.
        </div>\`;
        return;
      }

      container.innerHTML = filtered.map(s => {
        const isSelected = selectedSkills.has(s.name);
        return \`
          <div class="skill-card \${isSelected ? 'selected' : ''}" role="button" tabindex="0" onclick="openSkillModal('\${s.name}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openSkillModal('\${s.name}')}">
            <div>
              <div class="skill-header">
                <div class="skill-title-group">
                  <input type="checkbox" class="skill-select-box" aria-label="Select \${s.name}" \${isSelected ? 'checked' : ''} onclick="toggleSkillSelection('\${s.name}', event)" />
                  <span class="skill-title">\${s.name}</span>
                </div>
                <span class="skill-badge" style="background: \${s.domainColor}22; color: \${s.domainColor}; border-color: \${s.domainColor}44;">
                  \${s.domainLabel.split(' ')[0]}
                </span>
              </div>
              <p class="skill-desc">\${escapeHtml(s.description)}</p>
            </div>
            <div class="skill-footer">
              <div class="installed-status">
                <span class="status-dot \${s.isInstalled ? 'installed' : 'available'}"></span>
                <span>\${s.isInstalled ? 'Installed' : 'Available'}</span>
              </div>
              <button type="button" class="btn-action" onclick="event.stopPropagation(); openSkillModal('\${s.name}')">View Details</button>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Render Subagents
    function renderSubagents(subagents) {
      const container = document.getElementById('subagents-container');
      container.innerHTML = subagents.map(a => \`
        <div class="subagent-card">
          <div class="subagent-header">
            <span class="subagent-name">\${a.name}</span>
            <span class="subagent-topology">\${a.topology}</span>
          </div>
          <p class="subagent-role">\${a.role}</p>
          <div>
            <div class="subagent-skills-label">Bound Skills (\${a.skills.length}):</div>
            <div class="subagent-skills-list" style="margin-top: 8px;">
              \${a.skills.map(s => \`<span class="subagent-skill-tag" onclick="openSkillModal('\${s}')" style="cursor: pointer;">\${s}</span>\`).join('')}
            </div>
          </div>
        </div>
      \`).join('');
    }

    // Swarm Planner & Simulator Handlers
    function setSwarmPreset(type) {
      const input = document.getElementById('swarm-task-input');
      const reasoningSelect = document.getElementById('swarm-reasoning-select');
      if (type === 'saas') {
        input.value = 'Build a multi-tenant SaaS with DOKU QRIS billing, Next.js 15 UI, and Supabase RLS';
        if (reasoningSelect) reasoningSelect.value = 'deep';
      } else if (type === 'api') {
        input.value = 'Design a spec-driven contract API with TypeSpec, OpenAPI 3.1, and BDD contract testing';
        if (reasoningSelect) reasoningSelect.value = 'balanced';
      } else if (type === 'audit') {
        input.value = 'Perform strict security audit and formal verification of billing state machines';
        if (reasoningSelect) reasoningSelect.value = 'exhaustive';
      }
      runSwarmPlan();
    }

    async function runSwarmPlan() {
      const task = document.getElementById('swarm-task-input').value.trim() || 'Build a scalable fullstack web application';
      const reasoningSelect = document.getElementById('swarm-reasoning-select');
      const reasoning = reasoningSelect ? reasoningSelect.value : 'auto';
      const term = document.getElementById('swarm-plan-output');
      term.textContent = '// Synthesizing Swarm Topology for: ' + task + ' [' + reasoning + ']...';

      try {
        const res = await fetch('/api/swarm/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task, reasoning })
        });
        const data = await res.json();
        if (data.success) {
          term.textContent = JSON.stringify(data.plan, null, 2);
          showToast('Topology: ' + data.plan.topology.toUpperCase() + ' | Budget: ' + data.plan.reasoningProfile.toUpperCase());
        }
      } catch (err) {
        term.textContent = '// Error: ' + err.message;
      }
    }

    async function runSwarmExecute() {
      const task = document.getElementById('swarm-task-input').value.trim() || 'Build a scalable fullstack web application';
      const reasoningSelect = document.getElementById('swarm-reasoning-select');
      const reasoning = reasoningSelect ? reasoningSelect.value : 'auto';
      const term = document.getElementById('swarm-plan-output');
      term.textContent = '// Running Autonomous Swarm simulation with ' + reasoning + ' budget...';

      try {
        const res = await fetch('/api/swarm/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task, reasoning })
        });
        const data = await res.json();
        if (data.success) {
          term.textContent = data.logs.join('\\n');
          showToast('Swarm simulation complete (' + (data.plan?.reasoningProfile || 'balanced').toUpperCase() + ')');
        }
      } catch (err) {
        term.textContent = '// Error: ' + err.message;
      }
    }

    // Custom Agent Creator Handler
    async function createCustomAgentFromUi() {
      const name = document.getElementById('agent-name-input').value.trim();
      const description = document.getElementById('agent-desc-input').value.trim();
      const platform = document.getElementById('agent-platform-select').value;
      const skillsRaw = document.getElementById('agent-skills-input').value.trim();

      if (!name) {
        showToast('Agent name is required!');
        return;
      }

      const skills = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : ['senior-frontend', 'anti-slop'];

      try {
        const res = await fetch('/api/agents/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, platform, skills })
        });
        const data = await res.json();
        if (data.success) {
          showToast(\`Custom agent '\${name}' created successfully across platforms!\`);
          document.getElementById('agent-name-input').value = '';
          document.getElementById('agent-desc-input').value = '';
          document.getElementById('agent-skills-input').value = '';
        } else {
          showToast('Failed to create agent: ' + data.error);
        }
      } catch (err) {
        showToast('Error: ' + err.message);
      }
    }

    // Memory View Handlers
    async function loadMemoryView() {
      const term = document.getElementById('memory-log-container');
      const badge = document.getElementById('mem-count-badge');
      try {
        const res = await fetch('/api/memory');
        const data = await res.json();
        if (data.success && data.memory) {
          const decisions = data.memory.decisions || [];
          badge.textContent = \`\${decisions.length} decisions logged\`;
          if (decisions.length === 0) {
            term.textContent = '// No decisions logged yet. Use the form above or "vibes memory record" to persist decisions.';
          } else {
            term.textContent = decisions.map(d => \`[\${d.timestamp.slice(0, 10)}] (\${d.category}) \${d.decision} [Skills: \${d.skillsInvolved.join(', ') || 'core'}]\`).join('\\n\\n');
          }
        }
      } catch (err) {
        term.textContent = '// Error loading memory: ' + err.message;
      }
    }

    async function recordDecisionFromUi() {
      const decision = document.getElementById('mem-text-input').value.trim();
      const category = document.getElementById('mem-cat-select').value;
      if (!decision) {
        showToast('Decision text is required!');
        return;
      }
      try {
        const res = await fetch('/api/memory/record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decision, category })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Decision logged to episodic memory!');
          document.getElementById('mem-text-input').value = '';
          loadMemoryView();
        }
      } catch (err) {
        showToast('Error: ' + err.message);
      }
    }

    async function generateCheckpointFromUi() {
      try {
        const res = await fetch('/api/memory/checkpoint', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          showToast(\`Generated CHECKPOINT.md (~ \${data.checkpoint.tokensApprox} tokens)\`);
        }
      } catch (err) {
        showToast('Error: ' + err.message);
      }
    }

    // Render Recipes
    function renderRecipes(recipes) {
      const container = document.getElementById('recipes-container');
      container.innerHTML = Object.entries(recipes).map(([key, r]) => \`
        <div class="recipe-card">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span class="recipe-title">\${r.title}</span>
              <span class="stat-chip" style="color: var(--primary);">\${r.skills.length} skills</span>
            </div>
            <p class="recipe-desc">\${r.description}</p>
            <div style="margin-top: 14px; display: flex; flex-wrap: wrap; gap: 6px;">
              \${r.skills.map(s => \`<span class="subagent-skill-tag">\${s}</span>\`).join('')}
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; padding-top: 10px;">
            <button type="button" class="btn-action" onclick="applyRecipe('\${key}')">Apply Recipe via CLI</button>
          </div>
        </div>
      \`).join('');
    }

    function applyRecipe(key) {
      const cmd = \`vibes recipe apply \${key}\`;
      navigator.clipboard.writeText(cmd);
      showToast(\`Copied command: "\${cmd}" to clipboard!\`);
    }

    // Remote MCP Console Handlers
    function copyMcpUrl() {
      const url = \`http://localhost:\${studioPort}/sse\`;
      navigator.clipboard.writeText(url);
      showToast('Copied Remote MCP SSE URL to clipboard!');
    }

    function copyIdeConfig() {
      const cfg = JSON.stringify({
        mcpServers: {
          "vibes-plug": {
            url: \`http://localhost:\${studioPort}/sse\`
          }
        }
      }, null, 2);
      navigator.clipboard.writeText(cfg);
      showToast('Copied IDE configuration to clipboard!');
    }

    function copyMcpOutput() {
      const out = document.getElementById('mcp-output-terminal').textContent;
      navigator.clipboard.writeText(out);
      showToast('Copied output JSON to clipboard!');
    }

    const TOOL_SAMPLES = {
      vibes_list_skills: '{}',
      vibes_get_skill: '{\\n  "skillName": "senior-frontend"\\n}',
      vibes_ast_query: '{\\n  "action": "symbols",\\n  "filePath": "bin/vibes.mjs"\\n}',
      vibes_eval_sql: '{\\n  "sql": "CREATE TABLE users (id UUID PRIMARY KEY, email TEXT NOT NULL);"\\n}',
      vibes_arbitrate_code: '{\\n  "candidates": [\\n    { "id": "A", "label": "Draft A", "code": "export const add = (a: number, b: number): number => a + b;" }\\n  ]\\n}',
      vibes_verify_invariants: '{\\n  "typeScriptCode": "type Status = \\"idle\\" | \\"running\\" | \\"done\\";"\\n}',
      vibes_compile_cache: '{}',
      vibes_memory: '{\\n  "action": "query",\\n  "text": "Architecture"\\n}',
      vibes_swarm: '{\\n  "taskDescription": "Build a secure webhook handler for DOKU SNAP BI",\\n  "reasoningProfile": "deep"\\n}',
      vibes_batch: '{\\n  "calls": [\\n    { "tool": "vibes_list_skills", "arguments": {} },\\n    { "tool": "vibes_memory", "arguments": { "action": "checkpoint" } }\\n  ]\\n}',
      vibes_critic_validate: '{\\n  "target": "function saveUser(user: any) {\\n  return db.query(\\"SELECT * FROM users WHERE id = \\" + user.id);\\n}",\\n  "language": "typescript",\\n  "strictness": "standard"\\n}',
      vibes_visual_audit: '{\\n  "target": "<button className=\\"rounded-lg border border-border/50 px-4 py-2 hover:bg-muted font-medium tabular-nums\\">Pay Rp 150.000</button>",\\n  "viewport": "desktop"\\n}',
      vibes_eval_sandbox: '{\\n  "code": "const arr = [1, 2, 3]; arr.map(x => x * 10);",\\n  "timeoutMs": 500\\n}',
      vibes_swarm_dispatch: '{\\n  "task": "Build DOKU payment integration with Postgres RLS",\\n  "concurrency": 2,\\n  "reasoning": "deep"\\n}',
      vibes_finops_report: '{\\n  "action": "status"\\n}'
    };

    function onMcpToolChange() {
      const select = document.getElementById('mcp-tool-select');
      const tool = select.value;
      const input = document.getElementById('mcp-payload-input');
      input.value = TOOL_SAMPLES[tool] || '{}';
    }

    async function executeMcpTool() {
      const tool = document.getElementById('mcp-tool-select').value;
      const payloadStr = document.getElementById('mcp-payload-input').value;
      const term = document.getElementById('mcp-output-terminal');
      const elapsedEl = document.getElementById('mcp-elapsed');
      const execBtn = document.getElementById('mcp-exec-btn');

      let args = {};
      try {
        args = JSON.parse(payloadStr);
      } catch (err) {
        showToast('Invalid JSON in arguments: ' + err.message);
        return;
      }

      term.textContent = '// Executing ' + tool + ' via Remote MCP...';
      execBtn.disabled = true;
      execBtn.textContent = 'Executing...';

      try {
        const start = performance.now();
        const res = await fetch('/api/mcp/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool, arguments: args })
        });
        const data = await res.json();
        const elapsed = Math.round(performance.now() - start);
        elapsedEl.textContent = \`Latency: \${elapsed}ms\`;
        term.textContent = JSON.stringify(data, null, 2);
        showToast(\`Executed \${tool} successfully (\${elapsed}ms)\`);
      } catch (err) {
        term.textContent = '// Error: ' + err.message;
        showToast('Execution error: ' + err.message);
      } finally {
        execBtn.disabled = false;
        execBtn.textContent = 'Execute Tool';
      }
    }

    // Load initial data
    async function loadData() {
      try {
        const [skillsRes, subagentsRes, recipesRes, statusRes] = await Promise.all([
          fetch('/api/skills'),
          fetch('/api/subagents'),
          fetch('/api/recipes'),
          fetch('/api/status')
        ]);

        allSkills = await skillsRes.json();
        const subagents = await subagentsRes.json();
        const recipes = await recipesRes.json();
        const status = await statusRes.json();

        document.getElementById('stat-total-skills').textContent = allSkills.length;
        document.getElementById('stat-installed-skills').textContent = status.installedCount;
        
        renderSkills();
        renderSubagents(subagents);
        renderRecipes(recipes);
        onMcpToolChange();
        loadCacheStatus();
        loadFinOpsStatus();
      } catch (err) {
        showToast('Failed to load studio data: ' + err.message);
      }
    }

    async function recompileCacheFromUi() {
      const btn = document.getElementById('btn-recompile-cache');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Recompiling...';
      }
      try {
        const res = await fetch('/api/cache/compile', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          showToast('Prompt cache prefix recompiled and locked!');
          await loadCacheStatus();
        }
      } catch (err) {
        showToast('Recompile error: ' + err.message);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Recompile Prefix';
        }
      }
    }

    async function loadCacheStatus() {
      try {
        const res = await fetch('/api/cache/status');
        const data = await res.json();
        if (data.success) {
          const statsEl = document.getElementById('cache-stats-text');
          const savingsEl = document.getElementById('cache-savings-text');
          if (statsEl) {
            statsEl.innerHTML = 'Prefix Size: ~' + data.estimatedTokens + ' tokens (' + data.byteSize + ' bytes)<br>TTFT Speedup: ' + data.economics.estimatedTtfSpeedup + '<br>Status: Locked (.cache-prefix.json)';
          }
          if (savingsEl) {
            savingsEl.innerHTML = 'Anthropic Claude (90% off) : Save $' + data.economics.claudeSavingsPer1k + ' / 1k reqs<br>Google Gemini (75% off)    : Save $' + data.economics.geminiSavingsPer1k + ' / 1k reqs<br>OpenAI o3/GPT-5 (50% off)  : Save $' + data.economics.openAiSavingsPer1k + ' / 1k reqs';
          }
        }
      } catch {
        // Fallback
      }
    }

    async function loadFinOpsStatus() {
      try {
        const res = await fetch('/api/finops');
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          const savedEl = document.getElementById('stat-finops-saved');
          if (savedEl) {
            savedEl.textContent = '$' + (d.economics.primaryEstSavedUsd || '0.000');
          }
          const realizedEl = document.getElementById('finops-realized-text');
          if (realizedEl) {
            realizedEl.innerHTML = 'Realized Savings: $' + (d.economics.primaryEstSavedUsd || '0.000') + ' USD<br>' +
              'Cached Tokens: ' + (d.tokens.cachedTotal || 0).toLocaleString() + ' / ' + (d.tokens.inputTotal || 0).toLocaleString() + ' (' + (d.economics.cacheHitRatio || '0.0%') + ' hit ratio)<br>' +
              'Total Turns Tracked: ' + (d.totalRequests || 0);
          }
        }
      } catch {
        // Fallback
      }
    }

    async function resetFinOpsFromUi() {
      try {
        const res = await fetch('/api/finops/reset', { method: 'POST' });
        const json = await res.json();
        if (json.success) {
          showToast('FinOps telemetry reset successfully');
          await loadFinOpsStatus();
        }
      } catch (err) {
        showToast('Reset error: ' + err.message);
      }
    }

    async function evalSandboxFromUi() {
      const btn = document.getElementById('btn-eval-sandbox');
      const codeInput = document.getElementById('sandbox-code-input');
      const term = document.getElementById('sandbox-output-terminal');
      if (!codeInput || !term) return;

      const code = codeInput.value;
      if (!code.trim()) {
        showToast('Please enter code to evaluate in sandbox');
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Running...';
      }
      term.textContent = '// Executing isolated micro-sandbox evaluation...';

      try {
        const res = await fetch('/api/sandbox/eval', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, timeoutMs: 1000 })
        });
        const data = await res.json();
        term.textContent = JSON.stringify(data, null, 2);
        if (data.success) {
          showToast('Sandbox execution completed (' + data.executionTimeMs + 'ms)');
        } else {
          showToast('Sandbox execution error: ' + (data.error || 'Failed'));
        }
      } catch (err) {
        term.textContent = '// Error: ' + err.message;
        showToast('Sandbox error: ' + err.message);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = '▶ Run in Sandbox';
        }
      }
    }

    let currentDagPreset = 'zero-to-prod';
    let dagPresetsData = null;

    async function loadDagPreset(presetId) {
      currentDagPreset = presetId || 'zero-to-prod';
      const select = document.getElementById('dag-preset-select');
      if (select) select.value = currentDagPreset;

      if (!dagPresetsData) {
        try {
          const res = await fetch('/api/dag/presets');
          dagPresetsData = await res.json();
        } catch {
          return;
        }
      }

      const preset = dagPresetsData[currentDagPreset];
      if (!preset) return;

      renderDagGraph(preset);
    }

    function renderDagGraph(preset) {
      const container = document.getElementById('dag-nodes-container');
      if (!container) return;

      container.innerHTML = preset.nodes.map(function(node) {
        return '<div class="dag-node" id="node-' + node.id + '">' +
          '<div class="dag-node-header">' +
            '<span>' + node.label + '</span>' +
            '<span class="dag-node-budget">' + node.budget + '</span>' +
          '</div>' +
          '<div class="dag-node-skill">@' + node.skill + '</div>' +
          '<div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 4px;">Role: ' + node.domain.toUpperCase() + '</div>' +
        '</div>';
      }).join('');

      setTimeout(() => {
        drawDagEdges(preset);
      }, 50);
    }

    function drawDagEdges(preset) {
      const svg = document.getElementById('dag-svg');
      const container = document.getElementById('dag-canvas-container');
      if (!svg || !container) return;

      const containerRect = container.getBoundingClientRect();
      svg.setAttribute('width', containerRect.width);
      svg.setAttribute('height', containerRect.height);

      let paths = '';
      for (const edge of preset.edges) {
        const fromEl = document.getElementById('node-' + edge.from);
        const toEl = document.getElementById('node-' + edge.to);
        if (!fromEl || !toEl) continue;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = (fromRect.right - containerRect.left);
        const y1 = (fromRect.top + fromRect.height / 2 - containerRect.top);
        const x2 = (toRect.left - containerRect.left);
        const y2 = (toRect.top + toRect.height / 2 - containerRect.top);

        const dx = (x2 - x1) / 2;
        paths += '<path d="M ' + x1 + ' ' + y1 + ' C ' + (x1 + dx) + ' ' + y1 + ', ' + (x2 - dx) + ' ' + y2 + ', ' + x2 + ' ' + y2 + '" fill="none" stroke="rgba(6, 182, 212, 0.45)" stroke-width="2.5" stroke-dasharray="4 4" />';
      }
      svg.innerHTML = paths;
    }

    async function simulateDagExecution() {
      const traceBox = document.getElementById('dag-trace-box');
      const traceOutput = document.getElementById('dag-trace-output');
      traceBox.style.display = 'block';
      traceOutput.textContent = '⚡ Running DAG Topological Simulation...';

      try {
        const res = await fetch('/api/dag/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ presetId: currentDagPreset })
        });
        const data = await res.json();
        if (data.success) {
          traceOutput.textContent = data.traceLogs.join('\n');
          showToast('DAG Execution simulated: ' + data.stepsCompleted + ' nodes executed successfully!');

          const nodes = data.preset.nodes;
          for (let i = 0; i < nodes.length; i++) {
            const el = document.getElementById('node-' + nodes[i].id);
            if (el) {
              setTimeout(() => {
                el.classList.add('active-step');
                setTimeout(() => el.classList.remove('active-step'), 1200);
              }, i * 350);
            }
          }
        }
      } catch (err) {
        traceOutput.textContent = 'Simulation failed: ' + err.message;
      }
    }

    loadData();
  </script>
</body>
</html>`;
}

const KEBAB_SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_BODY_BYTES = 1024 * 1024;

function isValidSkillSlug(name) {
  return typeof name === 'string' && KEBAB_SLUG_REGEX.test(name.trim());
}

function resolveAllowedOrigin(req, port) {
  const origin = req.headers.origin;
  if (!origin) return `http://localhost:${port}`;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    return origin;
  }
  return 'null';
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bytes = 0;
    req.on('data', chunk => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        req.destroy();
        reject(new Error('Request payload exceeds 1MB limit'));
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export async function startStudioServer(options = {}) {
  const port = options.port || DEFAULT_PORT;
  const noOpen = options.noOpen || false;
  const sseClients = new Map();

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    const searchParams = url.searchParams;
    const allowedOrigin = resolveAllowedOrigin(req, port);

    const sendJson = (data, statusCode = 200) => {
      res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-session-id'
      });
      res.end(JSON.stringify(data));
    };

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-session-id'
      });
      res.end();
      return;
    }

    // Static HTML Studio UI
    if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(generateStudioHtml(port));
      return;
    }

    // Remote MCP Server-Sent Events (SSE) Stream
    if (req.method === 'GET' && pathname === '/sse') {
      const sessionId = crypto.randomUUID();
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': '*'
      });

      res.write(`event: endpoint\ndata: /messages?sessionId=${sessionId}\n\n`);
      sseClients.set(sessionId, res);

      req.on('close', () => {
        sseClients.delete(sessionId);
      });
      return;
    }

    // Remote MCP message receiver
    if (req.method === 'POST' && pathname === '/messages') {
      const sessionId = searchParams.get('sessionId') || req.headers['x-session-id'];
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const request = JSON.parse(body);
          const response = await handleRpcRequest(request);

          if (sessionId && sseClients.has(sessionId)) {
            const clientRes = sseClients.get(sessionId);
            clientRes.write(`event: message\ndata: ${JSON.stringify(response)}\n\n`);
          }

          sendJson({ status: 'accepted', response }, 202);
        } catch (err) {
          sendJson({ error: err.message }, 400);
        }
      });
      return;
    }

    // MCP Tools catalog for UI
    if (req.method === 'GET' && pathname === '/api/mcp/tools') {
      sendJson(MCP_TOOLS);
      return;
    }

    // Direct MCP execute endpoint for Studio console
    if (req.method === 'POST' && pathname === '/api/mcp/execute') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { tool, arguments: args } = JSON.parse(body);
          if (!tool) {
            sendJson({ error: 'Tool name is required' }, 400);
            return;
          }
          const rpcReq = {
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: { name: tool, arguments: args || {} }
          };
          const start = Date.now();
          const rpcRes = await handleRpcRequest(rpcReq);
          const elapsedMs = Date.now() - start;
          sendJson({ result: rpcRes, elapsedMs });
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
      return;
    }

    // Swarm Planning endpoint
    if (req.method === 'POST' && pathname === '/api/swarm/plan') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { task, reasoning } = JSON.parse(body);
          if (!task) {
            sendJson({ error: 'Task description is required' }, 400);
            return;
          }
          const plan = planSwarm(task, { reasoning: reasoning === 'auto' ? null : reasoning });
          sendJson({ success: true, plan });
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
      return;
    }

    // Swarm Execution Simulation endpoint
    if (req.method === 'POST' && pathname === '/api/swarm/execute') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { task, reasoning } = JSON.parse(body);
          if (!task) {
            sendJson({ error: 'Task description is required' }, 400);
            return;
          }
          const result = await executeSwarm(task, { reasoning: reasoning === 'auto' ? null : reasoning });
          sendJson({ success: true, ...result });
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
      return;
    }

    // Custom Agent Creator endpoint
    if (req.method === 'POST' && pathname === '/api/agents/create') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { name, description, skills, platform } = JSON.parse(body);
          if (!name) {
            sendJson({ error: 'Agent name is required' }, 400);
            return;
          }
          const res = await createCustomAgent({ name, description, skills, platform });
          sendJson({ success: true, agent: res });
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
      return;
    }

    // Memory Query endpoint
    if (req.method === 'GET' && pathname === '/api/memory') {
      try {
        const mem = await loadMemory();
        sendJson({ success: true, memory: mem });
      } catch (err) {
        sendJson({ error: err.message }, 500);
      }
      return;
    }

    // Memory Record endpoint
    if (req.method === 'POST' && pathname === '/api/memory/record') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { decision, category, skills } = JSON.parse(body);
          if (!decision) {
            sendJson({ error: 'Decision text is required' }, 400);
            return;
          }
          const item = await recordDecision(decision, { category, skills });
          sendJson({ success: true, item });
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
      return;
    }

    // Memory Checkpoint endpoint
    if (req.method === 'POST' && pathname === '/api/memory/checkpoint') {
      try {
        const res = await generateCompactCheckpoint();
        sendJson({ success: true, checkpoint: res });
      } catch (err) {
        sendJson({ error: err.message }, 500);
      }
      return;
    }

    // Cache status endpoint
    if (req.method === 'GET' && pathname === '/api/cache/status') {
      try {
        const status = await getCacheStatus();
        sendJson({ success: true, ...status });
      } catch (err) {
        sendJson({ error: err.message }, 500);
      }
      return;
    }

    // Cache recompile endpoint
    if (req.method === 'POST' && pathname === '/api/cache/compile') {
      try {
        const compile = await compileCache({ quiet: true });
        const status = await getCacheStatus();
        sendJson({ success: true, compile, ...status });
      } catch (err) {
        sendJson({ error: err.message }, 500);
      }
      return;
    }

    // API Routes for Skills & Status
    if (req.method === 'GET' && pathname === '/api/skills') {
      const skills = await loadSkillsCatalog();
      sendJson(skills);
      return;
    }

    if (req.method === 'GET' && pathname.startsWith('/api/skills/')) {
      const skillName = pathname.replace('/api/skills/', '').trim();
      if (!isValidSkillSlug(skillName)) {
        sendJson({ error: 'Invalid skill name format' }, 400);
        return;
      }
      const details = await getSkillDetails(skillName);
      if (details) {
        sendJson(details);
      } else {
        sendJson({ error: 'Skill not found' }, 404);
      }
      return;
    }

    if (req.method === 'GET' && pathname === '/api/subagents') {
      sendJson(SUBAGENTS);
      return;
    }

    // Critic Validate endpoint
    if (req.method === 'POST' && pathname === '/api/critic/validate') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { target, language, strictness } = JSON.parse(body);
          if (!target) {
            sendJson({ error: 'Target code or text is required' }, 400);
            return;
          }
          const { criticValidate } = await import('./critic-validator.mjs');
          const report = criticValidate(target, { language, strictness });
          sendJson({ success: true, report });
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
      return;
    }

    // Visual Audit endpoint
    if (req.method === 'POST' && pathname === '/api/visual-audit') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { target, viewport } = JSON.parse(body);
          if (!target) {
            sendJson({ error: 'Target code or file path is required' }, 400);
            return;
          }
          const { visualAudit } = await import('./visual-critic.mjs');
          const report = visualAudit(target, { viewport });
          sendJson({ success: true, report });
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/recipes') {
      sendJson(RECIPES);
      return;
    }

    if (req.method === 'GET' && pathname === '/api/status') {
      const status = await getSystemStatus();
      sendJson(status);
      return;
    }

    // DAG Presets & Simulation endpoints
    if (req.method === 'GET' && pathname === '/api/dag/presets') {
      sendJson(DAG_PRESETS);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/dag/simulate') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { presetId, task } = JSON.parse(body || '{}');
          const preset = DAG_PRESETS[presetId] || DAG_PRESETS['zero-to-prod'];
          const traceLogs = [];
          traceLogs.push(`🚀 Initiating Topological DAG Execution for "${preset.name}"...`);
          traceLogs.push(`📋 Target Goal: "${task || preset.description}"`);
          traceLogs.push(`📊 DAG Graph: ${preset.nodes.length} Specialized Nodes, ${preset.edges.length} Directed Dependencies`);

          let step = 1;
          for (const node of preset.nodes) {
            traceLogs.push(`  • Step ${step}/${preset.nodes.length}: Node [${node.label}] -> Skill @${node.skill} (Budget: ${node.budget}) [PASSED]`);
            step++;
          }
          traceLogs.push(`✅ DAG Pipeline execution completed successfully with 0 invariant violations.`);

          sendJson({
            success: true,
            preset,
            traceLogs,
            stepsCompleted: preset.nodes.length
          });
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
      return;
    }

    // Ephemeral Sandbox evaluation endpoint
    if (req.method === 'POST' && pathname === '/api/sandbox/eval') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { code, timeoutMs } = JSON.parse(body || '{}');
          const { executeInSandbox } = await import('./wasm-sandbox.mjs');
          const result = executeInSandbox(code, { timeoutMs });
          sendJson(result);
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
      return;
    }

    // FinOps Telemetry endpoints
    if (req.method === 'GET' && pathname === '/api/finops') {
      try {
        const { loadFinOpsData } = await import('./finops-tracker.mjs');
        const data = await loadFinOpsData();
        sendJson({ success: true, data });
      } catch (err) {
        sendJson({ error: err.message }, 500);
      }
      return;
    }

    if (req.method === 'POST' && pathname === '/api/finops/record') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const entry = JSON.parse(body || '{}');
          const { recordFinOpsUsage } = await import('./finops-tracker.mjs');
          const updated = await recordFinOpsUsage(entry);
          sendJson({ success: true, data: updated });
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/finops/reset') {
      try {
        const { resetFinOpsData } = await import('./finops-tracker.mjs');
        const fresh = await resetFinOpsData();
        sendJson({ success: true, data: fresh });
      } catch (err) {
        sendJson({ error: err.message }, 500);
      }
      return;
    }

    // Headless Concurrent Swarm Dispatch endpoint
    if (req.method === 'POST' && pathname === '/api/swarm/dispatch') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { task, concurrency, reasoning } = JSON.parse(body || '{}');
          if (!task) {
            sendJson({ error: 'Task description is required' }, 400);
            return;
          }
          const { dispatchSwarm } = await import('./swarm-dispatcher.mjs');
          const outcome = await dispatchSwarm(task, { concurrency, reasoning });
          sendJson(outcome);
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
      return;
    }

    // Single skill inject endpoint
    if (req.method === 'POST' && pathname === '/api/inject') {
      try {
        const { skill } = await readJsonBody(req);
        if (!skill || !isValidSkillSlug(skill)) {
          sendJson({ error: 'Valid kebab-case skill name is required' }, 400);
          return;
        }
        const sourceDir = path.resolve(SKILLS_DIR, skill.trim());
        if (!sourceDir.startsWith(SKILLS_DIR + path.sep)) {
          sendJson({ error: 'Path traversal blocked' }, 400);
          return;
        }
        const targetBaseDir = path.resolve(process.cwd(), '.agents', 'skills');
        const targetDir = path.resolve(targetBaseDir, skill.trim());

        await fs.mkdir(targetBaseDir, { recursive: true });
        await fs.cp(sourceDir, targetDir, { recursive: true });
        sendJson({ success: true, message: `Skill ${skill} injected successfully` });
      } catch (err) {
        sendJson({ error: err.message }, 500);
      }
      return;
    }

    // Batch recipe injection endpoint
    if (req.method === 'POST' && pathname === '/api/recipes/inject') {
      try {
        const { skills } = await readJsonBody(req);
        if (!Array.isArray(skills) || skills.length === 0) {
          sendJson({ error: 'Array of skill names is required' }, 400);
          return;
        }
        const targetBaseDir = path.resolve(process.cwd(), '.agents', 'skills');
        await fs.mkdir(targetBaseDir, { recursive: true });
        const injected = [];
        for (const sName of skills) {
          if (!isValidSkillSlug(sName)) continue;
          const sourceDir = path.resolve(SKILLS_DIR, sName.trim());
          if (!sourceDir.startsWith(SKILLS_DIR + path.sep)) continue;
          const targetDir = path.resolve(targetBaseDir, sName.trim());
          try {
            await fs.cp(sourceDir, targetDir, { recursive: true });
            injected.push(sName.trim());
          } catch {
            // skip missing
          }
        }
        sendJson({ success: true, count: injected.length, injected });
      } catch (err) {
        sendJson({ error: err.message }, 500);
      }
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  return new Promise((resolve, reject) => {
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
        startStudioServer({ ...options, port: port + 1 }).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });

    server.listen(port, () => {
      const localUrl = `http://localhost:${port}`;
      console.log(`\n⚡ Vibes-Plug Studio Cockpit is running at: \x1b[36m${localUrl}\x1b[0m`);
      console.log(`📡 Remote MCP SSE stream available at: \x1b[35m${localUrl}/sse\x1b[0m`);
      console.log('Press Ctrl+C to stop the Studio server.\n');

      if (!noOpen) {
        // Open browser based on OS
        const cmd = process.platform === 'win32' ? `start ${localUrl}` :
                    process.platform === 'darwin' ? `open ${localUrl}` :
                    `xdg-open ${localUrl}`;
        exec(cmd, () => {});
      }

      resolve({ server, port, url: localUrl });
    });
  });
}

// Standalone execution check
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const args = process.argv.slice(2);
  let port = DEFAULT_PORT;
  let noOpen = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) {
      port = parseInt(args[i + 1], 10) || DEFAULT_PORT;
      i++;
    } else if (args[i] === '--no-open') {
      noOpen = true;
    }
  }

  startStudioServer({ port, noOpen }).catch(err => {
    console.error('❌ Failed to start Studio server:', err.message);
    process.exit(1);
  });
}
