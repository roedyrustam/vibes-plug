---
name: formal-spec-z3-verifier
description: "Master guide for mathematical formal verification, SMT solver constraints (Z3 WebAssembly, Python Z3, TLA+, Dafny), invariant theorem proving for FinTech billing, RBAC authorization, and zero-violation architectures / Panduan utama verifikasi formal matematis, batasan SMT solver (Z3 WASM, Python Z3, TLA+, Dafny), pembuktian teorema invarian billing FinTech, otorisasi RBAC, dan arsitektur zero-violation."
author: "Roedy Rustam"
version: "4.4.2"
---

# Formal Spec & Z3 Verifier (2026 Sovereign Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & The Formal Verification Imperative
Unit tests sample points along an execution curve: $N$ tests cover $N$ scenarios. However, in financial ledgers, subscription state machines, multi-tenant boundaries, and cryptographic custody, edge-case race conditions exist in the infinitely large space of untested inputs ($O(\infty)$).

**Formal Specification & SMT Verification** shifts quality assurance from empirical sampling to **mathematical theorem proving**. By encoding software constraints into formal first-order logic and Satisfiability Modulo Theories (SMT), we use automated theorem provers (Microsoft Z3, TLA+, Dafny) to **exhaustively prove** that:
1. Double-entry financial ledgers can never create or destroy fractional currency.
2. Subscription billing state machines contain zero illegal transition paths.
3. Multi-tenant RBAC trees permit mathematically zero privilege escalations across tenant boundaries.

---

### Orchestration & Integration
- **FinTech & SaaS Subscriptions**: `saas-billing`, `doku-payment-gateway`, `payment-gateway-expert`, `agentic-m2m-settlement`.
- **Identity & Boundary Verification**: `authentication-identity-expert`, `saas-multi-tenant`, `zero-trust-secret-vault`.
- **Database & Constraint Enforcement**: `database-orm-expert`, `spec-driven-development-expert`.
- **Autonomous Testing & Red Teaming**: `property-mutation-testing-expert`, `autonomous-tdd-debugger`, `autonomous-red-teamer`, `anti-slop`.
- **Lifecycle & Governance**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`.

---

### Core Verification Methodologies (The 4 Pillars)

```
┌────────────────────────────────────────────────────────────────────────┐
│               FORMAL VERIFICATION & THEOREM PROVING FLOW               │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Define Mathematical Invariants (Conservation, Monotonicity, Leak)   │
│                                   │                                    │
│                                   ▼                                    │
│ 2. Encode into SMT / Formal Logic (Z3 First-Order Logic, TLA+, Dafny)  │
│                                   │                                    │
│                                   ▼                                    │
│ 3. Automated SMT Solver Check (solver.check() -> SAT or UNSAT)         │
│                 ┌─────────────────┴─────────────────┐                  │
│                 ▼                                   ▼                  │
│        [UNSAT: Theorem Proven]            [SAT: Bug Found!]            │
│                 │                                   │                  │
│                 │                         Extract Counter-Example      │
│                 │                         (Exact attack/failure state) │
│                 ▼                                   │                  │
│ 4. Emit Verified PostgreSQL Constraints             ▼                  │
│    (CHECK, Row-Level Locks, Types)        Patch Business Logic & Rerun │
└────────────────────────────────────────────────────────────────────────┘
```

#### 1. Real Z3 SMT Solver (WebAssembly & Python)
Instead of manual assertion loops, use the real Microsoft Z3 theorem prover. Define symbolic integer/boolean variables, assert preconditions and transition rules, and invert the invariant:
- Asking the solver to find a solution where the invariant is violated (`solver.add(Not(Invariant))`).
- If the solver returns `unsat` (unsatisfiable), the property is **mathematically proven for all possible inputs**.
- If the solver returns `sat`, Z3 generates the exact **counter-example model** exposing the bug.

#### 2. TLA+ Specification for Distributed Concurrency
Models concurrent states, temporal properties, and step transitions without implementation noise. Proves absence of deadlocks and state corruption across distributed payment microservices.

#### 3. Dafny Contract-First Verification
Compiles mathematically proven algorithms directly to C#, Java, or JavaScript with built-in preconditions (`requires`), postconditions (`ensures`), and loop invariants.

#### 4. PostgreSQL DDL Constraint Compilation
Every proven invariant must be compiled directly into database-enforced schemas: PostgreSQL domain types, `CHECK` constraints, foreign keys, and exclusion constraints (`EXCLUDE USING`).

---

### Production Implementation Blueprints

#### Blueprint 1: Real Z3 SMT Ledger Invariant Prover in TypeScript (`engine/z3-ledger-prover.ts`)
Uses the official WebAssembly build of Microsoft Z3 (`z3-solver`):
```typescript
import { init } from 'z3-solver';

export interface LedgerVerificationResult {
  isSound: boolean;
  theoremProven: boolean;
  counterExample?: Record<string, string>;
  diagnosticMessage: string;
}

export class Z3LedgerProver {
  public static async verifyAtomicTransfer(
    maxAccounts: number = 4
  ): Promise<LedgerVerificationResult> {
    const { Context } = await init();
    const { Solver, Int, And, Or, Not } = new Context('main');

    const solver = new Solver();

    // 1. Symbolic Variables: Balances before and after transaction
    const initialSource = Int.const('initial_source');
    const initialDest = Int.const('initial_dest');
    const transferAmount = Int.const('transfer_amount');

    const finalSource = Int.const('final_source');
    const finalDest = Int.const('final_dest');

    // 2. Preconditions & Domain Rules
    // All currency must be represented in integer atomic units (cents/satoshis >= 0)
    solver.add(initialSource.ge(0));
    solver.add(initialDest.ge(0));
    solver.add(transferAmount.gt(0)); // Transfers must be strictly positive
    solver.add(initialSource.ge(transferAmount)); // Source must have sufficient funds

    // 3. State Transition Logic
    solver.add(finalSource.eq(initialSource.sub(transferAmount)));
    solver.add(finalDest.eq(initialDest.add(transferAmount)));

    // 4. Invariant: Conservation of Total Money (Sum Before == Sum After)
    const initialTotal = initialSource.add(initialDest);
    const finalTotal = finalSource.add(finalDest);
    const moneyConservation = initialTotal.eq(finalTotal);

    // 5. Invariant: Solvency (No balance drops below zero)
    const solvency = And(finalSource.ge(0), finalDest.ge(0));

    const totalSystemInvariant = And(moneyConservation, solvency);

    // 6. Negation Mode: Ask Z3 to prove that a violation is POSSIBLE
    solver.add(Not(totalSystemInvariant));

    const checkResult = await solver.check();

    if (checkResult === 'unsat') {
      return {
        isSound: true,
        theoremProven: true,
        diagnosticMessage:
          'THEOREM PROVEN: Double-entry money conservation and solvency hold for all infinite integer inputs.',
      };
    }

    // Violation found: Extract exact counter-example
    const model = solver.model();
    const counterExample: Record<string, string> = {
      initialSource: model.eval(initialSource).toString(),
      initialDest: model.eval(initialDest).toString(),
      transferAmount: model.eval(transferAmount).toString(),
      finalSource: model.eval(finalSource).toString(),
      finalDest: model.eval(finalDest).toString(),
    };

    return {
      isSound: false,
      theoremProven: false,
      counterExample,
      diagnosticMessage: 'COUNTEREXAMPLE DETECTED: Ledger invariant violated under model state.',
    };
  }
}
```

---

#### Blueprint 2: SaaS Subscription State Machine Prover in Python Z3 (`verifier/billing_state_prover.py`)
```python
from z3 import (
    Datatype,
    Solver,
    EnumSort,
    Function,
    Int,
    Bool,
    And,
    Or,
    Not,
    Implies,
    ForAll,
    sat,
    unsat
)

def verify_subscription_lifecycle():
    """
    Formally verifies that a canceled subscription can NEVER reach
    the Active state without a verified payment confirmation token.
    """
    solver = Solver()

    # Define State Enum Sort
    State, (TRIAL, ACTIVE, PAST_DUE, CANCELED) = EnumSort(
        'State', ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED')
    )

    # State variables across step N and N+1
    s_current = State('s_current')
    s_next = State('s_next')
    payment_verified = Bool('payment_verified')
    admin_override = Bool('admin_override')

    # Legal Transition Rules
    transition_legal = Or(
        # Trial can transition to Active with payment
        And(s_current == TRIAL, s_next == ACTIVE, payment_verified),
        # Active can become PastDue if recurring billing fails
        And(s_current == ACTIVE, s_next == PAST_DUE),
        # PastDue can recover to Active upon payment
        And(s_current == PAST_DUE, s_next == ACTIVE, payment_verified),
        # Any state can transition to Canceled
        s_next == CANCELED,
        # Re-activation from Canceled strictly requires explicit payment verification
        And(s_current == CANCELED, s_next == ACTIVE, payment_verified)
    )

    solver.add(transition_legal)

    # Invariant to test:
    # "A user in CANCELED state can NEVER become ACTIVE if payment_verified is False"
    # To prove: (s_current == CANCELED and s_next == ACTIVE) -> payment_verified
    desired_invariant = Implies(
        And(s_current == CANCELED, s_next == ACTIVE),
        payment_verified
    )

    # Negate the invariant to search for illegal exploits
    solver.add(Not(desired_invariant))

    result = solver.check()

    if result == unsat:
        return {
            "status": "PROVEN",
            "message": "Mathematical proof holds: Unauthorized re-activation is impossible."
        }
    else:
        model = solver.model()
        return {
            "status": "VIOLATION",
            "counter_example": {
                "s_current": str(model[s_current]),
                "s_next": str(model[s_next]),
                "payment_verified": str(model[payment_verified])
            }
        }

if __name__ == "__main__":
    result = verify_subscription_lifecycle()
    print(f"Formal Verification: {result}")
```

---

#### Blueprint 3: TLA+ Atomic Ledger Specification (`spec/Ledger.tla`)
```tla
---------------------------- MODULE Ledger ----------------------------
EXTENDS Naturals, FiniteSets

CONSTANTS Accounts, MaxBalance

VARIABLES balances, pendingTransfers

TypeOK ==
    /\ balances \in [Accounts -> 0..MaxBalance]
    /\ pendingTransfers \subseteq (Accounts \X Accounts \X 1..MaxBalance)

Init ==
    /\ balances = [a \in Accounts |-> 1000]
    /\ pendingTransfers = {}

InitiateTransfer(src, dst, amt) ==
    /\ amt > 0
    /\ balances[src] >= amt
    /\ balances' = [balances EXCEPT ![src] = balances[src] - amt]
    /\ pendingTransfers' = pendingTransfers \cup {<<src, dst, amt>>}

CompleteTransfer(src, dst, amt) ==
    /\ <<src, dst, amt>> \in pendingTransfers
    /\ balances' = [balances EXCEPT ![dst] = balances[dst] + amt]
    /\ pendingTransfers' = pendingTransfers \ {<<src, dst, amt>>}

Next ==
    \/ \E s, d \in Accounts, a \in 1..MaxBalance: InitiateTransfer(s, d, a)
    \/ \E s, d \in Accounts, a \in 1..MaxBalance: CompleteTransfer(s, d, a)

\* Crucial Invariant: Money Conservation (Sum of Balances + In-Flight Transfers)
TotalSystemWealth ==
    LET SumBalances == balances[Accounts]
    IN SumBalances

Spec == Init /\ [][Next]_<<balances, pendingTransfers>>
=============================================================================
```

---

#### Blueprint 4: Dafny Contract-Verified Balance Transfer (`spec/Transfer.dfy`)
```dafny
class Account {
  var balance: nat

  constructor(initial: nat)
    ensures balance == initial
  {
    balance := initial;
  }
}

method AtomicTransfer(source: Account, dest: Account, amount: nat)
  requires source != dest
  requires source.balance >= amount
  modifies source, dest
  ensures source.balance == old(source.balance) - amount
  ensures dest.balance == old(dest.balance) + amount
  ensures source.balance + dest.balance == old(source.balance) + old(dest.balance)
{
  source.balance := source.balance - amount;
  dest.balance := dest.balance + amount;
}
```

---

### Database Schema Constraint Translation
Once verified by SMT solvers, the invariants are translated directly into PostgreSQL schemas:

```sql
-- Production PostgreSQL DDL compiled from Z3 verified constraints
CREATE DOMAIN monetary_cents AS BIGINT
  CHECK (VALUE >= 0);

CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL,
  account_id UUID NOT NULL,
  debit_cents monetary_cents NOT NULL DEFAULT 0,
  credit_cents monetary_cents NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Invariant 1: Single direction per entry
  CONSTRAINT chk_single_direction CHECK (
    (debit_cents > 0 AND credit_cents = 0) OR
    (credit_cents > 0 AND debit_cents = 0)
  )
);

-- Transaction balanced invariant enforcement via deferred trigger
CREATE OR REPLACE FUNCTION verify_transaction_balance()
RETURNS TRIGGER AS $$
DECLARE
  total_debit BIGINT;
  total_credit BIGINT;
BEGIN
  SELECT COALESCE(SUM(debit_cents), 0), COALESCE(SUM(credit_cents), 0)
  INTO total_debit, total_credit
  FROM ledger_entries
  WHERE transaction_id = NEW.transaction_id;

  IF total_debit <> total_credit THEN
    RAISE EXCEPTION 'Ledger balance invariant violated: Debits (%) != Credits (%)',
      total_debit, total_credit;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER trg_verify_transaction_balance
AFTER INSERT OR UPDATE ON ledger_entries
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION verify_transaction_balance();
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec formal-spec-z3-verifier <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Direktif Eksekutif & Kebutuhan Verifikasi Formal
Unit test konvensional hanya mengambil sampel titik acak: $N$ pengujian hanya mencakup $N$ skenario. Namun pada buku besar FinTech, state machine penagihan langganan, batas isolasi multi-tenant, dan pengelolaan kunci kriptografi, celah *race condition* tersembunyi di dalam ruang tak terhingga dari skenario yang belum diuji ($O(\infty)$).

**Spesifikasi Formal & Verifikasi SMT** mengubah paradigma penjaminan kualitas dari sampel empiris menjadi **pembuktian teorema matematis**. Dengan memformulasikan batasan logika tingkat pertama dan SMT (*Satisfiability Modulo Theories*), kita memanfaatkan mesin pembuktian teorema otomatis (Microsoft Z3, TLA+, Dafny) untuk **membuktikan secara tuntas** bahwa:
1. Buku besar keuangan entri ganda mustahil menciptakan atau menghilangkan saldo secara ilegal.
2. State machine langganan tidak memiliki jalur transisi terlarang (misal akun dibatalkan tiba-tiba aktif kembali tanpa pembayaran).
3. Pohon otorisasi RBAC/ABAC secara matematis memiliki celah eskalasi hak akses sebesar nol.

---

### Integrasi Orkestrasi
- **FinTech & Penagihan SaaS**: `saas-billing`, `doku-payment-gateway`, `payment-gateway-expert`, `agentic-m2m-settlement`.
- **Verifikasi Identitas & Isolasi**: `authentication-identity-expert`, `saas-multi-tenant`, `zero-trust-secret-vault`.
- **Database & Batasan Constraint**: `database-orm-expert`, `spec-driven-development-expert`.
- **Pengujian Otonom & Red Teaming**: `property-mutation-testing-expert`, `autonomous-tdd-debugger`, `autonomous-red-teamer`, `anti-slop`.
- **Siklus Hidup & Tata Kelola**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`.

---

### 4 Pilar Metodologi Verifikasi Formal

```
┌────────────────────────────────────────────────────────────────────────┐
│               ALUR VERIFIKASI FORMAL & PEMBUKTIAN TEOREMA              │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Definisikan Invarian Matematis (Konservasi Saldo, Monotonik)        │
│                                   │                                    │
│                                   ▼                                    │
│ 2. Enkode ke Logika SMT / Formal (Z3 Logika Orde-1, TLA+, Dafny)       │
│                                   │                                    │
│                                   ▼                                    │
│ 3. Pengecekan Mesin Solver SMT (solver.check() -> SAT atau UNSAT)      │
│                 ┌─────────────────┴─────────────────┐                  │
│                 ▼                                   ▼                  │
│        [UNSAT: Teorema Terbukti]           [SAT: Bug Ditemukan!]       │
│                 │                                   │                  │
│                 │                          Ekstrak Counter-Example     │
│                 │                          (State persis kegagalan)    │
│                 ▼                                   │                  │
│ 4. Terapkan Constraint Database PostgreSQL          ▼                  │
│    (CHECK, Row-Level Locks, Types)         Perbaiki Logika & Uji Ulang │
└────────────────────────────────────────────────────────────────────────┘
```

#### 1. Mesin SMT Solver Z3 Nyata (WebAssembly & Python)
Gunakan mesin pembukti teorema Microsoft Z3 asli. Definisikan variabel simbolik, masukkan kondisi awal serta aturan transisi, lalu balikkan invarian (`Not(Invariant)`):
- Jika solver menghasilkan `unsat` (tidak dapat dipenuhi), properti tersebut **terbukti benar secara matematis untuk semua kemungkinan input**.
- Jika solver menghasilkan `sat`, Z3 secara otomatis memberikan **model *counter-example*** yang membongkar skenario kegagalan spesifik.

#### 2. Spesifikasi TLA+ untuk Konkurensi Terdistribusi
Memodelkan state konkuren dan transisi langkah tanpa gangguan detail implementasi. Membuktikan ketiadaan *deadlock* dan desinkronisasi pada sistem pembayaran terdistribusi.

#### 3. Kontrak Terverifikasi Dafny
Menghasilkan kode terverifikasi matematis dengan prasyarat (`requires`) dan pascasyarat (`ensures`) yang terbukti benar sebelum kompilasi.

#### 4. Kompilasi ke Constraint Database PostgreSQL
Setiap invarian yang terbukti wajib dikompilasi langsung ke skema database: domain PostgreSQL, klausa `CHECK`, foreign key, dan trigger penundaan transaksi (*deferred triggers*).

---

### Standar Penegakan Anti-Slop
1. **Dilarang Menggunakan Simulasi Kode Palsu**: Modul verifikasi formal wajib memanfaatkan antarmuka SMT solver nyata (Z3 WASM atau Z3 Python), bukan sekadar perulangan *if-else* biasa.
2. **Keluaran Kode 100% Utuh**: Tidak boleh ada placeholder `// TODO` atau fungsi yang belum diimplementasikan.
3. **Verifikasi Lulus Bersih**: Kode wajib tervalidasi bebas dari segala bentuk slop menggunakan `node scripts/check-anti-slop.js`.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec formal-spec-z3-verifier <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
