---
name: tailwind-expert
description: "Expert guide for Tailwind CSS v4, CSS-first configuration, @theme customization, and modern responsive design / Panduan ahli untuk Tailwind CSS v4, konfigurasi CSS-first, kustomisasi @theme, dan desain responsif modern."
author: "vibes-plug-swarm"
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
- **`ui-components-expert`**: Provides the styling primitives for Radix/shadcn-style components.
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
- **`ui-components-expert`**: Menyediakan primitif styling untuk komponen gaya Radix/shadcn.
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
