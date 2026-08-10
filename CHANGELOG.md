# Changelog / Catatan Perubahan

All notable changes to this project will be documented in this file.
*Semua perubahan penting pada proyek ini akan didokumentasikan dalam berkas ini.*

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
*Format ini didasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), dan proyek ini mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).*

## [2.4.0] - 2026-08-11

### Added / Ditambahkan
- Updated `saas-transformer` master orchestrator: Reconstructed 9-phase ASCII architecture map and enriched skill maps across all 9 transformation phases in both English and Bahasa Indonesia sections.
  *(Pembaruan `saas-transformer`: Merestrukturisasi peta arsitektur ASCII 9-fase dan memperkaya pemetaan skill di seluruh 9 fase transformasi.)*
- Updated `production-ready-hardener` master orchestrator: Reconstructed 7-phase ASCII architecture map and enriched skill maps across all 7 pre-production hardening phases.
  *(Pembaruan `production-ready-hardener`: Merestrukturisasi peta arsitektur ASCII 7-fase dan memperkaya pemetaan skill di seluruh 7 fase pengerasan pra-produksi.)*
- Added Windows standard output UTF-8 stream reconfiguration (`sys.stdout.reconfigure(encoding='utf-8')`) in scanner scripts (`saas_transformation_scanner.py` and `production_readiness_scanner.py`) to prevent terminal encoding errors.
  *(Menambahkan rekonfigurasi encoding stream UTF-8 pada script scanner Python untuk mencegah error encoding di terminal Windows.)*
- Synchronized `BLUEPRINT.md` to list all 87 skill modules across both English and Bahasa Indonesia documentation sections.
  *(Menyelaraskan `BLUEPRINT.md` untuk mencakup seluruh 87 modul skill pada dokumentasi Bahasa Inggris dan Bahasa Indonesia.)*

### Changed / Diubah
- Fixed UTF-8 character encoding corruptions (mojibake) across skill guidelines (`SKILL.md`) and project documentation (`BLUEPRINT.md`).
  *(Memperbaiki kerusakan encoding karakter UTF-8 (mojibake) pada petunjuk skill dan dokumentasi proyek.)*
- Bumped plugin, package, and blueprint versions to `v2.4.0`.
  *(Meningkatkan versi plugin, package, dan blueprint ke `v2.4.0`.)*

---

## [1.8.0] - 2026-08-09

### Added / Ditambahkan
- Added `website-design-cloner` skill module: Reverse-engineer website designs & templates directly from any live target URL into 1:1 code (Tailwind CSS v4 `@theme`, React 19, Next.js 15 App Router).
  *(Menambahkan modul skill `website-design-cloner`: Mempelajari dan merekayasa balik desain situs web & template secara langsung dari URL target ke kode presisi 1:1.)*
- Integrated URL design cloning triggers and handoff protocols into `web-scraper`, `ui-ux-pro-max`, and `brainstorming`.
  *(Mengintegrasikan pemicu duplikasi desain URL dan protokol handoff ke dalam `web-scraper`, `ui-ux-pro-max`, dan `brainstorming`.)*

### Changed / Diubah
- Bumped plugin and package versions to `v1.8.0`.
  *(Meningkatkan versi plugin dan package ke `v1.8.0`.)*

---

## [1.7.0] - 2026-08-09

### Added / Ditambahkan
- Automated PRD & Roadmap creation protocol: `prd-architect` and `zero-to-prod-orchestrator` now enforce generating both `PRD.md` and `ROADMAP.md` before any code implementation begins on new projects.
  *(Protokol otomatisasi PRD & Roadmap: `prd-architect` dan `zero-to-prod-orchestrator` sekarang mewajibkan pembuatan `PRD.md` dan `ROADMAP.md` sebelum penulisan kode dimulai.)*
- Explicit **Skill Orchestration & Handoff** matrices added across domain expert skills (`senior-frontend`, `js-backend-expert`, `ai-llm-integration-expert`, `saas-multi-tenant`, `auto-doc-updater`).
  *(Menambahkan matriks **Skill Orchestration & Handoff** eksplisit pada seluruh skill domain spesialis.)*

### Changed / Diubah
- Upgraded master orchestrator `brainstorming` and `zero-to-prod-orchestrator` to seamlessly cross-reference and delegate to all 77 specialized skills in `vibes-plug`.
  *(Memperbarui orchestrator master `brainstorming` dan `zero-to-prod-orchestrator` untuk mendelegasikan tugas secara dinamis ke seluruh 77 skill di `vibes-plug`.)*
- Bumped plugin and package versions to `v1.7.0`.
  *(Meningkatkan versi plugin dan package ke `v1.7.0`.)*

---

## [1.5.0] - 2026-07-26

### Added / Ditambahkan
- Added `session-handoff-resume` skill module, providing zero-token loss session continuation across account switches and chat resets via ultra-compact `STATE_HANDOFF.md` checkpoints.
  *(Menambahkan modul skill `session-handoff-resume` untuk menyimpan checkpoint `STATE_HANDOFF.md` super hemat token dan melanjutkan proyek secara instan saat ganti akun/sesi.)*
- Added `multi-agent-orchestration` skill module, providing expert-level guidelines for multi-agent systems, LangGraph, CrewAI, AutoGen, supervisor routing, state graphs, and Human-in-the-Loop guardrails.
  *(Menambahkan modul skill `multi-agent-orchestration` yang menyediakan pedoman tingkat ahli untuk sistem multi-agen, LangGraph, CrewAI, AutoGen, perutean supervisor, dan gerbang persetujuan manusia.)*
- Added `design-system-architect` skill module, providing expert-level guidelines for enterprise UI design systems, Design Tokens, Radix UI/Base UI headless primitives, Tailwind CSS v4 `@theme`, CVA variants, and WCAG 2.2 AAA accessibility.
  *(Menambahkan modul skill `design-system-architect` yang menyediakan pedoman tingkat ahli untuk design system UI, Design Tokens, headless primitives Radix UI/Base UI, Tailwind v4 `@theme`, CVA, dan aksesibilitas WCAG 2.2 AAA.)*
- Added `mcp-server-architect` skill module, providing expert-level guidelines for designing, building, and securing Model Context Protocol (MCP) servers across TypeScript, Python, and Go (stdio/SSE transports, Zod/Pydantic validation, security guardrails).
  *(Menambahkan modul skill `mcp-server-architect` yang menyediakan pedoman tingkat ahli untuk merancang, membangun, dan mengamankan server Model Context Protocol (MCP) pada TypeScript, Python, dan Go.)*
- Added `go-programming-expert` skill module, providing expert-level guidelines for Go 1.23/1.24+ backend APIs, microservices, concurrency patterns, sqlc, net/http, Gin/Echo/Fiber, gRPC, and table-driven testing.
  *(Menambahkan modul skill `go-programming-expert` yang menyediakan pedoman tingkat ahli untuk Go 1.23/1.24+ backend API, microservices, pola konkurensi, sqlc, net/http, Gin/Echo/Fiber, gRPC, dan testing.)*
- Added `js-backend-expert` skill module, providing expert-level guidelines for Node.js 22 LTS, Bun 1.2+, Deno 2.x, Fastify 5, Hono, Express 5, NestJS, Prisma 6, Drizzle ORM, WebSockets, and BullMQ background jobs.
  *(Menambahkan modul skill `js-backend-expert` yang menyediakan pedoman tingkat ahli untuk Node.js 22 LTS, Bun 1.2+, Deno 2.x, Fastify 5, Hono, Express 5, NestJS, Prisma 6, Drizzle ORM, WebSocket, dan pemrosesan background job BullMQ.)*

### Changed / Diubah
- Upgraded all master orchestrator skills (`zero-to-prod-orchestrator`, `app-analyzer-optimizer`, `production-ready-hardener`, `saas-transformer`) to seamlessly integrate and delegate tasks across all newly added 2026 skills (`session-handoff-resume`, `mcp-server-architect`, `multi-agent-orchestration`, `design-system-architect`, `go-programming-expert`, `js-backend-expert`, `seo-geo`).
  *(Memperbarui seluruh skill master orkestrator (`zero-to-prod-orchestrator`, `app-analyzer-optimizer`, `production-ready-hardener`, `saas-transformer`) agar secara otomatis mengintegrasikan dan mendelegasikan tugas ke seluruh skill baru 2026.)*
- Standardized and updated all 48 skills within `vibes-plug` to match current 2026 technical relevance and industry standards.
  *(Memperbarui dan menyelaraskan seluruh 48 skill di `vibes-plug` agar sesuai dengan relevansi teknis dan standar industri terkini tahun 2026.)*
- Updated AI/LLM skills (`ai-llm-integration-expert`, `brainstorming`) with Model Context Protocol (MCP), Vercel AI SDK 4.x/5.x, reasoning models (DeepSeek-R1/V3, Gemini 3.5/3.6, Claude 3.7), and HNSW vector search.
  *(Memperbarui skill AI/LLM dengan Model Context Protocol (MCP), Vercel AI SDK 4.x/5.x, model penalaran, dan pencarian vektor HNSW.)*
- Updated Frontend & Mobile skills (`senior-frontend`, `tailwind-expert`, `mobile-expo-expert`, `tauri-expert`) with Next.js 15+, React 19, Tailwind CSS v4 `@theme`, Expo SDK 52+, React Native 0.76+ New Architecture, and Tauri v2.0+ stable.
  *(Memperbarui skill Frontend & Mobile dengan React 19, Next.js 15+, Tailwind v4, Expo SDK 52+, React Native 0.76+ New Architecture, dan Tauri v2.0+.)*
- Updated Language & Runtime skills (`python-programming-expert`, `rust-programming-expert`, `bun-runtime-expert`) to Python 3.12/3.13+ (PEP 695 generics, `uv`, `Ruff`), Rust 2024 (v1.85+), and Bun 1.2+.
  *(Memperbarui skill Bahasa & Runtime ke Python 3.12/3.13+, Rust 2024, dan Bun 1.2+.)*
- Updated Search & Scraping skills (`seo-geo`, `web-scraper`) with Generative Engine Optimization (GEO for AI Overviews, Perplexity, ChatGPT Search) and Crawl4AI / Playwright extraction engines.
  *(Memperbarui skill Search & Scraping dengan Generative Engine Optimization (GEO) dan engine ekstraksi Crawl4AI / Playwright.)*

## [1.4.3] - 2026-07-13

### Added / Ditambahkan
- Added `mvc-expert` skill module, providing expert-level guidelines to refactor legacy/obsolete PHP spaghetti codebases into modern, secure, and scalable MVC architectures using modern PHP 8.2+ OOP features and PSR standards.
  *(Menambahkan modul skill `mvc-expert` yang menyediakan pedoman tingkat ahli untuk merefaktor codebase PHP spageti lama/usang menjadi arsitektur MVC yang modern, aman, dan skalabel menggunakan fitur OOP PHP 8.2+ modern dan standar PSR.)*

### Changed / Diubah
- Bumped project and plugin versions to v1.4.3.
  *(Meningkatkan versi proyek dan plugin ke v1.4.3.)*

## [1.4.2] - 2026-07-13

### Changed / Diubah
- Improved technology version modernization script `update_skills.js` to support matching non-breaking space variants (like `&nbsp;` and `\u0026nbsp;`).
  *(Meningkatkan skrip pencocokan standardisasi teknologi `update_skills.js` agar mendukung pencocokan variasi spasi non-breaking seperti `&nbsp;` dan `\u0026nbsp;`.)*
- Updated `ui-ux-pro-max` dataset to target Next.js 15 instead of Next.js 14 in non-breaking spaces documentation.
  *(Memperbarui dataset `ui-ux-pro-max` untuk menargetkan Next.js 15 daripada Next.js 14 pada bagian dokumentasi spasi non-breaking.)*
- Documented missing `auto-doc-updater` and `skill-baru` skills in `README.md` and `BLUEPRINT.md`.
  *(Mendokumentasikan skill `auto-doc-updater` dan `skill-baru` yang sebelumnya belum tercantum di `README.md` dan `BLUEPRINT.md`.)*
- Bumped project and plugin versions to v1.4.2.
  *(Meningkatkan versi proyek dan plugin ke v1.4.2.)*

## [1.4.1] - 2026-06-30

### Changed / Diubah
- Updated `ui-ux-expert` and `ui-ux-pro-max` skill modules to add comprehensive design and implementation guidelines for modern, professional, and standard dashboard architectures.
  *(Memperbarui modul skill `ui-ux-expert` dan `ui-ux-pro-max` untuk menambahkan panduan desain dan implementasi komprehensif bagi arsitektur dashboard yang modern, profesional, dan standar.)*
- Bumped project and plugin versions to v1.4.1.
  *(Meningkatkan versi proyek dan plugin ke v1.4.1.)*

## [1.4.0] - 2026-06-25

### Added / Ditambahkan
- Added `fullstack-expert` skill module, providing expert-level guidelines for multi-language (TypeScript, Python, Go, Rust), multi-framework (Next.js, FastAPI, Gin, Axum) web development, API design patterns, database architectures, DevOps, and observability.
  *(Menambahkan modul skill `fullstack-expert` yang menyediakan pedoman tingkat ahli untuk pengembangan web multi-bahasa (TypeScript, Python, Go, Rust), multi-framework (Next.js, FastAPI, Gin, Axum), pola desain API, arsitektur database, DevOps, dan observability.)*
- Added `saas-transformer` master orchestrator skill module to guide systematic 8-phase transformation of standard applications into production-grade multi-tenant SaaS platforms (covering database isolation, billing/Stripe, teams, and feature gating).
  *(Menambahkan modul skill master orkestrator `saas-transformer` untuk memandu transformasi sistematis 8-fase dari aplikasi standar menjadi platform SaaS multi-tenant tingkat produksi (mencakup isolasi database, billing/Stripe, tim, dan feature gating).)*
- Added `production-ready-hardener` master orchestrator skill module to conduct automated 7-phase application pre-launch audits across security, performance, accessibility, testing, and deployment, including a Python-based diagnostic scanner tool.
  *(Menambahkan modul skill master orkestrator `production-ready-hardener` untuk melakukan audit pra-peluncuran aplikasi 7-fase secara otomatis pada aspek keamanan, performa, aksesibilitas, testing, dan deployment, termasuk alat scanner diagnostik berbasis Python.)*
- Added/documented missing core skill modules in the plugin index, including `tanstack-query-expert` (asynchronous state management & caching), `web-scraper` (multi-strategy data extraction workflow), `supabase-migration` (database schema migration tracking), `ui-ux-expert` (responsive web design & layout optimization), and `asisten-ramah` (friendly conversational styling).
  *(Menambahkan/mendokumentasikan modul skill inti yang sebelumnya belum tercantum di indeks plugin, termasuk `tanstack-query-expert` (manajemen state asinkron & caching), `web-scraper` (alur kerja ekstraksi data multi-strategi), `supabase-migration` (pelacakan migrasi skema database), `ui-ux-expert` (desain web responsif & optimasi tata letak), dan `asisten-ramah` (gaya percakapan ramah).)*

## [1.3.9] - 2026-06-19

### Changed / Diubah
- Executed audit and validation across all 29 skill modules in the repository to ensure standardization of frontmatter, modern tech stacks (React 19, Next.js 15, Tailwind CSS v4, TanStack Query v5, Bun v1.1+), trigger conditions formatting, and clean emoji encodings.
  *(Melakukan audit dan validasi di seluruh 29 modul skill dalam repositori untuk memastikan standardisasi frontmatter, stack teknologi modern (React 19, Next.js 15, Tailwind CSS v4, TanStack Query v5, Bun v1.1+), format kondisi pemicu, dan pengodean emoji yang bersih.)*

## [1.3.8] - 2026-06-15

### Added / Ditambahkan
- Added `secure-fuzz-testing` skill module detailing coverage-guided fuzzing target creation (Atheris for Python, cargo-fuzz for Rust, native Go fuzzing), sanitizers configuration (ASan, MSan, UBSan), diagnostic analysis, and automated DevSecOps CI/CD pipelines integration.
  *(Menambahkan modul skill `secure-fuzz-testing` yang mendetailkan pembuatan target fuzzing berbasis cakupan (Atheris untuk Python, cargo-fuzz untuk Rust, native Go fuzzing), konfigurasi sanitizer (ASan, MSan, UBSan), analisis diagnostik, dan integrasi pipa DevSecOps CI/CD otomatis.)*

## [1.3.7] - 2026-06-15

### Added / Ditambahkan
- Added `python-programming-expert` skill module detailing Python 3.12+ features, type parameters, generic validation schemas using Pydantic v2, structured concurrency with asyncio TaskGroups, database interactions with SQLAlchemy 2.0 and SQLModel, package management via uv/Poetry, linting with Ruff, and testing with pytest.
  *(Menambahkan modul skill `python-programming-expert` yang mendetailkan fitur Python 3.12+, parameter tipe, skema validasi generik menggunakan Pydantic v2, konkurensi terstruktur dengan asyncio TaskGroups, interaksi database dengan SQLAlchemy 2.0 dan SQLModel, manajemen paket melalui uv/Poetry, linting dengan Ruff, dan pengujian dengan pytest.)*

## [1.3.6] - 2026-06-14

### Changed / Diubah
- Cleaned up obsolete metadata fields (`github:`, `risk:`, `source:`, and `date_added:`) from all skill definition files in the repository.
  *(Membersihkan bidang metadata usang (`github:`, `risk:`, `source:`, dan `date_added:`) dari seluruh berkas definisi skill di repositori.)*

## [1.3.5] - 2026-06-14

### Changed / Diubah
- Added header banner image `banner.png` to the top of `README.md`.
  *(Menambahkan gambar banner header `banner.png` di bagian atas `README.md`.)*

## [1.3.4] - 2026-06-14

### Added / Ditambahkan
- Added `scalability-clean-code` skill module outlining clean coding guidelines (SOLID, readability, DRY, KISS) and scalability architecture principles (Clean Architecture, decoupling, caching, database scale).
  *(Menambahkan modul skill `scalability-clean-code` yang menguraikan pedoman kode bersih (SOLID, readability, DRY, KISS) dan prinsip arsitektur skalabilitas (Clean Architecture, decoupling, caching, database scale).)*

## [1.3.3] - 2026-06-14

### Added / Ditambahkan
- Added `tailwind-expert` skill module detailing Tailwind CSS v4 CSS-first configuration, OKLCH theme variables, responsive design rules, state modifiers, custom utilities, bundle optimization, and class merging.
  *(Menambahkan modul skill `tailwind-expert` yang merinci konfigurasi CSS-first Tailwind CSS v4, variabel tema OKLCH, aturan desain responsif, modifikator status, utilitas kustom, optimasi bundle, dan penggabungan kelas.)*

## [1.3.2] - 2026-06-14

### Added / Ditambahkan
- Added `firebase-security-expert` skill module for Firebase security checks, including Firestore/Storage/Realtime Database rules, Service Account safety, GCP API key restrictions, and App Check.
  *(Menambahkan modul skill `firebase-security-expert` untuk pemeriksaan keamanan Firebase, termasuk aturan Firestore/Storage/Realtime Database, keamanan Service Account, pembatasan API key GCP, dan App Check.)*

## [1.3.1] - 2026-06-14

### Added / Ditambahkan
- Added `CONTRIBUTING.md` containing detailed contribution guidelines for fork developers to create and submit new skills.
  *(Menambahkan `CONTRIBUTING.md` yang berisi panduan kontribusi terperinci bagi pengembang fork untuk membuat dan mengirimkan skill baru.)*

### Changed / Diubah
- Synced the metadata version in `plugin.json` to match the project version of `1.3.1`.
  *(Menyelaraskan versi metadata di `plugin.json` agar sesuai dengan versi proyek `1.3.1`.)*

## [1.3.0] - 2026-06-12

### Added / Ditambahkan
- Added `token-saver` skill to enforce concise AI responses and minimal codebase rewrites.
  *(Menambahkan skill `token-saver` untuk memaksakan respons AI yang ringkas dan meminimalkan penulisan ulang kode.)*
- Added `tauri-expert` skill outlining Tauri v2 best practices, IPC communication, and security capabilities.
  *(Menambahkan skill `tauri-expert` yang menguraikan praktik terbaik Tauri v2, komunikasi IPC, dan kemampuan keamanan.)*
- Added `prd-architect` skill serving as a mandatory guardrail to generate and validate Product Requirements Documents (PRD) before generating code for new projects.
  *(Menambahkan skill `prd-architect` yang berfungsi sebagai guardrail wajib untuk membuat dan memvalidasi Product Requirements Document (PRD) sebelum menghasilkan kode untuk proyek baru.)*

### Changed / Diubah
- Standardized all 23 skill metadata (frontmatter) formats across the plugin.
  *(Menstandardisasi semua 23 format metadata (frontmatter) skill di seluruh plugin.)*
- Standardized the trigger header to `## Kondisi Pemicu` in all skills.
  *(Menstandardisasi header pemicu menjadi `## Kondisi Pemicu` di semua skill.)*
- Broadly updated technical relevance in existing skills (bumped to React 19, Next.js 15, Tailwind v4, TanStack Query v5, Bun v1.1+).
  *(Memperbarui relevansi teknis secara luas pada skill yang ada (ditingkatkan ke React 19, Next.js 15, Tailwind v4, TanStack Query v5, Bun v1.1+).)*
- Fixed markdown script paths in `ui-ux-pro-max` and emoji encoding issues in `ui_ux_expert`.
  *(Memperbaiki path skrip markdown di `ui-ux-pro-max` dan masalah pengkodean emoji di `ui_ux_expert`.)*

## [1.2.6] - 2026-05-24

### Added / Ditambahkan
- Created a new `rust-programming-expert` skill module for Rust programming (Rust 2024 / v1.85+).
  *(Membuat modul skill baru `rust-programming-expert` untuk pemrograman Rust (Rust 2024 / v1.85+).)*

## [1.2.5] - 2026-05-24

### Added / Ditambahkan
- Created a new `bun-runtime-expert` skill module for Bun runtime (v1.3+).
  *(Membuat modul skill baru `bun-runtime-expert` untuk runtime Bun (v1.3+).)*

## [1.2.4] - 2026-05-24

### Changed / Diubah
- Updated the `brainstorming` skill with 2026 modern web architecture guidance.
  *(Memperbarui skill `brainstorming` dengan panduan arsitektur web modern 2026.)*

## [1.2.3] - 2026-05-24

### Changed / Diubah
- Updated the `senior-frontend` skill to target React 19 / Next.js 15 / Tailwind CSS v4.
  *(Memperbarui skill `senior-frontend` untuk menargetkan React 19 / Next.js 15 / Tailwind CSS v4.)*

## [1.2.2] - 2026-05-24

### Changed / Diubah
- Comprehensively updated the `senior-fullstack` skill with professional, production-grade architectural guidance and code.
  *(Memperbarui secara komprehensif skill `senior-fullstack` dengan panduan arsitektur dan kode tingkat produksi profesional.)*

## [1.2.1] - 2026-05-24

### Changed / Diubah
- Updated the `saas-mvp-launcher` skill file with state-of-the-art 2026 patterns.
  *(Memperbarui file skill `saas-mvp-launcher` dengan pola mutakhir 2026.)*
