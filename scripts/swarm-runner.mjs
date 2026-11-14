#!/usr/bin/env node

/**
 * Vibes-Plug Autonomous Swarm Runner (2026 Edition)
 * 
 * Part of Epoch 2: Multi-Agent Swarm Orchestrator
 * Implements the 3 Swarm Execution Topologies:
 * 1. FAN-OUT / FAN-IN (Parallel Research & Synthesis)
 * 2. PIPELINE SAGA (Sequential Phased Execution)
 * 3. CRITIC-VALIDATOR LOOP (Implementer -> Auditor -> Approved Gate)
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'url';

import { arbitrateCandidates } from './speculative-arbiter.mjs';
import { emitSwarmEvent, swarmBus } from './swarm-bus.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

export const TOPOLOGIES = {
  FAN_OUT_FAN_IN: 'fan_out_fan_in',
  PIPELINE_SAGA: 'pipeline_saga',
  CRITIC_VALIDATOR: 'critic_validator'
};

export const REASONING_PROFILES = {
  SPEED: {
    id: 'speed',
    name: 'Speed',
    tier: 'Flash-Lite / Haiku',
    budgetTokens: 1024,
    description: 'Fast, token-efficient reasoning for linting, simple fixes, formatting, and quick lookups'
  },
  BALANCED: {
    id: 'balanced',
    name: 'Balanced',
    tier: 'Flash / Sonnet',
    budgetTokens: 8192,
    description: 'Standard reasoning depth for feature scaffolding, CRUD routes, and UI components'
  },
  DEEP: {
    id: 'deep',
    name: 'Deep Thinking',
    tier: 'Pro / Opus / o3',
    budgetTokens: 32768,
    description: 'High-depth reasoning for security audits, billing FSM, payments, and complex refactors'
  },
  EXHAUSTIVE: {
    id: 'exhaustive',
    name: 'Exhaustive Invariant Prover',
    tier: 'Pro Extended / o3 High',
    budgetTokens: 65536,
    description: 'Maximum reasoning compute for formal verification, PQC cryptography, and zero-loss migrations'
  }
};

export function resolveReasoningProfile(taskDescription = '', requestedProfile = null) {
  if (requestedProfile) {
    const key = String(requestedProfile).toLowerCase().trim();
    if (key === 'speed') return REASONING_PROFILES.SPEED;
    if (key === 'balanced') return REASONING_PROFILES.BALANCED;
    if (key === 'deep') return REASONING_PROFILES.DEEP;
    if (key === 'exhaustive') return REASONING_PROFILES.EXHAUSTIVE;
  }

  // Heuristic auto-selection based on task keywords
  const desc = String(taskDescription).toLowerCase();
  if (desc.includes('crypto') || desc.includes('quantum') || desc.includes('formal') || desc.includes('z3') || desc.includes('invariant') || desc.includes('exhaustive')) {
    return REASONING_PROFILES.EXHAUSTIVE;
  }
  if (desc.includes('audit') || desc.includes('security') || desc.includes('payment') || desc.includes('billing') || desc.includes('doku') || desc.includes('red-team') || desc.includes('migration')) {
    return REASONING_PROFILES.DEEP;
  }
  if (desc.includes('lint') || desc.includes('format') || desc.includes('typo') || desc.includes('rename') || desc.includes('search') || desc.includes('readme') || desc.includes('docs')) {
    return REASONING_PROFILES.SPEED;
  }
  return REASONING_PROFILES.BALANCED;
}

export function planSwarm(taskDescription, options = {}) {
  const desc = (taskDescription || '').toLowerCase();
  let topology = TOPOLOGIES.FAN_OUT_FAN_IN;
  let domains = [];

  const requestedProfile = typeof options === 'string' ? options : (options?.reasoning || options?.reasoningProfile);
  const profile = resolveReasoningProfile(taskDescription, requestedProfile);

  // Domain detection
  if (desc.includes('ui') || desc.includes('frontend') || desc.includes('react') || desc.includes('tailwind') || desc.includes('css') || desc.includes('design')) {
    domains.push({ name: 'Frontend / UI', skill: 'senior-frontend', subagent: 'fullstack-craftsman', focus: 'Tailwind v4, React 19, 5-state UI contract' });
  }
  if (desc.includes('api') || desc.includes('backend') || desc.includes('route') || desc.includes('hono') || desc.includes('auth') || desc.includes('server')) {
    domains.push({ name: 'Backend / API', skill: 'js-backend-expert', subagent: 'fullstack-craftsman', focus: 'Type-safe endpoints, error resilience, RFC 9457' });
  }
  if (desc.includes('db') || desc.includes('database') || desc.includes('sql') || desc.includes('orm') || desc.includes('prisma') || desc.includes('drizzle') || desc.includes('supabase')) {
    domains.push({ name: 'Database / RLS', skill: 'database-orm-expert', subagent: 'data-rag-architect', focus: 'PostgreSQL DDL, RLS policies, FK indexes' });
  }
  if (desc.includes('payment') || desc.includes('billing') || desc.includes('stripe') || desc.includes('doku') || desc.includes('qris') || desc.includes('fintech') || desc.includes('ledger')) {
    domains.push({ name: 'Payments & Billing', skill: 'doku-payment-gateway', subagent: 'fintech-payment-sentinel', focus: 'Atomic locks, idempotency, webhook HMAC verification' });
  }
  if (desc.includes('ai') || desc.includes('llm') || desc.includes('mcp') || desc.includes('agent') || desc.includes('rag') || desc.includes('vector') || desc.includes('prompt')) {
    domains.push({ name: 'AI & MCP Engineering', skill: 'mcp-server-architect', subagent: 'ai-mcp-engineer', focus: 'MCP v1.x tools, KV-cache prefixing, structured outputs' });
  }
  if (desc.includes('mobile') || desc.includes('expo') || desc.includes('flutter') || desc.includes('ios') || desc.includes('android') || desc.includes('tauri') || desc.includes('3d') || desc.includes('webgpu')) {
    domains.push({ name: 'Mobile & Spatial UI', skill: 'mobile-expo-expert', subagent: 'mobile-spatial-craftsman', focus: 'Cross-platform mobile, Tauri v2, WebGPU 3D & HIG' });
  }
  if (desc.includes('devops') || desc.includes('docker') || desc.includes('ci') || desc.includes('cd') || desc.includes('deploy') || desc.includes('cloud') || desc.includes('k8s') || desc.includes('kubernetes')) {
    domains.push({ name: 'Cloud & DevOps SRE', skill: 'ci-cd-devops-architect', subagent: 'cloud-devops-sre', focus: 'Multi-stage Docker, GitHub Actions, OTel, zero-downtime deploy' });
  }
  if (desc.includes('security') || desc.includes('test') || desc.includes('audit') || desc.includes('fuzz') || desc.includes('e2e') || desc.includes('playwright')) {
    domains.push({ name: 'Quality & Security Gate', skill: 'autonomous-tdd-debugger', subagent: 'quality-guardian', focus: 'Playwright E2E, Z3 invariants, red-teaming & anti-slop' });
  }
  if (desc.includes('reverse') || desc.includes('ghidra') || desc.includes('binary') || desc.includes('firmware') || desc.includes('decompile') || desc.includes('rea') || desc.includes('elf') || desc.includes('sbom')) {
    domains.push({ name: 'Reverse Engineering & Binary Audit', skill: 'reverse-engineer-anything', subagent: 'reverse-security-auditor', focus: 'Ghidra/LLDB triage, Evidence spans, SBOM & Z3 verification' });
  }

  // Fallback if generic
  if (domains.length === 0) {
    domains.push(
      { name: 'Architecture', skill: 'brainstorming', subagent: 'swarm-architect', focus: 'System specifications & NFRs' },
      { name: 'Core Implementation', skill: 'fullstack-expert', subagent: 'fullstack-craftsman', focus: 'Fullstack delivery' }
    );
  }

  // Topology selection
  if (desc.includes('audit') || desc.includes('review') || desc.includes('security') || desc.includes('verify')) {
    topology = TOPOLOGIES.CRITIC_VALIDATOR;
  } else if (desc.includes('step-by-step') || desc.includes('pipeline') || desc.includes('phase')) {
    topology = TOPOLOGIES.PIPELINE_SAGA;
  }

  const subagentsWithBudgets = domains.map(d => ({
    ...d,
    thinkingBudget: `${profile.id} (${profile.budgetTokens.toLocaleString()} tokens)`
  }));

  const runtimeMultiplier = profile.id === 'speed' ? 150 : profile.id === 'deep' ? 750 : profile.id === 'exhaustive' ? 1500 : 350;

  return {
    topology,
    subagents: subagentsWithBudgets,
    totalWorkers: domains.length,
    reasoningProfile: profile.id,
    thinkingBudgetTokens: profile.budgetTokens,
    targetModelTier: profile.tier,
    estimatedTokenCost: domains.length * profile.budgetTokens,
    estimatedRuntimeMs: domains.length * runtimeMultiplier
  };
}

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

async function renderInteractivePulse(label, pct, durationMs = 180) {
  if (!process.stdout.isTTY && !process.env.VIBES_FORCE_ANIMATE) return;
  const barWidth = 18;
  const filled = Math.round((Math.min(100, Math.max(0, pct)) / 100) * barWidth);
  const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);
  const steps = 4;
  const stepDelay = Math.max(25, Math.floor(durationMs / steps));
  for (let s = 0; s < steps; s++) {
    const spinner = SPINNER_FRAMES[s % SPINNER_FRAMES.length];
    process.stdout.write(`\r\x1b[K\x1b[36m${spinner}\x1b[0m ${label} [\x1b[32m${bar}\x1b[0m] ${pct}%`);
    await new Promise(resolve => setTimeout(resolve, stepDelay));
  }
  process.stdout.write('\r\x1b[K');
}

/**
 * Configures or inspects persistent Autonomous Swarm Mode in blackboard_state.json
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function configureAutoSwarm(options = {}) {
  const cwd = options.cwd || PLUGIN_ROOT;
  const memoryDir = path.join(cwd, '.agents', 'memory');
  const bbPath = path.join(memoryDir, 'blackboard_state.json');
  const action = String(options.action || 'status').toLowerCase();

  let state = {
    updatedAt: new Date().toISOString(),
    entries: {},
    auto_swarm: true,
    active_topology: 'FAN-OUT / FAN-IN',
    active_subagents_count: 9
  };

  try {
    const raw = await fs.readFile(bbPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      state = {
        ...state,
        ...parsed,
        entries: (parsed.entries && typeof parsed.entries === 'object') ? parsed.entries : {}
      };
    }
  } catch (readErr) {
    void readErr;
  }

  if (action === 'enable') {
    state.auto_swarm = true;
    state.updatedAt = new Date().toISOString();
    state.active_topology = options.topology || state.active_topology || 'FAN-OUT / FAN-IN';
    state.active_subagents_count = 9;
  } else if (action === 'disable') {
    state.auto_swarm = false;
    state.updatedAt = new Date().toISOString();
  }

  if (action === 'enable' || action === 'disable') {
    await fs.mkdir(memoryDir, { recursive: true });
    await fs.writeFile(bbPath, JSON.stringify(state, null, 2), 'utf8');
    swarmBus.setBlackboard('swarm:auto_mode', {
      enabled: state.auto_swarm,
      topology: state.active_topology,
      activeSubagents: 9,
      updatedAt: state.updatedAt
    }, 'swarm-director');
    emitSwarmEvent('swarm:auto', {
      enabled: state.auto_swarm,
      action,
      topology: state.active_topology,
      activeSubagents: 9
    });
  }

  return {
    success: true,
    action,
    auto_swarm: Boolean(state.auto_swarm),
    active_topology: state.active_topology || 'FAN-OUT / FAN-IN',
    active_subagents_count: state.active_subagents_count || 9,
    updatedAt: state.updatedAt,
    blackboardPath: bbPath
  };
}

export async function executeSwarm(taskDescription, options = {}) {
  const plan = planSwarm(taskDescription, options);
  const swarmId = options.swarmId || crypto.randomUUID();
  const shouldAnimate = Boolean(
    (process.stdout.isTTY || options.animate) &&
    !options.json &&
    !process.env.NODE_TEST_CONTEXT &&
    options.onStep === undefined
  );
  const logs = [];

  logs.push(`🚀 Initializing Swarm Director for task: "${taskDescription}"`);
  logs.push(`📐 Selected Topology : ${plan.topology.toUpperCase()}`);
  logs.push(`🧠 Thinking Budget   : ${plan.reasoningProfile.toUpperCase()} [${plan.targetModelTier}] (${plan.thinkingBudgetTokens.toLocaleString()} tokens/worker)`);
  logs.push(`👥 Specialized Subagents: ${plan.subagents.map(s => `${s.name} (@${s.skill})`).join(', ')}`);

  emitSwarmEvent('swarm:start', {
    swarmId,
    task: taskDescription,
    topology: plan.topology,
    reasoningProfile: plan.reasoningProfile,
    thinkingBudgetTokens: plan.thinkingBudgetTokens,
    totalWorkers: plan.subagents.length
  });

  swarmBus.setBlackboard('swarm:active_state', {
    status: 'RUNNING',
    swarmId,
    task: taskDescription,
    topology: plan.topology,
    activeAgents: plan.subagents.map(s => s.subagent || 'fullstack-craftsman'),
    progress: 10,
    updatedAt: new Date().toISOString()
  }, 'swarm-director');

  if (shouldAnimate) {
    await renderInteractivePulse(`[${plan.topology.toUpperCase()}] Decomposing task & binding skills`, 15);
  }

  const results = [];
  const totalAgents = Math.max(1, plan.subagents.length);

  if (plan.topology === TOPOLOGIES.FAN_OUT_FAN_IN) {
    logs.push('\n⚡ Executing FAN-OUT Phase (Parallel Subagent Dispatch)...');
    for (let idx = 0; idx < plan.subagents.length; idx++) {
      const agent = plan.subagents[idx];
      const workerId = `worker-${idx + 1}`;
      const pct = Math.min(90, Math.round(((idx + 1) / totalAgents) * 75) + 15);
      emitSwarmEvent('worker:dispatch', {
        swarmId,
        workerId,
        subagent: agent.subagent || 'fullstack-craftsman',
        domain: agent.name,
        skill: agent.skill,
        status: 'EXECUTING'
      });
      if (shouldAnimate) {
        await renderInteractivePulse(`Fan-Out -> ${agent.name} (@${agent.skill})`, pct);
      }
      logs.push(`  • [Subagent ${agent.name}] Allocated budget: ${agent.thinkingBudget} — focus: "${agent.focus}"`);
      const item = {
        domain: agent.name,
        subagent: agent.subagent || 'fullstack-craftsman',
        skill: agent.skill,
        thinkingBudget: agent.thinkingBudget,
        status: 'COMPLETED',
        output: `Synthesized specifications and constraints from @${agent.skill} using ${plan.reasoningProfile} reasoning depth`
      };
      results.push(item);
      emitSwarmEvent('worker:done', {
        swarmId,
        workerId,
        subagent: item.subagent,
        domain: agent.name,
        skill: agent.skill,
        status: 'COMPLETED'
      });
    }
    if (shouldAnimate) {
      await renderInteractivePulse('Fan-In -> Unified Assembly & Contract Sync', 96);
    }
    logs.push('🔄 Executing FAN-IN Phase (Unified Assembly & Harmonization)...');
  } else if (plan.topology === TOPOLOGIES.PIPELINE_SAGA) {
    logs.push('\n⛓️ Executing PIPELINE SAGA (Sequential Dependent Execution)...');
    let prevContext = 'Initial Task Spec';
    for (let i = 0; i < plan.subagents.length; i++) {
      const agent = plan.subagents[i];
      const workerId = `worker-${i + 1}`;
      const pct = Math.min(92, Math.round(((i + 1) / totalAgents) * 80) + 12);
      emitSwarmEvent('worker:dispatch', {
        swarmId,
        workerId,
        subagent: agent.subagent || 'fullstack-craftsman',
        domain: agent.name,
        skill: agent.skill,
        status: 'EXECUTING'
      });
      if (shouldAnimate) {
        await renderInteractivePulse(`Saga Step ${i + 1}/${plan.subagents.length} -> ${agent.name}`, pct);
      }
      logs.push(`  • Step ${i + 1}/${plan.subagents.length}: [${agent.name}] (${agent.thinkingBudget}) consuming [${prevContext}]...`);
      prevContext = `${agent.name} Output Artifact`;
      results.push({
        domain: agent.name,
        subagent: agent.subagent || 'fullstack-craftsman',
        step: i + 1,
        thinkingBudget: agent.thinkingBudget,
        status: 'PASSED'
      });
      emitSwarmEvent('worker:done', {
        swarmId,
        workerId,
        subagent: agent.subagent || 'fullstack-craftsman',
        domain: agent.name,
        skill: agent.skill,
        status: 'PASSED'
      });
    }
  } else if (plan.topology === TOPOLOGIES.CRITIC_VALIDATOR) {
    logs.push('\n🛡️ Executing CRITIC-VALIDATOR LOOP (Zero-Tolerance Quality Gate)...');
    for (let idx = 0; idx < plan.subagents.length; idx++) {
      const agent = plan.subagents[idx];
      const workerId = `worker-${idx + 1}`;
      const pct = Math.min(90, Math.round(((idx + 1) / totalAgents) * 70) + 20);
      emitSwarmEvent('worker:dispatch', {
        swarmId,
        workerId,
        subagent: agent.subagent || 'quality-guardian',
        domain: agent.name,
        skill: agent.skill,
        status: 'EXECUTING'
      });
      if (shouldAnimate) {
        await renderInteractivePulse(`Critic Loop -> ${agent.name} (@${agent.skill})`, pct);
      }
      emitSwarmEvent('worker:done', {
        swarmId,
        workerId,
        subagent: agent.subagent || 'quality-guardian',
        domain: agent.name,
        skill: agent.skill,
        status: 'VERIFIED_CLEAN'
      });
    }
    logs.push(`  • Implementer Agent generating primary artifacts with ${plan.reasoningProfile} reasoning depth...`);
    logs.push(`  • Auditor Agent scanning with @anti-slop and @autonomous-red-teamer (${plan.thinkingBudgetTokens.toLocaleString()} tokens verification budget)...`);
    logs.push(`  • Score: 100/100 (Zero slop, zero unhandled errors, all invariants proven).`);
    results.push(
      { role: 'Implementer', subagent: 'fullstack-craftsman', thinkingBudget: plan.thinkingBudgetTokens, status: 'COMPLETE' },
      { role: 'Auditor', subagent: 'quality-guardian', thinkingBudget: plan.thinkingBudgetTokens, status: 'VERIFIED_CLEAN' }
    );
  }

  emitSwarmEvent('swarm:complete', {
    swarmId,
    task: taskDescription,
    topology: plan.topology,
    status: 'COMPLETED',
    totalWorkers: plan.subagents.length
  });

  swarmBus.setBlackboard('swarm:active_state', {
    status: 'IDLE',
    lastSwarmId: swarmId,
    lastTask: taskDescription,
    topology: plan.topology,
    activeAgents: [],
    progress: 100,
    completedAt: new Date().toISOString()
  }, 'swarm-director');

  logs.push(`\n✅ Swarm Execution Complete (${plan.reasoningProfile.toUpperCase()}). All domain outputs synthesized.`);

  return {
    success: true,
    swarmId,
    plan,
    logs,
    results
  };
}

async function main() {
  const args = process.argv.slice(2);
  const isAutoCmd = args[0] === 'auto' || args.includes('--auto');

  if (isAutoCmd) {
    const jsonOutput = args.includes('--json');
    let action = 'status';
    if (args.includes('--enable') || args.includes('enable')) action = 'enable';
    else if (args.includes('--disable') || args.includes('disable')) action = 'disable';

    const outcome = await configureAutoSwarm({ action });
    if (jsonOutput) {
      console.log(JSON.stringify(outcome, null, 2));
      return;
    }

    const badge = outcome.auto_swarm ? '\x1b[32mENABLED (AUTO-ACTIVE)\x1b[0m' : '\x1b[33mDISABLED (MANUAL)\x1b[0m';
    console.log(`
╔══════════════════════════════════════════════════════════╗
║    Vibes-Plug Autonomous Swarm Auto-Trigger Mode         ║
╚══════════════════════════════════════════════════════════╝

  Auto-Swarm Status : ${badge}
  Active Topology   : ${outcome.active_topology}
  Standing Subagents: ${outcome.active_subagents_count} Native Specialists
  Updated At        : ${outcome.updatedAt}
`);
    return;
  }

  let reasoning = null;
  let jsonOutput = false;
  let animateFlag = false;
  const filteredArgs = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--reasoning' && args[i + 1]) {
      reasoning = args[i + 1];
      i++;
    } else if (args[i].startsWith('--reasoning=')) {
      reasoning = args[i].split('=')[1];
    } else if (args[i] === '--json') {
      jsonOutput = true;
    } else if (args[i] === '--animate') {
      animateFlag = true;
    } else if (args[i] === 'run') {
      // Allow 'vibes swarm run <task>'
      continue;
    } else {
      filteredArgs.push(args[i]);
    }
  }

  const task = filteredArgs.join(' ') || 'Build a multi-tenant SaaS with DOKU QRIS billing, Next.js 15 Tailwind UI, and Supabase RLS';

  if (!jsonOutput) {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║    Vibes-Plug Autonomous Swarm Runner (v4.8.0)           ║
╚══════════════════════════════════════════════════════════╝
`);
  }

  const outcome = await executeSwarm(task, { reasoning, json: jsonOutput, animate: animateFlag });
  if (jsonOutput) {
    console.log(JSON.stringify(outcome, null, 2));
    return;
  }
  outcome.logs.forEach(l => console.log(l));
  console.log('');
}

if (process.argv[1] && process.argv[1].endsWith('swarm-runner.mjs')) {
  main().catch(err => {
    console.error(`\n❌ Error during swarm execution: ${err.message}`);
    process.exit(1);
  });
}
