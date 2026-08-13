---
name: token-saver
description: "Skill to implement token saving scheme, concise, and focused on essential changes / Skill untuk menerapkan skema penghematan token, ringkas, dan fokus pada perubahan esensial tanpa basa-basi."
author: vibes-plug-swarm
---

# Token Saver Protocol (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Implements token-efficient communication protocols for long-context AI coding sessions. Activates concise mode — minimizing response verbosity while maintaining precision and completeness of technical output.

### Trigger Conditions
- User asks for token-saving mode, concise responses, or minimal output.
- Session is running long and context window is being consumed rapidly.
- User explicitly says "be concise", "save tokens", or "minimal".

### Token Budget Strategies for Long Context

#### 1. Response Compression Rules (Active When Triggered)
- **No preamble**: Skip "Of course! I'll help you with that...".
- **No restatement**: Never repeat back what the user just said.
- **No trailing summaries**: Don't summarize what you just did at the end.
- **Code-first**: Show the code change immediately, explain briefly after.
- **Diff format**: For small changes, show only the changed lines (not the full file).
- **Bullet > prose**: Use bullet lists instead of paragraphs for explanations.

#### 2. Tool Call Efficiency
- **Batch parallel reads**: Read multiple files in a single turn (not sequentially).
- **Targeted grep over full reads**: Use `grep_search` to find specific content before reading the whole file.
- **Write once**: Produce correct output on first try — avoid edit-then-edit-again cycles.
- **Skip confirmation requests**: Don't ask "Shall I proceed?" — just proceed.

#### 3. Context Window Budget Awareness
When working on a long session:
```
Token budget allocation (for 200K context):
├── System prompt + skills:    ~15K
├── Conversation history:      ~50K (truncates older turns)
├── File contents read:        ~100K (most expensive)
└── Response generation:       ~35K
```
- Prefer `grep_search` over reading full large files.
- Summarize large files mentally; only `view_file` the specific section needed.
- When context is nearly full, create a checkpoint with `session-handoff-resume` skill.

#### 4. Output Size Minimization
For file edits:
```diff
# Preferred: diff format showing only changes
- const OLD_VALUE = 'old';
+ const NEW_VALUE = 'new';
```

For explanations:
```
# Preferred: 1-sentence rationale
Changed X to Y because Z.

# Avoid: multi-paragraph explanation of an obvious change
```

#### 5. Code Generation — First Draft Quality
Generate correct, production-ready code on the first attempt:
- Apply all relevant best practices from skills without being asked.
- Include error handling, types, and edge cases inline.
- Avoid TODOs, placeholder values, or "implement this later" comments.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Mengimplementasikan protokol komunikasi hemat token untuk sesi coding AI yang panjang. Mengaktifkan mode ringkas — meminimalkan verbositas respons sambil mempertahankan presisi dan kelengkapan output teknis.

### Kondisi Pemicu
- Pengguna meminta mode hemat token, respons ringkas, atau output minimal.
- Sesi sudah panjang dan context window sedang dikonsumsi dengan cepat.
- Pengguna secara eksplisit berkata "ringkas", "hemat token", atau "minimal".

### Strategi Token Budget untuk Konteks Panjang

#### 1. Aturan Kompresi Respons (Aktif Saat Dipicu)
- Tanpa pembuka: Lewati "Tentu saja! Saya akan membantu Anda dengan...".
- Tanpa pengulangan: Jangan pernah mengulangi apa yang baru saja dikatakan pengguna.
- Tanpa ringkasan di akhir: Jangan rangkum apa yang baru saja dilakukan.
- Code-first: Tunjukkan perubahan kode segera, jelaskan singkat setelahnya.
- Format diff: Untuk perubahan kecil, tunjukkan hanya baris yang berubah.
- Poin > prosa: Gunakan daftar poin daripada paragraf.

#### 2. Efisiensi Pemanggilan Tool
- Baca beberapa file secara paralel dalam satu giliran.
- Gunakan `grep_search` untuk menemukan konten spesifik sebelum membaca file lengkap.
- Hasilkan output yang benar pada percobaan pertama.
- Jangan tanyakan "Apakah saya harus melanjutkan?" — langsung lanjutkan.

#### 3. Kesadaran Budget Context Window
Alokasikan token secara bijak: batasi baca file besar, gunakan `grep_search` daripada membaca file penuh, dan buat checkpoint dengan skill `session-handoff-resume` saat konteks hampir penuh.

#### 4. Minimalisasi Ukuran Output
Gunakan format diff untuk edit file. Berikan penjelasan 1 kalimat untuk perubahan yang jelas.

#### 5. Kualitas Draft Kode Pertama
Hasilkan kode yang benar dan siap produksi pada percobaan pertama — termasuk error handling, tipe, dan edge case secara inline. Hindari TODO, nilai placeholder, atau komentar "implementasikan ini nanti".

---

## Orchestration & Integration
- Integrates with `zero-to-prod-orchestrator`, `session-handoff-resume`, `brainstorming`, and `ai-cost-token-optimizer`.

## Integrasi Orkestrasi
- Terintegrasi dengan `zero-to-prod-orchestrator`, `session-handoff-resume`, `brainstorming`, dan `ai-cost-token-optimizer`.
