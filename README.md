# Vibes Plug

![Vibes Plug Banner](banner.png)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

**2026 Edition** — Customization plugin for Antigravity containing 65+ specialized *skills* updated for the modern 2026 tech stack (React 19, Tailwind v4, Bun, Hono, Supabase Auth v3). Designed to support software development, UI/UX design, SEO optimization, and SaaS business strategies.

### Features and Available Skills

This plugin provides the following list of skills that can be used by the agent:

#### AI & Agentic Systems
- **AI & LLM Integration Expert** (`ai-llm-integration-expert`): Production-grade guidelines for integrating Large Language Models (LLMs), Model Context Protocol (MCP), RAG architecture, vector databases (`pgvector` HNSW, Qdrant), reasoning models (DeepSeek-R1/V3, Gemini 3.5/3.6, Claude 3.7), Vercel AI SDK 4.x/5.x, and AI agent orchestration.
- **MCP Server Architect** (`mcp-server-architect`): Expert guide for designing, building, and security-hardening Model Context Protocol (MCP) servers across TypeScript, Python, and Go (`stdio` and `SSE` transports, Zod/Pydantic schema validation, permission guardrails).
- **Multi-Agent Orchestration Expert** (`multi-agent-orchestration`): Expert guide for designing multi-agent AI systems, LangGraph stateful graph workflows, CrewAI/AutoGen swarms, supervisor routing, shared memory state, and Human-in-the-Loop guardrails.

#### Design & UI/UX
- **Design System Architect** (`design-system-architect`): Expert guide for designing and maintaining scalable UI Design Systems, Design Tokens (OKLCH), Radix UI / Base UI headless primitives, Tailwind CSS v4 `@theme`, CVA variants, and WCAG 2.2 AAA accessibility.
- **HIG — Human Interface Guidelines** (`hig`): Applies three core interface design principles — **Hierarchy** (clear visual hierarchy), **Harmony** (harmony between elements and platform), and **Consistency** (consistency across all screen sizes and devices, iOS 18/macOS Sequoia).
- **UI/UX Pro Max** (`ui-ux-pro-max`): Comprehensive design guide for web and mobile applications. Contains guides for color palettes, typography, WCAG 2.2 AAA accessibility, micro-animations, and deep UX guidelines.
- **UI/UX Expert** (`ui_ux_expert`): Interface (Frontend) specialist and UI/UX Designer focusing on responsive and interactive layouts.

#### Frontend, Mobile & State
- **App Analyzer & Optimizer** (`app-analyzer-optimizer`): Deeply analyzes application structure and architecture, performs performance/security bottleneck audits (Core Web Vitals, INP), and executes targeted optimizations according to standards.
- **MPA Orchestrator** (`mpa-orchestrator`): Orchestrates Multi-Page Application (MPA) architecture within a single repository.
- **SPA Orchestrator** (`spa-orchestrator`): Orchestrates Single-Page Application (SPA) architecture, integrating frontend state management (TanStack Router/Query) with decoupled API-driven backends.
- **Bootstrap to Modern** (`bootstrap-to-modern`): Expert skill to refactor and migrate legacy Bootstrap CSS applications to modern utility-first stacks using Tailwind CSS v4 and Alpine.js 3 / HTMX.
- **Mobile Expo Expert** (`mobile-expo-expert`): Expert guide for React Native 0.76+ and Expo SDK 52+ development, covering Expo Router v4, React Native New Architecture (Fabric & TurboModules), EAS builds, OTA updates, and NativeWind v4.
- **Performance & Web Vitals** (`performance-web-vitals`): Expert guide for Web Performance optimization — Core Web Vitals (LCP, INP, CLS), JavaScript bundle analysis, image/font loading strategies, React 19 concurrent features (`useTransition`, `useDeferredValue`), virtual lists, and Lighthouse score improvement.
- **Senior Frontend** (`senior-frontend`): React 19, Next.js 15, TypeScript, and Tailwind CSS v4 development expert. Capable of optimizing performance, bundle size, Server Actions, `useActionState`, `useOptimistic`, and designing frontend components.
- **State Management Expert** (`state-management-expert`): Expert guide for modern client-side state management — Zustand 5 (slice pattern, persistence, devtools), Jotai 2 (atomic state, `loadable`), Valtio, Redux Toolkit 2 (Immer, `createAsyncThunk`), and proper separation of server state (TanStack Query) from client state.
- **Tailwind CSS Expert** (`tailwind-expert`): Deep guide for CSS-first Tailwind CSS v4 configuration (`@theme`), modern utility classes, custom state modifiers, OKLCH colors, and container queries.
- **TanStack Query Expert** (`tanstack-query-expert`): Expert in asynchronous state management using TanStack Query v5, `useSuspenseQuery`, optimistic mutations, and Next.js App Router (SSR) hydration.
- **Tauri Expert** (`tauri-expert`): Best practice guide for cross-platform application development with Tauri v2 (Desktop & Mobile), focusing on the Rust backend ecosystem, IPC communication, and security capabilities.

#### Backend, Languages & Runtimes
- **API Design Expert** (`api-design-expert`): Expert guide for designing production-grade APIs — REST resource modeling, HTTP semantics, GraphQL schema design, gRPC with protobuf, tRPC for end-to-end TypeScript type safety, OpenAPI 3.1 documentation, API versioning, rate limiting (sliding window), idempotency keys, and contract-first development.
- **Bun Runtime Expert** (`bun-runtime-expert`): Expert guide for Bun JavaScript/TypeScript runtime (v1.2+), covering built-in APIs (`Bun.serve`, `Bun.sql`, `Bun.s3`), `bun test`, `bun build`, package management, and migration strategies from Node.js.
- **Go Programming Expert** (`go-programming-expert`): Expert-level skill for Go programming (Go 1.23/1.24+). Covers high-performance backend APIs, microservices, concurrency patterns (`errgroup`, context propagation), `sqlc`, `net/http` routing, Gin/Echo/Fiber, gRPC, and table-driven testing.
- **JS Backend Expert** (`js-backend-expert`): Production-grade guidance for modern JavaScript/TypeScript backend APIs across Node.js 22 LTS, Bun 1.2+, and Deno 2.x. Covers Fastify 5, Hono, Express 5, NestJS, Prisma 6, Drizzle ORM, WebSockets, and BullMQ background queues.
- **PHP MVC Expert** (`mvc-expert`): Guidelines for modernizing legacy PHP projects into clean, secure, and structured OOP/MVC architectures adhering to modern PHP (v8.3/8.4+) capabilities and PSR standards.
- **Python Programming Expert** (`python-programming-expert`): Expert-level guide for Python programming (Python 3.12/3.13+), covering PEP 695 type parameter syntax, structured concurrency (`asyncio.TaskGroup`), FastAPI 0.115+, Pydantic v2, `uv` package manager, `Ruff` 0.8+, and pytest 8+.
- **Rust Programming Expert** (`rust-programming-expert`): High-level guide for Rust programming (Rust 2024 / v1.85+), covering memory safety (ownership/lifetimes), asynchronous programming (Tokio, async closures), web backends (Axum 0.8+, SQLx 0.8+), CLI (Clap, Serde), performance optimization, and unsafe code management.
- **TypeScript Expert** (`typescript-expert`): Expert guide for TypeScript 5.x advanced type system — strict mode config, branded types for domain modeling, discriminated unions for state machines, template literal types, conditional types with `infer`, the `satisfies` operator, `NoInfer<T>`, `using` declarations (TS 5.2), Zod schema integration, and type-safe environment variables.

#### SaaS Architecture, Systems & Cloud
- **Cloud Hosting Expert** (`cloud-hosting-expert`): Expert guide for deploying SaaS applications on edge and serverless platforms like Vercel (Edge, Fluid Compute), Cloudflare (Wrangler v3, Workers/Pages), Supabase, and Neon.
- **Event-Driven Architect** (`event-driven-architect`): Microservices architecture, message queues (NATS, Kafka, RabbitMQ, EventBridge), Event Sourcing, and background workflows (Temporal, Inngest, Trigger.dev v3).
- **Fullstack Expert** (`fullstack-expert`): Expert-level fullstack development references covering multiple languages (TypeScript, Python, Go, Rust), frameworks (Next.js, FastAPI, Gin, Axum), API design patterns (OpenAPI 3.1), databases, DevOps, and observability.
- **Monorepo & Workspace Architect** (`monorepo-architect`): Expert guide for designing and managing scalable monorepos using Turborepo 2.x, pnpm v9+ workspaces, and pnpm catalogs.
- **PRD Architect** (`prd-architect`): Enforces the mandatory formulation of a Product Requirements Document (PRD) covering MVPs and user flows before the agent writes any new application code.
- **SaaS Billing & Subscriptions** (`saas-billing`): Implement and audit SaaS billing systems, subscription state machines, secure webhooks, and local database synchronization using Stripe v16+, Midtrans, or Paddle.
- **SaaS Multi-Tenant** (`saas-multi-tenant`): Specialist in designing and implementing multi-tenant SaaS architecture with both Shared Schema (RLS) and Isolated Schema using PostgreSQL.
- **SaaS MVP Launcher** (`saas-mvp-launcher`): Structured roadmap to plan and launch a Minimum Viable Product (MVP) for SaaS, covering technologies, authentication, payments, etc.
- **SaaS Transformer** (`saas-transformer`): Master orchestrator skill that guides the systematic 8-phase transformation of an existing regular application into a fully-featured production-ready multi-tenant SaaS platform.
- **Senior Fullstack** (`senior-fullstack`): Complete set of instructions for senior-level fullstack developers with the latest tools and best practices.

#### Database & ORM
- **Database & ORM Expert** (`database-orm-expert`): Expert guide for database schema design and ORM selection — Prisma 6 (schema-first, Studio, `$transaction`), Drizzle ORM (SQL-first, edge-compatible, composable queries), TypeORM, raw SQL via `postgres.js`, cursor-based pagination, N+1 prevention, index strategy, connection pooling, and migration best practices for PostgreSQL, MySQL, and SQLite.
- **Supabase Migration** (`supabase-migration`): A skill to create, manage, or apply database migrations for Supabase locally or remotely via CLI v2+.

#### Quality, Testing & Security
- **E2E Testing & Test Automation** (`e2e-testing-expert`): Expert guide for End-to-End (E2E) testing with Playwright 1.48+, unit/integration testing with Vitest 2+, MSW 2+, and CI/CD automated pipeline setup.
- **Firebase Security Expert** (`firebase-security-expert`): Firebase security expert to audit Security Rules (Firestore/Realtime Database/Storage), authentication, API keys, data leakage prevention, and App Check configuration (v11+).
- **Production-Ready Hardener** (`production-ready-hardener`): Ultimate production readiness skill that orchestrates and coordinates audits across security, performance, SEO, testing, and DevOps.
- **Scalability & Clean Code Expert** (`scalability-clean-code`): Guide to writing clean code (SOLID, DRY) and designing scalable modular application architectures.
- **Secure Fuzz Testing** (`secure-fuzz-testing`): Expert-level skill for writing and integrating coverage-guided fuzz tests (Atheris, cargo-fuzz, native Go fuzzing) with compilers/sanitizers (ASan, MSan, UBSan).
- **Supabase Security Expert** (`supabase-security-expert`): Supabase security expert to audit web application security, relational databases, RLS (Row Level Security) configuration, RBAC, and Supabase Linter.
- **Zero to Production Orchestrator** (`zero-to-prod-orchestrator`): Master orchestrator skill that guides the complete lifecycle of building a new application from scratch to a production-ready release.

#### SEO & Search Optimization
- **SEO Umbrella** (`seo`): Comprehensive SEO audit covering technical SEO, on-page SEO, schema, sitemaps, content quality, AI search readiness, and GEO.
- **SEO GEO** (`seo-geo`): Focuses on Generative Engine Optimization (GEO) for AI Overviews, ChatGPT Search, Perplexity, and `/llms.txt` integration.
- **SEO AEO Landing Page Writer** (`seo-aeo-landing-page-writer`): Structured landing page writer specifically designed to rank high in SEO and earn AEO (Answer Engine Optimization) citations.

#### Utilities & Tools
- **Auto Documentation Updater** (`auto-doc-updater`): Automatically documents every feature change or bug fix successfully built into `CHANGELOG.md` and `BLUEPRINT.md`.
- **Brainstorming** (`brainstorming`): Advanced protocol with *Modern Web Guidance* guidelines to validate design ideas and large-scale web architecture before coding begins.
- **CodeRabbit Expert** (`coderabbit`): AI-powered automated code review, pull request summarization, and interactive developer feedback directly in GitHub/GitLab.
- **Data Telemetry Expert** (`data-telemetry-expert`): Observability, OpenTelemetry 1.30+, PostHog, Mixpanel, and data pipeline analytics.
- **Friendly Assistant** (`asisten_ramah`): Adds a friendly, warm, and enthusiastic personality to the agent's responses.
- **Global Accessibility & Internationalization** (`global-a11y-i18n-expert`): Web Accessibility (WCAG 2.2 AAA) and i18n internationalization standards.
- **New Skill** (`skill_baru`): Basic template for creating new agent skills in the future.
- **Session Handoff & Memory Resume** (`session-handoff-resume`): Saves ultra-compact project checkpoints (`STATE_HANDOFF.md`) before account/session switches and seamlessly resumes work with zero token waste.
- **Token Saver** (`token-saver`): Strong instructions to minimize fluff and repetition, very useful for high-efficiency bulk refactoring tasks.
- **Web Scraper** (`web-scraper`): Smart web data extraction capability with multi-strategy scraping (Crawl4AI, Playwright, BeautifulSoup), LLM extraction, and structured JSON/CSV export.

### Universal Orchestration Workflow (The Power of Vibes Plug)

To unlock the full potential of `vibes-plug`, skills should not be used in isolation. They are designed to act as a **highly orchestrated, interconnected swarm** that builds upon each other:

1. **Ideation & Planning:** Always start with `brainstorming` and `prd-architect` to validate requirements, architectures, and design ideas.
2. **Design & Frontend:** Trigger `design-system-architect` and `ui-ux-pro-max` to establish tokens, then use `senior-frontend` alongside `tanstack-query-expert` to implement robust, responsive UIs.
3. **Backend & Architecture:** While building the frontend, orchestrate `js-backend-expert` (or `go-programming-expert`/`rust-programming-expert`) with `event-driven-architect` for high-performance, scalable backends.
4. **SaaS Transformation (Master Orchestrators):** If you are building a commercial product, invoke `saas-transformer` or `saas-mvp-launcher`. These master skills will automatically invoke `saas-multi-tenant`, `saas-billing`, and `supabase-security-expert` to seamlessly integrate tenancy, billing, and session management.
5. **Quality & Launch:** Before deploying, use `e2e-testing-expert`, `secure-fuzz-testing`, and `seo` to validate. Finally, invoke `production-ready-hardener` to audit the entire system for Edge/Cloud deployment.

By letting the skills naturally invoke one another, you transform the AI into a complete, end-to-end engineering team.

---

### Automatic Installation (Recommended)

The easiest way to install and automatically save all skills into your directory is by cloning this Git repository. Open your terminal and run the command below according to your operating system:

**Windows (PowerShell / CMD):**
```bash
git clone https://github.com/roedyrustam/vibes-plug.git "$HOME\.gemini\config\plugins\vibes-plug"
```

**Mac / Linux (Terminal):**
```bash
git clone https://github.com/roedyrustam/vibes-plug.git ~/.gemini/config/plugins/vibes-plug
```

Once the command above succeeds, Antigravity will scan the folder and automatically detect all plugins and skills.

> **Tip:** If there are future skill updates, you can simply run `git pull` from inside the `vibes-plug` folder.

### Contributing

For those who want to contribute by adding new skills or updating existing ones, please read our complete guide at [CONTRIBUTING.md](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/CONTRIBUTING.md).

### Version
v2.0.0 (2026 Edition)

### Repository
[https://github.com/roedyrustam/vibes-plug.git](https://github.com/roedyrustam/vibes-plug.git)

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

**Edisi 2026** — Plugin kustomisasi untuk Antigravity yang berisi 65+ *skills* khusus yang diperbarui untuk tech stack modern 2026 (React 19, Tailwind v4, Bun, Hono, Supabase Auth v3). Dirancang untuk menunjang pengembangan perangkat lunak, desain UI/UX, optimasi SEO, hingga strategi bisnis SaaS.

### Fitur dan Skills yang Tersedia

Plugin ini menyediakan daftar kemampuan (*skills*) berikut yang bisa digunakan oleh agen:

#### AI & Sistem Agen
- **AI & LLM Integration Expert** (`ai-llm-integration-expert`): Panduan tingkat produksi untuk integrasi Large Language Models (LLMs), Model Context Protocol (MCP), arsitektur RAG, vector database (`pgvector` HNSW, Qdrant), model penalaran (DeepSeek-R1/V3, Gemini 3.5/3.6, Claude 3.7), Vercel AI SDK 4.x/5.x, dan orkestrasi agen AI.
- **MCP Server Architect** (`mcp-server-architect`): Panduan ahli merancang, membangun, dan mengamankan server Model Context Protocol (MCP) pada TypeScript, Python, dan Go (transport `stdio` & `SSE`, validasi Zod/Pydantic, guardrails keamanan).
- **Multi-Agent Orchestration Expert** (`multi-agent-orchestration`): Panduan ahli merancang sistem multi-agen AI, alur kerja graf berbasis state LangGraph, kelompok agen CrewAI/AutoGen, perutean supervisor, memori bersama, dan gerbang persetujuan manusia.

#### Desain & UI/UX
- **Design System Architect** (`design-system-architect`): Panduan ahli merancang dan memelihara Design System UI, Design Tokens (OKLCH), Radix UI / Base UI headless primitives, Tailwind CSS v4 `@theme`, CVA, dan aksesibilitas WCAG 2.2 AAA.
- **HIG — Human Interface Guidelines** (`hig`): Menerapkan tiga prinsip desain antarmuka inti — **Hierarchy** (hirarki visual yang jelas), **Harmony** (harmoni antar elemen dan platform), dan **Consistency** (konsistensi di semua ukuran layar dan perangkat, iOS 18/macOS Sequoia).
- **UI/UX Pro Max** (`ui-ux-pro-max`): Panduan desain komprehensif untuk aplikasi web dan mobile. Mengandung panduan palet warna, tipografi, aksesibilitas WCAG 2.2 AAA, mikro-animasi, serta pedoman UX mendalam.
- **UI/UX Expert** (`ui_ux_expert`): Spesialis antarmuka (Frontend) dan UI/UX Designer yang berfokus pada layout responsif dan interaktif.

#### Pengembangan Frontend, Mobile & State
- **App Analyzer & Optimizer** (`app-analyzer-optimizer`): Menganalisis struktur dan arsitektur aplikasi secara mendalam, melakukan audit bottleneck performa/keamanan (Core Web Vitals, INP), serta melakukan optimasi terarah.
- **MPA Orchestrator** (`mpa-orchestrator`): Mengorkestrasi arsitektur Multi-Page Application (MPA) di dalam satu repositori.
- **SPA Orchestrator** (`spa-orchestrator`): Mengorkestrasi arsitektur Single-Page Application (SPA), mengintegrasikan state management frontend dengan backend berbasis API yang terpisah.
- **Bootstrap to Modern** (`bootstrap-to-modern`): Skill ahli untuk merefaktor dan memigrasikan aplikasi Bootstrap CSS lama ke stack modern berbasis utility menggunakan Tailwind CSS v4 dan Alpine.js 3 / HTMX.
- **Mobile Expo Expert** (`mobile-expo-expert`): Panduan ahli pengembangan React Native 0.76+ dan Expo SDK 52+, mencakup Expo Router v4, React Native New Architecture (Fabric & TurboModules), EAS builds, OTA updates, dan NativeWind v4.
- **Performance & Web Vitals** (`performance-web-vitals`): Panduan ahli optimasi performa web — Core Web Vitals (LCP, INP, CLS), analisis bundle JavaScript, strategi loading gambar/font, fitur concurrent React 19 (`useTransition`, `useDeferredValue`), virtualisasi list panjang, dan peningkatan skor Lighthouse.
- **Senior Frontend** (`senior-frontend`): Ahli pengembangan React 19, Next.js 15, TypeScript, dan Tailwind CSS v4. Mampu mengoptimalkan performa, *bundle size*, Server Actions, `useActionState`, `useOptimistic`, dan merancang komponen *frontend*.
- **State Management Expert** (`state-management-expert`): Panduan ahli manajemen state client-side modern — Zustand 5 (slice pattern, persistensi, devtools), Jotai 2 (state atomik, `loadable`), Valtio, Redux Toolkit 2 (Immer, `createAsyncThunk`), dan pemisahan yang tepat antara server state (TanStack Query) dan client state.
- **Tailwind CSS Expert** (`tailwind-expert`): Panduan mendalam untuk konfigurasi CSS-first Tailwind CSS v4 (`@theme`), utility classes modern, state modifiers kustom, warna OKLCH, dan container queries.
- **TanStack Query Expert** (`tanstack-query-expert`): Pakar manajemen state asinkron menggunakan TanStack Query v5, `useSuspenseQuery`, mutasi optimistik, dan Next.js App Router (SSR) hidrasi.
- **Tauri Expert** (`tauri-expert`): Panduan terbaik untuk pengembangan aplikasi lintas platform *(cross-platform)* dengan Tauri v2 (Desktop & Mobile), berfokus pada ekosistem backend Rust, IPC komunikasi, dan *Capabilities* keamanan.

#### Backend, Bahasa & Runtime
- **API Design Expert** (`api-design-expert`): Panduan ahli untuk merancang API berkualitas produksi — pemodelan resource REST, semantik HTTP, desain skema GraphQL, gRPC dengan protobuf, tRPC end-to-end type-safe untuk TypeScript, dokumentasi OpenAPI 3.1, versioning API, rate limiting (sliding window), idempotency key, dan pengembangan contract-first.
- **Bun Runtime Expert** (`bun-runtime-expert`): Panduan ahli untuk runtime JavaScript/TypeScript Bun (v1.2+), mencakup built-in APIs (`Bun.serve`, `Bun.sql`, `Bun.s3`), `bun test`, `bun build`, manajemen paket, serta strategi migrasi dari Node.js.
- **Go Programming Expert** (`go-programming-expert`): Skill tingkat ahli untuk pemrograman Go (Go 1.23/1.24+). Mencakup API backend berkinerja tinggi, microservices, pola konkurensi (`errgroup`, perambatan konteks), `sqlc`, routing `net/http`, Gin/Echo/Fiber, gRPC, dan pengujian berbasis tabel.
- **JS Backend Expert** (`js-backend-expert`): Panduan tingkat produksi untuk API backend JavaScript/TypeScript modern di Node.js 22 LTS, Bun 1.2+, dan Deno 2.x. Mencakup Fastify 5, Hono, Express 5, NestJS, Prisma 6, Drizzle ORM, WebSocket, dan background queues BullMQ.
- **PHP MVC Expert** (`mvc-expert`): Panduan untuk memodernisasi proyek PHP lama menjadi arsitektur OOP/MVC yang bersih, aman, dan terstruktur dengan mematuhi standar PSR dan fitur PHP modern (v8.3/8.4+).
- **Python Programming Expert** (`python-programming-expert`): Panduan tingkat ahli untuk pemrograman Python (Python 3.12/3.13+), mencakup sintaksis parameter tipe PEP 695, konkurensi terstruktur (`asyncio.TaskGroup`), API backend modern (FastAPI 0.115+, Pydantic v2), manajemen paket (`uv`), kualitas kode (`Ruff`), dan pytest 8+.
- **Rust Programming Expert** (`rust-programming-expert`): Panduan tingkat tinggi untuk pemrograman Rust (Rust 2024 / v1.85+), mencakup keamanan memori, pemrograman asinkron (Tokio, async closures), web backends (Axum 0.8+, SQLx 0.8+), CLI (Clap, Serde), optimasi performa, serta manajemen kode unsafe.
- **TypeScript Expert** (`typescript-expert`): Panduan ahli sistem tipe TypeScript 5.x — konfigurasi strict mode, branded types untuk pemodelan domain, discriminated union untuk state machine, template literal types, conditional types dengan `infer`, operator `satisfies`, `NoInfer<T>`, deklarasi `using` (TS 5.2), integrasi schema Zod, dan variabel lingkungan type-safe.

#### Arsitektur SaaS, Sistem & Cloud
- **Cloud Hosting Expert** (`cloud-hosting-expert`): Panduan ahli untuk meluncurkan aplikasi SaaS di platform edge & serverless seperti Vercel (Edge, Fluid Compute), Cloudflare (Wrangler v3, Workers/Pages), Supabase, dan Neon.
- **Event-Driven Architect** (`event-driven-architect`): Arsitektur microservices, message queues (NATS, Kafka, RabbitMQ, EventBridge), Event Sourcing, dan background workflows (Temporal, Inngest, Trigger.dev v3).
- **Fullstack Expert** (`fullstack-expert`): Referensi pengembangan fullstack tingkat ahli yang mencakup multi-bahasa (TypeScript, Python, Go, Rust), multi-framework (Next.js, FastAPI, Gin, Axum), pola desain API (OpenAPI 3.1), database, DevOps, serta observability.
- **Monorepo & Workspace Architect** (`monorepo-architect`): Panduan ahli untuk merancang dan mengelola monorepo skalabel menggunakan Turborepo 2.x, pnpm v9+ workspaces, dan pnpm catalogs.
- **PRD Architect** (`prd-architect`): Memaksa perumusan *Product Requirements Document* (PRD) yang meliputi MVP dan *user flows* secara wajib sebelum agen menulis kode aplikasi baru apa pun.
- **SaaS Billing & Langganan** (`saas-billing`): Implementasi dan audit sistem billing SaaS, state machine langganan, webhook aman, dan sinkronisasi database lokal menggunakan Stripe v16+, Midtrans, atau Paddle.
- **SaaS Multi-Tenant** (`saas-multi-tenant`): Spesialis dalam merancang dan mengimplementasikan arsitektur *SaaS multi-tenant* dengan dukungan *Shared Schema* (RLS) maupun *Isolated Schema* menggunakan PostgreSQL.
- **SaaS MVP Launcher** (`saas-mvp-launcher`): Panduan jalan (roadmap) terstruktur untuk merencanakan dan meluncurkan Minimum Viable Product (MVP) untuk SaaS.
- **SaaS Transformer** (`saas-transformer`): Skill master orkestrator yang memandu transformasi sistematis 8-fase dari aplikasi biasa menjadi platform SaaS multi-tenant lengkap yang siap produksi.
- **Senior Fullstack** (`senior-fullstack`): Perangkat instruksi lengkap untuk pengembang *fullstack* tingkat senior dengan alat-alat dan *best practices* termutakhir.

#### Database & ORM
- **Database & ORM Expert** (`database-orm-expert`): Panduan ahli desain skema database dan pemilihan ORM — Prisma 6 (schema-first, Studio, `$transaction`), Drizzle ORM (SQL-first, edge-compatible, composable query), TypeORM, SQL mentah via `postgres.js`, cursor-based pagination, pencegahan N+1, strategi index, connection pooling, dan praktik terbaik migrasi untuk PostgreSQL, MySQL, dan SQLite.
- **Supabase Migration** (`supabase-migration`): Kemampuan untuk membuat, mengelola, atau menerapkan migrasi database Supabase secara lokal maupun remote via CLI v2+.

#### Kualitas, Pengujian & Keamanan
- **E2E Testing & Otomatisasi Tes** (`e2e-testing-expert`): Panduan ahli pengujian End-to-End (E2E) dengan Playwright 1.48+, pengujian unit/integrasi dengan Vitest 2+, MSW 2+, dan otomatisasi pipeline CI/CD.
- **Firebase Security Expert** (`firebase-security-expert`): Ahli keamanan Firebase untuk melakukan audit Security Rules (Firestore/Realtime Database/Storage), autentikasi, API keys, pencegahan kebocoran data, dan konfigurasi App Check (v11+).
- **Production-Ready Hardener** (`production-ready-hardener`): Skill kesiapan produksi utama yang mengorkestrasi dan mengoordinasikan audit pada aspek keamanan, performa, SEO, testing, dan DevOps.
- **Scalability & Clean Code Expert** (`scalability-clean-code`): Panduan menulis kode bersih (SOLID, DRY) dan merancang arsitektur aplikasi modular yang skalabel.
- **Secure Fuzz Testing** (`secure-fuzz-testing`): Panduan tingkat ahli untuk menulis dan mengintegrasikan pengujian fuzzing berbasis cakupan (Atheris, cargo-fuzz, native Go fuzzing) dengan compiler/sanitizer (ASan, MSan, UBSan).
- **Supabase Security Expert** (`supabase-security-expert`): Ahli keamanan Supabase untuk melakukan audit keamanan aplikasi web, database relasional, konfigurasi RLS (Row Level Security), RBAC, dan Supabase Linter.
- **Zero to Production Orchestrator** (`zero-to-prod-orchestrator`): Skill master orkestrator yang memandu siklus hidup lengkap dalam membangun aplikasi baru dari nol hingga rilis siap produksi.

#### SEO & Optimasi Visibilitas
- **SEO Umbrella** (`seo`): Audit SEO menyeluruh yang mencakup *technical* SEO, SEO *on-page*, schema, sitemaps, kualitas konten, hingga *AI search readiness* dan GEO.
- **SEO GEO** (`seo-geo`): Berfokus pada Generative Engine Optimization (GEO) untuk *AI Overviews*, ChatGPT Search, Perplexity, dan integrasi `/llms.txt`.
- **SEO AEO Landing Page Writer** (`seo-aeo-landing-page-writer`): Penulis *landing page* terstruktur yang dirancang khusus agar meraih peringkat tinggi pada SEO maupun citasi AEO (Answer Engine Optimization).

#### Utilitas & Alat
- **Auto Documentation Updater** (`auto-doc-updater`): Otomatis mendokumentasikan setiap perubahan fitur atau perbaikan bug yang berhasil di-build ke `CHANGELOG.md` dan `BLUEPRINT.md`.
- **Brainstorming** (`brainstorming`): Protokol lanjutan dengan pedoman *Modern Web Guidance* untuk memvalidasi ide desain dan arsitektur web berskala besar sebelum pengkodean dimulai.
- **CodeRabbit Expert** (`coderabbit`): Asisten review kode otomatis berbasis AI, perangkum pull request, dan umpan balik developer interaktif langsung di GitHub/GitLab.
- **Data Telemetry Expert** (`data-telemetry-expert`): Observabilitas, OpenTelemetry 1.30+, PostHog, Mixpanel, dan analitik pipa data.
- **Asisten Ramah** (`asisten_ramah`): Menambahkan kepribadian yang ramah, hangat, dan bersemangat pada respons agen.
- **Global Accessibility & Internationalization** (`global-a11y-i18n-expert`): Standar Aksesibilitas Web (WCAG 2.2 AAA) dan internasionalisasi i18n.
- **Skill Baru** (`skill_baru`): *Template* dasar untuk pembuatan *skill* agen baru ke depannya.
- **Session Handoff & Memory Resume** (`session-handoff-resume`): Menyimpan checkpoint proyek super ringkas (`STATE_HANDOFF.md`) sebelum ganti akun/sesi dan melanjutkan pekerjaan secara instan tanpa boros token.
- **Token Saver** (`token-saver`): Instruksi kuat untuk meminimalkan *fluff* dan pengulangan, sangat berguna untuk tugas refactoring massal dengan efisiensi tinggi.
- **Web Scraper** (`web-scraper`): Kemampuan ekstraksi data web cerdas dengan strategi *scraping* modern (Crawl4AI, Playwright, BeautifulSoup), ekstraksi LLM, serta ekspor JSON/CSV terstruktur.

### Alur Orkestrasi Universal (Kekuatan Penuh Vibes Plug)

Untuk membuka potensi penuh dari `vibes-plug`, *skill* tidak boleh digunakan secara terisolasi. Mereka dirancang untuk bertindak sebagai **sebuah ekosistem (swarm) yang saling terhubung dan terorkestrasi** yang saling melengkapi:

1. **Ideasi & Perencanaan:** Selalu mulai dengan `brainstorming` dan `prd-architect` untuk memvalidasi persyaratan, arsitektur, dan ide desain.
2. **Desain & Frontend:** Picu `design-system-architect` dan `ui-ux-pro-max` untuk membuat *design tokens*, kemudian gunakan `senior-frontend` bersama `tanstack-query-expert` untuk membangun UI yang kuat dan responsif.
3. **Backend & Arsitektur:** Saat membangun frontend, orkestrasikan `js-backend-expert` (atau `go-programming-expert`/`rust-programming-expert`) dengan `event-driven-architect` untuk *backend* berskala tinggi.
4. **Transformasi SaaS (Master Orchestrators):** Jika Anda membangun sebuah produk komersial, panggil `saas-transformer` atau `saas-mvp-launcher`. *Skill master* ini akan secara otomatis memicu `saas-multi-tenant`, `saas-billing`, dan `supabase-security-expert` untuk mengintegrasikan sistem *tenancy*, penagihan, dan manajemen sesi secara mulus.
5. **Kualitas & Peluncuran:** Sebelum *deploy*, gunakan `e2e-testing-expert`, `secure-fuzz-testing`, dan `seo` untuk validasi. Terakhir, panggil `production-ready-hardener` untuk mengaudit seluruh sistem sebelum rilis ke Edge/Cloud.

Dengan membiarkan *skill-skill* ini saling memicu secara natural, Anda mengubah agen AI menjadi sebuah tim *engineering end-to-end* yang lengkap dan sangat *powerful*.

---

### Instalasi otomatis (Rekomendasi)

Cara termudah agar semua *skill* terinstal dan tersimpan otomatis ke dalam direktori Anda adalah dengan melakukan *clone* repositori Git ini. Buka terminal Anda dan jalankan perintah di bawah ini sesuai sistem operasi Anda:

**Windows (PowerShell / CMD):**
```bash
git clone https://github.com/roedyrustam/vibes-plug.git "$HOME\.gemini\config\plugins\vibes-plug"
```

**Mac / Linux (Terminal):**
```bash
git clone https://github.com/roedyrustam/vibes-plug.git ~/.gemini/config/plugins/vibes-plug
```

Seketika setelah perintah di atas berhasil, Antigravity akan memindai folder tersebut dan mendeteksi seluruh plugin beserta *skills* secara otomatis.

> **Tip:** Jika ada *update* skill di masa depan, Anda cukup menjalankan `git pull` dari dalam folder `vibes-plug` tersebut.

### Kontribusi

Bagi Anda yang ingin berkontribusi menambahkan skill baru atau memperbarui skill yang ada, silakan baca panduan lengkap kami di [CONTRIBUTING.md](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/CONTRIBUTING.md).

### Versi
v2.0.0 (Edisi 2026)

### Repositori
[https://github.com/roedyrustam/vibes-plug.git](https://github.com/roedyrustam/vibes-plug.git)
