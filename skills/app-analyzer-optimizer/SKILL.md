---
name: app-analyzer-optimizer
description: "Deeply analyzes application architecture and structure to perform audit, bottleneck detection, and code/performance optimization / Mempelajari arsitektur dan struktur aplikasi secara mendalam untuk melakukan audit, deteksi bottleneck, serta optimasi performa dan kode."
author: "roedy"
---

# App Analyzer & Optimizer

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill instructs the agent to deeply analyze the application structure, architecture, dependencies, and performance, and then safely perform code optimizations, resource efficiency, and system performance improvements based on the guidelines of other active vibes-plug skills.

### Instructions

#### 1. Deep Analysis Protocol
Before making any code changes or optimizations, run the following auditing steps:
- **Application Structure Mapping**: Explore the project directory tree to understand module structures, frontend/backend separation, and asset organization.
- **Build & Config Review**:
  - Check project configuration files such as `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.js`, `vite.config.ts`, `Cargo.toml`, etc.
  - Identify the versions of core technologies to match them with the latest ecosystem standards (e.g., React 19, Next.js 15, Tailwind CSS v4, Rust 2024 / v1.85+).
- **Bottleneck & Critical Issue Detection**:
  - Look for code redundancy, database query inefficiencies, excessive frontend rendering, or backend memory leaks.
  - Review basic security configurations such as *Row-Level Security* (RLS) on Supabase or security rules on Firebase.

#### 2. Optimization Alignment with Vibes-Plug Skills
Execute optimizations based on matching guidelines from the following active skills:
- **Design & Styling**: Align layouts and styling with `tailwind-expert` (CSS-first, OKLCH, responsive modifiers) and `ui-ux-pro-max` / `hig` (Hierarchy, Harmony, Consistency).
- **State Management & Data Fetching**: Use optimal caching, query key factories, and optimal mutation handling from `tanstack-query-expert`.
- **Architecture & Code Quality**: Apply SOLID, DRY, and separation of concerns (loose coupling) principles from `scalability-clean-code`.
- **Framework & Runtime**:
  - In JS/TS ecosystem, optimize for fast runtimes (like Bun using `bun-runtime-expert`) or latest Next.js patterns (RSC, PPR, `useActionState` using `senior-frontend` / `senior-fullstack`).
  - In Rust/Tauri ecosystem, optimize memory allocation, concurrency handling, and IPC security using `rust-programming-expert` and `tauri-expert`.
- **Database & RLS**: Apply Row-Level Security and query scoping using `supabase-security-expert` or `saas-multi-tenant`.
- **SEO & Visibility**: Optimize metadata, heading structure, semantic HTML, and AI search citation according to `seo` and `seo-geo`.

#### 3. Safe Optimization Workflow
Execute optimizations through these structured steps:
1. **Create Initial Audit Report**: Document weaknesses, redundancies, and optimization areas found in a draft proposal.
2. **Incremental Implementation**: Apply changes modularly (one file/component at a time) to prevent breaking changes.
3. **Validation & Benchmarking**:
    - Run unit tests, build tests, or linters to ensure no syntax/runtime errors are introduced.
    - Compare performance before and after changes when possible (e.g., bundle size, API response times).
4. **Auto-Documentation**: Use `auto-doc-updater` to automatically write optimization changes to `CHANGELOG.md` and `BLUEPRINT.md`.

### Trigger Conditions
Active whenever the user requests to:
- Perform a project analysis, codebase audit, or general architecture review.
- Perform performance optimization, bundle size reduction, database fixes, or mid-to-large scale code refactoring.
- Align legacy projects to be compatible with the latest technologies or standards.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini memberikan instruksi kepada agen untuk mempelajari struktur, arsitektur, dependensi, dan performa aplikasi secara mendalam (deep analysis), kemudian melakukan optimasi kode, efisiensi resource, dan peningkatan performa sistem secara aman dan terarah berdasarkan pedoman skill-skill yang aktif di dalam vibes-plug.

### Instruksi

#### 1. Protokol Analisis Mendalam (Deep Analysis Protocol)
Sebelum melakukan perubahan kode atau optimasi apa pun pada proyek, jalankan langkah-langkah audit berikut:
- **Pemetaan Struktur Aplikasi**: Telusuri pohon direktori proyek untuk memahami struktur modul, pembagian frontend/backend, dan organisasi asset.
- **Analisis Konfigurasi (Build & Config Review)**:
  - Periksa file konfigurasi proyek seperti `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.js`, `vite.config.ts`, `Cargo.toml`, dsb.
  - Identifikasi versi teknologi utama yang digunakan untuk mencocokkannya dengan standar ekosistem terbaru (misal: React 19, Next.js 15, Tailwind CSS v4, Rust 2024 / v1.85+).
- **Deteksi Bottleneck & Isu Kritis**:
  - Cari redundansi kode, inefisiensi query database, render berlebih di sisi frontend, atau memory leaks di sisi backend.
  - Periksa pengaturan keamanan dasar seperti *Row-Level Security* (RLS) pada Supabase atau aturan keamanan pada Firebase.

#### 2. Penyelarasan Optimasi dengan Vibes-Plug Skills
Lakukan optimasi berdasarkan keselarasan aturan dari skill-skill berikut jika aktif:
- **Desain & Gaya**: Sesuaikan layout dan styling dengan aturan `tailwind-expert` (CSS-first, OKLCH, responsive modifiers) dan `ui-ux-pro-max` / `hig` (Hierarchy, Harmony, Consistency).
- **Pengelolaan State & Data Fetching**: Gunakan caching optimal, query key factory, dan penanganan mutasi optimal dari `tanstack-query-expert`.
- **Arsitektur & Kualitas Kode**: Terapkan prinsip SOLID, DRY, dan pemisahan logika (loose coupling) yang ada di `scalability-clean-code`.
- **Framework & Runtime**:
  - Di ekosistem JS/TS, optimalkan penggunaan runtime cepat (seperti Bun menggunakan `bun-runtime-expert`) atau pattern terbaru Next.js (RSC, PPR, `useActionState` menggunakan `senior-frontend` / `senior-fullstack`).
  - Di ekosistem Rust/Tauri, optimalkan alokasi memori, penanganan concurrency, dan keamanan IPC menggunakan `rust-programming-expert` dan `tauri-expert`.
- **Database & RLS**: Menerapkan Row-Level Security dan query scoping menggunakan `supabase-security-expert` or `saas-multi-tenant`.
- **SEO & Visibilitas**: Optimalkan metadata, struktur heading, semantic HTML, dan AI search citation sesuai `seo` dan `seo-geo`.

#### 3. Alur Kerja Optimasi Aman (Safe Optimization Workflow)
Lakukan optimasi dengan langkah-langkah terstruktur berikut:
1. **Buat Laporan Audit Awal**: Dokumentasikan daftar kelemahan, redundansi, dan area optimasi yang ditemukan dalam bentuk rancangan usulan.
2. **Implementasi Inkremental**: Lakukan perubahan secara modular (satu file/komponen pada satu waktu) untuk menghindari perubahan yang merusak kompatibilitas (breaking changes).
3. **Validasi & Benchmarking**:
    - Jalankan unit test, build test, atau linter untuk memastikan tidak ada syntax/runtime error yang diperkenalkan.
    - Bandingkan performa sebelum dan sesudah perubahan jika memungkinkan (misal: ukuran bundle, waktu response API).
4. **Pencatatan Riwayat (Auto-Document)**: Gunakan kemampuan `auto-doc-updater` untuk secara otomatis menulis perubahan optimasi ke `CHANGELOG.md` dan `BLUEPRINT.md`.

### Kondisi Pemicu
Aktif setiap kali pengguna meminta untuk:
- Melakukan analisis proyek, audit codebase, atau review arsitektur secara keseluruhan.
- Melakukan optimasi performa, pengurangan ukuran bundle, perbaikan database, atau refactoring kode skala menengah hingga besar.
- Menyelaraskan proyek lama agar kompatibel dengan teknologi atau standar terbaru.
