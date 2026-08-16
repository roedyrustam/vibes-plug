---
name: mobile-push-notification-expert
description: "Expert guide for Cross-Platform Push Notifications (Expo Push, FCM, APNs, Web Push), iOS Live Activities, and background payload handling / Panduan ahli notifikasi push mobile, FCM, APNs, dan Live Activities."
author: "vibes-plug-swarm"
---

# Mobile Push Notification & Live Activities Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Comprehensive guide for configuring cross-platform push notifications (Expo Push API, Firebase Cloud Messaging FCM, Apple APNs, Web Push API), iOS Live Activities / ActivityKit, background payload handlers, deep-linking routing, and push token lifecycle management.

### Key Capabilities
- **Expo & FCM Push**: Sending batched push notifications with rich media, actions, and custom data payloads.
- **iOS Live Activities**: Real-time status updates on iOS Dynamic Island and Lock Screen.
- **Deep Linking**: Routing push notification taps directly to targeted screens within Expo Router / React Native.

```typescript
import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}
```

### Implementation Checklist
- [ ] Configure Apple Developer Account (APNs Key) and Google Firebase (FCM Service Account).
- [ ] Request push notification permissions explicitly from the user after they understand the value proposition.
- [ ] Save the device's Push Token to the database, associated with the user's ID.
- [ ] Handle token refresh events when the user uninstalls/reinstalls the app or changes devices.
- [ ] Set up background event handlers to process incoming messages when the app is killed.

## Orchestration & Integration
- Integrates with: `mobile-expo-expert`, `event-driven-architect`, `database-orm-expert`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan komprehensif untuk konfigurasi push notification lintas platform (Expo Push, FCM, APNs, Web Push), iOS Live Activities / ActivityKit, penanganan payload background, routing deep-linking, dan manajemen siklus token push.

### Fitur Utama
- **Expo & FCM Push**: Pengiriman push notification masal dengan media kaya, tombol aksi, dan payload kustom.
- **iOS Live Activities**: Update status real-time di Dynamic Island dan Lock Screen iOS.
- **Deep Linking**: Mengarahkan ketukan notifikasi secara langsung ke layar target di Expo Router / React Native.

### Checklist Implementasi
- [ ] Konfigurasi Akun Developer Apple (Kunci APNs) dan Google Firebase (Service Account FCM).
- [ ] Minta izin notifikasi push secara eksplisit dari pengguna setelah mereka memahami nilai gunanya.
- [ ] Simpan Push Token perangkat ke database, yang terkait dengan ID pengguna.
- [ ] Tangani event penyegaran token saat pengguna menghapus/menginstal ulang aplikasi atau mengganti perangkat.
- [ ] Siapkan handler event background untuk memproses pesan masuk saat aplikasi ditutup (killed).

## Integrasi Orkestrasi
- Terintegrasi dengan: `mobile-expo-expert`, `event-driven-architect`, `database-orm-expert`.
