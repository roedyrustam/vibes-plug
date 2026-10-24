---
name: spa-orchestrator
description: "Orchestrates Single-Page Application (SPA) architecture, integrating frontend state management with API-driven backends / Mengorkestrasi arsitektur Single-Page Application (SPA), mengintegrasikan state management frontend dengan backend berbasis API."
author: "Roedy Rustam"
version: "4.4.2"

---

# Single-Page Application (SPA) Orchestrator (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- `modern-web-guidance`: HTML5/CSS standards, modern browser APIs, and accessibility guidelines.
- `senior-frontend`: Primary UI craftsmanship, React 19 component trees, and Vite setups.
- `design-system-architect`: Headless primitives and unified design tokens for SPA interfaces.
- `modern-css-native-expert`: Native CSS anchor positioning, View Transitions, and container queries.
- `tailwind-expert`: Tailwind CSS v4 design tokens and responsive utility classes.
- `state-management-expert`: Client-side state separation (Zustand/Jotai) from server state.
- `tanstack-query-expert`: Data caching, optimistic updates, and declarative async state.
- `ui-ux-pro-max`: Dashboard composition, data table layouts, and navigation feedback.
- `visual-ui-auditor`: Multimodal vision auditing of rendered SPA routes and dialogs.
- `anti-slop`: Anti-slop frontend architecture, eliminating broken stubs and excessive loading spinners.
- **MANDATORY**: Execute `senior-frontend` FIRST for all HTML/CSS and client-side JS tasks to ensure modern web standards.

### Description
Structured orchestration guide for building modern Single-Page Applications (SPAs). Coordinates frontend architecture (TanStack Router, React 19, TanStack Query v5) with decoupled API backends (Hono RPC, tRPC). Covers state management strategy, routing patterns, API layer design, build tooling (Vite + TanStack Start), and deployment strategies.

### Trigger Conditions
- Building a highly interactive dashboard, admin panel, or data-heavy web application as a SPA.
- Choosing between SPA vs SSR vs MPA for a new project.
- Setting up client-side routing with **TanStack Router** (type-safe routes, loaders).
- Structuring state management: server state (TanStack Query) vs client state (Zustand/Jotai).
- Building a decoupled frontend that communicates with a separate backend via **Hono RPC** or tRPC.
- Deploying a SPA to Cloudflare Pages, Vercel, or a CDN.

### SPA vs SSR vs MPA — Decision Guide
```
Choose SPA when:
✅ Highly interactive app (dashboard, editor, admin panel)
✅ Rich client-side state that persists across navigation
✅ Auth-gated app (SEO is not a primary concern)
✅ Already have a separate backend API

Choose SSR (Next.js) when:
✅ SEO is critical (marketing pages, public content)
✅ Fast initial page load for unauthenticated users
✅ Mixed app: some public pages + some gated app pages

Choose MPA (Astro, Django, Laravel) when:
✅ Mostly static content, minimal interactivity
✅ SEO is the primary concern
✅ Small team that wants to avoid JS complexity
  → see mpa-orchestrator skill
```

### Recommended SPA Stack (2026)

| Layer | Tool | Why |
|---|---|---|
| **Build** | Vite 6 / TanStack Start | Instant HMR, ES modules, fast builds |
| **Routing** | TanStack Router | Fully type-safe routes, search params, loaders |
| **Server State** | TanStack Query v5 | Data fetching, caching, mutations |
| **Client State** | Zustand / Jotai | Lightweight, no boilerplate |
| **API Layer** | Hono RPC / tRPC | End-to-end type-safe, no codegen |
| **Forms** | React Hook Form + Zod | Performant, type-safe validation |
| **Styling** | Tailwind CSS v4 | Utility-first, zero-runtime |
| **Components** | shadcn/ui + Base UI | Headless, accessible, customizable |
| **Animations** | GSAP | Complex, timeline-based, scroll-driven |

### TanStack Router — File-Based Type-Safe Routing

```
src/routes/
  __root.tsx          # Root layout (providers, nav)
  index.tsx           # / — landing/home
  _auth.tsx           # Auth guard layout
  _auth/
    dashboard.tsx     # /dashboard (auth required)
    settings/
      index.tsx       # /settings
      profile.tsx     # /settings/profile
  _public.tsx         # Public layout
  _public/
    login.tsx         # /login
```

```typescript
// src/routes/__root.tsx
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

interface RouterContext {
  queryClient: QueryClient;
  auth: { user: User | null; isAuthenticated: boolean };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div>
      <Navbar />
      <Outlet />
    </div>
  ),
});
```

```typescript
// src/routes/_auth/dashboard.tsx — protected route with data preloading
import { createFileRoute, redirect } from '@tanstack/react-router';
import { workspacesQueryOptions } from '@/queries/workspaces';

export const Route = createFileRoute('/_auth/dashboard')({
  // Runs before render — redirect if not authenticated
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  // Prefetch data in loader — no loading state on initial render
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(workspacesQueryOptions()),
  component: DashboardPage,
});

function DashboardPage() {
  // Data is already available — no loading state
  const { data: workspaces } = useSuspenseQuery(workspacesQueryOptions());
  return <WorkspaceList workspaces={workspaces} />;
}
```

### State Management Architecture

```
State Layers:
┌─────────────────────────────────────┐
│  Server State (TanStack Query v5)   │  ← API data, cached, auto-refetch
│  workspaces, users, projects, etc.  │
├─────────────────────────────────────┤
│  Client State (Zustand)             │  ← UI state, sidebar open, theme
│  modals, filters, UI preferences    │
├─────────────────────────────────────┤
│  Form State (React Hook Form)       │  ← Active form inputs, validation
│  Scoped to individual forms         │
├─────────────────────────────────────┤
│  URL State (TanStack Router)        │  ← Shareable page state
│  search params, active tab, page #  │
└─────────────────────────────────────┘
```

```typescript
// URL State — persist filter state in URL (shareable)
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  page: z.number().int().positive().default(1).catch(1),
  search: z.string().default('').catch(''),
  status: z.enum(['all', 'active', 'archived']).default('all').catch('all'),
});

export const Route = createFileRoute('/_auth/projects')({
  validateSearch: searchSchema,
  component: ProjectsPage,
});

function ProjectsPage() {
  const { page, search, status } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const setSearch = (q: string) =>
    navigate({ search: (prev) => ({ ...prev, search: q, page: 1 }) });

  return (
    <div>
      <SearchInput value={search} onChange={setSearch} />
      <ProjectList page={page} search={search} status={status} />
    </div>
  );
}
```

### Hono RPC — Decoupled Type-Safe API

```typescript
// apps/api/src/index.ts — backend Hono app
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

const workspacesRoute = new Hono()
  .get('/', async (c) => {
    const user = c.get('user');
    const workspaces = await db.workspace.findMany({
      where: { members: { some: { userId: user.id } } },
    });
    return c.json(workspaces);
  })
  .post('/', zValidator('json', CreateWorkspaceSchema), async (c) => {
    const data = c.req.valid('json');
    const workspace = await db.workspace.create({ data });
    return c.json(workspace, 201);
  });

const app = new Hono()
  .use('*', authMiddleware)
  .route('/workspaces', workspacesRoute);

export type AppType = typeof app;
export default app;
```

```typescript
// apps/web/src/lib/api.ts — type-safe client
import { hc } from 'hono/client';
import type { AppType } from '@myapp/api';

export const api = hc<AppType>(import.meta.env.VITE_API_URL);

// TanStack Query integration
export const workspacesQueryOptions = () =>
  queryOptions({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const res = await api.workspaces.$get();
      return res.json(); // Fully typed!
    },
    staleTime: 5 * 60 * 1000,
  });
```

### Build & Deployment

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [
    TanStackRouterVite(), // Auto-generates route tree
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-router': ['@tanstack/react-router'],
        },
      },
    },
  },
});
```

**Deployment target**: Cloudflare Pages or Vercel for CDN-served static SPA. Backend API deployed separately to Railway/Fly.io.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec spa-orchestrator <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- `modern-web-guidance`: Standar HTML5/CSS, API browser modern, dan pedoman aksesibilitas.
- `senior-frontend`: Keahlian utama UI, pohon komponen React 19, dan setup Vite.
- `design-system-architect`: Primitif headless dan token desain terpadu untuk antarmuka SPA.
- `modern-css-native-expert`: CSS anchor positioning native, View Transitions, dan container queries.
- `tailwind-expert`: Token desain Tailwind CSS v4 dan kelas utilitas responsif.
- `state-management-expert`: Pemisahan state client-side (Zustand/Jotai) dari server state.
- `tanstack-query-expert`: Caching data, update optimistik, dan state asinkron deklaratif.
- `ui-ux-pro-max`: Komposisi dashboard, layout tabel data, dan feedback navigasi.
- `visual-ui-auditor`: Audit visual multimodal untuk rute dan dialog SPA yang dirender.
- `anti-slop`: Arsitektur frontend anti-slop, mengeliminasi stub rusak dan spinner loading berlebih.
- **MANDATORY**: Eksekusi `senior-frontend` PERTAMA KALI untuk semua tugas HTML/CSS dan JS sisi klien guna memastikan standar web modern.

### Deskripsi
Panduan orkestrasi terstruktur untuk membangun Single-Page Application (SPA) modern. Mengkoordinasikan arsitektur frontend (TanStack Router, React 19, TanStack Query v5) dengan backend API terpisah (Hono RPC, tRPC). Mencakup strategi state management, pola routing, desain API layer, build tooling (Vite + TanStack Start), dan strategi deployment.

### Kondisi Pemicu
- Membangun dashboard yang sangat interaktif, panel admin, atau aplikasi web berat data sebagai SPA.
- Memilih antara SPA vs SSR vs MPA untuk proyek baru.
- Menyiapkan client-side routing dengan **TanStack Router** (rute type-safe, loader).
- Menyusun state management: server state (TanStack Query) vs client state (Zustand/Jotai).
- Membangun frontend terpisah yang berkomunikasi dengan backend terpisah via **Hono RPC** atau tRPC.
- Men-deploy SPA ke Cloudflare Pages, Vercel, atau CDN.

### SPA vs SSR vs MPA — Panduan Keputusan

Pilih SPA saat: aplikasi sangat interaktif (dashboard, editor, panel admin), state sisi klien yang kaya, aplikasi yang dibatasi auth (SEO bukan perhatian utama).

Pilih SSR (Next.js) saat: SEO sangat penting, load halaman awal yang cepat untuk pengguna yang tidak terautentikasi, aplikasi campuran.

Pilih MPA (Astro, Django, Laravel) saat: konten sebagian besar statis, SEO adalah perhatian utama — lihat skill `mpa-orchestrator`.

### Stack SPA yang Direkomendasikan (2026)
Vite 6 untuk build, TanStack Router untuk routing type-safe, TanStack Query v5 untuk server state, Zustand untuk client state, Hono RPC untuk API layer type-safe, React Hook Form + Zod untuk form, Tailwind CSS v4 untuk styling, dan GSAP untuk animasi kompleks.

### TanStack Router — Routing File-Based Type-Safe
Atur rute dalam direktori `src/routes/` dengan layout bersarang. Gunakan `createFileRoute` dengan `beforeLoad` untuk guard autentikasi, `loader` untuk prefetch data, dan `validateSearch` untuk URL state yang dapat dibagikan.

### Arsitektur State Management
Empat lapisan state yang saling melengkapi: Server State (TanStack Query), Client State (Zustand), Form State (React Hook Form), dan URL State (TanStack Router search params).

### Hono RPC — API Type-Safe Terpisah
Ekspor `AppType` dari backend Hono dan gunakan `hc<AppType>()` di frontend untuk panggilan API yang fully typed tanpa codegen.

### Build & Deployment
Gunakan plugin `TanStackRouterVite` untuk auto-generate route tree. Konfigurasi `manualChunks` untuk code splitting yang optimal. Deploy SPA ke Cloudflare Pages atau Vercel; backend API ke Railway/Fly.io secara terpisah.

---
### 📄 Standard Pages Mandate (CRITICAL)
**MANDATORY**: Whenever you are building a new application, landing page, or website, you MUST automatically create the following standard pages:
1. **About Page** (`/about`)
2. **Profile Page** (`/profile`)
3. **Contact Page** (`/contact`)
4. **Terms of Reference / Terms of Service** (`/terms`)
5. **Privacy Policy** (`/privacy-policy`)

These pages must be generated with standard boilerplate content that can later be customized to fit the specific application. Do not wait for the user to ask for them; they are a strict requirement for all web projects. / **WAJIB**: Otomatis buatkan halaman standar (About, Profile, Contact, Terms, Privacy Policy) pada setiap pembuatan aplikasi/website baru dengan konten boilerplate yang bisa disesuaikan nanti.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec spa-orchestrator <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
