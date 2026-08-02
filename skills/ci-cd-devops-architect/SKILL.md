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

### Instructions
- **Automate Everything**: Ensure tests, linting, formatting, and security scans run on every PR. Block merges if pipelines fail.
- **Immutable Artifacts**: Build a Docker image once and deploy the exact same image to Staging and Production. Pass environment variables dynamically at runtime, not build time.
- **Infrastructure as Code**: Keep all infrastructure configurations (Terraform, K8s manifests) in version control. Avoid manual changes via the cloud provider's web console.
- **Secrets Management**: Never commit secrets to the repository. Use secure vaults like GitHub Secrets, AWS Secrets Manager, or HashiCorp Vault, and inject them securely into the environment.
- **Zero-Downtime Deployments**: Utilize deployment strategies like rolling updates or blue-green deployments to ensure application availability during releases.

### Trigger Conditions
Active whenever the user is creating GitHub Actions, configuring Dockerfiles, writing Terraform scripts, or setting up deployment pipelines.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill tingkat ahli untuk merancang dan memelihara *pipeline* CI/CD (GitHub Actions, GitLab CI) dan mengelola infrastruktur menggunakan Docker, Kubernetes, dan Terraform.

### Instruksi
- **Otomatisasi Semuanya**: Pastikan pengujian (tests), *linting*, pemformatan, dan pemindaian keamanan berjalan di setiap *Pull Request* (PR). Blokir penggabungan kode (merge) jika *pipeline* gagal.
- **Artifak Imutabel**: Build *image* Docker satu kali dan *deploy* image yang sama persis ke Staging dan Produksi. Operkan variabel lingkungan (environment variables) secara dinamis saat *runtime*, bukan saat *build time*.
- **Infrastructure as Code (IaC)**: Simpan semua konfigurasi infrastruktur (Terraform, manifes K8s) di kontrol versi. Hindari perubahan manual melalui *web console* dari penyedia cloud.
- **Manajemen Rahasia (Secrets)**: Jangan pernah melakukan *commit* untuk *secrets* ke repositori. Gunakan *vault* yang aman seperti GitHub Secrets, AWS Secrets Manager, atau HashiCorp Vault, dan injeksikan dengan aman ke dalam sistem.
- **Deployment Tanpa Downtime**: Manfaatkan strategi *deployment* seperti pembaruan bergulir (*rolling updates*) atau *blue-green deployments* untuk memastikan ketersediaan aplikasi selama rilis.

### Kondisi Pemicu
Aktif setiap kali pengguna sedang membuat GitHub Actions, mengkonfigurasi Dockerfile, menulis skrip Terraform, atau mengatur *pipeline deployment*.
