---
name: data-telemetry-expert
description: "Expert guide for observability, analytics, telemetry, and data pipelines (OpenTelemetry, PostHog, Mixpanel) / Panduan ahli untuk observabilitas, telemetri, dan analitik."
author: "Roedy Rustam"
---

# Data & Telemetry Expert (OpenTelemetry 1.x / ClickHouse Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

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

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk observabilitas produksi, analitik produk, dan pipeline data. Mencakup **OpenTelemetry 1.x** (stabil, vendor-neutral traces/metrics/logs), **PostHog** (analitik produk open-source), **ClickHouse** (database analitik OLAP), dan pola observabilitas agen AI.

### Kondisi Pemicu
- Menambahkan distributed tracing ke microservice atau aplikasi Next.js.
- Menyiapkan structured logging dan pengumpulan metrik.
- Mengimplementasikan analitik produk (analisis funnel, feature flags, session replay).
- Membangun pipeline analitik berkinerja tinggi dengan ClickHouse.
- Memantau run agen AI, biaya token LLM, dan kualitas respons.

### OpenTelemetry 1.x — Observabilitas Vendor-Neutral

Tiga pilar OTel:
- **Traces**: Aliran permintaan antar layanan.
- **Metrics**: Pengukuran numerik dari waktu ke waktu.
- **Logs**: Catatan peristiwa terstruktur.

Integrasikan dengan Next.js 15 melalui file `instrumentation.ts` bawaan — OTel SDK otomatis mendistribusikan trace ke backend pilihan (Grafana Tempo, Jaeger, Honeycomb, Datadog, dll.).

### ClickHouse — Database Analitik Berkinerja Tinggi
ClickHouse adalah standar 2026 untuk workload analitik — menyerap miliaran event dan melakukan query dalam milidetik. Gunakan engine `MergeTree` dengan partisi per bulan dan pengurutan berdasarkan kolom yang sering di-filter.

### PostHog — Analitik Produk Open-Source
PostHog menyediakan analisis funnel, feature flags, session replay, dan A/B testing dalam satu platform yang dapat di-self-host. Integrasikan dengan Next.js App Router menggunakan `posthog-js`.

### Observabilitas Agen AI
Lacak biaya LLM, latensi, dan kualitas untuk aplikasi AI produksi menggunakan custom OTel attributes. Gunakan LangSmith, OpenAI Tracing, atau Langfuse (open-source) sebagai backend tracing LLM.
