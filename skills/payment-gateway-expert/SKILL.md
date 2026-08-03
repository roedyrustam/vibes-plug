---
name: payment-gateway-expert
description: "Expert guide for integrating payment gateways (Stripe, PayPal, Xendit, Midtrans, DOKU) and secure webhooks into SaaS platforms / Panduan ahli integrasi payment gateway dan webhook aman."
author: "Antigravity"
---

# Payment Gateway Expert / Ahli Payment Gateway

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for integrating major payment gateways (Stripe, PayPal, Xendit, Midtrans, DOKU) into modern SaaS platforms. Covers checkout flows, secure webhook handling, subscription management, and synchronization with local databases.

### Instructions
- **Security First**: Always validate webhook signatures before processing any payment event. Never trust client-side data for prices or payment status. For DOKU, ensure signature components (like request target) are arranged strictly according to documentation.
- **Idempotency**: Implement idempotency keys for all payment creation requests to avoid duplicate charges. Webhook handlers must also be idempotent. For DOKU, include a unique `Request-Id` header.
- **State Synchronization**: Ensure the local database (e.g., PostgreSQL, Supabase) is updated immediately and transactionally upon receiving successful webhook events.
- **Subscription Management**: Map the provider's subscription statuses (e.g., `active`, `past_due`, `canceled`) accurately to the SaaS platform's internal state machine.
- **Testing**: Use sandbox/test environments provided by the gateways and simulate webhooks using CLI tools (like Stripe CLI) during development.

### Trigger Conditions
Active whenever the user is working on billing integration, payment checkout, webhook handling, or integrating platforms like PayPal, Stripe, Xendit, Midtrans, or DOKU.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk mengintegrasikan payment gateway utama (Stripe, PayPal, Xendit, Midtrans, DOKU) ke platform SaaS modern. Mencakup alur checkout, penanganan webhook yang aman, manajemen langganan, dan sinkronisasi dengan database lokal.

### Instruksi
- **Keamanan Utama**: Selalu validasi signature webhook sebelum memproses event pembayaran apa pun. Jangan pernah mempercayai data dari sisi klien untuk harga atau status pembayaran. Untuk DOKU, pastikan komponen signature (seperti request target) disusun secara ketat sesuai dokumentasi.
- **Idempotensi**: Implementasikan kunci idempotensi (idempotency keys) untuk semua permintaan pembuatan pembayaran untuk menghindari tagihan ganda. Handler webhook juga harus idempoten. Untuk DOKU, sertakan header `Request-Id` unik.
- **Sinkronisasi State**: Pastikan database lokal (misal: PostgreSQL, Supabase) diperbarui secara langsung dan transaksional saat menerima event webhook yang berhasil.
- **Manajemen Langganan**: Petakan status langganan dari provider (misal: `active`, `past_due`, `canceled`) secara akurat ke state machine internal platform SaaS.
- **Pengujian**: Gunakan lingkungan sandbox/test yang disediakan oleh gateway dan simulasikan webhook menggunakan tool CLI (seperti Stripe CLI) selama pengembangan.

### Kondisi Pemicu
Aktif setiap kali pengguna sedang mengerjakan integrasi billing, checkout pembayaran, penanganan webhook, atau mengintegrasikan platform seperti PayPal, Stripe, Xendit, Midtrans, atau DOKU.
