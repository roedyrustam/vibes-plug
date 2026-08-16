---
name: event-driven-architect
description: "Expert guide for microservices, message queues, Event Sourcing, and high-scale backend architectures / Panduan ahli untuk arsitektur microservices, antrean pesan, dan backend skala tinggi."
author: "vibes-plug-swarm"
---

# Event-Driven Architecture Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
This skill provides architectural guidance for breaking down large monolithic applications into scalable, decoupled services. It focuses on Event-Driven Architecture (EDA), message brokers, and advanced patterns like Event Sourcing and CQRS (Command Query Responsibility Segregation).

### Trigger Conditions
- Scaling a system that handles extremely high throughput or traffic spikes.
- Implementing background jobs, asynchronous workers, or heavy data processing.
- Transitioning from a monolith to microservices.
- Integrating message brokers like RabbitMQ, Apache Kafka, AWS SQS, or Redis Pub/Sub.
- Resolving distributed transaction issues (e.g., handling the Saga pattern).

### Core Architecture Guidelines

#### 1. Decoupling via Events
Do not use synchronous HTTP calls between microservices for state mutations. It creates tightly coupled systems that fail in cascades.
- **Publisher/Subscriber**: When Service A does something, it publishes an event (e.g., `UserCreated`). Service B and Service C listen to this event and react asynchronously.
- Use **RabbitMQ** or **AWS SQS** for standard task queues (where order and exact-once delivery might be managed).
- Use **Apache Kafka** or **Redpanda** for high-throughput event streaming where logs need to be replayed.

#### 2. The Saga Pattern (Distributed Transactions)
In microservices, you cannot use simple database transactions (ACID) across different databases.
- Use the **Saga Pattern** to coordinate multiple operations. If Step 3 in a 4-step process fails, the system must publish "compensating events" to undo Steps 1 and 2 in the other services.

#### 3. CQRS (Command Query Responsibility Segregation)
For high-read applications (like social media or analytics dashboards), split the read operations from the write operations.
- **Commands**: Mutate state (write database).
- **Queries**: Read state (read replica or materialized views/Elasticsearch).
- Events synchronize the Write DB with the Read DB.

#### 4. Event Sourcing
Instead of storing just the current state of an entity (e.g., `AccountBalance = $100`), store the *history of events* that led to that state (`Deposited $150`, `Withdrew $50`). The current state is derived by replaying the events. This is mandatory for financial and highly auditable systems.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Skill ini memberikan panduan arsitektural untuk memecah aplikasi monolit yang besar menjadi layanan yang terdesentralisasi (*decoupled*) dan dapat diskalakan. Fokus utamanya adalah pada *Event-Driven Architecture* (Arsitektur Berbasis Peristiwa), *message brokers* (pialang pesan), serta pola lanjutan seperti *Event Sourcing* dan CQRS (*Command Query Responsibility Segregation*).

### Kondisi Pemicu
- Menskalakan sistem untuk menangani lonjakan *traffic* atau volume data yang sangat tinggi.
- Mengimplementasikan pekerjaan latar belakang (*background jobs*), *worker asinkron*, atau pemrosesan data berat.
- Bertransisi dari arsitektur monolit ke layanan mikro (*microservices*).
- Mengintegrasikan *message brokers* seperti RabbitMQ, Apache Kafka, AWS SQS, atau Redis Pub/Sub.
- Menyelesaikan masalah transaksi terdistribusi (misalnya menerapkan pola Saga).

### Panduan Arsitektur Inti

#### 1. Desentralisasi melalui Event
Jangan gunakan panggilan HTTP yang sinkron antar *microservices* untuk memutasi data. Hal ini menciptakan sistem yang saling bergantung ketat (*tightly coupled*) dan bisa menyebabkan kegagalan beruntun (*cascading failures*).
- **Publisher/Subscriber**: Saat Layanan A melakukan sesuatu, ia menerbitkan sebuah event (misalnya `UserCreated`). Layanan B dan C akan mendengarkan event ini dan bereaksi secara asinkron.
- Gunakan **RabbitMQ** atau **AWS SQS** untuk antrean tugas standar.
- Gunakan **Apache Kafka** atau **Redpanda** untuk *streaming event* throughput tinggi yang memerlukan *replay* log.

#### 2. Pola Saga (Transaksi Terdistribusi)
Dalam arsitektur *microservices*, Anda tidak dapat menggunakan transaksi database ACID standar lintas database yang berbeda.
- Gunakan **Saga Pattern** untuk mengoordinasikan beberapa operasi. Jika Langkah 3 dalam proses 4-langkah gagal, sistem harus menerbitkan "event kompensasi" (pembatalan) untuk membatalkan Langkah 1 dan 2 pada layanan sebelumnya.

#### 3. CQRS (Command Query Responsibility Segregation)
Untuk aplikasi dengan tingkat pembacaan yang sangat tinggi (seperti dasbor analitik), pisahkan operasi baca dari operasi tulis.
- **Command**: Memutasi state/data (Database Tulis).
- **Query**: Membaca state (Read Replica, Materialized Views, atau Elasticsearch).
- Event bertugas menyinkronkan Database Tulis ke Database Baca di latar belakang.

#### 4. Event Sourcing
Daripada hanya menyimpan kondisi terbaru sebuah data (mis. `SaldoAkun = Rp1.000.000`), simpan *sejarah lengkap peristiwa* yang mengarah ke saldo tersebut (`Setor Rp1.500.000`, `Tarik Rp500.000`). Kondisi saat ini diturunkan (dikalkulasi) dengan memutar ulang (*replaying*) event tersebut. Pola ini wajib untuk sistem finansial dan sistem yang membutuhkan jejak audit tingkat tinggi.
