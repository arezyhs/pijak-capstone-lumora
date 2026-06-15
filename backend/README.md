# Lumora Backend API ⚙️

Layanan *Backend* Lumora berfungsi sebagai mesin penggerak utama (*core engine*) yang memadukan sistem manajemen basis data dan integrasi *Machine Learning*. Dibangun menggunakan **FastAPI**, *backend* ini menawarkan performa eksekusi tinggi, dokumentasi API otomatis, serta validasi tipe data menggunakan **Pydantic**.

---

## 🛠 Teknologi Utama
- **Framework:** FastAPI (Python)
- **Database ORM:** SQLAlchemy
- **Database Engine:** SQLite (Local/Development) & PostgreSQL Neon (Production)
- **Otentikasi:** JSON Web Token (JWT) + Passlib (Bcrypt)
- **Machine Learning Engine:** Scikit-Learn (Joblib)

---

## 🗺 Arsitektur & Endpoint Inti

Layanan Lumora terbagi dalam beberapa modul (Router) utama:

1. **Otentikasi (`/api/v1/auth`)**
   Menangani pendaftaran (`/register`), *login* (`/token`), dan validasi profil pengguna saat ini (`/me`).
2. **Konten API (`/api/v1/content`)**
   Sistem penayangan materi dan kuis (`/materials`, `/quizzes`) yang sepenuhnya ditarik secara dinamis dari tabel *database*. Tersedia rute POST khusus (`/quizzes/{id}/questions`) bagi guru untuk menginjeksi soal baru.
3. **Dasbor Siswa (`/api/v1/learning/dashboard`)**
   *Endpoint* paling krusial. Merangkum riwayat kuis, progres belajar, dan memanggil fungsi Inferensi Model *Random Forest* lokal untuk memberikan rekomendasi jalur belajar yang adaptif berdasarkan *stress level* dan riwayat skor.
4. **Dasbor Guru (`/api/v1/teacher`)**
   Merekap seluruh analitik populasi siswa di *database* (Nilai Rata-Rata Kelas, Total Siswa) serta mendeteksi **Siswa Berisiko** yang membutuhkan perhatian khusus.

---

## 🤖 Integrasi Model Machine Learning

*Backend* Lumora secara otomatis memuat dua artefak model (`.joblib`) dari repositori *Machine Learning* ke dalam memori aplikasi saat fase *startup*. 

Ketika *endpoint* Dasbor Siswa dipanggil, *backend* memproses atribut kondisi psikologis siswa (jam tidur, tingkat stres, metrik absensi) dan meneruskannya ke fungsi model. Prediksi (misal: "Remedial") kemudian digunakan untuk memicu logika adaptif penyesuaian materi.

---

## 🌱 Siklus Hidup & Database Seeding

Aplikasi ini menggunakan konsep *Lifespan Events*. Saat *server* dinyalakan, modul `init_db.py` akan:
1. Membangun struktur seluruh tabel (berdasarkan skema SQLAlchemy).
2. Mengecek apakah *database* masih kosong. Jika di bawah batas (misal <20), *Backend* akan melakukan *Automated Seeding* dengan menyuntikkan data sintesis (diimpor dari dataset CSV/JSON ML) agar dasbor aplikasi tidak kosong pada peluncuran pertama.

---

## 🚀 Panduan Menjalankan Layanan

Pastikan Python (versi 3.9+) telah terinstal di sistem Anda.

1. **Siapkan Virtual Environment & Instal Dependensi**
   ```bash
   python -m venv .venv
   # Di Windows:
   .venv\Scripts\activate
   # Di Mac/Linux:
   # source .venv/bin/activate
   
   pip install -r requirements.txt
   ```

2. **Jalankan Server Development**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

3. **Eksplorasi API secara Interaktif (Swagger UI)**
   Secara *default*, *Backend* dilengkapi antarmuka grafis yang ramah pengguna.
   Akses `http://localhost:8000/docs` di peramban (browser) untuk melakukan uji coba pada semua *endpoint* API secara langsung tanpa aplikasi *Frontend*.
