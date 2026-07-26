---
name: web-scraper
description: "Smart web data extraction capability with multi-strategy scraping (Crawl4AI, Playwright, BeautifulSoup), LLM extraction, pagination support, and structured export / Kemampuan ekstraksi data web cerda s dengan strategi scraping modern (Crawl4AI, Playwright, BeautifulSoup), ekstraksi LLM, paginasi, dan ekspor terstruktur."
author: "Roedy Rustam"
tags:
- scraping
- data-extraction
- automation
- crawl4ai
- playwright
- json
---

# Web Scraper (Modern Multi-Strategy Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Overview
Smart, production-grade web data extraction utilizing multi-strategy scraping: Crawl4AI / Playwright for JS-rendered SPAs, BeautifulSoup / httpx for static HTML, and LLM-assisted schema extraction. Supports deep pagination, proxy rotation, rate-limiting compliance, and exporting to JSON, CSV, or Markdown.

### Trigger Conditions
- Scraping, extracting, or parsing data from public web pages.
- Harvesting product catalogs, pricing matrices, job boards, or news articles.
- Handling complex JavaScript-rendered web pages (SPAs).
- Structuring raw HTML into schema-validated JSON formats via LLM extraction.

### Multi-Strategy Scraping Engine

#### 1. Strategy A: High-Performance Static Scraping (`httpx` + `BeautifulSoup` / `selectolax`)
- Best for SSG, static blogs, and simple HTML tables.
- Extremely lightweight, fast, and low-cost.

#### 2. Strategy B: Headless Browser & AI Crawler (`Crawl4AI` / `Playwright`)
- Best for JS-heavy single page applications (React, Next.js client renders, Vue).
- Features automatic Markdown conversion, DOM cleaning, scroll simulation, and shadow DOM traversal.

#### 3. Strategy C: API Endpoint Inspection (Network Protocol Extraction)
- Inspect network requests (`XHR`/`fetch`) to identify internal JSON API endpoints, bypassing HTML parsing altogether.

### Workflow & Data Pipeline

```
1. CLARIFY -> 2. RECON -> 3. STRATEGY -> 4. EXTRACT -> 5. TRANSFORM -> 6. VALIDATE -> 7. EXPORT
```

- **Validation**: Verify line item counts, check for schema truncation, and assign a Confidence Rating (**HIGH / MEDIUM / LOW**).
- **Export Formats**: Structured JSON (standard), CSV, or GitHub Markdown tables.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Ekstraksi data web cerdas tingkat produksi menggunakan berbagai strategi scraping: Crawl4AI / Playwright untuk aplikasi SPA berbasis JavaScript, BeautifulSoup / httpx untuk HTML statis, serta ekstraksi skema berbasis LLM. Mendukung paginasi, rotasi proxy, batas frekuensi (rate limiting), dan ekspor ke JSON, CSV, atau Markdown.

### Kondisi Pemicu
- Mengikis (*scraping*), mengekstrak, atau mem-parsing data dari situs web publik.
- Mengumpulkan katalog produk, matriks harga, papan lowongan kerja, atau artikel berita.
- Menangani halaman web kompleks yang dirender dengan JavaScript (SPA).
- Mengubah HTML mentah menjadi format JSON terstruktur yang tervalidasi skema.

### Alur Ekstraksi Multi-Strategi

#### 1. Strategi A: Scraping Statis Cepat (`httpx` + `BeautifulSoup` / `selectolax`)
- Sangat cocok untuk situs statis, blog, dan tabel HTML sederhana. Performa sangat tinggi dan hemat memori.

#### 2. Strategi B: Headless Browser & AI Crawler (`Crawl4AI` / `Playwright`)
- Sangat cocok untuk SPA berbasis JavaScript (React, Next.js client render, Vue). Menangani konversi Markdown otomatis, pembersihan DOM, dan interaksi scroll.

#### 3. Strategi C: Inspeksi Endpoint API Internal
- Analisis lalu lintas jaringan (`fetch`/`XHR`) untuk menemukan API JSON internal langsung dari sumbernya.

### Format & Validasi Output
- Terapkan validasi data (ISO-8601 untuk tanggal, pembersihan whitespace, resolusi URL absolut).
- Sertakan tingkat keyakinan data (**Confidence Rating: HIGH / MEDIUM / LOW**).
