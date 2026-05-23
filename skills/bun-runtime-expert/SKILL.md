---
name: bun-runtime-expert
description: "Expert skill for the Bun JavaScript/TypeScript runtime. Use when building, testing, or deploying applications with Bun, migrating from Node.js, or leveraging Bun's built-in APIs (Bun.serve, Bun.sql, Bun.s3, bun:test)."
author: "Roedy Rustam"
github: "https://github.com/roedyrustam/vibes-plug"
risk: safe
source: community
date_added: "2026-05-24"
---

# Bun Runtime Expert

Expert-level guidance for building high-performance applications with the Bun JavaScript/TypeScript runtime (v1.3+). Covers Bun's built-in HTTP server, database clients, bundler, test runner, package manager, and Node.js migration strategies.

## When to Use

- Use when scaffolding a new project with Bun as the runtime.
- Use when building HTTP servers or APIs with `Bun.serve()`.
- Use when querying databases with `Bun.sql` (PostgreSQL, MySQL, SQLite).
- Use when interacting with S3-compatible object storage via `Bun.s3`.
- Use when bundling frontend or backend code with `bun build`.
- Use when writing tests with `bun:test`.
- Use when migrating an existing Node.js project to Bun.
- Use when optimizing package installation speed or lockfile management.

---

## Core Architecture

### Why Bun?

Bun is a batteries-included JavaScript/TypeScript runtime that replaces Node.js, npm, Webpack/Vite, and Jest in a single binary:

| Capability | Bun Built-in | Node.js Equivalent |
|---|---|---|
| Runtime | `bun run` | `node` |
| Package Manager | `bun install` | `npm` / `pnpm` / `yarn` |
| Bundler | `bun build` | Webpack / Vite / esbuild |
| Test Runner | `bun test` | Jest / Vitest |
| HTTP Server | `Bun.serve()` | Express / Fastify |
| SQL Client | `Bun.sql` | `pg` / `mysql2` / `better-sqlite3` |
| S3 Client | `Bun.s3` | `@aws-sdk/client-s3` |
| Redis Client | Built-in | `ioredis` |
| TypeScript | Native (zero config) | `ts-node` / `tsx` |
| `.env` loading | Native | `dotenv` |

---

## Quick Start

### 1. Install Bun

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version
```

### 2. Initialize a New Project

```bash
bun init
```

This generates `package.json`, `tsconfig.json`, and an `index.ts` entry point. TypeScript works out of the box with zero configuration.

### 3. Install Dependencies

```bash
# Install all dependencies (10-100x faster than npm)
bun install

# Add a package
bun add hono zod drizzle-orm

# Add dev dependency
bun add -d @types/bun vitest
```

---

## Bun.serve() — High-Performance HTTP Server

`Bun.serve()` is a zero-dependency HTTP server with built-in TLS, WebSocket support, and hot module reloading.

### Basic HTTP Server

```typescript
// server.ts
Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === '/api/health') {
      return Response.json({ status: 'ok', runtime: 'bun' });
    }

    if (url.pathname === '/api/users' && req.method === 'POST') {
      return handleCreateUser(req);
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log('🚀 Server running at http://localhost:3000');

async function handleCreateUser(req: Request): Promise<Response> {
  const body = await req.json();
  // validate & persist...
  return Response.json({ id: crypto.randomUUID(), ...body }, { status: 201 });
}
```

### WebSocket Server

```typescript
Bun.serve({
  port: 3000,
  fetch(req, server) {
    // Upgrade HTTP to WebSocket
    if (server.upgrade(req)) {
      return; // Upgrade succeeded
    }
    return new Response('Upgrade failed', { status: 500 });
  },
  websocket: {
    open(ws) {
      console.log('Client connected');
      ws.subscribe('chat');
    },
    message(ws, message) {
      // Broadcast to all subscribers
      ws.publish('chat', `User: ${message}`);
    },
    close(ws) {
      console.log('Client disconnected');
    },
  },
});
```

### Using Hono Framework (Recommended for APIs)

```typescript
// server.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono();

app.use('/*', cors());

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

app.get('/api/health', (c) => c.json({ status: 'ok' }));

app.post('/api/users', zValidator('json', createUserSchema), async (c) => {
  const data = c.req.valid('json');
  // persist user...
  return c.json({ id: crypto.randomUUID(), ...data }, 201);
});

export default app; // Bun auto-detects default export as Bun.serve handler
```

---

## Bun.sql — Unified Database Client

Zero-dependency SQL client supporting PostgreSQL, MySQL/MariaDB, and SQLite via tagged template literals.

### PostgreSQL

```typescript
import { sql } from 'bun';

// Connection is automatically configured from DATABASE_URL env var
// or you can pass options explicitly:
// const sql = new Bun.SQL({ url: 'postgres://user:pass@localhost:5432/mydb' });

// Simple query
const users = await sql`SELECT * FROM users WHERE active = ${true}`;

// Insert with returning
const [newUser] = await sql`
  INSERT INTO users (email, name) 
  VALUES (${email}, ${name}) 
  RETURNING *
`;

// Transaction
await sql.begin(async (tx) => {
  const [workspace] = await tx`
    INSERT INTO workspaces (name, slug) VALUES (${name}, ${slug}) RETURNING *
  `;
  await tx`
    INSERT INTO workspace_members (workspace_id, user_id, role) 
    VALUES (${workspace.id}, ${userId}, 'admin')
  `;
});
```

### SQLite (Embedded)

```typescript
import { Database } from 'bun:sqlite';

const db = new Database('app.db');

// WAL mode for better concurrent read performance
db.run('PRAGMA journal_mode = WAL');

// Prepared statements (fast & safe)
const getUser = db.prepare('SELECT * FROM users WHERE id = ?');
const user = getUser.get(userId);

// Batch insert with transaction
const insertUser = db.prepare('INSERT INTO users (email, name) VALUES (?, ?)');
const insertMany = db.transaction((users: { email: string; name: string }[]) => {
  for (const u of users) insertUser.run(u.email, u.name);
});

insertMany([
  { email: 'a@test.com', name: 'Alice' },
  { email: 'b@test.com', name: 'Bob' },
]);
```

---

## Bun.s3 — Object Storage Client

Built-in S3-compatible client for AWS S3, Cloudflare R2, MinIO, and other providers.

```typescript
import { s3 } from 'bun';

// Configure via env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET

// Upload a file
const file = Bun.file('./report.pdf');
await s3.write('reports/2026/q1.pdf', file);

// Download a file
const data = await s3.file('reports/2026/q1.pdf').text();

// Generate presigned URL
const url = s3.presign('reports/2026/q1.pdf', {
  expiresIn: 3600, // 1 hour
});

// List objects
const objects = await s3.list({ prefix: 'reports/' });

// Delete
await s3.delete('reports/old.pdf');
```

---

## bun build — Bundler

Bun's built-in bundler replaces Webpack, Vite, and esbuild for most use cases.

### Bundle for Production

```bash
# Bundle a single entry point
bun build ./src/index.ts --outdir ./dist --minify

# Bundle with multiple entry points
bun build ./src/index.ts ./src/worker.ts --outdir ./dist --splitting --minify

# Target browser
bun build ./src/app.tsx --outdir ./public/js --target browser --minify
```

### Programmatic Build API

```typescript
const result = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'bun', // 'bun' | 'browser' | 'node'
  minify: true,
  splitting: true,
  sourcemap: 'external',
  external: ['postgres'], // Don't bundle native modules
});

if (!result.success) {
  console.error('Build failed:');
  for (const log of result.logs) {
    console.error(log);
  }
}
```

### HTML Imports (Zero-Config Frontend)

```bash
# Serve an HTML file with auto-bundled JS/CSS
bun ./index.html
```

Bun automatically transpiles, bundles, and serves all referenced `<script>` and `<link>` tags, including React/JSX support.

---

## bun:test — Test Runner

Jest-compatible test runner with native TypeScript support, lifecycle hooks, and snapshot testing.

### Writing Tests

```typescript
// __tests__/math.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

describe('Math utilities', () => {
  it('should add numbers correctly', () => {
    expect(1 + 2).toBe(3);
  });

  it('should handle floating point', () => {
    expect(0.1 + 0.2).toBeCloseTo(0.3);
  });
});
```

### HTTP API Integration Tests

```typescript
// __tests__/api.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../src/server';

describe('Users API', () => {
  let server: ReturnType<typeof Bun.serve>;

  beforeAll(() => {
    server = Bun.serve({ port: 0, fetch: app.fetch }); // Random port
  });

  afterAll(() => {
    server.stop();
  });

  it('POST /api/users should create a user', async () => {
    const res = await fetch(`http://localhost:${server.port}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', name: 'Test User' }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('id');
    expect(body.email).toBe('test@example.com');
  });

  it('GET /api/health should return ok', async () => {
    const res = await fetch(`http://localhost:${server.port}/api/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
  });
});
```

### Running Tests

```bash
# Run all tests
bun test

# Run specific file
bun test __tests__/api.test.ts

# Watch mode
bun test --watch

# With coverage
bun test --coverage

# Concurrent tests
bun test --concurrency 4
```

---

## Node.js Migration Guide

### Step-by-Step Migration

1. **Replace runtime:** Change `node` → `bun` in your scripts.
2. **Replace package manager:** Change `npm install` → `bun install`.
3. **Remove unnecessary devDependencies:**
   - `typescript` / `ts-node` / `tsx` → Bun handles TypeScript natively.
   - `dotenv` → Bun loads `.env` automatically.
   - `jest` / `vitest` → Use `bun:test`.
   - `esbuild` / `webpack` → Use `bun build`.
   - `nodemon` → Use `bun --watch`.

4. **Update `package.json` scripts:**

```json
{
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "build": "bun build ./src/index.ts --outdir ./dist --target bun --minify",
    "test": "bun test",
    "test:watch": "bun test --watch"
  }
}
```

5. **Check Node.js API compatibility:** Most `node:*` APIs are supported. Check [bun.sh/docs/runtime/nodejs-apis](https://bun.sh/docs/runtime/nodejs-apis) for the compatibility matrix.

### Common Migration Patterns

```typescript
// Node.js (before)
import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ ok: true }));
app.listen(3000);

// Bun (after) — zero dependencies
Bun.serve({
  port: 3000,
  fetch(req) {
    if (new URL(req.url).pathname === '/health') {
      return Response.json({ ok: true });
    }
    return new Response('Not Found', { status: 404 });
  },
});
```

```typescript
// Node.js file read (before)
import fs from 'node:fs/promises';
const content = await fs.readFile('./data.json', 'utf-8');

// Bun file read (after) — also supports node:fs
const content = await Bun.file('./data.json').text();
const json = await Bun.file('./data.json').json();
```

---

## Project Structure (Recommended)

```
my-bun-app/
├── src/
│   ├── index.ts              # Entry point (Bun.serve or Hono app)
│   ├── routes/               # Route handlers
│   ├── middleware/            # Auth, CORS, rate limiting
│   ├── db/
│   │   ├── schema.ts         # Drizzle ORM schema
│   │   ├── migrate.ts        # Migration runner
│   │   └── index.ts          # Database client (Bun.sql or Drizzle)
│   ├── services/             # Business logic
│   └── utils/                # Shared utilities
├── __tests__/                # bun:test files
├── .env                      # Environment variables (auto-loaded)
├── bunfig.toml               # Bun configuration
├── tsconfig.json             # TypeScript config
├── bun.lock                  # Lockfile (JSONC-based, human-readable)
└── package.json
```

### bunfig.toml Configuration

```toml
[install]
# Use exact versions by default
exact = true

[test]
# Enable coverage by default
coverage = true
coverageDir = "coverage"

[run]
# Auto-reload on file changes in development
watch = true
```

---

## Best Practices

### Performance
- ✅ Use `Bun.serve()` directly or Hono for HTTP — avoid Express (slower compat layer).
- ✅ Use `Bun.sql` with tagged templates for parameterized, injection-safe queries.
- ✅ Use `Bun.file()` for file I/O — it returns a lazy `BunFile` that streams efficiently.
- ✅ Use `bun build --minify --splitting` for production frontend bundles.
- ✅ Use `--watch` flag during development instead of `nodemon`.

### Security
- ✅ Always parameterize queries via template literals in `Bun.sql` (automatically prevents SQL injection).
- ✅ Validate all request bodies with Zod before processing.
- ✅ Use Bun's built-in package security scanner to audit dependencies.
- ❌ Never concatenate user input into SQL strings manually.

### Testing
- ✅ Use `bun:test` — it's Jest-compatible and significantly faster.
- ✅ Use `Bun.serve({ port: 0 })` in tests for random port allocation (prevents port conflicts).
- ✅ Run `bun test --coverage` to track coverage metrics.

---

## Troubleshooting

**Problem:** `bun install` fails with native module compilation errors  
**Solution:** Some Node.js native addons (e.g., `bcrypt`, `sharp`) require specific platform binaries. Use `bun add sharp --force` or switch to pure-JS alternatives (`bcryptjs` instead of `bcrypt`).

**Problem:** TypeScript types not recognized for Bun APIs  
**Solution:** Add `"types": ["bun-types"]` to your `tsconfig.json` `compilerOptions`, or run `bun add -d @types/bun`.

**Problem:** Module not found errors for `node:*` imports  
**Solution:** Bun supports most `node:*` prefixed imports. Check the [compatibility table](https://bun.sh/docs/runtime/nodejs-apis). For unsupported modules, use Bun's native alternatives (e.g., `Bun.file()` instead of `fs`).

**Problem:** Hot reload not working with `--watch`  
**Solution:** Ensure you're running `bun --watch src/index.ts` (not `bun run --watch`). The `--watch` flag must come before the file path.

---

## Limitations
- Use this skill only when the task involves the Bun runtime specifically.
- Bun's Node.js compatibility is extensive but not 100%. Always verify critical `node:*` API usage against the official compatibility matrix.
- Some npm packages with native C/C++ bindings may require platform-specific handling.
- Stop and ask for clarification if the user's project has strict Node.js-only requirements.
