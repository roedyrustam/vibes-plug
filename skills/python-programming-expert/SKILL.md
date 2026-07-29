---
name: python-programming-expert
description: "Expert-level skill for Python programming (Python 3.12/3.13+). Covers type safety, generic syntax (PEP 695), async/await TaskGroups, FastAPI 0.115+, Pydantic v2, uv package manager, Ruff, and pytest in English and Indonesian."
author: "Roedy Rustam"
---

# Python Programming Expert (3.13 JIT Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert-level Python development guidance for **Python 3.13+** with JIT compiler, covering type safety, async patterns, modern web frameworks (FastAPI 0.115+, Django 5.x), Pydantic v2, the `uv` package manager, Ruff linting, and production-grade testing with pytest.

### Trigger Conditions
- Writing Python 3.12+ / 3.13+ applications or services.
- Building FastAPI 0.115+ REST APIs or Django 5.x web apps.
- Managing Python projects with the `uv` package manager.
- Implementing async/await patterns with `asyncio.TaskGroup`.
- Writing type-safe Python with Pydantic v2 and modern generics (PEP 695).
- Setting up Ruff for linting + formatting, pytest for testing.

### Python 3.13 — Key Improvements

#### JIT Compiler (Experimental → Production-Ready)
Python 3.13 ships with an **experimental JIT compiler** based on copy-and-patch. Enable it for CPU-bound workloads:
```bash
python3.13 --enable-experimental-jit app.py
# Or via env var:
PYTHON_JIT=1 python3.13 app.py
```
Expected 10-20% speedup for numeric/algorithmic code. Not yet beneficial for I/O-bound async code.

#### Free-Threaded Mode (No GIL)
Python 3.13 introduces an experimental **free-threaded build** (no GIL), enabling true CPU parallelism with threads:
```bash
# Install free-threaded build
uv python install 3.13t
python3.13t -X gil=0 my_parallel_app.py
```

#### Improved Error Messages
Python 3.13 provides significantly better tracebacks with highlighted variable values and suggestions.

### Modern Python Toolchain (2026)

#### uv — The 2026 Standard Package Manager
Replace `pip`, `pip-tools`, `virtualenv`, `pyenv`, and `poetry` with **uv**:
```bash
# Create project
uv init my-project
cd my-project

# Add dependencies
uv add fastapi pydantic httpx

# Add dev dependencies
uv add --dev pytest ruff mypy

# Run scripts
uv run python main.py
uv run pytest

# Sync environment
uv sync

# Lock dependencies
uv lock
```

#### Ruff — Linting + Formatting in One
```bash
uv add --dev ruff

# ruff.toml
[tool.ruff]
line-length = 88
target-version = "py313"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "UP", "B", "SIM", "ANN"]

# Run
uv run ruff check .
uv run ruff format .
```

### Type Safety — Modern Patterns (Python 3.12+)

#### PEP 695 — New Generic Syntax
```python
# Old (Python < 3.12)
from typing import TypeVar
T = TypeVar('T')
def first[T](lst: list[T]) -> T: ...

# New (Python 3.12+) — cleaner, no TypeVar boilerplate
def first[T](lst: list[T]) -> T:
    return lst[0]

type Vector = list[float]  # Type alias with 'type' statement
```

#### Pydantic v2 — Data Validation
```python
from pydantic import BaseModel, Field, field_validator
from pydantic import EmailStr

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    email: EmailStr
    age: int = Field(ge=0, le=150)

    @field_validator('name')
    @classmethod
    def name_must_not_contain_space(cls, v: str) -> str:
        if '  ' in v:
            raise ValueError('Name must not have double spaces')
        return v.strip()

# Usage
user = UserCreate(name="Alice", email="alice@example.com", age=30)
user.model_dump()  # {'name': 'Alice', 'email': 'alice@example.com', 'age': 30}
```

### FastAPI 0.115+ Best Practices

#### Lifespan (Replace @app.on_event)
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect DB, warm caches
    await db.connect()
    yield
    # Shutdown: clean up resources
    await db.disconnect()

app = FastAPI(lifespan=lifespan)
```

#### Dependency Injection Pattern
```python
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db() -> AsyncSession:
    async with async_session_factory() as session:
        yield session

@app.get("/users/{user_id}")
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

#### Structured Error Responses
```python
from fastapi import Request
from fastapi.responses import JSONResponse

class AppError(Exception):
    def __init__(self, message: str, code: str, status: int = 400):
        self.message = message
        self.code = code
        self.status = status

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status,
        content={"error": exc.code, "message": exc.message}
    )
```

### Async Patterns — asyncio.TaskGroup (Python 3.11+)
```python
import asyncio

async def main():
    async with asyncio.TaskGroup() as tg:
        task_a = tg.create_task(fetch_data("A"))
        task_b = tg.create_task(fetch_data("B"))
    # Both tasks complete or any exception is raised
    results = [task_a.result(), task_b.result()]
```

### Testing with pytest
```python
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

@pytest.mark.asyncio
async def test_get_user(client: AsyncClient):
    response = await client.get("/users/123")
    assert response.status_code == 200
    assert response.json()["id"] == "123"
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan pengembangan Python tingkat ahli untuk **Python 3.13+** dengan JIT compiler, mencakup keamanan tipe, pola async, framework web modern (FastAPI 0.115+, Django 5.x), Pydantic v2, manajer paket `uv`, Ruff, dan pengujian produksi dengan pytest.

### Kondisi Pemicu
- Menulis aplikasi atau layanan Python 3.12+/3.13+.
- Membangun REST API FastAPI 0.115+ atau aplikasi web Django 5.x.
- Mengelola proyek Python dengan manajer paket `uv`.
- Mengimplementasikan pola async/await dengan `asyncio.TaskGroup`.
- Menulis Python type-safe dengan Pydantic v2 dan generik modern (PEP 695).
- Menyiapkan Ruff untuk linting + formatting, pytest untuk pengujian.

### Python 3.13 — Peningkatan Utama

#### JIT Compiler
Python 3.13 hadir dengan **JIT compiler eksperimental** berbasis copy-and-patch. Aktifkan dengan `--enable-experimental-jit` atau variabel lingkungan `PYTHON_JIT=1`. Perkiraan peningkatan kecepatan 10-20% untuk kode CPU-bound.

#### Free-Threaded Mode (Tanpa GIL)
Python 3.13 memperkenalkan **build free-threaded eksperimental** (tanpa GIL), memungkinkan paralelisme CPU sejati dengan thread.

### Toolchain Modern (2026)

#### uv — Manajer Paket Standar 2026
Gantikan `pip`, `pip-tools`, `virtualenv`, `pyenv`, dan `poetry` dengan **uv** — jauh lebih cepat dan terintegrasi dalam satu alat. Gunakan `uv init`, `uv add`, `uv run`, dan `uv sync` untuk semua operasi proyek.

#### Ruff — Linting + Formatting Dalam Satu Alat
Ruff menggantikan Flake8, isort, Black, dan pyupgrade sekaligus — jauh lebih cepat karena ditulis dalam Rust.

### Keamanan Tipe — Pola Modern

#### PEP 695 — Sintaksis Generic Baru
Python 3.12+ memperkenalkan sintaksis generic yang lebih bersih tanpa boilerplate `TypeVar`. Gunakan pernyataan `type` untuk alias tipe.

#### Pydantic v2
Gunakan `BaseModel`, `Field`, dan `@field_validator` untuk validasi data yang ketat. `model_dump()` dan `model_validate()` menggantikan metode lama.

### FastAPI 0.115+ Best Practices

#### Lifespan (Gantikan @app.on_event)
Gunakan `@asynccontextmanager` dengan parameter `lifespan` di `FastAPI()` untuk startup/shutdown yang bersih.

#### Dependency Injection
Gunakan `Depends()` untuk injeksi sesi database, autentikasi, dan dependensi lainnya ke route handler.

#### Error Terstruktur
Buat kelas `Exception` kustom dan daftarkan `exception_handler` global untuk respons error yang konsisten.

### Pola Async — asyncio.TaskGroup
Gunakan `asyncio.TaskGroup` (Python 3.11+) sebagai pengganti `asyncio.gather()` yang lebih aman — secara otomatis membatalkan semua task lain jika salah satu gagal.

### Pengujian dengan pytest
Gunakan `pytest-asyncio` dan `AsyncClient` dari `httpx` untuk pengujian endpoint async FastAPI yang bersih dan terisolasi.
