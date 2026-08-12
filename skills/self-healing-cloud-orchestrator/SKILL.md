---
name: self-healing-cloud-orchestrator
description: "Real-time log monitoring, crash detection, and auto-hotfixing code without human intervention / Pemantauan log real-time, deteksi kerusakan, dan perbaikan kode hotfix otomatis tanpa intervensi manusia."
author: vibes-plug-swarm
---

# Self-Healing Cloud Orchestrator (Code-to-Cloud Auto Remediation)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Bridges the gap between code generation and Cloud Operations (CloudOps). This agent continuously monitors production or staging logs (via Vercel, AWS CloudWatch, Datadog, or Sentry MCP servers). When an anomaly, crash (OOM, Null Pointer), or configuration mismatch occurs, it autonomously downloads the stack trace, identifies the root cause in the source code, writes a patch, validates it locally, and pushes a hotfix deployment without requiring human intervention.

### Trigger Conditions
- Post-deployment in Phase 8, running as a persistent background daemon.
- When an application goes down or experiences a spike in 5xx errors.
- When `proactive-background-watcher` detects a critical health-check failure.

### Operating Protocol
1. **Telemetry Ingestion**: Listens to structured logs and APM alerts.
2. **Root Cause Analysis (RCA)**: Parses stack traces and maps them to the local repository's current commit state.
3. **Autonomous Patching**: Writes the necessary fix (e.g., adding missing env vars, fixing memory leaks, patching unhandled promise rejections).
4. **Validation & Deploy**: Runs local unit/E2E tests via `autonomous-tdd-debugger` and commits the hotfix to trigger the CI/CD pipeline.

## Orchestration & Integration
- Utilizes `proactive-background-watcher` for continuous daemon execution.
- Consumes data from `logging-error-tracking-expert` and `data-telemetry-expert`.
- Delegates to `ci-cd-devops-architect` to push fixes and initiate deployments.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Menjembatani kesenjangan antara pembuatan kode dan Operasi Cloud (CloudOps). Agen ini secara terus-menerus memantau log produksi atau staging (melalui server MCP Vercel, AWS CloudWatch, Datadog, atau Sentry). Ketika terjadi anomali, kerusakan (OOM, Null Pointer), atau ketidaksesuaian konfigurasi, agen ini secara otonom mengunduh *stack trace*, mengidentifikasi akar masalah pada *source code*, menulis *patch*, memvalidasinya secara lokal, dan meluncurkan *deployment hotfix* tanpa intervensi manusia.

### Kondisi Pemicu
- Pasca-deployment di Fase 8, berjalan sebagai daemon latar belakang yang persisten.
- Ketika sebuah aplikasi tumbang (*down*) atau mengalami lonjakan *error* 5xx.
- Ketika `proactive-background-watcher` mendeteksi kegagalan pengecekan kesehatan (*health-check*) yang kritis.

### Protokol Operasi
1. **Penyerapan Telemetri**: Mendengarkan log terstruktur dan peringatan APM.
2. **Analisis Akar Masalah (RCA)**: Menguraikan *stack trace* dan memetakannya ke status komit repositori lokal saat ini.
3. **Patching Otonom**: Menulis perbaikan yang diperlukan (misal: menambahkan *environment variable* yang hilang, memperbaiki kebocoran memori, menambal *unhandled promise rejection*).
4. **Validasi & Deploy**: Menjalankan *unit test/E2E test* lokal melalui `autonomous-tdd-debugger` lalu melakukan komit untuk memicu pipeline CI/CD.

## Integrasi Orkestrasi
- Menggunakan `proactive-background-watcher` untuk eksekusi daemon berkelanjutan.
- Mengonsumsi data dari `logging-error-tracking-expert` dan `data-telemetry-expert`.
- Mendelegasikan tugas ke `ci-cd-devops-architect` untuk mendorong perbaikan (*push*) dan memulai deployment.
