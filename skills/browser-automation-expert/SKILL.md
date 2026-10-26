---
name: browser-automation-expert
description: "Autonomous web agents (Stagehand, Browser-Use) & anti-bot evasion / Agen web otonom (Stagehand, Browser-Use) dan bypass deteksi bot."
author: "Roedy Rustam"
version: "4.4.4"

---

# Autonomous Web Agent & Automation Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Testing & E2E Verification**: `e2e-testing-expert`, `visual-ui-auditor`, `screenshot-to-code-expert`, `accessibility-testing-expert`
- **Security & Red Teaming**: `autonomous-red-teamer`, `rate-limit-abuse-prevention`
- **Web Scraping & Data Extraction**: `web-scraper`, `deep-research-analyst`
- **Frontend & UI Craft**: `senior-frontend`, `tailwind-expert`, `design-system-architect`, `modern-css-native-expert`
- **Lifecycle & Governance**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Purpose & Overview
Deploy ultra-powerful autonomous web agents that perceive, navigate, and execute complex workflows without human intervention. Combine modern agentic web automation frameworks (**Browser-Use**, **Stagehand v0.4+**) with hardcore anti-detection evasion techniques (Playwright Stealth, fingerprint spoofing, residential proxy rotation) and frontier Vision LLMs (**Gemini 4 Argon / Gemini 4 Pro**, **Project Astra**, **Claude Sonnet 5.5 / Fable 5.1 Computer Use**, **OpenAI GPT-5.6 Sol / o3**, **Grok 4.7 High Fast**) for pixel-accurate visual QA.

### Core Capabilities

1. **Autonomous Execution Frameworks (2026 Standard)**
   - **Stagehand v0.4+**: Natural language DOM perception with semantic actions (`page.act()`, `page.extract()`, `page.observe()`). Avoid fragile CSS/XPath selectors.
   - **Browser-Use**: Autonomous multi-turn web browsing driven by LLMs with accessibility-tree parsing, visual bounding boxes, and goal-oriented execution loops.

2. **Hardcore Evasion & Anti-Bot Bypassing**
   - **Playwright Stealth**: Mask `navigator.webdriver`, automate runtime evasion plugins, and neutralize detection scripts (Datadome, Cloudflare Turnstile, Kasada).
   - **Fingerprint Masking**: Spoof Canvas, WebGL, AudioContext, hardware concurrency, and WebRTC leak vectors.
   - **Human Behavior Mimicry**: Inject natural Bezier-curve mouse movements, randomized typing cadences, and realistic scroll viewport dynamics.

3. **Visual QA & Layout Diffing via Vision LLMs**
   - Feed high-resolution viewport screenshots into **Gemini 4 Argon/Pro Vision** (fallback: **Gemini 3.8 Flash Vision**) or **Claude Sonnet 5.5 Vision**.
   - Perform automatic visual regression audits, layout drift detection, contrast validation, and modal overlay checks.

---

### Production Implementation Recipes

#### Recipe 1: Stagehand v0.4+ with Playwright Stealth (TypeScript)
```typescript
import { Stagehand } from '@browserbase/stagehand';
import { z } from 'zod';

export async function runAutonomousShoppingAgent(targetProduct: string) {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-sonnet-5.5-20261022',
    browserbaseSessionCreateParams: {
      projectId: process.env.BROWSERBASE_PROJECT_ID,
    },
  });

  await stagehand.init();
  const page = stagehand.page;

  try {
    await page.goto('https://example-store.com');

    // Semantic action without hardcoded selectors
    await page.act({ action: `Search for "${targetProduct}" in the search input and press Enter` });

    // Extract structured data validated by Zod schema
    const productData = await page.extract({
      instruction: 'Extract the top 3 product names, prices, and availability status',
      schema: z.object({
        products: z.array(
          z.object({
            title: z.string(),
            price: z.string(),
            inStock: z.boolean(),
          })
        ),
      }),
    });

    console.log('Extracted Products:', productData.products);
    return productData.products;
  } finally {
    await stagehand.close();
  }
}
```

#### Recipe 2: Browser-Use with Anti-Bot Evasion (Python)
```python
import asyncio
from browser_use import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
from playwright.async_api import async_playwright

async def run_autonomous_browser_agent(goal: str):
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.8-flash",
        temperature=0.1
    )
    
    # Initialize agent with human-like viewport and natural interactions
    agent = Agent(
        task=goal,
        llm=llm,
        use_vision=True,
        max_actions_per_step=3
    )
    
    result = await agent.run(max_steps=25)
    print(f"Goal Completed: {result.is_done()}")
    return result.final_result()

if __name__ == "__main__":
    asyncio.run(run_autonomous_browser_agent("Search flights from CGK to HND for next month and return cheapest option"))
```

### Execution Protocol & Guardrails
- **Pre-flight**: Always inject evasion headers and randomize screen dimensions before navigating.
- **Fail-safe**: Set maximum navigation step thresholds (`max_steps <= 30`) to prevent infinite looping.
- **Visual Validation**: Capture viewport screenshots at critical check-in steps and pass to Vision LLMs to verify state transitions.

### Visual Regression & Vision QA

#### Description
This skill transforms the agent from a blind code generator into a visual designer. Instead of hoping the CSS looks correct, the agent is instructed to write a script that takes a screenshot of the newly created component, analyzes the screenshot using its own Vision AI capabilities, and iteratively tweaks the CSS until it matches the design intent perfectly.

#### Trigger Conditions
Activate this skill when the user says:
- "Fix the CSS, the button is misaligned."
- "Make it look exactly like this mockup."
- "Ensure the UI is responsive on mobile screens."

#### The Visual QA Loop
1. **Code:** The agent writes the HTML/CSS/React component.
2. **Serve:** The agent starts a local dev server in the background.
3. **Capture:** The agent runs a quick Playwright/Puppeteer script to take screenshots at various viewports (Mobile, Tablet, Desktop).
4. **Analyze:** The agent receives the screenshot (via the `view_file` tool on the image) and analyzes the visual hierarchy, contrast, and alignment.
5. **Correct:** The agent fixes margin, padding, or flexbox issues based on what it *saw*, not just what the code says.

#### Agent Constraints (Mandatory Visual Verification)
- **NO BLIND CSS GUESSING**: You are strictly prohibited from finalizing a frontend component without verifying it visually first. You MUST use a `browser_subagent` to capture a screenshot of your work.
- **Pixel-Perfect Validation**: Compare the screenshot against the initial design spec or generic UI/UX best practices. Iterate on the CSS until the visual output is flawless.
- Always check contrast ratios visually if design tokens are overridden.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec browser-automation-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Pengujian & Verifikasi E2E**: `e2e-testing-expert`, `visual-ui-auditor`, `screenshot-to-code-expert`, `accessibility-testing-expert`
- **Keamanan & Red Teaming**: `autonomous-red-teamer`, `rate-limit-abuse-prevention`
- **Scraping Web & Ekstraksi Data**: `web-scraper`, `deep-research-analyst`
- **Frontend & Craft UI**: `senior-frontend`, `tailwind-expert`, `design-system-architect`, `modern-css-native-expert`
- **Siklus Hidup & Tata Kelola**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Tujuan & Gambaran Umum
Terapkan agen web otonom super kuat yang dapat melihat, menavigasi, dan mengeksekusi alur kerja kompleks tanpa campur tangan manusia. Menggabungkan framework otomatisasi web agentic modern (**Browser-Use**, **Stagehand v0.4+**) dengan teknik penghindaran deteksi bot tingkat tinggi (Playwright Stealth, manipulasi sidik jari perangkat, rotasi proxy residential) dan model Vision frontier (**Gemini 4 Argon / Gemini 4 Pro**, **Project Astra**, **Claude Sonnet 5.5 / Fable 5.1 Computer Use**, **OpenAI GPT-5.6 Sol / o3**, **Grok 4.7 High Fast**) untuk QA visual tingkat piksel.

### Kemampuan Utama

1. **Framework Eksekusi Otonom (Standar 2026)**
   - **Stagehand v0.4+**: Persepsi DOM berbasis bahasa alami dengan aksi semantik (`page.act()`, `page.extract()`, `page.observe()`). Menghilangkan ketergantungan pada selektor CSS/XPath yang rapuh.
   - **Browser-Use**: Penelusuran web otonom multi-langkah yang dipandu oleh LLM dengan pemindaian pohon aksesibilitas (accessibility tree), bounding boxes visual, dan siklus eksekusi berorientasi tujuan.

2. **Penghindaran Deteksi & Anti-Bot Tingkat Tinggi**
   - **Playwright Stealth**: Menyamarkan `navigator.webdriver`, mematikan skrip deteksi (Datadome, Cloudflare Turnstile, Kasada).
   - **Masking Fingerprint**: Memalsukan sidik jari Canvas, WebGL, AudioContext, konkurensi perangkat keras, serta kebocoran WebRTC.
   - **Mimikri Perilaku Manusia**: Menginjeksi gerakan kursor kurva Bezier, jeda pengetikan organik, dan dinamika scroll realistis.

3. **QA Visual & Diffing via Vision LLM**
   - Teruskan screenshot viewport resolusi tinggi ke **Gemini 4 Argon/Pro Vision** (fallback: **Gemini 3.8 Flash Vision**) atau **Claude Sonnet 5.5 Vision**.
   - Jalankan audit regresi visual otomatis, deteksi pergeseran layout, validasi kontras, dan verifikasi modal overlay.

---

### Resep Implementasi Produksi

#### Resep 1: Stagehand v0.4+ dengan Playwright Stealth (TypeScript)
```typescript
import { Stagehand } from '@browserbase/stagehand';
import { z } from 'zod';

export async function jalankanAgenBelanjaOtonom(produkSasaran: string) {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-sonnet-5.5-20261022',
  });

  await stagehand.init();
  const page = stagehand.page;

  try {
    await page.goto('https://toko-contoh.com');

    // Aksi semantik tanpa selektor yang kaku
    await page.act({ action: `Cari "${produkSasaran}" pada kolom pencarian dan tekan Enter` });

    // Ekstraksi data terstruktur dengan validasi skema Zod
    const hasilProduk = await page.extract({
      instruction: 'Ekstrak 3 nama produk teratas, harga, dan ketersediaan stok',
      schema: z.object({
        products: z.array(
          z.object({
            title: z.string(),
            price: z.string(),
            inStock: z.boolean(),
          })
        ),
      }),
    });

    console.log('Hasil Ekstraksi:', hasilProduk.products);
    return hasilProduk.products;
  } finally {
    await stagehand.close();
  }
}
```

#### Resep 2: Browser-Use dengan Anti-Bot Evasion (Python)
```python
import asyncio
from browser_use import Agent
from langchain_google_genai import ChatGoogleGenerativeAI

async def jalankan_agen_browser(tujuan: str):
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.8-flash",
        temperature=0.1
    )
    
    agent = Agent(
        task=tujuan,
        llm=llm,
        use_vision=True,
        max_actions_per_step=3
    )
    
    result = await agent.run(max_steps=25)
    print(f"Status Selesai: {result.is_done()}")
    return result.final_result()

if __name__ == "__main__":
    asyncio.run(jalankan_agen_browser("Cari tiket pesawat Jakarta ke Tokyo untuk bulan depan dan ambil opsi termurah"))
```

### Protokol Eksekusi & Batasan Keamanan
- **Sebelum Eksekusi**: Selalu injeksikan header penyamaran dan acak dimensi viewport sebelum memuat halaman.
- **Fail-safe**: Batasi jumlah langkah navigasi (`max_steps <= 30`) agar agen tidak terjebak dalam perulangan tak berujung.
- **Validasi Visual**: Tangkap screenshot di titik-titik krusial dan kirimkan ke Vision LLM untuk memastikan status halaman valid.
- **Invarian Fallback Ketersediaan**: Jika tugas penjelajahan atau QA visual menggunakan Gemini 4 namun model belum tersedia/mengalami batas kuota, alihkan secara otomatis ke Gemini 3.8 Flash yang menyediakan throughput multimodal sub-100ms.

### Regresi Visual & QA Visi

#### Deskripsi
Skill ini memanfaatkan kemampuan *Vision* (penglihatan) bawaan AI untuk melakukan *Quality Assurance* (QA) visual. Agen tidak lagi sekadar menebak CSS secara buta, melainkan mengambil *screenshot* dari halaman yang dibuatnya, melihat hasilnya, dan mengkoreksi *margin/padding* secara mandiri.

#### Kondisi Pemicu
- Saat pengguna meminta untuk merapikan UI yang berantakan.
- Saat melakukan *cloning* desain dari gambar *mockup*.

#### Panduan Singkat
- **Gunakan Mata Anda (Wajib Verifikasi Visual):** Anda dilarang keras memfinalisasi atau menyelesaikan tugas frontend tanpa melihat hasilnya terlebih dahulu. Anda WAJIB mengambil *screenshot*, melihatnya menggunakan tool `view_file`, dan memverifikasi layout secara visual (*pixel-perfect*).
- **Siklus Visual:** Tulis Kode ➔ Ambil Screenshot ➔ Analisis dengan *Vision* ➔ Perbaiki Tailwind/CSS ➔ Selesai.
- **Jangan Menebak:** Terkadang `justify-center` tidak berfungsi karena ada pembungkus (*wrapper*) absolut. Jangan menebak-nebak di dalam kode; lihat hasil akhirnya secara visual!

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec browser-automation-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
