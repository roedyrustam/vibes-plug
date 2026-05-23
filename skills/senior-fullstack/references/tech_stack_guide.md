# Tech Stack Guide

## Overview
This reference guide details production-grade tech stack patterns, concrete typescript implementations, and scaling strategies for React 19, Next.js 15, PostgreSQL, and connection pooling.

---

## Production Patterns & Practices

### 1. Server-First Next.js 15 Architecture

Next.js 15 standardizes on React Server Components (RSC) by default. Data fetching is co-located with rendering, preventing waterfalls and saving significant client bandwidth.

#### Pattern: Modular Layout & Data Fetching

```tsx
// app/dashboard/layout.tsx
import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { workspaces } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkspaceCard } from '@/components/dashboard/workspace-card';

// Server-side dynamic fetching component
async function WorkspaceList() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const userWorkspaces = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.ownerId, userId));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {userWorkspaces.map((ws) => (
        <WorkspaceCard key={ws.id} workspace={ws} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Workspaces</h1>
      <Suspense fallback={<div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-32 w-full" /></div>}>
        <WorkspaceList />
      </Suspense>
    </div>
  );
}
```

---

### 2. High-Performance PostgreSQL & Connection Pooling

In a serverless runtime (e.g., Vercel / Netlify Functions), direct database connections spike exponentially during peak request loads. Employ transaction connection pooling (via Supabase Supavisor, PgBouncer, or Neon Serverless Driver) to recycle handles.

#### Pattern: Multi-Client Connection Configuration (`lib/db/index.ts`)

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Enforce single database client in development to prevent hot-reload socket exhaustion
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Use transaction pooling for high concurrent workloads
const connectionString = process.env.DATABASE_URL!;

const client = globalForDb.conn ?? postgres(connectionString, {
  max: process.env.DB_MAX_CONNECTIONS ? parseInt(process.env.DB_MAX_CONNECTIONS) : 10,
  prepare: false, // Set to false when utilizing Transaction poolers like pgBouncer/Supavisor
  idle_timeout: 20,
  connect_timeout: 10,
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = client;
}

export const db = drizzle(client, { schema });
```

---

## Technical Guidelines & Guidelines

### Type-Safe REST Contracts

Utilize Zod structures on both the client form schemas and the server-side Next.js route handlers to achieve full type safety across HTTP borders.

```typescript
// lib/validators/auth.ts
import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email('Please supply a valid email address'),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
  name: z.string().min(2, 'Name must contain at least 2 characters').optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;
```

```typescript
// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { SignupSchema } from '@/lib/validators/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hash } from 'bcrypt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = SignupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const { email, password, name } = result.data;

    // Check if user already exists
    const existing = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    });

    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);

    const [newUser] = await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    }).returning();

    return NextResponse.json({ id: newUser.id, email: newUser.email, name: newUser.name }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

---

## Anti-Patterns to Avoid

### 🚫 Client-Side Waterfall Loading
*Do not* chain individual API requests inside standard client-side `useEffect` declarations (e.g. Fetch user -> then fetch workspaces -> then fetch analytics).
*Instead:* Prefetch parallel states via Next.js server components or leverage dynamic `Promise.all` scopes before returning client modules.

### 🚫 Global Database Client Hot Exhaustion
*Do not* initialize fresh database connections inline inside database-consuming server functions.
*Instead:* Maintain a shared, global db handle scoped correctly to check development hot-reloads.

---

## Conclusion
Adhering to server-first Next.js models paired with secure pooled database connections will guarantee your fullstack applications execute fast, scale securely, and retain complete end-to-end type safety.
