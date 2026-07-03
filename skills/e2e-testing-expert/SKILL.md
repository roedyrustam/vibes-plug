---
name: e2e-testing-expert
description: "Expert guide for End-to-End (E2E) testing with Playwright, unit/integration testing with Vitest, and CI/CD automated testing pipeline setup / Panduan ahli pengujian End-to-End (E2E) dengan Playwright, pengujian unit/integrasi dengan Vitest, dan otomatisasi CI/CD."
author: "Roedy Rustam"
---

# E2E Testing & Test Automation Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill provides comprehensive, professional guidelines for implementing End-to-End (E2E) testing with Playwright, unit and integration testing with Vitest, and setting up automated CI/CD pipelines (e.g., GitHub Actions) to run tests on every commit/PR.

### Trigger Conditions
Active when the user requests help with:
- Setting up Playwright or Vitest in a JavaScript/TypeScript project.
- Writing E2E test specs (e.g., user authentication, Stripe checkout, interactive dashboard flows).
- Writing unit or integration tests for components, hooks, or backend utilities.
- Configuring a GitHub Actions workflow to run test suites.
- Debugging flaky E2E tests, handling timeouts, or configuring testing environments.

### Core Testing Standards

#### 1. Playwright Best Practices
- **Locators**: Use resilient user-facing locators (`getByRole`, `getByLabelText`, `getByPlaceholder`) instead of implementation details like CSS selectors (`.btn-primary`) or XPath.
- **State Isolation**: Run tests in isolated browser contexts. Reuse login state via `storageState` to avoid repeating the authentication flow in every test.
- **Trace Viewer**: Enable Playwright trace recording in CI (`trace: 'on-first-retry'`) to record screenshots, network requests, and DOM snapshots for easier debugging.
- **Network Mocking**: Mock third-party APIs (like Stripe, Clerk, or external SaaS webhooks) using `page.route` to prevent tests from failing due to external network flakiness.

#### 2. Vitest Best Practices
- **Isolation**: Keep tests completely pure and isolated. Reset mock states (`vi.clearAllMocks()`) before or after each test run.
- **Component Tests**: Use `@testing-library/react` and Vitest to test component behavior (what the user sees and interacts with) rather than internal implementation states.
- **Speed**: Organize tests so they can run concurrently where possible (`test.concurrent`).

#### 3. Automated CI/CD Setup
Set up a clean GitHub Actions workflow that:
- Installs project dependencies (utilizing caching).
- Installs Playwright system browsers.
- Runs the test suite (linting, Vitest, Playwright).
- Uploads Playwright HTML report and traces on test failure.

---

### Code Examples

#### Playwright Login & Checkout Spec (`tests/auth-checkout.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';

test.describe('SaaS Checkout Flow', () => {
  // Reuse authentication state
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('should navigate to billing and start stripe checkout', async ({ page }) => {
    await page.goto('/settings/billing');

    // Resilient locators
    const upgradeButton = page.getByRole('button', { name: 'Upgrade to Pro' });
    await expect(upgradeButton).toBeVisible();
    await upgradeButton.click();

    // Verify redirect to Stripe checkout page
    await page.waitForURL(/.*checkout.stripe.com.*/);
    await expect(page.getByText('Vibes Plug Pro')).toBeVisible();
  });
});
```

#### GitHub Actions Workflow (`.github/workflows/test.yml`)
```yaml
name: CI Test Suite

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Linting
        run: npm run lint

      - name: Run Unit/Integration Tests
        run: npx vitest run

      - name: Run E2E Tests
        run: npx playwright test
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.TEST_NEXTAUTH_SECRET }}

      - name: Upload Playwright Report
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini menyediakan panduan profesional yang komprehensif untuk menerapkan pengujian End-to-End (E2E) menggunakan Playwright, pengujian unit & integrasi menggunakan Vitest, serta konfigurasi pipeline CI/CD (seperti GitHub Actions) secara otomatis.

### Kondisi Pemicu
Aktif ketika pengguna meminta bantuan terkait:
- Setup Playwright atau Vitest di proyek JavaScript/TypeScript.
- Penulisan tes E2E (misalnya: alur login pengguna, checkout Stripe, dashboard interaktif).
- Penulisan unit test atau integration test untuk komponen UI, hooks, atau utilitas backend.
- Konfigurasi workflow GitHub Actions untuk menjalankan pengujian otomatis.
- Debugging tes E2E yang lambat/flaky, handling timeout, atau konfigurasi environment testing.

### Standar Pengujian Utama

#### 1. Praktik Terbaik Playwright
- **Locators**: Gunakan locator yang tangguh berbasis elemen yang dilihat pengguna (`getByRole`, `getByLabelText`, `getByPlaceholder`) daripada CSS selector (`.btn-primary`) atau XPath.
- **Isolasi State**: Jalankan tes dalam browser context yang terisolasi. Gunakan fitur `storageState` untuk menyimpan session cookie agar alur login tidak perlu diulang pada setiap tes.
- **Trace Viewer**: Aktifkan perekaman trace Playwright di CI (`trace: 'on-first-retry'`) untuk merekam screenshot, network request, dan DOM snapshot untuk mempermudah debugging.
- **Mocking Network**: Gunakan `page.route` untuk memalsukan respon dari API pihak ketiga (seperti Stripe, Clerk, atau Webhook) agar pengujian tidak gagal akibat gangguan jaringan eksternal.

#### 2. Praktik Terbaik Vitest
- **Isolasi**: Jaga agar pengujian benar-benar bersih dan terisolasi. Reset mock state (`vi.clearAllMocks()`) sebelum atau sesudah setiap pengujian dijalankan.
- **Pengujian Komponen**: Gunakan `@testing-library/react` dan Vitest untuk menguji perilaku komponen UI (apa yang dilihat dan diinteraksikan pengguna) daripada struktur internal state-nya.
- **Kecepatan**: Atur pengujian agar dapat berjalan secara bersamaan jika memungkinkan (`test.concurrent`).

#### 3. Konfigurasi CI/CD Otomatis
Buat workflow GitHub Actions bersih yang akan:
- Menginstal dependensi proyek (menggunakan caching untuk mempercepat proses).
- Mengunduh browser sistem yang dibutuhkan Playwright.
- Menjalankan seluruh pengujian (linter, Vitest, Playwright).
- Mengunggah laporan HTML Playwright dan trace rekaman jika terjadi kegagalan tes.
