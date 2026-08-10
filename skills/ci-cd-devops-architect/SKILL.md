---
name: ci-cd-devops-architect
description: "Expert guide for continuous integration, deployment pipelines, Docker, Kubernetes, and Infrastructure as Code (IaC) / Panduan ahli untuk CI/CD dan infrastruktur."
author: "Antigravity"
---

# CI/CD & DevOps Architect / Arsitek CI/CD & DevOps

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert-level skill for designing and maintaining CI/CD pipelines (GitHub Actions, GitLab CI) and managing infrastructure using Docker, Kubernetes, and Terraform.

### Key CI/CD Workflows & Patterns

- **Automate Everything**: Ensure tests, linting, formatting, and security scans run on every PR. Block merges if pipelines fail.
- **Dependency Update Bot**: Configure Renovate Bot or Dependabot for automated patch/minor updates (`dependency-upgrade-migrator`).
- **Source Maps Upload**: Automatically upload Sentry source maps during the build phase (`logging-error-tracking-expert`).
- **Immutable Artifacts**: Build a Docker image once and deploy the exact same image to Staging and Production. Pass environment variables dynamically at runtime, not build time.
- **Infrastructure as Code**: Keep all infrastructure configurations (Terraform, K8s manifests) in version control. Avoid manual changes via the cloud provider's web console.
- **Zero-Trust Secrets**: Never commit secrets to the repository. Use Infisical, GitHub Secrets, or HashiCorp Vault (`zero-trust-secret-vault`).
- **Zero-Downtime Deployments**: Utilize deployment strategies like rolling updates or blue-green deployments to ensure availability.

### Trigger Conditions
Active whenever the user is creating GitHub Actions, configuring Dockerfiles, writing Terraform scripts, setting up Renovate Bot, or configuring deployment pipelines.

---

### Integration with Other Skills (MANDATORY)

This skill works best when combined with:
- `cloud-hosting-expert` — Deployment targets (Vercel, Cloudflare, AWS, Railway)
- `dependency-upgrade-migrator` — Renovate Bot & Dependabot configuration in CI/CD
- `logging-error-tracking-expert` — Sentry source map upload step in build pipeline
- `e2e-testing-expert` — Automated Playwright & Vitest test steps in CI
- `zero-trust-secret-vault` — CI/CD secret management and injection
- `production-ready-hardener` — Pre-deployment security scanning in CI

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill tingkat ahli untuk merancang dan memelihara *pipeline* CI/CD (GitHub Actions, GitLab CI) dan mengelola infrastruktur menggunakan Docker, Kubernetes, dan Terraform.

### Alur Kerja & Pola CI/CD Utama
- **Otomatisasi Semuanya**: Pastikan pengujian (tests), *linting*, pemformatan, dan pemindaian keamanan berjalan di setiap *Pull Request* (PR). Blokir penggabungan kode (merge) jika *pipeline* gagal.
- **Bot Pembaruan Dependensi**: Konfigurasi Renovate Bot atau Dependabot untuk update otomatis patch/minor (`dependency-upgrade-migrator`).
- **Upload Source Maps**: Upload otomatis source maps Sentry pada fase build (`logging-error-tracking-expert`).
- **Artifak Imutabel**: Build *image* Docker satu kali dan *deploy* image yang sama persis ke Staging dan Produksi.
- **Infrastructure as Code (IaC)**: Simpan semua konfigurasi infrastruktur (Terraform, manifes K8s) di kontrol versi.
- **Manajemen Rahasia (Secrets)**: Gunakan *vault* yang aman seperti GitHub Secrets, Infisical, atau HashiCorp Vault (`zero-trust-secret-vault`).
- **Deployment Tanpa Downtime**: Manfaatkan strategi *deployment* seperti pembaruan bergulir (*rolling updates*) atau *blue-green deployments*.

### Integrasi dengan Skill Lain (WAJIB)

Skill ini bekerja paling baik dikombinasikan dengan:
- `cloud-hosting-expert` — Target deployment (Vercel, Cloudflare, AWS, Railway)
- `dependency-upgrade-migrator` — Konfigurasi Renovate Bot & Dependabot di CI/CD
- `logging-error-tracking-expert` — Langkah upload source map Sentry di pipeline build
- `e2e-testing-expert` — Langkah pengujian otomatis Playwright & Vitest di CI
- `zero-trust-secret-vault` — Manajemen dan injeksi rahasia CI/CD
- `production-ready-hardener` — Pemindaian keamanan pra-deployment di CI

### Kondisi Pemicu
Aktif setiap kali pengguna sedang membuat GitHub Actions, mengkonfigurasi Dockerfile, menulis skrip Terraform, mengatur Renovate Bot, atau mengatur *pipeline deployment*.
