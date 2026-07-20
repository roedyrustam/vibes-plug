---
name: mobile-expo-expert
description: "Expert guide for React Native and Expo development. Covers cross-platform mobile architecture, OTA updates, and native modules / Panduan ahli pengembangan React Native dan Expo untuk aplikasi mobile."
author: "Roedy Rustam"
---

# Mobile Expo Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill provides best practices for building production-ready, cross-platform mobile applications (iOS and Android) using **React Native** and the **Expo** framework. It bridges the gap between web development and native mobile architecture.

### Trigger Conditions
- Starting a new mobile app project using Expo.
- Migrating a web app to a mobile app.
- Implementing file-based routing with Expo Router.
- Setting up Over-The-Air (OTA) updates (Expo EAS Update).
- Building native modules via Expo Modules API.
- Implementing Push Notifications.

### Core Architecture Guidelines

#### 1. Routing (Expo Router)
Always use **Expo Router** for navigation. It brings file-based routing (similar to Next.js App Router) to React Native.
- Use `app/(tabs)` for tab-based navigation.
- Use `_layout.tsx` to define shared headers or wrapping providers.
- Use dynamic routes (e.g., `app/user/[id].tsx`) for deep linking. Deep linking works out of the box with Expo Router.

#### 2. Build & Deployment (EAS)
Do not build locally using XCode/Android Studio unless absolutely necessary. Use **Expo Application Services (EAS)**:
- **EAS Build**: Compiles your app in the cloud for both iOS and Android.
- **EAS Update**: Enables Over-The-Air (OTA) updates to fix bugs instantly without going through App Store review processes (for JS/asset changes only).
- **EAS Submit**: Automates submission to the App Store and Google Play.

#### 3. State Management & Data Fetching
Mobile network connectivity is notoriously flaky. 
- Use **TanStack Query (React Query)** or **WatermelonDB** for data fetching and offline caching. 
- Ensure the app provides an "Offline First" experience (or at least graceful degradation when the network drops).

#### 4. Styling and UI
- Use **NativeWind** (Tailwind CSS for React Native) to share design tokens between your web platform and mobile app.
- Respect Safe Area Boundaries (`SafeAreaView`) to avoid notches, dynamic islands, and home indicators.
- Use `KeyboardAvoidingView` to ensure input fields are not hidden by the on-screen keyboard.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini memberikan praktik terbaik untuk membangun aplikasi *mobile cross-platform* (iOS dan Android) yang siap produksi menggunakan **React Native** dan kerangka kerja **Expo**. Skill ini menjembatani pengembangan web dengan arsitektur *native mobile*.

### Kondisi Pemicu
- Memulai proyek aplikasi seluler baru menggunakan Expo.
- Memigrasikan aplikasi web menjadi aplikasi *mobile*.
- Mengimplementasikan routing berbasis file dengan **Expo Router**.
- Mengatur pembaruan langsung (*Over-The-Air* / OTA) via Expo EAS Update.
- Membangun modul *native* via Expo Modules API.
- Menerapkan *Push Notifications*.

### Panduan Arsitektur Inti

#### 1. Perutean (Expo Router)
Selalu gunakan **Expo Router** untuk navigasi. Alat ini membawa konsep *file-based routing* (seperti Next.js) ke ekosistem React Native.
- Gunakan `app/(tabs)` untuk navigasi berbasis tab.
- Gunakan `_layout.tsx` untuk mendefinisikan *header* bersama atau penyedia (*providers*).
- Gunakan rute dinamis (mis., `app/user/[id].tsx`) untuk dukungan *deep linking* yang langsung aktif secara otomatis.

#### 2. Build & Deployment (EAS)
Jangan melakukan *build* secara lokal menggunakan XCode/Android Studio kecuali terpaksa. Gunakan **Expo Application Services (EAS)**:
- **EAS Build**: Mengkompilasi aplikasi Anda di *cloud* untuk iOS dan Android.
- **EAS Update**: Memungkinkan pembaruan *Over-The-Air* (OTA) untuk memperbaiki bug secara instan tanpa perlu melewati proses peninjauan App Store (khusus untuk perubahan JS/aset).
- **EAS Submit**: Mengotomatiskan pengiriman (*submission*) ke App Store dan Google Play.

#### 3. Manajemen State & Pengambilan Data
Konektivitas jaringan seluler sering kali tidak stabil.
- Gunakan **TanStack Query (React Query)** atau **WatermelonDB** untuk pengambilan data dan *caching* offline.
- Pastikan aplikasi memberikan pengalaman *"Offline First"* (atau setidaknya tidak *crash* dengan elegan saat koneksi jaringan terputus).

#### 4. Styling dan Antarmuka (UI)
- Gunakan **NativeWind** (Tailwind CSS untuk React Native) untuk menggunakan sistem desain yang sama antara web dan aplikasi mobile Anda.
- Hormati Batas Area Aman (`SafeAreaView`) untuk menghindari potongan layar (*notches*), *dynamic islands*, dan indikator *home*.
- Gunakan `KeyboardAvoidingView` untuk memastikan kolom input tidak tertutup oleh *keyboard* virtual.
