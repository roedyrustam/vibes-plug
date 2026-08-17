---
name: biome-linter-formatter-expert
description: "Expert guide for Biome (Rust-based linter + formatter), ESLint/Prettier migration, and code quality tooling / Panduan ahli Biome (linter + formatter berbasis Rust), migrasi dari ESLint/Prettier, dan tooling kualitas kode."
author: "vibes-plug-swarm"
---

# Biome Linter & Formatter Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`monorepo-architect`**: Biome configuration in monorepo workspaces.
- **`ci-cd-devops-architect`**: Biome in CI/CD pipelines.
- **`scalability-clean-code`**: Code quality standards enforcement.
- **`typescript-expert`**: TypeScript-specific lint rules.

### Description
Expert guide for Biome v2, the Rust-based unified linter and formatter replacing ESLint + Prettier. Covers migration from ESLint/Prettier, custom rule configuration, CI integration, monorepo setup, and editor integration. Includes performance comparison and best practices for 2026 JavaScript/TypeScript projects.

### Trigger Conditions
- Setting up code linting and formatting for new projects.
- Migrating from ESLint + Prettier to Biome.
- Configuring Biome in monorepo or CI/CD pipelines.
- Resolving linting or formatting configuration issues.

---

### Why Biome over ESLint + Prettier?

| Aspect | Biome v2 | ESLint 9 + Prettier 3 |
|--------|----------|----------------------|
| Speed | 10-100x faster (Rust) | Baseline (Node.js) |
| Config Files | 1 (`biome.json`) | 2-3 files |
| Formatter + Linter | ✅ Unified | Separate tools |
| Import Sorting | ✅ Built-in | Plugin required |
| CSS/JSON Support | ✅ Built-in | Plugin required |

```bash
# Install and init
npm install --save-dev @biomejs/biome
npx biome init

# Migrate from ESLint/Prettier
npx biome migrate eslint --write
npx biome migrate prettier --write
```

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": { "noExcessiveCognitiveComplexity": "warn" },
      "suspicious": { "noExplicitAny": "error" }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

## Orchestration & Integration
- `monorepo-architect`, `ci-cd-devops-architect`, `scalability-clean-code`

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli Biome v2, linter dan formatter berbasis Rust yang menggantikan ESLint + Prettier. Mencakup migrasi, konfigurasi rule, integrasi CI, dan setup monorepo.

### Kondisi Pemicu
- Menyiapkan linting dan formatting kode untuk proyek baru.
- Migrasi dari ESLint + Prettier ke Biome.
- Mengkonfigurasi Biome di monorepo atau pipeline CI/CD.
