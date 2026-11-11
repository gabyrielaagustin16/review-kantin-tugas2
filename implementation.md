# Implementation Plan: Modern Review Kantin UI

## Tujuan

Merapikan tampilan Review Kantin menjadi aplikasi penemuan dan ulasan warung yang terasa modern, hangat, dan mudah digunakan. Identitas visual menggunakan perpaduan cream, putih, dan pink dengan kontras teks yang tetap nyaman dibaca.

Perubahan berfokus pada frontend React yang sudah tersedia. Endpoint, bentuk payload, autentikasi, dan aturan akses berdasarkan role tetap mengikuti implementasi backend saat ini.

## Kondisi Proyek Saat Ini

- Frontend menggunakan React 19, TypeScript, Vite, dan React Router.
- Halaman yang tersedia adalah daftar warung, login, registrasi, dan komponen detail warung.
- Daftar warung sudah mendukung pencarian, tambah/edit untuk admin dan owner, serta hapus untuk admin.
- Komponen detail warung tersedia di `frontend/src/pages/StallDetail`, tetapi belum didaftarkan sebagai route di `frontend/src/App.tsx`.
- Styling saat ini sebagian besar inline, sementara `index.css` dan `App.css` masih berisi gaya awal template Vite.

## Referensi Arah Desain

Gunakan referensi berikut untuk mempelajari pola UX; jangan menyalin layout, aset, atau identitas mereknya secara langsung.

- [GoFood](https://gofood.co.id/) dan [GrabFood](https://food.grab.com/): inspirasi untuk penemuan makanan, hierarki informasi item, dan pencarian yang mudah ditemukan.
- [Airbnb](https://www.airbnb.com/): inspirasi untuk pencarian, filter ringkas, dan kartu hasil yang mudah dipindai.
- [Material Design 3](https://m3.material.io/): acuan untuk perilaku kontrol, fokus keyboard, kontras, dan umpan balik status.

## Sistem Visual

### Palet Warna

Definisikan warna sebagai CSS custom properties di `frontend/src/index.css` agar konsisten di semua halaman.

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `--color-cream` | `#FFF7F0` | Latar utama dan area hangat |
| `--color-white` | `#FFFFFF` | Form, bidang input, dan permukaan konten |
| `--color-pink` | `#E98FA3` | Aksen utama, tombol primer, dan highlight |
| `--color-pink-soft` | `#FBE5E9` | Latar chip, kategori terpilih, dan hover lembut |
| `--color-berry` | `#7A3F50` | Teks tombol pink dan aksen gelap dengan kontras memadai |
| `--color-ink` | `#30272A` | Teks utama |
| `--color-muted` | `#75686B` | Teks sekunder |
| `--color-border` | `#E9DDE0` | Border dan pemisah |
| `--color-success` | `#34745A` | Status berhasil |
| `--color-danger` | `#B54752` | Status gagal dan tindakan berbahaya |

> Gunakan cream dan putih sebagai dasar; pink dipakai sebagai aksen, bukan sebagai latar dominan. Pastikan kombinasi teks dan latar memenuhi kontras WCAG AA, terutama untuk teks kecil dan tombol.

### Tipografi dan Bentuk

- Gunakan `DM Sans` untuk teks dan kontrol, serta `Fraunces` untuk judul halaman atau aksen editorial. Sediakan fallback sans-serif/serif sistem dan jangan biarkan kegagalan jaringan font mengganggu layout.
- Terapkan skala tipografi yang konsisten: judul halaman ringkas, subjudul untuk konteks, dan label kontrol yang jelas. Hindari heading berukuran hero pada halaman operasional.
- Gunakan radius 6-8 px untuk tombol, input, dan kartu; gunakan bayangan tipis hanya untuk memisahkan permukaan yang benar-benar interaktif.
- Berikan ruang yang konsisten melalui skala 4, 8, 12, 16, 24, dan 32 px. Batasi lebar konten desktop agar daftar tetap mudah dipindai.
- Hindari gaya dark-mode otomatis dari template kecuali tema gelap benar-benar dirancang dan diuji sebagai fitur tersendiri.

## Struktur dan Perilaku Halaman

### Navigasi Aplikasi

- Buat header bersama yang menampilkan nama/wordmark Review Kantin, tautan daftar warung, dan kontrol akun.
- Untuk pengguna tanpa sesi, tampilkan aksi masuk dan daftar. Untuk pengguna yang sudah masuk, tampilkan nama/role dan aksi keluar tanpa mengubah mekanisme `AuthContext`.
- Pada layar sempit, sederhanakan navigasi tanpa menghilangkan akses ke halaman utama atau akun.

### Daftar Warung (`/`)

- Susun halaman dengan judul dan deskripsi singkat, diikuti pencarian yang menonjol namun tidak mengambil alih seluruh viewport.
- Tampilkan hasil sebagai grid kartu yang responsif: 3 kolom pada desktop lebar, 2 pada tablet, dan 1 pada ponsel.
- Isi kartu dengan nama warung, kategori, deskripsi yang dipotong dengan rapi, dan tautan ke detail. Jangan menampilkan rating atau jumlah ulasan jika API belum menyediakan datanya.
- Sediakan filter kategori hanya jika nilai kategorinya tersedia dari data yang dikembalikan API; pencarian yang ada harus tetap berfungsi.
- Pertahankan tombol tambah/edit sesuai role admin dan owner serta tombol hapus hanya untuk admin. Sajikan form tambah/edit sebagai dialog atau panel terstruktur dengan label, validasi, dan tombol batal/simpan.
- Ganti `alert()` dan `confirm()` pada alur yang disentuh dengan dialog konfirmasi dan notifikasi inline/toast yang dapat diakses, tanpa mengubah hasil operasi API.
- Sediakan tampilan loading, error dengan aksi coba lagi, dan empty state dengan pesan yang jelas.

### Detail Warung (`/stalls/:id`)

- Daftarkan route detail di `App.tsx` dan hubungkan setiap kartu warung ke route tersebut.
- Gunakan header ringkas, navigasi kembali, nama/kategori/deskripsi warung, lalu bagian ulasan atau menu hanya jika endpoint dan data yang tersedia mendukungnya.
- Pertahankan status loading dan warung tidak ditemukan; tambahkan pesan error yang terlihat kepada pengguna dan aksi kembali ke daftar.
- Gunakan gambar hanya bila API menyediakan URL yang sesuai. Jika tidak ada gambar, pakai placeholder warna cream/pink yang konsisten, bukan gambar eksternal acak.

### Login dan Registrasi

- Gunakan layout autentikasi bersama dengan form berlebar terbatas, judul yang jelas, label permanen, dan tautan pindah antarhalaman.
- Pertahankan validasi browser serta pesan error dari API. Letakkan pesan di dekat form dan umumkan secara aksesibel.
- Tampilkan status submit agar pengguna memahami saat permintaan sedang diproses dan cegah submit berulang.

## Arsitektur Styling

- Jadikan `index.css` sumber token global, reset ringan, tipografi dasar, warna, dan aturan responsif umum.
- Ubah `App.css` menjadi gaya komponen bersama atau hapus aturan starter yang tidak lagi dipakai.
- Pindahkan styling inline dari halaman ke class CSS yang memiliki penamaan konsisten, misalnya `site-header`, `stall-grid`, `stall-card`, `form-field`, dan `status-message`.
- Buat komponen bersama hanya untuk pola yang benar-benar dipakai ulang, seperti header, tombol, field form, dialog, dan notifikasi.
- Pertahankan pemisahan tanggung jawab: komponen halaman mengelola alur data yang sudah ada, sedangkan CSS mengelola presentasi.
- Gunakan elemen semantik (`header`, `main`, `nav`, `section`, `form`) dan tautan React Router, bukan tautan penuh halaman untuk navigasi internal.

## Responsivitas dan Aksesibilitas

- Uji layout pada lebar sekitar 360 px, 768 px, dan 1280 px; tidak boleh ada scroll horizontal atau teks yang saling menimpa.
- Pastikan semua fungsi dapat digunakan dengan keyboard, fokus terlihat jelas, label terhubung ke input, dan urutan tab masuk akal.
- Gunakan tombol untuk aksi dan tautan untuk navigasi. Beri nama aksesibel pada kontrol ikon dan jangan mengandalkan warna saja untuk menyampaikan status.
- Hormati `prefers-reduced-motion`; animasi masuk cukup singkat dan tidak boleh menghalangi interaksi.
- Pastikan pesan loading, error, dan keberhasilan memiliki teks yang dapat dibaca screen reader.

## Urutan Implementasi

1. Ganti token global template Vite dengan palet, tipografi, reset, dan fondasi responsif.
2. Bangun header serta komponen dasar yang diperlukan halaman.
3. Rapikan halaman daftar warung tanpa mengubah kontrak API dan aturan role; pastikan loading, error, empty, dan submit state tertangani.
4. Daftarkan route detail, hubungkan kartu ke detail, dan rapikan tampilan detail yang sudah ada.
5. Terapkan gaya autentikasi dan selaraskan pesan serta status submit.
6. Uji build, lint, alur autentikasi, pencarian, operasi role, navigasi detail, dan tampilan pada ukuran desktop serta ponsel.

## Kriteria Selesai

- Seluruh halaman menggunakan identitas warna cream, putih, dan pink yang konsisten, dengan teks tetap terbaca.
- Daftar warung, pencarian, autentikasi, dan operasi berdasarkan role tetap berfungsi dengan endpoint yang sekarang.
- Kartu warung membuka detail melalui route yang terdaftar; keadaan loading, gagal, kosong, dan data tidak ditemukan memiliki tampilan yang jelas.
- Layout beradaptasi pada ponsel, tablet, dan desktop tanpa overflow horizontal.
- Kontrol dapat dioperasikan dengan keyboard, fokus terlihat, dan form memiliki label serta umpan balik.
- `npm run build` dan `npm run lint` pada folder `frontend` selesai tanpa error baru.