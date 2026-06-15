# Lumora - Adaptive Learning Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

Lumora adalah platform pembelajaran adaptif yang menggunakan model Machine Learning untuk menganalisis kebiasaan dan performa belajar siswa. Sistem ini bertujuan memberikan rekomendasi gaya belajar yang sesuai serta membantu pengajar memantau perkembangan siswa secara efektif.

---

## 🚀 Live Demo

- **Aplikasi Web**: [https://pijak-capstone-lumora.vercel.app]
*(Catatan: API di-host menggunakan versi gratis di Render, sehingga panggilan pertama mungkin memerlukan waktu 30-50 detik untuk aktif).*

---

## Fitur Utama

### 1. Panel Siswa (Student Dashboard)
- **Rekomendasi Gaya Belajar**: Menampilkan jalur belajar yang disesuaikan berdasarkan prediksi Machine Learning (misal: *Visual Learning*, *Fast-Track*, dll).
- **Pemantauan Kondisi**: Fitur absensi harian yang mencatat tingkat stres dan durasi tidur siswa untuk analisis data.
- **Kuis Interaktif**: Penilaian berbasis kuis untuk mengevaluasi pemahaman materi.

### 2. Panel Guru (Teacher Dashboard)
- **Analitik Kelas**: Menampilkan ringkasan performa seluruh siswa.
- **Sistem Peringatan Dini**: Memberikan label peringatan pada siswa yang berisiko mengalami penurunan performa berdasarkan data yang dikumpulkan.
- **Manajemen Data Siswa**: Pengajar dapat menambah, mengedit, dan menghapus data siswa di dalam kelas.

---

## Arsitektur Sistem

Aplikasi ini menggunakan pendekatan pemisahan layanan (*split deployment*):

1. **Frontend** 
   - Dibangun menggunakan **React 19, TypeScript, dan Vite**.
   - Di-deploy di **Vercel** sebagai *Single Page Application* (SPA).

2. **Backend & Machine Learning**
   - Menggunakan **FastAPI (Python)** untuk melayani REST API.
   - Menggunakan **scikit-learn** dan **pandas** untuk memuat dan memproses model prediksi (`student_behavior_model.joblib`).
   - Di-deploy di **Render.com** untuk menangani ukuran pustaka data science.

3. **Database**
   - Menggunakan **PostgreSQL** dengan integrasi ORM **SQLAlchemy**.

---

## 📂 Struktur Direktori

```text
pijak-capstone-lumora/
├── backend/                  # REST API & Konfigurasi Server
│   ├── app/                  # FastAPI App (Routes, Models, Services)
│   └── requirements.txt      # Dependensi Python
├── frontend/                 # UI/UX Web (React)
│   ├── src/                  # Komponen, Halaman, dan Klien API
│   ├── vercel.json           # Aturan Routing Vercel
│   └── package.json          # Dependensi Node.js
└── ml/                       # Pipeline Machine Learning
    ├── data/                 # Dataset
    ├── models/               # Model ML yang sudah dilatih (.joblib)
    └── notebooks/            # Notebook Eksplorasi Data & Training
```

---

## 💻 Panduan Instalasi Lokal

Untuk menjalankan aplikasi ini di komputer lokal:

### 1. Backend
```bash
cd backend
python -m venv .venv

# Aktivasi Virtual Environment (Windows)
.venv\Scripts\activate
# Aktivasi Virtual Environment (Mac/Linux)
source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
*API akan berjalan di `http://localhost:8000` dengan SQLite lokal.*

### 2. Frontend
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```
*Aplikasi Web akan berjalan di `http://localhost:5173`.*

---

## 👥 Tim Pengembang PJK-RM116

Aplikasi ini merupakan *Capstone Project* yang dikembangkan oleh tim AI Engineer PJK-RM116:

| Nama | ID Peserta | Email | Peran (*Role*) |
|---|---|---|---|
| **Akbar Rezy Hanara Setiyawan** | APC284D6Y0339 | apc284d6y0339@student.devacademy.id | **Lead Full-Stack Developer & Cloud Architect**<br>*(Pengembangan Frontend, Backend API, Integrasi Database, dan Deployment Vercel/Render)* |
| **Anggi Permana** | APC907D6Y0019 | apc907d6y0019@student.devacademy.id | **Machine Learning Engineer**<br>*(Analisis Data, Feature Engineering, dan Pelatihan Model)* |
| **Padre Willi Evans Simarmata** | APC318D6Y0260 | apc318d6y0260@student.devacademy.id | **Machine Learning Engineer**<br>*(Analisis Data, Feature Engineering, dan Pelatihan Model)* |
| **Ria Adelina** | APC528D6X0470 | apc528d6x0470@student.devacademy.id | **Machine Learning Engineer**<br>*(Analisis Data, Feature Engineering, dan Pelatihan Model)* |