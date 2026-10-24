---
name: seo
description: "Run a broad SEO audit across technical SEO, on-page SEO, schema, sitemaps, content quality, AI search readiness, and GEO / Audit SEO menyeluruh (Technical, On-Page, Schema, Sitemap, E-E-A-T, GEO)"
author: "Roedy Rustam"
version: "4.4.2"

---

# SEO Expert (2026 — AI Mode & Core Web Vitals Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 6 - SEO, Discovery & Launch Optimization) to maximize organic discovery and AI search citations.
- **Downstream Cooperating Skills**:
  - `performance-web-vitals` — Ensure Core Web Vitals (LCP, INP, CLS) comply with search ranking criteria.
  - `senior-frontend` — Implement semantic HTML5 hierarchy, JSON-LD structured data, and metadata APIs.
  - `nextjs-app-router-expert` — Generate dynamic `sitemap.ts`, `robots.ts`, and Open Graph tags.
  - `app-promo-media-expert` — Generate high-converting `og:image` social preview banners.
  - `session-memory-manager` — Store target keyword maps, SEO audit findings, and `/llms.txt` configurations.

### Description
Comprehensive SEO audit covering technical SEO, on-page optimization, structured data, sitemaps, Core Web Vitals, E-E-A-T signals, and **Generative Engine Optimization (GEO)** for AI-powered search (Google AI Mode, ChatGPT Search, Perplexity).

### Trigger Conditions
- Running a full SEO audit on an existing web application.
- Optimizing technical SEO for a new Next.js / Astro site.
- Adding structured data (JSON-LD) for rich results and AI citation.
- Optimizing Core Web Vitals (LCP, INP, CLS).
- Preparing a site for Google AI Mode and ChatGPT Search indexing.
- Setting up a sitemap and `robots.txt`.

### 2026 SEO Landscape Changes

| 2024 (Old) | 2026 (Current) |
|---|---|
| AI Overviews (SGE) | **Google AI Mode** — integrated AI answers |
| FID metric (deprecated) | **INP** (Interaction to Next Paint) |
| Keyword density focus | **Topical authority + E-E-A-T** |
| Backlinks only | **Citations in AI responses** |
| `robots.txt` only | `robots.txt` + **`/llms.txt`** |

### Technical SEO Checklist

#### Core Web Vitals (2026 Targets)
```
LCP (Largest Contentful Paint) < 2.5s
INP (Interaction to Next Paint) < 200ms   ← replaced FID
CLS (Cumulative Layout Shift)  < 0.1
TTFB (Time to First Byte)      < 600ms
```

**INP Optimization** (the new critical metric):
```typescript
// INP is degraded by long tasks blocking the main thread
// Solution: Use React's useTransition to defer non-critical updates
import { useTransition } from 'react';

function SearchInput() {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      // Defer the expensive filtering to not block INP
      setFilteredResults(filterData(e.target.value));
    });
  };
  return <input onChange={handleChange} />;
}
```

#### Crawlability & Indexing
```typescript
// Next.js 15 — metadata API for complete SEO
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://myapp.com'),
  title: {
    default: 'My SaaS — One-line value proposition',
    template: '%s | My SaaS',
  },
  description: '150 characters max. Include primary keyword naturally.',
  openGraph: {
    type: 'website',
    url: 'https://myapp.com',
    siteName: 'My SaaS',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', creator: '@handle' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://myapp.com' },
};
```

```typescript
// Dynamic sitemap.ts (Next.js App Router)
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  
  return [
    { url: 'https://myapp.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://myapp.com/features', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...posts.map(p => ({
      url: `https://myapp.com/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
```

### Structured Data (JSON-LD) for AI Citation
```html
<!-- Organization schema — establishes brand entity -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "My SaaS",
  "url": "https://myapp.com",
  "logo": "https://myapp.com/logo.png",
  "sameAs": [
    "https://twitter.com/myapp",
    "https://linkedin.com/company/myapp"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@myapp.com"
  }
}
</script>

<!-- SoftwareApplication schema for SaaS products -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "My SaaS",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free tier available"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "247"
  }
}
</script>
```

### GEO — Google AI Mode Optimization
Google AI Mode (formerly AI Overviews) now powers the top of search results:
- **Be the source**: Write comprehensive, authoritative content on your core topics.
- **Q&A format**: Structure content as questions and answers — AI Mode quotes these directly.
- **AEO Extraction Sentence**: Write one 25–40 word sentence that answers "What is [product]?" immediately after the H1. This is the sentence AI engines extract.
- **Factual and specific**: Include statistics, named entities, and dates.
- **Speed**: AI Mode favors fast-loading pages (TTFB < 600ms).

#### The 2026 AI Search Landscape
| AI Engine | Source | Citable Content | Key Signal |
|---|---|---|---|
| **Google AI Mode** | Google index + Gemini | Yes — with source links | E-E-A-T, structured data |
| **ChatGPT Search** | Bing index + GPT-5.6 Sol | Yes — with citations | Bing ranking, freshness |
| **Perplexity** | Real-time web crawl | Yes — prominent citations | Authority, specificity |

#### `/llms.txt` — AI Indexing Protocol
Add an `/llms.txt` file at your domain root:
```
# /llms.txt
# AI-friendly site map for LLM indexers
## Product
- [Features](/features): Complete feature list with pricing
## Content
- [Blog](/blog): Technical articles
```

#### Landing Page SEO/AEO Narrative Arc
Follow this exact order for landing pages:
1. Hero — H1 + AEO sentence + CTA
2. Problem — Audience pain, no product mention yet
3. Solution — Introduce product as the answer
4. Features as Benefits — Table format
5. Social Proof & FAQ (under 50 words each)

### On-Page SEO Standards
```
H1: One per page — primary keyword, compelling, < 60 chars
H2: Section headers — secondary keywords
H3: Sub-sections — long-tail keywords, FAQ answers
Meta Title: < 60 chars — keyword + brand
Meta Description: < 155 chars — keyword + CTA + benefit
URL: lowercase, hyphens, keyword-in-slug, < 5 segments
Images: Descriptive alt text, WebP format, lazy loading
Internal links: 3-5 per long-form page to related content
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec seo <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 6 - SEO, Discovery & Optimasi Peluncuran) untuk memaksimalkan pencarian organik dan sitasi AI search.
- **Skill Hilir & Kerja Sama**:
  - `performance-web-vitals` — Menjamin Core Web Vitals (LCP, INP, CLS) memenuhi kriteria ranking mesin pencari.
  - `senior-frontend` — Menerapkan hierarki HTML5 semantik, data terstruktur JSON-LD, dan Metadata API.
  - `nextjs-app-router-expert` — Pembuatan dinamis `sitemap.ts`, `robots.ts`, dan tag Open Graph.
  - `app-promo-media-expert` — Menghasilkan banner preview media sosial `og:image` berkonversi tinggi.
  - `session-memory-manager` — Menyimpan peta kata kunci target, temuan audit SEO, dan konfigurasi `/llms.txt`.

### Deskripsi
Audit SEO komprehensif mencakup SEO teknikal, optimasi on-page, data terstruktur, sitemap, Core Web Vitals, sinyal E-E-A-T, dan **Generative Engine Optimization (GEO)** untuk pencarian bertenaga AI (Google AI Mode, ChatGPT Search, Perplexity).

### Kondisi Pemicu
- Menjalankan audit SEO penuh pada aplikasi web yang ada.
- Mengoptimalkan SEO teknikal untuk situs Next.js / Astro baru.
- Menambahkan data terstruktur (JSON-LD) untuk rich result dan kutipan AI.
- Mengoptimalkan Core Web Vitals (LCP, INP, CLS).
- Mempersiapkan situs untuk indexing Google AI Mode dan ChatGPT Search.

### Perubahan Lanskap SEO 2026

| 2024 (Lama) | 2026 (Sekarang) |
|---|---|
| AI Overviews (SGE) | **Google AI Mode** — jawaban AI terintegrasi |
| Metrik FID (dihentikan) | **INP** (Interaction to Next Paint) |
| Fokus kepadatan keyword | **Otoritas topikal + E-E-A-T** |
| Hanya backlink | **Kutipan dalam respons AI** |
| Hanya `robots.txt` | `robots.txt` + **`/llms.txt`** |

### Checklist SEO Teknikal

#### Core Web Vitals (Target 2026)
- LCP < 2.5 detik
- **INP < 200ms** ← menggantikan FID
- CLS < 0.1
- TTFB < 600ms

**Optimasi INP**: Metrik kritis baru yang mengukur responsivitas interaksi. Gunakan `useTransition` React untuk menunda pembaruan non-kritis agar tidak memblokir thread utama.

#### Crawlability & Indexing
Gunakan Metadata API Next.js 15 untuk SEO lengkap: `title`, `description`, `openGraph`, `twitter`, `robots`, `alternates.canonical`. Buat sitemap dinamis dengan `app/sitemap.ts` yang menyertakan semua halaman statis dan konten dinamis.

### Data Terstruktur (JSON-LD) untuk Kutipan AI
Tambahkan schema `Organization` untuk membangun entitas merek dan schema `SoftwareApplication` untuk produk SaaS — termasuk `aggregateRating` jika tersedia.

### GEO — Optimasi AI Mode & Landing Page AEO
Google AI Mode (sebelumnya AI Overviews) dan Perplexity sangat menyukai format berikut:
- **Kalimat Ekstraksi AEO**: Buat satu kalimat ringkas 25–40 kata ("Apa itu [produk]?") di blockquote setelah H1.
- Tulis konten Q&A dan sertakan statistik spesifik.
- **Alur Narasi Landing Page**: Hero (H1+AEO) -> Problem -> Solution -> Features -> Social Proof -> FAQ (tiap jawaban <50 kata).
- Tambahkan `/llms.txt` sebagai indeks situs yang dapat dibaca AI.
- Kecepatan: Halaman harus memuat sangat cepat (TTFB < 600ms).

### Standar SEO On-Page
H1 satu per halaman, H2 untuk header seksi, meta title < 60 karakter, meta deskripsi < 155 karakter, URL lowercase dengan tanda hubung dan keyword di slug, alt text deskriptif untuk semua gambar, 3-5 internal link per halaman long-form.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec seo <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
