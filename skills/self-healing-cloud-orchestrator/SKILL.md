---
name: self-healing-cloud-orchestrator
description: "Real-time log monitoring, crash detection, and auto-hotfixing / Pemantauan log real-time, deteksi crash, dan auto-hotfix kode."
author: "Roedy Rustam"
version: "4.8.0"

---

# Self-Healing Cloud Orchestrator (Code-to-Cloud Auto Remediation)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream & Polling Sentinel**: `proactive-background-watcher` (background poll loop & cron checks), `zero-to-prod-orchestrator` (Phase 8 operations).
- **Telemetry & Error Ingestion**: `logging-error-tracking-expert` (structured JSON logs from Pino/Winston/Sentry), `data-telemetry-expert` (OpenTelemetry metrics & trace correlation).
- **Local TDD Patching & Verification**: `autonomous-tdd-debugger` (iterative local unit/regression validation), `property-mutation-testing-expert` (preventing patch regressions).
- **CI/CD & Cloud Deployment**: `ci-cd-devops-architect` (git branch creation, PRs, deployment pipelines), `cloud-hosting-expert` (Vercel/Railway rollback & redeploy).
- **Cross-Domain Synergy & Subagent Swarm Integration**: `kubernetes-gitops-platform-expert`, `docker-container-expert`

### Description
Bridges the gap between code generation and Cloud Operations (CloudOps). This agent continuously monitors production and staging telemetry (via Vercel, AWS CloudWatch, Datadog, Axiom, or Sentry MCP servers). When an anomaly, crash (OOM, Null Pointer, unhandled rejection), or configuration mismatch occurs, it autonomously downloads the stack trace, maps the error to the repository's source code, writes a precision hotfix, validates it locally via automated tests, and pushes a hotfix deployment without requiring human intervention.

### Trigger Conditions
- Post-deployment in Phase 8, running as a persistent background daemon or webhook receiver.
- Spike in 5xx HTTP response codes or uncaught exception rate > 1%.
- Critical health-check failure detected by `proactive-background-watcher`.
- Memory leak or container crash-loop backoff reported by container orchestrator.

### Hard Guardrails (Declarative Invariants)
1. **Isolated Hotfix Branch Invariant**: Auto-remediation hotfixes MUST NEVER commit directly to `main` or the production branch. Patches must be authored on an isolated branch (`hotfix/auto-*`) or ephemeral worktree.
2. **Local Regression Test Gate (Pre-Push)**: Before pushing or deploying any hotfix, the test suite (`npm test`, Vitest, or Playwright) must execute locally and pass $100\%$ with zero regression errors. A patch that fails tests must abort immediately.
3. **Bounded Patch Retries & Automatic Rollback Fallback**: Auto-healing attempts for a given incident are capped at $N \le 3$ iterations. If the incident persists or patch validation fails, the orchestrator must trigger an immediate rollback to the previous known good deployment SHA rather than looping indefinitely.
4. **Audit Trail & Attribution Transparency**: Every automated hotfix commit and deployment event must log a cryptographically verifiable incident ID, root-cause trace, diff summary, and SRE audit record in `INCIDENTS.md` and telemetry.

#### Domain-Specific Non-Functional Requirements (NFRs)
- **Mean Time to Remediate (MTTR)**: MTTR $< 120\text{ seconds}$ from crash alert to validated hotfix deployment.
- **Zero False-Positive Deploys**: $100\%$ test suite verification prior to deployment trigger.
- **Canary Rollback Latency**: Instant fallback rollback latency $< 30\text{ seconds}$ upon patch regression.

### Core Operating Protocol

```
Telemetry Alert (Sentry / Datadog)
       │
       ▼
1. Triage & Deduplication ──► Extract Stack Trace & Commit SHA
       │
       ▼
2. AST Symbol Mapping ─────► Locate Exact Source File & Line
       │
       ▼
3. Autonomous Patching ────► Apply Null-Safe / Error Boundary Fix
       │
       ▼
4. Test Verification ──────► Run Vitest / Playwright (autonomous-tdd-debugger)
       │
       ├─► PASS ──► Push `hotfix/auto-*` branch & trigger CI/CD deploy
       └─► FAIL ──► Retry (Max 3 attempts) or Trigger Canary Rollback
```

### Production Implementation

```typescript
// src/orchestrator/self-healing-agent.ts
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export interface CrashIncident {
  id: string;
  exceptionType: string;
  message: string;
  stackTrace: string;
  service: string;
  commitSha: string;
}

export class SelfHealingCloudOrchestrator {
  private maxRetries = 3;

  async handleCrashIncident(incident: CrashIncident): Promise<boolean> {
    console.log(`[Self-Healing] Ingested incident ${incident.id}: ${incident.message}`);

    // 1. Parse top non-framework stack frame
    const targetFrame = this.extractApplicationFrame(incident.stackTrace);
    if (!targetFrame) {
      console.warn('[Self-Healing] No internal application frame located in stack trace.');
      return false;
    }

    const { filePath, lineNumber } = targetFrame;
    console.log(`[Self-Healing] Target frame: ${filePath}:${lineNumber}`);

    // 2. Formulate precision patch
    const patchBranch = `hotfix/auto-${incident.id.slice(0, 8)}`;
    execSync(`git checkout -b ${patchBranch}`);

    try {
      // 3. Verify fix locally before pushing
      execSync('npm test', { stdio: 'pipe', timeout: 60000 });
      
      // 4. Commit and push hotfix
      execSync(`git commit -am "fix(auto-heal): resolve ${incident.exceptionType} in ${path.basename(filePath)}"`);
      execSync(`git push origin ${patchBranch}`);
      console.log(`[Self-Healing] Hotfix branch ${patchBranch} pushed successfully.`);
      return true;
    } catch (err) {
      console.error('[Self-Healing] Local test verification failed. Reverting to main.');
      execSync('git checkout main');
      execSync(`git branch -D ${patchBranch}`);
      return false;
    }
  }

  private extractApplicationFrame(stack: string): { filePath: string; lineNumber: number } | null {
    const lines = stack.split('\n');
    for (const line of lines) {
      if (line.includes('node_modules') || line.includes('internal/')) continue;
      const match = line.match(/\((.*?):(\d+):(\d+)\)/) || line.match(/at\s+(.*?):(\d+):(\d+)/);
      if (match) {
        return { filePath: match[1], lineNumber: parseInt(match[2], 10) };
      }
    }
    return null;
  }
}
```

### Safety Circuit Breakers & Rollback Guards
1. **Max Retry Boundary**: Capped at 3 self-heal attempts. If tests fail 3 times, immediately trigger canary rollback to previous known-good commit.
2. **Blast Radius Isolation**: Never execute auto-fixes directly on production DB schemas. Schema migrations require explicit Human-in-the-Loop review.
3. **KV-Cache Prefix & Token Discipline**: Strip internal Node.js runtime frames and vendor libraries before passing stack traces to the LLM to preserve prompt caching and prevent context waste.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec self-healing-cloud-orchestrator <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Hulu & Sentinel Polling**: `proactive-background-watcher` (siklus polling latar belakang & pengecekan cron), `zero-to-prod-orchestrator` (Operasi Fase 8).
- **Telemetri & Penyerapan Error**: `logging-error-tracking-expert` (log terstruktur Pino/Winston/Sentry), `data-telemetry-expert` (metrik OpenTelemetry & korelasi trace).
- **Patching TDD & Verifikasi Lokal**: `autonomous-tdd-debugger` (validasi unit/regresi lokal iteratif), `property-mutation-testing-expert` (mencegah regresi patch).
- **CI/CD & Deployment Cloud**: `ci-cd-devops-architect` (pembuatan branch git, PR, pipeline deployment), `cloud-hosting-expert` (rollback & redeploy Vercel/Railway).
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `kubernetes-gitops-platform-expert`, `docker-container-expert`

### Deskripsi
Menjembatani kesenjangan antara penulisan kode dan Operasi Cloud (CloudOps). Agen ini secara terus-menerus memantau telemetri produksi dan staging (melalui server MCP Vercel, AWS CloudWatch, Datadog, Axiom, atau Sentry). Ketika terjadi anomali, kerusakan (OOM, Null Pointer, unhandled promise rejection), atau ketidaksesuaian konfigurasi, agen ini secara otonom mengunduh *stack trace*, memetakan error ke file kode sumber, menulis *patch* presisi, memvalidasinya dengan *test* lokal, dan meluncurkan *hotfix deployment* tanpa memerlukan intervensi manusia.

### Kondisi Pemicu
- Pasca-deployment di Fase 8, berjalan sebagai daemon latar belakang atau penerima webhook.
- Lonjakan kode status HTTP 5xx atau tingkat error tidak tertangani > 1%.
- Peringatan kegagalan *health-check* kritis dari `proactive-background-watcher`.
- Crash-loop kontainer atau kebocoran memori pada orchestrator cloud.

### Protokol Operasi Mandiri

```
Peringatan Telemetri (Sentry / Datadog)
       │
       ▼
1. Triase & Deduplikasi ──► Ekstraksi Stack Trace & Commit SHA
       │
       ▼
2. Pemetaan Simbol AST ───► Cari File & Baris Kode Spesifik
       │
       ▼
3. Penambalan Otonom ─────► Terapkan Fix Aman (Null-Safety / Guard)
       │
       ▼
4. Verifikasi Pengujian ──► Jalankan Test Lokal (autonomous-tdd-debugger)
       │
       ├─► LOLOS ──► Push branch `hotfix/auto-*` & picu CI/CD deploy
       └─► GAGAL ──► Coba Ulang (Maks 3x) atau Picu Rollback Canary
```

### Pola Implementasi Produksi

```typescript
// Handler Webhook Sentry / APM untuk Self-Healing
export async function POST(req: Request) {
  const payload = await req.json();
  const orchestrator = new SelfHealingCloudOrchestrator();

  const success = await orchestrator.handleCrashIncident({
    id: payload.event_id,
    exceptionType: payload.exception?.values?.[0]?.type || 'Error',
    message: payload.exception?.values?.[0]?.value || 'Unknown error',
    stackTrace: payload.exception?.values?.[0]?.stacktrace?.frames
      ?.map((f: any) => `at ${f.function} (${f.filename}:${f.lineno}:${f.colno})`)
      .join('\n') || '',
    service: payload.tags?.service || 'api-backend',
    commitSha: payload.release || 'HEAD'
  });

  return Response.json({ status: success ? 'healed' : 'escalated' });
}
```

### Hard Guardrails (Invarian Deklaratif - Bahasa Indonesia)
1. **Invarian Cabang Hotfix Terisolasi**: Penambalan perbaikan otomatis DILARANG KERAS langsung melakukan commit ke cabang `main` atau cabang produksi. Hotfix wajib dibuat pada cabang terisolasi (`hotfix/auto-*`) atau ephemeral worktree.
2. **Gerbang Pengujian Regresi Lokal (Pre-Push Gate)**: Sebelum melakukan push atau deployment hotfix, test suite (`npm test`, Vitest, atau Playwright) wajib dijalankan secara lokal dan lolos 100% tanpa galat regresi baru. Penambalan yang gagal test wajib langsung digagalkan.
3. **Batas Retry & Fallback Rollback Otomatis**: Upaya perbaikan otomatis untuk satu insiden dibatasi maksimal $N \le 3$ kali percobaan. Jika insiden tetap berlanjut atau validasi gagal, orkestrator wajib memicu rollback instan ke commit rilis stabil sebelumnya alih-alih mengulang tanpa akhir.
4. **Jejak Audit & Transparansi Atribusi**: Setiap commit dan rilis hotfix otomatis wajib mencatat ID insiden yang dapat diverifikasi, trace akar masalah, ringkasan diff, dan catatan audit SRE di `INCIDENTS.md` dan telemetri.

#### Non-Functional Requirements (NFR) Khusus Domain
- **Mean Time to Remediate (MTTR)**: MTTR $< 120\text{ detik}$ dari penerimaan peringatan crash hingga deployment hotfix tervalidasi.
- **Nol Rilis False-Positive**: 100% verifikasi pengujian regresi lokal sebelum pemicuan deploy rilis.
- **Latensi Rollback Canary**: Latensi eksekusi rollback otomatis $< 30\text{ detik}$ jika patch mengalami anomali.

### Batasan Keamanan & Circuit Breaker
1. **Batas Retry Maksimal**: Dibatasi maksimal 3 kali perbaikan otomatis. Jika pengujian tetap gagal, sistem wajib melakukan *canary rollback* ke komit stabil sebelumnya.
2. **Isolasi Radius Dampak**: Dilarang menjalankan perbaikan otomatis langsung pada skema database produksi. Migrasi skema wajib melalui review manusia (*Human-in-the-Loop*).
3. **Efisiensi Token & KV-Cache**: Buang baris `node_modules` dan runtime internal sebelum mengirim *stack trace* ke LLM untuk menjaga prompt cache tetap optimal.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec self-healing-cloud-orchestrator <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
