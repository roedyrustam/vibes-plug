#!/usr/bin/env node

/**
 * Vibes-Plug Studio Cockpit Server
 * Lightweight, zero-dependency local web dashboard for Vibes-Plug Pro.
 * Visualizes the 150 AI domain skills, subagent swarm topologies, superintelligence engines, and project diagnostics.
 * 
 * Usage:
 *   node scripts/studio-server.mjs [--port 3888] [--no-open]
 *   vibes studio [--port 3888] [--no-open]
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

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
    icon: '🎨',
    color: '#06b6d4'
  },
  backend: {
    id: 'backend',
    label: 'Backend & System Design',
    icon: '⚙️',
    color: '#3b82f6'
  },
  ai: {
    id: 'ai',
    label: 'Frontier AI, LLM & MCP',
    icon: '🤖',
    color: '#a855f7'
  },
  saas: {
    id: 'saas',
    label: 'SaaS, FinTech & Growth',
    icon: '💸',
    color: '#10b981'
  },
  security: {
    id: 'security',
    label: 'Testing, Security & Anti-Slop',
    icon: '🛡️',
    color: '#ef4444'
  },
  data: {
    id: 'data',
    label: 'Data, Media & Orchestration',
    icon: '🚀',
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

  // Backend
  'api-design-expert': 'backend', 'api-gateway-proxy-expert': 'backend', 'async-queue-temporal-expert': 'backend',
  'autonomous-api-drift-healer': 'backend', 'bun-runtime-expert': 'backend', 'composable-mach-architect': 'backend',
  'cron-scheduler-expert': 'backend', 'domain-driven-design-expert': 'backend', 'ephemeral-wasm-sandbox-executor': 'backend',
  'event-driven-architect': 'backend', 'fullstack-expert': 'backend', 'go-programming-expert': 'backend',
  'graphql-apollo-expert': 'backend', 'js-backend-expert': 'backend', 'legacy-code-translator': 'backend',
  'living-codebase-ast-graph': 'backend', 'monorepo-architect': 'backend', 'mvc-expert': 'backend',
  'openapi-swagger-codegen-expert': 'backend', 'python-programming-expert': 'backend', 'rust-programming-expert': 'backend',
  'scalability-clean-code': 'backend', 'spec-driven-development-expert': 'backend', 'typescript-expert': 'backend',
  'wasm-edge-computing-expert': 'backend', 'web-game-engine-expert': 'backend',

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

  // Data & Orchestration
  'agy-customizations': 'data', 'brainstorming': 'data', 'browser-automation-expert': 'data',
  'ci-cd-devops-architect': 'data', 'cloud-hosting-expert': 'data', 'data-pipeline-etl-expert': 'data',
  'data-visualization-expert': 'data', 'database-orm-expert': 'data', 'dependency-upgrade-migrator': 'data',
  'documentation-site-expert': 'data', 'file-upload-media-expert': 'data', 'geospatial-maps-expert': 'data',
  'pdf-document-generation-expert': 'data', 'prd-architect': 'data', 'proactive-background-watcher': 'data',
  'production-ready-hardener': 'data', 'search-engine-expert': 'data', 'self-healing-cloud-orchestrator': 'data',
  'session-memory-manager': 'data', 'web-scraper': 'data', 'website-design-cloner': 'data', 'zero-to-prod-orchestrator': 'data'
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
    skills: ['nextjs-app-router-expert', 'authentication-identity-expert', 'database-orm-expert', 'payment-gateway-expert', 'e2e-testing-expert', 'error-resilience-expert']
  },
  'security-hardened': {
    title: 'Security Hardened',
    description: 'Security-first stack: zero-trust, rate limiting, auth, GDPR compliance, and dynamic red teaming',
    skills: ['zero-trust-secret-vault', 'rate-limit-abuse-prevention', 'authentication-identity-expert', 'compliance-gdpr-privacy-expert', 'autonomous-red-teamer', 'supabase-security-expert']
  },
  'realtime-app': {
    title: 'Real-Time App',
    description: 'Real-time collaboration: WebSockets, SSE, CRDT state sync, and streaming',
    skills: ['realtime-collaboration-expert', 'sse-websocket-streaming-expert', 'state-management-expert', 'error-resilience-expert']
  },
  'mobile-first': {
    title: 'Mobile First',
    description: 'Cross-platform mobile stack: Expo, offline-first PWA, push notifications, and API design',
    skills: ['mobile-expo-expert', 'pwa-offline-first-expert', 'authentication-identity-expert', 'api-design-expert', 'email-notification-expert']
  },
  'data-platform': {
    title: 'Data Platform',
    description: 'Data engineering: ETL pipelines, visualization dashboards, OpenTelemetry telemetry, and full-text search',
    skills: ['data-pipeline-etl-expert', 'data-visualization-expert', 'data-telemetry-expert', 'search-engine-expert']
  }
};

const SUBAGENTS = [
  {
    id: 'swarm-architect',
    name: 'Swarm Architect',
    role: 'System Discovery, PRD Architecture & Database ERD',
    skills: ['brainstorming', 'prd-architect', 'domain-driven-design-expert', 'saas-architect', 'spec-driven-development-expert'],
    topology: 'Fan-Out / Fan-In Orchestrator'
  },
  {
    id: 'fullstack-craftsman',
    name: 'Fullstack Craftsman',
    role: 'Fullstack Craftsmanship & Type-Safe Implementation',
    skills: ['senior-frontend', 'tailwind-expert', 'design-system-architect', 'js-backend-expert', 'database-orm-expert', 'spec-driven-development-expert', 'browser-extension-mv3-pro'],
    topology: 'Pipeline Saga Implementer'
  },
  {
    id: 'quality-guardian',
    name: 'Quality Guardian',
    role: 'Zero-Tolerance Anti-Slop, TDD & Security Red Teaming',
    skills: ['anti-slop', 'autonomous-tdd-debugger', 'e2e-testing-expert', 'autonomous-red-teamer', 'formal-spec-z3-verifier', 'spec-driven-development-expert'],
    topology: 'Critic-Validator Gatekeeper'
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
        let version = '4.2.2';

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

  return {
    version: pkg.version,
    totalSkills: 150,
    installedCount,
    nodeVersion: process.version,
    platform: process.platform,
    workingDirectory: process.cwd(),
    cachePrefix: cacheStatus
  };
}

function generateStudioHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibes-Plug Studio Cockpit | 150-Skill Swarm Architecture</title>
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

    /* Scrollbar */
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
      font-size: 20px;
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
      font-size: 14px;
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
      transition: all 0.2s ease;
    }

    .pill-btn:hover {
      border-color: rgba(255, 255, 255, 0.2);
      color: var(--text);
    }

    .pill-btn.active {
      background: rgba(6, 182, 212, 0.15);
      border-color: var(--primary);
      color: var(--primary);
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
      padding: 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .skill-card:hover {
      background: var(--card-hover);
      border-color: var(--card-border-active);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }

    .skill-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
    }

    .skill-title {
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: -0.01em;
      color: #ffffff;
      font-family: var(--font-mono);
      word-break: break-word;
    }

    .skill-badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid transparent;
      white-space: nowrap;
    }

    .skill-desc {
      color: var(--text-muted);
      font-size: 0.85rem;
      line-height: 1.45;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .skill-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.78rem;
    }

    .installed-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-mono);
      font-size: 0.75rem;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .status-dot.installed { background: var(--success); box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
    .status-dot.available { background: var(--text-muted); opacity: 0.4; }

    .btn-action {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-action:hover {
      background: var(--primary);
      color: #000;
      border-color: var(--primary);
    }

    /* Subagent Topology Section */
    .subagent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .subagent-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      overflow: hidden;
    }

    .subagent-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
    }

    .subagent-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .subagent-name {
      font-size: 1.15rem;
      font-weight: 700;
      color: #fff;
    }

    .subagent-topology {
      font-size: 0.75rem;
      font-family: var(--font-mono);
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
      color: var(--accent);
      padding: 3px 8px;
      border-radius: 6px;
    }

    .subagent-role {
      font-size: 0.88rem;
      color: var(--text-muted);
    }

    .subagent-skills-label {
      font-size: 0.78rem;
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
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-family: var(--font-mono);
      font-size: 0.78rem;
      padding: 3px 8px;
      border-radius: 6px;
      color: #cbd5e1;
    }

    /* Superintelligence Engines Cockpit */
    .engines-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
    }

    .engine-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .engine-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .engine-title h3 {
      font-size: 1.05rem;
      font-weight: 700;
    }

    .engine-code {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px 14px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: var(--primary);
    }

    /* Recipe Bundles */
    .recipes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 20px;
    }

    .recipe-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
    }

    .recipe-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #fff;
    }

    .recipe-desc {
      font-size: 0.88rem;
      color: var(--text-muted);
    }

    /* Modal Drawer */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 20px;
    }

    .modal-backdrop.open {
      display: flex;
    }

    .modal-dialog {
      background: #0d1527;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      max-width: 800px;
      width: 100%;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
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
      font-size: 24px;
      cursor: pointer;
      line-height: 1;
    }

    .close-btn:hover {
      color: #fff;
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

    /* Footer */
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
        <div class="brand-badge">⚡</div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="brand-title">VibesPlug Pro Studio</div>
            <div class="brand-tag">v4.2.2</div>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Autonomous 150-Agent Swarm Operating System</div>
        </div>
      </div>

      <div class="header-stats">
        <div class="stat-chip">
          <span>Skills:</span>
          <span class="num" id="stat-total-skills">150</span>
        </div>
        <div class="stat-chip">
          <span>Installed:</span>
          <span class="num" id="stat-installed-skills">0</span>
        </div>
        <div class="stat-chip">
          <span>KV-Cache:</span>
          <span class="num" id="stat-cache-status">LOCKED (P1)</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Tab Navigation -->
  <nav class="tab-nav">
    <button type="button" class="tab-btn active" data-tab="tab-arsenal">150-Skill Arsenal</button>
    <button type="button" class="tab-btn" data-tab="tab-subagents">Native Subagent Swarm</button>
    <button type="button" class="tab-btn" data-tab="tab-engines">Superintelligence (P1–P5)</button>
    <button type="button" class="tab-btn" data-tab="tab-recipes">Curated Recipes</button>
  </nav>

  <!-- Main Content -->
  <main>
    <!-- View 1: 150-Skill Arsenal -->
    <div id="tab-arsenal" class="view-pane active">
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <span class="search-icon">Search:</span>
          <input type="text" id="skill-search" class="search-input" placeholder="Search 150 skills (press '/' to focus)...">
        </div>
        <div class="category-pills">
          <button type="button" class="pill-btn active" data-category="all">All Domains (150)</button>
          <button type="button" class="pill-btn" data-category="frontend">Frontend &amp; UI</button>
          <button type="button" class="pill-btn" data-category="backend">Backend &amp; API</button>
          <button type="button" class="pill-btn" data-category="ai">AI &amp; MCP</button>
          <button type="button" class="pill-btn" data-category="saas">SaaS &amp; FinTech</button>
          <button type="button" class="pill-btn" data-category="security">Security &amp; Anti-Slop</button>
          <button type="button" class="pill-btn" data-category="data">Data &amp; Lifecycle</button>
        </div>
      </div>

      <div id="skills-container" class="skills-grid">
        <!-- Dynamically rendered skill cards -->
      </div>
    </div>

    <!-- View 2: Subagents Swarm Topology -->
    <div id="tab-subagents" class="view-pane">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 6px;">Native Specialist Subagents (Agents Registry)</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">
          These 5 dedicated specialist agents coordinate dynamically via Fan-Out/Fan-In and Critic-Validator loops across all IDEs.
        </p>
      </div>
      <div id="subagents-container" class="subagent-grid">
        <!-- Dynamically rendered subagents -->
      </div>
    </div>

    <!-- View 3: Superintelligence Engines (P1-P5) -->
    <div id="tab-engines" class="view-pane">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 6px;">Superintelligence Engineering Substrate (P1 – P5)</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">
          Hardcore deterministic engines providing sub-millisecond AST queries, in-memory sandboxing, and mathematical theorem verification.
        </p>
      </div>
      <div class="engines-grid">
        <div class="engine-card">
          <div class="engine-title">
            <h3>P1: Prompt-Cache Compiler</h3>
            <span class="skill-badge" style="background: rgba(6, 182, 212, 0.15); color: var(--primary);">ACTIVE</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            Compiles deterministic instruction set into <code>.cache-prefix.json</code> (>1024 tokens) to lock KV-Cache reuse, slashing LLM API billing by 75–90%.
          </p>
          <div class="engine-code">vibes compile-cache</div>
        </div>

        <div class="engine-card">
          <div class="engine-title">
            <h3>P2: In-Memory DB Sandbox</h3>
            <span class="skill-badge" style="background: rgba(16, 185, 129, 0.15); color: var(--success);">ACTIVE</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            In-memory SQLite simulation to audit PostgreSQL DDL migrations, verify RLS policies, and prevent destructive schema migrations.
          </p>
          <div class="engine-code">vibes db:eval [migration.sql]</div>
        </div>

        <div class="engine-card">
          <div class="engine-title">
            <h3>P3: AST Subgraph Query Engine</h3>
            <span class="skill-badge" style="background: rgba(139, 92, 246, 0.15); color: var(--accent);">ACTIVE</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            In-memory symbol extraction, function isolation, and blast radius calculation without bloating AI context windows.
          </p>
          <div class="engine-code">vibes ast symbols [file.ts]</div>
        </div>

        <div class="engine-card">
          <div class="engine-title">
            <h3>P4: Speculative PRM Arbiter</h3>
            <span class="skill-badge" style="background: rgba(245, 158, 11, 0.15); color: var(--warning);">ACTIVE</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            Process Reward Model (PRM) scoring competing code drafts across Type Safety, Anti-Slop, and Algorithmic Complexity.
          </p>
          <div class="engine-code">vibes arbitrate draftA.ts draftB.ts</div>
        </div>

        <div class="engine-card">
          <div class="engine-title">
            <h3>P5: Neuro-Symbolic Invariant Verifier</h3>
            <span class="skill-badge" style="background: rgba(239, 68, 68, 0.15); color: var(--danger);">ACTIVE</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            Mathematical proof of state machine transitions (billing, auth, orders) and SMT-LIB 2.0 generation for Z3/CVC5 solver verification.
          </p>
          <div class="engine-code">vibes verify-invariants state.json</div>
        </div>
      </div>
    </div>

    <!-- View 4: Curated Recipe Bundles -->
    <div id="tab-recipes" class="view-pane">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 6px;">Curated Skill Recipe Bundles</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">
          One-click battle-tested bundles pre-packaged for specific project architectures.
        </p>
      </div>
      <div id="recipes-container" class="recipes-grid">
        <!-- Dynamically rendered recipes -->
      </div>
    </div>
  </main>

  <!-- Modal Dialog -->
  <div id="skill-modal" class="modal-backdrop">
    <div class="modal-dialog">
      <div class="modal-header">
        <h2 id="modal-skill-title">Skill Title</h2>
        <button type="button" id="modal-close" class="close-btn" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal-body" id="modal-skill-body">
        <!-- Markdown content -->
      </div>
      <div class="modal-footer">
        <button type="button" id="modal-copy-prompt" class="btn-action" style="padding: 8px 16px;">Copy AI Trigger Prompt</button>
        <button type="button" id="modal-inject-btn" class="btn-action" style="background: var(--primary); color: #000; padding: 8px 16px;">Inject into Project</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="toast">
    <span id="toast-icon">✅</span>
    <span id="toast-message">Action successful!</span>
  </div>

  <!-- Footer -->
  <footer>
    VibesPlug Pro v4.2.2 &bull; Engineered by Roedy Rustam &bull; Universal Swarm Architecture &bull; Zero AI Slop
  </footer>

  <script>
    let allSkills = [];
    let currentCategory = 'all';
    let searchQuery = '';
    let activeModalSkill = null;

    // Toast helper
    function showToast(message, icon = '✅') {
      const toast = document.getElementById('toast');
      document.getElementById('toast-icon').textContent = icon;
      document.getElementById('toast-message').textContent = message;
      toast.style.display = 'flex';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    }

    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');
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

    // Keyboard shortcut '/' to search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
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
          injectBtn.textContent = '✅ Already Installed Locally';
          injectBtn.style.opacity = '0.7';
          injectBtn.disabled = true;
        } else {
          injectBtn.textContent = '➕ Inject into Local Project (.agents/skills)';
          injectBtn.style.opacity = '1';
          injectBtn.disabled = false;
        }

        modal.classList.add('open');
      } catch (err) {
        showToast('Error loading skill: ' + err.message, '❌');
      }
    }

    // Modal copy prompt button
    document.getElementById('modal-copy-prompt').addEventListener('click', () => {
      if (!activeModalSkill) return;
      const promptText = \`Use the \${activeModalSkill.name} skill to execute this task following standard operating procedures.\`;
      navigator.clipboard.writeText(promptText);
      showToast('Copied trigger prompt to clipboard!');
    });

    // Modal inject button
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
          document.getElementById('modal-inject-btn').textContent = '✅ Already Installed Locally';
          document.getElementById('modal-inject-btn').disabled = true;
          loadData();
        } else {
          showToast(result.error || 'Failed to inject', '❌');
        }
      } catch (err) {
        showToast('Error injecting skill: ' + err.message, '❌');
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
        return \`
          <div class="skill-card" role="button" tabindex="0" onclick="openSkillModal('\${s.name}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openSkillModal('\${s.name}')}">
            <div>
              <div class="skill-header">
                <span class="skill-title">\${s.name}</span>
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
          <div style="display: flex; justify-content: flex-end; pt-2;">
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
      } catch (err) {
        showToast('Failed to load studio data: ' + err.message, '❌');
      }
    }

    loadData();
  </script>
</body>
</html>`;
}

export async function startStudioServer(options = {}) {
  const port = options.port || DEFAULT_PORT;
  const noOpen = options.noOpen || false;

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    // Set CORS and JSON helper
    const sendJson = (data, statusCode = 200) => {
      res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(data));
    };

    if (req.method === 'GET' && pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(generateStudioHtml());
      return;
    }

    if (req.method === 'GET' && pathname === '/api/skills') {
      const skills = await loadSkillsCatalog();
      sendJson(skills);
      return;
    }

    if (req.method === 'GET' && pathname.startsWith('/api/skills/')) {
      const skillName = pathname.replace('/api/skills/', '').trim();
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

    if (req.method === 'GET' && pathname === '/api/recipes') {
      sendJson(RECIPES);
      return;
    }

    if (req.method === 'GET' && pathname === '/api/status') {
      const status = await getSystemStatus();
      sendJson(status);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/inject') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { skill } = JSON.parse(body);
          if (!skill) {
            sendJson({ error: 'Skill name is required' }, 400);
            return;
          }
          const sourceDir = path.join(SKILLS_DIR, skill);
          const targetBaseDir = path.join(process.cwd(), '.agents', 'skills');
          const targetDir = path.join(targetBaseDir, skill);

          await fs.mkdir(targetBaseDir, { recursive: true });
          await fs.cp(sourceDir, targetDir, { recursive: true });
          sendJson({ success: true, message: `Skill ${skill} injected successfully` });
        } catch (err) {
          sendJson({ error: err.message }, 500);
        }
      });
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
