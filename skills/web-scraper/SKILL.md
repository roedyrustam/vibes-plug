---
name: web-scraper
description: "Kemampuan ekstraksi data web cerdas dengan berbagai strategi scraping, dukungan paginasi, pemantauan, serta ekspor / Smart web data extraction capability with various scraping strategies, pagination support, monitoring, and export."
author: "Roedy Rustam"
tags:
- scraping
- data-extraction
- automation
- csv
---

# Web Scraper

[Bahasa Indonesia](#bahasa-indonesia) | [English](#english)

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Kemampuan ekstraksi data web cerdas menggunakan multi-strategi. Mengekstrak data terstruktur dari halaman web (tabel, daftar, harga). Mendukung paginasi, pemantauan, dan ekspor ke CSV/JSON/Markdown.

### Kondisi Pemicu
Gunakan skill ini ketika:
- Pengguna menyebutkan "scraper", "scraping", "extrair dados web", atau "web scraping".
- Pengguna meminta untuk "raspar data" (mengikis data) atau "mengumpulkan data dari situs web".

### Alur Kerja (Phases)
```
1. CLARIFY  ->  2. RECON  ->  3. STRATEGY  ->  4. EXTRACT  ->  5. TRANSFORM  ->  6. VALIDATE  ->  7. FORMAT
```

#### Phase 1: Clarify (Klarifikasi)
Tentukan parameter ekstraksi sebelum mengakses URL:
- **Target URL**: Halaman mana yang akan dikikis.
- **Data Target**: Data spesifik apa yang ingin diekstrak.
- **Format Output**: Tabel Markdown (default), JSON, atau CSV.
- **Scope**: Halaman tunggal, paginasi, atau banyak URL.

#### Phase 2: Recon (Pemeriksaan Awal)
Gunakan `WebFetch` untuk menganalisis struktur halaman: tipe halaman, render JavaScript (apakah diperlukan Browser), paginasi, dan ketersediaan data.

#### Phase 3: Strategy Selection (Pemilihan Strategi)
- **Strategi A (WebFetch)**: Untuk halaman statis, artikel, tabel sederhana.
- **Strategi B (Browser Automation)**: Untuk halaman yang dirender JS, SPA, atau konten interaktif.
- **Strategi C (Bash/curl/API)**: Jika data tersedia dalam bentuk endpoint API JSON/XML atau file CSV/Excel langsung.

#### Phase 4: Extract (Ekstraksi)
Terapkan pola ekstraksi sesuai mode data:
- `table` (Tabel Markdown)
- `product` (Nama, harga, merek, spesifikasi)
- `pricing` (Plan names, prices, features)
- `contact` (Nama, email, telepon)
- `faq` (Tanya-jawab)
- `jobs` (Judul pekerjaan, gaji, lokasi)

#### Phase 5: Transform (Pembersihan Data)
Bersihkan spasi kosong (whitespace), decode entitas HTML, normalisasikan tanggal (ISO-8601), hapus duplikasi (deduplikasi), dan lakukan resolusi URL relatif menjadi absolut.

#### Phase 6: Validate (Validasi)
Periksa kelengkapan baris, tipe data, dan tentukan rating keyakinan (**Confidence Rating**: HIGH / MEDIUM / LOW).

#### Phase 7: Format & Deliver (Format & Pengiriman)
Kirimkan data terstruktur kepada pengguna lengkap dengan amplop metadata (Sumber URL, Tanggal, Jumlah Item, Strategi, Catatan).

---

<a name="english"></a>
## English

### Overview
Smart web data extraction using a multi-strategy approach. Extracts structured data from web pages (tables, lists, prices). Supports pagination, monitoring, and exporting to CSV/JSON/Markdown.

### Trigger Conditions
Use this skill when:
- The user mentions "scraper", "scraping", "web scraping", or "web data extraction".
- The user requests to "gather data from a website" or "collect site details".

### Workflow (Phases)
```
1. CLARIFY  ->  2. RECON  ->  3. STRATEGY  ->  4. EXTRACT  ->  5. TRANSFORM  ->  6. VALIDATE  ->  7. FORMAT
```

#### Phase 1: Clarify
Establish extraction parameters before accessing the URL:
- **Target URL(s)**: Which page(s) to scrape.
- **Data Target**: What specific data to extract.
- **Output Format**: Markdown table (default), JSON, or CSV.
- **Scope**: Single page, paginated, or multi-URL.

#### Phase 2: Reconnaissance
Use `WebFetch` to analyze page structure: page type, JS rendering indicators (deciding if Browser is needed), pagination, and structured data availability.

#### Phase 3: Strategy Selection
- **Strategy A (WebFetch + AI)**: For static pages, articles, simple tables.
- **Strategy B (Browser Automation)**: For JS-rendered pages, SPAs, and interactive content.
- **Strategy C (Bash/curl/API)**: For raw JSON APIs or direct CSV/Excel download files.

#### Phase 4: Extract
Apply extraction prompts and templates depending on the data mode:
- `table` (Markdown tables with exact headers)
- `product` (Name, price, brand, specs, reviews)
- `pricing` (Plan names, prices, features)
- `contact` (Name, email, phone)
- `faq` (Question-answer pairs)
- `jobs` (Job title, salary, location)

#### Phase 5: Transform
Clean whitespaces, decode HTML entities, normalize dates to ISO-8601, resolve relative URLs to absolute, and deduplicate rows.

#### Phase 6: Validate
Verify item counts, check for truncation or outliers, and assign a **Confidence Rating** (HIGH / MEDIUM / LOW).

#### Phase 7: Format & Deliver
Deliver structured data wrapped in the metadata envelope (Source URL, Date, Item Count, Strategy, Notes).
