---
name: seo
description: "Run a broad SEO audit across technical SEO, on-page SEO, schema, sitemaps, content quality, AI search readiness, and GEO / Audit SEO menyeluruh (Technical, On-Page, Schema, Sitemap, E-E-A-T, GEO)"
author: "Roedy Rustam"
---

# SEO Expert (2026 — AI Mode & Core Web Vitals Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

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
- **Factual and specific**: Include statistics, named entities, and dates.
- **`/llms.txt`**: Add an AI-readable site index (see `seo-geo` skill).
- **Speed**: AI Mode favors fast-loading pages (TTFB < 600ms).

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

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

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

### GEO — Optimasi Google AI Mode
Google AI Mode (sebelumnya AI Overviews) kini mendukung bagian atas hasil pencarian:
- Tulis konten yang komprehensif dan otoritatif tentang topik inti.
- Strukturkan konten sebagai Q&A — AI Mode langsung mengutip ini.
- Sertakan statistik, entitas bernama, dan tanggal.
- Tambahkan `/llms.txt` sebagai indeks situs yang dapat dibaca AI.
- Kecepatan: AI Mode lebih memilih halaman yang memuat cepat (TTFB < 600ms).

### Standar SEO On-Page
H1 satu per halaman, H2 untuk header seksi, meta title < 60 karakter, meta deskripsi < 155 karakter, URL lowercase dengan tanda hubung dan keyword di slug, alt text deskriptif untuk semua gambar, 3-5 internal link per halaman long-form.

---
### 🎨 Automatic Visual Assets Generation Mandate (CRITICAL)
**MANDATORY**: Whenever you are building a new application, scaffolding a project, or finalizing the initial UI/UX, you MUST automatically use the `generate_image` tool to create a custom logo that perfectly matches the application's core concept and aesthetic. 
This generated image MUST be explicitly used as:
1. The primary application logo (e.g., in the header/navbar).
2. The website favicon (`favicon.ico` or equivalent).
3. The Open Graph (OG) image for SEO metadata (`og:image`).

Do not use placeholders for these assets. Generate and integrate them automatically.
