# Vibes-Plug Backend & Systems Engineering (Codex Edition)

When editing backend APIs, server routes, database schemas, or microservices, Codex MUST enforce these standards:

## 1. Schema & Database Invariants
- **PostgreSQL DDL**: Every table MUST have `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`.
- **Foreign Keys**: Every foreign key MUST have an explicit index (`CREATE INDEX idx_... ON ...(...)`).
- **Multi-Tenant Security**: Every tenant-partitioned table MUST enable Row Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`) with an explicit tenant isolation policy (`CREATE POLICY tenant_isolation ...`).
- **Safe Migrations**: Never use destructive `DROP TABLE` or `DROP COLUMN` in production migrations without multi-step deprecation.

## 2. API Contract & Error Resilience
- **Error Standard**: Return RFC 9457 Problem Details (`{ type, title, status, detail, instance }`) on all HTTP 4xx/5xx responses.
- **Validation**: Strict runtime validation at every boundary using `Zod` or `TypeSpec`.
- **Zero Silent Errors**: Catch blocks that swallow errors (`catch (e) {}`) are strictly banned. Always log structured context via `Pino` or `Sentry`.
- **Idempotency**: All mutation endpoints (POST/PUT/PATCH) handling financial transactions or billing MUST enforce idempotency keys (`Idempotency-Key` header with atomic database locking).
