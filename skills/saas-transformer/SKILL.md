---
name: saas-transformer
description: "Transforms regular applications into complete SaaS platforms with multi-tenancy, billing, team management, and feature gating — orchestrating all relevant vibes-plug skills / Mentransformasi aplikasi biasa menjadi platform SaaS lengkap dengan multi-tenancy, billing, manajemen tim, dan feature gating — mengorkestrasi semua skill vibes-plug yang relevan."
author: "vibes-plug-swarm"
---

# SaaS Transformer

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
The **SaaS Transformer** is a master orchestrator skill that guides the complete transformation of an existing regular application into a fully-featured SaaS platform. Unlike `saas-mvp-launcher` (which builds from scratch) or `saas-multi-tenant` (which only handles data isolation), this skill takes an **already working application** and systematically adds every layer needed to make it a commercial SaaS product.

This skill does NOT replace individual skills — it **coordinates** them into a structured, **9-phase** transformation workflow.

### Orchestrated Skills Map

```
┌──────────────────────────────────────────────────────────────────┐
│                     SAAS-TRANSFORMER                             │
│              (Master Orchestrator — 9 Phases)                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─── PHASE 1: Discovery & Architecture Analysis ─────────────┐  │
│  │  • session-context-loader (Project context & blueprint)    │  │
│  │  • app-analyzer-optimizer (Codebase audit & bottlenecks)   │  │
│  │  • prd-architect (SaaS PRD & tier definitions)             │  │
│  │  • brainstorming (Architecture pivot ideation)            │  │
│  │  • mpa-orchestrator / spa-orchestrator (App architecture)  │  │
│  │  • bun-runtime-expert (Runtime performance evaluation)    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── PHASE 2: Multi-Tenancy Foundation ──────────────────────┐  │
│  │  • saas-multi-tenant (Data isolation & tenancy models)    │  │
│  │  • database-orm-expert (Schema migration & Prisma/Drizzle) │  │
│  │  • edge-serverless-db-expert (Neon/D1 connection pool)    │  │
│  │  • supabase-migration (Migrations & SQL policies)         │  │
│  │  • supabase-security-expert (Shared schema RLS policies)  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── PHASE 3: Authentication & Authorization ────────────────┐  │
│  │  • authentication-identity-expert (OAuth2, RBAC/ABAC)     │  │
│  │  • fullstack-expert (Custom claims & session validation)   │  │
│  │  • supabase-security-expert (JWT claims & RLS auth sync)  │  │
│  │  • firebase-security-expert (Rules & App Check setup)     │  │
│  │  • zero-trust-secret-vault (Secret management & rotation)  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── PHASE 4: Billing & Subscription ────────────────────────┐  │
│  │  • saas-billing (Subscription state machine & webhooks)    │  │
│  │  • payment-gateway-expert (Stripe, LemonSqueezy, Midtrans) │  │
│  │  • doku-payment-gateway (DOKU QRIS, VA & checkout APIs)    │  │
│  │  • saas-mvp-launcher (Pricing tier structure & checkout)   │  │
│  │  • email-notification-expert (Invoice & trial emails)      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── PHASE 5: Workspace & Team Management ───────────────────┐  │
│  │  • saas-multi-tenant (Workspace CRUD & membership models)  │  │
│  │  • form-validation-expert (Invite forms & validations)    │  │
│  │  • email-notification-expert (Transactional invite emails) │  │
│  │  • ui-components-expert (Workspace switcher & settings UI) │  │
│  │  • senior-frontend (App shell & settings layout)           │  │
│  │  • ui-ux-pro-max (Design system & accessible components)   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── PHASE 6: SaaS Frontend & Landing ───────────────────────┐  │
│  │  • modern-web-guidance (MANDATORY: Modern web standards)   │  │
│  │  • senior-frontend (App shell & responsive navigation)     │  │
│  │  • tanstack-query-expert (Async state & optimistic UI)     │  │
│  │  • multiple-entry-points (Separate app, landing & admin)   │  │
│  │  • tailwind-expert / design-system-architect (Tokens & UI) │  │
│  │  • seo-aeo-landing-page-writer (High-conversion landing)   │  │
│  │  • seo / seo-geo (SEO, AEO & AI search readiness)          │  │
│  │  • hig (Intuitive layout & visual consistency)             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── PHASE 7: API Layer, Workers & Feature Gating ───────────┐  │
│  │  • api-design-expert (REST, GraphQL, API versioning)       │  │
│  │  • rate-limit-abuse-prevention (Rate limiting & DDoS bot) │  │
│  │  • feature-flag-analytics-expert (Feature gating & flags)  │  │
│  │  • async-queue-temporal-expert (Background job queues)     │  │
│  │  • cron-scheduler-expert (Recurring cron metering tasks)   │  │
│  │  • js-backend-expert / go-programming-expert (APIs)        │  │
│  │  • mcp-server-architect (AI tool endpoints & schemas)      │  │
│  │  • multi-agent-orchestration (Autonomous agent workflows)  │  │
│  │  • scalability-clean-code (Clean architecture & SOLID)    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── PHASE 8: Testing, Security & Quality Assurance ─────────┐  │
│  │  • e2e-testing-expert (Playwright E2E & Vitest flows)      │  │
│  │  • browser-automation-expert (Visual regression testing)   │  │
│  │  • secure-fuzz-testing (Input & stream parser fuzzing)     │  │
│  │  • error-resilience-expert (Retry logic & circuit breakers)│  │
│  │  • logging-error-tracking-expert (Structured logs & Sentry)│  │
│  │  • coderabbit (AI code review & PR summarization)          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── PHASE 9: Production Hardening, Cloud & Handoff ─────────┐  │
│  │  • production-ready-hardener (Comprehensive production audit)│
│  │  • cloud-hosting-expert (Edge middleware & custom domains) │  │
│  │  • ci-cd-devops-architect (Deployment pipelines & IaC)     │  │
│  │  • data-telemetry-expert (Observability & PostHog metrics) │  │
│  │  • performance-web-vitals (Lighthouse & Core Web Vitals)   │  │
│  │  • session-handoff-resume (Save state checkpoint)          │  │
│  │  • auto-doc-updater (CHANGELOG & BLUEPRINT automation)     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
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
**Orchestrates:** `session-context-loader`, `app-analyzer-optimizer`, `prd-architect`, `brainstorming`, `mpa-orchestrator`, `spa-orchestrator`, `bun-runtime-expert`

**Goal:** Understand the existing application and plan the transformation, including architectural pivots.

**Steps:**
1. **Audit the existing codebase** using `app-analyzer-optimizer`:
   - Map all database tables/models and their relationships
   - Identify authentication mechanism (if any)
   - List all API endpoints and their access patterns
   - Assess frontend architecture
2. **Evaluate Core Architecture Shifts**:
   - Consider `mpa-orchestrator` / `spa-orchestrator`: Should we consolidate into a Single Repo MPA or split into SPA micro-apps?
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
**Orchestrates:** `saas-multi-tenant`, `database-orm-expert`, `edge-serverless-db-expert`, `supabase-migration`, `supabase-security-expert` (for Shared Schema RLS)

**Goal:** Add tenant isolation to the database layer.

**Checklist:**
- [ ] Core SaaS tables created (`workspaces`, `workspace_members`, `workspace_invitations`)
- [ ] Decide on Tenancy Model (Shared Schema vs Isolated Schema)
- [ ] Add `tenant_id` / `workspace_id` to all scoped tables (if Shared Schema) or configure dynamic routing (if Isolated Schema) using `database-orm-expert`
- [ ] Apply RLS policies to restrict data access by tenant (if Shared Schema) via `supabase-security-expert`
- [ ] Edge database pooling and serverless connection management configured via `edge-serverless-db-expert`
- [ ] Tenant-aware middleware implemented
- [ ] Existing data backfilled with default tenant

---

#### PHASE 3: Authentication & Authorization
**Orchestrates:** `authentication-identity-expert`, `fullstack-expert`, `supabase-security-expert`, `firebase-security-expert`, `zero-trust-secret-vault`

**Goal:** Implement production-grade auth with role-based access control and zero-trust secret management.

**Checklist:**
- [ ] Auth provider configured with email + at least 1 OAuth provider using `authentication-identity-expert`
- [ ] RBAC roles defined (owner, admin, member, viewer)
- [ ] Authorization middleware protects all routes/endpoints
- [ ] JWT custom claims include `workspace_id` and `role`
- [ ] Session Management Optimization: Implement Edge-ready session validation (e.g., Redis or JWT) to minimize database lookups
- [ ] API keys and secrets stored and rotated securely via `zero-trust-secret-vault`

---

#### PHASE 4: Billing & Subscription
**Orchestrates:** `saas-billing`, `payment-gateway-expert`, `doku-payment-gateway`, `saas-mvp-launcher`, `fullstack-expert`, `senior-frontend`, `email-notification-expert`

**Goal:** Integrate payment processing, local billing sync, and automated transactional communications.

**Checklist:**
- [ ] Pricing tiers defined with Stripe / LemonSqueezy / DOKU products & prices
- [ ] Subscription table created with proper multi-gateway schema via `saas-billing`
- [ ] Payment gateway Checkout integration working (subscribe & upgrade flows) via `payment-gateway-expert` or `doku-payment-gateway`
- [ ] All critical webhooks handled with idempotency (payment succeeded, subscription updated, cancelled)
- [ ] Customer portal accessible (manage subscription, payment methods, invoices)
- [ ] Trial period implemented with expiry notifications sent via `email-notification-expert`

---

#### PHASE 5: Workspace & Team Management
**Orchestrates:** `saas-multi-tenant`, `form-validation-expert`, `email-notification-expert`, `ui-components-expert`, `senior-frontend`, `ui-ux-pro-max`

**Goal:** Build workspace creation, team invitations, role management, and settings UI.

**Checklist:**
- [ ] Workspace CRUD operations working with strict validation (`form-validation-expert`)
- [ ] Workspace switching UI in navbar (`ui-components-expert`)
- [ ] Email invitation flow with secure token link sent via `email-notification-expert`
- [ ] Member role management (view, change, remove)
- [ ] Team size limits enforced by plan

---

#### PHASE 6: SaaS Frontend & Landing
**Orchestrates:** `modern-web-guidance`, `senior-frontend`, `tanstack-query-expert`, `multiple-entry-points`, `tailwind-expert`, `design-system-architect`, `seo-aeo-landing-page-writer`, `seo`, `seo-geo`, `hig`

**Goal:** Build the SaaS frontend: app shell, dashboard, marketing pages, and super admin panel.

**Steps:**
1. **Modern Web Standards (`modern-web-guidance`)**: **MANDATORY** - Always consult Google's modern web guidance before building frontend features to ensure the use of modern APIs, performance standards, and up-to-date best practices.
2. **Architecture Separation (`multiple-entry-points`)**: Separate authenticated SaaS application from marketing pages and the Super Admin dashboard (which MUST be deployed on a separate subdomain like `admin.example.com` for application management).
2. **State Management (`tanstack-query-expert`)**: Implement robust asynchronous state handling, ensuring optimistic UI updates (e.g., when a user updates their profile, the UI reflects it instantly while the server syncs).
3. **App shell / Layout**: Authenticated layout with sidebar navigation, breadcrumbs, and workspace context.
4. **Marketing / Landing page**: Convert users with a highly optimized, SEO/GEO friendly landing page created with `seo-aeo-landing-page-writer`.

**Checklist:**
- [ ] App shell with sidebar, header, workspace switcher
- [ ] Advanced data fetching with TanStack Query (no raw useEffects)
- [ ] Design system tokens configured with `design-system-architect` / `tailwind-expert`
- [ ] Settings pages (account, workspace, team, billing)
- [ ] Landing page with pricing and social proof
- [ ] **MANDATORY**: Automatically scaffold standard pages (About, Profile, Contact, Terms of Reference/Service, Privacy Policy).
- [ ] Super Admin dashboard deployed on a separate subdomain
- [ ] SEO meta tags and Structured data on all public pages (`seo` / `seo-geo`)

---

#### PHASE 7: API Layer, Background Workers & Feature Gating
**Orchestrates:** `api-design-expert`, `rate-limit-abuse-prevention`, `feature-flag-analytics-expert`, `async-queue-temporal-expert`, `cron-scheduler-expert`, `js-backend-expert`, `go-programming-expert`, `mcp-server-architect`, `multi-agent-orchestration`, `scalability-clean-code`

**Goal:** Add API versioning, rate limiting, background job queues, and plan-based feature gating.

**Checklist:**
- [ ] API versioning implemented (`/api/v1/`) with OpenAPI specs (`api-design-expert`)
- [ ] Rate limiting and bot protection configured per plan via `rate-limit-abuse-prevention`
- [ ] Feature flag & gating middleware configured per subscription tier via `feature-flag-analytics-expert`
- [ ] Usage metering tracking API calls, storage, members, and background jobs
- [ ] Durable workflow background jobs configured via `async-queue-temporal-expert` / `cron-scheduler-expert`
- [ ] MCP Server endpoints exposed for AI agents via `mcp-server-architect`

---

#### PHASE 8: Testing, Security & Quality Assurance
**Orchestrates:** `e2e-testing-expert`, `browser-automation-expert`, `secure-fuzz-testing`, `error-resilience-expert`, `logging-error-tracking-expert`, `coderabbit`

**Goal:** Validate core business logic, ensure fault tolerance, and guarantee security before deployment.

**Steps:**
1. **End-to-End Testing (`e2e-testing-expert`)**: Write Playwright tests for critical paths: Signup, Login, Stripe Checkout, and Workspace Invitation.
2. **Visual & Automation Audit (`browser-automation-expert`)**: Validate responsive UI workflows and visual regression.
3. **Security & Fuzzing (`secure-fuzz-testing`)**: Write coverage-guided fuzz tests for custom data parsers, file uploads, or binary data streams to prevent memory leaks and unexpected crashes.
4. **Resilience & Observability (`error-resilience-expert`, `logging-error-tracking-expert`)**: Configure circuit breakers, retry strategies, structured logging, and Sentry error tracking.
5. **Automated Review (`coderabbit`)**: Configure CodeRabbit to automatically review all PRs going into main, ensuring code quality and summarizing architectural changes.

**Checklist:**
- [ ] Playwright E2E tests passing for authentication & billing flows
- [ ] Fuzz tests implemented for critical parsers/endpoints
- [ ] Circuit breakers and retries configured for third-party API dependencies
- [ ] Structured logging and error tracking (Sentry) active
- [ ] `.coderabbit.yaml` configured for automated PR reviews
- [ ] All unit/integration tests (Vitest) passing in CI

---

#### PHASE 9: Production Hardening, Cloud Deployment & Handoff
**Orchestrates:** `production-ready-hardener`, `cloud-hosting-expert`, `ci-cd-devops-architect`, `data-telemetry-expert`, `performance-web-vitals`, `session-handoff-resume`, `auto-doc-updater`

**Goal:** Harden the application, deploy to Edge/Cloud architecture, establish CI/CD pipelines, and document state.

**Steps:**
1. **Hardening**: Run the full `production-ready-hardener` audit.
2. **Edge & Cloud Deployment (`cloud-hosting-expert`, `ci-cd-devops-architect`)**: 
   - Deploy to Vercel/Cloudflare with CI/CD GitHub Actions pipelines.
   - Configure Edge Middleware for tenant identification (e.g., rewriting `tenant1.myapp.com`).
   - Implement custom domains using Cloudflare for SaaS.
3. **Performance & Telemetry (`performance-web-vitals`, `data-telemetry-expert`)**: Ensure Core Web Vitals optimization and active telemetry tracking (OpenTelemetry / PostHog).
4. **State Checkpoint & Documentation (`session-handoff-resume`, `auto-doc-updater`)**: Save ultra-compact state checkpoint and update `CHANGELOG.md` and `BLUEPRINT.md`.

**Checklist:**
- [ ] Production-ready-hardener audit score ≥ 85
- [ ] Edge Middleware configured for tenant routing
- [ ] Payment gateway live mode configured and tested
- [ ] Observability, telemetry, and error monitoring active
- [ ] Core Web Vitals pass Performance benchmarks (LCP < 2.5s, INP < 200ms)
- [ ] Documentation updated (CHANGELOG, BLUEPRINT, README)
- [ ] Session state checkpoint saved via `session-handoff-resume`

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

Setiap fase dinilai 0-100 berdasarkan penyelesaian checklist:
- **95-100**: Complete ✅
- **80-94**: Almost complete, minor gaps ⚠️
- **60-79**: Significant items missing 🟡
- **Below 60**: Phase not implemented 🔴

**Overall Score** = Weighted average:
- Discovery (5%) + Multi-Tenancy (**20%**) + Auth (10%) + Billing (**20%**) + Teams (10%) + Frontend (10%) + API & Gating (10%) + Testing (5%) + Production (10%)

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
**SaaS Transformer** adalah skill orkestrator utama yang memandu transformasi lengkap aplikasi biasa menjadi platform SaaS berfitur lengkap. Berbeda dengan `saas-mvp-launcher` (yang membangun dari nol) atau `saas-multi-tenant` (yang hanya menangani isolasi data), skill ini mengambil **aplikasi yang sudah berjalan** dan secara sistematis menambahkan setiap lapisan yang diperlukan untuk menjadikannya produk SaaS komersial.

Skill ini TIDAK menggantikan skill individual — ia **mengoordinasikan** mereka ke dalam alur kerja transformasi terstruktur **9 fase**.

### Peta Skill yang Diorkestrasi

| Fase | Skill yang Digunakan | Fokus Utama |
|------|---------------------|-------------|
| 1. Discovery & Arsitektur | `session-context-loader`, `app-analyzer-optimizer`, `prd-architect`, `brainstorming`, `mpa-orchestrator`, `spa-orchestrator`, `bun-runtime-expert` | Muat konteks, audit codebase, evaluasi MPA vs SPA & Bun runtime |
| 2. Fondasi Multi-Tenancy | `saas-multi-tenant`, `database-orm-expert`, `edge-serverless-db-expert`, `supabase-migration`, `supabase-security-expert` | Model Shared/Isolated Schema, RLS, ORM schema & edge database pooling |
| 3. Autentikasi & Otorisasi | `authentication-identity-expert`, `fullstack-expert`, `supabase-security-expert`, `firebase-security-expert`, `zero-trust-secret-vault` | OAuth2/OIDC, RBAC/ABAC, JWT custom claims, session Edge & secret vault |
| 4. Billing & Langganan | `saas-billing`, `payment-gateway-expert`, `doku-payment-gateway`, `saas-mvp-launcher`, `fullstack-expert`, `senior-frontend`, `email-notification-expert` | Stripe/Midtrans/DOKU, webhook idempotency, sync billing & notifikasi email |
| 5. Workspace & Tim | `saas-multi-tenant`, `form-validation-expert`, `email-notification-expert`, `ui-components-expert`, `senior-frontend`, `ui-ux-pro-max` | Invite flow, token link, manajemen role, UI workspace switcher |
| 6. Frontend SaaS & Landing | `modern-web-guidance`, `senior-frontend`, `tanstack-query-expert`, `multiple-entry-points`, `tailwind-expert`, `design-system-architect`, `seo-aeo-landing-page-writer`, `seo`, `seo-geo`, `hig` | Standar web modern, Separation (App/Landing/Admin), TanStack Query state, landing page SEO |
| 7. API & Feature Gating | `api-design-expert`, `rate-limit-abuse-prevention`, `feature-flag-analytics-expert`, `async-queue-temporal-expert`, `cron-scheduler-expert`, `js-backend-expert`, `go-programming-expert`, `mcp-server-architect`, `multi-agent-orchestration`, `scalability-clean-code` | REST/OpenAPI, rate limiting, feature gating, background jobs & MCP tools |
| 8. Pengujian, Keamanan & QA | `e2e-testing-expert`, `browser-automation-expert`, `secure-fuzz-testing`, `error-resilience-expert`, `logging-error-tracking-expert`, `coderabbit` | Playwright E2E, fuzz testing, error resilience (retry/circuit breaker) & CodeRabbit |
| 9. Pengerasan Produksi & Cloud | `production-ready-hardener`, `cloud-hosting-expert`, `ci-cd-devops-architect`, `data-telemetry-expert`, `performance-web-vitals`, `session-handoff-resume`, `auto-doc-updater` | Edge middleware, CI/CD pipeline, Core Web Vitals, checkpoint & auto-doc |

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
**Mengorkestrasi:** `session-context-loader`, `app-analyzer-optimizer`, `prd-architect`, `brainstorming`, `mpa-orchestrator`, `spa-orchestrator`, `bun-runtime-expert`

- [ ] Semua tabel/model database dipetakan
- [ ] Keputusan arsitektur (MPA vs SPA, Node vs Bun) dievaluasi
- [ ] Mekanisme autentikasi diidentifikasi
- [ ] Tier harga target ditentukan (minimal Free + 1 berbayar)
- [ ] Model tenancy diputuskan (Shared Schema vs Isolated Schema)
- [ ] Provider Auth & Billing dipilih

#### FASE 2: Fondasi Multi-Tenancy
**Mengorkestrasi:** `saas-multi-tenant`, `database-orm-expert`, `edge-serverless-db-expert`, `supabase-migration`, `supabase-security-expert` (untuk RLS Shared Schema)

- [ ] Tabel inti SaaS dibuat (`workspaces`, `workspace_members`, `workspace_invitations`)
- [ ] Tentukan Model Tenancy (Shared Schema vs Isolated Schema)
- [ ] Tambahkan `tenant_id` / `workspace_id` ke semua tabel terkait via `database-orm-expert`
- [ ] Terapkan kebijakan RLS untuk membatasi akses data per tenant via `supabase-security-expert`
- [ ] Konfigurasi edge database pooling dan connection management via `edge-serverless-db-expert`
- [ ] Middleware tenant-aware diimplementasikan
- [ ] Data existing di-backfill dengan tenant default

#### FASE 3: Autentikasi & Otorisasi
**Mengorkestrasi:** `authentication-identity-expert`, `fullstack-expert`, `supabase-security-expert`, `firebase-security-expert`, `zero-trust-secret-vault`

- [ ] Provider auth dikonfigurasi (email + minimal 1 OAuth) menggunakan `authentication-identity-expert`
- [ ] Role RBAC didefinisikan (owner, admin, member, viewer)
- [ ] Middleware otorisasi melindungi semua route/endpoint
- [ ] JWT custom claims mencakup `workspace_id` dan `role`
- [ ] Optimasi Session Management: Implementasikan validasi sesi Edge-ready (contoh: Redis atau JWT) untuk meminimalkan beban query ke database
- [ ] API keys dan rahasia disimpan & dirotasi aman via `zero-trust-secret-vault`

#### FASE 4: Billing & Langganan
**Mengorkestrasi:** `saas-billing`, `payment-gateway-expert`, `doku-payment-gateway`, `saas-mvp-launcher`, `fullstack-expert`, `senior-frontend`, `email-notification-expert`

- [ ] Tier harga didefinisikan pada Stripe / LemonSqueezy / DOKU
- [ ] Tabel subscription dibuat dengan schema multi-gateway via `saas-billing`
- [ ] Integrasi Checkout (subscribe & upgrade) berfungsi via `payment-gateway-expert` atau `doku-payment-gateway`
- [ ] Semua webhook kritis ditangani dengan idempotency (pembayaran berhasil, langganan berubah, pembatalan)
- [ ] Portal pelanggan diakses (manajemen langganan, metode pembayaran, invoice)
- [ ] Penanganan periode trial dan notifikasi email via `email-notification-expert`

#### FASE 5: Workspace & Manajemen Tim
**Mengorkestrasi:** `saas-multi-tenant`, `form-validation-expert`, `email-notification-expert`, `ui-components-expert`, `senior-frontend`, `ui-ux-pro-max`

- [ ] CRUD workspace berfungsi dengan validasi ketat (`form-validation-expert`)
- [ ] UI workspace switching di navbar (`ui-components-expert`)
- [ ] Flow terima/tolak undangan dengan link token unik dikirim via `email-notification-expert`
- [ ] Manajemen role anggota (lihat, ubah, hapus)
- [ ] Batas ukuran tim berdasarkan plan

#### FASE 6: Frontend SaaS & Landing
**Mengorkestrasi:** `modern-web-guidance`, `senior-frontend`, `tanstack-query-expert`, `multiple-entry-points`, `tailwind-expert`, `design-system-architect`, `seo-aeo-landing-page-writer`, `seo`, `seo-geo`, `hig`

- [ ] **MANDATORY**: Konsultasikan panduan web modern Google (`modern-web-guidance`) terlebih dahulu sebelum membangun fitur frontend.
- [ ] Arsitektur dipisah antara aplikasi SaaS, landing page, dan Super Admin (`multiple-entry-points`)
- [ ] Dashboard Super Admin untuk manajemen aplikasi (wajib di-deploy pada subdomain terpisah seperti `admin.domain.com`)
- [ ] App shell dengan sidebar, header, workspace switcher
- [ ] Pengambilan data (data fetching) modern dengan TanStack Query
- [ ] Design system tokens dikonfigurasi via `design-system-architect` / `tailwind-expert`
- [ ] Landing page teroptimasi SEO dengan pricing dan social proof (`seo-aeo-landing-page-writer`)
- [ ] **MANDATORY**: Otomatis buat halaman standar (About, Profile, Contact, Terms of Reference/Service, Privacy Policy).

#### FASE 7: API & Feature Gating
**Mengorkestrasi:** `api-design-expert`, `rate-limit-abuse-prevention`, `feature-flag-analytics-expert`, `async-queue-temporal-expert`, `cron-scheduler-expert`, `js-backend-expert`, `go-programming-expert`, `mcp-server-architect`, `multi-agent-orchestration`, `scalability-clean-code`

- [ ] API versioning diimplementasikan (`/api/v1/`) dengan dokumentasi OpenAPI (`api-design-expert`)
- [ ] Rate limiting dan proteksi bot dikonfigurasi per plan via `rate-limit-abuse-prevention`
- [ ] Sistem feature flags / gating operasional per plan tier via `feature-flag-analytics-expert`
- [ ] Usage metering melacak API calls, storage, members, dan background jobs
- [ ] Background job queues berdurabilitas tinggi via `async-queue-temporal-expert` / `cron-scheduler-expert`
- [ ] Endpoint MCP Server terekspos untuk agen AI via `mcp-server-architect`

#### FASE 8: Pengujian, Keamanan & QA
**Mengorkestrasi:** `e2e-testing-expert`, `browser-automation-expert`, `secure-fuzz-testing`, `error-resilience-expert`, `logging-error-tracking-expert`, `coderabbit`

- [ ] Playwright E2E test disiapkan untuk alur penting (login, checkout, undangan team)
- [ ] Fuzz testing diimplementasikan untuk keamanan parser data (`secure-fuzz-testing`)
- [ ] Ketahanan error (circuit breaker & retry logic) dan logging terstruktur (Sentry) aktif
- [ ] CodeRabbit dikonfigurasi (`.coderabbit.yaml`) untuk AI code review di CI/CD
- [ ] Unit test dan integration test (Vitest) lulus di CI

#### FASE 9: Pengerasan Produksi & Deployment Cloud
**Mengorkestrasi:** `production-ready-hardener`, `cloud-hosting-expert`, `ci-cd-devops-architect`, `data-telemetry-expert`, `performance-web-vitals`, `session-handoff-resume`, `auto-doc-updater`

- [ ] Skor audit production-ready-hardener ≥ 85
- [ ] Middleware Edge (Vercel/Cloudflare) dikonfigurasi untuk routing multi-tenant
- [ ] Pipeline CI/CD dikonfigurasi dengan GitHub Actions (`ci-cd-devops-architect`)
- [ ] Mode Payment Gateway Live dikonfigurasi & diuji
- [ ] Monitoring error, analitik, dan telemetri aktif (`data-telemetry-expert`)
- [ ] Optimasi Core Web Vitals lulus (LCP < 2.5s, INP < 200ms)
- [ ] Dokumentasi diperbarui (CHANGELOG, BLUEPRINT, README)
- [ ] Session state checkpoint disimpan via `session-handoff-resume`

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
