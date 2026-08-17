---
name: browser-automation-expert
description: "Expert guide for autonomous web agents (Browser-Use, Stagehand), hardcore anti-bot evasion (Playwright Stealth, WebGL masking), and Vision LLM visual QA / Panduan ahli agen web otonom, penghindaran deteksi bot, dan QA visual berbasis Vision LLM."
author: vibes-plug-swarm
---

# Autonomous Web Agent & Automation Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Deploy ultra-powerful autonomous web agents that can perceive, navigate, and execute complex workflows without human intervention. Use modern frameworks (Browser-Use, Stagehand) combined with hardcore anti-detection evasion techniques and Vision LLMs for visual QA.

### Core Capabilities

1. **Autonomous Execution Frameworks**
   - Integrate **Browser-Use** and **Stagehand** to allow LLMs to visually interpret DOM trees, inject semantic labels, and autonomously decide click/type actions.
   - Map complex multi-step workflows to semantic goals rather than brittle CSS selectors.

2. **Hardcore Evasion & Anti-Bot Bypassing**
   - **Playwright Stealth**: Implement `puppeteer-extra-plugin-stealth` adapted for Playwright to spoof `navigator.webdriver`.
   - **Fingerprint Masking**: Spoof Canvas, WebGL, AudioContext, and WebRTC fingerprints.
   - **Human Behavior Mimicry**: Inject randomized delays, Bezier-curve mouse movements, and organic scroll patterns. Rotate residential proxies to bypass Cloudflare/Datadome.

3. **Visual QA & Diffing via Vision LLMs**
   - Capture viewport screenshots and pipe them into **GPT-4o**, **Claude 3.5 Sonnet**, or **Gemini 1.5 Pro**.
   - Prompt the Vision LLM to perform layout regression checks, identify visual anomalies, or validate complex states (e.g., "Is the modal fully obscuring the background?").

### Execution Protocol
- **Action**: Initialize Stagehand or Browser-Use agent.
- **Action**: Inject stealth scripts before page load.
- **Action**: Pass screenshots to Vision LLM at key checkpoints for semantic validation.

## Orchestration & Integration
- Integrates with: `web-scraper`, `autonomous-chaos-monkey`, `visual-qa-vision-agent`, `e2e-testing-expert`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Tujuan & Gambaran Umum
Terapkan agen web otonom super kuat yang dapat melihat, menavigasi, dan mengeksekusi alur kerja kompleks tanpa campur tangan manusia. Gunakan framework modern (Browser-Use, Stagehand) dipadukan dengan teknik penghindaran deteksi bot tingkat tinggi dan Vision LLM untuk QA visual.

### Kemampuan Utama

1. **Framework Eksekusi Otonom**
   - Integrasikan **Browser-Use** dan **Stagehand** agar LLM dapat menginterpretasi DOM tree secara visual, menyuntikkan label semantik, dan menentukan aksi klik/ketik secara otonom.
   - Petakan alur kerja multi-langkah ke tujuan semantik, bukan selektor CSS yang rapuh.

2. **Penghindaran Deteksi & Anti-Bot Tingkat Tinggi**
   - **Playwright Stealth**: Implementasikan plugin stealth untuk memalsukan `navigator.webdriver`.
   - **Masking Fingerprint**: Palsukan sidik jari Canvas, WebGL, AudioContext, dan WebRTC.
   - **Mimikri Perilaku Manusia**: Suntikkan jeda acak, gerakan mouse kurva Bezier, dan pola scroll organik. Rotasi proxy residential untuk menembus Cloudflare/Datadome.

3. **QA Visual & Diffing via Vision LLM**
   - Tangkap screenshot viewport dan teruskan ke **GPT-4o**, **Claude 3.5 Sonnet**, atau **Gemini 1.5 Pro**.
   - Minta Vision LLM untuk melakukan pemeriksaan regresi layout, mengidentifikasi anomali visual, atau memvalidasi status kompleks (mis. "Apakah modal menutupi background sepenuhnya?").

### Protokol Eksekusi
- **Tindakan**: Inisialisasi agen Stagehand atau Browser-Use.
- **Tindakan**: Suntikkan skrip stealth sebelum pemuatan halaman.
- **Tindakan**: Teruskan screenshot ke Vision LLM di titik pemeriksaan penting untuk validasi semantik.

## Integrasi Orkestrasi
- Terintegrasi dengan: `web-scraper`, `autonomous-chaos-monkey`, `visual-qa-vision-agent`, `e2e-testing-expert`.
