---
name: event-driven-architect
description: "Event-driven microservices, message queues, and event sourcing / Arsitektur event-driven, antrean pesan, dan event sourcing."
author: "Roedy Rustam"
version: "4.4.4"

---

# Event-Driven Architecture Expert (Transactional Outbox & Sagas 2026)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 4 - Distributed Backend & Messaging Architecture) to decouple asynchronous services.
- **Downstream Cooperating Skills**:
  - `domain-driven-design-expert` — Source domain events directly from Aggregate Roots and bounded contexts.
  - `async-queue-temporal-expert` — Extend BullMQ queues with durable Temporal distributed saga orchestration.
  - `database-orm-expert` — Maintain transactional outbox schema tables and atomic SQL transaction boundaries.
  - `logging-error-tracking-expert` — Correlate distributed trace IDs (`x-trace-id`) across async event workers.
  - `session-memory-manager` — Persist event topology contracts and message schema checkpoints.

### Description
Production architectural guide for Event-Driven Architecture (EDA), asynchronous messaging topologies, and distributed consistency. Covers transactional Outbox patterns (preventing dual-write anomalies), distributed Saga orchestrations with compensating transactions, consumer idempotency keys, Event Sourcing, and message brokers (BullMQ v5, Apache Kafka / Redpanda, RabbitMQ, and AWS SQS).

### Trigger Conditions
- Decomposing synchronous HTTP request chains between microservices to prevent cascading failures.
- Designing high-volume asynchronous background workers (video rendering, batch billing, analytics).
- Preventing dual-write failures (e.g., writing to PostgreSQL succeeds, but publishing to message broker fails).
- Coordinating multi-service distributed transactions (Saga choreography vs orchestration).

### The Transactional Outbox Pattern (PostgreSQL / TypeScript)
Guarantees at-least-once delivery without distributed dual-write race conditions:

```typescript
// src/services/outbox-publisher.ts
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import crypto from 'node:crypto';

export async function createOrderWithOutbox(orderData: { customerId: string; totalCents: number }) {
  return await db.transaction(async (tx) => {
    const orderId = crypto.randomUUID();

    // 1. Mutate business state
    await tx.execute(sql`
      INSERT INTO orders (id, customer_id, total_cents, status)
      VALUES (${orderId}, ${orderData.customerId}, ${orderData.totalCents}, 'PENDING')
    `);

    // 2. Insert event into outbox table in the SAME atomic transaction
    const eventPayload = JSON.stringify({
      orderId,
      customerId: orderData.customerId,
      totalCents: orderData.totalCents,
      timestamp: new Date().toISOString(),
    });

    await tx.execute(sql`
      INSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload, status)
      VALUES (gen_random_uuid(), 'Order', ${orderId}, 'ORDER_CREATED', ${eventPayload}::jsonb, 'PENDING')
    `);

    return { orderId };
  });
}
```

### Idempotent Consumer Pattern (BullMQ / Redis)
Ensures duplicate messages delivered by the broker do not cause duplicate charges:

```typescript
// src/workers/payment-consumer.ts
import { Worker, Job } from 'bullmq';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const paymentWorker = new Worker(
  'payment-processing',
  async (job: Job<{ orderId: string; totalCents: number }>) => {
    const { orderId, totalCents } = job.data;
    const idempotencyKey = `job-exec-${job.id}`;

    // Atomically claim the job execution
    const [claimed] = await db.execute(sql`
      INSERT INTO processed_jobs (idempotency_key, processed_at)
      VALUES (${idempotencyKey}, NOW())
      ON CONFLICT (idempotency_key) DO NOTHING
      RETURNING idempotency_key
    `);

    if (!claimed) {
      console.warn(`[PaymentWorker] Duplicate job detected: ${job.id}. Skipping.`);
      return { status: 'already_processed' };
    }

    // Execute real payment processing...
    console.log(`[PaymentWorker] Charging ${totalCents}¢ for order ${orderId}`);
    return { status: 'completed' };
  },
  { connection: { host: process.env.REDIS_HOST || 'localhost', port: 6379 } }
);
```

### Key Event-Driven Invariants
1. **Never Make Synchronous State Mutations Over HTTP**: Service A should not call Service B's `/mutate` endpoint synchronously. Publish an event and let Service B consume it asynchronously.
2. **Always Enforce Idempotency**: Network retries will cause message duplicates. Every consumer MUST check an `idempotency_key` or message UUID before executing side effects.
3. **Dead Letter Queues (DLQ)**: Failed jobs must be routed to a DLQ after 3-5 retries with exponential backoff to prevent poison pills from blocking the queue.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec event-driven-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 4 - Arsitektur Backend & Pengiriman Pesan Terdistribusi) untuk memisahkan ketergantungan layanan asinkron.
- **Skill Hilir & Kerja Sama**:
  - `domain-driven-design-expert` — Mengambil event domain langsung dari Aggregate Root dan bounded context.
  - `async-queue-temporal-expert` — Menyediakan alur workflow tahan banting untuk orkestrasi Saga terdistribusi Temporal.
  - `database-orm-expert` — Mengelola tabel skema transactional outbox dan batas transaksi SQL atomik.
  - `logging-error-tracking-expert` — Melacak `trace_id` yang melintasi berbagai worker layanan asinkron.
  - `session-memory-manager` — Menyimpan kontrak topologi event dan checkpoint skema pesan.

### Deskripsi
Panduan arsitektur produksi untuk Arsitektur Berbasis Peristiwa (*Event-Driven Architecture* / EDA), topologi pengiriman pesan asinkron, dan konsistensi data terdistribusi. Mencakup pola *Transactional Outbox* (mencegah anomali *dual-write* saat database sukses tetapi broker pesan gagal), orkestrasi Saga terdistribusi dengan transaksi kompensasi, idempotensi *consumer*, serta integrasi broker pesan (BullMQ v5, Apache Kafka, RabbitMQ, Redis).

### Kondisi Pemicu
- Menghilangkan rantai panggilan HTTP sinkron antar microservices yang rentan memicu kegagalan beruntun (*cascading failure*).
- Merancang pemrosesan latar belakang volume tinggi (pembuatan video, pemrosesan batch, analitik).
- Menjamin konsistensi data antara database relasional dengan antrean pesan.
- Mengelola transaksi multi-layanan menggunakan pola Saga.

### Pola Konsumen Idempoten di Sisi Pekerja

```typescript
// Memastikan pemrosesan tidak terulang meskipun broker mengirim pesan ganda
export async function handleOrderEvent(event: { id: string; payload: any }) {
  const isDuplicate = await redis.set(`event:${event.id}`, 'locked', 'EX', 86400, 'NX');
  if (!isDuplicate) {
    console.log(`Event ${event.id} sudah pernah diproses. Lewati.`);
    return;
  }

  // Jalankan logika bisnis aman
  await prosesKirimEmailNotifikasi(event.payload);
}
```

### 3 Hukum Utama Arsitektur Berbasis Event
1. **Pola Transactional Outbox**: Selalu simpan entitas bisnis dan event outbox dalam satu transaksi SQL yang sama. Jangan memanggil `kafka.send()` langsung di dalam kode kontroler.
2. **Wajib Idempoten**: Karena broker pesan menjamin pengiriman *at-least-once*, konsumen pesan wajib memeriksa apakah event telah diproses sebelumnya.
3. **Dead Letter Queue (DLQ)**: Jika pemrosesan gagal berulang kali (setelah 3-5 retry), pindahkan pesan ke DLQ agar tidak menyumbat antrean utama.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec event-driven-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
