---
name: senior-fullstack
description: "Complete toolkit for senior fullstack with modern tools and best practices / Perangkat instruksi lengkap untuk pengembang fullstack tingkat senior dengan alat-alat dan best practices termutakhir."
author: "Roedy Rustam"
---

# Senior Fullstack Specialist

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
A comprehensive blueprint and toolkit for senior fullstack engineers, covering production-grade architecture, database optimization, advanced state management, micro-interactions, robust CI/CD, and system security.

### Core Capabilities
- **Fullstack Scaffolder**: Automated scaffolder that spins up highly structured workspaces with embedded security defaults, CSP configuration, and database clients (Prisma/Drizzle).
- **Project Scaffolder**: Performs static analysis on active fullstack codebases to flag scaling risks (such as N+1 query patterns).
- **Code Quality Analyzer**: Validates test coverage, scans for insecure CORS policies, and detects hardcoded secrets.

### Modern Tech Stack (2026)
- **Languages:** TypeScript, JavaScript, SQL, Python, Go.
- **Frontend:** React 19, Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui.
- **State & Fetching:** TanStack Query v5, React Server Actions, Zustand.
- **Database & ORMs:** PostgreSQL, Drizzle ORM, Prisma, Redis, Supabase, Neon.
- **Operations & Security:** Docker, GitHub Actions, AWS/Vercel, Sentry, Snyk.

### Senior Best Practices
- **Code Quality**: Enforce `strict: true` in `tsconfig.json`, avoid `any` typings, and validate API payloads with Zod.
- **Database Scaling**: Always use connection pooling, add indexes on query columns, and enforce Row-Level Security (RLS) on tenant tables.
- **Security**: Enforce strict security headers (CSP, HSTS), validate external webhook signatures (e.g., Stripe), and implement rate limiting.

### Troubleshooting
- **Hydration Mismatch**: Avoid client-only browser state (like `localStorage`) during initial render. Wrap blocks in `useEffect` or use `next/dynamic` with `{ ssr: false }`.
- **Postgres Connection Spikes**: Reduce pool size and use a transaction pooler (pgBouncer/Supavisor) with `pool_mode=transaction`.
- **Stale Server Action UI**: Call `revalidatePath()` or `revalidateTag()` immediately after database transactions succeed.

### Reference Documentation
- [Tech Stack Guide](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/senior-fullstack/references/tech_stack_guide.md)
- [Architecture Patterns](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/senior-fullstack/references/architecture_patterns.md)
- [Development Workflows](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/senior-fullstack/references/development_workflows.md)

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan komprehensif dan perangkat instruksi untuk insinyur fullstack tingkat senior. Mencakup arsitektur tingkat produksi, optimasi database, manajemen state lanjutan, mikro-interaksi, CI/CD yang tangguh, dan keamanan sistem.

### Kemampuan Utama
- **Fullstack Scaffolder**: Script otomatis untuk merancang workspace fullstack terstruktur dengan keamanan dasar, konfigurasi CSP, dan database client (Prisma/Drizzle).
- **Project Scaffolder**: Melakukan analisis statis pada codebase untuk mendeteksi risiko skalabilitas (seperti N+1 query ORM).
- **Code Quality Analyzer**: Memvalidasi cakupan pengujian, memantau celah keamanan CORS, dan mendeteksi rahasia (secrets) yang tertulis keras (hardcoded).

### Stack Teknologi Modern (2026)
- **Bahasa**: TypeScript, JavaScript, SQL, Python, Go.
- **Frontend**: React 19, Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui.
- **State & Fetching**: TanStack Query v5, React Server Actions, Zustand.
- **Database & ORM**: PostgreSQL, Drizzle ORM, Prisma, Redis, Supabase, Neon.
- **Operasional & Keamanan**: Docker, GitHub Actions, AWS/Vercel, Sentry, Snyk.

### Praktik Terbaik Senior
- **Kualitas Kode**: Terapkan `strict: true` di `tsconfig.json`, hindari tipe `any`, dan gunakan Zod untuk validasi payload API.
- **Skalabilitas Database**: Gunakan connection pooling, buat index pada kolom query, dan terapkan Row-Level Security (RLS) pada tabel bertingkat tenant.
- **Keamanan**: Terapkan header keamanan yang ketat (CSP, HSTS), validasi tanda tangan webhook eksternal (misal Stripe), dan pasang rate limiting.

### Pemecahan Masalah (Troubleshooting)
- **Hydration Mismatch**: Hindari browser state khusus client (seperti `localStorage`) selama render awal. Bungkus block dalam `useEffect` atau gunakan `next/dynamic` dengan `{ ssr: false }`.
- **Lonjakan Koneksi Postgres (Connection Spikes)**: Kurangi ukuran pool dan gunakan transaction pooler (pgBouncer/Supavisor) dengan `pool_mode=transaction`.
- **UI Server Action yang Usang (Stale)**: Panggil `revalidatePath()` atau `revalidateTag()` segera setelah transaksi database berhasil.

### Referensi Dokumentasi
- [Tech Stack Guide](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/senior-fullstack/references/tech_stack_guide.md)
- [Architecture Patterns](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/senior-fullstack/references/architecture_patterns.md)
- [Development Workflows](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/senior-fullstack/references/development_workflows.md)
