---
name: ui-components-expert
description: Expert guide for building production-quality UI components following the 4 pillars. Covers React 19, Radix UI, Base UI, Tailwind v4, Material Design 3 (M3), WCAG 2.2 / Panduan ahli membangun komponen UI berkualitas produksi dengan M3.
author: "vibes-plug-swarm"
---

# 🎨 UI Components Expert (2026/2027 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Evaluate, audit, and build production-quality UI components. Apply the 4 pillars of UI components with modern tooling: **shadcn/ui**, **Radix UI**, **Base UI**, **React 19**, **Tailwind v4**, **Material Design 3 (M3)**, **WCAG 2.2**, and micro-interaction design.

### Trigger Conditions
- Build or review UI components (buttons, forms, modals, navigation, tooltips).
- Implement accessible components (ARIA patterns, keyboard navigation).
- Audit components against WCAG 2.2.
- Set up component libraries (shadcn/ui, Radix UI, Base UI).
- Add micro-interactions and animations.

## Orchestration & Integration
This skill orchestrates and connects with:
- `senior-frontend`: For overall React 19 / Next.js 15 architecture.
- `tailwind-expert`: For Tailwind v4 styling and theming.
- `design-system-architect`: For system-wide design tokens and primitives.
- `hig`: For Human Interface Guidelines (Hierarchy, Harmony, Consistency).

### Component Stack (2026/2027)
- **Headless Primitives**: Radix UI / Base UI (Accessibility, behavior).
- **Component Library**: shadcn/ui (Pre-styled, customizable).
- **Styling**: Tailwind CSS v4 (Utility-first, `@theme` tokens).
- **Animation**: Motion / Framer Motion v12 (Spring physics).
- **Icons**: Lucide React.
- **Forms**: React Hook Form + Zod.

### The 4 Pillars of UI Components

#### 1: Input Controls
Capture user intent and data (Buttons, Forms, Selects).
- **M3 Integration (if requested)**: Use M3 button variants: Filled, Tonal, Elevated, Outlined, and Text. Include FABs (Floating Action Buttons) for primary screen actions.
- **Visual States**: Define `default`, `hover`, `active`, `focus`, `disabled`, and `error`.
- **Touch Targets**: Minimum 44×44px (WCAG 2.5.8), M3 recommends 48x48px.
- **Immediate Feedback**: Provide visual ripple or scale animation on interaction.
- **Inline Validation**: Show errors on blur. Use `aria-invalid` and `aria-describedby`.
- **Stack**: React Hook Form + Zod.

#### 2: Navigation
Move through application structure (Navbars, Tabs, Command Palettes).
- **M3 Integration (if requested)**: Use M3 Navigation Bar for mobile (bottom), Navigation Rail for tablet, and Navigation Drawer for desktop.
- **Active State**: Indicate current location with high-contrast visual indicators.
- **Keyboard Navigation**: Support Arrow Keys for tabs, `Escape` to close.
- **Responsive**: Bottom navigation (<768px), collapsible sidebar (tablet), full sidebar (desktop).
- **Command Palette**: Add `⌘K` via `cmdk`.
- **Next.js 15**: Use `<Link viewTransition>` for smooth transitions.
- **ARIA**: Use `role="navigation"` and `aria-current="page"`.

#### 3: Information & Feedback
Display status and guidance (Toasts, Skeletons, Empty States).
- **M3 Integration (if requested)**: Use Snackbar for transient messages. Use Badges on navigation icons for notifications.
- **Color Semantics**: Green (success), red (error), yellow (warning), blue (info).
- **Toasts**: Use **Sonner**. Limit to 3 concurrent. Auto-dismiss success, keep errors until dismissed.
- **Loading**: Use Skeletons matching exact content layout over spinners (prevents CLS).
- **Empty States**: Provide illustration, context, and clear CTA.
- **ARIA**: `aria-live="polite"` (updates), `aria-live="assertive"` (critical).

#### 4: Containers & Layout
Group related content (Cards, Modals, Sheets).
- **M3 Integration (if requested)**: Use M3 Card variants: Elevated, Filled, Outlined. Follow M3 Dialog guidelines for Modals.
- **Modals**: Use Radix UI Dialog. It handles focus trapping and scroll locking automatically.
- **Animation**: Animate in (`animate-in fade-in zoom-in-95`).
- **Cards**: Use subtle shadows + borders. Avoid heavy drop shadows in light mode.
- **Sheets**: Use bottom sheet for mobile secondary actions, side sheet for desktop.

### Micro-Interaction Checklist
- [ ] Implement `:focus-visible` ring (2px, brand color) on all interactives.
- [ ] **M3 State Layers**: If using M3, ensure interactive elements have distinct Hover, Focus, Pressed, and Dragged state layers.
- [ ] Add loading state (spinner + disabled) to submit buttons.
- [ ] Use **Framer Motion v12 spring physics** (`stiffness: 300, damping: 20`) for natural, snappy interactions. Avoid rigid linear transitions.
- [ ] Use `transition-all duration-200 ease-out` for simple hovers.
- [ ] Test dark mode for all states (especially error contrast).

### WCAG 2.2 Quick Reference
- **1.4.3**: Text contrast ≥4.5:1.
- **2.5.8**: Touch target ≥24×24px (min), 44×44px (target).
- **2.4.7**: Visible focus indicator.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Evaluasi, audit, dan bangun komponen UI berkualitas produksi. Terapkan 4 pilar komponen UI dengan tooling modern: **shadcn/ui**, **Radix UI**, **Base UI**, **React 19**, **Tailwind v4**, **Material Design 3 (M3)**, **WCAG 2.2**, dan desain micro-interaction.

### Kondisi Pemicu
- Membangun atau me-review komponen UI (tombol, form, modal, navigasi).
- Implementasi komponen aksesibel (pola ARIA, navigasi keyboard).
- Audit komponen berdasarkan WCAG 2.2.
- Setup library komponen (shadcn/ui, Radix UI, Base UI).
- Menambahkan micro-interaction dan animasi.

## Integrasi Orkestrasi
Skill ini mengorkestrasi dan terhubung dengan:
- `senior-frontend`: Untuk arsitektur keseluruhan React 19 / Next.js 15.
- `tailwind-expert`: Untuk styling dan theming Tailwind v4.
- `design-system-architect`: Untuk design token dan primitif skala sistem.
- `hig`: Untuk panduan Human Interface (Hierarki, Harmoni, Konsistensi).

### QA Visual Mandatori
- Wajib gunakan `browser_subagent` dan `visual-qa-vision-agent` untuk validasi layout.
- Standar Pixel-Perfect: Jangan menebak ukuran. Ambil screenshot dan koreksi pergeseran tata letak.

### Stack Komponen (2026/2027)
- **Headless**: Radix UI / Base UI.
- **Library**: shadcn/ui.
- **Styling**: Tailwind CSS v4.
- **Animasi**: Motion / Framer Motion v12.
- **Form**: React Hook Form + Zod.

### 4 Pilar Komponen UI

#### 1: Kontrol Input
Tangkap data (Tombol, Form, Select).
- **Integrasi M3 (jika diminta)**: Gunakan varian tombol M3: Filled, Tonal, Elevated, Outlined, dan Text. Sertakan FABs (Floating Action Buttons).
- Definisikan state visual: `default`, `hover`, `active`, `focus`, `disabled`, `error`.
- Target sentuh minimal 44×44px (M3 merekomendasikan 48x48px).
- Tampilkan error saat blur dengan `aria-invalid` dan `aria-describedby`.
- Gunakan React Hook Form + Zod.

#### 2: Navigasi
Pergerakan pengguna (Navbar, Tab, Command Palette).
- **Integrasi M3 (jika diminta)**: Gunakan Navigation Bar M3 untuk mobile, Navigation Rail untuk tablet, dan Navigation Drawer untuk desktop.
- Gunakan indikator visual kontras tinggi untuk lokasi aktif.
- Wajib dukung navigasi keyboard (Arrow Keys, Escape).
- Responsive: Bottom navigation (<768px), sidebar desktop.
- Gunakan `cmdk` untuk Command Palette `⌘K`.
- Tandai navigasi aktif dengan `aria-current="page"`.

#### 3: Informasi & Feedback
Tampilkan status (Toast, Skeleton, Empty State).
- **Integrasi M3 (jika diminta)**: Gunakan Snackbar untuk pesan sementara. Gunakan Badges pada ikon navigasi.
- Gunakan warna semantik secara konsisten.
- Gunakan **Sonner** untuk toast (maks 3 sekaligus).
- Gunakan Skeleton persis sesuai layout (jangan gunakan spinner untuk layout) guna mencegah CLS.
- Sediakan ilustrasi dan CTA pada Empty State.

#### 4: Kontainer & Layout
Kelompokkan konten (Card, Modal, Sheet).
- **Integrasi M3 (jika diminta)**: Gunakan varian Card M3: Elevated, Filled, Outlined. Ikuti panduan Dialog M3 untuk modal.
- Gunakan Radix UI Dialog untuk modal (menangani focus trap dan scroll lock).
- Animasikan kemunculan modal (fade + scale).
- Gunakan shadow tipis untuk elevasi card di mode terang.
- Gunakan bottom sheet di mobile.

### Checklist Micro-Interaction
- [ ] Ring `:focus-visible` (2px) pada elemen interaktif.
- [ ] **State Layers M3**: Jika menggunakan M3, pastikan elemen interaktif memiliki lapisan status (Hover, Focus, Pressed, Dragged) yang berbeda.
- [ ] State loading pada tombol.
- [ ] Gunakan **Framer Motion v12 spring physics** (`stiffness: 300, damping: 20`) untuk interaksi alami.
- [ ] Transisi hover `transition-all duration-200 ease-out`.
- [ ] Uji kontras warna dark mode.
