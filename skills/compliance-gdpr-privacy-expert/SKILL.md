---
name: compliance-gdpr-privacy-expert
description: "Expert guide for Data Privacy, GDPR, CCPA, and PDPA compliance. Covers consent management, data retention, privacy-by-design, and audit trails / Panduan kepatuhan Privasi Data, GDPR, dan PDPA."
author: "Roedy Rustam"
---

# Data Privacy & Compliance Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for Data Privacy regulations (GDPR, CCPA, PDPA Indonesia) and privacy-by-design implementation. Covers consent management, right-to-be-forgotten (data deletion workflows), data masking, retention policies, cookie compliance, and maintaining strict audit trails for SaaS applications.

### Trigger Conditions
Activate this skill when the user is:
- Building an application targeting European (EU) or Californian users.
- Implementing "Delete My Account" functionality requiring hard deletion of PII.
- Setting up cookie consent banners and telemetry opt-in workflows.
- Designing a database schema that involves highly sensitive Personally Identifiable Information (PII).

---

### Core Concepts

#### 1. Privacy by Design
Privacy must be embedded into the architecture from day one, not bolted on as an afterthought. This means collecting only strictly necessary data, masking it at rest, and ensuring it can be completely purged.

#### 2. The Right to Erasure (Right to be Forgotten)
When a user requests account deletion, you must physically remove their PII within 30 days (under GDPR). Soft deletes (`deleted_at = NOW()`) are generally insufficient for PII unless heavily anonymized.

```sql
-- Example: GDPR-compliant account deletion
-- Instead of soft-deleting, anonymize the user record so aggregate analytics survive
UPDATE users 
SET 
  first_name = 'Anonymized',
  last_name = 'User',
  email = concat('anon_', id, '@deleted.local'),
  phone = NULL,
  ip_address = NULL
WHERE id = 'uuid-to-delete';
```

---

### Best Practices

1. **Separate PII from Transactional Data:** Store PII (names, emails) in a separate table from behavioral or transactional data. This makes it trivial to anonymize a user by deleting the PII record while leaving the anonymized transaction intact for financial reporting.
2. **Explicit Consent for Telemetry:** Analytics (PostHog, Google Analytics) and marketing cookies must be strictly opt-in for EU users. Do not load telemetry SDKs until the consent banner is accepted.
3. **Data Retention Policies:** Implement background cron jobs to automatically purge application logs, IP addresses, and old telemetry data after 30-90 days.
4. **Audit Trails (Action Logging):** Track *who* accessed *what* sensitive data and *when*. This is critical for HIPAA or SOC2 compliance.

---

### Common Pitfalls to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| **Logging PII in plaintext** | Log files become toxic and violate GDPR | Mask emails, IPs, and passwords before passing to `console.log` or Sentry. |
| **Relying purely on Soft Deletes** | Violates "Right to Erasure" | Use hard deletes or strict anonymization scrubbing scripts. |
| **Pre-checked consent boxes** | Illegal under GDPR | Consent must be an explicit, affirmative action by the user. |

---

### Integration with Other Skills (MANDATORY)

This skill works best when combined with:
- `logging-error-tracking-expert` — To ensure application logs and error trackers (Sentry) are automatically scrubbing PII before transmission.
- `database-orm-expert` — For implementing column-level encryption and anonymization schemas.
- `feature-flag-analytics-expert` — For integrating cookie consent state with telemetry SDK loading mechanisms.

### Referenced By Orchestrators (MANDATORY)

This skill should be referenced by the following orchestrators:
- `brainstorming` — Add to the "Security & Identity" domain.
- `zero-to-prod-orchestrator` — Phase 2 (Planning) and Phase 6 (Security).
- `production-ready-hardener` — Phase 6 (Security Hardening) for PII leakage checks.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk regulasi Privasi Data (GDPR, CCPA, UU PDP Indonesia) dan implementasi *privacy-by-design*. Mencakup manajemen persetujuan (consent), hak untuk dilupakan (alur penghapusan data), penyamaran data (masking), kebijakan retensi, kepatuhan *cookie*, dan audit trail untuk aplikasi SaaS.

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- Membangun aplikasi yang menargetkan pengguna Eropa (UE) atau Amerika.
- Mengimplementasikan fitur "Hapus Akun Saya" yang mewajibkan penghapusan permanen data pribadi (PII).
- Menyiapkan banner persetujuan *cookie* dan alur opt-in untuk telemetri.
- Merancang skema database yang melibatkan Informasi Identitas Pribadi (PII) yang sensitif sesuai UU PDP.

### Panduan Singkat

- **Pisahkan PII dari Data Transaksi:** Simpan data identitas (nama, email) di tabel terpisah dari data transaksi. Ini memudahkan Anda menganonimkan pengguna (dengan menghapus PII) tanpa merusak laporan keuangan agregat Anda.
- **Hak untuk Dihapus (Right to Erasure):** *Soft delete* (`deleted_at`) saja tidak cukup menurut GDPR dan UU PDP jika menyangkut PII. Lakukan penghapusan permanen atau penyamaran (anonimisasi) secara total.
- **Persetujuan Eksplisit:** Jangan muat SDK pelacakan (Analytics, Facebook Pixel) secara otomatis sebelum pengguna menekan tombol "Setuju". Kotak centang yang sudah dicentang dari awal adalah ilegal.
- **Awas Kebocoran Log:** Pastikan alat *logging* Anda memfilter atau me-masking email, NIK, dan *password* sebelum log dikirim ke server (seperti Datadog atau Sentry).

### Integrasi dengan Skill Lain (WAJIB)

Skill ini bekerja paling baik dikombinasikan dengan:
- `logging-error-tracking-expert` — Memastikan log aplikasi tidak menyimpan data pribadi secara *plaintext*.
- `database-orm-expert` — Mengimplementasikan enkripsi tingkat kolom atau teknik anonimisasi di database.
- `feature-flag-analytics-expert` — Mengatur pemuatan SDK analitik berdasarkan status persetujuan pengguna.

### Direferensikan oleh Orchestrator (WAJIB)

Skill ini harus direferensikan oleh orchestrator berikut:
- `brainstorming` — Tambahkan ke domain "Security & Identity".
- `zero-to-prod-orchestrator` — Fase 2 (Planning) dan Fase 6 (Security).
- `production-ready-hardener` — Fase 6 (Security Hardening).
