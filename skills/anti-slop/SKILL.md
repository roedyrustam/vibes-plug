---
name: anti-slop
description: "Comprehensive Anti-AI Slop enforcement guide. Updated to include token efficiency and code gardening / Panduan penegakan anti-AI slop komprehensif. Diperbarui dengan efisiensi token dan perawatan kode."
author: "Roedy Rustam"
version: "3.0.0"
---

# Anti-Slop, Token Efficiency & Code Gardening Protocol (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description & Trigger Conditions
The absolute zero-tolerance standard against AI slop, bloated context, and architectural decay. AI slop manifests as conversational pleasantries, lazy placeholders, speculative over-engineering, decorative comments, and vague buzzwords. This skill enforces rigorous anti-slop rules, token-saving compression, and code gardening across the engineering lifecycle.
Triggers: Any code generation/modification, automated reviews, long-running sessions, explicit "be concise/minimal" requests, or when a codebase exhibits "AI smell" (inconsistencies, duplication, dead code).

---

## The 5 Pillars of AI Slop Elimination

### Pillar 1: Conversational & Sycophancy Slop
- **🔴 Forbidden**: Preambles ("Certainly! I'd be happy to help"), prompt echoing, apology loops, trailing motivational fluff.
- **✅ Standard**: Imperative, code-first communication. Zero filler. 

### Pillar 2: Placeholder & Truncation Slop ("Lazy LLM")
- **🔴 Forbidden**: `// TODO: implement`, `// ... rest of code`, or returning mock arrays when production features are requested.
- **✅ Standard**: Output must be 100% complete, functional, and production-ready.

### Pillar 3: Speculative & Decorative Over-Engineering Slop
- **🔴 Forbidden**: Creating factory patterns (`IUserServiceFactoryProvider`) for single implementations, triple-validated defensive code when TypeScript/Zod guarantee type safety.
- **✅ Standard**: YAGNI (You Aren't Gonna Need It). Write the simplest direct implementation. Trust the types.

### Pillar 4: Obvious & Decorative Comment Slop
- **🔴 Forbidden**: Narrating syntax line-by-line (e.g., `// Increment count by 1 \n setCount(count + 1);`).
- **✅ Standard**: Comments explain WHY (architectural decisions, business constraints), never WHAT.

### Pillar 5: Buzzword & Artifact Slop
- **🔴 Forbidden**: Documents filled with generic marketing jargon ("seamless integration", "robust synergy") with zero technical density.
- **✅ Standard**: High technical density with explicit schemas, route tables, column types, and verifiable NFR latency budgets.

---

## Token Efficiency & Compression Protocol

### 1. Response Compression Rules
- **No preamble/restatement/summaries**: Show code immediately, explain briefly after.
- **Diff format**: For file edits, show only changed lines.
- **Bullet > prose**: Use 1-sentence rationales over paragraphs.

### 2. Context Window Budget Awareness (200K Context)
```text
System prompt + skills: ~15K | Conversation history: ~50K | File reads: ~100K | Response: ~35K
```
- Summarize large files mentally; `view_file` only specific sections. Create a checkpoint with `session-memory-manager` when near full.

### 3. Tool Call Minimization & First Draft Quality
- Read multiple files in parallel.
- Use `grep_search` over full reads.
- Generate correct, production-ready code with inline error handling on the first try. Avoid edit-retry cycles.

---

## Legacy Code Gardening Protocol

### 1. Context Drift Analysis & Code Smells
- **Inconsistent Styles**: Mixed `async/await` vs `.then()`, variable namings (`userId` vs `user_id`). Fix with Prettier/ESLint rules.
- **Bloated Components**: 5+ states, 10+ props, 20+ imports. Apply Single Responsibility and split them.
- **Dependency Creep**: Use `npx depcheck` for unused dependencies and `npx bundle-phobia-cli` for sizing.
- **Graveyard of Dead Utilities**: Use semantic search/grep to find and remove 0-usage exported functions.

### 2. 4-Phase Gardening Protocol
1. **Discovery**: Map file tree, find bloated files, duplicated logic, unused exports, and style drift.
2. **Triage**: Categorize into Critical (bugs/data loss), High (diverging duplicates), Medium (smells), Low (style).
3. **Systematic Refactoring**: Start smallest first. Remove dead code, extract duplicates, simplify abstractions, standardize names, add tests.
4. **Prevention**: Add strict ESLint rules, `depcheck` in CI, and architecture tests.

---

## Automated Anti-Slop Audit Script
Run `scripts/check-anti-slop.js` in CI to detect placeholders (`// ...`), unfinished stubs (`TODO:`), mock data in prod, and syntax narration (`// increment`). Fail builds if AI slop is detected.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi & Kondisi Pemicu
Standar nol-toleransi terhadap AI slop, pemborosan token, dan pembusukan arsitektur. AI slop muncul sebagai basa-basi, placeholder, over-engineering spekulatif, dan komentar dekoratif. Skill ini menegakkan anti-slop, kompresi respons, dan perawatan kode (code gardening).
Pemicu: Pembuatan/modifikasi kode, review otomatis, sesi panjang, permintaan respons ringkas, atau saat codebase menunjukkan "AI smell" (inkonsistensi, duplikasi, kode mati).

---

### 5 Pilar Utama Pembasmian AI Slop

1. **Pilar 1: Eliminasi Basa-Basi Percakapan** - Dilarang menggunakan pengantar atau pengulangan instruksi. Harus *code-first* dan tanpa basa-basi.
2. **Pilar 2: Larangan Placeholder & Truncation ("Lazy LLM")** - Dilarang keras menggunakan `// TODO` atau memotong kode. Wajib 100% lengkap dan siap produksi.
3. **Pilar 3: Anti Over-Engineering Spekulatif** - Hindari *factory pattern* atau layer ekstra tanpa alasan. Jangan validasi ganda jika Zod/TypeScript sudah menanganinya. Terapkan YAGNI.
4. **Pilar 4: Eliminasi Komentar Sintaksis** - Jangan menarasikan baris kode (mis. `// tambah satu`). Komentar hanya untuk menjelaskan MENGAPA (alasan bisnis/arsitektur).
5. **Pilar 5: Eliminasi Slop Dokumen & Buzzword** - Hindari kata-kata marketing kosong. Gunakan densitas teknis tinggi dengan skema pasti dan metrik konkret.

---

### Protokol Efisiensi & Kompresi Token

- **Kompresi Respons**: Gunakan format diff untuk kode. Penjelasan menggunakan poin 1-kalimat daripada paragraf. Tanpa basa-basi.
- **Budget 200K Konteks**: Batasi baca file penuh; gunakan `grep_search`. Buat checkpoint dengan `session-memory-manager` jika token menipis.
- **Efisiensi Tool**: Baca file paralel, temukan konten spesifik dengan grep. Hasilkan draf pertama yang siap produksi tanpa siklus edit berulang.

---

### Protokol Berkebun Kode Warisan (Code Gardening)

1. **Analisis Context Drift**: Perbaiki inkonsistensi gaya (contoh: `async` vs `then`, `userId` vs `user_id`) dengan ESLint/Prettier.
2. **Komponen Membengkak**: Pecah komponen yang memiliki >5 state, >10 prop, atau >20 impor berdasarkan Tanggung Jawab Tunggal.
3. **Utilitas Mati & Dependensi**: Hapus fungsi tanpa penggunaan. Gunakan `npx depcheck` untuk package tidak terpakai dan `bundle-phobia-cli` untuk ukuran.
4. **Protokol 4 Fase**:
   - *Discovery*: Petakan duplikasi dan kode mati.
   - *Triage*: Kategorikan Kritis hingga Rendah.
   - *Refactoring*: Hapus kode mati, ekstrak duplikat, sederhanakan abstraksi, tambah test.
   - *Prevention*: Tambahkan ESLint strict, depcheck CI, dan uji arsitektur.

---

## Orchestration & Integration
- `zero-to-prod-orchestrator`: Anti-slop checks at architectural and deployment phases.
- `session-memory-manager`: Context resets when token budgets approach limits.
- `scalability-clean-code`: Enforces SOLID boundaries against speculative over-engineering.
- `autonomous-tdd-debugger`: Validates execution completeness over mock/stub code.
- `coderabbit` & `brainstorming`: Clean PR reviews and dense documentation.
- `dependency-upgrade-migrator`: Integrates with dependency audits (`depcheck`).