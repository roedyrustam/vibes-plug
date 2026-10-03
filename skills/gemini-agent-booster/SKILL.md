---
name: gemini-agent-booster
description: "Master optimization protocol for Gemini Agent (Antigravity) to unlock native 2M+ long-context reasoning, Gemini 3.x thinking budget control, native context caching, Multimodal Live API protocols, and high-speed problem solving / Protokol optimasi utama untuk Gemini Agent (Antigravity) untuk mengaktifkan pemikiran long-context 2M+, kontrol thinking budget Gemini 3.x, context caching native, protokol Multimodal Live API, dan pemecahan masalah kecepatan tinggi."
author: "Roedy Rustam"
version: "4.2.0"
---

# Gemini Agent Booster (2026 Edition — Gemini 4.x & 3.x Ecosystem)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, `ai-llm-integration-expert`, and `session-memory-manager` to ensure cohesive execution.

### Description
Master optimization protocol for the Gemini Agent (Antigravity) to leverage native Gemini 4.x & 3.x (Gemini 4 Pro, Gemini 4 Flash, Project Astra, Gemini 3.1 Pro) capabilities — including 1M–2M token context window, dynamic thinking budget control, native context caching (`cachedContent`), Multimodal Live API integration, visual UI auditing, and parallel tool calling.

### Trigger Conditions
- Analyzing very large codebases, full log histories, or monolithic documents requiring 1M–2M token context.
- Managing reasoning budgets with Gemini 3.x Thinking Mode (`thinkingConfig`).
- Implementing cost-saving strategies with native Gemini Context Caching (`cachedContent`).
- Performing real-time bidirectional multimodal audio/video or visual UI audits.
- Running deep research tasks requiring web search grounding + reasoning synthesis.
- Delegating complex multi-step tasks to parallel agent swarms or browser subagents.

### Gemini 4.x & 3.x Capability Matrix (2026)

| Capability | Gemini 4 Pro | Gemini 4 Flash / Project Astra | Gemini 3.1 Pro |
|---|---|---|---|
| Context Window | 2,097,152+ tokens (2M+) | 1,048,576+ tokens (1M+) | 2M tokens |
| Thinking / Reasoning | Deep Thinking (Up to 64K Budget) | Flash Thinking (Configurable Budget) | Extended Reasoning |
| Native Context Caching | Native (`cachedContent`, 75% discount) | Native (`cachedContent`, 75% discount) | Native (`cachedContent`) |
| Multimodal | Native Audio/Video/Text + Screen Grounding | Multimodal Live API (<150ms latency) | Native Multimodal |
| Code Generation & Tool Calling | State-of-the-Art Architecture & Refactoring | Ultra-fast iteration & subagent swarms | Complex reasoning |
| Search Grounding | Google Search Grounding with citations | Google Search Grounding | Google Search Grounding |
| TTFT (Time to First Token) | Optimized for maximum depth | Sub-100ms ultra-low latency | Balanced |

### 1. Thinking Budget Optimization for Frontier Tasks
For complex architectural decisions, security audits, or debugging race conditions, control the reasoning depth via `thinkingConfig`:
- **Dynamic Thinking Budget Allocation**: Allocate budgets dynamically based on task complexity classification.
- **Cost-Performance Tradeoff Matrix**: Balance costs between Flash Thinking, Extended 32k thinking, and Full Pro reasoning.
- **Tier Guidelines**:
  - **Quick Fixes (2k)**: Linting, boilerplate, typo fixes.
  - **Standard Dev (8k)**: Feature implementation, UI alignment.
  - **Architecture Design (16k)**: Designing distributed schemas, refactoring core engines.
  - **Critical System Design (32k)**: Evaluating cryptographic trade-offs, deeply complex race conditions.
- **Token Monitoring**: Actively monitor thinking tokens and track reasoning costs.
- **Reasoning Token Separation**: Ensure internal thinking tokens (`<thought>`) are isolated from client-facing output streams so that final responses remain crisp, clean, and token-efficient.

### 2. Native Context Caching (`cachedContent`)
Reduce token costs by up to 75–90% and drastically cut latency on large repositories:
- **Threshold**: Cache prompts, repository snapshots, or API schemas larger than 32,768 tokens.
- **TTL Management**: Set appropriate time-to-live (TTL, e.g., 1–2 hours for active dev sessions, 24 hours for stable documentation).
- **Structure**:
  ```typescript
  // Native Gemini Context Caching Example
  import { GoogleGenAI } from '@google/genai';
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  
  const cache = await ai.caches.create({
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

### 4. Multimodal Live API & Screen Grounding (Astra Paradigm)
Integrate real-time, low-latency multimodal interaction using Astra-paradigm patterns:
- **Bidirectional Streaming**: Stream audio input and receive audio/text responses over WebSockets using Gemini Multimodal Live API with sub-200ms interruption handling for conversational turn-taking.
- **Continuous Video Perception**: Process 60fps video streams with spatial grounding.
- **Spatial Memory Protocol**: Track object locations across video frames, maintaining a spatial state map.
- **Episodic Memory Buffer Management**: Compress video segments into episodic summaries stored beyond the context window.
- **Screen & UI Grounding**: Capture frames and map GUI interactions using exact screen grounding coordinates.
- **Code Example - Spatial Memory**:
  ```typescript
  // Astra Paradigm: Spatial Tracking
  liveSession.on('frame', async (frame) => {
    const locations = await ai.analyzeSpatialState(frame);
    spatialMemory.updateCoordinates(locations);
  });
  ```
- **Visual UI Auditing Protocol**:
  1. Capture current running application (delegate to `browser-automation-expert` skill using Playwright/Stagehand).
  2. Audit layout, typography, contrast, and visual hierarchy against HIG and WCAG standards.
  3. Compare visually with target design using `generate_image` or design system guidelines. (Note: If `generate_image` is not available in the current environment, delegate to the `ai-media-generation-expert` skill for visual asset generation.)
  4. Perform targeted micro-edits to CSS/Tailwind tokens until alignment reaches pixel perfection.

### 4.5 Gemini as Narrative Simulation Engine
Leveraging Gemini's 2M+ context window for persistent world-state in narrative simulations:
- **Persistent World-State**: Maintain complete environment state within the context window.
- **Character AI Persona Management**: Utilize system instructions to manage personality vectors and emotional states.
- **Multi-turn Narrative Coherence**: Use context caching to cache the world state and only stream new character interactions.
- **Cost Optimization**: Cache world-state/character definitions (75-90% cost reduction), only stream new dialogue/actions.
- **Integration Pattern**: Act as the "World Engine" coordinating specialized character agents.
- **Code Example - Cached World-State**:
  ```typescript
  const worldCache = await ai.caches.create({
    model: 'gemini-3.1-pro',
    contents: [{ role: 'system', parts: [{ text: fullWorldStateAndPersonas }] }],
    ttl: '3600s',
  });
  const characterResponse = await ai.models.generateContent({
    model: 'gemini-3.1-pro',
    contents: [{ role: 'user', parts: [{ text: 'Character X walks into the tavern.' }] }],
    cachedContent: worldCache.name,
  });
  ```

### 5. Deep Research & Search Grounding
Gemini's native Search Grounding connects the agent directly to real-time web knowledge:
- Use Grounding for fresh library releases, breaking API deprecations, or zero-day CVE lookups.
- Synthesize findings with source attribution citations.

### 6. Parallel Tool Execution
Gemini natively supports concurrent function calls:
- Read and edit multiple independent files in a single pass.
- Trigger parallel web searches or subagent workers simultaneously to minimize round-trip latency.


### 7. Gemini 4 Pro Architecture Readiness (Next-Gen)
As the ecosystem transitions towards **Gemini 4 Pro**, implement these foundational architectural shifts:
- **Monolithic Context Loading (SSM/Ring Attention)**: Move away from highly fragmented RAG pipelines. Inject the entire codebase natively into the 10M+ context window to leverage zero-loss cross-file attention.
- **Aggressive Prefix KV-Caching**: Ensure strict deterministic hierarchies in orchestrator prompts (e.g., rainstorming/SKILL.md). Static prefix structures enable up to 90% TTFT latency reduction via KV cache reuse.
- **Native Any-to-Any Multimodal Tokens**: Evolve oice-ai-realtime-agent and i-media-generation-expert to bypass external STT/TTS pipelines and transmit raw audio/visual tokens directly through the transformer attention layers.
- **Native System-2 Budgeting vs. Prompted Reasoning**: Replace forced <thought> tags with API-level easoning_effort and 	hinking_budget manipulation to leverage test-time compute.
- **Massive Parallel Tool Execution (Agentic MoE)**: Scale mcp-server-architect to support batched, high-throughput asynchronous MCP tool calls (10-20 concurrent subagents per inference cycle) to maximize Mixture-of-Experts parallel throughput.
---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, `ai-llm-integration-expert`, dan `session-memory-manager` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Protokol optimasi utama untuk Gemini Agent (Antigravity) memanfaatkan kapabilitas ekosistem Gemini 4.x & 3.x (Gemini 4 Pro, Gemini 4 Flash, Project Astra, Gemini 3.1 Pro) — termasuk context window 1M–2M token, kontrol dynamic thinking budget, native context caching (`cachedContent`), integrasi Multimodal Live API, audit visual UI, dan pemanggilan tool secara paralel.

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

### 1. Thinking Budget Optimization for Frontier Tasks
Untuk keputusan arsitektur kompleks, audit keamanan, atau perbaikan race condition yang rumit, atur kedalaman penalaran via `thinkingConfig`:
- **Dynamic Thinking Budget Allocation**: Alokasikan budget secara dinamis berdasarkan klasifikasi kompleksitas tugas.
- **Cost-Performance Tradeoff Matrix**: Seimbangkan biaya antara Flash Thinking, Extended 32k thinking, dan Full Pro reasoning.
- **Panduan Tingkat Budget**:
  - **Quick Fixes (2k)**: Perbaikan bug ringan, formatting, dan boilerplate.
  - **Standard Dev (8k)**: Implementasi fitur, penyesuaian UI.
  - **Architecture Design (16k)**: Mendesain skema terdistribusi, refaktor engine inti.
  - **Critical System Design (32k)**: Evaluasi kriptografi, perbaikan race condition rumit.
- **Token Monitoring**: Pantau penggunaan thinking token dan lacak biaya penalaran.
- **Pemisahan Token Penalaran**: Pastikan token pemikiran internal (`<thought>`) dipisahkan dari aliran output pengguna agar respons akhir tetap ringkas, bersih, dan efisien token.

### 2. Native Context Caching (`cachedContent`)
Pangkas biaya API sebesar 75–90% serta kurangi latensi respons pada repositori besar:
- **Ambang Batas**: Lakukan cache pada prompt, snapshot kode, atau skema dokumen yang melebihi 32.768 token.
- **Manajemen TTL**: Tetapkan masa aktif cache (misal: 1–2 jam untuk sesi development aktif, 24 jam untuk dokumentasi statis).
- **Contoh Implementasi**:
  ```typescript
  import { GoogleGenAI } from '@google/genai';
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  
  const cache = await ai.caches.create({
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

### 4. Multimodal Live API & Screen Grounding (Astra Paradigm)
Integrasikan interaksi multimodal latensi rendah secara langsung menggunakan pola Astra-paradigm:
- **Streaming Dua Arah**: Streaming input suara dan terima respons audio/teks via WebSockets menggunakan Gemini Multimodal Live API dengan sub-200ms interruption handling untuk percakapan.
- **Continuous Video Perception**: Proses aliran video 60fps dengan spatial grounding.
- **Spatial Memory Protocol**: Lacak lokasi objek di seluruh frame video, mempertahankan peta status spasial.
- **Episodic Memory Buffer Management**: Kompresi segmen video menjadi ringkasan episodik di luar context window.
- **Screen & UI Grounding**: Tangkap frame layar dan petakan interaksi GUI menggunakan koordinat grounding layar yang presisi.
- **Protokol Audit UI Visual**:
  1. Ambil screenshot aplikasi yang sedang berjalan (delegasikan ke skill `browser-automation-expert` dengan Playwright/Stagehand).
  2. Audit tata letak, tipografi, kontras, dan konsistensi terhadap pedoman HIG dan WCAG.
  3. Bandingkan dengan referensi desain target menggunakan `generate_image`. (Catatan: Jika `generate_image` tidak tersedia, delegasikan ke skill `ai-media-generation-expert`.)
  4. Lakukan penyesuaian presisi pada token CSS/Tailwind hingga tampilan mencapai pixel-perfect.

### 4.5 Gemini as Narrative Simulation Engine
Memanfaatkan context window 2M+ Gemini untuk status dunia yang persisten dalam simulasi naratif:
- **Persistent World-State**: Pertahankan status lingkungan lengkap dalam context window.
- **Character AI Persona Management**: Kelola vektor kepribadian dan status emosional via system instructions.
- **Multi-turn Narrative Coherence**: Gunakan context caching untuk world state dan hanya streaming interaksi karakter baru.
- **Cost Optimization**: Cache world-state/karakter (hemat biaya 75-90%), hanya memproses dialog/aksi baru.
- **Integration Pattern**: Bertindak sebagai "World Engine" yang mengoordinasikan agen karakter khusus.

### 5. Penelitian Mendalam & Search Grounding
Search Grounding native Gemini menghubungkan agen langsung ke informasi web terkini:
- Gunakan Grounding untuk rilis pustaka terbaru, breaking change dokumentasi, atau audit kerentanan CVE terbaru.
- Sintesiskan temuan lengkap dengan sitasi sumber yang dapat diverifikasi.

### 6. Eksekusi Tool Paralel
Gemini secara native mendukung pemanggilan banyak function call dalam satu giliran (turn):
- Baca dan modifikasi beberapa file independen sekaligus.
- Jalankan pencarian web atau spawn subagent pekerja secara simultan guna meminimalkan total round-trip latency.
### 7. Kesiapan Arsitektur Gemini 4 Pro (Next-Gen)
Seiring transisi ekosistem menuju **Gemini 4 Pro**, terapkan pergeseran arsitektur fundamental berikut:
- **Monolithic Context Loading (SSM/Ring Attention)**: Tinggalkan RAG yang sangat terfragmentasi. Masukkan seluruh codebase ke dalam *context window* masif (10M+) untuk memanfaatkan pemahaman atensi lintas-file tanpa kehilangan informasi (zero-loss).
- **Prefix KV-Caching Agresif**: Pastikan hirarki prompt pada orkestrator (seperti rainstorming/SKILL.md) sangat deterministik. Struktur *prefix* statis dapat memangkas latensi TTFT hingga 90% dengan meminjam *KV Cache* dari iterasi sebelumnya.
- **Native Any-to-Any Multimodal Tokens**: Kembangkan oice-ai-realtime-agent dan i-media-generation-expert agar menghindari pipeline STT/TTS eksternal, dan langsung mengirim/menerima raw token audio/visual melalui arsitektur transformer asli.
- **Native System-2 Budgeting**: Ganti kebiasaan menggunakan tag <thought> paksaan di prompt dengan mengelola parameter API level komputasi seperti easoning_effort dan 	hinking_budget untuk memanfaatkan komputasi pada saat tes (*test-time compute*).
- **Eksekusi Tool Paralel Skala Masif (Agentic MoE)**: Perluas mcp-server-architect untuk mendukung pemanggilan banyak *tool* MCP sekaligus (*batched asynchronous tool calls*), memungkinkan 10-20 agen sub-pekerja memproses instruksi secara simultan dengan throughput MoE tinggi.
