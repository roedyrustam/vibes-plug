---
name: authentication-identity-expert
description: "Authentication, authorization (RBAC/ABAC), OAuth2, Clerk, and Auth.js / Autentikasi, otorisasi (RBAC/ABAC), OAuth2, Clerk, dan Auth.js."
author: "Roedy Rustam"
version: "4.4.2"

---

# Authentication & Identity Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 2 - Foundation, Auth & Identity Architecture) to implement secure user authentication.
- **Downstream Cooperating Skills**:
  - `saas-architect` — B2B multi-tenant auth workflows, organization switching, and onboarding.
  - `saas-multi-tenant` — RBAC permission matrices, custom session claims, and workspace member access.
  - `supabase-security-expert` — Supabase SSR auth, PKCE token cookies, and RLS policies.
  - `firebase-security-expert` — Firebase Auth, custom token minting, and security rules.
  - `js-backend-expert` — Authorization middleware, JWT token verification, and session stores.
  - `production-ready-hardener` — Pre-release auth security audits, rate-limiting, and CSP headers.
  - `session-memory-manager` — Store authentication topology decisions and credential schemas.

### Description
Production-grade guide for implementing secure authentication, authorization, and identity management in modern web and mobile applications. Covers **Clerk**, **Supabase Auth**, **Auth.js v5**, **Better Auth**, JWT patterns, OAuth 2.1, PKCE flows, RBAC/ABAC, passkeys (WebAuthn), and MFA implementations for React 19 / Next.js 15 stacks.

### Trigger Conditions
- Working on login/signup flows, session management, or OAuth integrations.
- Integrating Clerk, Supabase Auth, Auth.js v5, Better Auth, or Auth0.
- Implementing RBAC (Role-Based Access Control) or ABAC.
- Setting up WebAuthn/Passkeys, MFA/2FA, or SSO.
- Securing Next.js App Router routes with middleware-based auth guards.

---

### Identity Provider Selection Guide

| Provider | Best For | Key Strength | Pricing Model |
|---|---|---|---|
| **Clerk** | New SaaS products | Best developer DX, prebuilt UI components, orgs/teams out-of-the-box | Per MAU (free up to 10k) |
| **Supabase Auth** | Existing Supabase apps | Native RLS integration, multi-provider OAuth, generous free tier | Included with Supabase |
| **Auth.js v5** | Self-hosted control | Full data ownership, zero vendor lock-in, Edge-compatible | 100% Free / OSS |
| **Better Auth** | Modern TS-first apps | Comprehensive TypeScript plugin ecosystem, 2FA, passkeys | 100% Free / OSS |

---

### Technical Guidelines & Recipes

#### 1. Password Hashing Standards
```typescript
import argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}
```

#### 2. Short-Lived JWT + Refresh Token Rotation
```typescript
// Access token: 15 minutes, in memory
// Refresh token: 7-30 days, HttpOnly, Secure, SameSite=Strict cookie
```

#### 3. OAuth 2.1 + PKCE
```typescript
import { generateCodeVerifier, generateCodeChallenge } from 'oslo/oauth2';

const codeVerifier = generateCodeVerifier();
const codeChallenge = await generateCodeChallenge(codeVerifier);
sessionStorage.setItem('pkce_verifier', codeVerifier);

const authUrl = new URL('https://provider.com/oauth/authorize');
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');
authUrl.searchParams.set('state', cryptoRandomState);
```

#### 4. Clerk — Next.js 15 Integration
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhooks(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
```

#### 5. Supabase Auth — RLS Integration
> For detailed Supabase Auth SSR setup, PKCE session cookie handling, and PostgreSQL Row-Level Security (RLS) policies, delegate directly to `supabase-security-expert`.

#### 6. Auth.js v5 (Next.js App Router)
```typescript
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub],
  session: { strategy: 'database' },
});
```

#### 7. RBAC — Role-Based Access Control (Server-Side)
```typescript
type Role = 'viewer' | 'editor' | 'admin' | 'super_admin';

const permissions: Record<Role, string[]> = {
  viewer: ['read:posts'],
  editor: ['read:posts', 'write:posts', 'delete:own_posts'],
  admin: ['read:posts', 'write:posts', 'delete:any_post', 'manage:users'],
  super_admin: ['*'],
};

export function hasPermission(userRole: Role, required: string): boolean {
  const allowed = permissions[userRole] || [];
  return allowed.includes('*') || allowed.includes(required);
}
```

#### 8. WebAuthn / Passkeys (2026 Standard)
```typescript
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';

export async function getPasskeyRegistrationOptions(userId: string, userEmail: string) {
  return generateRegistrationOptions({
    rpName: 'My App',
    rpID: 'myapp.com',
    userID: new TextEncoder().encode(userId),
    userName: userEmail,
    attestationType: 'none',
    authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
  });
}
```

### Production Security Checklist
- [ ] Passwords hashed with argon2id or bcrypt (cost >= 12).
- [ ] JWT access token expires in <= 15 minutes; refresh token in HttpOnly cookie.
- [ ] PKCE enforced for all public OAuth clients.
- [ ] Authorization enforced on server actions and API routes (never UI only).
- [ ] Rate limiting on login and signup endpoints.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec authentication-identity-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 2 - Fondasi, Autentikasi & Arsitektur Identitas) untuk mengimplementasikan autentikasi pengguna yang aman.
- **Skill Hilir & Kerja Sama**:
  - `saas-architect` — Alur kerja autentikasi B2B SaaS, perpindahan organisasi, dan onboarding.
  - `saas-multi-tenant` — Matriks izin RBAC, custom claims sesi, dan akses anggota workspace.
  - `supabase-security-expert` — Konfigurasi otentikasi Supabase SSR, cookie PKCE, dan kebijakan RLS.
  - `firebase-security-expert` — Firebase Auth, custom token minting, dan security rules.
  - `js-backend-expert` — Middleware otorisasi, verifikasi token JWT, dan session store.
  - `production-ready-hardener` — Audit keamanan autentikasi pra-rilis, rate-limiting, dan header CSP.
  - `session-memory-manager` — Menyimpan keputusan topologi autentikasi dan skema kredensial.

### Deskripsi
Panduan tingkat produksi untuk implementasi autentikasi aman, otorisasi (RBAC/ABAC), dan manajemen identitas pengguna pada aplikasi web dan mobile modern. Mencakup integrasi **Clerk**, **Supabase Auth**, **Auth.js v5 (NextAuth)**, **Better Auth**, OAuth 2.1 dengan alur PKCE, rotasi Refresh Token HttpOnly, Passkeys (WebAuthn), dan Multi-Factor Authentication (MFA) untuk stack React 19 / Next.js 15.

### Rekomendasi Pemilihan Identity Provider

| Provider | Pilihan Terbaik Untuk | Keunggulan Utama | Model Harga |
|---|---|---|---|
| **Clerk** | Produk SaaS baru & B2B | DX terbaik, UI bawaan siap pakai, manajemen tim/organisasi instan | Per MAU (gratis hingga 10.000 pengguna) |
| **Supabase Auth** | Aplikasi dengan database Supabase | Integrasi native Row-Level Security (RLS), OAuth multi-provider | Termasuk dalam kuota Supabase |
| **Auth.js v5** | Aplikasi mandiri (*Self-hosted*) | Kepemilikan data penuh, zero vendor lock-in, kompatibel Edge | 100% Gratis / Open-Source |
| **Better Auth** | Proyek TypeScript-first modern | Ekosistem plugin komprehensif, 2FA, passkeys bawaan | 100% Gratis / Open-Source |

---

### Resep & Pedoman Teknis Implementasi

#### 1. Standar Hashing Password (Argon2id)
```typescript
import argon2 from 'argon2';

export async function hashPasswordAman(passwordPolos: string): Promise<string> {
  return argon2.hash(passwordPolos, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

export async function verifikasiPassword(hashTersimpan: string, passwordInput: string): Promise<boolean> {
  return argon2.verify(hashTersimpan, passwordInput);
}
```

#### 2. Clerk Middleware pada Next.js 15 App Router
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Definisikan rute yang dapat diakses publik tanpa login
const rutePublik = createRouteMatcher([
  '/',
  '/masuk(.*)',
  '/daftar(.*)',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!rutePublik(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

#### 3. Auth.js v5 (NextAuth) dengan Adapter Database Drizzle ORM
```typescript
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub({ clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET }),
    Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
```

#### 4. Kontrol Akses Berbasis Peran (RBAC) di Sisi Server
```typescript
export type PeranPengguna = 'tamu' | 'anggota' | 'manajer' | 'administrator';

const matriksIzin: Record<PeranPengguna, string[]> = {
  tamu: ['baca:artikel'],
  anggota: ['baca:artikel', 'buat:komentar'],
  manajer: ['baca:artikel', 'buat:komentar', 'kelola:konten'],
  administrator: ['*'],
};

export function validasiIzin(peran: PeranPengguna, izinYangDibutuhkan: string): boolean {
  const daftarIzin = matriksIzin[peran] || [];
  return daftarIzin.includes('*') || daftarIzin.includes(izinYangDibutuhkan);
}
```

### Checklist Keamanan Otentikasi Produksi
- [ ] Password di-hash menggunakan `argon2id` atau `bcrypt` dengan work factor minimal 12.
- [ ] Access token berumur pendek (maksimal 15 menit) disimpan di memori runtime.
- [ ] Refresh token disimpan di cookie berflag `HttpOnly`, `Secure`, dan `SameSite=Strict` dengan rotasi token.
- [ ] Alur OAuth 2.1 publik wajib menerapkan `PKCE` (Proof Key for Code Exchange) dengan challenge SHA-256.
- [ ] Otorisasi hak akses divalidasi ketat pada Server Action dan API Route (bukan sekadar menyembunyikan tombol UI).
- [ ] Proteksi brute-force dengan pembatasan laju (*Rate Limiting*) pada endpoint login dan pendaftaran.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec authentication-identity-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
