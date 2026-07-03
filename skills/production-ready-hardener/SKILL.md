---
name: production-ready-hardener
description: "Ultimate production readiness skill that orchestrates all relevant skills (frontend, backend, security, performance, SEO, testing, DevOps) to harden applications before deployment / Skill kesiapan produksi utama yang mengorkestrasi semua skill relevan (frontend, backend, keamanan, performa, SEO, testing, DevOps) untuk mengeraskan aplikasi sebelum deployment."
author: "Roedy Rustam"
---

# Production-Ready Hardener

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
The **Production-Ready Hardener** is a master orchestrator skill that combines and delegates to all relevant vibes-plug skills to ensure your application is rock-solid, secure, performant, and production-grade before deployment. It acts as a comprehensive pre-production checklist that leaves no stone unturned — from frontend polish to backend resilience, from data security to observability.

This skill does NOT replace individual skills — it **coordinates** them into a structured, phased audit-and-hardening workflow.

### Orchestrated Skills Map

```
┌─────────────────────────────────────────────────────────┐
│              PRODUCTION-READY HARDENER                   │
│                 (Master Orchestrator)                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─── PHASE 1: Architecture & Code Quality ──────────┐  │
│  │  • scalability-clean-code (SOLID, DRY, Clean Arch) │  │
│  │  • fullstack-expert (System Design, API Design)    │  │
│  │  • senior-fullstack (Tech Stack, Patterns)         │  │
│  │  • app-analyzer-optimizer (Deep Analysis)          │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─── PHASE 2: Frontend Hardening ───────────────────┐  │
│  │  • senior-frontend (React 19, Next.js 15, a11y)   │  │
│  │  • tailwind-expert (CSS-first, responsive)         │  │
│  │  • ui-ux-pro-max / hig (Design consistency)        │  │
│  │  • tanstack-query-expert (State & caching)         │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─── PHASE 3: Backend Hardening ────────────────────┐  │
│  │  • fullstack-expert (Multi-language backends)      │  │
│  │  • senior-fullstack (DB, connection pooling)       │  │
│  │  • python-programming-expert (if Python)           │  │
│  │  • rust-programming-expert (if Rust)               │  │
│  │  • bun-runtime-expert (if Bun)                     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─── PHASE 4: Security Hardening ───────────────────┐  │
│  │  • supabase-security-expert (RLS, RBAC, secrets)   │  │
│  │  • firebase-security-expert (Rules, App Check)     │  │
│  │  • secure-fuzz-testing (Fuzzing, sanitizers)       │  │
│  │  • fullstack-expert (OWASP, defense-in-depth)      │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─── PHASE 5: Testing & Quality Assurance ──────────┐  │
│  │  • e2e-testing-expert (Playwright, Vitest, CI/CD)  │  │
│  │  • coderabbit (Automated code review)              │  │
│  │  • secure-fuzz-testing (Security testing)          │  │
│  │  • senior-frontend (Vitest, Playwright)            │  │
│  │  • senior-fullstack (CI/CD test matrix)            │  │
│  └────────────────────────────────────────────────────┘  │

│                                                          │
│  ┌─── PHASE 6: Performance & SEO ────────────────────┐  │
│  │  • seo (Full SEO audit, Core Web Vitals)           │  │
│  │  • seo-geo (AI search readiness / GEO)             │  │
│  │  • app-analyzer-optimizer (Bundle & perf)          │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─── PHASE 7: DevOps & Deployment ─────────────────┐  │
│  │  • fullstack-expert (Docker, K8s, Terraform)       │  │
│  │  • senior-fullstack (CI/CD, Docker Compose)        │  │
│  │  • auto-doc-updater (CHANGELOG, BLUEPRINT)         │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Execution Protocol

When this skill is triggered, execute the following 7-phase hardening process **in order**. Each phase produces findings and recommendations. At the end, compile a **Production Readiness Report**.

---

#### PHASE 1: Architecture & Code Quality Audit
**Orchestrates:** `scalability-clean-code`, `fullstack-expert`, `senior-fullstack`, `app-analyzer-optimizer`

**Checklist:**
- [ ] **Project structure** follows clean architecture (Domain → Use Cases → Adapters → Infrastructure)
- [ ] **SOLID principles** are applied consistently — no god classes, no leaky abstractions
- [ ] **DRY violations** identified and refactored into shared utilities/services
- [ ] **API contracts** are spec-first (OpenAPI/GraphQL schema) with proper versioning
- [ ] **Error handling** is structured and consistent (RFC 7807 Problem Details or equivalent)
- [ ] **TypeScript strict mode** enabled (`strict: true` in tsconfig), no `any` types
- [ ] **Input validation** on all API boundaries (Zod, Pydantic, or equivalent)
- [ ] **No hardcoded values** — all config via environment variables or config files
- [ ] **Dead code eliminated** — no unused imports, functions, or dependencies
- [ ] **Dependency audit** — all packages up-to-date, no known CVEs (`npm audit`, `pip audit`)

---

#### PHASE 2: Frontend Hardening
**Orchestrates:** `senior-frontend`, `tailwind-expert`, `ui-ux-pro-max`, `hig`, `tanstack-query-expert`

**Checklist:**
- [ ] **Server Components by default** — `'use client'` only when truly needed (state, events, browser APIs)
- [ ] **Proper Suspense boundaries** with meaningful loading states (skeletons, not spinners)
- [ ] **Error boundaries** on all page segments with user-friendly error UI
- [ ] **React 19 patterns** properly used (`useActionState`, `useOptimistic`, `useFormStatus`)
- [ ] **No hydration mismatches** — no client-only state (`localStorage`, `window`) in initial render
- [ ] **Accessibility (a11y)** — semantic HTML, ARIA labels, keyboard navigation, focus management
- [ ] **Responsive design** — works flawlessly on mobile (320px), tablet, and desktop
- [ ] **Image optimization** — `next/image` with proper sizes, WebP/AVIF format, lazy loading
- [ ] **Font optimization** — `next/font` with font-display: swap, preconnect to font CDN
- [ ] **Bundle analysis** — no unnecessary large libraries, proper code splitting & lazy loading
- [ ] **Meta tags** — proper title, description, OG tags, canonical URL on every page
- [ ] **State management** — TanStack Query for server state, Zustand/Jotai for client state (no mixing)
- [ ] **Caching strategy** — proper `staleTime`, `gcTime`, and query key factory patterns
- [ ] **UI consistency** — design tokens applied consistently (colors, spacing, typography)

---

#### PHASE 3: Backend Hardening
**Orchestrates:** `fullstack-expert`, `senior-fullstack`, language-specific experts

**Checklist:**
- [ ] **Database migrations** — all schema changes via managed migrations (never manual ALTER in production)
- [ ] **Connection pooling** configured (PgBouncer/Supavisor for PostgreSQL, HikariCP for Java)
- [ ] **Proper indexes** on all frequently queried columns (`WHERE`, `JOIN`, `ORDER BY`)
- [ ] **N+1 query prevention** — eager loading or DataLoader pattern for relational data
- [ ] **Query profiling** — `EXPLAIN ANALYZE` run on critical queries, no Seq Scans on large tables
- [ ] **Database backups** — automated backup strategy with tested restore procedures
- [ ] **API rate limiting** — token bucket or sliding window on all public endpoints
- [ ] **Idempotency keys** — all mutation endpoints handle retries safely
- [ ] **Pagination** — cursor-based for large datasets, with consistent response format
- [ ] **Background jobs** — heavy tasks (email, PDF, image processing) use job queues (BullMQ, Celery)
- [ ] **Graceful shutdown** — proper SIGTERM handling, drain connections before exit
- [ ] **Health check endpoints** — `/healthz` (liveness) and `/readyz` (readiness) implemented
- [ ] **Request timeout** — all HTTP/database calls have explicit timeout values
- [ ] **Error logging** — structured JSON logging with correlation IDs for request tracing

---

#### PHASE 4: Security Hardening
**Orchestrates:** `supabase-security-expert`, `firebase-security-expert`, `secure-fuzz-testing`, `fullstack-expert`

**Checklist:**
- [ ] **Authentication** — OAuth 2.0 / OIDC implementation (Clerk, NextAuth, Lucia, Firebase Auth)
- [ ] **Authorization** — RBAC/ABAC with proper middleware on all protected routes
- [ ] **Row-Level Security (RLS)** — enabled on ALL public tables in Supabase/PostgreSQL
- [ ] **Security Rules** — Firebase Firestore/Storage rules are strict (no `allow read, write: if true`)
- [ ] **CORS configuration** — explicit allow-list of origins (never `*` in production)
- [ ] **CSP headers** — Content-Security-Policy configured with strict directives
- [ ] **HTTPS enforced** — HSTS header with `max-age=31536000; includeSubDomains; preload`
- [ ] **Secrets management** — all secrets in environment variables or secret managers (never in code)
- [ ] **`.gitignore` audit** — `.env`, `service-account.json`, private keys are excluded
- [ ] **SQL injection prevention** — all queries use parameterized statements (never string concatenation)
- [ ] **XSS prevention** — output encoding, CSP, no `dangerouslySetInnerHTML` without sanitization
- [ ] **CSRF protection** — anti-CSRF tokens on state-changing forms and endpoints
- [ ] **File upload validation** — content-type checking, size limits, no executable uploads
- [ ] **Webhook signature verification** — all incoming webhooks (Stripe, etc.) validate signatures
- [ ] **Audit logging** — sensitive operations logged (login, data export, permission changes, admin actions)
- [ ] **API key rotation** — strategy in place for rotating secrets without downtime
- [ ] **Dependency vulnerability scan** — `npm audit`, `pip audit`, `cargo audit`, `govulncheck`
- [ ] **App Check / reCAPTCHA** — bot protection on public forms and API endpoints

---

#### PHASE 5: Testing & Quality Assurance
**Orchestrates:** `e2e-testing-expert`, `coderabbit`, `secure-fuzz-testing`, `senior-frontend`, `senior-fullstack`


**Checklist:**
- [ ] **Unit tests** — Vitest/Jest for frontend logic, pytest/go test for backend (≥80% coverage target)
- [ ] **Integration tests** — API endpoint tests with real database (test containers)
- [ ] **E2E tests** — Playwright for critical user flows (signup, login, payment, core features)
- [ ] **Fuzz testing** — coverage-guided fuzzing on parsers, validators, and input processors
- [ ] **Visual regression tests** — screenshot comparisons for UI-critical pages
- [ ] **Accessibility tests** — axe-core or pa11y in CI pipeline
- [ ] **Performance tests** — Lighthouse CI with score thresholds (Performance ≥90, A11y ≥90)
- [ ] **Load testing** — k6 or Artillery for API stress testing (define SLOs: p99 < 500ms)
- [ ] **Code review automation** — CodeRabbit or equivalent configured on all PRs
- [ ] **Type checking** — `tsc --noEmit` passes with zero errors in CI
- [ ] **Linting** — ESLint/Ruff/clippy runs in CI with zero warnings policy
- [ ] **Pre-commit hooks** — lint-staged + husky for local quality checks

---

#### PHASE 6: Performance & SEO Optimization
**Orchestrates:** `seo`, `seo-geo`, `app-analyzer-optimizer`

**Checklist:**
- [ ] **Core Web Vitals** — LCP < 2.5s, INP < 200ms, CLS < 0.1 (measured with real user data)
- [ ] **Bundle size** — analyzed and optimized (tree-shaking, dynamic imports, no duplicate deps)
- [ ] **CDN** — static assets served via CDN (Cloudflare, CloudFront, Vercel Edge)
- [ ] **Caching headers** — proper `Cache-Control` on static assets (immutable, max-age=31536000)
- [ ] **Database read replicas** — configured for read-heavy workloads
- [ ] **Multi-tier caching** — Browser → CDN → Application (Redis) → Database
- [ ] **SEO meta tags** — title, description, canonical URL, OG/Twitter cards on every page
- [ ] **Structured data** — Schema.org markup for relevant content (Product, Article, FAQ, etc.)
- [ ] **Sitemap** — XML sitemap generated and submitted to Google Search Console
- [ ] **robots.txt** — properly configured (no accidental disallow of important pages)
- [ ] **AI search readiness** — `llms.txt`, semantic HTML, clean extractable content
- [ ] **Page speed** — Lighthouse score ≥ 90 on all key pages

---

#### PHASE 7: DevOps & Deployment Readiness
**Orchestrates:** `fullstack-expert`, `senior-fullstack`, `auto-doc-updater`

**Checklist:**
- [ ] **Docker** — multi-stage builds, non-root user, HEALTHCHECK, `.dockerignore` configured
- [ ] **CI/CD pipeline** — automated lint → test → build → deploy on every push/PR
- [ ] **Environment parity** — dev/staging/production use identical Docker images
- [ ] **Database migrations** — run automatically in CI/CD before deployment
- [ ] **Zero-downtime deployment** — rolling updates or blue-green deployment strategy
- [ ] **Rollback strategy** — ability to revert to previous version within minutes
- [ ] **Monitoring & alerting** — Sentry (errors), Prometheus/Grafana (metrics), OpenTelemetry (traces)
- [ ] **Structured logging** — JSON format with `timestamp`, `level`, `message`, `correlationId`
- [ ] **SLIs/SLOs defined** — error rate < 0.1%, p99 latency < 500ms, uptime > 99.9%
- [ ] **Incident response** — documented runbook for common failure scenarios
- [ ] **Backup & disaster recovery** — automated database backups, tested restore procedure
- [ ] **Environment variables** — all secrets stored in secure secrets manager (Vault, AWS SSM, etc.)
- [ ] **SSL/TLS certificates** — auto-renewal configured (Let's Encrypt / cloud provider)
- [ ] **Documentation** — CHANGELOG.md and BLUEPRINT.md up-to-date via `auto-doc-updater`
- [ ] **README** — clear setup instructions, architecture diagram, and deployment guide

---

### Automated Readiness Scanner
An automated Python scanner script is included at [production_readiness_scanner.py](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/production-ready-hardener/scripts/production_readiness_scanner.py) to perform all check phases automatically. It automatically detects technology stacks (Vite, React 19, Supabase, Vitest, Playwright, ESLint) and parses local developer logs (`tsc_errors.txt`, `eslint_output.txt`, etc.) to calculate a live readiness score and compile an interactive, clickable markdown report (`PRODUCTION_READINESS_REPORT.md`).

**Usage:**
```bash
# Run basic static checklist checks on a project
python scripts/production_readiness_scanner.py /path/to/project

# Run active compilation, linting, and test execution diagnostics
python scripts/production_readiness_scanner.py /path/to/project --run-tsc --run-lint --run-tests --run-build
```

---

### Production Readiness Report Format

After completing all 7 phases, compile a **Production Readiness Report** with:

```markdown
# Production Readiness Report

## Executive Summary
Overall readiness score (0-100) with letter grade (A/B/C/D/F).

## Phase Scores
| Phase | Score | Critical Issues | Warnings |
|-------|-------|-----------------|----------|
| 1. Architecture & Code Quality | XX/100 | N | N |
| 2. Frontend Hardening | XX/100 | N | N |
| 3. Backend Hardening | XX/100 | N | N |
| 4. Security Hardening | XX/100 | N | N |
| 5. Testing & QA | XX/100 | N | N |
| 6. Performance & SEO | XX/100 | N | N |
| 7. DevOps & Deployment | XX/100 | N | N |

## 🔴 Critical Issues (Must Fix Before Production)
List of blockers that MUST be resolved.

## 🟡 Warnings (Should Fix)
List of important improvements.

## 🔵 Recommendations (Nice to Have)
List of enhancements for future iterations.

## Remediation Plan
Step-by-step action items ordered by priority.
```

### Scoring Methodology

Each phase is scored 0-100 based on checklist completion:
- **95-100**: Production-ready ✅
- **80-94**: Needs minor fixes ⚠️
- **60-79**: Significant issues 🟡
- **Below 60**: Not production-ready 🔴

**Overall Score** = Weighted average:
- Architecture (10%) + Frontend (15%) + Backend (15%) + **Security (25%)** + Testing (15%) + Performance (10%) + DevOps (10%)

> **Note:** Security is weighted highest because data breaches and vulnerabilities are the most damaging production issues.

### Trigger Conditions
Active whenever the user asks to:
1. Prepare an application for production deployment.
2. Run a production readiness review, pre-launch checklist, or hardening audit.
3. Ensure an application is secure, performant, and robust before going live.
4. Perform a comprehensive quality audit across frontend, backend, and infrastructure.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
**Production-Ready Hardener** adalah skill orkestrator utama yang menggabungkan dan mendelegasikan ke semua skill vibes-plug yang relevan untuk memastikan aplikasi Anda kokoh, aman, berperforma tinggi, dan siap produksi sebelum deployment. Skill ini berfungsi sebagai checklist pra-produksi komprehensif yang tidak meninggalkan celah — dari polish frontend hingga ketahanan backend, dari keamanan data hingga observability.

Skill ini TIDAK menggantikan skill individual — ia **mengoordinasikan** mereka ke dalam alur kerja audit-dan-pengerasan yang terstruktur dan bertahap.

### Peta Skill yang Diorkestrasi

| Fase | Skill yang Digunakan | Fokus |
|------|---------------------|-------|
| 1. Arsitektur & Kualitas Kode | `scalability-clean-code`, `fullstack-expert`, `senior-fullstack`, `app-analyzer-optimizer` | SOLID, DRY, Clean Architecture, API Design |
| 2. Pengerasan Frontend | `senior-frontend`, `tailwind-expert`, `ui-ux-pro-max`, `hig`, `tanstack-query-expert` | React 19, a11y, responsif, state management |
| 3. Pengerasan Backend | `fullstack-expert`, `senior-fullstack`, expert bahasa spesifik | Database, pooling, rate limiting, job queues |
| 4. Pengerasan Keamanan | `supabase-security-expert`, `firebase-security-expert`, `secure-fuzz-testing`, `fullstack-expert` | RLS, RBAC, OWASP, secrets, XSS/CSRF |
| 5. Testing & QA | `e2e-testing-expert`, `coderabbit`, `secure-fuzz-testing`, `senior-frontend`, `senior-fullstack` | E2E (Playwright), Unit (Vitest), fuzz, CI/CD pipelines |
| 6. Performa & SEO | `seo`, `seo-geo`, `app-analyzer-optimizer` | Core Web Vitals, bundle, CDN, sitemap |
| 7. DevOps & Deployment | `fullstack-expert`, `senior-fullstack`, `auto-doc-updater` | Docker, CI/CD, monitoring, rollback |

### Protokol Eksekusi

Ketika skill ini dipicu, jalankan **7 fase pengerasan berurutan**. Setiap fase menghasilkan temuan dan rekomendasi. Di akhir, compile sebuah **Laporan Kesiapan Produksi**.

---

#### FASE 1: Audit Arsitektur & Kualitas Kode
- [ ] Struktur proyek mengikuti clean architecture
- [ ] Prinsip SOLID diterapkan konsisten
- [ ] Pelanggaran DRY diidentifikasi dan di-refactor
- [ ] Kontrak API menggunakan desain spec-first (OpenAPI/GraphQL)
- [ ] Error handling terstruktur dan konsisten
- [ ] TypeScript strict mode aktif, tanpa tipe `any`
- [ ] Validasi input di semua batas API (Zod, Pydantic)
- [ ] Tidak ada hardcoded value — semua konfigurasi via environment variable
- [ ] Dead code dieliminasi
- [ ] Audit dependensi — semua paket up-to-date, tanpa CVE

#### FASE 2: Pengerasan Frontend
- [ ] Server Components secara default
- [ ] Suspense boundary dengan loading state bermakna
- [ ] Error boundary di setiap segmen halaman
- [ ] Pattern React 19 digunakan dengan benar
- [ ] Tidak ada hydration mismatch
- [ ] Aksesibilitas (a11y) — HTML semantik, ARIA, navigasi keyboard
- [ ] Desain responsif — berfungsi sempurna di mobile, tablet, desktop
- [ ] Optimasi gambar dengan `next/image`, WebP/AVIF, lazy loading
- [ ] Analisis bundle — tanpa library besar yang tidak perlu
- [ ] Meta tags lengkap di setiap halaman
- [ ] Strategi state management dan caching yang tepat

#### FASE 3: Pengerasan Backend
- [ ] Semua perubahan schema via database migration
- [ ] Connection pooling dikonfigurasi
- [ ] Index yang tepat pada kolom yang sering di-query
- [ ] Pencegahan N+1 query
- [ ] API rate limiting aktif
- [ ] Idempotency key untuk mutation endpoint
- [ ] Background job queue untuk tugas berat
- [ ] Graceful shutdown dengan penanganan SIGTERM
- [ ] Health check endpoint (`/healthz`, `/readyz`)
- [ ] Structured logging dengan correlation ID

#### FASE 4: Pengerasan Keamanan
- [ ] Autentikasi OAuth 2.0 / OIDC
- [ ] Otorisasi RBAC/ABAC pada semua route dilindungi
- [ ] RLS aktif di SEMUA tabel publik (Supabase/PostgreSQL)
- [ ] Firebase Security Rules ketat
- [ ] CORS dengan allow-list eksplisit (bukan `*`)
- [ ] CSP headers dikonfigurasi
- [ ] HTTPS dipaksakan dengan HSTS
- [ ] Semua secret di environment variable / secret manager
- [ ] `.gitignore` mencakup `.env` dan file sensitif
- [ ] Pencegahan SQL injection, XSS, CSRF
- [ ] Validasi file upload (content-type, size limit)
- [ ] Verifikasi tanda tangan webhook
- [ ] Audit logging untuk operasi sensitif
- [ ] Scan kerentanan dependensi

#### FASE 5: Testing & Quality Assurance
- [ ] Unit test (≥80% coverage)
- [ ] Integration test dengan database real
- [ ] E2E test untuk alur kritis (Playwright)
- [ ] Fuzz testing pada parser dan validator
- [ ] Accessibility test dalam CI pipeline
- [ ] Performance test (Lighthouse CI ≥90)
- [ ] Code review automation (CodeRabbit)
- [ ] Type checking dan linting di CI tanpa error

#### FASE 6: Optimasi Performa & SEO
- [ ] Core Web Vitals memenuhi target (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Bundle size dioptimasi
- [ ] CDN untuk aset statis
- [ ] Caching multi-tier (Browser → CDN → Redis → Database)
- [ ] SEO meta tags lengkap
- [ ] Structured data (Schema.org)
- [ ] XML Sitemap
- [ ] Kesiapan AI search (llms.txt, HTML semantik)

#### FASE 7: DevOps & Kesiapan Deployment
- [ ] Docker multi-stage build, non-root user, HEALTHCHECK
- [ ] CI/CD pipeline otomatis (lint → test → build → deploy)
- [ ] Zero-downtime deployment (rolling update / blue-green)
- [ ] Strategi rollback yang teruji
- [ ] Monitoring & alerting (Sentry, Prometheus/Grafana, OpenTelemetry)
- [ ] Structured logging format JSON
- [ ] SLI/SLO terdefinisi
- [ ] Backup database otomatis dengan prosedur restore yang teruji
- [ ] Dokumentasi terkini (CHANGELOG.md, BLUEPRINT.md, README)

---

### Scanner Kesiapan Otomatis
Script scanner Python otomatis tersedia di [production_readiness_scanner.py](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/production-ready-hardener/scripts/production_readiness_scanner.py) untuk menjalankan seluruh fase pemeriksaan secara otomatis. Scanner ini mendeteksi stack teknologi (Vite, React 19, Supabase, Vitest, Playwright, ESLint) serta mem-parsing file log error lokal (`tsc_errors.txt`, `eslint_output.txt`, dll) untuk mengkalkulasi skor kesiapan rilis dan menyusun laporan markdown interaktif (`PRODUCTION_READINESS_REPORT.md`).

**Cara Penggunaan:**
```bash
# Jalankan pemeriksaan checklist statis dasar pada proyek
python scripts/production_readiness_scanner.py /path/to/project

# Jalankan diagnostik aktif termasuk typecheck tsc, linter eslint, unit test, dan bundle build
python scripts/production_readiness_scanner.py /path/to/project --run-tsc --run-lint --run-tests --run-build
```

---

### Metodologi Penilaian

Setiap fase dinilai 0-100 berdasarkan penyelesaian checklist:
- **95-100**: Siap produksi ✅
- **80-94**: Perlu perbaikan minor ⚠️
- **60-79**: Ada masalah signifikan 🟡
- **Di bawah 60**: Belum siap produksi 🔴

**Skor Keseluruhan** = Rata-rata berbobot:
- Arsitektur (10%) + Frontend (15%) + Backend (15%) + **Keamanan (25%)** + Testing (15%) + Performa (10%) + DevOps (10%)

> **Catatan:** Keamanan diberi bobot tertinggi karena pelanggaran data dan kerentanan adalah masalah produksi yang paling merusak.

### Kondisi Pemicu
Aktif setiap kali pengguna meminta untuk:
1. Mempersiapkan aplikasi untuk deployment produksi.
2. Menjalankan review kesiapan produksi, checklist pra-peluncuran, atau audit pengerasan.
3. Memastikan aplikasi aman, berperforma tinggi, dan kokoh sebelum go-live.
4. Melakukan audit kualitas komprehensif di seluruh frontend, backend, dan infrastruktur.

### Referensi Dokumentasi
- [Production Readiness Checklist](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/production-ready-hardener/references/production_checklist.md)
- [Security Hardening Guide](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/production-ready-hardener/references/security_hardening_guide.md)
- [Performance Optimization Guide](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/production-ready-hardener/references/performance_optimization.md)
