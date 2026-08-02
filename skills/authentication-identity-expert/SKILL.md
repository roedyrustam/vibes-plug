---
name: authentication-identity-expert
description: "Expert guide for implementing secure authentication, authorization (RBAC/ABAC), OAuth2, and identity management (Clerk, Auth.js, Supabase Auth) / Panduan ahli untuk autentikasi dan otorisasi."
author: "Antigravity"
---

# Authentication & Identity Expert / Ahli Autentikasi & Identitas

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for implementing robust and secure authentication and authorization systems in web and mobile applications. Covers JWT, Session management, OAuth2 providers, Identity as a Service (Clerk, Supabase Auth, Auth0), and Role/Attribute-Based Access Control (RBAC/ABAC).

### Instructions
- **Never Roll Your Own Crypto**: Always use established libraries (like `bcrypt` or `argon2`) for hashing passwords if not using an Identity Provider.
- **Session & Token Management**: Keep JWT lifetimes short (e.g., 15 minutes) and use secure, HttpOnly, SameSite cookies for refresh tokens to prevent XSS attacks.
- **OAuth2 & SSO Integration**: When implementing OAuth, strictly validate the `state` parameter to mitigate CSRF attacks during the callback phase.
- **Authorization (RBAC/ABAC)**: Enforce authorization checks at the server level (API routes, database queries), not just on the UI layer. Never expose sensitive data based on client-side roles alone.
- **MFA (Multi-Factor Authentication)**: Recommend and implement MFA/2FA for administrative or high-privilege accounts.

### Trigger Conditions
Active whenever the user is working on login/signup flows, session management, OAuth integration, role-based access control, or integrating Auth.js, Clerk, Supabase Auth, or Auth0.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk mengimplementasikan sistem autentikasi dan otorisasi yang aman dan tangguh pada aplikasi web dan mobile. Mencakup JWT, manajemen Sesi, penyedia OAuth2, Identity as a Service (Clerk, Supabase Auth, Auth0), dan Role/Attribute-Based Access Control (RBAC/ABAC).

### Instruksi
- **Jangan Membuat Kriptografi Sendiri**: Selalu gunakan library standar (seperti `bcrypt` atau `argon2`) untuk hashing password jika tidak menggunakan penyedia identitas (IdP).
- **Manajemen Sesi & Token**: Jaga masa aktif JWT tetap singkat (misal: 15 menit) dan gunakan cookie *HttpOnly, SameSite* yang aman untuk token *refresh* guna mencegah serangan XSS.
- **Integrasi OAuth2 & SSO**: Saat mengimplementasikan OAuth, validasi parameter `state` secara ketat untuk memitigasi serangan CSRF selama fase callback.
- **Otorisasi (RBAC/ABAC)**: Terapkan pengecekan otorisasi pada level server (API route, query database), bukan hanya pada lapisan UI. Jangan pernah mengekspos data sensitif hanya berdasarkan *role* di sisi klien.
- **MFA (Multi-Factor Authentication)**: Rekomendasikan dan implementasikan MFA/2FA untuk akun administratif atau hak akses tinggi.

### Kondisi Pemicu
Aktif setiap kali pengguna sedang mengerjakan alur login/signup, manajemen sesi, integrasi OAuth, role-based access control, atau mengintegrasikan Auth.js, Clerk, Supabase Auth, atau Auth0.
