---
name: seo-geo
description: "Optimasi Mesin Pencari Generatif (GEO) untuk AI Overviews, ChatGPT, dan Perplexity / Generative Engine Optimization (GEO) for AI Overviews, ChatGPT, and Perplexity."
author: "Roedy Rustam"
user-invokable: true
argument-hint: "[url]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebFetch
---

# AI Search / GEO Optimization (Generative Engine Optimization)

[Bahasa Indonesia](#bahasa-indonesia) | [English](#english)

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Kondisi Pemicu
Gunakan skill ini ketika:
- Meningkatkan visibilitas pada AI Overviews (Google), ChatGPT Search, Perplexity, atau sistem pencarian AI sejenis.
- Mengevaluasi kesiapan file `llms.txt`, akses AI crawler, atau struktur konten yang berorientasi pada citasi (kutipan).
- Pengguna bertanya tentang GEO, AI SEO, visibilitas LLM, atau mencegah halusinasi AI tentang merek mereka.

### Perubahan Paradigma & Statistik Utama
- **AI Overviews Reach**: 1,5 miliar+ pengguna/bulan. Google mendominasi pencarian tingkat atas.
- **AI-referred Sessions Growth**: Pertumbuhan 527% sesi rujukan AI. AI menggantikan pencarian tautan biru tradisional.
- **Brand Mentions & Semantic Trust**: Sebutan merek dan data entitas terstruktur berkorelasi 3x lebih kuat dengan visibilitas AI daripada backlink tradisional.
- **Pencegahan Halusinasi**: AI bergantung pada fakta yang definitif, tidak ambigu, dan ditandai secara semantik.

### Kriteria Analisis GEO
1. **Citability Score (Skor Citasi) (25%)**: Panjang teks optimal 134-167 kata untuk citasi AI. Jawaban langsung harus ada di 40-60 kata pertama.
2. **HTML Semantik & Keterbacaan Struktur (20%)**: LLM membaca struktur untuk memahami konteks. Gunakan tag semantik (`<article>`, `<section>`, `<aside>`) dan hierarki heading yang ketat (H1 -> H2 -> H3).
3. **Konten Multi-Modal & Terstruktur (15%)**: Konten dengan elemen multi-modal (tabel markdown, daftar langkah, grafik) memiliki tingkat pemilihan 156% lebih tinggi oleh AI.
4. **Otoritas, Entitas & Sinyal Merek (20%)**: AI memverifikasi fakta lintas platform. Butuh keberadaan entitas di Wikidata, Reddit, dan profil penulis (Person schema).
5. **Aksesibilitas Teknis untuk LLM (20%)**: Crawler AI tidak mengeksekusi JavaScript. Server-Side Rendering (SSR) atau Static Site Generation (SSG) wajib digunakan.

### Standar llms.txt
Standard **llms.txt** memberikan panduan konten terstruktur untuk crawler AI, melewati noise visual (layout/navigasi).
**Lokasi**: `/llms.txt` (root domain).

---

<a name="english"></a>
## English

### Trigger Conditions
Use this skill when:
- Improving visibility in AI Overviews (Google), ChatGPT Search, Perplexity, or similar AI search systems.
- Evaluating `llms.txt` readiness, AI crawler access, or citation-oriented content structure.
- The user asks about GEO, AI SEO, LLM visibility, or preventing AI hallucinations regarding their brand.

### Paradigm Shift & Key Statistics
- **AI Overviews Reach**: 1.5 billion+ users/month. Google dominates top-of-funnel discovery.
- **AI-referred Sessions Growth**: 527% growth in sessions referred by AI. AI is replacing traditional 10-blue-links search.
- **Brand Mentions & Semantic Trust**: Brand mentions and structured entity data correlate 3x more strongly with AI visibility than traditional backlinks.
- **Hallucination Prevention**: AI relies on definitive, unambiguous, and semantically tagged facts.

### GEO Analysis Criteria
1. **Citability Score (25%)**: Optimal passage length of 134-167 words for AI citation. Direct answers must reside in the first 40-60 words.
2. **Semantic HTML & Structural Readability (20%)**: LLMs read structure to understand context. Use semantic tags (`<article>`, `<section>`, `<aside>`) and strict heading hierarchy (H1 -> H2 -> H3).
3. **Multi-Modal & Structured Content (15%)**: Content with multi-modal elements (markdown tables, step lists, charts) sees 156% higher selection rates by AI.
4. **Authority, Entity & Brand Signals (20%)**: AI verifies facts across platforms. Requires entity presence on Wikidata, Reddit, and author profiles (Person schema).
5. **Technical Accessibility for LLMs (20%)**: AI crawlers do NOT execute JavaScript. Server-Side Rendering (SSR) or Static Site Generation (SSG) is mandatory.

### llms.txt Standard
The **llms.txt** standard provides AI crawlers with structured content guidance, bypassing visual noise.
**Location**: `/llms.txt` (domain root).
