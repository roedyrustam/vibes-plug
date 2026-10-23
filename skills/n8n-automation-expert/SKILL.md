---
name: n8n-automation-expert
description: "Expert guide for workflow automation (n8n, Zapier, Make), custom nodes, webhook triggers, and AI-powered automation chains / Panduan ahli otomasi workflow (n8n, Zapier, Make), custom nodes, webhook triggers, dan rantai otomasi berbasis AI."
author: "Roedy Rustam"
version: "4.4.2"
---

# Workflow Automation & n8n AI Orchestration Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Triggers & Schedules**: `cron-scheduler-expert`, `async-queue-temporal-expert`, `event-driven-architect`
- **AI Agent & LLM Nodes**: `ai-llm-integration-expert`, `mcp-server-architect`, `chatbot-messaging-expert`, `durable-agent-execution-expert`
- **Communications & Billing**: `email-notification-expert`, `payment-gateway-expert`, `doku-payment-gateway`
- **Security & Secrets**: `zero-trust-secret-vault`, `rate-limit-abuse-prevention`, `anti-slop`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production engineering guide for self-hosted workflow automation using n8n (v1.70+), Zapier, and Make. Covers fault-tolerant automation pipelines, declarative/programmatic custom TypeScript nodes, webhook triggers with timing-safe HMAC SHA-256 signature verification, AI Agent nodes integrating Model Context Protocol (MCP) tools, dead-letter error workflows, and horizontal scaling via n8n Queue Mode (Redis + BullMQ + Postgres).

### 1. Automation Architecture Decision Matrix

| Workload Pattern | Recommended Engine | Execution Mode | Why? |
| :--- | :--- | :--- | :--- |
| **Multi-SaaS Webhook & CRM Sync (< 50k runs/day)** | **n8n Self-Hosted (Queue Mode)** | Redis BullMQ Workers + Postgres | Visual inspection, 400+ integrations, zero per-step SaaS tax |
| **AI Agent + MCP Tool Chaining with Human Approval** | **n8n AI Agent Node + Wait-for-Webhook** | Persisted execution state in Postgres | Suspends execution for days without holding worker CPU/memory |
| **Core Financial Ledger or Sub-10ms API Path** | **Native TypeScript / Temporal (`async-queue-temporal-expert`)** | Compiled microservice + DB Transaction | Strict compile-time type safety and ACID database isolation |

### 2. Production n8n Webhook HMAC Signature & Idempotency Guard (Code Node)

```typescript
// n8n Code Node (JavaScript/TypeScript runtime)
// Validates incoming HMAC-SHA256 signature and extracts idempotency key before downstream execution
import crypto from 'node:crypto';

const items = $input.all();
const rawBody = $json.rawBody ?? JSON.stringify($json.body ?? {});
const signatureHeader = String(
  $json.headers?.['x-signature'] ?? $json.headers?.['x-hub-signature-256'] ?? ''
);
const eventId = String($json.headers?.['x-request-id'] ?? $json.body?.id ?? '');
const secretKey = $env.WEBHOOK_HMAC_SECRET;

if (!signatureHeader || !secretKey || !eventId) {
  throw new Error('[n8n-Security] Missing signature header, event ID, or HMAC secret.');
}

const computedSignature = crypto
  .createHmac('sha256', secretKey)
  .update(rawBody, 'utf8')
  .digest('hex');

const normalizedHeader = signatureHeader.replace(/^sha256=/i, '');
const expectedBuf = Buffer.from(computedSignature, 'utf8');
const receivedBuf = Buffer.from(normalizedHeader, 'utf8');

if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
  throw new Error('[n8n-Security] Invalid HMAC signature. Unauthorized webhook invocation.');
}

return items.map((item) => ({
  json: {
    ...item.json,
    idempotencyKey: `n8n:webhook:${eventId}`,
    verified: true,
    verifiedAt: new Date().toISOString(),
  },
}));
```

### 3. Self-Hosted n8n Queue Mode Topology (Docker Compose Production)

```yaml
# docker-compose.n8n.yml
services:
  n8n-main:
    image: n8nio/n8n:1.72.1
    restart: unless-stopped
    environment:
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS=true
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
    ports:
      - "5678:5678"

  n8n-worker:
    image: n8nio/n8n:1.72.1
    restart: unless-stopped
    command: worker --concurrency=10
    environment:
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
    deploy:
      replicas: 2
```

### 4. Production Verification Checklist
- [ ] `N8N_ENCRYPTION_KEY` is explicitly set and backed up in `zero-trust-secret-vault` across all main and worker instances.
- [ ] `EXECUTIONS_MODE=queue` with Redis + PostgreSQL is enabled (never run SQLite in production).
- [ ] `EXECUTIONS_DATA_PRUNE=true` is configured to prevent `execution_entity` table bloat.
- [ ] Every critical workflow defines a dedicated `Error Workflow` (`Error Trigger` node) that alerts on-call channels and logs the failed execution ID.
- [ ] Webhook endpoints validate HMAC signatures using `crypto.timingSafeEqual` and deduplicate retries by `idempotencyKey`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Pemicu & Penjadwalan Hulu**: `cron-scheduler-expert`, `async-queue-temporal-expert`, `event-driven-architect`
- **Node AI Agent & LLM**: `ai-llm-integration-expert`, `mcp-server-architect`, `chatbot-messaging-expert`, `durable-agent-execution-expert`
- **Komunikasi & Penagihan**: `email-notification-expert`, `payment-gateway-expert`, `doku-payment-gateway`
- **Keamanan & Rahasia**: `zero-trust-secret-vault`, `rate-limit-abuse-prevention`, `anti-slop`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan rekayasa produksi untuk otomatisasi alur kerja (*workflow automation*) menggunakan n8n (v1.70+ *self-hosted*), Zapier, dan Make. Mencakup pembuatan *custom node* berbasis TypeScript, validasi tanda tangan kriptografis HMAC pada pemicu webhook, node AI Agent yang terhubung ke tool MCP, serta penskalaan pemrosesan beban tinggi melalui mode antrean n8n (Redis + BullMQ + PostgreSQL).

### Checklist Verifikasi Produksi
- [ ] Tetapkan `N8N_ENCRYPTION_KEY` yang identik pada seluruh container utama dan worker.
- [ ] Aktifkan `EXECUTIONS_MODE=queue` dengan database PostgreSQL dan Redis (jangan gunakan SQLite di produksi).
- [ ] Aktifkan `EXECUTIONS_DATA_PRUNE=true` agar tabel riwayat eksekusi tidak memenuhi disk.
- [ ] Pasang `Error Trigger Workflow` pada setiap workflow produksi untuk menangkap kegagalan dan mengirim peringatan instan.
