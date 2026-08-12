---
name: prd-architect
description: "Mandatory guardrail skill that enforces creating a comprehensive Product Requirements Document (PRD) before generating code for new projects / Skill khusus untuk memaksa pembuatan Product Requirements Document (PRD) sebelum mulai coding pada setiap proyek baru."
author: "Roedy Rustam"
---

# PRD Architect (2026 — PRD-as-Code Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Mandatory guardrail that enforces creating a comprehensive Product Requirements Document (PRD) before generating code for any new project. Introduces **PRD-as-Code** — a structured Markdown format designed to be machine-readable by AI agents and version-controlled alongside code.

### Trigger Conditions
- A user requests building a new application, SaaS, or major feature from scratch.
- There is no existing PRD, BLUEPRINT.md, or product specification.
- The project scope is unclear or ambiguous.
- The user says "build me...", "create a...", "I want to make..." for a new project.

### Why PRD Before Code
1. **Prevents scope creep**: Defines boundaries before any line of code is written.
2. **Aligns AI output**: AI agents generate significantly better code when given a structured spec.
3. **Enables traceability**: Each implemented feature can be traced back to a PRD requirement.
4. **Reduces rework**: Catches architectural decisions early (DB choice, auth flow, integrations).
5. **Version-controlled spec**: PRD lives in the repo — changes are tracked and reviewable.

### PRD-as-Code Template

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
**Problem**: [Clear description of the problem being solved]
**Target Users**: [Specific user segments]
**Current Pain Points**:
- Pain point 1
- Pain point 2

## 3. Goals & Success Metrics
| Goal | Metric | Target |
|---|---|---|
| Reduce churn | Monthly churn rate | < 5% |
| Improve activation | D7 retention | > 40% |

## 4. User Personas
### Persona 1: [Name]
- **Role**: [Job title / context]
- **Goals**: [What they want to achieve]
- **Frustrations**: [What currently doesn't work]
- **Key Behaviors**: [How they'll use this product]

## 5. Feature Requirements

### MVP Features (Must Have — v1.0)
- [ ] **[Feature Name]**: [Description. Acceptance criteria: ...]
- [ ] **Authentication**: Email/password + Google OAuth. PKCE flow. Session-based.
- [ ] **Dashboard**: Overview of [key metrics]. Real-time updates via SSE.

### Phase 2 Features (Should Have — v1.x)
- [ ] **[Feature Name]**: [Description]

### Future Features (Nice to Have — v2.0+)
- [ ] **[Feature Name]**: [Description]

## 6. Technical Architecture

### Stack Decision
| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js 15 + React 19 | SSR, App Router, RSC |
| Backend | Hono + Bun | Type-safe RPC, edge-ready |
| Database | PostgreSQL + Drizzle ORM | ACID, RLS multi-tenant |
| Auth | Supabase Auth v3 | PKCE, OAuth, MFA |
| Payments | Stripe / Polar.sh | [Reason for choice] |
| Deployment | Vercel + Railway | [Reason for choice] |

### Architecture Decisions (ADRs)
- **ADR-001**: [Decision title] — [Decision made and why]
- **ADR-002**: Multi-tenancy via RLS — Shared schema with Supabase RLS for isolation

### Multi-Entry Points (if SaaS)
| Entry Point | Domain | Purpose |
|---|---|---|
| Landing Page | `myapp.com` | Marketing, conversion |
| SaaS App | `app.myapp.com` | Core product |
| Super Admin | `admin.myapp.com` | Cross-tenant management |
| API | `api.myapp.com` | Backend (internal + public) |

## 7. Data Model (High-Level)
```
users ──belongs_to──> workspaces (via workspace_members)
workspaces ──has_many──> projects
projects ──has_many──> tasks
```

## 8. User Flows
### Primary Flow: [Name]
1. User [action 1]
2. System [response 1]
3. User [action 2]
4. System [response 2] → Success state

## 9. Non-Functional Requirements
| Requirement | Target |
|---|---|
| Performance | LCP < 2.5s, INP < 200ms |
| Availability | 99.9% uptime |
| Security | SOC 2 Type II compliant |
| Scalability | Support 10K concurrent users |

## 10. Out of Scope
- [Explicitly excluded feature or integration]
- [Another explicitly excluded item]

## 11. Open Questions
- [ ] [Question that needs a decision before development]
- [ ] Should we support SSO (SAML) in v1 or defer to v2?

## 12. Approval & Sign-off
| Stakeholder | Role | Status |
|---|---|---|
| [Name] | Product | ✅ Approved |
| [Name] | Engineering | ⏳ Pending |
```

### Enforcement Protocol
1. **Detect**: When user requests a new project build.
2. **Pause**: Do NOT generate any code.
3. **Generate PRD & Roadmap**: Create a pre-filled PRD draft (`PRD.md`) and a Roadmap document (`ROADMAP.md` or `PROGRESS.md`) based on the user's description.
4. **Review**: Present to user for approval/edits.
5. **Confirm**: Once PRD and Roadmap are approved, proceed to `zero-to-prod-orchestrator` Phase 1.
6. **Reference**: Cite the PRD and Roadmap in all subsequent code generation decisions.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Guardrail wajib yang memaksa pembuatan Product Requirements Document (PRD) komprehensif sebelum membuat kode untuk proyek baru apapun. Memperkenalkan **PRD-as-Code** — format Markdown terstruktur yang dirancang agar dapat dibaca mesin oleh agen AI dan dikontrol versi bersama kode.

### Kondisi Pemicu
- Pengguna meminta membangun aplikasi, SaaS, atau fitur besar baru dari awal.
- Tidak ada PRD, BLUEPRINT.md, atau spesifikasi produk yang ada.
- Ruang lingkup proyek tidak jelas atau ambigu.
- Pengguna berkata "buatkan saya...", "buat sebuah...", "saya ingin membuat..." untuk proyek baru.

### Mengapa PRD Sebelum Kode
1. **Mencegah scope creep**: Mendefinisikan batas sebelum satu baris kode pun ditulis.
2. **Menyelaraskan output AI**: Agen AI menghasilkan kode yang jauh lebih baik saat diberi spesifikasi terstruktur.
3. **Memungkinkan keterlacakan**: Setiap fitur yang diimplementasikan dapat ditelusuri kembali ke persyaratan PRD.
4. **Mengurangi pengerjaan ulang**: Menangkap keputusan arsitektur lebih awal (pilihan DB, alur auth, integrasi).
5. **Spesifikasi dengan kontrol versi**: PRD hidup di repo — perubahan dilacak dan dapat ditinjau.

### Template PRD-as-Code
Template PRD mencakup 12 bagian:
1. **Ringkasan Eksekutif**: Apa produk ini, untuk siapa, masalah apa yang diselesaikan.
2. **Pernyataan Masalah**: Deskripsi masalah yang jelas dengan persona pengguna target.
3. **Tujuan & Metrik Keberhasilan**: Target terukur yang terkait dengan tujuan bisnis.
4. **Persona Pengguna**: Peran, tujuan, frustrasi, dan perilaku kunci.
5. **Persyaratan Fitur**: MVP (Harus Ada), Fase 2 (Sebaiknya Ada), Masa Depan (Bagus Dimiliki).
6. **Arsitektur Teknis**: Keputusan stack dengan justifikasi, ADR, multi-entry points.
7. **Model Data**: Hubungan antar entitas tingkat tinggi.
8. **Alur Pengguna**: Alur langkah-demi-langkah untuk interaksi utama.
9. **Persyaratan Non-Fungsional**: Performa, ketersediaan, keamanan, skalabilitas.
10. **Di Luar Ruang Lingkup**: Apa yang secara eksplisit dikecualikan.
11. **Pertanyaan Terbuka**: Keputusan yang perlu dibuat sebelum pengembangan.
12. **Persetujuan**: Pemangku kepentingan dan status tanda tangan.

### Protokol Penegakan
1. **Deteksi**: Saat pengguna meminta pembangunan proyek baru.
2. **Jeda**: JANGAN hasilkan kode apapun.
3. **Buat PRD & Roadmap**: Buat draf PRD (`PRD.md`) dan dokumen Roadmap (`ROADMAP.md` atau `PROGRESS.md`) yang sudah diisi berdasarkan deskripsi pengguna.
4. **Tinjau**: Sajikan kepada pengguna untuk persetujuan/edit.
5. **Konfirmasi**: Setelah PRD dan Roadmap disetujui, lanjut ke `zero-to-prod-orchestrator` Fase 1.
6. **Referensi**: Kutip PRD dan Roadmap dalam semua keputusan pembuatan kode selanjutnya.

---
### 🎨 Automatic Visual Assets Generation Mandate (CRITICAL)
**MANDATORY**: Whenever you are building a new application, scaffolding a project, or finalizing the initial UI/UX, you MUST automatically use the `generate_image` tool to create a custom logo that perfectly matches the application's core concept and aesthetic. 
This generated image MUST be explicitly used as:
1. The primary application logo (e.g., in the header/navbar).
2. The website favicon (`favicon.ico` or equivalent).
3. The Open Graph (OG) image for SEO metadata (`og:image`).

Do not use placeholders for these assets. Generate and integrate them automatically.
