---
name: adaptive-model-cascade
description: "Model cascading & complexity-scored routing (Grok, Gemini, Claude) / Routing kaskade model & scoring kompleksitas (Grok, Gemini, Claude)."
author: "Roedy Rustam"
version: "4.4.4"

---

# adaptive-model-cascade — vibes-plug Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream & Orchestration**: `zero-to-prod-orchestrator` (Phase 4 AI integration), `brainstorming`, `session-memory-manager`.
- **FinOps & Routing Gateways**: `llm-finops-router` (ROI tracking & cost caps), `llm-observability-expert` (cascade decisions, escalations, & tracing).
- **Frontier Models & Context Engineering**: `frontier-ai-models-expert` (model tier scoring & benchmarks), `context-window-engineer` (context threshold overflow routing), `kv-cache-prefix-optimizer` (tier prefix cache locking).
- **Inference & Compute Orchestration**: `test-time-compute-optimizer` (dynamic reasoning tokens during escalation), `ai-llm-integration-expert`, `vercel-ai-sdk-expert` (multi-provider cascade fallbacks).

### Description
Production architecture for routing AI requests to the optimal model tier based on real-time task complexity assessment. Instead of sending every request to the most expensive frontier model, this skill implements an intelligent cascade across four late-2026 tiers:
1. **Fast Tier (`Composer 2.5 Fast`, `Grok 4.6 High Fast`)**: Rapid multi-file diff application, single-file AST scans, and simple syntax transformations.
2. **High Fast Tier (`Grok 4.7 High Fast`)**: Sub-second TTFT, real-time web groundings, and rapid test-assert loops.
3. **Medium Tier (`Gemini 4 Argon Medium`, `GPT-5.6 Sol Medium`, `Claude Opus 5.5 Medium`)**: 2M+ monolithic repository ingestion, strict JSON schema contracts, and balanced CRUD feature implementations.
4. **High Tier (`Claude Sonnet 5.5 High`, `Claude Fable 5.1 High`, `Muse Wonder High`, `Gemini 4 Pro`)**: Extended System-2 thinking (up to 64K tokens), formal verification, mission-critical architectural synthesis, and exploratory generative UI design.

Achieves 45–70% cost reduction for typical production workloads where 60–80% of tasks do not require maximum reasoning compute.

### Trigger Conditions
Activate this skill when:
- Running AI features in production with significant token spend (>$500/month).
- Building applications where response latency and cost vary across task complexities.
- Routing IDE and agent tasks dynamically across Grok 4.7, Composer 2.5, Gemini 4 Argon, GPT-5.6 Sol, Claude Sonnet 5.5, and Muse Wonder.
- Designing self-healing escalation loops with fast heuristic quality gates.

---

### Core Concepts & Patterns

#### 1. The 4-Tier Model Cascade Architecture

```
USER REQUEST
      │
      ▼
┌───────────────────────────┐
│ COMPLEXITY SCORER         │  Classify task signals: FAST / HIGH_FAST / MEDIUM / HIGH
│ (Heuristic AST Evaluator) │
└─────────────┬─────────────┘
              │
              ├── FAST ─────────► Composer 2.5 Fast / Grok 4.6 ($0.10/1M)
              │                        │
              │                   ┌────▼────┐
              │                   │ QUALITY │  Pass? → Return response
              │                   │ GATE    │  Fail? → Escalate to HIGH_FAST
              │                   └─────────┘
              │
              ├── HIGH_FAST ────► Grok 4.7 High Fast ($0.50/1M)
              │                        │
              │                   ┌────▼────┐
              │                   │ QUALITY │  Pass? → Return response
              │                   │ GATE    │  Fail? → Escalate to MEDIUM
              │                   └─────────┘
              │
              ├── MEDIUM ───────► Gemini 4 Argon / GPT-5.6 Sol / Claude Opus 5.5 ($1.25/1M)
              │                        │
              │                   ┌────▼────┐
              │                   │ QUALITY │  Pass? → Return response
              │                   │ GATE    │  Fail? → Escalate to HIGH
              │                   └─────────┘
              │
              └── HIGH ─────────► Claude Sonnet 5.5 / Fable 5.1 / Muse Wonder ($3.00/1M)
                                       │
                                  Return response (Apex tier, no escalation)
```

#### 2. Complexity Scorer (TypeScript Implementation)

```typescript
export type CascadeTier = 'FAST' | 'HIGH_FAST' | 'MEDIUM' | 'HIGH';

export interface ComplexitySignals {
  tokenCount: number;
  hasCodeGeneration: boolean;
  requiresReasoning: boolean;
  hasMultiStep: boolean;
  domainSpecificity: 'general' | 'technical' | 'mission_critical';
  requiresCreativity: boolean;
  hasToolCalls: boolean;
  contextSize: number;
}

export function scoreComplexity(signals: ComplexitySignals): CascadeTier {
  let score = 0;

  if (signals.tokenCount > 2000) score += 1;
  if (signals.tokenCount > 8000) score += 2;
  if (signals.hasCodeGeneration) score += 2;
  if (signals.requiresReasoning) score += 2;
  if (signals.hasMultiStep) score += 1;
  if (signals.domainSpecificity === 'technical') score += 1;
  if (signals.domainSpecificity === 'mission_critical') score += 3;
  if (signals.requiresCreativity) score += 1;
  if (signals.hasToolCalls) score += 1;
  if (signals.contextSize > 100_000) score += 1;
  if (signals.contextSize > 500_000) score += 2;

  if (score <= 2) return 'FAST';
  if (score <= 5) return 'HIGH_FAST';
  if (score <= 8) return 'MEDIUM';
  return 'HIGH';
}
```

#### 3. Heuristic Quality Gate Evaluator

```typescript
export interface QualityGateResult {
  passed: boolean;
  score: number;
  reasons: string[];
}

export async function evaluateQualityGate(
  request: string,
  response: string,
  tier: CascadeTier
): Promise<QualityGateResult> {
  const checks: Array<{ name: string; passed: boolean }> = [];

  // 1. Substance check: response has meaningful length and is not a refusal
  const hasSubstance = response.trim().length > 50 && !response.includes("I cannot assist");
  checks.push({ name: 'substance', passed: hasSubstance });

  // 2. Code integrity check: if code was requested, verify balanced code fences
  if (/code|function|interface|class|implementation/i.test(request)) {
    const codeBlockCount = (response.match(/```/g) || []).length;
    const hasBalancedFences = codeBlockCount > 0 && codeBlockCount % 2 === 0;
    checks.push({ name: 'code_fences_balanced', passed: hasBalancedFences });
  }

  // 3. Anti-Slop verification: zero placeholder markers
  const hasNoPlaceholders = !/\/\/\s*(TODO|FIXME|\.\.\.rest of code)/i.test(response);
  checks.push({ name: 'no_placeholders', passed: hasNoPlaceholders });

  // 4. Tier-proportional length threshold
  const minExpectedLength = tier === 'FAST' ? 80 : tier === 'HIGH_FAST' ? 160 : tier === 'MEDIUM' ? 320 : 600;
  const adequateLength = response.length >= minExpectedLength;
  checks.push({ name: 'adequate_length', passed: adequateLength });

  const passedCount = checks.filter((c) => c.passed).length;
  const score = passedCount / checks.length;
  const failedReasons = checks.filter((c) => !c.passed).map((c) => c.name);

  return {
    passed: score >= 0.75,
    score,
    reasons: failedReasons,
  };
}
```

#### 4. Cascade Router with Escalation

```typescript
import { generateText } from 'ai';

export interface ModelTierConfig {
  tier: CascadeTier;
  modelId: string;
  provider: string;
  costPer1MTokens: number;
  fallbackModelId?: string;
  fallbackProvider?: string;
}

export const CASCADE_TIERS: ModelTierConfig[] = [
  { tier: 'FAST', modelId: 'composer-2.5-fast', provider: 'cursor', costPer1MTokens: 0.10, fallbackModelId: 'grok-4.6-high-fast', fallbackProvider: 'xai' },
  { tier: 'HIGH_FAST', modelId: 'grok-4.7-high-fast', provider: 'xai', costPer1MTokens: 0.50, fallbackModelId: 'grok-4.6-high-fast', fallbackProvider: 'xai' },
  { tier: 'MEDIUM', modelId: 'gemini-4-argon-medium', provider: 'google', costPer1MTokens: 0.80, fallbackModelId: 'gemini-3.8-flash', fallbackProvider: 'google' },
  { tier: 'HIGH', modelId: 'claude-sonnet-5.5-high', provider: 'anthropic', costPer1MTokens: 3.00, fallbackModelId: 'claude-opus-4.6', fallbackProvider: 'anthropic' },
];

export const AVAILABILITY_FALLBACK_MATRIX: Record<string, { fallbackModel: string; fallbackProvider: string; reason: string }> = {
  'gemini-4-argon-medium': { fallbackModel: 'gemini-3.8-flash', fallbackProvider: 'google', reason: 'Gemini 4 not yet available / regional quota limit' },
  'gemini-4-pro': { fallbackModel: 'gemini-3.8-flash', fallbackProvider: 'google', reason: 'Gemini 4 not yet available / regional quota limit' },
  'claude-opus-5.5-medium': { fallbackModel: 'claude-opus-4.6', fallbackProvider: 'anthropic', reason: 'Claude Opus 5.5 not yet available / tier fallback' },
};

const TIER_SEQUENCE: CascadeTier[] = ['FAST', 'HIGH_FAST', 'MEDIUM', 'HIGH'];

export async function cascadeRequest(
  prompt: string,
  signals: ComplexitySignals,
  systemPrompt: string,
  providerResolver: (provider: string, modelId: string) => any
): Promise<{ text: string; modelId: string; tier: CascadeTier; escalations: number; fellback: boolean }> {
  const initialTier = scoreComplexity(signals);
  const startIndex = TIER_SEQUENCE.indexOf(initialTier);
  let escalations = 0;

  for (let i = startIndex; i < CASCADE_TIERS.length; i++) {
    const tierConfig = CASCADE_TIERS[i];
    let activeModelId = tierConfig.modelId;
    let activeProvider = tierConfig.provider;
    let fellback = false;

    let result;
    try {
      result = await generateText({
        model: providerResolver(activeProvider, activeModelId),
        system: systemPrompt,
        prompt,
      });
    } catch (error) {
      // Automatic availability fallback (e.g. Gemini 4 -> Gemini 3.8 Flash, Claude Opus 5.5 -> Claude Opus 4.6)
      if (tierConfig.fallbackModelId && tierConfig.fallbackProvider) {
        console.warn(`[Cascade] Primary model ${activeModelId} unavailable, falling back to ${tierConfig.fallbackModelId}...`);
        activeModelId = tierConfig.fallbackModelId;
        activeProvider = tierConfig.fallbackProvider;
        fellback = true;
        result = await generateText({
          model: providerResolver(activeProvider, activeModelId),
          system: systemPrompt,
          prompt,
        });
      } else {
        throw error;
      }
    }

    const quality = await evaluateQualityGate(prompt, result.text, tierConfig.tier);

    if (quality.passed || i === CASCADE_TIERS.length - 1) {
      return {
        text: result.text,
        modelId: activeModelId,
        tier: tierConfig.tier,
        escalations,
        fellback,
      };
    }

    escalations++;
  }

  throw new Error('All cascade model tiers exhausted');
}
```

---

### Best Practices

1. **Start with the Fastest Feasible Tier**: Attempt surgical edits using Composer 2.5 Fast or Grok 4.7 High Fast before escalating to high-budget models.
2. **Deterministic Heuristic Quality Gates**: Gates must evaluate in <50ms using regex and structural checks. Never call another LLM as a quality gate.
3. **Persist Escalation Telemetry**: Track which prompt clusters frequently trigger escalations to automatically bias their future initial routing towards Medium or High.
4. **Lock KV-Cache Prefixes Across Tiers**: Ensure all tiers share byte-identical system prompt prefixes to maximize upstream provider prompt caching.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec adaptive-model-cascade <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Hulu & Orkestrasi**: `zero-to-prod-orchestrator` (Integrasi AI Fase 4), `brainstorming`, `session-memory-manager`.
- **FinOps & Gateway Routing**: `llm-finops-router` (pelacakan ROI & batas biaya), `llm-observability-expert` (keputusan kaskade, eskalasi, & tracing).
- **Model Frontier & Rekayasa Konteks**: `frontier-ai-models-expert` (skor tier model & tolok ukur), `context-window-engineer` (routing luapan batas konteks), `kv-cache-prefix-optimizer` (penguncian cache prefix tier).
- **Inferensi & Orkestrasi Komputasi**: `test-time-compute-optimizer` (token penalaran dinamis saat eskalasi), `ai-llm-integration-expert`, `vercel-ai-sdk-expert` (fallback kaskade multi-provider).

### Deskripsi
Arsitektur produksi untuk merutekan permintaan AI ke tier model optimal berdasarkan penilaian kompleksitas tugas secara real-time. Alih-alih mengirim seluruh prompt ke model termahal, skill ini menerapkan kaskade cerdas melintasi empat tier frontier akhir 2026:
1. **Tier Fast (`Composer 2.5 Fast`, `Grok 4.6 High Fast`)**: Aplikasi diff multi-file cepat, pemindaian AST satu file, dan transformasi sintaks sederhana.
2. **Tier High Fast (`Grok 4.7 High Fast`)**: TTFT sub-detik, pencarian web real-time, dan loop validasi tes kilat.
3. **Tier Medium (`Gemini 4 Argon Medium`, `GPT-5.6 Sol Medium`, `Claude Opus 5.5 Medium`)**: Ingesti repositori monolitik 2M+, kontrak skema JSON ketat, dan implementasi fitur standar.
4. **Tier High (`Claude Sonnet 5.5 High`, `Claude Fable 5.1 High`, `Muse Wonder High`, `Gemini 4 Pro`)**: Penalaran System-2 mendalam (hingga 64K token), verifikasi formal, arsitektur misi-kritis, dan desain UI generatif.

### Kondisi Pemicu
Aktifkan skill ini ketika:
- Menjalankan beban kerja produksi AI dengan biaya token substansial (>$500/bulan).
- Merutekan tugas agen secara dinamis melintasi Grok 4.7, Composer 2.5, Gemini 4 Argon, GPT-5.6 Sol, Claude Sonnet 5.5, dan Muse Wonder.
- Membangun alur eskalasi mandiri dengan gerbang kualitas berbasis heuristik instan.

### Panduan Praktik Terbaik
1. **Mulai dari Tier Tercepat yang Memadai**: Lakukan modifikasi kode dengan Composer 2.5 Fast atau Grok 4.7 High Fast sebelum beralih ke tier ber-budget tinggi.
2. **Gerbang Kualitas Heuristik Deterministic**: Evaluasi kualitas harus selesai dalam <50ms menggunakan regex dan validasi struktur sintaks, tanpa panggilan LLM tambahan.
3. **Kunci Prefix KV-Cache**: Pastikan prefix prompt sistem identik byte-for-byte antar-tier agar provider caching bekerja optimal.
4. **Protokol Pengalihan Ketersediaan (Availability Fallback)**:
   - Jika `Gemini 4 Argon` atau `Gemini 4 Pro` belum tersedia atau mengalami limit kuota regional, alihkan tugas secara instan ke **`Gemini 3.8 Flash`** (mempertahankan 1M+ konteks dan latensi sub-100ms).
   - Jika `Claude Opus 5.5` belum tersedia, alihkan tugas secara instan ke **`Claude Opus 4.6`** (mempertahankan ketelitian pemahaman arsitektur).
   - Pastikan agen tidak pernah berhenti karena error model tidak ditemukan.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec adaptive-model-cascade <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
