---
name: data-telemetry-expert
description: "Observability, OpenTelemetry, metrics, and analytics (PostHog, Mixpanel) / Observabilitas, OpenTelemetry, metrik, dan analitik data."
author: "Roedy Rustam"
version: "4.4.2"

---

# Data & Telemetry Expert (OpenTelemetry 1.x / ClickHouse Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 7 - Monitoring & Production Telemetry) to define system observability architectures.
- **Downstream Cooperating Skills**:
  - `logging-error-tracking-expert` — Correlate OpenTelemetry traces with structured Pino logs and Sentry alerts.
  - `llm-observability-expert` — Extend trace contexts with GenAI token costs, prompt latencies, and evaluations.
  - `error-resilience-expert` — Feed real-time telemetry metrics into circuit breaker thresholds and automated failovers.
  - `feature-flag-analytics-expert` & `geospatial-maps-expert` — Correlate PostHog feature flag experiments, funnel analytics, and geospatial PostGIS/Mapbox user distribution telemetry.
  - `session-memory-manager` — Persist telemetry pipeline configurations and observability checkpoints.

### Description
Expert guide for production observability, product analytics, and data pipelines. Covers **OpenTelemetry 1.x** (stable, vendor-neutral traces/metrics/logs), **PostHog** (open-source product analytics), **ClickHouse** (OLAP analytics database), Grafana stack, and AI agent observability patterns.

### Trigger Conditions
- Adding distributed tracing to a microservice or Next.js application.
- Setting up structured logging and metrics collection.
- Implementing product analytics (funnel analysis, feature flags, session replay).
- Building a high-performance analytics pipeline with ClickHouse.
- Monitoring AI agent runs, LLM token costs, and response quality.

### OpenTelemetry 1.x — Vendor-Neutral Observability

OpenTelemetry (OTel) is the CNCF standard for generating traces, metrics, and logs from any application.

#### Three Pillars of OTel

| Signal | What It Captures | Example |
|---|---|---|
| **Traces** | Request flow across services | `GET /api/users` → DB query → cache |
| **Metrics** | Numeric measurements over time | `http_requests_total`, `db_query_duration` |
| **Logs** | Structured event records | `{"level":"error","msg":"DB timeout"}` |

#### Next.js 15 + OTel Instrumentation
```typescript
// instrumentation.ts (Next.js built-in OTel support)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const { OTLPMetricExporter } = await import('@opentelemetry/exporter-metrics-otlp-http');
    const { PeriodicExportingMetricReader } = await import('@opentelemetry/sdk-metrics');
    const { Resource } = await import('@opentelemetry/resources');
    const { SEMRESATTRS_SERVICE_NAME } = await import('@opentelemetry/semantic-conventions');

    const sdk = new NodeSDK({
      resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: 'my-saas-app',
      }),
      traceExporter: new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      }),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
        exportIntervalMillis: 30_000,
      }),
    });

    sdk.start();
  }
}
```

#### Custom Spans for Business Logic
```typescript
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('my-service', '1.0.0');

async function processOrder(orderId: string) {
  return tracer.startActiveSpan('processOrder', async (span) => {
    span.setAttribute('order.id', orderId);
    span.setAttribute('order.source', 'api');
    
    try {
      const order = await db.order.findUnique({ where: { id: orderId } });
      span.setAttribute('order.amount', order.amount);
      
      const result = await chargeCustomer(order);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### ClickHouse — High-Performance Analytics Database
ClickHouse is the 2026 standard for analytical workloads — ingests billions of events and queries them in milliseconds:

```sql
-- Create an events table optimized for time-series analytics
CREATE TABLE events (
    event_id     UUID DEFAULT generateUUIDv4(),
    workspace_id String,
    user_id      String,
    event_name   LowCardinality(String),
    properties   JSON,
    timestamp    DateTime64(3, 'UTC'),
    date         Date DEFAULT toDate(timestamp)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (workspace_id, event_name, timestamp)
TTL date + INTERVAL 1 YEAR;

-- Query: Funnel analysis — users who signed up then upgraded
SELECT
    countIf(event_name = 'signup') AS signups,
    countIf(event_name = 'plan_upgraded') AS upgrades,
    round(countIf(event_name = 'plan_upgraded') / countIf(event_name = 'signup') * 100, 2) AS conversion_rate
FROM events
WHERE workspace_id = 'ws_abc'
  AND timestamp >= now() - INTERVAL 30 DAY;
```

```typescript
// Node.js ClickHouse client
import { createClient } from '@clickhouse/client';

const client = createClient({ url: process.env.CLICKHOUSE_URL });

await client.insert({
  table: 'events',
  values: [{
    workspace_id: 'ws_abc',
    user_id: 'user_123',
    event_name: 'page_view',
    properties: { path: '/dashboard', referrer: 'google.com' },
    timestamp: new Date().toISOString(),
  }],
  format: 'JSONEachRow',
});
```

### PostHog — Open-Source Product Analytics
```typescript
// Next.js + PostHog (client-side)
import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
  capture_pageview: false, // Manual with App Router
});

// Track custom events
posthog.capture('feature_used', {
  feature: 'ai_assistant',
  plan: user.plan,
  workspace_id: workspace.id,
});

// Feature flags
if (posthog.isFeatureEnabled('new-dashboard')) {
  return <NewDashboard />;
}
```

### AI Agent Observability
Track LLM costs, latency, and quality for production AI applications:
```typescript
// Custom OTel attributes for LLM calls
span.setAttribute('llm.model', 'claude-4-sonnet');
span.setAttribute('llm.input_tokens', response.usage.input_tokens);
span.setAttribute('llm.output_tokens', response.usage.output_tokens);
span.setAttribute('llm.cost_usd', calculateCost(response.usage));
span.setAttribute('llm.latency_ms', Date.now() - startTime);
span.setAttribute('llm.cached', response.usage.cache_read_input_tokens > 0);
```

Backend tracing tools for LLM: **LangSmith** (LangChain/LangGraph), **OpenAI Tracing** (Agents SDK), **Langfuse** (open-source, any LLM).

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec data-telemetry-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 7 - Pemantauan & Telemetri Produksi) untuk merancang arsitektur observabilitas sistem.
- **Skill Hilir & Kerja Sama**:
  - `logging-error-tracking-expert` — Mengorelasikan trace OpenTelemetry dengan log terstruktur Pino dan alert Sentry.
  - `llm-observability-expert` — Memperluas konteks trace dengan metrik GenAI, latensi prompt, dan evaluasi.
  - `error-resilience-expert` — Menyalurkan metrik telemetri ke threshold circuit breaker dan failover otomatis.
  - `session-memory-manager` — Menyimpan konfigurasi pipeline telemetri dan checkpoint observabilitas.

### Deskripsi
Panduan ahli untuk observabilitas produksi, analitik produk, dan pipeline data. Mencakup **OpenTelemetry 1.x** (standar traces, metrics, logs netral vendor), **PostHog** (analitik produk open-source), **ClickHouse** (database analitik OLAP berkecepatan tinggi), Grafana stack, dan pola pemantauan agen AI.

### Kondisi Pemicu
- Menambahkan distributed tracing ke microservice atau aplikasi Next.js.
- Menyiapkan structured logging dan pengumpulan metrik performa.
- Mengimplementasikan analitik produk (funnel, feature flag, session replay).
- Membangun pipeline analitik berkecepatan tinggi menggunakan ClickHouse.

---

### Tiga Pilar OpenTelemetry (Traces, Metrics, Logs)

| Sinyal | Definisi | Contoh Kasus |
|---|---|---|
| **Traces** | Alur request di berbagai microservice | `GET /api/pesanan` → query DB → redis cache |
| **Metrics** | Pengukuran numerik sepanjang waktu | `http_requests_total`, durasi query DB |
| **Logs** | Catatan kejadian terstruktur | `{"level":"error","pesan":"Koneksi DB timeout"}` |

---

### Implementasi Pola Kunci (TypeScript)

#### 1. Instrumentasi OpenTelemetry di Next.js 15
```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const { OTLPMetricExporter } = await import('@opentelemetry/exporter-metrics-otlp-http');
    const { PeriodicExportingMetricReader } = await import('@opentelemetry/sdk-metrics');
    const { Resource } = await import('@opentelemetry/resources');
    const { SEMRESATTRS_SERVICE_NAME } = await import('@opentelemetry/semantic-conventions');

    const sdk = new NodeSDK({
      resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: 'saas-produksi-app',
      }),
      traceExporter: new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      }),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
        exportIntervalMillis: 30_000,
      }),
    });

    sdk.start();
  }
}
```

#### 2. Klien ClickHouse untuk Ingestion Event Skala Masif
```typescript
import { createClient } from '@clickhouse/client';

const clickhouse = createClient({ url: process.env.CLICKHOUSE_URL });

export async function rekamEventTelemetri(namaEvent: string, dataProperti: Record<string, unknown>) {
  await clickhouse.insert({
    table: 'events',
    values: [{
      event_name: namaEvent,
      properties: dataProperti,
      timestamp: new Date().toISOString(),
    }],
    format: 'JSONEachRow',
  });
}
```

#### 3. Pelacakan Event PostHog di Sisi Klien
```typescript
import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
  capture_pageview: false,
});

export function lacakAktivitasPengguna(namaFitur: string) {
  posthog.capture('fitur_digunakan', { fitur: namaFitur, timestamp: new Date().toISOString() });
}
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec data-telemetry-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
