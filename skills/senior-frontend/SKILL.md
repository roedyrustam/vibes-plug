---
name: senior-frontend
description: "Pengembangan frontend dengan React 19, Next.js 15, TypeScript, dan Tailwind CSS v4 / Frontend development for React 19, Next.js 15, TypeScript, and Tailwind CSS v4."
author: "Roedy Rustam"
---

# Senior Frontend Specialist

[Bahasa Indonesia](#bahasa-indonesia) | [English](#english)

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Pola pengembangan frontend, optimasi performa, dan integrasi ekosistem modern untuk aplikasi berbasis React 19 / Next.js 15 dengan Tailwind CSS v4 dan TypeScript.

### Kondisi Pemicu
- Gunakan saat merancang proyek React atau Next.js 15 baru dengan TypeScript dan Tailwind CSS v4.
- Gunakan saat membuat komponen baru, custom hooks, atau Server Actions.
- Gunakan saat menganalisis dan mengoptimalkan ukuran bundle frontend.
- Gunakan untuk mengimplementasikan pola React 19 lanjutan (`useActionState`, `useOptimistic`).
- Gunakan untuk memastikan kepatuhan aksesibilitas (a11y) dan pengujian otomatis.

### Panduan Teknis & Praktik Terbaik

#### 1. Next.js 15: Server vs Client Components
Gunakan **Server Components** secara default untuk pengambilan data berkinerja tinggi dan optimalisasi SEO. Gunakan `'use client'` hanya saat membutuhkan state (`useState`, `useEffect`), event handler (`onClick`), atau API browser.
*Catatan Next.js 15:* `params` dan `searchParams` sekarang bertipe `Promise`. Lakukan `await params` sebelum mengakses nilainya.

#### 2. React 19 Form & Mutation Patterns
- **`useActionState`**: Gunakan untuk menangani form submission dengan status pending dan handling error secara bawaan.
- **`useOptimistic`**: Gunakan untuk pembaruan UI secara optimistik (misalnya tombol Like) agar terasa instan bagi pengguna.
- **`useFormStatus`**: Gunakan untuk mengambil status form di dalam komponen anak (seperti tombol submit).

#### 3. Tailwind CSS v4 CSS-First Configuration
Konfigurasi kustom tema dilakukan langsung di file CSS (seperti `app/globals.css`) menggunakan direktif `@theme`, bukan lagi menggunakan file `tailwind.config.ts`.

#### 4. Aksesibilitas (a11y) & Pengujian
- Gunakan HTML semantik seperti `<button>` dan `<nav>`.
- Pastikan semua elemen interaktif dapat diakses melalui keyboard.
- Lakukan pengujian unit menggunakan Vitest dan React Testing Library, serta pengujian E2E menggunakan Playwright.

---

<a name="english"></a>
## English

### Description
Frontend development patterns, performance optimization, and modern ecosystem integrations for React 19 / Next.js 15 applications with Tailwind CSS v4 and TypeScript.

### Trigger Conditions
- Use when scaffolding a new React or Next.js 15 project with TypeScript and Tailwind CSS v4.
- Use when generating new components, custom hooks, or Server Actions.
- Use when analyzing and optimizing bundle sizes for frontend applications.
- Use to implement advanced React 19 patterns (`useActionState`, `useOptimistic`).
- Use to ensure accessibility compliance and implement robust testing.

### Technical Guidelines & Best Practices

#### 1. Next.js 15: Server vs Client Components
Use **Server Components** by default for fast performance and SEO. Use `'use client'` only when you need state (`useState`, `useEffect`), event handlers (`onClick`), or browser APIs.
*Next.js 15 Note:* `params` and `searchParams` are now `Promise`-based. Always `await` them before reading properties.

#### 2. React 19 Form & Mutation Patterns
- **`useActionState`**: Use to manage form state, pending indicators, and action results natively.
- **`useOptimistic`**: Use to update the UI optimistically (e.g., likes or adding to cart) before the server confirms.
- **`useFormStatus`**: Use to read form submit state from within nested child components.

#### 3. Tailwind CSS v4 CSS-First Configuration
Tailwind CSS v4 uses CSS-first configuration. Define custom theme tokens using the `@theme` directive in your main CSS file, not `tailwind.config.ts`.

#### 4. Accessibility & Testing
- Use semantic HTML tags (`<button>`, `<nav>`).
- Ensure full keyboard navigability for all interactive elements.
- Write unit tests using Vitest and React Testing Library, and E2E tests using Playwright.
