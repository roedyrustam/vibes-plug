---
name: data-pipeline-etl-expert
description: "Expert guide for Data Pipelines, ETL/ELT, and Analytics Engineering. Covers dbt, Apache Airflow, Dagster, BigQuery, ClickHouse, and DuckDB / Panduan ahli untuk Data Pipelines, ETL/ELT. Mencakup dbt, Airflow, Dagster, BigQuery, ClickHouse, dan DuckDB."
author: "Roedy Rustam"
---

# Data Pipeline & ETL Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for designing and implementing robust Data Pipelines, ETL (Extract, Transform, Load) / ELT architectures, and Analytics Engineering. Covers modern data stack tools including dbt (data build tool), orchestration engines (Apache Airflow, Dagster, Prefect), and analytical databases/warehouses (BigQuery, ClickHouse, DuckDB).

### Trigger Conditions
Activate this skill when the user is:
- Building reporting dashboards or analytical features for a SaaS platform.
- Setting up ETL or ELT pipelines to move data from transactional databases to a data warehouse.
- Writing data transformation models using SQL and dbt.
- Designing data orchestration workflows using Dagster or Airflow.

---

### Core Concepts

#### 1. ETL vs ELT Architecture
- **ETL (Extract, Transform, Load):** Data is transformed on a processing server *before* being loaded into the warehouse. Best for strict compliance or masking PII before storage.
- **ELT (Extract, Load, Transform):** Data is extracted and loaded raw into the warehouse, then transformed using the warehouse's compute power (e.g., using dbt). This is the modern standard for scalable analytics.

#### 2. Selection Guide: Data Orchestration

| Tool | Architecture | Best For |
|---|---|---|
| **Apache Airflow** | Task-based, Python DAGs | Legacy ecosystems, complex cron-based scheduling. |
| **Dagster** | Data/Asset-aware | Modern data stacks, treating data assets as first-class citizens. |
| **Prefect** | Hybrid execution | Python-heavy data science workflows, dynamic tasks. |

**Recommendation:** Use Dagster for modern Analytics Engineering, as its software-defined asset (SDA) approach provides superior observability and testing compared to Airflow's pure task-based DAGs.

---

### Analytics Engineering with dbt

dbt (data build tool) enables data analysts and engineers to transform data in their warehouse using simple select statements.

```sql
-- Example: A dbt model (models/marts/core/dim_users.sql)
{{ config(materialized='table') }}

with stg_users as (
    select * from {{ ref('stg_stripe_users') }}
),
user_orders as (
    select * from {{ ref('stg_orders') }}
)
select
    stg_users.user_id,
    stg_users.email,
    count(user_orders.order_id) as lifetime_orders
from stg_users
left join user_orders on stg_users.user_id = user_orders.user_id
group by 1, 2
```

---

### Best Practices

1. **Idempotency:** Ensure all data pipeline tasks are idempotent. Running the same pipeline twice for the same date range should yield the exact same result without duplicating data.
2. **Version Control everything:** Data transformations (dbt models) and orchestration DAGs must live in version control (Git) alongside application code.
3. **Data Contracts:** Implement data contracts (e.g., using JSON Schema) between software engineering (who produce the data) and data engineering (who consume it) to prevent upstream schema changes from breaking downstream pipelines.
4. **Use DuckDB for Local Testing:** DuckDB is an in-process SQL OLAP database. Use it to run CI/CD tests on your data transformations quickly before deploying to production warehouses like BigQuery or Snowflake.

---

### Common Pitfalls to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| **"Select *" in transformations** | Brittle models that break on upstream schema changes | Explicitly define columns in downstream staging layers. |
| **Treating data warehouses like OLTP** | High latency and massive compute costs | Batch updates, use append-only logs, and avoid point-updates (UPDATE/DELETE). |
| **Lack of Data Quality Testing** | Silent failures and bad reports | Use dbt tests (`not_null`, `unique`) and tools like Great Expectations to block bad data. |

---

### Integration with Other Skills (MANDATORY)

This skill works best when combined with:
- `database-orm-expert` — For extracting data safely from the primary OLTP database (PostgreSQL/MySQL) via Change Data Capture (CDC) or logical replication.
- `python-programming-expert` — Python is the lingua franca of data orchestration (Airflow/Dagster).
- `data-telemetry-expert` — For correlating product telemetry (PostHog/Mixpanel) with transactional data in the warehouse.

### Referenced By Orchestrators (MANDATORY)

This skill should be referenced by the following orchestrators:
- `brainstorming` — Add to the "Data & Analytics" domain.
- `zero-to-prod-orchestrator` — Phase 7 (Analytics & Post-Launch Monitoring).
- `production-ready-hardener` — Phase 7 (Telemetry & Analytics) for data contract validation.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk merancang arsitektur Data Pipeline, ETL (Extract, Transform, Load) / ELT, dan Analytics Engineering yang tangguh. Mencakup *tools* modern data stack seperti dbt (data build tool), mesin orkestrasi (Apache Airflow, Dagster), dan database analitik/warehouse (BigQuery, ClickHouse, DuckDB).

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- Membangun dashboard pelaporan atau fitur analitik untuk platform SaaS.
- Menyiapkan pipeline ETL atau ELT untuk memindahkan data dari database transaksional ke data warehouse.
- Menulis model transformasi data menggunakan SQL dan dbt.
- Merancang alur kerja orkestrasi data menggunakan Dagster atau Airflow.

### Panduan Singkat

- **Pilih ELT di atas ETL:** Di era *cloud warehouse*, ekstrak dan muat (Load) data mentah ke *warehouse* terlebih dahulu, lalu gunakan kekuatan komputasi *warehouse* untuk melakukan Transformasi (misalnya dengan dbt).
- **Idempotensi adalah Kunci:** Pastikan setiap *task* dalam pipeline bersifat idempoten. Jika sebuah *job* gagal dan diulang, tidak boleh ada data yang terduplikasi.
- **Uji Kualitas Data Secara Otomatis:** Jangan asumsikan data yang masuk selalu benar. Gunakan *built-in tests* di dbt (seperti `not_null`, `unique`, atau *referential integrity*) untuk mencegah "sampah masuk, sampah keluar".
- **Gunakan DuckDB untuk Pengembangan:** Uji pipeline analitik Anda secara lokal menggunakan DuckDB yang sangat ringan sebelum menjalankannya di BigQuery atau ClickHouse yang memakan biaya.

### Integrasi dengan Skill Lain (WAJIB)

Skill ini bekerja paling baik dikombinasikan dengan:
- `database-orm-expert` — Untuk mengekstrak data dari database utama secara aman menggunakan Change Data Capture (CDC).
- `python-programming-expert` — Python adalah bahasa standar untuk orkestrasi data (Airflow/Dagster).
- `data-telemetry-expert` — Untuk menggabungkan data telemetri produk (PostHog) dengan data transaksi di warehouse.

### Direferensikan oleh Orchestrator (WAJIB)

Skill ini harus direferensikan oleh orchestrator berikut:
- `brainstorming` — Tambahkan ke domain "Data & Analytics".
- `zero-to-prod-orchestrator` — Fase 7 (Analytics).
- `production-ready-hardener` — Fase 7 (Telemetry & Analytics).
