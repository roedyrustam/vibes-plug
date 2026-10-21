---
name: graphql-apollo-expert
description: "Expert guide for designing and consuming GraphQL APIs. Covers Apollo Server/Client, NestJS GraphQL (Code-First & Schema-First), TypeGraphQL, caching, and N+1 query optimization."
author: "Roedy Rustam"
version: "4.4.2"

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

### Integration with Other Skills (MANDATORY)
This skill works best when combined with:
- `js-backend-expert` — For setting up the underlying Node.js/NestJS server architecture.
- `database-orm-expert` — For connecting Prisma/Drizzle ORM directly to GraphQL resolvers and DataLoaders.
- `senior-frontend` / `vue-frontend-expert` — For integrating Apollo Client into React or Vue applications.

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "API Design & Contracts".
- `zero-to-prod-orchestrator` — Phase 4 (Backend APIs).

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