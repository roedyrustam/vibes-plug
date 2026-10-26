---
name: biome-linter-formatter-expert
description: "Biome Rust linter & formatter, ESLint/Prettier migration, and tooling / Linter & formatter Biome Rust, migrasi ESLint/Prettier, dan tooling."
author: "Roedy Rustam"
version: "4.4.4"

---

# Biome Linter & Formatter Expert (Rust Tooling 2026)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Code Review & Quality Gate**: `anti-slop`, `ai-code-review-autonomous`, `coderabbit`, `zero-tech-debt-auditor`
- **Testing & Test-Driven Development**: `autonomous-tdd-debugger`, `e2e-testing-expert`, `property-mutation-testing-expert`
- **TypeScript & Compilers**: `typescript-expert`, `spec-driven-development-expert`
- **Monorepo & CI/CD Tooling**: `monorepo-architect`, `ci-cd-devops-architect`, `github-actions-expert`
- **Lifecycle & Governance**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Expert guide for Biome v2, the unified, ultra-fast Rust-based linter, formatter, and import organizer designed to replace legacy ESLint + Prettier toolchains. Covers single-file configuration (`biome.json`), automated zero-loss migration (`biome migrate`), Lefthook/Husky Git pre-commit hooks, strict type-checking lint rules for React 19 and TypeScript 5.8+, monorepo workspace partitioning, and CI/CD quality gate enforcement.

### Trigger Conditions
- Scaffolding new JavaScript, TypeScript, JSX, or CSS projects requiring sub-second linting and formatting.
- Migrating codebases from slow ESLint + Prettier setups (achieving 10-100x speedup).
- Configuring Git pre-commit hooks to prevent bad commits from entering the repository.
- Resolving lint rule conflicts between formatting and syntactic validation.

### Production `biome.json` Configuration (v2.0 Standard)

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "includes": ["src/**/*", "scripts/**/*", "tests/**/*"]
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 100
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": "warn",
        "noVoid": "error"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useHookAtTopLevel": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn",
        "noArrayIndexKey": "warn"
      },
      "style": {
        "useConst": "error",
        "useTemplate": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingCommas": "es5"
    }
  }
}
```

### Git Hook Integration with Lefthook (Sub-Second Pre-Commit)

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    biome-check:
      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc,css}"
      run: npx @biomejs/biome check --write --no-errors-on-unmatched --staged {staged_files}
      stage_fixed: true
```

### Essential Biome CLI Commands

```bash
# Initialize Biome in current project
npx @biomejs/biome init

# Migrate automatically from ESLint and Prettier configs
npx @biomejs/biome migrate eslint --write
npx @biomejs/biome migrate prettier --write

# Run format + lint + import sorting in one pass
npx @biomejs/biome check --write ./src

# CI verification (exit code 1 on errors without modifying files)
npx @biomejs/biome ci ./src
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec biome-linter-formatter-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Review Kode & Gerbang Kualitas**: `anti-slop`, `ai-code-review-autonomous`, `coderabbit`, `zero-tech-debt-auditor`
- **Pengujian & TDD**: `autonomous-tdd-debugger`, `e2e-testing-expert`, `property-mutation-testing-expert`
- **TypeScript & Kompiler**: `typescript-expert`, `spec-driven-development-expert`
- **Monorepo & Tooling CI/CD**: `monorepo-architect`, `ci-cd-devops-architect`, `github-actions-expert`
- **Siklus Hidup & Tata Kelola**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan ahli untuk Biome v2, linter, formatter, dan pengatur impor terpadu berbasis Rust yang dirancang untuk menggantikan rantai perkakas ESLint + Prettier yang lambat. Mencakup konfigurasi satu file (`biome.json`), migrasi otomatis bebas kendala (`biome migrate`), integrasi Git pre-commit hooks via Lefthook/Husky, aturan linting ketat untuk React 19 dan TypeScript 5.8+, serta pengawasan kualitas di pipeline CI/CD.

### Kondisi Pemicu
- Menyiapkan proyek baru yang membutuhkan proses linting dan pemformatan ultra-cepat (di bawah 1 detik).
- Migrasi dari kombinasi ESLint dan Prettier untuk mempercepat proses *check* hingga 10-100x lebih cepat.
- Mengonfigurasi hook pre-commit agar kode kotor tidak dapat di-commit ke repositori.
- Mengatasi konflik aturan antara formatter dan linter.

### Perbandingan: Biome vs ESLint + Prettier

| Aspek | Biome v2 | ESLint + Prettier |
|---|---|---|
| **Kecepatan** | 10-100x lebih cepat (Rust) | Lambat (Node.js engine) |
| **Konfigurasi** | 1 file tunggal (`biome.json`) | 3+ file (`.eslintrc`, `.prettierrc`, plugin) |
| **Ketergantungan Paket** | 1 package `@biomejs/biome` | Belasan plugin & dependensi parser |
| **Import Sorting** | Terintegrasi native | Membutuhkan plugin tambahan |

### Integrasi CI/CD di GitHub Actions

```yaml
# .github/workflows/quality.yml
name: Code Quality
on: [push, pull_request]

jobs:
  biome:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: biomejs/setup-biome@v2
        with:
          version: latest
      - name: Run Biome CI Gate
        run: biome ci .
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec biome-linter-formatter-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
