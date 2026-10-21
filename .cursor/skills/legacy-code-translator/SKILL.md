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
- **Backend & Database Migration**: `database-orm-expert` (legacy SQL to Prisma/Drizzle schemas), `js-backend-expert` (Bun/Hono targets), `go-programming-expert` / `rust-programming-expert`.
- **Testing & Anti-Slop Gates**: `autonomous-tdd-debugger` (shadow execution comparison suites), `anti-slop` (zero truncation, no stubbed mocks), `zero-tech-debt-auditor`.

### Description
A systematic, risk-mitigated engineering methodology for migrating large, business-critical legacy codebases (PHP 5/7, Python 2, jQuery, old React Class Components, AngularJS) to modern 2026 enterprise stacks (Next.js 15, TypeScript 5.8+, Bun, Rust, Go) without business downtime or regression. Employs the Strangler Fig pattern, Shadow Execution Harnesses, and AST-driven module decomposition to prevent context exhaustion and hallucinated logic.

### Trigger Conditions
- Large-scale framework migrations (e.g., PHP monolith -> Next.js + Bun/Hono microservices).
- Translating legacy scripts across languages (e.g., Python 2/3 CPU-bound routines -> Rust/Go).
- Refactoring sprawling React Class components (>1,000 lines) into modern hooks and Server Components.
- Decoupling legacy database queries from direct presentation templates.

### The 4-Phase Strangler Migration Protocol

```
┌────────────────────────────────────────────────────────┐
│ 1. MAP & ISOLATE (AST Boundary Definition)             │
│    Document I/O contracts in `migration_plan.md`       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. SHADOW HARNESS IMPLEMENTATION                       │
│    Run legacy and new code in parallel; log diffs      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. SIDE-BY-SIDE REFACTORING (Function-by-Function)     │
│    Maintain old file while building typed modern clone │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. TRAFFIC CUTOVER & CLEANUP                           │
│    100% parity verified ──► Deprecate legacy file      │
└────────────────────────────────────────────────────────┘
```

### Shadow Testing Harness Example (TypeScript)

```typescript
// src/migration/shadow-harness.ts
export interface ShadowComparison<T> {
  legacyOutput: T;
  modernOutput: T;
  isMatch: boolean;
  discrepancies?: string[];
}

export async function executeWithShadowTesting<TInput, TOutput>(
  input: TInput,
  legacyFn: (data: TInput) => Promise<TOutput>,
  modernFn: (data: TInput) => Promise<TOutput>,
  onDiscrepancy?: (diff: ShadowComparison<TOutput>) => void
): Promise<TOutput> {
  // 1. Run legacy function as ground truth for customer
  const legacyPromise = legacyFn(input);

  // 2. Execute modern implementation in shadow mode (non-blocking)
  const modernPromise = modernFn(input).catch((err) => {
    console.error('[Shadow-Harness] Modern function threw error:', err);
    return null as unknown as TOutput;
  });

  const [legacyResult, modernResult] = await Promise.all([legacyPromise, modernPromise]);

  // 3. Compare JSON representation for structural equality
  const legacyJson = JSON.stringify(legacyResult);
  const modernJson = JSON.stringify(modernResult);

  if (legacyJson !== modernJson) {
    const diffReport: ShadowComparison<TOutput> = {
      legacyOutput: legacyResult,
      modernOutput: modernResult,
      isMatch: false,
    };
    if (onDiscrepancy) onDiscrepancy(diffReport);
    console.warn('[Shadow-Harness] Discrepancy detected between legacy and modern outputs.');
  }

  // Always return the legacy result during the shadow probation phase
  return legacyResult;
}
```

### The 4 Non-Negotiable Agent Constraints
1. **Never Overwrite In-Place**: Never directly modify or delete the legacy source file during initial drafting. Always create the modernized file side-by-side (`order-calc.legacy.php` -> `order-calc.service.ts`).
2. **Context Window Token Slicing**: Never attempt to translate a file exceeding 400 lines in a single turn. Decompose the module by distinct subroutines or AST nodes to prevent hallucinated truncations (`// ...rest of code`).
3. **Preserve "Quirks as Features"**: Legacy edge cases (e.g., custom rounding rules or implicit type coercion) are often relied upon by downstream billing systems. Document and preserve them with explicit regression tests.
4. **Enforce Type Contracts**: The modern code MUST be 100% strictly typed (no `any`, no phantom SDK imports).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Hulu & Rekayasa Balik**: `prd-architect` (dokumentasi aturan bisnis ke `PRD.md`), `brainstorming`, `session-memory-manager`.
- **AST & Inteligensi Basis Kode**: `living-codebase-ast-graph` (dependensi modul & radius dampak), `scalability-clean-code` (batas Clean Architecture), `typescript-expert` (kontrak tipe ketat).
- **Migrasi Backend & Database**: `database-orm-expert` (SQL lama ke skema Prisma/Drizzle), `js-backend-expert` (target Bun/Hono), `go-programming-expert` / `rust-programming-expert`.
- **Pengujian & Gerbang Anti-Slop**: `autonomous-tdd-debugger` (suite komparasi shadow execution), `anti-slop` (nol pemotongan kode, tanpa stub pura-pura), `zero-tech-debt-auditor`.

### Deskripsi
Metodologi rekayasa sistematis dan aman bagi agen AI untuk memigrasikan basis kode warisan (*legacy codebase*) skala besar (PHP 5/7, Python 2, jQuery, React Class Component lawas) ke stack modern 2026 (Next.js 15, TypeScript 5.8+, Bun, Rust, Go) tanpa gangguan operasional (*zero downtime*) dan tanpa regresi logika bisnis. Menerapkan pola *Strangler Fig*, *Shadow Execution*, dan dekomposisi berbasis pohon sintaks (AST).

### Kondisi Pemicu
- Migrasi skala besar (misal: monolit PHP lawas ke microservices Next.js + Bun/Hono).
- Penerjemahan kode antar bahasa (misal: skrip kalkulasi Python lambat ke modul Go/Rust berkecepatan tinggi).
- Pemecahan komponen React Class raksasa (>1.000 baris) menjadi Server Components dan hooks modular.
- Pemisahan kueri database yang menempel langsung pada file template HTML/PHP.

### 4 Aturan Ketat Agen Selama Migrasi
1. **Dilarang Menimpa File Asli Secara Langsung**: Jangan pernah langsung mengedit atau menghapus file lama pada langkah pertama. Buat file baru bersisian (`UserService.legacy.php` -> `user-service.ts`) agar kode lama tetap menjadi acuan kebenaran.
2. **Pecah File Raksasa (Token Slicing)**: Jangan pernah meminta LLM menerjemahkan file di atas 400 baris dalam satu giliran. Pecah per fungsi atau blok logika untuk menghindari pemotongan kode (`// TODO: sisa kode`).
3. **Hargai Perilaku Khusus (Quirks)**: Seringkali kejanggalan pada kode lama (misal: pembulatan desimal khusus) merupakan aturan bisnis yang disengaja. Jangan ubah aturan tersebut tanpa bukti pengujian (*regression test*).
4. **Wajib Type-Safe**: Seluruh kode baru wajib menggunakan TypeScript mode ketat tanpa `any`.

### Pola Pengujian Bayangan (Shadow Testing)

```typescript
// Membandingkan output kode lama vs baru secara real-time
const total = await executeWithShadowTesting(
  cartData,
  (cart) => hitungTotalLegacyPHP(cart),
  (cart) => hitungTotalModernTS(cart),
  (diff) => catatKeLogMonitoring(diff)
);
```