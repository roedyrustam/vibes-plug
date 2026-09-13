---
name: tailwind-expert
description: "Expert guide for Tailwind CSS v4, CSS-first configuration, @theme customization, and modern responsive design / Panduan ahli untuk Tailwind CSS v4, konfigurasi CSS-first, kustomisasi @theme, dan desain responsif modern."
author: "Roedy Rustam"
version: "3.0.0"
---

# Tailwind CSS Expert (v4 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Strict guidelines and best practices for Tailwind CSS v4. Enforces the CSS-first configuration model, `@theme` token definitions, dynamic utilities, and performance optimization via Lightning CSS.

### Trigger Conditions
- Scaffold or configure a Tailwind CSS v4 project.
- Migrate a codebase from Tailwind CSS v3 to v4.
- Implement design tokens via `@theme`.
- Apply 3D transforms, CSS container queries, or `field-sizing`.

## Orchestration & Integration
Integrates tightly with the following skills:
- **`senior-frontend`**: Feeds modern CSS capabilities into Next.js/React component architecture.
- **`design-system-architect, senior-frontend`**: Provides the styling primitives for Radix/shadcn-style components.
- **`design-system-architect`**: Establishes the core tokens mapped inside `@theme`.

### Execution Standards

#### 1. CSS-First Architecture
Do NOT create `tailwind.config.js`. Define all configuration inside CSS using the `@theme` directive.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* OKLCH Colors for wide-gamut displays */
  --color-brand-50: oklch(97% 0.02 250);
  --color-brand-500: oklch(55% 0.2 250);

  /* Typography */
  --font-sans: "Inter Variable", system-ui, sans-serif;

  /* Custom breakpoints */
  --breakpoint-3xl: 112rem;
}

/* Register plugins */
@plugin "@tailwindcss/typography";
```

#### 2. Advanced Utilities
Utilize v4-native features instead of custom CSS where possible:
- **3D Transforms**: Use `perspective-1000`, `rotate-x-12`, `transform-3d`, `backface-hidden`.
- **Color Mix**: Use inline mixing: `text-[color-mix(in_oklch,blue_70%,white)]`.
- **Container Queries**: Use `@container` on the parent, `@sm:grid-cols-2` on children.
- **Auto-sizing**: Use `field-sizing-content` for dynamically sizing textareas.

#### 3. Migration (v3 to v4)
When upgrading older codebases:
1. Run `npx @tailwindcss/upgrade` automatically.
2. Manually verify `tailwind.config.js` logic is perfectly translated to `@theme` CSS variables.
3. Replace deprecated `addVariant` plugin code with `@variant` CSS directives:
   ```css
   @variant hocus (&:hover, &:focus);
   @variant dark (&:where(.dark, .dark *));
   ```

#### 4. Performance Directives
- **Zero Configuration**: Rely on v4's automatic content detection. Do not manually specify content paths.
- **Specificity**: Use `@layer utilities` strictly when custom CSS requires Tailwind's specificity tier.
- **No `@apply` Abuse**: Avoid `@apply` in loops or highly repeated components; use HTML utility classes to leverage Lightning CSS tree-shaking.

#### 5. Bootstrap to Tailwind Migration Guide
1. **Analyze the Legacy Structure**:
   - Identify the version of Bootstrap being used.
   - Locate custom CSS files that override Bootstrap defaults.
   - Identify interactive components (modals, dropdowns, tooltips, tabs, carousels) that rely on Bootstrap's JavaScript or jQuery.
2. **Setup Modern Tools**:
   - Ensure **Tailwind CSS v4** is properly set up in the project (e.g., via CDN for simple projects, or PostCSS/Vite for build steps).
   - Inject **Alpine.js** via CDN or module bundler to handle interactivity.
3. **Migration Strategy**:
   - **Grid & Layout**: Convert Bootstrap grids (`container`, `row`, `col-*`) to Tailwind flexbox (`flex`, `flex-col`, `gap-*`) or CSS Grid (`grid`, `grid-cols-*`).
   - **Spacing & Typography**: Map Bootstrap spacing (`m-3`, `p-4`) to Tailwind spacing (`m-4`, `p-6`—noting scale differences). Map typography utilities (`text-center`, `font-weight-bold`) to Tailwind equivalents (`text-center`, `font-bold`).
   - **Colors**: Update Bootstrap semantic colors (`primary`, `success`, `danger`) to Tailwind color palettes (e.g., `blue-600`, `green-500`, `red-500`) or define custom themes in CSS variables for Tailwind v4.
   - **Components**: Rebuild Bootstrap components (cards, buttons, alerts, navbars) using Tailwind utility classes to match or improve the original design.
4. **Interactivity with Alpine.js**:
   - Remove jQuery and Bootstrap JS dependencies.
   - Replace interactive Bootstrap components with Alpine.js data and directives.
   - **Dropdowns**: Use `x-data="{ open: false }"` and `@click="open = !open"`.
   - **Modals**: Use Alpine.js to manage the open state and handle background overlays and click-away events (`@click.outside`).
   - **Tabs**: Manage active tab state with `x-data="{ tab: 'home' }"`.
5. **UI/UX Modernization & Skill Integration**:
   - Do NOT just do a 1:1 translation of Bootstrap classes. The goal is to elevate the design.
   - You MUST orchestrate and apply guidelines from other UI/UX skills (`ui-ux-expert`, `ui-ux-pro-max`, and `hig`).
   - Implement Human Interface Guidelines (HIG) principles: Hierarchy, Harmony, and Consistency.
   - Use vibrant colors, smooth micro-animations, glassmorphism (if appropriate), and modern typography to "WOW" the user.
6. **Quality Assurance**:
   - Verify that responsive design behaves correctly across breakpoints (`sm:`, `md:`, `lg:`).
   - Ensure interactive components (modals, dropdowns) feel premium with Alpine.js transitions (`x-transition`).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ketat dan praktik terbaik untuk Tailwind CSS v4. Memaksa penggunaan model konfigurasi CSS-first, definisi token `@theme`, utilitas dinamis, dan optimasi performa melalui Lightning CSS.

### Kondisi Pemicu
- Menyiapkan atau mengonfigurasi proyek Tailwind CSS v4.
- Migrasi codebase dari Tailwind CSS v3 ke v4.
- Implementasi design token via `@theme`.
- Menggunakan 3D transform, container query, atau `field-sizing`.

## Integrasi Orkestrasi
Terintegrasi erat dengan skill berikut:
- **`senior-frontend`**: Menyuplai kapabilitas CSS modern ke dalam arsitektur komponen Next.js/React.
- **`design-system-architect, senior-frontend`**: Menyediakan primitif styling untuk komponen gaya Radix/shadcn.
- **`design-system-architect`**: Membangun token utama yang dipetakan di dalam `@theme`.

### Standar Eksekusi

#### 1. Arsitektur CSS-First
JANGAN membuat `tailwind.config.js`. Definisikan semua konfigurasi di dalam CSS menggunakan direktif `@theme`.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Warna OKLCH untuk layar wide-gamut */
  --color-brand-50: oklch(97% 0.02 250);
  --color-brand-500: oklch(55% 0.2 250);

  /* Tipografi */
  --font-sans: "Inter Variable", system-ui, sans-serif;
}

/* Registrasi plugin */
@plugin "@tailwindcss/typography";
```

#### 2. Utilitas Lanjutan
Gunakan fitur bawaan v4 alih-alih CSS kustom:
- **3D Transform**: Gunakan `perspective-1000`, `rotate-x-12`, `transform-3d`, `backface-hidden`.
- **Color Mix**: Gunakan `text-[color-mix(in_oklch,blue_70%,white)]`.
- **Container Queries**: Gunakan `@container` pada induk, `@sm:grid-cols-2` pada anak.
- **Auto-sizing**: Gunakan `field-sizing-content` untuk textarea agar ukurannya otomatis menyesuaikan.

#### 3. Migrasi (v3 ke v4)
Saat memperbarui codebase lama:
1. Jalankan `npx @tailwindcss/upgrade` secara otomatis.
2. Verifikasi manual logika `tailwind.config.js` agar diterjemahkan sempurna ke variabel CSS `@theme`.
3. Ganti plugin `addVariant` lama dengan direktif CSS `@variant`:
   ```css
   @variant hocus (&:hover, &:focus);
   @variant dark (&:where(.dark, .dark *));
   ```

#### 4. Arahan Performa
- **Konfigurasi Nol**: Andalkan deteksi konten otomatis v4. Jangan tentukan path konten secara manual.
- **Spesifisitas**: Gunakan `@layer utilities` secara ketat hanya jika CSS kustom memerlukan tingkat spesifisitas Tailwind.
- **Dilarang Menyalahgunakan `@apply`**: Hindari `@apply` pada loop atau komponen berulang; gunakan kelas utilitas di HTML untuk memaksimalkan tree-shaking Lightning CSS.

#### 5. Panduan Migrasi Bootstrap ke Tailwind
1. **Analisis Struktur Lama**:
   - Identifikasi versi Bootstrap yang digunakan.
   - Temukan file CSS kustom yang menimpa (override) default Bootstrap.
   - Identifikasi komponen interaktif (modal, dropdown, tooltip, tab, carousel) yang mengandalkan JavaScript Bootstrap atau jQuery.
2. **Setup Tools Modern**:
   - Pastikan **Tailwind CSS v4** disiapkan dengan benar di proyek (misalnya, melalui CDN untuk proyek sederhana, atau PostCSS/Vite jika ada build step).
   - Masukkan **Alpine.js** melalui CDN atau module bundler untuk menangani interaktivitas.
3. **Strategi Migrasi**:
   - **Grid & Layout**: Ubah grid Bootstrap (`container`, `row`, `col-*`) menjadi flexbox Tailwind (`flex`, `flex-col`, `gap-*`) atau CSS Grid (`grid`, `grid-cols-*`).
   - **Spacing & Tipografi**: Petakan spasi Bootstrap (`m-3`, `p-4`) ke Tailwind (`m-4`, `p-6`—perhatikan perbedaan skala). Petakan utilitas teks (`text-center`, `font-weight-bold`) ke padanan Tailwind (`text-center`, `font-bold`).
   - **Warna**: Perbarui warna semantik Bootstrap (`primary`, `success`, `danger`) ke palet warna Tailwind (misal: `blue-600`, `green-500`, `red-500`) atau definisikan tema kustom di variabel CSS untuk Tailwind v4.
   - **Komponen**: Bangun ulang komponen Bootstrap (card, button, alert, navbar) menggunakan kelas utilitas Tailwind untuk mencocokkan atau memperbaiki desain aslinya.
4. **Interaktivitas dengan Alpine.js**:
   - Hapus dependensi jQuery dan Bootstrap JS.
   - Ganti komponen interaktif Bootstrap dengan data dan direktif Alpine.js.
   - **Dropdown**: Gunakan `x-data="{ open: false }"` dan `@click="open = !open"`.
   - **Modal**: Gunakan Alpine.js untuk mengelola state terbuka, overlay latar belakang, dan event klik di luar (`@click.outside`).
   - **Tab**: Kelola state tab aktif dengan `x-data="{ tab: 'home' }"`.
5. **Modernisasi UI/UX & Integrasi Skill**:
   - JANGAN hanya menerjemahkan kelas Bootstrap 1:1. Tujuannya adalah meningkatkan kualitas desain.
   - Anda WAJIB mengorkestrasi dan menerapkan pedoman dari skill UI/UX lainnya (`ui-ux-expert`, `ui-ux-pro-max`, dan `hig`).
   - Terapkan prinsip Human Interface Guidelines (HIG): Hierarchy, Harmony, dan Consistency.
   - Gunakan warna cerah, mikro-animasi halus, glassmorphism (jika sesuai), dan tipografi modern untuk memberikan kesan "WOW" pada pengguna.
6. **Quality Assurance**:
   - Verifikasi bahwa desain responsif berfungsi dengan benar di semua breakpoint (`sm:`, `md:`, `lg:`).
   - Pastikan komponen interaktif (modal, dropdown) terasa premium dengan transisi Alpine.js (`x-transition`).