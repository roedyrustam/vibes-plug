---
name: python-programming-expert
description: "Expert-level skill for Python programming (Python 3.13/3.14+). Covers type safety, generic syntax (PEP 695), async/await TaskGroups, FastAPI 0.115+, Pydantic v2, uv package manager, Ruff, and pytest in English and Indonesian."
author: "Roedy Rustam"
version: "4.4.2"

---

# Python Programming Expert (3.14 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **AI & Agentic Systems**: `pydantic-ai-expert` (type-safe Pydantic agents), `ai-llm-integration-expert` (LangChain/LlamaIndex/LangGraph), `vector-db-rag-expert` (pgvector, Qdrant), `prompt-injection-firewall` (AI defense)
- **API Design & Contracts**: `api-design-expert`, `openapi-swagger-codegen-expert`, `spec-driven-development-expert` for OpenAPI 3.1 generation, FastAPI schemas, and RFC 9457 Problem Details
- **Database Layer**: `database-orm-expert` for async SQLAlchemy 2.x, SQLModel, Alembic migrations, connection pooling, and pgvector operations
- **Testing & Quality**: `autonomous-tdd-debugger`, `e2e-testing-expert`, `anti-slop` for running `pytest -v`, self-healing test failures, and zero-slop production code
- **Orchestration**: `brainstorming`, `zero-to-prod-orchestrator` (Phase 4: Backend & APIs)

### Description
Production-grade engineering standard for **Python 3.13 / 3.14+** enterprise applications, AI backends, and microservices. Covers free-threaded (no-GIL) execution (`python3.13t`), Tier-2 JIT compilation, PEP 695/696 generic type systems, structured concurrency with `asyncio.TaskGroup` and `asyncio.timeout`, high-throughput **FastAPI 0.115+**, **Pydantic v2**, async **SQLAlchemy 2.0**, and the Rust-powered **uv** toolchain.

### Trigger Conditions
- Developing Python 3.13+ / 3.14+ backend microservices, async APIs, or AI pipelines.
- Building **FastAPI 0.115+** REST APIs, **Litestar**, or high-performance async web services.
- Managing project environments, dependencies, and lockfiles via **`uv`**.
- Leveraging true multi-threaded CPU parallel execution with Python 3.13 free-threaded mode (no GIL).
- Implementing structured concurrency with `asyncio.TaskGroup` and `asyncio.timeout`.
- Designing strictly typed schemas using **Pydantic v2** (`TypeAdapter`, `@computed_field`, `BaseSettings`).
- Structuring async database persistence with **SQLAlchemy 2.0** and `asyncpg`.
- Running linting, formatting, and tests via **Ruff** and **pytest-asyncio**.

---

### Python Version Matrix (2026)

| Version | Status | Key Innovations |
|---|---|---|
| **Python 3.14** | Latest Release | PEP 696 type defaults, PEP 749 deferred annotation evaluation, Tier-2 JIT optimizations |
| **Python 3.13** | Stable LTS | Free-threaded build (no GIL: `python3.13t`), copy-and-patch JIT, improved interactive REPL |
| **Python 3.12** | Supported | PEP 695 type parameter syntax (`class Foo[T]:`), `type` alias statement |
| **Python 3.11** | Security only | `asyncio.TaskGroup`, `ExceptionGroup`, `asyncio.timeout` |

---

### Modern Python Toolchain: `uv` & Ruff

#### `uv` — Lightning-Fast Package Manager (Written in Rust)
`uv` replaces `pip`, `pip-tools`, `virtualenv`, `pyenv`, and `poetry` with 10-100x faster execution:

```bash
# 1. Initialize project with uv
uv init my-service --app
cd my-service

# 2. Add dependencies with exact constraints
uv add fastapi pydantic pydantic-settings "sqlalchemy[asyncio]>=2.0" asyncpg httpx

# 3. Add development and test dependency groups
uv add --group dev ruff mypy
uv add --group test pytest pytest-asyncio coverage

# 4. Run scripts and tests inside the managed environment
uv run fastapi dev main.py --port 8000
uv run pytest -v

# 5. Lock and synchronize exact dependencies
uv lock
uv sync --frozen
```

#### `pyproject.toml` — Single Canonical Configuration File
```toml
[project]
name = "my-service"
version = "0.1.0"
description = "High-performance async Python service"
readme = "README.md"
requires-python = ">=3.13"
dependencies = [
    "asyncpg>=0.30.0",
    "fastapi>=0.115.0",
    "httpx>=0.28.0",
    "pydantic>=2.10.0",
    "pydantic-settings>=2.7.0",
    "sqlalchemy[asyncio]>=2.0.38",
]

[dependency-groups]
dev = [
    "mypy>=1.14.0",
    "ruff>=0.9.0",
]
test = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.25.0",
]

[tool.ruff]
line-length = 100
target-version = "py313"

[tool.ruff.lint]
select = [
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "F",    # Pyflakes
    "I",    # isort imports
    "UP",   # pyupgrade
    "B",    # flake8-bugbear
    "SIM",  # flake8-simplify
    "ASYNC",# flake8-async
    "RUF",  # Ruff-specific rules
]

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
```

---

### Python 3.13+ Free-Threaded Mode (No GIL Execution)

Python 3.13 introduces the free-threaded build (`python3.13t`) where the Global Interpreter Lock is disabled. Unlike traditional Python where CPU-bound threads serialize on the GIL, free-threaded Python scales CPU tasks across all CPU cores using native worker threads without inter-process IPC overhead:

```python
import os
import sys
import sysconfig
from concurrent.futures import ThreadPoolExecutor
import time
import math

def check_gil_status() -> bool:
    """Returns True if the Global Interpreter Lock is enabled."""
    if hasattr(sys, "_is_gil_enabled"):
        return sys._is_gil_enabled()
    return True

def cpu_intensive_kernel(number: int) -> int:
    """Simulates CPU-heavy calculations (e.g. vector math, tokenization)."""
    count = 0
    for i in range(2, int(math.isqrt(number)) + 1):
        if number % i == 0:
            count += 1
    return count

def run_multithreaded_workload(items: list[int]) -> list[int]:
    gil_active = check_gil_status()
    workers = os.cpu_count() or 4
    print(f"Executing on {workers} cores | GIL Active: {gil_active}")

    start_time = time.perf_counter()
    with ThreadPoolExecutor(max_workers=workers) as executor:
        results = list(executor.map(cpu_intensive_kernel, items))
    
    elapsed = time.perf_counter() - start_time
    print(f"Processed {len(items)} items in {elapsed:.3f} seconds")
    return results

if __name__ == "__main__":
    workload = [10_000_000 + i for i in range(2000)]
    run_multithreaded_workload(workload)
```

---

### Type Safety — Modern 2026 Patterns

#### 1. Generic Syntax (PEP 695 & PEP 696)
```python
# Clean generic class declaration without TypeVar boilerplate
class CacheStore[TKey, TValue = dict]:
    def __init__(self) -> None:
        self._storage: dict[TKey, TValue] = {}

    def set(self, key: TKey, value: TValue) -> None:
        self._storage[key] = value

    def get(self, key: TKey) -> TValue | None:
        return self._storage.get(key)

# Generic type alias
type DatabaseRecord[ID: int | str] = dict[str, ID]
```

#### 2. Pydantic v2 Production Patterns
```python
from pydantic import BaseModel, Field, EmailStr, SecretStr, computed_field, TypeAdapter
from typing import Annotated

# Reusable typed constraint aliases
ValidId = Annotated[int, Field(gt=0)]
Username = Annotated[str, Field(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_-]+$")]

class UserCreate(BaseModel):
    model_config = {"str_strip_whitespace": True}

    username: Username
    email: EmailStr
    password: SecretStr = Field(min_length=8)

class UserResponse(BaseModel):
    id: ValidId
    username: Username
    email: EmailStr
    first_name: str
    last_name: str

    @computed_field
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

# High-speed batch parsing using TypeAdapter
batch_adapter = TypeAdapter(list[UserResponse])
def parse_user_batch(raw_json_data: list[dict]) -> list[UserResponse]:
    return batch_adapter.validate_python(raw_json_data)
```

---

### FastAPI 0.115+ Enterprise Architecture

#### Clean Repository & Service Pattern with Async SQLAlchemy 2.0
```python
# db.py
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer

class Base(DeclarativeBase):
    pass

class UserModel(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)

# Connection pooling configuration
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/app_db"
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_size=20,
    max_overflow=10,
    pool_recycle=1800,
)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
```

```python
# main.py
from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: cleanly close connection pool
    await engine.dispose()

app = FastAPI(title="Core Backend Service", version="1.0.0", lifespan=lifespan)

# RFC 9457 Problem Details Exception Handler
class ProblemDetailsException(HTTPException):
    def __init__(self, status_code: int, title: str, detail: str, type_url: str):
        super().__init__(status_code=status_code, detail=detail)
        self.title = title
        self.type_url = type_url

@app.exception_handler(ProblemDetailsException)
async def problem_details_handler(request, exc: ProblemDetailsException):
    return JSONResponse(
        status_code=exc.status_code,
        media_type="application/problem+json",
        content={
            "type": exc.type_url,
            "title": exc.title,
            "status": exc.status_code,
            "detail": exc.detail,
            "instance": str(request.url),
        }
    )

DbSession = Annotated[AsyncSession, Depends(get_db_session)]

@app.get("/users/{user_id}", response_model=UserResponse)
async def fetch_user(user_id: int, db: DbSession):
    stmt = select(UserModel).where(UserModel.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise ProblemDetailsException(
            status_code=status.HTTP_404_NOT_FOUND,
            title="User Not Found",
            detail=f"No active record found for user identifier {user_id}",
            type_url="https://api.domain.com/errors/user-not-found"
        )
    return user
```

---

### Structured Concurrency (`asyncio.TaskGroup` & `asyncio.timeout`)

Never use unbounded `asyncio.gather()` or obsolete `asyncio.wait_for`. Use `asyncio.TaskGroup` for deterministic failure isolation and `asyncio.timeout` for clean cancel-on-timeout management:

```python
import asyncio
import httpx

async def fetch_metrics(service_name: str, endpoint: str) -> dict:
    async with httpx.AsyncClient() as client:
        # Enforce bounded deadline with structured timeout
        async with asyncio.timeout(3.0):
            response = await client.get(endpoint)
            response.raise_for_status()
            return {service_name: response.json()}

async def aggregate_cluster_health() -> dict[str, dict]:
    results = {}
    endpoints = {
        "auth": "http://auth-service.internal/health",
        "billing": "http://billing-service.internal/health",
        "search": "http://search-service.internal/health",
    }

    try:
        async with asyncio.TaskGroup() as tg:
            tasks = {
                service: tg.create_task(fetch_metrics(service, url))
                for service, url in endpoints.items()
            }
        
        # When TaskGroup exits without error, all tasks are complete
        for service, task in tasks.items():
            results.update(task.result())

    except* TimeoutError as eg:
        # Python 3.11+ ExceptionGroup pattern
        print(f"One or more services timed out: {eg.exceptions}")
    except* httpx.HTTPError as eg:
        print(f"Service returned HTTP failure: {eg.exceptions}")

    return results
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec python-programming-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **AI & Sistem Agentic**: `pydantic-ai-expert` (agen Pydantic type-safe), `ai-llm-integration-expert` (LangChain/LlamaIndex/LangGraph), `vector-db-rag-expert` (pgvector, Qdrant), `prompt-injection-firewall` (keamanan AI)
- **Desain & Kontrak API**: `api-design-expert`, `openapi-swagger-codegen-expert`, `spec-driven-development-expert` untuk OpenAPI 3.1, skema FastAPI, dan RFC 9457 Problem Details
- **Lapisan Database**: `database-orm-expert` untuk SQLAlchemy 2.x async, SQLModel, migrasi Alembic, connection pooling, dan operasi pgvector
- **Pengujian & Kualitas**: `autonomous-tdd-debugger`, `e2e-testing-expert`, `anti-slop` untuk eksekusi `pytest -v`, perbaikan mandiri kode tes, dan kepatuhan anti-slop
- **Orkestrator Utama**: `brainstorming`, `zero-to-prod-orchestrator` (Fase 4: Backend & APIs)

### Deskripsi
Standar rekayasa perangkat lunak tingkat industri untuk aplikasi enterprise, backend AI, dan microservices berbasis **Python 3.13 / 3.14+**. Mencakup eksekusi free-threaded (tanpa GIL: `python3.13t`), kompilasi Tier-2 JIT, sistem tipe generic PEP 695/696, konkurensi terstruktur menggunakan `asyncio.TaskGroup` dan `asyncio.timeout`, arsitektur **FastAPI 0.115+**, **Pydantic v2**, async **SQLAlchemy 2.0**, serta toolchain modern berbasis Rust **uv**.

### Kondisi Pemicu
- Membangun microservice backend, API async, atau pipeline AI dengan Python 3.13+/3.14+.
- Mengembangkan REST API performa tinggi menggunakan **FastAPI 0.115+** atau **Litestar**.
- Mengelola dependensi, environment, dan virtual environment menggunakan **`uv`**.
- Memanfaatkan paralelisme multi-thread CPU sejati menggunakan mode free-threaded Python 3.13 (tanpa batasan GIL).
- Mengimplementasikan konkurensi terstruktur dengan `asyncio.TaskGroup` dan `asyncio.timeout`.
- Merancang skema data validasi dengan Pydantic v2 (`TypeAdapter`, `@computed_field`, `BaseSettings`).
- Menyusun persistensi database async dengan SQLAlchemy 2.0 dan driver `asyncpg`.
- Menjalankan linter, formatter, dan pengujian dengan Ruff dan pytest-asyncio.

---

### Aturan Utama Python Modern (Standar 2026)

1. **Gunakan `uv` Sebagai Manajer Paket Utama**: Tinggalkan `pip`, `poetry`, dan `virtualenv`. Gunakan `uv add`, `uv run`, `uv lock`, dan `uv sync` yang berjalan 10-100x lebih cepat.
2. **Manfaatkan Bebas-GIL untuk Komputasi CPU**: Pada Python 3.13t, gunakan `ThreadPoolExecutor` untuk memproses tugas-tugas intensif CPU (vektorisasi, tokenisasi, enkripsi) di seluruh core prosesor tanpa overhead IPC multiprocessing.
3. **Konkurensi Terstruktur (`TaskGroup`)**: Dilarang menggunakan `asyncio.gather()` tanpa penanganan pembatalan. Selalu gunakan blok `async with asyncio.TaskGroup() as tg:` untuk memastikan task yang gagal langsung membatalkan task paralel lainnya secara aman.
4. **Validasi Skema dengan Pydantic v2**: Manfaatkan `TypeAdapter` untuk serialisasi batch berkecepatan tinggi dan `@computed_field` untuk properti terhitung yang ikut terserialisasi dalam skema OpenAPI.
5. **Format Error Terstandarisasi RFC 9457**: Semua pengecualian HTTP pada FastAPI wajib mengembalikan format Problem Details (`application/problem+json`) yang konsisten dengan atribut `type`, `title`, `status`, dan `detail`.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec python-programming-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
