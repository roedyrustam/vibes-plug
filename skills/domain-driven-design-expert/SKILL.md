---
name: domain-driven-design-expert
description: "Expert guide for Domain-Driven Design (DDD). Covers tactical patterns (Aggregates, Value Objects), strategic patterns (Bounded Contexts), event storming, and CQRS / Panduan ahli Desain Berbasis Domain (DDD)."
author: "Roedy Rustam"
version: "4.4.2"
---

# Domain-Driven Design (DDD) Expert (Strategic & Tactical 2026)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **Architecture & Modularity**: `scalability-clean-code` (SOLID, Hexagonal/Ports & Adapters), `event-driven-architect` (Domain Events, Kafka/RabbitMQ), and `saas-architect` (Bounded Context isolation).
- **Persistence & Mapping**: `database-orm-expert` (Repository pattern, Data Mappers, pure domain models without ORM leakage), `double-entry-ledger-fintech-expert`.
- **Formal Verification & Quality**: `formal-spec-z3-verifier` (mathematical invariant verification) and `anti-slop` (pure domain model hygiene, zero anemic domain models).
- **Orchestration**: `brainstorming` and `zero-to-prod-orchestrator` (Phase 2 & Phase 3: Domain Discovery & Architecture).

### Description
Comprehensive architectural guide for tackling core business complexity using Domain-Driven Design (DDD). Covers Strategic Design (Bounded Contexts, Context Mapping, Anti-Corruption Layers, Ubiquitous Language) and Tactical Design (immutable Value Objects, Aggregate Roots, Domain Events, Repositories, Specification pattern, and CQRS separation).

### 1. Strategic & Tactical DDD Pattern Matrix

| DDD Pattern | Architectural Role | Boundary Rule | Anti-Pattern to Reject |
| :--- | :--- | :--- | :--- |
| **Bounded Context** | Autonomous semantic boundary (`Billing`, `Identity`, `Catalog`) | Communicates across contexts via Domain Events or Anti-Corruption Layer (ACL) | Sharing mutable ORM database models across microservice boundaries |
| **Value Object** | Immutable domain measure (`Money`, `Percentage`, `EmailAddress`) | Validated on construction; equality by structural value, never by ID | Primitive Obsession (passing raw `number` for currency or `string` for status) |
| **Aggregate Root** | Transactional consistency boundary (`OrderAggregate`, `InvoiceAggregate`) | 1 transaction = 1 Aggregate Root mutated; referenced externally only by ID | Modifying child entities directly or spanning 5 aggregates in one lock |
| **Anti-Corruption Layer (ACL)** | Translates external 3rd-party payloads (Stripe/DOKU/Legacy) into pure Domain types | Lives in the Infrastructure layer (`src/infrastructure/acl/`) | Leaking external webhook DTO shapes into core Domain Entities |

### 2. Tactical Pattern: Immutable Value Object & Aggregate Root (TypeScript)

```typescript
// src/domain/shared/value-objects/Money.ts
export type CurrencyCode = 'USD' | 'IDR' | 'EUR';

export class Money {
  public readonly amountMinor: bigint;
  public readonly currency: CurrencyCode;

  private constructor(amountMinor: bigint, currency: CurrencyCode) {
    if (amountMinor < 0n) {
      throw new Error('DOMAIN_INVARIANT_VIOLATION: Money amount cannot be negative.');
    }
    this.amountMinor = amountMinor;
    this.currency = currency;
  }

  public static fromMinorUnits(amountMinor: bigint | number, currency: CurrencyCode): Money {
    const normalized = typeof amountMinor === 'number' ? BigInt(Math.round(amountMinor)) : amountMinor;
    return new Money(normalized, currency);
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`CURRENCY_MISMATCH: Cannot add ${other.currency} to ${this.currency}.`);
    }
    return new Money(this.amountMinor + other.amountMinor, this.currency);
  }

  public equals(other: Money): boolean {
    return this.amountMinor === other.amountMinor && this.currency === other.currency;
  }
}

// src/domain/order/OrderAggregate.ts
export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAtIso: string;
  readonly aggregateId: string;
}

export class OrderPaidEvent implements DomainEvent {
  public readonly eventName = 'order.paid.v1';
  public readonly occurredAtIso = new Date().toISOString();
  constructor(
    public readonly aggregateId: string,
    public readonly paidAmountMinor: string,
    public readonly currency: CurrencyCode
  ) {}
}

export class OrderAggregate {
  private readonly domainEvents: DomainEvent[] = [];

  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    private total: Money,
    private status: 'DRAFT' | 'PAID' | 'CANCELLED' = 'DRAFT',
    private version: number = 1
  ) {}

  public getStatus(): 'DRAFT' | 'PAID' | 'CANCELLED' {
    return this.status;
  }

  public getTotal(): Money {
    return this.total;
  }

  public getVersion(): number {
    return this.version;
  }

  public markAsPaid(paymentAmount: Money): void {
    if (this.status !== 'DRAFT') {
      throw new Error(`INVALID_STATE_TRANSITION: Cannot pay order in ${this.status} state.`);
    }
    if (!this.total.equals(paymentAmount)) {
      throw new Error('PAYMENT_AMOUNT_MISMATCH: Paid amount does not match order total.');
    }
    this.status = 'PAID';
    this.version += 1;
    this.domainEvents.push(
      new OrderPaidEvent(this.id, this.total.amountMinor.toString(), this.total.currency)
    );
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }
}
```

### 3. Production Verification Checklist
- [ ] **Model Purity**: Domain Entities and Value Objects in `src/domain/` have zero imports from ORM (`drizzle-orm`, `@prisma/client`) or HTTP (`hono`, `next`, `express`) packages.
- [ ] **Access Strictly Through Aggregate Roots**: Child entities are mutated exclusively via invariant-checked methods on their Aggregate Root.
- [ ] **Optimistic Concurrency Version**: Every Aggregate Root tracks a monotonic `version` column checked during `Repository.save()` to prevent lost updates.
- [ ] **Anti-Corruption Layer (ACL)**: External API responses and webhooks are mapped through an ACL translator before entering the domain layer.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **Arsitektur & Modularitas**: `scalability-clean-code` (SOLID, Hexagonal/Ports & Adapters), `event-driven-architect` (Domain Events, Kafka/RabbitMQ), dan `saas-architect` (isolasi Bounded Context).
- **Persistensi & Pemetaan**: `database-orm-expert` (pola Repository, Data Mapper, model domain murni tanpa kebocoran ORM), `double-entry-ledger-fintech-expert`.
- **Verifikasi Formal & Kualitas**: `formal-spec-z3-verifier` (verifikasi invarian matematis) dan `anti-slop` (kebersihan model domain murni, anti anemic domain model).
- **Orkestrator Utama**: `brainstorming` dan `zero-to-prod-orchestrator` (Fase 2 & Fase 3: Penemuan Domain & Arsitektur).

### Deskripsi
Panduan arsitektur komprehensif untuk menangani kompleksitas bisnis inti menggunakan *Domain-Driven Design* (DDD), baik Desain Strategis (*Bounded Contexts*, *Anti-Corruption Layer*, *Ubiquitous Language*) maupun Desain Taktis (*Value Objects* imutabel, *Aggregate Roots*, *Domain Events*, dan *Repositories*).

### Checklist Verifikasi Produksi
- [ ] **Kemurnian Model Domain**: Folder `src/domain/` dilarang mengimpor pustaka database/ORM atau framework HTTP; seluruh logika domain harus dapat diuji unit secara murni di memori.
- [ ] **Mutasi Melalui Aggregate Root**: Seluruh perubahan state wajib melewati metode pada Aggregate Root yang memvalidasi aturan bisnis.
- [ ] **Satu Repository per Aggregate Root**: Hanya buat interface Repository untuk Aggregate Root (`IOrderRepository`), lengkap dengan pemeriksaan versi (*optimistic locking*).
