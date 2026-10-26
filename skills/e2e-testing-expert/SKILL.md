---
name: e2e-testing-expert
description: "End-to-end testing with Playwright 1.50+, fixtures, and Vitest 3+ / Pengujian E2E dengan Playwright 1.50+, fixtures, dan Vitest 3+."
author: "Roedy Rustam"
version: "4.4.2"

---

# E2E Testing Expert (Playwright 1.50+ & Vitest 3 Standard)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **TDD & Autonomous Debugging**: `autonomous-tdd-debugger`, `property-mutation-testing-expert`
- **Quality Gates & Anti-Slop**: `anti-slop`, `ai-code-review-autonomous`, `zero-tech-debt-auditor`
- **Accessibility & Browser Automation**: `accessibility-testing-expert`, `browser-automation-expert`
- **CI/CD & DevOps Automation**: `ci-cd-devops-architect`, `github-actions-expert`
- **Lifecycle & Governance**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production-grade guide for automated browser and component testing using **Playwright 1.50+** and **Vitest 3+**. Covers virtual clock manipulation with `page.clock`, semantic accessibility assertions with `toMatchAriaSnapshot`, type-safe composable fixtures, dynamic UI banner interception (`page.addLocatorHandler`), session state reuse (`storageState`), and CI matrix sharding.

### Trigger Conditions
- Writing End-to-End (E2E) browser test suites for Next.js 15, React 19, or Svelte 5 applications.
- Testing time-sensitive UI (countdown timers, session expiries, debounced search) deterministically.
- Verifying WCAG accessibility tree structure using semantic `aria-snapshot`.
- Creating composable test fixtures with authenticated contexts and isolated database state.
- Setting up parallel CI test execution with artifact uploads on test failure.

---

### Playwright 1.50+ Core Architectural Patterns

#### 1. Deterministic Time Testing with the Clock API (`page.clock`)
Eliminate flaky `page.waitForTimeout` by freezing, fast-forwarding, or setting system time:
```typescript
// tests/e2e/timer.spec.ts
import { test, expect } from '@playwright/test';

test('advances countdown timer deterministically', async ({ page }) => {
  // 1. Install virtual clock fixed at specific timestamp
  await page.clock.install({ time: new Date('2026-03-01T12:00:00Z') });
  await page.goto('/promotions/flash-sale');

  // Verify initial state
  const countdown = page.getByRole('timer');
  await expect(countdown).toHaveText('24:00:00');

  // 2. Fast forward 6 hours in 1 millisecond without waiting!
  await page.clock.fastForward('06:00:00');
  await expect(countdown).toHaveText('18:00:00');

  // 3. Fast forward past expiration
  await page.clock.fastForward('18:00:01');
  await expect(page.getByRole('alert')).toHaveText('This promotion has ended.');
});
```

#### 2. Semantic Accessibility Assertions (`toMatchAriaSnapshot`)
Assert the rendered accessible role tree rather than fragile DOM classes:
```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test('navigation bar renders semantic accessible structure', async ({ page }) => {
  await page.goto('/');

  const header = page.locator('header');
  await expect(header).toMatchAriaSnapshot(`
    - banner:
      - link "Brand Logo":
        - /url: //
      - navigation:
        - link "Products"
        - link "Docs"
        - link "Pricing"
      - button "Sign in"
  `);
});
```

#### 3. Automatic Banner & Dialog Interception (`page.addLocatorHandler`)
Dismiss cookie banners or dynamic popups automatically whenever they appear:
```typescript
// tests/e2e/fixtures.ts
import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Automatically dismiss cookie consent modals whenever they overlay the page
    const consentButton = page.getByRole('button', { name: 'Accept all cookies' });
    await page.addLocatorHandler(consentButton, async () => {
      await consentButton.click();
    });

    await use(page);
  },
});
```

#### 4. Reusable Authentication State (`storageState`)
Authenticate once in a setup project and inject session cookies into all test suites:
```typescript
// tests/e2e/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/admin.json';

setup('authenticate admin user', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@enterprise.test');
  await page.getByLabel('Password').fill('VaultP@ssw0rd2026!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

  // Persist storage state (cookies, localStorage, session tokens)
  await page.context().storageState({ path: authFile });
});
```

```typescript
// tests/e2e/billing.spec.ts
import { test, expect } from '@playwright/test';

// Reuse authenticated state automatically
test.use({ storageState: 'playwright/.auth/admin.json' });

test('admin can view billing invoices', async ({ page }) => {
  await page.goto('/billing/invoices');
  await expect(page.getByRole('heading', { name: 'Invoices' })).toBeVisible();
});
```

#### 5. CI Test Sharding in GitHub Actions
Split Playwright test executions across parallel workers in CI:
```yaml
# .github/workflows/e2e.yml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - name: Run Playwright Tests (Shard ${{ matrix.shardIndex }}/${{ matrix.shardTotal }})
        run: pnpm exec playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-blob-${{ matrix.shardIndex }}
          path: blob-report/
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec e2e-testing-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **TDD & Debugging Otonom**: `autonomous-tdd-debugger`, `property-mutation-testing-expert`
- **Gerbang Kualitas & Anti-Slop**: `anti-slop`, `ai-code-review-autonomous`, `zero-tech-debt-auditor`
- **Aksesibilitas & Otomasi Browser**: `accessibility-testing-expert`, `browser-automation-expert`
- **CI/CD & Otomasi DevOps**: `ci-cd-devops-architect`, `github-actions-expert`
- **Siklus Hidup & Tata Kelola**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan produksi untuk pengujian browser dan komponen otomatis menggunakan **Playwright 1.50+** dan **Vitest 3+**. Mencakup manipulasi jam virtual deterministik dengan `page.clock`, asersi pohon aksesibilitas semantis dengan `toMatchAriaSnapshot`, pembuatan test fixture modular, penanganan banner modal dinamis (`page.addLocatorHandler`), penggunaan ulang sesi autentikasi (`storageState`), dan sharding paralel di CI.

### Kondisi Pemicu
- Menulis test suite E2E browser untuk aplikasi Next.js 15, React 19, atau Svelte 5.
- Menguji antarmuka berbasis waktu (countdown timer, kedaluwarsa sesi) secara deterministik tanpa jeda waktu riil.
- Memvalidasi struktur pohon aksesibilitas menggunakan asersi semantis `aria-snapshot`.
- Mengonfigurasi fixture pengujian dengan isolasi state autentikasi dan database.
- Menjalankan pipeline pengujian terdistribusi secara paralel di GitHub Actions.

---

### Pola Kunci Playwright 1.50+

#### 1. Pengujian Waktu Deterministik Menggunakan Clock API (`page.clock`)
Hilangkan ketergantungan pada `time.Sleep` atau `waitForTimeout` dengan memajukan jam virtual seketika:
```typescript
import { test, expect } from '@playwright/test';

test('menguji countdown diskon secara deterministik', async ({ page }) => {
  // 1. Pasang jam virtual pada tanggal tertentu
  await page.clock.install({ time: new Date('2026-03-01T12:00:00Z') });
  await page.goto('/promo');

  const timer = page.getByRole('timer');
  await expect(timer).toHaveText('24:00:00');

  // 2. Majukan waktu 6 jam secara instan (1 milidetik)
  await page.clock.fastForward('06:00:00');
  await expect(timer).toHaveText('18:00:00');

  // 3. Majukan hingga waktu promo berakhir
  await page.clock.fastForward('18:00:01');
  await expect(page.getByRole('alert')).toHaveText('Promo ini telah berakhir.');
});
```

#### 2. Asersi Aksesibilitas Semantis (`toMatchAriaSnapshot`)
Validasi struktur aksesibilitas UI tanpa terikat pada class CSS atau tag DOM yang rapuh:
```typescript
import { test, expect } from '@playwright/test';

test('navigasi memenuhi standar aksesibilitas', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('header')).toMatchAriaSnapshot(`
    - banner:
      - link "Logo":
        - /url: //
      - navigation:
        - link "Produk"
        - link "Dokumentasi"
        - link "Harga"
      - button "Masuk"
  `);
});
```

#### 3. Penanganan Banner Otomatis (`page.addLocatorHandler`)
Tutup banner persetujuan cookie atau modal promosi secara otomatis kapan pun elemen tersebut muncul:
```typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    const tombolCookie = page.getByRole('button', { name: 'Setujui semua' });
    await page.addLocatorHandler(tombolCookie, async () => {
      await tombolCookie.click();
    });

    await use(page);
  },
});
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec e2e-testing-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
