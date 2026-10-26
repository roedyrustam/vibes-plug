---
name: web-scraper
description: "Agentic web scraping: Crawl4AI, Firecrawl, and anti-bot bypass / Ekstraksi web agentic: Crawl4AI, Firecrawl, dan bypass anti-bot."
author: "Roedy Rustam"
version: "4.4.4"

---

# Agentic Web Scraper Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 1 & Phase 5 - Extraction & Data Pipelines) to gather web data.
- **Downstream Cooperating Skills**:
  - `browser-automation-expert` — Hardcore anti-bot evasion, stealth Playwright execution, and Cloudflare bypass.
  - `ai-llm-integration-expert` — LLM schema-driven structured data extraction from DOM markdown.
  - `deep-research-analyst` — Feed extracted web sources to multi-source evidence synthesis.
  - `data-pipeline-etl-expert` — Ingest extracted datasets into transformation and analytics storage.
  - `session-memory-manager` — Cache scraped web structures and extraction progress checkpoints.

### Description
Advanced Agentic Web Scraping utilizing modern multi-strategy data extraction. Leverages **Crawl4AI v4** and **Firecrawl** to convert raw DOMs into LLM-friendly Markdown. Implements Agentic Extraction loops where the LLM guides the scraper dynamically based on page state. Incorporates strategies for bypassing anti-bot measures (Cloudflare Turnstile, Datadome) and navigating dynamic Shadow DOMs.

### Trigger Conditions
- Extracting structured data from websites for analysis, training data, or content pipelines.
- Scraping dynamic JavaScript-rendered pages and complex SPAs.
- Converting web pages to clean Markdown for LLM context or RAG pipelines.
- Dealing with anti-bot protections or complex Shadow DOM architectures during scraping.
- Implementing an automated agentic data extraction loop.

### Extracting DOM into LLM-Friendly Markdown
Use **Crawl4AI v4** for high-performance async extraction and **Firecrawl** for seamless LLM-ready conversion.

**Crawl4AI v4 (Async Python):**
```python
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

async def extract_markdown(url: str):
    config = BrowserConfig(headless=True, bypass_csp=True)
    run_config = CrawlerRunConfig(
        cache_mode=CacheMode.ENABLED,
        remove_overlay_elements=True,
        word_count_threshold=50
    )
    
    async with AsyncWebCrawler(config=config) as crawler:
        result = await crawler.arun(url=url, config=run_config)
        # Returns clean, AI-optimized markdown ready for LLM consumption
        return result.markdown.fit_markdown
```

**Firecrawl (Managed API):**
```python
from firecrawl import FirecrawlApp
from pydantic import BaseModel

app = FirecrawlApp(api_key="fc-xxxx")

class ExtractionSchema(BaseModel):
    title: str
    content: str
    key_metrics: list[str]

# Single API call to extract structured data based on JSON schema
result = app.scrape_url(
    "https://example.com/data",
    formats=["extract", "markdown"],
    extract={"schema": ExtractionSchema.model_json_schema()}
)
print(result.markdown) # Clean markdown
print(result.extract)  # Structured JSON
```

### Anti-Bot Bypass & Shadow DOMs
Scraping modern web apps requires bypassing anti-bot measures like Cloudflare Turnstile and Datadome, as well as accessing deeply nested elements.

1. **Anti-Bot Bypass (Cloudflare Turnstile, Datadome):**
   - **Residential Proxies:** Rotate high-quality residential IPs to avoid datacenter IP bans.
   - **Browser Fingerprinting:** Use tools like `playwright-stealth` or specialized stealth browsers (e.g., Undetected ChromeDriver, Curl-Impersonate) to mask automated fingerprints (WebGL, Canvas, User-Agent).
   - **Human-like Interaction:** Introduce random delays, simulate realistic mouse movements, and handle CAPTCHAs via third-party solving services only when necessary.
2. **Dynamic Shadow DOMs:**
   - Use CSS piercing selectors or JavaScript execution to penetrate the Shadow Root.
   - Example (Playwright): `await page.locator('my-web-component >> css=.internal-element').text_content()`
   - Recursively traverse the DOM tree injecting scripts to extract content from encapsulated components.

### Agentic Extraction Loops
Implement an autonomous loop where an LLM guides the scraper based on the current page state, rather than relying on brittle CSS selectors.

1. **Observe:** The scraper extracts the current DOM into clean Markdown.
2. **Analyze:** The LLM analyzes the Markdown to identify necessary data or the next interaction step (e.g., "Click the 'Load More' button").
3. **Act:** The LLM issues a command (extract data, navigate, click, fill form).
4. **Loop:** Repeat until the extraction goal is met.

```python
async def agentic_scrape_loop(url: str, goal: str):
    current_url = url
    while True:
        markdown_content = await extract_markdown(current_url)
        # LLM analyzes state and decides next action
        action = await llm_decide_action(markdown_content, goal)
        
        if action.type == "COMPLETE":
            return action.extracted_data
        elif action.type == "CLICK":
            await click_element(action.target_selector)
        elif action.type == "NAVIGATE":
            current_url = action.new_url
```

### Ethical Scraping Checklist
- [ ] Check `robots.txt` and respect `Disallow` rules.
- [ ] Implement rate limiting.
- [ ] Use descriptive `User-Agent` headers.
- [ ] Do not scrape personal/private data without consent.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec web-scraper <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 1 & Fase 5 - Ekstraksi & Pipeline Data) untuk mengumpulkan data web.
- **Skill Hilir & Kerja Sama**:
  - `browser-automation-expert` — Bypass proteksi anti-bot, eksekusi stealth Playwright, dan Cloudflare bypass.
  - `ai-llm-integration-expert` — Ekstraksi data terstruktur berbasis skema LLM dari DOM markdown.
  - `deep-research-analyst` — Menyalurkan sumber web terekstraksi ke sintesis bukti multi-sumber.
  - `data-pipeline-etl-expert` — Memasukkan dataset ekstraksi ke pipeline transformasi dan analitik.
  - `session-memory-manager` — Menyimpan cache struktur web dan checkpoint progres ekstraksi.

### Deskripsi
Scraping Web Agentic tingkat lanjut menggunakan ekstraksi data multi-strategi modern. Memanfaatkan **Crawl4AI v4** dan **Firecrawl** untuk mengubah DOM mentah menjadi Markdown yang ramah LLM. Mengimplementasikan loop Ekstraksi Agentic di mana LLM memandu scraper secara dinamis berdasarkan status halaman. Menggabungkan strategi untuk melewati tindakan anti-bot (Cloudflare Turnstile, Datadome) dan menavigasi Shadow DOM yang dinamis.

### Kondisi Pemicu
- Mengekstrak data terstruktur dari situs web untuk analisis, data pelatihan, atau pipeline konten.
- Scraping halaman yang dirender JavaScript secara dinamis dan SPA kompleks.
- Mengonversi halaman web menjadi Markdown bersih untuk konteks LLM atau pipeline RAG.
- Menghadapi perlindungan anti-bot atau arsitektur Shadow DOM yang kompleks saat scraping.
- Mengimplementasikan loop ekstraksi data agentic otomatis.

### Mengekstrak DOM menjadi Markdown Ramah LLM
Gunakan **Crawl4AI v4** untuk ekstraksi async berperforma tinggi dan **Firecrawl** untuk konversi siap LLM yang mulus. (Lihat contoh kode di bagian bahasa Inggris).

### Bypass Anti-Bot & Shadow DOM
1. **Bypass Anti-Bot (Cloudflare Turnstile, Datadome):**
   - **Proxy Residensial:** Rotasi IP residensial berkualitas tinggi untuk menghindari pemblokiran IP datacenter.
   - **Browser Fingerprinting:** Gunakan alat seperti `playwright-stealth` atau browser stealth khusus untuk menyembunyikan sidik jari otomatis.
   - **Interaksi Mirip Manusia:** Tambahkan penundaan acak, simulasikan gerakan mouse yang realistis.
2. **Shadow DOM Dinamis:**
   - Gunakan selektor penembus CSS atau eksekusi JavaScript untuk menembus Shadow Root.
   - Telusuri pohon DOM secara rekursif dengan menyuntikkan skrip untuk mengekstrak konten.

### Loop Ekstraksi Agentic
Implementasikan loop otonom di mana LLM memandu scraper berdasarkan status halaman saat ini, bukan bergantung pada selektor CSS yang rentan rusak.

1. **Observasi:** Scraper mengekstrak DOM saat ini menjadi Markdown yang bersih.
2. **Analisis:** LLM menganalisis Markdown untuk mengidentifikasi data yang diperlukan atau langkah interaksi selanjutnya (misal: "Klik tombol 'Muat Lebih Banyak'").
3. **Aksi:** LLM mengeluarkan perintah (ekstrak data, navigasi, klik, isi form).
4. **Loop:** Ulangi hingga tujuan ekstraksi tercapai.

### Checklist Scraping Etis
- [ ] Periksa `robots.txt` dan hormati aturan `Disallow`.
- [ ] Implementasikan rate limiting.
- [ ] Gunakan header `User-Agent` yang deskriptif.
- [ ] Jangan scraping data pribadi/privat tanpa izin.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec web-scraper <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
