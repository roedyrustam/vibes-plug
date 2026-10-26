---
name: parallel-tool-orchestrator
description: "Parallel tool calling, MCP batching, and async subagent fan-out / Eksekusi tool paralel, batching MCP, dan subagent async fan-out."
author: "Roedy Rustam"
version: "4.4.2"

---

# parallel-tool-orchestrator — vibes-plug Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Multi-Agent & Swarm Execution**: `multi-agent-orchestration`, `speculative-multi-draft-synthesizer`
- **MCP & Tool Protocols**: `mcp-server-architect`, `mcp-sampling-critic`, `doku-mcp-server`
- **Async Queues & Sagas**: `async-queue-temporal-expert`, `event-driven-architect`, `cron-scheduler-expert`
- **Performance & Latency**: `performance-web-vitals`, `context-window-engineer`, `llm-finops-router`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production guide for optimizing AI agent tool-calling throughput by executing independent tool invocations in parallel. Late-2026 frontier models (Gemini 4 Argon/Pro [fallback: Gemini 3.8 Flash], Claude Sonnet 5.5, Claude Opus 5.5 [fallback: Claude Opus 4.6], GPT-5.6 Sol, Grok 4.7) natively generate multi-tool calls in a single turn. Executing these calls sequentially creates unnecessary network round-trips and escalates latency. This skill provides architectures for parallel tool orchestration using Model Context Protocol batching (`vibes_batch`), resilient `Promise.allSettled` execution, automated dependency DAG resolution, and non-blocking background task workers.

### Trigger Conditions
Activate this skill when:
- Designing AI agents that call multiple inspection tools (e.g. querying AST symbols, checking memory, and scanning SQL DDL in one step).
- Running Fan-Out / Fan-In swarm topologies with multiple concurrent leaf workers.
- Mitigating high agentic latency on complex multi-step workflows.
- Handling partial tool execution failures without crashing the entire agent loop.

---

### Parallel Batching Architecture

```
MODEL EMITS MULTIPLE TOOL CALLS
              │
              ▼
┌───────────────────────────────┐
│ MCP BATCH DISPATCHER          │  vibes_batch wrapper
└─────────────┬─────────────────┘
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
  TOOL 1    TOOL 2    TOOL 3     Executed simultaneously
  (AST)     (Mem)     (SQL)      via Promise.allSettled()
    │         │         │
    └─────────┼─────────┘
              ▼
┌───────────────────────────────┐
│ AGGREGATED BATCH RESULT       │  Returns successful results and isolated errors
└───────────────────────────────┘
```

#### 1. Resilient Parallel Dispatcher Implementation (TypeScript)

```typescript
export interface ToolCall {
  tool: string;
  arguments: Record<string, any>;
}

export interface BatchResult<T = any> {
  batchSize: number;
  successful: number;
  failed: number;
  results: Array<{
    tool: string;
    success: boolean;
    data?: T;
    error?: string;
  }>;
}

export async function executeParallelBatch(
  calls: ToolCall[],
  executor: (call: ToolCall) => Promise<any>
): Promise<BatchResult> {
  if (!Array.isArray(calls) || calls.length === 0) {
    throw new Error('Batch calls must be a non-empty array.');
  }

  const executed = await Promise.allSettled(
    calls.map(async (c) => {
      const data = await executor(c);
      return { tool: c.tool, success: true, data };
    })
  );

  const results = executed.map((res, i) => {
    if (res.status === 'fulfilled') {
      return res.value;
    }
    return {
      tool: calls[i].tool,
      success: false,
      error: res.reason?.message || 'Execution error'
    };
  });

  const successful = results.filter(r => r.success).length;

  return {
    batchSize: calls.length,
    successful,
    failed: calls.length - successful,
    results
  };
}
```

### Best Practices
1. **Parallel Execution for Independent Tools**: Never execute read-only inspection tools sequentially; always dispatch via `executeParallelBatch`.
2. **Model Availability Fallback Resilience**: When running parallel tool calling loops, ensure model router fallbacks (Gemini 4 -> Gemini 3.8 Flash, Claude Opus 5.5 -> Claude Opus 4.6) preserve tool calling schemas without schema loss.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec parallel-tool-orchestrator <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Eksekusi Multi-Agen & Swarm**: `multi-agent-orchestration`, `speculative-multi-draft-synthesizer`
- **Protokol MCP & Tools**: `mcp-server-architect`, `mcp-sampling-critic`, `doku-mcp-server`
- **Antrean Asinkron & Saga**: `async-queue-temporal-expert`, `event-driven-architect`, `cron-scheduler-expert`
- **Performa & Latensi**: `performance-web-vitals`, `context-window-engineer`, `llm-finops-router`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan produksi untuk mengoptimalkan throughput eksekusi tool agen AI dengan menjalankan pemanggilan tool independen secara bersamaan (paralel). Model frontier modern (Gemini 4 [fallback: Gemini 3.8 Flash], Claude Opus 5.5 [fallback: Claude Opus 4.6], GPT-5.6 Sol, Grok 4.7) dapat menghasilkan beberapa tool call dalam satu giliran. Menjalankan panggilan secara berurutan menghasilkan latensi jaringan yang lambat. Skill ini menyediakan arsitektur orkestrasi tool paralel memanfaatkan batching Model Context Protocol (`vibes_batch`), eksekusi tangguh `Promise.allSettled`, resolusi DAG dependensi, dan penanganan kegagalan isolatif.

### Kondisi Pemicu
- Merancang agen AI yang memanggil beberapa tool analisis sekaligus dalam satu turn.
- Menjalankan topologi swarm Fan-Out / Fan-In dengan banyak pekerja konkuren.
- Mengurangi latensi pada workflow agentic yang kompleks.
- Mencegah kegagalan parsial tool menggugurkan keseluruhan sesi percakapan agen.

---

### Implementasi Dispatcher Paralel yang Tangguh (TypeScript)

```typescript
export interface PanggilanTool {
  tool: string;
  arguments: Record<string, any>;
}

export interface HasilBatch<T = any> {
  totalPanggilan: number;
  sukses: number;
  gagal: number;
  rincian: Array<{
    tool: string;
    berhasil: boolean;
    data?: T;
    pesanError?: string;
  }>;
}

export async function eksekusiBatchParalel(
  daftarPanggilan: PanggilanTool[],
  eksekutor: (panggilan: PanggilanTool) => Promise<any>
): Promise<HasilBatch> {
  if (!Array.isArray(daftarPanggilan) || daftarPanggilan.length === 0) {
    throw new Error('Daftar panggilan tool tidak boleh kosong.');
  }

  // Eksekusi seluruh tool call secara bersamaan
  const eksekusi = await Promise.allSettled(
    daftarPanggilan.map(async (p) => {
      const data = await eksekutor(p);
      return { tool: p.tool, berhasil: true, data };
    })
  );

  const rincian = eksekusi.map((res, i) => {
    if (res.status === 'fulfilled') {
      return res.value;
    }
    return {
      tool: daftarPanggilan[i].tool,
      berhasil: false,
      pesanError: res.reason?.message || 'Galat eksekusi tool'
    };
  });

  const sukses = rincian.filter((r) => r.berhasil).length;

  return {
    totalPanggilan: daftarPanggilan.length,
    sukses,
    gagal: daftarPanggilan.length - sukses,
    rincian
  };
}
```

### Praktik Terbaik
1. **Eksekusi Paralel untuk Tool Independen**: Jangan jalankan tool inspeksi baca secara berurutan; gunakan `eksekusiBatchParalel`.
2. **Ketahanan Fallback Ketersediaan Model**: Saat mengeksekusi loop pemanggilan tool paralel, pastikan fallback model (Gemini 4 -> Gemini 3.8 Flash, Claude Opus 5.5 -> Claude Opus 4.6) mempertahankan skema pemanggilan tool secara utuh tanpa kehilangan kontrak parameter.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec parallel-tool-orchestrator <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
