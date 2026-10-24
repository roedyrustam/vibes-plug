---
name: htmx-hypermedia-expert
description: "Expert guide for HTMX 2.0+, Hypermedia-Driven Applications (HDA), server-side rendering with htmx attributes, Alpine.js integration, and modern HTML-over-the-wire patterns / Panduan ahli HTMX 2.0+, Hypermedia-Driven Applications, dan pola HTML-over-the-wire modern."
author: "Roedy Rustam"
version: "4.4.2"
---

# HTMX & Hypermedia Expert (HTMX 2.0 / HDA Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects with: `modern-web-guidance`, `modern-css-native-expert`, `design-system-architect`, `tailwind-expert`, `ui-ux-pro-max`, `visual-ui-auditor`, `anti-slop`, `brainstorming`, `zero-to-prod-orchestrator`, `js-backend-expert`, `python-programming-expert`, `go-programming-expert`, `rust-programming-expert`, `authentication-identity-expert`, `database-orm-expert`, `session-memory-manager`.

### Description
Expert guide for building Hypermedia-Driven Applications (HDA) using **HTMX 2.0+**. Covers htmx core attributes (`hx-get`, `hx-post`, `hx-swap`, `hx-trigger`), server-side rendering patterns, partial page updates, WebSocket/SSE integration, Alpine.js companion patterns, and transitioning from SPA frameworks to lightweight hypermedia architecture.

### Trigger Conditions
- Building server-rendered applications with dynamic interactivity without heavy JS frameworks.
- Using **HTMX** for partial page updates and HTML-over-the-wire patterns.
- Combining HTMX with **Alpine.js** for client-side micro-interactions.
- Implementing **infinite scroll, live search, form validation** via htmx.
- Building with any backend (Express, FastAPI, Go, Rails, Django, Laravel, Hono) and wanting SPA-like UX without React/Vue.
- Migrating from a heavy SPA to a simpler hypermedia architecture.

### What's New in 2026

#### HTMX 2.0 — Key Updates
- **Stable WebSocket Extension**: First-class `hx-ws` support for real-time bidirectional communication.
- **SSE Extension (Stable)**: Server-Sent Events via `hx-ext="sse"` for live data streams.
- **View Transitions API**: Native browser view transitions with `hx-swap="transition:true"`.
- **Enhanced History**: Better back/forward navigation with `hx-push-url` and `hx-replace-url`.
- **Improved Extensions API**: Cleaner extension authoring for custom behaviors.
- **Response Targets**: `hx-target-error`, `hx-target-4xx`, `hx-target-5xx` for error-specific rendering.

#### The Hypermedia Renaissance
HTMX has become one of the most starred JavaScript libraries on GitHub, driving a movement back to server-rendered applications with sprinkles of interactivity. Key ecosystem:
- **Alpine.js 3.14+**: Lightweight reactive framework for client-side state that pairs with HTMX.
- **_hyperscript**: Event-driven scripting language from the HTMX team.
- **Tailwind CSS v4**: CSS-first configuration pairs naturally with server-rendered HTML.
- **Template Engines**: Jinja2, Go templates, Handlebars, EJS, Pug — all work natively.

### Core Architecture Patterns

#### 1. HTMX Setup
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTMX App</title>
  <!-- HTMX 2.0 -->
  <script src="https://unpkg.com/htmx.org@2.0.4"></script>
  <!-- Alpine.js for client-side micro-interactions -->
  <script defer src="https://unpkg.com/alpinejs@3.14.9/dist/cdn.min.js"></script>
  <!-- Tailwind CSS -->
  <link href="/styles.css" rel="stylesheet">
</head>
<body>
  <!-- Application content -->
</body>
</html>
```

#### 2. Partial Page Updates (Core Pattern)
```html
<!-- Clicking this button fetches HTML from server and swaps into #results -->
<button
  hx-get="/api/search?q=flutter"
  hx-target="#results"
  hx-swap="innerHTML"
  hx-indicator="#loading"
>
  Search
</button>

<div id="loading" class="htmx-indicator">Loading...</div>
<div id="results">
  <!-- Server returns HTML fragment, not JSON -->
</div>
```

Server response (returns HTML, not JSON):
```html
<!-- /api/search returns this HTML fragment -->
<div class="result-item">
  <h3>Flutter Expert Skill</h3>
  <p>Cross-platform mobile development guide.</p>
</div>
<div class="result-item">
  <h3>Dart Programming</h3>
  <p>Type-safe language for Flutter apps.</p>
</div>
```

#### 3. Live Search with Debounce
```html
<input
  type="search"
  name="q"
  placeholder="Search products..."
  hx-get="/api/products/search"
  hx-trigger="input changed delay:300ms, search"
  hx-target="#search-results"
  hx-swap="innerHTML"
  hx-indicator="#search-spinner"
/>
<span id="search-spinner" class="htmx-indicator">⏳</span>
<div id="search-results"></div>
```

#### 4. Inline Editing
```html
<!-- Display mode -->
<div id="user-name-1" hx-get="/users/1/edit" hx-trigger="dblclick" hx-swap="outerHTML">
  <span>John Doe</span>
</div>

<!-- Server returns edit form on double-click -->
<form id="user-name-1" hx-put="/users/1/name" hx-swap="outerHTML">
  <input type="text" name="name" value="John Doe" autofocus>
  <button type="submit">Save</button>
  <button hx-get="/users/1/display" hx-swap="outerHTML" hx-target="#user-name-1">Cancel</button>
</form>
```

#### 5. Infinite Scroll
```html
<div id="product-list">
  <!-- Products rendered server-side -->
  <div class="product">Product 1</div>
  <div class="product">Product 2</div>
  <!-- Sentinel element — triggers load when visible -->
  <div
    hx-get="/api/products?page=2"
    hx-trigger="revealed"
    hx-swap="outerHTML"
    hx-indicator="#load-more-spinner"
  >
    <span id="load-more-spinner" class="htmx-indicator">Loading more...</span>
  </div>
</div>
```

#### 6. Form Validation (Server-Side)
```html
<form hx-post="/api/register" hx-target="#form-container" hx-swap="outerHTML">
  <div>
    <label for="email">Email</label>
    <input
      type="email"
      name="email"
      hx-post="/api/validate/email"
      hx-trigger="blur changed"
      hx-target="next .error"
      hx-swap="innerHTML"
    />
    <span class="error"></span>
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" name="password" />
  </div>
  <button type="submit">Register</button>
</form>
```

#### 7. WebSocket Real-Time Updates
```html
<div hx-ext="ws" ws-connect="/ws/notifications">
  <div id="notifications">
    <!-- Server pushes HTML fragments via WebSocket -->
  </div>
</div>
```

#### 8. Server-Sent Events (SSE)
```html
<div hx-ext="sse" sse-connect="/events/stream">
  <div sse-swap="message" hx-swap="beforeend">
    <!-- Each SSE event appends HTML fragment -->
  </div>
</div>
```

#### 9. Alpine.js + HTMX Companion Pattern
```html
<!-- Alpine.js handles client-side state, HTMX handles server communication -->
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle Menu</button>
  <nav x-show="open" x-transition>
    <a hx-get="/dashboard" hx-target="#main" hx-push-url="true">Dashboard</a>
    <a hx-get="/settings" hx-target="#main" hx-push-url="true">Settings</a>
  </nav>
</div>
<main id="main">
  <!-- Page content swapped by HTMX -->
</main>
```

#### 10. Backend Integration (Multi-Language)

**Express.js (Node.js):**
```javascript
app.get('/api/products/search', (req, res) => {
  const { q } = req.query;
  const products = searchProducts(q);
  // Return HTML fragment — NOT JSON
  res.send(products.map(p => `
    <div class="product-card">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
    </div>
  `).join(''));
});
```

**FastAPI (Python):**
```python
from fastapi.responses import HTMLResponse

@app.get("/api/products/search", response_class=HTMLResponse)
async def search_products(q: str):
    products = await product_repo.search(q)
    html = "".join(
        f'<div class="product-card"><h3>{p.name}</h3><p>${p.price}</p></div>'
        for p in products
    )
    return HTMLResponse(content=html)
```

**Go (net/http + html/template):**
```go
func searchHandler(w http.ResponseWriter, r *http.Request) {
    q := r.URL.Query().Get("q")
    products := searchProducts(q)
    tmpl := template.Must(template.ParseFiles("templates/product-list.html"))
    tmpl.Execute(w, products)
}
```

### When HTMX Is the Right Choice
| Use Case | HTMX | React/Vue SPA |
|:---|:---:|:---:|
| Content sites with dynamic sections | ✅ Ideal | ⚠️ Overkill |
| Admin dashboards | ✅ Ideal | ✅ Also good |
| E-commerce product listings | ✅ Ideal | ✅ Also good |
| Real-time collaborative editors | ❌ Use SPA | ✅ Ideal |
| Complex client-side state (drag-drop, canvas) | ❌ Use SPA | ✅ Ideal |
| SEO-critical pages with interactivity | ✅ Ideal | ⚠️ Requires SSR |

### Anti-Patterns to Avoid
1. **Returning JSON from HTMX endpoints** — HTMX expects HTML fragments. The server renders HTML.
2. **Over-using `hx-swap="outerHTML"`** — Prefer `innerHTML` to avoid losing event listeners on the target element.
3. **Not using `hx-indicator`** — Users need loading feedback. Always show a spinner.
4. **Duplicating client-side state** — If you need complex client state, use Alpine.js, not a full SPA framework alongside HTMX.
5. **Ignoring `hx-push-url`** — Enable URL updates for browser history and shareable links.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec htmx-hypermedia-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dengan: `modern-web-guidance`, `modern-css-native-expert`, `design-system-architect`, `tailwind-expert`, `ui-ux-pro-max`, `visual-ui-auditor`, `anti-slop`, `brainstorming`, `zero-to-prod-orchestrator`, `js-backend-expert`, `python-programming-expert`, `go-programming-expert`, `rust-programming-expert`, `authentication-identity-expert`, `database-orm-expert`, `session-memory-manager`.

### Deskripsi
Panduan ahli untuk membangun Hypermedia-Driven Applications (HDA) menggunakan **HTMX 2.0+**. Mencakup atribut inti htmx (`hx-get`, `hx-post`, `hx-swap`, `hx-trigger`), pola rendering server-side, pembaruan halaman parsial, integrasi WebSocket/SSE, pola pendamping Alpine.js, dan transisi dari framework SPA ke arsitektur hypermedia ringan.

### Kondisi Pemicu
- Membangun aplikasi server-rendered dengan interaktivitas dinamis tanpa framework JS berat.
- Menggunakan **HTMX** untuk pembaruan halaman parsial dan pola HTML-over-the-wire.
- Menggabungkan HTMX dengan **Alpine.js** untuk interaksi mikro sisi klien.
- Mengimplementasikan infinite scroll, live search, validasi form melalui htmx.
- Membangun dengan backend apapun dan menginginkan UX layaknya SPA tanpa React/Vue.

### Pola Arsitektur Inti

#### 1. Konsep Kunci HTMX
HTMX bekerja dengan mengirim request HTTP dan menerima **fragmen HTML** (bukan JSON). Server bertanggung jawab merender UI. Browser hanya mengganti (swap) bagian halaman yang berubah.

Atribut inti:
- **`hx-get` / `hx-post` / `hx-put` / `hx-delete`**: Mengirim request HTTP.
- **`hx-target`**: Element mana yang akan di-update dengan respons.
- **`hx-swap`**: Cara memasukkan respons (`innerHTML`, `outerHTML`, `beforeend`, `afterend`).
- **`hx-trigger`**: Event yang memicu request (`click`, `input changed delay:300ms`, `revealed`).
- **`hx-indicator`**: Element yang ditampilkan sebagai loading indicator.
- **`hx-push-url`**: Update URL browser untuk navigasi history.

#### 2. Kapan Menggunakan HTMX
- Website konten dengan interaktivitas dinamis.
- Dashboard admin.
- E-commerce dengan daftar produk, filter, dan pencarian.
- Formulir multi-langkah.
- Aplikasi yang memprioritaskan kesederhanaan dan kecepatan pengembangan.

#### 3. Kapan TIDAK Menggunakan HTMX
- Editor kolaboratif real-time (gunakan SPA + CRDT).
- Aplikasi dengan state klien kompleks (drag-drop, canvas, grafik interaktif).
- Aplikasi offline-first yang butuh service worker berat.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec htmx-hypermedia-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
