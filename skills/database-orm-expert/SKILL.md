---
name: database-orm-expert
description: "Updated to be the unified database skill covering ORM, migrations, edge DBs, and Supabase CLI / Keahlian database terpadu untuk ORM, migrasi, edge DB, dan Supabase CLI."
author: "Roedy Rustam"
version: "4.4.2"

---

# Unified Database & ORM Expert (2026 Production Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **Backend & Runtimes**: `js-backend-expert`, `python-programming-expert`, `go-programming-expert`, and `rust-programming-expert` for integrating Drizzle ORM, Prisma 6, SQLx, and SQLAlchemy/SQLModel.
- **FinTech & SaaS**: `saas-billing`, `saas-multi-tenant`, `double-entry-ledger-fintech-expert`, and `doku-payment-gateway` for strict atomic database transactions (`SELECT ... FOR UPDATE`), distributed locks, tenant isolation via RLS, and SNAP BI idempotent records.
- **AI & Vectors**: `vector-db-rag-expert` for pgvector 0.8+ HNSW indexing and high-dimensional cosine similarity embeddings.
- **Security & Cloud**: `supabase-security-expert`, `fga-rebac-authorization-expert`, `ci-cd-devops-architect`, and `cloud-hosting-expert` for automated migration pipelines, blue-green deployments, and pooler infrastructure.
- **Master Orchestrators**: `brainstorming` and `zero-to-prod-orchestrator` (Phase 3: Schema & Database Architecture).

### Description
Production-grade guide for relational schema design, ORM selection, zero-downtime Expand-and-Contract migrations, pessimistic concurrency locking, query optimization, and edge serverless database drivers. Covers **Drizzle ORM v0.39+**, **Prisma 6 (TypedSQL & Relation Joins)**, **Supabase CLI**, and Edge Databases (**Neon Serverless Postgres**, **Cloudflare D1**, **Turso libSQL**, **Upstash Redis**).

### Trigger Conditions
- Designing or migrating a production schema (blue-green, Expand-and-Contract).
- Choosing between Drizzle ORM, Prisma 6, Kysely, or SQLx.
- Writing complex queries with joins, cursor pagination, or atomic row locks.
- Optimizing slow queries, missing FK indexes, or N+1 problems.
- Building edge-compatible serverless database connections (HTTP/WebSocket poolers).
- Executing Supabase CLI migrations and Row-Level Security (RLS) policies.

---

### Core ORM & Query Strategies

#### ORM Selection Matrix (2026)
| Criteria | Drizzle ORM (v0.39+) | Prisma 6 | Kysely |
| :--- | :--- | :--- | :--- |
| **Type Safety** | SQL-first, zero-codegen TypeScript inference | Schema-first (`schema.prisma`) + TypedSQL | Pure type-safe SQL query builder |
| **Cold Start & Bundle** | Ultra-lightweight (<35KB, zero binary) | Wasm/Rust query compiler (~1.5MB) | Minimal (<20KB) |
| **Relational Queries** | `db.query.table.findMany({ with })` (Single SQL join) | `relationLoadStrategy: "join"` | Explicit `.innerJoin()` |
| **Edge Runtime** | Native (Cloudflare Workers, Vercel Edge, Bun) | Native via `@prisma/adapter-neon` / D1 | Native |
| **Migrations** | `drizzle-kit generate` & `drizzle-kit migrate` | `prisma migrate dev` / `deploy` | Custom migration runner |

**Recommendation**: Prefer **Drizzle ORM** for edge-first apps, Hono/Bun backends, and performance-critical systems. Choose **Prisma 6** for teams preferring declarative `.prisma` modeling and TypedSQL.

---

#### 1. Drizzle ORM v0.39+ Production Schema & Atomic Locking
Always index foreign keys explicitly, enforce `TIMESTAMPTZ`, and use `FOR UPDATE` row locks on financial or inventory mutations.

```typescript
// src/db/schema.ts
import { pgTable, uuid, varchar, bigint, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 64 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  uniqueIndex('idx_tenants_slug').on(t.slug),
]);

export const wallets = pgTable('wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'restrict' }),
  currency: varchar('currency', { length: 3 }).notNull().default('IDR'),
  balanceMinor: bigint('balance_minor', { mode: 'bigint' }).notNull().default(0n),
  version: bigint('version', { mode: 'number' }).notNull().default(1),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_wallets_tenant_id').on(t.tenantId),
]);

export const paymentIdempotency = pgTable('payment_idempotency', {
  idempotencyKey: varchar('idempotency_key', { length: 128 }).primaryKey(),
  walletId: uuid('wallet_id').notNull().references(() => wallets.id, { onDelete: 'cascade' }),
  amountMinor: bigint('amount_minor', { mode: 'bigint' }).notNull(),
  status: varchar('status', { length: 24 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_payment_idempotency_wallet').on(t.walletId),
]);

export const walletsRelations = relations(wallets, ({ one }) => ({
  tenant: one(tenants, { fields: [wallets.tenantId], references: [tenants.id] }),
}));
```

```typescript
// src/db/mutations/debit-wallet.ts
import { eq, sql } from 'drizzle-orm';
import { db } from '../client';
import { wallets, paymentIdempotency } from '../schema';

export async function debitWalletAtomic(input: {
  walletId: string;
  amountMinor: bigint;
  idempotencyKey: string;
}) {
  if (input.amountMinor <= 0n) {
    throw new Error('Debit amount must be strictly positive');
  }

  return await db.transaction(async (tx) => {
    // 1. Check idempotency key first
    const [existing] = await tx
      .select()
      .from(paymentIdempotency)
      .where(eq(paymentIdempotency.idempotencyKey, input.idempotencyKey))
      .limit(1);

    if (existing) {
      return { status: 'ALREADY_PROCESSED' as const, record: existing };
    }

    // 2. Acquire pessimistic row-level lock (SELECT ... FOR UPDATE)
    const [wallet] = await tx
      .select()
      .from(wallets)
      .where(eq(wallets.id, input.walletId))
      .for('update');

    if (!wallet) {
      throw new Error(`Wallet ${input.walletId} not found`);
    }
    if (wallet.balanceMinor < input.amountMinor) {
      throw new Error('Insufficient wallet balance');
    }

    // 3. Deduct balance and increment optimistic version
    const [updatedWallet] = await tx
      .update(wallets)
      .set({
        balanceMinor: sql`${wallets.balanceMinor} - ${input.amountMinor}`,
        version: sql`${wallets.version} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, input.walletId))
      .returning();

    // 4. Record idempotency lock in same transaction
    const [record] = await tx
      .insert(paymentIdempotency)
      .values({
        idempotencyKey: input.idempotencyKey,
        walletId: input.walletId,
        amountMinor: input.amountMinor,
        status: 'COMPLETED',
      })
      .returning();

    return { status: 'COMPLETED' as const, wallet: updatedWallet, record };
  }, {
    isolationLevel: 'read committed',
  });
}
```

---

#### 2. Keyset (Cursor) Pagination Pattern
Never use `OFFSET` on tables exceeding 50,000 rows (`OFFSET 100000` forces Postgres to scan and discard 100,000 rows). Always use composite `(createdAt, id)` keyset cursors:

```typescript
import { and, desc, eq, lt, or } from 'drizzle-orm';
import { db } from './client';
import { wallets } from './schema';

export async function listWalletsCursor(params: {
  tenantId: string;
  limit?: number;
  cursor?: { updatedAt: Date; id: string };
}) {
  const limit = Math.min(params.limit ?? 25, 100);

  const cursorFilter = params.cursor
    ? or(
        lt(wallets.updatedAt, params.cursor.updatedAt),
        and(eq(wallets.updatedAt, params.cursor.updatedAt), lt(wallets.id, params.cursor.id))
      )
    : undefined;

  const rows = await db
    .select()
    .from(wallets)
    .where(and(eq(wallets.tenantId, params.tenantId), cursorFilter))
    .orderBy(desc(wallets.updatedAt), desc(wallets.id))
    .limit(limit + 1);

  const hasNextPage = rows.length > limit;
  const items = hasNextPage ? rows.slice(0, limit) : rows;
  const lastItem = items[items.length - 1];

  return {
    items,
    nextCursor: hasNextPage && lastItem
      ? { updatedAt: lastItem.updatedAt, id: lastItem.id }
      : null,
  };
}
```

---

### Zero-Downtime Migrations (Expand and Contract Protocol)

Never execute breaking DDL changes (`DROP COLUMN`, `RENAME COLUMN`, or locking `ALTER TABLE ... ADD COLUMN ... NOT NULL` without default) in a single release while old application containers are still serving traffic.

1. **Phase 1 (Expand)**: Add nullable column or new table; create indexes using `CREATE INDEX CONCURRENTLY` to avoid blocking writes.
2. **Phase 2 (Dual-Write)**: Update application code to write to both old and new columns; read from old with fallback.
3. **Phase 3 (Chunked Backfill)**: Backfill historical rows in small batches (`LIMIT 2000`) with `FOR UPDATE SKIP LOCKED` to avoid replication lag and table locks.
4. **Phase 4 (Cutover Read & Contract)**: Switch reads to the new column, remove dual-write code, and validate constraints using `NOT VALID` followed by `VALIDATE CONSTRAINT`.

```sql
-- Safe Zero-Lock Constraint & Concurrent Index Migration
ALTER TABLE wallets ADD COLUMN IF NOT EXISTS ledger_account_id UUID;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallets_ledger_account_id
  ON wallets (ledger_account_id);

-- Add foreign key without locking existing writes (Postgres 14+)
ALTER TABLE wallets
  ADD CONSTRAINT fk_wallets_ledger_account
  FOREIGN KEY (ledger_account_id) REFERENCES accounts(id) NOT VALID;

-- Validate constraint using ShareUpdateExclusiveLock (does not block reads/writes)
ALTER TABLE wallets VALIDATE CONSTRAINT fk_wallets_ledger_account;
```

---

### Edge & Serverless Drivers + Cache-Aside

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { Redis } from '@upstash/redis';
import * as schema from './schema';

const sqlClient = neon(process.env.DATABASE_URL!);
export const edgeDb = drizzle(sqlClient, { schema });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getTenantCached(slug: string) {
  const cacheKey = `tenant:v1:${slug}`;
  const cached = await redis.get<typeof schema.tenants.$inferSelect>(cacheKey);
  if (cached) return cached;

  const tenant = await edgeDb.query.tenants.findFirst({
    where: (t, { eq }) => eq(t.slug, slug),
  });

  if (tenant) {
    await redis.set(cacheKey, tenant, { ex: 900 });
  }
  return tenant ?? null;
}
```

---

### Verification Checklist
- [ ] Every foreign key column has a corresponding B-Tree index (`idx_<table>_<fk>`).
- [ ] Financial balances and monetary quantities use `BIGINT` minor units (cents/sen) or `NUMERIC(19,4)`, never `FLOAT`/`REAL`.
- [ ] Multi-tenant tables enforce Row-Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) and tenant ID predicates.
- [ ] Production migrations never run `prisma db push` or `drizzle-kit push`; versioned SQL files are audited via `vibes db:eval`.
- [ ] High-concurrency state transitions use `SELECT ... FOR UPDATE` or optimistic version increments.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **Backend & Runtime**: `js-backend-expert`, `python-programming-expert`, `go-programming-expert`, dan `rust-programming-expert` untuk integrasi Drizzle ORM, Prisma 6, SQLx, dan SQLAlchemy/SQLModel.
- **FinTech & SaaS**: `saas-billing`, `saas-multi-tenant`, `double-entry-ledger-fintech-expert`, dan `doku-payment-gateway` untuk transaksi database atomik yang ketat (`SELECT ... FOR UPDATE`), distributed lock, isolasi tenant via RLS, dan pencatatan idempoten SNAP BI.
- **AI & Vektor**: `vector-db-rag-expert` untuk pengindeksan pgvector 0.8+ HNSW dan pencarian embedding kesamaan kosinus dimensi tinggi.
- **Keamanan & Cloud**: `supabase-security-expert`, `fga-rebac-authorization-expert`, `ci-cd-devops-architect`, dan `cloud-hosting-expert` untuk pipeline deployment migrasi otomatis, blue-green, dan infrastruktur connection pooler.
- **Orkestrator Utama**: `brainstorming` dan `zero-to-prod-orchestrator` (Fase 3: Arsitektur Skema & Database).

### Deskripsi
Panduan kelas produksi untuk perancangan skema relasional, pemilihan ORM, migrasi tanpa downtime (*Expand-and-Contract*), penguncian konkurensi pesimistis, optimasi query, dan driver database serverless edge (**Drizzle ORM v0.39+**, **Prisma 6**, **Supabase CLI**, **Neon**, **Cloudflare D1**, **Turso**, **Upstash**).

### Strategi Inti ORM & Query
1. **Drizzle ORM** direkomendasikan untuk aplikasi edge dan performa tinggi (<35KB, tanpa biner), sedangkan **Prisma 6** untuk alur deklaratif `schema.prisma` dan TypedSQL.
2. **Indeks Foreign Key**: Selalu buat indeks eksplisit pada setiap kolom foreign key dan kolom filter `WHERE` / `ORDER BY`.
3. **Keyset (Cursor) Pagination**: Gunakan kursor komposit `(updated_at, id)` dan hindari `OFFSET` pada tabel skala besar.
4. **Transaksi & Kunci Baris Atomik**: Gunakan `SELECT ... FOR UPDATE` di dalam transaksi database untuk mencegah kondisi balapan (*race condition*) pada pemotongan saldo atau stok.

### Migrasi Tanpa Downtime (Expand and Contract)
- **Fase 1 (Expand)**: Tambahkan kolom baru bersifat *nullable* dan gunakan `CREATE INDEX CONCURRENTLY`.
- **Fase 2 (Dual-Write)**: Tulis ke kolom lama dan baru secara bersamaan.
- **Fase 3 (Chunked Backfill)**: Lakukan *backfill* data secara bertahap (`LIMIT 2000`) menggunakan antrean latar belakang.
- **Fase 4 (Contract)**: Pindahkan pembacaan ke kolom baru, validasi *constraint* dengan `NOT VALID` + `VALIDATE CONSTRAINT`, lalu hapus kode lama.

### Daftar Periksa Verifikasi (Checklist)
- [ ] Setiap kolom foreign key memiliki indeks B-Tree eksplisit.
- [ ] Nilai uang/saldo menggunakan `BIGINT` satuan terkecil (sen/rupiah utuh) atau `NUMERIC(19,4)`, bukan `FLOAT`.
- [ ] Tabel multi-tenant mengaktifkan Row-Level Security (RLS).
- [ ] Migrasi produksi menggunakan file SQL terversi dan diuji dengan `vibes db:eval`.
