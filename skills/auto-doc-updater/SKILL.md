---
name: auto-doc-updater
description: Otomatis mendokumentasikan setiap perubahan fitur atau perbaikan bug yang berhasil di-build ke CHANGELOG.md dan BLUEPRINT.md.
---

# Auto Documentation Updater

Skill ini aktif untuk memastikan dokumentasi proyek (khususnya `CHANGELOG.md` dan `BLUEPRINT.md`) selalu sinkron dengan kode sumber, tanpa perlu diminta secara eksplisit oleh pengguna.

## Kapan Menggunakan Skill Ini:
Gunakan protokol ini SECARA OTOMATIS segera setelah Anda (agen) berhasil melakukan perubahan kode (fitur baru, perbaikan bug, atau refaktor) DAN Anda telah memverifikasi bahwa aplikasi berhasil di-build tanpa error (misalnya setelah menjalankan `npm run build` dengan sukses).

## Instruksi Pelaksanaan:
Setiap kali siklus perubahan kode berhasil diverifikasi:

1. **Identifikasi Perubahan**: Rangkum apa saja yang baru saja Anda ubah secara teknis maupun fungsional.
2. **Update `CHANGELOG.md`**:
   - Jika versi terbaru sudah ada untuk hari ini, tambahkan poin perubahan di bawah versi tersebut (pada kategori `### Added`, `### Changed`, `### Fixed`, dsb.).
   - Jika belum ada versi untuk hari ini, buat blok versi baru (misalnya dengan increment *patch version* `vX.Y.Z+1`).
3. **Update `BLUEPRINT.md`**:
   - Ubah `Version` dan `Last Updated` date di baris paling atas agar sesuai dengan versi terbaru di `CHANGELOG.md`.
   - Tambahkan poin penjelasan singkat ke bagian "Feature Modules" atau modul arsitektur terkait jika ada penambahan atau pengubahan fitur besar.
4. **Gunakan multi_replace_file_content**:
   Selalu gunakan tool yang tepat (seperti `multi_replace_file_content` atau `replace_file_content`) untuk menyisipkan update dokumentasi dengan aman tanpa merusak struktur file yang ada.
5. **Konfirmasi ke Pengguna**:
   Setelah selesai, beri tahu pengguna di akhir pesan bahwa "CHANGELOG dan BLUEPRINT telah diperbarui secara otomatis".

## Aturan Tambahan:
- Jangan mendokumentasikan error build yang sedang dalam proses perbaikan. Hanya dokumentasikan hasil akhir yang sudah benar-benar sukses dan stabil.
- Gunakan bahasa yang profesional dan deskriptif layaknya *Release Notes*.
