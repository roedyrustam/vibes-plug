---
name: zero-to-prod-orchestrator
description: "Master orchestrator to build an application from scratch to a production-ready release, enforcing strict step-by-step progression and continuous documentation / Orkestrator utama untuk membangun aplikasi dari nol hingga rilis siap produksi dengan dokumentasi bertahap."
author: "Antigravity"
---

# Zero to Production Orchestrator

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Overview
The **Zero to Production Orchestrator** is a master skill designed to guide the complete lifecycle of building a new application from absolute zero to a production-ready release. It orchestrates other specialized skills and enforces strict documentation of progress and milestones.

### Trigger Conditions
Use this skill when:
- The user wants to build a new application from scratch.
- The user requests a step-by-step guided implementation for a new project.
- The user wants an organized workflow where every step and progress is documented.

### Core Principles
1. **Never Skip Phases**: Each phase must be completed and approved by the user before moving to the next.
2. **Continuous Documentation**: Use `auto-doc-updater` to update `CHANGELOG.md` and `BLUEPRINT.md` after every major milestone.
3. **Progress Tracking**: Maintain a `PROGRESS.md` or a centralized task tracker in the repository root to check off completed tasks.

### The 8-Phase Master Plan

#### PHASE 1: Discovery & PRD
**Orchestrates:** `prd-architect`, `brainstorming`
- [ ] Brainstorm and validate the application idea.
- [ ] Draft a comprehensive Product Requirements Document (PRD).
- [ ] Define the tech stack.
- [ ] Initialize `BLUEPRINT.md` and `PROGRESS.md`.

#### PHASE 2: Project Foundation
**Orchestrates:** `bun-runtime-expert`, `senior-fullstack`, `senior-frontend`
- [ ] Initialize the repository (e.g., Next.js, Vite, or backend frameworks).
- [ ] Configure linters, formatters, and TypeScript/environment settings.
- [ ] Set up the initial CI/CD pipeline.

#### PHASE 3: Database & Core Architecture
**Orchestrates:** `fullstack-expert`, `saas-multi-tenant` (if SaaS), `supabase-migration`
- [ ] Design the database schema and relationships.
- [ ] Configure the ORM (Prisma/Drizzle/SQLx).
- [ ] Apply initial database migrations.
- [ ] Implement Row-Level Security (RLS) or tenant isolation if required.

#### PHASE 4: Authentication & Backend APIs
**Orchestrates:** `firebase-security-expert`, `supabase-security-expert`, `fullstack-expert`
- [ ] Set up Authentication (Clerk, NextAuth, Supabase Auth).
- [ ] Build core API routes or server actions.
- [ ] Implement role-based access control (RBAC).

#### PHASE 5: Frontend & UI/UX
**Orchestrates:** `ui-ux-pro-max`, `tailwind-expert`, `tanstack-query-expert`
- [ ] Build the base layout and navigation shell.
- [ ] Implement core UI components using the design system.
- [ ] Integrate frontend state with backend APIs.

#### PHASE 6: Testing & QA
**Orchestrates:** `e2e-testing-expert`, `secure-fuzz-testing`
- [ ] Write unit tests for core logic.
- [ ] Write integration and E2E tests for critical user flows.
- [ ] Fix any bugs found during QA.

#### PHASE 7: Hardening & SEO
**Orchestrates:** `production-ready-hardener`, `seo`, `app-analyzer-optimizer`
- [ ] Audit performance and security.
- [ ] Implement SEO metadata, sitemaps, and GEO strategies.
- [ ] Ensure the application handles edge cases and errors gracefully.

#### PHASE 8: Launch & Deployment
**Orchestrates:** `cloud-hosting-expert`, `auto-doc-updater`
- [ ] Deploy to production (Vercel, Cloudflare, VPS, etc.).
- [ ] Finalize all documentation (`CHANGELOG.md`, `BLUEPRINT.md`).
- [ ] Handover the production-ready application to the user.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Ringkasan
**Zero to Production Orchestrator** adalah skill master yang dirancang untuk memandu siklus hidup lengkap dalam membangun aplikasi baru dari nol mutlak hingga rilis siap produksi. Skill ini mengorkestrasi skill spesialis lainnya dan mewajibkan dokumentasi progres yang ketat.

### Kondisi Pemicu
Gunakan skill ini ketika:
- Pengguna ingin membangun aplikasi baru dari awal (from scratch).
- Pengguna meminta panduan implementasi langkah demi langkah untuk proyek baru.
- Pengguna menginginkan alur kerja terorganisir di mana setiap langkah dan progres terdokumentasi secara konsisten.

### Prinsip Inti
1. **Jangan Pernah Melewati Fase**: Setiap fase harus diselesaikan dan disetujui oleh pengguna sebelum beralih ke fase berikutnya.
2. **Dokumentasi Berkelanjutan**: Gunakan `auto-doc-updater` untuk memperbarui `CHANGELOG.md` dan `BLUEPRINT.md` setelah setiap pencapaian besar (milestone).
3. **Pelacakan Progres**: Buat dan pelihara file `PROGRESS.md` atau daftar tugas utama (Task List) di root repositori untuk mencentang tugas yang telah selesai.

### Rencana Induk 8-Fase

#### FASE 1: Discovery & PRD
**Mengorkestrasi:** `prd-architect`, `brainstorming`
- [ ] Bertukar pikiran (brainstorming) dan memvalidasi ide aplikasi.
- [ ] Menyusun Product Requirements Document (PRD) yang komprehensif.
- [ ] Menentukan stack teknologi.
- [ ] Menginisialisasi `BLUEPRINT.md` dan `PROGRESS.md`.

#### FASE 2: Fondasi Proyek
**Mengorkestrasi:** `bun-runtime-expert`, `senior-fullstack`, `senior-frontend`
- [ ] Inisialisasi repositori (misal: Next.js, Vite, atau framework backend).
- [ ] Konfigurasi linter, formatter, dan pengaturan TypeScript/environment.
- [ ] Siapkan pipeline CI/CD awal.

#### FASE 3: Database & Arsitektur Inti
**Mengorkestrasi:** `fullstack-expert`, `saas-multi-tenant` (jika SaaS), `supabase-migration`
- [ ] Desain skema database dan relasinya.
- [ ] Konfigurasi ORM (Prisma/Drizzle/SQLx).
- [ ] Terapkan migrasi database awal.
- [ ] Implementasikan Row-Level Security (RLS) atau isolasi tenant jika diperlukan.

#### FASE 4: Autentikasi & API Backend
**Mengorkestrasi:** `firebase-security-expert`, `supabase-security-expert`, `fullstack-expert`
- [ ] Siapkan Autentikasi (Clerk, NextAuth, Supabase Auth).
- [ ] Bangun route API inti atau Server Actions.
- [ ] Implementasikan Role-Based Access Control (RBAC).

#### FASE 5: Frontend & UI/UX
**Mengorkestrasi:** `ui-ux-pro-max`, `tailwind-expert`, `tanstack-query-expert`
- [ ] Bangun layout dasar dan navigasi (app shell).
- [ ] Implementasikan komponen UI inti menggunakan sistem desain.
- [ ] Integrasikan state frontend dengan API backend.

#### FASE 6: Testing & QA
**Mengorkestrasi:** `e2e-testing-expert`, `secure-fuzz-testing`
- [ ] Tulis unit test untuk logika inti.
- [ ] Tulis integration dan E2E test untuk alur pengguna yang kritis.
- [ ] Perbaiki bug yang ditemukan selama proses QA.

#### FASE 7: Hardening & SEO
**Mengorkestrasi:** `production-ready-hardener`, `seo`, `app-analyzer-optimizer`
- [ ] Audit performa dan keamanan aplikasi.
- [ ] Terapkan metadata SEO, sitemap, dan strategi GEO.
- [ ] Pastikan aplikasi menangani edge case dan error dengan baik (graceful degradation).

#### FASE 8: Launch & Deployment
**Mengorkestrasi:** `cloud-hosting-expert`, `auto-doc-updater`
- [ ] Deploy ke production (Vercel, Cloudflare, VPS, dll).
- [ ] Selesaikan semua dokumentasi (`CHANGELOG.md`, `BLUEPRINT.md`, `PROGRESS.md`).
- [ ] Serah terima aplikasi siap produksi kepada pengguna.
