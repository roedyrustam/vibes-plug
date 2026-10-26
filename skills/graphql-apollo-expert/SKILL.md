---
name: graphql-apollo-expert
description: "GraphQL APIs with Apollo Server/Client, NestJS, and query caching / API GraphQL dengan Apollo Server/Client, NestJS, dan optimasi query."
author: "Roedy Rustam"
version: "4.4.4"

---

# GraphQL & Apollo Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Specs & Design**: `api-design-expert`, `spec-driven-development-expert`, `brainstorming`
- **Backend & Resolvers**: `js-backend-expert`, `database-orm-expert`, `sse-websocket-streaming-expert`
- **Frontend Apollo Consumers**: `senior-frontend`, `vue-frontend-expert`, `tanstack-query-expert`
- **Security & Quality**: `rate-limit-abuse-prevention`, `autonomous-red-teamer`, `e2e-testing-expert`, `anti-slop`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production-grade guidance for building and consuming **GraphQL APIs**. Focuses on the **Apollo** ecosystem (Apollo Server, Apollo Client, Federation), **NestJS GraphQL** integration, and solving common performance pitfalls like the N+1 query problem using DataLoaders.

### Trigger Conditions
Activate this skill when the user is:
- Setting up a GraphQL server with NestJS, Express, or Apollo Server.
- Using `@apollo/client` or `@vue/apollo-composable` on the frontend.
- Deciding between Code-First vs. Schema-First GraphQL design.
- Optimizing backend database queries triggered by GraphQL resolvers (N+1 problem).
- Implementing GraphQL Subscriptions via WebSockets.

### Core Concepts

#### 1. Code-First vs Schema-First (NestJS)
- **Code-First (Recommended for TypeScript):** Define resolvers and object types using TS decorators. The schema `.gql` file is automatically generated. Ensures a single source of truth.
- **Schema-First:** Write raw `.gql` files and use tools to generate TypeScript interfaces.

```typescript
// NestJS Code-First Example
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;
}

import { Resolver, Query } from '@nestjs/graphql';

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return [{ id: 1, email: 'user@example.com' }];
  }
}
```

#### 2. The N+1 Problem & DataLoader
GraphQL's resolver architecture easily causes the N+1 query problem (e.g., querying authors and their posts results in 1 query for authors, and N queries for each author's posts).
**Solution:** Always use `DataLoader` to batch and cache database requests within a single GraphQL execution tick.

#### 3. Apollo Client (Frontend)
Use Apollo Client for robust caching and normalized state management on the frontend.
```tsx
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
    }
  }
`;

function UserList() {
  const { loading, error, data } = useQuery(GET_USERS);
  if (loading) return <p>Loading...</p>;
  return <div>{data.users[0].email}</div>;
}
```

---

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec graphql-apollo-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Ideasi Hulu & Desain**: `api-design-expert`, `spec-driven-development-expert`, `brainstorming`
- **Backend & Resolver**: `js-backend-expert`, `database-orm-expert`, `sse-websocket-streaming-expert`
- **Konsumen Frontend Apollo**: `senior-frontend`, `vue-frontend-expert`, `tanstack-query-expert`
- **Keamanan & Kualitas**: `rate-limit-abuse-prevention`, `autonomous-red-teamer`, `e2e-testing-expert`, `anti-slop`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan produksi untuk membangun dan mengonsumsi API **GraphQL**. Mencakup ekosistem **Apollo** (Apollo Server, Apollo Client, Federation), integrasi **NestJS GraphQL**, dan pemecahan masalah bottleneck query N+1 menggunakan DataLoader.

### Kondisi Pemicu
- Mengonfigurasi server GraphQL menggunakan NestJS atau Apollo Server.
- Mengintegrasikan Apollo Client pada frontend React atau Vue.
- Memilih antara pendekatan Code-First vs Schema-First di TypeScript.
- Menyelesaikan masalah query berulang N+1 pada relasi database bersarang.

---

### Implementasi Pola Kunci

#### 1. Pendekatan Code-First dengan NestJS GraphQL
```typescript
import { ObjectType, Field, Int, Resolver, Query } from '@nestjs/graphql';

@ObjectType()
export class Pengguna {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;
}

@Resolver(() => Pengguna)
export class PenggunaResolver {
  @Query(() => [Pengguna])
  async daftarPengguna(): Promise<Pengguna[]> {
    return [{ id: 1, email: 'pengguna@example.com' }];
  }
}
```

#### 2. Mengatasi Masalah N+1 Query dengan DataLoader
```typescript
import DataLoader from 'dataloader';

// Kumpulkan ID dan lakukan satu query batch (IN clause)
export const pemuatDataPenulis = new DataLoader<string, Penulis>(async (daftarId) => {
  const baris = await db.penulis.findMany({
    where: { id: { in: [...daftarId] } },
  });
  const mapPenulis = new Map(baris.map((p) => [p.id, p]));
  return daftarId.map((id) => mapPenulis.get(id)!);
});
```

#### 3. Konsumsi di Sisi Klien dengan Apollo Client
```tsx
import { useQuery, gql } from '@apollo/client';

const QUERY_PENGGUNA = gql`
  query AmbilDaftarPengguna {
    daftarPengguna {
      id
      email
    }
  }
`;

export function KomponenDaftarPengguna() {
  const { loading, error, data } = useQuery(QUERY_PENGGUNA);
  if (loading) return <p>Memuat data...</p>;
  if (error) return <p>Terjadi galat: {error.message}</p>;
  return <div>Email: {data.daftarPengguna[0]?.email}</div>;
}
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec graphql-apollo-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
