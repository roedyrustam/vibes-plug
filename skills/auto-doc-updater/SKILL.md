---
name: auto-doc-updater
description: "Automatically documents every feature change or bug fix successfully built into CHANGELOG.md and BLUEPRINT.md / Otomatis mendokumentasikan setiap perubahan fitur atau perbaikan bug yang berhasil di-build ke CHANGELOG.md dan BLUEPRINT.md."
author: "roedy"
---

# Auto Documentation Updater

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill ensures that project documentation (specifically `CHANGELOG.md` and `BLUEPRINT.md`) remains synchronized with the source code, without requiring explicit user requests.

### Execution Instructions

#### When to Use This Skill:
Use this protocol AUTOMATICALLY as soon as you (the agent) successfully execute code changes (new features, bug fixes, or refactoring) AND you have verified that the application builds successfully without errors (e.g., after a successful `npm run build`).

#### Execution Steps:
Whenever a code change cycle is successfully verified:
1. **Identify Changes**: Summarize what was changed technically and functionally.
2. **Update `CHANGELOG.md`**:
   - If today's version block already exists, append the change points under the appropriate category (`### Added`, `### Changed`, `### Fixed`, etc.).
   - If today's version block does not exist, create a new version block (e.g., incrementing patch version `vX.Y.Z+1`).
3. **Update `BLUEPRINT.md`**:
   - Update `Version` and `Last Updated` date at the top to match the latest version in `CHANGELOG.md`.
   - Add short descriptions to the "Feature Modules" or corresponding architectural modules for major features or changes.
4. **Use multi_replace_file_content**:
   Always use precise tools (such as `multi_replace_file_content` or `replace_file_content`) to inject documentation updates safely without breaking the file structure.
5. **Confirm to User**:
   Upon completion, notify the user at the end of your response that "CHANGELOG and BLUEPRINT have been automatically updated".

### Additional Rules:
- Do not document build errors that are currently being debugged. Only document successful, stable, and final results.
- Use professional, descriptive release notes style language.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini aktif untuk memastikan dokumentasi proyek (khususnya `CHANGELOG.md` dan `BLUEPRINT.md`) selalu sinkron dengan kode sumber, tanpa perlu diminta secara eksplisit oleh pengguna.

### Instruksi Pelaksanaan

#### Kapan Menggunakan Skill Ini:
Gunakan protokol ini SECARA OTOMATIS segera setelah Anda (agen) berhasil melakukan perubahan kode (fitur baru, perbaikan bug, atau refaktor) DAN Anda telah memverifikasi bahwa aplikasi berhasil di-build tanpa error (misalnya setelah menjalankan `npm run build` dengan sukses).

#### Langkah Pelaksanaan:
Setiap kali siklus perubahan kode berhasil diverifikasi:
1. **Identifikasi Perubahan**: Rangkum apa saja yang baru saja Anda ubah secara teknis maupun fungsional.
2. **Update `CHANGELOG.md`**:
   - Jika versi terbaru sudah ada untuk hari ini, tambahkan poin perubahan di bawah versi tersebut (pada kategori `### Added`, `### Changed`, `### Fixed`, dsb.).
   - Jika belum ada versi untuk hari ini, buat blok versi baru (misalnya dengan increment *patch version* `vX.Y.Z+1`).
3. **Update `BLUEPRINT.md`**:
   - Ubah `Version` and `Last Updated` date di baris paling atas agar sesuai dengan versi terbaru di `CHANGELOG.md`.
   - Tambahkan poin penjelasan singkat ke bagian "Feature Modules" atau modul arsitektur terkait jika ada penambahan atau pengubahan fitur besar.
4. **Gunakan multi_replace_file_content**:
   Selalu gunakan tool yang tepat (seperti `multi_replace_file_content` atau `replace_file_content`) untuk menyisipkan update dokumentasi dengan aman tanpa merusak struktur file yang ada.
5. **Konfirmasi ke Pengguna**:
   Setelah selesai, beri tahu pengguna di akhir pesan bahwa "CHANGELOG dan BLUEPRINT telah diperbarui secara otomatis".

### Aturan Tambahan:
- Jangan mendokumentasikan error build yang sedang dalam proses perbaikan. Hanya dokumentasikan hasil akhir yang sudah benar-benar sukses dan stabil.
- Gunakan bahasa yang profesional dan deskriptif layaknya *Release Notes*.
