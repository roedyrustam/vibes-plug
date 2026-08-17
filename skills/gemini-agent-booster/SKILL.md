---
name: gemini-agent-booster
description: "Master optimization protocol for Gemini Agent (Antigravity) to unlock native 1M+ long-context reasoning, multimodal vision UI audits, visual subagent feedback, and high-speed problem solving / Protokol optimasi utama untuk Gemini Agent (Antigravity) untuk mengaktifkan pemikiran long-context 1M+, audit UI visual multimodal, dan pemecahan masalah kecepatan tinggi."
author: "vibes-plug-swarm"
---

# Gemini Agent Booster (2026 Edition — Gemini 2.5 Pro/Flash)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
Master optimization protocol for the Gemini Agent (Antigravity) to leverage native Gemini 2.5 Pro/Flash capabilities — including 1M+ token context window, multimodal vision analysis, deep research mode, thinking chains, and high-speed code generation.

### Trigger Conditions
- Analyzing very large codebases, logs, or documents that require 1M+ token context.
- Performing multimodal UI audits (analyzing screenshots of running applications).
- Running deep research tasks requiring web search + reasoning synthesis.
- Generating large, complex code artifacts in a single pass.
- Delegating complex multi-step tasks to browser subagents.

### Gemini 2.5 Pro/Flash Capabilities (2026)

| Capability | Gemini 2.5 Pro | Gemini 2.5 Flash |
|---|---|---|
| Context Window | 1M tokens | 1M tokens |
| Thinking / Reasoning | ✅ Extended thinking | ✅ Flash thinking |
| Multimodal (Image/Video) | ✅ | ✅ |
| Code Generation | Best-in-class | Very fast |
| Web Search (Grounding) | ✅ | ✅ |
| Deep Research | ✅ (up to 30 min) | ✅ |
| Audio | ✅ | ✅ |
| Speed | Slower | 5-10x faster |
| Cost | Higher | Lower |

### 1M+ Token Long-Context Strategies

When working with very large inputs (codebases, documents, logs):
1. **Pass full file trees** — use `list_dir` to get the complete file tree, then pass relevant files to maximize context.
2. **Read whole files, not snippets** — with 1M context, read entire source files rather than grepping for fragments.
3. **Cross-file analysis** — trace data flows, imports, and interfaces across multiple files simultaneously.
4. **Log analysis** — pass entire server logs (up to hundreds of thousands of lines) for pattern detection.
5. **Codebase onboarding** — ingest an entire unfamiliar repo in one pass for deep architectural understanding.

### Multimodal Vision — UI Audit Protocol
Use the `browser_subagent` + `generate_image` tools for visual feedback:
1. **Screenshot the running app** via browser subagent.
2. **Analyze the screenshot** for layout issues, accessibility problems, design inconsistencies, Core Web Vitals opportunities.
3. **Generate a target design** using `generate_image` for visual comparison.
4. **Iterate code** based on visual delta between current and target design.

### Thinking Mode — Mandatory Extended Reasoning (o1-Style)
For any complex problem, architecture decision, or large refactor, you MUST engage Gemini's extended thinking or generate a mandatory explicit reasoning chain (`<thought>`) before generating code:
- Architecture decisions with multiple tradeoffs.
- Debugging hard-to-reproduce race conditions.
- Designing multi-step agentic workflows.
- Cryptographic or security-sensitive implementations.
- **Protocol**: State the problem clearly → engage deep reasoning chain → critique your own initial assumptions → validate the conclusion → execute tool calls.

### Deep Research Mode
Gemini 2.5 Pro's deep research can spend up to 30 minutes actively searching, reading, and synthesizing from hundreds of sources. Use for:
- Market research before building a new feature.
- Security vulnerability research.
- Competitive analysis of existing tools.
- Collecting the latest API documentation for a framework.

### Speed Optimization — Flash for Iteration
Use **Gemini 2.5 Flash** for:
- Quick code generation, small file edits.
- Rapid back-and-forth iteration (linting, formatting, small bug fixes).
- High-volume batch processing.

Use **Gemini 2.5 Pro** for:
- Complex architecture decisions.
- Long-context full-codebase analysis.
- Security audits requiring deep reasoning.
- Generating comprehensive documentation.

### Agent Parallelism
Gemini Agent natively supports parallel tool calls — run independent operations simultaneously:
- Read multiple files at once.
- Run multiple searches in parallel.
- Spawn multiple browser subagents for concurrent tasks.
- Write multiple files simultaneously.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Protokol optimasi utama untuk Gemini Agent (Antigravity) memanfaatkan kemampuan native Gemini 2.5 Pro/Flash — termasuk context window 1M+ token, analisis visi multimodal, mode penelitian mendalam, rantai pemikiran, dan generasi kode berkecepatan tinggi.

### Kondisi Pemicu
- Menganalisis codebase, log, atau dokumen yang sangat besar yang memerlukan konteks 1M+ token.
- Melakukan audit UI multimodal (menganalisis screenshot aplikasi yang berjalan).
- Menjalankan tugas penelitian mendalam yang memerlukan pencarian web + sintesis penalaran.
- Menghasilkan artefak kode yang besar dan kompleks dalam satu lintasan.
- Mendelegasikan tugas multi-langkah kompleks ke browser subagent.

### Kemampuan Gemini 2.5 Pro/Flash (2026)

| Kemampuan | Gemini 2.5 Pro | Gemini 2.5 Flash |
|---|---|---|
| Context Window | 1M token | 1M token |
| Pemikiran / Penalaran | ✅ Extended thinking | ✅ Flash thinking |
| Multimodal (Gambar/Video) | ✅ | ✅ |
| Generasi Kode | Terbaik di kelasnya | Sangat cepat |
| Pencarian Web (Grounding) | ✅ | ✅ |
| Penelitian Mendalam | ✅ (hingga 30 mnt) | ✅ |
| Kecepatan | Lebih lambat | 5-10x lebih cepat |
| Biaya | Lebih tinggi | Lebih rendah |

### Strategi Long-Context 1M+ Token
Manfaatkan jendela konteks besar dengan membaca seluruh file (bukan hanya fragment), melewatkan seluruh pohon file proyek, menganalisis aliran data lintas file secara bersamaan, dan menganalisis log server lengkap untuk deteksi pola.

### Visi Multimodal — Protokol Audit UI
Gunakan `browser_subagent` untuk mengambil screenshot aplikasi yang berjalan, analisis secara visual untuk masalah tata letak atau aksesibilitas, buat desain target dengan `generate_image`, lalu iterasi kode berdasarkan delta visual.

### Mode Pemikiran — Penalaran Mendalam (Mandatori)
Untuk masalah kompleks (keputusan arsitektur, debugging race condition, alur kerja agentik), Anda **DIWAJIBKAN** untuk mengaktifkan mode pemikiran diperpanjang (*extended reasoning*) atau menuliskan rantai pemikiran (`<thought>`) secara eksplisit untuk mengevaluasi asumsi Anda sebelum menghasilkan kode solusi. Jangan bertindak impulsif.

### Mode Penelitian Mendalam
Gemini 2.5 Pro dapat menghabiskan hingga 30 menit secara aktif mencari, membaca, dan mensintesis dari ratusan sumber. Ideal untuk riset pasar, kerentanan keamanan, analisis kompetitif, atau pengumpulan dokumentasi API terbaru.

### Flash untuk Iterasi, Pro untuk Kedalaman
- **Flash**: Edit cepat, iterasi bolak-balik, pemrosesan batch.
- **Pro**: Keputusan arsitektur, analisis codebase penuh, audit keamanan, dokumentasi komprehensif.

### Paralelisme Agen
Gemini Agent mendukung pemanggilan tool paralel secara native — jalankan operasi independen secara bersamaan untuk memaksimalkan throughput.
