---
name: feature-flag-analytics-expert
description: "Feature flags, progressive rollouts (PostHog), and A/B testing / Feature flag, rollout bertahap (PostHog), dan pengujian A/B."
author: "Roedy Rustam"
version: "4.7.2"

---

# Feature Flag & Progressive Rollout Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 6 - Hardening, Canary Rollouts & Experimentation) to manage feature releases.
- **Downstream Cooperating Skills**:
  - `data-telemetry-expert` — Bridge flag evaluation events with analytics data pipelines.
  - `nextjs-app-router-expert` — Implement zero-flicker server-side flag evaluation in Server Components.
  - `e2e-testing-expert` — Mock feature flag overrides during automated Playwright test suites.
  - `zero-tech-debt-auditor` — Scan and remove obsolete/deprecated flags to prevent code rot.
  - `session-memory-manager` — Store active flag definitions and progressive rollout percentages.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `saas-architect`, `production-ready-hardener`, `saas-billing`

### Description
Production-grade engineering guide for feature flag management, progressive rollouts (canary releases), A/B testing statistical orchestration, and dynamic server-side/client-side flag evaluation using PostHog, LaunchDarkly, and GrowthBook. Covers zero-flicker server-side bootstrapping in Next.js 15 App Router, deterministic user bucketing, conversion metric tracking, and automated flag lifecycle deprecation.

### Trigger Conditions
- Decoupling software deployment from feature release with instant operational kill-switches.
- Phased rollouts to user cohorts (e.g., internal team -> 5% beta -> 25% canary -> 100% GA).
- Setting up multivariate A/B/n testing experiments with statistical significance monitoring.
- Managing server-side gating in Next.js Server Components, Fastify, or Bun backends.
- Retiring obsolete feature flags to prevent technical debt accumulation.

### Zero-Flicker Server Component Pattern (Next.js 15 / PostHog)

```typescript
// src/lib/posthog-server.ts
import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogServer(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.POSTHOG_API_KEY!, {
      host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}

// src/app/dashboard/page.tsx (React Server Component)
import { getPostHogServer } from '@/lib/posthog-server';
import { getCurrentUser } from '@/lib/auth';
import { ModernDashboard } from '@/components/dashboard/ModernDashboard';
import { LegacyDashboard } from '@/components/dashboard/LegacyDashboard';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const posthog = getPostHogServer();

  // Evaluated on the server: zero layout shift, zero client-side flicker
  const isV2Enabled = await posthog.isFeatureEnabled('modern-dashboard-v2', user.id, {
    personProperties: { tier: user.subscriptionTier, region: user.region },
  });

  return isV2Enabled ? <ModernDashboard user={user} /> : <LegacyDashboard user={user} />;
}
```

### Client-Side Integration & Tracking (React 19)

```tsx
// src/components/checkout/CheckoutCTA.tsx
'use client';

import { useFeatureFlagVariantKey } from 'posthog-js/react';
import posthog from 'posthog-js';

export function CheckoutCTA({ orderTotal }: { orderTotal: number }) {
  const variant = useFeatureFlagVariantKey('checkout-cta-variant') || 'control';

  const handleClick = () => {
    posthog.capture('checkout_button_clicked', {
      variant,
      order_total: orderTotal,
      currency: 'USD',
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-lg px-6 py-3 font-semibold transition ${
        variant === 'emerald-glow'
          ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
          : 'bg-slate-900 text-white hover:bg-slate-800'
      }`}
    >
      {variant === 'emerald-glow' ? 'Complete Secure Checkout' : 'Pay Now'}
    </button>
  );
}
```

### Deterministic Local SHA-256 Rollout Bucketing Engine with Timeout Fallback (TypeScript)
Guarantee zero-latency, deterministic cohort assignment (`0–99` bucket) using SHA-256 hashing over `flagKey:distinctId` so flag evaluations never use `Math.random()` or block page rendering when an external provider is unreachable:

```typescript
// src/lib/flags/deterministic-bucketer.ts
import crypto from 'node:crypto';

export interface RolloutFlagConfig {
  readonly key: string;
  readonly enabled: boolean;
  readonly rolloutPercentage: number; // 0 to 100
  readonly allowlistUserIds?: ReadonlySet<string>;
}

export function computeDeterministicBucket(flagKey: string, distinctId: string): number {
  const digest = crypto.createHash('sha256').update(`${flagKey}:${distinctId}`, 'utf8').digest();
  const uint32 = digest.readUInt32BE(0);
  return uint32 % 100;
}

export function evaluateRolloutFlag(config: RolloutFlagConfig, distinctId: string): boolean {
  if (!config.enabled) return false;
  if (config.allowlistUserIds?.has(distinctId)) return true;
  if (config.rolloutPercentage >= 100) return true;
  if (config.rolloutPercentage <= 0) return false;

  const userBucket = computeDeterministicBucket(config.key, distinctId);
  return userBucket < config.rolloutPercentage;
}
```

### Stale Feature-Flag Expiration & Tech-Debt Gate Auditor (TypeScript)
Prevent permanent flag debt by enforcing a strict `expiresAtIso` SLA on every temporary rollout flag in CI:

```typescript
// src/lib/flags/flag-debt-auditor.ts
export interface RegisteredFeatureFlag {
  readonly key: string;
  readonly ownerTeam: string;
  readonly createdAtIso: string;
  readonly expiresAtIso: string;
  readonly lifecycle: 'temporary-experiment' | 'canary-rollout' | 'permanent-killswitch';
}

export function auditStaleFeatureFlags(
  registry: readonly RegisteredFeatureFlag[],
  nowMs = Date.now()
): { expiredFlags: string[]; healthyCount: number } {
  const expiredFlags: string[] = [];

  for (const flag of registry) {
    if (flag.lifecycle === 'permanent-killswitch') continue;
    const expiryTime = Date.parse(flag.expiresAtIso);
    if (Number.isNaN(expiryTime) || expiryTime < nowMs) {
      expiredFlags.push(`${flag.key} (owner: ${flag.ownerTeam}, expired: ${flag.expiresAtIso})`);
    }
  }

  return {
    expiredFlags,
    healthyCount: registry.length - expiredFlags.length,
  };
}
```

### Hard Guardrails (Declarative Invariants)
- **Never Use `Math.random()` for Flag Bucketing**: Cohort bucketing must be 100% deterministic over `(flagKey, distinctId)` using cryptographic or Murmur3 hashing so a user never flips variants across page reloads.
- **Zero-Flicker Server Evaluation**: UI-impacting feature flags in Next.js/SSR apps must be evaluated on the server or edge middleware before HTML streaming to guarantee `CLS = 0`.
- **Bounded Timeout with Safe Control Fallback**: Remote flag evaluations must enforce a hard timeout (`<= 100ms`) and default to the safe `'control'` / `false` state on timeout.
- **Mandatory Expiration SLA on Rollout Flags**: Temporary experiment and canary flags must declare an `expiresAtIso` date (`<= 30 days`) audited in CI to prevent stale branching debt.

### Progressive Rollout Checklist
- [ ] **Deterministic Hashing**: Ensure flag evaluations use stable identifiers (`distinct_id` / user UUID) so users do not oscillate between variants.
- [ ] **Server-Side Fallbacks**: Always provide hardcoded safe fallbacks (`false` or `'control'`) if the flag provider times out (>100ms).
- [ ] **Flag Cleanup Cadence**: Add calendar reminders or GitHub issues to remove flags that reach 100% rollout within 14 days.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec feature-flag-analytics-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 6 - Hardening, Rilis Canary & Eksperimentasi) untuk mengelola peluncuran fitur.
- **Skill Hilir & Kerja Sama**:
  - `data-telemetry-expert` — Menghubungkan evaluasi fitur dengan pipeline data analitik.
  - `nextjs-app-router-expert` — Mengoptimalkan evaluasi server-side agar tidak terjadi pergeseran tata letak (*layout shift*).
  - `e2e-testing-expert` — Melakukan mock nilai flag pada pengujian otomatis Playwright.
  - `zero-tech-debt-auditor` — Menemukan dan membersihkan flag yang sudah kedaluwarsa untuk mencegah code rot.
  - `session-memory-manager` — Menyimpan definisi flag aktif dan persentase rollout progresif.
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `saas-architect`, `production-ready-hardener`, `saas-billing`

### Deskripsi
Panduan tingkat produksi untuk manajemen *feature flags*, rilis bertahap (*canary rollout*), orkestrasi pengujian A/B berbasis statistik, dan evaluasi fitur dinamis pada sisi server maupun klien menggunakan PostHog, LaunchDarkly, dan GrowthBook. Mencakup evaluasi server-side tanpa kedip (*zero-flicker*) pada Next.js 15 App Router, segmentasi pengguna deterministik, pelacakan metrik konversi, dan pembersihan siklus hidup flag secara berkala.

### Kondisi Pemicu
- Memisahkan deployment kode dari aktivasi fitur dengan tombol *kill-switch* instan.
- Meluncurkan fitur secara bertahap ke kelompok pengguna (misal: tim internal -> 5% beta -> 25% canary -> 100% GA).
- Menjalankan eksperimen A/B/n testing dengan pemantauan signifikansi statistik.
- Mengelola pengecekan fitur di sisi server pada Server Components Next.js atau API Bun/Node.js.
- Membersihkan flag lama untuk mencegah penumpukan utang teknis (*technical debt*).

### Pola Integrasi Server-Side Tanpa Kedip

```typescript
// src/app/checkout/page.tsx
import { getPostHogServer } from '@/lib/posthog-server';
import { auth } from '@/lib/auth';

export default async function CheckoutPage() {
  const session = await auth();
  const posthog = getPostHogServer();

  // Evaluasi langsung di server sebelum HTML dikirim ke browser
  const isSnapBiEnabled = await posthog.isFeatureEnabled(
    'doku-snap-bi-direct',
    session?.user?.id || 'anonymous'
  );

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Checkout Pembayaran</h1>
      {isSnapBiEnabled ? <DirectSnapBiPayment /> : <StandardHostedCheckout />}
    </main>
  );
}
```

### Checklist Implementasi Rollout
- [ ] **Identitas Pengguna Deterministik**: Gunakan ID pengguna yang konsisten agar pengguna yang sama tidak melihat tampilan yang berubah-ubah saat me-refresh halaman.
- [ ] **Nilai Fallback Aman**: Tentukan nilai default aman jika layanan pihak ketiga mengalami latensi atau gangguan jaringan.
- [ ] **Jadwal Pembersihan Flag**: Hapus pengecekan flag dari kode dalam waktu 14 hari setelah fitur diluncurkan 100%.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec feature-flag-analytics-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
