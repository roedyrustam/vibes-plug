---
name: global-a11y-i18n-expert
description: "Expert guide for Web Accessibility (WCAG a11y) and Internationalization (i18n) / Panduan ahli untuk Aksesibilitas Web dan Internasionalisasi."
author: "Roedy Rustam"
version: "4.4.2"

---

# Global Accessibility (WCAG 2.2 AA) & i18n Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production guide for building universally accessible, globally adaptable web applications adhering to WCAG 2.2 Level AA standards and modern Internationalization (i18n) architecture. Covers type-safe translation schemas (`next-intl`), CSS logical properties for bidirectional layout flow (LTR & RTL), accessible keyboard trap navigation, screen reader affordances, and timezone-resilient UTC serialization.

### Trigger Conditions
- Enterprise and public sector readiness requiring legal WCAG 2.2 AA compliance.
- Adding multi-language routing (`/en`, `/id`, `/ja`, `/ar`) to Next.js 15 App Router.
- Supporting Right-to-Left (RTL) reading flows for Arabic or Hebrew markets.
- Fixing keyboard navigation focus traps or screen reader accessibility bugs.
- Localizing currency formatting (`Intl.NumberFormat`) and localized date displays.

### Accessible Modal Component with Focus Trap (HTML5 Native Dialog)

```tsx
// src/components/ui/AccessibleModal.tsx
'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function AccessibleModal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal(); // Native browser focus-trap and backdrop handling
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="modal-title"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-xl backdrop:bg-slate-950/50 max-w-lg w-full outline-none"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 id="modal-title" className="text-lg font-bold text-slate-900">
          {title}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-950"
        >
          ✕
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </dialog>
  );
}
```

### Type-Safe Locale Routing with `next-intl` (Next.js 15)

```typescript
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'id', 'ar'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

### CSS Logical Properties for RTL Support
Never use physical directional properties (`left`, `right`). Use logical properties so layouts flip automatically in RTL locales:

```css
/* Bad: Physical properties break in RTL */
.card-bad {
  margin-left: 16px;
  text-align: left;
  border-left: 2px solid #0f172a;
}

/* Good: Logical properties adapt seamlessly */
.card-good {
  margin-inline-start: 1rem;
  text-align: start;
  border-inline-start: 2px solid #0f172a;
}
```

## Orchestration & Integration
- **`modern-web-guidance`**: HTML5/CSS standards, modern browser APIs, and accessibility guidelines.
- **`design-system-architect`**: Accessible design tokens, semantic focus indicators, and headless primitives.
- **`accessibility-testing-expert`**: Automates axe-core and Pa11y compliance tests in CI.
- **`ui-ux-pro-max`**: Ensures color contrast ratios meet the 4.5:1 WCAG AA baseline and RTL layouts.
- **`visual-ui-auditor`**: Multimodal vision auditing of contrast, typography, and focus ring visibility.
- **`anti-slop`**: Anti-slop accessibility, eliminating fake pseudo-buttons (`<div onClick>`) and missing labels.
- **`senior-frontend`**: Implements accessible headless primitives and semantic HTML.
- **`nextjs-app-router-expert`**: Configures multi-locale middleware and streaming localized routes.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec global-a11y-i18n-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama `modern-web-guidance`, `design-system-architect`, `accessibility-testing-expert`, `ui-ux-pro-max`, `visual-ui-auditor`, `anti-slop`, `senior-frontend`, dan `nextjs-app-router-expert`.

### Deskripsi
Panduan produksi untuk membangun aplikasi web yang dapat diakses secara universal dan diadaptasi secara global sesuai standar WCAG 2.2 Level AA dan arsitektur Internasionalisasi (i18n) modern. Mencakup skema terjemahan type-safe (`next-intl`), properti logika CSS (*CSS logical properties*) untuk alur dua arah (LTR & RTL), navigasi keyboard tanpa jebakan fokus (*focus trap*), dukungan pembaca layar (*screen reader*), serta serialisasi waktu UTC yang kebal anomali zona waktu.

### Kondisi Pemicu
- Kesiapan pengadaan software untuk enterprise atau sektor publik dengan kewajiban hukum kepatuhan WCAG 2.2 AA.
- Menambahkan dukungan multi-bahasa (`/en`, `/id`, `/ar`) pada Next.js 15 App Router.
- Mendukung bahasa yang dibaca dari Kanan ke Kiri (RTL) seperti Bahasa Arab.
- Mengatasi masalah navigasi keyboard atau hilangnya garis fokus (*focus outline*).
- Memformat mata uang lokal (Rupiah, Dollar) menggunakan API `Intl.NumberFormat` native.

### Format Mata Uang dan Tanggal Terlokalisasi

```typescript
// src/lib/formatters.ts
export function formatCurrency(amountCents: number, locale = 'id-ID', currency = 'IDR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amountCents / (currency === 'IDR' ? 1 : 100));
}

export function formatLocalizedDate(date: Date | string, locale = 'id-ID') {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(date));
}
```

### 3 Hukum Wajib Aksesibilitas Web
1. **Utamakan HTML Semantik**: Gunakan tag asli seperti `<button>`, `<nav>`, `<dialog>` daripada tag `<div>` yang diberi handler `onClick`. Browser sudah menyediakan dukungan keyboard dan screen reader gratis pada elemen asli.
2. **Kontras Warna Minimal 4.5:1**: Teks harus memiliki kontras minimal 4.5:1 terhadap warna latar belakangnya (standar WCAG 2.2 AA).
3. **Gunakan Properti Logika CSS**: Hindari `margin-left` atau `padding-right`. Gunakan `margin-inline-start` dan `padding-inline-end` agar tata letak otomatis menyesuaikan saat dibuka dalam mode bahasa Arab (RTL).

## Integrasi Orkestrasi
- **`modern-web-guidance`**: Standar HTML5/CSS, API browser modern, dan pedoman aksesibilitas.
- **`design-system-architect`**: Token desain aksesibel, indikator fokus semantik, dan komponen headless.
- **`accessibility-testing-expert`**: Menjalankan pengujian otomatis axe-core di pipeline CI/CD.
- **`ui-ux-pro-max`**: Menjamin keterbacaan tipografi dan kontras warna yang nyaman di mata sesuai WCAG AA.
- **`visual-ui-auditor`**: Audit visual multimodal untuk kontras warna, tipografi, dan visibilitas garis fokus.
- **`anti-slop`**: Aksesibilitas anti-slop, mengeliminasi pseudo-button palsu (`<div onClick>`) dan label hilang.
- **`senior-frontend`**: Membangun komponen UI aksesibel menggunakan HTML semantik.
- **`nextjs-app-router-expert`**: Mengelola perutean dinamis berbasis bahasa pada URL.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec global-a11y-i18n-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
