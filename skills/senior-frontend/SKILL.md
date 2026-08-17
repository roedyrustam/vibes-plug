---
name: senior-frontend
description: "Frontend development for React 19, Next.js 15, TypeScript, and Tailwind CSS v4 / Pengembangan frontend dengan React 19, Next.js 15, TypeScript, dan Tailwind CSS v4."
author: "vibes-plug-swarm"
---

# Senior Frontend Specialist (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade frontend development patterns, performance optimization, and modern ecosystem integrations for React 19 / Next.js 15 applications with Tailwind CSS v4 and TypeScript. Covers React 19 Compiler, Partial Prerendering (PPR), View Transitions API, and SPA/MPA hybrid strategies.

### Orchestration & Integration
- `ui-components-expert`: For building robust UI components (Radix, shadcn).
- `tailwind-expert`: For styling and custom @theme configurations.
- `nextjs-app-router-expert`: For RSC, caching, and Next.js routing patterns.
- `state-management-expert`: For client-side state (Zustand, Jotai).
- `tanstack-query-expert`: For advanced data fetching and server state caching.
- `spa-orchestrator`: For Single-Page Application architectures.
- `mpa-orchestrator`: For Multi-Page Application architectures.

### Trigger Conditions
- Scaffold a new React or Next.js 15 project with TypeScript and Tailwind CSS v4.
- Generate new components, custom hooks, or Server Actions.
- Analyze and optimize bundle sizes and Core Web Vitals.
- Implement advanced React 19 patterns (`useActionState`, `useOptimistic`, `use()`).
- Build SPAs — coordinate with `spa-orchestrator`.
- Ensure accessibility compliance (WCAG 2.2) and testing.

### Technical Guidelines & Best Practices

#### 1. Next.js 15: Server vs Client Components
Use **Server Components** by default for performance and SEO. Use `'use client'` strictly for:
- State (`useState`, `useEffect`), event handlers (`onClick`), browser APIs.
- Interactive UI needing client hydration.

*Next.js 15.2+ Requirements:*
- Await `Promise`-based `params` and `searchParams` before accessing properties.
- Use **Partial Prerendering (PPR)** natively. Wrap dynamic sections in `<Suspense>`.

#### 2. React 19 Compiler & Hooks
Do not use `useMemo`, `useCallback`, or `React.memo` unless explicitly required; rely on the React 19 compiler.

**Mandatory Hooks:**
- **`useActionState`**: Manage form state, pending indicators, and action results with Server Actions.
- **`useOptimistic`**: Update UI instantly before server confirmation.
- **`useFormStatus`**: Read form submission state in child components.
- **`use(promise)`**: Unwrap promises or context inside render with Suspense.

#### 3. View Transitions API
Implement native View Transitions API for smooth page transitions. Use Next.js 15 `<Link viewTransition>` natively.

#### 4. Tailwind CSS v4
Use CSS-first configuration. Define custom tokens with `@theme` and register plugins with `@plugin` in the main CSS file.

#### 5. Accessibility (WCAG 2.2) & Testing
- Enforce semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`).
- Enforce full keyboard navigability and valid `aria-*` labels.
- Write unit tests using **Vitest** and **React Testing Library**.
- Write E2E tests using **Playwright** via `e2e-testing-expert`.

#### 6. Architecture Integration
- **SPA (`spa-orchestrator`)**: Use **TanStack Router** for type-safe client routing and **TanStack Query v5** for server state. Never use bare `useEffect` for data fetching.
- **MPA (`mpa-orchestrator`)**: Use **Alpine.js** or **HTMX** for micro-interactions. Apply Progressive Enhancement.

#### 7. Advanced Animations
- **GSAP (GreenSock)**: Use for complex, timeline-based, scroll-driven animations (`ScrollTrigger`). Enforce `@gsap/react` `useGSAP()` hook for auto-cleanup.
- **Anime.js**: Use as a lightweight alternative for simple sequencing, SVG path animations, and DOM attribute animations.
- Prefer JS animations over CSS when timeline control (pause, reverse, dynamic stagger) is required.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Pola pengembangan frontend tingkat produksi, optimasi performa, dan integrasi ekosistem modern untuk aplikasi React 19 / Next.js 15 dengan Tailwind CSS v4 dan TypeScript. Mencakup React 19 Compiler, Partial Prerendering (PPR), View Transitions API, dan strategi hybrid SPA/MPA.

### Integrasi Orkestrasi
- `ui-components-expert`: Untuk membangun komponen UI yang kuat (Radix, shadcn).
- `tailwind-expert`: Untuk styling dan konfigurasi @theme kustom.
- `nextjs-app-router-expert`: Untuk RSC, caching, dan pola routing Next.js.
- `state-management-expert`: Untuk state client-side (Zustand, Jotai).
- `tanstack-query-expert`: Untuk fetching data lanjutan dan caching server state.
- `spa-orchestrator`: Untuk arsitektur Single-Page Application.
- `mpa-orchestrator`: Untuk arsitektur Multi-Page Application.

### Kondisi Pemicu
- Buat proyek React atau Next.js 15 baru dengan TypeScript dan Tailwind CSS v4.
- Buat komponen baru, custom hooks, atau Server Actions.
- Analisis dan optimalkan ukuran bundle dan Core Web Vitals.
- Terapkan pola React 19 lanjutan (`useActionState`, `useOptimistic`, `use()`).
- Bangun SPA — koordinasikan dengan `spa-orchestrator`.
- Pastikan kepatuhan aksesibilitas (WCAG 2.2) dan pengujian.

### Panduan Teknis & Praktik Terbaik

#### 1. Next.js 15: Server vs Client Components
Gunakan **Server Components** secara default. Gunakan `'use client'` hanya untuk:
- State (`useState`, `useEffect`), event handler, API browser.
- UI interaktif yang membutuhkan hidrasi klien.

*Persyaratan Next.js 15.2+:*
- Wajib `await` pada `params` dan `searchParams` yang kini bertipe `Promise`.
- Gunakan **Partial Prerendering (PPR)** secara native. Bungkus bagian dinamis dengan `<Suspense>`.

#### 2. React 19 Compiler & Hook Baru
Jangan gunakan `useMemo`, `useCallback`, atau `React.memo` kecuali sangat diperlukan; andalkan compiler React 19.

**Hook Wajib:**
- **`useActionState`**: Kelola state form, indikator loading, dan hasil action dengan Server Actions.
- **`useOptimistic`**: Perbarui UI secara instan sebelum server mengonfirmasi.
- **`useFormStatus`**: Baca status form di dalam komponen anak.
- **`use(promise)`**: Buka promise atau context langsung di dalam render dengan Suspense.

#### 3. View Transitions API
Terapkan View Transitions API bawaan browser untuk transisi halaman. Gunakan `<Link viewTransition>` pada Next.js 15.

#### 4. Tailwind CSS v4
Gunakan konfigurasi CSS-first. Definisikan token kustom dengan `@theme` dan plugin dengan `@plugin` di file CSS utama.

#### 5. Aksesibilitas (WCAG 2.2) & Pengujian
- Wajib gunakan HTML semantik (`<button>`, `<nav>`, `<main>`).
- Wajib pastikan navigasi keyboard dengan label `aria-*` yang valid.
- Tulis pengujian unit dengan **Vitest** dan **React Testing Library**.
- Tulis pengujian E2E dengan **Playwright** via `e2e-testing-expert`.

#### 6. Integrasi Arsitektur
- **SPA (`spa-orchestrator`)**: Gunakan **TanStack Router** untuk routing klien dan **TanStack Query v5** untuk server state. Jangan gunakan `useEffect` murni untuk fetching data.
- **MPA (`mpa-orchestrator`)**: Gunakan **Alpine.js** atau **HTMX** untuk interaksi mikro. Terapkan Progressive Enhancement.

#### 7. Animasi Tingkat Lanjut
- **GSAP (GreenSock)**: Gunakan untuk animasi kompleks, berbasis timeline, dan scroll-driven. Wajib gunakan hook `useGSAP()` dari `@gsap/react`.
- **Anime.js**: Gunakan untuk staggering sederhana, animasi SVG, dan DOM.
- Utamakan animasi JS (GSAP/Anime.js) daripada CSS murni jika kontrol timeline (pause, reverse) dibutuhkan.
