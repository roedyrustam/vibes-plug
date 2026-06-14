---
name: ui-ux-pro-max
description: "Panduan desain komprehensif untuk aplikasi web dan mobile / Comprehensive design guide for web and mobile applications."
author: "Roedy Rustam"
---

# UI/UX Pro Max - Design Intelligence

[Bahasa Indonesia](#bahasa-indonesia) | [English](#english)

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan desain komprehensif untuk aplikasi web dan mobile. Berisi pedoman palet warna, tipografi, serta pedoman UX mendalam untuk 9 tumpukan teknologi (technology stacks) dengan rekomendasi berbasis prioritas.

### Kondisi Pemicu
Tinjau pedoman ini ketika:
- Mendesain komponen UI atau halaman baru.
- Memilih palet warna dan tipografi.
- Meninjau kode untuk masalah kegunaan (UX).
- Membangun landing page atau dashboard.
- Menerapkan persyaratan aksesibilitas (a11y).

### Acuan Cepat Aturan Profesional

#### 1. Aksesibilitas (A11y) - KRITIS
- **Kontras Warna**: Rasio kontras minimal 4.5:1 untuk teks normal agar mudah dibaca.
- **Focus States**: Tampilkan cincin fokus (focus ring) yang jelas saat elemen interaktif dinavigasikan dengan keyboard.
- **Alt Text**: Sediakan alt text deskriptif pada gambar yang memiliki arti penting.

#### 2. Sentuhan & Interaksi - KRITIS
- **Touch Target Size**: Ukuran area sentuh minimal 44x44px untuk perangkat mobile.
- **Loading Buttons**: Nonaktifkan tombol selama operasi asinkron sedang berjalan agar tidak terjadi submit ganda.
- **Cursor Pointer**: Tambahkan `cursor-pointer` pada semua elemen interaktif yang dapat diklik atau memiliki efek hover.

#### 3. Performa & Animasi - TINGGI / MENENGAH
- **Optimasi Gambar**: Gunakan format WebP/AVIF, atribut srcset, dan lazy loading.
- **Mikro-interaksi**: Gunakan durasi 150-300ms untuk transisi state agar terasa responsif namun halus.

#### 4. Kontras Mode Terang & Gelap
- **Mode Terang**: Gunakan warna teks gelap yang jelas (misal Slate-900 `#0F172A`), hindari teks abu-abu pudar. Gunakan warna batas (border) yang kontras.
- **Mode Gelap**: Pastikan latar belakang gelap memberikan kontras yang cukup dengan elemen di atasnya.

### Checklist Desain UI/UX Sebelum Delivery
- [ ] **Visual**: Tidak menggunakan emoji sebagai ikon (gunakan SVG). Ikon berasal dari set yang konsisten. Efek hover tidak menggeser layout.
- [ ] **Interaksi**: Semua elemen klik memiliki `cursor-pointer`. Transisi halus (150-300ms).
- [ ] **Kontras**: Kontras teks mode terang minimal 4.5:1. Borders terlihat di kedua mode.
- [ ] **Layout**: Elemen melayang (floating navbar) memiliki spacing yang pas dari tepi. Responsif diuji di berbagai breakpoint (375px, 768px, 1024px, 1440px). Tidak ada scroll horizontal pada mobile.
- [ ] **Aksesibilitas**: Semua gambar memiliki alt text. Form input memiliki label terkait.

---

<a name="english"></a>
## English

### Description
Comprehensive design guide for web and mobile applications. Contains guides for color palettes, typography, and deep UX guidelines across 9 technology stacks with priority-based recommendations.

### Trigger Conditions
Reference these guidelines when:
- Designing new UI components or pages.
- Choosing color palettes and typography.
- Reviewing code for UX issues.
- Building landing pages or dashboards.
- Implementing accessibility requirements.

### Quick Reference for Professional Rules

#### 1. Accessibility - CRITICAL
- **Color Contrast**: Minimum 4.5:1 ratio for normal text.
- **Focus States**: Visible focus rings on interactive elements during keyboard navigation.
- **Alt Text**: Descriptive alt text for meaningful images.

#### 2. Touch & Interaction - CRITICAL
- **Touch Target Size**: Minimum 44x44px touch targets for mobile.
- **Loading Buttons**: Disable buttons during asynchronous operations to prevent double submissions.
- **Cursor Pointer**: Add `cursor-pointer` to all interactive/clickable elements.

#### 3. Performance & Animation - HIGH / MEDIUM
- **Image Optimization**: Use WebP/AVIF formats, srcset, and lazy loading.
- **Micro-interactions**: Use 150-300ms durations for responsive and smooth transitions.

#### 4. Light/Dark Mode Contrast
- **Light Mode**: Use high-contrast dark text (e.g., Slate-900 `#0F172A`); avoid faint gray text. Ensure borders are visible.
- **Dark Mode**: Verify that background tones provide enough contrast with foreground elements.

### UI/UX Design Checklist Before Delivery
- [ ] **Visual Quality**: Emojis are not used as icons (use SVG). Icons from a consistent set. Hovers do not shift layout.
- [ ] **Interaction**: All clickable elements have `cursor-pointer`. Smooth transitions (150-300ms).
- [ ] **Contrast**: Text contrast in light mode is at least 4.5:1. Borders visible in both modes.
- [ ] **Layout**: Floating elements have proper spacing from edges. Responsive tested at multiple breakpoints (375px, 768px, 1024px, 1440px). No horizontal scroll on mobile.
- [ ] **Accessibility**: All images have alt text. Form inputs have labels.
