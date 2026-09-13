---
name: modern-css-native-expert
description: "Expert guide for cutting-edge Native CSS (2026 Standard) — CSS Anchor Positioning, @starting-style, View Transitions Level 2, Container Queries, and :has() / Panduan ahli fitur CSS native modern 2026."
author: "Roedy Rustam"
version: "3.0.0"
---

# Modern Native CSS Expert (2026 Standard & Primitives)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Production-grade engineering guide for modern **Native CSS features (2026 Edition)** that replace cumbersome JavaScript libraries with pure browser-native primitives. Covers the **CSS Anchor Positioning API** for tooltips/popovers, **`@starting-style`** for smooth entry/exit animations on top-layer elements (`<dialog>`, `popover`), **View Transitions API Level 2**, **Container Queries (`@container`)**, and the **`:has()`** relational selector.

### Key Capabilities
1. **CSS Anchor Positioning**: Eliminating Floating UI / Popper.js dependencies. Tether tooltips, menus, and popovers to trigger elements natively with auto-flip fallbacks (`position-try-fallbacks`).
2. **Smooth Top-Layer Transitions**: Animating `<dialog>` and `[popover]` elements from `display: none` to visible with `@starting-style` and `transition-behavior: allow-discrete`.
3. **Container Queries (`@container`)**: Component-level responsive design based on parent container dimensions rather than viewport width.
4. **Relational `:has()` Selector**: Styling parent containers or sibling trees based on nested child states without React/JS state overhead.
5. **Native CSS Nesting & `@layer`**: Structuring clean, zero-build styles with cascade priority layers.

---

### Production Implementation Recipes

#### Recipe 1: Pure Native Anchor Positioning for Tooltips & Dropdowns (No JS)
```css
/* Define the anchor trigger button */
.anchor-trigger {
  anchor-name: --my-dropdown-anchor;
}

/* Tether the popover menu to the anchor trigger */
.dropdown-menu {
  position: fixed;
  position-anchor: --my-dropdown-anchor;
  
  /* Place below the anchor by default */
  top: anchor(bottom);
  left: anchor(left);
  margin-top: 8px;

  /* Automatic flip to top if screen boundary is reached */
  position-try-fallbacks: flip-block;
}
```

#### Recipe 2: Smooth `<dialog>` Entry/Exit Animation with `@starting-style`
```css
/* Dialog element with discrete transition support */
dialog {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
  transition: opacity 0.25s ease-out, transform 0.25s ease-out, display 0.25s allow-discrete;
}

/* Open state */
dialog[open] {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Starting style when transitioning from display: none to open */
@starting-style {
  dialog[open] {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
}

/* Backdrop smooth fade */
dialog::backdrop {
  background-color: rgb(0 0 0 / 0%);
  transition: background-color 0.25s ease-out, display 0.25s allow-discrete;
}

dialog[open]::backdrop {
  background-color: rgb(0 0 0 / 50%);
}

@starting-style {
  dialog[open]::backdrop {
    background-color: rgb(0 0 0 / 0%);
  }
}
```

---

### Implementation Checklist
- [ ] Replace JS positioning libraries (Popper, Floating UI) with native `anchor-name` and `position-anchor`.
- [ ] Use `@starting-style` and `transition-behavior: allow-discrete` for animating modals and popovers without JavaScript timers.
- [ ] Use `@container` on modular components to allow seamless reuse across sidebars, grids, and modals.
- [ ] Organize design tokens and reset styles into `@layer` (e.g. `@layer base, components, utilities;`).

## Orchestration & Integration
- Integrates with: `design-system-architect`, `design-system-architect, senior-frontend`, `tailwind-expert`, `senior-frontend`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Tujuan & Gambaran Umum
Panduan rekayasa tingkat produksi untuk memanfaatkan **Fitur CSS Native Modern (Standar 2026)** yang menggantikan pustaka JavaScript berukuran besar dengan fitur asli browser. Mencakup **CSS Anchor Positioning API** untuk tooltip dan popover, **`@starting-style`** untuk animasi masuk dan keluar yang mulus pada elemen *top-layer* (`<dialog>`, `popover`), **View Transitions API Level 2**, **Container Queries (`@container`)**, dan selektor relasional **`:has()`**.

### Kemampuan Utama
1. **CSS Anchor Positioning**: Menghapus ketergantungan pada pustaka seperti Floating UI atau Popper.js. Mengikat tooltip, menu, dan popover ke tombol pemicu secara native dengan pembalikan posisi otomatis (`position-try-fallbacks`).
2. **Animasi Mulus Top-Layer**: Menganimasikan dialog dari status `display: none` ke tampil menggunakan `@starting-style` dan `transition-behavior: allow-discrete`.
3. **Container Queries (`@container`)**: Desain responsif berbasis ukuran kontainer induk, bukan lebar layar viewport.
4. **Selektor Relasional `:has()`**: Menata gaya elemen induk berdasarkan status elemen anak di dalamnya tanpa membutuhkan *state* JavaScript.
5. **Nesting Native & `@layer`**: Mengatur hierarki gaya CSS tanpa alat build dan mengontrol urutan spesifisitas secara terstruktur.

---

### Resep Implementasi Produksi

#### Resep 1: Anchor Positioning Murni untuk Menu Dropdown (Tanpa JavaScript)
```css
/* Definisikan tombol pemicu sebagai jangkar (anchor) */
.tombol-pemicu {
  anchor-name: --jangkar-menu;
}

/* Hubungkan menu popover ke tombol pemicu */
.menu-dropdown {
  position: fixed;
  position-anchor: --jangkar-menu;
  
  /* Posisikan di bawah tombol pemicu */
  top: anchor(bottom);
  left: anchor(left);
  margin-top: 8px;

  /* Balik posisi ke atas jika terpotong batas layar */
  position-try-fallbacks: flip-block;
}
```

#### Resep 2: Animasi Modal `<dialog>` dengan `@starting-style`
```css
dialog {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
  transition: opacity 0.25s ease-out, transform 0.25s ease-out, display 0.25s allow-discrete;
}

dialog[open] {
  opacity: 1;
  transform: scale(1) translateY(0);
}

@starting-style {
  dialog[open] {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
}

dialog::backdrop {
  background-color: rgb(0 0 0 / 0%);
  transition: background-color 0.25s ease-out, display 0.25s allow-discrete;
}

dialog[open]::backdrop {
  background-color: rgb(0 0 0 / 50%);
}

@starting-style {
  dialog[open]::backdrop {
    background-color: rgb(0 0 0 / 0%);
  }
}
```

---

### Checklist Implementasi
- [ ] Ganti library positioning pihak ketiga dengan CSS `anchor-name` dan `position-anchor`.
- [ ] Gunakan `@starting-style` dan `transition-behavior: allow-discrete` untuk animasi modal tanpa jeda JavaScript.
- [ ] Gunakan `@container` pada komponen reusable agar adaptif di semua layout.
- [ ] Tata arsitektur CSS menggunakan `@layer base, components, utilities;`.

## Integrasi Orkestrasi
- Terintegrasi dengan: `design-system-architect`, `design-system-architect, senior-frontend`, `tailwind-expert`, `senior-frontend`.