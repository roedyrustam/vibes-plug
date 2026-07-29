---
name: tailwind-expert
description: "Deep guide for Tailwind CSS v4, CSS-first configuration, theme customization, and responsive design / Panduan mendalam untuk Tailwind CSS v4, CSS-first configuration, theme kustomisasi, dan responsive design."
author: "Roedy Rustam"
---

# Tailwind CSS Expert (v4 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Deep expert guide for **Tailwind CSS v4** — covering the new CSS-first configuration model, `@theme` directive for design tokens, `@plugin` for plugins, 3D transforms, gradient improvements, and migration from v3.

### Trigger Conditions
- Setting up or configuring a new Tailwind CSS v4 project.
- Defining design tokens via `@theme` directive in CSS.
- Migrating from Tailwind CSS v3 to v4.
- Using new v4 utilities: 3D transforms, `field-sizing`, color mix functions.
- Registering custom plugins with `@plugin` directive.

### Tailwind v4 — The CSS-First Paradigm Shift

Tailwind v4 eliminates `tailwind.config.js` entirely. All configuration happens in CSS:

```css
/* app/globals.css */
@import "tailwindcss";

/* Design tokens — replaces tailwind.config.js theme */
@theme {
  /* Colors using OKLCH for wide-gamut displays */
  --color-brand-50: oklch(97% 0.02 250);
  --color-brand-500: oklch(55% 0.2 250);
  --color-brand-900: oklch(20% 0.1 250);

  /* Typography */
  --font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", ui-monospace;

  /* Spacing & Sizing */
  --spacing-18: 4.5rem;
  --spacing-112: 28rem;

  /* Custom animations */
  --animate-slide-in: slide-in 0.3s ease-out;
  --animate-fade-up: fade-up 0.4s ease-out;

  /* Breakpoints */
  --breakpoint-3xl: 112rem;
}

/* Register plugins via @plugin directive */
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";
@plugin "./plugins/animations.js";

/* Custom keyframes */
@keyframes slide-in {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes fade-up {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### New Utilities in Tailwind v4

#### 3D Transforms
```html
<!-- 3D perspective and rotation -->
<div class="perspective-1000">
  <div class="rotate-x-12 rotate-y-6 transform-3d hover:rotate-y-0 transition-transform duration-500">
    Card content
  </div>
</div>

<!-- perspective-{value}: sets perspective on parent -->
<!-- rotate-x-{deg}, rotate-y-{deg}: 3D rotation -->
<!-- transform-3d: enables 3D transform context -->
<!-- backface-visible, backface-hidden: card flip effects -->
```

#### Color Mix & Relative Colors
```html
<!-- Mix colors at the utility level -->
<div class="bg-brand-500/50">          <!-- 50% opacity -->
<div class="text-[color-mix(in_oklch,blue_70%,white)]">  <!-- CSS color-mix -->
<div class="border-brand-500 hover:border-brand-700">
```

#### Container Queries
```html
<!-- Responsive to parent container size, not viewport -->
<div class="@container">
  <div class="@sm:grid-cols-2 @lg:grid-cols-3 grid grid-cols-1">
    <!-- Adapts to container width, not screen width -->
  </div>
</div>
```

#### `field-sizing` for Auto-Resizing Textareas
```html
<textarea class="field-sizing-content resize-none min-h-20 max-h-64">
  Auto-resizes to fit content — no JavaScript needed!
</textarea>
```

### Migration from v3 to v4

#### Automated Migration Tool
```bash
npx @tailwindcss/upgrade
```

#### Key Breaking Changes
| v3 | v4 Equivalent |
|---|---|
| `tailwind.config.js` | `@theme {}` in CSS |
| `theme.extend.colors` | `--color-*` CSS vars in `@theme` |
| `plugins: [require('@tailwindcss/typography')]` | `@plugin "@tailwindcss/typography"` |
| `darkMode: 'class'` | `@variant dark (&:where(.dark, .dark *))` |
| `screens` in config | `--breakpoint-*` in `@theme` |
| `content` array | Auto-detected (no config needed) |

#### Custom Variants in v4
```css
/* Custom variants — replaces addVariant() in plugins */
@variant hocus (&:hover, &:focus);
@variant dark (&:where(.dark, .dark *));
@variant reduced-motion (@media (prefers-reduced-motion: reduce));
```

### Performance Tips
- Tailwind v4 uses **Lightning CSS** for transforms — 4x faster builds than v3 with PostCSS.
- CSS bundle is now fully tree-shaken — only styles used in your HTML/JSX are generated.
- Use `@layer utilities` for custom utilities that need Tailwind's specificity.
- Avoid `@apply` in performance-critical loops — prefer utility classes directly in HTML.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan mendalam untuk **Tailwind CSS v4** — mencakup model konfigurasi CSS-first baru, direktif `@theme` untuk design token, `@plugin` untuk plugin, 3D transform, peningkatan gradient, dan migrasi dari v3.

### Kondisi Pemicu
- Menyiapkan atau mengonfigurasi proyek Tailwind CSS v4 baru.
- Mendefinisikan design token via direktif `@theme` di CSS.
- Migrasi dari Tailwind CSS v3 ke v4.
- Menggunakan utilitas v4 baru: 3D transform, `field-sizing`, fungsi color mix.
- Mendaftarkan plugin kustom dengan direktif `@plugin`.

### Tailwind v4 — Pergeseran Paradigma CSS-First

Tailwind v4 menghilangkan `tailwind.config.js` sepenuhnya. Semua konfigurasi dilakukan di CSS menggunakan direktif `@theme`. Plugin didaftarkan dengan `@plugin`. Breakpoint, warna, spacing, animasi — semuanya didefinisikan sebagai variabel CSS `--*` di dalam blok `@theme`.

### Utilitas Baru di Tailwind v4

#### 3D Transform
Tailwind v4 menambahkan utilitas untuk 3D transform: `perspective-{nilai}`, `rotate-x-{derajat}`, `rotate-y-{derajat}`, `transform-3d`, `backface-visible`, `backface-hidden` — ideal untuk efek flip kartu dan galeri 3D.

#### Container Queries
Gunakan `@container` dan utilitas `@sm:`, `@lg:` untuk membuat komponen yang responsif terhadap ukuran container induknya, bukan ukuran viewport.

#### `field-sizing` untuk Textarea Auto-Resize
Kelas `field-sizing-content` membuat textarea otomatis menyesuaikan ukurannya dengan konten — tanpa JavaScript.

### Migrasi dari v3 ke v4

Gunakan alat migrasi otomatis `npx @tailwindcss/upgrade` untuk konversi dasar. Perubahan kunci:
- `tailwind.config.js` → `@theme {}` di CSS
- `plugins: [require('...')]` → `@plugin "..."`
- `darkMode: 'class'` → `@variant dark`
- Array `content` → Deteksi otomatis (tidak perlu konfigurasi)

### Tip Performa
- Tailwind v4 menggunakan **Lightning CSS** — build 4x lebih cepat dari v3 dengan PostCSS.
- Bundle CSS sepenuhnya di-tree-shake — hanya style yang digunakan yang dihasilkan.
- Gunakan `@layer utilities` untuk utilitas kustom yang membutuhkan spesifisitas Tailwind.
- Hindari `@apply` di loop kritis performa — gunakan kelas utilitas langsung di HTML.
