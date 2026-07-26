---
name: js-backend-expert
description: "Expert-level skill for Node.js 22+, Bun 1.2+, and Deno 2.x backend development. Covers Express 5, Fastify 5, Hono, NestJS, Prisma 6, Drizzle ORM, WebSockets, and microservices in English and Indonesian."
author: "Roedy Rustam"
---

# JS Backend Expert (Node.js 22 / Bun 1.2 / Deno 2.x Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade guidance for building fast, scalable, and resilient JavaScript/TypeScript backend APIs, microservices, and serverless functions across **Node.js 22+ (LTS)**, **Bun 1.2+**, and **Deno 2.x**. Covers high-throughput frameworks (Fastify 5, Hono, Express 5, NestJS), type-safe ORMs (Drizzle, Prisma 6), asynchronous event loop optimization, WebSockets, BullMQ background jobs, and graceful shutdown handling.

### Trigger Conditions
- Bootstrapping or refactoring a Node.js, Bun, or Deno backend application or microservice.
- Writing RESTful, GraphQL, WebSocket, or SSE (Server-Sent Events) API endpoints.
- Developing web servers using **Fastify 5**, **Hono**, **Express 5**, or **NestJS**.
- Interacting with databases using **Drizzle ORM**, **Prisma 6**, or **Kysely**.
- Setting up background job processing with **BullMQ** and **Redis**.
- Implementing rate limiting, CORS, Content Security Policy (CSP), and JWT/Session authentication.
- Writing backend tests using **Vitest**, **Supertest**, or Node's native `node:test` runner.

### Runtime Matrix (Node.js 22 vs Bun 1.2 vs Deno 2.x)

| Feature / Runtime | Node.js 22 (LTS) | Bun 1.2+ | Deno 2.x |
|---|---|---|---|
| Module Standard | Native ESM / CJS | Native ESM / CJS | Native ESM |
| `.env` Loading | Native `--env-file` | Native | Native |
| TypeScript Execution | Native `--experimental-strip-types` / `tsx` | Native (Zero-config) | Native (Zero-config) |
| HTTP Server | `node:http` / `Fastify` | `Bun.serve()` / `Hono` | `Deno.serve()` / `Hono` |
| Native WebSockets | Built-in (`WebSocket`) | Built-in (`Bun.serve`) | Built-in (`Deno.upgradeWebSocket`) |

### Framework Guidance

#### 1. Fastify 5 (High-Throughput & Schema Validation)
Use Fastify for performance-critical REST APIs. Always validate input schemas using **TypeBox** or **Zod**:
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

#### 2. Hono (Multi-Runtime & Ultra-Lightweight)
Use Hono for cross-runtime backends running seamlessly on Node.js, Bun, Cloudflare Workers, or Deno:
```typescript
import { Hono } from 'hono';

const app = new Hono();
app.get('/health', (c) => c.json({ status: 'ok', time: new Date().toISOString() }));

export default app;
```

#### 3. Express 5
Express 5 natively catches rejected promises in async route handlers — eliminating the need for `express-async-errors`.

---

### Type-Safe Data Layer (Drizzle ORM & Prisma 6)
- **Drizzle ORM**: Prefer for zero-overhead, SQL-like TypeScript query building in serverless/edge applications.
- **Prisma 6**: Prefer for complex relational schema modeling, auto-generated GraphQL/tRPC integrations, and rich studio tooling.
- **Connection Pooling**: Always use connection poolers (PgBouncer, Supavisor, Neon/Hyperdrive) when deploying serverless handlers.

### Graceful Shutdown & Resilience
Never terminate process abruptly. Clean up database pools, HTTP listeners, and Redis queues:
```typescript
const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  await server.close();
  await dbPool.end();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk membangun API backend, microservices, dan fungsi serverless JavaScript/TypeScript yang cepat, skalabel, dan tangguh di lingkungan **Node.js 22+ (LTS)**, **Bun 1.2+**, dan **Deno 2.x**. Mencakup framework berkinerja tinggi (Fastify 5, Hono, Express 5, NestJS), ORM type-safe (Drizzle, Prisma 6), optimasi event loop, WebSocket, background jobs (BullMQ), dan penanganan *graceful shutdown*.

### Kondisi Pemicu
- Merancang atau merefaktor aplikasi backend Node.js, Bun, atau Deno.
- Menulis endpoint RESTful, GraphQL, WebSocket, atau Server-Sent Events (SSE).
- Mengembangkan web server menggunakan **Fastify 5**, **Hono**, **Express 5**, atau **NestJS**.
- Berinteraksi dengan database menggunakan **Drizzle ORM**, **Prisma 6**, atau **Kysely**.
- Mengatur pemrosesan pekerjaan latar belakang dengan **BullMQ** dan **Redis**.
- Mengimplementasikan *rate limiting*, CORS, Content Security Policy (CSP), dan autentikasi JWT/Session.
- Menulis pengujian backend menggunakan **Vitest**, **Supertest**, atau runner bawaan `node:test`.

### Matriks Runtime (Node.js 22 vs Bun 1.2 vs Deno 2.x)

| Fitur / Runtime | Node.js 22 (LTS) | Bun 1.2+ | Deno 2.x |
|---|---|---|---|
| Standar Modul | ESM / CJS Bawaan | ESM / CJS Bawaan | ESM Bawaan |
| Pemuatan `.env` | Bawaan `--env-file` | Bawaan | Bawaan |
| Eksekusi TypeScript | Bawaan `--experimental-strip-types` / `tsx` | Native (Tanpa Config) | Native (Tanpa Config) |
| HTTP Server | `node:http` / `Fastify` | `Bun.serve()` / `Hono` | `Deno.serve()` / `Hono` |

### Panduan Framework

#### 1. Fastify 5 (Kinerja Tinggi & Validasi Skema)
Gunakan Fastify untuk REST API yang membutuhkan troughput tinggi. Selalu validasi skema input menggunakan **TypeBox** atau **Zod**.

#### 2. Hono (Multi-Runtime & Portabel)
Gunakan Hono untuk backend yang perlu berjalan secara fleksibel di Node.js, Bun, Cloudflare Workers, atau Deno.

#### 3. Express 5
Express 5 secara otomatis menangkap *rejected promises* pada async route handler tanpa butuh pustaka tambahan.

### Lapisan Data Aman-Tipe (Drizzle ORM & Prisma 6)
- **Drizzle ORM**: Sangat disarankan untuk arsitektur serverless/edge dengan *overhead* nol dan gaya query SQL yang eksplisit.
- **Prisma 6**: Sangat cocok untuk pemodelan data relasional yang kompleks dan auto-generated SDK.
- **Connection Pooling**: Selalu gunakan *connection pooler* (PgBouncer, Supavisor, Neon) di lingkungan serverless.

### Graceful Shutdown (Penutupan Anggun)
Jangan pernah menghentikan proses secara mendadak. Bersihkan *connection pool*, HTTP server, dan queue Redis:
```typescript
const penutupanAnggun = async (sinyal: string) => {
  console.log(`Menerima sinyal ${sinyal}. Menutup koneksi...`);
  await server.close();
  await dbPool.end();
  process.exit(0);
};

process.on('SIGTERM', () => penutupanAnggun('SIGTERM'));
process.on('SIGINT', () => penutupanAnggun('SIGINT'));
```
