---
name: bun-runtime-expert
description: "Bun 1.2+ runtime: native Bun.sql, Bun.s3, multi-core HTTP, bun:test / Runtime Bun 1.2+: native Bun.sql, Bun.s3, HTTP multi-core, bun:test."
author: "Roedy Rustam"
version: "4.4.2"

---

# Bun 1.2+ Runtime Expert (2026 High-Performance Standard)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **Backend & APIs**: `js-backend-expert` (Hono on Bun, Fastify/Express migration), `api-design-expert` (REST & WebSocket contracts), and `sse-websocket-streaming-expert` (native `Bun.serve` WebSockets).
- **Database & Storage**: `database-orm-expert` (Drizzle ORM with native `bun:sql`, PostgreSQL/SQLite) and `file-upload-media-expert` (zero-dependency `Bun.s3` client).
- **Quality & Testing**: `autonomous-tdd-debugger`, `e2e-testing-expert`, and `anti-slop` for executing high-speed `bun test` suites with snapshot matching.
- **Orchestration**: `brainstorming` and `zero-to-prod-orchestrator` (Phase 4: Backend & APIs).

### Description
Expert-level guidance for engineering ultra-low-latency backend microservices with **Bun 1.2+**. Covers the native PostgreSQL driver (`import { SQL } from 'bun'`), native S3 object storage (`Bun.s3`), git-friendly text lockfiles (`bun.lock`), multi-core HTTP clustering via `reusePort`, built-in SQLite, and high-speed Jest-compatible unit testing via `bun:test`.

### Trigger Conditions
- Scaffolding new high-performance microservices, REST APIs, or WebSocket hubs using Bun.
- Querying PostgreSQL or SQLite without external drivers using native `Bun.sql`.
- Interacting with Amazon S3, Cloudflare R2, or MinIO using zero-dependency `Bun.s3`.
- Running multi-core HTTP services with automatic load distribution across CPU cores.
- Executing unit and integration tests using `bun test`.
- Migrating legacy Node.js/npm codebases to Bun's native execution layer.

---

### Bun 1.2+ Core Architectural Features

#### 1. Native PostgreSQL Client (`import { SQL } from 'bun'`)
Bun 1.2 includes a built-in, high-speed PostgreSQL driver that communicates directly via binary wire protocol without `pg` or `postgres.js`:
```typescript
// src/lib/db.ts
import { SQL } from 'bun';

// Instantiate pooled database client
export const sql = new SQL({
  url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/production_db',
  max: 20, // Connection pool size
  idleTimeout: 30, // Max idle time in seconds
});

export interface UserAccount {
  id: string;
  email: string;
  balance: number;
}

// 1. Tagged template query with automatic parameterized SQL injection defense
export async function getActiveUser(email: string): Promise<UserAccount | null> {
  const users = await sql<UserAccount[]>`
    SELECT id, email, balance 
    FROM users 
    WHERE email = ${email} AND active = true 
    LIMIT 1
  `;
  return users[0] ?? null;
}

// 2. Atomic Database Transaction
export async function transferFunds(fromUserId: string, toUserId: string, amount: number) {
  return await sql.begin(async (tx) => {
    const debit = await tx`
      UPDATE users 
      SET balance = balance - ${amount} 
      WHERE id = ${fromUserId} AND balance >= ${amount} 
      RETURNING id, balance
    `;

    if (debit.length === 0) {
      throw new Error('Insufficient funds or sender not found');
    }

    await tx`
      UPDATE users 
      SET balance = balance + ${amount} 
      WHERE id = ${toUserId}
    `;

    return { success: true };
  });
}
```

#### 2. Native Object Storage (`Bun.s3`)
Interact with AWS S3, Cloudflare R2, or MinIO with zero external SDK dependencies:
```typescript
// src/lib/storage.ts
import { s3 } from 'bun';

// Configure credentials once or let Bun auto-detect AWS_* environment variables
s3.credentials({
  accessKeyId: process.env.S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  bucket: process.env.S3_BUCKET_NAME!,
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT, // e.g. https://<account_id>.r2.cloudflarestorage.com
});

// Upload file directly from memory buffer
export async function uploadInvoicePdf(invoiceId: string, pdfBuffer: Buffer): Promise<string> {
  const fileKey = `invoices/${invoiceId}.pdf`;
  await s3.write(fileKey, pdfBuffer, {
    type: 'application/pdf',
  });
  return fileKey;
}

// Generate presigned upload URL for direct browser uploads
export function getDirectUploadUrl(fileName: string): string {
  return s3.presign(`uploads/${fileName}`, {
    method: 'PUT',
    expiresIn: 300, // 5 minutes
  });
}
```

#### 3. Multi-Core HTTP Clustering with `Bun.serve()`
Scale HTTP throughput across all CPU cores on a single host with `reusePort: true`:
```typescript
// src/server.ts
import { serve } from 'bun';

const server = serve({
  port: Number(process.env.PORT) || 3000,
  reusePort: true, // Enables SO_REUSEPORT: spawn multiple instances to scale across cores
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === '/health') {
      return Response.json({
        status: 'healthy',
        pid: process.pid,
        timestamp: new Date().toISOString(),
      });
    }

    return new Response('Not Found', { status: 404 });
  },
  error(error) {
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  },
});

console.log(`Worker process ${process.pid} listening on port ${server.port}`);
```

#### 4. Human-Readable Text Lockfile (`bun.lock`)
In Bun 1.2+, the default lockfile format is a plain text `bun.lock` file (replacing binary `bun.lockb`):
- **Git-Friendly**: Clean line-by-line diffs in Pull Requests.
- **Merge-Conflict Resilient**: Standard git conflict resolution tools work seamlessly.
- **Auditable**: Dependencies and integrity hashes can be inspected with standard CLI tools (`cat`, `grep`).

#### 5. Fast Testing with `bun:test`
Jest/Vitest compatible test suite running natively on JavaScriptCore:
```typescript
// test/user.test.ts
import { describe, expect, it, beforeEach } from 'bun:test';
import { getActiveUser, sql } from '../src/lib/db';

describe('User Database Service', () => {
  beforeEach(async () => {
    await sql`TRUNCATE TABLE users CASCADE`;
    await sql`INSERT INTO users (id, email, balance, active) VALUES ('usr-1', 'test@example.com', 100.0, true)`;
  });

  it('retrieves active user by email', async () => {
    const user = await getActiveUser('test@example.com');
    expect(user).not.toBeNull();
    expect(user?.email).toBe('test@example.com');
    expect(user?.balance).toBe(100.0);
  });

  it('returns null for inactive or missing user', async () => {
    const missing = await getActiveUser('missing@example.com');
    expect(missing).toBeNull();
  });
});
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec bun-runtime-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **Backend & API**: `js-backend-expert` (Hono di atas Bun, migrasi Fastify/Express), `api-design-expert` (kontrak REST & WebSocket), dan `sse-websocket-streaming-expert` (WebSocket native `Bun.serve`).
- **Database & Penyimpanan**: `database-orm-expert` (Drizzle ORM dengan native `bun:sql`, PostgreSQL/SQLite) dan `file-upload-media-expert` (klien object storage `Bun.s3` zero-dependency).
- **Kualitas & Pengujian**: `autonomous-tdd-debugger`, `e2e-testing-expert`, dan `anti-slop` untuk eksekusi test runner `bun test` berkecepatan tinggi dengan pencocokan snapshot.
- **Orkestrator Utama**: `brainstorming` dan `zero-to-prod-orchestrator` (Fase 4: Backend & APIs).

### Deskripsi
Panduan tingkat ahli untuk rekayasa microservices backend berlatensi ultra-rendah menggunakan **Bun 1.2+**. Mencakup driver PostgreSQL native (`import { SQL } from 'bun'`), penyimpanan objek native S3 (`Bun.s3`), format lockfile teks yang ramah git (`bun.lock`), clustering HTTP multi-core melalui `reusePort`, SQLite bawaan, dan pengujian unit kompatibel Jest via `bun:test`.

### Kondisi Pemicu
- Merancang microservices baru, REST API, atau hub WebSocket berkecepatan tinggi dengan Bun.
- Melakukan query database PostgreSQL atau SQLite tanpa library eksternal menggunakan `Bun.sql`.
- Berinteraksi dengan AWS S3, Cloudflare R2, atau MinIO tanpa dependensi AWS SDK via `Bun.s3`.
- Menjalankan layanan HTTP multi-core dengan pembagian beban otomatis di semua core CPU.
- Menjalankan pengujian unit dan integrasi berkecepatan tinggi menggunakan `bun test`.

---

### Fitur Arsitektur Inti Bun 1.2+

#### 1. Klien PostgreSQL Native (`import { SQL } from 'bun'`)
Bun 1.2 menyertakan driver PostgreSQL berkecepatan tinggi yang berkomunikasi langsung melalui protokol biner tanpa overhead library pihak ketiga:
```typescript
import { SQL } from 'bun';

export const sql = new SQL({
  url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/db_produksi',
  max: 20,
});

// Query aman terhadap SQL Injection melalui tagged template literals
export async function cariPenggunaAktif(email: string) {
  const pengguna = await sql`
    SELECT id, email, balance 
    FROM users 
    WHERE email = ${email} AND active = true 
    LIMIT 1
  `;
  return pengguna[0] ?? null;
}
```

#### 2. Klien Object Storage Native (`Bun.s3`)
Unggah dan kelola file di S3 atau Cloudflare R2 secara native:
```typescript
import { s3 } from 'bun';

// Unggah buffer file dokumen langsung
export async function simpanFaktur(fakturId: string, pdfBuffer: Buffer) {
  const namaFile = `faktur/${fakturId}.pdf`;
  await s3.write(namaFile, pdfBuffer, { type: 'application/pdf' });
  return namaFile;
}

// Buat URL presigned untuk upload langsung dari browser klien
export function buatUrlUploadLangsung(namaFile: string) {
  return s3.presign(`unggah/${namaFile}`, {
    method: 'PUT',
    expiresIn: 300,
  });
}
```

#### 3. Clustering HTTP Multi-Core dengan `Bun.serve()`
```typescript
import { serve } from 'bun';

const server = serve({
  port: Number(process.env.PORT) || 3000,
  reusePort: true, // Memungkinkan beberapa proses Bun berjalan di port yang sama lintas CPU cores
  async fetch(req) {
    return Response.json({
      status: 'aktif',
      pid: process.pid,
      waktu: new Date().toISOString(),
    });
  },
});
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec bun-runtime-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
