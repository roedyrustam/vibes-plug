---
name: graphql-apollo-expert
description: "Expert guide for designing and consuming GraphQL APIs. Covers Apollo Server/Client, NestJS GraphQL (Code-First & Schema-First), TypeGraphQL, caching, and N+1 query optimization."
author: "Roedy Rustam"
---

# GraphQL & Apollo Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

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

### Deskripsi
Panduan produksi untuk membangun dan mengkonsumsi API **GraphQL**. Mencakup ekosistem **Apollo**, **NestJS GraphQL**, dan teknik optimasi performa seperti *DataLoader*.

### Kondisi Pemicu
- Saat mengkonfigurasi server GraphQL menggunakan NestJS atau Apollo.
- Saat menggunakan Apollo Client di aplikasi React atau Vue.
- Saat menghadapi masalah performa N+1 query pada resolusi data.

### Panduan Singkat
- **Pilih Code-First di TypeScript:** Di NestJS atau TypeScript murni, gunakan pendekatan *Code-First* (`@nestjs/graphql` atau TypeGraphQL) agar Anda tidak perlu mengelola file `.gql` dan *interface* TS secara terpisah.
- **Gunakan DataLoader Wajib:** Jangan pernah melakukan *query* database langsung di dalam resolver yang mengembalikan *list of objects* bersarang. Gunakan `DataLoader` dari Facebook untuk mengumpulkan (batching) request database.
- **Frontend Caching:** Manfaatkan normalisasi *cache* bawaan Apollo Client agar Anda tidak perlu menggunakan Redux atau state manager lain untuk menyimpan data dari server.
