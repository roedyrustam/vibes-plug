#!/usr/bin/env node

/**
 * Vibes-Plug Native MCP Server (Model Context Protocol v1.x)
 * 
 * Exposes the P1–P5 Superintelligence engines directly to AI agents:
 * - vibes_ast_query (P3: Symbols, Surgical Code Inspection, Blast Radius)
 * - vibes_eval_sql (P2: In-Memory SQL DDL & RLS Security Evaluator)
 * - vibes_arbitrate_code (P4: Process Reward Model Multi-Draft Arbiter)
 * - vibes_verify_invariants (P5: Neuro-Symbolic Invariant Verifier & SMT Generator)
 * - vibes_compile_cache (P1: Canonical Deterministic KV-Cache Prefix Compiler)
 * - vibes_get_skill (Registry: Instant access to any of the 171 skills)
 * - vibes_list_skills (Registry: Discover all 171 skills with domains and summaries)
 * - vibes_inject_skill (Registry: Direct 1-click project skill injection)
 * - vibes_memory (Episodic Project Memory & ultra-compact checkpoints)
 * - vibes_swarm (Autonomous Multi-Agent Swarm Orchestrator)
 */

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import http from 'http';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

import { parseSymbols, extractSymbolCode, calculateBlastRadius } from '../scripts/ast-query.mjs';
import { evaluateSql } from '../scripts/eval-migration.mjs';
import { scoreDraft, arbitrateCandidates } from '../scripts/speculative-arbiter.mjs';
import { verifyStateMachine, parseTypeScriptStates } from '../scripts/verify-invariants.mjs';
import { compileCache } from '../scripts/compile-cache.mjs';
import { recordDecision, queryMemory, generateCompactCheckpoint, loadMemory } from '../scripts/memory-daemon.mjs';
import { executeSwarm } from '../scripts/swarm-runner.mjs';
import { criticValidate, formatSamplingRequest } from '../scripts/critic-validator.mjs';
import { visualAudit } from '../scripts/visual-critic.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');

export const TOOLS = [
  {
    name: 'vibes_ast_query',
    description: 'Surgically inspect code symbols, extract function bodies, or calculate dependency blast-radius without dumping thousands of tokens into the context window.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['symbols', 'inspect', 'blast-radius'],
          description: 'Action to perform: list symbols in a file, inspect a specific function/class, or calculate blast radius.'
        },
        filePath: {
          type: 'string',
          description: 'Path to target source file (JS/TS/Python/Go).'
        },
        symbolName: {
          type: 'string',
          description: 'Name of the function or class to inspect (required for action: inspect).'
        }
      },
      required: ['action', 'filePath']
    }
  },
  {
    name: 'vibes_eval_sql',
    description: 'Simulate and validate SQL DDL migrations in-memory before applying to a database. Checks for missing Row Level Security (RLS), missing Foreign Key indexes, and destructive drops.',
    inputSchema: {
      type: 'object',
      properties: {
        sql: {
          type: 'string',
          description: 'The raw SQL DDL statement(s) to evaluate.'
        },
        filePath: {
          type: 'string',
          description: 'Optional path to a .sql migration file.'
        }
      }
    }
  },
  {
    name: 'vibes_arbitrate_code',
    description: 'Process Reward Model (PRM) Arbiter: scores and arbitrates competing code drafts based on Type Safety, Anti-Slop Directive, Error Resilience, and Complexity.',
    inputSchema: {
      type: 'object',
      properties: {
        candidates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              label: { type: 'string' },
              code: { type: 'string' }
            },
            required: ['code']
          },
          description: 'Array of candidate implementations to score and arbitrate.'
        }
      },
      required: ['candidates']
    }
  },
  {
    name: 'vibes_verify_invariants',
    description: 'Neuro-Symbolic Invariant Verifier: mathematically proves state machine transitions, reachability, deadlock freedom, and produces SMT-LIB 2.0 specifications for Z3/CVC5 theorem provers.',
    inputSchema: {
      type: 'object',
      properties: {
        stateMachine: {
          type: 'object',
          description: 'State machine JSON definition (states, initial, terminal, transitions, invariants).'
        },
        typeScriptCode: {
          type: 'string',
          description: 'Optional raw TypeScript code containing state union type definitions (e.g. type State = "A" | "B").'
        }
      }
    }
  },
  {
    name: 'vibes_get_skill',
    description: 'Retrieve domain instructions, production patterns, and templates for any of the 171 specialized skills in the vibes-plug registry. Supports compact micro-slice mode (<350 tokens) for 80%+ token savings during subagent fan-out.',
    inputSchema: {
      type: 'object',
      properties: {
        skillName: {
          type: 'string',
          description: 'Name of the skill (e.g. senior-frontend, database-orm-expert, doku-payment-gateway, anti-slop).'
        },
        mode: {
          type: 'string',
          enum: ['full', 'compact'],
          description: 'Optional retrieval mode: full (complete SKILL.md) or compact (<350-token pre-compiled micro-slice).'
        }
      },
      required: ['skillName']
    }
  },
  {
    name: 'vibes_list_skills',
    description: 'List all 171 AI domain skills in the Vibes-Plug ecosystem with domain categories, descriptions, and metadata.',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'Optional filter by domain: frontend, backend, ai, saas, security, data.'
        }
      }
    }
  },
  {
    name: 'vibes_inject_skill',
    description: 'Inject one or more skills from the global registry into the active project (.agents/skills/<name>).',
    inputSchema: {
      type: 'object',
      properties: {
        skillName: {
          type: 'string',
          description: 'Name of the skill to inject (e.g. senior-frontend, spec-driven-development-expert).'
        }
      },
      required: ['skillName']
    }
  },
  {
    name: 'vibes_memory',
    description: 'Local Episodic Memory Engine: record architectural decisions, query past project invariants, or generate ultra-compact handoff checkpoints (<150 tokens) to eliminate context amnesia.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['record', 'query', 'checkpoint', 'list'],
          description: 'Memory action to perform.'
        },
        text: {
          type: 'string',
          description: 'Decision text (for action: record) or search keyword (for action: query).'
        },
        category: {
          type: 'string',
          description: 'Optional category (Architecture, Database, Security, UI).'
        }
      },
      required: ['action']
    }
  },
  {
    name: 'vibes_swarm',
    description: 'Autonomous Swarm Orchestrator: plan and execute Fan-Out/Fan-In, Pipeline Saga, or Critic-Validator topologies with Dynamic Thinking Budget control for complex multi-domain development tasks.',
    inputSchema: {
      type: 'object',
      properties: {
        taskDescription: {
          type: 'string',
          description: 'Natural language description of the development task.'
        },
        reasoningProfile: {
          type: 'string',
          enum: ['speed', 'balanced', 'deep', 'exhaustive'],
          description: 'Optional thinking budget profile: speed (0-1K tokens), balanced (4-8K tokens), deep (16-32K tokens), or exhaustive (64K+ tokens).'
        }
      },
      required: ['taskDescription']
    }
  },
  {
    name: 'vibes_compile_cache',
    description: 'Deterministic KV-Cache Prefix Compiler: compiles and verifies canonical instruction prefix (>1024 tokens) for prompt caching across Gemini, Claude, Codex, and Cursor.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'vibes_batch',
    description: 'Parallel Tool Execution: execute multiple vibes-plug tools concurrently in a single turn and return aggregated results.',
    inputSchema: {
      type: 'object',
      properties: {
        calls: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              tool: { type: 'string', description: 'Name of the tool to execute' },
              arguments: { type: 'object', description: 'Arguments object for the tool' }
            },
            required: ['tool']
          },
          description: 'Array of tool invocations to run in parallel'
        }
      },
      required: ['calls']
    }
  },
  {
    name: 'vibes_critic_validate',
    description: 'Autonomous Critic-in-the-Loop Quality Gate: audits code drafts, PRDs, or SQL against 7 Anti-Slop pillars, type safety, silent catch blocks, and 5-state UI contracts before disk writes.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'The code, SQL, or specification text to audit.'
        },
        language: {
          type: 'string',
          enum: ['typescript', 'javascript', 'sql', 'markdown', 'python', 'go', 'general'],
          description: 'Programming or specification language.'
        },
        strictness: {
          type: 'string',
          enum: ['standard', 'hardcore', 'production-release'],
          description: 'Audit strictness level.'
        }
      },
      required: ['target']
    }
  },
  {
    name: 'vibes_visual_audit',
    description: 'Multimodal Vision UI Auditor (Pillar 6): audits UI code or screenshot image files against Anti-Slop Pillar 7, 1px crisp borders, 3-tier radius, tabular numbers, and generates multimodal vision prompt rubrics for Gemini 4 Pro / Flash Vision and Claude 3.7 / 5.1.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'UI source code string or path to screenshot image file (.png, .webp, .jpg) or component file (.tsx, .jsx, .html).'
        },
        viewport: {
          type: 'string',
          enum: ['desktop', 'tablet', 'mobile'],
          description: 'Target viewport for visual responsive audit.'
        }
      },
      required: ['target']
    }
  },
  {
    name: 'vibes_eval_sandbox',
    description: 'Ephemeral Micro-Sandbox: dry-run untrusted AI-generated JavaScript/TypeScript logic, regexes, and algorithms in an isolated in-memory sandbox with strict timeout and zero host access.',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'JavaScript/TypeScript code string to safely execute.'
        },
        timeoutMs: {
          type: 'number',
          description: 'Wall-clock execution timeout in milliseconds (default: 1000ms).'
        }
      },
      required: ['code']
    }
  },
  {
    name: 'vibes_swarm_dispatch',
    description: 'Headless Concurrent Swarm Dispatcher: dispatches parallel multi-agent workers concurrently with automated skill binding, in-memory sandbox verification, and Critic-in-the-Loop auditing.',
    inputSchema: {
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: 'The development task to plan and dispatch across specialized subagent workers.'
        },
        concurrency: {
          type: 'number',
          description: 'Maximum number of parallel workers (default: 3).'
        },
        reasoning: {
          type: 'string',
          enum: ['speed', 'balanced', 'deep', 'exhaustive'],
          description: 'Reasoning depth profile.'
        }
      },
      required: ['task']
    }
  },
  {
    name: 'vibes_finops_report',
    description: 'Local FinOps & Token Savings Tracker: query local token metrics, cache hit efficiency, and financial savings from KV-Cache prefix locking across Gemini, Claude, and OpenAI.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['status', 'record', 'reset'],
          description: 'Action to perform: status (query report), record (track usage), or reset.'
        },
        model: { type: 'string', description: 'Model identifier (when recording)' },
        inputTokens: { type: 'number', description: 'Input tokens consumed' },
        outputTokens: { type: 'number', description: 'Output tokens produced' },
        cachedTokens: { type: 'number', description: 'Cached tokens reused' }
      }
    }
  },
  {
    name: 'vibes_graph_query',
    description: 'Codebase AST Symbol Knowledge Graph: query symbols (functions, classes, interfaces, types) across project files in sub-milliseconds without LLM context flooding.',
    inputSchema: {
      type: 'object',
      properties: {
        symbolName: {
          type: 'string',
          description: 'Name of the function, class, type, or interface to query.'
        }
      },
      required: ['symbolName']
    }
  },
  {
    name: 'vibes_pr_review',
    description: 'Autonomous Sovereign PR Review Critic Bot: inspects git diffs or file changes, audits Anti-Slop Directive rules and Pillar 7 visual standards, and generates a structured Markdown review scorecard.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Git commit range (e.g. HEAD~1, main...feature) or file path to review.'
        },
        outputFile: {
          type: 'string',
          description: 'Optional path to write the markdown review report.'
        }
      }
    }
  },
  {
    name: 'vibes_self_heal',
    description: 'Autonomous Self-Healing Test Runner & Diagnoser: executes a test suite or command, isolates failing AST symbols via codebase graph, and generates atomic patch proposals.',
    inputSchema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'Test command or file to execute and diagnose (default: npm test).'
        },
        dryRun: {
          type: 'boolean',
          description: 'Safe analysis mode without modifying files (default: true).'
        }
      }
    }
  },
  {
    name: 'vibes_registry_search',
    description: 'Skill Registry Hub Search: queries modular skills and plugins across core catalog and community packages by capability, keyword, or domain category.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keyword to search across skill names, descriptions, and tags.'
        },
        category: {
          type: 'string',
          description: 'Optional category filter (e.g. Frontend, Backend, FinTech, AI).'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'vibes_registry_install',
    description: 'Skill Registry Hub Install: installs a curated skill from the registry into the local project .agents/skills/.',
    inputSchema: {
      type: 'object',
      properties: {
        skillName: {
          type: 'string',
          description: 'Kebab-case identifier of the skill to install.'
        }
      },
      required: ['skillName']
    }
  },
  {
    name: 'vibes_bridge_status',
    description: 'Inspect cross-IDE state bridge: checks synchronization of rules, Anti-Slop Directive coverage, and episodic checkpoints across Google Gemini / Antigravity, Claude Code, Cursor IDE, OpenAI Codex, Windsurf, Trae, and Cline.',
    inputSchema: {
      type: 'object',
      properties: {
        targetDir: {
          type: 'string',
          description: 'Optional target project directory to inspect (defaults to current working directory).'
        }
      }
    }
  },
  {
    name: 'vibes_bridge_sync',
    description: 'Synchronize 171-skill universal rules, Anti-Slop directives, and prompt caching prefixes to all or specific IDE platforms (claude, cursor, codex, windsurf, cline, trae, antigravity).',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          enum: ['all', 'claude', 'cursor', 'codex', 'windsurf', 'cline', 'trae', 'antigravity'],
          description: 'Target platform to synchronize (default: all).'
        },
        targetDir: {
          type: 'string',
          description: 'Optional target project directory (defaults to current working directory).'
        }
      }
    }
  },
  {
    name: 'vibes_learn_skill',
    description: 'Autonomous Skill Synthesizer: analyzes a local repository, TypeScript definitions, or documentation to synthesize a 100% complete, fully implemented, bilingual Gold-Standard AI skill with zero placeholders.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Kebab-case skill identifier to synthesize (e.g. fast-api-expert, trpc-v11-expert).'
        },
        fromRepo: {
          type: 'string',
          description: 'Optional path to local package or repository directory to inspect.'
        },
        category: {
          type: 'string',
          enum: ['frontend', 'backend', 'ai', 'saas', 'security', 'data'],
          description: 'Optional domain category.'
        },
        dest: {
          type: 'string',
          enum: ['project', 'core'],
          description: 'Destination: project (.agents/skills) or core (vibes-plug/skills). Default: project.'
        },
        dryRun: {
          type: 'boolean',
          description: 'Dry run preview without writing to disk.'
        }
      },
      required: ['name']
    }
  },
  {
    name: 'vibes_verify_gate',
    description: 'Pre-Disk Verification Gate: performs in-memory pre-persistence audit on candidate code strings or files against AST syntax, Sovereign Anti-Slop Directive, and Pillar 7 visual standards before allowing disk write.',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Candidate source code string to audit in-memory.'
        },
        filePath: {
          type: 'string',
          description: 'Optional path to candidate file.'
        },
        language: {
          type: 'string',
          description: 'Target language (e.g. typescript, javascript, python).'
        }
      }
    }
  },
  {
    name: 'vibes_swarm_bus',
    description: 'Real-Time Swarm Concurrency Bus: queries active multi-agent swarms, event telemetry ring buffer, or broadcasts an inter-agent synchronization signal.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['status', 'events', 'broadcast'],
          description: 'Action to perform: status (active swarms), events (recent telemetry), broadcast (emit message).'
        },
        type: {
          type: 'string',
          description: 'Filter events by type (e.g. swarm:start, worker:done).'
        },
        swarmId: {
          type: 'string',
          description: 'Filter events by specific swarm ID.'
        },
        limit: {
          type: 'number',
          description: 'Max events to return (default: 20).'
        },
        message: {
          type: 'string',
          description: 'Message to broadcast when action is broadcast.'
        }
      }
    }
  },
  {
    name: 'vibes_graph_search',
    description: 'Local Hybrid GraphRAG Search: performs sub-millisecond lexical BM25 and TF-IDF vector cosine similarity search across AST symbol graph and project files.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query or concept to locate in the codebase graph.'
        },
        topK: {
          type: 'number',
          description: 'Maximum number of ranked results to return (default: 5).'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'vibes_package_extension',
    description: 'VS Code & Cursor Marketplace Packager: validates companion extension manifest and builds a zero-dependency Open Packaging Conventions (OPC) compliant .vsix binary package.',
    inputSchema: {
      type: 'object',
      properties: {
        dryRun: {
          type: 'boolean',
          description: 'Dry run preview without persisting .vsix to disk (default: false).'
        }
      }
    }
  },
  {
    name: 'vibes_run_benchmark',
    description: 'Performance Benchmark Suite & Regression Fuzzer: benchmarks all 7 sovereign engines (Micro-Sandbox, Pre-Disk Gate, AST Symbol Indexer, GraphRAG Search, Deterministic KV-Cache, Cross-IDE Bridge, and VSIX Packager) against strict SLA latency and throughput budgets.',
    inputSchema: {
      type: 'object',
      properties: {
        save: {
          type: 'boolean',
          description: 'Save telemetry results to .agents/telemetry/benchmark_results.json (default: true).'
        }
      }
    }
  },
  {
    name: 'vibes_git_hooks',
    description: 'Git Pre-Commit Hook Manager: inspects status, installs, or removes the automated Anti-Slop and Pre-Disk Verification Gate pre-commit hook in the repository.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['status', 'install', 'remove'],
          description: 'Action to perform: status (check hook), install (set up hook), remove (uninstall hook).'
        },
        targetDir: {
          type: 'string',
          description: 'Optional path to target git repository directory (defaults to current working directory).'
        }
      },
      required: ['action']
    }
  },
  {
    name: 'vibes_optimize_budget',
    description: 'Dynamic Token Budget Optimizer: scores multi-dimensional task complexity (domain breadth, architectural risk, code structure) and outputs calibrated thinking budgets (1K to 64K tokens), optimal model recommendations, and provider configurations for Gemini 4, Claude 3.7/5.1, and OpenAI o3.',
    inputSchema: {
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: 'Task prompt description, code snippet, or path to source file to analyze.'
        }
      },
      required: ['task']
    }
  },
  {
    name: 'vibes_skill_drift',
    description: 'Automated Skill Health & Framework Drift Monitor: audits all 171 skills across the Vibes-Plug catalog or deep dives into a specific skill. Verifies 2026 framework alignment (React 19, Next 15, Tailwind v4, Node 24), cross-skill dependency graph integrity (in/out-degree centrality, 0 dead links), master orchestrator registration, and Anti-Slop Directive compliance.',
    inputSchema: {
      type: 'object',
      properties: {
        skillName: {
          type: 'string',
          description: 'Optional skill name to deep dive into (e.g. senior-frontend). If omitted, runs a full ecosystem audit.'
        }
      }
    }
  },
  {
    name: 'vibes_terminal_monitor',
    description: 'Sovereign Cockpit & Live Monitor: queries current snapshot of Studio connectivity, Ecosystem Health, Token Economics & FinOps savings, Performance SLAs, and recent Swarm Event Bus telemetry.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'vibes_speculative_consensus',
    description: 'Speculative Multi-Draft Consensus Synthesizer: analyzes competing code implementations across 5 orthogonal vectors (Anti-Slop, Error Resilience, Cyclomatic Simplicity, Type Safety, and Micro-Sandbox Performance), ranks candidates, and synthesizes the optimal consensus code.',
    inputSchema: {
      type: 'object',
      properties: {
        drafts: {
          type: 'array',
          description: 'Array of candidate draft objects with code, model, and optional rationale.',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              code: { type: 'string' },
              model: { type: 'string' },
              rationale: { type: 'string' }
            },
            required: ['code']
          }
        },
        spec: {
          type: 'string',
          description: 'Optional specification or user requirement describing the expected functionality.'
        },
        verify: {
          type: 'boolean',
          description: 'Whether to benchmark candidate code in the ephemeral WASM/VM micro-sandbox.'
        }
      },
      required: ['drafts']
    }
  },
  {
    name: 'vibes_detect_stack',
    description: 'Smart Project & Stack Detector: inspects target workspace files (package.json, Cargo.toml, go.mod, pubspec.yaml, wrangler.toml, etc.) to detect frameworks and recommend a tailored bundle of specialized Vibes-Plug skills.',
    inputSchema: {
      type: 'object',
      properties: {
        targetDir: {
          type: 'string',
          description: 'Path to target workspace directory to inspect (defaults to current working directory).'
        },
        apply: {
          type: 'boolean',
          description: 'Whether to automatically install recommended skills to .agents/skills/ in target directory (default: false).'
        }
      }
    }
  },
  {
    name: 'vibes_skill_dispatch',
    description: 'Universal Skill-as-a-Tool (SaaT) Dispatcher: executes deterministic domain actions (blueprint, audit, eval, verify, generate, fuzz, optimize, health, budget) for any of the 171 skills in the Vibes-Plug registry.',
    inputSchema: {
      type: 'object',
      properties: {
        skill: {
          type: 'string',
          description: 'Exact name of the skill from the 171-skill registry (e.g. database-orm-expert, tailwind-expert, autonomous-tdd-debugger).'
        },
        action: {
          type: 'string',
          enum: ['blueprint', 'audit', 'eval', 'verify', 'generate', 'fuzz', 'optimize', 'health', 'budget'],
          description: 'Deterministic action to execute on the target skill.'
        },
        payload: {
          type: 'object',
          description: 'Action-specific parameters (e.g. sql, code, target, endpoint, hue, task).'
        }
      },
      required: ['skill', 'action']
    }
  }
];

export const MCP_RESOURCES = [
  {
    uri: 'vibes://schemas/swarm-plan',
    name: 'Swarm Plan Output Schema',
    description: 'JSON Schema contract for Autonomous Swarm Director execution plans',
    mimeType: 'application/json'
  },
  {
    uri: 'vibes://schemas/memory-checkpoint',
    name: 'Episodic Memory Checkpoint Schema',
    description: 'JSON Schema contract for ultra-compact project state handoff',
    mimeType: 'application/json'
  },
  {
    uri: 'vibes://schemas/anti-slop-contract',
    name: 'Sovereign Anti-Slop Directive Contract',
    description: 'JSON Schema contract for 5-state UI, zero-placeholder, and error resilience',
    mimeType: 'application/json'
  },
  {
    uri: 'vibes://cache/prefix',
    name: 'Deterministic KV-Cache Prefix',
    description: 'Compiled 171-skill canonical prefix (>1024 tokens) for prompt caching',
    mimeType: 'application/json'
  },
  {
    uri: 'vibes://memory/active',
    name: 'Active Episodic Memory Graph',
    description: 'Currently recorded architectural decisions and project state',
    mimeType: 'application/json'
  }
];

// JSON-RPC Transport Handler over stdio or SSE
export async function handleRpcRequest(request) {
  const { id, method, params } = request;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {}
        },
        serverInfo: {
          name: 'vibes-plug-mcp',
          version: '4.3.0'
        }
      }
    };
  }

  if (method === 'notifications/initialized') {
    return null; // Notification, no response
  }

  if (method === 'resources/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: { resources: MCP_RESOURCES }
    };
  }

  if (method === 'resources/read') {
    const uri = params?.uri;
    if (!uri) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32602, message: "Missing 'uri' parameter" }
      };
    }

    let textContent = '';
    if (uri === 'vibes://schemas/swarm-plan') {
      textContent = JSON.stringify({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'SwarmPlanOutput',
        type: 'object',
        properties: {
          topology: { type: 'string', enum: ['fan_out_fan_in', 'pipeline_saga', 'critic_validator'] },
          reasoningProfile: { type: 'string', enum: ['speed', 'balanced', 'deep', 'exhaustive'] },
          thinkingBudgetTokens: { type: 'number' },
          targetModelTier: { type: 'string' },
          totalWorkers: { type: 'number' },
          subagents: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                skill: { type: 'string' },
                focus: { type: 'string' },
                thinkingBudget: { type: 'string' }
              },
              required: ['name', 'skill', 'focus']
            }
          }
        },
        required: ['topology', 'reasoningProfile', 'subagents', 'totalWorkers']
      }, null, 2);
    } else if (uri === 'vibes://schemas/memory-checkpoint') {
      textContent = JSON.stringify({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'MemoryCheckpointOutput',
        type: 'object',
        properties: {
          schema: { type: 'string' },
          generatedAt: { type: 'string' },
          tokensApprox: { type: 'number' },
          invariants: { type: 'array', items: { type: 'string' } },
          decisions: { type: 'array', items: { type: 'object' } }
        },
        required: ['schema', 'invariants', 'decisions']
      }, null, 2);
    } else if (uri === 'vibes://schemas/anti-slop-contract') {
      textContent = JSON.stringify({
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'AntiSlopContract',
        type: 'object',
        properties: {
          strictMode: { type: 'boolean' },
          interactiveContract: { type: 'string', const: '5-state (default, hover, focus-visible, active, disabled)' },
          prohibitedPatterns: {
            type: 'array',
            items: { type: 'string' },
            default: ['// TODO', '// ...', 'empty catch blocks', 'rounded-full on rectangular buttons', 'dangerouslySetInnerHTML']
          }
        }
      }, null, 2);
    } else if (uri === 'vibes://cache/prefix') {
      const cachePath = path.join(PLUGIN_ROOT, '.cache-prefix.json');
      try {
        textContent = await fs.readFile(cachePath, 'utf8');
      } catch {
        textContent = JSON.stringify({ error: 'Cache prefix not compiled. Run vibes_compile_cache first.' });
      }
    } else if (uri === 'vibes://memory/active') {
      const mem = await loadMemory();
      textContent = JSON.stringify(mem, null, 2);
    } else {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32602, message: `Resource '${uri}' not found` }
      };
    }

    return {
      jsonrpc: '2.0',
      id,
      result: {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: textContent
          }
        ]
      }
    };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: { tools: TOOLS }
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params || {};
    try {
      let contentText = '';

      if (name === 'vibes_ast_query') {
        const { action, filePath, symbolName } = args || {};
        const resolvedPath = path.resolve(process.cwd(), filePath);

        if (action === 'symbols') {
          const res = await parseSymbols(resolvedPath);
          contentText = JSON.stringify(res, null, 2);
        } else if (action === 'inspect') {
          if (!symbolName) throw new Error("Argument 'symbolName' is required for action 'inspect'.");
          const res = await extractSymbolCode(resolvedPath, symbolName);
          contentText = JSON.stringify(res, null, 2);
        } else if (action === 'blast-radius') {
          const res = await calculateBlastRadius(process.cwd(), resolvedPath);
          contentText = JSON.stringify(res, null, 2);
        } else {
          throw new Error(`Unknown action: ${action}`);
        }
      } else if (name === 'vibes_eval_sql') {
        let sql = args?.sql || '';
        if (args?.filePath) {
          sql = await fs.readFile(path.resolve(process.cwd(), args.filePath), 'utf8');
        }
        const res = await evaluateSql(sql);
        contentText = JSON.stringify(res, null, 2);
      } else if (name === 'vibes_arbitrate_code') {
        const candidates = args?.candidates || [];
        const res = arbitrateCandidates(candidates);
        contentText = JSON.stringify(res, null, 2);
      } else if (name === 'vibes_verify_invariants') {
        let spec = args?.stateMachine;
        if (args?.typeScriptCode) {
          const states = parseTypeScriptStates(args.typeScriptCode);
          if (states) {
            spec = {
              name: 'Extracted_TS_State_Machine',
              states,
              initial: states[0],
              terminal: [states[states.length - 1]],
              transitions: states.slice(0, -1).map((s, idx) => ({ from: s, to: states[idx + 1] }))
            };
          }
        }
        if (!spec) throw new Error('Either stateMachine or typeScriptCode with state union is required.');
        const res = verifyStateMachine(spec);
        contentText = JSON.stringify(res, null, 2);
      } else if (name === 'vibes_compile_cache') {
        const res = await compileCache({ quiet: true });
        contentText = JSON.stringify(res, null, 2);
      } else if (name === 'vibes_memory') {
        const action = args?.action;
        if (action === 'record') {
          if (!args.text) throw new Error("Argument 'text' is required for action 'record'.");
          const item = await recordDecision(args.text, { category: args.category || 'Architecture' });
          contentText = JSON.stringify({ success: true, item }, null, 2);
        } else if (action === 'query') {
          if (!args.text) throw new Error("Argument 'text' (search keyword) is required for action 'query'.");
          const matches = await queryMemory(args.text);
          contentText = JSON.stringify({ count: matches.length, matches }, null, 2);
        } else if (action === 'checkpoint') {
          const res = await generateCompactCheckpoint();
          contentText = JSON.stringify({ success: true, checkpoint: res }, null, 2);
        } else if (action === 'list') {
          const mem = await loadMemory();
          contentText = JSON.stringify(mem, null, 2);
        } else {
          throw new Error(`Unknown memory action: ${action}`);
        }
      } else if (name === 'vibes_swarm') {
        const taskDescription = args?.taskDescription;
        if (!taskDescription) throw new Error("Argument 'taskDescription' is required.");
        const reasoningProfile = args?.reasoningProfile;
        const res = await executeSwarm(taskDescription, { reasoningProfile });
        contentText = JSON.stringify(res, null, 2);
      } else if (name === 'vibes_get_skill') {
        const skillName = args?.skillName?.trim();
        if (!skillName || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(skillName)) {
          throw new Error("Invalid 'skillName': must be a valid kebab-case skill identifier.");
        }
        if (args?.mode === 'compact') {
          const { getSkillCompactSlice } = await import('../scripts/skill-dispatcher.mjs');
          const slice = await getSkillCompactSlice(skillName);
          contentText = JSON.stringify(slice, null, 2);
        } else {
          const skillPath = path.resolve(SKILLS_DIR, skillName, 'SKILL.md');
          if (!skillPath.startsWith(SKILLS_DIR + path.sep)) {
            throw new Error('Path traversal is prohibited.');
          }
          const content = await fs.readFile(skillPath, 'utf8');
          contentText = content;
        }
      } else if (name === 'vibes_list_skills') {
        const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
        const skillDirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();
        const list = [];
        for (const sName of skillDirs) {
          const sPath = path.join(SKILLS_DIR, sName, 'SKILL.md');
          try {
            const raw = await fs.readFile(sPath, 'utf8');
            const descMatch = raw.match(/description:\s*["']?([^"'\r\n]+)["']?/);
            list.push({
              name: sName,
              description: descMatch ? descMatch[1].trim() : 'Specialized AI domain skill'
            });
          } catch {
            list.push({ name: sName, description: 'Specialized AI domain skill' });
          }
        }
        contentText = JSON.stringify({ total: list.length, skills: list }, null, 2);
      } else if (name === 'vibes_inject_skill') {
        const sName = args?.skillName?.trim();
        if (!sName || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(sName)) {
          throw new Error("Argument 'skillName' must be a valid kebab-case skill identifier.");
        }
        const sourceDir = path.resolve(SKILLS_DIR, sName);
        if (!sourceDir.startsWith(SKILLS_DIR + path.sep)) {
          throw new Error('Path traversal is prohibited.');
        }
        const targetBaseDir = path.resolve(process.cwd(), '.agents', 'skills');
        const targetDir = path.resolve(targetBaseDir, sName);
        await fs.mkdir(targetBaseDir, { recursive: true });
        await fs.cp(sourceDir, targetDir, { recursive: true });
        contentText = JSON.stringify({ success: true, message: `Skill '${sName}' injected successfully into ${targetDir}` }, null, 2);
      } else if (name === 'vibes_batch') {
        const calls = args?.calls;
        if (!Array.isArray(calls) || calls.length === 0) {
          throw new Error("Argument 'calls' must be a non-empty array of tool invocations.");
        }
        const executed = await Promise.allSettled(
          calls.map(async (c, idx) => {
            if (c.tool === 'vibes_batch') {
              throw new Error("Nested 'vibes_batch' execution is disallowed.");
            }
            const subRes = await handleRpcRequest({
              jsonrpc: '2.0',
              id: `batch-${idx}`,
              method: 'tools/call',
              params: { name: c.tool, arguments: c.arguments || {} }
            });
            if (subRes.error) {
              throw new Error(subRes.error.message);
            }
            const text = subRes.result?.content?.[0]?.text;
            try {
              return { tool: c.tool, success: true, data: JSON.parse(text) };
            } catch {
              return { tool: c.tool, success: true, data: text };
            }
          })
        );

        const results = executed.map((res, i) => {
          if (res.status === 'fulfilled') {
            return res.value;
          }
          return { tool: calls[i].tool, success: false, error: res.reason?.message || 'Execution failed' };
        });

        const successCount = results.filter(r => r.success).length;
        contentText = JSON.stringify({
          batchSize: calls.length,
          successful: successCount,
          failed: calls.length - successCount,
          results
        }, null, 2);
      } else if (name === 'vibes_critic_validate') {
        const target = args?.target;
        if (!target) throw new Error("Argument 'target' is required.");
        const language = args?.language;
        const strictness = args?.strictness;
        const report = criticValidate(target, { language, strictness });
        contentText = JSON.stringify(report, null, 2);
      } else if (name === 'vibes_visual_audit') {
        const target = args?.target;
        if (!target) throw new Error("Argument 'target' is required.");
        const viewport = args?.viewport;
        const report = visualAudit(target, { viewport });
        contentText = JSON.stringify(report, null, 2);
      } else if (name === 'vibes_eval_sandbox') {
        const code = args?.code;
        if (!code) throw new Error("Argument 'code' is required.");
        if (process.env.VIBES_ENABLE_UNTRUSTED_SANDBOX_EVAL !== 'true') {
          throw new Error("Sandbox eval is disabled. Set VIBES_ENABLE_UNTRUSTED_SANDBOX_EVAL=true to enable.");
        }
        const timeoutMs = args?.timeoutMs;
        const { executeInSandbox } = await import('../scripts/wasm-sandbox.mjs');
        const outcome = executeInSandbox(code, { timeoutMs });
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_swarm_dispatch') {
        const task = args?.task || args?.taskDescription;
        if (!task) throw new Error("Argument 'task' is required.");
        const concurrency = args?.concurrency;
        const reasoning = args?.reasoning || args?.reasoningProfile;
        const { dispatchSwarm } = await import('../scripts/swarm-dispatcher.mjs');
        const outcome = await dispatchSwarm(task, { concurrency, reasoning });
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_finops_report') {
        const action = args?.action || 'status';
        const { loadFinOpsData, resetFinOpsData, recordFinOpsUsage } = await import('../scripts/finops-tracker.mjs');
        if (action === 'reset') {
          const fresh = await resetFinOpsData();
          contentText = JSON.stringify({ success: true, message: 'FinOps telemetry reset to zero', data: fresh }, null, 2);
        } else if (action === 'record') {
          const updated = await recordFinOpsUsage(args);
          contentText = JSON.stringify({ success: true, data: updated }, null, 2);
        } else {
          const current = await loadFinOpsData();
          contentText = JSON.stringify({ success: true, data: current }, null, 2);
        }
      } else if (name === 'vibes_graph_query') {
        const symbolName = args?.symbolName || args?.query || args?.symbol;
        if (!symbolName) throw new Error("Argument 'symbolName' is required.");
        const { querySymbolGraph } = await import('../scripts/graphrag-indexer.mjs');
        const outcome = await querySymbolGraph(symbolName);
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_pr_review') {
        const target = args?.target || 'HEAD~1';
        const outputFile = args?.outputFile;
        const { reviewPullRequest } = await import('../scripts/github-pr-bot.mjs');
        const outcome = await reviewPullRequest(target, { outputFile });
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_self_heal') {
        const command = args?.command || 'npm test';
        const dryRun = args?.dryRun !== false;
        const { diagnoseAndHeal } = await import('../scripts/self-healer.mjs');
        const outcome = await diagnoseAndHeal(command, { dryRun });
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_registry_search') {
        const query = args?.query;
        if (!query) throw new Error("Argument 'query' is required.");
        const category = args?.category;
        const { searchRegistry } = await import('../scripts/registry-manager.mjs');
        const matches = await searchRegistry(query, { category });
        contentText = JSON.stringify({ count: matches.length, matches }, null, 2);
      } else if (name === 'vibes_registry_install') {
        const skillName = args?.skillName;
        if (!skillName) throw new Error("Argument 'skillName' is required.");
        const { installSkill } = await import('../scripts/registry-manager.mjs');
        const outcome = await installSkill(skillName);
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_bridge_status') {
        const targetDir = args?.targetDir || process.cwd();
        const { checkBridgeStatus } = await import('../scripts/cross-ide-bridge.mjs');
        const outcome = await checkBridgeStatus(targetDir);
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_bridge_sync') {
        const targetDir = args?.targetDir || process.cwd();
        const target = args?.target || 'all';
        const { syncBridge } = await import('../scripts/cross-ide-bridge.mjs');
        const outcome = await syncBridge(targetDir, { target });
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_learn_skill') {
        const { name: skillName, fromRepo, category, dest, dryRun } = args || {};
        if (!skillName) throw new Error("Argument 'name' is required.");
        const { synthesizeSkill } = await import('../scripts/skill-synthesizer.mjs');
        const outcome = await synthesizeSkill({ name: skillName, fromRepo, category, dest, dryRun });
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_verify_gate') {
        const target = args?.code || args?.filePath || args?.target;
        if (!target) throw new Error("Argument 'code' or 'filePath' is required.");
        const { verifyCandidateCode } = await import('../scripts/wasm-sandbox.mjs');
        const outcome = await verifyCandidateCode(target, { language: args?.language });
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_swarm_bus') {
        const { action = 'status', type, swarmId, limit = 20, message } = args || {};
        const { swarmBus, emitSwarmEvent } = await import('../scripts/swarm-bus.mjs');
        if (action === 'broadcast') {
          const ev = emitSwarmEvent('agent:broadcast', { message: message || 'Broadcast via MCP', source: 'MCP' });
          contentText = JSON.stringify({ success: true, event: ev }, null, 2);
        } else if (action === 'events') {
          const events = swarmBus.getEvents({ type, swarmId, limit });
          contentText = JSON.stringify({ success: true, count: events.length, events }, null, 2);
        } else {
          const active = swarmBus.getActiveSwarms();
          const events = swarmBus.getEvents({ limit: 10 });
          contentText = JSON.stringify({ success: true, activeSwarms: active, recentEvents: events }, null, 2);
        }
      } else if (name === 'vibes_graph_search') {
        const query = args?.query || args?.target;
        if (!query) throw new Error("Argument 'query' is required.");
        const topK = Number(args?.topK) || 5;
        const { hybridSearch } = await import('../scripts/graphrag-indexer.mjs');
        const outcome = await hybridSearch(query, { topK });
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_package_extension') {
        const dryRun = args?.dryRun === true;
        const { packageVsix } = await import('../scripts/package-extension.mjs');
        const outcome = await packageVsix({ dryRun });
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_run_benchmark') {
        const save = args?.save !== false;
        const { runBenchmarkSuite } = await import('../scripts/benchmark-suite.mjs');
        const outcome = await runBenchmarkSuite({ json: true, save });
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_git_hooks') {
        const action = args?.action || 'status';
        const targetDir = args?.targetDir || process.cwd();
        const { installGitHook, removeGitHook, checkHookStatus } = await import('../scripts/git-hook-installer.mjs');
        let outcome;
        if (action === 'install') {
          outcome = await installGitHook(targetDir);
        } else if (action === 'remove') {
          outcome = await removeGitHook(targetDir);
        } else {
          outcome = await checkHookStatus(targetDir);
        }
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_optimize_budget') {
        const task = args?.task || args?.input || args?.prompt;
        if (!task) throw new Error("Argument 'task' is required.");
        const { optimizeThinkingBudget } = await import('../scripts/token-budget-optimizer.mjs');
        const outcome = await optimizeThinkingBudget(task);
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_skill_drift') {
        const skillName = args?.skillName || args?.skill;
        const { auditEcosystem } = await import('../scripts/skill-drift-monitor.mjs');
        const ecosystem = await auditEcosystem();
        if (skillName) {
          const single = ecosystem.skills.find(s => s.skillName === skillName);
          if (!single) throw new Error(`Skill '${skillName}' not found in catalog.`);
          contentText = JSON.stringify(single, null, 2);
        } else {
          contentText = JSON.stringify(ecosystem, null, 2);
        }
      } else if (name === 'vibes_terminal_monitor') {
        const { loadMonitorSnapshot } = await import('../scripts/terminal-monitor.mjs');
        const snapshot = await loadMonitorSnapshot();
        contentText = JSON.stringify(snapshot, null, 2);
      } else if (name === 'vibes_speculative_consensus') {
        const { reconcileSpeculativeDrafts } = await import('../scripts/speculative-consensus.mjs');
        const drafts = Array.isArray(args?.drafts) ? args.drafts : [];
        const spec = args?.spec || 'Optimal, production-ready implementation adhering to Anti-Slop gold standards.';
        const verify = Boolean(args?.verify);
        const result = await reconcileSpeculativeDrafts(drafts, { spec, verify });
        contentText = JSON.stringify(result, null, 2);
      } else if (name === 'vibes_detect_stack') {
        const targetDir = args?.targetDir || process.cwd();
        const apply = Boolean(args?.apply);
        const { detectProjectStack, applyDetectedSkills } = await import('../scripts/project-detector.mjs');
        const outcome = await detectProjectStack(targetDir);
        if (apply) {
          outcome.installation = await applyDetectedSkills(targetDir, outcome.recommendedSkills);
        }
        contentText = JSON.stringify(outcome, null, 2);
      } else if (name === 'vibes_skill_dispatch') {
        const { dispatchSkillAction, dispatchSkillChain } = await import('../scripts/skill-dispatcher.mjs');
        if (args?.action === 'chain') {
          const chainRes = await dispatchSkillChain(args?.skill || 'saas-launch-gate', args?.payload || {});
          contentText = JSON.stringify(chainRes, null, 2);
        } else {
          const outcome = await dispatchSkillAction({
            skill: args?.skill,
            action: args?.action || 'blueprint',
            payload: args?.payload || {}
          });
          contentText = JSON.stringify(outcome, null, 2);
        }
      } else {
        throw new Error(`Tool '${name}' not found.`);
      }

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: contentText }]
        }
      };
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32000, message: err.message }
      };
    }
  }

  // Unsupported method
  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method '${method}' not implemented.` }
  };
}

export function startStdioServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  process.stderr.write('⚡ [Vibes-Plug MCP Server v4.4.2] Listening on stdio...\n');

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    try {
      const request = JSON.parse(trimmed);
      const response = await handleRpcRequest(request);
      if (response) {
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } catch (e) {
      process.stderr.write(`[MCP Error] Failed to parse input: ${e.message}\n`);
    }
  });

  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));
}

export function startSseServer(port = 3333, host = process.env.VIBES_HOST || '127.0.0.1') {
  const sseClients = new Map();

  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const { pathname, searchParams } = parsedUrl;

    // Reject cross-origin requests from untrusted origins to prevent DNS rebinding
    const origin = req.headers.origin;
    if (origin && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Forbidden: Untrusted cross-origin request rejected' }));
      return;
    }

    const allowedOrigin = (origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) ? origin : `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`;

    // Standard CORS
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-id');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'GET' && pathname === '/sse') {
      const sessionId = crypto.randomUUID();
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      });

      res.write(`event: endpoint\ndata: /messages?sessionId=${sessionId}\n\n`);
      sseClients.set(sessionId, res);

      req.on('close', () => {
        sseClients.delete(sessionId);
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/messages') {
      const sessionId = searchParams.get('sessionId') || req.headers['x-session-id'];
      let body = '';
      let bytes = 0;
      req.on('data', chunk => {
        bytes += chunk.length;
        if (bytes > 1048576) {
          req.destroy();
          return;
        }
        body += chunk;
      });
      req.on('end', async () => {
        try {
          const request = JSON.parse(body);
          const response = await handleRpcRequest(request);

          if (sessionId && sseClients.has(sessionId)) {
            const clientRes = sseClients.get(sessionId);
            clientRes.write(`event: message\ndata: ${JSON.stringify(response)}\n\n`);
          }

          res.writeHead(202, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'accepted', response }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && (pathname === '/' || pathname === '/health' || pathname === '/status')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'online',
        service: 'vibes-plug-mcp',
        version: '4.3.0',
        transport: 'sse',
        endpoints: {
          sse: '/sse',
          messages: '/messages?sessionId=:id'
        },
        toolsCount: TOOLS.length
      }, null, 2));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, host, () => {
      console.log(`\n⚡ [Vibes-Plug Remote MCP Server v4.4.2] Listening on SSE at: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/sse`);
      console.log(`📡 Ready for Claude Desktop, Cursor, and remote AI agents.\n`);
      resolve({ server, port, host });
    });
  });
}

export function startServer(options = {}) {
  const transport = options.transport || (process.argv.includes('--transport') ? process.argv[process.argv.indexOf('--transport') + 1] : 'stdio');
  const portArgIdx = process.argv.indexOf('--port');
  const port = options.port || (portArgIdx !== -1 ? parseInt(process.argv[portArgIdx + 1], 10) : 3333);
  const host = options.host || (process.argv.includes('--host') ? process.argv[process.argv.indexOf('--host') + 1] : (process.env.VIBES_HOST || '127.0.0.1'));

  if (transport === 'sse') {
    return startSseServer(port, host);
  }

  return startStdioServer();
}

// Standalone execution check
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  startServer();
}
