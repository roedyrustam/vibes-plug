---
name: app-analyzer-optimizer
description: "Deeply analyzes application architecture and structure to perform audit, bottleneck detection, and code/performance optimization / Mempelajari arsitektur dan struktur aplikasi secara mendalam untuk melakukan audit, deteksi bottleneck, serta optimasi performa dan kode."
author: "Roedy Rustam"
---

# App Analyzer & Optimizer (2026 Master Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Master auditing and optimization skill instructing the agent to deeply analyze application structure, multi-language architecture, dependencies, performance, and security across the entire codebase. It safely executes targeted optimizations by orchestrating guidelines from all active `vibes-plug` specialized skills.

### Instructions

#### 1. Deep Analysis & Audit Protocol
Before making any code changes or optimizations, run the following auditing steps:
- **Application Structure & Monorepo Mapping**: Explore directory trees, Turborepo / pnpm workspace dependencies, frontend/backend separation, and asset organization (`monorepo-architect`).
- **Build & Ecosystem Configuration Review**:
  - Inspect `package.json`, `tsconfig.json`, `next.config.js`, `vite.config.ts`, `Cargo.toml`, `go.mod`, `pyproject.toml` (`uv`).
  - Align tech stack with modern 2026 ecosystem standards (React 19, Next.js 15, Tailwind v4 `@theme`, Node 22 LTS, Bun 1.2+, Python 3.12+ PEP 695, Go 1.23+, Rust 2024 / v1.85+, Expo SDK 52+, Tauri v2).
- **Bottleneck & Security Audit**:
  - **Frontend / UI**: Check Core Web Vitals (LCP, INP, CLS), bundle size, render loops, and WCAG 2.2 AAA accessibility compliance (`design-system-architect`, `senior-frontend`).
  - **Backend / APIs**: Audit memory leaks, unhandled async promises, Event Loop blocking, ORM N+1 queries, and connection poolers (`js-backend-expert`, `go-programming-expert`, `python-programming-expert`, `rust-programming-expert`).
  - **AI / MCP Systems**: Audit MCP server tools for input parameter validation (Zod/Pydantic), permission boundaries, and recursion limits in multi-agent state graphs (`mcp-server-architect`, `multi-agent-orchestration`).
  - **Security & RLS**: Review PostgreSQL Row-Level Security (RLS), Supabase policies, Firebase Security Rules, CORS, and CSP headers (`supabase-security-expert`, `firebase-security-expert`, `saas-multi-tenant`).

#### 2. Optimization Alignment Across Vibes-Plug Skills
Execute optimizations based on matching guidelines from active skills:
- **Design & UI**: Align styling with `tailwind-expert` (CSS-first, OKLCH, responsive modifiers) and `design-system-architect` (Radix/Base UI headless primitives, CVA, ARIA roles).
- **State & Data Fetching**: Optimize query key factories, `useSuspenseQuery`, and optimistic mutations via `tanstack-query-expert`.
- **Architecture & Clean Code**: Apply SOLID, DRY, Clean Architecture, and loose coupling via `scalability-clean-code`.
- **SEO & GEO**: Enhance Generative Engine Optimization for AI Overviews, Perplexity, ChatGPT Search, JSON-LD schemas, and `/llms.txt` via `seo` and `seo-geo`.
- **Session Protection**: If performing large-scale multi-file refactoring, save a `STATE_HANDOFF.md` checkpoint via `session-handoff-resume` before switching sessions or accounts.

#### 3. Safe Optimization Workflow
1. **Create Initial Audit Report**: Document weaknesses, redundancies, and proposed refactoring in an audit proposal.
2. **Incremental Implementation**: Apply changes modularly (one component/module at a time) to prevent breaking changes.
3. **Validation & Benchmarking**:
   - Run unit tests (`vitest`, `pytest`, `go test`), build tests, or linters (`Ruff`, `ESLint`).
   - Run Playwright E2E specs (`e2e-testing-expert`) or fuzz tests (`secure-fuzz-testing`).
4. **Auto-Documentation**: Invoke `auto-doc-updater` to automatically write optimization changes to `CHANGELOG.md` and `BLUEPRINT.md`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill master audit dan optimasi yang menginstruksikan agen untuk menganalisis struktur aplikasi, arsitektur multi-bahasa, dependensi, performa, dan keamanan di seluruh codebase secara mendalam. Skill ini melakukan optimasi terarah secara aman dengan mengorkestrasikan pedoman dari seluruh skill spesialis `vibes-plug`.

### Instruksi

#### 1. Protokol Analisis Mendalam (Deep Analysis Protocol)
Sebelum melakukan perubahan kode atau optimasi apa pun pada proyek, jalankan langkah-langkah audit berikut:
- **Pemetaan Struktur Aplikasi & Monorepo**: Telusuri direktori, dependensi workspace pnpm/Turborepo, pembagian frontend/backend, dan organisasi aset (`monorepo-architect`).
- **Analisis Konfigurasi Build & Ekosistem**:
  - Periksa `package.json`, `tsconfig.json`, `next.config.js`, `vite.config.ts`, `Cargo.toml`, `go.mod`, `pyproject.toml` (`uv`).
  - Selaraskan stack teknologi dengan standar 2026 (React 19, Next.js 15, Tailwind v4 `@theme`, Node 22 LTS, Bun 1.2+, Python 3.12+ PEP 695, Go 1.23+, Rust 2024 / v1.85+, Expo SDK 52+, Tauri v2).
- **Deteksi Bottleneck & Isu Keamanan**:
  - **Frontend / UI**: Periksa Core Web Vitals (LCP, INP, CLS), ukuran bundle, loop render, dan kepatuhan aksesibilitas WCAG 2.2 AAA (`design-system-architect`, `senior-frontend`).
  - **Backend / API**: Audit memory leaks, unhandled async promises, blocking event loop, kueri ORM N+1, dan connection poolers (`js-backend-expert`, `go-programming-expert`, `python-programming-expert`, `rust-programming-expert`).
  - **Sistem AI / MCP**: Audit alat MCP Server untuk validasi parameter (Zod/Pydantic), batasan izin, dan batas rekursi pada graf agen (`mcp-server-architect`, `multi-agent-orchestration`).
  - **Keamanan & RLS**: Periksa Row-Level Security (RLS) PostgreSQL, Supabase, Firebase Security Rules, CORS, dan header CSP (`supabase-security-expert`, `firebase-security-expert`, `saas-multi-tenant`).

#### 2. Penyelarasan Optimasi dengan Vibes-Plug Skills
- **Desain & UI**: Sesuaikan layout dengan `tailwind-expert` (CSS-first, OKLCH, responsive modifiers) dan `design-system-architect` (Radix/Base UI headless primitives, CVA, ARIA roles).
- **Pengelolaan State & Data Fetching**: Gunakan query key factory, `useSuspenseQuery`, dan mutasi optimistik dari `tanstack-query-expert`.
- **Arsitektur & Kualitas Kode**: Terapkan prinsip SOLID, DRY, dan Clean Architecture dari `scalability-clean-code`.
- **SEO & GEO**: Tingkatkan Generative Engine Optimization untuk AI Overviews, Perplexity, ChatGPT Search, JSON-LD, dan `/llms.txt` via `seo` dan `seo-geo`.
- **Proteksi Sesi**: Jika melakukan refactoring skala besar, simpan checkpoint `STATE_HANDOFF.md` via `session-handoff-resume` sebelum berganti akun/sesi.

#### 3. Alur Kerja Optimasi Aman (Safe Optimization Workflow)
1. **Buat Laporan Audit Awal**: Dokumentasikan kelemahan, redundansi, dan usulan refactoring.
2. **Implementasi Inkremental**: Lakukan perubahan secara modular (satu file/komponen pada satu waktu) untuk menghindari breaking changes.
3. **Validasi & Benchmarking**:
   - Jalankan unit test (`vitest`, `pytest`, `go test`), build test, atau linter (`Ruff`, `ESLint`).
   - Jalankan Playwright E2E (`e2e-testing-expert`) atau fuzz testing (`secure-fuzz-testing`).
4. **Pencatatan Riwayat (Auto-Document)**: Gunakan `auto-doc-updater` untuk secara otomatis menulis perubahan optimasi ke `CHANGELOG.md` dan `BLUEPRINT.md`.
