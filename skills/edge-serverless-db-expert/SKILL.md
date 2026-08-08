---
name: edge-serverless-db-expert
description: "Expert guide for Serverless & Edge Databases (Neon Serverless Postgres, Cloudflare D1, Turso/libsql, Upstash Redis), cold-start mitigation, and connection pooling / Panduan ahli database Serverless & Edge (Neon, Cloudflare D1, Turso, Upstash)."
author: "Roedy Rustam"
---

# Edge & Serverless DB Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Best practices for building ultra-low-latency applications powered by serverless and edge databases — Neon Serverless Postgres, Cloudflare D1 (SQLite at Edge), Turso (libsql distributed SQLite), Upstash Serverless Redis & Vector, HTTP connection pooling via Hyperdrive/Prisma Accelerate, and zero-cold-start strategies.

### Key Capabilities
- **Neon & Cloudflare D1**: Serverless autoscaling Postgres with instant branching and distributed edge SQLite.
- **Connection Pooling**: WebSocket/HTTP proxy pooling (Neon Serverless Driver, Upstash Redis over HTTP) for edge workers without TCP pool exhaustion.
- **Embedded Replicas**: Syncing edge SQLite read-replicas with central cloud databases for sub-10ms queries.

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Praktik terbaik membangun aplikasi latensi rendah dengan database serverless dan edge — Neon Serverless Postgres, Cloudflare D1 (SQLite di Edge), Turso (libsql terdistribusi), Upstash Serverless Redis & Vector, connection pooling HTTP/WebSocket, dan mitigasi cold-start.

### Fitur Utama
- **Neon & Cloudflare D1**: Serverless Postgres autoscaling dengan branching instan dan distributed edge SQLite.
- **Connection Pooling**: Proxy pooling HTTP/WebSocket untuk edge worker tanpa risiko kehabisan koneksi TCP.
- **Embedded Replicas**: Sinkronisasi read-replica SQLite di edge dengan database utama untuk query di bawah 10ms.
