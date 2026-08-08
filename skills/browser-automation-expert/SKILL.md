---
name: browser-automation-expert
description: "Expert guide for autonomous browser automation, Playwright/Browser-Use web agent execution, visual E2E testing, and UI regression workflows / Panduan ahli otomatisasi browser otonom, Playwright/Browser-Use agent, dan pengujian visual E2E."
author: "Roedy Rustam"
---

# Browser Automation & Web Agent Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Production-grade guidelines for integrating autonomous browser automation, Playwright v1.48+, Browser-Use LLM web agents, visual regression testing, and automated end-to-end user flow execution.

### Key Capabilities
- **Playwright Automation**: Headless & headful browser control, multi-tab context isolation, locator strategies, auto-waiting, and network interception.
- **LLM Web Agents**: Browser-Use & Playwright MCP integration for AI-driven web tasks, dynamic element interaction, and autonomous page navigation.
- **Visual E2E & Regression**: Screenshot diffing, pixel-match assertions, video recording, and CI/CD artifact attachment.

```typescript
import { test, expect } from '@playwright/test';

test('Autonomous User Signup & Checkout Flow', async ({ page }) => {
  await page.goto('https://app.example.com/signup');
  await page.getByPlaceholder('Enter your email').fill('agent@example.com');
  await page.getByRole('button', { name: 'Get Started' }).click();
  await expect(page.getByText('Welcome to Dashboard')).toBeVisible();
});
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk otomatisasi browser otonom, Playwright v1.48+, agen web LLM Browser-Use, pengujian visual regression, dan eksekusi alur pengguna E2E otomatis.

### Fitur Utama
- **Otomatisasi Playwright**: Kontrol browser headless/headful, isolasi konteks multi-tab, auto-waiting, dan intersepsi jaringan.
- **Agen Web LLM**: Integrasi Browser-Use & Playwright MCP untuk tugas web berbasis AI dan navigasi dinamis.
- **Visual E2E & Regresi**: Perbandingan screenshot, rekaman video, dan pengunggahan artefak di CI/CD.
