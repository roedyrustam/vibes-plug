---
name: python-programming-expert
description: "Expert-level skill for Python programming (Python 3.12+). Covers type safety, async/await, FastAPI/SQLAlchemy, packaging (uv/Poetry), linting (Ruff), and testing with pytest in English and Indonesian."
author: "Roedy Rustam"
---

# Python Programming Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert-level guidance for writing high-performance, robust, and clean Python applications using **Python 3.12+**. This skill covers advanced type safety with static checkers, asynchronous patterns, modern ecosystem packages (FastAPI, SQLAlchemy, Pydantic), package management (uv, Poetry), quality checks (Ruff, pytest), and Pythonic design patterns.

### Trigger Conditions
- Use when bootstrapping or maintaining a Python application, API, CLI, or backend package.
- Use when designing data validation schemas using **Pydantic v2**.
- Use when writing backend APIs or services with **FastAPI**, **Django**, or **Flask**.
- Use when implementing ORMs and database interfaces using **SQLAlchemy 2.0** or **SQLModel**.
- Use when designing asynchronous logic using **asyncio** (TaskGroups, concurrency limits).
- Use when setting up project dependencies, packaging, or task automation with **uv** or **Poetry**.
- Use when configuring code style, formatting, linting rules, or unit testing suites (**pytest**, **Ruff**).

### Modern Python 3.12+ Features
1. **New Type Parameter Syntax**: Clean generics notation using brackets.
   ```python
   def get_first[T](items: list[T]) -> T | None:
       return items[0] if items else None
   ```
2. **The `type` Statement**: Define type aliases cleanly.
   ```python
   type UserID = int | str
   ```
3. **f-string Enhancements**: Quote nesting, expressions containing backslashes, and multi-line comments are now supported inside f-string expressions.

### Type Hinting & Validation (Pydantic v2)
Static type checking ensures correctness. Python uses **Pydantic v2** for runtime data parsing and enforcement:
- **Strict Typing**: Prefer `Annotated` for reusable metadata validation.
- **Mypy / Pyright Compatibility**: Avoid using dynamic attributes. Ensure code passes strict static typing checks.
- **Model Definition**:
  ```python
  from pydantic import BaseModel, Field, EmailStr

  class User(BaseModel):
      id: int
      username: str = Field(..., min_length=3, max_length=50)
      email: EmailStr
  ```

### Modern Packaging & Linting
- **Ruff**: Use Ruff for both formatting and linting. It replaces Black, Flake8, isort, and bandit with extreme performance.
- **Tooling**: Prefer **uv** (incredibly fast Python package installer and resolver) or **Poetry** for dependency management. Always lock dependencies (`uv.lock` or `poetry.lock`).
- **Standard Layout**: Use the `src/` layout for structuring packages to prevent import pollution.

### Asynchronous Programming (`asyncio`)
- **Use TaskGroup for Concurrency**: Python 3.11+ introduces `asyncio.TaskGroup` which provides structured concurrency and safe exception propagation.
  ```python
  async with asyncio.TaskGroup() as tg:
      task1 = tg.create_task(fetch_data(1))
      task2 = tg.create_task(fetch_data(2))
  ```
- **Avoid Blocking operations**: Never invoke synchronous I/O or long CPU-bound tasks inside async loops. Offload them using `asyncio.to_thread` or running inside a ProcessPoolExecutor.

### Backend & Database Integrations
- **FastAPI**: Write lean async handlers, utilize lifespan events for setup/teardown, and use clean dependency injection (`Depends`).
- **SQLAlchemy 2.0 & SQLModel**: Always use the 2.0 style queries (`select()`). Manage database session life cycles cleanly using context managers or FastAPI dependencies.
  ```python
  from sqlalchemy.ext.asyncio import AsyncSession
  from sqlalchemy import select

  async def get_users(db: AsyncSession):
      result = await db.execute(select(User).order_by(User.id))
      return result.scalars().all()
  ```

### Testing with Pytest
- **Fixtures**: Use `pytest.fixture` with explicit scopes (`session`, `function`) and use `yield` for cleanup.
- **Mocking**: Use `unittest.mock` or `pytest-mock` to mock external API calls and side effects.
- **Async Tests**: Use `pytest-asyncio` to test async handlers and services natively.

---

### Troubleshooting & Common Gotchas
- **Mutable Default Arguments**: Never use mutable lists or dicts as function default arguments (e.g., `def func(x=[])`). Use `None` and initialize inside.
- **Circular Imports**: Structure modules hierarchically. Use local imports inside methods or functions only as a last resort.
- **Unawaited Coroutines**: Always run static analysis (`Ruff` or `mypy`) to catch missing `await` statements on async function calls.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat ahli untuk menulis aplikasi Python yang berkinerja tinggi, tangguh, dan bersih menggunakan **Python 3.12+**. Skill ini mencakup keamanan tipe tingkat lanjut dengan pemeriksa statis, pola asinkron, pustaka ekosistem modern (FastAPI, SQLAlchemy, Pydantic), manajemen paket (uv, Poetry), pemeriksaan kualitas (Ruff, pytest), serta pola desain Pythonic.

### Kondisi Pemicu
- Gunakan saat merancang atau memelihara aplikasi Python, API, CLI, atau pustaka backend.
- Gunakan saat mendefinisikan skema validasi data menggunakan **Pydantic v2**.
- Gunakan saat menulis API backend atau layanan web menggunakan **FastAPI**, **Django**, atau **Flask**.
- Gunakan saat mengimplementasikan ORM dan antarmuka database menggunakan **SQLAlchemy 2.0** atau **SQLModel**.
- Gunakan saat merancang logika asinkron menggunakan **asyncio** (TaskGroups, pembatasan konkurensi).
- Gunakan saat menyiapkan dependensi proyek, pemaketan, atau otomatisasi tugas menggunakan **uv** atau **Poetry**.
- Gunakan saat mengonfigurasi gaya kode, pemformatan, aturan linting, atau rangkaian pengujian unit (**pytest**, **Ruff**).

### Fitur Modern Python 3.12+
1. **Sintaksis Parameter Tipe Baru**: Penulisan generic yang lebih bersih menggunakan tanda kurung siku.
   ```python
   def dapatkan_pertama[T](items: list[T]) -> T | None:
       return items[0] if items else None
   ```
2. **Pernyataan `type`**: Mendefinisikan alias tipe secara eksplisit dan rapi.
   ```python
   type UserID = int | str
   ```
3. **Peningkatan f-string**: Penggunaan tanda kutip bersarang, ekspresi yang mengandung backslash, serta komentar multi-baris kini didukung di dalam ekspresi f-string.

### Pemeriksaan Tipe & Validasi (Pydantic v2)
Pemeriksaan tipe statis memastikan kebenaran kode sebelum dieksekusi. Python menggunakan **Pydantic v2** untuk parsing dan penegakan data pada saat runtime:
- **Tipe Ketat (Strict Typing)**: Gunakan `Annotated` untuk validasi metadata yang dapat digunakan kembali.
- **Kompatibilitas Mypy / Pyright**: Hindari penggunaan atribut dinamis yang tidak dideklarasikan. Pastikan kode lolos pemeriksaan tipe statis secara ketat.
- **Definisi Model**:
  ```python
  from pydantic import BaseModel, Field, EmailStr

  class User(BaseModel):
      id: int
      username: str = Field(..., min_length=3, max_length=50)
      email: EmailStr
  ```

### Pemaketan & Linting Modern
- **Ruff**: Gunakan Ruff baik untuk pemformatan (*formatting*) maupun analisis kode (*linting*). Ruff menggantikan peran Black, Flake8, isort, dan bandit dengan performa yang sangat cepat.
- **Tooling**: Gunakan **uv** (installer dan resolver paket Python yang sangat cepat) atau **Poetry** untuk manajemen dependensi. Selalu kunci dependensi (`uv.lock` atau `poetry.lock`).
- **Layout Standar**: Gunakan struktur direktori `src/` untuk paket Anda guna mencegah polusi impor saat pengujian.

### Pemrograman Asinkron (`asyncio`)
- **Gunakan TaskGroup untuk Konkurensi**: Python 3.11+ memperkenalkan `asyncio.TaskGroup` yang menyediakan konkurensi terstruktur serta penyebaran error (*exception*) yang aman.
  ```python
  async with asyncio.TaskGroup() as tg:
      tugas1 = tg.create_task(ambil_data(1))
      tugas2 = tg.create_task(ambil_data(2))
  ```
- **Hindari Operasi Pemblokir (Blocking)**: Jangan pernah menjalankan I/O sinkron atau tugas CPU-bound yang panjang langsung di dalam loop asinkron. Delegasikan pekerjaan tersebut menggunakan `asyncio.to_thread` atau jalankan di dalam ProcessPoolExecutor.

### Integrasi Backend & Database
- **FastAPI**: Tulis handler asinkron yang efisien, manfaatkan event `lifespan` untuk proses inisialisasi dan terminasi, serta gunakan dependency injection yang bersih (`Depends`).
- **SQLAlchemy 2.0 & SQLModel**: Selalu gunakan gaya kueri versi 2.0 (`select()`). Kelola siklus hidup sesi database dengan bersih menggunakan context manager atau dependensi FastAPI.
  ```python
  from sqlalchemy.ext.asyncio import AsyncSession
  from sqlalchemy import select

  async def dapatkan_pengguna(db: AsyncSession):
      result = await db.execute(select(User).order_by(User.id))
      return result.scalars().all()
  ```

### Pengujian dengan Pytest
- **Fixtures**: Gunakan `pytest.fixture` dengan scope yang jelas (`session`, `function`) dan gunakan `yield` untuk pembersihan setelah test selesai.
- **Mocking**: Gunakan `unittest.mock` atau `pytest-mock` untuk melakukan mocking pada panggilan API eksternal dan efek samping lainnya.
- **Pengujian Asinkron**: Gunakan `pytest-asyncio` untuk menguji handler dan layanan asinkron secara native.

---

### Pemecahan Masalah & Kesalahan Umum (Gotchas)
- **Mutable Default Arguments**: Jangan pernah menggunakan tipe data mutable seperti list atau dict sebagai argumen default fungsi (misal: `def fungsi(x=[])`). Gunakan `None` dan inisialisasikan di dalam fungsi.
- **Impor Melingkar (Circular Imports)**: Strukturkan modul Anda secara hierarkis. Gunakan impor lokal di dalam metode atau fungsi hanya sebagai solusi terakhir.
- **Coroutine yang Tidak Ditunggu (Unawaited Coroutines)**: Selalu jalankan analisis statis (`Ruff` atau `mypy`) untuk mendeteksi panggilan fungsi asinkron yang kehilangan kata kunci `await`.
