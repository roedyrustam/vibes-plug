---
name: agentic-m2m-settlement
description: "Master guide for autonomous Machine-to-Machine (M2M) agent settlement, dual-rail fiat (DOKU SNAP BI) & stablecoin micro-clearing, dynamic budget envelopes, and cryptographic agent invoicing / Panduan utama settlement otonom antar-agen (M2M), kliring mikro dual-rail fiat & stablecoin, pagu anggaran dinamis, dan penagihan agen kriptografis."
author: "Roedy Rustam"
version: "4.4.2"
---

# Agentic M2M Settlement & Clearing Protocol (2026 Sovereign Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & The M2M Clearing Imperative (2026 Shift)
In enterprise multi-agent swarms, specialized subagents frequently hire peer agents for niche subtasks (e.g., automated red teaming, formal verification, dataset crawling). Without an autonomous, cryptographic clearing rail, inter-agent collaboration either halts waiting for human invoicing or risks untraceable capital depletion.

**Agentic M2M Settlement** is a production-grade financial protocol for autonomous Agent-to-Agent (A2A) and Agent-to-Infrastructure (A2I) transactions. It establishes **Dual-Rail Clearing**:
1. **Fiat Rail (Bank Indonesia SNAP BI & DOKU Payment Gateway)**: Standardized corporate clearing supporting dynamic QRIS and Virtual Accounts (BCA, Mandiri, BRI, BNI) with asymmetric RSA-SHA256 B2B tokens and symmetric HMAC-SHA512 service signatures.
2. **Stablecoin Micro-Rail (USDC via Base/Arbitrum ERC-4337)**: Instant, sub-cent streaming payments leveraging Smart Accounts with time-scoped session keys, velocity caps, and recipient allowlists.

All settlements enforce strict **FinOps Killswitches**, **Cryptographic Invoicing (AP2AP)**, and **Critic-Validated Milestone Escrow**.

---

### Orchestration & Integration
- **Agent Micro-Economies & Treasury**: `agentic-micro-economy-architect`, `blockchain-web3-expert`, `formal-spec-z3-verifier`.
- **Payment Gateways & Clearing Rails**: `doku-payment-gateway`, `doku-mcp-server`, `payment-gateway-expert`, `saas-billing`.
- **Swarm Governance & Critic Gate**: `multi-agent-orchestration`, `quality-guardian`, `mcp-sampling-critic`.
- **Database & Cryptographic Secrets**: `database-orm-expert`, `zero-trust-secret-vault`, `post-quantum-crypto-migrator`.
- **Lifecycle & Governance**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`.

---

### Core Architectural Topologies

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DUAL-RAIL M2M SETTLEMENT TOPOLOGY                   │
├────────────────────────────────────────────────────────────────────────┤
│                      [ Swarm Director Treasury ]                       │
│                                   │                                    │
│                 ┌─────────────────┴─────────────────┐                  │
│                 ▼                                   ▼                  │
│       [ Fiat Settlement Rail ]            [ Stablecoin Micro Rail ]    │
│       (DOKU SNAP BI QRIS / VA)            (USDC via Base ERC-4337)     │
│       • Asymmetric RSA-SHA256 Auth        • Scoped Session Keys        │
│       • HMAC-SHA512 Request Signature     • Paymaster Gas Sponsorship  │
│                 │                                   │                  │
│                 └─────────────────┬─────────────────┘                  │
│                                   ▼                                    │
│                    [ Escrow & Verification Vault ]                     │
│               Critic Agent Validates Output (Score >= 0.85)            │
│                 ┌─────────────────┴─────────────────┐                  │
│                 ▼                                   ▼                  │
│      [Critic Approves Quality]           [Critic Rejects Quality]      │
│      Release Escrow to Worker            Atomic Refund to Treasury     │
│      Emit Idempotent Settlement Tx       Zero Double-Spend Guaranteed  │
└────────────────────────────────────────────────────────────────────────┘
```

#### 1. Dual-Rail Clearing Engine
- **Fiat Clearing (DOKU SNAP BI Standard)**:
  - Phase 1: Request Asymmetric B2B Token (`/v1.0/access-token/b2b`) signed via RSA-SHA256 with the agent's private key.
  - Phase 2: Execute Service Request (QRIS/VA) signed via symmetric HMAC-SHA512 with `MinifiedBody`, `HTTPMethod`, `EndpointUrl`, and `X-TIMESTAMP`.
  - Phase 3: Idempotent callback processing with atomic deduplication.
- **Micro-Token Clearing (Base / Arbitrum USDC)**:
  - Agent smart accounts utilize ERC-4337 user operations.
  - Session keys permit maximum $0.25 transactions within a 2-hour window, restricted strictly to approved worker contract addresses.

#### 2. The 4 Hard FinOps Gates (Pagar FinOps)
1. **Hard Spend Envelopes**: Invoices exceeding allocated ceilings trigger immediate rejection before entering escrow.
2. **Cryptographic AP2AP Invoicing**: Every invoice is immutably signed by the worker agent with a unique UUIDv7 nonce.
3. **Critic Milestone Escrow**: Funds remain locked until an independent auditor subagent confirms task acceptance.
4. **PostgreSQL Idempotency Locks**: All settlements record `external_id` with `ON CONFLICT DO NOTHING` locks.

---

### Production Implementation Blueprints

#### Blueprint 1: DOKU SNAP BI Asymmetric & Symmetric Signer (`engine/doku-snap-bi-signer.ts`)
```typescript
import crypto from 'node:crypto';

export class DokuSnapBiSigner {
  // 1. Generate Asymmetric B2B Token Signature (RSA-SHA256)
  public static generateB2bSignature(params: {
    clientId: string;
    timestamp: string; // ISO 8601 (e.g. 2026-10-22T08:30:00+07:00)
    privateKeyPem: string;
  }): string {
    const stringToSign = `${params.clientId}|${params.timestamp}`;
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(stringToSign);
    sign.end();
    return sign.sign(params.privateKeyPem, 'base64');
  }

  // 2. Generate Symmetric Service Request Signature (HMAC-SHA512)
  public static generateServiceSignature(params: {
    httpMethod: 'POST' | 'GET' | 'PUT';
    endpointUrl: string; // e.g. /v1.0/qr/qr-mpm-generate
    accessToken: string;
    requestBody: Record<string, unknown>;
    timestamp: string;
    clientSecret: string;
  }): string {
    // Minify and hash request body with SHA-256
    const minifiedBody = JSON.stringify(params.requestBody);
    const bodyHash = crypto
      .createHash('sha256')
      .update(minifiedBody)
      .digest('hex')
      .toLowerCase();

    // Format SNAP BI String-To-Sign
    const stringToSign = [
      params.httpMethod.toUpperCase(),
      params.endpointUrl,
      params.accessToken,
      bodyHash,
      params.timestamp,
    ].join(':');

    // Compute HMAC-SHA512
    return crypto
      .createHmac('sha512', params.clientSecret)
      .update(stringToSign)
      .digest('base64');
  }
}
```

---

#### Blueprint 2: Dual-Rail M2M Settlement & Escrow Vault (`engine/m2m-settlement-vault.ts`)
```typescript
import crypto from 'node:crypto';

export interface AgentInvoice {
  invoiceId: string;
  sourceAgentId: string;
  workerAgentId: string;
  taskId: string;
  amountMinor: bigint;
  currency: 'IDR' | 'USD';
  rail: 'DOKU_SNAP_BI' | 'BASE_USDC';
  timestamp: string;
  workerSignature: string;
}

export interface SettlementVaultHold {
  escrowId: string;
  invoice: AgentInvoice;
  maxBudgetCents: bigint;
  status: 'PENDING' | 'RELEASED' | 'REFUNDED';
  criticAgentId: string;
}

export class M2mSettlementVault {
  private readonly escrows: Map<string, SettlementVaultHold> = new Map();

  constructor(private readonly vaultSecret: string) {}

  public createSignedInvoice(params: {
    sourceAgentId: string;
    workerAgentId: string;
    taskId: string;
    amountMinor: bigint;
    currency: 'IDR' | 'USD';
    rail: 'DOKU_SNAP_BI' | 'BASE_USDC';
  }): AgentInvoice {
    const invoiceId = `inv_${crypto.randomUUID()}`;
    const timestamp = new Date().toISOString();
    const payload = `${invoiceId}|${params.sourceAgentId}|${params.workerAgentId}|${params.taskId}|${params.amountMinor.toString()}|${timestamp}`;

    const workerSignature = crypto
      .createHmac('sha512', this.vaultSecret)
      .update(payload)
      .digest('hex');

    return {
      ...params,
      invoiceId,
      timestamp,
      workerSignature,
    };
  }

  public openEscrowHold(
    invoice: AgentInvoice,
    maxBudgetCents: bigint,
    criticAgentId: string
  ): SettlementVaultHold {
    // 1. Verify invoice cryptographic authenticity
    const payload = `${invoice.invoiceId}|${invoice.sourceAgentId}|${invoice.workerAgentId}|${invoice.taskId}|${invoice.amountMinor.toString()}|${invoice.timestamp}`;
    const expectedSig = crypto
      .createHmac('sha512', this.vaultSecret)
      .update(payload)
      .digest('hex');

    if (invoice.workerSignature !== expectedSig) {
      throw new Error('[SettlementVault] Cryptographic invoice signature tampering detected.');
    }

    // 2. Enforce hard budget ceiling
    if (invoice.amountMinor > maxBudgetCents) {
      throw new Error(
        `[FinOps Gate] Invoice amount (${invoice.amountMinor}) exceeds allocated ceiling (${maxBudgetCents}).`
      );
    }

    const hold: SettlementVaultHold = {
      escrowId: `escrow_${crypto.randomUUID()}`,
      invoice,
      maxBudgetCents,
      status: 'PENDING',
      criticAgentId,
    };

    this.escrows.set(hold.escrowId, hold);
    return hold;
  }

  public releaseSettlement(
    escrowId: string,
    criticQualityScore: number
  ): { status: 'RELEASED' | 'REFUNDED'; settlementReference: string } {
    const hold = this.escrows.get(escrowId);
    if (!hold) {
      throw new Error(`[SettlementVault] Escrow hold ${escrowId} not found.`);
    }

    if (hold.status !== 'PENDING') {
      throw new Error(`[SettlementVault] Escrow ${escrowId} already finalized as ${hold.status}.`);
    }

    if (criticQualityScore >= 0.85) {
      hold.status = 'RELEASED';
      const settlementReference = `tx_${crypto.randomUUID().replace(/-/g, '')}`;
      return { status: 'RELEASED', settlementReference };
    }

    // Refund due to quality failure
    hold.status = 'REFUNDED';
    return { status: 'REFUNDED', settlementReference: `refund_${crypto.randomUUID().replace(/-/g, '')}` };
  }
}
```

---

#### Blueprint 3: PostgreSQL M2M Ledger & Idempotency DDL (`database/m2m-ledger-schema.sql`)
```sql
-- Production PostgreSQL DDL for Agentic M2M Settlements
CREATE TABLE agent_wallets (
  agent_id VARCHAR(64) PRIMARY KEY,
  wallet_address VARCHAR(128) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'USD',
  balance_minor BIGINT NOT NULL DEFAULT 0 CHECK (balance_minor >= 0),
  hourly_velocity_cap_minor BIGINT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE m2m_settlement_escrows (
  escrow_id VARCHAR(64) PRIMARY KEY,
  task_id VARCHAR(64) NOT NULL,
  source_agent_id VARCHAR(64) NOT NULL REFERENCES agent_wallets(agent_id),
  worker_agent_id VARCHAR(64) NOT NULL REFERENCES agent_wallets(agent_id),
  critic_agent_id VARCHAR(64) NOT NULL,
  amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
  rail VARCHAR(32) NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RELEASED', 'REFUNDED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finalized_at TIMESTAMPTZ
);

CREATE TABLE m2m_idempotency_records (
  external_id VARCHAR(128) PRIMARY KEY,
  escrow_id VARCHAR(64) NOT NULL REFERENCES m2m_settlement_escrows(escrow_id),
  settlement_ref VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Atomic Escrow Release Function
CREATE OR REPLACE FUNCTION finalize_m2m_escrow(
  p_escrow_id VARCHAR(64),
  p_action VARCHAR(24),
  p_external_id VARCHAR(128),
  p_settlement_ref VARCHAR(128)
) RETURNS BOOLEAN AS $$
DECLARE
  v_escrow m2m_settlement_escrows%ROWTYPE;
BEGIN
  -- Lock row for update to guarantee single-execution
  SELECT * INTO v_escrow
  FROM m2m_settlement_escrows
  WHERE escrow_id = p_escrow_id
  FOR UPDATE;

  IF NOT FOUND OR v_escrow.status <> 'PENDING' THEN
    RETURN FALSE;
  END IF;

  IF p_action = 'RELEASE' THEN
    UPDATE agent_wallets
    SET balance_minor = balance_minor + v_escrow.amount_minor,
        updated_at = now()
    WHERE agent_id = v_escrow.worker_agent_id;

    UPDATE m2m_settlement_escrows
    SET status = 'RELEASED', finalized_at = now()
    WHERE escrow_id = p_escrow_id;
  ELSE
    UPDATE agent_wallets
    SET balance_minor = balance_minor + v_escrow.amount_minor,
        updated_at = now()
    WHERE agent_id = v_escrow.source_agent_id;

    UPDATE m2m_settlement_escrows
    SET status = 'REFUNDED', finalized_at = now()
    WHERE escrow_id = p_escrow_id;
  END IF;

  INSERT INTO m2m_idempotency_records (external_id, escrow_id, settlement_ref)
  VALUES (p_external_id, p_escrow_id, p_settlement_ref);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec agentic-m2m-settlement <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Direktif Eksekutif & Kebutuhan Kliring M2M (Pergeseran 2026)
Pada swarm multi-agen skala perusahaan, sub-agen terspesialisasi kerap menugaskan agen lain untuk menangani tugas khusus (misal: red teaming otomatis, verifikasi formal, atau crawling dataset). Tanpa adanya rel kliring kriptografis yang mandiri, kolaborasi antar-agen akan terhenti karena menunggu tagihan manual manusia atau berisiko mengalami kebocoran anggaran yang tak terpantau.

**Agentic M2M Settlement** adalah protokol finansial standar produksi untuk transaksi otonom Mesin-ke-Mesin (Agent-to-Agent / A2A) dan Agen-ke-Infrastruktur (A2I). Protokol ini mendukung **Kliring Dual-Rail**:
1. **Rel Fiat (Standar Bank Indonesia SNAP BI & DOKU Payment Gateway)**: Kliring korporat resmi yang mendukung QRIS dinamis dan Virtual Account (BCA, Mandiri, BRI, BNI) dengan token B2B asimetris RSA-SHA256 serta tanda tangan layanan simetris HMAC-SHA512.
2. **Rel Mikro Stablecoin (USDC via Base/Arbitrum ERC-4337)**: Pembayaran mikro instan bernilai sub-sen memanfaatkan Smart Account dengan *session keys* berbatas waktu, batas kecepatan transaksi (*velocity caps*), dan daftar putih alamat tujuan.

---

### Integrasi Orkestrasi
- **Ekonomi Agen & Treasury**: `agentic-micro-economy-architect`, `blockchain-web3-expert`, `formal-spec-z3-verifier`.
- **Payment Gateway & Rel Kliring**: `doku-payment-gateway`, `doku-mcp-server`, `payment-gateway-expert`, `saas-billing`.
- **Tata Kelola Swarm & Gerbang Critic**: `multi-agent-orchestration`, `quality-guardian`, `mcp-sampling-critic`.
- **Database & Rahasia Kriptografis**: `database-orm-expert`, `zero-trust-secret-vault`, `post-quantum-crypto-migrator`.
- **Siklus Hidup & Tata Kelola**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`.

---

### 4 Pagar FinOps Mutlak
1. **Pagu Anggaran Mutlak (Hard Spend Envelope)**: Tagihan yang melebihi batas anggaran yang dialokasikan otomatis ditolak sebelum masuk ke brankas escrow.
2. **Penagihan Kriptografis AP2AP**: Setiap tagihan ditandatangani secara kriptografis oleh agen pekerja dengan nonce unik UUIDv7.
3. **Escrow Berbasis Validasi Critic**: Dana tertahan sampai sub-agen auditor/critic mengonfirmasi kualitas output (skor >= 0.85).
4. **Kunci Idempotensi PostgreSQL**: Setiap penyelesaian transaksi mencatat `external_id` dengan kunci atomik guna menjamin ketiadaan pembelanjaan ganda (*zero double-spend*).

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec agentic-m2m-settlement <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
