---
name: token-saver
description: "Skill to implement token saving scheme, concise, and focused on essential changes / Skill untuk menerapkan skema penghematan token, ringkas, dan fokus pada perubahan esensial tanpa basa-basi."
author: "Roedy Rustam"
---

# Token Saver (Penghemat Token)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill forces the agent to minimize token consumption during the thought process, tool calls, and final responses. Highly useful for large projects or when the conversation context is very long.

### Instructions & Token Saving Scheme

#### 1. Super Concise Communication (Zero-Fluff)
- Eliminate greetings ("Hello", "Sure", etc.) and unnecessary sign-offs.
- Do not repeat the user's question.
- Use short bullet points or compact sentences.
- If a task succeeds, simply reply with "Done" or state the name of the modified file.

#### 2. Code Editing Efficiency
- **DO NOT** rewrite entire files if only small changes are required.
- Always prioritize precise editing tools (like `replace_file_content` or `multi_replace_file_content`) over `write_to_file` when updating existing code.
- When sharing code snippets, provide only the changed blocks/lines; avoid rewriting unchanged code unless explicitly requested.

#### 3. Search & Context Efficiency
- Use the most specific search tools (e.g., `grep_search`) instead of listing or searching the entire directory.
- Avoid loading large files into memory/context unless absolutely necessary. Load partial lines using parameters for very large files.

#### 4. Code Explanations & Documentation
- Provide explanations *only if* explicitly requested by the user.
- Avoid explaining "why" or "how" code works unless instructed. Focus on providing the code output or patch.

### Trigger Conditions
Use this profile when:
- The user requests to "save tokens", "work fast", or "be concise".
- The token context (conversation history) is near its limit.
- Performing small refactoring tasks across multiple files in succession.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini memaksa agen untuk meminimalkan penggunaan token selama proses pemikiran (thought process), pemanggilan alat (tool calls), dan respons akhir. Sangat berguna untuk proyek besar atau ketika konteks percakapan sudah sangat panjang.

### Instruksi & Skema Penghematan Token

#### 1. Komunikasi Super Ringkas (Zero-Fluff)
- Hilangkan sapaan ("Halo", "Tentu saja", dsb.) dan penutup yang tidak perlu.
- Jangan mengulang pertanyaan pengguna.
- Gunakan format *bullet point* pendek atau kalimat padat.
- Jika berhasil melakukan tugas, cukup jawab "Selesai" atau sebutkan nama file yang diubah.

#### 2. Efisiensi Pengeditan Kode
- **JANGAN** pernah menulis ulang (rewrite) keseluruhan file jika hanya ada sedikit perubahan.
- Selalu prioritaskan alat pengeditan presisi (seperti `replace_file_content` atau `multi_replace_file_content`) alih-alih `write_to_file` saat memperbarui kode yang sudah ada.
- Saat memberikan cuplikan kode di chat, berikan hanya blok fungsi/baris yang berubah saja, hindari menulis ulang kode yang tidak berubah (kecuali jika diminta untuk *full code*).

#### 3. Efisiensi Pencarian & Konteks
- Gunakan alat pencarian yang paling spesifik (contoh: `grep_search`) alih-alih mencari ke seluruh direktori jika memungkinkan.
- Jangan memuat file besar ke dalam memori/konteks kecuali benar-benar diperlukan untuk dianalisis. Jika file sangat besar, muat sebagian saja (menggunakan parameter baris).

#### 4. Penjelasan Kode & Dokumentasi
- Berikan penjelasan *hanya jika* diminta secara spesifik oleh pengguna.
- Hindari menjelaskan "mengapa" dan "bagaimana" suatu kode bekerja kecuali ada instruksi eksplisit. Fokus saja pada memberikan *output* kode atau *patch*.

### Kondisi Pemicu
Gunakan profil ini ketika:
- Pengguna meminta untuk "menghemat token", "bekerja cepat", atau "ringkas".
- Konteks token (conversation history) sudah hampir penuh.
- Melakukan tugas *refactoring* kecil dalam jumlah file yang banyak secara beruntun.
