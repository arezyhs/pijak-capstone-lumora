# Lumora - Adaptive AI Learning Path

Lumora adalah aplikasi pembelajaran adaptif komprehensif berbasis kecerdasan buatan (AI) yang menganalisis performa dan kebiasaan belajar siswa secara langsung untuk memberikan rekomendasi kurikulum yang terpersonalisasi secara otomatis.

## Fitur Utama

- Dashboard Pembelajaran Adaptif (Siswa): Menampilkan metrik kemajuan dan jalur belajar yang disesuaikan secara dinamis. Algoritma AI dapat mengarahkan siswa ke program khusus seperti Fast-Track, Visual Learning, Microlearning, atau Fundamental Mode berdasarkan analisis skor dan tingkat stres.
- Monitoring dan Manajemen Kelas (Guru): Dashboard analitik bagi pengajar untuk memantau performa kelas secara menyeluruh. Sistem secara otomatis menandai siswa dengan risiko tinggi berdasarkan peringatan dari model Machine Learning, serta dilengkapi sistem CRUD untuk mengelola data siswa.
- Mesin Kuis Interaktif: Evaluasi belajar mandiri yang menyimpan skor akhir dan secara otomatis mengumpankannya kembali ke layanan rekomendasi AI untuk menentukan tingkat kesulitan materi berikutnya.
- Bacaan Materi Terstruktur: Antarmuka membaca materi berlayar penuh dengan dukungan format Markdown, memberikan pengalaman belajar yang nyaman dan fokus.
- Pemrofilan Demografi dan Perilaku: Modul orientasi (Onboarding) yang mengumpulkan data kebiasaan siswa seperti durasi tidur harian, beban stres, dan status akses internet yang langsung menjadi parameter evaluasi model prediksi AI.

## Arsitektur dan Teknologi

Aplikasi ini dibagi menjadi tiga ekosistem utama yang terintegrasi secara mulus:

1. Frontend (Antarmuka Pengguna)
   Dibangun menggunakan React, TypeScript, dan Vite. Menggunakan desain antarmuka modern yang interaktif, dilengkapi dengan navigasi berbasis peran (Role-Based Access Control) yang membedakan akses antara Siswa dan Guru.
   
2. Backend (REST API dan Layanan AI)
   Dikembangkan dengan kerangka kerja FastAPI yang cepat dan validasi Pydantic. Backend menangani autentikasi JWT terintegrasi, manajemen basis data SQLite, serta memuat model Machine Learning ke dalam memori untuk melayani permintaan prediksi secara seketika (real-time).

3. Machine Learning (Kecerdasan Buatan)
   Menggunakan algoritma Random Forest Classifier yang dilatih dengan teknik penyeimbangan data (Oversampling). Model memproses 14 variabel independen yang mencakup performa kuis, persentase kehadiran materi, durasi jam belajar, hingga aspek demografi dan psikologis untuk menghasilkan tingkat prediksi performa siswa secara akurat.

## Panduan Menjalankan Aplikasi

Sistem memiliki basis data lokal yang secara otomatis menyuntikkan pengguna bawaan saat pertama kali API diakses (Auto-Seeding).

Kredensial bawaan untuk masuk ke aplikasi:
- Akun Siswa: Pengguna `student1` | Kata Sandi `password123`
- Akun Guru: Pengguna `teacher1` | Kata Sandi `password123`

### 1. Menjalankan Backend (FastAPI)

Pindah ke direktori backend, buat dan aktifkan virtual environment, pasang dependensi, lalu jalankan server:

```bash
cd backend
python -m venv .venv

# Untuk Windows:
.venv\Scripts\activate

# Untuk Mac/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Server API akan berjalan pada `http://localhost:8000` dan Swagger UI untuk pengujian API interaktif tersedia pada `http://localhost:8000/docs`.

### 2. Menjalankan Frontend (React)

Buka terminal baru, pindah ke direktori frontend, pasang seluruh dependensi, dan mulai server pengembangan:

```bash
cd frontend
npm install
npm run dev
```
Aplikasi dapat diakses melalui peramban web pada alamat `http://localhost:5173`.