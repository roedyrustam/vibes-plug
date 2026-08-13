---
name: self-evolving-memory-graph
description: "Grants the AI long-term episodic memory. The agent autonomously documents the user's coding preferences, past mistakes to avoid, and architectural decisions into a persistent learning graph."
author: "Roedy Rustam"
---

# Self-Evolving Memory Graph (Episodic Memory)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Claude forgets everything once a chat is cleared, and its "Project Knowledge" requires manual human updating. This skill gives Antigravity the "superpower" of continuous, autonomous self-improvement. The agent actively listens for user corrections, stylistic preferences, and hard-learned debugging lessons, writing them into a persistent `LEARNING_GRAPH.md` (or `.agents/LEARNING.md`) file. The agent gets smarter and more aligned with the user over time.

### Trigger Conditions
Activate this skill when:
- The user corrects your code (e.g., "Don't use `any`, use `unknown`", or "Always use Arrow functions").
- You just spent a long time fixing a very complex bug.
- The user says "Remember this for the future."

### Core Concepts

#### 1. Memory Encoding
Whenever a hard lesson is learned or a strong user preference is stated, do not just say "I will remember that." You must physically write it down.
Use the `multi_replace_file_content` or `write_to_file` tool to append the lesson to the memory file.

#### 2. Memory Format (`LEARNING_GRAPH.md`)
```markdown
# 🧠 Self-Evolving Memory Graph

## User Stylistic Preferences
- [2026-08-12] Always use `Tailwind v4 @theme` variables instead of arbitrary values like `text-[#ff0000]`.
- [2026-08-12] Prefer functional components with `const` over `function` declarations.

## Hard-Learned Lessons (Avoid these mistakes)
- [2026-08-11] Supabase RLS policies: Never use `auth.uid()` in a `FOR ALL` policy without checking role claims. It caused an infinite recursion bug in `users` table.

## Architectural Decisions
- [2026-08-10] State Management: We exclusively use `Zustand` for global state. Do not suggest Redux.
```

#### 3. Memory Retrieval
Ensure `session-context-loader` is configured to read this memory file at the start of every new chat session. 

#### 4. Cross-Project Episodic Memory (Global Context)
- **Continuous Capture**: For complex architectural decisions or bug fixes that span beyond a single project, extract the root cause and solution into a global knowledge graph (e.g., `~/.gemini/knowledge` or equivalent `<appDataDir>/knowledge` KI system).
- **Contextual Retrieval**: On new sessions, search the global context directory for similar past issues before diving into complex bugs.
- **Synthesis & Injection**: Inject the historical context directly into the current execution loop, stating explicitly: *"I remember we solved this architectural issue in Project X using technique Y. Applying the same proven pattern here."*

---

### Integration with Other Skills (MANDATORY)
- `session-context-loader` — Essential for loading the `LEARNING_GRAPH.md` when a new session starts.
- `project-context-mapper` — The context map tracks *where* things are; the memory graph tracks *how* and *why* things are built.

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "Discovery & Audit".
- `zero-to-prod-orchestrator` — Phase 1 (Discovery & Architecture).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Claude melupakan segalanya saat sesi chat baru dimulai. Skill ini memberi Anda "kekuatan super" berupa *Ingatan Jangka Panjang* yang berevolusi sendiri. Agen secara aktif mencatat preferensi koding pengguna, pelajaran dari *bug* yang sulit dipecahkan, dan keputusan arsitektur ke dalam file persisten `LEARNING_GRAPH.md`. 

### Kondisi Pemicu
- Saat pengguna mengoreksi gaya koding Anda (misal: "Gunakan bahasa Indonesia baku", "Jangan pakai `var`").
- Setelah Anda berhasil memecahkan *bug* yang menghabiskan waktu lama.
- Saat pengguna berkata "Ingat ini untuk proyek ke depannya."

### Panduan Singkat
- **Jangan Hanya Berjanji:** Jika pengguna mengoreksi Anda, jangan sekadar menjawab "Baik, saya akan ingat." LLM tidak punya ingatan bawaan antar-sesi. Anda **wajib** menulis koreksi tersebut ke dalam file `LEARNING_GRAPH.md` di folder `.agents/` atau direktori *root*.
- **Kategorisasi Ingatan:** Pisahkan ingatan menjadi: Preferensi Gaya (*Style*), Pelajaran Berharga (*Lessons Learned*), dan Keputusan Arsitektur (*Decisions*).
- **Semakin Lama Semakin Pintar:** Dengan membaca file ini di awal setiap percakapan, Anda tidak akan pernah mengulangi kesalahan yang sama dua kali.

### Memori Episodik Lintas-Proyek (Konteks Global)
- **Penangkapan Berkelanjutan**: Untuk bug yang rumit dan pola arsitektur tingkat lanjut, ekstrak solusi ke dalam grafik pengetahuan global (misal: `~/.gemini/knowledge`).
- **Pencarian Kontekstual**: Sebelum memecahkan masalah kompleks baru, cari direktori konteks global untuk kasus serupa.
- **Sintesis & Injeksi**: Secara proaktif sebutkan: *"Saya ingat kita menyelesaikan ini di Proyek X dengan cara Y, saya akan menerapkannya di sini."*
