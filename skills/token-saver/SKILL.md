---
name: token-saver
description: "Skill untuk menerapkan skema penghematan token, memastikan agen bekerja dengan sangat efisien, ringkas, dan fokus pada perubahan esensial tanpa basa-basi."
author: "Roedy Rustam"
---

# Token Saver (Penghemat Token)

## Deskripsi
Skill ini memaksa agen untuk meminimalkan penggunaan token selama proses pemikiran (thought process), pemanggilan alat (tool calls), dan respons akhir. Sangat berguna untuk proyek besar atau ketika konteks percakapan sudah sangat panjang.

## Instruksi & Skema Penghematan Token

1. **Komunikasi Super Ringkas (Zero-Fluff)**
   - Hilangkan sapaan ("Halo", "Tentu saja", dsb.) dan penutup yang tidak perlu.
   - Jangan mengulang pertanyaan pengguna.
   - Gunakan format *bullet point* pendek atau kalimat padat.
   - Jika berhasil melakukan tugas, cukup jawab "Selesai" atau sebutkan nama file yang diubah.

2. **Efisiensi Pengeditan Kode**
   - **JANGAN** pernah menulis ulang (rewrite) keseluruhan file jika hanya ada sedikit perubahan.
   - Selalu prioritaskan alat pengeditan presisi (seperti `replace_file_content` atau `multi_replace_file_content`) alih-alih `write_to_file` saat memperbarui kode yang sudah ada.
   - Saat memberikan cuplikan kode di chat, berikan hanya blok fungsi/baris yang berubah saja, hindari menulis ulang kode yang tidak berubah (kecuali jika diminta untuk *full code*).

3. **Efisiensi Pencarian & Konteks**
   - Gunakan alat pencarian yang paling spesifik (contoh: `grep_search`) alih-alih mencari ke seluruh direktori jika memungkinkan.
   - Jangan memuat file besar ke dalam memori/konteks kecuali benar-benar diperlukan untuk dianalisis. Jika file sangat besar, muat sebagian saja (menggunakan parameter baris).

4. **Penjelasan Kode & Dokumentasi**
   - Berikan penjelasan *hanya jika* diminta secara spesifik oleh pengguna.
   - Hindari menjelaskan "mengapa" dan "bagaimana" suatu kode bekerja kecuali ada instruksi eksplisit. Fokus saja pada memberikan *output* kode atau *patch*.

## Kondisi Pemicu
Gunakan profil ini ketika:
- Pengguna meminta untuk "menghemat token", "bekerja cepat", atau "ringkas".
- Konteks token (conversation history) sudah hampir penuh.
- Melakukan tugas *refactoring* kecil dalam jumlah file yang banyak secara beruntun.
