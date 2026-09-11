---
name: fullstack-expert
description: "Expert-level fullstack development guide covering multi-language (TypeScript, Python, Go, Rust), API design (OpenAPI 3.1, gRPC), microservices, system design patterns, and polyglot architecture / Panduan fullstack tingkat ahli mencakup multi-bahasa, desain API, microservices, dan arsitektur polyglot."
author: "Roedy Rustam"
---

# Fullstack Expert (2026 Polyglot & Systems Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills like `brainstorming`, `zero-to-prod-orchestrator`, `senior-frontend`, `js-backend-expert`, `go-programming-expert`, `python-programming-expert`, and `rust-programming-expert`.

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
  const { object } = await generateObject({
    model: anthropic('claude-3-7-sonnet-20250219'),
    schema: z.object({
      sentiment: z.enum(['positive', 'neutral', 'negative']),
      topics: z.array(z.string()),
      summary: z.string().max(200),
    }),
    prompt: `Analyze: ${content}`,
  });
  return c.json(object);
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

## Orchestration & Integration
- Integrates with: `js-backend-expert`, `go-programming-expert`, `python-programming-expert`, `rust-programming-expert`, `nextjs-app-router-expert`, `api-design-expert`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan pengembangan fullstack tingkat ahli multi-bahasa (TypeScript, Python, Go, Rust), desain kontrak API (OpenAPI 3.1, gRPC), pola arsitektur microservices (Saga, CQRS), dan monorepo shared types.

### Matriks Arsitektur Polyglot 2026
- **TypeScript**: Hono, Fastify 5, NestJS (Serverless, Cloudflare Edge, Hono RPC).
- **Python**: FastAPI 0.115+, Django 5 (AI/ML, orkestrasi LLM, pipeline asinkron).
- **Go**: net/http (Go 1.25+), Gin (Microservices throughput tinggi, CLI).
- **Rust**: Axum 0.8, Actix-web 4 (Performa ekstrem, komputasi berat, WASM).

### Pola Sistem Terdistribusi
1. **Saga Pattern**: Kompensasi rollback bertahap saat transaksi multi-layanan mengalami kegagalan.
2. **CQRS**: Memisahkan database tulis (PostgreSQL) dari view proyeksi baca (ClickHouse/Redis) untuk beban baca tinggi.
3. **Monorepo Shared Types**: Simpan definisi tipe bersama di `packages/types` sebagai single source of truth antara frontend dan backend.

## Integrasi Orkestrasi
- Terintegrasi dengan: `js-backend-expert`, `go-programming-expert`, `python-programming-expert`, `rust-programming-expert`, `nextjs-app-router-expert`, `api-design-expert`.
