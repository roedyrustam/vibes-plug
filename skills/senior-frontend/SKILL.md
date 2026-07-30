---
name: senior-frontend
description: "Frontend development for React 19, Next.js 15, TypeScript, and Tailwind CSS v4 / Pengembangan frontend dengan React 19, Next.js 15, TypeScript, dan Tailwind CSS v4."
author: "Roedy Rustam"
---

# Senior Frontend Specialist (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade frontend development patterns, performance optimization, and modern ecosystem integrations for React 19 / Next.js 15 applications with Tailwind CSS v4 and TypeScript. Covers React 19 Compiler, Partial Prerendering (PPR), View Transitions API, and SPA/MPA hybrid strategies.

### Trigger Conditions
- Use when scaffolding a new React or Next.js 15 project with TypeScript and Tailwind CSS v4.
- Use when generating new components, custom hooks, or Server Actions.
- Use when analyzing and optimizing bundle sizes and Core Web Vitals.
- Use to implement advanced React 19 patterns (`useActionState`, `useOptimistic`, `use()`).
- Use when working in SPA mode — coordinate with `spa-orchestrator` for architecture decisions.
- Use to ensure accessibility compliance (WCAG 2.2) and implement robust testing.

### Technical Guidelines & Best Practices

#### 1. Next.js 15: Server vs Client Components
Use **Server Components** by default for performance and SEO. Use `'use client'` only when you need:
- State (`useState`, `useEffect`), event handlers (`onClick`), browser APIs.
- Interactive UI that must be hydrated on the client.

*Next.js 15 Notes:*
- `params` and `searchParams` are now `Promise`-based — always `await` them before reading properties.
- **Partial Prerendering (PPR)**: Wrap dynamic sections in `<Suspense>` — Next.js will statically pre-render the shell and stream dynamic content. Enable with `experimental: { ppr: true }`.

#### 2. React 19 — New Hooks & Compiler
React 19 ships with a **compiler** that auto-applies memoization. You no longer need `useMemo`, `useCallback`, or `React.memo` in most cases — the compiler handles it.

**New Hooks:**
- **`useActionState`**: Manage form state, pending indicators, and action results natively with Server Actions.
- **`useOptimistic`**: Instantly update UI before server confirms (likes, cart additions).
- **`useFormStatus`**: Read form submission state inside child components.
- **`use(promise)`**: Unwrap promises or context inside render — works with Suspense.
```tsx
// use() with context
const theme = use(ThemeContext);

// use() with a promise (suspends until resolved)
const data = use(fetchUserPromise);
```

#### 3. View Transitions API
Use the native browser View Transitions API for smooth page transitions without heavy libraries:
```tsx
import { unstable_ViewTransition as ViewTransition } from 'react';

// Wrap changing elements
<ViewTransition name="hero-image">
  <img src={image} />
</ViewTransition>
```
Next.js 15 App Router supports View Transitions natively via the `<Link>` component with `viewTransition` prop.

#### 4. Tailwind CSS v4 CSS-First Configuration
Tailwind CSS v4 uses **CSS-first configuration**. Define custom theme tokens using the `@theme` directive in your main CSS file. Use the new `@plugin` directive to register plugins:
```css
@import "tailwindcss";

@theme {
  --color-brand: oklch(55% 0.2 250);
  --font-sans: "Inter", sans-serif;
  --animate-fade-in: fade-in 0.3s ease-out;
}

@plugin "@tailwindcss/typography";
```

#### 5. Accessibility (WCAG 2.2) & Testing
- Use semantic HTML tags (`<button>`, `<nav>`, `<main>`, `<article>`).
- Ensure full keyboard navigability and proper `aria-*` labels.
- Write unit tests using **Vitest** and **React Testing Library**.
- Write E2E tests using **Playwright** (via `e2e-testing-expert` skill).

#### 6. SPA Integration (spa-orchestrator)
When building a decoupled SPA (not Next.js SSR):
- Coordinate with `spa-orchestrator` for architecture decisions (routing, state, API layer).
- Use **TanStack Router** for fully type-safe client-side routing (preferred over React Router for new projects).
- Use **TanStack Query v5** for all server state — never use bare `useEffect` for data fetching.

#### 7. Multi-Page Application (MPA) Integration
When working within a centralized MPA (via `mpa-orchestrator`):
- Use **Alpine.js** or **HTMX** for micro-interactions without heavy client bundles.
- Apply **Progressive Enhancement**: ensure forms and links work without JavaScript first.

#### 8. Advanced Animations (GSAP)
- Use **GSAP (GreenSock Animation Platform)** for complex, timeline-based, and scroll-driven animations (`ScrollTrigger`).
- Prefer GSAP over CSS animations for sequences requiring pausing, reversing, staggering, or timeline control.
- In React, always use the `@gsap/react` `useGSAP()` hook for automatic cleanup and scope management to prevent memory leaks.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Pola pengembangan frontend tingkat produksi, optimasi performa, dan integrasi ekosistem modern untuk aplikasi React 19 / Next.js 15 dengan Tailwind CSS v4 dan TypeScript. Mencakup React 19 Compiler, Partial Prerendering (PPR), View Transitions API, dan strategi hybrid SPA/MPA.

### Kondisi Pemicu
- Gunakan saat merancang proyek React atau Next.js 15 baru dengan TypeScript dan Tailwind CSS v4.
- Gunakan saat membuat komponen baru, custom hooks, atau Server Actions.
- Gunakan saat menganalisis dan mengoptimalkan bundle dan Core Web Vitals.
- Gunakan untuk mengimplementasikan pola React 19 lanjutan (`useActionState`, `useOptimistic`, `use()`).
- Gunakan saat membangun SPA — koordinasikan dengan `spa-orchestrator` untuk keputusan arsitektur.
- Gunakan untuk memastikan kepatuhan aksesibilitas (WCAG 2.2) dan pengujian otomatis.

### Panduan Teknis & Praktik Terbaik

#### 1. Next.js 15: Server vs Client Components
Gunakan **Server Components** secara default untuk performa dan SEO. Gunakan `'use client'` hanya saat dibutuhkan state, event handler, atau API browser.

*Catatan Next.js 15:*
- `params` dan `searchParams` sekarang bertipe `Promise` — lakukan `await` sebelum mengakses nilainya.
- **Partial Prerendering (PPR)**: Bungkus bagian dinamis dengan `<Suspense>` — Next.js akan men-prerender shell statis dan meng-stream konten dinamis. Aktifkan dengan `experimental: { ppr: true }`.

#### 2. React 19 — Hook Baru & Compiler
React 19 hadir dengan **compiler** yang otomatis menerapkan memoization. Anda tidak lagi perlu `useMemo`, `useCallback`, atau `React.memo` di sebagian besar kasus.

**Hook Baru:**
- **`useActionState`**: Mengelola state form, indikator loading, dan hasil action dengan Server Actions.
- **`useOptimistic`**: Memperbarui UI secara instan sebelum server mengonfirmasi.
- **`useFormStatus`**: Membaca status form di dalam komponen anak.
- **`use(promise)`**: Membuka *promise* atau context langsung di dalam render — bekerja bersama Suspense.

#### 3. View Transitions API
Gunakan View Transitions API bawaan browser untuk transisi halaman yang mulus tanpa library berat. Next.js 15 mendukung ini secara native melalui `<Link viewTransition>`.

#### 4. Tailwind CSS v4 CSS-First Configuration
Konfigurasi kustom tema dilakukan langsung di file CSS menggunakan direktif `@theme`. Gunakan `@plugin` untuk mendaftarkan plugin.

#### 5. Aksesibilitas (WCAG 2.2) & Pengujian
- Gunakan HTML semantik (`<button>`, `<nav>`, `<main>`).
- Pastikan navigasi keyboard berfungsi penuh dengan label `aria-*` yang tepat.
- Pengujian unit dengan Vitest + React Testing Library; E2E dengan Playwright.

#### 6. Integrasi SPA (spa-orchestrator)
Saat membangun SPA terpisah (bukan Next.js SSR):
- Koordinasikan dengan `spa-orchestrator` untuk keputusan routing, state, dan API layer.
- Gunakan **TanStack Router** untuk routing type-safe di sisi klien.
- Gunakan **TanStack Query v5** untuk semua server state.

#### 7. Integrasi MPA (mpa-orchestrator)
Saat bekerja dalam arsitektur MPA terpusat:
- Gunakan Alpine.js atau HTMX untuk interaksi mikro yang ringan.
- Terapkan Progressive Enhancement: form dan link harus berfungsi tanpa JavaScript terlebih dahulu.

#### 8. Animasi Tingkat Lanjut (GSAP)
- Gunakan **GSAP (GreenSock Animation Platform)** untuk animasi kompleks, berbasis timeline, dan *scroll-driven* (`ScrollTrigger`).
- Utamakan GSAP dibandingkan CSS untuk animasi yang membutuhkan kontrol *timeline*, jeda (*pause*), *reverse*, atau *stagger*.
- Di React, selalu gunakan hook `useGSAP()` dari `@gsap/react` untuk *cleanup* otomatis dan manajemen *scope* guna mencegah kebocoran memori (*memory leak*).
