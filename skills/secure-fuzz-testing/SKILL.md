---
name: secure-fuzz-testing
description: "Expert-level skill for writing and integrating coverage-guided fuzz tests in Python, Rust, and Go for secure code validation in English and Indonesian."
author: "Roedy Rustam"
---

# Secure Fuzz Testing

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert-level guidance for writing, running, and integrating coverage-guided fuzz tests (fuzzing) to identify security vulnerabilities, memory leaks, and input-validation issues in software applications. This skill covers writing fuzz targets in **Python**, **Rust**, and **Go**, configuring compilers with sanitizers (ASan, MSan, UBSan), and setting up automated CI/CD security pipelines.

### Trigger Conditions
- Use when designing or reviewing data parsers, serialization/deserialization logic, or file formats.
- Use when writing libraries that process untrusted network input or binary data streams.
- Use when integrating automated security testing into a DevSecOps pipeline (CI/CD).
- Use when troubleshooting complex memory bugs, edge-case crashes, or unhandled exceptions.

### Writing Fuzz Targets
Coverage-guided fuzzers need a target function that accepts a stream of bytes and processes it.

#### 1. Python Fuzzing (Atheris)
`Atheris` is a coverage-guided fuzzer for Python. It can fuzz Python code and native extensions:
```python
import sys
import atheris

with atheris.instrument_imports():
    import our_parser  # Import target module inside instrument_imports

def TestOneInput(data):
    if len(data) < 4:
        return
    try:
        # Decode and parse the byte data
        text = data.decode("utf-8", errors="ignore")
        our_parser.parse_config(text)
    except our_parser.ParseException:
        # Expected exceptions should be caught to avoid false positives
        pass

atheris.Setup(sys.argv, TestOneInput)
atheris.Fuzz()
```

#### 2. Rust Fuzzing (cargo-fuzz & libFuzzer)
Rust has first-class fuzzing support via `cargo-fuzz` which wraps `libFuzzer`:
```rust
#![no_main]
use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: &[u8]| {
    if let Ok(input_str) = std::str::from_utf8(data) {
        let _ = our_crate::parse_config(input_str);
    }
});
```
- **Run Fuzzer**: Execute `cargo +nightly fuzz run <target_name>`.

#### 3. Go Fuzzing (Native Go Fuzz)
Go supports native fuzzing in its standard library (`testing` package):
```go
package main

import (
	"testing"
	"ourmodule/parser"
)

func FuzzParseConfig(f *testing.F) {
	// Add seed corpus for initial coverage guidance
	f.Add([]byte("config_key = value"))
	
	f.Fuzz(func(t *testing.T, data []byte) {
		_, err := parser.ParseConfig(data)
		if err != nil {
			t.Skip() // Skip expected/graceful errors
		}
	})
}
```
- **Run Fuzzer**: Run `go test -fuzz=FuzzParseConfig -fuzztime=10m`.

### Diagnostics & Sanitizers
Use compiler instrumentation flags to expose hidden bugs:
- **AddressSanitizer (ASan)**: Detects out-of-bounds access, use-after-free, and memory leaks.
- **UndefinedBehaviorSanitizer (UBSan)**: Detects integer overflows, alignment issues, and division by zero.
- **ThreadSanitizer (TSan)**: Finds data races in multithreaded environments.

### DevSecOps & CI Integration
- **OSS-Fuzz**: For open-source projects, integrate with Google's OSS-Fuzz for continuous fuzzing infrastructure.
- **GitHub Actions**: Run fuzz targets on pull requests with short run times (`fuzztime=5m`) to catch regression errors without blocking pipelines.

---

### Troubleshooting & Common Gotchas
- **False Positives**: Ensure expected API errors and clean validation errors do not cause the fuzzer to abort. Catch expected exceptions or use `t.Skip()` where appropriate.
- **State Pollution**: Fuzz targets must be stateless. Avoid sharing mutable global states between iterations.
- **Infinite Loops**: Guard against code that hangs. Configure timeouts (`-timeout=25` in libFuzzer) to automatically crash long-running executions.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat ahli untuk menulis, menjalankan, dan mengintegrasikan pengujian berbasis cakupan (*coverage-guided fuzzing*) untuk mengidentifikasi celah keamanan, kebocoran memori, dan kesalahan validasi input dalam aplikasi perangkat lunak. Skill ini mencakup penulisan target fuzzing dalam bahasa **Python**, **Rust**, dan **Go**, konfigurasi compiler dengan sanitizer (ASan, MSan, UBSan), serta penyiapan pipa otomatisasi keamanan CI/CD.

### Kondisi Pemicu
- Gunakan saat merancang atau memeriksa parser data, logika serialisasi/deserialisasi, atau pemroses format berkas.
- Gunakan saat menulis pustaka (*library*) yang memproses input jaringan yang tidak tepercaya atau aliran data biner.
- Gunakan saat mengintegrasikan pengujian keamanan otomatis ke dalam alur kerja DevSecOps (CI/CD).
- Gunakan saat mendiagnosis bug memori yang kompleks, crash pada kasus ekstrem (*edge-cases*), atau *exception* yang tidak ditangani.

### Penulisan Target Fuzzing
Fuzzer berbasis cakupan memerlukan fungsi target yang menerima aliran byte untuk kemudian diproses secara dinamis.

#### 1. Fuzzing Python (Atheris)
`Atheris` adalah fuzzer berbasis cakupan untuk kode Python dan ekstensi native (C/C++):
```python
import sys
import atheris

with atheris.instrument_imports():
    import our_parser  # Impor modul target di dalam instrument_imports

def TestOneInput(data):
    if len(data) < 4:
        return
    try:
        # Dekode data byte menjadi teks
        text = data.decode("utf-8", errors="ignore")
        our_parser.parse_config(text)
    except our_parser.ParseException:
        # Tangkap exception yang diharapkan agar tidak dianggap crash palsu
        pass

atheris.Setup(sys.argv, TestOneInput)
atheris.Fuzz()
```

#### 2. Fuzzing Rust (cargo-fuzz & libFuzzer)
Rust memiliki dukungan fuzzing kelas satu melalui utilitas `cargo-fuzz` yang menggunakan pustaka `libFuzzer`:
```rust
#![no_main]
use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: &[u8]| {
    if let Ok(input_str) = std::str::from_utf8(data) {
        let _ = our_crate::parse_config(input_str);
    }
});
```
- **Jalankan Fuzzer**: Eksekusi perintah `cargo +nightly fuzz run <nama_target>`.

#### 3. Fuzzing Go (Native Go Fuzz)
Go mendukung pengujian fuzzing secara native dalam pustaka standarnya (`testing` package):
```go
package main

import (
	"testing"
	"ourmodule/parser"
)

func FuzzParseConfig(f *testing.F) {
	// Tambahkan seed corpus awal sebagai panduan awal cakupan fuzzer
	f.Add([]byte("config_key = value"))
	
	f.Fuzz(func(t *testing.T, data []byte) {
		_, err := parser.ParseConfig(data)
		if err != nil {
			t.Skip() // Lewati error yang memang diharapkan (ditangani dengan aman)
		}
	})
}
```
- **Jalankan Fuzzer**: Eksekusi perintah `go test -fuzz=FuzzParseConfig -fuzztime=10m`.

### Diagnosis & Sanitizer
Gunakan tanda instrumentasi kompiler untuk mendeteksi bug tersembunyi secara dini:
- **AddressSanitizer (ASan)**: Mendeteksi akses memori di luar batas (*out-of-bounds*), penggunaan setelah dibebaskan (*use-after-free*), dan kebocoran memori (*memory leak*).
- **UndefinedBehaviorSanitizer (UBSan)**: Mendeteksi overflow integer, masalah penyelarasan memori (*alignment*), dan pembagian dengan nol.
- **ThreadSanitizer (TSan)**: Menemukan perebutan data (*data race*) pada eksekusi multithread.

### Integrasi DevSecOps & CI
- **OSS-Fuzz**: Untuk proyek open-source, integrasikan dengan platform OSS-Fuzz dari Google untuk pemantauan berkelanjutan.
- **GitHub Actions**: Jalankan target fuzzing pada pull request dengan batasan waktu yang singkat (`fuzztime=5m`) untuk menangkap regresi kode tanpa menghambat alur build.

---

### Pemecahan Masalah & Kesalahan Umum
- **Crash Palsu (False Positives)**: Pastikan error API yang ditangani dengan aman tidak membuat fuzzer berhenti. Tangkap exception tersebut atau gunakan `t.Skip()` pada Go.
- **Polusi State (State Pollution)**: Pastikan target fuzzing bersifat stateless. Jangan biarkan state global mutable dibagikan antar iterasi pengujian.
- **Loop Tak Terbatas**: Waspadai kode yang mengalami hang. Konfigurasikan batas waktu (`-timeout=25` pada libFuzzer) agar eksekusi yang macet secara otomatis dilaporkan sebagai crash.
