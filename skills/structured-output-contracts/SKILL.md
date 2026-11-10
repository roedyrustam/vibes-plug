---
name: structured-output-contracts
description: "Strict JSON Schema structured outputs and MCP contract enforcement / Penegakan kontrak output terstruktur JSON Schema ketat dan MCP."
author: "Roedy Rustam"
version: "4.7.2"

---

# structured-output-contracts — vibes-plug Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Contracts & Spec Engineering**: `spec-driven-development-expert`, `openapi-swagger-codegen-expert`, `typescript-expert`
- **MCP & Protocol Schemas**: `mcp-server-architect`, `mcp-sampling-critic`, `parallel-tool-orchestrator`
- **AI Agent Frameworks**: `vercel-ai-sdk-expert`, `pydantic-ai-expert`, `multi-agent-orchestration`
- **Quality & Anti-Slop**: `anti-slop`, `ai-code-review-autonomous`, `formal-spec-z3-verifier`
- **Lifecycle & Memory**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production standard for enforcing strict JSON Schema output contracts across frontier LLMs. With modern models supporting grammar-constrained decoding (e.g. `response_format: { type: "json_schema", strict: true }` or Gemini `responseSchema`), AI agents must not rely on loose Markdown backticks (```json ... ```) with post-hoc regex parsing. This skill formalizes typed JSON schemas for Swarm Director plans, memory handoffs, anti-slop verification audits, and exposes them as native Model Context Protocol (MCP) resources (`vibes://schemas/*`).

### Hard Guardrails (Declarative Invariants)
- **Grammar-Constrained Decoding Enforcement**: LLM tool and agent invocations requiring structured data MUST declare native schema constraints (`response_format: { type: "json_schema", strict: true }` or Vercel AI SDK `generateObject({ schema })`). Fragile markdown backtick extraction (`replace(/```json/...)`) without parser validation is strictly prohibited.
- **Explicit Schema Closedness (`additionalProperties: false`)**: All output JSON Schemas must set `additionalProperties: false` to block hallucinated extraneous properties from entering mission-critical execution pipelines.
- **Strict Nullability & Required Array Invariant**: In strict schema mode, every defined property must be explicitly enumerated in the `required` array. Truly optional properties must be declared with explicit union nullability (e.g. `type: ['string', 'null']`).
- **Fail-Fast Schema Validation Gate**: All JSON payloads received from external models or subagents must undergo immediate schema parsing (via Zod `schema.parse()` or Pydantic `model_validate()`) before being forwarded to database mutations or payments.

### Non-Functional Requirements (NFR Contract)
- **Schema Validation Overhead**: Runtime JSON Schema / Zod validation must execute within $< 5\text{ ms}$ per payload.
- **Parse Error Rate**: Grammar-constrained structured outputs must achieve zero JSON parse exceptions across production runs.

### Trigger Conditions
Activate this skill when:
- Designing AI agent outputs that must be programmatically consumed by backend APIs or CI systems.
- Defining MCP Tools or MCP Resources requiring unambiguous parameter validation.
- Preventing JSON truncation, missing fields, or hallucinated types in multi-agent pipelines.
- Standardizing contract-first API boundaries between AI agents and database layers.

---

### Standard Output Schema Architecture

```
PROMPT + SCHEMA CONTRACT
           │
           ▼
┌─────────────────────────────────┐
│ GRAMMAR-CONSTRAINED DECODING    │  Enforces AST schema directly in token sampler
└─────────────────┬───────────────┘
                  │
                  ▼
        VALIDATED TYPED JSON
  (Zero parsing errors, 100% typed)
```

#### 1. Core Schema Contract Example (Swarm Plan)

```typescript
export const SWARM_PLAN_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'SwarmPlan',
  type: 'object',
  required: ['topology', 'reasoningProfile', 'subagents', 'totalWorkers'],
  additionalProperties: false,
  properties: {
    topology: {
      type: 'string',
      enum: ['fan-out-fan-in', 'pipeline-saga', 'critic-validator']
    },
    reasoningProfile: {
      type: 'string',
      enum: ['speed', 'balanced', 'deep', 'exhaustive']
    },
    thinkingBudgetTokens: {
      type: 'integer',
      minimum: 1024,
      maximum: 65536
    },
    totalWorkers: {
      type: 'integer',
      minimum: 1
    },
    subagents: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['id', 'name', 'role', 'skills'],
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string' },
          skills: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      }
    }
  }
} as const;
```

#### 2. Multi-Provider Strict Enforcement Pattern

```typescript
export function applyStructuredContract(schema: object, provider: 'openai' | 'gemini' | 'claude') {
  if (provider === 'openai') {
    return {
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: (schema as any).title || 'StructuredOutput',
          strict: true,
          schema
        }
      }
    };
  }
  if (provider === 'gemini') {
    return {
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    };
  }
  // Claude tool_use pattern for guaranteed structured response
  return {
    tools: [
      {
        name: 'submit_structured_output',
        description: 'Submit the final structured data matching schema',
        input_schema: schema
      }
    ],
    tool_choice: { type: 'tool', name: 'submit_structured_output' }
  };
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec structured-output-contracts <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Kontrak & Rekayasa Spesifikasi**: `spec-driven-development-expert`, `openapi-swagger-codegen-expert`, `typescript-expert`
- **Skema Protokol & MCP**: `mcp-server-architect`, `mcp-sampling-critic`, `parallel-tool-orchestrator`
- **Framework Agen AI**: `vercel-ai-sdk-expert`, `pydantic-ai-expert`, `multi-agent-orchestration`
- **Kualitas & Anti-Slop**: `anti-slop`, `ai-code-review-autonomous`, `formal-spec-z3-verifier`
- **Siklus Hidup & Memori**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Standar produksi untuk menegakkan kontrak output JSON Schema ketat pada model-model frontier. Memanfaatkan *grammar-constrained decoding* (seperti `response_format: { type: "json_schema", strict: true }` atau Gemini `responseSchema`), agen AI dilarang mengandalkan teks Markdown mentah dengan parsing regex rentan gagal. Skill ini meresmikan skema typed JSON untuk perencanaan swarm, checkpoint memori, dan audit kualitas MCP resources (`vibes://schemas/*`).

### Hard Guardrails (Invarian Deklaratif - Bahasa Indonesia)
- **Penegakan Grammar-Constrained Decoding**: Pemanggilan tool dan agen LLM yang membutuhkan data terstruktur WAJIB mendeklarasikan batasan skema natif (`response_format: { type: "json_schema", strict: true }` atau `generateObject({ schema })`). Ekstraksi markdown regex mentah (`replace(/```json/...)`) dilarang keras.
- **Penutupan Skema Eksplisit (`additionalProperties: false`)**: Seluruh JSON Schema wajib menyertakan `additionalProperties: false` untuk memblokir properti halusinasi asing masuk ke pipeline eksekusi.
- **Invarian Array Required & Nullability Ketat**: Dalam mode skema ketat, seluruh properti wajib dicantumkan dalam array `required`. Properti opsional wajib menggunakan tipe union eksplisit (misal `type: ['string', 'null']`).
- **Gerbang Validasi Fail-Fast**: Seluruh payload JSON yang diterima dari model eksternal wajib divalidasi seketika dengan skema runtime (via Zod `schema.parse()` atau Pydantic `model_validate()`) sebelum mutasi database atau transaksi finansial.

### Non-Functional Requirements (Kontrak NFR - Bahasa Indonesia)
- **Overhead Validasi Skema**: Validasi JSON Schema / Zod runtime harus selesai dalam $< 5\text{ ms}$ per payload.
- **Tingkat Error Parsing**: Output terstruktur dengan batasan grammar harus mencapai nol exception parse JSON dalam produksi.

### Kondisi Pemicu
- Merancang output agen AI yang harus diproses otomatis oleh API backend atau pipeline CI/CD.
- Mendefinisikan tool atau resource MCP yang memerlukan validasi parameter mutlak.
- Menghilangkan kegagalan format JSON atau field halusinasi pada swarm multi-agen.
- Menerapkan kontrak skema API seragam antara agen AI dan layer basis data.

---

### Pola Implementasi Penegakan Skema Ketat Multi-Provider (TypeScript)

```typescript
export function terapkanKontrakTerstruktur(skema: object, penyedia: 'openai' | 'gemini' | 'claude') {
  if (penyedia === 'openai') {
    return {
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: (skema as any).title || 'OutputTerstruktur',
          strict: true,
          schema: skema
        }
      }
    };
  }

  if (penyedia === 'gemini') {
    return {
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: skema
      }
    };
  }

  // Claude: Gunakan pola tool_use dengan tool_choice eksplisit untuk respon terstruktur
  return {
    tools: [
      {
        name: 'kirim_output_terstruktur',
        description: 'Kirimkan data hasil akhir yang sesuai dengan skema JSON',
        input_schema: skema
      }
    ],
    tool_choice: { type: 'tool', name: 'kirim_output_terstruktur' }
  };
}
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec structured-output-contracts <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
