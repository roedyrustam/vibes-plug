# Development Workflows

## Overview
This reference guide details production-grade development workflows, automated testing matrices, and CI/CD pipelines for senior fullstack applications.

---

## Production Workflows & Pipelines

### 1. High-Fidelity Test Matrix (Vitest & Playwright)

Senior fullstack projects must enforce a multi-tiered test strategy:
1. **Unit Testing**: Instant feedback cycles using Vitest or Jest for pure logic and schema validations.
2. **End-to-End (E2E) Testing**: High-fidelity customer flow validations using Playwright.

#### Pattern: Vitest Schema Validator Unit Test (`__tests__/signup.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';
import { SignupSchema } from '../lib/validators/auth';

describe('Signup Schema Validation', () => {
  it('should pass on complete, valid payload', () => {
    const payload = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Jane Doe',
    };
    const result = SignupSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('should reject passwords shorter than 8 characters', () => {
    const payload = {
      email: 'test@example.com',
      password: 'short',
    };
    const result = SignupSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
```

#### Pattern: Playwright Multi-Role Customer E2E Flow (`e2e/onboarding.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Customer Workspace Onboarding', () => {
  test('should allow authenticated customer to create a workspace and view dashboard', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/sign-in');

    // 2. Perform mock login or enter user credentials
    await page.fill('input[type="email"]', 'jane@company.com');
    await page.fill('input[type="password"]', 'janePassword123');
    await page.click('button[type="submit"]');

    // 3. Confirm redirected to dashboard onboarding step
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Create Your Workspace');

    // 4. Submit form
    await page.fill('input[name="name"]', 'Jane Ventures');
    await page.fill('input[name="slug"]', 'jane-ventures');
    await page.click('button[type="submit"]');

    // 5. Verify success state and layout rendering
    await expect(page.locator('main')).toContainText('Jane Ventures');
  });
});
```

---

### 2. Automated CI/CD Pipelines (GitHub Actions)

Establish automated quality gates on every Pull Request to verify build integrity, linter standards, and security vulnerability profiles.

#### Pattern: GitHub Actions Workflow (`.github/workflows/ci.yml`)

```yaml
name: Continuous Integration

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Verify Linter & Formatters
        run: |
          npm run lint
          npm run format:check

      - name: Run Database Migrations
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
        run: npx prisma migrate deploy # or npx drizzle-kit migrate

      - name: Execute Vitest Unit Suite
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
        run: npm run test:unit

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Execute E2E Integration Suite
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
        run: npm run test:e2e

      - name: Validate Production Build
        run: npm run build
```

---

### 3. Containerized Local Environments (Docker & Compose)

To guarantee absolute environment consistency between developer workstations and staging/production clouds, define lightweight multi-container environments.

#### Pattern: Production-Grade Multi-Stage Dockerfile (`Dockerfile`)

```dockerfile
# --- Stage 1: Build Workspace ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Minimalist Production Runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]
```

#### Pattern: Docker Compose Stack (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://app_user:app_password@db:5432/app_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: app_password
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

---

## Conclusion
Setting up rigorous CI/CD gates, high-fidelity testing metrics, and matching container local stacks completely eliminates "works on my machine" failures and keeps server releases highly stable.
