---
name: background-jobs-queue-expert
description: "Dedicated deep-dive for BullMQ v5, Trigger.dev v3, Inngest, delayed jobs, job deduplication, idempotency, dead letter queues, and job priority / Panduan mendalam untuk BullMQ v5, Trigger.dev v3, Inngest, delayed jobs, deduplikasi job, idempotency, dead letter queue, dan prioritas job."
author: vibes-plug-swarm
---

# Background Jobs & Queue Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
A deep-dive expert guide for implementing advanced background job queues using BullMQ v5, Trigger.dev v3, and Inngest. This skill focuses purely on the mechanics of robust job processing: delayed jobs, job deduplication, concurrency limits per-tenant, strict idempotency, dead letter queues (DLQ), and job priorities.

### Trigger Conditions
- Implementing job queues in a backend application.
- Dealing with flaky third-party APIs that require backoff and retry.
- Designing Dead Letter Queues (DLQ) for failed background tasks.
- Implementing job deduplication and prioritization (e.g., premium user tasks first).
- Offloading heavy compute tasks (video processing, PDF generation, bulk email) from the main request loop.

### Advanced Concepts

1. **Idempotency**: Every background job MUST be idempotent. It should be safe to run the exact same job multiple times without creating duplicate side-effects (e.g., charging a customer twice).
2. **Job Deduplication**: Use deterministic job IDs based on payload hash or business logic (e.g., `invoice_gen_{invoiceId}`) to prevent the same job from being enqueued multiple times.
3. **Dead Letter Queues (DLQ)**: Jobs that fail repeatedly after all backoff retries must be moved to a DLQ for manual inspection. Never let a poison pill job block the queue.
4. **Concurrency and Rate Limits**: When calling external APIs, restrict worker concurrency to avoid getting rate-limited. E.g., BullMQ `RateLimiter` or Trigger.dev concurrency keys.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli yang mendalam untuk mengimplementasikan antrean pekerjaan latar belakang (background job queues) menggunakan BullMQ v5, Trigger.dev v3, dan Inngest. Skill ini murni berfokus pada mekanika pemrosesan job yang tangguh: *delayed jobs*, deduplikasi job, batas konkurensi per-tenant, *idempotency* yang ketat, *dead letter queues* (DLQ), dan prioritas job.

### Kondisi Pemicu
- Mengimplementasikan job queue pada aplikasi backend.
- Menangani API pihak ketiga yang tidak stabil dan membutuhkan *backoff* serta *retry*.
- Merancang Dead Letter Queues (DLQ) untuk tugas yang gagal.
- Mengimplementasikan deduplikasi dan penentuan prioritas job (misalnya, tugas dari pengguna premium didahulukan).
- Memindahkan tugas komputasi berat (pemrosesan video, pembuatan PDF, email massal) dari *request loop* utama.

### Konsep Lanjutan

1. **Idempotensi (Idempotency)**: Setiap background job HARUS idempoten. Artinya, job tersebut harus aman dijalankan berkali-kali tanpa menghasilkan efek samping ganda (contoh: menghindari pelanggan ditagih dua kali).
2. **Deduplikasi Job**: Gunakan ID job yang deterministik berdasarkan hash payload atau logika bisnis (contoh: `invoice_gen_{invoiceId}`) untuk mencegah job yang sama masuk antrean berulang kali.
3. **Dead Letter Queues (DLQ)**: Job yang gagal berulang kali setelah semua percobaan (retry backoff) habis harus dipindahkan ke DLQ untuk diperiksa secara manual. Jangan biarkan job *poison pill* memblokir antrean.
4. **Konkurensi dan Batasan Rate**: Saat memanggil API eksternal, batasi konkurensi *worker* untuk menghindari pemblokiran *rate limit*. Gunakan `RateLimiter` di BullMQ atau concurrency keys di Trigger.dev.

## Orchestration & Integration
- Connects to `js-backend-expert` / `go-programming-expert` as part of the backend infrastructure.
- Connects to `async-queue-temporal-expert` for Saga patterns.
- Connects to `data-telemetry-expert` to monitor job queue depth and DLQ alerts.
