---
name: ui-components-expert
description: "Expert guide for building production-quality UI components following the 4 pillars: Input Controls, Navigation, Information, and Containers. Covers React 19, Radix UI, shadcn/ui, accessibility (WCAG 2.2), and modern interaction patterns / Panduan ahli membangun komponen UI berkualitas produksi dengan 4 pilar: Kontrol Input, Navigasi, Informasi, dan Kontainer."
author: "Roedy Rustam"
---

# 🎨 UI Components Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for evaluating, auditing, and building production-quality UI components in 2026. Covers the **4 pillars of UI components** with modern tooling: **shadcn/ui**, **Radix UI**, **Base UI**, **React 19 patterns**, **WCAG 2.2 accessibility**, and micro-interaction design. Use this skill when building, reviewing, or improving any interactive UI element.

### Trigger Conditions
- Building or reviewing UI components: buttons, forms, modals, navigation, tooltips, notifications.
- Implementing accessible components with ARIA patterns and keyboard navigation.
- Auditing existing components against WCAG 2.2 and interaction design standards.
- Setting up a component library with **shadcn/ui**, **Radix UI**, or **Base UI**.
- Adding micro-interactions, hover states, focus rings, and animation to components.

---

### Component Stack Recommendation (2026)

| Layer | Tool | Purpose |
|---|---|---|
| **Headless Primitives** | Radix UI / Base UI (MUI) | Accessibility, behavior, no styles |
| **Component Library** | shadcn/ui (copy-paste) | Pre-styled, customizable, owns the code |
| **Styling** | Tailwind CSS v4 | Utility-first, design tokens via `@theme` |
| **Animation** | Motion (Framer Motion v12) | Spring physics, layout animations |
| **Icons** | Lucide React | Consistent, tree-shakeable icon set |
| **Forms** | React Hook Form + Zod | Type-safe, performant form state |

---

### The 4 Pillars of UI Components

#### Pillar 1: Input Controls
Components that capture user intent and data.
*Examples: Buttons, Checkboxes, Radio Groups, Text Fields, Selects, Switches, Sliders, Date Pickers*

**Best Practices:**
- **Clear Visual States**: Every input must have distinct `default`, `hover`, `active`, `focus`, `disabled`, and `error` states.
- **Touch Target Sizes**: Minimum 44×44px (WCAG 2.5.8) for all interactive elements on mobile.
- **Immediate Feedback**: Provide visual/haptic feedback on interaction — ripple, color change, or animation.
- **Inline Validation**: Show error messages immediately after blur, not only on submit. Use `aria-invalid` and `aria-describedby` for screen readers.
- **React Hook Form + Zod Pattern**:
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export function UserForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="..."
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-destructive text-sm">
            {errors.email.message}
          </p>
        )}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

---

#### Pillar 2: Navigation
Components that help users move through the application structure.
*Examples: Navbars, Tabs, Breadcrumbs, Pagination, Sidebars, Dropdowns, Command Palettes*

**Best Practices:**
- **Active State Clarity**: Always indicate the current location with a high-contrast visual indicator (filled background, underline, bold text). Never use color alone.
- **Keyboard Navigation**: Tabs must support Arrow Keys; menus must support `Escape` to close; focus must be managed on open/close.
- **Responsive Patterns**: Use bottom navigation on mobile (<768px), collapsible sidebar on tablet, full sidebar on desktop.
- **Command Palette (2026 Standard)**: Add `⌘K` / `Ctrl+K` command palette for power users using `cmdk` library.
- **`<Link>` with View Transitions** (Next.js 15):
```tsx
import Link from 'next/link';

// Enables smooth page transitions
<Link href="/dashboard" viewTransition>
  Dashboard
</Link>
```
- **ARIA Roles**: Use `role="navigation"` with `aria-label` on `<nav>`. Mark current page with `aria-current="page"`.

---

#### Pillar 3: Information & Feedback
Components that display status, guidance, or alerts to users.
*Examples: Toast Notifications, Tooltips, Badges, Alert Banners, Progress Bars, Skeletons, Empty States*

**Best Practices:**
- **Contextual Color System**: Use semantic colors consistently — green (success), red (error/destructive), yellow (warning), blue (info).
- **Toast Notifications**: Use **Sonner** (lightweight, accessible) — limit to 3 concurrent toasts, auto-dismiss success in 4s, keep errors until dismissed.
- **Skeleton Loading**: Prefer skeletons over spinners for content areas — they reduce perceived load time and prevent layout shift (CLS).
```tsx
// Sonner toast
import { toast } from 'sonner';

toast.success('Profile updated!');
toast.error('Something went wrong', { description: 'Please try again.' });
toast.promise(saveProfile(), {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save',
});
```
- **Empty States**: Never show blank areas — provide illustration, explanation, and a clear CTA.
- **`aria-live` for Dynamic Content**: Use `aria-live="polite"` for non-urgent updates, `aria-live="assertive"` for critical errors.

---

#### Pillar 4: Containers & Layout
Components that group related content into structured visual units.
*Examples: Cards, Modals (Dialogs), Sheets (Drawers), Accordions, Tabs, Carousels, Popover*

**Best Practices:**
- **Modal/Dialog (Radix UI)**:
```tsx
import * as Dialog from '@radix-ui/react-dialog';

export function ConfirmDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Delete Account</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-2xl p-6 w-[400px] animate-in fade-in zoom-in-95"
          aria-describedby="dialog-description"
        >
          <Dialog.Title className="text-lg font-semibold">Are you sure?</Dialog.Title>
          <Dialog.Description id="dialog-description" className="text-muted-foreground mt-2">
            This action cannot be undone.
          </Dialog.Description>
          <div className="flex gap-3 mt-6 justify-end">
            <Dialog.Close asChild>
              <button className="btn-secondary">Cancel</button>
            </Dialog.Close>
            <button onClick={onConfirm} className="btn-destructive">Delete</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```
- **Focus Trap**: Radix UI handles focus trapping automatically inside dialogs.
- **Scroll Lock**: Lock body scroll when modal is open — Radix handles this.
- **Card Design**: Use subtle shadows + borders for elevation. Never use heavy drop shadows on cards in light mode.
- **Sheet/Drawer**: Use for mobile-first secondary actions. Prefer bottom sheet on mobile, side sheet on desktop.

---

### Micro-Interaction Checklist (Next-Gen)
These small details separate premium from basic UI:
- [ ] All interactive elements have `:focus-visible` ring (2px, brand color).
- [ ] Buttons have loading state with spinner + disabled state.
- [ ] Form fields animate error shake on invalid submit.
- [ ] **Physics-Based Animation**: Do not rely solely on linear `ease-in-out`. Use Framer Motion (v12) `spring` physics (`stiffness: 300, damping: 20`) for modals, popovers, and interactive elements to provide a natural, snappy feel.
- [ ] Hover transitions on simple buttons use `transition-all duration-200 ease-out`.
- [ ] Modals animate in with fade + scale: `animate-in fade-in zoom-in-95`.
- [ ] List items stagger-animate when rendered (use Motion `stagger`).
- [ ] Skeleton loaders match the exact layout of the content they replace.
- [ ] Dark mode tested for all states (especially error/warning colors).

### Accessibility (WCAG 2.2) Quick Reference
| Criterion | Requirement |
|---|---|
| **1.4.3** | Text contrast ≥4.5:1 (normal), ≥3:1 (large/bold) |
| **2.5.8** | Touch target ≥24×24px (min), 44×44px (recommended) |
| **2.4.7** | Focus indicator visible on all interactive elements |
| **2.4.11** | Focus not obscured by sticky headers |
| **3.2.2** | No unexpected context change on input |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk mengevaluasi, mengaudit, dan membangun komponen UI berkualitas produksi di 2026. Mencakup **4 pilar komponen UI** dengan tooling modern: **shadcn/ui**, **Radix UI**, **Base UI**, **pola React 19**, **aksesibilitas WCAG 2.2**, dan desain micro-interaction. Gunakan skill ini saat membangun, me-review, atau meningkatkan elemen UI interaktif apapun.

### Kondisi Pemicu
- Membangun atau me-review komponen UI: tombol, form, modal, navigasi, tooltip, notifikasi.
- Mengimplementasikan komponen aksesibel dengan pola ARIA dan navigasi keyboard.
- Mengaudit komponen yang ada terhadap standar WCAG 2.2 dan desain interaksi.
- Menyiapkan library komponen dengan shadcn/ui, Radix UI, atau Base UI.
- Menambahkan micro-interaction, hover state, focus ring, dan animasi ke komponen.

### QA Visual Mandatori (KRITIS)
- **Siklus Verifikasi Visual**: Anda DILARANG KERAS menyelesaikan komponen UI tanpa mengambil screenshot menggunakan `browser_subagent` dan menganalisisnya via `visual-qa-vision-agent`.
- **Standar Pixel-Perfect**: Jangan menebak padding/margin. Ambil gambar, analisis dengan kemampuan Vision Anda, dan koreksi pergeseran tata letak hingga sempurna.

### Stack Komponen Rekomendasi (2026)
- **Headless Primitives**: Radix UI / Base UI — aksesibilitas dan behavior tanpa style.
- **Library Komponen**: shadcn/ui — pre-styled, customizable, kode dimiliki sendiri.
- **Styling**: Tailwind CSS v4 — utility-first dengan design token via `@theme`.
- **Animasi**: Motion (Framer Motion v12) — spring physics, layout animations.
- **Form**: React Hook Form + Zod — type-safe, performa tinggi.

### 4 Pilar Komponen UI

#### Pilar 1: Kontrol Input
Komponen yang menangkap input dan data pengguna (tombol, form, checkbox, select, switch).

**Best Practices:**
- Setiap input harus memiliki state visual yang jelas: `default`, `hover`, `active`, `focus`, `disabled`, `error`.
- Ukuran touch target minimal 44×44px untuk elemen interaktif di mobile.
- Validasi inline dengan pesan error yang muncul setelah blur, bukan hanya saat submit.
- Gunakan `aria-invalid` dan `aria-describedby` untuk screen reader.
- Gunakan **React Hook Form + Zod** untuk form yang type-safe dan berperforma tinggi.

#### Pilar 2: Navigasi
Komponen yang membantu pengguna bergerak dalam struktur aplikasi (navbar, tab, breadcrumb, sidebar, command palette).

**Best Practices:**
- Selalu tunjukkan lokasi saat ini dengan indikator visual yang jelas (background, garis bawah, teks tebal).
- Navigasi keyboard wajib: Arrow Keys untuk tab/menu, Escape untuk menutup, fokus terkelola saat buka/tutup.
- Gunakan bottom navigation di mobile, sidebar di desktop.
- Tambahkan command palette `⌘K` untuk power user menggunakan library `cmdk`.
- Tandai halaman aktif dengan `aria-current="page"`.

#### Pilar 3: Informasi & Feedback
Komponen yang menampilkan status, panduan, atau peringatan (toast, tooltip, badge, skeleton, empty state).

**Best Practices:**
- Warna semantik yang konsisten: hijau (sukses), merah (error), kuning (peringatan), biru (info).
- Gunakan **Sonner** untuk toast notifikasi — ringan dan aksesibel.
- Gunakan skeleton loader (bukan spinner) untuk area konten guna mengurangi perceived load time.
- Selalu sediakan empty state dengan ilustrasi, penjelasan, dan CTA yang jelas.
- Gunakan `aria-live="polite"` untuk pembaruan konten dinamis.

#### Pilar 4: Kontainer & Layout
Komponen yang mengelompokkan konten terkait (card, modal/dialog, sheet/drawer, accordion, popover).

**Best Practices:**
- Gunakan **Radix UI Dialog** untuk modal — menangani focus trap, scroll lock, dan aksesibilitas secara otomatis.
- Animasikan modal dengan fade + scale: `animate-in fade-in zoom-in-95`.
- Gunakan shadow tipis + border untuk elevasi card. Hindari drop shadow berat di mode terang.
- Gunakan bottom sheet di mobile, side sheet di desktop untuk aksi sekunder.

### Checklist Micro-Interaction (Next-Gen)
Detail kecil yang membedakan UI premium dari yang biasa:
- [ ] Semua elemen interaktif memiliki `:focus-visible` ring (2px, warna brand).
- [ ] Tombol memiliki loading state dengan spinner + disabled state.
- [ ] **Animasi Fisika (Spring)**: Hindari transisi linier kaku. Gunakan Framer Motion (v12) `spring` (`stiffness: 300, damping: 20`) pada interaksi klik, modal, dan dropdown agar terasa alami dan sangat responsif.
- [ ] Hover transition sederhana menggunakan `transition-all duration-200 ease-out`.
- [ ] Modal dan drawer muncul dengan animasi fade + scale yang mulus.
- [ ] Skeleton loader sesuai persis dengan layout konten yang digantikan.
- [ ] Dark mode diuji untuk semua state (terutama warna error/warning).
