---
name: mobile-expo-expert
description: "React Native & Expo SDK 53+ cross-platform mobile app development / Pengembangan aplikasi mobile React Native & Expo SDK 53+."
author: "Roedy Rustam"

version: "4.7.0"

---

# Mobile Expert — React Native & Expo (SDK 53 / RN 0.79 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- `design-system-architect` — Cross-platform design tokens, Material Design 3 (M3 / Material You), and adaptive UI primitives.
- `ui-ux-pro-max` — Mobile design patterns, touch targets (48x48dp minimum), navigation hierarchies, and safe area insets.
- `visual-ui-auditor` — Multimodal vision auditing of mobile screens, contrast, and responsive layout scaling.
- `apple-ecosystem-expert` — iOS Human Interface Guidelines (HIG), dynamic island, safe area, and Apple App Store compliance.
- `svg-animation-motion-expert` — React Native Reanimated v3 spring curves, micro-interactions, and shared element transitions.
- `anti-slop` — Anti-slop mobile engineering, zero mockup stubs, complete New Architecture component implementations.
- `app-promo-media-expert` — App Store & Google Play screenshots, device frame mockups, and launch promo media.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `flutter-dart-expert`, `desktop-electron-expert`, `tauri-expert`, `pwa-offline-first-expert`, `geospatial-maps-expert`

### Description
Expert guide for building production-grade cross-platform mobile applications using **React Native 0.79+** and **Expo SDK 53+**. Covers the New Architecture (stable), Expo Router v4, OTA updates, native modules, and modern state management patterns for iOS and Android.

### Trigger Conditions
- Building a new iOS/Android cross-platform mobile app.
- Using Expo SDK 53+ or React Native 0.79+ with the New Architecture.
- Implementing file-based routing with **Expo Router v4**.
- Setting up OTA (Over-the-Air) updates with EAS Update.
- Writing native modules using **JSI** (JavaScript Interface) or **Expo Modules API**.
- Integrating device features: camera, biometrics, notifications, location.

### What's New in 2026

#### React Native 0.79 — New Architecture Stable
The **New Architecture** (Fabric + JSI + TurboModules) is now **fully stable** and the default for all new Expo SDK 53 projects:
- **Fabric**: New rendering engine — synchronous rendering, better animations.
- **JSI (JavaScript Interface)**: Direct C++ bridge — no more async serialization for native calls.
- **TurboModules**: Lazy-loaded native modules — significantly faster startup time.
- **Concurrent React**: Full support for `useTransition`, `useDeferredValue`, and Suspense on mobile.

#### Expo SDK 53 — Key Updates
- **Expo Router v4**: File-based routing with typed routes, API routes (Expo functions), and universal links.
- **Expo Camera v15**: Unified camera API for iOS and Android.
- **Expo SQLite v15**: Full SQLite with WAL mode and `useSQLiteContext` hook.
- **Expo Modules API v2**: Easier native module authoring with Swift/Kotlin.
- **EAS Build**: Faster builds with M-series Mac runners.

### Core Architecture Patterns

#### 1. Project Setup (Expo SDK 53 + New Arch)
```bash
npx create-expo-app@latest MyApp --template tabs
cd MyApp
# New Architecture is enabled by default in SDK 53
```

#### 2. Expo Router v4 — File-Based Routing
```
app/
  _layout.tsx          # Root layout (navigation + providers)
  (tabs)/
    _layout.tsx         # Tab navigator
    index.tsx           # Home tab
    profile.tsx         # Profile tab
  (auth)/
    login.tsx           # Login screen
    register.tsx
  modal.tsx             # Modal screen
```

Use **typed routes** for compile-time safety:
```typescript
import { Link, useRouter } from 'expo-router';

// Typed navigation — TypeScript errors on invalid paths
<Link href="/profile">Profile</Link>

const router = useRouter();
router.push('/modal');
```

#### 3. API Routes (Expo Functions)
Expo Router v4 supports API routes for serverless backend logic:
```typescript
// app/api/user+api.ts
export async function GET(request: Request) {
  const user = await db.user.findFirst();
  return Response.json(user);
}
```

#### 4. State Management
- **TanStack Query v5**: Primary choice for server state (`useQuery`, `useMutation`).
- **Zustand**: Lightweight client state management (replace Context for complex state).
- **MMKV**: Ultra-fast synchronous storage (replace AsyncStorage).
- **Expo SQLite + Drizzle**: Local-first database with full SQL support.

#### 5. Navigation Patterns
```json
{
  "expo": {
    "scheme": "myapp",
    "ios": { "associatedDomains": ["applinks:myapp.com"] },
    "android": { "intentFilters": [{ "action": "VIEW", "data": [{ "scheme": "https", "host": "myapp.com" }] }] }
  }
}
```

#### 6. Native Modules — Expo Modules API v2
```typescript
// modules/my-sensor/src/MyModule.ts
import { requireNativeModule } from 'expo-modules-core';
const MyModule = requireNativeModule('MyModule');

export function readSensor(): Promise<number> {
  return MyModule.readSensor();
}
```

#### 7. OTA Updates with EAS Update
```bash
# Push an instant OTA update (no App Store review)
eas update --branch production --message "Fix critical bug"
```
Use **channels** to target specific user groups (production, staging, beta).

#### 8. Performance Best Practices
- Use **FlashList** (Shopify) instead of `FlatList` for large lists.
- Use **react-native-reanimated v3** for 60/120fps animations that run on the UI thread.
- Use **react-native-gesture-handler** for gesture recognition on the native thread.
- Enable **Hermes** engine (default in SDK 53) for faster startup and reduced memory.


#### 9. Material Design 3 (M3 / Material You) Cross-Platform Theming
Adhere to M3 specifications (https://m3.material.io/) for dynamic theming across Android and iOS:
```typescript
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { themeFromSourceColor, argbFromHex } from '@material/material-color-utilities';
import { useColorScheme } from 'react-native';

// Generate dynamic M3 color scheme from brand seed
const seedColor = '#6750A4';
const m3Theme = themeFromSourceColor(argbFromHex(seedColor));

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    ...(isDark ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(isDark ? MD3DarkTheme.colors : MD3LightTheme.colors),
      primary: isDark ? '#D0BCFF' : '#6750A4',
      primaryContainer: isDark ? '#4F378B' : '#EADDFF',
      surface: isDark ? '#1C1B1F' : '#FFFBFE',
      surfaceVariant: isDark ? '#49454F' : '#E7E0EC',
    },
  };

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
```

#### 10. Mandatory Store Compliance: Legal & Privacy Trio
Apple App Store Guideline 5.1.1(v) and Google Play Data Safety mandate that any app supporting user registration MUST provide:
1. **In-App Account & Data Deletion Action**: An explicit, accessible "Delete Account / Hapus Data" button in Settings/Profile triggering backend crypto-shredding and session revocation.
2. **Public Data Deletion Web URL**: A functional public web page (e.g. `https://yourdomain.com/delete-account` or `/data-deletion`) where users can submit deletion requests without installing the app.
3. **Public Privacy Policy & Terms URLs**: Standard live URLs (`/privacy` and `/terms`) detailing data processing, retention, and governing laws under UU PDP & GDPR.

#### 11. Hardware-Backed Biometric Token Vault (`expo-secure-store` + `expo-local-authentication`)
Never store session JWTs or refresh tokens in unencrypted `AsyncStorage`. Store sensitive credentials inside Keychain / Keystore via `expo-secure-store` gated by hardware biometrics:

```typescript
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const REFRESH_TOKEN_KEY = 'vibes.auth.refresh_token';

export async function saveHardwareProtectedToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    requireAuthentication: true,
    authenticationPrompt: 'Authenticate to secure your session',
  });
}

export async function readBiometricProtectedToken(): Promise<string | null> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (hasHardware && isEnrolled) {
    const authResult = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Verify your identity',
      fallbackLabel: 'Use Passcode',
      cancelLabel: 'Cancel',
    });
    if (!authResult.success) {
      return null;
    }
  }

  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function wipeSessionVault(): Promise<void> {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
```

### Hard Guardrails (Declarative Invariants)
- **Zero Unencrypted `AsyncStorage` for Secrets/Tokens**: MUST store session tokens, OAuth refresh tokens, and cryptographic keys in `expo-secure-store` (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`), never in plaintext `AsyncStorage`.
- **Virtualized `FlashList` Over `ScrollView .map()`**: MUST render dynamic lists (`> 20` items) with `@shopify/flash-list` (`estimatedItemSize`) or `FlatList` with stable `keyExtractor` instead of `.map()` inside a `<ScrollView>`.
- **UI-Thread Worklets for 60/120fps Animations**: MUST execute gesture-driven animations on the native UI thread via `react-native-reanimated` v3 (`useSharedValue`, `useAnimatedStyle`) instead of React state updates on every frame.
- **Safe Area & Minimum 48x48dp Touch Targets**: MUST respect device notches/home indicators with `react-native-safe-area-context` and enforce `>= 48x48dp` hit areas (`hitSlop` or padding) on all interactive controls.
- **App Store Guideline 5.1.1(v) Account Deletion**: MUST provide an in-app account deletion flow alongside public `/privacy`, `/terms`, and `/delete-account` URLs.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec mobile-expo-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- `design-system-architect` — Token desain cross-platform, Material Design 3 (M3 / Material You), dan primitif UI adaptif.
- `ui-ux-pro-max` — Pola desain mobile, target sentuh (minimal 48x48dp), hierarki navigasi, dan safe area insets.
- `visual-ui-auditor` — Audit visual multimodal untuk layar mobile, kontras, dan penskalaan tata letak responsif.
- `apple-ecosystem-expert` — Human Interface Guidelines (HIG) iOS, dynamic island, safe area, dan kepatuhan App Store.
- `svg-animation-motion-expert` — Kurva pegas React Native Reanimated v3, mikro-interaksi, dan transisi elemen bersama.
- `anti-slop` — Rekayasa mobile anti-slop, nol stub mockup, implementasi komponen New Architecture lengkap.
- `app-promo-media-expert` — Screenshot App Store & Google Play, mockup frame gawai, dan media promosi peluncuran.
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `flutter-dart-expert`, `desktop-electron-expert`, `tauri-expert`, `pwa-offline-first-expert`, `geospatial-maps-expert`

### Deskripsi
Panduan ahli untuk membangun aplikasi mobile cross-platform tingkat produksi menggunakan **React Native 0.79+** dan **Expo SDK 53+**. Mencakup New Architecture (stabil), Expo Router v4, OTA updates, native modules, dan pola state management modern untuk iOS dan Android.

### Kondisi Pemicu
- Membangun aplikasi mobile iOS/Android cross-platform baru.
- Menggunakan Expo SDK 53+ atau React Native 0.79+ dengan New Architecture.
- Mengimplementasikan routing berbasis file dengan **Expo Router v4**.
- Menyiapkan OTA (Over-the-Air) updates dengan EAS Update.
- Menulis native modules menggunakan JSI atau Expo Modules API v2.
- Mengintegrasikan fitur perangkat: kamera, biometrik, notifikasi, lokasi.

### Yang Baru di 2026

#### React Native 0.79 — New Architecture Stabil
**New Architecture** (Fabric + JSI + TurboModules) kini **sepenuhnya stabil** dan menjadi default untuk semua proyek baru Expo SDK 53:
- **Fabric**: Engine rendering baru — rendering sinkron, animasi lebih baik.
- **JSI**: Bridge C++ langsung — tidak ada lagi serialisasi async untuk panggilan native.
- **TurboModules**: Modul native lazy-loaded — startup jauh lebih cepat.
- **Concurrent React**: Dukungan penuh untuk `useTransition`, `useDeferredValue`, dan Suspense di mobile.

#### Expo SDK 53 — Pembaruan Utama
- **Expo Router v4**: Routing berbasis file dengan typed routes, API routes, dan universal links.
- **Expo Camera v15**: API kamera terpadu untuk iOS dan Android.
- **Expo SQLite v15**: SQLite lengkap dengan mode WAL dan hook `useSQLiteContext`.
- **Expo Modules API v2**: Pembuatan modul native yang lebih mudah dengan Swift/Kotlin.
- **EAS Build**: Build lebih cepat dengan runner Mac M-series.

### Pola Arsitektur Inti

#### 1. Routing Berbasis File (Expo Router v4)
Expo Router menggunakan konvensi direktori `app/` untuk mendefinisikan semua layar dan navigasi. Gunakan **typed routes** untuk keamanan type-safe di waktu kompilasi.

#### 2. API Routes (Expo Functions)
Expo Router v4 mendukung API routes untuk logika backend serverless langsung di dalam proyek.

#### 3. State Management
- **TanStack Query v5**: Pilihan utama untuk server state.
- **Zustand**: State klien yang ringan.
- **MMKV**: Penyimpanan sinkron ultra-cepat (pengganti AsyncStorage).
- **Expo SQLite + Drizzle**: Database lokal-first dengan dukungan SQL penuh.

#### 4. Native Modules — Expo Modules API v2
Gunakan Expo Modules API untuk membuat modul native kustom dengan Swift (iOS) dan Kotlin (Android) dengan boilerplate minimal.

#### 5. OTA Updates dengan EAS Update
Dorong pembaruan instan ke pengguna tanpa melalui review App Store. Gunakan channel (`production`, `staging`, `beta`) untuk menargetkan kelompok pengguna tertentu.

#### 6. Praktik Terbaik Performa
- **FlashList**: Pengganti FlatList yang jauh lebih cepat untuk daftar panjang.
- **react-native-reanimated v3**: Animasi 60/120fps yang berjalan di UI thread.
- **react-native-gesture-handler**: Pengenalan gesture di native thread.
- **Hermes Engine**: Default di SDK 53 — startup lebih cepat, memori lebih sedikit.

#### 7. Theming Lintas Platform Material Design 3 (M3 / Material You)
Terapkan spesifikasi M3 (https://m3.material.io/) untuk theming dinamis pada Android dan iOS:
- Gunakan `@material/material-color-utilities` untuk mengekstrak 5 palet tonal M3 dari warna seed brand.
- Integrasikan dengan `react-native-paper` (MD3Theme) atau custom design tokens untuk memastikan peran warna (`primary`, `primaryContainer`, `surface`, `surfaceContainer`) dan elevasi tonal beradaptasi sempurna dengan tema terang dan gelap sistem.

#### 8. Kepatuhan Wajib Toko Aplikasi: Trio Hukum & Privasi
Pedoman Apple App Store 5.1.1(v) dan Kebijakan Google Play Data Safety mewajibkan setiap aplikasi yang mendukung pendaftaran pengguna menyediakan:
1. **Aksi Hapus Akun & Data Mandiri di Dalam Aplikasi**: Tombol "Hapus Akun / Hapus Data" yang mudah diakses di layar Profil/Pengaturan dengan konfirmasi sekunder, mengeksekusi *crypto-shredding* di backend.
2. **URL Halaman Web Hapus Data Publik**: Halaman web publik (misal: `https://domain.com/delete-account` atau `/data-deletion`) yang memungkinkan pengguna mengajukan permohonan hapus data tanpa harus menginstal aplikasi kembali.
3. **URL Publik Kebijakan Privasi & Syarat Ketentuan**: Tautan rute standar (`/privacy` dan `/terms`) yang transparan sesuai amanat UU No. 27 Tahun 2022 (UU PDP).

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec mobile-expo-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
