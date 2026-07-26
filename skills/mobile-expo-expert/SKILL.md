---
name: mobile-expo-expert
description: "Expert guide for React Native 0.76+ and Expo SDK 52+ development. Covers cross-platform mobile architecture, Expo Router v4, New Architecture, OTA updates, and native modules / Panduan ahli pengembangan React Native 0.76+ dan Expo SDK 52+ untuk aplikasi mobile."
author: "Roedy Rustam"
---

# Mobile Expo Expert (SDK 52+ / RN 0.76+ Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Best practices for building production-ready, cross-platform mobile applications (iOS, Android, Web) using **React Native (0.76+)** with **Expo SDK 52+**. Embraces the New Architecture (Fabric renderer & TurboModules enabled by default), Expo Router v4, and Expo Application Services (EAS).

### Trigger Conditions
- Starting or upgrading a mobile app project to Expo SDK 52+ / React Native 0.76+.
- Implementing file-based routing with Expo Router v4.
- Migrating to or troubleshooting React Native's New Architecture (Fabric/TurboModules).
- Setting up Over-The-Air (OTA) updates via EAS Update.
- Building custom native modules via Expo Modules API (Swift & Kotlin).
- Implementing push notifications, background tasks, and biometric auth.

### Core Architecture Guidelines

#### 1. React Native New Architecture (Default in Expo SDK 52+)
- The **New Architecture** (Fabric + TurboModules + C++ core) is enabled by default. Avoid legacy bridge-dependent packages.
- Use concurrent React features (`useTransition`, `useDeferredValue`) safely within native views.

#### 2. File-Based Routing (Expo Router v4)
- Use `app/(tabs)` for tab navigation and `app/(auth)` for auth flows.
- Use `_layout.tsx` to define shared headers, stacks, and context providers.
- Handle universal deep linking natively using dynamic route parameters (`app/user/[id].tsx`).

#### 3. Styling & Modern UI Systems
- **NativeWind (v4)**: Use Tailwind CSS utility tokens directly in React Native components.
- **Safe Area & Keyboard**: Wrap screens in `SafeAreaView` and use `KeyboardAvoidingView` or `react-native-keyboard-controller` to handle software keyboards smoothly.

#### 4. Build, Distribution & OTA Updates (EAS)
- **EAS Build**: Cross-compile native builds in the cloud.
- **EAS Update**: Ship instant JS/asset patches Over-The-Air without waiting for App Store / Play Store reviews.
- **EAS Submit**: Automate store submission pipelines.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Praktik terbaik untuk membangun aplikasi seluler *cross-platform* (iOS, Android, Web) yang siap produksi menggunakan **React Native (0.76+)** dan **Expo SDK 52+**. Mengadopsi Arsitektur Baru (renderer Fabric & TurboModules yang aktif secara default), Expo Router v4, serta Expo Application Services (EAS).

### Kondisi Pemicu
- Memulai atau memperbarui proyek mobile ke Expo SDK 52+ / React Native 0.76+.
- Mengimplementasikan routing berbasis file dengan Expo Router v4.
- Mengkonfigurasi Arsitektur Baru React Native (Fabric / TurboModules).
- Mengatur pembaruan langsung (*Over-The-Air* / OTA) via EAS Update.
- Membangun modul native kustom via Expo Modules API (Swift & Kotlin).
- Menerapkan *push notifications*, *background tasks*, dan autentikasi biometrik.

### Panduan Arsitektur Inti

#### 1. Arsitektur Baru React Native (Default di Expo SDK 52+)
- **Arsitektur Baru** (Fabric + TurboModules) aktif secara otomatis. Hindari paket lama yang masih bergantung pada *legacy bridge*.
- Gunakan fitur konkurensi React (`useTransition`, `useDeferredValue`) dengan aman di komponen native.

#### 2. Perutean Berbasis File (Expo Router v4)
- Gunakan `app/(tabs)` untuk navigasi tab dan `app/(auth)` untuk alur autentikasi.
- Gunakan `_layout.tsx` untuk mendefinisikan *header* bersama, tumpukan navigasi (*stack*), dan penyedia konteks.
- Kelola *universal deep linking* secara otomatis via rute dinamis (`app/user/[id].tsx`).

#### 3. Styling & UI System Modern
- **NativeWind (v4)**: Gunakan utilitas Tailwind CSS langsung di komponen React Native.
- **Area Aman & Keyboard**: Bungkus layar dengan `SafeAreaView` dan gunakan `KeyboardAvoidingView` agar bidang input tidak tertutup keyboard.

#### 4. Build, Distribusi & OTA Updates (EAS)
- **EAS Build**: Kompilasi build native di *cloud*.
- **EAS Update**: Rilis perbaikan bug instan tanpa perlu menunggu proses tinjauan App Store / Google Play.
- **EAS Submit**: Otomatiskan alur pengiriman ke toko aplikasi.
