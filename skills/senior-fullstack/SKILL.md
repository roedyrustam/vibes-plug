---
name: senior-fullstack
description: "Complete toolkit for senior fullstack with modern tools and best practices / Perangkat instruksi lengkap untuk pengembang fullstack tingkat senior dengan alat-alat dan best practices termutakhir."
author: "Roedy Rustam"
---

# Senior Fullstack Developer (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Complete guidelines for senior fullstack developers building production-grade applications in 2026. Covers the modern AI-native stack, architecture decision-making, API design, frontend/backend integration, and team-level best practices.

### Trigger Conditions
- Making fullstack architecture decisions across frontend and backend.
- Designing API contracts between React 19/Next.js 15 frontend and Node.js/Go/Python backend.
- Integrating AI features (LLM, agents, RAG) into a fullstack application.
- Setting up a monorepo with shared types between frontend and backend.
- Reviewing and improving overall application architecture and code quality.

### Modern 2026 Fullstack Stack

#### Recommended Stacks by Use Case

| Use Case | Frontend | Backend | Database | AI Layer |
|---|---|---|---|---|
| **SaaS App (default)** | Next.js 15 (App Router) | Hono / Fastify 5 | Postgres + Drizzle | Vercel AI SDK 5.x |
| **AI-First App** | Next.js 15 + RSC streaming | Mastra.ai / LangGraph | pgvector + Supabase | Anthropic / OpenAI |
| **Decoupled SPA** | TanStack Start + React 19 | Hono RPC | Postgres + Drizzle | Vercel AI SDK |
| **Content Site** | Astro 5 + MDX | N/A (static) | Sanity / Contentful | — |
| **Mobile** | Expo SDK 53 + React Native 0.79 | Hono / Fastify | SQLite (Expo) + Postgres | Vercel AI SDK |

#### AI-Native Fullstack Patterns
In 2026, AI is a first-class citizen in fullstack applications:
- **Streaming AI Responses**: Use Next.js RSC + Vercel AI SDK `streamUI` to stream LLM responses as React components from the server.
- **Server Actions as AI Triggers**: Use React 19 `useActionState` with Server Actions to invoke LLM calls without an API layer.
- **Background AI Jobs**: Offload long LLM tasks to BullMQ + Redis workers; stream results via WebSockets or SSE.
- **Structured AI Output**: Always use `zodResponseFormat` or Pydantic schemas for LLM responses — never parse free-form JSON.

### API Design Principles (2026)

#### Type-Safe Communication
Choose one approach and be consistent:
- **Hono RPC**: If backend is Hono — zero codegen, end-to-end types.
- **tRPC**: If using React Query with Next.js — excellent DX with RSC support.
- **OpenAPI + codegen**: If you have multiple consumers (mobile, third parties).

#### API Versioning
- Use URL versioning: `/api/v1/users`.
- Pin major version in URL, minor versions are backward-compatible.
- Deprecate with `Deprecation` and `Sunset` headers.

#### Error Response Standard (RFC 9457 Problem Details)
```typescript
// Consistent error format across all endpoints
interface ProblemDetail {
  type: string;       // URI identifying the error type
  title: string;      // Human-readable summary
  status: number;     // HTTP status code
  detail: string;     // Specific explanation
  instance?: string;  // URI of the specific occurrence
}
```

### SPA vs SSR vs Static — Decision Guide
```
SEO-critical + mostly read? → Next.js SSR / Astro 5 (static)
Highly interactive dashboard? → SPA (TanStack Start / Vite + TanStack Router)
   → see spa-orchestrator skill for architecture details
Mixed (marketing + app)?    → Next.js 15 with hybrid routing
Real-time data?             → SSR + WebSocket or SSE streaming
```

### Monorepo with Shared Types
```typescript
// packages/types/src/index.ts — single source of truth
export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  isSuperAdmin: boolean;
}

export interface ApiResponse<T> {
  data: T;
  meta?: { page: number; total: number };
}

// apps/api — uses the type
// apps/web — uses the same type
// apps/admin — uses the same type
import type { User } from '@myapp/types';
```

### Security Checklist (Fullstack)
- [ ] All user inputs validated with Zod on the server (never trust the client).
- [ ] JWT secrets rotated every 90 days; use short expiry + refresh tokens.
- [ ] CSP headers configured (no `unsafe-inline` in production).
- [ ] All DB queries use parameterized queries — no string concatenation.
- [ ] File uploads validated for MIME type and scanned before storage.
- [ ] Rate limiting on all public API endpoints.
- [ ] Super Admin routes restricted to `admin.domain.com` with `isSuperAdmin` check.

### Code Review Standards
- Functions < 30 lines; files < 300 lines.
- No business logic in UI components.
- Every PR includes relevant tests (unit or E2E).
- No `any` types in TypeScript production code.
- Dependencies audited with `pnpm audit` on every PR.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan lengkap untuk pengembang fullstack senior yang membangun aplikasi tingkat produksi di 2026. Mencakup stack AI-native modern, pengambilan keputusan arsitektur, desain API, integrasi frontend/backend, dan best practices tingkat tim.

### Kondisi Pemicu
- Membuat keputusan arsitektur fullstack di frontend dan backend.
- Merancang kontrak API antara frontend React 19/Next.js 15 dan backend Node.js/Go/Python.
- Mengintegrasikan fitur AI (LLM, agen, RAG) ke dalam aplikasi fullstack.
- Menyiapkan monorepo dengan shared types antara frontend dan backend.
- Meninjau dan meningkatkan arsitektur dan kualitas kode aplikasi secara keseluruhan.

### Stack Fullstack Modern 2026

Rekomendasi stack berdasarkan use case:
- **SaaS App**: Next.js 15 + Hono/Fastify + Postgres + Drizzle + Vercel AI SDK.
- **AI-First App**: Next.js 15 RSC streaming + Mastra.ai/LangGraph + pgvector.
- **SPA Terpisah**: TanStack Start + Hono RPC + Postgres — lihat `spa-orchestrator`.
- **Situs Konten**: Astro 5 + MDX.
- **Mobile**: Expo SDK 53 + Hono + SQLite.

### Pola Fullstack AI-Native (2026)
AI adalah warga kelas satu di aplikasi fullstack 2026:
- **Streaming RSC**: Alirkan respons LLM sebagai komponen React dari server menggunakan `streamUI` Vercel AI SDK 5.x.
- **Server Actions sebagai Pemicu AI**: Panggil LLM dari Server Actions React 19 tanpa lapisan API terpisah.
- **Background AI Jobs**: Offload tugas LLM panjang ke BullMQ + Redis; stream hasil via WebSocket atau SSE.
- **Output AI Terstruktur**: Selalu gunakan `zodResponseFormat` atau skema Pydantic — jangan pernah parse JSON bebas dari LLM.

### Prinsip Desain API (2026)
- **Hono RPC**: Zero codegen, end-to-end type-safe jika backend adalah Hono.
- **tRPC**: Untuk React Query + Next.js dengan dukungan RSC.
- **OpenAPI + codegen**: Jika memiliki banyak konsumen (mobile, pihak ketiga).
- **Format Error RFC 9457**: Respons error yang konsisten dengan `type`, `title`, `status`, `detail`.

### SPA vs SSR vs Static
Gunakan SSR/Astro untuk situs kritis SEO dan banyak baca. Gunakan SPA (TanStack Start) untuk dashboard yang sangat interaktif. Gunakan Next.js 15 dengan routing hybrid untuk aplikasi campuran (marketing + app).

### Monorepo dengan Shared Types
Definisikan interface dan tipe bersama di `packages/types` — digunakan oleh semua app (web, admin, api, mobile) sebagai single source of truth.

### Checklist Keamanan
- Input pengguna divalidasi Zod di server.
- JWT rotasi 90 hari; expiry pendek + refresh token.
- Header CSP dikonfigurasi.
- Semua query DB menggunakan parameterized query.
- Upload file divalidasi MIME type.
- Rate limiting di semua endpoint publik.
- Rute Super Admin dibatasi di `admin.domain.com` dengan cek `isSuperAdmin`.
