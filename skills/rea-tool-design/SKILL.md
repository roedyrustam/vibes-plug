---
name: rea-tool-design
description: "Design REA investigation tools, CLI/MCP contracts, and Evidence / Desain tool investigasi REA, kontrak CLI/MCP, dan semantik Evidence."
author: "morluto"
version: "4.8.0"
---

# REA tool design

Use the [tool-design guide](../../../docs/tool-design.md) for tool boundaries,
contract semantics, provider ownership, and discoverability. Inspect the current
contract and nearest existing tool relevant to the analyst question; source,
documentation, and live catalogs may describe different versions.

For a design request, return the proposed boundary, input/result shape, Evidence
semantics, nearest alternative, and verification approach. Implement when
requested, preserving the user's scope and existing authorization.

For implementation or verification, consult [testing](../../../docs/testing.md)
for the affected consumer and provider lanes, and
[contributing](../../../CONTRIBUTING.md) for generated-file ownership. Read
provider/workflow guides only as the task requires.

---

## Hard Guardrails (Declarative Invariants)
- **Single Shared Producer Core**: CLI commands (`rea <cmd>`) and MCP tool handlers (`rea_*`) must call the exact same shared core normalization function; never duplicate binary parsing or symbol resolution in transport adapters.
- **Mandatory Evidence Span Provenance**: Every returned fact must attach a `ReaEvidenceSpan` containing the lowercase SHA-256 `artifactDigest`, `provider`, `addressOrPath`, and explicit `'verified' | 'inferred'` confidence.
- **Explicit Examined Scope Reporting**: Every tool response—especially empty results—must populate `examinedScope` (`sectionOrModule`, `startAddress`, `endAddress`, `completeCoverage`) so callers never confuse an unscanned section with absence of evidence.
- **Bounded Pagination & Cursor Discipline**: Never return unbounded decompilation dumps, string tables, or cross-reference arrays; enforce deterministic `maxItems` / `maxInstructions` limits and return a resumable `nextCursor`.
- **Preserve Same-Address Symbol Alternatives**: Never silently drop overloaded or aliased symbols sharing the same virtual address; emit all validated candidates in deterministic order.
- **Strict Zod Schema Validation at Boundary**: Validate both incoming tool arguments and outgoing result envelopes with `.strict()` Zod schemas so undocumented fields fail fast.

---

## Tool Boundary & Ownership Decision Matrix

| Layer / Surface | Primary Responsibility | Prohibited Anti-Pattern |
| :--- | :--- | :--- |
| **Provider Engine (`ghidra`, `lldb`, `static`, `browser`)** | Extract raw facts, virtual addresses, byte ranges, and native symbol tables once. | Formatting CLI prose or dropping alternative symbol matches at the same address. |
| **Shared Application Core** | Normalize facts, attach verifiable `ReaEvidenceSpan` records, and enforce scope/page limits. | Divergent business logic between CLI commands and MCP tool handlers. |
| **CLI Surface (`rea <cmd>`)** | Parse flags, invoke shared core, and render human-readable or `--json` output. | Re-parsing raw binary bytes or mutating `Evidence` confidence levels. |
| **MCP Tool Surface (`rea_*`)** | Enforce strict JSON Schema input/output contracts and deterministic error codes. | Returning unbounded multi-megabyte decompilation dumps without pagination cursors. |

---

## 1. Reference Contract Shape & Evidence Semantics (TypeScript)

```typescript
export interface ReaEvidenceSpan {
  readonly artifactDigest: string;
  readonly provider: 'ghidra' | 'lldb' | 'browser' | 'static';
  readonly addressOrPath: string;
  readonly byteLength?: number;
  readonly confidence: 'verified' | 'inferred';
}

export interface ReaExaminedScope {
  readonly sectionOrModule: string;
  readonly startAddress: string;
  readonly endAddress: string;
  readonly completeCoverage: boolean;
  readonly nextCursor: string | null;
}

export interface ReaToolResult<T> {
  readonly tool: string;
  readonly schemaVersion: string;
  readonly examinedScope: ReaExaminedScope;
  readonly data: T;
  readonly evidence: readonly ReaEvidenceSpan[];
}
```

---

## 2. Strict Zod Contract & MCP Tool Boundary Validator (TypeScript)

```typescript
import { z } from 'zod';

export const ReaEvidenceSpanSchema = z.object({
  artifactDigest: z.string().regex(/^[a-f0-9]{64}$/, 'Must be a lowercase SHA-256 hex digest'),
  provider: z.enum(['ghidra', 'lldb', 'browser', 'static']),
  addressOrPath: z.string().min(1),
  byteLength: z.number().int().positive().optional(),
  confidence: z.enum(['verified', 'inferred'])
}).strict();

export const ReaDecompileRequestSchema = z.object({
  binarySha256: z.string().regex(/^[a-f0-9]{64}$/),
  functionAddressOrSymbol: z.string().min(1),
  maxInstructions: z.number().int().min(16).max(4096).default(512),
  includeCrossReferences: z.boolean().default(true)
}).strict();

export type ReaDecompileRequest = z.infer<typeof ReaDecompileRequestSchema>;
```

---

## 3. Shared Producer-to-MCP Execution Adapter (TypeScript)

```typescript
import crypto from 'node:crypto';
import type { ReaToolResult } from './rea-contracts';

export interface DecompiledFunctionPayload {
  readonly symbol: string;
  readonly entryAddress: string;
  readonly pseudocodeC: string;
  readonly callers: readonly string[];
}

export function buildDecompileToolResult(
  binaryBuffer: Buffer,
  payload: DecompiledFunctionPayload
): ReaToolResult<DecompiledFunctionPayload> {
  const digest = crypto.createHash('sha256').update(binaryBuffer).digest('hex');
  return {
    tool: 'rea_decompile_function',
    schemaVersion: '1.2.0',
    examinedScope: {
      sectionOrModule: '.text',
      startAddress: payload.entryAddress,
      endAddress: payload.entryAddress,
      completeCoverage: true,
      nextCursor: null
    },
    data: payload,
    evidence: [
      {
        artifactDigest: digest,
        provider: 'ghidra',
        addressOrPath: payload.entryAddress,
        confidence: 'verified'
      }
    ]
  };
}
```

---

## 4. Deterministic Cursor Paginator for Cross-References & String Tables (TypeScript)
Prevent MCP transport frame exhaustion by slicing large binary symbol or cross-reference tables with a base64url-encoded offset cursor and explicit `completeCoverage` flag:

```typescript
// src/rea/cursor-paginator.ts
export interface ReaPageSlice<T> {
  readonly items: readonly T[];
  readonly completeCoverage: boolean;
  readonly nextCursor: string | null;
}

export function paginateReaItems<T>(
  allItems: readonly T[],
  rawCursor: string | null,
  pageSize: number
): ReaPageSlice<T> {
  const safePageSize = Math.max(1, Math.min(500, pageSize));
  const startOffset = rawCursor
    ? Math.max(0, Number.parseInt(Buffer.from(rawCursor, 'base64url').toString('utf8'), 10) || 0)
    : 0;

  const slice = allItems.slice(startOffset, startOffset + safePageSize);
  const nextOffset = startOffset + slice.length;
  const reachedEnd = nextOffset >= allItems.length;

  return {
    items: slice,
    completeCoverage: startOffset === 0 && reachedEnd,
    nextCursor: reachedEnd ? null : Buffer.from(String(nextOffset), 'utf8').toString('base64url'),
  };
}
```

---

## 5. Multi-Provider Same-Address Symbol Preserver (TypeScript)
When Ghidra DWARF symbols, export tables, and synthetic thunks share an address, preserve every candidate rather than overwriting with the last map entry:

```typescript
// src/rea/symbol-normalizer.ts
export interface RawSymbolRecord {
  readonly addressHex: string;
  readonly name: string;
  readonly source: 'export' | 'dwarf' | 'synthetic';
}

export interface NormalizedAddressSymbols {
  readonly addressHex: string;
  readonly primarySymbol: string;
  readonly alternatives: readonly RawSymbolRecord[];
}

const SOURCE_PRIORITY: Record<RawSymbolRecord['source'], number> = {
  dwarf: 1,
  export: 2,
  synthetic: 3,
};

export function groupSymbolsByAddress(records: readonly RawSymbolRecord[]): NormalizedAddressSymbols[] {
  const byAddress = new Map<string, RawSymbolRecord[]>();
  for (const rec of records) {
    const key = rec.addressHex.toLowerCase();
    const bucket = byAddress.get(key) ?? [];
    bucket.push(rec);
    byAddress.set(key, bucket);
  }

  return Array.from(byAddress.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([addressHex, candidates]) => {
      const sorted = [...candidates].sort(
        (x, y) => SOURCE_PRIORITY[x.source] - SOURCE_PRIORITY[y.source] || x.name.localeCompare(y.name)
      );
      return {
        addressHex,
        primarySymbol: sorted[0].name,
        alternatives: sorted,
      };
    });
}
```

---

## 6. Deterministic MCP Error Envelope Mapper (TypeScript)
Translate provider timeouts, unsupported binary formats, and out-of-range virtual addresses into structured machine-actionable error codes:

```typescript
// src/rea/error-envelope.ts
export type ReaErrorCode =
  | 'UNSUPPORTED_BINARY_FORMAT'
  | 'ADDRESS_OUT_OF_RANGE'
  | 'PROVIDER_TIMEOUT'
  | 'INVALID_CURSOR';

export interface ReaErrorEnvelope {
  readonly isError: true;
  readonly errorCode: ReaErrorCode;
  readonly message: string;
  readonly retryable: boolean;
}

export function createReaErrorEnvelope(code: ReaErrorCode, detail: string): ReaErrorEnvelope {
  return {
    isError: true,
    errorCode: code,
    message: `[REA:${code}] ${detail}`,
    retryable: code === 'PROVIDER_TIMEOUT',
  };
}
```

---

## Pre-Release Verification Checklist

- [ ] **Single Producer Interpretation**: Both CLI and MCP entrypoints invoke the exact same shared core function without re-interpreting raw engine output.
- [ ] **Explicit Examined Scope**: Empty results explicitly report `examinedScope` so callers know whether the entire binary or only a single section was searched.
- [ ] **Bounded Output & Pagination**: Tools returning symbols, strings, or cross-references enforce deterministic `maxItems` and emit `nextCursor` when truncated.

## Orchestration & Integration

**English & Bahasa Indonesia:** Design boundaries and Evidence semantics for REA CLI/MCP tools. / Batas desain dan semantik Evidence untuk tool CLI/MCP REA.

- `reverse-engineer-anything` — parent workflow that consumes the tools / alur induk pemakai tool.
- `mcp-server-architect` — MCP tool schema and transport conventions / konvensi skema dan transport tool MCP.
- `structured-output-contracts` — strict result-shape contracts / kontrak bentuk hasil yang ketat.
- `spec-driven-development-expert` — contract-first design before implementation / desain contract-first sebelum implementasi.
- `rea-ci-tests-audit` — verifies provider and consumer test lanes / memverifikasi lane test provider dan consumer.
- `brainstorming`, `deep-research-analyst` — ideation routing and evidence review / perutean ideasi dan tinjauan bukti.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `rea-analysis-optimization`, `rea-changelog-update`

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec rea-tool-design <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec rea-tool-design <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
