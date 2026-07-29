---
name: fullstack-expert
description: "Expert-level fullstack development guide covering multi-language (TypeScript, Python, Go, Rust), multi-framework (Next.js, FastAPI, Gin, Axum), API design, microservices, DevOps, and system design / Panduan fullstack tingkat ahli mencakup multi-bahasa (TypeScript, Python, Go, Rust), multi-framework (Next.js, FastAPI, Gin, Axum), desain API, microservices, DevOps, dan system design."
author: "Roedy Rustam"
---

# Fullstack Expert (2026 Multi-Language Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert-level fullstack development across multiple languages and frameworks. Covers tech stack selection, API design (REST/gRPC/GraphQL), microservice architecture, DevOps, system design patterns, and AI-native backend integration for 2026.

### Trigger Conditions
- Choosing the right language and framework for a new service or feature.
- Designing APIs between services in a multi-language architecture.
- Planning a microservices decomposition strategy.
- Implementing system design patterns (event sourcing, CQRS, saga pattern).
- Integrating AI agents or LLM capabilities into a backend system.

### 2026 Technology Matrix

#### Frontend
| Tool | Version | Notes |
|---|---|---|
| React | 19.x | Compiler, Server Actions, `use()` hook |
| Next.js | 15.x | PPR, RSC, App Router stable |
| Astro | 5.x | Islands architecture, MDX, SSG |
| TanStack Router | 1.x | Type-safe SPA routing |
| TanStack Start | Beta | Full-stack Vite + RSC patterns |
| Nuxt | 4.x | Vue 3 SSR/SSG, stable |
| SvelteKit | 2.x | Lightweight, edge-ready |

#### Backend
| Language | Framework | Best For |
|---|---|---|
| TypeScript | Hono, Fastify 5, NestJS | Serverless, edge, type-safe RPC |
| Python | FastAPI 0.115+, Django 5 | AI/ML workloads, data pipelines |
| Go | net/http (1.22+), Gin, Echo | High-throughput microservices, CLI |
| Rust | Axum 0.8, Actix-web 4 | Performance-critical, WASM |

#### AI & Agents
| Tool | Role |
|---|---|
| Vercel AI SDK 5.x | Full-stack AI streaming, RSC |
| Mastra.ai | TS-first agent framework |
| LangGraph | Python stateful agent workflows |
| OpenAI Agents SDK | GPT-5 native agents + handoffs |
| Google ADK | Gemini-powered agents |
| Mem0 / MemGPT | Long-term agent memory |

#### Infrastructure
| Category | Tools |
|---|---|
| Container | Docker, Podman |
| Orchestration | Kubernetes, Railway, Fly.io |
| CI/CD | GitHub Actions, Turborepo |
| Observability | OpenTelemetry 1.x, Grafana, Langfuse |
| Databases | PostgreSQL (primary), ClickHouse (analytics), Redis (cache), Qdrant (vector) |

### API Design Standards

#### REST — OpenAPI 3.1
```yaml
# openapi.yaml
openapi: "3.1.0"
info:
  title: "My SaaS API"
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

#### gRPC — Protocol Buffers
```protobuf
syntax = "proto3";
package user.v1;

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (stream User);  // Server streaming
  rpc CreateUser (CreateUserRequest) returns (User);
}

message User {
  string id = 1;
  string email = 2;
  string name = 3;
  repeated string workspace_ids = 4;
}
```

### Microservice Patterns

#### Event-Driven (Saga Pattern)
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
- **Write side**: Commands update the primary PostgreSQL database.
- **Read side**: Events are projected into read-optimized views (denormalized tables or ClickHouse).
- Use when read patterns are very different from write patterns.

### AI-Native Backend Integration (2026)
```typescript
// Pattern: AI as a service within existing API
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

// AI endpoint that returns structured data
app.post('/api/analyze', async (c) => {
  const { content } = await c.req.json();

  const { object } = await generateObject({
    model: anthropic('claude-4-sonnet'),
    schema: z.object({
      sentiment: z.enum(['positive', 'neutral', 'negative']),
      topics: z.array(z.string()),
      summary: z.string().max(200),
    }),
    prompt: `Analyze this content: ${content}`,
  });

  return c.json(object);
});
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan pengembangan fullstack tingkat ahli di berbagai bahasa dan framework. Mencakup pemilihan tech stack, desain API (REST/gRPC/GraphQL), arsitektur microservice, DevOps, pola desain sistem, dan integrasi backend AI-native untuk 2026.

### Kondisi Pemicu
- Memilih bahasa dan framework yang tepat untuk layanan atau fitur baru.
- Merancang API antar layanan dalam arsitektur multi-bahasa.
- Merencanakan strategi dekomposisi microservice.
- Mengimplementasikan pola desain sistem (event sourcing, CQRS, saga pattern).
- Mengintegrasikan agen AI atau kemampuan LLM ke dalam sistem backend.

### Matriks Teknologi 2026

#### Frontend
React 19 + Next.js 15 (default SaaS), Astro 5 (konten), TanStack Router (SPA), Nuxt 4 (Vue), SvelteKit 2.

#### Backend
TypeScript/Hono (serverless, edge), Python/FastAPI (AI/ML), Go/net/http (throughput tinggi), Rust/Axum (kritis performa).

#### AI & Agen
Vercel AI SDK 5.x, Mastra.ai, LangGraph, OpenAI Agents SDK, Google ADK, Mem0/MemGPT untuk memori agen jangka panjang.

#### Infrastruktur
Docker/Kubernetes, GitHub Actions + Turborepo, OpenTelemetry 1.x, Langfuse. Database: PostgreSQL (utama), ClickHouse (analitik), Redis (cache), Qdrant (vektor).

### Standar Desain API
- **REST + OpenAPI 3.1**: Untuk API publik dengan beberapa konsumen.
- **gRPC**: Untuk komunikasi antar layanan internal berkinerja tinggi.
- **Hono RPC / tRPC**: Untuk komunikasi full-stack TypeScript type-safe tanpa codegen.

### Pola Microservice

#### Event-Driven (Saga Pattern)
Orkestrasi transaksi terdistribusi melalui event — setiap layanan mempublikasikan event setelah berhasil; kegagalan memicu kompensasi di seluruh rantai.

#### CQRS
Pisahkan sisi tulis (PostgreSQL) dari sisi baca (view terdenormalisasi atau ClickHouse) ketika pola baca sangat berbeda dari pola tulis.

### Integrasi Backend AI-Native (2026)
Gunakan Vercel AI SDK `generateObject()` dengan skema Zod untuk mengintegrasikan kemampuan AI ke endpoint API yang ada — mengembalikan output terstruktur yang dijamin sesuai tipe.
