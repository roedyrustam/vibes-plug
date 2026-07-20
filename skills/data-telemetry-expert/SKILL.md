---
name: data-telemetry-expert
description: "Expert guide for observability, analytics, telemetry, and data pipelines (OpenTelemetry, PostHog, Mixpanel) / Panduan ahli untuk observabilitas, telemetri, dan analitik."
author: "Roedy Rustam"
---

# Data & Telemetry Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill covers the setup and architecture of product analytics, system telemetry (tracing, metrics, logs), and data pipelines. It ensures that SaaS products are fully observable and that user behavior can be analyzed to drive product decisions.

### Trigger Conditions
- Integrating product analytics (PostHog, Mixpanel, Amplitude).
- Setting up system observability (Datadog, New Relic, OpenTelemetry).
- Designing event tracking schemas and taxonomy.
- Building data pipelines or deploying analytical databases (ClickHouse).

### Core Architecture Guidelines

#### 1. Observability (Backend)
If you can't measure it, you can't fix it. 
- Use **OpenTelemetry (OTel)** to instrument your backend services. It is vendor-agnostic.
- Collect the Three Pillars of Observability:
  - **Traces**: Track the lifecycle of a request across microservices/functions.
  - **Metrics**: Track aggregates (e.g., HTTP 500 errors/min, memory usage).
  - **Logs**: Track discrete events with rich contextual metadata.

#### 2. Product Analytics (Frontend/Backend)
Track *what* users are doing to understand product usage.
- Use a platform like **PostHog** (which offers Analytics, Feature Flags, and Session Replay in one tool).
- **Taxonomy Rule**: Use a consistent `Noun Action` format for event names (e.g., `Workspace Created`, `Subscription Upgraded`).
- **Backend vs Frontend Tracking**: 
  - Track high-volume UI interactions (clicks, pageviews) on the Frontend.
  - Track critical business events (payments, signups) on the Backend to ensure they are never blocked by ad-blockers.

#### 3. Session Replay
Enable Session Replay (via PostHog or LogRocket) for debugging frontend issues. It records the DOM mutations so developers can literally watch what the user did right before an error occurred. **Crucial:** Ensure sensitive fields (passwords, credit cards) are masked before recording!

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini mencakup penyiapan dan arsitektur analitik produk, telemetri sistem (tracing, metrik, log), dan *data pipelines*. Tujuannya adalah untuk memastikan bahwa produk SaaS dapat diobservasi secara menyeluruh dan perilaku pengguna dapat dianalisis untuk pengambilan keputusan produk.

### Kondisi Pemicu
- Mengintegrasikan analitik produk (PostHog, Mixpanel, Amplitude).
- Mengatur observabilitas sistem (Datadog, New Relic, OpenTelemetry).
- Merancang skema pelacakan *event* dan taksonominya.
- Membangun *data pipeline* atau menggunakan database analitik (ClickHouse).

### Panduan Arsitektur Inti

#### 1. Observabilitas (Backend)
Jika Anda tidak bisa mengukurnya, Anda tidak bisa memperbaikinya.
- Gunakan standar **OpenTelemetry (OTel)** untuk menginstrumentasi layanan backend Anda, karena ini bebas *vendor-lock-in*.
- Kumpulkan Tiga Pilar Observabilitas:
  - **Traces**: Melacak siklus hidup sebuah *request* saat melewati berbagai layanan mikro/fungsi.
  - **Metrics**: Melacak data agregat (mis. jumlah error HTTP 500/menit, penggunaan memori).
  - **Logs**: Melacak *event* tunggal yang dilengkapi metadata kontekstual.

#### 2. Analitik Produk (Frontend/Backend)
Lacak *apa* yang dilakukan pengguna untuk memahami nilai produk.
- Gunakan platform seperti **PostHog** (menyediakan Analytics, Feature Flags, dan Session Replay sekaligus).
- **Aturan Taksonomi**: Gunakan format `KataBenda KataKerja` secara konsisten untuk nama *event* (misal: `Workspace Created`, `Subscription Upgraded`).
- **Pelacakan Backend vs Frontend**:
  - Lacak interaksi UI yang ringan (klik, pageviews) di sisi Frontend.
  - Lacak peristiwa bisnis kritis (pembayaran, pendaftaran) di sisi Backend untuk memastikan pelacakan tidak diblokir oleh ekstensi *Ad-Blocker*.

#### 3. Session Replay (Rekaman Sesi)
Aktifkan *Session Replay* (via PostHog atau LogRocket) untuk *debugging* isu frontend. Alat ini merekam mutasi DOM sehingga developer benar-benar bisa memutar ulang apa yang dilakukan pengguna sebelum terjadi error. **Sangat Penting:** Pastikan kolom input sensitif (kata sandi, kartu kredit) disamarkan (*masked*) sebelum terekam!
