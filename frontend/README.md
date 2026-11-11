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