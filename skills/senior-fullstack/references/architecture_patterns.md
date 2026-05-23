# Architecture Patterns

## Overview
This reference guide details high-performance architecture patterns for senior fullstack systems. It covers multi-tier caching (Redis), relational database partitioning, and resilient event-driven background queues.

---

## Production Architecture Designs

### 1. Multi-Tier Caching Layer (Redis + Memory)

For write-heavy/read-intensive endpoints (e.g., public API stats or product catalogs), hitting the relational database directly is a major bottleneck. Implement a Cache-Aside pattern using memory-first or Redis structures.

#### Pattern: Type-Safe Cache-Aside Implementation (`lib/cache/redis.ts`)

```typescript
import { Redis } from '@upstash/redis'; // or ioredis

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface CacheOptions {
  ttlSeconds?: number;
}

export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const ttl = options.ttlSeconds ?? 3600; // Default: 1 hour

  try {
    // Attempt cache read
    const cachedData = await redis.get<string>(key);
    if (cachedData) {
      return typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    }
  } catch (err) {
    console.error(`⚠️ Redis read failed for key ${key}:`, err);
  }

  // Cache miss - execute database hit
  const freshData = await fetchFn();

  try {
    // Populate cache asynchronously
    await redis.set(key, JSON.stringify(freshData), { ex: ttl });
  } catch (err) {
    console.error(`⚠️ Redis write failed for key ${key}:`, err);
  }

  return freshData;
}
```

---

### 2. High-Performance Indexing and Query Tuning

Poor database performance is almost always caused by missing indexes on fields targeted by `WHERE` and `JOIN` clauses. Use standard PostgreSQL compound indexes and profile execution paths.

#### Pattern: Compound & Partial Indexing (`prisma/schema.prisma` or pure SQL)

```prisma
// Example Prisma compound index optimized for scoped tenant querying
model Invoice {
  id          String   @id @default(cuid())
  tenantId    String
  status      String   // PAID, UNPAID, OVERDUE
  amount      Float
  createdAt   DateTime @default(now())

  // Optimize compound filters: WHERE tenantId = X AND status = Y ORDER BY createdAt DESC
  @@index([tenantId, status, createdAt(sort: Desc)])
}
```

#### Profiling Queries with PostgreSQL `EXPLAIN ANALYZE`

Run the following SQL diagnostic query inside your migration console to detect costly Sequential Scans (Seq Scan):

```sql
EXPLAIN ANALYZE 
SELECT * FROM "Invoice" 
WHERE "tenantId" = 'tenant_123' 
  AND "status" = 'PAID' 
ORDER BY "createdAt" DESC;
```

*Look for:* `Index Scan using Invoice_tenantId_status_createdAt_idx` indicating the optimizer is executing query lookup paths with O(log N) complexity instead of O(N).

---

### 3. Resilient Webhooks & Resilient Background Workers

Handling computationally heavy tasks (e.g., PDF generation, batch emails, image processing) in the standard request/response HTTP loop leads to poor UI performance and timeout failures. Decouple execution paths with background job queues (e.g., BullMQ, Inngest, or Celery).

#### Pattern: Event-Driven Queue Producer (`lib/queue/jobs.ts`)

```typescript
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL!);

// 1. Establish the queue
export const emailQueue = new Queue('EmailQueue', { connection });

export async function queueWelcomeEmail(userId: string, email: string) {
  await emailQueue.add(
    'send_welcome',
    { userId, email },
    {
      attempts: 5, // High retry resilience
      backoff: {
        type: 'exponential',
        delay: 5000, // Exponential backoff starting at 5s
      },
    }
  );
}
```

#### Pattern: Decoupled Queue Worker (`workers/email.ts`)

```typescript
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { sendWelcomeEmail } from '@/lib/email';

const connection = new IORedis(process.env.REDIS_URL!);

// Decoupled consumer execution running in a separate thread/container
const emailWorker = new Worker(
  'EmailQueue',
  async (job: Job) => {
    if (job.name === 'send_welcome') {
      const { email, userId } = job.data;
      await sendWelcomeEmail(email, userId);
    }
  },
  { connection, concurrency: 10 }
);

emailWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});
```

---

## Technical Summary
Decoupling application layers using structured micro-tier architectures—caching, indexes, and background workers—prevents cascading performance issues, guarantees high availability, and maintains scalable SaaS responses.
