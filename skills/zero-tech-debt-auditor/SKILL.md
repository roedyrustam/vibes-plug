---
name: zero-tech-debt-auditor
description: "Autonomous orchestrator that scans, refactors, and eradicates technical debt at the end of the development lifecycle to achieve a Zero Debt codebase / Orkestrator otonom untuk menghapus utang teknis sebelum rilis."
author: "Roedy Rustam"
version: "4.4.2"
---

# Zero Tech Debt Auditor / Auditor Nol Utang Teknis

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Code Quality & Anti-Slop**: `anti-slop`, `ai-code-review-autonomous`, `coderabbit`, `biome-linter-formatter-expert`
- **Testing & Self-Healing CI**: `autonomous-tdd-debugger`, `e2e-testing-expert`, `property-mutation-testing-expert`
- **Architecture & Refactoring**: `scalability-clean-code`, `legacy-code-translator`, `app-analyzer-optimizer`, `living-codebase-ast-graph`
- **Production Hardening**: `production-ready-hardener`, `ci-cd-devops-architect`, `github-actions-expert`, `sbom-supply-chain-security-expert`
- **Lifecycle & Governance**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Autonomous orchestrator that scans, refactors, and eradicates technical debt at the end of the development lifecycle to achieve a **Zero Debt** codebase before production release. Applications are NOT considered production-ready until they pass all 5 dimensions of the Zero Technical Debt audit.

### 1. The 5-Dimension Technical Debt Eradication Matrix

| Debt Dimension | Detection Tool / AST Query | Threshold Gate | Autonomous Remediation Action |
| :--- | :--- | :--- | :--- |
| **1. Dead Code & Orphaned Exports** | `npx knip --production` | `0` unused files, exports, or dependencies | Delete dead files, strip unused `export` keywords, prune `package.json` |
| **2. Type Safety Erosion** | `tsc --noEmit --strict` + AST scan for `any` / `@ts-ignore` | `0` explicit `any` or `@ts-expect-error` without ticket | Replace with Zod schemas, discriminated unions, or generic constraints |
| **3. Cyclomatic Complexity & God Functions** | Biome / AST function length & branch count | Max `60` lines/function, complexity `<= 12` | Extract pure helper functions and early-return guard clauses |
| **4. Circular Module Dependencies** | `living-codebase-ast-graph` cycle detector | `0` import cycles (`A -> B -> A`) | Extract shared interfaces/types into a leaf `types.ts` or `contracts.ts` module |
| **5. AI Slop & Placeholder Artifacts** | `node scripts/check-anti-slop.js --strict` | `0` errors, `0` warnings | Implement missing logic, add structured error handling, remove syntax comments |

### 2. Implementation Examples

#### 1. Knip Dead-Code & Dependency Audit Configuration (`knip.json`)
```json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "entry": ["src/index.ts", "src/cli.ts", "src/app/**/page.tsx", "src/app/**/route.ts"],
  "project": ["src/**/*.ts", "src/**/*.tsx"],
  "ignoreDependencies": ["@types/*"],
  "rules": {
    "files": "error",
    "dependencies": "error",
    "exports": "error",
    "types": "error",
    "duplicates": "error"
  }
}
```

#### 2. Automated Zero-Debt Pre-Release Gate (`scripts/verify-zero-debt.sh`)
```bash
#!/usr/bin/env bash
set -euo pipefail

echo "🧹 [1/4] Detecting unused files, exports, and dependencies via Knip..."
npx knip --production

echo "🔒 [2/4] Enforcing strict TypeScript compilation..."
npx tsc --noEmit --strict

echo "⚡ [3/4] Running Biome linter & formatting verification..."
npx @biomejs/biome ci ./src

echo "🛡️ [4/4] Running Sovereign Anti-Slop Strict Scanner..."
node scripts/check-anti-slop.js --strict

echo "✅ Zero Technical Debt Audit Passed: Codebase is 100% production-ready."
```

### 3. Production Verification Checklist
- [ ] `npx knip --production` reports `0` unused files, unused exports, or phantom/unlisted dependencies.
- [ ] `npx tsc --noEmit --strict` passes with `0` errors and zero `any` or `@ts-ignore` escapes.
- [ ] Circular dependencies between domain and infrastructure modules are `0`.
- [ ] Hardcoded magic numbers and URLs are extracted into typed configuration schemas (`constants.ts` / validated `env.ts`).
- [ ] `node scripts/check-anti-slop.js --strict` passes with `0` errors and `0` warnings.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec zero-tech-debt-auditor <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Kualitas Kode & Anti-Slop**: `anti-slop`, `ai-code-review-autonomous`, `coderabbit`, `biome-linter-formatter-expert`
- **Pengujian & Self-Healing CI**: `autonomous-tdd-debugger`, `e2e-testing-expert`, `property-mutation-testing-expert`
- **Arsitektur & Refaktorisasi**: `scalability-clean-code`, `legacy-code-translator`, `app-analyzer-optimizer`, `living-codebase-ast-graph`
- **Pengerasan Produksi**: `production-ready-hardener`, `ci-cd-devops-architect`, `github-actions-expert`, `sbom-supply-chain-security-expert`
- **Siklus Hidup & Tata Kelola**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Orkestrator otonom yang memindai, melakukan refactoring, dan menghapus utang teknis (*technical debt*) di akhir siklus hidup pengembangan untuk mencapai basis kode **Zero Debt** sebelum rilis ke produksi.

### Checklist Verifikasi Produksi
- [ ] Eliminasi seluruh file mati, ekspor tak terpakai, dan dependensi yatim dengan `npx knip --production`.
- [ ] Pastikan `npx tsc --noEmit --strict` lulus 100% tanpa `any` atau `@ts-ignore`.
- [ ] Pastikan tidak ada dependensi melingkar (*circular dependencies*) antar modul.
- [ ] Pastikan `node scripts/check-anti-slop.js --strict` lulus dengan `0` error dan `0` warning.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec zero-tech-debt-auditor <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
