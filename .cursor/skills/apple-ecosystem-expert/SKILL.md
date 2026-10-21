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

### Description
Expert guide for Apple Ecosystem development. Covers Safari WebKit compatibility, Progressive Web Apps (PWAs) tailored for iOS, touch interactions, `manifest.json` configurations, and applying Human Interface Guidelines (HIG) principles to web and iOS applications.

### Trigger Conditions
Activate this skill when the user is:
- Asking for Safari browser compatibility or fixing WebKit bugs.
- Developing PWAs or web apps targeting iOS/iPadOS devices.
- Asking about `apple-touch-icon`, `apple-mobile-web-app-capable`, or related meta tags.
- Building UI elements that need to look and feel native on Apple devices.

---

### Core Concepts

#### 1. iOS PWA & Meta Tags
To ensure a web application looks and acts like a native app on iOS when added to the home screen, include these specific meta tags and configurations:

```html
<!-- iOS Safari PWA Meta Tags -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="App Title" />
<link rel="apple-touch-icon" href="/icon-192x192.png" />
<!-- Support for splash screens requires specific sizes, consider using PWA asset generators -->
```

#### 2. Safari WebKit CSS Quirks
Safari (WebKit) has distinct behavior for viewport sizing and scrolling.

| CSS Feature | WebKit Problem | Solution / Workaround |
|---|---|---|
| `100vh` | Ignores the bottom navigation bar on mobile Safari, causing overflow. | Use `100dvh` (Dynamic Viewport Height) or safe area insets. |
| Over-scrolling | "Rubber-banding" effect reveals background on scroll limits. | `overscroll-behavior: none;` on `body`. |
| Safe Area | Notches and Dynamic Islands block content. | Use `env(safe-area-inset-bottom)`, `env(safe-area-inset-top)`. |

```css
/* Example: Handling safe area and dynamic viewport height */
.container {
  height: 100dvh;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

#### 3. Touch and Interactions
To achieve native feel on iOS, touch interactions must be smooth. Use CSS properties like `-webkit-tap-highlight-color: transparent;` to remove the default grey tap highlight.

---

### Best Practices

1. **Always use Dynamic Viewports (`dvh`, `svh`, `lvh`):** Standard `vh` in mobile Safari causes layout shifts or hidden content due to the dynamic browser UI.
2. **Handle Safe Areas:** Utilize CSS `env()` variables to avoid content overlapping with the iOS notch or home indicator.
3. **Optimized Touch Targets:** Apple HIG dictates a minimum touch target size of 44x44 pt. Ensure buttons are easily clickable.
4. **PWA Icons and Manifest:** iOS does not fully respect standard `manifest.json` icons; you must provide `<link rel="apple-touch-icon">` explicitly.

---

### Common Pitfalls to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| Using `100vh` for full screen apps | Bottom content gets hidden under Safari's tab bar. | Use `100dvh`. |
| Ignoring `-webkit-appearance` | Buttons/inputs look like default iOS forms instead of custom UI. | Set `-webkit-appearance: none;` on form elements. |
| Relying only on `manifest.json` for PWA icons | iOS won't use them for the "Add to Home Screen" icon. | Include `<link rel="apple-touch-icon" href="...">`. |

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

### Deskripsi
Panduan ahli untuk pengembangan ekosistem Apple. Mencakup kompatibilitas Safari WebKit, Progressive Web Apps (PWA) khusus iOS, interaksi sentuhan, konfigurasi `manifest.json`, dan penerapan prinsip Human Interface Guidelines (HIG) untuk web dan aplikasi iOS.

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- Menanyakan kompatibilitas browser Safari atau memperbaiki bug WebKit.
- Mengembangkan PWA atau aplikasi web yang menargetkan perangkat iOS/iPadOS.
- Menanyakan tentang `apple-touch-icon`, meta tag PWA iOS, atau safe area.
- Membangun elemen UI agar terlihat dan terasa *native* di ekosistem Apple.

### Panduan Singkat

Panduan praktis untuk dukungan Ekosistem Apple (iOS & Web):

- **[Gunakan `100dvh`]:** Jangan pernah gunakan `100vh` di web app iOS, gunakan `100dvh` (Dynamic Viewport Height) agar tidak tertutup navigation bar Safari.
- **[Meta Tag PWA Khusus]:** Wajib menggunakan `<link rel="apple-touch-icon">` dan `<meta name="apple-mobile-web-app-capable" content="yes">` agar PWA berjalan optimal saat ditambahkan ke Home Screen.
- **[Safe Area]:** Terapkan padding `env(safe-area-inset-top)` dsb, untuk menghindari notch (poni) dan Dynamic Island iPhone.
- **[Touch Targets HIG]:** Area sentuh minimum untuk elemen interaktif di iOS adalah 44x44 points.