---
name: multiple-entry-points
description: "Expert guide for designing and implementing Multiple Entry Points architecture in web applications / Panduan ahli untuk merancang dan mengimplementasikan arsitektur Multiple Entry Points pada aplikasi web."
author: "Antigravity"
---

# Multiple Entry Points Architecture

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill outlines the architectural pattern of using Multiple Entry Points in a web application. Instead of forcing all traffic through a single Front Controller (like a monolithic `index.php`), the application separates traffic logically into distinct entry files such as `index.php` (public), `admin.php`, and `api.php`. This provides stronger isolation, optimized loading, and stricter security boundaries.

### Core Principles of Multiple Entry Points
1. **Logical Separation**: Isolate different application domains into their own entry files. For example: `public/index.php` for user-facing pages, `public/admin.php` for back-office operations, and `public/api.php` for stateless API routes.
2. **Dedicated Bootstrapping**: Each entry point can bootstrap only the necessary dependencies, configurations, and middlewares it requires. For example, `api.php` does not need to initialize HTML template engines or stateful session cookies, while `admin.php` can enforce strict authentication middleware immediately upon execution.
3. **Security Boundaries**: By physically separating entry points, you can apply distinct server-level security rules (via `.htaccess`, Nginx configurations, or WAF). For example, you can restrict access to `admin.php` to specific internal IP addresses or enforce mutual TLS.
4. **Frontend Asset Bundling (Vite / Webpack)**: In a modern frontend context (especially for MPAs), define multiple entry points in the bundler configuration. This generates separate, optimized JavaScript and CSS bundles for the public site versus the complex admin dashboard, drastically reducing overall payload sizes for general users.

### Orchestration with Other Skills
- **With `mpa-orchestrator`**: In a Multi-Page Application, multiple entry points allow you to split heavy dashboard assets from fast-loading public marketing pages, enhancing both SEO and performance.
- **With `mvc-expert`**: Each entry point acts as a distinct Front Controller, initiating its own lightweight Router instance configured specifically for that domain's controllers (e.g., an AdminRouter vs an ApiRouter).
- **With `saas-multi-tenant`**: You can design a `tenant.php` entry point that strictly mandates a valid `tenant_id` resolution before bootstrapping the app, while a `landing.php` entry point handles anonymous public traffic safely.

### Trigger Conditions
- Active when building or refactoring applications that require strict separation between public, admin, and API traffic.
- Active when optimizing frontend bundler configurations (like Vite) for Multi-Page Applications.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini menguraikan pola arsitektur menggunakan *Multiple Entry Points* dalam aplikasi web. Alih-alih memaksa semua lalu lintas (traffic) melalui satu Front Controller tunggal (seperti `index.php` monolitik), aplikasi memisahkan lalu lintas secara logis ke dalam file entri yang berbeda seperti `index.php` (publik), `admin.php`, dan `api.php`. Pola ini memberikan isolasi yang lebih kuat, pemuatan (loading) yang dioptimalkan, dan batas keamanan yang lebih ketat.

### Prinsip Inti Multiple Entry Points
1. **Pemisahan Logis**: Isolasi domain aplikasi yang berbeda ke dalam file entrinya masing-masing. Contoh: `public/index.php` untuk pengguna umum, `public/admin.php` untuk operasional *back-office*, dan `public/api.php` untuk rute API yang *stateless*.
2. **Bootstrapping Terdedikasi**: Setiap titik masuk (entry point) hanya memuat dependensi, konfigurasi, dan middleware yang benar-benar diperlukannya. Contohnya, `api.php` tidak perlu menginisialisasi *template engine* HTML atau *session cookies*, sementara `admin.php` dapat langsung memberlakukan middleware autentikasi secara ketat sejak awal file dieksekusi.
3. **Batas Keamanan (Security Boundaries)**: Dengan memisahkan titik masuk secara fisik, Anda dapat menerapkan aturan keamanan tingkat server yang berbeda (melalui `.htaccess`, konfigurasi Nginx, atau WAF). Misalnya, membatasi akses ke `admin.php` hanya untuk alamat IP internal tertentu.
4. **Bundling Aset Frontend (Vite / Webpack)**: Dalam konteks frontend modern (khususnya untuk MPA), tentukan beberapa *entry points* pada konfigurasi *bundler*. Ini akan menghasilkan bundel JavaScript dan CSS yang terpisah dan optimal antara situs publik dan dashboard admin, sehingga secara drastis mengurangi ukuran *payload* bagi pengguna umum.

### Orkestrasi dengan Skill Lain
- **Dengan `mpa-orchestrator`**: Dalam aplikasi MPA, penggunaan beberapa *entry point* memungkinkan Anda memisahkan aset dashboard yang berat dari halaman *marketing* publik yang butuh kecepatan muat tinggi, sehingga meningkatkan SEO dan performa sekaligus.
- **Dengan `mvc-expert`**: Setiap *entry point* bertindak sebagai Front Controller yang terpisah, menginisiasi instans Router yang ringan dan dikonfigurasi khusus untuk controller di domain tersebut (misalnya AdminRouter vs ApiRouter).
- **Dengan `saas-multi-tenant`**: Anda dapat memiliki *entry point* `tenant.php` yang secara ketat mewajibkan resolusi `tenant_id` yang valid sebelum memuat aplikasi, sementara *entry point* `landing.php` melayani lalu lintas publik anonim dengan aman.

### Kondisi Pemicu
- Aktif saat membangun atau melakukan refaktor aplikasi yang membutuhkan pemisahan ketat antara lalu lintas publik, admin, dan API.
- Aktif saat mengoptimalkan konfigurasi *bundler* frontend (seperti Vite) untuk proyek Multi-Page Application.
