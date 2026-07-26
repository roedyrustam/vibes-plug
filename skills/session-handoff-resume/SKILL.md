---
name: session-handoff-resume
description: "Skill to save ultra-compact project checkpoints and seamlessly resume work across accounts or new chat sessions with minimum token consumption / Skill untuk menyimpan checkpoint proyek yang super ringkas dan melanjutkan pekerjaan secara efisien saat ganti akun/sesi tanpa boros token."
author: "Roedy Rustam"
---

# Session Handoff & Memory Resume Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
A specialized efficiency skill designed for seamless cross-account and cross-session continuations. When your token quota runs out or context window resets, this skill creates an ultra-compact **Handover Checkpoint** (`STATE_HANDOFF.md`). In a new session or account, it instantly resumes work from the exact active task with zero token waste, bypassing redundant codebase scanning.

### Trigger Conditions
- User says: "ganti akun", "token habis", "checkpoint", "save state", "handoff", "resume", "lanjutkan proyek", "baca handoff".
- Prior to switching AI accounts or starting a new chat window.
- Resuming an in-flight development task after a session reset.

---

### Operating Modes

```
+--------------------------------------------------------------------+
|                         MODE A: HANDOFF                            |
| (Before Switching Account: Create Ultra-Compact STATE_HANDOFF.md)  |
+---------------------------------+----------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
|                         MODE B: RESUME                             |
| (New Account / Chat Session: Read ONLY STATE_HANDOFF.md & Continue)|
+--------------------------------------------------------------------+
```

---

### Mode A: Handoff Checkpoint Creation (Save State)
When the user indicates their token is running low or they are switching accounts:

1. Create or overwrite `.agents/STATE_HANDOFF.md` at the project root (or artifact directory).
2. Write an ultra-compact summary using this strict, token-efficient template (max 150 words):

```markdown
# Project Handover Checkpoint

- **Timestamp**: YYYY-MM-DD HH:MM
- **Primary Goal**: [1-2 sentences summarizing overall task]
- **Active Phase**: [e.g., Phase 4: Authentication & Backend APIs]
- **Current Task**: [Exact subtask currently being implemented or debugged]

## Key Architecture & Decisions Made
- [Decision 1: e.g., Using Drizzle ORM with PostgreSQL RLS]
- [Decision 2: e.g., Next.js 15 App Router with Server Actions]

## Recently Modified Files
- [file_basename](file:///path/to/modified/file.ts#L20-L45)

## Next Immediate Action
- [The EXACT next command or code edit to execute in the new session]

## Open Questions / Blockers
- [Any pending user decision or unresolved error, if any]
```

3. Output a brief 2-line response:
   > "Checkpoint saved to `STATE_HANDOFF.md`. You can now switch accounts/sessions and type **'resume'** or **'lanjutkan'**."

---

### Mode B: Zero-Token Resume (Restore State)
When starting a new chat session or after switching accounts:

1. **Do NOT scan the entire codebase or run wide grep searches.**
2. Read ONLY `.agents/STATE_HANDOFF.md` (or `PROGRESS.md` if available).
3. Instantly acknowledge and execute:
   > "Resuming work from `STATE_HANDOFF.md` checkpoint.  
   > **Current Task**: [Current Task]  
   > **Executing Next Step**: [Next Immediate Action]..."
4. Immediately proceed to code, test, or implement the next immediate action without asking redundant questions.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill efisiensi khusus yang dirancang untuk melanjutkan pekerjaan secara mulus lintas akun atau lintas sesi obrolan. Ketika kuota token Anda habis atau jendela konteks di-reset, skill ini akan membuat **Checkpoint Serah Terima** yang super ringkas (`STATE_HANDOFF.md`). Pada akun atau sesi baru, agen dapat langsung melanjutkan pekerjaan dari tugas aktif persis tanpa membuang token untuk membaca ulang seluruh codebase.

### Kondisi Pemicu
- Pengguna berkata: "ganti akun", "token habis", "checkpoint", "save state", "handoff", "resume", "lanjutkan proyek", "baca handoff".
- Sebelum berpindah akun AI atau membuka jendela obrolan baru.
- Melanjutkan tugas pengembangan yang sedang berjalan setelah sesi terputus.

---

### Mode Operasi

#### Mode A: Pembuatan Checkpoint Handoff (Simpan State)
Saat pengguna memberi tahu bahwa token hampir habis atau akan berpindah akun:

1. Buat atau perbarui file `.agents/STATE_HANDOFF.md` di root proyek.
2. Tulis ringkasan super hemat token menggunakan format baku berikut:

```markdown
# Checkpoint Serah Terima Proyek

- **Waktu**: YYYY-MM-DD HH:MM
- **Tujuan Utama**: [1-2 kalimat ringkasan tujuan keseluruhan]
- **Fase Aktif**: [Misal: Fase 4: Autentikasi & API Backend]
- **Tugas Saat Ini**: [Tugas spesifik yang sedang dikerjakan atau di-debug]

## Keputusan Arsitektur Utama
- [Keputusan 1: Misal, Menggunakan Drizzle ORM + Supabase Auth]
- [Keputusan 2: Misal, Tailwind CSS v4 @theme]

## Berkas yang Baru Dimodifikasi
- [file_basename](file:///path/to/modified/file.ts#L20-L45)

## Aksi Selanjutnya (Immediate Next Step)
- [Perintah atau edit kode SPESIFIK yang harus langsung dijalankan di sesi baru]

## Pertanyaan Terbuka / Kendala
- [Keputusan pengguna yang tertunda atau error yang belum selesai, jika ada]
```

3. Tampilkan pesan singkat:
   > "Checkpoint berhasil disimpan di `STATE_HANDOFF.md`. Anda dapat berpindah akun/sesi sekarang dan ketik **'lanjutkan'** atau **'resume'** pada sesi baru."

---

#### Mode B: Resume Hemat Token (Pulihkan State)
Saat memulai sesi baru atau setelah berpindah akun:

1. **JANGAN memindai seluruh direktori proyek atau melakukan pencarian grep massal.**
2. Baca HANYA file `.agents/STATE_HANDOFF.md` (atau `PROGRESS.md`).
3. Langsung konfirmasi dan eksekusi:
   > "Melanjutkan pekerjaan dari checkpoint `STATE_HANDOFF.md`.  
   > **Tugas Aktif**: [Tugas Saat Ini]  
   > **Menjalankan Langkah Berikutnya**: [Aksi Selanjutnya]..."
4. Langsung jalankan tindakan berikutnya tanpa mengajukan pertanyaan yang berulang.
