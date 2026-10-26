---
name: dependency-upgrade-migrator
description: "Dependency upgrades, breaking change migrations, and codemod tooling / Upgrade dependensi, migrasi breaking change, dan otomasi codemod."
author: "Roedy Rustam"
version: "4.4.4"

---

# Dependency Upgrade Migrator (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream & Lifecycle**: `zero-to-prod-orchestrator` (Phase 2 & Phase 7 upgrades), `brainstorming`, `session-memory-manager`.
- **Monorepos & Package Architecture**: `monorepo-architect` (pnpm catalogs & workspace dependency alignment), `living-codebase-ast-graph` (breaking change blast radius).
- **Quality Gates & Testing**: `e2e-testing-expert` (post-upgrade regression suites), `autonomous-tdd-debugger` (lockfile & test runner self-healing), `production-ready-hardener` (vulnerability audit).
- **CI/CD & Debt Cleanup**: `ci-cd-devops-architect` (Renovate bot pipelines), `zero-tech-debt-auditor` (dead code & deprecated API removal).

### Description
Production-grade guide for safely upgrading dependencies, migrating through breaking changes, and maintaining healthy dependency trees. Covers **automated upgrade tooling** (`npm-check-updates`, `taze`, Renovate Bot), **major framework migration guides** (React 18→19, Next.js 14→15, Tailwind v3→v4), **codemod automation** (jscodeshift, ts-morph), **vulnerability remediation** (`npm audit`, `pnpm audit`), **lockfile hygiene**, **monorepo alignment** (pnpm catalogs), and **breaking change detection workflows**.

### Trigger Conditions
Activate this skill when:
- Upgrading major versions of frameworks (React, Next.js, Tailwind, etc.).
- Running security audits and remediating vulnerabilities.
- Setting up automated dependency update bots (Renovate, Dependabot).
- Writing or running codemods for API migration.
- Cleaning up dependency trees and removing unused packages.
- Aligning dependency versions across monorepo packages.

---

### 1. Upgrade Strategy Matrix

| Upgrade Type | Risk Level | Strategy | Tools |
|---|---|---|---|
| **Patch** (1.0.x) | 🟢 Low | Auto-merge after tests pass | Renovate, Dependabot |
| **Minor** (1.x.0) | 🟡 Medium | Auto-merge with manual review | Renovate + test suite |
| **Major** (x.0.0) | 🔴 High | Manual review, migration guide, branch | Manual + codemods |
| **Security** (any) | 🔴 Critical | Immediate upgrade, hotfix | `npm audit fix`, manual |

---

### 2. Pre-Upgrade Checklist

```markdown
- [ ] Run `pnpm audit` / `npm audit` to identify vulnerabilities
- [ ] Check changelog/migration guide for the target version
- [ ] Ensure test suite is passing on current version (baseline)
- [ ] Create a dedicated branch for the upgrade
- [ ] Check peer dependency compatibility
- [ ] Review breaking changes list
- [ ] Identify files that need codemod transformation
- [ ] Back up lockfile before changes
```

---

### 3. Automated Upgrade Tooling

#### Checking for Updates
```bash
# Using taze (recommended — supports monorepos)
npx taze major          # Show available major upgrades
npx taze minor -w       # Auto-write minor updates to package.json
npx taze -r             # Recursive (monorepo)

# Using npm-check-updates
npx ncu                 # Show available updates
npx ncu -u              # Auto-write updates to package.json
npx ncu --target minor  # Only show minor updates
```

#### Renovate Bot Configuration
```json
// renovate.json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:best-practices"],
  "labels": ["dependencies"],
  "schedule": ["after 10pm and before 5am every weekday"],
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "automerge": true,
      "automergeType": "pr"
    },
    {
      "matchUpdateTypes": ["minor"],
      "automerge": true,
      "automergeType": "pr",
      "requiredStatusChecks": ["ci/test", "ci/build"]
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["major-upgrade", "manual-review"]
    },
    {
      "matchPackageNames": ["typescript", "react", "next"],
      "automerge": false,
      "labels": ["core-dependency"]
    }
  ]
}
```

---

### 4. Major Framework Migration Guides

#### React 18 → 19
```typescript
// Key breaking changes:
// 1. forwardRef no longer needed (ref is a regular prop)
// ❌ Before (React 19)
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input ref={ref} {...props} />
));

// ✅ After (React 19)
function Input({ ref, ...props }: Props & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}

// 2. useActionState replaces useFormState
// ❌ Before: import { useFormState } from 'react-dom'
// ✅ After:  import { useActionState } from 'react'

// 3. use() hook for promises and context
// ✅ New: const data = use(fetchPromise);
// ✅ New: const theme = use(ThemeContext);
```

#### Next.js 14 → 15
```typescript
// Key changes:
// 1. params/searchParams are now async in page/layout/route
// ❌ Before: export default function Page({ params }: { params: { id: string } })
// ✅ After:  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
//             const { id } = await params;

// 2. Caching: fetch() no longer cached by default
// ❌ Before: fetch() was cached by default
// ✅ After:  fetch(url, { cache: 'force-cache' }) for explicit caching

// 3. Route handlers: GET is no longer cached by default
// Add: export const dynamic = 'force-static' if you want caching
```

#### Tailwind CSS v4 → v4
```css
/* Key changes: */
/* 1. Configuration moves from JS to CSS */
/* ❌ Before: tailwind.config.js with theme.extend */
/* ✅ After: @theme directive in CSS */

@import 'tailwindcss';

@theme {
  --color-primary: oklch(0.6 0.2 260);
  --font-sans: 'Inter', sans-serif;
  --breakpoint-sm: 40rem;
}

/* 2. No more @tailwind directives */
/* ❌ Before: @tailwind base; @tailwind components; @tailwind utilities; */
/* ✅ After:  @import 'tailwindcss'; */

/* 3. Renamed utilities */
/* ❌ Before: bg-opacity-50 */
/* ✅ After:  bg-black/50 */
```

---

### 5. Codemod Automation (jscodeshift)

```typescript
// codemods/remove-forward-ref.ts
import type { API, FileInfo } from 'jscodeshift';

export default function removeForwardRef(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Find all forwardRef calls and transform them
  root.find(j.CallExpression, {
    callee: { name: 'forwardRef' },
  }).forEach((path) => {
    // Extract the inner component function
    const args = path.node.arguments;
    if (args.length > 0 && (args[0].type === 'ArrowFunctionExpression' || args[0].type === 'FunctionExpression')) {
      // Replace forwardRef(...) with the inner function
      j(path).replaceWith(args[0]);
    }
  });

  // Remove forwardRef import
  root.find(j.ImportSpecifier, { imported: { name: 'forwardRef' } }).remove();

  return root.toSource({ quote: 'single' });
}

// Run: npx jscodeshift -t codemods/remove-forward-ref.ts src/ --extensions=tsx,ts
```

---

### 6. Vulnerability Remediation

```bash
# Audit current state
pnpm audit                          # Show vulnerabilities
pnpm audit --fix                    # Auto-fix where possible

# For stubborn transitive dependencies
pnpm patch <package>@<version>      # Create a local patch
# or
pnpm overrides                      # Force specific version in package.json

# package.json — Force resolution
{
  "pnpm": {
    "overrides": {
      "vulnerable-package": ">=2.0.0"
    }
  }
}
```

---

### 7. Dependency Cleanup

```bash
# Find unused dependencies
npx depcheck                        # Detect unused deps
npx depcheck --ignores="@types/*"   # Ignore type packages

# Find duplicate packages
pnpm dedupe                         # Deduplicate lockfile
pnpm why <package>                  # See why a package is installed

# Monorepo: Align versions with pnpm catalogs
# pnpm-workspace.yaml
catalog:
  react: "^19.0.0"
  typescript: "^5.7.0"
  "@tanstack/react-query": "^5.60.0"
```

---

### Common Pitfalls to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| Upgrading all deps at once | Hard to identify breaking changes | Upgrade one major dep at a time |
| Ignoring peer dependency warnings | Runtime errors, subtle bugs | Resolve all peer dep conflicts |
| No test suite before upgrading | Can't verify nothing broke | Ensure tests pass before AND after |
| `npm audit fix --force` blindly | Can introduce breaking changes | Review each fix manually for major bumps |
| Skipping changelogs | Missing breaking changes | Always read CHANGELOG/migration guide |
| No lockfile in version control | Non-reproducible builds | Always commit `pnpm-lock.yaml` |

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec dependency-upgrade-migrator <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Hulu & Siklus Hidup**: `zero-to-prod-orchestrator` (Upgrade Fase 2 & Fase 7), `brainstorming`, `session-memory-manager`.
- **Monorepo & Arsitektur Paket**: `monorepo-architect` (katalog pnpm & penyelarasan dependensi workspace), `living-codebase-ast-graph` (radius dampak breaking change).
- **Quality Gate & Pengujian**: `e2e-testing-expert` (suite regresi pasca-upgrade), `autonomous-tdd-debugger` (pemulihan mandiri lockfile & test runner), `production-ready-hardener` (audit kerentanan).
- **CI/CD & Pembersihan Utang**: `ci-cd-devops-architect` (pipeline bot Renovate), `zero-tech-debt-auditor` (penghapusan kode mati & API usang).

### Deskripsi
Panduan tingkat produksi untuk upgrade dependensi yang aman, migrasi melalui breaking change, dan pemeliharaan dependency tree yang sehat. Mencakup **tooling upgrade otomatis** (`taze`, Renovate Bot), **panduan migrasi framework utama** (React 18→19, Next.js 14→15, Tailwind v3→v4), **otomasi codemod** (jscodeshift, ts-morph), **remediasi kerentanan** (`pnpm audit`), **kebersihan lockfile**, dan **penyelarasan dependensi monorepo** (pnpm catalogs).

### Kondisi Pemicu
Aktifkan skill ini ketika:
- Mengupgrade versi mayor framework (React, Next.js, Tailwind, dll).
- Menjalankan audit keamanan dan memperbaiki kerentanan paket.
- Menyiapkan bot update dependensi otomatis (Renovate, Dependabot).
- Menulis atau menjalankan codemod untuk refaktor API usang secara massal.
- Membersihkan dependency tree dan menghapus paket yang tidak lagi terpakai.

---

### Matriks Strategi Upgrade Dependensi

| Tipe Upgrade | Tingkat Risiko | Strategi Penanganan | Tooling yang Dianjurkan |
|---|---|---|---|
| **Patch** (1.0.x) | 🟢 Rendah | Auto-merge setelah seluruh test suite lulus | Renovate, Dependabot |
| **Minor** (1.x.0) | 🟡 Sedang | Auto-merge dengan review PR singkat | Renovate + CI pipeline test |
| **Mayor** (x.0.0) | 🔴 Tinggi | Review manual, pelajari changelog, branch terpisah | Manual + Codemod AST |
| **Keamanan** (CVE) | 🔴 Kritis | Upgrade darurat dan rilis hotfix langsung | `pnpm audit --fix` / manual patch |

---

### Resep & Panduan Migrasi Kunci

#### 1. Tooling Pemindaian Upgrade (`taze`)
```bash
# Tampilkan upgrade versi mayor yang tersedia di workspace
npx taze major

# Tulis otomatis pembaruan minor ke package.json
npx taze minor -w

# Jalankan pemindaian secara rekursif di seluruh paket monorepo
npx taze -r
```

#### 2. Konfigurasi Renovate Bot Otomatis (`renovate.json`)
```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:best-practices"],
  "labels": ["dependencies"],
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "automerge": true,
      "automergeType": "pr"
    },
    {
      "matchUpdateTypes": ["minor"],
      "automerge": true,
      "requiredStatusChecks": ["ci/test", "ci/build"]
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["major-upgrade", "manual-review"]
    }
  ]
}
```

#### 3. Ringkasan Migrasi Framework Utama (2026 Standard)
- **React 18 ke 19**: `forwardRef` tidak lagi dibutuhkan (prop `ref` diteruskan seperti prop biasa). `useActionState` menggantikan `useFormState`. Hook `use()` dapat membaca promise dan React Context secara langsung.
- **Next.js 14 ke 15**: Parameter `params` dan `searchParams` pada page/layout/route kini bersifat asinkron (`Promise<{ id: string }>`). Default `fetch()` tidak lagi di-cache secara otomatis (`cache: 'force-cache'` harus dideklarasikan secara eksplisit jika diinginkan).
- **Tailwind CSS v3 ke v4**: Konfigurasi berpindah dari `tailwind.config.js` ke CSS native melalui direktif `@theme`. Direktif lama `@tailwind base;` diganti dengan `@import 'tailwindcss';`.

#### 4. Otomasi Codemod Menghapus `forwardRef` Menggunakan `jscodeshift`
```typescript
// codemods/hapus-forward-ref.ts
import type { API, FileInfo } from 'jscodeshift';

export default function transform(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  root.find(j.CallExpression, {
    callee: { name: 'forwardRef' },
  }).forEach((path) => {
    const args = path.node.arguments;
    if (args.length > 0) {
      j(path).replaceWith(args[0]);
    }
  });

  root.find(j.ImportSpecifier, { imported: { name: 'forwardRef' } }).remove();
  return root.toSource({ quote: 'single' });
}
```

### Jebakan Umum yang Wajib Dihindari
- **Mengupgrade Seluruh Dependensi Sekaligus**: Sulit melacak sumber error saat build rusak. Upgrade dependensi mayor satu per satu.
- **Mengabaikan Peringatan Peer Dependencies**: Menimbulkan konflik runtime tersembunyi.
- **Menjalankan `npm audit fix --force` Secara Membabi Buta**: Dapat memaksa install versi mayor yang merusak kode aplikasi.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec dependency-upgrade-migrator <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
