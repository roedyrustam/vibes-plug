---
name: rea-tool-design
description: Design or change REA investigation tools, CLI/MCP contracts, provider capabilities, and Evidence semantics.
author: "morluto"
version: "4.4.3"
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

## Reference Contract Shape (TypeScript)

```typescript
export interface ReaEvidenceSpan {
  readonly artifactDigest: string;
  readonly provider: 'ghidra' | 'lldb' | 'browser' | 'static';
  readonly addressOrPath: string;
  readonly confidence: 'verified' | 'inferred';
}

export interface ReaToolResult<T> {
  readonly tool: string;
  readonly schemaVersion: string;
  readonly examinedScope: string;
  readonly data: T;
  readonly evidence: readonly ReaEvidenceSpan[];
}
```

## Orchestration & Integration

**English & Bahasa Indonesia:** Design boundaries and Evidence semantics for REA CLI/MCP tools. / Batas desain dan semantik Evidence untuk tool CLI/MCP REA.

- `reverse-engineer-anything` — parent workflow that consumes the tools / alur induk pemakai tool.
- `mcp-server-architect` — MCP tool schema and transport conventions / konvensi skema dan transport tool MCP.
- `structured-output-contracts` — strict result-shape contracts / kontrak bentuk hasil yang ketat.
- `spec-driven-development-expert` — contract-first design before implementation / desain contract-first sebelum implementasi.
- `rea-ci-tests-audit` — verifies provider and consumer test lanes / memverifikasi lane test provider dan consumer.
- `brainstorming`, `deep-research-analyst` — ideation routing and evidence review / perutean ideasi dan tinjauan bukti.
