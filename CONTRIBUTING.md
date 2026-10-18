# Contribution Guide / Panduan Kontribusi

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

Thank you for contributing to **Vibes Plug**! This guide is designed to make it easy for you if you have *forked* this repository on GitHub to add or update *skills* according to proper standards.

### Contribution Flow (Step-by-Step)

#### 1. Sync Your Local Repository
Ensure your local repository is connected to the main repository (*upstream*) to get the latest updates.

If you haven't added the main repository as an *upstream* remote, run the following command in your terminal/PowerShell inside the `vibes-plug` directory:

```bash
# Add upstream remote
git remote add upstream https://github.com/roedyrustam/vibes-plug.git
```

Before you start creating a new skill, sync your local `main` branch with upstream:

```bash
# Switch to main branch
git checkout main

# Pull the latest updates from upstream
git pull upstream main

# Sync it to your GitHub fork (origin)
git push origin main
```

#### 2. Create a New Branch
Always create a new, descriptive branch for the changes you want to make:

```bash
git checkout -b feat/add-skill-<skill-name>
# Example: git checkout -b feat/add-skill-fast-api
```

#### 3. Create a New Skill Module
1. Navigate to the `skills/` directory.
2. Create a new folder with your skill name using **kebab-case** (e.g., `skills/fast-api`).
3. Create a `SKILL.md` file inside that folder. You can copy the template from [SKILL_TEMPLATE.md](templates/SKILL_TEMPLATE.md).

Set up the metadata (frontmatter) at the very top of the `SKILL.md` file:

```yaml
---
name: kebab-case-skill-name
description: "Short English description / Deskripsi singkat"
author: "Your Name or GitHub Username"
version: "4.3.0"
---
```

The document body must have the following sections:
- `# Skill Name`
- `## Description` / `## Deskripsi`
- `## Instructions` / `## Instruksi` (Detailed guidelines, code styling rules, concrete code examples)
- `## Orchestration & Integration` / `## Integrasi Orkestrasi` (**Mandatory**: Specify cooperating skills from the 155 ecosystem)
- `## Trigger Conditions` / `## Kondisi Pemicu` (Conditions and context when this skill must be auto-synchronized)

#### 4. Register the Skill in Catalog and Orchestrators
To maintain architectural swarm cohesion, every new skill **must** be registered across the ecosystem:
1. **`README.md`**: Register your skill in the **Features and Available Skills** section under the relevant category.
2. **`CATALOG.md` & `CATALOG.json`**: Register your skill entry with description, domain category, and version.
3. **`skills/brainstorming/SKILL.md`**: Add your skill to the appropriate domain row in the *Skill Integration & Orchestration Matrix*.
4. **`skills/zero-to-prod-orchestrator/SKILL.md`**: Add your skill to the *Orchestrates* list of the relevant Phase (Phase 1 to Phase 8).

#### 5. Run Standardization, Anti-Slop Audit, and Tests
We provide automated scripts to format markdown, align technology stack versions (e.g., React 19, Tailwind v4, Bun, Hono), audit anti-slop rules, and run end-to-end tests.

Run the following commands before committing:

```bash
# 1. Update and standardize skill formats
node scripts/update_skills.mjs

# 2. Run ecosystem validation, anti-slop strict audit, and CLI test suite
npm test
```

Ensure all tests pass (100% green, 0 errors, 0 warnings).

#### 6. Commit and Push Changes
Once everything is neat and validated, commit your changes:

```bash
git add .
git commit -m "feat: add skill <skill-name>"
git push origin feat/add-skill-<skill-name>
```

#### 7. Create a Pull Request (PR)
1. Open your forked repository page on GitHub (e.g., `https://github.com/username/vibes-plug`).
2. Click the **"Compare & pull request"** button.
3. Provide a clear description of the purpose, domain, and utility of the skill you added.
4. Verify that the GitHub Actions CI (`anti-slop-gate` and `test`) passes.
5. Submit your Pull Request (PR) to the `main` branch of the original repository (`roedyrustam/vibes-plug`).

### Additional Rules & Anti-Slop Standards
> [!IMPORTANT]
> - **Sovereign Anti-Slop Directive (Zero-Tolerance)**: Never use `// TODO`, `// ...rest of code`, or fake mocks. Output must be 100% complete and working.
> - **Bilingual Requirement**: Every skill must provide bilingual English & Bahasa Indonesia context.
> - **5-State UI Contract**: Any UI component guidance must include all 5 interactive states (`default`, `hover`, `focus-visible`, `active`, `disabled`).
> - **No Duplicate Skills**: If a similar skill already exists among the 155 catalog, enhance the existing skill rather than duplicating it.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

Terima kasih telah berkontribusi ke **Vibes Plug**! Panduan ini dirancang khusus untuk mempermudah Anda yang telah melakukan *fork* repositori ini di GitHub agar dapat menambahkan atau memperbarui *skills* dengan standar yang sesuai.

### Alur Kontribusi (Step-by-Step)

#### 1. Sinkronisasi Repositori Lokal Anda
Pastikan repositori lokal Anda terhubung dengan repositori utama (*upstream*) agar selalu mendapatkan pembaruan terbaru.

Jika Anda belum menambahkan repositori utama sebagai *upstream*, jalankan perintah berikut di terminal/PowerShell di dalam direktori `vibes-plug`:

```bash
# Tambahkan remote upstream
git remote add upstream https://github.com/roedyrustam/vibes-plug.git
```

Sebelum mulai membuat skill baru, lakukan sinkronisasi branch `main` lokal Anda dengan upstream:

```bash
# Pindah ke branch main
git checkout main

# Tarik pembaruan terbaru dari upstream
git pull upstream main

# Sinkronisasikan ke fork GitHub Anda (origin)
git push origin main
```

#### 2. Buat Branch Baru
Selalu buat branch baru yang deskriptif untuk perubahan yang ingin Anda lakukan:

```bash
git checkout -b feat/add-skill-<nama-skill>
# Contoh: git checkout -b feat/add-skill-fast-api
```

#### 3. Buat Modul Skill Baru
1. Masuk ke direktori `skills/`.
2. Buat folder baru dengan nama skill Anda menggunakan format **kebab-case** (misalnya `skills/fast-api`).
3. Buat file `SKILL.md` di dalam folder tersebut. Anda bisa menyalin template dari [SKILL_TEMPLATE.md](templates/SKILL_TEMPLATE.md).

Atur format metadata (frontmatter) di bagian paling atas file `SKILL.md`:

```yaml
---
name: nama-skill-kebab-case
description: "Deskripsi singkat / Short description"
author: "Nama Anda atau Username GitHub"
version: "4.3.0"
---
```

Struktur isi dokumen wajib memiliki bagian berikut:
- `# Nama Skill`
- `## Deskripsi` / `## Description`
- `## Instruksi` / `## Instructions` (Berisi panduan detail, aturan penulisan kode, dan contoh kode konkret)
- `## Integrasi Orkestrasi` / `## Orchestration & Integration` (**Wajib**: Daftar skill pasangan yang bekerja sama dalam ekosistem)
- `## Kondisi Pemicu` / `## Trigger Conditions` (Kondisi/konteks kapan skill ini harus diaktifkan secara otomatis oleh agen)

#### 4. Daftarkan Skill di Katalog dan Master Orchestrators
Untuk menjaga keutuhan arsitektur multi-agent swarm, setiap skill baru **wajib** didaftarkan di:
1. **`README.md`**: Daftarkan skill Anda di bagian **Fitur dan Skills yang Tersedia** di bawah kategori yang sesuai.
2. **`CATALOG.md` & `CATALOG.json`**: Tambahkan entri skill dengan deskripsi, kategori domain, dan versinya.
3. **`skills/brainstorming/SKILL.md`**: Daftarkan skill ke baris domain yang sesuai pada tabel *Skill Integration & Orchestration Matrix*.
4. **`skills/zero-to-prod-orchestrator/SKILL.md`**: Tambahkan skill ke daftar *Orchestrates* pada Phase yang relevan (Phase 1 hingga Phase 8).

#### 5. Jalankan Script Standardisasi, Anti-Slop Audit, dan Pengujian
Kami menyediakan script otomatis untuk merapikan markdown, menyelaraskan versi stack teknologi (misal React 19, Tailwind v4, Bun, Hono), memeriksa aturan anti-slop, dan menjalankan pengujian menyeluruh.

Jalankan perintah berikut sebelum melakukan commit:

```bash
# 1. Update dan standarisasi format skill
node scripts/update_skills.mjs

# 2. Jalankan validasi ekosistem, audit ketat anti-slop, dan test suite CLI
npm test
```

Pastikan seluruh pengujian lulus 100% (semua centang hijau, 0 error, 0 warning).

#### 6. Commit dan Push Perubahan
Setelah semuanya rapi dan tervalidasi, commit perubahan Anda:

```bash
git add .
git commit -m "feat: add skill <nama-skill>"
git push origin feat/add-skill-<nama-skill>
```

#### 7. Buat Pull Request (PR)
1. Buka halaman repositori hasil fork Anda di GitHub (misal: `https://github.com/username/vibes-plug`).
2. Klik tombol kuning bertuliskan **"Compare & pull request"**.
3. Berikan deskripsi yang jelas mengenai tujuan, kategori domain, dan kegunaan dari skill yang Anda tambahkan.
4. Pastikan pemeriksaan CI di GitHub Actions (`anti-slop-gate` dan `test`) lulus.
5. Kirim Pull Request (PR) Anda ke branch `main` repositori asal (`roedyrustam/vibes-plug`).

### Aturan Tambahan & Standar Anti-Slop
> [!IMPORTANT]
> - **Sovereign Anti-Slop Directive (Zero-Tolerance)**: Dilarang keras menggunakan `// TODO`, `// ...rest of code`, atau fungsi tiruan (*fake mock*). Seluruh kode harus 100% lengkap dan langsung berfungsi (*first-try*).
> - **Kebutuhan Bilingual**: Setiap skill harus dapat dipahami oleh developer pengguna bahasa Inggris dan bahasa Indonesia.
> - **Kontrak Interaktif 5-State UI**: Panduan komponen UI wajib mencakup 5 state interaktif (`default`, `hover`, `focus-visible`, `active`, `disabled`).
> - **Hindari Duplikasi Skill**: Jika skill serupa sudah ada dalam 155 katalog, prioritaskan untuk memperbarui skill yang telah ada.
