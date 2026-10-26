---
name: ci-cd-devops-architect
description: "CI/CD deployment pipelines, Docker, Kubernetes, and IaC architectures / Pipeline deploy CI/CD, Docker, Kubernetes, dan arsitektur IaC."
author: "Roedy Rustam"
version: "4.4.2"

---

# CI/CD & DevOps Architect (Production Standard 2026)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Pipelines**: `zero-to-prod-orchestrator` (Phase 7 CI/CD release), `brainstorming`.
- **Infrastructure & Containerization**: `docker-container-expert` (multi-stage distroless images), `cloud-hosting-expert` (Vercel, Cloudflare, Railway targets).
- **Security & Secrets**: `zero-trust-secret-vault` (OIDC federated auth, short-lived tokens), `production-ready-hardener` (container & SBOM security audits).
- **Test Automation & Quality Gates**: `autonomous-tdd-debugger` (CI test runner execution), `e2e-testing-expert` (Playwright regression runs).
- **Proactive Health & Self-Healing**: `self-healing-cloud-orchestrator` (auto-patch failed deployments), `proactive-background-watcher` (pipeline build monitoring), `feature-flag-analytics-expert` (progressive canary rollouts), `dependency-upgrade-migrator` (automated Renovate/package audits), `agentic-coding-workflow-expert` (autonomous PR & CI workflows).

### Description
Enterprise guide for modern Continuous Integration & Continuous Delivery (CI/CD) pipelines, immutable container workflows (Docker & Kubernetes 1.30+), and Infrastructure as Code (Terraform / OpenTofu). Covers parallelized GitHub Actions workflows with dependency caching (pnpm/bun), multi-stage non-root distroless Docker builds, Trivy container vulnerability scanning, zero-downtime rolling/canary deployments, and zero-trust secret injection via OIDC.

### Trigger Conditions
- Scaffolding new GitHub Actions or GitLab CI/CD pipelines (Phase 7).
- Writing hardened multi-stage Dockerfiles for Node.js, Bun, Go, or Rust applications.
- Setting up automated PR status checks and branch protection rules.
- Implementing container vulnerability scanning and SBOM generation.
- Configuring Infrastructure as Code (OpenTofu/Terraform) for cloud providers.

### Production Multi-Stage Dockerfile (Node.js 24 / Distroless)

```dockerfile
# syntax=docker/dockerfile:1.7
# Stage 1: Dependency resolution and compilation
FROM node:24-alpine AS builder
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy manifest files first to maximize layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code and build production bundle
COPY . .
RUN pnpm run build && pnpm prune --prod

# Stage 2: Minimal, hardened production runtime
FROM gcr.io/distroless/nodejs24-debian12:nonroot AS runner
WORKDIR /app

# Run strictly as non-root user (UID 65532 in distroless)
USER nonroot

# Copy only production artifacts
COPY --from=builder --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=builder --chown=nonroot:nonroot /app/dist ./dist
COPY --from=builder --chown=nonroot:nonroot /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["dist/index.js"]
```

### Production GitHub Actions Workflow (`.github/workflows/ci.yml`)

```yaml
name: Production CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: latest

      - name: Setup Node.js 24
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'pnpm'

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint and Format Check (Biome)
        run: npx @biomejs/biome ci .

      - name: Type Check (TypeScript)
        run: pnpm exec tsc --noEmit

      - name: Run Test Suite (Vitest)
        run: pnpm test

  security-scan:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          ignore-unfixed: true
          severity: 'CRITICAL,HIGH'
```

### Key DevOps Invariants
1. **Immutable Artifacts**: Build the container image exactly once in CI. The identical binary is promoted across Staging and Production; only environment variables change.
2. **Non-Root Runtime**: Never run Docker containers as `root`. Always use unprivileged users (`nonroot` or `node`) to minimize container breakout vulnerabilities.
3. **No Hardcoded Secrets**: Secrets must never be stored in GitHub Secrets as plaintext strings. Use GitHub OIDC tokens to fetch short-lived credentials from AWS IAM or Vault (`zero-trust-secret-vault`).

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec ci-cd-devops-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Pipeline Hulu**: `zero-to-prod-orchestrator` (Rilis CI/CD Fase 7), `brainstorming`.
- **Infrastruktur & Kontainerisasi**: `docker-container-expert` (image distroless multi-stage), `cloud-hosting-expert` (target Vercel, Cloudflare, Railway).
- **Keamanan & Rahasia**: `zero-trust-secret-vault` (otentikasi federasi OIDC, token berumur pendek), `production-ready-hardener` (audit keamanan kontainer & SBOM).
- **Otomasi Pengujian & Quality Gate**: `autonomous-tdd-debugger` (eksekusi pengujian CI), `e2e-testing-expert` (regresi Playwright).
- **Kesehatan Proaktif & Self-Healing**: `self-healing-cloud-orchestrator` (perbaikan otomatis deployment gagal), `proactive-background-watcher` (pemantau build pipeline).

### Deskripsi
Panduan enterprise untuk pipeline *Continuous Integration & Continuous Delivery* (CI/CD) modern, alur kerja kontainer imutabel (Docker & Kubernetes 1.30+), dan *Infrastructure as Code* (Terraform/OpenTofu). Mencakup pipeline GitHub Actions paralel dengan caching dependensi (pnpm/bun), Dockerfile multi-stage berbasis distroless non-root yang aman, pemindaian kerentanan kontainer dengan Trivy, serta injeksi rahasia tanpa password via OIDC.

### Kondisi Pemicu
- Membuat konfigurasi GitHub Actions atau GitLab CI/CD dari awal (Fase 7).
- Menulis Dockerfile multi-stage yang aman untuk aplikasi Node.js, Bun, Go, atau Rust.
- Mengatur aturan perlindungan cabang (*branch protection*) dan status checks wajib.
- Menjalankan pemindaian kerentanan kontainer otomatis sebelum rilis ke server.
- Mengonfigurasi infrastruktur cloud menggunakan Terraform atau OpenTofu.

### Contoh Manifest Kubernetes 1.30+ (Deployment Aman)

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vibes-api-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vibes-api
  template:
    metadata:
      labels:
        app: vibes-api
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 65532
      containers:
        - name: api
          image: myregistry.azurecr.io/vibes-api:latest
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
```

### 3 Hukum Mutlak Keamanan DevOps
1. **Artifak Imutabel**: Image kontainer yang diuji pada tahap Staging adalah file image yang sama persis yang dijalankan pada server Produksi.
2. **Larangan Akses Root**: Kontainer dilarang keras dijalankan dengan hak akses root demi mencegah eksploitasi pelarian kontainer (*container escape*).
3. **Rahasia Berumur Pendek**: Gunakan otentikasi OIDC tanpa kata kunci statis untuk mengakses registry dan server cloud.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec ci-cd-devops-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
