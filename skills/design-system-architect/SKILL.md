---
name: design-system-architect
description: "Expert guide for designing, building, and maintaining scalable UI design systems with design tokens, headless primitives (Radix/Base UI), Tailwind v4 @theme, and WCAG 2.2 accessibility in English and Indonesian."
author: "Roedy Rustam"
---

# Design System Architect (2026 Edition — shadcn/ui Registry)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for building and maintaining scalable UI design systems. Covers design tokens with OKLCH and Tailwind v4 `@theme`, headless component primitives (Radix UI, **Base UI 1.x**), **shadcn/ui registry** for distributable component libraries, CVA for type-safe variants, and WCAG 2.2 accessibility compliance.

### Trigger Conditions
- Building a shared UI component library from scratch.
- Setting up design tokens (colors, typography, spacing) with Tailwind v4.
- Using headless primitives (Radix UI, Base UI 1.x) with custom styling.
- Distributing components via the **shadcn/ui registry** format.
- Auditing a component library for WCAG 2.2 accessibility compliance.

### Design Token Foundation (Tailwind v4 + OKLCH)

```css
/* packages/ui/src/tokens.css */
@import "tailwindcss";

@theme {
  /* --- Color System (OKLCH for wide-gamut P3 displays) --- */
  /* Brand */
  --color-brand-50:  oklch(97% 0.015 250);
  --color-brand-100: oklch(93% 0.04  250);
  --color-brand-500: oklch(55% 0.22  250);
  --color-brand-700: oklch(40% 0.18  250);
  --color-brand-900: oklch(20% 0.10  250);

  /* Semantic (maps to brand in light/dark automatically) */
  --color-primary:     var(--color-brand-500);
  --color-primary-fg:  oklch(100% 0 0);        /* White */
  --color-surface:     oklch(100% 0 0);        /* White */
  --color-surface-2:   oklch(97% 0.005 250);
  --color-border:      oklch(90% 0.01  250);
  --color-text:        oklch(15% 0.02  250);
  --color-text-muted:  oklch(50% 0.015 250);
  --color-destructive: oklch(55% 0.22  25);    /* Red */

  /* --- Typography --- */
  --font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  --font-size-xs:   0.75rem;
  --font-size-sm:   0.875rem;
  --font-size-base: 1rem;
  --font-size-lg:   1.125rem;
  --font-size-xl:   1.25rem;
  --font-size-2xl:  1.5rem;
  --font-size-3xl:  1.875rem;
  --font-size-4xl:  2.25rem;

  /* --- Spacing & Radius --- */
  --radius-sm:  0.25rem;
  --radius-md:  0.5rem;
  --radius-lg:  0.75rem;
  --radius-xl:  1rem;
  --radius-full: 9999px;

  /* --- Animation --- */
  --animate-fade-in:   fade-in   0.2s ease-out;
  --animate-slide-up:  slide-up  0.3s cubic-bezier(0.16, 1, 0.3, 1);
  --animate-scale-in:  scale-in  0.2s ease-out;
}

/* Dark mode tokens */
@variant dark {
  :root {
    --color-surface:    oklch(10% 0.015 250);
    --color-surface-2:  oklch(15% 0.015 250);
    --color-border:     oklch(25% 0.02  250);
    --color-text:       oklch(95% 0.005 250);
    --color-text-muted: oklch(60% 0.01  250);
  }
}
```

### Component Architecture

#### Headless + Styled Pattern (Base UI 1.x / Radix UI)
Use headless primitives for accessibility, apply styles via Tailwind + CVA:

```typescript
// packages/ui/src/button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-fg shadow-sm hover:brightness-110 active:brightness-90',
        secondary:   'bg-surface-2 text-text border border-border hover:bg-surface hover:border-brand-300',
        destructive: 'bg-destructive text-white hover:brightness-110',
        ghost:       'hover:bg-surface-2 text-text',
        link:        'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm:   'h-8  px-3 text-xs',
        md:   'h-9  px-4 text-sm',
        lg:   'h-11 px-6 text-base',
        icon: 'h-9  w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### shadcn/ui Registry — Distributable Components (2026)

shadcn/ui v2 introduces a **registry** system — distribute your components as a shareable library that others can `npx shadcn add` into their projects:

```json
// registry.json — defines your component library
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "my-ui",
  "homepage": "https://ui.myapp.com",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "title": "Button",
      "description": "Multi-variant button component with CVA",
      "files": [
        { "path": "registry/ui/button.tsx", "type": "registry:ui" }
      ],
      "tailwind": {
        "config": {
          "theme": {
            "extend": {
              "colors": { "primary": "hsl(var(--primary))" }
            }
          }
        }
      }
    }
  ]
}
```

```bash
# Users install your components directly
npx shadcn add https://ui.myapp.com/registry.json button
npx shadcn add https://ui.myapp.com/registry.json card dialog
```

### Base UI 1.x — Unstyled Accessibility Primitives
Base UI (from MUI team) is the 2026 alternative to Radix UI with React 19 native support:
```typescript
import { Dialog, Button, Select } from '@base-ui-components/react';

// Fully unstyled — apply any className/Tailwind styles
<Dialog.Root>
  <Dialog.Trigger render={<Button />}>Open Dialog</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop className="fixed inset-0 bg-black/50 animate-fade-in" />
    <Dialog.Popup className="fixed inset-0 m-auto h-fit max-w-md rounded-xl bg-surface p-6 shadow-xl animate-slide-up">
      <Dialog.Title className="text-lg font-semibold">Title</Dialog.Title>
      <Dialog.Close className="absolute right-4 top-4">✕</Dialog.Close>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

### WCAG 2.2 Accessibility Checklist
- [ ] All interactive elements have visible focus indicators (`ring-2`).
- [ ] Color contrast ≥ 4.5:1 (text), ≥ 3:1 (large text / UI components).
- [ ] All images have `alt` text; decorative images have `alt=""`.
- [ ] All form inputs have associated `<label>` elements.
- [ ] Keyboard navigation works for all interactions (Tab, Enter, Space, Escape, Arrow keys).
- [ ] `aria-label` or `aria-labelledby` on icon buttons.
- [ ] Modals trap focus and restore it on close.
- [ ] No content relies on color alone to convey information.
- [ ] Touch targets ≥ 24×24px (WCAG 2.2 new requirement).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk membangun dan memelihara design system UI yang skalabel. Mencakup design token dengan OKLCH dan `@theme` Tailwind v4, primitif komponen headless (Radix UI, **Base UI 1.x**), **registry shadcn/ui** untuk distribusi library komponen, CVA untuk varian type-safe, dan kepatuhan aksesibilitas WCAG 2.2.

### Kondisi Pemicu
- Membangun library komponen UI bersama dari awal.
- Menyiapkan design token (warna, tipografi, spacing) dengan Tailwind v4.
- Menggunakan primitif headless (Radix UI, Base UI 1.x) dengan styling kustom.
- Mendistribusikan komponen via format **registry shadcn/ui**.
- Mengaudit library komponen untuk kepatuhan aksesibilitas WCAG 2.2.

### Fondasi Design Token (Tailwind v4 + OKLCH)
Definisikan semua token di CSS menggunakan direktif `@theme`. Gunakan warna OKLCH untuk tampilan P3 wide-gamut. Definisikan token semantik (`--color-primary`, `--color-surface`, `--color-border`) yang secara otomatis beradaptasi antara mode terang/gelap melalui `@variant dark`.

### Arsitektur Komponen
Gunakan pola Headless + Styled: primitif headless (Base UI/Radix) untuk aksesibilitas, gaya melalui Tailwind + CVA (class-variance-authority) untuk varian type-safe.

### Registry shadcn/ui — Komponen yang Dapat Didistribusikan (2026)
shadcn/ui v2 memperkenalkan sistem registry — distribusikan komponen Anda sebagai library yang dapat dibagikan sehingga orang lain dapat menginstalnya dengan `npx shadcn add [url] [komponen]`.

### Base UI 1.x — Primitif Aksesibilitas Tanpa Gaya
Base UI (dari tim MUI) adalah alternatif Radix UI untuk 2026 dengan dukungan native React 19. Sepenuhnya tanpa gaya — terapkan className/Tailwind apapun.

### Checklist Aksesibilitas WCAG 2.2
- Semua elemen interaktif memiliki indikator fokus yang terlihat.
- Kontras warna ≥ 4.5:1 (teks), ≥ 3:1 (komponen UI).
- Semua input form memiliki elemen `<label>` terkait.
- Navigasi keyboard berfungsi untuk semua interaksi.
- Modal menjebak fokus dan memulihkannya saat ditutup.
- Target sentuh ≥ 24×24px (persyaratan baru WCAG 2.2).
