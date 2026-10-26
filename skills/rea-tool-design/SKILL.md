---
name: rea-tool-design
description: "Design REA investigation tools, CLI/MCP contracts, and Evidence / Desain tool investigasi REA, kontrak CLI/MCP, dan semantik Evidence."
author: "morluto"
version: "4.5.0"
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
