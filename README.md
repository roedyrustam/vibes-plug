# Vibes Plug

![Vibes Plug Banner](banner.png)

Plugin kustomisasi untuk Antigravity yang berisi berbagai *skills* khusus untuk menunjang pengembangan perangkat lunak, desain UI/UX, optimasi SEO, hingga strategi bisnis SaaS.

## Fitur dan Skills yang Tersedia

Plugin ini menyediakan daftar kemampuan (*skills*) berikut yang bisa digunakan oleh agen:

### Desain & UI/UX
- **HIG — Human Interface Guidelines** (`hig`): Menerapkan tiga prinsip desain antarmuka inti — **Hierarchy** (hirarki visual yang jelas), **Harmony** (harmoni antar elemen dan platform), dan **Consistency** (konsistensi di semua ukuran layar dan perangkat).
- **UI/UX Pro Max** (`ui-ux-pro-max`): Panduan desain komprehensif untuk aplikasi web dan mobile. Mengandung panduan palet warna, tipografi, serta pedoman UX mendalam.
- **UI/UX Expert** (`ui_ux_expert`): Spesialis antarmuka (Frontend) dan UI/UX Designer yang berfokus pada layout responsif dan interaktif.

### Frontend & Fullstack Web Development
- **Brainstorming** (`brainstorming`): Protokol lanjutan dengan pedoman *Modern Web Guidance* untuk memvalidasi ide desain dan arsitektur web berskala besar sebelum pengkodean dimulai.
- **Bun Runtime Expert** (`bun-runtime-expert`): Panduan ahli untuk runtime JavaScript/TypeScript Bun (v1.3+), mencakup built-in APIs (`Bun.serve`, `Bun.sql`, `Bun.s3`), `bun test`, `bun build`, manajemen paket, serta strategi migrasi dari Node.js.
- **Rust Programming Expert** (`rust-programming-expert`): Panduan tingkat tinggi untuk pemrograman Rust (Rust 2024 / v1.85+), mencakup keamanan memori (ownership/lifetimes), pemrograman asinkron (Tokio, async closures), web backends (Axum, SQLx), CLI (Clap, Serde), optimasi performa, serta manajemen kode unsafe.
- **Senior Frontend** (`senior-frontend`): Ahli pengembangan React, Next.js, TypeScript, dan Tailwind CSS. Mampu mengoptimalkan performa, *bundle size*, dan merancang komponen *frontend*.
- **Tailwind CSS Expert** (`tailwind-expert`): Panduan mendalam untuk konfigurasi CSS-first Tailwind CSS v4, theme customization (@theme), utility classes modern, state modifiers kustom, dan optimalisasi berkas.
- **Senior Fullstack** (`senior-fullstack`): Perangkat instruksi lengkap untuk pengembang *fullstack* tingkat senior dengan alat-alat dan *best practices* termutakhir.
- **Scalability & Clean Code Expert** (`scalability-clean-code`): Panduan menulis kode bersih (SOLID, DRY) dan merancang arsitektur aplikasi modular yang skalabel (Clean Architecture, caching, database replication).
- **TanStack Query Expert** (`tanstack-query-expert`): Pakar manajemen state asinkron menggunakan TanStack Query (React Query) dan Next.js App Router (SSR).
- **Tauri Expert** (`tauri-expert`): Panduan terbaik untuk pengembangan aplikasi lintas platform *(cross-platform)* dengan Tauri v2, berfokus pada ekosistem backend Rust, IPC komunikasi, dan *Capabilities* keamanan.
- **App Analyzer & Optimizer** (`app-analyzer-optimizer`): Menganalisis struktur dan arsitektur aplikasi secara mendalam, melakukan audit bottleneck performa/keamanan, serta melakukan optimasi terarah sesuai standar.

### Arsitektur SaaS & Bisnis
- **SaaS Multi-Tenant** (`saas-multi-tenant`): Spesialis dalam merancang dan mengimplementasikan arsitektur *SaaS multi-tenant* dengan *Row-Level Security* (RLS), *shared-schema*, dan PostgreSQL.
- **SaaS MVP Launcher** (`saas-mvp-launcher`): Panduan jalan (roadmap) terstruktur untuk merencanakan dan meluncurkan Minimum Viable Product (MVP) untuk SaaS, mencakup teknologi, autentikasi, pembayaran, dll.
- **PRD Architect** (`prd-architect`): Memaksa perumusan *Product Requirements Document* (PRD) yang meliputi MVP dan *user flows* secara wajib sebelum agen menulis kode aplikasi baru apa pun.

### Database & Keamanan (Security)
- **Supabase Security Expert** (`supabase-security-expert`): Ahli keamanan Supabase untuk melakukan audit keamanan aplikasi web, database relasional, konfigurasi RLS (Row Level Security), RBAC, dan mencegah kebocoran data (*hardcoded secrets*).
- **Firebase Security Expert** (`firebase-security-expert`): Ahli keamanan Firebase untuk melakukan audit Security Rules (Firestore/Realtime Database/Storage), autentikasi, API keys, pencegahan kebocoran data, dan konfigurasi App Check.

### SEO & Optimasi Visibilitas
- **SEO Umbrella** (`seo`): Audit SEO menyeluruh yang mencakup *technical* SEO, SEO *on-page*, schema, sitemap, kualitas konten, hingga *AI search readiness* dan GEO.
- **SEO GEO** (`seo-geo`): Berfokus pada optimasi konten agar dapat dibaca dan dikutip dengan baik oleh *AI Overviews*, ChatGPT, Perplexity, dan sistem pencarian AI lainnya (Generative Engine Optimization).
- **SEO AEO Landing Page Writer** (`seo-aeo-landing-page-writer`): Penulis *landing page* terstruktur yang dirancang khusus agar meraih peringkat tinggi pada SEO maupun citasi AEO (Answer Engine Optimization).

### Utilitas & Ekstra
- **Web Scraper** (`web-scraper`): Kemampuan ekstraksi data web cerdas dengan berbagai strategi *scraping*, dukungan paginasi, pemantauan, serta ekspor CSV/JSON.
- **Asisten Ramah** (`asisten_ramah`): Menambahkan kepribadian yang ramah, hangat, dan bersemangat pada respons agen.
- **Token Saver** (`token-saver`): Instruksi kuat untuk meminimalkan *fluff* dan pengulangan, sangat berguna untuk tugas refactoring massal dengan efisiensi tinggi.
- **Skill Baru** (`skill_baru`): *Template* dasar untuk pembuatan *skill* agen baru ke depannya.

## Instalasi otomatis (Rekomendasi)

Cara termudah agar semua *skill* terinstal dan tersimpan otomatis ke dalam direktori Anda adalah dengan melakukan *clone* repositori Git ini. Buka terminal Anda dan jalankan perintah di bawah ini sesuai sistem operasi Anda:

**Windows (PowerShell / CMD):**
```bash
git clone https://github.com/roedyrustam/vibes-plug.git "$HOME\.gemini\config\plugins\vibes-plug"
```

**Mac / Linux (Terminal):**
```bash
git clone https://github.com/roedyrustam/vibes-plug.git ~/.gemini/config/plugins/vibes-plug
```

Seketika setelah perintah di atas berhasil, Antigravity akan memindai folder tersebut dan mendeteksi seluruh plugin beserta *skills* (termasuk jika ada skill baru) secara otomatis.

> **Tip:** Jika ada *update* skill di masa depan, Anda cukup menjalankan `git pull` dari dalam folder `vibes-plug` tersebut.

## Kontribusi

Bagi Anda yang ingin berkontribusi menambahkan skill baru atau memperbarui skill yang ada, silakan baca panduan lengkap kami di [CONTRIBUTING.md](file:///C:/Users/roedy/.gemini/config/plugins/vibes-plug/CONTRIBUTING.md).

## Versi
v1.3.6

## Repositori
[https://github.com/roedyrustam/vibes-plug.git](https://github.com/roedyrustam/vibes-plug.git)
