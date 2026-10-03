---
name: ui-ux-pro-max
description: "Comprehensive design guide & BM25 search engine for web and mobile applications across 11 tech stacks / Panduan desain komprehensif & mesin pencari BM25 untuk aplikasi web dan mobile di 11 tech stack."
author: "Roedy Rustam"

version: "4.2.0"
---

# UI/UX Pro Max - Design Intelligence System

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `anti-slop`, `design-system-architect`, `hig`, `tailwind-expert`, `brainstorming`, `zero-to-prod-orchestrator`, and `session-memory-manager` to ensure cohesive execution.

### Description
UI/UX Pro Max is a comprehensive design intelligence engine equipped with an offline BM25 search index covering color palettes, typography, responsive patterns, icon sets, chart recommendations, UX guidelines, **Material Design 3 (M3)**, and stack-specific best practices across **11 technology stacks**.

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
  - `m3`: Material Design 3 specific design tokens, color roles, elevation, and component specs
  - `preset-monday`: Monday.com spacious SaaS aesthetic (Vibrant Blue `#0073ea`, Clean White `#FFFFFF` + Light Grays `#F9F9F9`/`#F5F6F8`, Dark Footer `#111111`, Figtree/Inter fonts, 12-16px card radius, 80-120px vertical spacing)

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
- **Material Design 3 (M3) Integration (https://m3.material.io/)**:
  - **Window Size Classes**: Adaptive layout scaling across Compact (<600dp / bottom nav), Medium (600–839dp / navigation rail), and Expanded (≥840dp / persistent drawer).
  - **Surface Container Tiers**: Layer views using `surface-container-lowest` up to `surface-container-highest` for subtle tonal elevation without harsh borders or heavy drop shadows.
  - **Tonal Elevation**: 6 levels (Level 0–5) with primary surface tinting overlays (0% to 14%).
  - **Query M3 Design Tokens**: Run `python scripts/search.py "<component or token>" --domain m3` to fetch exact M3 specs, color roles, and CSS variables.
- **Layout Flow**: KPI summary cards top -> Trend charts middle -> Detailed data tables bottom.
- **Visual Grid**: Consistent gaps/padding (16px / 24px). Clean subtle borders instead of heavy black dividers.
- **Data Viz**: Maximum 3–5 coordinated colors in graphs. Responsive tooltips and legend alignment.

---

### Sovereign UI/UX Anti-Slop Directive (6 Design Pillars)

The UI/UX tier of vibes-plug strictly eliminates generic AI visual slop and incomplete user experiences:

1. **Ban on Generic "AI Gradient" Aesthetic**:
   - 🔴 **Forbidden**: Defaulting to the cliché dark-slate backdrop with purple/cyan glowing neon gradients (`bg-slate-900 from-purple-500 to-indigo-600`), indiscriminate glassmorphic cards with faint `border-white/10`, and floating glowing dots with zero brand context.
   - ✅ **Standard**: Purpose-driven brand aesthetic. Deliberately choose and enforce a coherent design philosophy matching the domain: Swiss International Typography, Clean Scandinavian Editorial, High-Density Data Monochrome, Precision Industrial, or Warm Handcrafted Minimal.

2. **Mandatory 5-State Component Rule (Zero Happy-Path Bias)**:
   - 🔴 **Forbidden**: Generating only the static happy-path layout while omitting edge-case states.
   - ✅ **Standard**: Every interactive view or data component must explicitly support all 5 core states:
     - **Ideal State**: Clean, structured layout with realistic domain content.
     - **Loading State**: Content-shaped pulsing skeleton layout matching exact element geometry (no layout shifts or jarring full-screen spinners).
     - **Empty State**: Contextual vector icon/illustration, concise explanatory copy, and a primary action button to create the first record.
     - **Error State**: Inline accessible alert with actionable retry trigger and clear explanation (RFC 9457 friendly).
     - **Interactive / Disabled State**: Clear hover, active, keyboard `focus-visible:ring-2`, and `aria-disabled="true"` with tooltip explanation.

3. **Semantic & Accessible DOM (Zero Div-Soup Slop)**:
   - 🔴 **Forbidden**: Using `<div onClick={...}>` instead of `<button>`, omitting `<label>` tags on inputs, or icon-only buttons without accessible names.
   - ✅ **Standard**: Semantic HTML5 (`<button type="button">`, `<nav>`, `<main>`, `<dialog>`), explicit `<label htmlFor="...">`, `aria-label` or `<span className="sr-only">` on icon buttons, and visible keyboard navigation focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2`).

4. **Fluid Responsiveness & Mobile Insets**:
   - 🔴 **Forbidden**: Hardcoded fixed pixel widths (`w-[480px]`) causing horizontal scrolling on 360px mobile viewports; applying `overflow-x: hidden` on `<body>` to hide layout clipping bugs.
   - ✅ **Standard**: Fluid layout constraints (`max-w-md w-full`), CSS Grid with `minmax()`, dynamic viewport units (`dvh` over `vh`), and safe-area padding (`pb-safe`).

5. **Intentional Micro-Motion & Reduced Motion**:
   - 🔴 **Forbidden**: Jarring 0ms instant state snaps, sluggish 800ms+ animations that delay task completion, and hover effects that trigger layout shifts.
   - ✅ **Standard**: Snappy 150ms–250ms transitions with `ease-out`, zero layout shifts on hover, and strict respect for `@media (prefers-reduced-motion: reduce)`.

6. **Domain-Authentic Content (No Lorem Ipsum Slop)**:
   - 🔴 **Forbidden**: Filling UI mockups with "Lorem ipsum dolor sit amet", "John Doe", "Jane Doe", or dummy placeholder avatars.
   - ✅ **Standard**: Use realistic, contextual domain content matching the business use-case (real currency, realistic timestamps, localized names, authentic domain terms).

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
Terhubung dan mengorkestrasi skill domain yang relevan seperti `anti-slop`, `design-system-architect`, `hig`, `tailwind-expert`, `brainstorming`, `zero-to-prod-orchestrator`, dan `session-memory-manager` untuk memastikan eksekusi yang kohesif.

### Deskripsi
UI/UX Pro Max adalah mesin kecerdasan desain komprehensif yang dilengkapi indeks pencarian BM25 offline. Mencakup palet warna, tipografi, pola tata letak responsif, rekomendasi ikon, grafik visualisasi data, pedoman UX, **Material Design 3 (M3)**, serta praktik terbaik untuk **11 tumpukan teknologi (technology stacks)**.

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
  - `m3`: Token desain spesifik Material Design 3, peran warna, elevasi, dan spesifikasi komponen
  - `preset-monday`: Estetika SaaS lapang ala Monday.com (Biru Cerah `#0073ea`, Putih Bersih `#FFFFFF` + Abu-abu Terang `#F9F9F9`/`#F5F6F8`, Footer Gelap `#111111`, font Figtree/Inter, radius kartu 12-16px, jarak seksi vertikal 80-120px)

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
- **Integrasi Material Design 3 (M3) (https://m3.material.io/)**:
  - **Kelas Ukuran Jendela Adaptif**: Tata letak beradaptasi pada Compact (<600dp / navigasi bawah), Medium (600–839dp / navigation rail), dan Expanded (≥840dp / navigation drawer permanen).
  - **Tingkatan Surface Container**: Pelapisan kontainer visual menggunakan `surface-container-lowest` hingga `surface-container-highest` untuk kedalaman tonal tanpa border tebal atau bayangan berlebihan.
  - **Elevasi Tonal**: 6 tingkat (Level 0–5) dengan overlay warna tint primer (0% hingga 14%).
  - **Pencarian Token Desain M3**: Jalankan `python scripts/search.py "<komponen atau token>" --domain m3` untuk mengekstrak spesifikasi, peran warna, dan variabel CSS M3 secara instan.
- **Alur Tata Letak**: Kartu ringkasan KPI di atas -> Grafik tren di tengah -> Tabel detail data di bawah.
- **Grid Visual**: Konsistensi gap/padding (16px / 24px). Gunakan border halus daripada pembatas tebal hitam.
- **Visualisasi Data**: Maksimal 3–5 warna terkoordinasi dalam grafik. Tooltip responsif & perataan legenda yang rapi.

---

### Direktif Anti-Slop UI/UX Berdaulat (6 Pilar Desain)

Tingkat UI/UX vibes-plug melarang keras slop visual AI generik dan pengalaman pengguna separuh jadi:

1. **Larangan Estetika "Gradien AI" Generik**:
   - 🔴 **Dilarang**: Menggunakan *default* klise latar belakang dark-slate dengan gradien neon ungu/sian menyala (`bg-slate-900 from-purple-500 to-indigo-600`), kartu *glassmorphic* berlebihan dengan `border-white/10`, serta titik-titik neon mengambang tanpa konteks merek.
   - ✅ **Standar**: Estetika berbasis tujuan merek. Terapkan filosofi desain yang disengaja sesuai domain produk: Tipografi Internasional Swiss, Editorial Skandinavia Bersih, Monokrom Data Densitas Tinggi, Presisi Industrial, atau Desain Minimalis Hangat.

2. **Aturan Wajib 5 Status Komponen (Nol Bias Happy-Path)**:
   - 🔴 **Dilarang**: Hanya menghasilkan tata letak statis saat kondisi data ideal dan melupakan status di dunia nyata.
   - ✅ **Standar**: Setiap tampilan interaktif atau komponen data WAJIB mendukung 5 status inti:
     - **Status Ideal**: Tata letak rapi, terstruktur, dengan konten domain realistis.
     - **Status Loading**: Skeleton loader berdenyut halus dengan geometri persis sesuai elemen (tanpa pergeseran layout / CLS, tanpa spinner layar penuh yang mengganggu).
     - **Status Kosong (Empty State)**: Ikon/ilustrasi kontekstual, teks penjelasan ringkas dan ramah, serta tombol CTA utama untuk membuat data pertama.
     - **Status Error**: Banner/kartu error inline yang aksesibel disertai pesan jelas dan tombol coba lagi (*retry*).
     - **Status Interaktif / Nonaktif (Disabled)**: Status hover, active, cincin fokus keyboard `focus-visible:ring-2`, serta atribut `aria-disabled="true"` dengan penjelasan tooltip.

3. **DOM Semantik & Aksesibel (Nol Slop Div-Soup)**:
   - 🔴 **Dilarang**: Menggunakan `<div onClick={...}>` menggantikan tombol asli, menghilangkan tag `<label>` pada input, atau tombol ikon tanpa nama aksesibel.
   - ✅ **Standar**: Gunakan elemen HTML5 semantik (`<button type="button">`, `<nav>`, `<main>`, `<dialog>`), `<label htmlFor="...">` eksplisit, `aria-label` atau `<span className="sr-only">` pada tombol ikon, dan cincin fokus navigasi keyboard yang jelas (`focus-visible:ring-2 focus-visible:ring-offset-2`).

4. **Responsif Fluid & Inset Layar Mobile**:
   - 🔴 **Dilarang**: Menetapkan lebar piksel statis (`w-[480px]`) yang merusak tampilan mobile 360px; menggunakan trik `overflow-x: hidden` pada `<body>` untuk menyembunyikan bug layout bocor.
   - ✅ **Standar**: Batasan layout fleksibel (`max-w-md w-full`), CSS Grid dengan `minmax()`, unit viewport dinamis (`dvh`), dan padding area aman mobile (`pb-safe`).

5. **Mikro-Gerakan Disengaja & Reduced Motion**:
   - 🔴 **Dilarang**: Transisi kaku 0ms, animasi lambat >800ms yang memperlambat interaksi, dan efek hover yang memicu pergeseran tata letak (layout shift).
   - ✅ **Standar**: Transisi responsif 150ms–250ms dengan `ease-out`, tanpa layout shift saat hover, serta kepatuhan mutlak pada `@media (prefers-reduced-motion: reduce)`.

6. **Konten Domain Autentik (Nol Slop Lorem Ipsum)**:
   - 🔴 **Dilarang**: Memenuhi antarmuka pengguna dengan "Lorem ipsum dolor sit amet", "John Doe", "Jane Doe", atau avatar tiruan kosong.
   - ✅ **Standar**: Gunakan konten realistis sesuai domain bisnis produk (mata uang nyata, stempel waktu realistis, nama lokal, istilah bisnis autentik).

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