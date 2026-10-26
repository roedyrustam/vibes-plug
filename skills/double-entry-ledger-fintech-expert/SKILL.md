---
name: double-entry-ledger-fintech-expert
description: "Immutable double-entry ledgers, TigerBeetle, and balance reconciliation / Buku besar double-entry permanen, TigerBeetle, dan rekonsiliasi saldo."
author: "Roedy Rustam"
version: "4.4.2"

---

# Double-Entry Ledger & FinTech Core Accounting Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Payment Gateways & Settlement**: `doku-payment-gateway`, `payment-gateway-expert`, `saas-billing`, `agentic-m2m-settlement`, `agentic-micro-economy-architect`
- **Database & Concurrency Locks**: `database-orm-expert`, `supabase-security-expert`
- **Formal Verification & Security**: `formal-spec-z3-verifier`, `zero-trust-secret-vault`, `anti-slop`
- **Lifecycle & Governance**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Mission-critical financial engineering guide for designing **immutable Double-Entry Accounting Ledgers**. Never track money using a mutable `users.balance = users.balance - 100` column alone. Covers **append-only journal entries**, zero-sum balanced postings ($\sum \text{Debits} = \sum \text{Credits}$), **two-phase pending/posted escrow holds**, **TigerBeetle** high-throughput financial accounting, integer minor-unit arithmetic (`BIGINT`), and daily webhook-to-ledger reconciliation.

### Trigger Conditions
- Building digital wallets, marketplace escrow systems, split payouts, or M2M agent clearing houses.
- Recording payment gateway webhooks (DOKU SNAP BI, Stripe, Xendit) into an auditable internal ledger.
- Implementing two-phase authorization holds (pending balance vs available balance).
- Preventing floating-point rounding bugs (`0.1 + 0.2 !== 0.3`) and race-condition double-spends.

---

### Core Ledger Invariants

| Invariant | Mathematical / Architectural Rule | Enforcement Mechanism |
| :--- | :--- | :--- |
| **I-01: Zero-Sum Conservation** | Every transaction must contain $\ge 2$ postings where $\sum \text{debits} - \sum \text{credits} = 0$. | Database trigger + application transaction check |
| **I-02: Strict Immutability** | `ledger_transactions` and `ledger_entries` are strictly append-only (`INSERT` only). Corrections require a compensating reversal entry. | PostgreSQL `BEFORE UPDATE OR DELETE` trigger raising exception |
| **I-03: Integer Minor Units** | Store all monetary values as `BIGINT` in minor units (e.g., IDR sen/rupiah, USD cents). `FLOAT`/`DOUBLE` are strictly forbidden. | `BIGINT NOT NULL CHECK (amount_minor > 0)` |
| **I-04: Canonical Lock Ordering** | Lock accounts in deterministic ascending UUID order (`ORDER BY id ASC FOR UPDATE`) to eliminate AB-BA database deadlocks. | Sorted `SELECT ... FOR UPDATE` query |

---

### Core Implementation Patterns

#### 1. PostgreSQL Immutable Double-Entry DDL Schema
```sql
CREATE TABLE IF NOT EXISTS ledger_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(128) NOT NULL,
  normal_balance VARCHAR(6) NOT NULL CHECK (normal_balance IN ('DEBIT', 'CREDIT')),
  currency CHAR(3) NOT NULL DEFAULT 'IDR',
  posted_balance_minor BIGINT NOT NULL DEFAULT 0,
  pending_hold_minor BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_ledger_accounts_tenant ON ledger_accounts(tenant_id);

CREATE TABLE IF NOT EXISTS ledger_journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  idempotency_key VARCHAR(128) UNIQUE NOT NULL,
  reference_type VARCHAR(64) NOT NULL,
  reference_id VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ledger_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id UUID NOT NULL REFERENCES ledger_journals(id) ON DELETE RESTRICT,
  account_id UUID NOT NULL REFERENCES ledger_accounts(id) ON DELETE RESTRICT,
  direction VARCHAR(6) NOT NULL CHECK (direction IN ('DEBIT', 'CREDIT')),
  amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ledger_postings_journal ON ledger_postings(journal_id);
CREATE INDEX IF NOT EXISTS idx_ledger_postings_account ON ledger_postings(account_id);
```

---

#### 2. Deadlock-Free Atomic Journal Posting Engine (TypeScript)
```typescript
// src/ledger/post-journal.ts
export interface PostingLine {
  accountId: string;
  direction: 'DEBIT' | 'CREDIT';
  amountMinor: bigint;
}

export interface JournalCommand {
  tenantId: string;
  idempotencyKey: string;
  referenceType: 'DOKU_SETTLEMENT' | 'WALLET_TRANSFER' | 'REFUND_REVERSAL';
  referenceId: string;
  description: string;
  postings: readonly PostingLine[];
}

export function validateBalancedJournal(postings: readonly PostingLine[]): void {
  if (postings.length < 2) {
    throw new Error('[Ledger] A double-entry journal requires at least 2 postings');
  }

  let totalDebits = 0n;
  let totalCredits = 0n;

  for (const line of postings) {
    if (line.amountMinor <= 0n) {
      throw new Error(`[Ledger] Posting amount for account ${line.accountId} must be > 0`);
    }
    if (line.direction === 'DEBIT') {
      totalDebits += line.amountMinor;
    } else {
      totalCredits += line.amountMinor;
    }
  }

  if (totalDebits !== totalCredits) {
    throw new Error(
      `[Ledger] Unbalanced journal rejected: debits (${totalDebits}) !== credits (${totalCredits})`
    );
  }
}

export function getCanonicalLockOrder(postings: readonly PostingLine[]): string[] {
  return [...new Set(postings.map((p) => p.accountId))].sort((a, b) => a.localeCompare(b));
}
```

---

#### 3. Two-Phase Authorization Hold & TigerBeetle Transfer Adapter (TypeScript)
Financial workflows (escrow, pre-authorization, agent budget limits) require two-phase settlement (`PENDING` hold $\rightarrow$ `POSTED` capture or `VOID` release):

```typescript
// src/ledger/tigerbeetle-two-phase.ts
export interface TigerBeetleTransfer {
  id: bigint;
  debitAccountId: bigint;
  creditAccountId: bigint;
  amountMinor: bigint;
  pendingId?: bigint;
  flags: {
    pending: boolean;
    postPendingTransfer: boolean;
    voidPendingTransfer: boolean;
  };
  timeoutSeconds?: number;
}

export class TigerBeetleLedgerAdapter {
  private readonly clusterId: bigint;
  private readonly replicaAddresses: readonly string[];

  constructor(clusterId: bigint, replicaAddresses: readonly string[]) {
    this.clusterId = clusterId;
    this.replicaAddresses = replicaAddresses;
  }

  public createAuthorizationHold(params: {
    transferId: bigint;
    debitAccountId: bigint;
    creditEscrowAccountId: bigint;
    amountMinor: bigint;
    timeoutSeconds: number;
  }): TigerBeetleTransfer {
    if (params.amountMinor <= 0n) {
      throw new Error('[TigerBeetle] Hold amount must be strictly positive');
    }

    return {
      id: params.transferId,
      debitAccountId: params.debitAccountId,
      creditAccountId: params.creditEscrowAccountId,
      amountMinor: params.amountMinor,
      flags: {
        pending: true,
        postPendingTransfer: false,
        voidPendingTransfer: false,
      },
      timeoutSeconds: params.timeoutSeconds,
    };
  }

  public capturePendingHold(params: {
    transferId: bigint;
    pendingTransferId: bigint;
    captureAmountMinor: bigint;
  }): TigerBeetleTransfer {
    return {
      id: params.transferId,
      debitAccountId: 0n,
      creditAccountId: 0n,
      amountMinor: params.captureAmountMinor,
      pendingId: params.pendingTransferId,
      flags: {
        pending: false,
        postPendingTransfer: true,
        voidPendingTransfer: false,
      },
    };
  }

  public voidPendingHold(params: {
    transferId: bigint;
    pendingTransferId: bigint;
  }): TigerBeetleTransfer {
    return {
      id: params.transferId,
      debitAccountId: 0n,
      creditAccountId: 0n,
      amountMinor: 0n,
      pendingId: params.pendingTransferId,
      flags: {
        pending: false,
        postPendingTransfer: false,
        voidPendingTransfer: true,
      },
    };
  }
}
```

---

### Verification Checklist
- [ ] Every financial mutation validates $\sum \text{Debits} = \sum \text{Credits}$ before committing.
- [ ] `ledger_journals` and `ledger_postings` disallow `UPDATE` and `DELETE` operations; refunds create compensating reversal journals.
- [ ] Multi-account transfers lock `ledger_accounts` in ascending UUID order to guarantee zero deadlocks.
- [ ] Available balance is computed as `posted_balance_minor - pending_hold_minor` with non-negative check constraints for customer liability accounts.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec double-entry-ledger-fintech-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 Query Latency < 15ms, 100% Row Level Security (RLS) coverage on multi-tenant tables, explicit B-Tree indexes on all Foreign Keys; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Payment Gateway & Settlement**: `doku-payment-gateway`, `payment-gateway-expert`, `saas-billing`, `agentic-m2m-settlement`, `agentic-micro-economy-architect`
- **Database & Penguncian Konkurensi**: `database-orm-expert`, `supabase-security-expert`
- **Verifikasi Formal & Keamanan**: `formal-spec-z3-verifier`, `zero-trust-secret-vault`, `anti-slop`
- **Siklus Hidup & Tata Kelola**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan rekayasa finansial kritis untuk merancang **buku besar akuntansi Double-Entry yang tidak dapat diubah (*immutable*)**. Mencakup pencatatan jurnal *append-only*, keseimbangan nol ($\sum \text{Debit} = \sum \text{Kredit}$), penahanan saldo dua fase (*pending/escrow holds*), aritmetika integer satuan terkecil (`BIGINT`), dan urutan penguncian akun kanonis bebas *deadlock*.

### 4 Invarian Buku Besar (Ledger Invariants)
1. **Hukum Kekekalan Saldo ($\sum \text{Debit} = \sum \text{Kredit}$)**: Setiap transaksi jurnal wajib memiliki minimal 2 baris posting dengan total debit sama persis dengan total kredit.
2. **Imutabilitas Mutlak (Append-Only)**: Tabel jurnal dan posting dilarang di-`UPDATE` atau di-`DELETE`. Koreksi atau *refund* wajib dilakukan melalui jurnal pembalik (*compensating entry*).
3. **Satuan Terkecil Integer (`BIGINT`)**: Dilarang menggunakan `FLOAT` atau `DOUBLE` untuk uang.
4. **Urutan Kunci Kanonis**: Kunci baris akun menggunakan `ORDER BY id ASC FOR UPDATE` untuk mencegah *deadlock* saat dua transfer saling bersilangan.

### Daftar Periksa Verifikasi (Checklist)
- [ ] Setiap mutasi keuangan memvalidasi $\sum \text{Debit} = \sum \text{Kredit}$ sebelum komit.
- [ ] Tabel jurnal dan posting bersifat *append-only* dengan `idempotency_key` unik.
- [ ] Penguncian multi-akun selalu diurutkan berdasarkan UUID secara menaik (`ASC`).

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec double-entry-ledger-fintech-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi Query P99 < 15ms, cakupan Row Level Security (RLS) 100% pada tabel multi-tenant, indeks B-Tree eksplisit pada seluruh Foreign Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
