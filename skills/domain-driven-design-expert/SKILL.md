---
name: domain-driven-design-expert
description: "Expert guide for Domain-Driven Design (DDD). Covers tactical patterns (Aggregates, Value Objects), strategic patterns (Bounded Contexts), event storming, and CQRS / Panduan ahli Desain Berbasis Domain (DDD)."
author: vibes-plug-swarm
---

# Domain-Driven Design (DDD) Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
A software architecture guide focused on tackling complexity in the heart of software. This skill bridges the gap between business rules and codebase structure using Domain-Driven Design (DDD). It covers Strategic Design (Bounded Contexts, Ubiquitous Language) and Tactical Design (Aggregates, Value Objects, Domain Events, Repositories).

### Trigger Conditions
- When refactoring a massive, monolithic "Big Ball of Mud" codebase.
- When defining microservice boundaries (Bounded Contexts).
- When the user asks about "Clean Architecture", "CQRS", or "Event Sourcing".
- When building core business logic that is highly complex and rule-heavy (e.g., banking, logistics, SaaS billing engines).

### Core Architectural Guidelines

#### 1. Strategic Design (The Big Picture)
- **Ubiquitous Language**: The code must speak the language of the business. Do not use generic terms like `UserData` if the business calls it a `Subscriber`.
- **Bounded Contexts**: Divide large systems into distinct contexts. A `Product` in the Inventory context has different attributes than a `Product` in the Billing context. Do not try to create one massive, unified `Product` model.

#### 2. Tactical Design (The Code)
- **Value Objects**: Use immutable Value Objects for attributes (e.g., `Money`, `Address`, `Email`) instead of primitives (`int`, `string`). Value Objects validate themselves upon creation.
- **Entities & Aggregates**: Group related Entities together under a single Aggregate Root. External objects may only hold a reference to the Aggregate Root, never to its internal children.
- **Repositories**: Only create Repositories for Aggregate Roots.

#### 3. Domain Events
When an Aggregate changes state in a way that other parts of the system care about, it should publish a Domain Event (e.g., `OrderPlacedEvent`). This decouples side-effects (like sending an email) from the core business transaction.

#### 4. CQRS (Command Query Responsibility Segregation)
For highly scalable systems, separate the models used for writing data (Commands) from the models used for reading data (Queries).
- **Commands**: Modify state via the rich Domain Model.
- **Queries**: Read data directly from optimized database views or read models, bypassing the Domain Model entirely for performance.

## Orchestration & Integration
- Extends `scalability-clean-code` with strict domain isolation patterns.
- Essential for `event-driven-architect` when defining what events flow through the message broker.
- Complements `micro-frontend-architect` by aligning frontend boundaries with backend Bounded Contexts.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan arsitektur perangkat lunak yang berfokus pada penanganan kompleksitas bisnis. Skill ini menjembatani aturan bisnis dan struktur kode menggunakan Domain-Driven Design (DDD). Meliputi Desain Strategis (Bounded Contexts, Ubiquitous Language) dan Desain Taktis (Aggregates, Value Objects, Domain Events).

### Kondisi Pemicu
- Saat melakukan refactoring codebase monolitik yang sudah berantakan (Big Ball of Mud).
- Saat mendefinisikan batas-batas layanan microservices.
- Saat membangun logika bisnis inti yang sangat kompleks (misal: mesin penagihan SaaS, sistem perbankan).

### Panduan Arsitektur Inti

#### 1. Desain Strategis
- **Ubiquitous Language**: Kode harus menggunakan bahasa yang sama dengan pihak bisnis. Hindari istilah teknis generik jika ada istilah bisnis yang lebih tepat.
- **Bounded Contexts**: Jangan mencoba membuat satu model data raksasa (misal: tabel `User` dengan 100 kolom). Pisahkan berdasarkan konteks; entitas `User` di konteks Penagihan berbeda dengan `User` di konteks Pengiriman.

#### 2. Desain Taktis (Implementasi Kode)
- **Value Objects**: Gunakan objek *immutable* (tidak dapat diubah) untuk atribut seperti `Uang`, `Alamat`, atau `Email` daripada tipe data primitif biasa (string/int).
- **Aggregates**: Kelompokkan entitas-entitas yang saling berhubungan ke dalam satu Aggregate Root. Interaksi dari luar hanya boleh melalui Root ini untuk menjaga konsistensi data.
- **Repositories**: Buat Repository hanya untuk Aggregate Root, bukan untuk setiap tabel di database.

#### 3. Domain Events
Pisahkan efek samping (side-effects). Daripada membuat modul Pesanan memanggil modul Email secara langsung, buat modul Pesanan menerbitkan `OrderPlacedEvent`. Modul Email akan bereaksi terhadap event tersebut.

#### 4. CQRS
Pisahkan model data untuk operasi *Write* (Command) dan *Read* (Query). Model baca dapat dioptimalkan secara drastis dengan melakukan bypass penuh pada logika domain.

## Integrasi Orkestrasi
- Mengembangkan `scalability-clean-code` dengan pola isolasi domain yang ketat.
- Sangat penting bagi `event-driven-architect` untuk menentukan struktur event di message broker.
- Membantu `micro-frontend-architect` menyelaraskan batas-batas frontend dengan Bounded Contexts backend.
