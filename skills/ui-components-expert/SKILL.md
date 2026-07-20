---
name: ui-components-expert
description: Expert guide for checking and improving the 4 main pillars of UI components: input controls, navigation, information, and containers. / Panduan ahli untuk memeriksa dan meningkatkan 4 pilar utama komponen UI: kontrol input, navigasi, informasi, dan kontainer.
---

# 🎨 UI Components 4 Pillars Expert

Skill ini memberikan panduan komprehensif untuk mengevaluasi, mengaudit, dan meningkatkan 4 pilar utama komponen User Interface (UI). Tujuannya adalah memastikan setiap komponen tidak hanya terlihat indah secara visual (Aesthetics), tetapi juga berfungsi secara intuitif (Usability), dapat diakses oleh semua pengguna (Accessibility/a11y), dan konsisten dengan sistem desain.

## 🎯 4 Pilar Utama Komponen UI

### 1. Kontrol Input (Input Controls)
Komponen yang memungkinkan pengguna berinteraksi dan memasukkan data.
*Contoh: Buttons, Checkboxes, Radio Buttons, Text Fields, Toggles/Switches, Dropdowns.*

**✅ Checklist & Best Practices:**
- **State Visual yang Jelas:** Pastikan ada perbedaan visual yang jelas untuk state `Default`, `Hover`, `Active/Pressed`, `Focus` (untuk aksesibilitas keyboard), dan `Disabled`.
- **Ukuran Target Sentuh (Touch Target):** Minimal 44x44 pixel (berdasarkan standar HIG/Material) untuk kenyamanan pengguna mobile.
- **Feedback Langsung:** Berikan umpan balik instan saat input berinteraksi (misalnya riak/ripple effect, perubahan warna, animasi transisi).
- **Validasi & Error Handling:** Tampilkan pesan error yang spesifik dan inline pada form input, gunakan warna merah dan ikon peringatan, jangan hanya mengandalkan warna.
- **Aksesibilitas (a11y):** Gunakan tag label yang terhubung ke input (misal `htmlFor`), sertakan atribut `aria-invalid` jika ada error.

### 2. Navigasi (Navigation)
Komponen yang membantu pengguna bergerak di dalam struktur aplikasi atau situs web.
*Contoh: Menus, Tabs, Breadcrumbs, Pagination, Sidebars, Bottom Navigation.*

**✅ Checklist & Best Practices:**
- **Indikasi Lokasi Saat Ini (Active State):** Pengguna harus selalu tahu di mana mereka berada. Highlight menu atau tab yang sedang aktif dengan warna kontras, garis bawah, atau background tebal.
- **Hierarki yang Logis:** Kelompokkan item navigasi berdasarkan kepentingannya. Jangan tampilkan terlalu banyak opsi (prinsip Hick's Law).
- **Responsivitas:** Gunakan *Hamburger Menu* atau *Bottom Navigation* di perangkat mobile, pertahankan tab yang bisa digeser (swipeable/scrollable).
- **Breadcrumbs:** Gunakan breadcrumbs untuk hierarki yang lebih dalam dari 2 level agar pengguna bisa dengan mudah kembali ke halaman induk.

### 3. Informasi (Information)
Komponen yang menyampaikan status, panduan, atau peringatan kepada pengguna.
*Contoh: Notifications (Toasts), Tooltips, Badges, Alerts, Progress Bars, Spinners.*

**✅ Checklist & Best Practices:**
- **Pewarnaan Kontekstual:** Gunakan warna standar untuk status: Hijau (Sukses), Merah (Error), Kuning/Oranye (Peringatan), Biru (Informasi).
- **Kemudahan Menutup (Dismissibility):** Berikan opsi (tombol X) untuk menutup notifikasi persisten. Untuk toast notifikasi sukses/info, berikan *auto-dismiss* (misalnya setelah 3-5 detik).
- **Tooltips:** Hanya muncul saat di-*hover* (desktop) atau ditekan lama (mobile). Jangan gunakan tooltips untuk informasi kritis yang wajib dibaca, gunakan teks bantuan inline.
- **Animasi Transisi:** Notifikasi harus muncul dan menghilang dengan animasi yang halus (slide in/out, fade in/out) agar tidak mengejutkan pengguna.

### 4. Kontainer (Containers)
Komponen yang mengelompokkan konten terkait menjadi unit visual yang terstruktur.
*Contoh: Cards, Modals (Dialogs), Accordions, Drawers/Bottom Sheets, Carousels.*

**✅ Checklist & Best Practices:**
- **Visual Hierarchy & Depth:** Gunakan *Drop Shadows* atau batas tipis (borders) untuk membedakan kontainer dari background utama. Bedakan elevasi (z-index) antara Card biasa dan Modal yang melayang.
- **Fokus Manajemen pada Modal:** Saat modal terbuka, background harus digelapkan (overlay/backdrop), *scroll* halaman di belakang harus dikunci (body `overflow: hidden`), dan fokus keyboard harus "terperangkap" (trap focus) di dalam modal. Bisa ditutup dengan tombol Escape (ESC) atau mengklik di luar area modal (backdrop click).
- **Padding dan Whitespace:** Berikan ruang bernapas (padding) yang cukup di dalam kontainer. Hindari teks atau elemen yang terlalu menempel pada tepi *Card*.
- **Clear Call to Action (CTA):** Pada Modal atau Card interaktif, pastikan tombol aksi utama (misal: "Simpan", "Beli") jelas dan ditempatkan secara logis (biasanya di kanan bawah atau bawah tengah).

## 🛠 Panduan Penggunaan Skill

Ketika Anda diminta untuk memeriksa atau meningkatkan UI aplikasi:

1. **Identifikasi Komponen:** Kategorikan setiap komponen yang ada di halaman tersebut ke dalam 4 pilar di atas.
2. **Audit Berdasarkan Checklist:** Jalankan checklist di atas pada komponen yang sedang direview. Cari kekurangan dalam *state*, aksesibilitas, responsivitas, dan umpan balik (feedback).
3. **Usulkan Peningkatan Konkret:**
   - **Perbaikan CSS/Tailwind:** Usulkan penambahan class seperti `focus:ring-2 focus:outline-none`, `hover:bg-gray-100`, atau transisi yang mulus `transition-colors duration-200`.
   - **Peningkatan Aksesibilitas (a11y):** Berikan kode ARIA role atau atribut pendukung.
   - **Interaksi JavaScript (opsional):** Jika diperlukan untuk modal atau tab, usulkan struktur state yang menangkap interaksi pengguna dengan benar.
4. **Fokus pada Detail "Micro-interactions":** Peningkatan kecil pada *hover state* atau animasi *toast* berdampak besar pada impresi kualitas UI.
