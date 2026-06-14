---
name: prd-architect
description: "Mandatory guardrail skill that enforces creating a comprehensive Product Requirements Document (PRD) before generating code for new projects / Skill khusus untuk memaksa pembuatan Product Requirements Document (PRD) sebelum mulai coding pada setiap proyek baru."
author: "Roedy Rustam"
---

# PRD Architect (Perancang Dokumen Kebutuhan Produk)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill acts as a first gatekeeper whenever there is an initiative to build a new application, software, or large project from scratch. It ensures that no code is written before a comprehensive **Product Requirements Document (PRD)** is approved by the user.

### Trigger Conditions
Automatically active when:
- The user requests to "create a new application", "new project", "new SaaS", or "new MVP".
- The user starts a large initiative without specifying feature structures.
- The agent is asked to act as a Product Manager (PM) or initiate a project.

### Instructions & Workflow (Mandatory)

#### 1. DO NOT WRITE CODE IMMEDIATELY
When triggered, **stop** thinking about code, folder structure, or technical implementations. Your first task is purely to analyze the business and product needs.

#### 2. Draft the PRD (Product Requirements Document)
Create a PRD document (Markdown or Artifact format) covering the following structure:
- **1. Executive Summary**: Main purpose of the application and problems to solve.
- **2. Target Audience**: Who will use this product.
- **3. MVP Scope**: List of absolute features for version v1.0. Move other features to "Future Roadmap".
- **4. Core User Flows**: Step-by-step actions users will take (e.g., *Register -> Input Data -> View Dashboard*).
- **5. Technical Requirements**: Recommended technology stack (Frontend, Backend, Database, Infrastructure) matching the project profile.
- **6. Success Metrics**: Functional metrics for success.

#### 3. Request User Approval
After presenting the PRD, you **MUST** ask the user: *"Do you agree with this PRD specification? Are there any features or flows you'd like to remove/add before we proceed to architecture and coding?"*

#### 4. Proceed to Implementation Plan
Only *after* the user says "Yes" or "Agree" to the PRD can you create the Implementation Plan and Task List to start coding.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini bertindak sebagai palang pintu pertama setiap kali ada inisiatif untuk membangun aplikasi, perangkat lunak, atau proyek besar baru dari nol. Skill ini memastikan bahwa tidak ada kode yang ditulis sebelum **Product Requirements Document (PRD)** yang komprehensif disetujui oleh pengguna.

### Kondisi Pemicu
Selalu aktif secara otomatis ketika:
- Pengguna meminta untuk "membuat aplikasi baru", "proyek baru", "SaaS baru", atau "MVP baru".
- Pengguna memulai inisiatif besar tanpa menyebutkan struktur fitur yang spesifik.
- Agen diminta untuk menjadi *Product Manager* (PM) atau menginisiasi proyek.

### Instruksi & Alur Kerja (Wajib Diikuti)

#### 1. JANGAN LANGSUNG MENULIS KODE
Saat dipicu, **berhenti** memikirkan kode, struktur folder, atau implementasi teknis. Tugas pertama Anda adalah murni menganalisis bisnis dan kebutuhan produk.

#### 2. Buat Draf PRD (Product Requirements Document)
Susun dokumen PRD (format Markdown atau Artifact) yang mencakup struktur berikut:
- **1. Ringkasan Eksekutif (Executive Summary)**: Tujuan utama aplikasi dan masalah yang ingin dipecahkan.
- **2. Target Pengguna (Target Audience)**: Siapa yang akan menggunakan produk ini.
- **3. Ruang Lingkup MVP (Minimum Viable Product)**: Daftar fitur mutlak yang harus ada di versi v1.0. Fitur lain masukkan ke "Future Roadmap".
- **4. Alur Pengguna Utama (Core User Flows)**: Langkah demi langkah apa yang akan dilakukan pengguna (misal: *Daftar -> Masukkan Data -> Lihat Dashboard*).
- **5. Kebutuhan Teknis (Tech Stack & Architecture)**: Saran stack teknologi (Frontend, Backend, Database, Infrastruktur) yang paling sesuai dengan profil proyek.
- **6. Kriteria Kesuksesan (Success Metrics)**: Apa tanda aplikasi ini berhasil secara fungsional.

#### 3. Minta Persetujuan (User Approval)
Setelah menyajikan PRD, Anda **WAJIB** bertanya kepada pengguna: *"Apakah Anda setuju dengan spesifikasi PRD ini? Adakah fitur atau alur yang ingin dikurangi/ditambahkan sebelum kita lanjut ke arsitektur dan penulisan kode?"*

#### 4. Lanjut ke Implementation Plan
Hanya *setelah* pengguna mengatakan "Ya" atau "Setuju" terhadap PRD, barulah Anda boleh membuat Implementation Plan dan Task List untuk memulai *coding*.
