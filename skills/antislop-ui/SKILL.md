---
name: antislop-ui
description: "UI & Visual anti-slop doctrine for web and mobile interfaces — bans generic blue-purple gradients, excessive glassmorphism, copy-paste feature cards, fake terminal windows, decorative dots/badges, bento grid defaults, and invented dashboard metrics / Doktrin anti-slop UI & visual untuk antarmuka web dan mobile."
author: "Roedy Rustam"
version: "4.2.0"
---

# Sovereign Anti-Slop UI & Visual Protocol (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & Purpose
The **Sovereign Anti-Slop UI Protocol** is the dedicated visual filter and design-craft enforcement engine within the `vibes-plug` ecosystem. Modern AI models are heavily biased toward generic, over-represented training defaults: neon blue-purple gradients, excessive frosted glass, uniform pill-shaped elements, copy-paste feature cards, and fake dashboard statistics.

This protocol enforces that every digital interface created or modified by an AI agent feels **authentically crafted by an elite product designer**, firmly rooted in the product's unique brand identity (`DESIGN.md`), rather than statistically hallucinated by an LLM.

Load this skill whenever the task involves creating, refactoring, or auditing a website, web application, mobile interface, or dashboard.

---

## The 6 Dimensions of UI Slop Elimination

```
                             ┌──────────────────────────────────────────────┐
                             │    SOVEREIGN ANTI-SLOP UI DOCTRINE (2026)    │
                             └──────────────────────┬───────────────────────┘
                                                    │
        ┌───────────────────┬───────────────────────┼───────────────────────┬───────────────────┐
        │                   │                       │                       │                   │
 ┌──────▼──────┐     ┌──────▼──────┐         ┌──────▼──────┐         ┌──────▼──────┐     ┌──────▼──────┐
 │ DIMENSION 1 │     │ DIMENSION 2 │         │ DIMENSION 3 │         │ DIMENSION 4 │     │ DIMENSION 5 │
 │Visual & Color│    │Layout & Comp│         │ Decorative  │         │ Structure & │     │ Dashboard & │
 │  Sanitation │     │   Rhythm    │         │  Elements   │         │    Flow     │     │ App Shells  │
 └─────────────┘     └─────────────┘         └─────────────┘         └─────────────┘     └─────────────┘
                                                    │
                                             ┌──────▼──────┐
                                             │ DIMENSION 6 │
                                             │   Motion    │
                                             │ Discipline  │
                                             └─────────────┘
```

---

## Dimension 1: Visual & Color Sanitation

### 1.1 Generic Blue-Purple Gradient & Radial Glow
- **🔴 The Tell:** Blue-to-purple (`#3B82F6` -> `#8B5CF6`), blue-to-cyan, or purple-to-pink gradients as the primary background or button treatment; blurred neon radial orbs floating behind hero headlines.
- **Why it is Slop:** It is the single most over-represented color combination in AI training weights. It instantly broadcasts *"no brand identity"* and stamps the product as cheap AI generation.
- **✅ The Sovereign Fix:** Extract all colors from `DESIGN.md` or the verified product identity. Restrict gradients strictly to functional hierarchy markers with an explicit architectural rationale. The same gradient across multiple sections is strictly forbidden.

### 1.2 Excessive Glassmorphism (Frosted Glass Everywhere)
- **🔴 The Tell:** `backdrop-blur-md`, semi-transparent backgrounds, and white borders applied to the navbar, cards, modals, dropdowns, and sidebar all at once.
- **Why it is Slop:** When every surface is frosted glass, depth and contrast collapse. Nothing stands in the foreground, destroying visual accessibility and hierarchy.
- **✅ The Sovereign Fix:** Glass is a rare visual accent, never a baseline theme. **Dose Cap: maximum 1 to 2 elements per screen** (typically just a sticky navbar or command palette). All other containers must use solid, high-contrast surfaces.

### 1.3 Excessive Border Radius (Pill-Shape Fatigue)
- **🔴 The Tell:** Every UI primitive is fully rounded (`rounded-full`): buttons, input fields, feature cards, dialogs, badges, and avatars.
- **Why it is Slop:** Uniform pill shapes erase semantic differentiation. An input field must not look identical to a badge or button.
- **✅ The Sovereign Fix:** Define a strict 3-tier radius token scale in Tailwind CSS v4 `@theme` (e.g., `sm: 6px`, `md: 10px`, `lg: 16px`). Reserve pill shapes solely for compact status badges or circular icon buttons.

### 1.4 Overly Soft & Infinite Shadows
- **🔴 The Tell:** Giant, diffused shadows (`shadow-2xl` with 30px+ blur) on every card, making the entire viewport feel like it is floating in zero-gravity.
- **Why it is Slop:** When everything is elevated, elevation communicates zero state. The screen loses its ground plane and becomes mushy.
- **✅ The Sovereign Fix:** Default to flat, crisp borders (`border border-neutral-200 dark:border-neutral-800`). Use subtle, directional elevation (`shadow-sm` or `shadow-md`) strictly to indicate interactive lift on hover or elevated modal layers.

### 1.5 Ambient Glow Everywhere
- **🔴 The Tell:** Colored outer glows, box-shadow glows, and drop-shadows wrapped around cards, buttons, badges, and headers simultaneously.
- **Why it is Slop:** Glow is an attention amplifier. Amplifying everything means amplifying nothing. It is a hallmark signature of amateur AI aesthetics.
- **✅ The Sovereign Fix:** Maximum dose cap: 0-1 focal glow on the entire viewport, strictly reserved for the primary conversion trigger. All surrounding components remain matte.

### 1.6 Background Grid & Graph Paper
- **🔴 The Tell:** Repeating dot grids (`radial-gradient`), blueprint squares, or diagonal lines placed behind hero copy to simulate "technical depth".
- **Why it is Slop:** It is a lazy crutch to avoid creating authentic visual art direction. It introduces visual noise that hurts text legibility.
- **✅ The Sovereign Fix:** Use subtle grid textures only when the product is explicitly a CAD, developer IDE, or charting tool, with the rationale documented in `DESIGN.md`. For typical web apps, maintain clean, solid, accessible negative space.

### 1.7 Dark Mode Default Without Brand Reason
- **🔴 The Tell:** Defaulting to pure `#000000` or `#09090b` with neon accents simply because it "looks like a cool developer tool", ignoring product domain.
- **Why it is Slop:** Dark mode is a strategic branding decision, not a lazy default. E-commerce, healthcare, fin-ops, and document tools thrive in clean light modes.
- **✅ The Sovereign Fix:** Select the default theme based on audience and context. When in doubt, implement a robust system-aware theme toggle (`light`, `dark`, `system`) using CSS variables.

### 1.8 Unrestrained Palette Bloat
- **🔴 The Tell:** 5 to 7 bright, competing brand colors splashed across a single page without semantic purpose.
- **Why it is Slop:** Chaos destroys visual hierarchy.
- **✅ The Sovereign Fix:** Strict palette ceiling: **2-3 core brand colors + 1 accent color + neutral grayscale base** (using OKLCH color space for perceptually uniform lightness).

### 1.9 Sterile Default (The Over-Correction Void)
- **🔴 The Tell:** Pure white `#ffffff`, razor-thin grey borders, no personality, system font, zero contrast, void of feeling.
- **Why it is Slop:** This is the opposite failure mode—sterilizing an interface out of fear of slop until it becomes lifeless wireframe.
- **✅ The Sovereign Fix:** Anti-slop is a filter, not an executioner of style. Introduce authentic typographic personality, tailored micro-copy, tactile button states, and purposeful brand color accents.

---

## Dimension 2: Layout & Component Rhythm

### 2.1 The Monotonous AI Landing Page Formula
- **🔴 The Tell:** Hero with 2 CTAs -> Social Proof Logo Bar -> 3-Card Feature Grid -> "How It Works" 3 Steps -> Bento Grid -> Pricing Table -> Testimonials -> FAQ Accordion -> Final CTA -> 4-Column Footer. Exactly in that sequence, every single time.
- **Why it is Slop:** That sequence reflects AI training memory, not the strategic conversion narrative of the actual product.
- **✅ The Sovereign Fix:** Structure the layout around the real user journey. If there are no real testimonials, omit the section completely. Vary layout composition: alternate asymmetric visual splits, dense feature lists, interactive previews, and real interactive playgrounds.

### 2.2 Copy-Paste Feature Cards
- **🔴 The Tell:** 3 or 6 identical cards, each with an icon at the top, a 3-word title, a 2-line description, and identical padding.
- **Why it is Slop:** It flattens product value. Flagship capabilities and minor conveniences are given identical visual weight.
- **✅ The Sovereign Fix:** Reflect true hierarchy: give the flagship feature a dominant full-width spotlight with an interactive live widget, and condense minor features into a concise, scannable list or secondary cluster.

### 2.3 The Default Bento Grid Mosaic
- **🔴 The Tell:** A 12-column grid chopped into random 1x1, 2x1, and 2x2 cards with decorative graphs, fake toggles, and illustrations crammed together.
- **Why it is Slop:** Bento grids have become the default aesthetic crutch of 2024-2026 AI landing pages. When content doesn't naturally fit different sizes, forcing it into a bento grid produces hollow filler.
- **✅ The Sovereign Fix:** Use variable card sizes only when the underlying data legitimately demands varying dimensions. If features are uniform, a clean, readable grid or vertical timeline is far more honest and effective.

### 2.4 "How It Works" Always 3 Steps
- **🔴 The Tell:** Exactly three circles containing numbers `1`, `2`, `3` with generic verbs ("Sign Up", "Connect API", "Enjoy Success").
- **Why it is Slop:** Real business processes rarely fit a generic 3-step formula.
- **✅ The Sovereign Fix:** Model the workflow honestly. If onboarding takes 2 steps, show 2. If configuration requires 5 steps with branching logic, represent the flow accurately.

### 2.5 Fabricated "Trusted By" Logo Bar
- **🔴 The Tell:** A grayscale row of fake tech company logos (or real enterprise logos like Google, Stripe, Microsoft used without authorization) directly beneath the hero.
- **Why it is Slop:** It is counterfeit social proof.
- **✅ The Sovereign Fix:** Include a logo bar only if real, verifiable partner or customer logos exist. Otherwise, replace it with verifiable metrics, code snippets, or remove it entirely.

### 2.6 The Cliché Middle "Most Popular" Pricing Card
- **🔴 The Tell:** Always 3 pricing tiers (Free, Pro, Enterprise), with the middle "Pro" tier scaled up, surrounded by an indigo glow, and crowned with a "Most Popular" capsule badge.
- **Why it is Slop:** Pure mechanical repetition.
- **✅ The Sovereign Fix:** Align pricing tiers with the actual business monetization model. Only highlight a tier if there is a genuine strategic conversion objective, and document the rationale.

---

## Dimension 3: Decorative Elements & Typography

### 3.1 Generic "AI Sparkle" Icons
- **🔴 The Tell:** Sparkles (✨), stars, magic wands, lightning bolts (⚡), cubes, or rotating rings placed beside every feature name.
- **Why it is Slop:** These are the universal clichés of superficial "AI wrappers". They tell the user nothing about what the feature actually does.
- **✅ The Sovereign Fix:** Use domain-precise iconography (e.g., a database schema icon for schema migration, a cryptographic key for encryption). If no meaningful icon exists, use zero icons and let clear typography do the work.

### 3.2 Uniform Lucide / Feather Icon Clone Look
- **🔴 The Tell:** Every icon in the application has the exact same 1.5px stroke, rounded terminals, and 24x24 box from the default Lucide library with zero brand adaptation.
- **Why it is Slop:** It creates the unmistakable "generic Tailwind component library" aesthetic.
- **✅ The Sovereign Fix:** Choose an icon family that aligns with the typography and brand weight (e.g., sharp geometric icons for fintech, solid dual-tone for consumer apps, or custom SVG glyphs).

### 3.3 Decorative Emoji in Professional UI
- **🔴 The Tell:** Emojis peppered across headings, badges, and CTAs (e.g., *"🚀 Launch Your Superpowers"*, *"✅ 99.9% Uptime"*, *"🔥 Special Offer"*).
- **Why it is Slop:** Emoji in UI headers is the loudest giveaway of sloppy AI text generation. It competes with real icons and degrades professional tone.
- **✅ The Sovereign Fix:** Eradicate all decorative emojis from UI elements, headings, buttons, and navigation. Reserve emojis strictly for user-generated content or chat messaging.

### 3.4 Small Directional Arrows on Every Button
- **🔴 The Tell:** Appending `→` or `↗` to every single button label (*"Get Started →"*, *"Learn More →"*, *"Submit →"*).
- **Why it is Slop:** It turns a directional affordance into mindless noise.
- **✅ The Sovereign Fix:** Use arrows only for genuine external link navigation or forward multi-step pagination. Standard action buttons (*"Save Changes"*, *"Create Project"*) must never carry decorative trailing arrows.

### 3.5 Decorative AI Capsule Badges & Eyebrow Pills
- **🔴 The Tell:** A small rounded pill floating above the H1 containing *"✨ Powered by AI 2.0"* or category labels that duplicate the headline (*"SaaS Billing Platform"* above a headline that says *"The Ultimate SaaS Billing Platform"*).
- **Why it is Slop:** It wastes prime above-the-fold vertical space and duplicates copy.
- **✅ The Sovereign Fix:** Delete eyebrow badges that merely duplicate the headline. Only use eyebrow text if it provides non-redundant context (e.g., release version `v4.2.0` or category `Changelog`).

### 3.6 Decorative Pulsing Status Dots
- **🔴 The Tell:** A green or purple dot pulsing infinitely (`animate-ping`) next to a heading or static label where nothing is actually running or live.
- **Why it is Slop:** It steals attention and mimics hardware recording / live connection indicators dishonestly.
- **✅ The Sovereign Fix:** Status dots must reflect genuine runtime telemetry (e.g., WebSocket connected, live audio recording, cluster healthy). If static, the dot must be static and matte, or omitted entirely.

### 3.7 Fake Terminal Windows with Traffic Light Buttons
- **🔴 The Tell:** A dark box with red, yellow, and green dots in the top left, displaying fake curl commands or JSON snippets to look "developer-grade".
- **Why it is Slop:** A developer tool costume used as a substitute for real product UI.
- **✅ The Sovereign Fix:** If the product is a CLI tool, show real shell interactions. For web apps, show authentic product UI, data grids, or actual interactive code sandboxes.

---

## Dimension 4: App Screens & Dashboard Shells

### 4.1 The Default Dashboard Shell (Sidebar + 4 Cards + Chart + Table)
- **🔴 The Tell:** Collapsible left sidebar, top header with search & avatar, exactly 4 KPI stat cards across the top, a big line chart, and a table below it—regardless of whether the app manages invoices, patients, IoT devices, or social posts.
- **Why it is Slop:** It is a memorized template applied blindly without considering what the user actually needs to accomplish on that screen.
- **✅ The Sovereign Fix:** Identify the **Single Deciding Action** for the screen. If the screen is for reviewing urgent errors, the error triage queue must be front and center, not buried beneath four arbitrary KPI cards.

### 4.2 Invented Stat Numbers & Meaningless Deltas
- **🔴 The Tell:** KPI cards displaying invented figures like `12,842` users, `$48.2k` revenue, and an obligatory `+12.4% vs last week` badge in green.
- **Why it is Slop:** Fabricated numbers with fake delta trends that don't connect to any real time-series dataset.
- **✅ The Sovereign Fix:** Wire KPI cards to authentic backend metrics or explicit domain mock stores. If an app is in preview mode, render explicit labeled placeholders (`[User Count]`) rather than deceptive fake metrics.

### 4.3 Charts Without a Question
- **🔴 The Tell:** A wavy area chart with a gradient fill titled "Activity Overview" or "Analytics", where the axes have no meaningful units.
- **Why it is Slop:** A chart that does not answer a specific operational question is pure visual clutter.
- **✅ The Sovereign Fix:** Every chart must answer an explicit question. The title must state the question or metric clearly (e.g., *"Failed Payment Attempts (Last 24 Hours)"*). Use high-contrast color lines with clear axis labels.

### 4.4 Filler Data in Forms and Tables
- **🔴 The Tell:** Form fields prefilled with `John Doe`, `johndoe@example.com`, or fake table rows with rotating names like `Sarah Connor`, `Alex Smith`.
- **Why it is Slop:** It instantly reveals an unpolished AI generation.
- **✅ The Sovereign Fix:** Forms should have clean, accessible `placeholder` attributes (e.g., `e.g. alex@company.com`) without fake pre-filled values. Table rows must either reflect genuine seed data or realistic domain-authentic records.

### 4.5 Empty & Loading State Cop-Outs
- **🔴 The Tell:** A bare spinner with no explanation, or an empty state that says *"No data available"* with a sad illustration.
- **Why it is Slop:** Leaves the user stranded without guidance.
- **✅ The Sovereign Fix:** Every empty state must state **Why** it is empty and provide the **Single Primary Action** to populate it (e.g., *"No webhooks configured yet. Register your first endpoint to receive event updates."* with a direct CTA button).

---

## Dimension 5: Motion & Interaction Discipline

### 5.1 Endless Pulses, Floats, and Loops
- **🔴 The Tell:** Floating cards that bob up and down infinitely, badges with continuous pulsing gradients, or buttons with infinite shimmer effects.
- **Why it is Slop:** Perpetual motion induces cognitive fatigue and distracts the eye from core tasks.
- **✅ The Sovereign Fix:** Animations must trigger on **user interaction** (hover, focus, click) or **state transition** (entry, exit, success). Once an element enters, it must remain static. Zero infinite loops outside of active loading spinners.

### 5.2 Stacked Cliché Entrance Animations
- **🔴 The Tell:** Every card on the page simultaneously triggers `fade-in`, `slide-up`, `scale-up`, and `stagger` on scroll.
- **Why it is Slop:** The page feels like a PowerPoint transition deck rather than high-performance software.
- **✅ The Sovereign Fix:** Prioritize sub-millisecond perceived performance. Hero content must render instantly without blocking fade-ins. Scroll motion should be subtle, purposeful, and respect `prefers-reduced-motion: reduce`.

---

## Dimension 6: Sovereign UI Delivery Checklist

Run this 15-point checklist before marking any frontend or UI task as complete:

- [ ] **1. Brand Identity Anchor**: Is the color palette rooted in `DESIGN.md` or authentic brand tokens, with zero generic blue-purple or neon gradients?
- [ ] **2. Single Focal Accent**: Is the primary accent color applied only to key interactive moments, rather than painted across every button, badge, and border?
- [ ] **3. Zero Decorative Emoji**: Are all headlines, bullets, buttons, and navigation free from decorative emojis (🚀, ✨, 🔥, ✅)?
- [ ] **4. Layout Asymmetry & Rhythm**: Does the section layout vary dynamically rather than repeating the rigid centered-title-plus-3-card template?
- [ ] **5. No Default Bento or Fake Terminals**: Has the interface avoided default bento grid mosaics and fake traffic-light terminal windows unless specifically required?
- [ ] **6. Headline Cleanliness**: Is the space above the main H1 free from redundant category pills or badges repeating the headline?
- [ ] **7. Functional Navigation**: Does every navigation item, tab, and button have a working route or clear interaction (zero dead links)?
- [ ] **8. Motion Purpose**: Is all animation purposeful, non-looping, and strictly compliant with `prefers-reduced-motion`?
- [ ] **9. Glass & Glow Dose Caps**: Is frosted glass limited to at most 1-2 elements, with zero ambient glow on standard cards?
- [ ] **10. Status Dot Honesty**: Are all status dots reflecting real runtime state (active, live, recording) without decorative pulsing loops?
- [ ] **11. Purpose-Driven Dashboards**: Is the application shell structured around the user's primary decision rather than the cookie-cutter sidebar-stat-chart-table template?
- [ ] **12. Authentic Data & Metrics**: Are all KPI numbers, chart axes, and trend deltas connected to real logic or explicit domain placeholders?
- [ ] **13. Clean Input Placeholders**: Are form fields and table rows free from lazy `John Doe` / `Lorem Ipsum` filler?
- [ ] **14. Actionable Empty & Loading States**: Do empty states explain the cause and offer a direct CTA button?
- [ ] **15. Responsive & Accessible**: Does the layout pass WCAG 2.2 contrast (minimum 4.5:1 text, 3:1 UI components) and full keyboard navigation?

---

## Orchestration & Integration

This skill coordinates directly with the following specialized skills in the `vibes-plug` swarm:
- `anti-slop`: Master sovereign directive governing conversational, structural, and code cleanliness.
- `design-system-architect`: Provides OKLCH design tokens, Tailwind CSS v4 `@theme` variables, and component variants.
- `senior-frontend`: Implements React 19 / Next.js 15 App Router components adhering strictly to these visual standards.
- `tailwind-expert`: Configures clean, modern utility classes without bloated inline style overrides.
- `ui-ux-pro-max`: Provides BM25 design patterns, layout heuristics, and typography pairings.
- `modern-web-guidance`: Ensures bleeding-edge web platform standards (CSS Anchor Positioning, View Transitions, Popover API).
- `screenshot-to-code-expert`: Converts visual mockups into clean code without introducing AI slop defaults.
- `accessibility-testing-expert`: Audits contrast ratios, focus rings, and screen-reader accessibility.
- `zero-to-prod-orchestrator`: Enforces anti-slop UI compliance during Phase 5 (Frontend) and Phase 6 (Audit).
- `brainstorming`: Validates visual wireframes and design proposals before coding begins.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Amanat Eksekutif & Tujuan
**Doktrin Anti-Slop UI Berdaulat** adalah filter visual khusus dan mesin penegakan keahlian desain dalam ekosistem `vibes-plug`. Model AI modern memiliki bias statistik tinggi terhadap template bawaan yang klise: gradien biru-ungu neon, efek kaca (*glassmorphism*) berlebihan, elemen berbentuk kapsul (*pill*) yang seragam, kartu fitur salin-tempel (*copy-paste*), serta statistik dashboard palsu.

Doktrin ini memastikan bahwa setiap antarmuka digital yang dibuat atau dimodifikasi oleh agen AI terasa **otentik seperti dirancang oleh desainer produk senior**, berakar kuat pada identitas merek produk (`DESIGN.md`), bukan hasil tebakan statistik LLM yang malas.

Aktifkan skill ini setiap kali tugas mencakup pembuatan, perbaikan, atau audit visual untuk situs web, aplikasi web, antarmuka mobile, maupun dashboard.

---

## 6 Dimensi Pembasmian Slop UI

```
                             ┌──────────────────────────────────────────────┐
                             │       DOKTRIN ANTI-SLOP UI BERDAULAT         │
                             └──────────────────────┬───────────────────────┘
                                                    │
        ┌───────────────────┬───────────────────────┼───────────────────────┬───────────────────┐
        │                   │                       │                       │                   │
 ┌──────▼──────┐     ┌──────▼──────┐         ┌──────▼──────┐         ┌──────▼──────┐     ┌──────▼──────┐
 │  DIMENSI 1  │     │  DIMENSI 2  │         │  DIMENSI 3  │         │  DIMENSI 4  │     │  DIMENSI 5  │
 │Sanitasi Visual│   │Tata Letak & │         │   Elemen    │         │ Struktur &  │     │Dashboard &  │
 │   & Warna   │     │ Ritme UI    │         │  Dekoratif  │         │ Alur Navigasi│    │ Shell App   │
 └─────────────┘     └─────────────┘         └─────────────┘         └─────────────┘     └─────────────┘
                                                    │
                                             ┌──────▼──────┐
                                             │  DIMENSI 6  │
                                             │  Disiplin   │
                                             │   Animasi   │
                                             └─────────────┘
```

---

## Dimensi 1: Sanitasi Visual & Palet Warna

### 1.1 Gradien Biru-Ungu Klise & Glow Radial
- **🔴 Ciri Khas Slop:** Gradien biru-ke-ungu, biru-ke-sian, atau ungu-ke-merah muda yang dijadikan warna utama latar belakang dan tombol; bulatan cahaya radial neon buram (*blurred radial orbs*) di belakang headline.
- **Mengapa Ini Slop:** Ini adalah perlakuan warna paling berlebih dalam data pelatihan AI. Seketika menandakan *"tidak ada identitas merek"* dan mencap desain sebagai buatan AI murahan.
- **✅ Standar Berdaulat:** Ambil warna langsung dari `DESIGN.md` atau identitas merek asli. Pertahankan gradien hanya jika memiliki fungsi hierarki struktural dengan alasan arsitektur yang tertulis. Penggunaan gradien yang sama di setiap seksi dilarang keras.

### 1.2 Glassmorphism Berlebihan (Kaca Buram di Mana-Mana)
- **🔴 Ciri Khas Slop:** Efek `backdrop-blur` dan latar belakang semi-transparan diterapkan serentak pada navbar, kartu, modal, dropdown, dan sidebar.
- **Mengapa Ini Slop:** Saat semua permukaan berupa kaca buram, kontras dan hierarki hancur. Tidak ada elemen yang benar-benar berada di latar depan (*foreground*).
- **✅ Standar Berdaulat:** Anggap efek kaca sebagai aksen langka. **Batas Dosis Maksimal: 1 hingga 2 elemen per layar** (biasanya hanya sticky navbar atau command palette). Elemen lainnya wajib menggunakan permukaan solid dengan kontras tinggi.

### 1.3 Border Radius Berlebihan (Semua Menjadi Kapsul / Pill)
- **🔴 Ciri Khas Slop:** Semua elemen berbentuk kapsul (`rounded-full`): tombol, kolom input, kartu fitur, dialog, badge, dan modal.
- **Mengapa Ini Slop:** Bentuk kapsul yang seragam menghapus bahasa visual pembeda antara kolom input, kartu kontainer, dan tombol aksi.
- **✅ Standar Berdaulat:** Tetapkan skala radius teratur dalam desain sistem (misal: 6px, 10px, 16px). Bentuk kapsul hanya boleh digunakan untuk badge status kecil atau tombol ikon sirkular.

### 1.4 Bayangan Lembut yang Berlebihan (Efek Melayang Tanpa Dasar)
- **🔴 Ciri Khas Slop:** Bayangan raksasa yang sangat lembut pada setiap komponen sehingga seluruh halaman terasa melayang tanpa pijakan.
- **Mengapa Ini Slop:** Ketika semua komponen melayang tinggi, konsep elevasi kehilangan maknanya. Halaman kehilangan bidang dasar (*ground plane*).
- **✅ Standar Berdaulat:** Gunakan batas kontras tegas (*border*) sebagai default. Gunakan bayangan halus terarah (*shadow-sm* / *shadow-md*) secara hemat hanya untuk menandakan interaksi aktif atau layer modal.

### 1.5 Glow Ambient di Mana-Mana
- **🔴 Ciri Khas Slop:** Efek pendaran cahaya (*glow*) pada kartu, tombol, badge, garis batas, dan background secara serempak.
- **Mengapa Ini Slop:** Glow adalah penguat atensi. Jika diterapkan di semua tempat, tidak ada yang diperkuat. Ini adalah ciri khas desain buatan AI yang norak.
- **✅ Standar Berdaulat:** Batas dosis: maksimal 1 aksen fokus per layar, khusus untuk tombol konversi utama. Elemen lainnya wajib tampil *matte*.

### 1.6 Pola Kisi-Kisi Latar Belakang (Grid / Blueprint)
- **🔴 Ciri Khas Slop:** Kotak-kotak grid, garis cetak biru, atau titik-titik (*dot grid*) di belakang teks headline untuk memberi kesan "teknikal".
- **Mengapa Ini Slop:** Cara malas untuk membuat halaman terasa canggih tanpa usaha visual nyata, dan mengorbankan keterbacaan teks.
- **✅ Standar Berdaulat:** Gunakan tekstur grid hanya bila produk adalah alat CAD, IDE, atau visualisasi grafik teknis. Untuk aplikasi biasa, pertahankan ruang negatif yang bersih dan mudah dibaca.

### 1.7 Mode Gelap Default Tanpa Alasan Merek
- **🔴 Ciri Khas Slop:** Halaman dipaksa serba gelap hanya karena ingin terlihat "keren ala hacker", tanpa mempertimbangkan jenis produk.
- **Mengapa Ini Slop:** Mode gelap adalah keputusan strategis, bukan default malas. Aplikasi e-commerce, kesehatan, akuntansi, dan dokumen umumnya lebih efektif dalam mode terang (*light mode*).
- **✅ Standar Berdaulat:** Tentukan tema dari kebutuhan pengguna dan identitas produk. Jika fleksibel, sediakan tombol pengalih tema (*light/dark/system*) yang berfungsi penuh.

### 1.8 Palet Warna Terlalu Banyak (Pelangi Tanpa Aturan)
- **🔴 Ciri Khas Slop:** 5 hingga 7 warna berbeda pada satu halaman tanpa aturan desain sistem yang jelas.
- **Mengapa Ini Slop:** Palet yang berantakan merusak hierarki visual.
- **✅ Standar Berdaulat:** Batasi palet aktif: **2-3 warna utama + 1 warna aksen + basis warna netral monokrom** (menggunakan ruang warna OKLCH).

---

## Dimensi 2: Tata Letak & Ritme Komponen

### 2.1 Formula Monoton Landing Page AI
- **🔴 Ciri Khas Slop:** Hero + 2 CTA -> Logo Bar Perusahaan -> Grid 3 Fitur -> Cara Kerja 3 Langkah -> Bento Grid -> Tabel Harga -> Testimoni -> FAQ -> CTA Akhir -> Footer 4 Kolom. Selalu dalam urutan yang identik.
- **Mengapa Ini Slop:** Urutan tersebut berasal dari memori rata-rata data pelatihan AI, bukan narasi strategis konversi produk Anda.
- **✅ Standar Berdaulat:** Bangun struktur sesuai kebutuhan nyata produk. Jika tidak ada testimoni nyata, hilangkan seksi testimoni. Variasikan komposisi: selang-selingkan tata letak asimetris, daftar fitur interaktif, dan playground langsung.

### 2.2 Kartu Fitur Salin-Tempel (Copy-Paste Cards)
- **🔴 Ciri Khas Slop:** 3 atau 6 kartu berukuran identik, masing-masing dengan ikon di atas, judul 3 kata, deskripsi 2 baris, dan padding yang sama persis.
- **Mengapa Ini Slop:** Menyamaratakan nilai produk. Fitur unggulan utama terlihat sama bobotnya dengan fitur pendukung sepele.
- **✅ Standar Berdaulat:** Cerminkan hierarki sebenarnya: berikan fitur unggulan perlakuan visual penuh (*full-width showcase*) dengan widget interaktif, dan tampilkan fitur sekunder dalam bentuk daftar ringkas.

### 2.3 Bento Grid yang Dipaksakan
- **🔴 Ciri Khas Slop:** Mosaik kartu berukuran acak (1x1, 2x1, 2x2) yang dipaksakan untuk mengisi ruang seperti dashboard ubin.
- **Mengapa Ini Slop:** Bento grid adalah tren instan 2024-2026. Ketika konten tidak membutuhkan ukuran bervariasi, memaksakannya menghasilkan ruang kosong yang tidak bermakna.
- **✅ Standar Berdaulat:** Gunakan bento grid hanya bila data atau visual memiliki dimensi yang benar-benar berbeda. Jika informasinya seragam, tata letak grid sederhana atau daftar vertikal jauh lebih jujur dan mudah dipahami.

### 2.4 "Cara Kerja" Selalu 3 Langkah
- **🔴 Ciri Khas Slop:** Selalu tiga lingkaran angka `1`, `2`, `3` dengan ikon bulat dan teks pendek klise ("Daftar", "Hubungkan", "Nikmati").
- **Mengapa Ini Slop:** Alur kerja aplikasi nyata jarang pas dalam tepat 3 langkah.
- **✅ Standar Berdaulat:** Sajikan proses sesuai alur kerja nyata produk, baik itu 2 langkah cepat maupun 5 langkah bertahap.

### 2.5 Bar Logo "Dipercaya Oleh" Palsu
- **🔴 Ciri Khas Slop:** Baris logo perusahaan teknologi generik atau logo raksasa yang dipakai tanpa izin tepat di bawah hero.
- **Mengapa Ini Slop:** Klaim kredibilitas palsu tanpa bukti.
- **✅ Standar Berdaulat:** Hanya tampilkan logo mitra/pelanggan yang dapat diverifikasi secara nyata. Jika belum ada, ganti dengan metrik kode konkret atau hapus seksi tersebut.

### 2.6 Kartu Harga Tengah "Paling Populer" yang Klise
- **🔴 Ciri Khas Slop:** Selalu 3 kolom harga, di mana kartu tengah selalu dinaikkan ukurannya, diberi border menyala, dan diberi badge "Paling Populer".
- **Mengapa Ini Slop:** Pola otomatis yang tidak mencerminkan strategi bisnis nyata.
- **✅ Standar Berdaulat:** Sesuaikan jumlah tier dengan model monetisasi produk yang sesungguhnya. Berikan penekanan hanya bila ada tujuan konversi strategis yang jelas.

---

## Dimensi 3: Elemen Dekoratif & Tipografi

### 3.1 Ikon "AI Sparkle" Generik
- **🔴 Ciri Khas Slop:** Ikon kilau bintang (✨), tongkat sihir, petir (⚡), kubus, atau cincin berputar di samping setiap nama fitur.
- **Mengapa Ini Slop:** Simbol klise murahan dari produk AI generik. Tidak mengomunikasikan fungsi spesifik fitur tersebut.
- **✅ Standar Berdaulat:** Gunakan ikon yang relevan dengan domain (misal: ikon skema database, kunci enkripsi). Jika tidak ada ikon yang cocok, jangan gunakan ikon sama sekali—biarkan tipografi yang bekerja.

### 3.2 Gaya Ikon Seragam yang Monoton (Kloning Lucide)
- **🔴 Ciri Khas Slop:** Semua ikon memiliki goresan tipis 1.5px dan sudut membulat yang sama persis dari pustaka default tanpa sentuhan karakter merek.
- **Mengapa Ini Slop:** Membuat semua aplikasi AI terlihat kembar identik.
- **✅ Standar Berdaulat:** Pilih keluarga ikon yang selaras dengan bobot tipografi dan karakter merek produk Anda.

### 3.3 Emoji Dekoratif pada Teks UI
- **🔴 Ciri Khas Slop:** Emoji bertaburan di judul, daftar fitur, dan tombol (misal: *"🚀 Mulai Sekarang"*, *"✅ Uptime 99.9%"*, *"🔥 Penawaran Spesial"*).
- **Mengapa Ini Slop:** Tanda paling mencolok bahwa teks ditulis oleh AI secara malas. Merusak kesan profesional dan bersaing dengan ikon sistem.
- **✅ Standar Berdaulat:** Bersihkan seluruh emoji dekoratif dari teks antarmuka, judul, tombol, dan navigasi. Emoji hanya diizinkan untuk konten dinamis buatan pengguna.

### 3.4 Panah Kecil pada Setiap Tombol
- **🔴 Ciri Khas Slop:** Menambahkan panah `→` atau `↗` pada hampir setiap tombol (*"Mulai →"*, *"Daftar →"*, *"Kirim →"*).
- **Mengapa Ini Slop:** Mengubah penunjuk arah menjadi hiasan tanpa fungsi.
- **✅ Standar Berdaulat:** Gunakan panah hanya bila tombol benar-benar mengarahkan ke tautan eksternal atau langkah alur berikutnya. Tombol aksi standar (*"Simpan Perubahan"*, *"Buat Proyek"*) tidak boleh memiliki panah dekoratif.

### 3.5 Badge Kapsul AI & Eyebrow Redundan di Atas Judul
- **🔴 Ciri Khas Slop:** Kapsul kecil tepat di atas H1 bertuliskan *"✨ Didukung oleh AI"* atau label kategori yang mengulang persis apa yang dikatakan judul di bawahnya.
- **Mengapa Ini Slop:** Menambah baris bacaan tanpa menambah informasi baru dan menyita ruang penting di atas lipatan (*above the fold*).
- **✅ Standar Berdaulat:** Hapus badge eyebrow yang sekadar mengulang judul. Gunakan hanya bila memuat informasi non-redundan seperti nomor rilis `v4.2.0` atau label status fungsional.

### 3.6 Titik Status Berkedip Dekoratif
- **🔴 Ciri Khas Slop:** Titik hijau atau ungu yang berkedip tanpa henti (*pulse loop*) di samping judul atau menu navigasi tanpa menandakan status nyata.
- **Mengapa Ini Slop:** Mencuri perhatian pengguna dan memalsukan indikator sistem langsung (*live recording / status online*).
- **✅ Standar Berdaulat:** Titik status hanya boleh ada jika menandakan status sistem nyata (misal: koneksi WebSocket aktif, perekaman audio aktif). Jika statis, hilangkan animasinya atau hapus titik tersebut.

### 3.7 Jendela Terminal Tiruan (Fake Terminal Window)
- **🔴 Ciri Khas Slop:** Kotak gelap dengan tiga titik lampu lalu lintas (merah, kuning, hijau) berisi perintah curl atau JSON tiruan sebagai visual utama hero.
- **Mengapa Ini Slop:** Topeng generik yang digunakan sebagai pengganti screenshot produk nyata.
- **✅ Standar Berdaulat:** Tunjukkan antarmuka produk yang sesungguhnya. Jika produk adalah CLI, tampilkan rekaman terminal interaktif yang bekerja nyata.

---

## Dimensi 4: Shell Aplikasi & Dashboard

### 4.1 Shell Dashboard Template Bawaan
- **🔴 Ciri Khas Slop:** Sidebar kiri, topbar dengan kotak pencarian & avatar, tepat 4 kartu metrik di atas, satu grafik garis besar, dan tabel di bawahnya—terlepas dari apakah aplikasi mengelola faktur, rekam medis, server, atau inventaris.
- **Mengapa Ini Slop:** Layout hafalan dari memori pelatihan AI tanpa memikirkan apa keputusan utama pengguna pada layar tersebut.
- **✅ Standar Berdaulat:** Desain antarmuka berdasarkan **Satu Keputusan Utama Pengguna**. Jika layar berfungsi untuk menyelesaikan antrean error, daftar antrean harus menjadi fokus utama, bukan disembunyikan di bawah empat kartu statistik yang tidak relevan.

### 4.2 Angka Metrik Rekaan & Delta Tren Palsu
- **🔴 Ciri Khas Slop:** Kartu statistik berisi angka rekaan seperti `12.842` pengguna, `$48.2k` pendapatan, dan badge hijau wajib `+12.4% minggu ini` tanpa basis data nyata.
- **Mengapa Ini Slop:** Angka hiasan yang menipu pengguna dan memecah hierarki data.
- **✅ Standar Berdaulat:** Hubungkan kartu metrik ke data backend asli. Pada tahap prototipe, beri label placeholder yang jujur (`[Jumlah Pengguna]`) daripada angka palsu yang menyesatkan.

### 4.3 Grafik Tanpa Pertanyaan Jelas
- **🔴 Ciri Khas Slop:** Grafik area bergelombang dengan gradien berjudul "Ringkasan" atau "Analitik" di mana sumbu X dan Y tidak memiliki satuan yang dapat ditindaklanjuti.
- **Mengapa Ini Slop:** Grafik adalah sebuah jawaban. Tanpa pertanyaan spesifik, grafik tersebut hanyalah wallpaper visual yang membuang atensi.
- **✅ Standar Berdaulat:** Setiap grafik wajib menjawab pertanyaan operasional yang jelas, dituliskan pada judul grafik (misal: *"Kegagalan Pembayaran per Jam (24 Jam Terakhir)"*).

### 4.4 Data Tiruan Klise pada Formulir dan Tabel
- **🔴 Ciri Khas Slop:** Kolom formulir diisi dengan `John Doe`, `johndoe@example.com`, atau data tabel berulang seperti `Alex Smith`.
- **Mengapa Ini Slop:** Menunjukkan bahwa aplikasi adalah mockup cepat, bukan produk yang dibangun dengan serius.
- **✅ Standar Berdaulat:** Gunakan atribut `placeholder` yang jelas (misal: `contoh: budi@perusahaan.com`) tanpa mengisi nilai data palsu secara default.

### 4.5 State Kosong (*Empty State*) & Loading yang Malas
- **🔴 Ciri Khas Slop:** Spinner kosong tanpa teks penjelasan, atau state kosong bertuliskan *"Tidak ada data"* dengan ilustrasi sedih tanpa aksi lanjutan.
- **Mengapa Ini Slop:** Meninggalkan pengguna tanpa petunjuk langkah selanjutnya.
- **✅ Standar Berdaulat:** State kosong wajib menjelaskan **Mengapa** data kosong dan menyediakan **Satu Tombol Aksi Utama** untuk mengisinya (misal: *"Belum ada webhook terdaftar. Tambahkan endpoint pertama Anda untuk menerima event."* disertai tombol CTA).

---

## Dimensi 5: Disiplin Animasi & Interaksi

### 5.1 Animasi Loop, Mengambang, dan Berdenyut Tanpa Henti
- **🔴 Ciri Khas Slop:** Kartu yang terus mengambang naik-turun, badge dengan gradien berdenyut terus-menerus, atau tombol yang berkilau tanpa interaksi pengguna.
- **Mengapa Ini Slop:** Gerakan abadi menimbulkan kelelahan visual dan mendistraksi fokus pengguna dari tugas utama.
- **✅ Standar Berdaulat:** Animasi harus dipicu oleh **interaksi pengguna** (hover, focus, klik) atau **transisi state** (masuk, keluar, sukses). Setelah elemen muncul, elemen harus diam. Dilarang menggunakan loop animasi tanpa henti di luar spinner loading aktif.

### 5.2 Tumpukan Animasi Masuk yang Berlebihan
- **🔴 Ciri Khas Slop:** Setiap kartu memicu animasi fade-in, geser atas, perbesaran skala, dan efek beruntun secara serentak saat digulir.
- **Mengapa Ini Slop:** Halaman terasa lambat dan seperti slide presentasi alih-alih perangkat lunak berperforma tinggi.
- **✅ Standar Berdaulat:** Utamakan performa perseptual instan. Konten hero harus muncul tanpa penundaan animasi. Gerakan scroll harus halus dan wajib mematuhi aturan aksesibilitas `prefers-reduced-motion: reduce`.

---

## Dimensi 6: Checklist Mandiri Kesiapan UI Berdaulat

Jalankan 15 daftar periksa ini sebelum menyelesaikan tugas antarmuka pengguna:

- [ ] **1. Jangkar Identitas Merek**: Apakah warna diambil dari `DESIGN.md` atau token merek asli, bebas dari gradien biru-ungu atau neon bawaan?
- [ ] **2. Aksen Tunggal Terarah**: Apakah warna aksen hanya digunakan pada momen interaktif utama, bukan tersebar di setiap tombol dan border?
- [ ] **3. Bebas Emoji Dekoratif**: Apakah seluruh judul, bullet poin, tombol, dan navigasi bersih dari emoji dekoratif (🚀, ✨, 🔥, ✅)?
- [ ] **4. Asimetri & Ritme Tata Letak**: Apakah tata letak seksi bervariasi secara dinamis alih-alih mengulang template kartu 3 kolom yang kaku?
- [ ] **5. Tanpa Bento Bawaan atau Terminal Palsu**: Apakah layout bebas dari bento grid klise dan jendela terminal tiruan dengan tombol lampu lalu lintas?
- [ ] **6. Kebersihan Area Judul**: Apakah area di atas H1 bersih dari badge kategori yang hanya mengulang isi judul utama?
- [ ] **7. Navigasi Berfungsi Nyata**: Apakah setiap menu navigasi, tab, dan tombol memiliki rute atau interaksi yang berfungsi (tanpa link mati)?
- [ ] **8. Tujuan Gerakan Jelas**: Apakah seluruh animasi memiliki tujuan fungsional, tidak berjalan loop selamanya, dan mematuhi `prefers-reduced-motion`?
- [ ] **9. Batas Dosis Kaca & Glow**: Apakah efek frosted glass dibatasi maksimal 1-2 elemen, tanpa glow pendaran pada kartu standar?
- [ ] **10. Kejujuran Titik Status**: Apakah seluruh titik status mencerminkan status sistem riil tanpa animasi denyut dekoratif?
- [ ] **11. Shell Dashboard Berorientasi Keputusan**: Apakah struktur aplikasi berpusat pada keputusan utama pengguna alih-alih template sidebar-kartu-grafik-tabel bawaan?
- [ ] **12. Metrik & Data Otentik**: Apakah angka metrik dan grafik terhubung ke logika nyata atau placeholder berlabel eksplisit?
- [ ] **13. Placeholder Formulir Bersih**: Apakah kolom formulir dan tabel bebas dari data fiktif malas seperti `John Doe` / `Lorem Ipsum`?
- [ ] **14. State Kosong & Loading Dapat Ditindaklanjuti**: Apakah state kosong menjelaskan penyebab dan menyediakan tombol aksi langsung?
- [ ] **15. Responsif & Aksesibel**: Apakah antarmuka lolos kontras WCAG 2.2 (minimal 4.5:1 untuk teks, 3:1 untuk komponen UI) serta navigasi keyboard penuh?

---

## Integrasi Orkestrasi

Skill ini berkoordinasi langsung dengan skill spesialis berikut dalam swarm `vibes-plug`:
- `anti-slop`: Doktrin master yang mengatur kebersihan percakapan, struktur, dan kode.
- `design-system-architect`: Menyediakan token desain OKLCH, variabel Tailwind CSS v4 `@theme`, dan varian komponen.
- `senior-frontend`: Mengimplementasikan komponen React 19 / Next.js 15 App Router yang mematuhi standar visual ini secara ketat.
- `tailwind-expert`: Mengonfigurasi kelas utilitas yang bersih dan modern tanpa penumpukan class inline berlebih.
- `ui-ux-pro-max`: Menyediakan pola desain BM25, heuristik tata letak, dan pasangan tipografi.
- `modern-web-guidance`: Memastikan standar platform web modern (CSS Anchor Positioning, View Transitions, Popover API).
- `screenshot-to-code-expert`: Mengonversi mockup visual menjadi kode bersih tanpa menyisipkan default AI slop.
- `accessibility-testing-expert`: Mengaudit rasio kontras, focus ring, dan aksesibilitas screen reader.
- `zero-to-prod-orchestrator`: Menegakkan kepatuhan Anti-Slop UI selama Fase 5 (Frontend) dan Fase 6 (Audit).
- `brainstorming`: Memvalidasi wireframe visual dan proposal desain sebelum pengkodean dimulai.
