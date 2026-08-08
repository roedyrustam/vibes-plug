---
name: zero-trust-secret-vault
description: "Expert guide for Zero-Trust Secret Management (Infisical, HashiCorp Vault, Doppler), automated API key rotation, and environment security / Panduan ahli manajemen rahasia Zero-Trust, rotasi kunci API, dan keamanan variabel lingkungan."
author: "Roedy Rustam"
---

# Zero-Trust Secret Vault & Credential Security Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Production-grade security standards for managing application secrets, environment variables, API keys, database credentials, and TLS certificates using Zero-Trust Secret Managers — Infisical, HashiCorp Vault, and Doppler — featuring automated secret rotation, dynamic credentials, and zero plain-text leaks in repositories or CI/CD pipelines.

### Key Capabilities
- **Zero Plain-Text Secrets**: Injecting encrypted secrets at runtime without storing `.env` files in production artifacts.
- **Automated Rotation**: Programmatic rotation of API keys, JWT secrets, and database passwords.
- **Audit Logging**: Tracking secret access, version history, and permission policies across development teams.

```bash
# Infisical CLI Runtime Secret Injection
infisical run -- env | grep DATABASE_URL
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Standar keamanan tingkat produksi untuk pengelolaan rahasia aplikasi, variabel lingkungan, kunci API, kredensial database, dan sertifikat TLS menggunakan Secret Manager Zero-Trust — Infisical, HashiCorp Vault, dan Doppler — dengan rotasi rahasia otomatis dan jaminan tanpa kebocoran teks polos di repositori atau pipeline CI/CD.

### Fitur Utama
- **Zero Plain-Text Secrets**: Injeksi rahasia terenkripsi saat runtime tanpa menyimpan file `.env` di artefak produksi.
- **Rotasi Otomatis**: Rotasi terprogram untuk kunci API, rahasia JWT, dan kata sandi database.
- **Audit Logging**: Pelacakan akses rahasia, riwayat versi, dan kebijakan izin di seluruh tim pengembangan.
