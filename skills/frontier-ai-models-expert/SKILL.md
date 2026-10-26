---
name: frontier-ai-models-expert
description: "Frontier AI models orchestration (Grok 4.7, Gemini 4, Claude 5.5) / Orkestrasi model AI frontier (Grok 4.7, Gemini 4, Claude 5.5)."
author: "Roedy Rustam"
version: "4.4.4"

---

# frontier-ai-models-expert — vibes-plug Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Model Booster & Inference Engines**: `gemini-agent-booster`, `test-time-compute-optimizer`, `thinking-budget-orchestrator`
- **Multi-Draft & Synthesizer**: `speculative-multi-draft-synthesizer`, `living-codebase-ast-graph`, `ephemeral-wasm-sandbox-executor`
- **Frameworks & SDKs**: `vercel-ai-sdk-expert`, `pydantic-ai-expert`, `ai-llm-integration-expert`
- **Multimodal & Realtime Streaming**: `voice-ai-realtime-agent`, `affective-computing-emotion-ai`, `multimodal-spatial-video-cloner`
- **Prefix Caching & FinOps**: `kv-cache-prefix-optimizer`, `context-window-engineer`, `llm-finops-router`
- **Enterprise Safety & Governance**: `ai-safety-governance-expert`, `prompt-injection-firewall`, `anti-slop`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `brainstorming`, `session-memory-manager`

### Description
Comprehensive guide for late-2026 frontier AI models across all primary IDE execution tiers. Calibrates routing, reasoning budgets, context ingestion, and code generation across four standardized tiers:
1. **High Fast Tier (`Grok 4.7 High Fast`, `Grok 4.6 High Fast`)**: Sub-second Time-to-First-Token (TTFT), real-time web compute, and lightning-fast subagent review loops.
2. **Fast Tier (`Composer 2.5 Fast`)**: Cursor native multi-file AST diff generation and surgical file system edits.
3. **Medium / Balanced Tier (`Gemini 4 Argon Medium`, `GPT-5.6 Sol Medium`, `Claude Opus 5.5 Medium`)**: 2M+ monolithic context ingestion with native caching, strict JSON schema contracts, and balanced architectural refactoring.
4. **High / Extended Thinking Tier (`Claude Sonnet 5.5 High`, `Claude Fable 5.1 High`, `Muse Wonder High`, `Gemini 4 Pro / Project Astra`)**: Deep System-2 thinking budgets (up to 64K tokens), zero-defect fullstack craftsmanship, generative UI layout synthesis, and multimodal spatial reasoning.

### Trigger Conditions
Activate this skill when:
- Selecting or configuring models in modern IDEs (Cursor, Antigravity, Claude Code, Windsurf).
- Routing tasks across `High Fast`, `Fast`, `Medium`, and `High` model tiers.
- Integrating Grok 4.7, Composer 2.5, Gemini 4 Argon, GPT-5.6 Sol, Claude Sonnet 5.5, or Muse Wonder into agent workflows.
- Calibrating extended thinking budgets, KV-cache prefixing, or multi-file diff application pipelines.
- Building speculative multi-draft code synthesis engines or multi-agent swarms.

---

### Core Concepts & Tier Taxonomy

#### 1. The 4-Tier Frontier Execution Matrix

| Tier | Model Identifier | Primary Provider | Context Window | Thinking Support | Optimal Workload |
|---|---|---|---|---|---|
| **High Fast** | `Grok 4.7 High Fast` | xAI | 131,072 | Fast System-2 | Rapid test iterations, real-time web search grounding, sub-second code reviews |
| **High Fast** | `Grok 4.6 High Fast` | xAI | 131,072 | Lightweight | High-throughput batch AST scanning, linting auto-fixes, and syntax transforms |
| **Fast** | `Composer 2.5 Fast` | Cursor / Native | 128,000 | Diff Specialized | Multi-file unified diff generation, cross-file renames, and atomic patch application |
| **Medium** | `Gemini 4 Argon Medium` | Google DeepMind | 2,097,152 | Balanced (`thinkingConfig`) | Monolithic repository ingestion, persistent context caching, balanced feature work |
| **Medium** | `GPT-5.6 Sol Medium` | OpenAI | 262,144 | Balanced (`reasoning_effort`) | Strict JSON schema extraction, OpenAPI tool calling, and spec-driven development |
| **Medium** | `Claude Opus 5.5 Medium` | Anthropic | 200,000 | Balanced (up to 16K) | Architectural system refactoring, cross-domain logic validation, clean code audit |
| **High** | `Claude Sonnet 5.5 High` | Anthropic | 200,000 | Extended (up to 64K) | Flagship fullstack coding, complex type system engineering, formal verification |
| **High** | `Claude Fable 5.1 High` | Anthropic | 200,000 | Extended (up to 32K) | Cost-optimized agentic workflows, long multi-turn swarms with heavy cache reuse |
| **High** | `Muse Wonder High` | Muse / Frontier | 131,072 | Exploratory Reasoning | Generative UI composition, visual layout brainstorming, dynamic motion physics |
| **High** | `Gemini 4 Pro` | Google DeepMind | 2,097,152+ | Exhaustive (up to 64K) | Monolithic codebase analysis, formal SMT invariant proving, spatial video cloner |

#### 2. Availability Fallback Matrix (Graceful Degradation Protocol)

When a late-2026 frontier model is pending regional provisioning, temporarily quota-throttled, or unavailable in the environment, the swarm enforces automatic, non-disruptive fallback:

| Target Frontier Model | Fallback Target | Fallback Rationale & Preserved Guarantees |
|---|---|---|
| **`Gemini 4 Argon Medium`** | **`Gemini 3.8 Flash`** | Preserves 1M+ context window, native context caching (`cachedContent`), and sub-100ms TTFT. |
| **`Gemini 4 Pro High`** | **`Gemini 3.8 Flash`** | Preserves monolithic context ingestion and dynamic thinking budget control. |
| **`Claude Opus 5.5 Medium`** | **`Claude Opus 4.6`** | Preserves deep architectural comprehension, cross-domain logic validation, and formal refactoring rigor. |
| **`Grok 4.7 High Fast`** | **`Grok 4.6 High Fast`** | Preserves sub-second TTFT and low-latency AST scanning loops. |
| **`Composer 2.5 Fast`** | **`Grok 4.6 High Fast`** | Fallback for non-Cursor environments to generate unified diff patches. |

---

### Implementation Blueprints

#### 1. Grok 4.7 High Fast: Streaming Low-TTFT Agentic Loop

```typescript
import OpenAI from 'openai';

export interface GrokAgentOptions {
  apiKey: string;
  enableSearch?: boolean;
}

export class GrokFastAgent {
  private client: OpenAI;

  constructor(options: GrokAgentOptions) {
    this.client = new OpenAI({
      apiKey: options.apiKey,
      baseURL: 'https://api.x.ai/v1',
    });
  }

  async executeFastAudit(filePath: string, sourceCode: string): Promise<string> {
    const stream = await this.client.chat.completions.create({
      model: 'grok-4-7-high-fast',
      stream: true,
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: 'You are Grok 4.7 High Fast. Provide instant, high-precision AST code critique. Identify vulnerabilities, performance bottlenecks, and type inconsistencies with zero conversational fluff.',
        },
        {
          role: 'user',
          content: `Audit target file [${filePath}]:\n\n\`\`\`typescript\n${sourceCode}\n\`\`\``,
        },
      ],
    });

    let result = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? '';
      result += content;
    }
    return result;
  }
}
```

#### 2. Composer 2.5 Fast: Multi-File Unified Diff Engine

```typescript
export interface FilePatch {
  filePath: string;
  originalContent: string;
  modifiedContent: string;
}

export interface UnifiedDiffResult {
  filePath: string;
  diffText: string;
  hasChanges: boolean;
}

export class ComposerDiffEngine {
  generateUnifiedDiff(patch: FilePatch): UnifiedDiffResult {
    const origLines = patch.originalContent.split('\n');
    const modLines = patch.modifiedContent.split('\n');

    if (patch.originalContent === patch.modifiedContent) {
      return { filePath: patch.filePath, diffText: '', hasChanges: false };
    }

    const diffLines: string[] = [
      `--- a/${patch.filePath}`,
      `+++ b/${patch.filePath}`,
    ];

    let i = 0;
    let j = 0;
    while (i < origLines.length || j < modLines.length) {
      if (i < origLines.length && j < modLines.length && origLines[i] === modLines[j]) {
        diffLines.push(` ${origLines[i]}`);
        i++;
        j++;
      } else if (j < modLines.length && (i >= origLines.length || !origLines.slice(i).includes(modLines[j]))) {
        diffLines.push(`+${modLines[j]}`);
        j++;
      } else if (i < origLines.length) {
        diffLines.push(`-${origLines[i]}`);
        i++;
      }
    }

    return {
      filePath: patch.filePath,
      diffText: diffLines.join('\n'),
      hasChanges: true,
    };
  }
}
```

#### 3. Gemini 4 Argon Medium: Monolithic Context Caching

```typescript
import { GoogleGenAI } from '@google/genai';

export interface RepositoryContext {
  files: Array<{ path: string; content: string }>;
}

export async function queryGeminiArgon(
  repo: RepositoryContext,
  query: string,
  apiKey: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const serializedRepo = repo.files
    .map((f) => `// File: ${f.path}\n${f.content}\n`)
    .join('\n\n');

  // Utilize native context caching for 2M+ tokens with 75-90% read discount
  const cache = await ai.cachedContents.create({
    model: 'gemini-4-argon-medium',
    contents: [{ role: 'user', parts: [{ text: serializedRepo }] }],
    ttl: '7200s',
  });

  const response = await ai.models.generateContent({
    model: 'gemini-4-argon-medium',
    contents: [{ role: 'user', parts: [{ text: query }] }],
    config: {
      cachedContent: cache.name,
      thinkingConfig: {
        thinkingBudget: 8192,
      },
    },
  });

  return response.text ?? '';
}
```

#### 4. Claude Sonnet 5.5 High: Extended Thinking & Ephemeral Prompt Caching

```typescript
import Anthropic from '@anthropic-ai/sdk';

export interface ExtendedThinkingTask {
  systemContract: string;
  architectureSpec: string;
  prompt: string;
  thinkingBudgetTokens?: number;
}

export async function executeSonnetHighCraftsman(
  task: ExtendedThinkingTask,
  apiKey: string
): Promise<string> {
  const anthropic = new Anthropic({ apiKey });
  const budget = task.thinkingBudgetTokens ?? 32768;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5.5-20261022',
    max_tokens: 64000,
    thinking: {
      type: 'enabled',
      budget_tokens: budget,
    },
    system: [
      {
        type: 'text',
        text: task.systemContract,
      },
      {
        type: 'text',
        text: task.architectureSpec,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: task.prompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text : '';
}
```

#### 5. GPT-5.6 Sol Medium: Strict JSON Contracts & Tool Calls

```typescript
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

export const ArchitecturalDecisionSchema = z.object({
  componentName: z.string(),
  riskTier: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  dependencies: z.array(z.string()),
  interfaceSignature: z.string(),
  invariants: z.array(z.string()),
});

export type ArchitecturalDecision = z.infer<typeof ArchitecturalDecisionSchema>;

export async function extractStrictContract(
  specText: string,
  apiKey: string
): Promise<ArchitecturalDecision> {
  const openai = new OpenAI({ apiKey });

  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-5.6-sol-medium',
    messages: [
      {
        role: 'system',
        content: 'You are GPT-5.6 Sol. Extract strict architectural contracts adhering to zero-slop specifications.',
      },
      { role: 'user', content: specText },
    ],
    response_format: zodResponseFormat(ArchitecturalDecisionSchema, 'decision'),
  });

  const parsed = completion.choices[0]?.message.parsed;
  if (!parsed) {
    throw new Error('Failed to parse structured response from GPT-5.6 Sol');
  }
  return parsed;
}
```

#### 6. Muse Wonder High: Exploratory Generative UI Synthesis

```typescript
export interface GenerativeUIConcept {
  layoutPattern: 'bento' | 'split-rail' | 'spatial-card' | 'dock-centered';
  motionCurve: string;
  paletteTokens: Record<string, string>;
  interactionStates: string[];
}

export function buildMuseWonderUIBlueprint(intent: string): GenerativeUIConcept {
  // Generative UI concept mapping tailored for exploratory design
  return {
    layoutPattern: intent.includes('dashboard') ? 'bento' : 'spatial-card',
    motionCurve: 'cubic-bezier(0.16, 1, 0.3, 1)',
    paletteTokens: {
      surfacePrimary: '#0A0D14',
      surfaceSecondary: '#141824',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      accentGlow: 'rgba(59, 130, 246, 0.25)',
      textTabular: 'tabular-nums font-mono text-sm',
    },
    interactionStates: ['idle', 'hover', 'active', 'focused', 'disabled'],
  };
}
```

---

### Best Practices

1. **Use `High Fast` for Outer Tight Loops**: Deploy Grok 4.7 or Grok 4.6 for quick AST scans, test assertions, and validation gates before initiating heavier tasks.
2. **Use `Composer 2.5 Fast` for Atomic File Mutations**: Let Composer 2.5 handle surgical multi-file unified diff generation and patch applications to avoid AST disruption.
3. **Use `Gemini 4 Argon` for Repositories >100K Tokens**: Ingest the entire codebase into Gemini 4 Argon's 2M+ context window with `cachedContent` to preserve full dependency topology without lossy RAG chunking.
4. **Use `Claude Sonnet 5.5 High` for Core Production Code**: Direct all primary production feature development, complex type construction, and security-critical algorithms to Sonnet 5.5 with calibrated thinking budgets (8K–32K).
5. **Use `GPT-5.6 Sol` for External API Schemas**: Leverage GPT-5.6 Sol when converting unstructured specifications into strict OpenAPI schemas or Zod contracts.
6. **Use `Muse Wonder High` for Design Explorations**: Leverage Muse Wonder when brainstorming novel UX interactions, generative UI components, and dynamic micro-animations.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec frontier-ai-models-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Booster Model & Engine Inferensi**: `gemini-agent-booster`, `test-time-compute-optimizer`, `thinking-budget-orchestrator`
- **Sintesis Multi-Draf & Validator**: `speculative-multi-draft-synthesizer`, `living-codebase-ast-graph`, `ephemeral-wasm-sandbox-executor`
- **Framework & SDK**: `vercel-ai-sdk-expert`, `pydantic-ai-expert`, `ai-llm-integration-expert`
- **Streaming Multimodal & Realtime**: `voice-ai-realtime-agent`, `affective-computing-emotion-ai`, `multimodal-spatial-video-cloner`
- **Caching Prefix & FinOps**: `kv-cache-prefix-optimizer`, `context-window-engineer`, `llm-finops-router`
- **Keamanan & Tata Kelola Enterprise**: `ai-safety-governance-expert`, `prompt-injection-firewall`, `anti-slop`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `brainstorming`, `session-memory-manager`

### Deskripsi
Panduan komprehensif integrasi model AI frontier akhir 2026 di seluruh tier eksekusi IDE modern. Mengalibrasi perutean (*routing*), anggaran penalaran (*thinking budgets*), ingesti konteks, dan pembentukan kode ke dalam empat tier standar:
1. **Tier High Fast (`Grok 4.7 High Fast`, `Grok 4.6 High Fast`)**: Time-to-First-Token (TTFT) sub-detik, komputasi web real-time, dan siklus review subagen secepat kilat.
2. **Tier Fast (`Composer 2.5 Fast`)**: Pembuat diff AST multi-file native Cursor dan mutasi sistem file yang presisi secara bedah.
3. **Tier Medium / Seimbang (`Gemini 4 Argon Medium`, `GPT-5.6 Sol Medium`, `Claude Opus 5.5 Medium`)**: Ingesti konteks monolitik 2M+ dengan caching native, kepatuhan skema JSON ketat, dan refaktor arsitektur seimbang.
4. **Tier High / Penalaran Mendalam (`Claude Sonnet 5.5 High`, `Claude Fable 5.1 High`, `Muse Wonder High`, `Gemini 4 Pro / Project Astra`)**: Anggaran penalaran System-2 mendalam (hingga 64K token), pengkodean fullstack tanpa cacat, eksplorasi desain UI generatif, dan penalaran spasial multimodal.

### Kondisi Pemicu
Aktifkan skill ini ketika:
- Memilih atau mengonfigurasi model pada IDE modern (Cursor, Antigravity, Claude Code, Windsurf).
- Merutekan tugas di seluruh tier model `High Fast`, `Fast`, `Medium`, dan `High`.
- Mengintegrasikan Grok 4.7, Composer 2.5, Gemini 4 Argon, GPT-5.6 Sol, Claude Sonnet 5.5, atau Muse Wonder ke alur agen.
- Mengalibrasi budget penalaran, penguncian prefix cache KV, atau generator diff multi-file.
- Membangun mesin sintesis draf spekulatif atau swarm multi-agen.

---

### Matriks Taksonomi 4-Tier Model Frontier

| Tier | Nama Model | Penyedia Utama | Window Konteks | Dukungan Penalaran | Beban Kerja Optimal |
|---|---|---|---|---|---|
| **High Fast** | `Grok 4.7 High Fast` | xAI | 131.072 | System-2 Cepat | Iterasi tes cepat, pencarian web real-time, audit kode sub-detik |
| **High Fast** | `Grok 4.6 High Fast` | xAI | 131.072 | Ringan | Pemindaian AST throughput tinggi, auto-fix linter, transformasi sintaks |
| **Fast** | `Composer 2.5 Fast` | Cursor / Native | 128.000 | Khusus Diff | Pembuatan diff multi-file, rename simbol lintas-file, aplikasi patch atomik |
| **Medium** | `Gemini 4 Argon Medium` | Google DeepMind | 2.097.152 | Seimbang (`thinkingConfig`) | Ingesti repositori monolitik, caching konteks persisten, fitur standar |
| **Medium** | `GPT-5.6 Sol Medium` | OpenAI | 262.144 | Seimbang (`reasoning_effort`) | Ekstraksi skema JSON ketat, eksekusi tool OpenAPI, spec-driven dev |
| **Medium** | `Claude Opus 5.5 Medium` | Anthropic | 200.000 | Seimbang (hingga 16K) | Refaktor arsitektur sistem, validasi logika lintas domain, audit clean code |
| **High** | `Claude Sonnet 5.5 High` | Anthropic | 200.000 | Diperluas (hingga 64K) | Kode fullstack unggulan, rekayasa sistem tipe kompleks, verifikasi formal |
| **High** | `Claude Fable 5.1 High` | Anthropic | 200.000 | Diperluas (hingga 32K) | Alur agen hemat biaya, swarm multi-putaran panjang dengan cache tinggi |
| **High** | `Muse Wonder High` | Muse / Frontier | 131.072 | Penalaran Eksploratif | Komposisi UI generatif, eksplorasi layout visual, fisika motion dinamis |
| **High** | `Gemini 4 Pro` | Google DeepMind | 2.097.152+ | Lengkap (hingga 64K) | Analisis repositori monolitik, pembuktian invarian SMT, kloning video spasial |

#### 2. Matriks Pengalihan Ketersediaan (Protokol Degradasi Anggun)

Ketika model frontier belum tersedia di region/lingkungan pengguna atau mengalami pembatasan kuota, swarm secara otomatis mengalihkan tugas tanpa gangguan eksekusi:

| Model Frontier Utama | Model Pengalihan (Fallback) | Alasan & Jaminan yang Dipertahankan |
|---|---|---|
| **`Gemini 4 Argon Medium`** | **`Gemini 3.8 Flash`** | Mempertahankan context window 1M+, caching konteks native (`cachedContent`), dan TTFT sub-100ms. |
| **`Gemini 4 Pro High`** | **`Gemini 3.8 Flash`** | Mempertahankan ingesti konteks monolitik dan kontrol budget penalaran dinamis. |
| **`Claude Opus 5.5 Medium`** | **`Claude Opus 4.6`** | Mempertahankan pemahaman arsitektur mendalam, validasi logika lintas domain, dan ketelitian refaktor formal. |
| **`Grok 4.7 High Fast`** | **`Grok 4.6 High Fast`** | Mempertahankan TTFT sub-detik dan loop pemindaian AST latensi rendah. |
| **`Composer 2.5 Fast`** | **`Grok 4.6 High Fast`** | Pengalihan di luar lingkungan Cursor untuk menghasilkan patch unified diff. |

---

### Panduan Praktik Terbaik

1. **Gunakan `High Fast` untuk Loop Iterasi Cepat**: Kerahkan Grok 4.7 atau Grok 4.6 untuk pemindaian AST awal, eksekusi unit test, dan validasi linter sebelum masuk ke tugas yang lebih berat.
2. **Gunakan `Composer 2.5 Fast` untuk Mutasi File Atomik**: Serahkan pembuatan unified diff multi-file dan aplikasi patch ke Composer 2.5 agar modifikasi file berlangsung aman tanpa merusak struktur kode.
3. **Gunakan `Gemini 4 Argon` untuk Proyek >100K Token**: Muat seluruh repositori ke context window 2M+ Gemini 4 Argon dengan `cachedContent` untuk mempertahankan seluruh relasi simbol tanpa terpotong oleh RAG.
4. **Gunakan `Claude Sonnet 5.5 High` untuk Kode Produksi Utama**: Percayakan logika bisnis inti, arsitektur domain, dan sistem tipe TypeScript yang ketat pada Sonnet 5.5 dengan budget penalaran terkalibrasi.
5. **Gunakan `GPT-5.6 Sol` untuk Skema API Eksternal**: Manfaatkan ketepatan ekstraksi skema GPT-5.6 Sol untuk kontrak OpenAPI dan skema Zod yang deterministik.
6. **Gunakan `Muse Wonder High` untuk Eksplorasi Desain UI**: Manfaatkan penalaran divergen Muse Wonder saat merancang antarmuka generatif dan kurva animasi mikro yang memikat pengguna.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec frontier-ai-models-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
