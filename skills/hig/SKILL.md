---
name: hig
description: "Applies Human Interface Guidelines (HIG) principles — Hierarchy, Harmony, and Consistency — to UI/UX designs to ensure intuitive and cohesive interfaces / Menerapkan prinsip Human Interface Guidelines (HIG) — Hierarchy, Harmony, dan Consistency — pada desain UI/UX untuk memastikan antarmuka yang intuitif dan kohesif."
author: "Roedy Rustam"
---

# Human Interface Guidelines (HIG) Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Applies Human Interface Guidelines (HIG) principles to web and mobile UI/UX designs. Covers the core triad (Hierarchy, Harmony, Consistency), Apple's HIG 2025 updates, Google Material Design 3, spatial design for Apple Vision Pro, and modern accessibility requirements.

### Trigger Conditions
- Reviewing or critiquing a UI design for HIG violations.
- Making design decisions about typography scale, color usage, or layout hierarchy.
- Designing for multiple platforms (iOS, Android, web) with consistent patterns.
- Evaluating whether a UI feels "premium" or "amateur".
- Ensuring UI components follow platform conventions (button placement, nav patterns).

### The Core HIG Triad

#### 1. Hierarchy — Guide the User's Eye
Visual hierarchy controls where the user looks first and how they navigate information.

**Typography Hierarchy:**
```css
/* Clear hierarchy with size and weight — 4 levels max */
.h1 { font-size: 2.25rem; font-weight: 700; letter-spacing: -0.02em; }
.h2 { font-size: 1.5rem;  font-weight: 600; letter-spacing: -0.01em; }
.h3 { font-size: 1.25rem; font-weight: 600; }
.body { font-size: 1rem;    font-weight: 400; }
.caption { font-size: 0.875rem; font-weight: 400; color: var(--color-text-muted); }
```

**Spatial Hierarchy (Z-axis):**
- Surface level: cards, panels — `shadow-sm`
- Raised level: dropdowns, tooltips — `shadow-md`
- Overlay level: modals, drawers — `shadow-xl`
- Floating level: toasts, command palette — `shadow-2xl`

**Color Hierarchy:**
- Primary action: brand color (1 per screen)
- Secondary action: muted/ghost variant
- Destructive action: red — far from primary CTA

#### 2. Harmony — Visual Cohesion
All elements should feel like they belong to the same family.

**Spacing Scale (8pt Grid):**
```
4px   → xs gaps (icon padding, tight list items)
8px   → sm (between related elements)
16px  → md (card padding, section spacing)
24px  → lg (between sections)
32px  → xl (between major blocks)
48px  → 2xl (page-level separation)
```

**Border Radius Consistency:**
- Small elements (badges, chips): `rounded-full` or `rounded-sm`
- Medium elements (inputs, buttons): `rounded-md`
- Large elements (cards, modals): `rounded-xl`
- Never mix `rounded-none` with `rounded-2xl` in the same screen

**Color Harmony:**
```
Analogous:     Brand + ±30° hue neighbors (natural, calm)
Complementary: Brand + 180° (high contrast, CTAs)
Triadic:       Brand + 120°/240° (vibrant, use sparingly)
Monochromatic: Single hue, varying lightness (professional)
```

#### 3. Consistency — Reduce Cognitive Load
Users should never wonder "how does this work?" — patterns should be predictable.

**Platform Conventions (Web):**
- Primary CTA: top-right (desktop nav) or bottom-center (mobile)
- Destructive actions: always require confirmation dialogs
- Form submission: Enter key submits, Escape cancels/closes
- Navigation: Breadcrumbs for 3+ depth levels
- Empty states: Always provide an actionable CTA

**Component Consistency Checklist:**
- [ ] All buttons use the same radius (`rounded-md` everywhere).
- [ ] All modals have the same padding (`p-6`) and close behavior (Escape key).
- [ ] All form inputs have the same height (`h-9`) and focus ring style.
- [ ] All error messages appear in the same position (below the input field).
- [ ] All tables use the same row height and hover style.

### Apple HIG 2025 Updates

#### Spatial Design (Vision Pro)
- Use **depth** as an organizational tool — foreground elements are more important.
- Avoid placing interactive elements outside comfortable viewing angles (±45° center).
- Use **glass morphism** (`backdrop-blur`) for panels to maintain spatial context.
- Prefer indirect input (gaze + pinch) over precise pointer interactions.

#### iOS 18 Design Patterns
- **Liquid Glass**: Full glass-morphism on navigation bars and toolbars.
- **Adaptive layouts**: Single codebase adapts from iPhone to iPad to Mac.
- **Symbols**: SF Symbols 6 with variable rendering (multicolor, hierarchical).
- **Menu patterns**: Context menus replace modal bottom sheets where possible.

### Material Design 3 (Google)

#### Dynamic Color (M3)
Generate a full color system from a single seed color:
```typescript
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities';

const theme = themeFromSourceColor(argbFromHex('#6750A4'));
// Generates: primary, secondary, tertiary, error + all tonal palettes
```

#### Key M3 Components
- **Cards**: 3 variants — Elevated (shadow), Filled (surface variant), Outlined (border)
- **Chips**: Filter, Input, Suggestion, Assist — each with distinct purpose
- **Navigation**: Bottom bar (≤5 items), Rail (tablet), Drawer (desktop)

### HIG Audit Protocol
When reviewing a design, check:
1. **Hierarchy**: Is the primary action immediately obvious? Is text contrast sufficient?
2. **Harmony**: Is spacing consistent (8pt grid)? Are border radii uniform?
3. **Consistency**: Do interactive elements follow platform conventions?
4. **Accessibility**: Does it pass WCAG 2.2? Are touch targets ≥ 24×24px?
5. **Platform fit**: Does it feel native to its target platform?

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Menerapkan prinsip Human Interface Guidelines (HIG) pada desain UI/UX web dan mobile. Mencakup triad inti (Hierarchy, Harmony, Consistency), pembaruan Apple HIG 2025, Google Material Design 3, desain spasial untuk Apple Vision Pro, dan persyaratan aksesibilitas modern.

### Kondisi Pemicu
- Meninjau atau mengkritik desain UI untuk pelanggaran HIG.
- Membuat keputusan desain tentang skala tipografi, penggunaan warna, atau hierarki tata letak.
- Merancang untuk berbagai platform (iOS, Android, web) dengan pola yang konsisten.
- Mengevaluasi apakah UI terasa "premium" atau "amatir".
- Memastikan komponen UI mengikuti konvensi platform.

### Triad HIG Inti

#### 1. Hierarki — Pandu Mata Pengguna
Hierarki visual mengontrol di mana pengguna melihat pertama dan bagaimana mereka menavigasi informasi.
- **Hierarki tipografi**: 4 level maksimal — H1 (2.25rem, 700), H2 (1.5rem, 600), H3 (1.25rem, 600), body (1rem, 400).
- **Hierarki spasial (sumbu-Z)**: Surface (shadow-sm), Raised (shadow-md), Overlay (shadow-xl), Floating (shadow-2xl).
- **Hierarki warna**: Satu warna brand per layar, aksi sekunder dengan varian muted/ghost, aksi destruktif dengan merah — jauh dari CTA utama.

#### 2. Harmoni — Kohesi Visual
Semua elemen harus terasa seperti milik keluarga yang sama.
- **Skala spacing (grid 8pt)**: 4px, 8px, 16px, 24px, 32px, 48px.
- **Konsistensi border radius**: Elemen kecil (rounded-full), sedang (rounded-md), besar (rounded-xl). Jangan campurkan rounded-none dengan rounded-2xl di layar yang sama.
- **Harmoni warna**: Analogis, komplementer, triadik, atau monokromatik — pilih satu skema dan patuhi.

#### 3. Konsistensi — Kurangi Beban Kognitif
Pengguna tidak pernah bertanya-tanya "bagaimana cara ini bekerja?" — pola harus dapat diprediksi.
- Konvensi platform: CTA utama di kanan atas (nav desktop) atau bawah tengah (mobile).
- Aksi destruktif selalu memerlukan dialog konfirmasi.
- Semua komponen sejenis menggunakan radius, padding, dan perilaku yang sama.

### Pembaruan Apple HIG 2025

#### Desain Spasial (Vision Pro)
Gunakan kedalaman sebagai alat organisasi. Gunakan glass-morphism (`backdrop-blur`) untuk panel. Hindari elemen interaktif di luar sudut pandang yang nyaman.

#### Pola iOS 18
Liquid Glass untuk navigation bar. Tata letak adaptif dari iPhone ke iPad ke Mac. SF Symbols 6 dengan rendering variabel.

### Material Design 3 (Google)

#### Warna Dinamis (M3)
Hasilkan sistem warna penuh dari satu warna seed menggunakan `@material/material-color-utilities`.

#### Komponen M3 Utama
- **Kartu**: Elevated (bayangan), Filled (varian permukaan), Outlined (batas).
- **Chip**: Filter, Input, Saran, Bantuan — masing-masing dengan tujuan berbeda.
- **Navigasi**: Bottom bar (≤5 item), Rail (tablet), Drawer (desktop).

### Protokol Audit HIG
Saat meninjau desain, periksa: Hierarki (apakah aksi utama langsung terlihat jelas?), Harmoni (apakah spacing konsisten?), Konsistensi (apakah elemen interaktif mengikuti konvensi platform?), Aksesibilitas (lulus WCAG 2.2? Target sentuh ≥ 24×24px?), dan Kesesuaian Platform (apakah terasa native untuk platform target?).
