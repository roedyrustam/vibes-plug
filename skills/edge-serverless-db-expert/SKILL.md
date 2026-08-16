---
name: edge-serverless-db-expert
description: "Expert guide for Serverless & Edge Databases (Neon Serverless Postgres, Cloudflare D1, Turso/libsql, Upstash Redis), cold-start mitigation, and connection pooling / Panduan ahli database Serverless & Edge (Neon, Cloudflare D1, Turso, Upstash)."
author: "vibes-plug-swarm"
---

# Edge & Serverless DB Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Best practices for building ultra-low-latency 2026/2027 applications powered by serverless and edge databases. Exploit Neon Serverless Postgres, Cloudflare D1, Turso, Upstash Serverless Redis & Vector. Implement zero-cold-start strategies and HTTP connection pooling.

### Key Capabilities
- **Neon & Cloudflare D1**: Serverless autoscaling Postgres with instant branching. Distributed edge SQLite.
- **Connection Pooling**: WebSocket/HTTP proxy pooling (Neon Serverless Driver, Upstash Redis over HTTP) for edge workers. Prevent TCP pool exhaustion.
- **Embedded Replicas**: Sync edge SQLite read-replicas with central cloud databases for sub-10ms queries.

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

### Implementation Checklist
- [ ] Use HTTP/WebSocket drivers (e.g., `neon-http`) for querying databases from Edge Workers/Functions.
- [ ] Configure connection pooling (PgBouncer, Prisma Accelerate) for standard TCP connections to avoid exhausting database connection limits.
- [ ] Use read-replicas near the edge location for global deployments to minimize latency.
- [ ] Cache read-heavy queries at the edge using Upstash Redis or Cloudflare KV.

### Example: Upstash Redis Edge Caching
```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCachedData(key: string) {
  let data = await redis.get(key);
  if (!data) {
    data = await fetchFromDB();
    await redis.set(key, data, { ex: 3600 }); // Cache for 1 hour
  }
  return data;
}
```

## Orchestration & Integration
- Integrates with: `database-orm-expert`, `js-backend-expert`, `cloud-hosting-expert`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Praktik terbaik membangun aplikasi latensi rendah 2026/2027 dengan database serverless dan edge. Manfaatkan Neon Serverless Postgres, Cloudflare D1, Turso, Upstash Serverless Redis & Vector. Implementasi strategi tanpa cold-start dan connection pooling HTTP.

### Fitur Utama
- **Neon & Cloudflare D1**: Serverless Postgres autoscaling dengan branching instan. Distributed edge SQLite.
- **Connection Pooling**: Proxy pooling HTTP/WebSocket untuk edge worker. Cegah kehabisan koneksi TCP.
- **Embedded Replicas**: Sinkronisasi read-replica SQLite di edge dengan database utama untuk query di bawah 10ms.

### Checklist Implementasi
- [ ] Gunakan driver HTTP/WebSocket (misal: `neon-http`) untuk mengakses database dari Edge Workers/Functions.
- [ ] Konfigurasi connection pooling (PgBouncer, Prisma Accelerate) pada koneksi TCP standar untuk mencegah batas koneksi habis.
- [ ] Gunakan read-replicas di dekat lokasi edge untuk deployment global guna meminimalkan latensi.
- [ ] Cache query berat di edge menggunakan Upstash Redis atau Cloudflare KV.

### Contoh: Upstash Redis Edge Caching
```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCachedData(key: string) {
  let data = await redis.get(key);
  if (!data) {
    data = await fetchFromDB();
    await redis.set(key, data, { ex: 3600 }); // Cache 1 jam
  }
  return data;
}
```

## Integrasi Orkestrasi
- Terintegrasi dengan: `database-orm-expert`, `js-backend-expert`, `cloud-hosting-expert`.
