---
name: web-scraper
description: "Smart web data extraction capability with multi-strategy scraping (Crawl4AI, Playwright, BeautifulSoup), LLM extraction, pagination support, and structured export / Kemampuan ekstraksi data web cerdas dengan strategi scraping modern (Crawl4AI, Playwright, BeautifulSoup), ekstraksi LLM, paginasi, dan ekspor terstruktur."
author: "Roedy Rustam"
---

# Web Scraper Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Smart web data extraction using modern scraping strategies — **Firecrawl** (LLM-ready structured extraction), **Jina Reader API** (clean markdown from any URL), **Crawl4AI** (async Python scraping), **Playwright** (browser automation), and **BeautifulSoup** (lightweight HTML parsing). Supports pagination, dynamic content, structured export (JSON, CSV, Markdown), and AI-powered data extraction.

### Trigger Conditions
- Extracting structured data from websites for analysis, training data, or content pipelines.
- Scraping dynamic JavaScript-rendered pages (SPAs, React apps).
- Converting web pages to clean Markdown for LLM context or RAG pipelines.
- Analyzing or cloning website UI design, templates, and components directly from a URL (Handoff to `website-design-cloner`).
- Building an automated data pipeline that scrapes, transforms, and stores data.
- Extracting data at scale with rate limiting and proxy rotation.

### Strategy Selection Guide

| Strategy | Tool | Best For | JS Required |
|---|---|---|---|
| **Managed API** | Firecrawl / Jina Reader | LLM-ready content, clean Markdown | Handled |
| **Async Python** | Crawl4AI | High-volume, AI-powered extraction | Optional |
| **Browser Automation** | Playwright | Complex SPAs, auth-required pages | ✅ |
| **Lightweight HTML** | BeautifulSoup + httpx | Static HTML, fast extraction | ❌ |

### Firecrawl — LLM-Ready Web Scraping (2026 Standard)
Firecrawl converts any URL to clean, LLM-ready Markdown with a single API call:
```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-xxxx")

# Single page — clean Markdown
result = app.scrape_url(
    "https://example.com/article",
    formats=["markdown", "html"],
    only_main_content=True,  # removes nav, footer, ads
)
print(result.markdown)

# Full site crawl
crawl_result = app.crawl_url(
    "https://docs.example.com",
    limit=50,
    scrape_options={"formats": ["markdown"]},
)

# LLM-powered structured extraction with JSON schema
from pydantic import BaseModel

class ProductInfo(BaseModel):
    name: str
    price: float
    description: str
    in_stock: bool

result = app.scrape_url(
    "https://shop.example.com/product/123",
    formats=["extract"],
    extract={"schema": ProductInfo.model_json_schema()},
)
product = ProductInfo(**result.extract)
```

### Jina Reader API — Clean Markdown from Any URL
```python
import httpx

async def url_to_markdown(url: str) -> str:
    """Convert any URL to clean Markdown via Jina Reader API."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://r.jina.ai/{url}",
            headers={
                "Accept": "application/json",
                "X-Return-Format": "markdown",
                "Authorization": f"Bearer {JINA_API_KEY}",
            }
        )
        data = response.json()
        return data["data"]["content"]

# Search and get results as Markdown
async def search_to_markdown(query: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://s.jina.ai/{query}",
            headers={"Accept": "application/json"}
        )
        return response.json()["data"]
```

### Crawl4AI — Async Python Web Scraper
```python
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

async def scrape_with_ai_extraction():
    browser_config = BrowserConfig(headless=True, verbose=False)
    
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(
            url="https://news.example.com",
            config=CrawlerRunConfig(
                cache_mode=CacheMode.ENABLED,       # cache results
                word_count_threshold=50,            # skip short content
                exclude_external_links=True,
                remove_overlay_elements=True,       # remove popups/modals
            ),
        )
        
        print(result.markdown.fit_markdown)  # cleaned, AI-optimized Markdown
        print(result.links)                  # extracted links
```

### Playwright — Complex Dynamic Pages
```python
from playwright.async_api import async_playwright
import asyncio

async def scrape_spa(url: str) -> dict:
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Block images/CSS to speed up
        await page.route("**/*.{png,jpg,jpeg,gif,css,woff2}", lambda r: r.abort())
        
        await page.goto(url, wait_until="networkidle")
        
        # Wait for dynamic content
        await page.wait_for_selector("[data-testid='product-list']")
        
        # Extract structured data via JavaScript
        products = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('.product-card')).map(card => ({
                name: card.querySelector('.product-name')?.textContent?.trim(),
                price: card.querySelector('.price')?.textContent?.trim(),
            }));
        }""")
        
        await browser.close()
        return {"products": products, "url": url}
```

### Ethical Scraping Checklist
- [ ] Check `robots.txt` and respect `Disallow` rules.
- [ ] Implement rate limiting — minimum 1-2 seconds between requests.
- [ ] Use descriptive `User-Agent` header with contact email.
- [ ] Cache results to avoid repeated requests.
- [ ] Prefer public APIs or official data feeds when available.
- [ ] Do not scrape personal/private data without consent.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Ekstraksi data web yang cerdas menggunakan strategi scraping modern — **Firecrawl** (ekstraksi terstruktur siap-LLM), **Jina Reader API** (Markdown bersih dari URL manapun), **Crawl4AI** (scraping Python async), **Playwright** (otomasi browser), dan **BeautifulSoup** (parsing HTML ringan). Mendukung paginasi, konten dinamis, ekspor terstruktur, dan ekstraksi data bertenaga AI.

### Kondisi Pemicu
- Mengekstrak data terstruktur dari website untuk analisis, data pelatihan, atau pipeline konten.
- Scraping halaman yang dirender JavaScript secara dinamis (SPA, aplikasi React).
- Mengonversi halaman web menjadi Markdown bersih untuk konteks LLM atau pipeline RAG.
- Mempelajari atau menduplikasi desain UI, template, dan komponen situs web langsung dari URL (Delegasikan ke `website-design-cloner`).
- Membangun pipeline data otomatis yang melakukan scraping, transformasi, dan penyimpanan.
- Mengekstrak data dalam skala besar dengan rate limiting dan rotasi proxy.

### Panduan Pemilihan Strategi

| Strategi | Tool | Terbaik Untuk | Perlu JS |
|---|---|---|---|
| **API Terkelola** | Firecrawl / Jina Reader | Konten siap LLM, Markdown bersih | Ditangani |
| **Python Async** | Crawl4AI | Volume tinggi, ekstraksi AI | Opsional |
| **Otomasi Browser** | Playwright | SPA kompleks, halaman butuh auth | ✅ |
| **HTML Ringan** | BeautifulSoup + httpx | HTML statis, ekstraksi cepat | ❌ |

### Firecrawl — Scraping Web Siap LLM
Firecrawl mengonversi URL apapun menjadi Markdown bersih siap LLM dengan satu panggilan API. Mendukung crawling seluruh situs, ekstraksi terstruktur berbasis skema JSON, dan penghapusan konten yang tidak relevan (navigasi, footer, iklan).

### Jina Reader API — Markdown Bersih dari URL Manapun
Jina Reader (`r.jina.ai/{url}`) mengonversi halaman web manapun menjadi Markdown yang dioptimalkan untuk LLM. Jina Search (`s.jina.ai/{query}`) melakukan pencarian web dan mengembalikan hasilnya sebagai Markdown.

### Crawl4AI — Web Scraper Python Async
Crawl4AI mendukung caching hasil, ekstraksi Markdown yang dioptimalkan AI, dan konfigurasi browser yang fleksibel untuk scraping konten dinamis.

### Playwright — Halaman Dinamis Kompleks
Gunakan Playwright untuk scraping SPA yang memerlukan eksekusi JavaScript, menunggu elemen dinamis, atau interaksi dengan halaman (klik, scroll, isi form).

### Checklist Scraping Etis
- [ ] Periksa `robots.txt` dan hormati aturan `Disallow`.
- [ ] Implementasikan rate limiting — minimal 1-2 detik antar permintaan.
- [ ] Gunakan header `User-Agent` deskriptif dengan email kontak.
- [ ] Cache hasil untuk menghindari permintaan berulang.
- [ ] Utamakan API publik atau feed data resmi jika tersedia.
- [ ] Jangan scraping data pribadi/privat tanpa izin.
