---
name: zero-to-prod-orchestrator
description: "Master orchestrator to build an application from scratch to a production-ready release, enforcing strict step-by-step progression and continuous documentation / Orkestrator utama untuk membangun aplikasi dari nol hingga rilis siap produksi dengan dokumentasi bertahap."
author: "vibes-plug-swarm"
---

# Zero to Production Orchestrator (2026 Master Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Overview
The **Zero to Production Orchestrator** is the ultimate master skill designed to orchestrate the entire `vibes-plug` ecosystem as a highly interconnected **engineering swarm**. By acting as the central conductor, it ensures that no sub-skill is executed in isolation. It guides fullstack developers through the complete software engineering lifecycle — from concept discovery to AI integration, multi-platform backend architecture, design systems, automated testing, GEO/AEO optimization, and production deployment.

### Trigger Conditions
- Starting any new application development from scratch.
- Asking for a complete, end-to-end fullstack development roadmap.
- Orchestrating multiple domain skills across UI, Backend, AI/LLM, Database, Security, and Cloud.

### Core Principles & Hard Gates
1. **Never Skip Phases**: Each phase must be completed and validated before advancing to the next.
2. **Continuous Auto-Documentation**: Invoke `auto-doc-updater` to log changes in `CHANGELOG.md` and `BLUEPRINT.md` after every major milestone.
3. **Strict Progress Tracking**: Maintain a `PROGRESS.md` checklist in the repository root.
4. **State Preservation & Context**: Utilize `session-handoff-resume` when pausing work, and `session-context-loader` on every new session to preserve full context.
5. **Efficiency**: Keep `token-saver` active during large refactors to maintain a lean, powerful execution loop.

---

### The 8-Phase Master Fullstack Pipeline

```
  PHASE 1          PHASE 2          PHASE 3          PHASE 4
Discovery/PRD ---> Foundation ---> Database/ORM ---> Backend/APIs
      |                                                   |
      v                                                   v
  PHASE 8          PHASE 7          PHASE 6          PHASE 5
Launch/Deploy <--- Security/GEO <--- Testing/QA  <--- Frontend/UI
```

#### PHASE 1: Discovery & AI PRD Architectural Planning
**Orchestrates:** `prd-architect`, `brainstorming`, `mcp-server-architect`, `session-context-loader`, `dependency-upgrade-migrator`, `saas-mvp-launcher`, `web-scraper`, `website-design-cloner`
- [ ] Conduct structured dialogue to clarify product intent, target audience, and non-functional goals.
- [ ] Automatically draft a comprehensive Product Requirements Document (PRD.md), Entity Relationship Diagram (ERD.md), and Documentation (DOKUMENTASI.md) alongside the Roadmap (ROADMAP.md).
- [ ] Plan AI/LLM integration strategy (Vercel AI SDK, MCP Server tools, or Multi-Agent Graph).
- [ ] For existing projects: audit dependency health and plan upgrades with `dependency-upgrade-migrator`.
- [ ] Initialize `BLUEPRINT.md` and `PROGRESS.md`.

#### PHASE 2: Project Foundation & Monorepo Setup
**Orchestrates:** `monorepo-architect`, `micro-frontend-architect`, `bun-runtime-expert`, `python-programming-expert`, `go-programming-expert`, `ci-cd-devops-architect`, `rust-programming-expert`, `typescript-expert`
- [ ] Initialize monorepo (Turborepo + pnpm workspaces) or single repo foundation.
- [ ] Set up language runtimes: Node.js 22 LTS / Bun 1.2+ / Python 3.12+ (uv) / Go 1.23+.
- [ ] Configure `Ruff`, `ESLint`, `Prettier`, and TypeScript strict configurations.
- [ ] Setup initial CI/CD pipeline template (GitHub Actions, Docker).

#### PHASE 3: Database & Multi-Tenant Core Architecture
**Orchestrates:** `fullstack-expert`, `database-migration-versioning-expert`, `database-orm-expert`, `domain-driven-design-expert`, `saas-multi-tenant`, `supabase-migration`, `supabase-security-expert`, `edge-serverless-db-expert`, `data-pipeline-etl-expert`
- [ ] Design normalized relational schemas and document models.
- [ ] Configure ORM layer (Drizzle ORM / Prisma 6 / SQLx / sqlc).
- [ ] Implement Row-Level Security (RLS) policies and tenant isolation.
- [ ] Apply initial database migrations and connection poolers (PgBouncer/Supavisor/Neon).

#### PHASE 4: Backend APIs, Microservices & AI Agents
**Orchestrates:** `js-backend-expert`, `go-programming-expert`, `graphql-apollo-expert`, `openapi-swagger-codegen-expert`, `ai-llm-integration-expert`, `ai-prompt-engineering-expert`, `multi-agent-orchestration`, `mcp-server-architect`, `authentication-identity-expert`, `email-notification-expert`, `cron-scheduler-expert`, `rate-limit-abuse-prevention`, `file-upload-media-expert`, `async-queue-temporal-expert`, `background-jobs-queue-expert`, `doku-mcp-server`, `event-driven-architect`, `gemini-agent-booster`, `mobile-push-notification-expert`, `realtime-collaboration-expert`, `api-gateway-proxy-expert`, `wasm-edge-computing-expert`, `sse-websocket-streaming-expert`
- [ ] Build high-throughput REST / GraphQL / gRPC APIs using Fastify 5, NestJS, Hono, Gin, or Axum.
- [ ] Implement authentication (Clerk, Auth.js, Supabase Auth) and RBAC middleware.
- [ ] Build MCP Server tools or stateful LangGraph multi-agent workflows with human-in-the-loop gates.
- [ ] Implement background processing queues (BullMQ + Redis), scheduled jobs, and rate limiters.
- [ ] Set up transactional email pipeline (Resend/Postmark) and notification system.
- [ ] Implement file upload with presigned URLs (S3/R2) and media processing.

#### PHASE 5: Frontend, Design Systems & Mobile Apps
**Orchestrates:** `design-system-architect`, `senior-frontend`, `nextjs-app-router-expert`, `vue-frontend-expert`, `tailwind-expert`, `tanstack-query-expert`, `spa-orchestrator`, `mobile-expo-expert`, `apple-ecosystem-expert`, `tauri-expert`, `form-validation-expert`, `ui-components-expert`, `svg-animation-motion-expert`, `web-3d-graphics-expert`, `web-game-engine-expert`, `glsl-shader-expert`, `webxr-ar-vr-expert`, `visual-qa-vision-agent`, `hig`, `global-a11y-i18n-expert`, `bootstrap-to-modern`, `monday-design-aesthetic`, `state-management-expert`, `ui-ux-pro-max`
- [ ] Implement design tokens (OKLCH) and Tailwind CSS v4 `@theme` directive tokens.
- [ ] Construct accessible component primitives using Radix UI / Base UI and CVA variants.
- [ ] Build React 19 / Next.js 15 pages utilizing Server Components, Server Actions (`useActionState`, `useOptimistic`), advanced animations (GSAP/Anime.js), or Expo Router v4 for Mobile / Tauri v2 for Desktop.
- [ ] Implement complex forms with React Hook Form + Zod validation.
- [ ] If SPA architecture — coordinate with `spa-orchestrator` for routing (TanStack Router), state (TanStack Query v5), and decoupled API layer.
- [ ] Integrate frontend state management with TanStack Query v5.

#### PHASE 6: Automated Testing, Error Resilience & Security Audit
**Orchestrates:** `e2e-testing-expert`, `secure-fuzz-testing`, `firebase-security-expert`, `error-resilience-expert`, `logging-error-tracking-expert`, `vibe-code-gardener`, `coderabbit`, `autonomous-tdd-debugger`, `browser-automation-expert`, `zero-trust-secret-vault`, `autonomous-red-teamer`, `post-quantum-crypto-migrator`, `compliance-gdpr-privacy-expert`
- [ ] Write unit and integration tests with Vitest and pytest.
- [ ] Write resilient E2E browser tests with Playwright.
- [ ] Execute security fuzz testing (Atheris / cargo-fuzz / native Go fuzzing).
- [ ] Implement Error Boundaries, retry patterns, circuit breakers, and graceful degradation.
- [ ] Set up structured logging (Pino) and error tracking (Sentry) with source map uploads.
- [ ] Audit CORS, CSP headers, rate-limiting, and input sanitization.
- [ ] Run code quality audit to purge AI slop and architectural decay.

#### PHASE 7: DevOps, Deployment & Proactive Monitoring
**Orchestrates:** `ci-cd-devops-architect`, `cloud-hosting-expert`, `performance-web-vitals`, `logging-error-tracking-expert`, `production-ready-hardener`, `proactive-background-watcher`, `ai-cost-token-optimizer`, `data-telemetry-expert`, `feature-flag-analytics-expert`, `autonomous-chaos-monkey`, `self-healing-cloud-orchestrator`
- [ ] Perform pre-launch audit across Core Web Vitals (LCP, INP, CLS) and bundle sizes.
- [ ] Configure production monitoring, alerting rules, and on-call notifications.
- [ ] Optimize Generative Engine Optimization (GEO) for AI Overviews, Perplexity, ChatGPT Search, and deploy `/llms.txt`.
- [ ] Generate structured Schema.org JSON-LD markup and AEO conversion landing pages.

#### PHASE 8: Launch, Deployment & Handover
**Orchestrates:** `cloud-hosting-expert`, `saas-billing`, `saas-transformer`, `auto-doc-updater`, `ci-cd-devops-architect`, `doku-payment-gateway`
- [ ] Deploy backend and edge services to Vercel, Cloudflare, AWS, or Railway.
- [ ] For SaaS applications: deploy Super Admin dashboard on a **separate subdomain** (e.g., `admin.yourdomain.com`) with strict role-based access (`isSuperAdmin` flag).
- [ ] Configure Stripe / Polar.sh / LemonSqueezy billing and webhooks.
- [ ] Finalize `CHANGELOG.md`, `BLUEPRINT.md`, and `PROGRESS.md`.
- [ ] Handover the production-grade application to the user.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Ringkasan
**Zero to Production Orchestrator** adalah skill master utama yang dirancang untuk mengorkestrasi seluruh ekosistem `vibes-plug` sebagai sebuah **engineering swarm** yang saling terhubung erat. Dengan bertindak sebagai konduktor pusat, skill ini memastikan tidak ada sub-skill yang dieksekusi secara terisolasi. Skill ini memandu pengembang *fullstack* melalui seluruh siklus hidup rekayasa perangkat lunak — mulai dari tahap ide awal hingga integrasi AI, arsitektur backend multi-platform, design system, pengujian otomatis, optimasi GEO/AEO, dan deployment produksi.

### Kondisi Pemicu
- Memulai pengembangan aplikasi baru dari nol.
- Meminta panduan roadmap pengembangan fullstack end-to-end yang terstruktur.
- Mengorkestrasi berbagai skill spesialis lintas domain (UI, Backend, AI/LLM, Database, Keamanan, dan Cloud).

### Prinsip Inti & Gerbang Ketat
1. **Jangan Pernah Melewati Fase**: Setiap fase harus diselesaikan dan divalidasi sebelum beralih ke fase berikutnya.
2. **Otomatisasi Dokumentasi**: Panggil `auto-doc-updater` untuk memperbarui `CHANGELOG.md` dan `BLUEPRINT.md` setelah setiap milestone utama.
3. **Pelacakan Progres**: Pelihara daftar periksa `PROGRESS.md` di root repositori.
4. **Preservasi State & Konteks**: Gunakan `session-handoff-resume` saat menjeda pekerjaan, dan `session-context-loader` di awal setiap sesi baru untuk menjaga konteks penuh.
5. **Efisiensi**: Aktifkan `token-saver` selama refactoring besar-besaran untuk mempertahankan *loop* eksekusi yang ringkas dan *powerful*.

---

### Master Pipeline Fullstack 8-Fase

#### FASE 1: Discovery & Perencanaan Arsitektur PRD AI
**Mengorkestrasi:** `prd-architect`, `brainstorming`, `mcp-server-architect`, `session-context-loader`, `dependency-upgrade-migrator`, `app-analyzer-optimizer`, `seo`, `project-context-mapper`, `self-evolving-memory-graph`, `saas-mvp-launcher`, `web-scraper`, `website-design-cloner`
- [ ] Dialog terstruktur untuk memperjelas tujuan produk, audiens target, dan persyaratan non-fungsional.
- [ ] Secara otomatis menyusun Product Requirements Document (PRD.md), Entity Relationship Diagram (ERD.md), dan Dokumentasi (DOKUMENTASI.md) yang komprehensif beserta Roadmap (ROADMAP.md).
- [ ] Merencanakan integrasi AI/LLM (Vercel AI SDK, alat MCP Server, atau Graf Multi-Agen).
- [ ] Untuk proyek yang sudah ada: audit kesehatan dependensi dan rencanakan upgrade dengan `dependency-upgrade-migrator`.
- [ ] Menginisialisasi `BLUEPRINT.md` dan `PROGRESS.md`.

#### FASE 2: Pondasi Proyek & Setup Monorepo
**Mengorkestrasi:** `monorepo-architect`, `micro-frontend-architect`, `bun-runtime-expert`, `python-programming-expert`, `go-programming-expert`, `ci-cd-devops-architect`, `spa-orchestrator`, `mpa-orchestrator`, `multiple-entry-points`, `mvc-expert`, `scalability-clean-code`, `api-design-expert`, `legacy-code-translator`, `web-3d-graphics-expert`, `web-game-engine-expert`, `glsl-shader-expert`, `webxr-ar-vr-expert`, `rust-programming-expert`, `typescript-expert`
- [ ] Inisialisasi monorepo (Turborepo + pnpm workspaces) atau repositori tunggal.
- [ ] Menyiapkan runtime bahasa: Node.js 22 LTS / Bun 1.2+ / Python 3.12+ (uv) / Go 1.23+.
- [ ] Konfigurasi `Ruff`, `ESLint`, `Prettier`, dan TypeScript ketat.
- [ ] Menyiapkan template pipeline CI/CD awal (GitHub Actions, Docker).

#### FASE 3: Database & Arsitektur Multi-Tenant
**Mengorkestrasi:** `fullstack-expert`, `database-migration-versioning-expert`, `database-orm-expert`, `domain-driven-design-expert`, `saas-multi-tenant`, `supabase-migration`, `supabase-security-expert`, `edge-serverless-db-expert`, `data-pipeline-etl-expert`
- [ ] Merancang skema relasional ter-normalisasi dan pemodelan dokumen.
- [ ] Konfigurasi lapisan ORM (Drizzle ORM / Prisma 6 / SQLx / sqlc).
- [ ] Mengimplementasikan kebijakan Row-Level Security (RLS) dan isolasi tenant.
- [ ] Menerapkan migrasi database awal dan connection poolers (PgBouncer/Supavisor/Neon).

#### FASE 4: Backend API, Microservices & Agen AI
**Mengorkestrasi:** `js-backend-expert`, `go-programming-expert`, `graphql-apollo-expert`, `openapi-swagger-codegen-expert`, `ai-llm-integration-expert`, `ai-prompt-engineering-expert`, `multi-agent-orchestration`, `mcp-server-architect`, `authentication-identity-expert`, `email-notification-expert`, `cron-scheduler-expert`, `rate-limit-abuse-prevention`, `file-upload-media-expert`, `saas-billing`, `payment-gateway-expert`, `vector-db-rag-expert`, `mcp-client-orchestrator`, `async-queue-temporal-expert`, `background-jobs-queue-expert`, `doku-mcp-server`, `event-driven-architect`, `gemini-agent-booster`, `mobile-push-notification-expert`, `realtime-collaboration-expert`, `api-gateway-proxy-expert`, `wasm-edge-computing-expert`, `sse-websocket-streaming-expert`
- [ ] Bangun API REST / GraphQL / gRPC *high-throughput* menggunakan Fastify 5, NestJS, Hono, Gin, atau Axum.
- [ ] Mengimplementasikan autentikasi (Clerk, Auth.js, Supabase Auth) dan middleware RBAC.
- [ ] Membangun alat MCP Server atau alur kerja multi-agen LangGraph berbasis state dengan gerbang *human-in-the-loop*.
- [ ] Mengimplementasikan antrean pemrosesan latar belakang (BullMQ + Redis), tugas terjadwal, dan rate limiter.
- [ ] Menyiapkan pipeline email transaksional (Resend/Postmark) dan sistem notifikasi.
- [ ] Mengimplementasikan upload file dengan presigned URL (S3/R2) dan pemrosesan media.

#### FASE 5: Frontend, Design System & Mobile App
**Mengorkestrasi:** `design-system-architect`, `senior-frontend`, `nextjs-app-router-expert`, `vue-frontend-expert`, `tailwind-expert`, `tanstack-query-expert`, `spa-orchestrator`, `mobile-expo-expert`, `apple-ecosystem-expert`, `tauri-expert`, `form-validation-expert`, `ui-components-expert`, `svg-animation-motion-expert`, `web-3d-graphics-expert`, `web-game-engine-expert`, `glsl-shader-expert`, `webxr-ar-vr-expert`, `visual-qa-vision-agent`, `hig`, `global-a11y-i18n-expert`, `bootstrap-to-modern`, `monday-design-aesthetic`, `state-management-expert`, `ui-ux-pro-max`
- [ ] Implementasikan token desain (OKLCH) dan konfigurasi tema Tailwind CSS v4.
- [ ] Bangun komponen primitif aksesibel menggunakan Radix UI / Base UI dan CVA.
- [ ] Buat halaman React 19 / Next.js 15 memanfaatkan RSC, Server Actions (`useActionState`), animasi tingkat lanjut (GSAP/Anime.js), atau Expo Router v4 (Mobile) / Tauri v2 (Desktop).
- [ ] Mengimplementasikan formulir kompleks dengan React Hook Form + validasi Zod.
- [ ] Jika arsitektur SPA — koordinasikan dengan `spa-orchestrator` untuk routing (TanStack Router), state (TanStack Query v5), dan API layer terpisah.
- [ ] Mengintegrasikan manajemen state frontend dengan TanStack Query v5.

#### FASE 6: Pengujian Otomatis, Ketahanan Error & Audit Keamanan
**Mengorkestrasi:** `e2e-testing-expert`, `secure-fuzz-testing`, `firebase-security-expert`, `error-resilience-expert`, `logging-error-tracking-expert`, `vibe-code-gardener`, `coderabbit`, `autonomous-tdd-debugger`, `browser-automation-expert`, `zero-trust-secret-vault`, `autonomous-red-teamer`, `post-quantum-crypto-migrator`, `compliance-gdpr-privacy-expert`
- [ ] Menulis unit test dan integration test dengan Vitest dan pytest.
- [ ] Menulis pengujian browser E2E yang tangguh menggunakan Playwright.
- [ ] Menjalankan pengujian fuzzing keamanan (Atheris / cargo-fuzz / native Go fuzzing).
- [ ] Mengimplementasikan Error Boundary, pola retry, circuit breaker, dan degradasi anggun.
- [ ] Menyiapkan logging terstruktur (Pino) dan pelacakan error (Sentry) dengan upload source map.
- [ ] Mengaudit CORS, CSP headers, rate-limiting, dan sanitasi input.
- [ ] Menjalankan audit kualitas kode untuk membersihkan AI slop dan pembusukan arsitektur.

#### FASE 7: Hardening Pra-Peluncuran, Monitoring & DevOps Sentinel
**Mengorkestrasi:** `production-ready-hardener`, `app-analyzer-optimizer`, `seo`, `logging-error-tracking-expert`, `proactive-background-watcher`, `ai-cost-token-optimizer`, `data-telemetry-expert`, `feature-flag-analytics-expert`, `autonomous-chaos-monkey`, `self-healing-cloud-orchestrator`
- [ ] Audit pra-peluncuran pada Core Web Vitals (LCP, INP, CLS) dan ukuran bundle.
- [ ] Mengonfigurasi monitoring produksi, aturan alerting, dan notifikasi on-call.
- [ ] Mengoptimalkan GEO untuk AI Overviews, Perplexity, ChatGPT Search, dan merilis `/llms.txt`.
- [ ] Membuat markup terstruktur Schema.org JSON-LD dan landing page konversi AEO.

#### FASE 8: Peluncuran, Deployment & Serah Terima
**Mengorkestrasi:** `cloud-hosting-expert`, `saas-billing`, `saas-transformer`, `auto-doc-updater`, `ci-cd-devops-architect`, `doku-payment-gateway`
- [ ] Deploy backend dan edge services ke Vercel, Cloudflare, AWS, atau Railway.
- [ ] Untuk aplikasi SaaS: deploy dashboard Super Admin pada **subdomain terpisah** (misal: `admin.domain.com`) dengan kontrol akses berbasis role (`isSuperAdmin`).
- [ ] Konfigurasi billing Stripe / Polar.sh / LemonSqueezy dan webhooks.
- [ ] Menyelesaikan `CHANGELOG.md`, `BLUEPRINT.md`, dan `PROGRESS.md`.
- [ ] Serah terima aplikasi siap produksi kepada pengguna.

---
### 🎨 Automatic Visual Assets Generation Mandate (CRITICAL)
**MANDATORY**: Whenever you are building a new application, scaffolding a project, or finalizing the initial UI/UX, you MUST automatically use the `generate_image` tool to create a custom logo that perfectly matches the application's core concept and aesthetic. 
This generated image MUST be explicitly used as:
1. The primary application logo (e.g., in the header/navbar).
2. The website favicon (`favicon.ico` or equivalent).
3. The Open Graph (OG) image for SEO metadata (`og:image`).

Do not use placeholders for these assets. Generate and integrate them automatically.
