---
name: rate-limit-abuse-prevention
description: "Expert guide for API rate limiting, bot protection, DDoS mitigation, brute-force prevention, and abuse detection / Panduan ahli untuk rate limiting API, perlindungan bot, mitigasi DDoS, pencegahan brute-force, dan deteksi penyalahgunaan."
author: "Roedy Rustam"
---

# Rate Limit & Abuse Prevention (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade guide for protecting APIs and web applications from abuse, overuse, and attacks. Covers **rate limiting algorithms** (Token Bucket, Sliding Window), **Upstash Ratelimit**, **bot protection** (Cloudflare Turnstile, hCaptcha), **DDoS mitigation** at edge, **brute-force login prevention**, **API key management & usage quotas**, and **response headers** (X-RateLimit, Retry-After).

### Trigger Conditions
Activate this skill when:
- Implementing API rate limiting for public or authenticated endpoints.
- Adding bot protection (CAPTCHA) to forms (login, signup, contact).
- Setting up DDoS protection at the edge (Cloudflare, Vercel).
- Preventing brute-force attacks on authentication endpoints.
- Implementing API key issuance and usage quotas for SaaS.
- Building tiered rate limits based on subscription plans.

---

### Rate Limiting Algorithm Comparison

| Algorithm | Behavior | Best For | Burst Handling |
|---|---|---|---|
| **Fixed Window** | Resets counter at interval boundary | Simple endpoints | Allows double burst at window edge |
| **Sliding Window** | Rolling window, smooth distribution | API endpoints | Smooth, no edge burst |
| **Token Bucket** | Tokens refill at fixed rate | High-throughput APIs | Allows controlled bursts |
| **Leaky Bucket** | Processes at fixed rate, queues excess | Stream processing | No bursts, constant rate |

**Recommendation**: Use **Sliding Window** for most API endpoints. Use **Token Bucket** for endpoints that should allow burst traffic.

---

### 1. Upstash Ratelimit (Edge-Compatible)

```typescript
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Different rate limiters for different tiers
export const rateLimiters = {
  /** Public API: 10 requests per 10 seconds */
  public: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10s'),
    prefix: 'rl:public',
    analytics: true,
  }),

  /** Authenticated API: 100 requests per minute */
  authenticated: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1m'),
    prefix: 'rl:auth',
    analytics: true,
  }),

  /** Pro tier: 1000 requests per minute */
  pro: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1000, '1m'),
    prefix: 'rl:pro',
    analytics: true,
  }),

  /** Login endpoint: 5 attempts per 15 minutes */
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15m'),
    prefix: 'rl:login',
  }),

  /** Password reset: 3 per hour */
  passwordReset: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1h'),
    prefix: 'rl:pwreset',
  }),
};
```

```typescript
// middleware.ts (Next.js)
import { NextResponse, type NextRequest } from 'next/server';
import { rateLimiters } from '@/lib/ratelimit';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') ?? request.ip ?? '127.0.0.1';
    const identifier = ip;

    const limiter = request.nextUrl.pathname.startsWith('/api/auth/login')
      ? rateLimiters.login
      : rateLimiters.public;

    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: Math.ceil((reset - Date.now()) / 1000) },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        },
      );
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());
    return response;
  }
}

export const config = { matcher: '/api/:path*' };
```

---

### 2. Tiered Rate Limits for SaaS

```typescript
// lib/tiered-ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';

type PlanTier = 'free' | 'pro' | 'enterprise';

const PLAN_LIMITS: Record<PlanTier, { requests: number; window: string }> = {
  free:       { requests: 100,    window: '1h' },
  pro:        { requests: 5000,   window: '1h' },
  enterprise: { requests: 50000,  window: '1h' },
};

export function getRateLimiterForPlan(plan: PlanTier): Ratelimit {
  const config = PLAN_LIMITS[plan];
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window as any),
    prefix: `rl:api:${plan}`,
  });
}

// Usage in API route
export async function GET(request: Request) {
  const user = await getAuthUser(request);
  const limiter = getRateLimiterForPlan(user.plan);
  const { success, remaining } = await limiter.limit(user.id);

  if (!success) {
    return Response.json({
      error: 'Rate limit exceeded',
      upgrade: user.plan !== 'enterprise' ? 'https://app.example.com/pricing' : undefined,
    }, { status: 429 });
  }

  // ...handle request
}
```

---

### 3. Bot Protection (Cloudflare Turnstile)

```tsx
// components/turnstile.tsx
'use client';

import { Turnstile } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
}

export function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
  return (
    <Turnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={onVerify}
      options={{ theme: 'auto', size: 'flexible' }}
    />
  );
}
```

```typescript
// Server-side verification
export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    }),
  });

  const data = await response.json();
  return data.success === true;
}
```

---

### 4. Brute-Force Login Prevention

```typescript
// lib/login-protection.ts
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60; // 15 minutes in seconds
const PROGRESSIVE_DELAYS = [0, 1000, 2000, 4000, 8000]; // Progressive delay per attempt

export async function checkLoginAttempt(email: string, ip: string): Promise<{
  allowed: boolean;
  remainingAttempts: number;
  lockoutEndsAt?: Date;
}> {
  const key = `login-attempts:${email}:${ip}`;
  const attempts = await redis.incr(key);

  if (attempts === 1) {
    await redis.expire(key, LOCKOUT_DURATION);
  }

  if (attempts > MAX_ATTEMPTS) {
    const ttl = await redis.ttl(key);
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutEndsAt: new Date(Date.now() + ttl * 1000),
    };
  }

  // Progressive delay
  const delay = PROGRESSIVE_DELAYS[Math.min(attempts - 1, PROGRESSIVE_DELAYS.length - 1)];
  if (delay > 0) await new Promise(r => setTimeout(r, delay));

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - attempts };
}

export async function clearLoginAttempts(email: string, ip: string): Promise<void> {
  await redis.del(`login-attempts:${email}:${ip}`);
}
```

---

### 5. API Key Management

```typescript
// lib/api-keys.ts
import { nanoid } from 'nanoid';
import { hash, verify } from '@node-rs/argon2';

export async function createApiKey(userId: string, name: string) {
  const rawKey = `sk_live_${nanoid(32)}`;
  const prefix = rawKey.slice(0, 12); // Show prefix for identification
  const hashedKey = await hash(rawKey);

  await db.insert(apiKeys).values({
    userId,
    name,
    prefix,
    hashedKey,
    lastUsedAt: null,
  });

  // Return raw key only once — cannot be retrieved later
  return { key: rawKey, prefix };
}

export async function validateApiKey(rawKey: string) {
  const prefix = rawKey.slice(0, 12);
  const candidates = await db.query.apiKeys.findMany({
    where: and(
      eq(apiKeys.prefix, prefix),
      eq(apiKeys.isRevoked, false),
    ),
  });

  for (const candidate of candidates) {
    if (await verify(candidate.hashedKey, rawKey)) {
      // Update last used timestamp
      await db.update(apiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeys.id, candidate.id));
      return candidate;
    }
  }

  return null;
}
```

---

### Response Headers Specification

| Header | Purpose | Example |
|---|---|---|
| `X-RateLimit-Limit` | Max requests allowed | `100` |
| `X-RateLimit-Remaining` | Remaining requests in window | `87` |
| `X-RateLimit-Reset` | Unix timestamp when window resets | `1723382400` |
| `Retry-After` | Seconds until retry is allowed (on 429) | `60` |

---

### Common Pitfalls to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| Rate limiting by IP only | Shared IPs affect multiple users | Combine IP + user ID + API key |
| No rate limit on auth endpoints | Brute-force attacks | Strict limits: 5 attempts / 15 min |
| Fixed window rate limiting | 2x burst at window boundary | Use sliding window algorithm |
| No 429 response headers | Clients can't implement backoff | Always include Retry-After header |
| CAPTCHA on every request | Terrible UX, accessibility issues | Only trigger after suspicious behavior |
| Rate limit in application only | Still hits your server | Add edge-level protection (Cloudflare WAF) |

---

### Integration with Other Skills

- `authentication-identity-expert` — Brute-force prevention on login/signup endpoints
- `api-design-expert` — Rate limit headers, API key patterns
- `js-backend-expert` — Express/Fastify/Hono middleware integration
- `saas-billing` — Tiered rate limits per subscription plan
- `production-ready-hardener` — Pre-launch security audit
- `cloud-hosting-expert` — Edge-level WAF and DDoS protection

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk melindungi API dan aplikasi web dari penyalahgunaan, penggunaan berlebihan, dan serangan. Mencakup **algoritma rate limiting** (Token Bucket, Sliding Window), **Upstash Ratelimit**, **perlindungan bot** (Cloudflare Turnstile, hCaptcha), **mitigasi DDoS** di edge, **pencegahan brute-force login**, **manajemen API key & kuota penggunaan**, dan **header respons** (X-RateLimit, Retry-After).

### Kondisi Pemicu
Aktifkan skill ini ketika:
- Mengimplementasikan rate limiting API untuk endpoint publik atau terautentikasi.
- Menambahkan perlindungan bot (CAPTCHA) ke formulir.
- Menyiapkan perlindungan DDoS di edge.
- Mencegah serangan brute-force pada endpoint autentikasi.
- Mengimplementasikan penerbitan API key dan kuota penggunaan untuk SaaS.

### Integrasi dengan Skill Lain

- `authentication-identity-expert` — Pencegahan brute-force pada endpoint login/signup
- `api-design-expert` — Header rate limit, pola API key
- `js-backend-expert` — Integrasi middleware Express/Fastify/Hono
- `saas-billing` — Rate limit bertingkat per paket langganan
- `production-ready-hardener` — Audit keamanan pra-peluncuran
- `cloud-hosting-expert` — Perlindungan WAF dan DDoS di edge
