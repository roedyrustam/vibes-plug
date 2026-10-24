---
name: legacy-code-translator
description: "Methodological guide for the AI Agent to safely and systematically translate, refactor, and modernize giant legacy codebases (PHP, Python 2, old React) into modern stacks."
author: "Roedy Rustam"
version: "4.4.2"
---

# Legacy Code Translator (Strangler Fig & Refactoring Engine)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream & Reverse Engineering**: `prd-architect` (document reverse-engineered business rules into `PRD.md`), `brainstorming`, `session-memory-manager`.
- **AST & Codebase Intelligence**: `living-codebase-ast-graph` (module dependencies & blast radius), `scalability-clean-code` (Clean Architecture boundaries), `typescript-expert` (strict type contracts).
- **Backend & Database Migration**: `database-orm-expert` (legacy SQL to Prisma/Drizzle schemas), `mvc-expert` (modernizing legacy PHP MVC codebases), `js-backend-expert` (Bun/Hono targets), `go-programming-expert` / `rust-programming-expert`.
- **Testing & Anti-Slop Gates**: `autonomous-tdd-debugger` (shadow execution comparison suites), `anti-slop` (zero truncation, no stubbed mocks), `zero-tech-debt-auditor`.

### Description
A systematic, risk-mitigated engineering methodology for migrating large, business-critical legacy codebases (PHP 5/7, Python 2, jQuery, old React Class Components, AngularJS) to modern 2026 enterprise stacks (Next.js 15, TypeScript 5.8+, Bun, Rust, Go) without business downtime or regression. Employs the **Strangler Fig pattern**, **Shadow Execution Harnesses**, and **Golden Master Characterization Tests**.

### 1. Legacy Modernization Strategy Matrix

| Legacy Source | Target 2026 Stack | Strangler Seam / Proxy | Critical Edge Case to Preserve |
| :--- | :--- | :--- | :--- |
| **PHP 5/7 Spaghetti / Old MVC** | **TypeScript (Hono / Next.js) or Go** | Reverse Proxy route-by-route split (`/api/v2/*` $\rightarrow$ new) | PHP implicit float/string coercion & `round()` half-up behavior in billing |
| **Python 2 / Untyped Monolith** | **Python 3.13+ (FastAPI + Pydantic v2) or Rust** | Message Queue consumer shadow fork | Integer division `/` vs `//` semantics and timezone-naive timestamps |
| **jQuery / React 15 Class Components** | **React 19 RSC + Tailwind v4** | Micro-Frontend Island mount or route-level cutover | URL query parameter state and keyboard tab-order workflows |

### 2. Shadow Testing & Parity Verification Harness (TypeScript)
Run the legacy implementation (ground truth) and modern implementation concurrently on live traffic, logging structural discrepancies without impacting customer responses until `100%` parity is proven:

```typescript
// src/migration/shadow-harness.ts
export interface ShadowComparison<TOutput> {
  legacyOutput: TOutput;
  modernOutput: TOutput | null;
  isMatch: boolean;
  latencyDeltaMs: number;
}

export async function executeWithShadowTesting<TInput, TOutput>(
  input: TInput,
  legacyFn: (data: TInput) => Promise<TOutput>,
  modernFn: (data: TInput) => Promise<TOutput>,
  onDiscrepancy?: (diff: ShadowComparison<TOutput>) => void
): Promise<TOutput> {
  const t0 = performance.now();
  const legacyPromise = legacyFn(input).then((res) => ({
    res,
    ms: performance.now() - t0,
  }));

  const modernStart = performance.now();
  const modernPromise = modernFn(input)
    .then((res) => ({ ok: true as const, res, ms: performance.now() - modernStart }))
    .catch((err: unknown) => {
      console.error('[Shadow-Harness] Modern candidate threw error:', err);
      return { ok: false as const, res: null, ms: performance.now() - modernStart };
    });

  const [legacy, modern] = await Promise.all([legacyPromise, modernPromise]);
  const isMatch =
    modern.ok && JSON.stringify(legacy.res) === JSON.stringify(modern.res);

  if (!isMatch && onDiscrepancy) {
    onDiscrepancy({
      legacyOutput: legacy.res,
      modernOutput: modern.res,
      isMatch: false,
      latencyDeltaMs: Math.round(modern.ms - legacy.ms),
    });
  }

  return legacy.res;
}
```

### 3. Production Verification Checklist
- [ ] **Golden Master Characterization Tests**: Capture `50+` real input/output fixtures from the legacy code before writing a single line of replacement code.
- [ ] **Never Overwrite In-Place**: Build the modernized module side-by-side (`order-calc.legacy.php` $\rightarrow$ `order-calc.service.ts`) so the original remains intact for diffing and rollback.
- [ ] **Token Slicing (`<= 400 lines/turn`)**: Decompose giant legacy files by AST function boundaries to guarantee 100% complete translations with zero `// TODO` or `// ...` truncations.
- [ ] **Shadow Parity Gate**: Require `0` discrepancies across at least `1,000` shadow executions before flipping primary traffic to the modern service.

---

#### Golden Master Fixture Regression Verifier (TypeScript)
```typescript
export interface GoldenFixture<TIn, TOut> {
  fixtureId: string;
  input: TIn;
  expectedOutput: TOut;
}

export async function verifyGoldenMasterParity<TIn, TOut>(
  fixtures: readonly GoldenFixture<TIn, TOut>[],
  modernCandidate: (input: TIn) => Promise<TOut>
): Promise<{ passed: boolean; failedFixtureIds: string[] }> {
  const failedFixtureIds: string[] = [];
  for (const item of fixtures) {
    const actual = await modernCandidate(item.input);
    if (JSON.stringify(actual) !== JSON.stringify(item.expectedOutput)) {
      failedFixtureIds.push(item.fixtureId);
    }
  }
  return {
    passed: failedFixtureIds.length === 0,
    failedFixtureIds
  };
}
```

#### Strangler Fig Route-by-Route Canary Proxy (TypeScript)
```typescript
export interface StranglerRoutePolicy {
  readonly pathPrefix: string;
  readonly modernRolloutPercent: number;
  readonly legacyOrigin: string;
  readonly modernOrigin: string;
}

export function resolveStranglerTargetOrigin(
  requestUrl: string,
  tenantHashBucket: number,
  policies: readonly StranglerRoutePolicy[],
  defaultLegacyOrigin: string
): { targetUrl: string; routedTo: 'modern' | 'legacy' } {
  const parsed = new URL(requestUrl);
  const matched = policies.find((p) => parsed.pathname.startsWith(p.pathPrefix));

  if (!matched) {
    return {
      targetUrl: new URL(parsed.pathname + parsed.search, defaultLegacyOrigin).toString(),
      routedTo: 'legacy'
    };
  }

  const normalizedBucket = Math.abs(tenantHashBucket) % 100;
  const useModern = normalizedBucket < matched.modernRolloutPercent;
  const baseOrigin = useModern ? matched.modernOrigin : matched.legacyOrigin;

  return {
    targetUrl: new URL(parsed.pathname + parsed.search, baseOrigin).toString(),
    routedTo: useModern ? 'modern' : 'legacy'
  };
}
```

#### Idempotent Dual-Write Database Migration Adapter (TypeScript)
```typescript
export interface DualWriteResult<TRecord> {
  readonly primaryRecord: TRecord;
  readonly secondarySynced: boolean;
  readonly discrepancyError: string | null;
}

export async function executeDualWriteMutation<TPayload, TRecord>(
  payload: TPayload,
  writePrimaryLegacyDb: (data: TPayload) => Promise<TRecord>,
  writeSecondaryModernDb: (data: TPayload, primary: TRecord) => Promise<void>
): Promise<DualWriteResult<TRecord>> {
  const primaryRecord = await writePrimaryLegacyDb(payload);
  try {
    await writeSecondaryModernDb(payload, primaryRecord);
    return { primaryRecord, secondarySynced: true, discrepancyError: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { primaryRecord, secondarySynced: false, discrepancyError: message };
  }
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec legacy-code-translator <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Hulu & Rekayasa Balik**: `prd-architect` (dokumentasi aturan bisnis ke `PRD.md`), `brainstorming`, `session-memory-manager`.
- **AST & Inteligensi Basis Kode**: `living-codebase-ast-graph` (dependensi modul & radius dampak), `scalability-clean-code` (batas Clean Architecture), `typescript-expert` (kontrak tipe ketat).
- **Migrasi Backend & Database**: `database-orm-expert` (SQL lama ke skema Prisma/Drizzle), `mvc-expert` (modernisasi codebase PHP MVC), `js-backend-expert` (target Bun/Hono), `go-programming-expert` / `rust-programming-expert`.
- **Pengujian & Gerbang Anti-Slop**: `autonomous-tdd-debugger` (suite komparasi shadow execution), `anti-slop` (nol pemotongan kode, tanpa stub pura-pura), `zero-tech-debt-auditor`.

### Deskripsi
Metodologi rekayasa sistematis bagi agen AI untuk memigrasikan basis kode warisan (*legacy codebase*) skala besar (PHP 5/7, Python 2, jQuery, React Class Component lawas) ke stack modern 2026 (Next.js 15, TypeScript 5.8+, Bun, Rust, Go) tanpa gangguan operasional (*zero downtime*) menggunakan pola *Strangler Fig*, *Shadow Execution*, dan *Golden Master Testing*.

### Checklist Verifikasi Produksi
- [ ] **Golden Master Fixtures**: Rekam minimal 50 pasang input/output asli dari sistem lama sebagai pengujian regresi sebelum menulis kode baru.
- [ ] **Dilarang Menimpa File Asli Secara Langsung**: Bangun modul baru secara berdampingan agar kode lama tetap menjadi acuan kebenaran selama masa transisi.
- [ ] **Pecah File Raksasa (Token Slicing)**: Terjemahkan per fungsi/subrutin (`<= 400` baris per giliran) untuk menghindari pemotongan kode.
- [ ] **Verifikasi Shadow Testing**: Pastikan hasil keluaran fungsi baru 100% identik dengan fungsi lama sebelum memindahkan trafik utama.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec legacy-code-translator <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
