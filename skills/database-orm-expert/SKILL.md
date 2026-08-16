---
name: database-orm-expert
description: "Expert guide for database schema design, ORM tools (Prisma 6, Drizzle ORM, TypeORM), migrations, query optimization, and type-safe SQL patterns in TypeScript / Panduan ahli untuk desain skema database, ORM tools (Prisma 6, Drizzle ORM, TypeORM), migrasi, optimasi query, dan pola SQL type-safe di TypeScript."
author: "vibes-plug-swarm"
---

# Database ORM Expert (Prisma 6 + Drizzle ORM Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Design schemas, select ORMs, execute migrations, optimize queries, and implement type-safe SQL patterns. Prioritize **Prisma 6** and **Drizzle ORM**. Implement connection pooling for production workloads.

### Trigger Conditions
- Designing or migrating a database schema.
- Choosing between Prisma, Drizzle ORM, or TypeORM.
- Writing complex queries with joins, aggregations, or pagination.
- Optimizing slow queries or N+1 problems.
- Setting up database migrations in CI/CD pipelines.
- Implementing Row Level Security (RLS) patterns.
- Working with PostgreSQL, MySQL, SQLite, or PlanetScale.

## Orchestration & Integration
- `js-backend-expert`: For Node/Bun/Deno backend implementations integrating these ORMs.
- `edge-serverless-db-expert`: For edge/serverless connections (e.g., Supabase, Neon, Turso).
- `database-migration-versioning-expert`: For advanced migration strategies and CI/CD pipelines.

---

### ORM Selection Guide

| Criteria | Prisma 6 | Drizzle ORM | TypeORM |
|---|---|---|---|
| **Type Safety** | Schema-generated types | SQL-like, inferred types | Decorator-based |
| **Bundle Size** | Heavy (binary client) | Lightweight (<35KB) | Medium |
| **Query Style** | Fluent ORM API | SQL-first, composable | ActiveRecord / QueryBuilder |
| **Edge Runtime** | Prisma Accelerate needed | Native edge support | No |
| **Migrations** | `prisma migrate dev` | `drizzle-kit push/migrate` | `synchronize` (dev only) |
| **Best For** | Rapid prototyping, teams | Production edge, monorepos | Legacy NestJS projects |

**Recommendation**: Use **Drizzle ORM** for edge-compatible apps and performance-critical systems. Use **Prisma 6** for teams that prefer a schema-first DX and rich Studio tooling.

---

### Prisma 6 — Best Practices

#### Schema Design
```prisma
// schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["relationJoins", "nativeDistinct"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // for Supabase Pooler
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  role      Role      @default(USER)
  posts     Post[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([email])
  @@map("users")
}

model Post {
  id          String   @id @default(cuid())
  title       String
  content     String?
  published   Boolean  @default(false)
  authorId    String
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  publishedAt DateTime?

  @@index([authorId, published])
  @@map("posts")
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}
```

#### Avoiding N+1 with `include` vs `select`
```typescript
// BAD: triggers N+1 queries
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } });
}

// GOOD: single query with JOIN (Prisma 5.7+ relationJoins preview)
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    _count: { select: { posts: true } },
    posts: {
      where: { published: true },
      select: { id: true, title: true },
      take: 5,
      orderBy: { publishedAt: 'desc' },
    },
  },
});
```

#### Optimistic Transactions
```typescript
// Use $transaction for atomic operations
const [updatedUser, newPost] = await prisma.$transaction([
  prisma.user.update({ where: { id }, data: { name } }),
  prisma.post.create({ data: { title, authorId: id } }),
]);

// Interactive transaction for complex logic
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUniqueOrThrow({ where: { id } });
  if (user.role !== 'ADMIN') throw new Error('Unauthorized');
  return tx.post.updateMany({ where: { authorId: id }, data: { published: true } });
});
```

---

### Drizzle ORM — Best Practices

#### Schema Definition (PostgreSQL)
```typescript
// src/db/schema.ts
import { pgTable, text, boolean, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['USER', 'ADMIN', 'SUPER_ADMIN']);

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: roleEnum('role').default('USER').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (t) => [
  index('users_email_idx').on(t.email),
]);

export const posts = pgTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  content: text('content'),
  published: boolean('published').default(false).notNull(),
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
}, (t) => [
  index('posts_author_published_idx').on(t.authorId, t.published),
]);

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
```

#### Type-safe Queries with Drizzle
```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

// Type-safe query with joins
import { eq, and, desc, count } from 'drizzle-orm';

const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: {
      where: eq(posts.published, true),
      orderBy: desc(posts.publishedAt),
      limit: 5,
    },
  },
  extras: {
    postCount: db.$count(posts, eq(posts.authorId, users.id)).as('post_count'),
  },
});

// Paginated query
async function getPaginatedPosts(page: number, pageSize = 20) {
  const offset = (page - 1) * pageSize;
  const [items, [{ total }]] = await Promise.all([
    db.select().from(posts).where(eq(posts.published, true))
      .orderBy(desc(posts.publishedAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ total: count() }).from(posts).where(eq(posts.published, true)),
  ]);
  return { items, total, pages: Math.ceil(total / pageSize) };
}
```

#### Drizzle Migration Workflow
```bash
# drizzle.config.ts defines connection + schema path
npx drizzle-kit generate   # generate migration SQL files
npx drizzle-kit migrate    # apply migrations to database
npx drizzle-kit push       # push schema directly (dev only)
npx drizzle-kit studio     # open Drizzle Studio GUI
```

---

### Query Optimization Principles

1. **Always index foreign keys** and columns used in `WHERE`, `ORDER BY`, and `JOIN`.
2. **Use `EXPLAIN ANALYZE`** to detect sequential scans and missing indexes.
3. **Cursor-based pagination** over offset for large datasets:
   ```typescript
   // Cursor pagination with Drizzle
   const items = await db.select().from(posts)
     .where(cursor ? lt(posts.createdAt, cursor) : undefined)
     .orderBy(desc(posts.createdAt))
     .limit(pageSize);
   ```
4. **Connection pooling**: Use PgBouncer or Supabase's built-in pooler. Set `DIRECT_URL` for migrations and `DATABASE_URL` for pooled reads/writes.
5. **Avoid `SELECT *`**: Always select only the columns you need.
6. **Batch inserts**: Use `db.insert(table).values([...items])` instead of looping.

---

### Migration Best Practices

- **Never use `synchronize: true`** in production (TypeORM).
- **Never run `prisma db push`** in production — always use `prisma migrate deploy`.
- Store migration files in version control.
- Run migrations as a separate step before deploying new app versions.
- Use **advisory locks** or migration tools to prevent concurrent migration runs.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Rancang skema, pilih ORM, eksekusi migrasi, optimalkan query, dan implementasikan pola SQL type-safe. Prioritaskan **Prisma 6** dan **Drizzle ORM**. Implementasikan connection pooling untuk beban kerja produksi.

### Kondisi Pemicu
- Merancang atau memigrasikan skema database.
- Memilih antara Prisma, Drizzle ORM, atau TypeORM.
- Menulis query kompleks dengan join, agregasi, atau paginasi.
- Mengoptimalkan query lambat atau masalah N+1.
- Menyiapkan migrasi database dalam pipeline CI/CD.
- Mengimplementasikan pola Row Level Security (RLS).
- Bekerja dengan PostgreSQL, MySQL, SQLite, atau PlanetScale.

## Integrasi Orkestrasi
- `js-backend-expert`: Untuk implementasi backend Node/Bun/Deno yang menggunakan ORM ini.
- `edge-serverless-db-expert`: Untuk koneksi edge/serverless (mis. Supabase, Neon, Turso).
- `database-migration-versioning-expert`: Untuk strategi migrasi lanjutan dan pipeline CI/CD.

### Panduan Pemilihan ORM

Gunakan tabel di atas (lihat bagian English) sebagai referensi pemilihan ORM. Rekomendasi singkat:
- **Drizzle ORM**: Untuk aplikasi edge-compatible dan sistem kritis performa.
- **Prisma 6**: Untuk tim yang lebih menyukai DX schema-first dan tooling Studio yang kaya.
- **TypeORM**: Hanya untuk proyek lama (legacy) berbasis NestJS.

### Prinsip Utama

1. **Selalu index foreign key** dan kolom yang digunakan di `WHERE`, `ORDER BY`, dan `JOIN`.
2. **Gunakan `EXPLAIN ANALYZE`** untuk mendeteksi sequential scan dan index yang hilang.
3. **Cursor-based pagination** lebih baik dari offset untuk dataset besar.
4. **Connection pooling**: Gunakan PgBouncer atau Supabase pooler bawaan.
5. **Hindari `SELECT *`**: Selalu pilih hanya kolom yang dibutuhkan.
6. **Batch insert**: Gunakan insert massal, bukan looping satu per satu.

### Prinsip Migrasi

- Jangan gunakan `synchronize: true` di produksi (TypeORM).
- Jangan jalankan `prisma db push` di produksi — selalu gunakan `prisma migrate deploy`.
- Simpan file migrasi di version control.
- Jalankan migrasi sebagai langkah terpisah sebelum deploy versi aplikasi baru.
