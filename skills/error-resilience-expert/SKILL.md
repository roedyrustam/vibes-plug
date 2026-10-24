---
name: error-resilience-expert
description: "Expert guide for error handling patterns, resilience engineering, retry strategies, circuit breakers, and graceful degradation across React, Next.js, and Node.js / Panduan ahli pola penanganan error, rekayasa ketahanan, strategi retry, circuit breaker, dan degradasi anggun di React, Next.js, dan Node.js."
author: "Roedy Rustam"
version: "4.4.2"

---

# Error & Resilience Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 6 - Production Hardening & Resilience) to ensure fault-tolerant application architectures.
- **Downstream Cooperating Skills**:
  - `logging-error-tracking-expert` — Sentry/BugSnag integration and structured error logging.
  - `data-telemetry-expert` — Feed error rates and latency anomalies into circuit breakers.
  - `js-backend-expert` — API middleware error handling and RFC 9457 Problem Details formatting.
  - `senior-frontend` — React 19 Error Boundaries, suspense fallbacks, and resilient UI states.
  - `database-orm-expert` — Transaction retry strategies, deadlocks, and rollback policies.
  - `async-queue-temporal-expert` — Dead letter queues, retry backoffs, and durable saga recovery.
  - `production-ready-hardener` — Pre-launch failure mode verification and chaos testing.
  - `session-memory-manager` — Persist failure recovery logs and resilient state checkpoints.

### Description
Production-grade guide for building resilient applications that fail gracefully, recover automatically, and provide actionable error feedback to users and developers. Covers **React Error Boundaries**, **Next.js error handling** (`error.tsx`, `global-error.tsx`, `not-found.tsx`), **API error response standards** (RFC 9457 Problem Details), **retry patterns** with exponential backoff, **circuit breaker patterns**, **dead letter queues**, and **Sentry/BugSnag** integration.

### Trigger Conditions
Activate this skill when:
- Setting up error handling for React/Next.js applications.
- Implementing retry logic for unreliable API calls or third-party services.
- Designing circuit breaker patterns for microservice-to-microservice calls.
- Building fallback UI for degraded service states.
- Integrating error tracking tools (Sentry, BugSnag, LogRocket).
- Handling transaction failures in database operations.
- Designing dead letter queues for failed async jobs.

---

### Core Concepts

#### Error Handling Philosophy

| Principle | Description |
|---|---|
| **Fail Fast** | Detect and report errors early; don't let invalid state propagate |
| **Fail Gracefully** | Show useful fallback UI, not blank screens or raw stack traces |
| **Retry Intelligently** | Use exponential backoff + jitter; never retry non-idempotent operations blindly |
| **Isolate Failures** | A failing component shouldn't crash the entire page |
| **Track Everything** | Every unhandled error must reach your monitoring system |

---

### 1. React & Next.js Error Handling

#### Error Boundaries (React 19)
```tsx
// components/error-boundary.tsx
'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    // Report to Sentry/BugSnag
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo });
    }
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props;
      return typeof fallback === 'function'
        ? fallback(this.state.error, this.reset)
        : fallback;
    }
    return this.props.children;
  }
}
```

#### Next.js App Router Error Files
```tsx
// app/error.tsx — Route-level error handler
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert" className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      {error.digest && <p className="text-muted">Error ID: {error.digest}</p>}
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// app/not-found.tsx — 404 handler
export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

// app/global-error.tsx — Root layout error handler (catches layout errors)
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

---

### 2. API Error Response Standards (RFC 9457)

```typescript
// lib/api-error.ts
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** RFC 9457 Problem Details JSON response */
  toJSON() {
    return {
      type: `https://api.example.com/errors/${this.code}`,
      title: this.code.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      status: this.status,
      detail: this.message,
      ...(this.details && { extensions: this.details }),
    };
  }
}

// Usage in API route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError(422, 'validation_error', 'Invalid request body', {
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    const user = { id: 'usr_101', ...parsed.data };
    return Response.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(error.toJSON(), { status: error.status });
    }
    // Unexpected error — log and return generic 500
    console.error('Unhandled error:', error);
    return Response.json(
      { type: 'about:blank', title: 'Internal Server Error', status: 500 },
      { status: 500 },
    );
  }
}
```

---

### 3. Retry Patterns with Exponential Backoff

```typescript
// lib/retry.ts
interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  /** Only retry if this returns true */
  retryIf?: (error: unknown) => boolean;
  onRetry?: (attempt: number, error: unknown) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 500,
    maxDelayMs = 30_000,
    retryIf = isRetryable,
    onRetry,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !retryIf(error)) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelayMs * 2 ** attempt + Math.random() * baseDelayMs,
        maxDelayMs,
      );

      onRetry?.(attempt + 1, error);
      await sleep(delay);
    }
  }

  throw lastError;
}

function isRetryable(error: unknown): boolean {
  if (error instanceof ApiError) {
    // Retry 429 (rate limit), 502/503/504 (server errors)
    return [429, 502, 503, 504].includes(error.status);
  }
  // Retry network errors
  if (error instanceof TypeError && error.message.includes('fetch')) return true;
  return false;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

---

### 4. Circuit Breaker Pattern

```typescript
// lib/circuit-breaker.ts
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeoutMs?: number;
  halfOpenMaxAttempts?: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private halfOpenAttempts = 0;

  constructor(
    private readonly name: string,
    private readonly options: CircuitBreakerOptions = {},
  ) {}

  private get failureThreshold() { return this.options.failureThreshold ?? 5; }
  private get resetTimeoutMs() { return this.options.resetTimeoutMs ?? 60_000; }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.halfOpenAttempts = 0;
      } else {
        throw new Error(`Circuit breaker "${this.name}" is OPEN`);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState(): CircuitState { return this.state; }
}

// Usage
const paymentCircuit = new CircuitBreaker('stripe-api', {
  failureThreshold: 3,
  resetTimeoutMs: 30_000,
});

const charge = await paymentCircuit.execute(() =>
  stripe.paymentIntents.create({ amount: 1000, currency: 'usd' })
);
```

---

### 5. Graceful Degradation & Fallback UI

```tsx
// components/resilient-data.tsx
'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from './error-boundary';

// Pattern: Wrap data-dependent UI with ErrorBoundary + Suspense
export function ResilientDataSection() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="degraded-state">
          <p>Unable to load latest data. Showing cached version.</p>
          <button onClick={reset}>Retry</button>
        </div>
      )}
    >
      <Suspense fallback={<DataSkeleton />}>
        <LiveDataSection />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

### 6. Dead Letter Queue for Failed Jobs

```typescript
// queues/dead-letter.ts
import { Queue, Worker } from 'bullmq';

const mainQueue = new Queue('email-send', { connection: redis });
const deadLetterQueue = new Queue('email-send-dlq', { connection: redis });

const worker = new Worker('email-send', async (job) => {
  await sendEmail(job.data);
}, {
  connection: redis,
  settings: {
    backoffStrategy: (attemptsMade) => {
      // Exponential backoff: 1s, 4s, 16s, 64s
      return Math.min(1000 * 4 ** attemptsMade, 120_000);
    },
  },
});

worker.on('failed', async (job, err) => {
  if (job && job.attemptsMade >= (job.opts.attempts ?? 3)) {
    // Move to dead letter queue for manual investigation
    await deadLetterQueue.add('failed-email', {
      originalJobId: job.id,
      data: job.data,
      error: err.message,
      failedAt: new Date().toISOString(),
    });
  }
});
```

---

### 7. Chaos Engineering & Automated Failure Injection Protocol

1. **Chaos Injection**: Actively test system resilience by simulating network disruptions, killing database connections, and injecting artificial latency (500ms–5000ms) or dropped packets using Toxiproxy or mock network middleware.
2. **Failure Observation**: Monitor application behavior under duress. Check whether the UI hangs, returns blank screens, or if connections leak.
3. **Automated Resilience Hardening**:
   - Implement Circuit Breakers around fragile external API dependencies.
   - Add exponential backoff with full jitter to avoid thundering herds.
   - Implement graceful degradation: render cached data or contextual fallback states rather than throwing unhandled exceptions.
4. **Resilience Verification**: Re-run the disruption loop until all failure modes are safely caught, logged to Sentry, and recovered from automatically.

---

### Common Pitfalls to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| Catching errors silently (`catch (e) {}`) | Errors disappear, bugs hide | Always log or re-throw with context |
| Retrying non-idempotent operations | Duplicate charges, double inserts | Only retry reads and idempotent writes |
| No timeout on external calls | Thread/connection pool exhaustion | Set `AbortSignal.timeout()` on all fetch calls |
| Generic "Something went wrong" for all errors | Users can't self-resolve | Show actionable messages (retry, contact support, check input) |
| Using `try/catch` around every single line | Code becomes unreadable | Use error boundaries and middleware for batch handling |

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec error-resilience-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 6 - Hardening Produksi & Ketahanan) untuk memastikan arsitektur aplikasi yang toleran terhadap kegagalan.
- **Skill Hilir & Kerja Sama**:
  - `logging-error-tracking-expert` — Integrasi Sentry/BugSnag dan logging error terstruktur.
  - `data-telemetry-expert` — Menyalurkan tingkat error dan anomali latensi ke circuit breaker.
  - `js-backend-expert` — Middleware penanganan error API dan pemformatan RFC 9457 Problem Details.
  - `senior-frontend` — Error Boundary React 19, fallback suspense, dan UI state yang resilien.
  - `database-orm-expert` — Strategi retry transaksi, deadlock, dan kebijakan rollback.
  - `async-queue-temporal-expert` — Dead letter queue, backoff retry, dan pemulihan saga terdistribusi.
  - `production-ready-hardener` — Verifikasi mode kegagalan pra-peluncuran dan uji chaos.
  - `session-memory-manager` — Menyimpan log pemulihan kegagalan dan checkpoint status resilien.

### Deskripsi
Panduan tingkat produksi untuk membangun aplikasi yang tahan banting — gagal secara anggun, pulih otomatis, dan memberikan umpan balik error yang dapat ditindaklanjuti kepada pengguna maupun developer. Mencakup **React Error Boundaries**, **penanganan error Next.js** (`error.tsx`, `global-error.tsx`, `not-found.tsx`), **standar respons error API** (RFC 9457 Problem Details), **pola retry** dengan exponential backoff, **pola circuit breaker**, **dead letter queues**, dan integrasi **Sentry/BugSnag**.

### Kondisi Pemicu
Aktifkan skill ini ketika:
- Menyiapkan penanganan error untuk aplikasi React/Next.js.
- Mengimplementasikan logika retry untuk panggilan API yang tidak stabil atau layanan pihak ketiga.
- Merancang pola circuit breaker untuk panggilan antar-microservice.
- Membangun UI fallback untuk kondisi layanan terdegradasi.
- Mengintegrasikan alat pelacak error (Sentry, BugSnag, LogRocket).
- Menangani kegagalan transaksi pada operasi database.
- Merancang dead letter queue untuk job asinkron yang gagal.

### Konsep Inti

#### Filosofi Penanganan Error

| Prinsip | Deskripsi |
|---|---|
| **Gagal Cepat** | Deteksi dan laporkan error sedini mungkin; jangan biarkan state invalid menyebar |
| **Gagal dengan Anggun** | Tampilkan UI fallback yang berguna, bukan layar kosong atau stack trace mentah |
| **Retry dengan Cerdas** | Gunakan exponential backoff + jitter; jangan retry operasi non-idempoten secara membabi buta |
| **Isolasi Kegagalan** | Komponen yang gagal tidak boleh menghancurkan seluruh halaman |
| **Lacak Semuanya** | Setiap error yang tidak tertangani harus sampai ke sistem monitoring |

### Protokol Chaos Engineering & Injeksi Kegagalan Otomatis
1. **Injeksi Kekacauan (Chaos Injection)**: Uji ketahanan dengan sengaja memutuskan koneksi database, menyuntikkan latensi jaringan (Toxiproxy), atau membuang paket request ke API eksternal.
2. **Observasi Kegagalan**: Periksa apakah UI macet, layar menjadi putih kosong, atau connection pool bocor saat dependensi bermasalah.
3. **Hardening Ketahanan Otomatis**:
   - Terapkan Circuit Breaker pada panggilan API eksternal yang rentan.
   - Tambahkan retry dengan exponential backoff dan random jitter.
   - Terapkan degradasi anggun (*graceful degradation*): sajikan data cache atau UI fallback alternatif.
4. **Verifikasi Ketahanan**: Ulangi simulasi gangguan hingga sistem bertahan tanpa crash fatal dan seluruh error tercatat di Sentry.

### Kesalahan Umum yang Harus Dihindari

| Anti-Pola | Masalah | Pendekatan yang Benar |
|---|---|---|
| Menangkap error diam-diam (`catch (e) {}`) | Error menghilang, bug tersembunyi | Selalu log atau lempar ulang dengan konteks |
| Retry operasi non-idempoten | Charge ganda, insert duplikat | Hanya retry operasi baca dan write idempoten |
| Tidak ada timeout pada panggilan eksternal | Thread/pool koneksi habis | Pasang `AbortSignal.timeout()` pada semua panggilan fetch |
| Pesan generik "Terjadi kesalahan" untuk semua error | Pengguna tidak bisa menyelesaikan sendiri | Tampilkan pesan yang actionable (retry, hubungi support, periksa input) |

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec error-resilience-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
