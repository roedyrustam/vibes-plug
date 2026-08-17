---
name: accessibility-testing-expert
description: "Expert guide for automated and manual Web Accessibility (a11y) testing — axe-core, Pa11y, Playwright a11y, screen reader testing, and WCAG 2.2 Level AA/AAA compliance / Panduan ahli pengujian aksesibilitas web."
author: "vibes-plug-swarm"
---

# Accessibility Testing Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`global-a11y-i18n-expert`**: Core WCAG rules, ARIA patterns, and internationalization standards.
- **`e2e-testing-expert`**: Integrating automated accessibility assertions into Playwright/Vitest CI suites.
- **`ui-components-expert`**: Accessible component primitives (Radix UI, Base UI, ARIA patterns).
- **`visual-qa-vision-agent`**: Visual audits for focus rings, contrast ratios, and layout flow.

### Description
Production guide for automated, semi-automated, and manual web accessibility (a11y) testing. Covers WCAG 2.2 Level AA/AAA compliance validation using `@axe-core/playwright`, Pa11y, Google Lighthouse CI, screen reader verification (NVDA, VoiceOver), keyboard navigation audits, focus management, and color contrast compliance.

### Trigger Conditions
- Running automated accessibility test suites in CI/CD pipelines.
- Auditing web apps for WCAG 2.1 / 2.2 Level AA compliance and legal accessibility requirements (ADA, EAA).
- Debugging keyboard traps, missing ARIA labels, or broken screen reader navigation.
- Writing test cases for focus trapping in modals and custom dialogs.

---

### Core Testing Workflows

#### 1. Automated A11y Testing with Playwright & Axe-Core
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Automated Audits', () => {
  test('homepage should have zero critical or serious a11y violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .disableRules(['color-contrast']) // If tested separately
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('modal dialog should trap focus and pass a11y audit', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button#open-modal');

    // Verify modal is open and focused
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const modalAudit = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();

    expect(modalAudit.violations).toEqual([]);

    // Verify keyboard escape closes modal
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
  });
});
```

#### 2. Automated Pa11y CI Configuration (`.pa11yci.json`)
```json
{
  "defaults": {
    "standard": "WCAG2AA",
    "timeout": 15000,
    "runners": ["axe", "htmlcs"],
    "ignore": [
      "WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Abs"
    ]
  },
  "urls": [
    "http://localhost:3000/",
    "http://localhost:3000/login",
    "http://localhost:3000/pricing",
    "http://localhost:3000/docs"
  ]
}
```

#### 3. Keyboard & Screen Reader Verification Checklist
- **Tab Navigation**: All interactive elements (`<button>`, `<a>`, `<input>`) can receive focus in logical reading order.
- **Focus Indicators**: Visible, high-contrast focus rings (`outline: 2px solid var(--focus-color)` with `outline-offset`).
- **No Keyboard Traps**: Focus can enter and leave components using only `Tab`, `Shift+Tab`, and `Esc`.
- **Landmarks**: Proper semantic tags (`<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`).
- **ARIA Attributes**: `aria-expanded`, `aria-controls`, `aria-haspopup`, and `aria-live` updated dynamically.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **`global-a11y-i18n-expert`**: Pedoman standar WCAG, pola ARIA, dan aksesibilitas internasional.
- **`e2e-testing-expert`**: Integrasi pengujian aksesibilitas otomatis ke pipeline Playwright CI.
- **`ui-components-expert`**: Validasi aksesibilitas komponen headless dan desain UI.

### Deskripsi
Panduan produksi untuk pengujian aksesibilitas web (a11y) otomatis dan manual. Memastikan kepatuhan terhadap standar WCAG 2.2 Level AA/AAA menggunakan `@axe-core/playwright`, Pa11y, Lighthouse CI, pengujian screen reader, navigasi keyboard, dan kontras warna.

### Kondisi Pemicu
- Menjalankan audit aksesibilitas otomatis di pipeline CI/CD.
- Memverifikasi kepatuhan hukum aksesibilitas (WCAG 2.2, ADA, EAA).
- Menguji alur keyboard dan pembaca layar (screen reader) pada komponen kompleks seperti modal dan dropdown.
