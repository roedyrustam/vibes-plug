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
 * - vibes_get_skill (Registry: Instant access to any of the 147 skills)
 */

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

import { parseSymbols, extractSymbolCode, calculateBlastRadius } from '../scripts/ast-query.mjs';
import { evaluateSql } from '../scripts/eval-migration.mjs';
import { scoreDraft, arbitrateCandidates } from '../scripts/speculative-arbiter.mjs';
import { verifyStateMachine, parseTypeScriptStates } from '../scripts/verify-invariants.mjs';
import { compileCache } from '../scripts/compile-cache.mjs';
import { recordDecision, queryMemory, generateCompactCheckpoint, loadMemory } from '../scripts/memory-daemon.mjs';
import { executeSwarm } from '../scripts/swarm-runner.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');

const TOOLS = [
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
    description: 'Retrieve full domain instructions, production patterns, and templates for any of the 147 specialized skills in the vibes-plug registry.',
    inputSchema: {
      type: 'object',
      properties: {
        skillName: {
          type: 'string',
          description: 'Name of the skill (e.g. senior-frontend, database-orm-expert, doku-payment-gateway, anti-slop).'
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
    description: 'Autonomous Swarm Orchestrator: plan and execute Fan-Out/Fan-In, Pipeline Saga, or Critic-Validator topologies for complex multi-domain development tasks.',
    inputSchema: {
      type: 'object',
      properties: {
        taskDescription: {
          type: 'string',
          description: 'Natural language description of the development task.'
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
  }
];

// JSON-RPC Transport Handler over stdio
async function handleRpcRequest(request) {
  const { id, method, params } = request;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'vibes-plug-mcp',
          version: '4.2.0'
        }
      }
    };
  }

  if (method === 'notifications/initialized') {
    return null; // Notification, no response
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
        const res = await executeSwarm(taskDescription);
        contentText = JSON.stringify(res, null, 2);
      } else if (name === 'vibes_get_skill') {
        const skillName = args?.skillName?.trim();
        const skillPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
        const content = await fs.readFile(skillPath, 'utf8');
        contentText = content;
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

function startServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  process.stderr.write('⚡ [Vibes-Plug MCP Server v4.2.0] Listening on stdio...\n');

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

startServer();
