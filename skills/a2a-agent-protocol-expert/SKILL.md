---
name: a2a-agent-protocol-expert
description: "Expert guide for Agent-to-Agent (A2A) Protocol interoperability, /.well-known/agent.json Agent Cards, cross-vendor swarm task negotiation, and bridging A2A with Model Context Protocol (MCP) / Panduan ahli protokol interoperabilitas antar-agen (A2A), Agent Cards, dan integrasi A2A + MCP."
author: "Roedy Rustam"
version: "4.4.2"

---

# Agent-to-Agent (A2A) Protocol & Federated Swarm Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Multi-Agent & MCP Ecosystem**: `multi-agent-orchestration`, `mcp-server-architect`, `mcp-sampling-critic`, `parallel-tool-orchestrator`, `durable-agent-execution-expert`, `computer-use-os-agent-expert`
- **Agentic Economy & Settlement**: `agentic-m2m-settlement`, `agentic-micro-economy-architect`, `doku-mcp-server`
- **Security & Contracts**: `structured-output-contracts`, `prompt-injection-firewall`, `zero-trust-secret-vault`
- **Lifecycle & Governance**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production guide for implementing the open **Agent-to-Agent (A2A) Protocol** alongside **Model Context Protocol (MCP)**. While **MCP** connects an agent to deterministic tools and resources (*Agent-to-Tool*), **A2A** enables opaque autonomous agents built on different frameworks (LangGraph, Pydantic AI, Google ADK, OpenAI Agents SDK, Mastra) to discover capabilities via `/.well-known/agent.json` **Agent Cards**, negotiate multi-turn tasks (`tasks/send`, `tasks/sendSubscribe`), exchange typed **Artifacts**, and settle M2M budgets.

### Trigger Conditions
- Exposing an autonomous agent service to external partner agents via standard HTTP JSON-RPC + SSE.
- Publishing or consuming `/.well-known/agent.json` Agent Cards for dynamic capability discovery.
- Orchestrating cross-organization or polyglot multi-agent workflows where subagents do not share internal memory.
- Combining A2A horizontal agent delegation with MCP vertical tool execution.

---

### A2A vs MCP Architectural Separation

| Dimension | Model Context Protocol (MCP v1.x) | Agent-to-Agent Protocol (A2A) |
| :--- | :--- | :--- |
| **Primary Relationship** | Agent $\leftrightarrow$ Deterministic Tool / Resource | Client Agent $\leftrightarrow$ Remote Autonomous Agent |
| **Discovery Mechanism** | `tools/list`, `resources/list`, `prompts/list` | `GET /.well-known/agent.json` (Agent Card) |
| **Execution Lifecycle** | Synchronous RPC call (`tools/call`) | Stateful Task lifecycle (`submitted` $\rightarrow$ `working` $\rightarrow$ `input-required` $\rightarrow$ `completed`) |
| **State & Reasoning** | Stateless function execution | Opaque internal reasoning, memory, and multi-step planning |

---

### Core Implementation Patterns

#### 1. Standard `/.well-known/agent.json` Agent Card Specification
```typescript
// src/a2a/agent-card.ts
export interface A2AAgentSkill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  inputModes: ('text/plain' | 'application/json')[];
  outputModes: ('text/plain' | 'application/json')[];
}

export interface A2AAgentCard {
  name: string;
  description: string;
  url: string;
  version: string;
  capabilities: {
    streaming: boolean;
    pushNotifications: boolean;
    stateTransitionHistory: boolean;
  };
  authentication: {
    schemes: ('Bearer' | 'OAuth2' | 'MutualTLS')[];
  };
  skills: A2AAgentSkill[];
}

export const FINTECH_AUDITOR_AGENT_CARD: A2AAgentCard = {
  name: 'vibes-fintech-auditor',
  description: 'Autonomous SNAP BI payment reconciliation and Z3 invariant verifier agent',
  url: 'https://agents.internal.example.com/a2a/fintech-auditor',
  version: '4.4.2',
  capabilities: {
    streaming: true,
    pushNotifications: true,
    stateTransitionHistory: true,
  },
  authentication: {
    schemes: ['Bearer'],
  },
  skills: [
    {
      id: 'verify-settlement-batch',
      name: 'Verify Settlement Batch',
      description: 'Audits DOKU SNAP BI webhook records against double-entry ledger postings',
      tags: ['fintech', 'doku', 'ledger', 'audit'],
      inputModes: ['application/json'],
      outputModes: ['application/json'],
    },
  ],
};
```

---

#### 2. A2A JSON-RPC Task Handler (`tasks/send` & State Machine)
```typescript
// src/a2a/task-router.ts
import { Hono } from 'hono';
import { z } from 'zod';
import { FINTECH_AUDITOR_AGENT_CARD } from './agent-card';

const app = new Hono();

const TaskSendSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.union([z.string(), z.number()]),
  method: z.enum(['tasks/send', 'tasks/get', 'tasks/cancel']),
  params: z.object({
    id: z.string().uuid(),
    sessionId: z.string().optional(),
    message: z.object({
      role: z.enum(['user', 'agent']),
      parts: z.array(
        z.object({
          type: z.enum(['text', 'data']),
          text: z.string().optional(),
          data: z.record(z.unknown()).optional(),
        })
      ),
    }),
  }),
});

app.get('/.well-known/agent.json', (c) => c.json(FINTECH_AUDITOR_AGENT_CARD));

app.post('/a2a/fintech-auditor', async (c) => {
  const body = await c.req.json();
  const parsed = TaskSendSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({
      jsonrpc: '2.0',
      id: body?.id ?? null,
      error: { code: -32602, message: 'Invalid A2A task parameters', data: parsed.error.issues },
    }, 400);
  }

  const { id: rpcId, params } = parsed.data;

  return c.json({
    jsonrpc: '2.0',
    id: rpcId,
    result: {
      id: params.id,
      status: {
        state: 'completed',
        timestamp: new Date().toISOString(),
      },
      artifacts: [
        {
          name: 'audit-verdict.json',
          parts: [
            {
              type: 'data',
              data: { verified: true, discrepanciesFound: 0, taskId: params.id },
            },
          ],
        },
      ],
    },
  });
});

export default app;
```

---

### Verification Checklist
- [ ] Agent service publishes a valid `/.well-known/agent.json` endpoint declaring authentication schemes and typed skills.
- [ ] All A2A task states adhere to standard transitions (`submitted` $\rightarrow$ `working` $\rightarrow$ `input-required` | `completed` | `failed` | `canceled`).
- [ ] Incoming `parts` payloads from remote agents are validated via Zod schemas and sanitized through `prompt-injection-firewall`.
- [ ] Long-running tasks support SSE streaming (`tasks/sendSubscribe`) or signed webhook push notifications.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Ekosistem Multi-Agen & MCP**: `multi-agent-orchestration`, `mcp-server-architect`, `mcp-sampling-critic`, `parallel-tool-orchestrator`, `durable-agent-execution-expert`, `computer-use-os-agent-expert`
- **Ekonomi & Settlement Agen**: `agentic-m2m-settlement`, `agentic-micro-economy-architect`, `doku-mcp-server`
- **Keamanan & Kontrak**: `structured-output-contracts`, `prompt-injection-firewall`, `zero-trust-secret-vault`
- **Siklus Hidup & Tata Kelola**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan produksi untuk mengimplementasikan **Agent-to-Agent (A2A) Protocol** berdampingan dengan **Model Context Protocol (MCP)**. Jika MCP menghubungkan agen ke tool deterministik (*Agent-to-Tool*), A2A memungkinkan agen otonom lintas framework untuk saling menemukan kapabilitas melalui `/.well-known/agent.json` (**Agent Card**), menegosiasikan tugas multi-giliran (`tasks/send`), dan bertukar **Artifact** terstruktur.

### Panduan Arsitektur Inti
1. **Sinergi A2A + MCP**: Gunakan A2A untuk delegasi horizontal antar-agen spesialis, dan gunakan MCP untuk pemanggilan fungsi/tool vertikal di dalam masing-masing agen.
2. **Penemuan Dinamis (Agent Card)**: Publikasikan kapabilitas, mode input/output, dan skema autentikasi di `/.well-known/agent.json`.
3. **Pertahanan Injeksi Lintas-Agen**: Perlakukan setiap pesan dari agen eksternal sebagai input yang tidak tepercaya; validasi dengan skema JSON ketat dan `prompt-injection-firewall`.

### Daftar Periksa Verifikasi (Checklist)
- [ ] Endpoint `/.well-known/agent.json` tersedia dan mendeklarasikan skema autentikasi.
- [ ] Siklus hidup tugas mengikuti status standar (`submitted`, `working`, `input-required`, `completed`, `failed`).
- [ ] Payload antar-agen divalidasi dengan Zod dan disanitasi dari serangan *indirect prompt injection*.
