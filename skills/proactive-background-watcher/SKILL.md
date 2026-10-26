---
name: proactive-background-watcher
description: "Proactive background task scheduling, API polling, and log monitoring / Penjadwalan background task proaktif dan pemantauan sistem."
author: "Roedy Rustam"
version: "4.4.2"
---

# Proactive Background Watcher (Sentinel Daemon Protocol)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream & Task Lifecycle**: `zero-to-prod-orchestrator` (Phase 7-8 lifecycle), `session-memory-manager` (checkpoint sentinel state), `brainstorming`.
- **Background Cron & Execution**: `cron-scheduler-expert` (app-level cron vs agent-native schedule tool), `parallel-tool-orchestrator` (concurrent polling jobs).
- **Incident Escalation & Self-Healing**: `self-healing-cloud-orchestrator` (auto-patch upon anomaly detection), `logging-error-tracking-expert` (Sentry/Pino trace alerts).
- **Build & CI/CD Watchers**: `ci-cd-devops-architect` (pipeline completion checks), `cloud-hosting-expert` (Vercel/Railway build state).

### Description
Standard LLM chat sessions are strictly reactive—they remain dormant until the user submits a prompt. This skill unlocks proactive agency. Utilizing the runtime's native `schedule` tool (one-shot timers and recurring cron schedules), the agent can autonomously monitor background build pipelines, poll health endpoints, inspect server logs, or track deployment state machines. When an anomaly occurs or a long-running job finishes, the agent wakes up autonomously to diagnose, notify, or remediate without waiting for human prompting.

### 1. Proactive Watcher Mode Selection Matrix

| Watcher Mode | `schedule` Parameter | Cancellation Trigger | Best Use Case |
| :--- | :--- | :--- | :--- |
| **Task Completion Watchdog** | `DurationSeconds: 180` + `TimerCondition: "<taskId>"` | Cancels early the instant the background task finishes | Long DB migrations, Docker builds, E2E test suites |
| **Bounded Canary Poll** | `CronExpression: "*/5 * * * *"` + `MaxIterations: 6` | Stops automatically after 30 minutes (6 checks) | Post-deploy canary error-rate observation |
| **Standing Sentinel Daemon** | `CronExpression: "*/15 * * * *"` + `IsDaemon: true` | Runs across turns until explicitly killed via `manage_task` | Continuous SSL, queue depth, or API SLO monitoring |

### 2. Production Tool Invocation Payloads

#### Pattern A: One-Shot Asynchronous Task Watcher
```json
{
  "DurationSeconds": 180,
  "Prompt": "Audit background migration task-42. Verify exit code and schema integrity.",
  "TimerCondition": "task-42"
}
```

#### Pattern B: Recurring Canary Health Daemon (Cron Mode)
```json
{
  "CronExpression": "*/10 * * * *",
  "MaxIterations": 6,
  "IsDaemon": true,
  "Prompt": "Poll /api/health and report error budget violations > 0.5% in HEALTH_LOG.md"
}
```

### 3. Deterministic Health Probe & SLO Evaluator (TypeScript)
When awakened by a scheduled cron trigger, run a deterministic probe script that exits with a non-zero code only when an SLO threshold is breached:

```typescript
// src/sentinel/slo-health-probe.ts
export interface HealthProbeResult {
  healthy: boolean;
  statusCode: number;
  latencyMs: number;
  errorRatePct: number;
  breachReason?: string;
}

export async function evaluateEndpointSlo(params: {
  url: string;
  maxLatencyMs: number;
  maxErrorRatePct: number;
  timeoutMs?: number;
}): Promise<HealthProbeResult> {
  const start = performance.now();
  const response = await fetch(params.url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(params.timeoutMs ?? 5000),
  });
  const latencyMs = Math.round(performance.now() - start);

  if (!response.ok) {
    return {
      healthy: false,
      statusCode: response.status,
      latencyMs,
      errorRatePct: 100,
      breachReason: `HTTP ${response.status} returned from ${params.url}`,
    };
  }

  const body = (await response.json()) as { errorRatePct?: number };
  const errorRatePct = Number(body.errorRatePct ?? 0);

  if (latencyMs > params.maxLatencyMs) {
    return {
      healthy: false,
      statusCode: response.status,
      latencyMs,
      errorRatePct,
      breachReason: `Latency ${latencyMs}ms exceeded budget ${params.maxLatencyMs}ms`,
    };
  }

  if (errorRatePct > params.maxErrorRatePct) {
    return {
      healthy: false,
      statusCode: response.status,
      latencyMs,
      errorRatePct,
      breachReason: `Error rate ${errorRatePct}% exceeded budget ${params.maxErrorRatePct}%`,
    };
  }

  return { healthy: true, statusCode: response.status, latencyMs, errorRatePct };
}
```

### 4. Production Verification Checklist
- [ ] **Zero-Spam Silent Success**: If a periodic poll detects normal operation, do not spam the user with empty status messages; log quietly or wait until an anomaly or milestone occurs.
- [ ] **Never Use Shell `sleep`**: Always use the native `schedule` tool instead of blocking a shell process with `sleep` or `Start-Sleep`.
- [ ] **KV-Cache Prefix Preservation**: Keep the recurring `Prompt` string byte-identical across iterations to maximize prompt cache hits.
- [ ] **Lifecycle Cleanup**: Once a watched task or canary window completes, cancel lingering schedules via `manage_task` (`Action: "kill"`).

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec proactive-background-watcher <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Hulu & Siklus Hidup Tugas**: `zero-to-prod-orchestrator` (Siklus Fase 7-8), `session-memory-manager` (checkpoint status sentinel), `brainstorming`.
- **Cron Latar Belakang & Eksekusi**: `cron-scheduler-expert` (cron aplikasi vs tool schedule native agen), `parallel-tool-orchestrator` (job polling konkuren).
- **Eskalasi Insiden & Self-Healing**: `self-healing-cloud-orchestrator` (patch otomatis saat anomali), `logging-error-tracking-expert` (alert trace Sentry/Pino).
- **Pemantau Build & CI/CD**: `ci-cd-devops-architect` (pemeriksaan penyelesaian pipeline), `cloud-hosting-expert` (status build Vercel/Railway).

### Deskripsi
Skill ini memberikan kemampuan proaktif (Sentinel) kepada agen AI menggunakan tool `schedule` native (timer satu-kali atau cron berkala) untuk memantau build, memeriksa kesehatan endpoint API, atau mengawasi migrasi database di latar belakang dan bangun secara otonom saat terjadi anomali atau penyelesaian tugas.

### Checklist Verifikasi Produksi
- [ ] **Dilarang Spam (Zero-Spam)**: Jika pengecekan berkala mendapati sistem normal, tetaplah tenang dan hanya kirim laporan saat milestone selesai atau anomali terdeteksi.
- [ ] **Dilarang Menggunakan `sleep` di Shell**: Selalu gunakan tool `schedule` native dan akhiri giliran untuk menunggu notifikasi.
- [ ] **Pembersihan Jadwal (`manage_task`)**: Hentikan jadwal cron/timer yang sudah tidak diperlukan menggunakan `manage_task` (`Action: "kill"`).

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec proactive-background-watcher <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
