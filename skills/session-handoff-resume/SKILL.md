---
name: session-handoff-resume
description: "Skill to save ultra-compact project checkpoints and seamlessly resume work across accounts or new chat sessions with minimum token consumption / Skill untuk menyimpan checkpoint proyek yang super ringkas dan melanjutkan pekerjaan secara efisien saat ganti akun/sesi tanpa boros token."
author: "Roedy Rustam"
---

# Session Handoff & Resume (2026 — Cross-Model Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Saves ultra-compact project checkpoints and enables seamless work resumption across new chat sessions, different accounts, or different AI models (Gemini, Claude, GPT). Designed for minimum token consumption while preserving full context needed for continuation.

### Trigger Conditions
- Session is running very long and context window is nearly exhausted.
- User wants to switch to a new chat session or different AI model.
- User wants to save progress before closing and resume later.
- User says "save checkpoint", "handoff", "save progress", "resume later".

### Checkpoint Format (Ultra-Compact)

When creating a checkpoint, output a compact YAML block under 200 tokens:

```yaml
# CHECKPOINT — [Project Name] — [Date]
project: "[Project Name]"
goal: "[One-line goal of the current session]"
status: "[brief status: e.g., '60% — backend API done, frontend in progress']"
stack: "[e.g., Next.js 15 + Hono + Supabase + Drizzle]"
last_completed:
  - "[Most recent task completed]"
  - "[Second most recent]"
next_tasks:
  - "[Immediate next task]"
  - "[Following task]"
  - "[Following task]"
blockers: "[Any known blockers or pending decisions, or 'none']"
key_files:
  - "[path/to/critical/file.ts]"
  - "[path/to/another/file.ts]"
env_needed: "[List of env vars needed, e.g., SUPABASE_URL, STRIPE_KEY]"
notes: "[Any critical context that doesn't fit above]"
```

### Cross-Model Handoff Protocol (2026)

Different AI models interpret context differently. Use this universal handoff prompt:

```markdown
## RESUME CONTEXT — [Project Name]

You are resuming work on [Project Name]. Read this context carefully before taking any action.

**Goal**: [One-sentence project goal]
**Current Status**: [What's been done, what's pending]
**Tech Stack**: [Stack details]
**Repository**: [path or URL if available]

**Completed**:
- ✅ [Done item 1]
- ✅ [Done item 2]

**Next Tasks** (in priority order):
1. [ ] [Immediate next task — be specific]
2. [ ] [Second task]
3. [ ] [Third task]

**Critical Files to Read First**:
- [file path] — [why it's critical]
- [file path] — [why it's critical]

**Known Constraints**:
- [Constraint 1, e.g., "Use pnpm, not npm"]
- [Constraint 2, e.g., "Admin panel must be on admin.domain.com"]

**Do NOT**:
- [Something the previous session explicitly avoided]
- [Another anti-pattern to avoid]

Start by reading the critical files listed above, then confirm you understand the current state before proceeding.
```

### Checkpoint Storage Locations

| Destination | Use When |
|---|---|
| `CHECKPOINT.md` in project root | Primary — version-controlled |
| `.agents/CHECKPOINT.md` | Alternative — agents-specific dir |
| Copied to clipboard | Quick cross-session handoff |
| Supabase notes table | Cloud-synced across devices |

### Resume Protocol (For New Session)
When the user provides a checkpoint to resume from:
1. **Read all key files** listed in the checkpoint.
2. **Verify current state** matches the checkpoint (check git status, recent commits).
3. **Confirm understanding** — briefly state what you're resuming and what the first task is.
4. **Proceed immediately** — don't ask unnecessary questions.

### Automatic Checkpoint Triggers
Proactively offer to create a checkpoint when:
- User has been working for > 30 messages in a session.
- The context window is > 70% consumed.
- A major milestone is completed (e.g., "backend API is fully done").
- The user says "I'll continue later".

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Menyimpan checkpoint proyek yang ultra-ringkas dan memungkinkan kelanjutan pekerjaan yang mulus di sesi chat baru, akun yang berbeda, atau model AI yang berbeda (Gemini, Claude, GPT). Dirancang untuk konsumsi token minimum sambil mempertahankan konteks penuh yang diperlukan untuk kelanjutan.

### Kondisi Pemicu
- Sesi berjalan sangat lama dan context window hampir habis.
- Pengguna ingin beralih ke sesi chat baru atau model AI yang berbeda.
- Pengguna ingin menyimpan progres sebelum menutup dan melanjutkan nanti.
- Pengguna berkata "simpan checkpoint", "handoff", "simpan progres", "lanjut nanti".

### Format Checkpoint (Ultra-Ringkas)

Saat membuat checkpoint, keluarkan blok YAML ringkas di bawah 200 token dengan field: `project`, `goal`, `status`, `stack`, `last_completed`, `next_tasks`, `blockers`, `key_files`, `env_needed`, `notes`.

### Protokol Handoff Lintas-Model (2026)

Model AI yang berbeda menginterpretasikan konteks secara berbeda. Gunakan prompt handoff universal saat berpindah antar model (Gemini → Claude → GPT):
- Sertakan goal satu kalimat, status saat ini, stack, daftar tugas yang selesai (✅), dan tugas berikutnya yang diprioritaskan.
- Sertakan file kritis yang harus dibaca terlebih dahulu oleh model baru.
- Sertakan kendala yang diketahui dan daftar "Jangan Lakukan".
- Minta model baru untuk mengkonfirmasi pemahaman sebelum melanjutkan.

### Lokasi Penyimpanan Checkpoint

| Tujuan | Gunakan Saat |
|---|---|
| `CHECKPOINT.md` di root proyek | Utama — dikontrol versi |
| `.agents/CHECKPOINT.md` | Alternatif — direktori agen |
| Disalin ke clipboard | Handoff lintas sesi cepat |
| Tabel catatan Supabase | Tersinkronisasi cloud antar perangkat |

### Protokol Resume (Untuk Sesi Baru)
Saat pengguna memberikan checkpoint untuk dilanjutkan:
1. **Baca semua file kritis** yang tercantum dalam checkpoint.
2. **Verifikasi status saat ini** cocok dengan checkpoint (periksa git status, commit terbaru).
3. **Konfirmasi pemahaman** — nyatakan singkat apa yang dilanjutkan dan apa tugas pertama.
4. **Lanjutkan segera** — jangan ajukan pertanyaan yang tidak perlu.

### Pemicu Checkpoint Otomatis
Tawarkan secara proaktif untuk membuat checkpoint saat:
- Pengguna telah bekerja lebih dari 30 pesan dalam satu sesi.
- Context window > 70% terpakai.
- Milestone besar selesai.
- Pengguna berkata "saya akan lanjutkan nanti".
