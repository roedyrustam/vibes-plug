---
name: fullstack-expert
description: "Polyglot fullstack development: TypeScript, Python, Go, and Rust / Pengembangan fullstack polyglot: TypeScript, Python, Go, dan Rust."
author: "Roedy Rustam"
version: "4.4.2"

---

# Fullstack Expert (2026 Polyglot & Systems Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **Frontend & Fullstack DX**: `senior-frontend`, `nextjs-app-router-expert`, `design-system-architect`, and `monorepo-architect` for shared workspace types and end-to-end type safety.
- **Polyglot Backends**: `js-backend-expert`, `python-programming-expert`, `go-programming-expert`, and `rust-programming-expert` for heterogeneous microservices and high-throughput pipelines.
- **Contracts & APIs**: `api-design-expert`, `openapi-swagger-codegen-expert`, `spec-driven-development-expert`, and `graphql-apollo-expert`.
- **Database & State**: `database-orm-expert` (Prisma/Drizzle/SQLx) and `vector-db-rag-expert` (pgvector).
- **Quality & Anti-Slop**: `anti-slop`, `autonomous-tdd-debugger`, and `e2e-testing-expert`.
- **Master Orchestrator**: `brainstorming` and `zero-to-prod-orchestrator`.

### Description
Expert-level fullstack development across multiple languages and frameworks. Focuses on polyglot backend architectures, system design patterns (Event-Driven Saga, CQRS), API contracts (OpenAPI 3.1, gRPC), and monorepo shared types.

### Trigger Conditions
- Choosing the right language and framework for a multi-service architecture.
- Designing API contracts (REST, gRPC, Hono RPC) between heterogeneous services.
- Implementing distributed system design patterns (Saga, CQRS).
- Setting up a polyglot monorepo with shared types across frontend and backend.

---

### 2026 Polyglot Architecture Matrix

> For comprehensive frontend UI architecture, see `senior-frontend` and `nextjs-app-router-expert`.
> For dedicated AI agent workflows and LLM integrations, see `ai-llm-integration-expert` and `multi-agent-orchestration`.

| Language | Primary Frameworks | Ideal Workloads |
|---|---|---|
| **TypeScript** | Hono, Fastify 5, NestJS | Serverless, Edge APIs, type-safe RPC |
| **Python** | FastAPI 0.115+, Django 5 | Data science, LLM orchestration, async queues |
| **Go** | net/http (Go 1.25+), Gin, Echo | Ultra-high throughput microservices, networking, CLIs |
| **Rust** | Axum 0.8, Actix-web 4 | High-performance compute, memory safety, WASM |

#### Infrastructure & Multi-Service Storage
- **Primary OLTP**: PostgreSQL with connection pooling (PgBouncer / Supavisor).
- **Analytics OLAP**: ClickHouse / DuckDB for high-speed aggregations.
- **Cache & Ephemeral State**: Redis / Upstash with TTL.
- **Vector Search**: pgvector or Qdrant for semantic search.

---

### API Design Standards

#### REST — OpenAPI 3.1
```yaml
openapi: "3.1.0"
info:
  title: "SaaS Multi-Service API"
  version: "1.0.0"
paths:
  /api/v1/workspaces/{id}:
    get:
      summary: "Get workspace by ID"
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        "200":
          content:
            application/json:
              schema: { $ref: "#/components/schemas/Workspace" }
        "404":
          content:
            application/json:
              schema: { $ref: "#/components/schemas/ProblemDetail" }
```

#### gRPC — Protocol Buffers (`proto3`)
```protobuf
syntax = "proto3";
package user.v1;

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (stream User);
  rpc CreateUser (CreateUserRequest) returns (User);
}

message User {
  string id = 1;
  string email = 2;
  string name = 3;
  repeated string workspace_ids = 4;
}
```

---

### Microservice Patterns

#### Event-Driven (Saga Pattern with Compensations)
```
Order Service ──publishes──> "order.created" ──> Payment Service
                                                      │
                                               ┌──────┴──────┐
                                          success?       failure?
                                               │               │
                                    "payment.succeeded"  "payment.failed"
                                               │               │
                                       Inventory Service  Order Service
                                       (reserve stock)    (cancel order)
```

#### CQRS (Command Query Responsibility Segregation)
- **Write side**: Commands validate and update the primary relational database.
- **Read side**: Events project into read-optimized denormalized views or ClickHouse tables for high-frequency queries.

---

### AI-Native Backend Integration
```typescript
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

app.post('/api/analyze', async (c) => {
  const { content } = await c.req.json();
  const schema = z.object({
    sentiment: z.enum(['positive', 'neutral', 'negative']),
    topics: z.array(z.string()),
    summary: z.string().max(200),
  });

  // Availability Fallback Invariant: Claude Opus 5.5 -> Claude Opus 4.6
  let result;
  try {
    result = await generateObject({
      model: anthropic('claude-opus-5.5'),
      schema,
      prompt: `Analyze: ${content}`,
    });
  } catch {
    result = await generateObject({
      model: anthropic('claude-opus-4.6'),
      schema,
      prompt: `Analyze: ${content}`,
    });
  }
  return c.json(result.object);
});
```

---

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
```

### Production Security Checklist
- [ ] User inputs validated with Zod / Pydantic on the server.
- [ ] Parameterized queries enforced across all database layers.
- [ ] Rate limiting on all public endpoints (`rate-limit-abuse-prevention`).
- [ ] Super Admin routes strictly isolated to dedicated subdomain.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec fullstack-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **Frontend & Fullstack DX**: `senior-frontend`, `nextjs-app-router-expert`, `design-system-architect`, dan `monorepo-architect` untuk tipe data bersama monorepo dan keamanan tipe end-to-end.
- **Backend Polyglot**: `js-backend-expert`, `python-programming-expert`, `go-programming-expert`, dan `rust-programming-expert` untuk microservices heterogen dan pipeline komputasi tinggi.
- **Kontrak & API**: `api-design-expert`, `openapi-swagger-codegen-expert`, `spec-driven-development-expert`, dan `graphql-apollo-expert`.
- **Database & State**: `database-orm-expert` (Prisma/Drizzle/SQLx) dan `vector-db-rag-expert` (pgvector).
- **Kualitas & Anti-Slop**: `anti-slop`, `autonomous-tdd-debugger`, dan `e2e-testing-expert`.
- **Orkestrator Utama**: `brainstorming` dan `zero-to-prod-orchestrator`.

### Deskripsi
Panduan pengembangan fullstack tingkat ahli lintas bahasa pemrograman dan framework. Berfokus pada arsitektur backend polyglot, pola desain sistem terdistribusi (Event-Driven Saga, CQRS), kontrak antarmuka API (OpenAPI 3.1, gRPC), dan monorepo dengan type sharing terpadu.

### Kondisi Pemicu
- Memilih bahasa dan framework yang tepat untuk arsitektur multi-service (TypeScript, Python, Go, Rust).
- Merancang kontrak API (REST, gRPC, Hono RPC) antar-layanan heterogen.
- Mengimplementasikan pola arsitektur terdistribusi (Saga dengan rollback kompensasi, CQRS).
- Menyiapkan monorepo polyglot dengan tipe data yang dibagikan antara frontend dan backend.

---

### Matriks Arsitektur Polyglot 2026

| Bahasa | Framework Utama | Kasus Penggunaan Ideal |
|---|---|---|
| **TypeScript** | Hono, Fastify 5, NestJS | Edge APIs, Serverless, RPC type-safe end-to-end |
| **Python** | FastAPI 0.115+, Pydantic AI | Pipeline data, orkestrasi LLM, antrean tugas ML |
| **Go** | net/http (Go 1.25+), Gin, Echo | Microservice throughput ultra-tinggi, networking, CLI tools |
| **Rust** | Axum 0.8, Actix-web | Komputasi performa kritis, keamanan memori, WASM |

#### Infrastruktur & Database Multi-Service
- **OLTP Primer**: PostgreSQL dengan connection pooling (PgBouncer / Supavisor).
- **OLAP Analitik**: ClickHouse / DuckDB untuk agregasi metrik berkecepatan tinggi.
- **Cache & State Ephemeral**: Redis / Upstash dengan TTL ketat.
- **Pencarian Vektor**: pgvector (HNSW) atau Qdrant untuk penelusuran semantik.

---

### Implementasi Pola Kunci (TypeScript & OpenAPI 3.1)

#### 1. Kontrak OpenAPI 3.1 untuk Layanan SaaS
```yaml
openapi: "3.1.0"
info:
  title: "API Multi-Layanan SaaS"
  version: "1.0.0"
paths:
  /api/v1/workspaces/{id}:
    get:
      summary: "Mengambil data workspace berdasarkan ID"
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        "200":
          content:
            application/json:
              schema: { $ref: "#/components/schemas/Workspace" }
```

#### 2. Definisi Kontrak gRPC Protocol Buffers (`proto3`)
```protobuf
syntax = "proto3";
package user.v1;

service LayananPengguna {
  rpc DapatkanPengguna (PermintaanPengguna) returns (Pengguna);
  rpc BuatPengguna (PermintaanBuatPengguna) returns (Pengguna);
}

message Pengguna {
  string id = 1;
  string email = 2;
  string nama = 3;
}
```

#### 3. Tipe Bersama Monorepo (`packages/types/src/index.ts`)
```typescript
export interface ProfilPengguna {
  id: string;
  email: string;
  nama: string;
  paketLangganan: 'gratis' | 'pro' | 'enterprise';
  isSuperAdmin: boolean;
}
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec fullstack-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
