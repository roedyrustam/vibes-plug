---
name: ui-ux-pro-max
description: "Comprehensive design guide & BM25 search engine for web and mobile applications across 11 tech stacks / Panduan desain komprehensif & mesin pencari BM25 untuk aplikasi web dan mobile di 11 tech stack."
author: "vibes-plug-swarm"
---

# UI/UX Pro Max - Design Intelligence System

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
UI/UX Pro Max is a comprehensive design intelligence engine equipped with an offline BM25 search index covering color palettes, typography, responsive patterns, icon sets, chart recommendations, UX guidelines, and stack-specific best practices across **11 technology stacks**.

### Trigger Conditions
Reference these guidelines or run the CLI search engine when:
- Designing new UI components, landing pages, or dashboards.
- Choosing color schemes, font pairings, and design tokens.
- Learning, reverse-engineering, or cloning website design templates & components directly from a target URL (Combine with `website-design-cloner`).
- Generating a complete design system recommendation for a project.
- Auditing code for UX, accessibility (a11y), or performance issues.
- Needing stack-specific code patterns (React, Next.js, Vue, Nuxt, Svelte, Tailwind, SwiftUI, React Native, Flutter, Shadcn).

---

### Python BM25 Search CLI Integration

The skill includes a fast Python search engine in `scripts/search.py` that queries 12 domain CSV datasets and 11 tech-stack CSV datasets.

#### 1. Generate Complete Design System Recommendation
Run this before starting design/coding to get an aggregated design system spec:
```bash
python scripts/search.py "<project/topic query>" --design-system -p "Project Name" -f markdown
```
*Example:* `python scripts/search.py "SaaS analytics dashboard" --design-system -p "MetricsApp" -f markdown`

#### 2. Domain-Specific Search
Search specific design domains:
```bash
python scripts/search.py "<query>" --domain <domain> --max-results 3
```
- **Available Domains (`--domain`)**:
  - `style`: Visual design styles (Minimalism, Glassmorphism, Dark Mode, Aurora, Brutalism, Bento Grid, Spatial UI, WebGL 3D elements, etc.)
  - `prompt`: Copy-paste ready AI prompts & CSS implementation checklists
  - `color`: Hex color palettes tailored by product type (Primary, Secondary, CTA, Background, Text)
  - `chart`: Chart type recommendations, library suggestions, accessibility & color guidance
  - `landing`: High-converting landing page layouts, section orders & CTA placement
  - `product`: Product-type specific design system blueprints (SaaS, E-commerce, Fintech, Crypto, AI-Native Chat Interfaces, etc.)
  - `ux`: UX anti-patterns, usability best practices, severity, and good/bad code examples
  - `typography`: Google font pairings, heading/body recommendations, mood keywords & CSS imports
  - `icons`: Icon usage guidance, SVG libraries (Lucide, Heroicons), and code imports
  - `react`: React & Next.js performance optimizations, re-render fixes & dynamic imports
  - `web`: Web interface guidelines (ARIA, focus traps, virtual list, form inputs)

*Example:* `python scripts/search.py "fintech dark theme" --domain color`

#### 3. Stack-Specific Guidelines Search
Search guidelines tailored to your exact tech stack:
```bash
python scripts/search.py "<query>" --stack <stack> --max-results 3
```
- **Supported Stacks (`--stack`)**:
  - `html-tailwind` | `react` | `nextjs` | `vue` | `nuxtjs` | `nuxt-ui` | `svelte` | `swiftui` | `react-native` | `flutter` | `shadcn`

*Example:* `python scripts/search.py "virtualized list performance" --stack react`

---

### Quick Reference for Professional Rules

#### 1. Accessibility (WCAG 2.2) - CRITICAL
- **Color Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text/UI components.
- **Focus States**: Visible focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2`) during keyboard navigation.
- **Alt Text & ARIA**: Descriptive alt text for imagery; proper `aria-expanded`, `aria-controls`, and semantic HTML tags.

#### 2. Touch & Interaction - CRITICAL
- **Touch Target Size**: Minimum 44x44px for mobile devices.
- **Loading & State**: Disable buttons during async requests to prevent duplicate submissions; show subtle spinners or skeleton loaders.
- **Cursor Pointer**: Always add `cursor-pointer` to clickable/interactive elements.

#### 3. Performance & Animation - HIGH / MEDIUM
- **Image & Assets**: Use WebP/AVIF formats, `srcset`, explicit `width`/`height` attributes, and `loading="lazy"`.
- **Micro-interactions**: Keep transition durations between 150ms–300ms (`ease-in-out`) for fast and responsive UI feel.
- **Reduced Motion**: Respect `prefers-reduced-motion: reduce`.

#### 4. Light/Dark Mode Contrast
- **Light Mode**: High-contrast text (e.g. Slate-900 `#0F172A`); avoid pale grays for primary text. Ensure borders (`border-slate-200`) remain visible.
- **Dark Mode**: High contrast foreground elements over dark slate/gray backgrounds; avoid pure black `#000000` text containers unless requested.

#### 5. Dashboard & Information Hierarchy
- **Layout Flow**: KPI summary cards top -> Trend charts middle -> Detailed data tables bottom.
- **Visual Grid**: Consistent gaps/padding (16px / 24px). Clean subtle borders instead of heavy black dividers.
- **Data Viz**: Maximum 3–5 coordinated colors in graphs. Responsive tooltips and legend alignment.

---

### UI/UX Design Pre-Delivery Checklist
- [ ] **Visual Quality**: No emojis used as UI icons (use SVG icons from Lucide/Heroicons). Hover states do not cause layout shifts.
- [ ] **Interaction**: `cursor-pointer` applied to all interactive elements. Smooth 150–300ms transitions.
- [ ] **Contrast**: Text contrast ratio >= 4.5:1 in light mode. Visible borders in both light and dark modes.
- [ ] **Layout & Responsive**: Tested across 375px, 768px, 1024px, 1440px breakpoints. No unintentional horizontal scrolling on mobile.
- [ ] **Accessibility**: All images have meaningful `alt` text. Form inputs have explicitly connected `<label>` elements or `aria-label`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
UI/UX Pro Max adalah mesin kecerdasan desain komprehensif yang dilengkapi indeks pencarian BM25 offline. Mencakup palet warna, tipografi, pola tata letak responsif, rekomendasi ikon, grafik visualisasi data, pedoman UX, serta praktik terbaik untuk **11 tumpukan teknologi (technology stacks)**.

### Kondisi Pemicu
Gunakan pedoman ini atau jalankan mesin pencari CLI ketika:
- Mendesain komponen UI baru, landing page, atau dashboard.
- Memilih skema warna, pasangan font, dan token desain.
- Menghasilkan rekomendasi sistem desain (design system) lengkap untuk proyek.
- Mengaudit kode untuk masalah UX, aksesibilitas (a11y), atau kinerja.
- Membutuhkan pola kode spesifik stack (React, Next.js, Vue, Nuxt, Svelte, Tailwind, SwiftUI, React Native, Flutter, Shadcn).

---

### Integrasi CLI Pencarian Python BM25

Skill ini dilengkapi mesin pencari Python cepat di `scripts/search.py` yang dapat mengueri 12 dataset CSV domain dan 11 dataset CSV tech-stack.

#### 1. Generasi Rekomendasi Sistem Desain Lengkap
Jalankan ini sebelum memulai desain/coding untuk mendapatkan spesifikasi sistem desain terintegrasi:
```bash
python scripts/search.py "<kueri proyek/topik>" --design-system -p "Nama Proyek" -f markdown
```
*Contoh:* `python scripts/search.py "SaaS analytics dashboard" --design-system -p "MetricsApp" -f markdown`

#### 2. Pencarian Berdasarkan Domain
Cari domain desain tertentu:
```bash
python scripts/search.py "<kueri>" --domain <domain> --max-results 3
```
- **Domain yang Tersedia (`--domain`)**:
  - `style`: Gaya desain visual (Minimalism, Glassmorphism, Dark Mode, Aurora, Brutalism, Bento Grid, Spatial UI, elemen WebGL 3D, dll.)
  - `prompt`: Prompt AI siap pakai & checklist implementasi CSS
  - `color`: Palet warna Hex sesuai jenis produk (Utama, Sekunder, CTA, Background, Teks)
  - `chart`: Rekomendasi jenis grafik, pustaka grafik, panduan kontras & aksesibilitas
  - `landing`: Tata letak landing page konversi tinggi, urutan seksi & penempatan CTA
  - `product`: Cetak biru sistem desain spesifik jenis produk (SaaS, E-commerce, Fintech, Crypto, Antarmuka Chat AI-Native, dll.)
  - `ux`: Anti-pattern UX, praktik terbaik kegunaan, tingkat keparahan, serta contoh kode baik/buruk
  - `typography`: Pasangan font Google Fonts, rekomendasi font judul/isi, mood & CSS import
  - `icons`: Panduan penggunaan ikon, pustaka SVG (Lucide, Heroicons), & import kode
  - `react`: Optimasi performa React & Next.js, perbaikan re-render & dynamic import
  - `web`: Pedoman antarmuka web (ARIA, focus trap, virtual list, input form)

*Contoh:* `python scripts/search.py "fintech dark theme" --domain color`

#### 3. Pencarian Pedoman Spesifik Tech Stack
Cari pedoman yang disesuaikan persis dengan tech stack proyek:
```bash
python scripts/search.py "<kueri>" --stack <stack> --max-results 3
```
- **Tech Stack yang Didukung (`--stack`)**:
  - `html-tailwind` | `react` | `nextjs` | `vue` | `nuxtjs` | `nuxt-ui` | `svelte` | `swiftui` | `react-native` | `flutter` | `shadcn`

*Contoh:* `python scripts/search.py "virtualized list performance" --stack react`

---

### Acuan Cepat Aturan Profesional

#### 1. Aksesibilitas (WCAG 2.2) - KRITIS
- **Kontras Warna**: Rasio kontras minimal 4.5:1 untuk teks normal, 3:1 untuk teks besar/komponen UI.
- **Focus States**: Tampilkan cincin fokus yang jelas (`focus-visible:ring-2 focus-visible:ring-offset-2`) saat menggunakan navigasi keyboard.
- **Alt Text & ARIA**: Sediakan alt text deskriptif pada gambar; gunakan atribut `aria-expanded`, `aria-controls`, serta elemen HTML semantik.

#### 2. Sentuhan & Interaksi - KRITIS
- **Touch Target Size**: Ukuran area sentuh minimal 44x44px untuk perangkat mobile.
- **Loading & State**: Nonaktifkan tombol selama operasi asinkron agar tidak terjadi submit ganda; tampilkan spinner halus atau skeleton loader.
- **Cursor Pointer**: Wajib menambahkan `cursor-pointer` pada elemen interaktif yang dapat diklik.

#### 3. Performa & Animasi - TINGGI / MENENGAH
- **Aset Gambar**: Gunakan format WebP/AVIF, atribut `srcset`, dimensi `width`/`height` eksplisit, serta `loading="lazy"`.
- **Mikro-interaksi**: Durasi transisi antara 150ms–300ms (`ease-in-out`) agar antarmuka terasa cepat dan responsif.
- **Reduced Motion**: Hormati preferensi `prefers-reduced-motion: reduce`.

#### 4. Kontras Mode Terang & Gelap
- **Mode Terang**: Teks gelap kontras tinggi (misal Slate-900 `#0F172A`); hindari teks abu-abu pudar. Pastikan batas/border (`border-slate-200`) tetap terlihat.
- **Mode Gelap**: Kontras tinggi antara elemen latar depan dengan latar belakang gelap; hindari kontainer teks serba hitam pekat `#000000` kecuali diminta khusus.

#### 5. Dashboard & Hierarki Informasi
- **Alur Tata Letak**: Kartu ringkasan KPI di atas -> Grafik tren di tengah -> Tabel detail data di bawah.
- **Grid Visual**: Konsistensi gap/padding (16px / 24px). Gunakan border halus daripada pembatas tebal hitam.
- **Visualisasi Data**: Maksimal 3–5 warna terkoordinasi dalam grafik. Tooltip responsif & perataan legenda yang rapi.

---

### Checklist Desain UI/UX Sebelum Delivery
- [ ] **Visual**: Tidak menggunakan emoji sebagai ikon UI (gunakan ikon SVG seperti Lucide/Heroicons). Efek hover tidak menggeser tata letak.
- [ ] **Interaksi**: `cursor-pointer` diterapkan pada semua elemen interaktif. Transisi halus 150–300ms.
- [ ] **Kontras**: Rasio kontras teks minimal 4.5:1 pada mode terang. Border terlihat di kedua mode (terang & gelap).
- [ ] **Tata Letak & Responsif**: Diuji pada breakpoint 375px, 768px, 1024px, 1440px. Tidak ada scroll horizontal tak disengaja pada perangkat mobile.
- [ ] **Aksesibilitas**: Semua gambar memiliki `alt` text yang bermakna. Form input memiliki `<label>` terhubung atau `aria-label`.

---
### 🎨 Automatic Visual Assets Generation Mandate (CRITICAL)
**MANDATORY**: Whenever you are building a new application, scaffolding a project, or finalizing the initial UI/UX, you MUST automatically use the `generate_image` tool to create a custom logo that perfectly matches the application's core concept and aesthetic. 
This generated image MUST be explicitly used as:
1. The primary application logo (e.g., in the header/navbar).
2. The website favicon (`favicon.ico` or equivalent).
3. The Open Graph (OG) image for SEO metadata (`og:image`).

Do not use placeholders for these assets. Generate and integrate them automatically.
