---
name: mpa-orchestrator
description: "Orchestrates Multi-Page Application (MPA) architecture within a single repository, integrating with relevant skills / Mengorkestrasi arsitektur Multi-Page Application (MPA) dalam satu repositori, terintegrasi dengan skill relevan lainnya."
author: "Antigravity"
---

# Multi-Page Application (MPA) Orchestrator

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill provides a structured approach for building and orchestrating a Multi-Page Application (MPA) within a single repository. It acts as an orchestrator, connecting foundational MPA principles with other specialized skills (like `mvc-expert`, `saas-multi-tenant`, `senior-fullstack`, etc.) to deliver a cohesive, modern server-rendered application.

### Core MPA Principles in a Single Repository
1. **Centralized Architecture**: Keep frontend views, backend logic, and routing within a unified codebase to simplify deployment and reduce cognitive load.
2. **Server-Side Routing & Rendering**: Use a Front Controller (e.g., `index.php`, `main.go`, or Next.js Pages router) to intercept requests, fetch data, and render complete HTML pages per route.
3. **Shared UI Ecosystem**: 
   - Maintain a `layouts/` directory for base HTML structures (e.g., `<head>`, navigation, footers).
   - Maintain a `partials/` or `components/` directory for reusable UI elements.
   - Inject route-specific content into these layouts dynamically.
4. **Asset Management**: Centralize static assets (CSS, JS, images) in a `public/` directory. Implement cache-busting for production assets.
5. **Session-based State**: Leverage secure, server-side HTTP-only cookies and sessions for user authentication, tenant context, and flash messages across page navigations.

### Orchestration Guidelines
When designing or refactoring an MPA, orchestrate the following skills contextually:
- **With `mvc-expert`**: Ensure the MPA strictly follows the MVC pattern. Controllers handle business logic and data aggregation, passing clean variables to the Views for rendering.
- **With `saas-multi-tenant`**: Integrate tenant identification in the core routing middleware. Ensure every page load initializes the `tenant_id` context securely before fetching any data for the View.
- **With `senior-frontend` / `ui-ux-pro-max`**: While it's an MPA, enhance the frontend experience using lightweight JavaScript frameworks (like Alpine.js or HTMX) and Tailwind CSS for dynamic micro-interactions without sacrificing server-side rendering.
- **With `seo`**: Maximize the MPA's inherent SEO advantages by ensuring every page returns fully populated HTML, correct meta tags, and structured schema data on the initial load.

### Trigger Conditions
- Active when the user requests to build a web application using the Multi-Page Application (MPA) approach in a single repository.
- Active when refactoring or migrating an existing app to a centralized MPA architecture.
- Active when the user mentions combining MPA with SaaS, MVC, or modern backend frameworks.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini memberikan pendekatan terstruktur untuk membangun dan mengorkestrasi Multi-Page Application (MPA) di dalam satu repositori (monolith/single repo). Skill ini bertindak sebagai orkestrator yang menghubungkan prinsip-prinsip dasar MPA dengan skill spesialis lainnya (seperti `mvc-expert`, `saas-multi-tenant`, `senior-fullstack`, dll.) untuk menghasilkan aplikasi *server-rendered* yang kohesif dan modern.

### Prinsip Inti MPA dalam Satu Repositori
1. **Arsitektur Terpusat**: Simpan tampilan frontend, logika backend, dan routing dalam satu codebase terpadu untuk menyederhanakan proses deployment dan mengurangi beban kognitif.
2. **Routing & Rendering Sisi Server**: Gunakan Front Controller (misalnya `index.php`, `main.go`, atau Next.js Pages router) untuk menangkap permintaan, mengambil data, dan me-render halaman HTML lengkap per rute.
3. **Ekosistem UI Bersama**:
   - Buat direktori `layouts/` untuk struktur dasar HTML (seperti `<head>`, navigasi, footer).
   - Buat direktori `partials/` atau `components/` untuk elemen UI yang dapat digunakan kembali.
   - Suntikkan konten spesifik rute ke dalam layout ini secara dinamis.
4. **Manajemen Aset**: Pusatkan aset statis (CSS, JS, gambar) di dalam direktori `public/`. Terapkan teknik *cache-busting* untuk aset produksi.
5. **State Berbasis Session**: Manfaatkan cookie HTTP-only dan session sisi server yang aman untuk autentikasi pengguna, konteks tenant, dan pesan flash di setiap navigasi halaman.

### Panduan Orkestrasi
Saat merancang atau melakukan refaktor MPA, orkestrasikan skill berikut secara kontekstual:
- **Dengan `mvc-expert`**: Pastikan MPA secara ketat mengikuti pola MVC. Controller menangani logika bisnis dan agregasi data, lalu meneruskan variabel yang bersih ke View untuk di-render.
- **Dengan `saas-multi-tenant`**: Integrasikan identifikasi tenant pada middleware routing inti. Pastikan setiap pemuatan halaman menginisialisasi konteks `tenant_id` secara aman sebelum mengambil data untuk View.
- **Dengan `senior-frontend` / `ui-ux-pro-max`**: Meskipun ini adalah MPA, tingkatkan pengalaman frontend menggunakan framework JavaScript ringan (seperti Alpine.js atau HTMX) dan Tailwind CSS untuk interaksi mikro yang dinamis tanpa mengorbankan *server-side rendering*.
- **Dengan `seo`**: Maksimalkan keuntungan SEO bawaan dari MPA dengan memastikan setiap halaman mengembalikan HTML yang terisi penuh, tag meta yang benar, dan data skema terstruktur pada pemuatan awal.

### Kondisi Pemicu
- Aktif ketika pengguna meminta untuk membangun aplikasi web menggunakan pendekatan Multi-Page Application (MPA) dalam satu repositori.
- Aktif ketika melakukan refaktor atau migrasi aplikasi yang sudah ada ke arsitektur MPA terpusat.
- Aktif ketika pengguna menyebutkan penggabungan MPA dengan SaaS, MVC, atau framework backend modern.
