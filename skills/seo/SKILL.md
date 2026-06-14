---
name: seo
description: "Run a broad SEO audit across technical SEO, on-page SEO, schema, sitemaps, content quality, AI search readiness, and GEO / Audit SEO menyeluruh (Technical, On-Page, Schema, Sitemap, E-E-A-T, GEO)"
author: "Roedy Rustam"
user-invokable: true
argument-hint: "[command] [url]"
---

# SEO: Universal SEO Analysis Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Comprehensive SEO analysis across all industries (SaaS, local services, e-commerce, publishers, agencies). Orchestrates specialized sub-skills and subagents, heavily emphasizing **Modern Web Performance** and **AI Search Readiness (GEO)**.

### Trigger Conditions
- Use when the user asks for a full SEO audit or broad SEO strategy.
- Use as the umbrella entry point when multiple SEO dimensions are in scope.
- Use when the task spans technical SEO, content, schema, sitemaps, and AI search readiness together.

### Quick Reference Commands
- `/seo audit <url>`: Full website audit with parallel subagent delegation.
- `/seo page <url>`: Deep single-page analysis.
- `/seo sitemap <url or generate>`: Analyze or generate XML sitemaps.
- `/seo schema <url>`: Detect, validate, and generate Schema.org markup.
- `/seo images <url>`: Image optimization analysis (WebP, lazy-load, alt-text).
- `/seo technical <url>`: Technical SEO audit (Architecture, CWV, Crawlability).
- `/seo content <url>`: E-E-A-T and content quality analysis.
- `/seo geo <url>`: AI Overviews / Generative Engine Optimization.
- `/seo plan <business-type>`: Strategic SEO planning.

### Quality Gates & Modern Web Rules
- **Thin Content**: WARNING at 30+ location pages (enforce 60%+ unique content).
- **Schema Deprecations**: Never recommend HowTo schema (deprecated Sept 2023). FAQ schema only for government and healthcare sites.
- **Core Web Vitals**: All performance references must use INP (Interaction to Next Paint), never FID. LCP must be < 2.5s.
- **AI-First Indexing**: Always check for `llms.txt` readiness, semantic HTML tags, and clean text extraction for LLM crawlers.

### Scoring Methodology (SEO Health Score)
Weighted aggregate of all categories:
- **Technical SEO (20%)**: Crawlability, HTTPS, Architecture.
- **Content Quality (E-E-A-T) (20%)**: Depth, Originality, Authoritativeness.
- **On-Page SEO (15%)**: Title, Meta, Headers, Keywords.
- **Performance (CWV) (15%)**: LCP, INP, CLS, Mobile-First.
- **AI Search Readiness (GEO) (15%)**: Citability, llms.txt, Semantic HTML.
- **Schema / Structured Data (10%)**: Rich Snippets Eligibility.
- **Media & Images (5%)**: Alt-text, WebP, Lazy Loading.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Analisis SEO komprehensif di semua industri (SaaS, layanan lokal, e-commerce, penerbit, agensi). Mengatur sub-skills dan sub-agen khusus dengan penekanan kuat pada **Performa Web Modern** dan **Kesiapan Pencarian AI (Generative Engine Optimization - GEO)**.

### Kondisi Pemicu
- Gunakan saat pengguna meminta audit SEO lengkap atau strategi SEO yang luas.
- Gunakan sebagai pintu masuk utama ketika beberapa dimensi SEO berada dalam cakupan tugas.
- Gunakan ketika tugas mencakup technical SEO, konten, schema, sitemaps, dan kesiapan pencarian AI sekaligus.

### Acuan Cepat Perintah (Quick Reference)
- `/seo audit <url>`: Audit situs web penuh dengan delegasi sub-agen paralel.
- `/seo page <url>`: Analisis halaman tunggal yang mendalam.
- `/seo sitemap <url or generate>`: Menganalisis atau menghasilkan sitemap XML.
- `/seo schema <url>`: Mendeteksi, memvalidasi, dan menghasilkan markup Schema.org.
- `/seo images <url>`: Analisis optimasi gambar (WebP, lazy-load, alt-text).
- `/seo technical <url>`: Audit SEO teknis (Arsitektur, Core Web Vitals, Crawlability).
- `/seo content <url>`: Analisis E-E-A-T dan kualitas konten.
- `/seo geo <url>`: Optimasi Mesin Pencari Generatif (AI Overviews / GEO).
- `/seo plan <business-type>`: Perencanaan SEO strategis.

### Aturan Kualitas & Web Modern
- **Konten Tipis (Thin Content)**: Peringatan jika terdapat 30+ halaman lokasi (wajibkan 60%+ konten unik).
- **Schema**: Jangan merekomendasikan schema HowTo (usang sejak Sept 2023). Schema FAQ hanya untuk situs web pemerintah dan layanan kesehatan.
- **Core Web Vitals**: Pengukuran harus menggunakan INP (Interaction to Next Paint), bukan FID. LCP harus < 2.5 detik.
- **Kesiapan AI (AI-First)**: Periksa kesiapan `llms.txt`, tag HTML semantik, dan teks bersih agar mudah dibaca oleh crawler AI.

### Metodologi Penilaian (SEO Health Score)
Skor Kesehatan SEO (0-100) dihitung berdasarkan bobot kategori berikut:
- **Technical SEO (20%)**: Crawlability, HTTPS, Arsitektur.
- **Kualitas Konten (E-E-A-T) (20%)**: Kedalaman, Keaslian, Otoritatif.
- **On-Page SEO (15%)**: Title, Meta, Heading, Kata Kunci.
- **Performa (CWV) (15%)**: LCP, INP, CLS, Mobile-First.
- **Kesiapan AI (GEO) (15%)**: Citability, llms.txt, HTML Semantik.
- **Schema / Structured Data (10%)**: Kelayakan Rich Snippets.
- **Media & Gambar (5%)**: Alt-text, WebP, Lazy Loading.
