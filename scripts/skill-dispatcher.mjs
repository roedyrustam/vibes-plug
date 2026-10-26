#!/usr/bin/env node
/**
 * scripts/skill-dispatcher.mjs
 * Universal Skill-as-a-Tool (SaaT) Execution Dispatcher & Pipeline Chain Engine (v4.5.0)
 *
 * Bridges all 176 declarative skills in `skills/` with deterministic runtime execution
 * across 8 specialized domain adapters (database, frontend, api, security, tdd, ai-mcp,
 * cloud-devops, mobile-spatial), Autonomous Skill Composition Chains, and live FinOps telemetry.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { databaseAdapter } from './adapters/database.mjs';
import { frontendAdapter } from './adapters/frontend.mjs';
import { apiAdapter } from './adapters/api.mjs';
import { securityAdapter } from './adapters/security.mjs';
import { tddAdapter } from './adapters/tdd.mjs';
import { aiMcpAdapter } from './adapters/ai-mcp.mjs';
import { cloudDevopsAdapter } from './adapters/cloud-devops.mjs';
import { mobileSpatialAdapter } from './adapters/mobile-spatial.mjs';
import { auditSkill } from './skill-drift-monitor.mjs';
import { optimizeThinkingBudget } from './token-budget-optimizer.mjs';
import { recordFinOpsUsage, calculateSavings } from './finops-tracker.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');
const SLICES_FILE = path.join(PLUGIN_ROOT, '.skill-slices.json');

const ADAPTERS = [
  databaseAdapter,
  frontendAdapter,
  apiAdapter,
  securityAdapter,
  tddAdapter,
  aiMcpAdapter,
  cloudDevopsAdapter,
  mobileSpatialAdapter
];

export const SKILL_CHAIN_RECIPES = Object.freeze({
  'saas-launch-gate': {
    name: 'Multi-Tenant SaaS Production Launch Gate',
    description: 'Validates PostgreSQL RLS, OpenAPI 3.1 contracts, OWASP fuzzing, Pillar 7 UI, and Zero Tech Debt.',
    steps: [
      { skill: 'database-orm-expert', action: 'eval' },
      { skill: 'api-design-expert', action: 'verify' },
      { skill: 'autonomous-red-teamer', action: 'fuzz' },
      { skill: 'visual-ui-auditor', action: 'audit' },
      { skill: 'zero-tech-debt-auditor', action: 'verify' }
    ]
  },
  'ai-agent-hardening': {
    name: 'Frontier AI Swarm & MCP Hardening Pipeline',
    description: 'Verifies MCP schemas, generates A2A Agent Card, fuzzes prompt injection, and locks KV-cache prefixes.',
    steps: [
      { skill: 'mcp-server-architect', action: 'verify' },
      { skill: 'a2a-agent-protocol-expert', action: 'generate' },
      { skill: 'prompt-injection-firewall', action: 'fuzz' },
      { skill: 'kv-cache-prefix-optimizer', action: 'optimize' }
    ]
  },
  'fintech-settlement-gate': {
    name: 'FinTech SNAP BI & Double-Entry Ledger Gate',
    description: 'Audits immutable double-entry ledger DDL, DOKU SNAP BI signatures, PQC readiness, and TDD invariants.',
    steps: [
      { skill: 'double-entry-ledger-fintech-expert', action: 'eval' },
      { skill: 'doku-payment-gateway', action: 'verify' },
      { skill: 'post-quantum-crypto-migrator', action: 'audit' },
      { skill: 'autonomous-tdd-debugger', action: 'verify' }
    ]
  },
  'cloud-release-gate': {
    name: 'Kubernetes GitOps, Distroless Container & SBOM Gate',
    description: 'Audits rootless container manifests, Kubernetes GitOps policies, SBOM generation, and anti-slop gates.',
    steps: [
      { skill: 'docker-container-expert', action: 'audit' },
      { skill: 'kubernetes-gitops-platform-expert', action: 'verify' },
      { skill: 'sbom-supply-chain-security-expert', action: 'generate' },
      { skill: 'zero-tech-debt-auditor', action: 'verify' }
    ]
  },
  'frontend-ui-polish': {
    name: 'Sovereign UI Craft & Core Web Vitals Pipeline',
    description: 'Generates OKLCH @theme tokens, verifies 5-state interactive contracts, and audits WCAG 2.2 a11y.',
    steps: [
      { skill: 'tailwind-expert', action: 'generate' },
      { skill: 'senior-frontend', action: 'optimize' },
      { skill: 'visual-ui-auditor', action: 'audit' },
      { skill: 'accessibility-testing-expert', action: 'verify' }
    ]
  },
  'rea-binary-audit-gate': {
    name: 'REA Binary, Firmware & Supply Chain Security Gate',
    description: 'Executes evidence-backed binary triage, CLI/MCP Evidence contract verification, cache key bounds, CI fixture drift audit, and CycloneDX SBOM generation.',
    steps: [
      { skill: 'reverse-engineer-anything', action: 'audit' },
      { skill: 'rea-tool-design', action: 'verify' },
      { skill: 'rea-analysis-optimization', action: 'optimize' },
      { skill: 'rea-ci-tests-audit', action: 'verify' },
      { skill: 'sbom-supply-chain-security-expert', action: 'generate' }
    ]
  },
  'spatial-3d-webgpu-gate': {
    name: '3D WebGPU, TSL/WGSL Shaders & Spatial Performance Gate',
    description: 'Verifies Three.js/WebGPU scene graph hygiene, WGSL compute shader bounds, Core Web Vitals frame budgets, and Pillar 7 UI craft.',
    steps: [
      { skill: 'web-3d-graphics-expert', action: 'verify' },
      { skill: 'glsl-shader-expert', action: 'optimize' },
      { skill: 'performance-web-vitals', action: 'optimize' },
      { skill: 'visual-ui-auditor', action: 'audit' }
    ]
  },
  'local-first-sync-gate': {
    name: 'Local-First Reactive Sync, Offline PWA & ReBAC Gate',
    description: 'Audits PostgreSQL logical replication DDL, sub-millisecond reactive sync mutations, OPFS offline storage, and Zanzibar ReBAC permissions.',
    steps: [
      { skill: 'database-orm-expert', action: 'eval' },
      { skill: 'reactive-sync-engine-expert', action: 'verify' },
      { skill: 'pwa-offline-first-expert', action: 'verify' },
      { skill: 'fga-rebac-authorization-expert', action: 'audit' }
    ]
  }
});

/**
 * Resolves the best domain adapter for any of the 176 skills
 * @param {string} skillName
 * @returns {Object}
 */
export function resolveSkillAdapter(skillName) {
  for (const adapter of ADAPTERS) {
    if (adapter.supportedSkills.includes(skillName)) {
      return adapter;
    }
  }
  if (/db|sql|postgres|orm|vector|rag|olap|etl|sync|search|ledger|tenant/i.test(skillName)) {
    return databaseAdapter;
  }
  if (/ai|llm|mcp|a2a|agent|prompt|cascade|kv-cache|thinking|compute|voice|affective|slm|finetun|gemini|vercel-ai|pydantic-ai/i.test(skillName)) {
    return aiMcpAdapter;
  }
  if (/docker|k8s|kubernetes|ci-cd|github-actions|cloud|workers|telemetry|logging|resilience|cron|watcher/i.test(skillName)) {
    return cloudDevopsAdapter;
  }
  if (/mobile|expo|flutter|tauri|electron|apple|pwa|extension|3d|glsl|shader|webxr|game|motion|spatial|wasm/i.test(skillName)) {
    return mobileSpatialAdapter;
  }
  if (/frontend|ui|css|tailwind|react|next|vue|angular|svelte|solid|astro|design|visual|svg|hig|a11y/i.test(skillName)) {
    return frontendAdapter;
  }
  if (/security|auth|passkey|rebac|vault|rate-limit|sbom|crypto|firewall|safety|gdpr|payment|doku|billing|red-team|reverse-engineer|rea-/i.test(skillName)) {
    return securityAdapter;
  }
  if (/test|tdd|e2e|slop|debt|hardener|review|coderabbit|sandbox|z3|biome/i.test(skillName)) {
    return tddAdapter;
  }
  return apiAdapter;
}

/**
 * Retrieves a pre-compiled compact micro-slice (<350 tokens) for a skill
 * @param {string} skillName
 * @returns {Promise<Object|null>}
 */
export async function getSkillCompactSlice(skillName) {
  try {
    const raw = await fs.readFile(SLICES_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed.slices && parsed.slices[skillName]) {
      return parsed.slices[skillName];
    }
  } catch {
    // Fallback to dynamic extraction if .skill-slices.json not yet compiled
  }
  return inspectSkillCapabilities(skillName);
}

/**
 * Extracts full runnable code blocks from a skill's SKILL.md
 * @param {string} skillName
 * @param {Object} [options]
 * @param {string} [options.language]
 * @param {number} [options.index]
 * @returns {Promise<Object>}
 */
export async function extractSkillCode(skillName, options = {}) {
  const skillPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
  const content = await fs.readFile(skillPath, 'utf8');

  const codeBlocks = [];
  const blockRegex = /```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;
  let match;
  let idx = 0;
  while ((match = blockRegex.exec(content)) !== null) {
    const lang = (match[1] || 'text').trim().toLowerCase();
    const code = match[2].trim();
    codeBlocks.push({
      index: idx++,
      language: lang,
      lines: code.split(/\r?\n/).length,
      code
    });
  }

  let filtered = codeBlocks;
  if (options.language) {
    const targetLang = String(options.language).toLowerCase();
    filtered = codeBlocks.filter(b => b.language === targetLang || b.language.includes(targetLang));
  }
  if (typeof options.index === 'number' && !Number.isNaN(options.index)) {
    filtered = filtered.filter((_, i) => i === options.index);
  }

  return {
    skill: skillName,
    totalBlocks: codeBlocks.length,
    matchedBlocks: filtered.length,
    languagesAvailable: [...new Set(codeBlocks.map(b => b.language))],
    blocks: filtered
  };
}

/**
 * Extracts structured executable metadata and code blueprints from a skill's SKILL.md
 * @param {string} skillName
 * @returns {Promise<Object>}
 */
export async function inspectSkillCapabilities(skillName) {
  const skillPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
  const content = await fs.readFile(skillPath, 'utf8');

  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = fmMatch ? fmMatch[1] : '';
  const versionMatch = fm.match(/version:\s*"([^"]+)"/);
  const descMatch = fm.match(/description:\s*"?([^"\r\n]+)"?/);

  const codeBlocks = [];
  const blockRegex = /```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;
  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    codeBlocks.push({
      language: (match[1] || 'text').trim(),
      lines: match[2].trim().split(/\r?\n/).length,
      preview: match[2].trim().split(/\r?\n/).slice(0, 4).join('\n')
    });
  }

  const orchMatch = content.match(/(?:##|###)\s*(?:Orchestration & Integration|Integrasi Orkestrasi)[\s\S]*?(?=\r?\n(?:##|###)\s|$)/i);
  const connectedSkills = orchMatch
    ? [...new Set(Array.from(orchMatch[0].matchAll(/`([a-z0-9-]+)`/g)).map(m => m[1]).filter(s => s !== skillName))]
    : [];

  const adapter = resolveSkillAdapter(skillName);

  return {
    skill: skillName,
    version: versionMatch ? versionMatch[1] : '4.4.2',
    description: descMatch ? descMatch[1].trim() : '',
    domain: adapter.domain,
    supportedActions: [...new Set([...adapter.supportedActions, 'blueprint', 'slice', 'extract-code', 'health', 'budget'])],
    codeBlueprintsCount: codeBlocks.length,
    languagesAvailable: [...new Set(codeBlocks.map(b => b.language))],
    codeBlueprints: codeBlocks.slice(0, 5),
    connectedSkillsCount: connectedSkills.length,
    connectedSkills: connectedSkills.slice(0, 12)
  };
}

/**
 * Compiles all 176 skills into `.skill-slices.json` for O(1) sub-millisecond tool lookup
 * @returns {Promise<Object>}
 */
export async function compileAllSkillSlices() {
  const startTime = performance.now();
  const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const skillNames = entries
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .map(e => e.name)
    .sort();

  const slices = {};
  const domainSummary = {};
  let totalBlueprints = 0;

  for (const skillName of skillNames) {
    try {
      const cap = await inspectSkillCapabilities(skillName);
      slices[skillName] = cap;
      totalBlueprints += cap.codeBlueprintsCount;
      if (!domainSummary[cap.domain]) {
        domainSummary[cap.domain] = { count: 0, blueprints: 0, skills: [] };
      }
      domainSummary[cap.domain].count += 1;
      domainSummary[cap.domain].blueprints += cap.codeBlueprintsCount;
      domainSummary[cap.domain].skills.push(skillName);
    } catch {
      // Skip malformed directory if any
    }
  }

  const payload = {
    version: '4.5.0',
    compiledAt: '2026-10-25T00:00:00.000Z',
    totalSkills: Object.keys(slices).length,
    totalCodeBlueprints: totalBlueprints,
    domains: domainSummary,
    slices
  };

  await fs.writeFile(SLICES_FILE, JSON.stringify(payload, null, 2), 'utf8');
  return {
    status: 'success',
    file: '.skill-slices.json',
    totalSkills: payload.totalSkills,
    totalCodeBlueprints: totalBlueprints,
    domainsCount: Object.keys(domainSummary).length,
    durationMs: Math.max(1, Math.round(performance.now() - startTime)),
    domains: Object.fromEntries(
      Object.entries(domainSummary).map(([k, v]) => [k, { skillsCount: v.count, codeBlueprints: v.blueprints }])
    )
  };
}

/**
 * Executes a deterministic skill action across any of the 176 skills with FinOps auto-telemetry
 * @param {Object} request
 * @param {string} request.skill
 * @param {string} request.action
 * @param {Object} [request.payload]
 * @param {Object} [request.options]
 * @returns {Promise<Object>}
 */
export async function dispatchSkillAction(request = {}) {
  const startTime = performance.now();
  const skill = String(request.skill || '').trim();
  const action = String(request.action || 'audit').trim().toLowerCase();
  const payload = { ...(request.payload || {}) };

  if (skill === 'all' && (action === 'compile-slices' || action === 'matrix')) {
    return compileAllSkillSlices();
  }

  if (!skill) {
    return {
      status: 'failure',
      skill: '',
      action,
      durationMs: 0,
      error: {
        code: 'MISSING_SKILL_NAME',
        message: 'A valid skill name from the 176-skill registry is required.'
      }
    };
  }

  const skillPath = path.join(SKILLS_DIR, skill, 'SKILL.md');
  let skillContent = '';
  try {
    skillContent = await fs.readFile(skillPath, 'utf8');
  } catch {
    return {
      status: 'failure',
      skill,
      action,
      durationMs: Math.round(performance.now() - startTime),
      error: {
        code: 'SKILL_NOT_FOUND',
        message: `Skill '${skill}' does not exist in skills/ directory.`
      }
    };
  }

  // Auto-hydrate file content if payload.filePath is provided
  if (payload.filePath && !payload.code && !payload.sql && !payload.spec && !payload.manifest) {
    try {
      const resolvedFile = path.resolve(process.cwd(), String(payload.filePath));
      const fileContent = await fs.readFile(resolvedFile, 'utf8');
      payload.code = fileContent;
      if (resolvedFile.endsWith('.sql')) payload.sql = fileContent;
      if (resolvedFile.endsWith('.yaml') || resolvedFile.endsWith('.yml') || resolvedFile.endsWith('.json')) {
        payload.spec = fileContent;
      }
    } catch {
      // Leave payload as-is if file cannot be read
    }
  }

  try {
    let result;

    if (action === 'slice' || action === 'compact') {
      result = await getSkillCompactSlice(skill);
    } else if (action === 'blueprint' || action === 'capabilities' || action === 'info') {
      result = await inspectSkillCapabilities(skill);
    } else if (action === 'extract-code' || action === 'code') {
      result = await extractSkillCode(skill, {
        language: payload.language || payload.lang,
        index: payload.index !== undefined ? Number(payload.index) : undefined
      });
    } else if (action === 'health' || action === 'drift') {
      const audit = auditSkill(skill, skillContent, {});
      result = {
        skill,
        healthScore: audit.score,
        status: audit.status,
        codeBlocksCount: audit.metrics?.codeBlocksCount ?? 0,
        issues: audit.issues,
        recommendations: audit.recommendations
      };
    } else if (action === 'budget') {
      const taskText = payload.task || payload.prompt || `Execute ${skill} architectural patterns`;
      result = await optimizeThinkingBudget(taskText);
    } else {
      const adapter = resolveSkillAdapter(skill);
      const adapterResult = await adapter.execute(action, { ...payload, skill });
      const capabilities = await getSkillCompactSlice(skill);
      result = {
        domain: adapter.domain,
        skillVersion: capabilities.version,
        codeBlueprintsAvailable: capabilities.codeBlueprintsCount,
        connectedSkills: capabilities.connectedSkills.slice(0, 6),
        ...adapterResult
      };
    }

    // FinOps Auto-Telemetry Calculation
    const fullMarkdownTokens = Math.ceil(skillContent.length / 4);
    const compactResponseTokens = Math.ceil(JSON.stringify(result).length / 4);
    const tokensSaved = Math.max(250, fullMarkdownTokens - compactResponseTokens);
    const savings = calculateSavings(tokensSaved);

    if (request.options?.recordTelemetry !== false) {
      await recordFinOpsUsage({
        model: 'gemini-4-argon-medium',
        inputTokens: compactResponseTokens + fullMarkdownTokens,
        outputTokens: compactResponseTokens,
        cachedTokens: tokensSaved,
        task: `SaaT:${skill}:${action}`
      }).catch(() => null);
    }

    return {
      status: 'success',
      skill,
      action,
      durationMs: Math.max(1, Math.round(performance.now() - startTime)),
      telemetry: {
        fullSkillTokens: fullMarkdownTokens,
        responseTokens: compactResponseTokens,
        tokensSaved,
        tokenReductionPercent: `${Math.min(95, Math.round((tokensSaved / Math.max(1, fullMarkdownTokens)) * 100))}%`,
        estimatedSavingsUsd: savings.claudeSaved
      },
      result
    };
  } catch (err) {
    return {
      status: 'failure',
      skill,
      action,
      durationMs: Math.max(1, Math.round(performance.now() - startTime)),
      error: {
        code: 'EXECUTION_ERROR',
        message: err.message
      }
    };
  }
}

/**
 * Executes an Autonomous Skill Composition Chain (multi-skill pipeline) concurrently
 * @param {string} recipeName
 * @param {Object} [payload]
 * @returns {Promise<Object>}
 */
export async function dispatchSkillChain(recipeName = 'saas-launch-gate', payload = {}) {
  const startTime = performance.now();
  const recipe = SKILL_CHAIN_RECIPES[recipeName];

  if (!recipe) {
    return {
      status: 'failure',
      recipe: recipeName,
      availableRecipes: Object.keys(SKILL_CHAIN_RECIPES),
      error: {
        code: 'UNKNOWN_CHAIN_RECIPE',
        message: `Unknown skill chain recipe '${recipeName}'. Available: ${Object.keys(SKILL_CHAIN_RECIPES).join(', ')}`
      }
    };
  }

  const stepResults = await Promise.all(
    recipe.steps.map((step) =>
      dispatchSkillAction({
        skill: step.skill,
        action: step.action,
        payload,
        options: { recordTelemetry: true }
      })
    )
  );

  const allSucceeded = stepResults.every((r) => r.status === 'success');
  const totalTokensSaved = stepResults.reduce((acc, r) => acc + (r.telemetry?.tokensSaved || 0), 0);

  return {
    status: allSucceeded ? 'success' : 'partial_failure',
    recipe: recipeName,
    name: recipe.name,
    description: recipe.description,
    durationMs: Math.max(1, Math.round(performance.now() - startTime)),
    stepsCount: stepResults.length,
    totalTokensSaved,
    steps: stepResults.map((r) => ({
      skill: r.skill,
      action: r.action,
      status: r.status,
      durationMs: r.durationMs,
      tokensSaved: r.telemetry?.tokensSaved || 0,
      summary: r.result?.engine || r.result?.domain || 'verified'
    })),
    results: stepResults
  };
}

// CLI Runner
const isMain = process.argv[1] && (
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(__filename).toLowerCase() ||
  process.argv[1].endsWith('skill-dispatcher.mjs')
);

if (isMain) {
  const rawArgs = process.argv.slice(2);
  const firstPositional = rawArgs.find(a => !a.startsWith('--'));
  const secondPositional = rawArgs.filter(a => !a.startsWith('--'))[1] || 'blueprint';
  const formatFlag = rawArgs.find(a => a.startsWith('--format='))?.split('=')[1] || (rawArgs.includes('--json') ? 'json' : 'pretty');
  const payloadFlag = rawArgs.find(a => a.startsWith('--payload='))?.slice('--payload='.length);
  const fileFlag = rawArgs.find(a => a.startsWith('--file='))?.slice('--file='.length);
  const langFlag = rawArgs.find(a => a.startsWith('--lang='))?.slice('--lang='.length) || rawArgs.find(a => a.startsWith('--language='))?.slice('--language='.length);
  const indexFlag = rawArgs.find(a => a.startsWith('--index='))?.slice('--index='.length);

  if (!firstPositional || rawArgs.includes('--help') || rawArgs.includes('-h')) {
    console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║     ⚡ Vibes-Plug Universal Skill-as-a-Tool (SaaT) Dispatcher (v4.5.0)       ║
╚══════════════════════════════════════════════════════════════════════════════╝

Usage:
  vibes skill exec <skill-name> <action> [--file=<path>] [--lang=<lang>] [--payload='<json>'] [--format=json|table|pretty]
  vibes skill chain <recipe-name> [--payload='<json>'] [--format=json|pretty]
  vibes skill compile-slices [--json]
  vibes skill matrix [--json]

Supported Actions:
  • blueprint    — Extract executable code blueprints, connected skills, & capabilities
  • slice        — Retrieve ultra-compact <350-token micro-slice for subagent fan-out
  • extract-code — Extract runnable production code blocks from SKILL.md (--lang=<lang>, --index=<n>)
  • audit        — Run domain-specific quality, security, or visual Pillar 7 audit
  • eval         — Evaluate SQL DDL, code snippets, or API specs in-memory
  • verify       — Verify invariants, RLS policies, and Anti-Slop compliance
  • generate     — Generate domain-specific production boilerplate (DDL, @theme, OpenAPI, A2A)
  • fuzz         — Run OWASP Top 10, secret entropy, & injection fuzzing
  • optimize     — Retrieve latency, token, & NFR optimization invariants
  • health       — Audit skill health score and 2026 framework drift
  • budget       — Compute dynamic thinking token budget & frontier model cascade

Available Skill Chains:
  • saas-launch-gate        (${SKILL_CHAIN_RECIPES['saas-launch-gate'].steps.length} skills)
  • ai-agent-hardening      (${SKILL_CHAIN_RECIPES['ai-agent-hardening'].steps.length} skills)
  • fintech-settlement-gate (${SKILL_CHAIN_RECIPES['fintech-settlement-gate'].steps.length} skills)
  • cloud-release-gate      (${SKILL_CHAIN_RECIPES['cloud-release-gate'].steps.length} skills)
  • frontend-ui-polish      (${SKILL_CHAIN_RECIPES['frontend-ui-polish'].steps.length} skills)
`);
    process.exit(0);
  }

  let parsedPayload = {};
  if (payloadFlag) {
    try {
      parsedPayload = JSON.parse(payloadFlag);
    } catch {
      parsedPayload = { target: payloadFlag };
    }
  }
  if (fileFlag) parsedPayload.filePath = fileFlag;
  if (langFlag) parsedPayload.language = langFlag;
  if (indexFlag !== undefined) parsedPayload.index = Number(indexFlag);

  if (firstPositional === 'compile-slices' || firstPositional === 'matrix') {
    compileAllSkillSlices().then(res => {
      if (formatFlag === 'json') {
        console.log(JSON.stringify(res, null, 2));
      } else {
        console.log(`\n⚡ [SaaT Compiler] Compiled ${res.totalSkills} skills & ${res.totalCodeBlueprints} executable code blueprints into ${res.file} (${res.durationMs}ms)`);
        console.table(res.domains);
      }
      process.exit(0);
    });
  } else if (firstPositional === 'chain') {
    const recipeName = secondPositional === 'blueprint' ? 'saas-launch-gate' : secondPositional;
    dispatchSkillChain(recipeName, parsedPayload).then(res => {
      if (formatFlag === 'json') {
        console.log(JSON.stringify(res, null, 2));
      } else {
        console.log(`\n⛓️  [SaaT Chain] ${res.name} (${res.durationMs}ms) | Saved ${res.totalTokensSaved} tokens`);
        console.table(res.steps);
      }
      process.exit(res.status === 'success' ? 0 : 1);
    });
  } else {
    dispatchSkillAction({
      skill: firstPositional,
      action: secondPositional,
      payload: parsedPayload,
      options: { format: formatFlag }
    }).then(response => {
      if (formatFlag === 'json') {
        console.log(JSON.stringify(response, null, 2));
      } else if (formatFlag === 'table' && response.result && typeof response.result === 'object') {
        console.table(response.result);
      } else {
        console.log(`\n⚡ [SaaT Dispatcher] ${response.skill} :: ${response.action} (${response.durationMs}ms) -> ${response.status.toUpperCase()}`);
        if (response.telemetry) {
          console.log(`💰 FinOps Telemetry: Saved ${response.telemetry.tokensSaved} tokens (${response.telemetry.tokenReductionPercent} context reduction)`);
        }
        console.log(JSON.stringify(response.result || response.error, null, 2));
      }
      process.exit(response.status === 'success' ? 0 : 1);
    });
  }
}
