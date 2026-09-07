---
name: gemini-agent-booster
description: "Master optimization protocol for Gemini Agent (Antigravity) to unlock native 2M+ long-context reasoning, Gemini 3.x thinking budget control, native context caching, Multimodal Live API protocols, and high-speed problem solving / Protokol optimasi utama untuk Gemini Agent (Antigravity) untuk mengaktifkan pemikiran long-context 2M+, kontrol thinking budget Gemini 3.x, context caching native, protokol Multimodal Live API, dan pemecahan masalah kecepatan tinggi."
author: "vibes-plug-swarm"
---

# Gemini Agent Booster (2026 Edition — Gemini 3.x Ecosystem)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, `ai-llm-integration-expert`, and `project-context-mapper` to ensure cohesive execution.

### Description
Master optimization protocol for the Gemini Agent (Antigravity) to leverage native Gemini 3.x (Gemini 3.8 Flash, Gemini 3.5/3.1 Pro/Flash) capabilities — including 1M–2M token context window, dynamic thinking budget control, native context caching (`cachedContent`), Multimodal Live API integration, visual UI auditing, and parallel tool calling.

### Trigger Conditions
- Analyzing very large codebases, full log histories, or monolithic documents requiring 1M–2M token context.
- Managing reasoning budgets with Gemini 3.x Thinking Mode (`thinkingConfig`).
- Implementing cost-saving strategies with native Gemini Context Caching (`cachedContent`).
- Performing real-time bidirectional multimodal audio/video or visual UI audits.
- Running deep research tasks requiring web search grounding + reasoning synthesis.
- Delegating complex multi-step tasks to parallel agent swarms or browser subagents.

### Gemini 3.x Capability Matrix (2026)

| Capability | Gemini 3.1 / 3.5 Pro | Gemini 3.8 / 3.1 Flash |
|---|---|---|
| Context Window | Up to 2M tokens | 1M–2M tokens |
| Thinking / Reasoning | Extended Reasoning (Deep Think) | Flash Thinking (Configurable Budget) |
| Native Context Caching | Supported (`cachedContent`) | Supported (`cachedContent`) |
| Multimodal (Image/Video/Audio) | Native Multimodal | Native Multimodal + Live API |
| Code Generation & Tool Calling | State-of-the-Art Architecture | Ultra-fast iteration & subagents |
| Search Grounding | Google Search Grounding | Google Search Grounding |
| TTFT (Time to First Token) | Optimized for depth | 3–5x lower latency |
| Relative Cost Profile | Higher (for critical paths) | Ultra-low cost (ideal for high-frequency loops) |

### 1. Dynamic Thinking Budget & Reasoning Protocol
For complex architectural decisions, security audits, or debugging race conditions, control the reasoning depth via `thinkingConfig`:
- **Flash Thinking for Rapid Tasks**: Set lower or default thinking budgets for quick bug fixes, linting, and boilerplate generation.
- **Extended Thinking for Critical Paths**: Allocate high thinking budgets (e.g. 8k–32k thinking tokens) when designing distributed schemas, refactoring core engines, or evaluating cryptographic trade-offs.
- **Reasoning Token Separation**: Ensure internal thinking tokens (`<thought>`) are isolated from client-facing output streams so that final responses remain crisp, clean, and token-efficient.

### 2. Native Context Caching (`cachedContent`)
Reduce token costs by up to 75–90% and drastically cut latency on large repositories:
- **Threshold**: Cache prompts, repository snapshots, or API schemas larger than 32,768 tokens.
- **TTL Management**: Set appropriate time-to-live (TTL, e.g., 1–2 hours for active dev sessions, 24 hours for stable documentation).
- **Structure**:
  ```typescript
  // Native Gemini Context Caching Example
  const cache = await ai.createCachedContent({
    model: 'gemini-3.1-pro',
    contents: [{ role: 'user', parts: [{ text: fullCodebaseDump }] }],
    ttl: '3600s',
  });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro',
    contents: [{ role: 'user', parts: [{ text: 'Locate memory leak in worker thread' }] }],
    cachedContent: cache.name,
  });
  ```

### 3. 2M+ Token Long-Context Strategies
When inspecting massive codebases:
1. **Pass Full File Trees**: Use `list_dir` to obtain the complete project structure, then supply full source files into context.
2. **Whole-File Ingestion**: With 1M–2M context, avoid grep fragmentation; inspect complete classes and dependency trees in one shot.
3. **Cross-Service Traceability**: Analyze upstream microservice contracts, protobufs, and frontend consumers concurrently in the same session.
4. **Massive Server Logs**: Ingest complete production logs to uncover subtle intermittent race conditions and memory leaks.

### 4. Multimodal Live API & Screen Grounding
Integrate real-time, low-latency multimodal interaction:
- **Bidirectional Streaming**: Stream audio input and receive audio/text responses over WebSockets using Gemini Multimodal Live API.
- **Screen & UI Grounding**: Capture frames from browser subagents or desktop windows; Gemini grounds user queries directly to coordinate points on screen.
- **Visual UI Auditing Protocol**:
  1. Capture current running application via `browser_subagent`.
  2. Audit layout, typography, contrast, and visual hierarchy against HIG and WCAG standards.
  3. Compare visually with target design using `generate_image` or design system guidelines.
  4. Perform targeted micro-edits to CSS/Tailwind tokens until alignment reaches pixel perfection.

### 5. Deep Research & Search Grounding
Gemini's native Search Grounding connects the agent directly to real-time web knowledge:
- Use Grounding for fresh library releases, breaking API deprecations, or zero-day CVE lookups.
- Synthesize findings with source attribution citations.

### 6. Parallel Tool Execution
Gemini natively supports concurrent function calls:
- Read and edit multiple independent files in a single pass.
- Trigger parallel web searches or subagent workers simultaneously to minimize round-trip latency.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, `ai-llm-integration-expert`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Protokol optimasi utama untuk Gemini Agent (Antigravity) memanfaatkan kapabilitas ekosistem Gemini 3.x (Gemini 3.8 Flash, Gemini 3.5/3.1 Pro/Flash) — termasuk context window 1M–2M token, kontrol dynamic thinking budget, native context caching (`cachedContent`), integrasi Multimodal Live API, audit visual UI, dan pemanggilan tool secara paralel.

### Kondisi Pemicu
- Menganalisis codebase skala besar, histori log lengkap, atau dokumen monolitik yang membutuhkan konteks 1M–2M token.
- Mengatur alokasi reasoning budget dengan Gemini 3.x Thinking Mode (`thinkingConfig`).
- Menerapkan strategi pemangkasan biaya melalui native Gemini Context Caching (`cachedContent`).
- Menjalankan interaksi audio/video dua arah secara real-time atau audit visual UI.
- Menjalankan tugas riset mendalam dengan Google Search Grounding + sintesis penalaran.
- Mendelegasikan tugas multi-langkah ke swarm agen paralel atau browser subagent.

### Matriks Kapabilitas Gemini 3.x (2026)

| Kapabilitas | Gemini 3.1 / 3.5 Pro | Gemini 3.8 / 3.1 Flash |
|---|---|---|
| Context Window | Hingga 2M token | 1M–2M token |
| Pemikiran / Penalaran | Extended Reasoning (Deep Think) | Flash Thinking (Configurable Budget) |
| Native Context Caching | Didukung (`cachedContent`) | Didukung (`cachedContent`) |
| Multimodal (Gambar/Video/Audio) | Native Multimodal | Native Multimodal + Live API |
| Generasi Kode & Tool Calling | Arsitektur State-of-the-Art | Iterasi & subagent ultra-cepat |
| Search Grounding | Google Search Grounding | Google Search Grounding |
| TTFT (Latensi Token Pertama) | Dioptimalkan untuk kedalaman | 3–5x lebih cepat |
| Profil Biaya | Lebih tinggi (untuk alur kritis) | Sangat hemat (ideal untuk perulangan cepat) |

### 1. Dynamic Thinking Budget & Protokol Penalaran
Untuk keputusan arsitektur kompleks, audit keamanan, atau perbaikan race condition yang rumit, atur kedalaman penalaran via `thinkingConfig`:
- **Flash Thinking untuk Tugas Cepat**: Gunakan alokasi budget penalaran default atau rendah untuk perbaikan bug ringan, formatting, dan boilerplate.
- **Extended Thinking untuk Alur Kritis**: Alokasikan budget penalaran tinggi (misal: 8k–32k thinking tokens) saat mendesain skema terdistribusi, refaktor engine inti, atau evaluasi kriptografi.
- **Pemisahan Token Penalaran**: Pastikan token pemikiran internal (`<thought>`) dipisahkan dari aliran output pengguna agar respons akhir tetap ringkas, bersih, dan efisien token.

### 2. Native Context Caching (`cachedContent`)
Pangkas biaya API sebesar 75–90% serta kurangi latensi respons pada repositori besar:
- **Ambang Batas**: Lakukan cache pada prompt, snapshot kode, atau skema dokumen yang melebihi 32.768 token.
- **Manajemen TTL**: Tetapkan masa aktif cache (misal: 1–2 jam untuk sesi development aktif, 24 jam untuk dokumentasi statis).
- **Contoh Implementasi**:
  ```typescript
  const cache = await ai.createCachedContent({
    model: 'gemini-3.1-pro',
    contents: [{ role: 'user', parts: [{ text: fullCodebaseDump }] }],
    ttl: '3600s',
  });
  ```

### 3. Strategi Long-Context 2M+ Token
Saat menganalisis repositori besar:
1. **Pohon File Penuh**: Gunakan `list_dir` untuk memetakan struktur proyek, lalu masukkan seluruh file terkait ke dalam konteks.
2. **Ingesti File Penuh**: Dengan jendela 1M–2M token, hindari fragmentasi grep; periksa seluruh class dan dependency tree secara menyeluruh.
3. **Pelacakan Antar Layanan**: Analisis kontrak upstream microservice, skema database, dan frontend consumer secara bersamaan dalam satu sesi.
4. **Log Produksi Lengkap**: Masukkan ratusan ribu baris log untuk mengungkap anomali memori dan race condition intermiten.

### 4. Multimodal Live API & Screen Grounding
Integrasikan interaksi multimodal latensi rendah secara langsung:
- **Streaming Dua Arah**: Streaming input suara dan terima respons audio/teks via WebSockets menggunakan Gemini Multimodal Live API.
- **Screen & UI Grounding**: Tangkap frame layar dari browser subagent; Gemini memetakan perintah ke koordinat visual yang presisi di layar.
- **Protokol Audit UI Visual**:
  1. Ambil screenshot aplikasi yang sedang berjalan via `browser_subagent`.
  2. Audit tata letak, tipografi, kontras, dan konsistensi terhadap pedoman HIG dan WCAG.
  3. Bandingkan dengan referensi desain target menggunakan `generate_image`.
  4. Lakukan penyesuaian presisi pada token CSS/Tailwind hingga tampilan mencapai pixel-perfect.

### 5. Penelitian Mendalam & Search Grounding
Search Grounding native Gemini menghubungkan agen langsung ke informasi web terkini:
- Gunakan Grounding untuk rilis pustaka terbaru, breaking change dokumentasi, atau audit kerentanan CVE terbaru.
- Sintesiskan temuan lengkap dengan sitasi sumber yang dapat diverifikasi.

### 6. Eksekusi Tool Paralel
Gemini secara native mendukung pemanggilan banyak function call dalam satu giliran (turn):
- Baca dan modifikasi beberapa file independen sekaligus.
- Jalankan pencarian web atau spawn subagent pekerja secara simultan guna meminimalkan total round-trip latency.
