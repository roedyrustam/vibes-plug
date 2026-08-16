---
name: compliance-gdpr-privacy-expert
description: "Expert guide for Data Privacy, GDPR, CCPA, and PDPA compliance. Covers consent management, data retention, privacy-by-design, and audit trails / Panduan kepatuhan Privasi Data, GDPR, dan PDPA."
author: "vibes-plug-swarm"
---

# Data Privacy & Compliance Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
A crucial guide for engineering teams building SaaS applications that handle PII (Personally Identifiable Information). Covers technical implementation patterns for privacy regulations like GDPR (Europe), CCPA (California), and PDPA/UU PDP (Indonesia), including data mapping, consent management, Right to be Forgotten (data erasure), and secure audit trails.

### Trigger Conditions
- When architecting user database schemas that store PII (names, emails, phone numbers, IP addresses).
- When implementing cookie consent banners and tracking scripts.
- When the user asks about "GDPR compliance", "data retention", or "account deletion".
- When building admin dashboards that require secure audit logging.

### Core Architectural Guidelines

#### 1. Privacy by Design (Data Minimization)
Do not collect data you do not explicitly need.
- **Hashing/Encryption**: Hash sensitive data (like passwords) and encrypt PII at rest (AES-256) and in transit (TLS 1.3).
- **IP Addresses**: IP addresses are considered PII under GDPR. Anonymize IP logs (e.g., masking the last octet `192.168.1.0`) if used for analytics.

#### 2. The Right to be Forgotten (Soft vs Hard Deletion)
Users must be able to delete their accounts easily.
- **Soft Deletion**: Flagging a user as `deleted_at = NOW()` is useful for immediate UI removal, but it is **not compliant** with GDPR erasure requests if the data stays indefinitely.
- **Hard Deletion / Scrubbing**: You must implement a background worker that permanently deletes or fully anonymizes soft-deleted records after a grace period (e.g., 30 days).

#### 3. Consent Management
- **Cookies**: Do not load analytical or marketing scripts (Google Analytics, Meta Pixel) until the user has explicitly clicked "Accept".
- **Database**: Store the timestamp and version of the Terms of Service/Privacy Policy the user agreed to during registration.

#### 4. Audit Trails
For financial or health data, maintain an append-only audit log of *who* accessed *what* PII and *when*.
- Never log actual PII in plain text application logs (e.g., avoid `console.log(user)`).

## Orchestration & Integration
- Enhances `database-orm-expert` with schema guidelines for soft-deletion and PII encryption.
- Works with `logging-error-tracking-expert` to ensure logs are sanitized of PII.
- Complements `authentication-identity-expert` for secure user lifecycle management.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan krusial bagi tim engineering yang membangun aplikasi SaaS yang menangani PII (Data Pribadi). Mencakup pola implementasi teknis untuk regulasi privasi seperti GDPR (Eropa) dan UU PDP (Pelindungan Data Pribadi Indonesia). Meliputi manajemen persetujuan (consent), hak untuk dilupakan (penghapusan data), dan rekam jejak audit (audit trails).

### Kondisi Pemicu
- Saat merancang skema database yang menyimpan data pribadi (nama, email, nomor telepon).
- Saat mengimplementasikan banner persetujuan cookie (cookie consent).
- Saat merancang fitur penghapusan akun pengguna.
- Saat melakukan logging data sensitif.

### Panduan Arsitektur Inti

#### 1. Privasi sejak Desain (Privacy by Design)
Kumpulkan hanya data yang benar-benar dibutuhkan.
- **Enkripsi**: Enkripsi PII saat diam (at rest) dan bergerak (in transit).
- **Alamat IP**: IP adalah data pribadi. Anomimkan log IP jika hanya digunakan untuk analitik umum.

#### 2. Hak untuk Dihapus (Right to be Forgotten)
Pengguna harus memiliki tombol yang mudah diakses untuk menghapus akun mereka.
- **Soft Delete vs Hard Delete**: Mengubah status menjadi `deleted_at` tidak cukup untuk kepatuhan hukum jika data dibiarkan selamanya. Anda harus membuat *cron job* yang secara permanen menghapus atau menganonimkan data (mengubah nama menjadi "Deleted User") setelah masa tenggang (misal: 30 hari).

#### 3. Manajemen Persetujuan (Consent)
- Jangan memuat skrip pelacakan pihak ketiga (seperti Facebook Pixel atau Google Analytics) sebelum pengguna memberikan izin eksplisit (Opt-In).
- Simpan rekaman kapan pengguna menyetujui Kebijakan Privasi Anda di database.

#### 4. Pembersihan Log (Log Sanitization)
Pastikan sistem logging aplikasi Anda (Pino, Winston) secara otomatis menyensor (redact) informasi sensitif seperti password, token kartu kredit, dan nomor telepon sebelum mengirimkannya ke sistem agregasi log seperti Datadog atau Sentry.

## Integrasi Orkestrasi
- Memperkuat `database-orm-expert` terkait skema enkripsi dan penghapusan data.
- Bekerja sama dengan `logging-error-tracking-expert` untuk pedoman sanitasi log.
- Melengkapi `authentication-identity-expert` dalam manajemen siklus hidup pengguna.
