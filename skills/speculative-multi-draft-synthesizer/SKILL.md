---
name: speculative-multi-draft-synthesizer
description: "Speculative multi-agent drafting and AST-aware code consensus / Penyusunan draf spekulatif multi-agen dan konsensus kode sadar-AST."
author: "Roedy Rustam"
version: "4.4.2"
---

# Speculative Multi-Draft Synthesizer (2026 Sovereign Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & The Multi-Draft Paradigm (2026 Shift)
Single-model code generation suffers from inherent cognitive blind spots:
- **Algorithmic & Speed Optimizers** (e.g., Grok 4.7 High Fast / Grok 4.6 / Composer 2.5) produce sub-second hyper-efficient $O(N)$ logic and lightning AST passes but may overlook defensive telemetry.
- **Rigor-Biased Drafters** (e.g., Claude Sonnet 5.5 High / Claude Fable 5.1) write airtight branded types and exhaustive invariant guards, but occasionally default to conservative data structures.
- **Spec-Adherent Drafters** (e.g., GPT-5.6 Sol Medium / Claude Opus 5.5 / Gemini 4 Argon) produce strict schema compliance and clean API boundaries but may fail to leverage cutting-edge runtime optimizations.

**Speculative Multi-Draft Synthesis** is an architectural protocol that transcends single-model limitations. Rather than relying on a single output, the swarm dispatches **heterogeneous drafting agents in parallel**, analyzes candidate outputs at the **Abstract Syntax Tree (AST) node level**, and invokes a **Frontier Arbiter** to fuse the optimal algorithmic core, error boundaries, and type definitions into a single flawless implementation.

---

### Orchestration & Integration
- **Multi-Agent Swarms & Parallel Dispatch**: `multi-agent-orchestration`, `parallel-tool-orchestrator`, `mcp-sampling-critic`.
- **Frontier Arbiter Engines**: `frontier-ai-models-expert`, `gemini-agent-booster`, `thinking-budget-orchestrator`, `test-time-compute-optimizer`.
- **AST Mapping & Code Execution**: `living-codebase-ast-graph`, `ephemeral-wasm-sandbox-executor`, `spec-driven-development-expert`.
- **Quality & Formal Guarantees**: `anti-slop`, `ai-code-review-autonomous`, `formal-spec-z3-verifier`, `property-mutation-testing-expert`.
- **Session & Architecture**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`.

---

### Core Architectural Topologies

```
┌────────────────────────────────────────────────────────────────────────┐
│               SPECULATIVE MULTI-DRAFT SYNTHESIS PIPELINE               │
├────────────────────────────────────────────────────────────────────────┤
│                           User Prompt / Spec                           │
│                                   │                                    │
│                 ┌─────────────────┼─────────────────┐                  │
│                 ▼                 ▼                 ▼                  │
│           [Drafter Alpha]   [Drafter Beta]   [Drafter Gamma]           │
│           (Grok 4.7 Fast)   (Claude Sonnet)  (Gemini 4 Argon)          │
│            Target: Speed     Target: Types    Target: Guards           │
│                 │                 │                 │                  │
│                 └─────────────────┼─────────────────┘                  │
│                                   ▼                                    │
│                     Parallel Promise.allSettled                        │
│                                   │                                    │
│                                   ▼                                    │
│                      AST Slicing & Metric Scoring                      │
│             (Complexity, Type Soundness, Defensive Branch)             │
│                                   │                                    │
│                                   ▼                                    │
│             FRONTIER ARBITER (Claude Sonnet 5.5 / Gemini 4 Pro)        │
│              AST Node Reconciliation & Hybrid Construction             │
│                                   │                                    │
│                                   ▼                                    │
│                    Ephemeral WASM Test Verification                    │
│                                   │                                    │
│                                   ▼                                    │
│                       Synthesized Gold Artifact                        │
└────────────────────────────────────────────────────────────────────────┘
```

#### 1. Heterogeneous Prompt Specialization
Never run identical prompts across drafters. Assign explicit structural roles:
- **Drafter Alpha (Algorithmic Minimizer — `Grok 4.7 High Fast` / `Composer 2.5 Fast`)**: Instructed to optimize asymptotic Big-O runtime, memory allocation profiles, and minimize allocations.
- **Drafter Beta (Type & Invariant Maximizer — `Claude Sonnet 5.5 High` / `Claude Opus 5.5 Medium`)**: Instructed to construct zero-`any` branded types, tagged unions, immutable schema contracts, and strict compiler boundaries.
- **Drafter Gamma (Error & Telemetry Sentinel — `Gemini 4 Argon Medium` / `GPT-5.6 Sol Medium`)**: Instructed to build defensive retry budgets, explicit custom domain error hierarchies, rate limiting, and structured telemetry markers.
- **Drafter Delta (Generative UI Explorer — `Muse Wonder High`)**: Instructed to construct fluid responsive layouts, micro-animations, and aesthetic design systems.

#### 2. AST Decomposition & Slicing Protocol
The Arbiter decomposes each candidate draft into four distinct AST slices:
1. **Slice T (Type Schema)**: Exported interfaces, branded types, parameter contracts, and Zod schemas.
2. **Slice A (Algorithmic Core)**: The core loop, transform pipeline, or mathematical routine.
3. **Slice E (Defensive Boundary)**: Guard clauses, parameter validation, error mapping, and recovery paths.
4. **Slice L (Resource Lifecycle)**: Cleanup routines, abort signal propagation, and memory leak prevention.

#### 3. Quantitative Selection Rubric
Candidates are scored across four quantitative vectors prior to fusion:
$$S_{\text{total}} = 0.30 \cdot S_{\text{types}} + 0.30 \cdot S_{\text{algo}} + 0.25 \cdot S_{\text{resilience}} + 0.15 \cdot S_{\text{anti-slop}}$$

- $S_{\text{types}}$: Ratio of strictly typed symbols vs `any` or loose type assertions.
- $S_{\text{algo}}$: Asymptotic complexity score and absence of redundant iterations.
- $S_{\text{resilience}}$: Coverage of non-happy paths, explicit custom errors, and signal abort handling.
- $S_{\text{anti-slop}}$: Absence of placeholder comments, speculative factory abstractions, and unused imports.

---

### Production Implementation Blueprints

#### Blueprint 1: High-Concurrency Multi-Model Dispatcher (`engine/multi-draft-dispatcher.ts`)
```typescript
import { generateText } from 'ai';
import { xai } from '@ai-sdk/xai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

export interface CandidateDraft {
  drafterId: 'alpha' | 'beta' | 'gamma';
  modelName: string;
  focus: string;
  code: string;
  latencyMs: number;
  status: 'fulfilled' | 'rejected';
  failureReason?: string;
}

export interface SpeculativeRequest {
  specification: string;
  targetLanguage: 'typescript' | 'python' | 'rust';
  timeoutMs?: number;
}

export class MultiDraftDispatcher {
  public static async dispatchParallelDrafts(
    request: SpeculativeRequest
  ): Promise<CandidateDraft[]> {
    const timeout = request.timeoutMs ?? 15000;
    const abortController = new AbortController();
    const timer = setTimeout(() => abortController.abort(), timeout);

    const drafterTasks = [
      // Drafter Alpha: Algorithmic & Memory Efficiency (High Fast Tier)
      (async (): Promise<CandidateDraft> => {
        const start = performance.now();
        const systemPrompt = [
          `You are Drafter Alpha, an expert in high-performance ${request.targetLanguage} systems.`,
          'Focus exclusively on optimal Big-O time complexity, zero-allocation data paths, and raw speed.',
          'Output ONLY the executable code block with zero conversational filler.'
        ].join('\n');

        const { text } = await generateText({
          model: xai('grok-4.7-high-fast'),
          system: systemPrompt,
          prompt: request.specification,
          abortSignal: abortController.signal,
        });

        return {
          drafterId: 'alpha',
          modelName: 'grok-4.7-high-fast',
          focus: 'Algorithmic Efficiency',
          code: this.extractCodeBlock(text),
          latencyMs: Math.round(performance.now() - start),
          status: 'fulfilled',
        };
      })(),

      // Drafter Beta: Type Rigor & Static Correctness (High Tier)
      (async (): Promise<CandidateDraft> => {
        const start = performance.now();
        const systemPrompt = [
          `You are Drafter Beta, an expert in ${request.targetLanguage} type systems and invariant safety.`,
          'Focus exclusively on branded types, tagged unions, exhaustive pattern matching, and zero "any" or loose casts.',
          'Output ONLY the executable code block with zero conversational filler.'
        ].join('\n');

        const { text } = await generateText({
          model: anthropic('claude-sonnet-5.5-20261022'),
          system: systemPrompt,
          prompt: request.specification,
          abortSignal: abortController.signal,
        });

        return {
          drafterId: 'beta',
          modelName: 'claude-sonnet-5.5-high',
          focus: 'Type Soundness & Invariants',
          code: this.extractCodeBlock(text),
          latencyMs: Math.round(performance.now() - start),
          status: 'fulfilled',
        };
      })(),

      // Drafter Gamma: Failure Resilience & Operational Boundary (Medium Tier)
      (async (): Promise<CandidateDraft> => {
        const start = performance.now();
        const systemPrompt = [
          `You are Drafter Gamma, an expert in ${request.targetLanguage} resilience engineering.`,
          'Focus exclusively on boundary conditions, explicit domain errors, timeout aborts, and defensive logging.',
          'Output ONLY the executable code block with zero conversational filler.'
        ].join('\n');

        const { text } = await generateText({
          model: openai('gpt-5.6-sol-medium'),
          system: systemPrompt,
          prompt: request.specification,
          abortSignal: abortController.signal,
        });

        return {
          drafterId: 'gamma',
          modelName: 'gpt-5.6-sol-medium',
          focus: 'Defensive Resilience',
          code: this.extractCodeBlock(text),
          latencyMs: Math.round(performance.now() - start),
          status: 'fulfilled',
        };
      })(),
    ];

    try {
      const results = await Promise.allSettled(drafterTasks);
      return results.map((res, index) => {
        if (res.status === 'fulfilled') {
          return res.value;
        }
        const drafters: Array<'alpha' | 'beta' | 'gamma'> = ['alpha', 'beta', 'gamma'];
        return {
          drafterId: drafters[index],
          modelName: 'unknown',
          focus: 'failed',
          code: '',
          latencyMs: timeout,
          status: 'rejected',
          failureReason: res.reason instanceof Error ? res.reason.message : 'Unknown execution failure',
        };
      });
    } finally {
      clearTimeout(timer);
    }
  }

  private static extractCodeBlock(raw: string): string {
    const match = raw.match(/```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)```/);
    return match ? match[1].trim() : raw.trim();
  }
}
```

---

#### Blueprint 2: AST Arbiter & Node Reconciliation Engine (`engine/ast-arbiter.ts`)
```typescript
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { CandidateDraft } from './multi-draft-dispatcher';

export const SynthesisSchema = z.object({
  selectedTypeFoundationDrafter: z.enum(['alpha', 'beta', 'gamma']),
  selectedAlgorithmCoreDrafter: z.enum(['alpha', 'beta', 'gamma']),
  selectedDefensiveStrategyDrafter: z.enum(['alpha', 'beta', 'gamma']),
  typeSoundnessScore: z.number().min(0).max(100),
  algorithmicEfficiencyScore: z.number().min(0).max(100),
  resilienceScore: z.number().min(0).max(100),
  synthesisRationale: z.string(),
  synthesizedCode: z.string(),
});

export type SynthesisReport = z.infer<typeof SynthesisSchema>;

export class AstArbiter {
  public static async reconcileDrafts(
    spec: string,
    drafts: CandidateDraft[]
  ): Promise<SynthesisReport> {
    const validDrafts = drafts.filter((d) => d.status === 'fulfilled' && d.code.length > 0);

    if (validDrafts.length === 0) {
      throw new Error('[AstArbiter] All candidate drafts failed execution.');
    }

    const arbiterInstructions = [
      'You are the Master Frontier Arbiter in an autonomous AI engineering swarm.',
      'You have received concurrent, speculative code drafts from diverse models for a single specification.',
      'Your objective is NOT to pick a single winner, but to perform AST-node-level reconciliation:',
      '1. Extract the cleanest branded types, schemas, and interfaces from the strongest candidate.',
      '2. Extract the fastest asymptotic algorithm and optimal data structures from the strongest candidate.',
      '3. Extract the most exhaustive defensive guard clauses, custom error classes, and cancellation hooks.',
      '4. Fuse these into a unified, 100% complete production implementation.',
      '5. Strictly adhere to Anti-Slop Pillar 2: zero placeholder comments, zero stubs, zero truncated code.',
    ].join('\n');

    const formattedDrafts = validDrafts
      .map(
        (draft) =>
          `### DRAFT: ${draft.drafterId.toUpperCase()} (Model: ${draft.modelName} | Focus: ${draft.focus} | Latency: ${draft.latencyMs}ms)\n` +
          '```typescript\n' +
          draft.code +
          '\n```'
      )
      .join('\n\n---\n\n');

    let result;
    try {
      result = await generateObject({
        model: google('gemini-4-pro'),
        schema: SynthesisSchema,
        system: arbiterInstructions,
        prompt: [
          '### SPECIFICATION:',
          spec,
          '',
          '### CANDIDATE DRAFTS:',
          formattedDrafts,
        ].join('\n'),
      });
    } catch (error) {
      // Automatic availability fallback: Gemini 4 Pro -> Gemini 3.8 Flash
      console.warn('[AstArbiter] Gemini 4 Pro unavailable, falling back to Gemini 3.8 Flash...');
      result = await generateObject({
        model: google('gemini-3.8-flash'),
        schema: SynthesisSchema,
        system: arbiterInstructions,
        prompt: [
          '### SPECIFICATION:',
          spec,
          '',
          '### CANDIDATE DRAFTS:',
          formattedDrafts,
        ].join('\n'),
      });
    }

    return result.object;
  }
}
```

---

#### Blueprint 3: End-to-End Speculative Synthesis Pipeline (`engine/speculative-pipeline.ts`)
```typescript
import { MultiDraftDispatcher } from './multi-draft-dispatcher';
import { AstArbiter, SynthesisReport } from './ast-arbiter';

export interface PipelineOutput {
  spec: string;
  synthesizedCode: string;
  report: SynthesisReport;
  benchmarkStats: {
    totalDraftsDispatched: number;
    successfulDrafts: number;
    wallClockLatencyMs: number;
  };
}

export class SpeculativeSynthesisPipeline {
  public static async execute(spec: string): Promise<PipelineOutput> {
    const pipelineStart = performance.now();

    // 1. Concurrent Multi-Model Fan-Out
    const drafts = await MultiDraftDispatcher.dispatchParallelDrafts({
      specification: spec,
      targetLanguage: 'typescript',
      timeoutMs: 20000,
    });

    // 2. Frontier Arbiter AST Reconciliation
    const report = await AstArbiter.reconcileDrafts(spec, drafts);

    const totalDuration = Math.round(performance.now() - pipelineStart);

    return {
      spec,
      synthesizedCode: report.synthesizedCode,
      report,
      benchmarkStats: {
        totalDraftsDispatched: drafts.length,
        successfulDrafts: drafts.filter((d) => d.status === 'fulfilled').length,
        wallClockLatencyMs: totalDuration,
      },
    };
  }
}
```

---

### Sovereign Anti-Slop & Quality Gates
1. **Zero Cherry-Picking Fallacy**: An arbiter that simply outputs one unaltered candidate draft violates the protocol. The synthesis MUST demonstrate cross-pollination (e.g., Drafter Beta's types wrapping Drafter Alpha's inner compute loop).
2. **Deterministic Imports Reconciliation**: All imports from different candidate modules must be canonically deduplicated and sorted. No phantom packages or fabricated methods allowed.
3. **Purity Invariant**: Synthesized code must compile with zero errors under `strict: true`, `noImplicitAny: true`, and pass `scripts/check-anti-slop.js`.
4. **Availability Fallback Invariant**:
   - If `Gemini 4` (`Argon` or `Pro`) is unprovisioned, rate-limited, or unavailable, degrade candidate drafting or arbitration instantly to **`Gemini 3.8 Flash`** (preserving 1M+ context window and sub-100ms TTFT).
   - If `Claude Opus 5.5` is unprovisioned, rate-limited, or unavailable, degrade tasks instantly to **`Claude Opus 4.6`** (preserving deep architectural reasoning and cross-domain logic validation).
   - The speculative multi-draft pipeline must complete with zero interruption through fallback paths.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec speculative-multi-draft-synthesizer <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Direktif Eksekutif & Paradigma Multi-Draf (Pergeseran 2026)
Generasi kode berbasis satu model tunggal selalu memiliki bias kognitif:
- **Model Pengoptimal Algoritma & Kecepatan** (misal Grok 4.7 High Fast / Grok 4.6 / Composer 2.5) menghasilkan logika sub-detik $O(N)$ yang sangat cepat dan transformasi AST instan namun kerap melewatkan telemetri defensif.
- **Model Berbasis Ketelitian Tipe** (misal Claude Sonnet 5.5 High / Claude Fable 5.1) menulis tipe data bermerek (*branded types*) dan invarian yang sangat kokoh, namun terkadang memilih struktur data yang lebih konservatif.
- **Model Kepatuhan Spesifikasi** (misal GPT-5.6 Sol Medium / Claude Opus 5.5 / Gemini 4 Argon) menghasilkan kontrak antarmuka dan kepatuhan skema yang ketat namun belum memanfaatkan optimasi runtime terdepan secara maksimal.

**Sintesis Multi-Draf Spekulatif** adalah protokol arsitektur yang melampaui batasan model tunggal. Alih-alih bergantung pada satu respon, swarm menugaskan **beberapa agen pembuat draf heterogen secara paralel**, menganalisis keluaran pada **tingkat simpul Abstract Syntax Tree (AST)**, dan memanggil **Model Arbiter Frontier** untuk memadukan inti algoritma terbaik, batasan error terkuat, serta definisi tipe terbersih ke dalam satu implementasi yang sempurna.

---

### Integrasi Orkestrasi
- **Swarm Multi-Agen & Dispatch Paralel**: `multi-agent-orchestration`, `parallel-tool-orchestrator`, `mcp-sampling-critic`.
- **Mesin Arbiter Frontier**: `frontier-ai-models-expert`, `gemini-agent-booster`, `thinking-budget-orchestrator`, `test-time-compute-optimizer`.
- **Pemetaan AST & Eksekusi Kode**: `living-codebase-ast-graph`, `ephemeral-wasm-sandbox-executor`, `spec-driven-development-expert`.
- **Kualitas & Jaminan Formal**: `anti-slop`, `ai-code-review-autonomous`, `formal-spec-z3-verifier`, `property-mutation-testing-expert`.
- **Sesi & Arsitektur**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`.

---

### Topologi Arsitektur Inti

```
┌────────────────────────────────────────────────────────────────────────┐
│               ALUR PIPA SINTESIS MULTI-DRAF SPEKULATIF                 │
├────────────────────────────────────────────────────────────────────────┤
│                         Prompt / Spesifikasi                           │
│                                   │                                    │
│                 ┌─────────────────┼─────────────────┐                  │
│                 ▼                 ▼                 ▼                  │
│           [Drafter Alpha]   [Drafter Beta]   [Drafter Gamma]           │
│           (Grok 4.7 Fast)   (Claude Sonnet)  (Gemini 4 Argon)          │
│            Fokus: Kecepatan  Fokus: Tipe Data Fokus: Error             │
│                 │                 │                 │                  │
│                 └─────────────────┼─────────────────┘                  │
│                                   ▼                                    │
│                     Promise.allSettled Paralel                         │
│                                   │                                    │
│                                   ▼                                    │
│                     Pemotongan & Penilaian AST                         │
│             (Kompleksitas, Ketepatan Tipe, Cabang Defensif)            │
│                                   │                                    │
│                                   ▼                                    │
│             ARBITER FRONTIER (Claude Sonnet 5.5 / Gemini 4 Pro)        │
│             Rekonsiliasi Simpul AST & Konstruksi Hibrida               │
│                                   │                                    │
│                                   ▼                                    │
│                    Verifikasi Sandbox WASM Efemeral                    │
│                                   │                                    │
│                                   ▼                                    │
│                     Artefak Emas Hasil Sintesis                        │
└────────────────────────────────────────────────────────────────────────┘
```

#### 1. Spesialisasi Prompt Heterogen
Jangan pernah memberikan prompt yang identik ke setiap pembuat draf. Berikan peran struktural yang tegas:
- **Drafter Alpha (Pengoptimal Algoritma & Memori — `Grok 4.7 High Fast` / `Composer 2.5 Fast`)**: Ditugaskan mengoptimalkan kompleksitas waktu Big-O, jalur data zero-allocation, dan latensi terendah.
- **Drafter Beta (Pengoptimal Tipe & Invarian — `Claude Sonnet 5.5 High` / `Claude Opus 5.5 Medium`)**: Ditugaskan membangun tipe bermerek tanpa `any`, *tagged unions*, pencocokan pola menyeluruh, dan batasan kompilasi yang ketat.
- **Drafter Gamma (Sentinel Ketahanan & Operasional — `Gemini 4 Argon Medium` / `GPT-5.6 Sol Medium`)**: Ditugaskan membangun penanganan error domain kustom, kuota *retry*, pembatalan sinyal *abort*, serta logging terstruktur.
- **Drafter Delta (Eksplorasi Desain UI & Motion — `Muse Wonder High`)**: Ditugaskan merancang layout responsif generatif, animasi mikro dinamis, dan tata letak visual estetis.

#### 2. Protokol Dekomposisi & Pemotongan AST
Arbiter membedah setiap kandidat draf ke dalam empat potongan AST yang jelas:
1. **Potongan T (Skema Tipe Data)**: Interface, tipe bermerek, kontrak parameter, dan skema validasi.
2. **Potongan A (Inti Algoritma)**: Perulangan inti, jalur transformasi, atau komputasi matematis.
3. **Potongan E (Batasan Defensif)**: Klausa penjaga (*guard clauses*), pemetaan exception, dan alur pemulihan.
4. **Potongan L (Siklus Hidup Sumber Daya)**: Rutinitas pembersihan, penutupan stream, dan pencegahan kebocoran memori.

---

### Standar Kualitas Anti-Slop
1. **Larangan Cherry-Picking Mentah**: Arbiter dilarang hanya memilih satu file utuh tanpa rekonsiliasi. Kode hasil sintesis wajib menunjukkan penggabungan kekuatan antar draf.
2. **Rekonsiliasi Modul & Import Bersih**: Seluruh modul yang diimpor harus divalidasi keasliannya dan diurutkan secara kanonikal.
3. **Verifikasi Bebas Cacat**: Kode hasil rekonsiliasi wajib lulus kompilasi ketat dan diverifikasi bebas slop melalui `node scripts/check-anti-slop.js`.
4. **Invarian Pengalihan Ketersediaan (Availability Fallback Invariant)**:
   - Jika `Gemini 4` (`Argon` atau `Pro`) belum aktif di lingkungan atau terkena batas kuota, alihkan peran drafter maupun arbiter seketika ke **`Gemini 3.8 Flash`** (mempertahankan jendela konteks 1M+ dan latensi sub-100ms).
   - Jika `Claude Opus 5.5` belum aktif atau terkena batas kuota, alihkan tugas seketika ke **`Claude Opus 4.6`** (mempertahankan ketelitian pemahaman arsitektur dan validasi logika lintas domain).
   - Pipeline sintesis spekulatif multi-draf harus selesai tanpa interupsi melalui jalur pengalihan.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec speculative-multi-draft-synthesizer <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
