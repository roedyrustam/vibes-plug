---
name: seo-geo
description: "Generative Engine Optimization (GEO) for AI Overviews, ChatGPT, and Perplexity / Optimasi Mesin Pencari Generatif (GEO) untuk AI Overviews, ChatGPT, dan Perplexity."
author: "Roedy Rustam"
---

# SEO-GEO Expert (2026 — AI Mode Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Generative Engine Optimization (GEO) for the 2026 AI-powered search landscape — Google AI Mode (successor to AI Overviews), ChatGPT Search, Perplexity Pages, Claude.ai web search, and Grok search. Optimizes content to be cited, quoted, and recommended by AI search engines.

### Trigger Conditions
- Optimizing content to appear in Google AI Mode responses.
- Getting cited in ChatGPT Search, Perplexity, Claude web, or Grok results.
- Adding `/llms.txt` and structured data for AI indexing.
- Measuring GEO performance (citation rate, AI snippet appearances).
- Optimizing for "Answer Engine" queries (who, what, how, why questions).

### The 2026 AI Search Landscape

| AI Engine | Source | Citable Content | Key Signal |
|---|---|---|---|
| **Google AI Mode** | Google index + Gemini | Yes — with source links | E-E-A-T, structured data |
| **ChatGPT Search** | Bing index + GPT-4o | Yes — with citations | Bing ranking, freshness |
| **Perplexity** | Real-time web crawl | Yes — prominent citations | Authority, specificity |
| **Perplexity Pages** | User-generated long-form | Yes — auto-cited | Depth, comprehensiveness |
| **Claude Web** | Real-time search | Yes — with URLs | Clarity, structure |
| **Grok** | X/Twitter + web | Yes | Real-time trending |

### GEO Optimization Framework

#### 1. E-E-A-T Signals (Experience, Expertise, Authoritativeness, Trust)
Google AI Mode heavily weights E-E-A-T:
- **Author credentials**: Add `<script type="application/ld+json">` `Person` schema with credentials.
- **Publication dates**: Always include `datePublished` and `dateModified`.
- **Primary sources**: Cite original research, government data, and peer-reviewed studies.
- **About page**: Clear author bios with LinkedIn/professional links.

#### 2. `/llms.txt` — AI Indexing Protocol
Add an `/llms.txt` file at your domain root — the 2026 standard for telling AI crawlers what to index:
```
# /llms.txt
# AI-friendly site map for LLM indexers

## Product
- [Features](/features): Complete feature list with pricing
- [API Docs](/docs/api): REST API reference (JSON schemas included)
- [Changelog](/changelog): Recent updates and releases

## Content
- [Blog](/blog): Technical articles on [topic]
- [Tutorials](/tutorials): Step-by-step guides

## Company
- [About](/about): Team, mission, and founding story
- [Pricing](/pricing): Current plan structure
```

#### 3. Structured Data for AI Comprehension
```html
<!-- FAQ Schema — AI engines love Q&A format -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is [Product]?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Concise, factual answer in 2-3 sentences that AI can quote directly."
    }
  }]
}
</script>

<!-- HowTo Schema — for instructional content -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to [Task]",
  "step": [
    { "@type": "HowToStep", "name": "Step 1", "text": "..." },
    { "@type": "HowToStep", "name": "Step 2", "text": "..." }
  ]
}
</script>
```

#### 4. Content Formatting for AI Citation
AI engines prefer content that is:
- **Scannable**: Short paragraphs, headers for each concept, bullet lists.
- **Definitive**: Declarative statements ("X is Y") over hedging ("X might be Y").
- **Self-contained**: Each section can stand alone as a quotable snippet.
- **Cited**: Reference authoritative sources with links.
- **Fresh**: Updated within the last 6 months — AI engines penalize stale content.

#### 5. Perplexity Pages Optimization
Perplexity Pages are AI-generated long-form content that cites sources. To be cited in Pages:
- Cover a topic comprehensively (> 1500 words).
- Use clear section headers (H2/H3 for each subtopic).
- Include statistics, data, and specific numbers.
- Have a clear "Summary" or "TL;DR" section at the top.

#### 6. ChatGPT Search Optimization
ChatGPT Search is powered by Bing — standard Bing SEO applies, plus:
- Ensure Bing Webmaster Tools verified and sitemap submitted.
- OpenGraph tags properly set (`og:title`, `og:description`, `og:image`).
- Content freshness signals (update dates, news sitemaps).

#### 7. GEO Performance Measurement
```python
# Automated GEO tracking
import httpx

async def check_ai_citation(brand: str, queries: list[str]):
    for query in queries:
        # Check Perplexity
        perp_result = await query_perplexity(query)
        cited = brand.lower() in perp_result.lower()
        
        # Log citation rate per query
        await log_metric("geo_citation", {
            "engine": "perplexity",
            "query": query,
            "cited": cited,
        })
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Generative Engine Optimization (GEO) untuk lanskap pencarian bertenaga AI tahun 2026 — Google AI Mode (penerus AI Overviews), ChatGPT Search, Perplexity Pages, pencarian web Claude.ai, dan pencarian Grok. Mengoptimalkan konten agar dikutip, disebut, dan direkomendasikan oleh mesin pencari AI.

### Kondisi Pemicu
- Mengoptimalkan konten agar muncul dalam respons Google AI Mode.
- Mendapatkan kutipan di ChatGPT Search, Perplexity, Claude web, atau hasil Grok.
- Menambahkan `/llms.txt` dan data terstruktur untuk pengindeksan AI.
- Mengukur performa GEO (tingkat kutipan, kemunculan AI snippet).
- Mengoptimalkan untuk kueri "Answer Engine" (pertanyaan siapa, apa, bagaimana, mengapa).

### Lanskap Pencarian AI 2026

| Mesin AI | Sumber | Konten yang Dapat Dikutip | Sinyal Kunci |
|---|---|---|---|
| **Google AI Mode** | Indeks Google + Gemini | Ya — dengan tautan sumber | E-E-A-T, data terstruktur |
| **ChatGPT Search** | Indeks Bing + GPT-4o | Ya — dengan kutipan | Peringkat Bing, kesegaran |
| **Perplexity** | Crawl web real-time | Ya — kutipan menonjol | Otoritas, spesifisitas |
| **Perplexity Pages** | Konten panjang yang dibuat AI | Ya — dikutip otomatis | Kedalaman, komprehensivitas |
| **Claude Web** | Pencarian real-time | Ya — dengan URL | Kejelasan, struktur |

### Kerangka Optimasi GEO

#### 1. Sinyal E-E-A-T
Google AI Mode sangat mempertimbangkan E-E-A-T: kredensial penulis (schema `Person`), tanggal publikasi, kutipan dari sumber primer, dan halaman About yang jelas.

#### 2. `/llms.txt` — Protokol Pengindeksan AI
Tambahkan file `/llms.txt` di root domain Anda — standar 2026 untuk memberi tahu crawler AI apa yang harus diindeks. Mirip `robots.txt` tetapi untuk LLM.

#### 3. Data Terstruktur untuk Pemahaman AI
Gunakan schema `FAQPage` untuk konten Q&A dan `HowTo` untuk konten instruksional — format yang paling disukai mesin AI untuk dikutip.

#### 4. Format Konten untuk Kutipan AI
- Paragraf pendek, header untuk setiap konsep, daftar poin.
- Pernyataan definitif ("X adalah Y") bukan hedging ("X mungkin Y").
- Setiap seksi dapat berdiri sendiri sebagai snippet yang dapat dikutip.
- Sertakan statistik, data, dan angka spesifik.
- Diperbarui dalam 6 bulan terakhir.

#### 5. Optimasi Perplexity Pages
Tulis konten yang komprehensif (> 1500 kata), gunakan header seksi yang jelas, sertakan statistik dan angka spesifik, dan sertakan ringkasan "TL;DR" di bagian atas.

#### 6. Optimasi ChatGPT Search
ChatGPT Search didukung oleh Bing — SEO Bing standar berlaku. Verifikasi di Bing Webmaster Tools, submit sitemap, dan pastikan tag OpenGraph diatur dengan benar.

#### 7. Pengukuran Performa GEO
Lacak tingkat kutipan merek Anda per mesin AI per query secara otomatis untuk memantau visibilitas AI dari waktu ke waktu.
