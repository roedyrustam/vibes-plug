---
name: nextjs-app-router-expert
description: "Expert guide for Next.js 15 App Router: RSC, Server Actions, Middleware, Parallel/Intercepting Routes, Streaming, and Caching strategies / Panduan ahli untuk Next.js 15 App Router."
author: vibes-plug-swarm
---

# Next.js 15 App Router Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
An advanced guide dedicated exclusively to the Next.js 15 App Router ecosystem. Moves beyond basic frontend development to cover deep architectural patterns like React Server Components (RSC), advanced Server Actions, Middleware routing, Parallel & Intercepting Routes, Streaming/Suspense, Partial Prerendering (PPR), and complex cache invalidation.

### Trigger Conditions
- When architecting a new Next.js 15 application using the `app/` directory.
- When migrating an older `pages/` directory Next.js app to App Router.
- When implementing complex UI patterns like modals with Intercepting Routes (`(.)route`).
- When debugging caching issues (stale data, Next.js cache tags, `revalidatePath`).
- When building dashboards that require Partial Prerendering (PPR) or streaming.

### Core Architectural Patterns

#### 1. React Server Components (RSC) vs Client Components
- **Default to Server**: Every component in `app/` is a Server Component by default. They cannot use hooks (`useState`, `useEffect`) or browser APIs.
- **Client Boundaries**: Only add `"use client"` when interactivity (events, state) or browser APIs (window) are needed. Push client boundaries as far down the component tree as possible.
- **Interleaving**: You *can* pass a Server Component as a `children` prop to a Client Component, but you cannot directly import a Server Component into a Client Component.

#### 2. Advanced Server Actions
Use Server Actions for all mutations instead of creating separate API routes.
```typescript
'use server'

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';

const schema = z.object({ email: z.string().email() });

export async function subscribeUser(prevState: any, formData: FormData) {
  const parsed = schema.safeParse({ email: formData.get('email') });
  
  if (!parsed.success) {
    return { error: 'Invalid email' };
  }

  await db.subscribers.insert({ email: parsed.data.email });
  revalidateTag('subscribers'); // Target specific cache invalidation
  return { success: true };
}
```

#### 3. Parallel & Intercepting Routes (Modals)
Use this pattern to render a modal while preserving the background page and keeping the modal shareable via URL.
- **Intercepting (`(.)[segment]`)**: Matches the route on client-side navigation.
- **Parallel (`@modal`)**: Renders simultaneously with the `layout.tsx` children.

Directory structure for a photo modal:
```
app/
 ├── @modal/
 │   ├── (.)photos/[id]/page.tsx   (Intercepted modal)
 │   └── default.tsx
 ├── photos/
 │   └── [id]/page.tsx             (Direct full-page access)
 ├── layout.tsx
 └── page.tsx
```

#### 4. Caching & Data Fetching (Next.js 15)
In Next.js 15, fetch requests are **not cached by default**. You must explicitly opt-in:
```typescript
// Cache indefinitely
const res = await fetch('https://api.example.com/data', { cache: 'force-cache' });

// Cache with Time-Based Revalidation (ISR)
const res = await fetch('https://api.example.com/data', { next: { revalidate: 3600 } });

// On-Demand Revalidation via Tags
const res = await fetch('https://api.example.com/data', { next: { tags: ['collection'] } });
// In your server action: revalidateTag('collection')
```

#### 5. Streaming & Partial Prerendering (PPR)
Wrap slow data fetches in `<Suspense>` to stream UI instantly to the user:
```tsx
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <SlowRevenueChart />
      </Suspense>
    </main>
  );
}
```

## Orchestration & Integration
- Enhances `senior-frontend` with deep Next.js App Router architectural knowledge.
- Integrates with `tanstack-query-expert` for client-side hydration patterns in RSC.
- Works with `spa-orchestrator` when deciding between SPA and SSR architectures.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan lanjutan yang didedikasikan khusus untuk ekosistem Next.js 15 App Router. Mencakup pola arsitektur mendalam seperti React Server Components (RSC), Server Actions lanjutan, Middleware, Parallel & Intercepting Routes, Streaming, Partial Prerendering (PPR), dan strategi invalidasi cache.

### Kondisi Pemicu
- Saat merancang aplikasi Next.js 15 baru menggunakan direktori `app/`.
- Saat memigrasikan aplikasi Next.js lama dari direktori `pages/`.
- Saat mengimplementasikan pola UI kompleks seperti modal dengan Intercepting Routes.
- Saat melakukan debugging masalah caching (data usang, `revalidatePath`, tags).
- Saat membangun dashboard yang membutuhkan streaming atau Partial Prerendering (PPR).

### Pola Arsitektur Inti

#### 1. RSC vs Client Components
Secara default, semua komponen adalah Server Components. Tambahkan `"use client"` hanya pada node paling bawah di pohon komponen yang membutuhkan interaktivitas atau API browser. Anda bisa meneruskan Server Component sebagai `children` ke Client Component.

#### 2. Server Actions Lanjutan
Gunakan Server Actions bersama dengan `useActionState` (React 19) untuk form dan mutasi data, menggantikan API routes konvensional. Pastikan selalu memvalidasi input di server dengan Zod dan menggunakan `revalidatePath` atau `revalidateTag` untuk memperbarui UI.

#### 3. Parallel & Intercepting Routes
Sangat berguna untuk modal (misal: modal login, modal foto). Rute dicegat saat navigasi client-side sehingga URL berubah dan modal terbuka di atas halaman saat ini. Jika URL diakses langsung (refresh), halaman penuh yang dirender.

#### 4. Caching di Next.js 15
Di Next.js 15, `fetch` **tidak di-cache secara default**. Anda harus secara eksplisit mengaktifkan cache menggunakan `{ cache: 'force-cache' }` atau `{ next: { revalidate: 3600 } }`. Gunakan cache tags untuk memicu pembaruan on-demand pada data tertentu.

#### 5. Streaming dengan Suspense
Gunakan batas `<Suspense>` untuk membungkus komponen Server yang melakukan pengambilan data lambat. Ini memungkinkan bagian halaman yang statis dimuat seketika, sementara bagian yang dinamis mengalir (*stream*) ke klien setelah data siap.

## Integrasi Orkestrasi
- Memperkuat `senior-frontend` dengan pengetahuan arsitektur mendalam Next.js.
- Terintegrasi dengan `tanstack-query-expert` untuk pola hidrasi state dari RSC ke sisi klien.
- Bekerja bersama `spa-orchestrator` saat menentukan keputusan arsitektur antara SPA dan SSR.
