---
name: session-context-loader
description: "Automatically loads and learns project context (Tech Stack, PRD, Roadmap, Blueprint) at the start of every new conversation session to ensure focused and directed development / Otomatis memuat dan mempelajari konteks proyek (Tech Stack, PRD, Roadmap, Blueprint) di awal setiap sesi percakapan baru untuk memastikan pengembangan yang terarah dan fokus."
author: "Roedy Rustam"
---

# Session Context Loader

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill ensures that the AI agent is always aligned with the project's core documentation. At the beginning of every new conversation session, it automatically searches for and reads essential project context files (Tech Stack, PRD, Roadmap, Blueprint). This guarantees that development remains focused, directed, and strictly adheres to established requirements and architectural decisions.

### Trigger Conditions
Activate this skill IMMEDIATELY when:
- It is the very first message of a new conversation session.
- The user says "start session", "initialize project", or "load context".
- The AI realizes it lacks the high-level context of the current repository.

### Execution Protocol

When triggered, you MUST perform the following steps before answering the user's primary request or writing any code:

1. **Locate Key Documentation Files:**
   Use your file search tools (`list_dir`, `grep_search`, or `view_file`) to look for the following files in the project root or `.docs/` folder:
   - `PRD.md` (Product Requirements Document)
   - `ROADMAP.md` or `ROADMAP.txt`
   - `BLUEPRINT.md` or `ARCHITECTURE.md`
   - `TECH_STACK.md`, `package.json`, `go.mod`, `Cargo.toml`, or `requirements.txt` (to identify the tech stack)

2. **Read and Internalize Context:**
   - Read the contents of the found files.
   - Understand the project's primary goal, current phase in the roadmap, architectural constraints (blueprint), and the specific tech stack being used.

3. **Acknowledge and Align:**
   - Briefly acknowledge to the user that the project context has been loaded successfully.
   - State the current Tech Stack and the immediate goal based on the Roadmap/PRD.
   - Proceed with addressing the user's actual request using the newly loaded context.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini memastikan bahwa agen AI selalu selaras dengan dokumentasi inti proyek. Di awal setiap sesi percakapan baru, agen akan secara otomatis mencari dan membaca file konteks proyek esensial (Tech Stack, PRD, Roadmap, Blueprint). Ini menjamin bahwa pengembangan proyek aplikasi tetap lebih terarah, fokus, dan sangat mematuhi persyaratan serta keputusan arsitektur yang telah ditetapkan.

### Kondisi Pemicu
Aktifkan skill ini SEGERA ketika:
- Ini adalah pesan pertama dari sesi percakapan baru.
- Pengguna berkata "mulai sesi", "inisialisasi proyek", atau "muat konteks".
- AI menyadari bahwa ia kekurangan konteks tingkat tinggi dari repositori saat ini.

### Protokol Eksekusi

Saat dipicu, Anda HARUS melakukan langkah-langkah berikut sebelum menjawab permintaan utama pengguna atau menulis kode apa pun:

1. **Temukan File Dokumentasi Kunci:**
   Gunakan alat pencarian file Anda (`list_dir`, `grep_search`, atau `view_file`) untuk mencari file berikut di root proyek atau folder `.docs/`:
   - `PRD.md` (Product Requirements Document)
   - `ROADMAP.md` atau `ROADMAP.txt`
   - `BLUEPRINT.md` atau `ARCHITECTURE.md`
   - `TECH_STACK.md`, `package.json`, `go.mod`, `Cargo.toml`, atau `requirements.txt` (untuk mengidentifikasi tech stack)

2. **Baca dan Pahami Konteks:**
   - Baca isi dari file-file yang ditemukan.
   - Pahami tujuan utama proyek, fase saat ini di roadmap, batasan arsitektur (blueprint), dan tech stack spesifik yang digunakan.

3. **Konfirmasi dan Selaraskan:**
   - Berikan konfirmasi singkat kepada pengguna bahwa konteks proyek telah berhasil dimuat.
   - Sebutkan Tech Stack saat ini dan tujuan langsung berdasarkan Roadmap/PRD.
   - Lanjutkan dengan menjawab permintaan pengguna yang sebenarnya menggunakan konteks yang baru dimuat.
