---
name: prd-architect
description: "Continuous PRD, ERD, and architectural documentation generation / Pembuatan dokumen PRD, ERD, dan arsitektur sistem secara kontinu."
author: "Roedy Rustam"
version: "4.4.4"

---

# PRD Architect & Documentation Lifecycle (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 1 - Discovery & PRD, and Phase 8 - Docs Handoff) as the primary specification guardrail.
- **Downstream Cooperating Skills**:
  - `spec-driven-development-expert` — Convert PRD requirements into executable OpenAPI and TypeSpec contracts.
  - `domain-driven-design-expert` — Model domain bounded contexts and ubiquitous language in PRD sections.
  - `session-memory-manager` — Ground session memory on approved PRD/ERD specifications and ADR records.
  - `anti-slop` — Enforce concrete DDL schemas, verifiable NFR targets, and zero marketing buzzwords.
  - `production-ready-hardener` — Audit documentation completeness before final release.
  - `documentation-site-expert` — Publish approved PRD, API references, and architecture guides to Mintlify, VitePress, or Fumadocs sites.

### Description
A mandatory lifecycle guardrail covering two distinct phases:
- **Phase 1 (Pre-Code):** Enforces creating a comprehensive Product Requirements Document (PRD), ERD, and general Documentation before generating code. Introduces PRD-as-Code — machine-readable and version-controlled.
- **Phase 2 (Post-Code / Maintenance):** Automatically maintains project documentation after every successful build or feature implementation, updating `CHANGELOG.md`, `BLUEPRINT.md`, `PROGRESS.md`, and Architecture Decision Records (ADRs).

### Trigger Conditions
- **Phase 1:** User requests building a new app/SaaS/feature from scratch; no existing PRD/blueprint; unclear scope.
- **Phase 2:** A feature, bug fix, or refactor is successfully implemented; user asks to "update docs" or "save progress"; a significant architectural decision is made; milestone completion.

### Phase 1: Pre-Code Requirements & Enforcement
**Why PRD Before Code:** Prevents scope creep, aligns AI output, enables traceability, reduces rework, version-controlled.

#### Enforcement Protocol
1. **Detect**: When user requests a new project build.
2. **Pause**: Do NOT generate any code.
3. **Generate Assets (Zero-Slop Standard)**: Automatically draft `PRD.md`, `ERD.md`, `DOCUMENTATION.md`, and `ROADMAP.md` (or `PROGRESS.md`). Enforce `anti-slop`: zero marketing buzzwords; mandate concrete PostgreSQL DDL schemas, explicit REST/RPC contracts, and verified latency NFR budgets.
4. **Review**: Present to user for approval/edits.
5. **Confirm**: Proceed to code generation ONLY after approval.
6. **Reference**: Cite these documents in all subsequent decisions.

#### PRD-as-Code Template (12 Sections)
```markdown
# Product Requirements Document (PRD)
**Project**: [Project Name]
**Version**: 1.0.0
**Status**: Draft | In Review | Approved
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD

---
## 1. Executive Summary
[2-3 sentences: What is this product? Who is it for? What problem does it solve?]

## 2. Problem Statement
**Problem**: [Clear description]
**Target Users**: [Specific segments]
**Current Pain Points**: [List]

## 3. Goals & Success Metrics
| Goal | Metric | Target |
|---|---|---|
| [Goal] | [Metric] | [Target] |

## 4. User Personas
### Persona 1: [Name]
- **Role**: [Job title]
- **Goals**: [What they want to achieve]
- **Frustrations**: [What currently doesn't work]
- **Key Behaviors**: [How they'll use this product]

## 5. Feature Requirements
### MVP Features (Must Have — v1.0)
- [ ] **[Feature Name]**: [Description. Acceptance criteria: ...]
### Phase 2 Features (Should Have — v1.x)
- [ ] **[Feature Name]**: [Description]
### Future Features (Nice to Have — v2.0+)
- [ ] **[Feature Name]**: [Description]

## 6. Technical Architecture
### Stack Decision
| Layer | Technology | Rationale |
|---|---|---|
| [Layer] | [Technology] | [Reason] |
### Architecture Decisions (ADRs)
- **ADR-001**: [Decision title] — [Decision made and why]
### Multi-Entry Points (if SaaS)
| Entry Point | Domain | Purpose |
|---|---|---|
| [Entry] | [Domain] | [Purpose] |

## 7. Data Model (High-Level)
users ──belongs_to──> workspaces (via workspace_members)
workspaces ──has_many──> projects

## 8. User Flows
### Primary Flow: [Name]
1. User [action 1]
2. System [response 1]

## 9. Non-Functional Requirements
| Requirement | Target |
|---|---|
| Performance | LCP < 2.5s, INP < 200ms |

## 10. Out of Scope
- [Explicitly excluded item]

## 11. Open Questions
- [ ] [Question that needs decision]

## 12. Approval & Sign-off
| Stakeholder | Role | Status |
|---|---|---|
| [Name] | [Role] | [Status] |
```

### Phase 2: Post-Code Maintenance & Update Protocol

After every successful feature implementation:
1. **CHANGELOG.md**: Add entry under `[Unreleased]` (Keep-a-Changelog standard: Added/Changed/Fixed/Removed/Security).
2. **BLUEPRINT.md**: Update only if architecture, schema, stack, or entry points changed.
3. **PROGRESS.md**: Mark completed tasks `[x]`, update next steps.
4. **ADR**: Create a new ADR (`docs/adr/ADR-NNN-title.md`) if a significant architectural decision was made and update index (`docs/adr/README.md`).

#### Files Maintained Frequency Matrix
| File | Purpose | Update Frequency |
|---|---|---|
| `CHANGELOG.md` | User-facing list of changes | Every PR / feature |
| `BLUEPRINT.md` | Technical architecture overview | Major structural changes |
| `PROGRESS.md` | Development roadmap and status | Each work session |
| `docs/adr/` | Architecture Decision Records | Each key decision |

#### ADR Template
```markdown
# ADR-001: [Title]
**Status**: Accepted | Rejected | Proposed | Deprecated
**Date**: YYYY-MM-DD
**Deciders**: [Team/Individual]
## Context
[What motivated this decision?]
## Decision
[What is being decided?]
## Rationale
[Why this choice?]
## Consequences
**Positive:** / **Negative:**
## Superseded By
[ADR-XXX] (if applicable)
```

### 🎨 Automatic Visual Assets Generation Mandate (CRITICAL)
**MANDATORY**: When building a new application, use `generate_image` to create a custom logo. Use it as:
1. The primary application logo (header/navbar).
2. The website favicon (`favicon.ico`).
3. The Open Graph (OG) image for SEO (`og:image`).

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec prd-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 1 - Discovery & PRD, dan Fase 8 - Handoff Dokumen) sebagai guardrail spesifikasi utama.
- **Skill Hilir & Kerja Sama**:
  - `spec-driven-development-expert` — Mengubah kebutuhan PRD menjadi kontrak executable OpenAPI dan TypeSpec.
  - `domain-driven-design-expert` — Memodelkan bounded context domain dan bahasa terpadu dalam PRD.
  - `session-memory-manager` — Melandaskan memori sesi pada spesifikasi PRD/ERD dan rekaman ADR yang disetujui.
  - `anti-slop` — Menegakkan skema DDL konkret, target NFR terverifikasi, dan bebas buzzword pemasaran.
  - `production-ready-hardener` — Mengaudit kelengkapan dokumentasi sebelum rilis final.

### Deskripsi
Guardrail siklus hidup wajib untuk rekayasa perangkat lunak modern:
- **Fase 1 (Pra-Kode / Pre-Code):** Memaksa perancangan dokumen spesifikasi (PRD, ERD, Dokumentasi, Roadmap) sebelum sebaris kode pun ditulis. Mencegah pemborosan token dan refaktorisasi berulang.
- **Fase 2 (Pasca-Kode / Post-Code):** Memelihara dokumentasi hidup secara berkelanjutan setelah setiap fitur selesai: `CHANGELOG.md`, `BLUEPRINT.md`, `PROGRESS.md`, dan Architecture Decision Records (`docs/adr/`).

### Kondisi Pemicu (Trigger Conditions)
- **Fase 1 (Wajib Aktif):**
  - Permintaan proyek baru dari nol ("buatkan aplikasi...", "bikin SaaS...").
  - Tidak ada berkas PRD di direktori akar repositori.
  - Ruang lingkup kebutuhan atau model data belum terdefinisi secara eksplisit.
- **Fase 2 (Pemeliharaan Kontinu):**
  - Suatu fitur atau modul berhasil diimplementasikan dan diverifikasi lolos tes.
  - Pengguna meminta "perbarui dokumentasi" atau "catat perubahan ini".
  - Keputusan arsitektur besar diambil (migrasi DB, perubahan auth, adopsi library inti).

### Mengapa PRD Sebelum Kode (Why PRD Before Code)
1. **Mencegah Scope Creep**: Membatasi batas fungsional sebelum implementasi.
2. **Penyelarasan Konteks AI**: Memberikan *grounding* akurat bagi seluruh subagen swarm.
3. **Traceability Penuh**: Setiap endpoint API dan tabel DB memiliki justifikasi kebutuhan pengguna.
4. **Zero-Slop Standard**: Mengeliminasi buzzword pemasaran dan memastikan skema DDL PostgreSQL, kontrak JSON REST/RPC, serta target latensi NFR terukur secara matematis.

### Fase 1: Protokol Penegakan 6 Langkah
1. **Deteksi (Detect)**: Kenali instruksi pembuatan proyek baru dari pengguna.
2. **Jeda (Pause)**: JANGAN membuat atau mengedit berkas kode program apa pun.
3. **Hasilkan Berkas Spesifikasi (Zero-Slop)**: Secara otomatis susun draf `PRD.md`, `ERD.md`, `DOCUMENTATION.md`, dan `PROGRESS.md`.
4. **Tinjau (Review)**: Sajikan draf kepada pengguna untuk validasi dan penyesuaian parameter bisnis.
5. **Konfirmasi (Confirm)**: Mulai penulisan kode sumber HANYA setelah pengguna memberikan persetujuan ("Proceed", "Lanjut", atau perbaikan disetujui).
6. **Jadikan Referensi (Reference)**: Rujuk dokumen PRD ini dalam setiap keputusan arsitektur dan penulisan tes TDD.

### Template PRD-as-Code Standar (12 Bagian Lengkap)
```markdown
# Product Requirements Document (PRD)
**Project**: [Nama Proyek / Aplikasi]
**Versi**: 1.0.0
**Status**: Draft | In Review | Approved
**Dibuat**: YYYY-MM-DD
**Terakhir Diperbarui**: YYYY-MM-DD

---
## 1. Ringkasan Eksekutif (Executive Summary)
[2-3 kalimat lugas: Apa produk ini? Siapa target audiensnya? Masalah spesifik apa yang diselesaikan?]

## 2. Pernyataan Masalah (Problem Statement)
- **Masalah Utama**: [Deskripsi konkret pain point di dunia nyata]
- **Target Pengguna**: [Segmen persona spesifik]
- **Kelemahan Solusi Saat Ini**: [Daftar inefisiensi atau risiko dari cara lama]

## 3. Sasaran & Metrik Keberhasilan (Goals & Success Metrics)
| Sasaran Bisnis / Teknis | Metrik Evaluasi | Target Kuantitatif |
|---|---|---|
| Kecepatan Transaksi | Latensi p95 Checkout | < 250ms |
| Adopsi Pengguna | Monthly Active Users | 5,000 pengguna di Q1 |
| Kestabilan Sistem | Error Rate API | < 0.05% |

## 4. Persona Pengguna (User Personas)
### Persona 1: [Nama Karakteristik]
- **Peran**: [Jabatan / Peran Pengguna, misal: Finance Manager]
- **Tujuan Utama**: [Apa hasil yang ingin mereka capai secepat mungkin]
- **Frustrasi Terbesar**: [Halangan yang paling sering mereka hadapi]
- **Pola Interaksi**: [Bagaimana & kapan mereka membuka aplikasi ini]

## 5. Kebutuhan Fitur (Feature Requirements - MoSCoW)
### Fitur MVP (Must Have — v1.0)
- [ ] **[Nama Fitur 1]**: [Deskripsi fungsional. Kriteria Penerimaan: Given-When-Then]
- [ ] **[Nama Fitur 2]**: [Deskripsi fungsional. Kriteria Penerimaan: Given-When-Then]
### Fitur Tahap Lanjutan (Should Have — v1.x)
- [ ] **[Nama Fitur 3]**: [Deskripsi fungsional yang meningkatkan efisiensi]
### Fitur Masa Depan (Nice to Have — v2.0+)
- [ ] **[Nama Fitur 4]**: [Eksperimen fitur AI atau otomasi tambahan]

## 6. Arsitektur Teknis (Technical Architecture)
### Pilihan Teknologi (Stack Decision)
| Lapisan (Layer) | Teknologi Terpilih | Alasan & Justifikasi Teknis |
|---|---|---|
| Frontend | Next.js 15 App Router + React 19 | Server Component streaming, caching terintegrasi |
| Styling | Tailwind CSS v4 | CSS-first configuration, performa kompilasi instan |
| Backend API | Node.js 24 LTS + Hono / Express 5 | Latensi ultra-rendah, typing TypeScript end-to-end |
| Database | PostgreSQL 16 + Drizzle ORM | ACID compliance, type-safety, migrasi deterministik |

### Multi-Entry Points (Jika Arsitektur SaaS)
| Entry Point | Subdomain / Path | Tujuan & Peruntukan |
|---|---|---|
| Web Publik | `example.com` | Landing page pemasaran & pendaftaran publik |
| Dashboard Tenant | `app.example.com` | Panel kerja terautentikasi pengguna |
| API Gateway | `api.example.com` | Endpoint integrasi pihak ketiga & webhook |

## 7. Model Data & Hubungan Entitas (High-Level ERD)
```
users ──1:N──> workspace_members <──N:1── workspaces
workspaces ──1:N──> projects ──1:N──> tasks
```

## 8. Alur Pengguna Utama (Core User Flows)
### Alur 1: Pendaftaran Organisasi & Pembayaran Langganan
1. Pengguna membuka halaman registrasi dan memasukkan kredensial email/password.
2. Sistem membuat baris baru di tabel `users` dan mengirim tautan verifikasi.
3. Pengguna memilih paket langganan dan diarahkan ke gateway pembayaran DOKU / Stripe.
4. Webhook pembayaran menerima status sukses → akun diaktivasi secara atomik.

## 9. Kebutuhan Non-Fungsional (Non-Functional Requirements - NFR)
| Kategori | Parameter | Target Kepatuhan |
|---|---|---|
| Performa Web | Core Web Vitals | LCP < 2.0s, INP < 150ms, CLS < 0.05 |
| Keamanan | Autentikasi | Hashing Argon2id, CSRF token, CSP Level 3 |
| Ketersediaan | SLA Uptime | 99.9% Uptime bulanan |
| Aksesibilitas | Standar A11y | WCAG 2.2 Level AA penuh, kontras rasio >= 4.5:1 |

## 10. Batasan Ruang Lingkup (Out of Scope)
- [Daftar hal yang secara eksplisit TIDAK dikerjakan pada versi v1.0]

## 11. Pertanyaan Terbuka & Keputusan Tertunda (Open Questions)
- [ ] [Poin teknis atau regulasi yang masih memerlukan konfirmasi pihak eksternal]

## 12. Persetujuan & Tanda Tangan (Approval & Sign-off)
| Pemangku Kepentingan | Peran / Divisi | Status Persetujuan | Tanggal |
|---|---|---|---|
| [Nama Pemimpin Proyek] | Product Owner | Approved | YYYY-MM-DD |
| [Nama Lead Engineer] | Tech Lead | Approved | YYYY-MM-DD |
```

### Fase 2: Protokol Pemeliharaan & Pembaruan Pasca-Kode
Setelah setiap kali penyelesaian fitur atau perbaikan kode penting:
1. **CHANGELOG.md**: Tambahkan catatan versi pada bagian `[Unreleased]` mengikuti konvensi Keep a Changelog (Added, Changed, Deprecated, Removed, Fixed, Security).
2. **BLUEPRINT.md**: Perbarui diagram atau pemetaan arsitektur HANYA jika terdapat perubahan skema database, dependensi inti, atau struktur rute.
3. **PROGRESS.md**: Centang kotak tugas yang selesai (`[x]`) dan perbarui prioritas kerja berikutnya.
4. **ADR (Architecture Decision Records)**: Terbitkan dokumen baru `docs/adr/ADR-NNN-judul.md` bila terjadi pemilihan arsitektur strategis, serta sinkronkan indeks pada `docs/adr/README.md`.

#### Matriks Frekuensi Pembaruan Berkas
| Berkas Dokumentasi | Peruntukan Utama | Frekuensi Pembaruan |
|---|---|---|
| `CHANGELOG.md` | Riwayat perubahan yang dapat dibaca manusia | Setiap kali pull request atau fitur selesai |
| `BLUEPRINT.md` | Ikhtisar teknis arsitektur sistem | Perubahan struktural besar |
| `PROGRESS.md` | Pelacak status pengerjaan & checklist tugas | Setiap sesi kerja pengembangan |
| `docs/adr/` | Catatan keputusan arsitektur kunci | Setiap keputusan teknologi permanen |

#### Template Standar ADR (Architecture Decision Record)
```markdown
# ADR-001: [Judul Keputusan Arsitektur]
**Status**: Diterima (Accepted) | Ditolak (Rejected) | Diusulkan (Proposed) | Kedaluwarsa (Deprecated)
**Tanggal**: YYYY-MM-DD
**Pengambil Keputusan**: [Tim / Arsitek Perangkat Lunak]

## Konteks (Context)
[Apa masalah atau tantangan arsitektur yang mendasari perlunya keputusan ini?]

## Keputusan (Decision)
[Teknologi, pola, atau pendekatan arsitektur spesifik apa yang diputuskan untuk diadopsi?]

## Alasan & Dasar Pertimbangan (Rationale)
[Mengapa opsi ini dipilih dibandingkan dengan alternatif lain yang tersedia?]

## Konsekuensi (Consequences)
- **Dampak Positif:** [Keuntungan performa, keterbacaan kode, efisiensi biaya, atau keamanan]
- **Dampak Negatif & Risiko:** [Trade-off komputasi, kompleksitas operasional, atau kurva belajar]

## Digantikan Oleh (Superseded By)
[ADR-XXX] (jika di kemudian hari keputusan ini direvisi oleh ADR yang lebih baru)
```

### 🎨 Mandat Pembuatan Aset Visual Otomatis (KRITIS)
**WAJIB**: Saat menginisialisasi aplikasi web baru dari awal, agen HARUS menggunakan tool `generate_image` untuk menghasilkan logo merek visual profesional. Aset ini wajib ditempatkan sebagai:
1. Logo utama aplikasi di komponen header/navbar.
2. Ikon tab browser atau favicon resmi (`favicon.ico` atau `icon.png`).
3. Banner kartu media sosial Open Graph untuk SEO (`og:image`).

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec prd-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
