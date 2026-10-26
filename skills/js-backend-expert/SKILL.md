---
name: js-backend-expert
description: "Node.js 24+, Bun, and Deno backend development (Hono, Fastify, Express) / Pengembangan backend Node.js, Bun, dan Deno (Hono, Fastify, Express)."
author: "Roedy Rustam"
version: "4.4.4"

---

# JS Backend Expert (Node.js 24 LTS / Bun 1.2 / Deno 2.x Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **API Contracts & Full-Stack**: `api-design-expert`, `spec-driven-development-expert`, `openapi-swagger-codegen-expert`, `typescript-expert`, and `senior-frontend` for end-to-end type safety, Hono RPC client binding, and OpenAPI 3.1 contracts.
- **Database & Persistence**: `database-orm-expert` for Drizzle ORM, Prisma 6, connection pooling (PgBouncer/Supavisor), and zero-downtime migrations.
- **Auth & Security**: `authentication-identity-expert` (JWT, OAuth2, RBAC/ABAC) and `zero-trust-secret-vault` (environment secret management).
- **Asynchronous & Queues**: `async-queue-temporal-expert` (BullMQ / Temporal workflows) and `sse-websocket-streaming-expert` (real-time events).
- **Quality & Testing**: `autonomous-tdd-debugger`, `e2e-testing-expert`, and `anti-slop` for strict code quality, self-healing test pipelines, and zero-slop error handlers.
- **Master Orchestrators**: `brainstorming` and `zero-to-prod-orchestrator` (Phase 4: Backend & APIs).

### Description
Production-grade guidance for building fast, scalable, and resilient JavaScript/TypeScript backend APIs, microservices, and serverless functions across **Node.js 24 (LTS)**, **Bun 1.2+**, and **Deno 2.x**. Covers high-throughput frameworks (Fastify 5, Hono, Express 5, NestJS), type-safe ORMs (Drizzle, Prisma 6), **Hono RPC** for type-safe full-stack communication, Edge Runtime patterns, WebSockets, BullMQ background jobs, graceful shutdown handling, and self-healing test pipelines.

### Trigger Conditions
- Bootstrapping or refactoring a Node.js, Bun, or Deno backend application or microservice.
- Writing RESTful, GraphQL, WebSocket, or SSE (Server-Sent Events) API endpoints.
- Developing web servers using **Fastify 5**, **Hono**, **Express 5**, or **NestJS**.
- Building type-safe full-stack apps with **Hono RPC** or **tRPC**.
- Deploying backend logic to Edge Runtimes (Cloudflare Workers, Vercel Edge).
- Interacting with databases using **Drizzle ORM**, **Prisma 6**, or **Kysely**.
- Setting up background job processing with **BullMQ** and **Redis**.
- Implementing rate limiting, CORS, Content Security Policy (CSP), and JWT/Session authentication.
- Writing backend tests using **Vitest**, **Supertest**, or Node's native `node:test` runner with automated self-healing.

### Runtime Matrix (Node.js 24 vs Bun 1.2 vs Deno 2.x)

| Feature / Runtime | Node.js 24 (LTS) | Bun 1.2+ | Deno 2.x |
|---|---|---|---|
| Module Standard | Native ESM / CJS | Native ESM / CJS | Native ESM |
| `.env` Loading | Native `--env-file` | Native | Native |
| TypeScript Execution | Native `--experimental-strip-types` / `tsx` | Native (Zero-config) | Native (Zero-config) |
| HTTP Server | `node:http` / `Fastify` | `Bun.serve()` / `Hono` | `Deno.serve()` / `Hono` |
| Native WebSockets | Built-in (`WebSocket`) | Built-in (`Bun.serve`) | Built-in (`Deno.upgradeWebSocket`) |
| Package Manager | npm / pnpm | bun (built-in) | npm / jsr |
| Test Runner | `node:test` / Vitest | `bun test` | `deno test` |
| Edge Deploy | Vercel Serverless | Railway / Fly.io | Deno Deploy |

### Framework Guidance

#### 1. Fastify 5 (High-Throughput & Schema Validation)
Use Fastify for performance-critical REST APIs. Always validate input using **TypeBox** or **Zod**:
```typescript
import Fastify from 'fastify';
import { z } from 'zod';

const app = Fastify({ logger: true });

app.post('/api/users', async (request, reply) => {
  const bodySchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
  });
  const data = bodySchema.parse(request.body);
  return reply.status(201).send({ status: 'created', user: data });
});
```

#### 2. Hono (Multi-Runtime & Hono RPC)
Use Hono for cross-runtime backends. The killer feature in 2026 is **Hono RPC** — end-to-end type-safe API calls without code generation:
```typescript
// server.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono()
  .get('/health', (c) => c.json({ status: 'ok' }))
  .post(
    '/users',
    zValidator('json', z.object({ name: z.string(), email: z.string().email() })),
    async (c) => {
      const body = c.req.valid('json');
      const user = await db.user.create({ data: body });
      return c.json(user, 201);
    }
  );

export type AppType = typeof app;
export default app;

// client.ts — fully type-safe, no codegen needed
import { hc } from 'hono/client';
import type { AppType } from './server';

const client = hc<AppType>('http://localhost:3000');
const res = await client.users.$post({ json: { name: 'Alice', email: 'alice@example.com' } });
const user = await res.json(); // Fully typed!
```

#### 3. NestJS (Enterprise Architecture)
Use NestJS for large-scale, enterprise-grade applications. It enforces a strict modular architecture (Controllers, Providers, Modules) inspired by Angular.
- **Dependency Injection**: Leverage built-in DI for testable, loosely coupled services.
- **TypeScript First**: Decorators (`@Controller()`, `@Get()`) provide clean, declarative routing.
- **Under the Hood**: By default uses Express, but can be switched to Fastify for higher performance using `platform-fastify`.

#### 4. Express 5
Express 5 natively catches rejected promises in async route handlers — eliminating the need for `express-async-errors`. While less opinionated than NestJS and slower than Fastify, its ecosystem is unparalleled. Ideal for teams migrating legacy apps.

#### 5. Edge Runtime (Cloudflare Workers / Vercel Edge)
For ultra-low latency at the edge, use **Hono** (runs natively on all edge platforms):
```typescript
// Cloudflare Worker
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return app.fetch(request, env);
  }
};
```
Edge Runtime restrictions: No Node.js built-ins (`fs`, `path`), limited memory, no long-running processes. Use `fetch`, Web Crypto API, and Cloudflare KV/D1/R2.

---

### Type-Safe Data Layer (Drizzle ORM & Prisma 6)
- **Drizzle ORM**: Prefer for zero-overhead, SQL-like TypeScript query building in serverless/edge applications.
- **Prisma 6**: Prefer for complex relational schema modeling, auto-generated TypeScript client, and rich `prisma studio` tooling.
- **Connection Pooling**: Always use connection poolers (PgBouncer, Supavisor, Neon Hyperdrive) when deploying serverless handlers.

### Background Jobs (BullMQ + Redis)
```typescript
import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis({ maxRetriesPerRequest: null });
const emailQueue = new Queue('email', { connection });

// Enqueue
await emailQueue.add('welcome-email', { userId: '123' }, { delay: 1000 });

// Worker
const worker = new Worker('email', async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection, concurrency: 5 });
```

### Graceful Shutdown & Resilience
Never terminate the process abruptly. Clean up database pools, HTTP listeners, and Redis queues:
```typescript
const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  await server.close();
  await dbPool.end();
  await worker.close();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec js-backend-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **Kontrak API & Full-Stack**: `api-design-expert`, `spec-driven-development-expert`, `openapi-swagger-codegen-expert`, `typescript-expert`, dan `senior-frontend` untuk tipe end-to-end, binding klien Hono RPC, dan kontrak OpenAPI 3.1.
- **Database & Persistensi**: `database-orm-expert` untuk Drizzle ORM, Prisma 6, connection pooling (PgBouncer/Supavisor), dan migrasi database tanpa downtime.
- **Autentikasi & Keamanan**: `authentication-identity-expert` (JWT, OAuth2, RBAC/ABAC) dan `zero-trust-secret-vault` (pengelolaan rahasia lingkungan).
- **Asinkron & Antrean**: `async-queue-temporal-expert` (BullMQ / workflow Temporal) dan `sse-websocket-streaming-expert` (event real-time).
- **Kualitas & Pengujian**: `autonomous-tdd-debugger`, `e2e-testing-expert`, dan `anti-slop` untuk penegakan kode bebas slop, perbaikan otomatis stack trace, dan penanganan error tuntas.
- **Orkestrator Utama**: `brainstorming` dan `zero-to-prod-orchestrator` (Fase 4: Backend & APIs).

### Deskripsi
Panduan tingkat produksi untuk membangun API backend JavaScript/TypeScript yang cepat, skalabel, dan tangguh di lingkungan **Node.js 24 LTS**, **Bun 1.2+**, dan **Deno 2.x**. Mencakup framework berkinerja tinggi (Fastify 5, Hono v4, Express 5, NestJS), ORM type-safe (Drizzle, Prisma 6), **Hono RPC** untuk komunikasi full-stack type-safe, pola Edge Runtime, WebSocket, background jobs (BullMQ), OpenTelemetry, penanganan *graceful shutdown*, dan pipeline pengujian self-healing.

### Kondisi Pemicu
- Merancang atau merefaktor aplikasi backend Node.js, Bun, atau Deno.
- Menulis endpoint RESTful, GraphQL, WebSocket, atau SSE.
- Membangun web server dengan Fastify 5, Hono, Express 5, atau NestJS.
- Membangun aplikasi full-stack type-safe dengan **Hono RPC** atau tRPC.
- Men-deploy logika backend ke Edge Runtime (Cloudflare Workers, Vercel Edge).
- Berinteraksi dengan database menggunakan Drizzle ORM, Prisma 6, atau Kysely.
- Mengatur background job dengan BullMQ dan Redis.

### Matriks Runtime
Node.js 24 sebagai LTS terbaru, Bun 1.2+ untuk performa maksimal dan zero-config TypeScript, Deno 2.x untuk keamanan bawaan dan kompatibilitas npm.

### Panduan Framework

#### 1. Fastify 5 — Kinerja Tinggi & Validasi Skema
Gunakan untuk REST API dengan throughput tinggi. Selalu validasi input menggunakan TypeBox atau Zod.

#### 2. Hono & Hono RPC — Multi-Runtime & Type-Safe Full-Stack
Hono berjalan di Node.js, Bun, Cloudflare Workers, dan Deno. **Hono RPC** adalah fitur unggulan 2026 — panggilan API end-to-end yang fully type-safe tanpa code generation. Klien mendapatkan tipe yang tepat dari definisi server secara otomatis.

#### 3. NestJS — Arsitektur Enterprise
Gunakan NestJS untuk aplikasi skala besar tingkat *enterprise*. NestJS memaksakan arsitektur modular yang ketat dengan Dependency Injection dan Decorators. NestJS menggunakan Express secara bawaan, namun dapat dialihkan ke Fastify untuk performa lebih tinggi.

#### 4. Express 5
Express 5 otomatis menangkap rejected promises di async route handler tanpa butuh library tambahan. Sangat cocok untuk tim yang sudah familiar dengan ekosistem Express.

#### 5. Edge Runtime (Cloudflare Workers / Vercel Edge)
Gunakan Hono untuk latensi ultra-rendah di edge. Batasan edge: tanpa built-in Node.js (`fs`, `path`), memori terbatas, tanpa proses long-running. Gunakan `fetch`, Web Crypto API, dan Cloudflare KV/D1/R2.

### Lapisan Data Type-Safe
- **Drizzle ORM**: Ideal untuk serverless/edge dengan query bergaya SQL dan zero overhead.
- **Prisma 6**: Ideal untuk pemodelan skema relasional kompleks dan tooling prisma studio yang kaya.
- **Connection Pooling**: Wajib di lingkungan serverless — gunakan PgBouncer, Supavisor, atau Neon Hyperdrive.

### Background Jobs (BullMQ + Redis)
Gunakan BullMQ dengan Redis untuk pemrosesan tugas latar belakang yang andal dengan retry otomatis, delay, dan konkurensi yang dapat dikonfigurasi.

### Graceful Shutdown
Jangan hentikan proses secara mendadak. Bersihkan connection pool, HTTP server, dan worker queue sebelum keluar.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec js-backend-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
