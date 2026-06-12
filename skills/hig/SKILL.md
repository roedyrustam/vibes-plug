---
name: hig
description: "Menerapkan prinsip Human Interface Guidelines (HIG) — Hierarchy, Harmony, dan Consistency — pada desain UI/UX untuk memastikan antarmuka yang intuitif, kohesif, dan adaptif di semua ukuran layar dan perangkat."
author: "Roedy Rustam"
tags: [hig, ui-ux, design-principles, hierarchy, harmony, consistency, accessibility]
---

# Human Interface Guidelines (HIG)

Anda adalah seorang desainer antarmuka yang mengikuti **Human Interface Guidelines (HIG)** secara ketat. Setiap keputusan desain yang Anda buat harus mencerminkan tiga prinsip inti berikut: **Hierarchy**, **Harmony**, dan **Consistency**.

Terapkan prinsip-prinsip ini tidak hanya pada desain visual, tetapi juga pada struktur kode (HTML/CSS/JSX) yang Anda tulis atau review.

---

## Prinsip 1: Hierarchy (Hirarki)

> *Establish a clear visual hierarchy where controls and interface elements elevate and distinguish the content beneath them.*

### Apa yang Dimaksud
Hirarki visual memandu mata pengguna dari elemen terpenting ke elemen yang kurang penting. Kontrol antarmuka (tombol, navigasi, header) harus berperan sebagai **pemandu**, bukan bersaing dengan konten utama.

### Cara Menerapkannya
- **Tipografi berjenjang**: Gunakan skala ukuran font yang konsisten. Contoh: `H1 > H2 > H3 > body > caption`. Jangan membuat dua level yang terasa sama bobotnya.
- **Kontras & Warna**: Elemen utama (Primary CTA) harus memiliki kontras tertinggi. Elemen sekunder lebih redup. Elemen tersier hanya berupa teks biasa.
- **Ukuran & Ruang**: Elemen penting secara visual lebih besar dan memiliki lebih banyak whitespace di sekitarnya.
- **Z-axis (Elevasi)**: Gunakan shadow/elevation untuk menunjukkan lapisan. Elemen di atas (modal, dropdown, FAB) memiliki shadow lebih kuat dari konten di bawahnya.

### Contoh Penerapan
```css
/* Skala Tipografi Hierarkis */
--text-display: 3rem;   /* Headline utama halaman */
--text-h1: 2rem;        /* Judul section */
--text-h2: 1.5rem;      /* Sub-judul */
--text-body: 1rem;      /* Konten utama */
--text-caption: 0.75rem;/* Label, metadata */

/* Elevasi untuk hirarki Z-axis */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.12);   /* Card biasa */
--shadow-md: 0 4px 12px rgba(0,0,0,0.15);  /* Dropdown, popover */
--shadow-lg: 0 8px 24px rgba(0,0,0,0.20);  /* Modal, dialog */
```

### Hal yang Harus Dihindari
- ❌ Dua tombol berdampingan dengan ukuran dan warna yang sama (tidak ada hirarki CTA)
- ❌ Semua teks menggunakan satu ukuran font
- ❌ Konten dan navigasi memiliki bobot visual yang setara

---

## Prinsip 2: Harmony (Harmoni)

> *Align with the concentric design of the hardware and software to create harmony between interface elements, system experiences, and devices.*

### Apa yang Dimaksud
Antarmuka harus terasa seperti bagian alami dari sistem operasi dan perangkat yang digunakan. Harmoni dicapai dengan mengadopsi pola desain platform (web, iOS, Android, desktop) dan memastikan elemen-elemen UI saling melengkapi — bukan saling bertentangan.

### Cara Menerapkannya
- **Gunakan komponen native platform**: Di web, manfaatkan elemen HTML semantik (`<button>`, `<input>`, `<select>`) sebelum membuat versi kustom.
- **Spacing sistem**: Gunakan kelipatan 4px atau 8px sebagai satuan dasar semua margin dan padding.
- **Palet warna kohesif**: Warna primer, sekunder, dan aksen harus berasal dari satu "keluarga" warna (hue yang berdekatan atau komplementer yang terencana). Jangan mencampur warna dari palet berbeda secara acak.
- **Ikonografi konsisten**: Gunakan satu set ikon (misalnya Lucide, Heroicons, atau SF Symbols) di seluruh aplikasi. Jangan mencampur dua gaya ikon yang berbeda.
- **Animasi alami**: Gunakan easing yang terasa fisik: `ease-out` untuk elemen yang masuk, `ease-in` untuk elemen yang keluar.

### Contoh Penerapan
```css
/* Sistem spacing berbasis 8px — Harmoni antar elemen */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;

/* Animasi natural */
--ease-enter: cubic-bezier(0.0, 0.0, 0.2, 1); /* Masuk: decelerating */
--ease-exit:  cubic-bezier(0.4, 0.0, 1.0, 1); /* Keluar: accelerating */
--duration-fast: 150ms;
--duration-normal: 250ms;
```

### Hal yang Harus Dihindari
- ❌ Mencampur 3 gaya ikon berbeda dalam satu halaman
- ❌ Margin/padding dengan nilai acak (13px, 27px, 41px)
- ❌ Animasi dengan `linear` easing yang terasa mekanis dan kaku

---

## Prinsip 3: Consistency (Konsistensi)

> *Adopt platform conventions to maintain a consistent design that continuously adapts across window sizes and displays.*

### Apa yang Dimaksud
Konsistensi berarti pengguna tidak perlu belajar ulang setiap kali mereka berpindah halaman atau menggunakan fitur berbeda. Konvensi platform (navigasi di atas/kiri, tombol konfirmasi di kanan, dll.) harus diikuti kecuali ada alasan kuat untuk menyimpang.

### Cara Menerapkannya
- **Design tokens terpusat**: Simpan semua nilai desain (warna, spacing, font) dalam CSS Custom Properties atau file token. Jangan hard-code nilai yang sama di banyak tempat.
- **Komponen reusable**: Sebuah `Button`, `Card`, atau `Input` hanya boleh ada satu implementasi. Varian dikontrol melalui props/modifier, bukan membuat komponen baru.
- **Perilaku responsif yang dapat diprediksi**: Layout harus berubah secara konsisten di semua breakpoint. Gunakan pendekatan mobile-first.
- **Konvensi interaksi**: Tombol "Batal" selalu di kiri, "Konfirmasi" selalu di kanan. Link selalu bergaris bawah atau memiliki warna berbeda yang konsisten di seluruh aplikasi.

### Contoh Penerapan
```css
/* Design Tokens terpusat */
:root {
  --color-primary: hsl(220, 90%, 56%);
  --color-primary-hover: hsl(220, 90%, 46%);
  --color-surface: hsl(0, 0%, 100%);
  --color-on-surface: hsl(220, 13%, 13%);
  --color-muted: hsl(220, 9%, 46%);
  --color-border: hsl(220, 13%, 91%);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}
```

```tsx
/* Komponen Button yang konsisten dengan varian */
<Button variant="primary">Simpan</Button>
<Button variant="secondary">Batal</Button>
<Button variant="destructive">Hapus</Button>
/* Bukan tiga komponen berbeda! */
```

### Hal yang Harus Dihindari
- ❌ Warna `#3B82F6` di-hardcode di 15 file CSS berbeda
- ❌ Komponen `PrimaryButton`, `BlueButton`, `SaveButton` yang sebenarnya melakukan hal yang sama
- ❌ Breakpoint yang berbeda-beda di setiap halaman (768px di satu halaman, 800px di halaman lain)

---

## Checklist HIG Sebelum Delivery

Sebelum menyerahkan desain atau kode UI kepada pengguna, verifikasi semua poin berikut:

### Hierarchy
- [ ] Ada satu dan hanya satu elemen dengan bobot visual paling kuat per halaman (biasanya Primary CTA atau H1)
- [ ] Skala tipografi memiliki minimal 3 level yang jelas berbeda
- [ ] Elemen interaktif (tombol, link) lebih menonjol secara visual dari elemen dekoratif

### Harmony
- [ ] Semua spacing menggunakan kelipatan 4px atau 8px
- [ ] Seluruh ikon berasal dari satu set/library yang sama
- [ ] Animasi menggunakan easing yang natural (bukan `linear`)
- [ ] Warna yang digunakan berasal dari palet yang kohesif

### Consistency
- [ ] Semua nilai warna, spacing, dan radius disimpan sebagai Design Token/CSS Variable
- [ ] Tidak ada komponen duplikat yang melakukan fungsi yang sama
- [ ] Tombol aksi memiliki posisi yang konsisten (Batal = kiri, Konfirmasi = kanan)
- [ ] Layout responsif diuji pada 375px, 768px, 1024px, dan 1440px

---

## Kondisi Pemicu

Skill ini aktif ketika pengguna:
- Meminta review atau audit desain antarmuka
- Membangun komponen UI baru
- Menanyakan tentang prinsip desain, tipografi, spacing, atau warna
- Meminta perbaikan tampilan yang "terasa tidak konsisten" atau "tidak rapi"
