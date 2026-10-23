---
name: durable-agent-execution-expert
description: "Expert guide for crash-resilient Durable Agent Execution, Temporal AI workflows, Restate, Cloudflare Workflows, deterministic tool replay, and human-in-the-loop pause/resume sagas / Panduan ahli eksekusi agen AI tahan-gagal (Durable Execution) dengan Temporal, Restate, dan Cloudflare Workflows."
author: "Roedy Rustam"
version: "4.4.2"

---

# Durable Agent Execution & Crash-Resilient Workflow Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Async Queues & Distributed Sagas**: `async-queue-temporal-expert`, `event-driven-architect`, `error-resilience-expert`
- **AI Agents & Orchestration**: `multi-agent-orchestration`, `ai-llm-integration-expert`, `a2a-agent-protocol-expert`, `agentic-memory-architect`
- **Edge & Serverless Runtimes**: `cloudflare-workers-expert`, `js-backend-expert`
- **Lifecycle & Governance**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production engineering guide for building **crash-proof, long-running AI Agents** using **Durable Execution Engines** (**Temporal.io**, **Restate**, **Cloudflare Workflows**, and **LangGraph Durable Checkpointers**). Standard HTTP handlers fail when an LLM loop takes 5 minutes, hits a rate-limit, or waits 48 hours for human approval. Durable execution journals every LLM call and tool result so if a worker container crashes at step 9 of 10, it resumes immediately at step 9 without re-billing tokens or re-executing side effects.

### Trigger Conditions
- Building autonomous coding, research, or FinTech reconciliation agents that run for minutes, hours, or days.
- Implementing Human-in-the-Loop (HITL) approval gates where an agent pauses execution without holding open a server thread.
- Preventing duplicate LLM token charges or duplicate external API calls when a worker restarts mid-loop.
- Deploying stateful multi-step workflows on Cloudflare Workflows or Restate.

---

### Durable Engine Selection Matrix

| Engine | Runtime Model | State Storage | Best For |
| :--- | :--- | :--- | :--- |
| **Temporal.io** | Long-polling workers (Node/Go/Python/Rust) | Postgres / Cassandra | Complex enterprise sagas, multi-day agent loops |
| **Restate** | Push/RPC Durable Invocations (TS/Rust/Go) | Built-in RocksDB / Raft log | Low-latency microservices, durable idempotency & virtual objects |
| **Cloudflare Workflows** | Serverless Edge (`WorkflowEntrypoint`) | Cloudflare Durable Storage | Zero-infra edge agents, `step.do()` & `step.sleep()` |
| **LangGraph Checkpointer** | Graph State Snapshots | Postgres (`PostgresSaver`) | Conversational time-travel, state branching, thread resume |

---

### Core Implementation Patterns

#### 1. Cloudflare Workflows Durable Agent Loop (`step.do` & `step.waitForEvent`)
Every non-deterministic operation (LLM generation, external tool fetch, `Date.now()`) MUST be wrapped inside a durable `step.do()` block so its return value is persisted in the execution journal:

```typescript
// src/workflows/durable-research-agent.ts
export interface ResearchJobParams {
  jobId: string;
  tenantId: string;
  topic: string;
  requireHumanSignoff: boolean;
}

export interface WorkflowStep {
  do<T>(name: string, config: { retries?: { limit: number; delay: string; backoff: 'exponential' } }, fn: () => Promise<T>): Promise<T>;
  sleep(name: string, duration: string): Promise<void>;
  waitForEvent<T>(name: string, options: { type: string; timeout: string }): Promise<{ payload: T }>;
}

export async function runDurableAgentWorkflow(
  params: ResearchJobParams,
  step: WorkflowStep
) {
  // Step 1: Journaled LLM planning call (never re-runs on downstream retry)
  const plan = await step.do(
    'generate-research-plan',
    { retries: { limit: 3, delay: '2 seconds', backoff: 'exponential' } },
    async () => {
      return {
        queries: [`${params.topic} architecture 2026`, `${params.topic} security invariants`],
        estimatedTokens: 4096,
      };
    }
  );

  // Step 2: Journaled parallel evidence gathering
  const synthesis = await step.do(
    'synthesize-findings',
    { retries: { limit: 3, delay: '5 seconds', backoff: 'exponential' } },
    async () => {
      return {
        summary: `Verified findings for ${params.topic}`,
        sourcesCount: plan.queries.length,
      };
    }
  );

  // Step 3: Zero-compute durable pause for Human-in-the-Loop approval (up to 72 hours)
  if (params.requireHumanSignoff) {
    const approval = await step.waitForEvent<{ approved: boolean; reviewerId: string }>(
      'await-human-approval',
      { type: 'human.approval.submitted', timeout: '72 hours' }
    );

    if (!approval.payload.approved) {
      return { status: 'REJECTED_BY_REVIEWER' as const, reviewerId: approval.payload.reviewerId };
    }
  }

  // Step 4: Commit final output
  return await step.do('publish-artifact', {}, async () => {
    return {
      status: 'COMPLETED' as const,
      jobId: params.jobId,
      synthesis,
    };
  });
}
```

---

### Verification Checklist
- [ ] All non-deterministic calls (`fetch`, LLM inference, `crypto.randomUUID()`, `Date.now()`) are executed inside journaled `step.do()` / Activity boundaries.
- [ ] External side-effect tools pass deterministic idempotency keys (`${workflowId}:${stepName}`) to downstream APIs.
- [ ] Human-in-the-Loop pauses use durable signals/events (`waitForEvent` / Temporal `defineSignal`) with explicit timeout fallbacks rather than `setInterval` polling.
- [ ] Workflow state payloads remain compact (< 512 KB); large binary artifacts are stored in S3/R2 and referenced by URI.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Antrean Asinkron & Saga Terdistribusi**: `async-queue-temporal-expert`, `event-driven-architect`, `error-resilience-expert`
- **Agen AI & Orkestrasi**: `multi-agent-orchestration`, `ai-llm-integration-expert`, `a2a-agent-protocol-expert`, `agentic-memory-architect`
- **Runtime Edge & Serverless**: `cloudflare-workers-expert`, `js-backend-expert`
- **Siklus Hidup & Tata Kelola**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan rekayasa produksi untuk membangun **Agen AI berdurasi panjang yang tahan kegagalan (*crash-resilient*)** menggunakan **Temporal.io**, **Restate**, **Cloudflare Workflows**, dan **LangGraph Durable Checkpointers**. Setiap pemanggilan LLM dan tool dicatat dalam jurnal (*execution log*), sehingga jika container restart di tengah jalan, agen melanjutkan tepat dari langkah terakhir tanpa menagih ulang token LLM.

### Panduan Arsitektur Inti
1. **Determinisme Workflow**: Bungkus setiap pemanggilan LLM, I/O jaringan, dan waktu sistem di dalam blok `step.do()` atau *Activity* agar hasilnya disimpan di jurnal.
2. **Human-in-the-Loop Tanpa Biaya Compute**: Gunakan `step.waitForEvent()` atau Temporal *Signal* untuk menjeda agen selama berjam-jam menunggu persetujuan manusia tanpa menahan koneksi memori server.
3. **Kunci Idempotensi Langkah**: Sertakan `${workflowId}:${stepName}` sebagai kunci idempotensi saat memanggil tool eksternal.

### Daftar Periksa Verifikasi (Checklist)
- [ ] Seluruh pemanggilan LLM dan I/O dibungkus dalam *durable step/activity*.
- [ ] Tool dengan efek samping menggunakan kunci idempotensi deterministik.
- [ ] Jeda *human-in-the-loop* memiliki batas waktu (*timeout*) eksplisit.
