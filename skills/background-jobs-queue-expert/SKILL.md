---
name: background-jobs-queue-expert
description: "Dedicated deep-dive for BullMQ v5, Trigger.dev v3, Inngest, delayed jobs, job deduplication, idempotency, dead letter queues, and job priority / Panduan mendalam untuk BullMQ v5, Trigger.dev v3, Inngest, delayed jobs, deduplikasi job, idempotency, dead letter queue, dan prioritas job."
author: "Roedy Rustam"
---

# Background Jobs & Queue Expert (BullMQ v5 & Resilient Queues)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Production-grade engineering guide for background job queues and asynchronous task processing using **BullMQ v5**, **Trigger.dev v3**, and **Inngest**. Focuses on the core mechanics of fault-tolerant distributed queues: job deduplication, multi-tenant priority queues, exponential backoff jitter, Dead Letter Queue (DLQ) automated forwarding, and strict transactional idempotency.

### Key Capabilities
1. **Strict Idempotency**: Ensuring background workers execute with deterministic effects using database-backed idempotency keys.
2. **Job Deduplication**: Leveraging deterministic BullMQ `jobId` hashing to prevent duplicate enqueueing of ongoing or delayed tasks.
3. **Dead Letter Queues (DLQ)**: Automatic relocation of permanently failing jobs after retry exhaustion for manual inspection and alerting.
4. **Tenant Prioritization**: Differentiating throughput between VIP/enterprise tiers and free-tier users using BullMQ job priorities.
5. **Backoff Jitter & Throttling**: Exponential backoff combined with randomized full jitter to prevent upstream thundering herds.

---

### Production Implementation Recipes

#### Recipe 1: Production BullMQ v5 Worker with Deduplication & DLQ Forwarding (TypeScript)
```typescript
import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // Required by BullMQ
});

export interface NotificationPayload {
  tenantId: string;
  userId: string;
  type: 'email' | 'webhook';
  payload: Record<string, unknown>;
  idempotencyKey: string;
}

// Main Queue
export const notificationQueue = new Queue<NotificationPayload>('notifications', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1500, // Starts at 1.5s, doubles up to ~24s with jitter
    },
    removeOnComplete: { age: 86400, count: 5000 },
    removeOnFail: false, // Preserved for DLQ audit
  },
});

// Dead Letter Queue (DLQ)
export const notificationDLQ = new Queue('notifications-dlq', {
  connection: redisConnection,
});

/**
 * Enqueues a notification job with strict deduplication and priority
 */
export async function enqueueNotification(
  data: NotificationPayload,
  isVip = false
) {
  return await notificationQueue.add('send_notification', data, {
    jobId: `notif_${data.idempotencyKey}`, // Deterministic deduplication key
    priority: isVip ? 1 : 10, // Lower numbers denote higher priority in BullMQ
  });
}

// Background Worker
export const notificationWorker = new Worker<NotificationPayload>(
  'notifications',
  async (job: Job<NotificationPayload>) => {
    console.log(`[Worker] Processing Job ${job.id} for Tenant: ${job.data.tenantId}`);
    
    // Simulate task processing with idempotency verification
    if (job.data.type === 'email') {
      await deliverEmail(job.data);
    }
  },
  {
    connection: redisConnection,
    concurrency: 20, // Max concurrent jobs per worker process
    limiter: {
      max: 100, // Maximum 100 jobs processed
      duration: 1000, // Per 1000ms (Rate Limiting)
    },
  }
);

// Forward to DLQ upon exhaustion of retry attempts
notificationWorker.on('failed', async (job, error) => {
  if (job && job.attemptsMade >= (job.opts.attempts || 5)) {
    console.error(`[DLQ] Job ${job.id} exhausted retries. Forwarding to notifications-dlq:`, error.message);
    await notificationDLQ.add('failed_notification', {
      originalJobId: job.id,
      failedReason: error.message,
      data: job.data,
      exhaustedAt: new Date().toISOString(),
    });
  }
});
```

---

### Implementation Checklist
- [ ] Configure `maxRetriesPerRequest: null` on the Redis client as required by BullMQ v5.
- [ ] Use deterministic `jobId` derived from business logic (`order_${orderId}`) to enforce deduplication.
- [ ] Add event listener on `failed` to automatically forward permanently dead jobs to a Dead Letter Queue.
- [ ] Implement rate limiting using worker `limiter` to protect third-party services against rate-limit bans.

## Orchestration & Integration
- Integrates with: `js-backend-expert`, `async-queue-temporal-expert`, `error-resilience-expert`, `data-telemetry-expert`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Tujuan & Gambaran Umum
Panduan rekayasa tingkat produksi untuk antrean pekerjaan latar belakang (*background job queues*) dan pemrosesan tugas asinkron menggunakan **BullMQ v5**, **Trigger.dev v3**, dan **Inngest**. Berfokus pada mekanika inti antrean terdistribusi yang tangguh: deduplikasi job, prioritas multi-tenant, *exponential backoff jitter*, pemindahan otomatis ke Dead Letter Queue (DLQ), dan idempotensi transaksi yang ketat.

### Kemampuan Utama
1. **Idempotensi Ketat**: Memastikan pekerja (*worker*) mengeksekusi tugas dengan dampak deterministik menggunakan kunci idempotensi yang tercatat di database.
2. **Deduplikasi Job**: Memanfaatkan penetapan `jobId` deterministik di BullMQ untuk mencegah antrean ganda pada tugas yang sedang berjalan atau tertunda.
3. **Dead Letter Queue (DLQ)**: Pemindahan otomatis tugas yang gagal total setelah jatah percobaan ulang habis untuk audit dan penanganan manual.
4. **Prioritas Tenant**: Membedakan prioritas tugas antara pengguna VIP/Enterprise dengan pengguna paket gratis menggunakan nilai prioritas BullMQ.
5. **Backoff Jitter & Throttling**: Mekanisme penundaan eksponensial dengan *jitter* acak untuk mencegah fenomena *thundering herd* pada server hilir.

---

### Resep Implementasi Produksi

#### Resep 1: Worker BullMQ v5 Produksi dengan Deduplikasi & Forward DLQ (TypeScript)
```typescript
import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';

const koneksiRedis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export interface MuatanNotifikasi {
  tenantId: string;
  userId: string;
  type: 'email' | 'webhook';
  payload: Record<string, unknown>;
  idempotencyKey: string;
}

// Antrean Utama
export const antreanNotifikasi = new Queue<MuatanNotifikasi>('notifikasi', {
  connection: koneksiRedis,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1500,
    },
    removeOnComplete: { age: 86400, count: 5000 },
    removeOnFail: false,
  },
});

// Antrean Dead Letter (DLQ)
export const antreanDLQ = new Queue('notifikasi-dlq', {
  connection: koneksiRedis,
});

/**
 * Memasukkan tugas ke antrean dengan deduplikasi dan prioritas
 */
export async function masukkanNotifikasi(
  data: MuatanNotifikasi,
  isVip = false
) {
  return await antreanNotifikasi.add('kirim_notifikasi', data, {
    jobId: `notif_${data.idempotencyKey}`, // Kunci deduplikasi unik
    priority: isVip ? 1 : 10, // Nilai lebih kecil menandakan prioritas lebih tinggi
  });
}

// Worker Pemroses
export const workerNotifikasi = new Worker<MuatanNotifikasi>(
  'notifikasi',
  async (job: Job<MuatanNotifikasi>) => {
    console.log(`[Worker] Memproses Job ${job.id} untuk Tenant: ${job.data.tenantId}`);
    if (job.data.type === 'email') {
      await kirimEmail(job.data);
    }
  },
  {
    connection: koneksiRedis,
    concurrency: 20,
    limiter: {
      max: 100,
      duration: 1000,
    },
  }
);

// Teruskan ke DLQ jika jatah retry telah habis
workerNotifikasi.on('failed', async (job, error) => {
  if (job && job.attemptsMade >= (job.opts.attempts || 5)) {
    console.error(`[DLQ] Job ${job.id} gagal total. Memindahkan ke DLQ:`, error.message);
    await antreanDLQ.add('notifikasi_gagal', {
      originalJobId: job.id,
      failedReason: error.message,
      data: job.data,
      exhaustedAt: new Date().toISOString(),
    });
  }
});
```

---

### Checklist Implementasi
- [ ] Atur konfigurasi `maxRetriesPerRequest: null` pada koneksi ioredis untuk BullMQ v5.
- [ ] Gunakan `jobId` deterministik dari ID transaksi bisnis (`invoice_${invoiceId}`) untuk mencegah duplikasi.
- [ ] Pasang *event listener* pada event `failed` untuk meneruskan job yang gagal total ke antrean DLQ.
- [ ] Terapkan pembatasan *rate limiter* pada worker untuk menjaga kestabilan API eksternal.

## Integrasi Orkestrasi
- Terintegrasi dengan: `js-backend-expert`, `async-queue-temporal-expert`, `error-resilience-expert`, `data-telemetry-expert`.
