---
name: design-system-architect
description: "Expert guide for designing, building, and maintaining scalable UI design systems with design tokens, headless primitives (Radix/Base UI), Tailwind v4 @theme, and WCAG 2.2 accessibility in English and Indonesian."
author: "Roedy Rustam"
---

# Design System Architect

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade guidance for designing, building, documenting, and publishing scalable UI **Design Systems**. Covers Design Tokens architecture (OKLCH colors, spacing, typography, radii, shadows), headless accessibility primitives (**Radix UI**, **Base UI**, **React ARIA**), Tailwind CSS v4 `@theme` integration, component variance management (**CVA**), and WCAG 2.2 AAA accessibility standards.

### Trigger Conditions
- Bootstrapping or refactoring a component library or enterprise UI design system.
- Standardizing design tokens across Figma and codebase stylesheets.
- Building accessible, unstyled UI primitives (Dialog, Popover, Combobox, Select, Tabs, Data Table).
- Configuring Tailwind CSS v4 `@theme` tokens and CSS custom properties.
- Setting up component variants using `class-variance-authority` (CVA) and `cn()` utilities.
- Auditing UI accessibility compliance (keyboard navigation, focus management, screen reader ARIA roles).

### Design System Architecture Pillars

```
+-------------------------------------------------------------------+
|                           Figma Tokens                            |
+---------------------------------+---------------------------------+
                                  | Sync
+---------------------------------v---------------------------------+
|              Design Tokens (OKLCH, Rem, Durations)               |
+---------------------------------+---------------------------------+
                                  |
+---------------------------------v---------------------------------+
|            Tailwind v4 @theme / CSS Custom Properties             |
+---------------------------------+---------------------------------+
                                  |
+---------------------------------v---------------------------------+
|       Headless Accessible Primitives (Radix UI / Base UI)         |
+---------------------------------+---------------------------------+
                                  | Styled with CVA
+---------------------------------v---------------------------------+
|                  Production Component Library                     |
+-------------------------------------------------------------------+
```

#### 1. Design Tokens Architecture
Store design tokens as raw CSS custom properties or JSON variables. Use OKLCH color space for perceptual uniformity:
```css
@import "tailwindcss";

@theme {
  --color-brand-primary: oklch(0.62 0.24 256.4);
  --color-brand-surface: oklch(0.98 0.01 250.0);
  --font-sans: "Inter", system-ui, sans-serif;
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}
```

#### 2. Headless Primitives + CVA Pattern
Combine zero-styled, accessible primitives (Radix UI / Base UI) with `class-variance-authority` for type-safe variant styling:
```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand-primary text-white hover:bg-brand-primary/90',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
```

---

### Accessibility Standards (WCAG 2.2 AAA)
- **Contrast Ratios**: Minimum 4.5:1 for normal text and 3:1 for large text / UI controls.
- **Focus Rings**: Mandatory visible focus indicators (`focus-visible:ring-2 focus-visible:ring-offset-2`).
- **Touch Targets**: Minimum 44×44px interactive target area on touch devices.
- **Screen Reader Support**: Ensure correct ARIA attributes (`aria-expanded`, `aria-controls`, `aria-live`).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk merancang, membangun, mendokumentasikan, dan memelihara **Design System UI** yang skalabel. Mencakup arsitektur Design Tokens (warna OKLCH, spasi, tipografi, radii, bayangan), komponen dasar tanpa styling (*headless accessibility primitives* seperti **Radix UI**, **Base UI**, **React ARIA**), integrasi Tailwind CSS v4 `@theme`, manajemen varian komponen (**CVA**), serta standar aksesibilitas WCAG 2.2 AAA.

### Kondisi Pemicu
- Merancang atau merefaktor *component library* atau *design system UI* perusahaan.
- Menyelaraskan *design tokens* antara desain Figma dan kode aplikasi.
- Membangun komponen UI yang diakses via keyboard dan *screen reader* (Dialog, Popover, Combobox, Select, Tabs, Data Table).
- Mengonfigurasi token Tailwind CSS v4 `@theme` dan variabel CSS custom.
- Mengatur varian komponen menggunakan `class-variance-authority` (CVA) dan utilitas `cn()`.
- Mengaudit kepatuhan aksesibilitas UI (navigasi keyboard, manajemen fokus, peran ARIA).

### Pilar Arsitektur Design System
1. **Design Tokens**: Simpan token desain sebagai variabel CSS atau JSON. Gunakan ruang warna OKLCH untuk konsistensi visual.
2. **Headless Primitives + CVA Pattern**: Gabungkan pustaka aksesibel tanpa styling dengan CVA untuk varian komponen yang aman-tipe.
3. **Standar Aksesibilitas (WCAG 2.2 AAA)**:
   - Rasio kontras minimal 4.5:1 untuk teks normal.
   - Cincin fokus wajib terlihat saat navigasi keyboard (`focus-visible`).
   - Ukuran area sentuh minimal 44×44px pada perangkat mobile.
