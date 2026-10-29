---
name: apple-ecosystem-expert
description: "Apple ecosystem development: iOS support, Safari WebKit, and HIG / Pengembangan ekosistem Apple: kompatibilitas iOS, Safari, dan HIG."
author: "Roedy Rustam"
version: "4.4.5"
---

# Apple Ecosystem Expert — vibes-plug Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- **`hig`**: Direct Apple Human Interface Guidelines alignment across Clarity, Deference, Depth, and the 6 Core Principles.
- **`modern-web-guidance`**: Safari WebKit standards, dynamic viewport units (`100dvh`), and web platform features.
- **`design-system-architect`**: Apple design tokens, continuous squircle scales, SF Pro typography, and 44×44pt touch targets.
- **`modern-css-native-expert`**: Modern CSS `@supports`, `env(safe-area-inset-*)`, and native iOS inertia scrolling.
- **`tailwind-expert`**: Tailwind utility classes for iOS safe areas, liquid glass, and dynamic viewport units.
- **`ui-ux-pro-max`**: Apple HIG UX patterns, fluid spring transitions, Dynamic Island layouts, and thumb-zone ergonomics.
- **`visual-ui-auditor`**: Multimodal vision auditing of iOS Safari interfaces, contrast ratios, and touch targets.
- **`anti-slop`**: Anti-slop iOS UI craft, zero generic Android-style controls in iOS contexts, zero unstyled pill buttons.
- **`mobile-expo-expert`**: Cross-platform React Native / Expo iOS implementations and native Swift modules.
- **`passkeys-webauthn-identity-expert`**: iCloud Keychain Passkeys, Associated Domains, and Face ID / Touch ID WebAuthn.
- **`brainstorming`**, **`zero-to-prod-orchestrator`**, **`session-memory-manager`**: Continuous lifecycle orchestration.

### Description
Expert engineering and design guide for the Apple Ecosystem across **iOS 18+**, **iPadOS 18+**, **macOS 15 Sequoia**, **visionOS 2+**, and **Safari WebKit**. Enforces Apple Human Interface Guidelines (HIG) compliance in code: Dynamic Type scales, semantic system colors, Liquid Glass materials, Dynamic Island presentation states, iPadOS pointer hover adaptations, safe-area layout invariants, and standalone PWA configuration.

---

### 1. Safari WebKit & iOS Platform Compatibility Invariants

| Feature / Behavior | Safari WebKit Quirk | 2026 Production Standard |
| :--- | :--- | :--- |
| **Viewport Height** | `100vh` includes area behind collapsible URL bar, clipping bottom CTAs | Enforce `100dvh` for full interactive shells; `100svh` for modal overlays |
| **Input Auto-Zoom** | Safari forcefully zooms the page if `<input>` font-size is `< 16px` | Enforce `font-size: max(16px, 1rem)` on all form inputs on mobile breakpoints |
| **Dynamic Island & Notch** | Edge-to-edge layouts overlap hardware sensors and Home Indicator | Set `viewport-fit=cover` + `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)` |
| **Overscroll & Rubber-Band** | Whole page bounce can disrupt fixed sheets or bottom bars | Apply `overscroll-behavior-y: none` to the root view and enable native bounce on inner scrollviews |
| **Touch Target Size** | Small links cause mis-taps on high-density Retina touchscreens | Guarantee minimum hit target of `44×44pt` (`min-height: 44px; min-width: 44px`) |
| **Web Push (APNs)** | Requires Home Screen installation (`display: standalone`) and user gesture | Gate `Notification.requestPermission()` behind an explicit user gesture |
| **Universal Links & Passkeys** | Requires verified domain association without redirects | Serve `/.well-known/apple-app-site-association` with `application/json` MIME and HTTP 200 |

---

### 2. Apple HIG Design Tokens & CSS Architecture

Implement native Apple HIG tokens directly into your CSS or Tailwind v4 `@theme`:

```css
/* src/styles/apple-hig-tokens.css */
:root {
  /* Safe Area Insets */
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
  --safe-right: env(safe-area-inset-right, 0px);

  /* Apple System Typography (SF Pro) */
  --font-apple-system: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
    "Helvetica Neue", Helvetica, Arial, sans-serif;

  /* Apple Semantic System Colors (Light Mode) */
  --apple-label-primary: #000000;
  --apple-label-secondary: rgba(60, 60, 67, 0.6);
  --apple-label-tertiary: rgba(60, 60, 67, 0.3);
  --apple-bg-primary: #FFFFFF;
  --apple-bg-secondary: #F2F2F7;
  --apple-bg-tertiary: #FFFFFF;
  --apple-separator: rgba(60, 60, 67, 0.29);

  /* Apple System Tints */
  --apple-blue: #007AFF;
  --apple-green: #34C759;
  --apple-red: #FF3B30;
  --apple-orange: #FF9500;
  --apple-purple: #AF52DE;

  /* Radii (Apple Continuous Squircle Scale) */
  --radius-apple-sm: 8px;
  --radius-apple-md: 12px;
  --radius-apple-lg: 16px;
  --radius-apple-xl: 22px;
  --radius-apple-full: 9999px;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Apple Semantic System Colors (Dark Mode Elevation) */
    --apple-label-primary: #FFFFFF;
    --apple-label-secondary: rgba(235, 235, 245, 0.6);
    --apple-label-tertiary: rgba(235, 235, 245, 0.3);
    --apple-bg-primary: #000000;    /* Canvas base */
    --apple-bg-secondary: #1C1C1E;  /* Elevated card */
    --apple-bg-tertiary: #2C2C2E;   /* Elevated sheet/modal */
    --apple-separator: rgba(84, 84, 88, 0.6);

    /* Dark Mode Vibrant Tints */
    --apple-blue: #0A84FF;
    --apple-green: #30D158;
    --apple-red: #FF453A;
    --apple-orange: #FF9F0A;
    --apple-purple: #BF5AF2;
  }
}

/* Apple Liquid Glass Material */
.apple-liquid-glass {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

@media (prefers-color-scheme: dark) {
  .apple-liquid-glass {
    background: rgba(28, 28, 30, 0.78);
    backdrop-filter: blur(20px) saturate(190%);
    -webkit-backdrop-filter: blur(20px) saturate(190%);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
}

/* Apple HIG Interactive Touch Target Floor */
.apple-touch-target {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* iPadOS & macOS Pointer Hover Effect */
@media (hover: hover) and (pointer: fine) {
  .apple-touch-target:hover {
    background-color: var(--apple-label-secondary);
    transition: background-color 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  }
}
```

---

### 3. Dynamic Island & Live Activities HTML/CSS Component Pattern

Represent Dynamic Island states faithfully in web/hybrid applications:

```html
<!-- src/components/DynamicIsland.html -->
<div class="dynamic-island-container">
  <!-- 1. Compact Presentation (Pill) -->
  <div class="dynamic-island-compact" role="status" aria-live="polite">
    <div class="island-leading">
      <span class="symbol-timer" aria-hidden="true">⏱️</span>
    </div>
    <div class="island-trailing">
      <span class="tabular-nums font-semibold text-apple-green">14:59</span>
    </div>
  </div>

  <!-- 2. Expanded Presentation (Long Press Modal) -->
  <div class="dynamic-island-expanded hidden" id="dynamic-island-expanded">
    <div class="expanded-leading">
      <div class="app-icon-badge">⚡</div>
      <div class="expanded-meta">
        <span class="text-caption font-medium text-secondary">Vibes Task</span>
        <span class="text-headline font-semibold">Running Benchmark</span>
      </div>
    </div>
    <div class="expanded-trailing">
      <span class="tabular-nums text-title2 font-bold text-apple-green">14:59</span>
    </div>
    <div class="expanded-bottom">
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width: 68%;"></div>
      </div>
      <div class="expanded-actions">
        <button class="apple-button-tinted apple-touch-target">Pause</button>
        <button class="apple-button-destructive apple-touch-target">End</button>
      </div>
    </div>
  </div>
</div>
```

```css
/* Dynamic Island Presentation Styles */
.dynamic-island-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: max(0.5rem, var(--safe-top));
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 9999;
}

.dynamic-island-compact {
  pointer-events: auto;
  background-color: #000000;
  color: #FFFFFF;
  height: 37px;
  border-radius: 19px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  min-width: 125px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.dynamic-island-expanded {
  pointer-events: auto;
  background-color: #000000;
  color: #FFFFFF;
  width: min(92vw, 360px);
  border-radius: 38px;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

### 4. Standalone iOS PWA & Web Push Subscription (TypeScript)

Detect standalone mode reliably and handle Apple Push Notification service (APNs) enrollment:

```typescript
// src/lib/apple-pwa.ts
export interface AppleEnvironmentStatus {
  isIosDevice: boolean;
  isIpadOs: boolean;
  isStandalonePwa: boolean;
  supportsWebPush: boolean;
  hasNotchOrIsland: boolean;
}

export function detectAppleEnvironment(): AppleEnvironmentStatus {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isIosDevice: false,
      isIpadOs: false,
      isStandalonePwa: false,
      supportsWebPush: false,
      hasNotchOrIsland: false,
    };
  }

  const ua = navigator.userAgent;
  const isIpadOs =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !/iPhone|iPod/.test(ua);
  const isIosDevice = /iPad|iPhone|iPod/.test(ua) || isIpadOs;

  const isStandalonePwa =
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

  const supportsWebPush =
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window &&
    (!isIosDevice || isStandalonePwa);

  // Check safe-area-inset-top presence indicating Dynamic Island or Notch
  const safeTopStr = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--safe-top')
    .trim();
  const hasNotchOrIsland = parseInt(safeTopStr, 10) > 20;

  return { isIosDevice, isIpadOs, isStandalonePwa, supportsWebPush, hasNotchOrIsland };
}

/**
 * Subscribes to Web Push via APNs.
 * Must be triggered directly by an explicit user gesture (e.g. settings toggle tap).
 */
export async function subscribeToAppleWebPush(applicationServerKey: string): Promise<PushSubscription | null> {
  const env = detectAppleEnvironment();
  if (!env.supportsWebPush) {
    throw new Error('Web Push is only available in iOS Standalone Home Screen apps or macOS Safari.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });
}
```

---

### 5. Production Verification Checklist

- [ ] All interactive screen roots use `100dvh` (Dynamic Viewport Height) to prevent clipping by Safari's collapsible URL bar.
- [ ] Every form input enforces `font-size: max(16px, 1rem)` to prevent involuntary iOS Safari auto-zooming.
- [ ] Safe area insets (`env(safe-area-inset-*)`) protect headers from Dynamic Island and footers from the Home Indicator.
- [ ] Interactive controls strictly enforce a minimum touch target floor of `44×44pt`.
- [ ] Tabular numerals (`font-variant-numeric: tabular-nums`) are enforced on all metrics, counters, and prices.
- [ ] Translucent toolbars and navigation bars utilize `backdrop-filter: blur(20px) saturate(180%)`.
- [ ] `/.well-known/apple-app-site-association` is served over HTTPS with `Content-Type: application/json` and zero redirects.
- [ ] Destructive actions are styled in system red (`#FF3B30` / `#FF453A`) with a secondary confirmation dialog.

---

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec apple-ecosystem-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | Minimum 44×44pt touch targets, `100dvh` shell, `max(16px, 1rem)` inputs, safe-area compliance; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- **`hig`**: Penyelarasan langsung prinsip Apple Human Interface Guidelines (Clarity, Deference, Depth, dan 6 Prinsip Fondasional).
- **`modern-web-guidance`**: Standar Safari WebKit, unit viewport dinamis (`100dvh`), dan kapabilitas platform web modern.
- **`design-system-architect`**: Token desain Apple, kurva squircle kontinu, tipografi SF Pro, dan target sentuh minimal 44×44pt.
- **`modern-css-native-expert`**: CSS modern `@supports`, `env(safe-area-inset-*)`, dan scrolling inersia native iOS.
- **`tailwind-expert`**: Utility class Tailwind untuk safe area iOS, liquid glass, dan viewport dinamis.
- **`ui-ux-pro-max`**: Pola UX Apple HIG, transisi pegas (spring), tata letak Dynamic Island, dan ergonomi thumb-zone.
- **`visual-ui-auditor`**: Audit visual multimodal untuk antarmuka Safari iOS, rasio kontras, dan target sentuh.
- **`anti-slop`**: Desain UI iOS anti-slop, bebas kontrol generik gaya Android di konteks iOS, bebas tombol pill tanpa style.
- **`mobile-expo-expert`**: Implementasi React Native / Expo untuk platform iOS dan modul native Swift.
- **`passkeys-webauthn-identity-expert`**: Integrasi Passkeys iCloud Keychain, Associated Domains, dan Face ID / Touch ID WebAuthn.
- **`brainstorming`**, **`zero-to-prod-orchestrator`**, **`session-memory-manager`**: Orkestrasi siklus hidup proyek secara terpadu.

### Deskripsi
Panduan rekayasa dan desain ahli untuk ekosistem Apple di **iOS 18+**, **iPadOS 18+**, **macOS 15 Sequoia**, **visionOS 2+**, dan **Safari WebKit**. Menegakkan kepatuhan terhadap Apple Human Interface Guidelines (HIG) di level kode: skala Dynamic Type, warna sistem semantik, material Liquid Glass, presentasi Dynamic Island, adaptasi pointer iPadOS, invarian safe area, dan PWA standalone.

---

### 1. Invarian Kompatibilitas Safari WebKit & Platform iOS

| Fitur / Perilaku | Masalah Safari WebKit | Standar Produksi 2026 |
| :--- | :--- | :--- |
| **Tinggi Viewport** | `100vh` mencakup area di balik bilah URL, memotong CTA bawah | Gunakan `100dvh` untuk shell interaktif penuh; `100svh` untuk modal |
| **Input Auto-Zoom** | Safari memperbesar layar secara paksa jika ukuran font `<input>` `< 16px` | Wajibkan `font-size: max(16px, 1rem)` pada seluruh input form mobile |
| **Dynamic Island & Notch** | Tata letak edge-to-edge bertabrakan dengan kamera dan Home Indicator | Konfigurasi `viewport-fit=cover` + `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)` |
| **Overscroll Halaman** | Efek pantulan seluruh halaman mengganggu bilah navigasi bawah | Terapkan `overscroll-behavior-y: none` pada root view |
| **Ukuran Target Sentuh** | Link kecil memicu salah sentuh di layar Retina padat | Jamin target sentuh minimal `44×44pt` (`min-height: 44px; min-width: 44px`) |
| **Web Push (APNs)** | Wajib diinstal ke Home Screen (`display: standalone`) dan butuh gestur | Munculkan `Notification.requestPermission()` hanya setelah tap eksplisit pengguna |
| **Universal Links & Passkeys** | Membutuhkan asosiasi domain terverifikasi tanpa redirect | Sajikan `/.well-known/apple-app-site-association` dengan tipe MIME `application/json` |

---

### 2. Token Desain Apple HIG & Arsitektur CSS

Terapkan token resmi Apple HIG langsung pada CSS atau Tailwind v4:
- **Warna Semantik**: Gunakan token warna semantik (`label`, `secondaryLabel`, `systemBackground`, `systemGroupedBackground`) yang secara otomatis beradaptasi saat pengguna beralih antara Mode Terang dan Mode Gelap.
- **Pencerahan Sumbu-Z Mode Gelap**: Pastikan kartu, dialog, dan sheet yang melayang memiliki warna abu-abu lebih terang (`#1C1C1E`, `#2C2C2E`) di atas kanvas hitam murni (`#000000`).
- **Material Liquid Glass**: Gunakan filter `backdrop-filter: blur(20px) saturate(180%)` dengan border translusen 1px.
- **Batas Sentuh 44×44pt**: Pastikan seluruh tombol memiliki dimensi hitbox minimal 44×44pt.
- **Hover Pointer iPadOS & macOS**: Gunakan media query `@media (hover: hover) and (pointer: fine)` untuk memberikan highlight halus saat kursor melayang di atas elemen interaktif.

---

### 3. Checklist Verifikasi Produksi Apple HIG

- [ ] Seluruh container halaman utama menggunakan `100dvh` (Dynamic Viewport Height) alih-alih `100vh`.
- [ ] Seluruh elemen `<input>`, `<select>`, dan `<textarea>` memiliki ukuran font minimal `16px` di layar mobile.
- [ ] Inset safe area (`env(safe-area-inset-*)`) melindungi header dari Dynamic Island dan navigasi bawah dari Home Indicator.
- [ ] Seluruh tombol dan kontrol interaktif memenuhi area sentuh minimal `44×44pt`.
- [ ] Angka tabular (`tabular-nums`) diterapkan pada semua tampilan metrik, timer, counter, dan harga.
- [ ] Bilah navigasi melayang menerapkan efek Liquid Glass (`backdrop-filter: blur(20px) saturate(180%)`).
- [ ] File `/.well-known/apple-app-site-association` disajikan via HTTPS dengan `Content-Type: application/json` tanpa redirect.
- [ ] Aksi destruktif diwarnai merah sistem (`#FF3B30` / `#FF453A`) dengan konfirmasi sekunder.

---

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec apple-ecosystem-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Target sentuh minimal 44×44pt, shell `100dvh`, font input `max(16px, 1rem)`, kepatuhan safe-area; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
