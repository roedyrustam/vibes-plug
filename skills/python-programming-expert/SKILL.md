---
name: python-programming-expert
description: "Expert-level skill for Python programming (Python 3.12/3.13+). Covers type safety, generic syntax (PEP 695), async/await TaskGroups, FastAPI 0.115+, Pydantic v2, uv package manager, Ruff, and pytest in English and Indonesian."
author: "Roedy Rustam"
---

# Python Programming Expert (3.12 / 3.13+ Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guidance for writing high-performance, robust, and clean Python applications using **Python 3.12/3.13+**. Covers PEP 695 type parameter syntax, structured concurrency via `asyncio.TaskGroup`, FastAPI 0.115+, Pydantic v2 validation, ultra-fast dependency management with `uv`, and linting/formatting with `Ruff`.

### Trigger Conditions
- Bootstrapping or maintaining a Python application, API, CLI, or backend package.
- Designing data validation schemas using **Pydantic v2**.
- Writing async backend APIs with **FastAPI**, **Django 5.x**, or **Litestar**.
- Implementing ORMs and database interfaces using **SQLAlchemy 2.0** or **SQLModel**.
- Designing asynchronous logic using **asyncio** (`TaskGroup`, concurrency semaphores).
- Managing dependencies, virtual environments, and locks using **uv** or **Poetry**.
- Configuring code style, formatting, linting rules (**Ruff**), and unit testing suites (**pytest 8+**).

### Modern Python 3.12/3.13+ Features
1. **Type Parameter Syntax (PEP 695)**: Clean, concise generic syntax without boilerplate `TypeVar`.
   ```python
   def get_first[T](items: list[T]) -> T | None:
       return items[0] if items else None
   ```
2. **Explicit `type` Statement**: Declare type aliases clearly.
   ```python
   type UserID = int | str
   type Matrix[T] = list[list[T]]
   ```
3. **f-string Enhancements**: Quote nesting, expressions containing backslashes, and inline comments inside f-strings.

### Type Hinting & Validation (Pydantic v2)
- **Strict Typing**: Use `Annotated` for reusable metadata and custom validation constraints.
- **Static Analysis**: Ensure full type compatibility with `mypy` or `pyright`.
- **Model Definition**:
  ```python
  from pydantic import BaseModel, Field, EmailStr

  class User(BaseModel):
      id: int
      username: str = Field(..., min_length=3, max_length=50)
      email: EmailStr
  ```

### Tooling: `uv` & `Ruff`
- **`uv`**: Ultra-fast Python package installer and resolver written in Rust. Replaces `pip`, `pip-tools`, `virtualenv`, and `poetry`.
  ```bash
  uv init project-name
  uv add fastapi pydantic uvicorn
  uv run pytest
  ```
- **`Ruff`**: Replace Black, Flake8, isort, and bandit with a single lightning-fast linter and formatter.

### Asynchronous Programming (`asyncio`)
- **Structured Concurrency**: Use `asyncio.TaskGroup()` for safe concurrency and automatic exception propagation.
  ```python
  async with asyncio.TaskGroup() as tg:
      task1 = tg.create_task(fetch_data(1))
      task2 = tg.create_task(fetch_data(2))
  ```
- **Non-blocking Operations**: Never execute blocking I/O directly inside async event loops. Delegate via `asyncio.to_thread()`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat ahli untuk menulis aplikasi Python yang berkinerja tinggi, tangguh, dan bersih menggunakan **Python 3.12/3.13+**. Skill ini mencakup sintaksis parameter tipe PEP 695, konkurensi terstruktur via `asyncio.TaskGroup`, FastAPI 0.115+, validasi Pydantic v2, manajemen paket ultra-cepat dengan `uv`, serta linting/formatting dengan `Ruff`.

### Kondisi Pemicu
- Merancang atau memelihara aplikasi Python, API, CLI, atau pustaka backend.
- Mendefinisikan skema validasi data menggunakan **Pydantic v2**.
- Menulis API backend asinkron menggunakan **FastAPI**, **Django 5.x**, atau **Litestar**.
- Mengimplementasikan ORM dan antarmuka database menggunakan **SQLAlchemy 2.0** atau **SQLModel**.
- Merancang logika asinkron menggunakan **asyncio** (`TaskGroup`, pembatasan konkurensi).
- Mengelola dependensi, virtual environment, dan lockfile menggunakan **uv** atau **Poetry**.
- Mengonfigurasi gaya kode, pemformatan, aturan linting (**Ruff**), dan pengujian unit (**pytest 8+**).

### Fitur Modern Python 3.12/3.13+
1. **Sintaksis Parameter Tipe Baru (PEP 695)**: Penulisan generic yang lebih bersih tanpa `TypeVar`.
   ```python
   def dapatkan_pertama[T](items: list[T]) -> T | None:
       return items[0] if items else None
   ```
2. **Pernyataan `type`**: Mendefinisikan alias tipe secara eksplisit.
   ```python
   type UserID = int | str
   ```
3. **Peningkatan f-string**: Penggunaan tanda kutip bersarang dan ekspresi kompleks di dalam f-string.

### Pemaketan & Tooling Modern (`uv` & `Ruff`)
- **`uv`**: Installer dan resolver paket Python super cepat berbasis Rust. Menggantikan `pip`, `virtualenv`, dan `poetry`.
- **`Ruff`**: Menggantikan Black, Flake8, isort, dan bandit dalam satu tool yang sangat cepat.

### Pemrograman Asinkron (`asyncio`)
- **Gunakan TaskGroup untuk Konkurensi**: Gunakan `asyncio.TaskGroup()` untuk konkurensi terstruktur dan penanganan exception yang aman.
- **Hindari Operasi Pemblokir**: Jangan pernah menjalankan I/O sinkron di dalam event loop. Gunakan `asyncio.to_thread()`.
