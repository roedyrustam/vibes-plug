---
name: monorepo-architect
description: "Expert guide for designing and managing scalable monorepos using Turborepo, pnpm workspaces, and shared packages / Panduan ahli untuk merancang dan mengelola monorepo skalabel menggunakan Turborepo dan pnpm workspaces."
author: "Roedy Rustam"
version: "4.4.2"

---

# Monorepo Architect (Turborepo 2.x / Moon Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream & Project Topology**: `zero-to-prod-orchestrator` (Phase 2 project foundation), `brainstorming`, `session-memory-manager`.
- **AST & Codebase Intelligence**: `living-codebase-ast-graph` (cross-package dependency topology & DAG sorting), `typescript-expert` (composite projects & isolated declarations).
- **CI/CD & Deployment**: `ci-cd-devops-architect` (monorepo cache pipelines), `github-actions-expert` (matrix testing & sparse checkout), `cloud-hosting-expert` (multi-app deployments).
- **Shared Design & Components**: `design-system-architect` (shared `packages/ui` tokens), `senior-frontend` / `js-backend-expert` (shared packages consumption), `micro-frontend-architect` (federated micro-apps), `composable-mach-architect` (composable multi-app packages), `dependency-upgrade-migrator` (monorepo-wide dependency upgrades).

### Description
Expert guide for designing and managing scalable monorepos. Covers **Turborepo 2.x** (the 2026 standard for JS/TS monorepos), **moon** (polyglot task runner for teams mixing JS + Rust + Go), **pnpm workspaces**, shared package design, incremental builds, remote caching, and CI/CD pipeline optimization.

### Trigger Conditions
- Managing a codebase with multiple apps and shared packages.
- Setting up a monorepo for a SaaS with separate `web`, `admin`, `api`, and `packages`.
- Optimizing build and test times with remote caching.
- Sharing TypeScript types, UI components, or utility functions across apps.
- Migrating from a multi-repo setup to a monorepo.

### Tool Selection Guide (2026)

| Tool | Best For | Language Agnostic |
|---|---|---|
| **Turborepo 2.x** | JS/TS monorepos (Next.js, Vite, Node) | ❌ (JS focused) |
| **moon** | Polyglot teams (JS + Go + Rust + Python) | ✅ |
| **Nx** | Enterprise, Angular/React, plugin ecosystem | ❌ (JS focused) |
| **Bazel** | Very large orgs, hermetic builds | ✅ |

### Turborepo 2.x — Standard JS Monorepo

#### Repository Structure
```
my-saas/
├── apps/
│   ├── web/          # Next.js 15 main app
│   ├── admin/        # Next.js 15 super admin (subdomain)
│   └── api/          # Hono/Fastify backend
├── packages/
│   ├── ui/           # Shared Tailwind v4 components
│   ├── db/           # Drizzle ORM schema + queries
│   ├── auth/         # Auth utilities (session, JWT)
│   ├── email/        # Email templates (React Email)
│   └── tsconfig/     # Shared TypeScript configs
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

#### turbo.json (v2 Syntax)
```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "test/**", "vitest.config.*"]
    },
    "lint": {
      "inputs": ["src/**", "*.config.*", ".eslintrc*"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "db:generate": {
      "cache": false
    }
  }
}
```

#### pnpm-workspace.yaml
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

#### Remote Caching (Vercel Remote Cache)
```bash
# Authenticate with Vercel Remote Cache
npx turbo login
npx turbo link

# Or self-hosted with Turborepo Remote Cache
TURBO_TEAM=my-team TURBO_TOKEN=xxx turbo build
```

#### Shared UI Package (`packages/ui`)
```json
// packages/ui/package.json
{
  "name": "@myapp/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./button": {
      "import": "./src/button.tsx",
      "types": "./src/button.tsx"
    },
    "./card": {
      "import": "./src/card.tsx",
      "types": "./src/card.tsx"
    }
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

#### Internal Package Pattern (No Build Step)
Use `"exports"` pointing to source files directly — Turborepo compiles them as part of the consuming app:
```json
// packages/db/package.json
{
  "name": "@myapp/db",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts"
    }
  },
  "devDependencies": {
    "drizzle-orm": "latest",
    "drizzle-kit": "latest"
  }
}
```

### moon — Polyglot Task Runner
For teams mixing JavaScript, Go, Rust, and Python in one repo:
```yaml
# .moon/workspace.yml
projects:
  - "apps/*"
  - "packages/*"
  - "services/*"   # Go/Rust microservices

vcs:
  manager: "git"
  defaultBranch: "main"
```

```yaml
# apps/api/moon.yml (Go service)
language: "go"
type: "application"

tasks:
  build:
    command: "go build -o ./bin/api ./cmd/api"
    inputs: ["src/**/*.go", "go.mod"]
    outputs: ["bin/api"]
  test:
    command: "go test ./..."
```

### CI/CD Optimization
```yaml
# .github/workflows/ci.yml
- name: Build & Test (Turborepo)
  run: |
    npx turbo run build test lint typecheck \
      --filter="...[origin/main]" \  # Only changed packages
      --cache-dir=".turbo"
  env:
    TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
    TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec monorepo-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Hulu & Topologi Proyek**: `zero-to-prod-orchestrator` (Pondasi proyek Fase 2), `brainstorming`, `session-memory-manager`.
- **AST & Inteligensi Basis Kode**: `living-codebase-ast-graph` (topologi dependensi lintas paket & DAG sorting), `typescript-expert` (composite project & isolated declarations).
- **CI/CD & Deployment**: `ci-cd-devops-architect` (pipeline cache monorepo), `github-actions-expert` (pengujian matriks & sparse checkout), `cloud-hosting-expert` (deployment multi-aplikasi).
- **Desain Bersama & Komponen**: `design-system-architect` (token shared `packages/ui`), `senior-frontend` / `js-backend-expert` (konsumsi paket bersama).

### Deskripsi
Panduan ahli untuk merancang dan mengelola monorepo yang skalabel. Mencakup **Turborepo 2.x** (standar 2026 untuk monorepo JS/TS), **moon** (task runner poliglot untuk tim yang memadukan JS + Rust + Go), **pnpm workspaces**, desain shared package, incremental build, remote caching, dan optimasi pipeline CI/CD.

### Kondisi Pemicu
- Mengelola codebase dengan banyak aplikasi dan shared package.
- Menyiapkan monorepo untuk SaaS dengan `web`, `admin`, `api`, dan `packages` terpisah.
- Mengoptimalkan waktu build dan test dengan remote caching.
- Berbagi TypeScript types, komponen UI, atau utilitas antar aplikasi.
- Migrasi dari multi-repo ke monorepo.

### Panduan Pemilihan Tool (2026)
- **Turborepo 2.x**: Standar untuk monorepo JS/TS — cepat, zero-config, remote cache bawaan.
- **moon**: Untuk tim poliglot yang memadukan JS, Go, Rust, Python dalam satu repo.
- **Nx**: Untuk enterprise dengan ekosistem plugin yang kaya.

### Struktur Repositori
Pisahkan `apps/` (aplikasi yang dapat di-deploy) dari `packages/` (shared library internal):
- `apps/web` — Next.js utama
- `apps/admin` — Dashboard Super Admin (subdomain terpisah)
- `apps/api` — Backend API
- `packages/ui` — Komponen UI bersama (Tailwind v4)
- `packages/db` — Skema Drizzle ORM + query
- `packages/auth` — Utilitas auth

### Turborepo 2.x — Sintaksis Baru
Turborepo 2.x memperkenalkan TUI interaktif (`"ui": "tui"`), sintaksis `tasks` yang lebih ekspresif, dan caching yang lebih granular dengan `inputs`/`outputs`.

### Pola Internal Package (Tanpa Build Step)
Arahkan `exports` langsung ke file sumber TypeScript — Turborepo mengkompilasi sebagai bagian dari aplikasi yang mengonsumsinya. Ini menghilangkan kebutuhan langkah build terpisah untuk setiap package.

### moon — Task Runner Poliglot
Moon mendukung proyek dalam bahasa yang berbeda (Go, Rust, JS) dalam satu workspace, masing-masing dengan konfigurasi `moon.yml`-nya sendiri.

### Optimasi CI/CD
Gunakan flag `--filter="...[origin/main]"` Turborepo untuk hanya membangun dan menguji package yang berubah sejak commit terakhir. Gunakan remote cache Vercel atau self-hosted untuk berbagi cache antar runner CI.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec monorepo-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
