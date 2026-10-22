---
name: thinking-budget-orchestrator
description: "Expert guide for dynamic thinking budget allocation across late-2026 frontier models — Grok 4.7, Composer 2.5, Gemini 4 Argon, GPT-5.6 Sol, Claude Sonnet 5.5, and Muse Wonder / Panduan ahli alokasi budget penalaran dinamis."
author: "Roedy Rustam"
version: "4.4.2"

---

# thinking-budget-orchestrator — vibes-plug Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream & Task Lifecycle**: `zero-to-prod-orchestrator` (Phase 4 AI agent integration), `brainstorming`, `session-memory-manager`.
- **Reasoning Scaling & Search**: `test-time-compute-optimizer` (MCTS & process reward models), `multi-agent-orchestration` (swarm reasoning budgets).
- **Frontier LLMs & Model Boosters**: `frontier-ai-models-expert` (Grok 4.7, Composer 2.5, Gemini 4 Argon, GPT-5.6 Sol, Claude Sonnet 5.5, Muse Wonder), `gemini-agent-booster` (native Gemini thinking allocation).
- **FinOps & Adaptive Execution**: `adaptive-model-cascade` (complexity threshold routing), `llm-finops-router` (cost tracking & budget caps), `kv-cache-prefix-optimizer` (cache locking).

### Description
Production architecture for dynamically allocating and controlling reasoning thinking tokens (Extended Thinking / Test-Time Compute) across late-2026 frontier models. Instead of static uniform token limits that either starve complex formal verifications or waste massive token budgets on simple queries, this skill evaluates structural task signals (AST blast radius, security boundaries, multi-agent topologies) and applies calibrated reasoning envelopes:
- `speed` (1K tokens): Ultra-fast AST checks, typos, documentation, and single unit tests (`Grok 4.7 High Fast`, `Composer 2.5 Fast`).
- `balanced` (8K tokens): Standard fullstack features, component assembly, and API contracts (`Gemini 4 Argon Medium`, `GPT-5.6 Sol Medium`, `Claude Opus 5.5 Medium`).
- `deep` (32K tokens): Multi-domain architecture refactoring, security audits, and generative UI synthesis (`Claude Sonnet 5.5 High`, `Claude Fable 5.1 High`, `Muse Wonder High`).
- `exhaustive` (64K tokens): Cryptographic proofs, SMT invariant solving, and distributed race-condition auditing (`Claude Sonnet 5.5 High`, `Gemini 4 Pro Deep Think`).

### Trigger Conditions
Activate this skill when:
- Designing prompt chains or agents utilizing models with thinking budget controls (e.g., `thinking: { type: "enabled", budget_tokens: N }` or `thinkingBudget: N`).
- Running multi-agent swarms where leaf worker agents require lightweight budgets while root critic agents require deep reasoning.
- Tuning inference latency and token expenditure across Grok 4.7, Gemini 4 Argon, GPT-5.6 Sol, Claude Sonnet 5.5, and Muse Wonder.
- Automating verification for high-consequence tasks (FinTech billing, cryptographic state machines, security audits).

---

### Core Concepts & Reasoning Profiles

```
TASK INGESTION
      │
      ▼
┌───────────────────────────┐
│ HEURISTIC COMPLEXITY AST  │  Extract signals: blast radius, keywords, dependencies
└─────────────┬─────────────┘
              │
  ┌───────────┼───────────┬───────────┐
  ▼           ▼           ▼           ▼
SPEED     BALANCED      DEEP      EXHAUSTIVE
(1,024)    (8,192)    (32,768)     (65,536)
  │           │           │           │
Grok 4.7 /  Gemini 4    Claude 5.5  Claude 5.5
Composer    Argon /     Sonnet /    Sonnet /
2.5 Fast    GPT-5.6 Sol Muse Wonder Gemini 4 Pro
```

#### 1. Token Budget Allocation Matrix

| Profile | Token Budget | Target Workload | Frontier Model Mapping |
|---|---|---|---|
| `speed` | 1,024 tokens | AST queries, documentation lookup, typos, single unit tests | Grok 4.7 High Fast / Composer 2.5 Fast |
| `balanced` | 8,192 tokens | Feature implementation, component assembly, standard CRUD | Gemini 4 Argon Medium / GPT-5.6 Sol Medium / Claude Opus 5.5 Medium |
| `deep` | 32,768 tokens | Architecture synthesis, cross-domain migrations, security audits, generative layout | Claude Sonnet 5.5 High / Claude Fable 5.1 High / Muse Wonder High |
| `exhaustive` | 65,536 tokens | Cryptographic verification, SMT invariant proving, distributed sagas | Claude Sonnet 5.5 High / Gemini 4 Pro Deep Think |

#### 2. Native Multi-Provider Payload Generation (TypeScript)

```typescript
export type ReasoningProfile = 'speed' | 'balanced' | 'deep' | 'exhaustive';

export interface ThinkingConfig {
  profile: ReasoningProfile;
  budgetTokens: number;
}

export const BUDGET_TOKENS: Record<ReasoningProfile, number> = {
  speed: 1024,
  balanced: 8192,
  deep: 32768,
  exhaustive: 65536,
};

export function resolveThinkingBudget(task: string, userOverride?: ReasoningProfile): ThinkingConfig {
  const profile = userOverride || detectTaskComplexity(task);
  return {
    profile,
    budgetTokens: BUDGET_TOKENS[profile] || BUDGET_TOKENS.balanced,
  };
}

function detectTaskComplexity(task: string): ReasoningProfile {
  const lower = task.toLowerCase();
  if (/(invariant|formal|pqc|smt|z3|crypto|zero-day|exploit|consensus)/.test(lower)) return 'exhaustive';
  if (/(security|audit|red-team|refactor|migration|payment|gateway|doku|stripe|generative-ui)/.test(lower)) return 'deep';
  if (/(typo|lint|format|doc|readme|comment|ast-scan)/.test(lower)) return 'speed';
  return 'balanced';
}

export function formatProviderThinkingPayload(
  provider: 'anthropic' | 'google' | 'openai' | 'xai',
  config: ThinkingConfig
) {
  switch (provider) {
    case 'anthropic':
      return {
        thinking: {
          type: 'enabled',
          budget_tokens: config.budgetTokens,
        },
      };
    case 'google':
      return {
        generationConfig: {
          thinkingConfig: {
            thinkingBudget: config.budgetTokens,
          },
        },
      };
    case 'openai':
      return {
        reasoning_effort: config.budgetTokens >= 32768 ? 'high' : config.budgetTokens >= 8192 ? 'medium' : 'low',
      };
    case 'xai':
      return {
        thinking_mode: config.budgetTokens >= 8192 ? 'system2' : 'fast',
      };
    default:
      return {};
  }
}
```

---

### Best Practices

1. **Leaf Workers Use `speed` Profile**: Subagents performing file inspections or running test commands should never consume >1K thinking tokens.
2. **Critics and Auditors Use `deep` Profile**: Subagents reviewing pull requests, auditing security boundaries, or validating type safety must receive 32K thinking envelopes.
3. **Guard High Budgets with Circuit Breakers**: If a deep thinking call fails twice, do not retry with 64K tokens; step down to balanced mode and log telemetry.
4. **Coordinate Thinking Budget with KV-Cache**: Place dynamic thinking envelopes inside request configs while keeping system prompt prefixes statically cached.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Hulu & Siklus Hidup Tugas**: `zero-to-prod-orchestrator` (Integrasi agen AI Fase 4), `brainstorming`, `session-memory-manager`.
- **Penskalaan Penalaran & Pencarian**: `test-time-compute-optimizer` (MCTS & process reward models), `multi-agent-orchestration` (budget penalaran swarm).
- **LLM Frontier & Booster Model**: `frontier-ai-models-expert` (Grok 4.7, Composer 2.5, Gemini 4 Argon, GPT-5.6 Sol, Claude Sonnet 5.5, Muse Wonder), `gemini-agent-booster` (alokasi thinking Gemini native).
- **FinOps & Eksekusi Adaptif**: `adaptive-model-cascade` (routing ambang kompleksitas), `llm-finops-router` (pelacakan biaya & batas anggaran), `kv-cache-prefix-optimizer` (penguncian cache).

### Deskripsi
Arsitektur produksi untuk mengalokasikan dan mengendalikan token penalaran (*Extended Thinking* / *Test-Time Compute*) secara dinamis di seluruh LLM frontier akhir 2026. Alih-alih menggunakan batas token statis seragam yang membuang biaya komputasi atau membatasi penalaran mendalam pada sistem kritis, skill ini mengevaluasi sinyal struktural tugas dan menerapkan profil reasoning terkalibrasi:
- `speed` (1K token): Pemindaian AST kilat, typo, dokumentasi, dan unit test tunggal (`Grok 4.7 High Fast`, `Composer 2.5 Fast`).
- `balanced` (8K token): Fitur fullstack standar, perakitan komponen, dan kontrak API (`Gemini 4 Argon Medium`, `GPT-5.6 Sol Medium`, `Claude Opus 5.5 Medium`).
- `deep` (32K token): Refaktor arsitektur lintas domain, audit keamanan, dan sintesis UI generatif (`Claude Sonnet 5.5 High`, `Claude Fable 5.1 High`, `Muse Wonder High`).
- `exhaustive` (64K token): Pembuktian invarian matematis/SMT dan audit race-condition terdistribusi (`Claude Sonnet 5.5 High`, `Gemini 4 Pro Deep Think`).

### Kondisi Pemicu
- Merancang alur agen yang memanfaatkan kontrol thinking budget native API.
- Menjalankan swarm multi-agen di mana subagen pelaksana membutuhkan budget ringan sedangkan agen auditor membutuhkan budget mendalam.
- Mengoptimalkan efisiensi biaya token dan latensi P99 pada pipeline AI enterprise.
- Memvalidasi logika berisiko tinggi (state machine finansial, billing SaaS, kriptografi).

### Implementasi Pola Kunci Alokasi Budget Penalaran (TypeScript)

```typescript
export type ProfilPenalaran = 'speed' | 'balanced' | 'deep' | 'exhaustive';

export interface KonfigurasiPenalaran {
  profil: ProfilPenalaran;
  budgetTokens: number;
}

export function tentukanBudgetPenalaran(deskripsiTugas: string): KonfigurasiPenalaran {
  const teks = deskripsiTugas.toLowerCase();

  // 1. Tugas formal matematika/kriptografi: Berikan budget maksimal
  if (/(invarian|formal|pqc|smt|z3|kriptografi|konsensus)/.test(teks)) {
    return { profil: 'exhaustive', budgetTokens: 65536 };
  }
  // 2. Audit keamanan, payment, UI generatif, dan migrasi arsitektur: Budget mendalam
  if (/(keamanan|audit|red-team|refaktor|migrasi|payment|doku|stripe|generative-ui)/.test(teks)) {
    return { profil: 'deep', budgetTokens: 32768 };
  }
  // 3. Perbaikan typo, formatting, dan dokumentasi: Budget super cepat
  if (/(typo|lint|format|dokumentasi|readme|ast-scan)/.test(teks)) {
    return { profil: 'speed', budgetTokens: 1024 };
  }
  // 4. Default pengembangan fitur fullstack: Budget seimbang
  return { profil: 'balanced', budgetTokens: 8192 };
}
```