---
name: prd-architect
description: "Skill khusus untuk memaksa pembuatan Product Requirements Document (PRD) sebelum mulai coding pada setiap proyek baru."
author: "Roedy Rustam"
---

# PRD Architect (Perancang Dokumen Kebutuhan Produk)

## Deskripsi
Skill ini bertindak sebagai palang pintu pertama setiap kali ada inisiatif untuk membangun aplikasi, perangkat lunak, atau proyek besar baru dari nol. Skill ini memastikan bahwa tidak ada kode yang ditulis sebelum **Product Requirements Document (PRD)** yang komprehensif disetujui oleh pengguna.

## Kondisi Pemicu
Selalu aktif secara otomatis ketika:
- Pengguna meminta untuk "membuat aplikasi baru", "proyek baru", "SaaS baru", atau "MVP baru".
- Pengguna memulai inisiatif besar tanpa menyebutkan struktur fitur yang spesifik.
- Agen diminta untuk menjadi *Product Manager* (PM) atau menginisiasi proyek.

## Instruksi & Alur Kerja (Wajib Diikuti)

1. **JANGAN LANGSUNG MENULIS KODE**
   - Saat dipicu, **berhenti** memikirkan kode, struktur folder, atau implementasi teknis.
   - Tugas pertama Anda adalah murni menganalisis bisnis dan kebutuhan produk.

2. **Buat Draf PRD (Product Requirements Document)**
   Susun dokumen PRD (format Markdown atau Artifact) yang mencakup struktur berikut:
   
   - **1. Ringkasan Eksekutif (Executive Summary)**: Tujuan utama aplikasi dan masalah yang ingin dipecahkan.
   - **2. Target Pengguna (Target Audience)**: Siapa yang akan menggunakan produk ini.
   - **3. Ruang Lingkup MVP (Minimum Viable Product)**: Daftar fitur mutlak yang harus ada di versi v1.0. Fitur lain masukkan ke "Future Roadmap".
   - **4. Alur Pengguna Utama (Core User Flows)**: Langkah demi langkah apa yang akan dilakukan pengguna (misal: *Daftar -> Masukkan Data -> Lihat Dashboard*).
   - **5. Kebutuhan Teknis (Tech Stack & Architecture)**: Saran stack teknologi (Frontend, Backend, Database, Infrastruktur) yang paling sesuai dengan profil proyek.
   - **6. Kriteria Kesuksesan (Success Metrics)**: Apa tanda aplikasi ini berhasil secara fungsional.

3. **Minta Persetujuan (User Approval)**
   - Setelah menyajikan PRD, Anda **WAJIB** bertanya kepada pengguna: *"Apakah Anda setuju dengan spesifikasi PRD ini? Adakah fitur atau alur yang ingin dikurangi/ditambahkan sebelum kita lanjut ke arsitektur dan penulisan kode?"*

4. **Lanjut ke Implementation Plan**
   - Hanya *setelah* pengguna mengatakan "Ya" atau "Setuju" terhadap PRD, barulah Anda boleh membuat Implementation Plan dan Task List untuk memulai *coding*.
