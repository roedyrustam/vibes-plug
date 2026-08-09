---
name: saas-transformer
description: "Transforms regular applications into complete SaaS platforms with multi-tenancy, billing, team management, and feature gating — orchestrating all relevant vibes-plug skills / Mentransformasi aplikasi biasa menjadi platform SaaS lengkap dengan multi-tenancy, billing, manajemen tim, dan feature gating — mengorkestrasi semua skill vibes-plug yang relevan."
author: "Roedy Rustam"
---

# SaaS Transformer

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
The **SaaS Transformer** is a master orchestrator skill that guides the complete transformation of an existing regular application into a fully-featured SaaS platform. Unlike `saas-mvp-launcher` (which builds from scratch) or `saas-multi-tenant` (which only handles data isolation), this skill takes an **already working application** and systematically adds every layer needed to make it a commercial SaaS product.

This skill does NOT replace individual skills — it **coordinates** them into a structured, **9-phase** transformation workflow.

### Orchestrated Skills Map

```
┌──────────────────────────────────────────────────────────────────┐
│                     SAAS-TRANSFORMER                              │
│              (Master Orchestrator — 9 Phases)                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─── PHASE 1: Discovery & Architecture Analysis ─────────────┐  │
│  │  • session-context-loader (Load project context)          │  │
│  │  • app-analyzer-optimizer (Audit architecture & codebase)  │  │
│  │  • prd-architect (Generate PRD for SaaS features)         │  │
│  │  • brainstorming (Validate transformation strategy)       │  │
│  │  • mpa-orchestrator (Evaluate MPA vs SPA architecture)    │  │
│  │  • bun-runtime-expert / go-programming-expert             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 2: Multi-Tenancy Foundation ──────────────────────┐  │
│  │  • saas-multi-tenant (Shared/Isolated Schema, data isolation) │  │
│  │  • supabase-migration (Database migrations)               │  │
│  │  • supabase-security-expert (Audit RLS & RBAC)            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 3: Authentication & Authorization ────────────────┐  │
│  │  • fullstack-expert (OAuth 2.0 / OIDC setup)              │  │
│  │  • js-backend-expert / go-programming-expert (Auth RBAC)  │  │
│  │  • supabase-security-expert (RBAC, Custom Claims)         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 4: Billing & Subscription ────────────────────────┐  │
│  │  • saas-billing (Gateway integration, webhooks, dunning)  │  │
│  │  • saas-mvp-launcher (Stripe integration, pricing tiers)  │  │
│  │  • fullstack-expert (Webhook handling, idempotency)       │  │
│  │  • senior-frontend (Pricing page, customer portal UI)     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 5: Workspace & Team Management ───────────────────┐  │
│  │  • saas-multi-tenant (Workspace model, member roles)      │  │
│  │  • design-system-architect (Radix/Base UI components)     │  │
│  │  • senior-frontend (Invite flow, settings UI)             │  │
│  │  • ui-ux-pro-max (Dashboard, onboarding UX)              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 6: SaaS Frontend & Marketing ─────────────────────┐  │
│  │  • senior-frontend (App shell, dashboard, settings)       │  │
│  │  • design-system-architect (Tokens, Radix, CVA)           │  │
│  │  • tanstack-query-expert (State & optimistic updates)     │  │
│  │  • multiple-entry-points (Separate app vs landing page)   │  │
│  │  • tailwind-expert (Design system, responsive)            │  │
│  │  • seo-aeo-landing-page-writer (Conversion landing page)  │  │
│  │  • seo / seo-geo (SEO & AI search readiness, llms.txt)     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 7: API Layer, AI Tools & Feature Gating ──────────┐  │
│  │  • js-backend-expert (Node 22, Bun, Fastify 5, Hono)       │  │
│  │  • go-programming-expert (Go 1.23+ microservices, gRPC)   │  │
│  │  • mcp-server-architect (MCP Server tools & Zod schemas)  │  │
│  │  • multi-agent-orchestration (LangGraph multi-agent teams)│  │
│  │  • scalability-clean-code (Clean arch, SOLID)             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 8: Testing, Security & Quality Assurance ─────────┐  │
│  │  • e2e-testing-expert (Playwright/Vitest coverage)        │  │
│  │  • secure-fuzz-testing (Validate parsers & data streams)  │  │
│  │  • coderabbit (AI PR summarization & code review)         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 9: Production Hardening, Cloud & Handoff ─────────┐  │
│  │  • production-ready-hardener (Full 7-phase hardening)      │  │
│  │  • cloud-hosting-expert (Edge middleware & custom domains)│  │
│  │  • session-handoff-resume (Save state checkpoint)         │  │
│  │  • auto-doc-updater (CHANGELOG, BLUEPRINT)                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Trigger Conditions
Activate this skill when the user:
1. Has an existing application and wants to convert it into a SaaS product.
2. Asks to "add multi-tenancy", "add billing/subscriptions", "make this a SaaS", "add team management", or similar requests that imply SaaS transformation.
3. Wants to add workspace/organization-based isolation to an existing app.
4. Needs to add pricing tiers, usage limits, or feature gating to an existing product.
5. Asks for a "SaaS audit" or "SaaS readiness check" on an existing application.

### Execution Protocol

When this skill is triggered, execute the following **9-phase transformation process in order**. Each phase produces findings and code changes. At the end, compile a **SaaS Transformation Report**.

> **Important:** Before starting, run the `saas_transformation_scanner.py` script to assess the current state of the application and determine which phases need the most work.

---

#### PHASE 1: Discovery & Architecture Analysis
**Orchestrates:** `session-context-loader`, `app-analyzer-optimizer`, `prd-architect`, `brainstorming`, `mpa-orchestrator`, `bun-runtime-expert`

**Goal:** Understand the existing application and plan the transformation, including architectural pivots.

**Steps:**
1. **Audit the existing codebase** using `app-analyzer-optimizer`:
   - Map all database tables/models and their relationships
   - Identify authentication mechanism (if any)
   - List all API endpoints and their access patterns
   - Assess frontend architecture

2. **Evaluate Core Architecture Shifts**:
   - Consider `mpa-orchestrator`: Should we consolidate into a Single Repo MPA or split into SPA micro-apps?
   - Consider `bun-runtime-expert`: Is extreme performance required? Should we migrate to the Bun runtime?

3. **Generate a SaaS PRD** using `prd-architect`:
   - Define target customer segments and pricing tiers (Free, Pro, Enterprise)
   - Establish usage limits per plan

**Deliverable:** SaaS Transformation Plan document.

**Checklist:**
- [ ] All existing database tables mapped
- [ ] Architecture pivot decisions finalized (MPA vs SPA, Node vs Bun)
- [ ] Target pricing tiers defined (at least Free + 1 paid tier)
- [ ] Tenancy model decided (shared-schema / schema-per-tenant)
- [ ] Auth & Billing providers selected

---

#### PHASE 2: Multi-Tenancy Foundation
**Orchestrates:** `saas-multi-tenant`, `supabase-migration`, `supabase-security-expert` (for Shared Schema RLS)

**Goal:** Add tenant isolation to the database layer.

**Checklist:**
- [ ] Core SaaS tables created (workspaces, workspace_members, workspace_invitations)
- [ ] Decide on Tenancy Model (Shared Schema vs Isolated Schema)
- [ ] Add `tenant_id` to all scoped tables (if Shared Schema) or configure dynamic routing (if Isolated Schema)
- [ ] Apply RLS policies to restrict data access by tenant (if Shared Schema)
- [ ] Tenant-aware middleware implemented
- [ ] Existing data backfilled with default tenant

---

#### PHASE 3: Authentication & Authorization
**Orchestrates:** `fullstack-expert`, `supabase-security-expert`, `firebase-security-expert`

**Goal:** Implement production-grade auth with role-based access.

**Checklist:**
- [ ] Auth provider configured with email + at least 1 OAuth provider
- [ ] RBAC roles defined (owner, admin, member, viewer)
- [ ] Authorization middleware protects all routes/endpoints
- [ ] JWT custom claims include workspace_id and role
- [ ] Session Management Optimization: Implement Edge-ready session validation (e.g., Redis or JWT) to minimize database lookups

---

#### PHASE 4: Billing & Subscription
**Orchestrates:** `saas-billing`, `saas-mvp-launcher`, `fullstack-expert`, `senior-frontend`

**Goal:** Integrate payment processing and subscription management.

**Checklist:**
- [ ] Pricing tiers defined with Stripe products/prices
- [ ] Subscription table created with proper schema
- [ ] Stripe Checkout integration working (subscribe flow)
- [ ] All critical webhooks handled with idempotency
- [ ] Customer portal accessible (manage subscription, invoices)
- [ ] Trial period implemented with expiry notifications

---

#### PHASE 5: Workspace & Team Management
**Orchestrates:** `saas-multi-tenant`, `senior-frontend`, `ui-ux-pro-max`

**Goal:** Build workspace creation, team invitations, and settings management.

**Checklist:**
- [ ] Workspace CRUD operations working
- [ ] Workspace switching UI in navbar
- [ ] Email invitation with unique token link
- [ ] Member role management (view, change, remove)
- [ ] Team size limits enforced by plan

---

#### PHASE 6: SaaS Frontend & Landing
**Orchestrates:** `senior-frontend`, `tanstack-query-expert`, `multiple-entry-points`, `tailwind-expert`, `seo-aeo-landing-page-writer`, `seo`, `seo-geo`, `hig`

**Goal:** Build the SaaS frontend: app shell, dashboard, marketing pages, and super admin panel.

**Steps:**
1. **Architecture Separation (`multiple-entry-points`)**: Separate authenticated SaaS application from marketing pages and the Super Admin dashboard (which MUST be deployed on a separate subdomain like `admin.example.com` for application management).
2. **State Management (`tanstack-query-expert`)**: Implement robust asynchronous state handling, ensuring optimistic UI updates (e.g., when a user updates their profile, the UI reflects it instantly while the server syncs).
3. **App shell / Layout**: Authenticated layout with sidebar navigation, breadcrumbs, and workspace context.
4. **Marketing / Landing page**: Convert users with a highly optimized, SEO/GEO friendly landing page.

**Checklist:**
- [ ] App shell with sidebar, header, workspace switcher
- [ ] Advanced data fetching with TanStack Query (no raw useEffects)
- [ ] Settings pages (account, workspace, team, billing)
- [ ] Landing page with pricing and social proof
- [ ] Super Admin dashboard deployed on a separate subdomain
- [ ] SEO meta tags and Structured data on all public pages
- [ ] Consistent design system (colors, typography, spacing)

---

#### PHASE 7: API Layer & Feature Gating
**Orchestrates:** `fullstack-expert`, `scalability-clean-code`, `senior-fullstack`

**Goal:** Add API versioning, rate limiting, and plan-based feature restrictions.

**Checklist:**
- [ ] API versioning implemented (/api/v1/)
- [ ] Rate limiting configured per plan
- [ ] Feature-check middleware on gated routes
- [ ] Usage metering tracking API calls, storage, members
- [ ] Warning notifications at 80% and 100% usage

---

#### PHASE 8: Testing, Security & Quality Assurance
**Orchestrates:** `e2e-testing-expert`, `secure-fuzz-testing`, `coderabbit`

**Goal:** Validate core business logic and guarantee security before deployment.

**Steps:**
1. **End-to-End Testing (`e2e-testing-expert`)**: Write Playwright tests for critical paths: Signup, Login, Stripe Checkout, and Workspace Invitation.
2. **Security & Fuzzing (`secure-fuzz-testing`)**: Write coverage-guided fuzz tests for any custom data parsers, file uploads, or binary data streams to prevent memory leaks and unexpected crashes.
3. **Automated Review (`coderabbit`)**: Configure CodeRabbit to automatically review all PRs going into main, ensuring code quality and summarizing architectural changes.

**Checklist:**
- [ ] Playwright E2E tests passing for authentication & billing flows
- [ ] Fuzz tests implemented for critical parsers/endpoints
- [ ] `.coderabbit.yaml` configured for automated PR reviews
- [ ] All unit/integration tests (Vitest) passing in CI

---

#### PHASE 9: Production Hardening & Cloud Deployment
**Orchestrates:** `production-ready-hardener`, `cloud-hosting-expert`, `auto-doc-updater`, `saas-mvp-launcher`

**Goal:** Harden the application and deploy to Edge/Cloud architecture.

**Steps:**
1. **Hardening**: Run the full `production-ready-hardener` audit.
2. **Edge Deployment (`cloud-hosting-expert`)**: 
   - Deploy to Vercel/Cloudflare.
   - Configure Edge Middleware for tenant identification (e.g., rewriting `tenant1.myapp.com`).
   - Implement custom domains using Cloudflare for SaaS.
3. **Pre-launch**: Update `CHANGELOG.md` and complete the launch checklist.

**Checklist:**
- [ ] Production-ready-hardener audit score ≥ 85
- [ ] Edge Middleware configured for tenant routing
- [ ] Stripe live mode configured and tested
- [ ] Error monitoring and analytics active
- [ ] Documentation updated (CHANGELOG, BLUEPRINT, README)
- [ ] Pre-launch checklist 100% complete

---

### SaaS Transformation Report Format

After completing all 9 phases, compile a **SaaS Transformation Report**:

```markdown
# SaaS Transformation Report

## Executive Summary
Overall transformation completeness (0-100%) with readiness grade (A/B/C/D/F).

## Phase Scores
| Phase | Score | Status |
|-------|-------|--------|
| 1. Discovery & Architecture Analysis | XX/100 | ✅/⚠️/🔴 |
| 2. Multi-Tenancy Foundation | XX/100 | ✅/⚠️/🔴 |
| 3. Authentication & Authorization | XX/100 | ✅/⚠️/🔴 |
| 4. Billing & Subscription | XX/100 | ✅/⚠️/🔴 |
| 5. Workspace & Team Management | XX/100 | ✅/⚠️/🔴 |
| 6. SaaS Frontend & Landing | XX/100 | ✅/⚠️/🔴 |
| 7. API Layer & Feature Gating | XX/100 | ✅/⚠️/🔴 |
| 8. Testing, Security & QA | XX/100 | ✅/⚠️/🔴 |
| 9. Production Hardening & Cloud | XX/100 | ✅/⚠️/🔴 |

## 📋 Recommended Next Steps
Prioritized action items for post-launch iteration.
```

### Scoring Methodology

Each phase is scored 0-100 based on checklist completion.

**Overall Score** = Weighted average:
- Discovery (5%) + Multi-Tenancy (**20%**) + Auth (10%) + Billing (**20%**) + Teams (10%) + Frontend (10%) + API & Gating (10%) + Testing (5%) + Production (10%)

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
**SaaS Transformer** adalah skill orkestrator utama yang memandu transformasi lengkap aplikasi biasa menjadi platform SaaS berfitur lengkap. Berbeda dengan `saas-mvp-launcher` (yang membangun dari nol) atau `saas-multi-tenant` (yang hanya menangani isolasi data), skill ini mengambil **aplikasi yang sudah berjalan** dan secara sistematis menambahkan setiap lapisan yang diperlukan untuk menjadikannya produk SaaS komersial.

Skill ini TIDAK menggantikan skill individual — ia **mengoordinasikan** mereka ke dalam alur kerja transformasi terstruktur **9 fase**.

### Peta Skill yang Diorkestrasi

| Fase | Skill yang Digunakan | Fokus |
|------|---------------------|-------|
| 1. Discovery & Arsitektur | `session-context-loader`, `app-analyzer-optimizer`, `prd-architect`, `mpa-orchestrator`, `bun-runtime-expert` | Muat konteks, audit codebase, MPA vs SPA, evaluasi Bun |
| 2. Fondasi Multi-Tenancy | `saas-multi-tenant`, `supabase-migration`, `supabase-security-expert` | Shared/Isolated Schema, RLS, isolasi data |
| 3. Autentikasi & Otorisasi | `fullstack-expert`, `supabase-security-expert`, `firebase-security-expert` | OAuth/OIDC, RBAC, JWT claims |
| 4. Billing & Langganan | `saas-billing`, `saas-mvp-launcher`, `fullstack-expert`, `senior-frontend` | Stripe/Midtrans, webhook, dunning |
| 5. Workspace & Tim | `saas-multi-tenant`, `senior-frontend`, `ui-ux-pro-max` | Invite, roles, onboarding |
| 6. Frontend SaaS & Landing | `senior-frontend`, `tanstack-query-expert`, `multiple-entry-points`, `tailwind-expert`, `seo-aeo-landing-page-writer`, `seo` | App shell, TanStack Query state, marketing |
| 7. API & Feature Gating | `fullstack-expert`, `scalability-clean-code`, `senior-fullstack` | Versioning, rate limit, usage metering |
| 8. Pengujian, Keamanan & QA | `e2e-testing-expert`, `secure-fuzz-testing`, `coderabbit` | Playwright E2E, Fuzz testing, AI Code Review |
| 9. Pengerasan Produksi & Cloud | `production-ready-hardener`, `cloud-hosting-expert`, `auto-doc-updater` | Edge middleware, Vercel/Cloudflare, dokumentasi |

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna:
1. Memiliki aplikasi yang sudah ada dan ingin mengkonversinya menjadi produk SaaS.
2. Meminta untuk "menambahkan multi-tenancy", "menambahkan billing/langganan", "jadikan ini SaaS", "tambahkan manajemen tim", atau permintaan serupa.
3. Ingin menambahkan isolasi berbasis workspace/organisasi ke aplikasi yang sudah ada.
4. Perlu menambahkan tier harga, batas penggunaan, atau pembatasan fitur ke produk yang sudah ada.
5. Meminta "audit SaaS" atau "pemeriksaan kesiapan SaaS" pada aplikasi yang sudah ada.

### Protokol Eksekusi

Ketika skill ini dipicu, jalankan **9 fase transformasi secara berurutan**. Setiap fase menghasilkan temuan dan perubahan kode. Di akhir, compile sebuah **Laporan Transformasi SaaS**.

> **Penting:** Sebelum memulai, jalankan script `saas_transformation_scanner.py` untuk menilai kondisi aplikasi saat ini dan menentukan fase mana yang membutuhkan paling banyak pekerjaan.

---

#### FASE 1: Discovery & Analisis Arsitektur
**Mengorkestrasi:** `session-context-loader`, `app-analyzer-optimizer`, `prd-architect`, `brainstorming`, `mpa-orchestrator`, `bun-runtime-expert`

- [ ] Semua tabel/model database dipetakan
- [ ] Keputusan arsitektur (MPA vs SPA, Node vs Bun) dievaluasi
- [ ] Mekanisme autentikasi diidentifikasi
- [ ] Tier harga target ditentukan (minimal Free + 1 berbayar)
- [ ] Model tenancy diputuskan

#### FASE 2: Fondasi Multi-Tenancy
**Mengorkestrasi:** `saas-multi-tenant`, `supabase-migration`, `supabase-security-expert` (untuk RLS Shared Schema)

- [ ] Tentukan Model Tenancy (Shared Schema vs Isolated Schema)
- [ ] Tambahkan `tenant_id` ke semua tabel terkait (jika Shared Schema) atau konfigurasi routing dinamis (jika Isolated Schema)
- [ ] Terapkan kebijakan RLS untuk membatasi akses data per tenant (jika Shared Schema)
- [ ] Middleware tenant-aware diimplementasikan
- [ ] Data existing di-backfill dengan tenant default

#### FASE 3: Autentikasi & Otorisasi
**Mengorkestrasi:** `fullstack-expert`, `supabase-security-expert`, `firebase-security-expert`

- [ ] Provider auth dikonfigurasi (email + minimal 1 OAuth)
- [ ] Role RBAC didefinisikan (owner, admin, member, viewer)
- [ ] Middleware otorisasi melindungi semua route/endpoint
- [ ] Optimasi Session Management: Implementasikan validasi sesi Edge-ready (contoh: Redis atau JWT custom claims) untuk meminimalkan beban query ke database

#### FASE 4: Billing & Langganan
**Mengorkestrasi:** `saas-mvp-launcher`, `fullstack-expert`, `senior-frontend`

- [ ] Tabel subscription dibuat dengan schema multi-gateway
- [ ] Integrasi Checkout (hosted session/widget) berfungsi
- [ ] Semua webhook kritis ditangani dengan idempotency
- [ ] Penanganan pembayaran gagal (dunning management) dikonfigurasi

#### FASE 5: Workspace & Manajemen Tim
**Mengorkestrasi:** `saas-multi-tenant`, `senior-frontend`, `ui-ux-pro-max`

- [ ] UI workspace switching di navbar
- [ ] Flow terima/tolak undangan dengan link token unik
- [ ] Manajemen role anggota (lihat, ubah, hapus)
- [ ] Batas ukuran tim berdasarkan plan

#### FASE 6: Frontend SaaS & Landing
**Mengorkestrasi:** `senior-frontend`, `tanstack-query-expert`, `multiple-entry-points`, `tailwind-expert`, `seo-aeo-landing-page-writer`, `seo`, `hig`

- [ ] Arsitektur dipisah antara aplikasi SaaS, landing page, dan Super Admin (`multiple-entry-points`)
- [ ] Dashboard Super Admin untuk manajemen aplikasi (wajib di-deploy pada subdomain terpisah seperti `admin.domain.com`)
- [ ] App shell dengan sidebar, header, workspace switcher
- [ ] Pengambilan data (data fetching) modern dengan TanStack Query
- [ ] Dashboard dengan metrik dan grafik penggunaan
- [ ] Landing page teroptimasi SEO dengan pricing dan social proof

#### FASE 7: API & Feature Gating
**Mengorkestrasi:** `fullstack-expert`, `scalability-clean-code`, `senior-fullstack`

- [ ] API versioning diimplementasikan (/api/v1/)
- [ ] Rate limiting dikonfigurasi per plan
- [ ] Sistem feature flags/gating operasional
- [ ] Usage metering melacak API calls, storage, members

#### FASE 8: Pengujian, Keamanan & QA
**Mengorkestrasi:** `e2e-testing-expert`, `secure-fuzz-testing`, `coderabbit`

- [ ] Playwright E2E test disiapkan untuk alur penting (login, checkout)
- [ ] Fuzz testing diimplementasikan untuk keamanan parser data
- [ ] CodeRabbit dikonfigurasi (`.coderabbit.yaml`) untuk AI code review di CI/CD
- [ ] Unit test dan integration test (Vitest) lulus di CI

#### FASE 9: Pengerasan Produksi & Deployment Cloud
**Mengorkestrasi:** `production-ready-hardener`, `cloud-hosting-expert`, `auto-doc-updater`, `saas-mvp-launcher`

- [ ] Skor audit production-ready-hardener ≥ 85
- [ ] Middleware Edge (Vercel/Cloudflare) dikonfigurasi untuk routing multi-tenant
- [ ] Mode Stripe Live dikonfigurasi
- [ ] Monitoring error dan analytics aktif
- [ ] Dokumentasi diperbarui (CHANGELOG, BLUEPRINT, README)

---

### Metodologi Penilaian

Setiap fase dinilai 0-100 berdasarkan penyelesaian checklist:
- **95-100**: Selesai ✅
- **80-94**: Hampir selesai, gap minor ⚠️
- **60-79**: Item signifikan hilang 🟡
- **Di bawah 60**: Fase belum diimplementasikan 🔴

**Skor Keseluruhan** = Rata-rata berbobot:
- Discovery (5%) + Multi-Tenancy (**20%**) + Auth (10%) + Billing (**20%**) + Teams (10%) + Frontend (10%) + API & Gating (10%) + Pengujian (5%) + Produksi (10%)

### Referensi Dokumentasi
- [SaaS Transformation Checklist](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/saas-transformer/references/saas_transformation_checklist.md)
- [Billing Integration Guide](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/saas-transformer/references/billing_integration_guide.md)
- [Feature Gating Patterns](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/saas-transformer/references/feature_gating_patterns.md)
