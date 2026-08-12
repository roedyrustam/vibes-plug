---
name: visual-qa-vision-agent
description: "Equips the AI agent with visual QA capabilities using Playwright/Puppeteer and the agent's innate Vision capabilities to self-correct UI layout, CSS alignment, and visual regressions."
author: "Roedy Rustam"
---

# Visual QA & Vision Agent

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill transforms the agent from a blind code generator into a visual designer. Instead of hoping the CSS looks correct, the agent is instructed to write a script that takes a screenshot of the newly created component, analyzes the screenshot using its own Vision AI capabilities, and iteratively tweaks the CSS until it matches the design intent perfectly.

### Trigger Conditions
Activate this skill when the user says:
- "Fix the CSS, the button is misaligned."
- "Make it look exactly like this mockup."
- "Ensure the UI is responsive on mobile screens."

### Core Concepts

#### 1. The Visual QA Loop
1. **Code:** The agent writes the HTML/CSS/React component.
2. **Serve:** The agent starts a local dev server in the background.
3. **Capture:** The agent runs a quick Playwright/Puppeteer script to take screenshots at various viewports (Mobile, Tablet, Desktop).
4. **Analyze:** The agent receives the screenshot (via the `view_file` tool on the image) and analyzes the visual hierarchy, contrast, and alignment.
5. **Correct:** The agent fixes margin, padding, or flexbox issues based on what it *saw*, not just what the code says.

#### 2. Agent Constraints
- Do not blindly guess CSS layouts when complex (e.g., overlapping elements). Take a screenshot to verify.
- Always check contrast ratios visually if design tokens are overridden.

---

### Integration with Other Skills (MANDATORY)
- `browser-automation-expert` — Provides the Playwright code needed to capture the screenshots.
- `tailwind-expert` — Provides the CSS utility classes used to fix the alignment issues discovered by Vision.
- `ui-components-expert` — Defines the correct visual standards (spacing, sizing) the agent should look for.

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "UI/UX & Design Systems".
- `zero-to-prod-orchestrator` — Phase 5 (Frontend / UI Validation).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini memanfaatkan kemampuan *Vision* (penglihatan) bawaan AI untuk melakukan *Quality Assurance* (QA) visual. Agen tidak lagi sekadar menebak CSS secara buta, melainkan mengambil *screenshot* dari halaman yang dibuatnya, melihat hasilnya, dan mengkoreksi *margin/padding* secara mandiri.

### Kondisi Pemicu
- Saat pengguna meminta untuk merapikan UI yang berantakan.
- Saat melakukan *cloning* desain dari gambar *mockup*.

### Panduan Singkat
- **Gunakan Mata Anda:** Anda adalah model *multimodal*. Jika ragu apakah desain sudah rata tengah (*center*), jalankan Playwright, ambil *screenshot*, dan gunakan tool `view_file` untuk melihat *screenshot* tersebut.
- **Siklus Visual:** Tulis Kode ➔ Ambil Screenshot ➔ Analisis dengan *Vision* ➔ Perbaiki Tailwind/CSS ➔ Selesai.
- **Jangan Menebak:** Terkadang `justify-center` tidak berfungsi karena ada pembungkus (*wrapper*) absolut. Jangan menebak-nebak di dalam kode; lihat hasil akhirnya secara visual!
