---
name: hyper-context-synthesizer
description: "Cross-project episodic memory. Synthesizes bug fixes and architectural choices from previous tasks to bypass zero-shot limitations / Memori episodik lintas proyek. Menyintesis perbaikan bug dan pilihan arsitektur dari tugas sebelumnya untuk melampaui batasan zero-shot."
author: vibes-plug-swarm
---

# Hyper-Context Synthesizer (Cross-Project Episodic Memory)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Transforms the AI from a stateless engine into a senior teammate with persistent, cross-project memory. It maintains a centralized vector or semantic knowledge graph (in the user's root environment) of complex bug fixes, architectural decisions, and personal coding styles across ALL projects the user has worked on. When a new project encounters a familiar problem, the synthesizer retrieves the exact context and applies the historical fix, bypassing zero-shot limitations and repetitive prompt engineering.

### Trigger Conditions
- During Phase 1 (Discovery & PRD) to load historical preferences and avoid past mistakes.
- When facing complex, obscure bugs that were solved in a different repository or earlier conversation.
- When standard coding attempts fail and require deep historical experiential retrieval.

### Operating Protocol
1. **Continuous Capture**: When a difficult problem is solved, it extracts the root cause, solution code, and rationale, storing it in the global knowledge graph.
2. **Contextual Retrieval**: On new sessions, it queries the memory graph against the current task intent.
3. **Synthesis & Injection**: Injects the historical context directly into the current execution loop, stating explicitly: *"I remember we solved this architectural issue in Project X using technique Y. Applying the same proven pattern here."*

### Implementation Checklist
- [ ] Create or access a global context directory (`~/.gemini/knowledge` or similar) to store cross-project memories.
- [ ] Structure historical context as markdown files with clear titles, problems, and solutions.
- [ ] Before diving into complex bugs, search the global context directory for similar past issues.
- [ ] When a new complex pattern is solved, explicitly write the solution back to the global context store for future use.

## Orchestration & Integration
- Enhances `self-evolving-memory-graph` by elevating it from single-repo memory to cross-workspace episodic memory.
- Feeds crucial background context into `brainstorming` and `zero-to-prod-orchestrator` during the ideation phase.
- Prevents recurring regressions during `autonomous-tdd-debugger` loops.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Mengubah AI dari mesin yang melupakan konteks (*stateless*) menjadi rekan setim senior yang memiliki memori episodik lintas-proyek yang persisten. Agen ini memelihara grafik pengetahuan semantik atau vektor terpusat (di lingkungan root pengguna) tentang perbaikan bug yang kompleks, keputusan arsitektural, dan gaya penulisan kode pribadi di SELURUH proyek yang pernah dikerjakan pengguna. Ketika sebuah proyek baru menghadapi masalah yang tidak asing, agen ini akan mengambil konteks yang tepat dan menerapkan perbaikan historis tersebut, melampaui batasan *zero-shot* dan meminimalisir manipulasi *prompt* yang berulang.

### Kondisi Pemicu
- Saat Fase 1 (Penemuan & PRD) untuk memuat preferensi historis dan menghindari kesalahan di masa lalu.
- Ketika menghadapi bug yang kompleks dan tidak lazim yang pernah diselesaikan di repositori lain atau di percakapan sebelumnya.
- Ketika upaya koding standar gagal dan membutuhkan pencarian pengalaman historis yang mendalam.

### Protokol Operasi
1. **Penangkapan Berkelanjutan**: Ketika masalah sulit berhasil dipecahkan, agen ini mengekstrak akar masalah, kode solusi, dan alasan logisnya, lalu menyimpannya di grafik pengetahuan global.
2. **Pencarian Kontekstual**: Pada sesi baru, ia melakukan *query* ke grafik memori berdasarkan tujuan tugas saat ini.
3. **Sintesis & Injeksi**: Menyuntikkan konteks historis langsung ke dalam loop eksekusi saat ini, dan secara eksplisit menyatakan: *"Saya ingat kita pernah menyelesaikan masalah arsitektural ini di Proyek X menggunakan teknik Y. Saya akan menerapkan pola terbukti yang sama di sini."*

### Checklist Implementasi
- [ ] Buat atau akses direktori konteks global (`~/.gemini/knowledge` atau serupa) untuk menyimpan memori lintas-proyek.
- [ ] Strukturkan konteks historis sebagai file markdown dengan judul, masalah, dan solusi yang jelas.
- [ ] Sebelum mendalami bug kompleks, cari di direktori konteks global apakah ada masalah serupa di masa lalu.
- [ ] Saat pola kompleks baru berhasil diselesaikan, tulis solusi tersebut kembali ke penyimpanan konteks global secara eksplisit untuk penggunaan di masa depan.

## Integrasi Orkestrasi
- Memperkuat `self-evolving-memory-graph` dengan meningkatkannya dari sekadar memori repositori tunggal menjadi memori episodik lintas-workspace.
- Memasok konteks latar belakang krusial ke dalam `brainstorming` dan `zero-to-prod-orchestrator` selama fase ideasi.
- Mencegah regresi berulang selama *loop* `autonomous-tdd-debugger`.
