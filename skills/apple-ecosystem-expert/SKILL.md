---
name: apple-ecosystem-expert
description: "Expert guide for Apple Ecosystem development. Covers iOS support, Safari WebKit compatibility, PWAs (Progressive Web Apps) for iOS, and Human Interface Guidelines (HIG) for web and native apps / Panduan ahli pengembangan ekosistem Apple (iOS & Web)."
author: "Roedy Rustam"
version: "4.4.2"
---

# Apple Ecosystem Expert — vibes-plug Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- `modern-web-guidance`: Safari WebKit standards, dynamic viewport units, and web platform features.
- `hig`: Direct Human Interface Guidelines alignment, typography, and iconography.
- `design-system-architect`: Apple design tokens, SF Pro font stack, and 44x44pt touch targets.
- `modern-css-native-expert`: Modern CSS `@supports`, `env(safe-area-inset-*)`, and native scrolling.
- `tailwind-expert`: Tailwind utility classes for iOS safe areas and dynamic viewport units.
- `ui-ux-pro-max`: Apple HIG UX patterns, fluid transitions, and iOS layout conventions.
- `visual-ui-auditor`: Multimodal vision auditing of iOS Safari interfaces and touch targets.
- `anti-slop`: Anti-slop iOS UI craft, zero generic Android-style controls in iOS contexts.
- `mobile-expo-expert`: Cross-platform React Native / Expo iOS implementations.
- `passkeys-webauthn-identity-expert`: iCloud Keychain Passkeys, Associated Domains, and FaceID/TouchID WebAuthn.

### Description
Expert engineering guide for Apple Ecosystem development across iOS 18+, iPadOS, macOS Safari WebKit, and Home Screen Web Apps (PWAs). Covers Safari WebKit layout invariants, Dynamic Island & Home Indicator safe areas, Web Push via APNs (`PushManager`), Universal Links (`apple-app-site-association`), and Apple Human Interface Guidelines (HIG).

### 1. Safari WebKit & iOS Platform Compatibility Matrix

| Feature / Behavior | iOS Safari / WebKit Quirk | 2026 Production Standard |
| :--- | :--- | :--- |
| **Viewport Height** | `100vh` includes area behind collapsible URL bar, clipping bottom CTAs | Use `100dvh` for interactive shells and `100svh` for fixed modals |
| **Input Auto-Zoom** | Safari forcefully zooms the page if `<input>` font-size is `< 16px` | Enforce `font-size: max(16px, 1rem)` on all form inputs on mobile breakpoints |
| **Notch & Home Indicator** | Edge-to-edge layouts overlap the Dynamic Island or bottom gesture bar | Set `viewport-fit=cover` + `padding-bottom: max(1rem, env(safe-area-inset-bottom))` |
| **iOS Web Push (APNs)** | Requires Home Screen installation (`display: standalone`) and user gesture | Gate `Notification.requestPermission()` behind an explicit settings button tap |
| **Passkeys & Universal Links** | Requires verified domain association without redirects | Serve `/.well-known/apple-app-site-association` with `application/json` MIME |

### 2. Production iOS Standalone PWA & Safe-Area Shell
Include `viewport-fit=cover` and detect standalone mode reliably to adapt navigation bars and Web Push prompts:

```html
<!-- Head configuration for iOS 18+ Standalone Web App -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="VibesApp" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.webmanifest" />
```

```css
/* src/styles/apple-webkit-safe.css */
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
}

.ios-app-shell {
  min-height: 100dvh;
  padding-top: var(--safe-top);
  padding-bottom: max(0.75rem, var(--safe-bottom));
  padding-left: var(--safe-left);
  padding-right: var(--safe-right);
  overscroll-behavior-y: none;
  -webkit-tap-highlight-color: transparent;
}

/* Prevent iOS Safari involuntary zoom on input focus */
@media screen and (max-width: 768px) {
  input,
  select,
  textarea {
    font-size: 16px;
  }
}
```

### 3. iOS Standalone Detection & Web Push Subscription Helper (TypeScript)

```typescript
// src/lib/ios-pwa-capabilities.ts
export interface IosEnvironmentStatus {
  isIosDevice: boolean;
  isStandalonePwa: boolean;
  supportsWebPush: boolean;
}

export function detectIosCapabilities(): IosEnvironmentStatus {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { isIosDevice: false, isStandalonePwa: false, supportsWebPush: false };
  }

  const ua = navigator.userAgent;
  const isIosDevice =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const isStandalonePwa =
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

  const supportsWebPush =
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window &&
    (!isIosDevice || isStandalonePwa);

  return { isIosDevice, isStandalonePwa, supportsWebPush };
}
```

### 4. Production Verification Checklist
- [ ] All full-height containers use `100dvh` / `100svh` instead of legacy `100vh`.
- [ ] All `<input>`, `<select>`, and `<textarea>` elements render at `>= 16px` font size on mobile to prevent Safari auto-zoom.
- [ ] Interactive controls enforce a minimum hit target of `44x44pt` in accordance with Apple HIG.
- [ ] `env(safe-area-inset-*)` variables protect top headers and bottom navigation bars from Dynamic Island and Home Indicator overlap.
- [ ] `/.well-known/apple-app-site-association` is served over HTTPS with `Content-Type: application/json` and zero HTTP redirects.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec apple-ecosystem-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- `modern-web-guidance`: Standar Safari WebKit, unit viewport dinamis, dan fitur platform web modern.
- `hig`: Penyelarasan langsung prinsip Human Interface Guidelines Apple.
- `design-system-architect`: Token desain Apple, font stack SF Pro, dan target sentuh 44x44pt.
- `modern-css-native-expert`: CSS modern `@supports`, `env(safe-area-inset-*)`, dan scrolling native.
- `tailwind-expert`: Utility class Tailwind untuk safe area iOS dan viewport dinamis.
- `ui-ux-pro-max`: Pola UX Apple HIG, transisi mulus, dan konvensi tata letak iOS.
- `visual-ui-auditor`: Audit visual multimodal untuk antarmuka Safari iOS dan target sentuh.
- `anti-slop`: Desain UI iOS anti-slop, nol kontrol generik gaya Android di konteks iOS.
- `mobile-expo-expert`: Implementasi React Native / Expo untuk platform iOS.
- `passkeys-webauthn-identity-expert`: Integrasi Passkeys iCloud Keychain, Associated Domains, dan FaceID/TouchID.

### Deskripsi
Panduan rekayasa ahli untuk pengembangan ekosistem Apple di iOS 18+, iPadOS, macOS Safari WebKit, dan PWA Home Screen. Mencakup aturan tata letak Safari WebKit, safe area Dynamic Island, Web Push melalui APNs, Universal Links (`apple-app-site-association`), dan standar Apple HIG.

### Checklist Verifikasi Produksi
- [ ] Gunakan `100dvh` (Dynamic Viewport Height) agar elemen bawah tidak tertutup bilah navigasi Safari.
- [ ] Pastikan ukuran font `<input>`, `<select>`, dan `<textarea>` minimal `16px` di layar mobile untuk mencegah auto-zoom Safari.
- [ ] Terapkan `env(safe-area-inset-top)` dan `env(safe-area-inset-bottom)` dengan `viewport-fit=cover`.
- [ ] Pastikan seluruh tombol memiliki area sentuh minimal `44x44pt` sesuai standar Apple HIG.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec apple-ecosystem-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
