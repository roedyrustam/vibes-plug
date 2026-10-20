#!/usr/bin/env node

/**
 * Vibes-Plug Self-Balancing Dynamic Token Budget Optimizer & Complexity Scorer
 *
 * Evaluates multi-dimensional task signals across:
 * 1. Domain Breadth (Frontend, Backend, Database, Security, FinTech, AI/MCP)
 * 2. Architectural Risk Factors (Migrations, Idempotency, Auth Boundaries, FSM)
 * 3. Code Structural Complexity (AST Nesting Depth, Cyclomatic Branching)
 * 4. Cognitive & Reasoning Requirements
 *
 * Outputs:
 * - Composite Complexity Score (0 - 100) & Tier (LOW, MODERATE, HIGH, CRITICAL)
 * - Optimal Thinking Budget Tokens (1,024 to 65,536 tokens)
 * - Model Tier & Multi-Provider Payloads (Gemini 4, Claude 3.7/5.1, OpenAI o3)
 * - Auto-Bound Skills from the 161-Skill Registry
 * - Projected Token & Financial Savings vs Unconstrained Reasoning
 *
 * Usage:
 *   node scripts/token-budget-optimizer.mjs "Task description or path to file" [--json]
 *   vibes budget "Task description or path to file" [--json]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

export const DOMAIN_TAXONOMY = {
  frontend: {
    name: 'Frontend & UI Craft',
    keywords: ['react', 'nextjs', 'vue', 'tailwind', 'css', 'html', 'component', 'ui', 'ux', 'button', 'modal', 'layout', 'responsive', 'canvas', 'svg', 'a11y', 'wcag'],
    skills: ['senior-frontend', 'tailwind-expert', 'ui-ux-pro-max', 'modern-css-native-expert', 'design-system-architect']
  },
  backend: {
    name: 'Backend & System Design',
    keywords: ['api', 'hono', 'express', 'rest', 'graphql', 'grpc', 'endpoint', 'server', 'microservice', 'controller', 'service', 'route', 'websocket', 'sse'],
    skills: ['js-backend-expert', 'api-design-expert', 'spec-driven-development-expert', 'event-driven-architect']
  },
  database: {
    name: 'Database, ORM & Storage',
    keywords: ['sql', 'postgres', 'prisma', 'drizzle', 'migration', 'schema', 'table', 'rls', 'query', 'index', 'database', 'foreign key', 'orm', 'ddl'],
    skills: ['database-orm-expert', 'data-pipeline-etl-expert', 'supabase-security-expert']
  },
  security: {
    name: 'Security & Identity Isolation',
    keywords: ['auth', 'jwt', 'session', 'oauth', 'permission', 'rbac', 'abac', 'sanitize', 'xss', 'csrf', 'security', 'red-team', 'secret', 'vault', 'gdpr'],
    skills: ['authentication-identity-expert', 'autonomous-red-teamer', 'zero-trust-secret-vault', 'rate-limit-abuse-prevention']
  },
  fintech: {
    name: 'FinTech, Payments & Billing',
    keywords: ['payment', 'billing', 'checkout', 'doku', 'stripe', 'qris', 'virtual account', 'subscription', 'snap bi', 'invoice', 'settlement', 'pricing', 'webhook'],
    skills: ['doku-payment-gateway', 'payment-gateway-expert', 'saas-billing', 'doku-mcp-server']
  },
  ai_mcp: {
    name: 'Frontier AI, MCP & RAG',
    keywords: ['llm', 'mcp', 'rag', 'embedding', 'vector', 'agent', 'swarm', 'prompt', 'kv-cache', 'reasoning', 'ast', 'graphrag', 'claude', 'gemini', 'o3'],
    skills: ['frontier-ai-models-expert', 'gemini-agent-booster', 'mcp-server-architect', 'multi-agent-orchestration', 'xerj-search-expert']
  }
};

export const RISK_FACTORS = [
  {
    id: 'FORMAL_INVARIANTS',
    pattern: /\b(crypto|pqc|quantum|formal|z3|smt|theorem|invariant|deadlock|formal spec)\b/i,
    weight: 35,
    description: 'Mathematical theorem proving, formal invariants, or post-quantum cryptography.'
  },
  {
    id: 'FINANCIAL_TRANSACTIONS',
    pattern: /\b(payment|billing|checkout|snap bi|atomic|idempotency|refund|chargeback|settlement)\b/i,
    weight: 25,
    description: 'Direct financial ledger mutation or payment gateway integration.'
  },
  {
    id: 'DATABASE_MUTATION',
    pattern: /\b(migration|alter table|drop table|foreign key|data migration|schema migration|truncate)\b/i,
    weight: 20,
    description: 'Irreversible database schema alteration or DDL migration.'
  },
  {
    id: 'AUTH_BOUNDARY',
    pattern: /\b(authentication|authorization|oauth2|session|rbac|abac|privilege escalation|csrf|xss)\b/i,
    weight: 20,
    description: 'Security perimeter, authentication handshakes, or permission boundaries.'
  },
  {
    id: 'MULTI_AGENT_SWARM',
    pattern: /\b(swarm|fan-out|fan-in|pipeline saga|multi-agent|subagents|orchestrator)\b/i,
    weight: 15,
    description: 'High-concurrency multi-agent orchestration and inter-agent synchronization.'
  }
];

export const BUDGET_TIERS = {
  LOW: {
    tier: 'LOW',
    profile: 'speed',
    label: 'Speed / Routine',
    minScore: 0,
    maxScore: 25,
    thinkingBudgetTokens: 1024,
    primaryModel: 'Google Gemini 2.5 Flash / Claude 3.5 Haiku',
    fallbackModel: 'OpenAI GPT-4o-mini',
    reasoningEffort: 'low',
    description: 'Fast, high-throughput execution for AST lookups, linting, formatting, typos, and simple fixes.'
  },
  MODERATE: {
    tier: 'MODERATE',
    profile: 'balanced',
    label: 'Balanced / Feature',
    minScore: 26,
    maxScore: 55,
    thinkingBudgetTokens: 8192,
    primaryModel: 'Anthropic Claude 3.7 Sonnet / Google Gemini 2.5 Flash',
    fallbackModel: 'OpenAI GPT-4o',
    reasoningEffort: 'medium',
    description: 'Standard cognitive depth for fullstack features, component construction, and CRUD APIs.'
  },
  HIGH: {
    tier: 'HIGH',
    profile: 'deep',
    label: 'Deep / Architectural',
    minScore: 56,
    maxScore: 80,
    thinkingBudgetTokens: 32768,
    primaryModel: 'Google Gemini 2.5 Pro / Claude 3.7 Sonnet (Extended Thinking)',
    fallbackModel: 'OpenAI o3-mini',
    reasoningEffort: 'high',
    description: 'High-depth reasoning for security audits, billing FSM, payment gateways, and architectural refactoring.'
  },
  CRITICAL: {
    tier: 'CRITICAL',
    profile: 'exhaustive',
    label: 'Exhaustive / Invariant',
    minScore: 81,
    maxScore: 100,
    thinkingBudgetTokens: 65536,
    primaryModel: 'OpenAI o3 / Google Gemini 2.5 Pro Deep Think',
    fallbackModel: 'Anthropic Claude 3.7 Sonnet (64K Thinking)',
    reasoningEffort: 'high',
    description: 'Maximum test-time compute for mathematical formal verification, PQC, and zero-loss distributed sagas.'
  }
};

/**
 * Computes cyclomatic complexity and structural depth for source code
 * @param {string} code
 * @returns {Object}
 */
export function analyzeCodeStructure(code = '') {
  if (!code || typeof code !== 'string') {
    return { linesCount: 0, cyclomaticScore: 0, maxNestingDepth: 0, complexityScore: 0 };
  }

  const lines = code.split(/\r?\n/);
  const linesCount = lines.length;

  // Approximate Cyclomatic Complexity via branch keywords & operators
  const branchMatches = code.match(/\b(if|else if|switch|case|catch|for|while)\b|&&|\|\||\?[^:\n\r]+:/g) || [];
  const cyclomaticEstimate = 1 + branchMatches.length;

  // Calculate maximum brace/bracket nesting depth
  let currentDepth = 0;
  let maxDepth = 0;
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (ch === '{' || ch === '(' || ch === '[') {
      currentDepth++;
      if (currentDepth > maxDepth) maxDepth = currentDepth;
    } else if (ch === '}' || ch === ')' || ch === ']') {
      if (currentDepth > 0) currentDepth--;
    }
  }

  // Normalized code complexity score (0 - 100)
  const cycloScore = Math.min(cyclomaticEstimate * 3, 50);
  const depthScore = Math.min(maxDepth * 5, 30);
  const lengthScore = Math.min(Math.round(linesCount / 20), 20);
  const complexityScore = Math.min(cycloScore + depthScore + lengthScore, 100);

  return {
    linesCount,
    cyclomaticEstimate,
    maxNestingDepth: maxDepth,
    complexityScore
  };
}

/**
 * Analyzes multi-dimensional complexity of a task or codebase input
 * @param {string} input - Task description prompt or source code
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function analyzeTaskComplexity(input = '', options = {}) {
  let text = String(input || '').trim();
  let codeSnippet = '';
  let sourceFilePath = null;

  // Check if input is a readable file path
  if (text.length < 500 && !text.includes('\n')) {
    try {
      const resolved = path.resolve(process.cwd(), text);
      const stat = await fs.stat(resolved);
      if (stat.isFile()) {
        sourceFilePath = resolved;
        codeSnippet = await fs.readFile(resolved, 'utf8');
        text = `File analysis: ${path.basename(resolved)}\n${codeSnippet.slice(0, 2000)}`;
      }
    } catch {
      // Input is raw text prompt
    }
  }

  const lowerText = text.toLowerCase();

  // 1. Detect Domain Breadth
  const detectedDomains = [];
  const autoSkills = new Set();

  for (const [key, domain] of Object.entries(DOMAIN_TAXONOMY)) {
    let matchesCount = 0;
    for (const kw of domain.keywords) {
      if (lowerText.includes(kw)) {
        matchesCount++;
      }
    }
    if (matchesCount > 0) {
      detectedDomains.push({
        id: key,
        name: domain.name,
        confidence: Math.min(matchesCount * 20, 100)
      });
      for (const sk of domain.skills) {
        autoSkills.add(sk);
      }
    }
  }

  const domainCount = detectedDomains.length;
  // Domain breadth score: 1 domain = 15, 2 domains = 35, 3 domains = 60, 4+ domains = 90-100
  const domainBreadthScore = Math.min(domainCount * 22, 100);

  // 2. Detect Architectural Risk Signals
  const detectedRisks = [];
  let riskScoreRaw = 0;

  for (const factor of RISK_FACTORS) {
    if (factor.pattern.test(text)) {
      detectedRisks.push({
        id: factor.id,
        description: factor.description,
        weight: factor.weight
      });
      riskScoreRaw += factor.weight;
    }
  }

  const architecturalRiskScore = Math.min(riskScoreRaw, 100);

  // 3. Analyze Code Structure (if code present)
  const codeAnalysis = analyzeCodeStructure(codeSnippet || (text.includes('{') || text.includes('function') ? text : ''));

  // 4. Cognitive Depth Signals
  let cognitiveScore = 15;
  if (/\b(why|how|architect|design|compare|evaluate|optimize|trade-off|refactor|benchmark)\b/i.test(text)) {
    cognitiveScore += 25;
  }
  if (/\b(comprehensive|production-ready|enterprise|fault-tolerant|high-scale|concurrency)\b/i.test(text)) {
    cognitiveScore += 25;
  }
  if (/\b(zero-tolerance|strict|fail-safe|p99|latency budget|formal proof)\b/i.test(text)) {
    cognitiveScore += 35;
  }
  cognitiveScore = Math.min(cognitiveScore, 100);

  // 5. Calculate Weighted Composite Score
  const codeWeight = codeAnalysis.linesCount > 0 ? 0.25 : 0.05;
  const domainWeight = codeAnalysis.linesCount > 0 ? 0.25 : 0.35;
  const riskWeight = codeAnalysis.linesCount > 0 ? 0.30 : 0.35;
  const cognitiveWeight = codeAnalysis.linesCount > 0 ? 0.20 : 0.25;

  const compositeScore = Math.round(
    (domainBreadthScore * domainWeight) +
    (architecturalRiskScore * riskWeight) +
    (codeAnalysis.complexityScore * codeWeight) +
    (cognitiveScore * cognitiveWeight)
  );

  // 6. Map to Budget Tier
  let selectedTier = BUDGET_TIERS.LOW;
  if (compositeScore >= BUDGET_TIERS.CRITICAL.minScore) {
    selectedTier = BUDGET_TIERS.CRITICAL;
  } else if (compositeScore >= BUDGET_TIERS.HIGH.minScore) {
    selectedTier = BUDGET_TIERS.HIGH;
  } else if (compositeScore >= BUDGET_TIERS.MODERATE.minScore) {
    selectedTier = BUDGET_TIERS.MODERATE;
  }

  return {
    sourceFilePath,
    compositeScore,
    tier: selectedTier.tier,
    profile: selectedTier.profile,
    label: selectedTier.label,
    thinkingBudgetTokens: selectedTier.thinkingBudgetTokens,
    primaryModel: selectedTier.primaryModel,
    fallbackModel: selectedTier.fallbackModel,
    reasoningEffort: selectedTier.reasoningEffort,
    breakdown: {
      domainBreadthScore,
      domainCount,
      detectedDomains,
      architecturalRiskScore,
      detectedRisks,
      codeComplexityScore: codeAnalysis.complexityScore,
      codeMetrics: codeAnalysis,
      cognitiveScore
    },
    autoBoundSkills: Array.from(autoSkills).slice(0, 8)
  };
}

/**
 * Optimizes thinking budget and generates model payload configurations
 * @param {string} task
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function optimizeThinkingBudget(task, options = {}) {
  const analysis = await analyzeTaskComplexity(task, options);

  // Estimate token economics
  const unconstrainedBudget = 65536;
  const allocatedBudget = analysis.thinkingBudgetTokens;
  const tokenSavingsTokens = Math.max(0, unconstrainedBudget - allocatedBudget);
  const tokenSavingsPercent = Math.round((tokenSavingsTokens / unconstrainedBudget) * 100);

  // Standard token pricing estimates ($3/1M input reasoning tokens)
  const costSavingsPer1k = Number(((tokenSavingsTokens * 1000 * 0.000003)).toFixed(2));

  const providerConfigs = {
    anthropic: {
      model: analysis.tier === 'LOW' ? 'claude-3-5-haiku-20241022' : 'claude-3-7-sonnet-20250219',
      thinking: {
        type: 'enabled',
        budget_tokens: allocatedBudget
      }
    },
    google_gemini: {
      model: analysis.tier === 'LOW' ? 'gemini-2.5-flash' : 'gemini-2.5-pro',
      reasoningConfig: {
        thinkingBudget: allocatedBudget
      }
    },
    openai: {
      model: analysis.tier === 'CRITICAL' ? 'o3' : analysis.tier === 'HIGH' ? 'o3-mini' : 'gpt-4o',
      reasoning_effort: analysis.reasoningEffort
    }
  };

  return {
    success: true,
    analyzedAt: new Date().toISOString(),
    taskSnippet: task.length > 100 ? `${task.slice(0, 97)}...` : task,
    complexityScore: analysis.compositeScore,
    tier: analysis.tier,
    profile: analysis.profile,
    label: analysis.label,
    allocatedBudgetTokens: allocatedBudget,
    primaryModel: analysis.primaryModel,
    fallbackModel: analysis.fallbackModel,
    economics: {
      unconstrainedBudgetTokens: unconstrainedBudget,
      allocatedBudgetTokens: allocatedBudget,
      tokensSavedPerCall: tokenSavingsTokens,
      savingsPercent: `${tokenSavingsPercent}%`,
      estimatedCostSavingsPer1kInvocations: `$${costSavingsPer1k}`
    },
    providerConfigs,
    autoBoundSkills: analysis.autoBoundSkills,
    signals: {
      domains: analysis.breakdown.detectedDomains.map(d => d.name),
      risks: analysis.breakdown.detectedRisks.map(r => r.id),
      codeMetrics: analysis.breakdown.codeMetrics
    }
  };
}

// Standalone CLI Execution
const isDirectExecution = process.argv[1] && (
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(__filename).toLowerCase() ||
  process.argv[1].endsWith('token-budget-optimizer.mjs')
);

if (isDirectExecution) {
  const args = process.argv.slice(2);
  const isJson = args.includes('--json');
  const taskArg = args.find(a => !a.startsWith('--'));

  if (!taskArg || taskArg === '--help' || taskArg === '-h') {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║     ⚡ Vibes-Plug Dynamic Token Budget Optimizer & Task Complexity Scorer             ║
║     Sovereign Cognitive Allocation across Frontier Models (Gemini, Claude, OpenAI)    ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝

Usage:
  node scripts/token-budget-optimizer.mjs "<task-description-or-file-path>" [--json]
  vibes budget "<task-description-or-file-path>" [--json]

Examples:
  node scripts/token-budget-optimizer.mjs "Fix typo in readme documentation"
  node scripts/token-budget-optimizer.mjs "Build a DOKU SNAP BI QRIS and VA checkout integration with atomic locks"
  node scripts/token-budget-optimizer.mjs scripts/studio-server.mjs
`);
    process.exit(0);
  }

  optimizeThinkingBudget(taskArg).then(res => {
    if (isJson) {
      console.log(JSON.stringify(res, null, 2));
      return;
    }

    console.log('\n╔═══════════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║            ⚡ Vibes-Plug Dynamic Token Budget & Complexity Optimizer                  ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════════════╝\n');

    console.log(`🎯 Task Target     : ${res.taskSnippet}`);
    console.log(`📊 Complexity Score: ${res.complexityScore}/100 [Tier: \x1b[36m${res.tier} - ${res.label}\x1b[0m]`);
    console.log(`🧠 Thinking Budget : \x1b[32m${res.allocatedBudgetTokens.toLocaleString()} tokens\x1b[0m (Profile: ${res.profile})`);
    console.log(`🤖 Optimal Model   : ${res.primaryModel}`);
    console.log(`🛡️  Fallback Model  : ${res.fallbackModel}\n`);

    console.log('💰 Economics & Token Efficiency:');
    console.log(`  • Unconstrained Baseline : ${res.economics.unconstrainedBudgetTokens.toLocaleString()} tokens`);
    console.log(`  • Allocated Budget       : ${res.economics.allocatedBudgetTokens.toLocaleString()} tokens`);
    console.log(`  • Token Reduction        : \x1b[32m${res.economics.savingsPercent}\x1b[0m (${res.economics.tokensSavedPerCall.toLocaleString()} tokens/req saved)`);
    console.log(`  • Projected Cost Savings : ${res.economics.estimatedCostSavingsPer1kInvocations} / 1k requests\n`);

    console.log('🌐 Multi-Provider Reasoning Payloads:');
    console.log(`  • Google Gemini : { reasoningConfig: { thinkingBudget: ${res.allocatedBudgetTokens} } }`);
    console.log(`  • Anthropic     : { thinking: { type: "enabled", budget_tokens: ${res.allocatedBudgetTokens} } }`);
    console.log(`  • OpenAI        : { reasoning_effort: "${res.providerConfigs.openai.reasoning_effort}" }\n`);

    if (res.autoBoundSkills?.length > 0) {
      console.log(`🧩 Auto-Synchronized Skills (${res.autoBoundSkills.length}):`);
      console.log(`  ${res.autoBoundSkills.map(s => `\x1b[35m${s}\x1b[0m`).join(', ')}\n`);
    }

    if (res.signals.risks?.length > 0) {
      console.log(`⚠️  Detected Risk Signals: ${res.signals.risks.join(', ')}\n`);
    }
  }).catch(err => {
    console.error('❌ Budget optimization failed:', err.message);
    process.exit(1);
  });
}
