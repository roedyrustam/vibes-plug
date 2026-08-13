---
name: post-quantum-crypto-migrator
description: "FinTech future-proofing. Scans and migrates classical encryption to NIST-approved Post-Quantum Cryptography (PQC) / Migrasi ke Kriptografi Pasca-Kuantum (PQC) yang disetujui NIST untuk sistem FinTech."
author: vibes-plug-swarm
---

# Post-Quantum Cryptography Migrator

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
An advanced security architect skill designed to future-proof FinTech, SaaS, and Payment integrations (such as DOKU) against the impending threat of Quantum Computers breaking classical encryption (RSA/ECC). It scans codebases for vulnerable cryptographic algorithms and migrates them to NIST-approved Post-Quantum Cryptography (PQC) algorithms, such as CRYSTALS-Kyber (for Key Encapsulation) and CRYSTALS-Dilithium/SPHINCS+ (for Digital Signatures).

### Trigger Conditions
- During security audits or Phase 6 (Automated Testing & Security Audit).
- When upgrading high-security financial payment gateways or generating JWT/Session tokens.
- Explicit user request to make the application "Quantum-Proof".

### Operating Protocol
1. **Cryptographic Discovery**: Audits all usage of `crypto`, `bcrypt`, `RSA`, `ECDSA`, and `HMAC` operations.
2. **Hybrid Migration Plan**: Recommends hybrid implementations (combining classical ECC with PQC algorithms like Kyber-512) to comply with modern standards while maintaining backward compatibility.
3. **Implementation**: Swaps vulnerable implementations with PQC-ready libraries (e.g., OQS - Open Quantum Safe, or modernized webcrypto wrappers supporting Kyber).
4. **Validation**: Ensures the expanded key sizes and signature sizes of PQC algorithms do not break database schemas or HTTP header limits.

## Orchestration & Integration
- Enforces extreme security standards alongside `authentication-identity-expert`.
- Hardens `doku-payment-gateway` and `saas-billing` payload encryption to banking-grade PQC standards.
- Integrates with `database-orm-expert` to update schema lengths (PQC keys are significantly larger than RSA).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Keterampilan arsitek keamanan tingkat lanjut yang dirancang untuk melindungi integrasi FinTech, SaaS, dan Sistem Pembayaran (seperti DOKU) dari ancaman Komputer Kuantum yang kelak mampu membobol enkripsi klasik (RSA/ECC). Agen ini memindai basis kode untuk mencari algoritma kriptografi yang rentan, lalu memigrasikannya ke standar Kriptografi Pasca-Kuantum (PQC) yang disetujui NIST, seperti CRYSTALS-Kyber (untuk *Key Encapsulation*) dan CRYSTALS-Dilithium/SPHINCS+ (untuk Tanda Tangan Digital).

### Kondisi Pemicu
- Selama audit keamanan atau Fase 6 (Pengujian Otomatis & Audit Keamanan).
- Saat memperbarui *payment gateway* keuangan berskala tinggi atau membuat token JWT/Sesi.
- Permintaan eksplisit dari pengguna untuk membuat aplikasi *"Quantum-Proof"* (Tahan-Kuantum).

### Protokol Operasi
1. **Penemuan Kriptografi**: Mengaudit seluruh penggunaan operasi `crypto`, `bcrypt`, `RSA`, `ECDSA`, dan `HMAC`.
2. **Rencana Migrasi Hibrida**: Merekomendasikan implementasi hibrida (menggabungkan algoritma klasik ECC dengan algoritma PQC seperti Kyber-512) untuk mematuhi standar modern sembari menjaga kompatibilitas ke belakang (*backward compatibility*).
3. **Implementasi**: Menukar implementasi yang rentan dengan pustaka yang mendukung PQC (misalnya, OQS - Open Quantum Safe, atau *wrapper webcrypto* modern yang mendukung Kyber).
4. **Validasi**: Memastikan ukuran kunci dan ukuran *signature* algoritma PQC yang lebih besar tidak merusak skema database atau melampaui batas header HTTP.

## Integrasi Orkestrasi
- Menegakkan standar keamanan ekstrem berdampingan dengan `authentication-identity-expert`.
- Memperkeras enkripsi *payload* `doku-payment-gateway` dan `saas-billing` ke standar PQC kelas perbankan.
- Terintegrasi dengan `database-orm-expert` untuk memperbarui panjang skema kolom database (karena ukuran kunci PQC jauh lebih besar dari RSA).
