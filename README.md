Repositori ini berisi kode sumber untuk aplikasi web **Review Kantin**, yang dibuat untuk memenuhi tugas integrasi antara Frontend dan Backend. Aplikasi ini dibangun menggunakan **React (TypeScript)** di sisi frontend, **Express.js** di sisi backend, serta **Microsoft SQL Server (SSMS)** sebagai basis datanya.

## Teknologi yang Digunakan

### **Frontend**
- **Framework & Language:** React (TypeScript) via Vite
- **HTTP Client:** Axios (dilengkapi interceptor token JWT)
- **Routing:** React Router DOM (`useParams`, `useNavigate`)
- **Styling:** CSS / Tailwind CSS

### **Backend**
- **Runtime & Framework:** Node.js & Express.js
- **Database Driver:** `mssql` / SQL Server (SSMS)
- **Autentikasi & Keamanan:** JSON Web Token (JWT), BCrypt untuk hashing password, dan CORS Middleware
- **Dokumentasi API:** Swagger / OpenAPI

---

## Konfigurasi Environment (`.env`)

Untuk alasan keamanan, file `.env` yang berisi kredensial asli database dan JWT secret **tidak diunggah** ke repositori publik. 

Sebagai panduan, gunakan file `.env.example` yang sudah disediakan:

1. Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
2. Setelah menyiapkan login database pada langkah di bawah, isi `DB_PASSWORD` dan
   `JWT_SECRET` di `.env` dengan nilai rahasia lokal. Jangan commit file `.env`.
3. Frontend dapat memakai konfigurasi tersendiri:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   `VITE_API_BASE_URL` mengikuti prefix `/api/v1` yang digunakan frontend saat ini.
   Backend juga menyediakan alias `/api` untuk endpoint logout dan audit sesuai kontrak
   Tugas 5.

## Database Audit Log

Jalankan skrip berikut **secara berurutan** melalui SSMS, setelah memilih database proyek.
Skrip tidak dijalankan otomatis oleh aplikasi. Jalankan sebagai administrator database;
skrip 07 meminta Anda mengganti placeholder password sebelum membuat login:

```sql
database/05-audit-extension.sql
database/06-audit-append-only.sql
database/07-app-user-permissions.sql
```

Skrip 05 menambah metadata bila belum ada, constraint JSON, ukuran kolom minimum, dan
indeks audit secara idempotent. Skrip 06 menolak UPDATE/DELETE dengan error `50010`.
Skrip 07 menyiapkan login/user `kantin_app` dan menolak UPDATE/DELETE/ALTER pada
`AUDIT_LOGS`; akun aplikasi tetap memerlukan `INSERT` dan `SELECT` pada tabel tersebut.
Gunakan password yang sama untuk `DB_PASSWORD` lokal. Jangan menaruh password nyata
di skrip atau repository.

`database/audit_append_only_proof.sql` adalah pemeriksaan opsional setelah instalasi;
jalankan sebagai administrator dan pastikan error yang dilaporkan bernomor `50010`.