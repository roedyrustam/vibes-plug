# Changelog / Catatan Perubahan

All notable changes to this project will be documented in this file.
*Semua perubahan penting pada proyek ini akan didokumentasikan dalam berkas ini.*

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.2.2] - 2026-10-09

### Added / Ditambahkan
- **Antigravity (AGY) Full Native Plugin Integration & Sync**:
  - Penyelarasan direktori aturan standar `rules/AGENTS.md` sesuai spesifikasi Plugin Antigravity bundle standard.
  - Konfigurasi `rulesDir: "rules/"` pada platform Antigravity di `plugin.json` dan penyertaan direktori `rules/` di `package.json` files list.
  - Verifikasi otomatis dan sinkronisasi menyeluruh 147 skill spesialis serta native MCP Server `vibes-plug-tools` untuk ekosistem Google Antigravity.

## [4.2.1] - 2026-10-06

### Fixed / Diperbaiki
- **NPM Package Publishing Hotfix**:
  - Penyelarasan registry staging & bump versi 4.2.1 untuk rilis resmi publik npm.

## [4.2.0] - 2026-10-06

### Added / Ditambahkan
- **OpenAI Codex CLI Native Integration**:
  - Menambahkan file konfigurasi utama **`CODEX.md`** di root repositori khusus untuk **OpenAI Codex CLI** (`codex`) dan OpenAI coding agents.
  - Menambahkan **`.codex/rules/vibes-plug-core.md`** untuk modular rules engine platform Codex.
  - Memperbarui installer CLI **`scripts/install.js`** dengan flag `--codex` dan deteksi platform `~/.codex/` (global maupun per-project).
  - Mengintegrasikan verifikasi otomatis `CODEX.md` dan `.codex/rules/` pada `bin/vibes.mjs` (`vibes sync`).
- **Superintelligence Engineering Substrate (P1 - P5 Engines)**:
  - **P1: Canonical Prompt-Cache Compiler** (`scripts/compile-cache.mjs`, `vibes compile-cache`): Mengompilasi prefix instruksi deterministik 147 skill ke dalam `.cache-prefix.json` (5.469 bytes / ~1.440 tokens), mengunci efisiensi prompt caching >1024 token untuk Anthropic Claude, OpenAI Codex/o3, Google Gemini, dan Cursor.
  - **P2: In-Memory DB & Migration Sandbox** (`scripts/eval-migration.mjs`, `vibes db:eval`): Menjalankan simulasi DDL/SQL di memori untuk menguji keamanan RLS, mencegah penghapusan destruktif (`DROP TABLE/COLUMN`), dan memverifikasi indeks Foreign Key sebelum dieksekusi ke DB produksi.
  - **P3: AST Subgraph Query Engine** (`scripts/ast-query.mjs`, `vibes ast`): Ekstraksi bedah simbol kode (`symbols`), isolasi fungsi (`inspect`), dan kalkulasi radius dampak dependensi (`blast-radius`) tanpa membanjiri context window Transformer.
  - **P4: Speculative Multi-Draft & PRM Arbiter** (`scripts/speculative-arbiter.mjs`, `vibes arbitrate`): Evaluator Process Reward Model (PRM) heuristik untuk menilai dan mengarbitrasi draf kode kompetitif berdasarkan Type Safety, Anti-Slop, Ketahanan Error, dan Kompleksitas Algoritma.
  - **P5: Neuro-Symbolic Invariant Verifier** (`scripts/verify-invariants.mjs`, `vibes verify-invariants`): Solver verifikasi formal transisi state machine (SaaS billing, auth, order flow), deteksi deadlock dan unreachable states, serta generasi spesifikasi SMT-LIB 2.0 untuk Z3/CVC5 theorem provers.
- **Native Model Context Protocol (MCP v1.x) Server (`bin/mcp-server.mjs`, `vibes mcp`, `npm run mcp`)**:
  - Menyediakan server MCP mandiri berbasis stdio JSON-RPC 2.0 yang mengekspos 8 tools AI frontier:
    1. `vibes_ast_query`: Query simbol AST bedah dan kalkulasi blast radius.
    2. `vibes_eval_sql`: Evaluasi skema DDL & audit kebijakan RLS in-memory.
    3. `vibes_arbitrate_code`: Arbitrase PRM multi-draf kode kompetitif.
    4. `vibes_verify_invariants`: Verifikasi formal invarian transisi state machine & generasi SMT-LIB 2.0.
    5. `vibes_get_skill`: Akses instan ke 147 skill spesialis langsung dari agen AI.
    6. `vibes_compile_cache`: Kompilasi dan verifikasi prefix KV-cache deterministik (>1024 token).
    7. `vibes_memory`: Manajemen memori episodik arsitektur dan pembuatan checkpoint ultra-kompak.
    8. `vibes_swarm`: Perencanaan dan eksekusi swarm multi-agen otonom.
- **Autonomous Swarm Runner (`scripts/swarm-runner.mjs`, `vibes swarm`, `npm run swarm`)**:
  - Engine orkestrasi swarm otonom dengan 3 topologi eksekusi 2026: **Fan-Out/Fan-In** (paralel multi-domain), **Pipeline Saga** (eksekusi fase dependen berurutan), dan **Critic-Validator Loop** (pintu gerbang kualitas anti-slop).
- **Local Episodic Memory Store & Daemon (`scripts/memory-daemon.mjs`, `vibes memory`, `npm run memory`)**:
  - Penyimpanan keputusan arsitektur lintas-sesi dalam `.agents/memory/episodic_graph.json` dan generator checkpoint ultra-kompak `CHECKPOINT.md` (<150 token) untuk mengatasi amnesia konteks pada obrolan berulang.
- **Unified Sovereign Guard (`vibes guard`, `npm run guard`)**:
  - Menggabungkan validasi seluruh ekosistem (147 skill), pemindaian Anti-Slop ketat (256 file), kompilasi KV-Cache (P1), simulasi database in-memory (P2), verifikasi formal SMT (P5), Swarm runner self-test, dan pembaharuan memory checkpoint dalam 1 pipeline CI otomatis.

### Changed / Diubah
- **Universal Frontier AI Models Harmonization (2026 Edition)**:
  - Sinkronisasi dan harmonisasi menyeluruh pada seluruh 147 skill spesialis untuk model frontier terbaru:
    - **Google Gemini**: Gemini 4 Pro (2M+ context window reasoning), Gemini 4 Flash (low-latency execution), Project Astra (real-time multimodal video/audio streaming), dan Multimodal Live API.
    - **Anthropic Claude**: Claude 5.1 Fable / Mythos, Claude 5 Sonnet, dan Claude Code Agentic Swarm Patterns (Fan-Out/Fan-In, Pipeline Saga, Critic-Validator Loop).
    - **OpenAI**: GPT-5.6, GPT-5, o3, o3-mini (structured reasoning), dan GPT-4.5.
    - **DeepSeek**: DeepSeek-R1 (open reasoning), DeepSeek-Pro.
- **Sovereign Token Optimization & KV-Cache Protocol (Skema Hemat Token)**:
  - Menerapkan protokol hemat token berdaulat tanpa mengorbankan kualitas atau kelengkapan kode (Non-Degradation Invariant):
    - **KV-Cache Determinism (`kv-cache-prefix-optimizer`)**: Penguncian prefix deterministik untuk menghemat biaya token 75-90% dan mempercepat TTFT hingga 10x.
    - **Selective Context Slicing**: Pangkas muatan konteks subagent saat Fan-Out hanya pada irisan `CONTEXT_MAP.md` dan kontrak tipe relevan, mencegah ledakan konteks kuadratik.
    - **Adaptive Model Cascading (`adaptive-model-cascade`)**: Alokasi cerdas model tier rendah (`flash`/`haiku`) untuk riset/linter, dan model frontier (`pro`/`opus`) untuk arsitektur/keamanan.
    - **Ultra-Compact Checkpointing (`session-memory-manager`)**: Checkpoint ringkas (<300 token) di setiap batas sesi.
- **Pillar 7 Anti-Slop (UI Sanitation) & 3Dviz Spatial Reasoning Integration**:
  - Menggabungkan prinsip `antislop-ui` ke dalam `skills/anti-slop/SKILL.md` (Pilar 7: Sanitasi UI & Visual).
  - Mengintegrasikan prinsip `3dviz-pro-max` ke dalam `skills/web-3d-graphics-expert/SKILL.md` dan `skills/data-visualization-expert/SKILL.md` (kerajinan 3 skala, kontinuitas join, amplop tabrakan, review 16 poin).
- **Ecosystem-Wide Version Bump to v4.2.0**:
  - Seluruh 147 skill spesialis di skills/*/SKILL.md dinaikkan versinya secara resmi ke 4.2.0.
  - package.json, plugin.json, .cursorrules, AGENTS.md, CLAUDE.md, dan CLI bin/vibes.mjs diperbarui ke 4.2.0.
  - Skrip validasi scripts/validate-skills.mjs diperbarui untuk menegakkan standar verifikasi ketat version: "4.2.0" pada semua skill.

## [4.1.0] - 2026-10-03

### Added / Ditambahkan
- **147-Skill Swarm Architecture Expansion (2026 Frontier Edition)**:
  - 15 skill baru ditambahkan ke ekosistem `vibes-plug`, meningkatkan total registry dari 132 menjadi **147 skill spesialis**:
    1. `context-window-engineer`: Rekayasa context window ultra-besar (2M+ token), sliding window, dan token budgeting untuk Gemini 4 Pro, Claude 5.5, dan GPT Astra 6.
    2. `screenshot-to-code-expert`: Konversi tangkapan layar antarmuka, mockup, frame Figma, dan sketsa whiteboard menjadi kode frontend siap produksi via vision frontier models.
    3. `adaptive-model-cascade`: Kaskade dan routing model cerdas berbasis skor kompleksitas tugas (dari Flash/Haiku ke Sonnet/Opus/Astra) untuk efisiensi biaya token 40-60%.
    4. `prompt-injection-firewall`: Pertahanan berlapis terhadap injeksi prompt langsung, indirect injection, jailbreak, dan data exfiltration via tool calls.
    5. `ai-code-review-autonomous`: Review kode mandiri multi-pass otonom oleh AI tanpa tooling eksternal sebelum kode dipresentasikan ke pengguna.
    6. `llm-observability-expert`: Observabilitas LLM di produksi (Langfuse, Helicone, Lunary, OpenTelemetry GenAI) dengan pelacakan latensi, pemantauan halusinasi, dan analitik biaya token.
    7. `property-mutation-testing-expert`: Property-based testing (fast-check, Hypothesis) dan mutation testing (Stryker) untuk pembuktian invarian dan kualitas test suite.
    8. `speculative-multi-draft-synthesizer`: Penyusunan draf multi-agen spekulatif, hipotesis paralel, dan rekonsiliasi kode sadar-AST.
    9. `kv-cache-prefix-optimizer`: Rekayasa prefix prompt deterministik, KV-cache locking untuk mencapai hit rate 90%+.
    10. `test-time-compute-optimizer`: Penskalaan test-time compute, alokasi reasoning token dinamis (MCTS/PRM).
    11. `living-codebase-ast-graph`: Graf pengetahuan AST kode in-memory, pemetaan dependensi simbol real-time, dan pembersihan kode mati.
    12. `autonomous-api-drift-healer`: Deteksi drift skema API otonom, monitoring breaking change, dan pembuatan adapter SDK self-healing.
    13. `ephemeral-wasm-sandbox-executor`: Sandbox WebAssembly efemeral dan micro-runtime terisolasi untuk eksekusi kode AI yang aman.
    14. `formal-spec-z3-verifier`: Verifikasi formal matematis, SMT solver constraints (Z3, Dafny, TLA+), dan pembuktian invarian FinTech.
    15. `multimodal-spatial-video-cloner`: Reverse engineering UI/UX dari rekaman layar dan video spasial ke Tailwind CSS v4 & Framer Motion.
  - **Master Orchestrator Synchronization**:
    - `skills/brainstorming/SKILL.md`: Matriks orkestrator diperbarui penuh dalam Bahasa Inggris dan Bahasa Indonesia untuk seluruh domain terkait.
    - `skills/zero-to-prod-orchestrator/SKILL.md`: Alur kerja 8-Fase terintegrasi dengan skill baru pada Fase 1, Fase 4, Fase 5, Fase 6, dan Fase 7 (Bilingual: EN & ID).
- **DOKU Payment Gateway Architecture Upgrade (v5.1.0)**:
  - **DOKU Checkout Integration**:
    - Dukungan penuh Hosted Checkout dan Modal Popup (`jokul-checkout-1.0.0.js`) melalui `/checkout/v1/payment`.
    - Skema otentikasi Non-SNAP `HMAC-SHA256` dengan Base64 `Digest` body SHA-256 dan API Pengecekan Status Order `/orders/v1/status/{invoice}`.
    - Panduan pemilihan solusi: Rekomendasi DOKU Checkout untuk 90% use case SaaS dan web application.
  - **Direct API: Standar SNAP BI (Mandat Bank Indonesia)**:
    - Autentikasi dua lapis: OAuth B2B Access Token via Asymmetric RSA-SHA256 PKCS#1 v1.5 (`/authorization/v1/access-token/b2b`).
    - API Transaksional dengan Symmetric `HMAC-SHA512` berdasar formula `HTTPMethod:EndpointUrl:AccessToken:LowercaseHexBodyHash:Timestamp` dan header `CHANNEL-ID: H2H`.
    - Cakupan lengkap Virtual Account SNAP (`FIX_BILL`, `NO_BILL`, `BILL_VARIABLE_AMOUNT`, `PARTIAL_AMOUNT`), reusable VA (DIPC/MGPC), serta callback inquiry dan notification.
    - Cakupan lengkap QRIS SNAP (`/qr-mpm-generate`, `/qr-mpm-query`, `/qr-mpm-decode`, `/qr-mpm-cancel`, dan `/qr-mpm-refund`).
  - **Direct API: Non-SNAP**:
    - Form Credit Card Payment Page dengan 3D Secure (3DS).
    - OVO Push Payment (`/ovo-emoney/v1/payment`) dengan parameter keamanan SHA-256 Checksum dan protokol polling/webhook timeout 70 detik.
  - **Production-Ready TypeScript Service**:
    - Service class `DokuService` lengkap, menangani token B2B caching, pembuatan invoice checkout, pembuatan VA & QRIS SNAP, dan verifikasi webhook berbasis raw-body.
    - Matriks Anti-Pattern Integrasi DOKU dan penegakan atomic idempotency transaksi.
- **DOKU MCP Server (v5.0.0)**:
  - Tool MCP baru `create_doku_checkout_session` untuk inisiasi transaksi hosted/modal.
  - Tool MCP baru `check_doku_order_status` untuk verifikasi status transaksi tingkat invoice.
  - Helper fungsi pembuat header autentikasi SNAP BI (`generateSnapSignature`) dan Non-SNAP (`generateNonSnapSignature`).
- **Payment & SaaS Billing Cross-Skill Synchronization**:
  - `payment-gateway-expert`: Standardisasi pemisahan algoritma signature antara DOKU Checkout (`HMAC-SHA256` + Digest) dan Direct API SNAP BI (`HMAC-SHA512`).
  - `saas-billing`: Integrasi eksplisit DOKU Checkout & SNAP BI ke dalam lanskap payment gateway SaaS Indonesia dengan panduan raw-body parsing dan proteksi race condition database.
  - `brainstorming`: Pembaruan matriks orkestrator domain SaaS, e-commerce, dan fintech untuk merekomendasikan `doku-payment-gateway` dan `doku-mcp-server`.

### Changed / Diubah
- **Core Package & Universal Rules Alignment**:
  - `package.json`, `plugin.json`, dan CLI `bin/vibes.mjs` dinaikkan versinya secara resmi ke `4.1.0` dengan total 147 skill registry.
  - `AGENTS.md`, `CLAUDE.md`, dan `README.md` diperbarui mencerminkan Swarm Director 147 spesialis.
  - `scripts/install.js` diperbarui untuk konfirmasi sinkronisasi 147 skill lintas Antigravity, Claude, dan Cursor.
- **Quality & Anti-Slop Audit**:
  - Lolos 100% pemindaian ketat `npm test` (147 skill valid, 243 file AST anti-slop lolos dengan 0 error dan 0 warning).

---

## [4.0.0] - 2026-10-01

### Added / Ditambahkan
- **Sovereign Anti-Slop Directive (v4.0.0 Edition)**:
  - Penegakan doktrin anti-AI slop tanpa toleransi terhadap placeholder malas (`// TODO`, `// ...`), basa-basi percakapan, narasi sintaksis, dan kode halusinasi di seluruh agen, subagen, dan skill.
  - Injeksi Sovereign Anti-Slop Directive ke seluruh konfigurasi IDE (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.traerules`, `.clinerules`, `.kimirules`, `.kirorules`, `.cursor/rules/vibes-plug-core.mdc`, `.claude/rules/vibes-plug-core.md`).
  - Pemindai & Validator AST mandiri tanpa dependensi eksternal: `scripts/check-anti-slop.js`, `check-anti-slop.mjs`, dan `skills/anti-slop/scripts/check-anti-slop.js` dengan opsi `--strict`, `--fix`, dan `--json`.
  - Integrasi perintah terminal baru: `vibes anti-slop`, `npm run anti-slop`, `npm run anti-slop:strict`, dan `npm run anti-slop:fix`.
  - Pembaruan pipeline `npm test` yang mewajibkan validasi ketat ekosistem skill dan pemindaian anti-slop tanpa kompromi (zero slop errors).
- **UI/UX Anti-Slop Architecture Upgrade**:
  - `ui-ux-pro-max`: 6 Pilar Anti-Slop UI/UX (pelarangan gradien neon AI ungu/sian generik, kontrak wajib 5-status komponen interaktif, struktur DOM semantik bebas div-soup, tata letak adaptif bebas horizontal clipping, mikro-animasi berfaedah yang menghormati `prefers-reduced-motion`, dan konten mock autentik).
  - `design-system-architect`: Kontrak Desain Komponen Anti-Slop dengan token kontras rasio WCAG 2.2 Level AA dan token `@theme` terstandarisasi.
  - `hig`: Poin pemeriksaan ke-6 Kebersihan Visual Anti-Slop pada protokol audit HIG.
  - `tailwind-expert`: Bagian 6 Arahan Anti-Slop Tailwind v4 (larangan hack nilai arbitrer, kewajiban cincin fokus aksesibel, eliminasi pembungkus redundant).
  - `form-validation-expert`: Arahan Anti-Slop Formulir (larangan pesan error samar, proteksi status pending double-submission, pengikatan error ARIA, hukum perlindungan input pengguna, dan paritas kontrak skema server-side).
  - `accessibility-testing-expert`: Gerbang Verifikasi Aksesibilitas Anti-Slop (larangan outline fokus terlucuti, elemen interaktif semantik, target sentuh minimum).
  - `svg-animation-motion-expert`: Arahan Anti-Slop Gerakan & Animasi (kepatuhan mutlak `prefers-reduced-motion`, animasi khusus compositor, eliminasi bouncy slop).
  - `brainstorming`: Mendaftarkan `anti-slop` pada domain UI/UX & Design Systems.

### Changed / Diubah
- **Universal Ecosystem Version Bump to v4.0.0**: Seluruh 132 skill di `skills/*/SKILL.md` dinaikkan versinya secara resmi ke `version: "4.0.0"`.
- **Validation CI Enforcement**: `scripts/validate-skills.mjs` diperbarui untuk menegakkan standar minimum versi 4.0.0 (`major >= 4`).
- **Core Package Alignment**: `package.json`, `plugin.json`, dan `README.md` diperbarui serentak ke versi `4.0.0`.

## [3.10.0] - 2026-09-29

### Added / Ditambahkan
- **Skill `app-promo-media-expert`**: Panduan ahli untuk memproduksi media promosi aplikasi visual (gambar) dan video animasi gerak (App Store & Google Play screenshots, social cards Product Hunt/Twitter/LinkedIn, banner dinamis Open Graph via `@vercel/og`, video teaser terprogram dengan Remotion React, formula storyboard 30 detik berkonversi tinggi, dan otomasi headless screenshot via Playwright).
- **132-Skill Ecosystem Expansion**: Sinkronisasi 132 skill di `brainstorming/SKILL.md` (Domain File & Media), `zero-to-prod-orchestrator/SKILL.md` (Fase 5 & Fase 8), `package.json`, `plugin.json`, dan `README.md`.

## [3.9.0] - 2026-09-29

### Added / Ditambahkan
- **Universal Multi-Agent Swarm Integration**: Dukungan konfigurasi aturan Swarm lintas IDE (`AGENTS.md` untuk Antigravity, `CLAUDE.md` untuk Claude Code, `.cursorrules` untuk Cursor, Windsurf, Trae, Cline, Kimi, dan Kiro).
- **131-Skill Strict Validation**: Seluruh 131 skill diverifikasi dengan pipeline CI ketat (`scripts/validate-skills.mjs`), memastikan kepatuhan frontmatter YAML v3.0+, bebas referensi usang, dan struktur dwibahasa (Inggris & Indonesia).
- **Zero Tech Debt Auditor Enhancements**: Standardisasi penuh spesifikasi `zero-tech-debt-auditor` dengan panduan bilingual dan protokol eliminasi dead code (Knip Protocol).

### Fixed / Diperbaiki
- **Frontmatter Deduplication**: Membersihkan duplikasi metadata header pada 114 skill untuk menjaga integritas pembacaan skill oleh runner model.
- **Skill Count Synchronization**: Sinkronisasi total 131 skill di seluruh dokumentasi `package.json`, `plugin.json`, `README.md`, dan CLI.

## [3.8.0] - 2026-09-28

### Added / Ditambahkan
- **Gemini 4 Pro (Next-Gen Readiness)**: Mengintegrasikan prinsip arsitektur masa depan ke orkestrator inti (gemini-agent-booster, multi-agent-orchestration, mcp-server-architect, rainstorming).
- **Determinisme Prefix KV-Caching**: Mengunci struktur prompt statis (*static prefix*) pada orkestrator rainstorming/SKILL.md untuk memangkas latensi TTFT (*Time-to-First-Token*) hingga 90% pada konteks raksasa.
- **Agentic MoE & Swarm Paralel Masif**: Mendorong eksekusi *subagent* massal serentak (*batch tooling*) dan penggunaan *state* memori monolitik daripada RAG terfragmentasi per agen.
- **High-Throughput MCP Server**: Panduan penanganan konkurensi (pemanggilan serentak via Promise.all atau syncio.gather) di mcp-server-architect untuk mengimbangi kecepatan model-model *frontier* gen-4.
- **Native Any-to-Any Multimodal Tokens**: Standarisasi integrasi API tanpa melalui perantara STT/TTS pada arsitektur agen real-time.

## [3.7.0] - 2026-09-24

### Added / Ditambahkan
- **Standar SNAP BI 1.0 (Bank Indonesia)**: Implementasi penuh standar SNAP BI pada `doku-payment-gateway` dan `payment-gateway-expert`. Menggunakan enkripsi Asimetrik RSA-SHA256 untuk B2B Access Token (`/api/v1.0/access-token/b2b`) dan Simetrik **HMAC-SHA512** untuk endpoint transaksional (Virtual Account, QRIS, E-Wallet).
- **Pencegahan Race Condition & Atomic Idempotency**:
  - Pola **Atomic Update** (`UPDATE ... WHERE status = 'PENDING'`) dan penguncian tabel unik pada `saas-billing` dan `payment-gateway-expert`. Mencegah saldo/langganan bertambah ganda saat webhook DOKU/Stripe terpanggil serentak.
  - Kewajiban penggunaan **Raw Body Parser** (`req.text()` atau `express.raw({ type: 'application/json' })`) untuk menjamin signature validasi tidak rusak akibat spasi atau serialisasi ulang JSON.
- **Swarm Execution Topologies (2026 Master Protocol)**:
  - Protokol pendelegasian subagent di `zero-to-prod-orchestrator` dan `brainstorming`: **Fan-Out / Fan-In** (paralel lintas UI, Backend, DB), **Pipeline Saga** (eksekusi 8-Fase berurutan), dan **Critic-Validator Gate** (audit mandiri sebelum serah terima).
  - Integrasi loop pengujian otomatis perbaikan mandiri (**`autonomous-tdd-debugger`**) di `senior-frontend` dan `js-backend-expert`.

### Changed / Diubah
- **DOKU Gateway Integration**: Migrasi penuh dari legacy Jokul API v2 (HMAC-SHA256) ke standar SNAP BI (HMAC-SHA512).
- **Frontend & Backend Standards**: Penegasan Tailwind CSS v4 CSS-first (`@theme`), Next.js 15 Partial Prerendering (PPR), React 19 Compiler tanpa `useMemo`/`useCallback`, dan Node.js 24 LTS.
- **Version Bump**: Versi aplikasi dan plugin dinaikkan dari `3.6.0` ke `3.7.0` di `package.json`, `plugin.json`, `bin/vibes.mjs`, dan `CHANGELOG.md`.

### Fixed / Diperbaiki
- **Typo Skill References**: Memperbaiki salah ketik referensi skill (` utonomous-red-teamer` → `autonomous-red-teamer`) di `brainstorming/SKILL.md` dan `zero-to-prod-orchestrator/SKILL.md`.
- **Duplicate ORM Reference**: Membersihkan penyebutan ganda `database-orm-expert` pada matriks orkestrasi `js-backend-expert`.

---

## [3.6.0] - 2026-09-14

### Added / Ditambahkan
- **CLI: `vibes search <query>`**: Pencarian semantik berbasis frekuensi kata kunci di seluruh 125 skill. Hasil diurutkan berdasarkan relevansi (score). Contoh: `vibes search payment` → 18 skill relevan, dipimpin oleh `doku-mcp-server` dan `payment-gateway-expert`.
- **CLI: `vibes recipe list`**: Tampilkan 6 built-in skill bundles yang dikurasi dengan deskripsi dan daftar skill di tiap resep.
- **CLI: `vibes recipe apply <name>`**: Install semua skill dari sebuah resep ke `.agents/skills/` sekaligus. Skip skill yang sudah terinstall. 6 resep tersedia:
  - `ai-stack` — AI/LLM + RAG + Vector DB + Multi-Agent
  - `fullstack-pro` — Next.js 15 + Auth + DB + Payments + Testing
  - `security-hardened` — Zero-Trust + Rate-Limit + GDPR + Red Team
  - `realtime-app` — WebSockets + SSE + CRDT + State
  - `mobile-first` — Expo + PWA Offline + Push Notifications
  - `data-platform` — ETL + Visualization + Telemetry + Search

---

## [3.5.0] - 2026-09-14

### Added / Ditambahkan
- **CLI: `vibes skill info <name>`**: Tampilkan metadata lengkap sebuah skill (name, version, description, author, orchestration links) langsung dari terminal. Juga menunjukkan apakah skill sudah terinstall di project lokal.
- **CLI: `vibes hooks install`**: Install Git pre-commit hook yang menjalankan Anti-Slop Audit secara otomatis sebelum setiap `git commit`. Melindungi codebase dari AI placeholder code.
- **CLI: `vibes hooks remove`**: Hapus Git pre-commit hook dengan aman.
- **Bootstrap: 3 template baru** — `mobile` (Expo SDK), `api` (Hono/Node.js), `fullstack` (T3 Stack). Total kini 5 template: `saas`, `ecommerce`, `mobile`, `api`, `fullstack`. Setiap template dilengkapi dengan skill set yang sesuai domain.

---

## [3.4.0] - 2026-09-14

### Added / Ditambahkan
- **CLI: `vibes version current`**: Tampilkan versi saat ini dari `package.json`.
- **CLI: `vibes version bump <major|minor|patch>`**: Bump versi secara terpusat dan sinkron di `package.json`, `plugin.json`, `vibes.mjs`, dan `CHANGELOG.md` sekaligus — eliminasi human error saat rilis.
- **CLI: `vibes doctor`**: Health diagnostics — memeriksa Node.js version, npx, global skills directory, `@inquirer/prompts`, dan local `.agents/skills/` sekaligus dalam satu perintah.

### Changed / Diubah
- **CJS → ESM Migration**: Konversi `scripts/check-anti-slop.js` → `scripts/check-anti-slop.mjs` dan `scripts/update_skills.js` → `scripts/update_skills.mjs` menggunakan `import/export` syntax. Seluruh codebase kini 100% ESM.
- **`package.json` scripts**: Ditambahkan `"audit"` dan `"update-skills"` npm script agar bisa dijalankan via `npm run audit` dan `npm run update-skills`.
- **`runAudit`**: Diperbarui untuk menggunakan `check-anti-slop.mjs` (ESM) menggantikan versi CJS lama.

---

## [3.3.0] - 2026-09-14

### Added / Ditambahkan
- **CLI: `vibes list [filter]`**: New command to list all 125+ skills from the global registry. Shows which skills are already installed locally (✅ marker). Supports optional keyword filter (e.g., `vibes list saas` → shows 3 saas-related skills).
- **CLI: `vibes remove <skill-name>`**: New command to cleanly uninstall a skill from the local project's `.agents/skills/` directory. Simetris dengan `vibes add`.
- **CLI: `vibes bootstrap`**: Super-scaffold a full Next.js 15 app with auto-injected AI skills. Templates: `saas` and `ecommerce`.
- **CLI: `vibes ui`**: Interactive TUI using `@inquirer/prompts` for visual multiselect skill installation.

### Fixed / Diperbaiki
- **Hardcoded skill count** di `scripts/validate-skills.mjs` — sebelumnya hardcode `"All 124 skills"`, sekarang dinamis menggunakan variabel `totalSkills`.
- **Missing `version` tag** di frontmatter `frontier-ai-models-expert/SKILL.md` — menyebabkan validation gagal. Sekarang `version: "3.0.0"` ditambahkan.

---

## [3.2.0] - 2026-09-13

### Added / Ditambahkan
- **CLI Enhancements**:
  - Added `vibes create-skill <skill-name>` command to easily scaffold new skills using a standard template.
  - Added `vibes audit` command to manually run the Anti-AI Slop quality gate check.
- **New Frontier Skill: `frontier-ai-models-expert`**:
  - Added a dedicated skill for late-2026 frontier AI models, including Claude 5.1 (Fable/Mythos) and Project Astra (Gemini 3.1).
  - Covers Enterprise Frontier Safeguards (EFS), zero data retention, and multimodal capabilities.
  - Orchestrated in `brainstorming` and `zero-to-prod-orchestrator`.

### Changed / Diubah
- Synchronized orchestrator matrices in `brainstorming/SKILL.md` and `zero-to-prod-orchestrator/SKILL.md` to include `frontier-ai-models-expert`.
- Bumped versions in `package.json` and `plugin.json` to 3.2.0.

---

## [2.13.0] - 2026-09-11

### Added / Ditambahkan
- **New Frontier Skill: `anti-slop` (145+ Skills Total)**:
  - Added dedicated zero-tolerance Anti-AI Slop quality gate skill (`skills/anti-slop/SKILL.md`).
  - Covers the 5 Pillars of AI Slop: elimination of conversational sycophancy/fluff, strict ban on lazy code truncation (`// TODO`, `// ... rest of code unchanged`, mock arrays in production), speculative over-engineering avoidance, elimination of syntax-narrating decorative comments, and enforcement of high technical density documentation.
  - Added automated pre-commit/CI validator script `scripts/check-anti-slop.js` to catch AI slop and placeholder omissions deterministically.
- **Bilingual Gold Standard Compliance**:
  - Restructured and upgraded `graph-rag-knowledge-expert`, `pwa-offline-first-expert`, and `voice-ai-realtime-agent` to provide 100% compliant English and Bahasa Indonesia sections with standard bilingual anchor links and `## Integrasi Orkestrasi`.

### Changed / Diubah
- **Orchestrators & Swarm Integration**:
  - Registered `anti-slop` in `skills/brainstorming/SKILL.md` across Testing & Security and Execution Handoff matrices.
  - Integrated `anti-slop` into `skills/zero-to-prod-orchestrator/SKILL.md` (Phase 1, Phase 6 Code Quality Audit, and general token efficiency guidelines in both English & Indonesian).
  - Cross-referenced `anti-slop` in `production-ready-hardener`, `vibe-code-gardener`, and `token-saver`.
  - Updated all ecosystem documentation and counts to 145+ skills (`package.json`, `plugin.json`, `AGENTS.md`, `CLAUDE.md`, `BLUEPRINT.md`, `README.md`).

---

## [2.12.0] - 2026-09-10

### Added / Ditambahkan
- **Ecosystem Expansion to 144+ Skills**: Introduced 4 frontier 2026 AI & Agentic engineering skills:
  - `vercel-ai-sdk-expert`: Complete production guide for Vercel AI SDK (Core, UI, RSC) in Next.js 15 & React 19. Covers `streamText`, `generateObject`, multi-provider fallback switching (Anthropic, OpenAI, Google, Groq), tool-calling agent loops, and Server Actions streaming. *(Panduan ahli Vercel AI SDK, streaming data terstruktur, dan integrasi AI).*
  - `deep-research-analyst`: Autonomous deep research pipeline with recursive query decomposition, multi-source crawling (Crawl4AI / Firecrawl), credibility scoring, fact triangulation (>= 2 independent sources), and evidence graph synthesis with markdown citations. *(Panduan ahli riset mendalam otonom, pencarian web iteratif, dan mitigasi halusinasi).*
  - `pydantic-ai-expert`: Type-safe Python AI agent framework with Pydantic AI. Features runtime dependency injection (`RunContext`), model-agnostic routing, structured Pydantic schema validation, and graph workflows. *(Panduan ahli pengembangan agen AI Python type-safe dengan Pydantic AI).*
  - `synthetic-data-finetuning-expert`: End-to-end synthetic dataset generation pipeline with LLM-as-a-judge quality filtering, QLoRA fine-tuning with Unsloth, DPO alignment, and GGUF/Ollama model export for local SLMs. *(Panduan ahli generasi data sintetis, fine-tuning QLoRA, DPO, dan ekspor GGUF/Ollama).*

### Changed / Diubah
- **Universal Multi-Platform & Swarm Orchestration**:
  - Updated all core orchestrators (`brainstorming`, `zero-to-prod-orchestrator`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.cursor/rules/vibes-plug-core.mdc`) to orchestrate the 144+ skills ecosystem.
  - Integrated `deep-research-analyst` into Phase 1 (Discovery & AI PRD Planning), `vercel-ai-sdk-expert`, `pydantic-ai-expert`, and `synthetic-data-finetuning-expert` into Phase 4 (Backend & AI Agents) and Phase 5 (Frontend).
  - Synchronized versions and documentation across `package.json`, `plugin.json`, `README.md`, `BLUEPRINT.md`, `index.js`, and `GITHUB_PROMO_KIT.md`.

---

## [2.11.0] - 2026-09-08

### Added / Ditambahkan
- **Ecosystem Expansion to 140+ Skills**: Introduced 3 high-impact frontier 2026 skills:
  - `voice-ai-realtime-agent`: Ultra-low-latency (<300ms) bi-directional conversational voice AI with WebRTC, OpenAI Realtime API, Gemini Multimodal Live Audio (PCM 24kHz), Semantic VAD, and LiveKit Agents. *(Panduan ahli AI suara percakapan real-time berlatensi ultra-rendah).*
  - `graph-rag-knowledge-expert`: Knowledge Graphs and GraphRAG architectures for multi-hop relational retrieval, entity-relationship extraction, Microsoft GraphRAG hierarchical community detection, and Neo4j Text2Cypher. *(Panduan ahli Knowledge Graph, GraphRAG, dan inferensi multi-hop).*
  - `pwa-offline-first-expert`: Enterprise Local-First and Progressive Web App architectures with zero-latency local operations (OPFS SQLite, RxDB), conflict-free multi-device sync (ElectricSQL, PowerSync), and PWABuilder store packaging. *(Panduan ahli arsitektur Offline-First & Local-First PWA).*

### Changed / Diubah
- **Skill Orchestrator Matrix Synchronization**:
  - `brainstorming`: Mapped `voice-ai-realtime-agent` to AI & Communication domains, `graph-rag-knowledge-expert` to Database & AI domains, and `pwa-offline-first-expert` to Frontend & Mobile domains (English & Indonesian).
  - `zero-to-prod-orchestrator`: Linked new skills into Phase 3 (Database), Phase 4 (Backend APIs & AI Agents), and Phase 5 (Frontend & Mobile) (English & Indonesian).

---

## [2.10.0] - 2026-09-08

### Added / Ditambahkan
- **Ecosystem Expansion to 137+ Skills**: Introduced 3 frontier 2026 specialized skills:
  - `ai-evals-benchmark-expert`: Automated evaluation framework for LLMs & AI agents using Promptfoo, DeepEval, Ragas, deterministic assertions, and regression benchmarking. *(Panduan ahli evaluasi otomatis LLM & Agen AI).*
  - `local-slm-edge-ai-expert`: Edge AI and Small Language Models (SLMs) execution directly in the browser and edge environments via WebLLM, Transformers.js v3, ONNX Runtime Web, and WebGPU with zero cloud latency. *(Panduan ahli eksekusi SLM lokal dan AI edge di browser).*
  - `modern-css-native-expert`: Cutting-edge 2026 native CSS guide covering CSS Anchor Positioning, `@starting-style` entry animations, View Transitions Level 2, Container Queries, and `:has()` relational selector. *(Panduan ahli fitur CSS native modern 2026).*

### Changed / Diubah
- **Resilience & Security Hardening**:
  - `background-jobs-queue-expert`: Deepened with complete production-grade BullMQ v5 recipes, Redis idempotency locks, Dead Letter Queue (DLQ) retry strategies with exponential backoff and jitter, and priority job processing.
  - `autonomous-red-teamer`: Deepened with automated adversarial test suites, prompt injection detection pipelines, SSRF filter bypass methodologies, and automated security patch remediation templates.
  - `brainstorming` & `zero-to-prod-orchestrator`: Synchronized domain matrices and Phase 4, Phase 5, and Phase 6 orchestration chains to natively coordinate all 137 skills.

---

## [2.9.0] - 2026-09-08

### Changed / Diubah
- **Production Code Recipes & 2026 Frontier Hardening**: Upgraded 4 key AI & distributed execution skills with robust production-ready code recipes and 2026 standards:
  - `browser-automation-expert`: Updated vision models to Gemini 3.8 Flash and Claude 3.7 Sonnet (Computer Use); added concrete production recipes for Stagehand v0.4+ and Browser-Use with anti-bot evasion and Playwright stealth.
  - `mcp-server-architect`: Added full production FastMCP (Python) server template and `@modelcontextprotocol/sdk` (TypeScript) McpServer implementation featuring Streamable HTTP / SSE transport, typed tools, dynamic resources, and security guardrails.
  - `vector-db-rag-expert`: Upgraded to 2026 Deep RAG standards with Reciprocal Rank Fusion (RRF) hybrid search (combining BM25 and pgvector 0.8+ HNSW), Cross-Encoder Re-ranking via FlashRank, and Late Chunking architecture.
  - `async-queue-temporal-expert`: Added concrete Temporal.io TypeScript SDK implementation featuring the distributed Saga pattern with compensating rollbacks, and Trigger.dev v3 durable tasks with retry jitter.
  *(Peningkatan Resep Kode Produksi & Kesiapan 2026: Meng-upgrade 4 skill kunci AI & eksekusi terdistribusi dengan resep kode siap pakai di lingkungan produksi dan standar 2026: Browser Automation, MCP Server Architect, Deep RAG & Vector DB, serta Temporal Async Queue.)*

---

## [2.8.0] - 2026-09-08

### Changed / Diubah
- **Core AI Skills Upgrade (2026 Edition)**: Upgraded 3 foundational AI engineering skills to current 2026 frontier standards:
  - `gemini-agent-booster`: Upgraded to Gemini 3.x ecosystem (Gemini 3.8 Flash, Gemini 3.5/3.1 Pro/Flash) with 1M–2M token context, native `cachedContent` Context Caching, dynamic `thinkingBudget` reasoning configuration, and Gemini Multimodal Live API bidirectional WebSocket streaming.
  - `ai-llm-integration-expert`: Added Anthropic Claude 3.7 Sonnet (Hybrid/Extended Thinking), OpenAI o1/o3/o3-mini & GPT-4.5/4o, DeepSeek-R1 (MoE reasoning), Model Context Protocol (MCP) Streamable HTTP transport, MCP Sampling, and Vercel AI SDK 5.x/6.x reasoning token streaming.
  - `multi-agent-orchestration`: Formalized 5 Anthropic 2026 Core Agentic Design Patterns (Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, Evaluator-Optimizer Loop), LangGraph v0.3+ persistent checkpointers, and OpenAI Agents SDK handoffs & guardrails.
  *(Pembaruan Skill Inti AI 2026: Meng-upgrade 3 skill AI utama mencakup Gemini 3.x, Claude 3.7 Hybrid Thinking, DeepSeek-R1, MCP Streamable HTTP & Sampling, dan 5 pola desain agentik modern Anthropic.)*

---

## [2.7.1] - 2026-09-04

### Changed / Diubah
- **Complete 134-Skill Synchronization**: Fully audited all 134 skills in `skills/` and ensured 100% representation across `README.md`, `BLUEPRINT.md`, `brainstorming/SKILL.md`, and `zero-to-prod-orchestrator/SKILL.md`.
  *(Sinkronisasi Lengkap 134 Skill: Mengaudit seluruh 134 skill dan memastikan representasi 100% pada semua file dokumentasi dan orkestrator.)*
- **Skill Orchestrator Matrix Update**: Registered `asisten-ramah` and `skill-baru` in both English and Indonesian matrices in `brainstorming/SKILL.md` (Execution Handoff) and `zero-to-prod-orchestrator/SKILL.md` (Phase 1 / Fase 1) per mandatory plugin protocol.
  *(Pembaruan Matriks Orkestrator Skill: Mendaftarkan `asisten-ramah` dan `skill-baru` pada orkestrator utama dalam bahasa Inggris dan Indonesia.)*
- **README & Blueprint Alignment**: Added detailed descriptions for all 47 previously uncataloged skills across the 9 core engineering domains in `README.md`, and regenerated `BLUEPRINT.md` with full 134-skill bilingual manifests.
  *(Penyelarasan README & Blueprint: Menambahkan deskripsi mendalam untuk seluruh 47 skill yang sebelumnya belum terdaftar di README, dan memperbarui BLUEPRINT.md.)*
- **Installer Version Fix**: Corrected banner version display in `scripts/install.js` to match current release.

---

## [2.7.0] - 2026-08-18

### Added / Ditambahkan
- **Enhanced Swarm Topologies**: Introduced 4 standardized Swarm Topologies (Hierarchical Star, Pipeline Saga, Peer-to-Peer Mesh, Critic-Validator Quality Gates) in `AGENTS.md` and `multi-agent-orchestration/SKILL.md`.
  *(Topologi Swarm Tingkat Lanjut: Menambahkan 4 topologi swarm standar untuk eksekusi paralel dan sekuensial.)*
- **Swarm Circuit Breakers & Dynamic Routing**: Automated failure detection, retry thresholds, and intelligent fallback delegation across specialized skills.
  *(Circuit Breaker Swarm & Perutean Dinamis: Deteksi kegagalan otomatis dan delegasi fallback cerdas.)*
- **Multi-Platform Swarm Protocols**: Unified execution standards across **Antigravity (AGY)** subagent spawning, **Claude Code** background tasks, and **Cursor IDE** Composer rules.
  *(Protokol Swarm Multi-Platform: Standarisasi eksekusi terpadu di seluruh platform.)*
- **Synchronized Swarm Architecture Diagram**: Updated Mermaid architecture in `README.md` reflecting multi-platform entry points and the 9-domain swarm engine (134+ skills).
  *(Diagram Arsitektur Swarm Tersinkronisasi: Diagram Mermaid diperbarui untuk mencakup semua platform dan 9 domain skill.)*

---

## [2.6.0] - 2026-08-18

### Added / Ditambahkan
- **Universal Multi-Platform Support**: Added full compatibility for **Claude Code/Desktop** (`CLAUDE.md`, `.claude/rules/vibes-plug-core.md`) and **Cursor IDE** (`.cursorrules`, `.cursor/rules/vibes-plug-core.mdc`).
  *(Dukungan multi-platform universal: Menambahkan kompatibilitas penuh untuk Claude Code dan Cursor IDE.)*
- **Cross-Platform CLI Installer**: Created `scripts/install.js` for automated zero-friction environment deployment across Antigravity, Claude, and Cursor.
  *(Script installer cross-platform: Membuat `scripts/install.js` untuk deployment otomatis.)*
- **20 New Specialized Skills** (Expanding total skills from 114 to 134):
  1. `ai-media-generation-expert`: AI Image/Video/Voice synthesis (Flux, DALL-E, Sora, ElevenLabs, Whisper).
  2. `headless-cms-expert`: Sanity v3, Payload CMS 3.x, Strapi 5, Contentful, Storyblok.
  3. `astro-framework-expert`: Astro 5+ Content Collections, Islands Architecture, View Transitions.
  4. `data-visualization-expert`: Recharts, Tremor, D3.js v7, Chart.js 4, Apache ECharts.
  5. `rich-text-editor-expert`: Tiptap v2, Lexical, ProseMirror, Yjs collaborative editing.
  6. `svelte-sveltekit-expert`: Svelte 5 Runes, SvelteKit 2, server actions.
  7. `chatbot-messaging-expert`: WhatsApp Business Cloud API, Telegram Bot, Discord.js, Slack Bolt.
  8. `ecommerce-expert`: Shopify Storefront API, Medusa.js v2, Saleor.
  9. `documentation-site-expert`: Mintlify, Docusaurus 3, Storybook 8, Astro Starlight.
  10. `biome-linter-formatter-expert`: Biome v2 (Rust-based linter/formatter replacing ESLint/Prettier).
  11. `solidjs-expert`: SolidJS 2, SolidStart, fine-grained reactivity.
  12. `geospatial-maps-expert`: Mapbox GL JS v3, Leaflet, Google Maps, PostGIS.
  13. `pdf-document-generation-expert`: React PDF, Puppeteer PDF, jsPDF, pdf-lib.
  14. `search-engine-expert`: Typesense, Meilisearch, Elasticsearch.
  15. `n8n-automation-expert`: n8n self-hosted workflows, custom nodes, AI chains.
  16. `angular-expert`: Angular 19+ Standalone, Signals, NgRx SignalStore, SSR Hydration.
  17. `wordpress-headless-expert`: WPGraphQL, ACF Pro, Faust.js, Next.js/Astro.
  18. `desktop-electron-expert`: Electron 33+ Context Isolation, typed IPC, auto-updater.
  19. `blockchain-web3-expert`: viem, wagmi v2, RainbowKit, EVM smart contracts.
  20. `accessibility-testing-expert`: axe-core, Pa11y, WCAG 2.2 Level AA/AAA automated testing.

### Changed / Diubah
- Updated orchestrator matrices in `brainstorming/SKILL.md` and `zero-to-prod-orchestrator/SKILL.md` (both EN and ID) to integrate all 20 new skills.
- Synchronized skill counts to **134+** across `README.md`, `CLAUDE.md`, `.cursorrules`, `package.json`, and `plugin.json`.

---



### Added / Ditambahkan
- Registered 6 previously undocumented skill modules in `BLUEPRINT.md` and `README.md`: `autonomous-chaos-monkey`, `autonomous-red-teamer`, `hyper-context-synthesizer`, `llm-cost-arbitrage-router`, `post-quantum-crypto-migrator`, `self-healing-cloud-orchestrator`.
  *(Mendaftarkan 6 modul skill yang sebelumnya tidak terdokumentasi di `BLUEPRINT.md` dan `README.md`: `autonomous-chaos-monkey`, `autonomous-red-teamer`, `hyper-context-synthesizer`, `llm-cost-arbitrage-router`, `post-quantum-crypto-migrator`, `self-healing-cloud-orchestrator`.)*

### Changed / Diubah
- **Naming Standardization**: Renamed 3 skill directories from underscore to kebab-case convention: `asisten_ramah` → `asisten-ramah`, `skill_baru` → `skill-baru`, `ui_ux_expert` → `ui-ux-expert`.
  *(Standardisasi penamaan: Mengganti nama 3 direktori skill dari underscore ke konvensi kebab-case.)*
- Updated all cross-references to renamed skills across `README.md`, `CONTRIBUTING.md`, `bootstrap-to-modern/SKILL.md`, and `skill-baru/SKILL.md`.
  *(Memperbarui seluruh referensi silang ke skill yang diganti nama di `README.md`, `CONTRIBUTING.md`, `bootstrap-to-modern/SKILL.md`, dan `skill-baru/SKILL.md`.)*
- Synchronized skill count from "103" to "109" across `README.md` (badge, mermaid, footer), `BLUEPRINT.md` (EN & ID headers), and all documentation.
  *(Menyelaraskan jumlah skill dari "103" menjadi "109" di `README.md` (badge, mermaid, footer), `BLUEPRINT.md` (header EN & ID), dan seluruh dokumentasi.)*
- Synchronized `BLUEPRINT.md` version from v2.4.0 to v2.5.0 to match `plugin.json`.
  *(Menyelaraskan versi `BLUEPRINT.md` dari v2.4.0 ke v2.5.0 agar sesuai dengan `plugin.json`.)*

---

## [2.4.0] - 2026-08-11

### Added / Ditambahkan
- Updated `saas-transformer` master orchestrator: Reconstructed 9-phase ASCII architecture map and enriched skill maps across all 9 transformation phases in both English and Bahasa Indonesia sections.
  *(Pembaruan `saas-transformer`: Merestrukturisasi peta arsitektur ASCII 9-fase dan memperkaya pemetaan skill di seluruh 9 fase transformasi.)*
- Updated `production-ready-hardener` master orchestrator: Reconstructed 7-phase ASCII architecture map and enriched skill maps across all 7 pre-production hardening phases.
  *(Pembaruan `production-ready-hardener`: Merestrukturisasi peta arsitektur ASCII 7-fase dan memperkaya pemetaan skill di seluruh 7 fase pengerasan pra-produksi.)*
- Added Windows standard output UTF-8 stream reconfiguration (`sys.stdout.reconfigure(encoding='utf-8')`) in scanner scripts (`saas_transformation_scanner.py` and `production_readiness_scanner.py`) to prevent terminal encoding errors.
  *(Menambahkan rekonfigurasi encoding stream UTF-8 pada script scanner Python untuk mencegah error encoding di terminal Windows.)*
- Synchronized `BLUEPRINT.md` to list all 87 skill modules across both English and Bahasa Indonesia documentation sections.
  *(Menyelaraskan `BLUEPRINT.md` untuk mencakup seluruh 87 modul skill pada dokumentasi Bahasa Inggris dan Bahasa Indonesia.)*

### Changed / Diubah
- Restructured `rules/` directory into a single `AGENTS.md` at the plugin root to ensure full compatibility and automatic rule loading in Antigravity IDE and Desktop.
  *(Merestrukturisasi direktori `rules/` menjadi satu file `AGENTS.md` di root plugin untuk memastikan kompatibilitas penuh dan pemuatan aturan otomatis di Antigravity IDE dan Desktop.)*
- Fixed UTF-8 character encoding corruptions (mojibake) across skill guidelines (`SKILL.md`) and project documentation (`BLUEPRINT.md`).
  *(Memperbaiki kerusakan encoding karakter UTF-8 (mojibake) pada petunjuk skill dan dokumentasi proyek.)*
- Bumped plugin, package, and blueprint versions to `v2.4.0`.
  *(Meningkatkan versi plugin, package, dan blueprint ke `v2.4.0`.)*

---

## [1.8.0] - 2026-08-09

### Added / Ditambahkan
- Added `website-design-cloner` skill module: Reverse-engineer website designs & templates directly from any live target URL into 1:1 code (Tailwind CSS v4 `@theme`, React 19, Next.js 15 App Router).
  *(Menambahkan modul skill `website-design-cloner`: Mempelajari dan merekayasa balik desain situs web & template secara langsung dari URL target ke kode presisi 1:1.)*
- Integrated URL design cloning triggers and handoff protocols into `web-scraper`, `ui-ux-pro-max`, and `brainstorming`.
  *(Mengintegrasikan pemicu duplikasi desain URL dan protokol handoff ke dalam `web-scraper`, `ui-ux-pro-max`, dan `brainstorming`.)*

### Changed / Diubah
- Bumped plugin and package versions to `v1.8.0`.
  *(Meningkatkan versi plugin dan package ke `v1.8.0`.)*

---

## [1.7.0] - 2026-08-09

### Added / Ditambahkan
- Automated PRD & Roadmap creation protocol: `prd-architect` and `zero-to-prod-orchestrator` now enforce generating both `PRD.md` and `ROADMAP.md` before any code implementation begins on new projects.
  *(Protokol otomatisasi PRD & Roadmap: `prd-architect` dan `zero-to-prod-orchestrator` sekarang mewajibkan pembuatan `PRD.md` dan `ROADMAP.md` sebelum penulisan kode dimulai.)*
- Explicit **Skill Orchestration & Handoff** matrices added across domain expert skills (`senior-frontend`, `js-backend-expert`, `ai-llm-integration-expert`, `saas-multi-tenant`, `auto-doc-updater`).
  *(Menambahkan matriks **Skill Orchestration & Handoff** eksplisit pada seluruh skill domain spesialis.)*

### Changed / Diubah
- Upgraded master orchestrator `brainstorming` and `zero-to-prod-orchestrator` to seamlessly cross-reference and delegate to all 77 specialized skills in `vibes-plug`.
  *(Memperbarui orchestrator master `brainstorming` dan `zero-to-prod-orchestrator` untuk mendelegasikan tugas secara dinamis ke seluruh 77 skill di `vibes-plug`.)*
- Bumped plugin and package versions to `v1.7.0`.
  *(Meningkatkan versi plugin dan package ke `v1.7.0`.)*

---

## [1.5.0] - 2026-07-26

### Added / Ditambahkan
- Added `session-handoff-resume` skill module, providing zero-token loss session continuation across account switches and chat resets via ultra-compact `STATE_HANDOFF.md` checkpoints.
  *(Menambahkan modul skill `session-handoff-resume` untuk menyimpan checkpoint `STATE_HANDOFF.md` super hemat token dan melanjutkan proyek secara instan saat ganti akun/sesi.)*
- Added `multi-agent-orchestration` skill module, providing expert-level guidelines for multi-agent systems, LangGraph, CrewAI, AutoGen, supervisor routing, state graphs, and Human-in-the-Loop guardrails.
  *(Menambahkan modul skill `multi-agent-orchestration` yang menyediakan pedoman tingkat ahli untuk sistem multi-agen, LangGraph, CrewAI, AutoGen, perutean supervisor, dan gerbang persetujuan manusia.)*
- Added `design-system-architect` skill module, providing expert-level guidelines for enterprise UI design systems, Design Tokens, Radix UI/Base UI headless primitives, Tailwind CSS v4 `@theme`, CVA variants, and WCAG 2.2 AAA accessibility.
  *(Menambahkan modul skill `design-system-architect` yang menyediakan pedoman tingkat ahli untuk design system UI, Design Tokens, headless primitives Radix UI/Base UI, Tailwind v4 `@theme`, CVA, dan aksesibilitas WCAG 2.2 AAA.)*
- Added `mcp-server-architect` skill module, providing expert-level guidelines for designing, building, and securing Model Context Protocol (MCP) servers across TypeScript, Python, and Go (stdio/SSE transports, Zod/Pydantic validation, security guardrails).
  *(Menambahkan modul skill `mcp-server-architect` yang menyediakan pedoman tingkat ahli untuk merancang, membangun, dan mengamankan server Model Context Protocol (MCP) pada TypeScript, Python, dan Go.)*
- Added `go-programming-expert` skill module, providing expert-level guidelines for Go 1.23/1.24+ backend APIs, microservices, concurrency patterns, sqlc, net/http, Gin/Echo/Fiber, gRPC, and table-driven testing.
  *(Menambahkan modul skill `go-programming-expert` yang menyediakan pedoman tingkat ahli untuk Go 1.23/1.24+ backend API, microservices, pola konkurensi, sqlc, net/http, Gin/Echo/Fiber, gRPC, dan testing.)*
- Added `js-backend-expert` skill module, providing expert-level guidelines for Node.js 22 LTS, Bun 1.2+, Deno 2.x, Fastify 5, Hono, Express 5, NestJS, Prisma 6, Drizzle ORM, WebSockets, and BullMQ background jobs.
  *(Menambahkan modul skill `js-backend-expert` yang menyediakan pedoman tingkat ahli untuk Node.js 22 LTS, Bun 1.2+, Deno 2.x, Fastify 5, Hono, Express 5, NestJS, Prisma 6, Drizzle ORM, WebSocket, dan pemrosesan background job BullMQ.)*

### Changed / Diubah
- Upgraded all master orchestrator skills (`zero-to-prod-orchestrator`, `app-analyzer-optimizer`, `production-ready-hardener`, `saas-transformer`) to seamlessly integrate and delegate tasks across all newly added 2026 skills (`session-handoff-resume`, `mcp-server-architect`, `multi-agent-orchestration`, `design-system-architect`, `go-programming-expert`, `js-backend-expert`, `seo-geo`).
  *(Memperbarui seluruh skill master orkestrator (`zero-to-prod-orchestrator`, `app-analyzer-optimizer`, `production-ready-hardener`, `saas-transformer`) agar secara otomatis mengintegrasikan dan mendelegasikan tugas ke seluruh skill baru 2026.)*
- Standardized and updated all 48 skills within `vibes-plug` to match current 2026 technical relevance and industry standards.
  *(Memperbarui dan menyelaraskan seluruh 48 skill di `vibes-plug` agar sesuai dengan relevansi teknis dan standar industri terkini tahun 2026.)*
- Updated AI/LLM skills (`ai-llm-integration-expert`, `brainstorming`) with Model Context Protocol (MCP), Vercel AI SDK 4.x/5.x, reasoning models (DeepSeek-R1/V3, Gemini 3.5/3.6, Claude 3.7), and HNSW vector search.
  *(Memperbarui skill AI/LLM dengan Model Context Protocol (MCP), Vercel AI SDK 4.x/5.x, model penalaran, dan pencarian vektor HNSW.)*
- Updated Frontend & Mobile skills (`senior-frontend`, `tailwind-expert`, `mobile-expo-expert`, `tauri-expert`) with Next.js 15+, React 19, Tailwind CSS v4 `@theme`, Expo SDK 52+, React Native 0.76+ New Architecture, and Tauri v2.0+ stable.
  *(Memperbarui skill Frontend & Mobile dengan React 19, Next.js 15+, Tailwind v4, Expo SDK 52+, React Native 0.76+ New Architecture, dan Tauri v2.0+.)*
- Updated Language & Runtime skills (`python-programming-expert`, `rust-programming-expert`, `bun-runtime-expert`) to Python 3.12/3.13+ (PEP 695 generics, `uv`, `Ruff`), Rust 2024 (v1.85+), and Bun 1.2+.
  *(Memperbarui skill Bahasa & Runtime ke Python 3.12/3.13+, Rust 2024, dan Bun 1.2+.)*
- Updated Search & Scraping skills (`seo-geo`, `web-scraper`) with Generative Engine Optimization (GEO for AI Overviews, Perplexity, ChatGPT Search) and Crawl4AI / Playwright extraction engines.
  *(Memperbarui skill Search & Scraping dengan Generative Engine Optimization (GEO) dan engine ekstraksi Crawl4AI / Playwright.)*

## [1.4.3] - 2026-07-13

### Added / Ditambahkan
- Added `mvc-expert` skill module, providing expert-level guidelines to refactor legacy/obsolete PHP spaghetti codebases into modern, secure, and scalable MVC architectures using modern PHP 8.2+ OOP features and PSR standards.
  *(Menambahkan modul skill `mvc-expert` yang menyediakan pedoman tingkat ahli untuk merefaktor codebase PHP spageti lama/usang menjadi arsitektur MVC yang modern, aman, dan skalabel menggunakan fitur OOP PHP 8.2+ modern dan standar PSR.)*

### Changed / Diubah
- Bumped project and plugin versions to v1.4.3.
  *(Meningkatkan versi proyek dan plugin ke v1.4.3.)*

## [1.4.2] - 2026-07-13

### Changed / Diubah
- Improved technology version modernization script `update_skills.js` to support matching non-breaking space variants (like `&nbsp;` and `\u0026nbsp;`).
  *(Meningkatkan skrip pencocokan standardisasi teknologi `update_skills.js` agar mendukung pencocokan variasi spasi non-breaking seperti `&nbsp;` dan `\u0026nbsp;`.)*
- Updated `ui-ux-pro-max` dataset to target Next.js 15 instead of Next.js 14 in non-breaking spaces documentation.
  *(Memperbarui dataset `ui-ux-pro-max` untuk menargetkan Next.js 15 daripada Next.js 14 pada bagian dokumentasi spasi non-breaking.)*
- Documented missing `auto-doc-updater` and `skill-baru` skills in `README.md` and `BLUEPRINT.md`.
  *(Mendokumentasikan skill `auto-doc-updater` dan `skill-baru` yang sebelumnya belum tercantum di `README.md` dan `BLUEPRINT.md`.)*
- Bumped project and plugin versions to v1.4.2.
  *(Meningkatkan versi proyek dan plugin ke v1.4.2.)*

## [1.4.1] - 2026-06-30

### Changed / Diubah
- Updated `ui-ux-expert` and `ui-ux-pro-max` skill modules to add comprehensive design and implementation guidelines for modern, professional, and standard dashboard architectures.
  *(Memperbarui modul skill `ui-ux-expert` dan `ui-ux-pro-max` untuk menambahkan panduan desain dan implementasi komprehensif bagi arsitektur dashboard yang modern, profesional, dan standar.)*
- Bumped project and plugin versions to v1.4.1.
  *(Meningkatkan versi proyek dan plugin ke v1.4.1.)*

## [1.4.0] - 2026-06-25

### Added / Ditambahkan
- Added `fullstack-expert` skill module, providing expert-level guidelines for multi-language (TypeScript, Python, Go, Rust), multi-framework (Next.js, FastAPI, Gin, Axum) web development, API design patterns, database architectures, DevOps, and observability.
  *(Menambahkan modul skill `fullstack-expert` yang menyediakan pedoman tingkat ahli untuk pengembangan web multi-bahasa (TypeScript, Python, Go, Rust), multi-framework (Next.js, FastAPI, Gin, Axum), pola desain API, arsitektur database, DevOps, dan observability.)*
- Added `saas-transformer` master orchestrator skill module to guide systematic 8-phase transformation of standard applications into production-grade multi-tenant SaaS platforms (covering database isolation, billing/Stripe, teams, and feature gating).
  *(Menambahkan modul skill master orkestrator `saas-transformer` untuk memandu transformasi sistematis 8-fase dari aplikasi standar menjadi platform SaaS multi-tenant tingkat produksi (mencakup isolasi database, billing/Stripe, tim, dan feature gating).)*
- Added `production-ready-hardener` master orchestrator skill module to conduct automated 7-phase application pre-launch audits across security, performance, accessibility, testing, and deployment, including a Python-based diagnostic scanner tool.
  *(Menambahkan modul skill master orkestrator `production-ready-hardener` untuk melakukan audit pra-peluncuran aplikasi 7-fase secara otomatis pada aspek keamanan, performa, aksesibilitas, testing, dan deployment, termasuk alat scanner diagnostik berbasis Python.)*
- Added/documented missing core skill modules in the plugin index, including `tanstack-query-expert` (asynchronous state management & caching), `web-scraper` (multi-strategy data extraction workflow), `supabase-migration` (database schema migration tracking), `ui-ux-expert` (responsive web design & layout optimization), and `asisten-ramah` (friendly conversational styling).
  *(Menambahkan/mendokumentasikan modul skill inti yang sebelumnya belum tercantum di indeks plugin, termasuk `tanstack-query-expert` (manajemen state asinkron & caching), `web-scraper` (alur kerja ekstraksi data multi-strategi), `supabase-migration` (pelacakan migrasi skema database), `ui-ux-expert` (desain web responsif & optimasi tata letak), dan `asisten-ramah` (gaya percakapan ramah).)*

## [1.3.9] - 2026-06-19

### Changed / Diubah
- Executed audit and validation across all 29 skill modules in the repository to ensure standardization of frontmatter, modern tech stacks (React 19, Next.js 15, Tailwind CSS v4, TanStack Query v5, Bun v1.1+), trigger conditions formatting, and clean emoji encodings.
  *(Melakukan audit dan validasi di seluruh 29 modul skill dalam repositori untuk memastikan standardisasi frontmatter, stack teknologi modern (React 19, Next.js 15, Tailwind CSS v4, TanStack Query v5, Bun v1.1+), format kondisi pemicu, dan pengodean emoji yang bersih.)*

## [1.3.8] - 2026-06-15

### Added / Ditambahkan
- Added `secure-fuzz-testing` skill module detailing coverage-guided fuzzing target creation (Atheris for Python, cargo-fuzz for Rust, native Go fuzzing), sanitizers configuration (ASan, MSan, UBSan), diagnostic analysis, and automated DevSecOps CI/CD pipelines integration.
  *(Menambahkan modul skill `secure-fuzz-testing` yang mendetailkan pembuatan target fuzzing berbasis cakupan (Atheris untuk Python, cargo-fuzz untuk Rust, native Go fuzzing), konfigurasi sanitizer (ASan, MSan, UBSan), analisis diagnostik, dan integrasi pipa DevSecOps CI/CD otomatis.)*

## [1.3.7] - 2026-06-15

### Added / Ditambahkan
- Added `python-programming-expert` skill module detailing Python 3.12+ features, type parameters, generic validation schemas using Pydantic v2, structured concurrency with asyncio TaskGroups, database interactions with SQLAlchemy 2.0 and SQLModel, package management via uv/Poetry, linting with Ruff, and testing with pytest.
  *(Menambahkan modul skill `python-programming-expert` yang mendetailkan fitur Python 3.12+, parameter tipe, skema validasi generik menggunakan Pydantic v2, konkurensi terstruktur dengan asyncio TaskGroups, interaksi database dengan SQLAlchemy 2.0 dan SQLModel, manajemen paket melalui uv/Poetry, linting dengan Ruff, dan pengujian dengan pytest.)*

## [1.3.6] - 2026-06-14

### Changed / Diubah
- Cleaned up obsolete metadata fields (`github:`, `risk:`, `source:`, and `date_added:`) from all skill definition files in the repository.
  *(Membersihkan bidang metadata usang (`github:`, `risk:`, `source:`, dan `date_added:`) dari seluruh berkas definisi skill di repositori.)*

## [1.3.5] - 2026-06-14

### Changed / Diubah
- Added header banner image `banner.png` to the top of `README.md`.
  *(Menambahkan gambar banner header `banner.png` di bagian atas `README.md`.)*

## [1.3.4] - 2026-06-14

### Added / Ditambahkan
- Added `scalability-clean-code` skill module outlining clean coding guidelines (SOLID, readability, DRY, KISS) and scalability architecture principles (Clean Architecture, decoupling, caching, database scale).
  *(Menambahkan modul skill `scalability-clean-code` yang menguraikan pedoman kode bersih (SOLID, readability, DRY, KISS) dan prinsip arsitektur skalabilitas (Clean Architecture, decoupling, caching, database scale).)*

## [1.3.3] - 2026-06-14

### Added / Ditambahkan
- Added `tailwind-expert` skill module detailing Tailwind CSS v4 CSS-first configuration, OKLCH theme variables, responsive design rules, state modifiers, custom utilities, bundle optimization, and class merging.
  *(Menambahkan modul skill `tailwind-expert` yang merinci konfigurasi CSS-first Tailwind CSS v4, variabel tema OKLCH, aturan desain responsif, modifikator status, utilitas kustom, optimasi bundle, dan penggabungan kelas.)*

## [1.3.2] - 2026-06-14

### Added / Ditambahkan
- Added `firebase-security-expert` skill module for Firebase security checks, including Firestore/Storage/Realtime Database rules, Service Account safety, GCP API key restrictions, and App Check.
  *(Menambahkan modul skill `firebase-security-expert` untuk pemeriksaan keamanan Firebase, termasuk aturan Firestore/Storage/Realtime Database, keamanan Service Account, pembatasan API key GCP, dan App Check.)*

## [1.3.1] - 2026-06-14

### Added / Ditambahkan
- Added `CONTRIBUTING.md` containing detailed contribution guidelines for fork developers to create and submit new skills.
  *(Menambahkan `CONTRIBUTING.md` yang berisi panduan kontribusi terperinci bagi pengembang fork untuk membuat dan mengirimkan skill baru.)*

### Changed / Diubah
- Synced the metadata version in `plugin.json` to match the project version of `1.3.1`.
  *(Menyelaraskan versi metadata di `plugin.json` agar sesuai dengan versi proyek `1.3.1`.)*

## [1.3.0] - 2026-06-12

### Added / Ditambahkan
- Added `token-saver` skill to enforce concise AI responses and minimal codebase rewrites.
  *(Menambahkan skill `token-saver` untuk memaksakan respons AI yang ringkas dan meminimalkan penulisan ulang kode.)*
- Added `tauri-expert` skill outlining Tauri v2 best practices, IPC communication, and security capabilities.
  *(Menambahkan skill `tauri-expert` yang menguraikan praktik terbaik Tauri v2, komunikasi IPC, dan kemampuan keamanan.)*
- Added `prd-architect` skill serving as a mandatory guardrail to generate and validate Product Requirements Documents (PRD) before generating code for new projects.
  *(Menambahkan skill `prd-architect` yang berfungsi sebagai guardrail wajib untuk membuat dan memvalidasi Product Requirements Document (PRD) sebelum menghasilkan kode untuk proyek baru.)*

### Changed / Diubah
- Standardized all 23 skill metadata (frontmatter) formats across the plugin.
  *(Menstandardisasi semua 23 format metadata (frontmatter) skill di seluruh plugin.)*
- Standardized the trigger header to `## Kondisi Pemicu` in all skills.
  *(Menstandardisasi header pemicu menjadi `## Kondisi Pemicu` di semua skill.)*
- Broadly updated technical relevance in existing skills (bumped to React 19, Next.js 15, Tailwind v4, TanStack Query v5, Bun v1.1+).
  *(Memperbarui relevansi teknis secara luas pada skill yang ada (ditingkatkan ke React 19, Next.js 15, Tailwind v4, TanStack Query v5, Bun v1.1+).)*
- Fixed markdown script paths in `ui-ux-pro-max` and emoji encoding issues in `ui_ux_expert`.
  *(Memperbaiki path skrip markdown di `ui-ux-pro-max` dan masalah pengkodean emoji di `ui_ux_expert`.)*

## [1.2.6] - 2026-05-24

### Added / Ditambahkan
- Created a new `rust-programming-expert` skill module for Rust programming (Rust 2024 / v1.85+).
  *(Membuat modul skill baru `rust-programming-expert` untuk pemrograman Rust (Rust 2024 / v1.85+).)*

## [1.2.5] - 2026-05-24

### Added / Ditambahkan
- Created a new `bun-runtime-expert` skill module for Bun runtime (v1.3+).
  *(Membuat modul skill baru `bun-runtime-expert` untuk runtime Bun (v1.3+).)*

## [1.2.4] - 2026-05-24

### Changed / Diubah
- Updated the `brainstorming` skill with 2026 modern web architecture guidance.
  *(Memperbarui skill `brainstorming` dengan panduan arsitektur web modern 2026.)*

## [1.2.3] - 2026-05-24

### Changed / Diubah
- Updated the `senior-frontend` skill to target React 19 / Next.js 15 / Tailwind CSS v4.
  *(Memperbarui skill `senior-frontend` untuk menargetkan React 19 / Next.js 15 / Tailwind CSS v4.)*

## [1.2.2] - 2026-05-24

### Changed / Diubah
- Comprehensively updated the `senior-fullstack` skill with professional, production-grade architectural guidance and code.
  *(Memperbarui secara komprehensif skill `senior-fullstack` dengan panduan arsitektur dan kode tingkat produksi profesional.)*

## [1.2.1] - 2026-05-24

### Changed / Diubah
- Updated the `saas-mvp-launcher` skill file with state-of-the-art 2026 patterns.
  *(Memperbarui file skill `saas-mvp-launcher` dengan pola mutakhir 2026.)*


