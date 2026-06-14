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
3. Create a `SKILL.md` file inside that folder. You can copy the template from [SKILL.md](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/skill_baru/SKILL.md).

Set up the metadata (frontmatter) at the very top of the `SKILL.md` file:

```yaml
---
name: kebab-case-skill-name
description: "Short English description / Deskripsi singkat"
author: "Your Name or GitHub Username"
---
```

The document body must have the following sections:
- `# Skill Name`
- `## Description`
- `## Instructions` (Contains detailed guidelines, code styling rules, etc.)
- `## Trigger Conditions` (Conditions/context under which this skill should be activated by the agent)

#### 4. Register the Skill in README.md and BLUEPRINT.md
To make your new skill recognized and easily discoverable:
1. **`README.md`**: Register your skill in the **Features and Available Skills** section under the relevant category.
2. **`BLUEPRINT.md`**: Register your skill module in the **Skill Modules** section.

#### 5. Run the Standardization Script
We provide an automated script to format markdown, align technology stack versions (e.g., React 19, Next.js 15), and fix emoji encoding issues.

Run the following command before committing:

```bash
node scripts/update_skills.js
```

Ensure the script runs successfully and check if any of your new skill files were updated.

#### 6. Commit and Push Changes
Once everything is neat and validated, commit your changes:

```bash
git add .
git commit -m "feat: add skill <skill-name>"
git push origin feat/add-skill-<skill-name>
```

#### 7. Create a Pull Request (PR)
1. Open your forked repository page on GitHub (e.g., `https://github.com/username/vibes-plug`).
2. You will see a yellow button saying **"Compare & pull request"**. Click that button.
3. Provide a clear description of the purpose and utility of the skill you added.
4. Submit your Pull Request (PR) to the `main` branch of the original repository (`roedyrustam/vibes-plug`).

### Additional Rules & Tips
> [!NOTE]
> - Ensure instructions are written in a clear and instructive language.
> - Avoid duplicate instructions with existing skills. If your skill is similar, consider updating an existing skill instead.
> - Do not include extra frontmatter fields other than `name`, `description`, and `author`, as they will be cleaned automatically by the `update_skills.js` script.

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
3. Buat file `SKILL.md` di dalam folder tersebut. Anda bisa menyalin template dari [SKILL.md](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/skill_baru/SKILL.md).

Atur format metadata (frontmatter) di bagian paling atas file `SKILL.md`:

```yaml
---
name: nama-skill-kebab-case
description: "Deskripsi singkat / Short description"
author: "Nama Anda atau Username GitHub"
---
```

Struktur isi dokumen harus memiliki bagian berikut:
- `# Nama Skill`
- `## Deskripsi`
- `## Instruksi` (Berisi panduan detail, aturan penulisan kode, dll.)
- `## Kondisi Pemicu` (Kondisi/konteks kapan skill ini harus diaktifkan oleh agen)

#### 4. Daftarkan Skill di README.md dan BLUEPRINT.md
Agar skill baru Anda dikenali dan mudah ditemukan:
1. **`README.md`**: Daftarkan skill Anda di bagian **Fitur dan Skills yang Tersedia** di bawah kategori yang relevan.
2. **`BLUEPRINT.md`**: Daftarkan modul skill Anda di bagian **Skill Modules**.

#### 5. Jalankan Script Standardisasi
Kami menyediakan script otomatis untuk merapikan markdown, menyelaraskan versi stack teknologi (misal React 19, Next.js 15), serta memperbaiki isu encoding emoji.

Jalankan perintah berikut sebelum melakukan commit:

```bash
node scripts/update_skills.js
```

Pastikan script berjalan dengan sukses dan laporkan jika ada file skill baru Anda yang diperbarui.

#### 6. Commit dan Push Perubahan
Setelah semuanya rapi dan tervalidasi, commit perubahan Anda:

```bash
git add .
git commit -m "feat: add skill <nama-skill>"
git push origin feat/add-skill-<nama-skill>
```

#### 7. Buat Pull Request (PR)
1. Buka halaman repositori hasil fork Anda di GitHub (misal: `https://github.com/username/vibes-plug`).
2. Anda akan melihat tombol kuning bertuliskan **"Compare & pull request"**. Klik tombol tersebut.
3. Berikan deskripsi yang jelas mengenai tujuan dan kegunaan dari skill yang Anda tambahkan.
4. Kirim Pull Request (PR) Anda ke branch `main` repositori asal (`roedyrustam/vibes-plug`).

### Aturan Tambahan & Tips
> [!NOTE]
> - Pastikan instruksi ditulis dengan bahasa yang jelas dan instruktif.
> - Hindari duplikasi instruksi dengan skill yang sudah ada. Jika skill Anda mirip, pertimbangkan untuk memperbarui skill yang telah ada.
> - Jangan menyertakan frontmatter tambahan di luar `name`, `description`, dan `author`, karena akan dibersihkan secara otomatis oleh script `update_skills.js`.
