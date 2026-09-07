---
name: async-queue-temporal-expert
description: "Expert guide for Durable Workflow Engines (Temporal.io, Trigger.dev v3, Inngest, BullMQ v5) and fault-tolerant background sagas / Panduan ahli workflow engine tahan-gagal (Temporal, Trigger.dev, Inngest, BullMQ)."
author: "Roedy Rustam"
---

# Async Queue & Durable Workflow Expert (Temporal & Sagas 2026)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Production-grade architectural guide for designing durable, fault-tolerant background execution pipelines, asynchronous job queues, and distributed state machines using **Temporal.io**, **Trigger.dev v3**, **Inngest**, and **BullMQ v5**. Guarantees eventual completion across long-running sagas, API rate limits, worker crashes, and network partitions.

### Key Capabilities
1. **Durable State Machines**: Workflows survive process restarts, deployments, and database blips without losing state or re-executing completed side-effects.
2. **Distributed Saga Pattern**: Multi-step transactions paired with automated compensating activities (rollbacks) whenever a downstream service permanently fails.
3. **Idempotency & Deduplication**: Ensuring unique idempotency keys per transaction to prevent double billing or duplicate emails.
4. **Queue Concurrency & Rate Limiting**: Token-bucket throttles, exponential backoff with jitter, and dead-letter queues (DLQ) for poison-pill isolation.

---

### Production Implementation Recipes

#### Recipe 1: Temporal.io Saga Pattern with Compensations (TypeScript SDK)
```typescript
import { proxyActivities, ApplicationFailure } from '@temporalio/workflow';
import type * as activities from './activities';

// Proxy activities with aggressive retry policies
const { chargeCustomer, provisionLicense, sendWelcomeEmail, refundCustomer, revokeLicense } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
    retry: {
      initialInterval: '1s',
      backoffCoefficient: 2,
      maximumAttempts: 5,
      nonRetryableErrorTypes: ['InvalidCardError', 'AccountSuspendedError'],
    },
  });

export interface SubscriptionWorkflowInput {
  customerId: string;
  planId: string;
  amountCents: number;
}

/**
 * Distributed Subscription Saga with Compensating Rollbacks
 */
export async function subscriptionSagaWorkflow(input: SubscriptionWorkflowInput): Promise<{ status: string }> {
  const compensations: Array<() => Promise<void>> = [];

  try {
    // Step 1: Charge Customer
    const chargeResult = await chargeCustomer(input.customerId, input.amountCents);
    compensations.unshift(() => refundCustomer(chargeResult.chargeId));

    // Step 2: Provision License
    const licenseResult = await provisionLicense(input.customerId, input.planId);
    compensations.unshift(() => revokeLicense(licenseResult.licenseId));

    // Step 3: Send Welcome Notification
    await sendWelcomeEmail(input.customerId, licenseResult.licenseKey);

    return { status: 'COMPLETED' };
  } catch (error) {
    // Execute compensating activities in reverse order
    for (const compensate of compensations) {
      try {
        await compensate();
      } catch (compError) {
        console.error('Compensation failed, alerting on-call engineer:', compError);
      }
    }
    throw ApplicationFailure.create({
      message: `Subscription saga failed and rolled back: ${(error as Error).message}`,
      nonRetryable: true,
    });
  }
}
```

#### Recipe 2: Trigger.dev v3 Durable Task with Idempotency
```typescript
import { task } from '@trigger.dev/sdk/v3';

export const generateEnterpriseAnalyticsReport = task({
  id: 'generate-enterprise-report',
  retry: {
    maxAttempts: 4,
    minTimeoutInMs: 2000,
    factor: 2,
    randomize: true, // Jitter
  },
  run: async (payload: { tenantId: string; month: string }, { ctx }) => {
    // Automatic checkpointing: each step runs durably
    const data = await ctx.run('fetch-telemetry', async () => {
      return await fetchTelemetryFromWarehouse(payload.tenantId, payload.month);
    });

    const pdfUrl = await ctx.run('render-pdf', async () => {
      return await generateReportPdf(data);
    });

    await ctx.run('dispatch-webhook', async () => {
      return await sendWebhookNotification(payload.tenantId, pdfUrl);
    });

    return { success: true, pdfUrl };
  },
});
```

---

### Implementation Checklist
- [ ] Implement Saga rollback handlers for multi-step distributed payments and user provisioning.
- [ ] Enforce deterministic code inside Temporal workflows (never use `Math.random()`, `Date.now()`, or direct DB calls in workflow files; run them inside activities).
- [ ] Store large payloads in object storage (S3/R2); pass only IDs and signed URLs through queues.
- [ ] Configure DLQ (Dead Letter Queue) and alert thresholds for persistent failures.

## Orchestration & Integration
- Integrates with: `js-backend-expert`, `background-jobs-queue-expert`, `error-resilience-expert`, `saas-billing`, `doku-payment-gateway`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Tujuan & Gambaran Umum
Panduan arsitektur tingkat produksi untuk merancang pipeline eksekusi background yang tahan-gagal (durable execution), antrean tugas asinkron, dan state machine terdistribusi menggunakan **Temporal.io**, **Trigger.dev v3**, **Inngest**, dan **BullMQ v5**. Menjamin penyelesaian mutlak tugas berdurasi panjang terhadap pembatasan rate limit API, kegagalan worker, dan partisi jaringan.

### Kemampuan Utama
1. **State Machine Tahan-Gagal (Durable Execution)**: Alur kerja (workflow) tetap bertahan saat restart server, deployment, atau gangguan database tanpa kehilangan progres state.
2. **Pola Transaksi Terdistribusi (Saga Pattern)**: Transaksi multi-langkah yang dilengkapi dengan aktivitas kompensasi (rollback otomatis) jika langkah lanjutan gagal permanen.
3. **Idempotensi & Anti-Duplikasi**: Menjamin kunci idempotensi unik pada setiap transaksi guna mencegah duplikasi penagihan atau email berulang.
4. **Pembatasan Rate Limit & DLQ**: Throttling berbasis token bucket, exponential backoff dengan jitter acak, dan dead-letter queue (DLQ) untuk mengisolasi tugas beracun (*poison pills*).

---

### Resep Implementasi Produksi

#### Resep 1: Pola Saga Temporal.io dengan Logika Kompensasi (TypeScript)
```typescript
import { proxyActivities, ApplicationFailure } from '@temporalio/workflow';
import type * as activities from './activities';

const { tagihPelanggan, aktifkanLisensi, kirimEmailSambutan, kembalikanDana, cabutLisensi } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
    retry: {
      initialInterval: '1s',
      backoffCoefficient: 2,
      maximumAttempts: 5,
    },
  });

export interface InputWorkflowLangganan {
  customerId: string;
  planId: string;
  amountCents: number;
}

export async function workflowSagaLangganan(input: InputWorkflowLangganan) {
  const kompensasi: Array<() => Promise<void>> = [];

  try {
    // Langkah 1: Tagih Pembayaran
    const hasilTagihan = await tagihPelanggan(input.customerId, input.amountCents);
    kompensasi.unshift(() => kembalikanDana(hasilTagihan.chargeId));

    // Langkah 2: Aktifkan Lisensi
    const hasilLisensi = await aktifkanLisensi(input.customerId, input.planId);
    kompensasi.unshift(() => cabutLisensi(hasilLisensi.licenseId));

    // Langkah 3: Kirim Notifikasi
    await kirimEmailSambutan(input.customerId, hasilLisensi.licenseKey);

    return { status: 'SELESAI' };
  } catch (error) {
    // Eksekusi kompensasi rollback secara berurutan mundur
    for (const compensate of kompensasi) {
      try {
        await compensate();
      } catch (err) {
        console.error('Kompensasi gagal:', err);
      }
    }
    throw ApplicationFailure.create({
      message: `Saga gagal dan dilakukan rollback: ${(error as Error).message}`,
      nonRetryable: true,
    });
  }
}
```

#### Resep 2: Tugas Background Tahan-Gagal Trigger.dev v3
```typescript
import { task } from '@trigger.dev/sdk/v3';

export const buatLaporanAnalitik = task({
  id: 'buat-laporan-analitik',
  retry: {
    maxAttempts: 4,
    factor: 2,
    randomize: true, // Jitter
  },
  run: async (payload: { tenantId: string; bulan: string }, { ctx }) => {
    const data = await ctx.run('ambil-data', async () => {
      return await ambilDataWarehouse(payload.tenantId, payload.bulan);
    });

    const urlPdf = await ctx.run('buat-pdf', async () => {
      return await renderDokumenPdf(data);
    });

    await ctx.run('kirim-webhook', async () => {
      return await notifikasiWebhook(payload.tenantId, urlPdf);
    });

    return { sukses: true, urlPdf };
  },
});
```

---

### Checklist Implementasi
- [ ] Terapkan penanganan rollback (Saga) untuk alur transaksi pembayaran dan provisi akun bertahap.
- [ ] Pastikan kode di dalam alur Temporal selalu deterministik (jangan gunakan `Math.random()` atau kueri DB langsung di dalam workflow, tempatkan di dalam activities).
- [ ] Pindahkan berkas besar ke S3/R2 dan hanya teruskan referensi ID melalui queue.
- [ ] Pasang konfigurasi DLQ (Dead Letter Queue) dan notifikasi peringatan jika ada job yang macet.

## Integrasi Orkestrasi
- Terintegrasi dengan: `js-backend-expert`, `background-jobs-queue-expert`, `error-resilience-expert`, `saas-billing`, `doku-payment-gateway`.
