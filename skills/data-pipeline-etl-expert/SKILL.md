---
name: data-pipeline-etl-expert
description: "Data pipelines, ETL/ELT, dbt, Airflow, ClickHouse, and DuckDB / Pipeline data, ETL/ELT, dbt, Airflow, ClickHouse, dan DuckDB."
author: "Roedy Rustam"
version: "4.7.0"
---

# Data Pipeline & ETL Expert / Ahli Data Pipeline & ETL

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

#### 3. Incremental Parquet Compaction & Lineage Gate / Gerbang Kompaksi Parquet & Silsilah Data

```typescript
export interface CompactionBatch {
  table: string;
  partitionKey: string;
  sourceFiles: string[];
  rowCount: number;
  checksumSha256: string;
}

export function verifyEtlLineageGate(batch: CompactionBatch, minRows = 1): { valid: boolean; targetUri: string } {
  if (!batch.table || batch.sourceFiles.length === 0 || batch.rowCount < minRows) {
    throw new Error(`Invalid ETL compaction batch for table: ${batch.table}`);
  }
  const targetUri = `s3://lakehouse/warehouse/${batch.table}/partition=${batch.partitionKey}/compacted-${batch.checksumSha256.slice(0, 12)}.parquet`;
  return { valid: true, targetUri };
}
```

## Orchestration & Integration
- **Upstream Languages & Scripts**: `python-programming-expert`, `go-programming-expert`, `rust-programming-expert`
- **Transactional & Analytics DBs**: `database-orm-expert`, `olap-columnar-analytics-expert`, `search-engine-expert`, `vector-db-rag-expert`
- **Telemetry & Observability**: `data-telemetry-expert`, `logging-error-tracking-expert`
- **Scheduling & Queues**: `cron-scheduler-expert`, `async-queue-temporal-expert`, `event-driven-architect`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`
- **Cross-Domain Synergy & Subagent Swarm Integration**: `data-visualization-expert`, `web-scraper`

### Description
Production engineering guide for building idempotent ELT/ETL data pipelines, Change Data Capture (CDC) streams, and Medallion Lakehouse architectures (`Bronze` $\rightarrow$ `Silver` $\rightarrow$ `Gold`). Covers Software-Defined Assets (`Dagster`), SQL transformation engineering (`dbt Core`), and columnar Parquet/Iceberg processing (`DuckDB`, `ClickHouse`, `BigQuery`).

### 1. Data Pipeline & Orchestration Architecture Matrix (2026)

| Layer | Legacy Approach | 2026 Production Standard | Architectural Advantage |
| :--- | :--- | :--- | :--- |
| **Ingestion (OLTP $\rightarrow$ OLAP)** | Nightly `SELECT *` batch cron | **Log-Based CDC** (Postgres Logical Replication / PeerDB / Debezium) | Zero impact on OLTP CPU; sub-5s data freshness |
| **Orchestration** | Imperative task-based cron scripts | **Dagster** (Software-Defined Assets + Partitioned Backfills) | Data lineage graph, declarative freshness SLAs, unit-testable assets |
| **Transformation** | Stored procedures in OLTP DB | **dbt Core** (Incremental models + schema contract tests) | Version-controlled SQL, automated `not_null` / `unique` / referential tests |
| **Storage Format** | Raw uncompressed CSV dumps | **ZSTD Parquet / Apache Iceberg** on S3/R2 | 10x smaller storage, predicate pushdown, schema evolution |

### 2. DuckDB Parameterized Parquet Lakehouse Processor (TypeScript)
Use DuckDB with ZSTD-compressed Parquet partitions for high-speed analytical transformations without spinning up expensive JVM Spark clusters:

```typescript
// src/etl/duckdb-parquet-pipeline.ts
import duckdb from 'duckdb';

export interface DailyTenantMetrics {
  tenant_id: string;
  metric_day: string;
  total_events: number;
  unique_actors: number;
}

export class DuckDbEtlRunner {
  private readonly db: duckdb.Database;

  constructor() {
    this.db = new duckdb.Database(':memory:');
  }

  public async aggregateParquetPartition(
    parquetGlobPath: string,
    minDateIso: string
  ): Promise<DailyTenantMetrics[]> {
    const connection = this.db.connect();
    const escapedPath = parquetGlobPath.replace(/'/g, "''");
    const escapedDate = minDateIso.replace(/'/g, "''");

    return new Promise((resolve, reject) => {
      connection.all(
        `
        SELECT
          tenant_id,
           strftime(date_trunc('day', recorded_at), '%Y-%m-%d') AS metric_day,
          CAST(count(*) AS INTEGER) AS total_events,
          CAST(count(DISTINCT actor_id) AS INTEGER) AS unique_actors
        FROM read_parquet('${escapedPath}', hive_partitioning = true)
        WHERE recorded_at >= CAST('${escapedDate}' AS TIMESTAMP)
        GROUP BY tenant_id, metric_day
        ORDER BY metric_day DESC, total_events DESC
        `,
        (err, rows) => {
          if (err) {
            return reject(new Error(`DUCKDB_ETL_FAILED: ${err.message}`));
          }
          resolve(rows as DailyTenantMetrics[]);
        }
      );
    });
  }
}
```

### 3. Idempotent dbt Incremental Model with Late-Arriving Event Lookback (`models/marts/fct_daily_usage.sql`)
Always include a lookback window (e.g., `3 days`) in incremental ELT models to capture late-arriving webhook or mobile offline events without duplicating rows:

```sql
{{
  config(
    materialized = 'incremental',
    unique_key = ['tenant_id', 'metric_date'],
    incremental_strategy = 'merge',
    on_schema_change = 'sync_all_columns'
  )
}}

SELECT
  tenant_id,
  CAST(date_trunc('day', event_timestamp) AS DATE) AS metric_date,
  count(DISTINCT event_id) AS total_api_calls,
  sum(tokens_consumed) AS total_tokens,
  current_timestamp AS updated_at
FROM {{ ref('stg_telemetry_events') }}

{% if is_incremental() %}
  -- 3-day lookback window heals late-arriving events idempotently via unique_key merge
  WHERE event_timestamp >= (
    SELECT dateadd(day, -3, max(metric_date)) FROM {{ this }}
  )
{% endif %}

GROUP BY 1, 2
```

### 4. Dagster Software-Defined Asset with Partitioned Backfill & Freshness SLA (`pipeline/assets.py`)
Define data pipelines as declarative, unit-testable Software-Defined Assets with daily partitions and explicit freshness checks:

```python
# pipeline/assets.py
from datetime import datetime, timezone
import duckdb
from dagster import (
    AssetExecutionContext,
    DailyPartitionsDefinition,
    FreshnessPolicy,
    MetadataValue,
    Output,
    asset,
)

daily_partitions = DailyPartitionsDefinition(start_date="2026-01-01")

@asset(
    partitions_def=daily_partitions,
    freshness_policy=FreshnessPolicy(maximum_lag_minutes=30),
    group_name="silver_lakehouse",
    compute_kind="duckdb",
)
def silver_tenant_events(context: AssetExecutionContext) -> Output[str]:
    partition_date = context.partition_key
    source_glob = f"s3://lakehouse/bronze/events/dt={partition_date}/*.parquet"
    target_uri = f"s3://lakehouse/silver/tenant_events/dt={partition_date}/part-000.parquet"

    con = duckdb.connect(database=":memory:")
    con.execute("INSTALL httpfs; LOAD httpfs;")

    row_count_res = con.execute(
        """
        COPY (
            SELECT
                event_id,
                tenant_id,
                actor_id,
                event_name,
                CAST(recorded_at AS TIMESTAMPTZ) AS recorded_at
            FROM read_parquet(?, hive_partitioning = true)
            WHERE tenant_id IS NOT NULL AND event_id IS NOT NULL
            QUALIFY row_number() OVER (PARTITION BY tenant_id, event_id ORDER BY recorded_at DESC) = 1
        ) TO ? (FORMAT PARQUET, CODEC 'ZSTD', ROW_GROUP_SIZE 122880)
        """,
        [source_glob, target_uri],
    ).fetchone()

    written_rows = int(row_count_res[0]) if row_count_res else 0
    if written_rows == 0:
        context.log.warning(f"Zero rows compacted for partition {partition_date}")

    return Output(
        value=target_uri,
        metadata={
            "partition_date": MetadataValue.text(partition_date),
            "rows_compacted": MetadataValue.int(written_rows),
            "compacted_at": MetadataValue.text(datetime.now(timezone.utc).isoformat()),
        },
    )
```

### 5. Log-Based CDC Watermark Tracker & Dead-Letter Quarantine Gate (TypeScript)
Never silently drop malformed rows during ELT ingestion. Route schema-violating records to a quarantine table with full lineage metadata while advancing the high-watermark cursor atomically:

```typescript
// src/etl/cdc-watermark-quarantine.ts
import { z } from 'zod';

export const RawCdcEventSchema = z.object({
  lsn: z.string().min(3),
  eventId: z.string().uuid(),
  tenantId: z.string().uuid(),
  payload: z.record(z.string(), z.unknown()),
  emittedAtIso: z.string().datetime(),
});

export type RawCdcEvent = z.infer<typeof RawCdcEventSchema>;

export interface QuarantineRecord {
  readonly rawEventJson: string;
  readonly validationErrors: string;
  readonly sourceStream: string;
  readonly quarantinedAtIso: string;
}

export function partitionValidAndQuarantineBatch(
  streamName: string,
  rawRecords: readonly unknown[]
): {
  validEvents: RawCdcEvent[];
  quarantined: QuarantineRecord[];
  highestLsn: string | null;
} {
  const validEvents: RawCdcEvent[] = [];
  const quarantined: QuarantineRecord[] = [];
  let highestLsn: string | null = null;

  for (const record of rawRecords) {
    const parsed = RawCdcEventSchema.safeParse(record);
    if (!parsed.success) {
      quarantined.push({
        rawEventJson: JSON.stringify(record),
        validationErrors: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
        sourceStream: streamName,
        quarantinedAtIso: new Date().toISOString(),
      });
      continue;
    }
    validEvents.push(parsed.data);
    if (highestLsn === null || parsed.data.lsn > highestLsn) {
      highestLsn = parsed.data.lsn;
    }
  }

  return { validEvents, quarantined, highestLsn };
}
```

### Hard Guardrails (Declarative Invariants)
- **No Unbounded OLTP `SELECT *` Batch Scans**: Never extract analytical batches via unindexed `SELECT * FROM table` against primary OLTP databases; always use log-based CDC (`Logical Replication` / `PeerDB` / `Debezium`) or cursor-paginated read replicas.
- **Mandatory Partition Idempotency**: Every pipeline execution must be idempotent per partition key (`unique_key` merge or partition overwrite) so re-running a failed date partition never duplicates rows.
- **Late-Arriving Event Lookback Window**: Incremental dbt and DuckDB transformations must apply a configurable lookback window (`24h` to `72h`) deduplicated via `QUALIFY row_number() OVER (...) = 1` or `MERGE`.
- **Dead-Letter Quarantine over Silent Drop**: Malformed records failing schema contracts must be routed to an auditable quarantine table rather than crashing the entire batch or being silently discarded.
- **Columnar ZSTD Compression**: Lakehouse object storage outputs must use `PARQUET` with `ZSTD` compression and explicit row-group sizing (`100K–128K` rows).

### 6. Production Verification Checklist
- [ ] Every pipeline run is **idempotent**: re-running a date partition (`2026-10-23`) overwrites or merges cleanly via `unique_key` without duplicating rows.
- [ ] OLTP extraction uses log-based CDC or read replicas with cursor pagination, never unindexed full-table scans on primary OLTP nodes.
- [ ] dbt models enforce schema contracts (`not_null`, `unique`, `accepted_values`) before promoting `Silver` tables to customer-facing `Gold` marts.
- [ ] Incremental models include a configurable lookback window (`24h–72h`) to reconcile late-arriving telemetry.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec data-pipeline-etl-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 Query Latency < 15ms, 100% Row Level Security (RLS) coverage on multi-tenant tables, explicit B-Tree indexes on all Foreign Keys; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Bahasa & Skrip Hulu**: `python-programming-expert`, `go-programming-expert`, `rust-programming-expert`
- **Database Transaksional & Analitik**: `database-orm-expert`, `olap-columnar-analytics-expert`, `search-engine-expert`, `vector-db-rag-expert`
- **Telemetri & Observabilitas**: `data-telemetry-expert`, `logging-error-tracking-expert`
- **Penjadwalan & Antrean**: `cron-scheduler-expert`, `async-queue-temporal-expert`, `event-driven-architect`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `data-visualization-expert`, `web-scraper`

### Deskripsi
Panduan rekayasa produksi untuk membangun pipeline data ELT/ETL yang idempoten, aliran Change Data Capture (CDC), dan arsitektur Medallion Lakehouse (`Bronze` $\rightarrow$ `Silver` $\rightarrow$ `Gold`). Mencakup orkestrasi berbasis aset (`Dagster`), transformasi SQL teruji (`dbt Core`), serta pemrosesan kolumnar Parquet/Iceberg (`DuckDB`, `ClickHouse`, `BigQuery`).

### Checklist Verifikasi Produksi
- [ ] Pastikan setiap pipeline bersifat **idempoten** (eksekusi ulang pada partisi tanggal yang sama tidak menggandakan data).
- [ ] Gunakan replikasi logis CDC atau read-replica saat mengekstrak data dari database OLTP utama.
- [ ] Sertakan jendela *lookback* (`3 hari`) pada model inkremental `dbt` untuk menangkap data event yang terlambat masuk.
- [ ] Terapkan pengujian skema otomatis (`not_null`, `unique`) pada setiap tabel mart analitik.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec data-pipeline-etl-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi Query P99 < 15ms, cakupan Row Level Security (RLS) 100% pada tabel multi-tenant, indeks B-Tree eksplisit pada seluruh Foreign Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
