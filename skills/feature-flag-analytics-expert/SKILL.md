---
name: feature-flag-analytics-expert
description: "Expert guide for Feature Flags & Progressive Rollout (PostHog, LaunchDarkly, GrowthBook), A/B testing orchestration, and canary releases / Panduan ahli Feature Flags, A/B testing, dan rilis bertahap."
author: "Roedy Rustam"
---

# Feature Flag & Progressive Rollout Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Production-grade guidelines for feature flag management, progressive feature rollouts, canary deployments, A/B testing experiment analysis, and dynamic server-side/client-side feature evaluation using PostHog, LaunchDarkly, and GrowthBook.

### Key Capabilities
- **Feature Gating**: Decoupling code deployment from feature release with instant kill-switches.
- **Canary & Percentage Rollout**: Incrementally releasing new features to 5%, 25%, 50%, and 100% of user segments.
- **Experimentation Engine**: Statistical A/B testing with conversion metrics and variant analytics.

```typescript
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_API_KEY!);

export async function isNewCheckoutEnabled(userId: string) {
  const isEnabled = await posthog.isFeatureEnabled('new-checkout-flow', userId);
  return isEnabled;
}
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk manajemen feature flags, rilis fitur bertahap (progressive rollout), canary deployment, pengujian A/B testing, dan evaluasi fitur dinamis menggunakan PostHog, LaunchDarkly, dan GrowthBook.

### Fitur Utama
- **Feature Gating**: Memisahkan deployment kode dari rilis fitur dengan tombol *kill-switch* instan.
- **Rilis Bertahap (Canary)**: Meluncurkan fitur baru secara bertahap ke 5%, 25%, 50%, hingga 100% segmen pengguna.
- **Mesin Eksperimen**: Pengujian A/B statistik dengan metrik konversi dan analitik varian.
