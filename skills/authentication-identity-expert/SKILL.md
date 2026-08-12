---
name: authentication-identity-expert
description: "Expert guide for implementing secure authentication, authorization (RBAC/ABAC), OAuth2, and identity management (Clerk, Auth.js, Supabase Auth) / Panduan ahli untuk autentikasi dan otorisasi."
author: vibes-plug-swarm
---

# Authentication & Identity Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade guide for implementing secure authentication, authorization, and identity management in modern web and mobile applications. Covers **Clerk**, **Supabase Auth**, **Auth.js v5**, **Better Auth**, JWT patterns, OAuth 2.1, PKCE flows, RBAC/ABAC, passkeys (WebAuthn), and MFA implementation for React 19 / Next.js 15 stacks.

### Trigger Conditions
- Working on login/signup flows, session management, or OAuth integration.
- Integrating **Clerk**, **Supabase Auth**, **Auth.js v5**, **Better Auth**, or **Auth0**.
- Implementing **Role-Based Access Control (RBAC)** or **Attribute-Based Access Control (ABAC)**.
- Setting up **WebAuthn/Passkeys**, **MFA/2FA**, or **SSO**.
- Securing Next.js App Router routes with middleware-based auth guards.
- Implementing **OAuth 2.1** flows with PKCE for SPAs or mobile apps.

---

### Identity Provider Selection Guide (2026)

| Provider | Best For | Key Strength |
|---|---|---|
| **Clerk** | SaaS, B2B apps | Built-in organizations, roles, MFA, UI components |
| **Supabase Auth** | Supabase-powered apps | RLS integration, social login, SSO |
| **Auth.js v5** | Next.js self-hosted | Flexible adapters, edge-compatible |
| **Better Auth** | TypeScript-first self-hosted | Modern DX, built-in 2FA, org management |
| **Auth0** | Enterprise, compliance | Enterprise SSO, compliance (SOC2, HIPAA) |

**Recommendation**: Use **Clerk** for most new SaaS apps (best DX). Use **Supabase Auth** if you're already using Supabase. Use **Better Auth** for full control without vendor lock-in.

---

### Core Security Principles

#### 1. Never Roll Your Own Crypto
- Use `argon2id` (preferred) or `bcrypt` for password hashing — **never MD5, SHA1, or plain SHA256**.
- Use battle-tested libraries: `@node-rs/argon2`, `bcryptjs`.
- Minimum: bcrypt cost factor ≥12, argon2id memory ≥64MB.

#### 2. JWT Best Practices
```typescript
// ✅ Short-lived access tokens + HttpOnly refresh tokens
const ACCESS_TOKEN_EXPIRY = '15m';   // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d';   // 7 days

// ✅ Store refresh tokens in HttpOnly, Secure, SameSite=Strict cookies
res.cookie('refresh_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
});

// ❌ Never store tokens in localStorage (XSS vulnerable)
// ❌ Never put sensitive data in JWT payload (it's base64 decoded, not encrypted)
```

#### 3. OAuth 2.1 + PKCE (For SPAs & Mobile)
```typescript
// PKCE flow — required for public clients in OAuth 2.1
import { generateCodeVerifier, generateCodeChallenge } from 'oslo/oauth2';

const codeVerifier = generateCodeVerifier(); // 43-128 char random string
const codeChallenge = await generateCodeChallenge(codeVerifier); // SHA-256 hash

// Store codeVerifier in sessionStorage (NOT localStorage) during redirect
sessionStorage.setItem('pkce_verifier', codeVerifier);

// Auth URL includes challenge
const authUrl = new URL('https://provider.com/oauth/authorize');
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');
authUrl.searchParams.set('state', cryptoRandomState); // CSRF protection
```

#### 4. Clerk — Next.js 15 Integration
```typescript
// middleware.ts — protect routes at the edge
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect(); // Redirects to sign-in if unauthenticated
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
```

```typescript
// Server Component — get user on the server
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId, orgId, orgRole } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await currentUser();
  return <div>Welcome, {user?.firstName}!</div>;
}
```

#### 5. Supabase Auth — RLS Integration
```typescript
// Create Supabase client with user session
import { createServerClient } from '@supabase/ssr';

export async function createSupabaseServerClient(cookieStore: ReadonlyRequestCookies) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        ),
      },
    }
  );
}

// RLS in PostgreSQL — users can only access their own rows
-- CREATE POLICY "Users can only see own data" ON profiles
-- FOR ALL USING (auth.uid() = user_id);
```

#### 6. Auth.js v5 (Next.js App Router)
```typescript
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub,
    // Add more providers...
  ],
  session: { strategy: 'database' }, // or 'jwt'
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith('/dashboard');
      if (isProtected && !isLoggedIn) return false;
      return true;
    },
  },
});
```

#### 7. RBAC — Role-Based Access Control (Server-Side)
```typescript
// ✅ Always enforce roles server-side — never rely on client UI alone
type Role = 'viewer' | 'editor' | 'admin' | 'super_admin';

const permissions: Record<Role, string[]> = {
  viewer: ['read:posts'],
  editor: ['read:posts', 'write:posts', 'delete:own_posts'],
  admin: ['read:posts', 'write:posts', 'delete:any_post', 'manage:users'],
  super_admin: ['*'], // All permissions
};

function hasPermission(userRole: Role, required: string): boolean {
  const allowed = permissions[userRole];
  return allowed.includes('*') || allowed.includes(required);
}

// In Server Action / API Route
const { userId } = await auth();
const user = await db.query.users.findFirst({ where: eq(users.id, userId) });

if (!hasPermission(user.role, 'delete:any_post')) {
  throw new Error('Forbidden');
}
```

#### 8. WebAuthn / Passkeys (2026 Standard)
```typescript
// Using SimpleWebAuthn library
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';

// Registration — generate challenge
const options = await generateRegistrationOptions({
  rpName: 'My App',
  rpID: 'myapp.com',
  userName: user.email,
  attestationType: 'none',
  authenticatorSelection: {
    residentKey: 'preferred',   // Enables passkeys
    userVerification: 'preferred',
  },
});

// Store challenge in session, send options to client
await redis.setex(`webauthn:${userId}`, 60, JSON.stringify(options.challenge));
```

### Security Checklist
- [ ] Passwords hashed with argon2id (cost ≥64MB) or bcrypt (cost ≥12).
- [ ] JWT access tokens expire in ≤15 minutes; refresh in HttpOnly cookies.
- [ ] OAuth state parameter validated on callback (CSRF protection).
- [ ] PKCE enforced for all public OAuth clients.
- [ ] All authorization checks enforced server-side (not UI-only).
- [ ] Admin routes protected by both auth middleware AND role check.
- [ ] MFA offered (TOTP/WebAuthn) for privileged accounts.
- [ ] Refresh token rotation on every use (detect theft).
- [ ] Rate limiting on login/signup endpoints (prevent brute force).
- [ ] Account lockout after N failed attempts.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk mengimplementasikan autentikasi, otorisasi, dan manajemen identitas yang aman pada aplikasi web dan mobile modern. Mencakup **Clerk**, **Supabase Auth**, **Auth.js v5**, **Better Auth**, pola JWT, OAuth 2.1, alur PKCE, RBAC/ABAC, passkey (WebAuthn), dan implementasi MFA untuk stack React 19 / Next.js 15.

### Kondisi Pemicu
- Mengerjakan alur login/signup, manajemen sesi, atau integrasi OAuth.
- Mengintegrasikan Clerk, Supabase Auth, Auth.js v5, Better Auth, atau Auth0.
- Mengimplementasikan RBAC (Role-Based Access Control) atau ABAC.
- Menyiapkan WebAuthn/Passkeys, MFA/2FA, atau SSO.
- Mengamankan rute Next.js App Router dengan auth guard berbasis middleware.

### Panduan Teknis

#### 1. Prinsip Keamanan Inti
- **Jangan buat kriptografi sendiri**: Gunakan `argon2id` atau `bcrypt` untuk hashing password.
- **JWT berumur pendek**: Access token ≤15 menit, refresh token di HttpOnly cookie.
- **PKCE wajib** untuk semua public OAuth client (SPA, mobile).
- **Validasi state OAuth** di callback untuk proteksi CSRF.

#### 2. Pemilihan Identity Provider
- **Clerk**: Terbaik untuk SaaS baru — DX terbaik, komponen UI siap pakai, manajemen organisasi.
- **Supabase Auth**: Ideal jika sudah pakai Supabase — integrasi langsung dengan RLS.
- **Auth.js v5**: Self-hosted, fleksibel, edge-compatible untuk Next.js.
- **Better Auth**: TypeScript-first, kontrol penuh tanpa vendor lock-in.

#### 3. RBAC di Sisi Server
Selalu terapkan pengecekan role di server (Server Action, API route, middleware) — **jangan hanya di UI**. Gunakan tabel permission yang memetakan setiap role ke daftar aksi yang diizinkan.

#### 4. WebAuthn / Passkeys
Gunakan library `@simplewebauthn/server` untuk registrasi dan verifikasi passkey. Simpan challenge di Redis dengan TTL pendek (60 detik) untuk mencegah replay attack.

#### 5. Checklist Keamanan
- Password di-hash dengan argon2id atau bcrypt.
- JWT access token expire ≤15 menit; refresh di HttpOnly cookie.
- State OAuth divalidasi saat callback.
- PKCE diterapkan untuk semua klien publik OAuth.
- Pengecekan otorisasi dilakukan di server, bukan hanya UI.
- MFA ditawarkan untuk akun privileged.
- Rate limiting di endpoint login/signup.
- Rotasi refresh token setiap kali digunakan.


## Orchestration & Integration
- Connects to other backend skills as part of the orchestration flow.
