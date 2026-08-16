---
name: ci-cd-devops-architect
description: "Expert guide for continuous integration, deployment pipelines, Docker, Kubernetes, and Infrastructure as Code (IaC) / Panduan ahli untuk CI/CD dan infrastruktur."
author: "vibes-plug-swarm"
---

# CI/CD & DevOps Architect / Arsitek CI/CD & DevOps

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Design and maintain CI/CD pipelines (GitHub Actions, GitLab CI, Buildkite) and manage infrastructure using Docker, Kubernetes (1.30+), and Terraform/OpenTofu.

## Orchestration & Integration
Connect with these skills to orchestrate complete workflows:
- `cloud-hosting-expert` — Deployment targets (Vercel, Cloudflare, AWS, Railway)
- `dependency-upgrade-migrator` — Renovate Bot configuration in CI/CD
- `self-healing-cloud-orchestrator` — Auto-remediation and rollback pipelines
- `logging-error-tracking-expert` — Sentry source map upload step in build pipeline
- `e2e-testing-expert` — Automated Playwright & Vitest test steps in CI
- `zero-trust-secret-vault` — CI/CD secret management and injection
- `production-ready-hardener` — Pre-deployment security scanning in CI

### Key CI/CD Workflows & Patterns
- **Automate Everything**: Enforce tests, linting, formatting, and security scans on every PR. Block merges on pipeline failure.
- **Dependency Update Bot**: Configure Renovate Bot for automated patch/minor updates (`dependency-upgrade-migrator`).
- **Source Maps Upload**: Upload Sentry source maps during build phase (`logging-error-tracking-expert`).
- **Immutable Artifacts**: Build Docker image once, deploy identical image to Staging and Production. Inject environment variables dynamically at runtime.
- **Infrastructure as Code**: Store all infrastructure configurations (Terraform/OpenTofu, K8s manifests) in version control. No manual web console changes.
- **Zero-Trust Secrets**: Never commit secrets. Use Infisical, GitHub OIDC, or HashiCorp Vault (`zero-trust-secret-vault`).
- **Zero-Downtime Deployments**: Utilize rolling updates or blue-green deployments.

### Implementation Checklist
- [ ] Configure branch protection (require passing status checks before merge).
- [ ] Set up multi-stage Docker builds to reduce image size and attack surface.
- [ ] Implement caching for package managers (pnpm, bun, cargo, go mod) in CI.
- [ ] Scan container images for vulnerabilities before registry push.

### Trigger Conditions
Trigger when creating GitHub Actions, configuring Dockerfiles, writing Terraform/OpenTofu scripts, setting up Renovate Bot, or configuring deployment pipelines.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Rancang dan pelihara *pipeline* CI/CD (GitHub Actions, GitLab CI, Buildkite) dan kelola infrastruktur menggunakan Docker, Kubernetes (1.30+), dan Terraform/OpenTofu.

## Integrasi Orkestrasi
Hubungkan dengan skill berikut untuk mengorkestrasi alur kerja:
- `cloud-hosting-expert` — Target deployment (Vercel, Cloudflare, AWS, Railway)
- `dependency-upgrade-migrator` — Konfigurasi Renovate Bot di CI/CD
- `self-healing-cloud-orchestrator` — Pipeline auto-remediasi dan rollback
- `logging-error-tracking-expert` — Langkah upload source map Sentry di pipeline build
- `e2e-testing-expert` — Langkah pengujian otomatis Playwright & Vitest di CI
- `zero-trust-secret-vault` — Manajemen dan injeksi rahasia CI/CD
- `production-ready-hardener` — Pemindaian keamanan pra-deployment di CI

### Alur Kerja & Pola CI/CD Utama
- **Otomatisasi Semuanya**: Wajibkan pengujian, *linting*, pemformatan, dan pemindaian keamanan di setiap PR. Blokir merge jika *pipeline* gagal.
- **Bot Pembaruan Dependensi**: Konfigurasi Renovate Bot untuk update otomatis patch/minor (`dependency-upgrade-migrator`).
- **Upload Source Maps**: Upload source maps Sentry pada fase build (`logging-error-tracking-expert`).
- **Artifak Imutabel**: Build *image* Docker sekali, *deploy* image yang persis sama ke Staging dan Produksi. Injeksi variabel lingkungan saat runtime.
- **Infrastructure as Code (IaC)**: Simpan semua konfigurasi infrastruktur (Terraform/OpenTofu, manifes K8s) di kontrol versi. Jangan ubah manual via konsol web.
- **Manajemen Rahasia (Secrets)**: Jangan komit rahasia. Gunakan GitHub OIDC, Infisical, atau HashiCorp Vault (`zero-trust-secret-vault`).
- **Deployment Tanpa Downtime**: Manfaatkan pembaruan bergulir (*rolling updates*) atau *blue-green deployments*.

### Checklist Implementasi
- [ ] Konfigurasi perlindungan cabang (wajib lulus status check sebelum merge).
- [ ] Siapkan multi-stage Docker builds untuk mengurangi ukuran image dan permukaan serangan.
- [ ] Implementasikan caching untuk package managers (pnpm, bun, cargo, go mod) di workflow CI.
- [ ] Pindai image kontainer untuk kerentanan sebelum push ke registry.

### Kondisi Pemicu
Picu saat membuat GitHub Actions, mengkonfigurasi Dockerfile, menulis skrip Terraform/OpenTofu, mengatur Renovate Bot, atau mengatur *pipeline deployment*.
