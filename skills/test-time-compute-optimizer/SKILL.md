---
name: test-time-compute-optimizer
description: "Expert guide for scaling test-time compute, dynamic reasoning token allocation (Gemini 4 Argon/Pro, Claude Sonnet 5.5, GPT-5.6 Sol, Grok 4.7), Monte Carlo Tree Search (MCTS), and Process Reward Models / Panduan ahli penskalaan komputasi waktu uji (test-time compute)."
author: "Roedy Rustam"
version: "4.4.2"

---

# test-time-compute-optimizer — vibes-plug Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream & Orchestration**: `zero-to-prod-orchestrator` (Phase 4 AI agent integration), `brainstorming`, `session-memory-manager`.
- **Reasoning Budget & Cascading**: `thinking-budget-orchestrator` (dynamic token budget allocation), `adaptive-model-cascade` (complexity threshold escalation), `llm-finops-router` (token expenditure tracking).
- **Frontier LLMs & Sandboxes**: `frontier-ai-models-expert` (Gemini 4 Argon/Pro, Claude Sonnet 5.5, GPT-5.6 Sol, Grok 4.7 reasoning parameters), `ephemeral-wasm-sandbox-executor` (deterministic code candidate execution).
- **Consensus & Multi-Drafting**: `speculative-multi-draft-synthesizer` (multi-candidate arbiter), `formal-spec-z3-verifier` (mathematical invariant proving).

### Description
Production guide for scaling test-time compute (inference-time reasoning) across frontier AI models including Google Gemini 4 Argon / Pro, Anthropic Claude 5.5 (Sonnet/Opus), OpenAI GPT-5.6 Sol, and xAI Grok 4.7. Provides concrete architectures for dynamic thinking budget allocation, tree-search exploration (MCTS, beam search), step-level Process Reward Model (PRM) verification, and self-consistency consensus loops.

### Trigger Conditions
Activate this skill when:
- Designing systems that tackle hard algorithmic, formal verification, or multi-step architectural problems.
- Configuring model reasoning parameters (`thinkingBudget`, `budget_tokens`, `reasoning_effort`).
- Implementing inference-time search algorithms (Monte Carlo Tree Search, Best-of-N with verification).
- Optimizing cost-vs-accuracy trade-offs to prevent over-spending on trivial tasks while maximizing reasoning on critical bottlenecks.

---

### Core Concepts & Patterns

#### 1. Dynamic Reasoning Budget Matrix

Inference-time compute scaling operates across three distinct operational tiers based on prompt entropy and execution risk:

| Complexity Tier | Target Problem Types | Gemini 4 Argon / Pro (`thinkingBudget`) | Claude Sonnet / Opus 5.5 (`budget_tokens`) | GPT-5.6 Sol (`reasoning_effort`) | Grok 4.7 (`thinking_mode`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Deterministic / CRUD** | Simple UI components, DTO mappings, regex conversions | `0` (Disabled) or `1024` | `1024` | `low` | `fast` |
| **Tier 2: Business Logic & APIs** | Multi-table DB transactions, authentication flows, REST schemas | `4096` - `8192` | `4096` - `8192` | `medium` | `fast` |
| **Tier 3: Mission-Critical Hard** | Financial state machines, distributed consensus, cryptographic proofs, complex refactoring | `16384` - `32768` | `16384` - `32768` | `high` | `system2` |

#### 2. Entropy-Based Compute Dispatcher (TypeScript Implementation)

```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export type TaskComplexity = 'trivial' | 'standard' | 'complex' | 'extreme';

export interface ComputeAllocation {
  geminiThinkingBudget: number;
  claudeBudgetTokens: number;
  reasoningEffort: 'low' | 'medium' | 'high';
  grokThinkingMode: 'fast' | 'system2';
}

export function resolveComputeBudget(complexity: TaskComplexity): ComputeAllocation {
  switch (complexity) {
    case 'trivial':
      return { geminiThinkingBudget: 0, claudeBudgetTokens: 1024, reasoningEffort: 'low', grokThinkingMode: 'fast' };
    case 'standard':
      return { geminiThinkingBudget: 4096, claudeBudgetTokens: 4096, reasoningEffort: 'medium', grokThinkingMode: 'fast' };
    case 'complex':
      return { geminiThinkingBudget: 16384, claudeBudgetTokens: 16384, reasoningEffort: 'high', grokThinkingMode: 'system2' };
    case 'extreme':
      return { geminiThinkingBudget: 32768, claudeBudgetTokens: 32768, reasoningEffort: 'high', grokThinkingMode: 'system2' };
  }
}

export async function executeOptimizedReasoning(
  prompt: string,
  complexity: TaskComplexity,
  provider: 'gemini' | 'claude'
): Promise<string> {
  const budget = resolveComputeBudget(complexity);

  if (provider === 'gemini') {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || ''
    });
    
    try {
      const result = await generateText({
        model: google('gemini-4-pro', {
          useSearchGrounding: false
        }),
        prompt,
        providerOptions: {
          google: {
            thinkingBudget: budget.geminiThinkingBudget
          }
        }
      });
      return result.text;
    } catch (err) {
      // Automatic availability fallback: Gemini 4 Pro -> Gemini 3.8 Flash
      console.warn('[ComputeOptimizer] Gemini 4 Pro unavailable, falling back to Gemini 3.8 Flash...');
      const fallbackResult = await generateText({
        model: google('gemini-3.8-flash'),
        prompt,
        providerOptions: {
          google: {
            thinkingBudget: Math.min(budget.geminiThinkingBudget, 8192)
          }
        }
      });
      return fallbackResult.text;
    }
  }

  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || ''
  });

  try {
    const result = await generateText({
      model: anthropic('claude-opus-5.5-20261022'),
      prompt,
      providerOptions: {
        anthropic: {
          thinking: {
            type: 'enabled',
            budgetTokens: budget.claudeBudgetTokens
          }
        }
      }
    });
    return result.text;
  } catch (err) {
    // Automatic availability fallback: Claude Opus 5.5 -> Claude Opus 4.6
    console.warn('[ComputeOptimizer] Claude Opus 5.5 unavailable, falling back to Claude Opus 4.6...');
    const fallbackResult = await generateText({
      model: anthropic('claude-opus-4.6'),
      prompt,
      providerOptions: {
        anthropic: {
          thinking: {
            type: 'enabled',
            budgetTokens: Math.min(budget.claudeBudgetTokens, 16384)
          }
        }
      }
    });
    return fallbackResult.text;
  }
}
```

#### 3. Best-of-N with External Verifier (Step-Level Scrutiny)

For non-deterministic algorithmic problems, test-time compute achieves superior results by sampling $N$ parallel candidate trajectories and scoring them against automated test suites or AST verifiers:

```
User Prompt ──┬──► Candidate 1 (Thinking = 8k) ──► Ephemeral Sandbox ──► Passed (Score 1.0)
              ├──► Candidate 2 (Thinking = 8k) ──► Ephemeral Sandbox ──► Failed Test 3
              └──► Candidate 3 (Thinking = 8k) ──► Ephemeral Sandbox ──► Syntax Error
                                                           │
                                                           ▼
                                               Synthesized Winning Node
```

---

### Best Practices

1. **Never Hardcode Fixed Thinking Budgets**: Calibrate reasoning tokens dynamically based on code AST complexity, cyclomatic complexity, or security criticality.
2. **Decouple Thinking from Output Stream**: Ensure thinking tokens are captured in structured audit logs rather than directly streamed to end-user UI channels.
3. **Combine Extended Thinking with Verifiable Tests**: Allocate maximum compute to generate both code and exhaustive property-based tests within the same execution loop.
4. **Enforce Hard Timeout Bounds**: Set execution deadlines on reasoning calls to prevent tail latency explosions when models enter recursive chain-of-thought exploration.
5. **Availability Fallback Invariant**:
   - If `Gemini 4` (`Argon` or `Pro`) is unprovisioned, rate-limited, or unavailable, degrade reasoning tasks instantly to **`Gemini 3.8 Flash`** with calibrated thinking budget (capped at 8,192 tokens).
   - If `Claude Opus 5.5` is unprovisioned, rate-limited, or unavailable, degrade reasoning tasks instantly to **`Claude Opus 4.6`** (capping thinking budget at 16,384 tokens) while preserving deep reasoning and invariant safety.
   - Pacing and reasoning loops must execute continuously without failing on missing model tiers.

---

### Common Pitfalls to Avoid

| Anti-Pattern | Operational Consequence | Engineering Remedy |
| :--- | :--- | :--- |
| Max thinking tokens on simple string manipulation | 10x latency and 15x cost inflation | Route through lightweight classifier to set `budget_tokens: 0` |
| Zero thinking tokens on concurrent state machines | Race conditions and hallucinated thread safety | Enforce minimum Tier 3 compute budget (`16384` tokens) |
| Discarding thinking logs | Lost insight into mathematical edge cases | Store thinking blocks in persistent telemetry for model evaluation |

---

#### Process Reward Model (PRM) Best-of-N Candidate Selector (TypeScript)
```typescript
export interface CandidateGeneration {
  id: string;
  code: string;
  typecheckPassed: boolean;
  testsPassedCount: number;
  cyclomaticComplexity: number;
}

export function selectOptimalCandidate(candidates: readonly CandidateGeneration[]): CandidateGeneration | null {
  if (candidates.length === 0) {
    return null;
  }
  const scored = [...candidates].sort((a, b) => {
    const scoreA = (a.typecheckPassed ? 50 : 0) + a.testsPassedCount * 10 - a.cyclomaticComplexity;
    const scoreB = (b.typecheckPassed ? 50 : 0) + b.testsPassedCount * 10 - b.cyclomaticComplexity;
    return scoreB - scoreA;
  });
  return scored[0];
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec test-time-compute-optimizer <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Hulu & Orkestrasi**: `zero-to-prod-orchestrator` (Integrasi agen AI Fase 4), `brainstorming`, `session-memory-manager`.
- **Budget Penalaran & Kaskade**: `thinking-budget-orchestrator` (alokasi budget token dinamis), `adaptive-model-cascade` (eskalasi ambang kompleksitas), `llm-finops-router` (pelacakan pengeluaran token).
- **LLM Frontier & Sandbox**: `frontier-ai-models-expert` (parameter penalaran Gemini 4 Argon/Pro, Claude Sonnet 5.5, GPT-5.6 Sol, Grok 4.7), `ephemeral-wasm-sandbox-executor` (eksekusi deterministik kandidat kode).
- **Konsensus & Multi-Drafting**: `speculative-multi-draft-synthesizer` (arbiter multi-kandidat), `formal-spec-z3-verifier` (pembuktian invarian matematis).

### Deskripsi
Panduan produksi untuk penskalaan komputasi waktu uji (*test-time compute* / penalaran saat inferensi) pada model AI frontier termasuk Google Gemini 4 Argon / Pro, Anthropic Claude 5.5 (Sonnet/Opus), OpenAI GPT-5.6 Sol, dan xAI Grok 4.7. Menyediakan arsitektur konkret untuk alokasi dinamis budget penalaran (*thinking budget*), eksplorasi *tree-search* (MCTS, beam search), verifikasi bertahap dengan Process Reward Model (PRM), dan konsensus *self-consistency*.

### Kondisi Pemicu
Aktifkan skill ini ketika:
- Merancang sistem yang menyelesaikan masalah algoritma rumit, verifikasi formal, atau arsitektur multi-tahap.
- Mengonfigurasi parameter penalaran model (`thinkingBudget`, `budget_tokens`, `reasoning_effort`).
- Mengimplementasikan algoritma pencarian waktu inferensi (Monte Carlo Tree Search, Best-of-N dengan verifikator).
- Mengoptimalkan trade-off biaya vs akurasi agar tidak boros pada tugas sepele namun tetap maksimal pada titik kritis.

---

### Konsep Inti & Pola Praktik

#### 1. Matriks Alokasi Budget Penalaran Dinamis

Penskalaan komputasi waktu inferensi dibagi menjadi tiga tingkatan operasional berdasarkan entropi instruksi dan risiko eksekusi:

- **Tingkat 1 (CRUD & UI Sederhana)**: Komponen antarmuka dasar, konversi tipe data, formatting string. Budget thinking dinonaktifkan (`0`) atau disetel minimal `1024` token.
- **Tingkat 2 (Logika Bisnis & API)**: Transaksi multi-tabel, alur autentikasi, skema REST/GraphQL. Budget penalaran disetel pada rentang `4096` hingga `8192` token.
- **Tingkat 3 (Kritis & Formal Proof)**: State machine finansial, konsensus terdistribusi, refaktor skala besar. Budget penalaran dialokasikan penuh antara `16384` hingga `32768` token.

#### 2. Protokol Evaluasi Langkah (Process Reward Models)
Alih-alih hanya mengevaluasi hasil akhir kode (*Outcome-based*), terapkan evaluasi pada setiap langkah dekomposisi logika (*Step-level*):
1. **Dekomposisi Masalah**: Model menguraikan bukti logika ke dalam *n* premis mandiri.
2. **Validasi Invarian**: Setiap premis diuji terhadap invariant sistem menggunakan sandboxing instan.
3. **Penyatuan Solusi**: Menggabungkan langkah-langkah yang terbukti valid ke dalam kode akhir.

---

### Praktik Terbaik

1. **Hindari Menyetel Budget Statis**: Sesuaikan alokasi token penalaran secara dinamis berdasarkan kompleksitas siklomatik dan risiko domain.
2. **Pisahkan Log Penalaran dari UI**: Simpan token penalaran di dalam sistem telemetri atau log audit internal, bukan ditampilkan mentah ke pengguna akhir.
3. **Kombinasikan dengan Pengujian Otomatis**: Alokasikan daya komputasi tinggi untuk menghasilkan kode beserta unit test berbasis properti secara simultan.
4. **Terapkan Batas Waktu Eksekusi**: Tetapkan timeout yang ketat pada panggilan penalaran guna mencegah lonjakan latensi (*tail latency*).
5. **Protokol Pengalihan Ketersediaan (Availability Fallback Invariant)**:
   - Jika model penalaran utama **`Gemini 4`** (`Argon` atau `Pro`) belum aktif di lingkungan atau terkena batas kuota, alihkan ke **`Gemini 3.8 Flash`** dengan batas budget thinking yang disesuaikan (maksimal 8.192 token).
   - Jika **`Claude Opus 5.5`** belum aktif atau terkena batas kuota, alihkan tugas penalaran ke **`Claude Opus 4.6`** (maksimal 16.384 token) dengan tetap menjaga ketelitian pemahaman arsitektur dan keselamatan invarian.
   - Loop penalaran agen tidak boleh berhenti karena galat model yang tidak tersedia.

---

### Jebakan Umum yang Harus Dihindari

| Praktik Buruk | Dampak Operasional | Solusi Rekayasa |
| :--- | :--- | :--- |
| Menyetel token thinking maksimal untuk manipulasi string dasar | Latensi 10x lebih lambat dan biaya token melonjak 15x | Lewatkan ke pengklasifikasi ringan untuk menyetel `budget_tokens: 0` |
| Menonaktifkan thinking untuk perancangan konkurensi database | Munculnya race condition dan deadlock tersembunyi | Wajibkan alokasi Tingkat 3 (`16384` token) |
| Mengabaikan log internal penalaran (*thinking traces*) | Kehilangan visibilitas saat terjadi kesalahan logika | Simpan blok pemikiran ke penyimpanan telemetri |

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec test-time-compute-optimizer <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
