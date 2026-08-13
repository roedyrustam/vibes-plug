---
name: async-queue-temporal-expert
description: "Expert guide for Durable Workflow Engines (Temporal.io, Trigger.dev v3, Inngest, BullMQ v5) and fault-tolerant background sagas / Panduan ahli workflow engine tahan-gagal (Temporal, Trigger.dev, Inngest, BullMQ)."
author: vibes-plug-swarm
---

# Async Queue & Durable Workflow Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Production-grade guidance for designing durable, fault-tolerant background execution pipelines and distributed state machines using Temporal.io, Trigger.dev v3, Inngest, and BullMQ v5. Guarantees execution completion across long-running background tasks, API rate limits, and server crashes.

### Key Capabilities
- **Durable Execution**: Automatic retry, state persistence, and resume after server restarts or network partitions.
- **Saga Pattern Orchestration**: Multi-step distributed transactions with compensation logic for rollback on failure.
- **Rate Limiting & Concurrency**: Controlled worker concurrency, backoff jitter, and per-tenant queue isolation.

```typescript
import { task } from "@trigger.dev/sdk/v3";

export const generateSaaSReport = task({
  id: "generate-saas-report",
  run: async (payload: { tenantId: string }) => {
    // Durable step execution with automatic retries
    const data = await fetchTenantData(payload.tenantId);
    const pdfUrl = await generatePDF(data);
    await sendEmailReport(payload.tenantId, pdfUrl);
    return { success: true, pdfUrl };
  },
});
```

### Implementation Checklist
- [ ] Define background tasks idempotently so they can be safely retried without side effects.
- [ ] Offload heavy payloads to cloud storage (S3) and pass only reference IDs/URLs through the queue.
- [ ] Configure concurrency limits per tenant/worker to avoid rate limit bans from third-party APIs.
- [ ] Implement compensation tasks (rollback) for distributed saga patterns if a downstream step fails permanently.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk merancang pipeline eksekusi background yang tahan-gagal (durable execution) dan state machine terdistribusi menggunakan Temporal.io, Trigger.dev v3, Inngest, dan BullMQ v5. Menjamin penyelesaian eksekusi tugas background berdurasi panjang meskipun terjadi server crash atau pembatasan API rate limit.

### Fitur Utama
- **Eksekusi Tahan-Gagal (Durable)**: Retry otomatis, persistensi state, dan kompensasi lanjutan setelah restart server.
- **Pola Saga**: Transaksi terdistribusi multi-langkah dengan logika kompensasi untuk pembatalan saat terjadi kegagalan.
- **Rate Limiting & Konkurensi**: Kontrol konkurensi worker, backoff jitter, dan isolasi antrean per-tenant.

### Checklist Implementasi
- [ ] Definisikan tugas background secara idempoten agar dapat diulang (retry) dengan aman tanpa efek samping.
- [ ] Pindahkan muatan (payload) besar ke penyimpanan cloud (S3) dan hanya teruskan ID referensi melalui antrean.
- [ ] Konfigurasi batas konkurensi per tenant/worker untuk menghindari pemblokiran batas akses (rate limit) dari API pihak ketiga.
- [ ] Terapkan tugas kompensasi (rollback) untuk pola saga terdistribusi jika sebuah langkah lanjutan gagal secara permanen.


## Orchestration & Integration
- Connects to other backend skills as part of the orchestration flow.
