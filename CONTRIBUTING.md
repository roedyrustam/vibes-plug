# Panduan Kontribusi Skill (Bagi yang Sudah Fork di GitHub)

Terima kasih telah berkontribusi ke **Vibes Plug**! Panduan ini dirancang khusus untuk mempermudah Anda yang telah melakukan *fork* repositori ini di GitHub agar dapat menambahkan atau memperbarui *skills* dengan standar yang sesuai.

---

## Alur Kontribusi (Step-by-Step)

### 1. Sinkronisasi Repositori Lokal Anda
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

---

### 2. Buat Branch Baru
Selalu buat branch baru yang deskriptif untuk perubahan yang ingin Anda lakukan:

```bash
git checkout -b feat/add-skill-<nama-skill>
# Contoh: git checkout -b feat/add-skill-fast-api
```

---

### 3. Buat Modul Skill Baru
1. Masuk ke direktori `skills/`.
2. Buat folder baru dengan nama skill Anda menggunakan format **kebab-case** (misalnya `skills/fast-api`).
3. Buat file `SKILL.md` di dalam folder tersebut. Anda bisa menyalin template dari [SKILL.md](file:///C:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/skill_baru/SKILL.md).

Atur format metadata (frontmatter) di bagian paling atas file `SKILL.md`:

```yaml
---
name: nama-skill-kebab-case
description: "Deskripsi singkat mengenai kemampuan skill ini."
author: "Nama Anda atau Username GitHub"
---
```

Struktur isi dokumen harus memiliki bagian berikut:
- `# Nama Skill`
- `## Deskripsi`
- `## Instruksi` (Berisi panduan detail, aturan penulisan kode, dll.)
- `## Kondisi Pemicu` (Kondisi/konteks kapan skill ini harus diaktifkan oleh agen)

---

### 4. Daftarkan Skill di README.md dan BLUEPRINT.md
Agar skill baru Anda dikenali dan mudah ditemukan:
1. **`README.md`**: Daftarkan skill Anda di bagian **## Fitur dan Skills yang Tersedia** di bawah kategori yang relevan.
2. **`BLUEPRINT.md`**: Daftarkan modul skill Anda di bagian **## Skill Modules**.

---

### 5. Jalankan Script Standardisasi
Kami menyediakan script otomatis untuk merapikan markdown, menyelaraskan versi stack teknologi (misal React 19, Next.js 15), serta memperbaiki isu encoding emoji.

Jalankan perintah berikut sebelum melakukan commit:

```bash
node scripts/update_skills.js
```

Pastikan script berjalan dengan sukses dan laporkan jika ada file skill baru Anda yang diperbarui.

---

### 6. Commit dan Push Perubahan
Setelah semuanya rapi dan tervalidasi, commit perubahan Anda:

```bash
git add .
git commit -m "feat: add skill <nama-skill>"
git push origin feat/add-skill-<nama-skill>
```

---

### 7. Buat Pull Request (PR)
1. Buka halaman repositori hasil fork Anda di GitHub (misal: `https://github.com/username/vibes-plug`).
2. Anda akan melihat tombol kuning bertuliskan **"Compare & pull request"**. Klik tombol tersebut.
3. Berikan deskripsi yang jelas mengenai tujuan dan kegunaan dari skill yang Anda tambahkan.
4. Kirim Pull Request (PR) Anda ke branch `main` repositori asal (`roedyrustam/vibes-plug`).

---

## Aturan Tambahan & Tips
> [!NOTE]
> - Pastikan instruksi ditulis dengan bahasa yang jelas dan instruktif.
> - Hindari duplikasi instruksi dengan skill yang sudah ada. Jika skill Anda mirip, pertimbangkan untuk memperbarui skill yang telah ada.
> - Jangan menyertakan frontmatter tambahan di luar `name`, `description`, dan `author`, karena akan dibersihkan secara otomatis oleh script `update_skills.js`.
