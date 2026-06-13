---
name: app-analyzer-optimizer
description: "Mempelajari arsitektur dan struktur aplikasi secara mendalam untuk melakukan audit, deteksi bottleneck, serta optimasi performa dan kode sesuai standar."
author: "roedy"
---

# App Analyzer & Optimizer

## Deskripsi
Skill ini memberikan instruksi kepada agen untuk mempelajari struktur, arsitektur, dependensi, dan performa aplikasi secara mendalam (deep analysis), kemudian melakukan optimasi kode, efisiensi resource, dan peningkatan performa sistem secara aman dan terarah berdasarkan pedoman skill-skill yang aktif di dalam vibes-plug.

## Instruksi

### 1. Protokol Analisis Mendalam (Deep Analysis Protocol)
Sebelum melakukan perubahan kode atau optimasi apa pun pada proyek, jalankan langkah-langkah audit berikut:
- **Pemetaan Struktur Aplikasi**: Telusuri pohon direktori proyek untuk memahami struktur modul, pembagian frontend/backend, dan organisasi asset.
- **Analisis Konfigurasi (Build & Config Review)**:
  - Periksa file konfigurasi proyek seperti `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.js`, `vite.config.ts`, `Cargo.toml`, dsb.
  - Identifikasi versi teknologi utama yang digunakan untuk mencocokkannya dengan standar ekosistem terbaru (misal: React 19, Next.js 15, Tailwind CSS v4, Rust 2024 / v1.85+).
- **Deteksi Bottleneck & Isu Kritis**:
  - Cari redundansi kode, inefisiensi query database, render berlebih di sisi frontend, atau memory leaks di sisi backend.
  - Periksa pengaturan keamanan dasar seperti *Row-Level Security* (RLS) pada Supabase atau aturan keamanan pada Firebase.

### 2. Penyelarasan Optimasi dengan Vibes-Plug Skills
Lakukan optimasi berdasarkan keselarasan aturan dari skill-skill berikut jika aktif:
- **Desain & Gaya**: Sesuaikan layout dan styling dengan aturan `tailwind-expert` (CSS-first, OKLCH, responsive modifiers) dan `ui-ux-pro-max` / `hig` (Hierarchy, Harmony, Consistency).
- **Pengelolaan State & Data Fetching**: Gunakan caching optimal, query key factory, dan penanganan mutasi optimal dari `tanstack-query-expert`.
- **Arsitektur & Kualitas Kode**: Terapkan prinsip SOLID, DRY, dan pemisahan logika (loose coupling) yang ada di `scalability-clean-code`.
- **Framework & Runtime**:
  - Di ekosistem JS/TS, optimalkan penggunaan runtime cepat (seperti Bun menggunakan `bun-runtime-expert`) atau pattern terbaru Next.js (RSC, PPR, `useActionState` menggunakan `senior-frontend` / `senior-fullstack`).
  - Di ekosistem Rust/Tauri, optimalkan alokasi memori, penanganan concurrency, dan keamanan IPC menggunakan `rust-programming-expert` dan `tauri-expert`.
- **Database & RLS**: Menerapkan Row-Level Security dan query scoping menggunakan `supabase-security-expert` atau `saas-multi-tenant`.
- **SEO & Visibilitas**: Optimalkan metadata, struktur heading, semantic HTML, dan AI search citation sesuai `seo` dan `seo-geo`.

### 3. Alur Kerja Optimasi Aman (Safe Optimization Workflow)
Lakukan optimasi dengan langkah-langkah terstruktur berikut:
1. **Buat Laporan Audit Awal**: Dokumentasikan daftar kelemahan, redundansi, dan area optimasi yang ditemukan dalam bentuk rancangan usulan.
2. **Implementasi Inkremental**: Lakukan perubahan secara modular (satu file/komponen pada satu waktu) untuk menghindari perubahan yang merusak kompatibilitas (breaking changes).
3. **Validasi & Benchmarking**:
   - Jalankan unit test, build test, atau linter untuk memastikan tidak ada syntax/runtime error yang diperkenalkan.
   - Bandingkan performa sebelum dan sesudah perubahan jika memungkinkan (misal: ukuran bundle, waktu response API).
4. **Pencatatan Riwayat (Auto-Document)**: Gunakan kemampuan `auto-doc-updater` untuk secara otomatis menulis perubahan optimasi ke `CHANGELOG.md` dan `BLUEPRINT.md`.

## Kondisi Pemicu
Aktif setiap kali pengguna meminta untuk:
- Melakukan analisis proyek, audit codebase, atau review arsitektur secara keseluruhan.
- Melakukan optimasi performa, pengurangan ukuran bundle, perbaikan database, atau refactoring kode skala menengah hingga besar.
- Menyelaraskan proyek lama agar kompatibel dengan teknologi atau standar terbaru.
