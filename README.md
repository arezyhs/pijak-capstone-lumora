<div align="center">

# Lumora - Aplikasi Pembelajaran Berbasis AI

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

</div>

Lumora adalah aplikasi web pembelajaran yang memadukan modul materi biasa dengan pemodelan *Machine Learning*. Aplikasi ini dibuat sebagai proyek akhir (*Capstone Project*) dari program **Pijak in collaboration with IBM SkillsBuild** yang diselenggarakan oleh **Dicoding**.

Berbeda dengan aplikasi e-learning biasa, Lumora mencatat kondisi harian siswa (seperti jam tidur dan tingkat stres) beserta skor kuis mereka, lalu menggunakan model prediksi untuk menentukan tingkat kesulitan materi selanjutnya secara otomatis.

---

## 📸 Tangkapan Layar Aplikasi

<div align="center">
  <img src="docs/screenshots/Login.png" alt="Login Page" width="48%" style="border-radius: 8px; border: 1px solid #37352f20;">
  <img src="docs/screenshots/Beranda%201.png" alt="Student Dashboard" width="48%" style="border-radius: 8px; border: 1px solid #37352f20;">
  <img src="docs/screenshots/Beranda%20(Light%20Mode).png" alt="Dashboard Light Mode" width="48%" style="border-radius: 8px; border: 1px solid #37352f20;">
  <img src="docs/screenshots/Materi.png" alt="Material Reader" width="48%" style="border-radius: 8px; border: 1px solid #37352f20;">
</div>

---

## 🚀 Live Demo

- **Aplikasi Web**: [Kunjungi Lumora di Vercel](https://pijak-capstone-lumora.vercel.app)
*(Catatan: Karena Backend API menggunakan server gratis di Render, proses masuk/login pertama kali mungkin memakan waktu 30-50 detik untuk membangunkan server).*

---

## ✨ Fitur Aplikasi

### 1. Mode Siswa
- **Rekomendasi Materi Otomatis**: Menyusun daftar bacaan dan latihan secara dinamis berdasarkan perhitungan skor kuis terakhir dan profil siswa.
- **Check-in Harian**: Formulir singkat untuk melaporkan durasi tidur dan beban pikiran sebelum memulai sesi belajar.
- **Modul Baca & Kuis**: Antarmuka pembaca materi yang bersih (Notion-style) yang diakhiri dengan evaluasi interaktif.

### 2. Mode Guru
- **Tabel Monitoring Kelas**: Ringkasan lengkap performa seluruh siswa dalam satu layar.
- **Indikator Risiko Siswa**: Menyorot siswa yang diprediksi oleh AI berada pada kategori "Risiko Tinggi" (rentan nilai turun atau stres tinggi), sehingga guru dapat melakukan intervensi manual.
- **Manajemen Akun**: Fitur penambahan dan pengubahan profil siswa di kelas.

---

## 💻 Menjalankan Aplikasi Secara Lokal

### 1. Menyiapkan Backend
Buka terminal dan jalankan perintah berikut:
```bash
cd backend
python -m venv .venv

# Aktivasi Lingkungan Virtual (Windows)
.venv\Scripts\activate
# Aktivasi Lingkungan Virtual (Mac/Linux)
source .venv/bin/activate

# Install pustaka dan jalankan server
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
*API akan aktif di `http://localhost:8000`.*

### 2. Menyiapkan Frontend
Buka tab terminal baru:
```bash
cd frontend
npm install
npm run dev
```
*Aplikasi web dapat diakses di `http://localhost:5173`.*

---

## ⚙️ Arsitektur & Teknologi

Aplikasi ini dipisah menjadi dua sistem utama (*split deployment*):

1. **Frontend (Vercel)** 
   - Dibuat menggunakan **React 18** (TypeScript) dan di-*build* melalui **Vite**.
   - Desain murni menggunakan Vanilla CSS secara modular untuk menjaga tampilan yang bersih, responsif, dan ringan.

2. **Backend & Machine Learning (Render)**
   - Berbasis **FastAPI** (Python) untuk melayani koneksi API berkecepatan tinggi.
   - Pustaka **scikit-learn** digunakan untuk memproses klasifikasi data dari file model `student_behavior_model.joblib`.
   - Menggunakan basis data **SQLite** (lokal) / PostgreSQL yang dikelola melalui ORM **SQLAlchemy**.

---

## 📂 Struktur Direktori

```text
pijak-capstone-lumora/
├── backend/                  # Server API & Logika AI
│   ├── app/                  # Rute FastAPI, Model DB, dan Autentikasi
│   └── requirements.txt      # Dependensi Python
├── frontend/                 # Aplikasi Web React
│   ├── src/                  # Komponen UI, Halaman, dan Klien API
│   ├── vercel.json           # Aturan Routing Vercel
│   └── package.json          # Dependensi Node.js
└── ml/                       # Eksplorasi Machine Learning
    ├── data/                 # Dataset mentah dan yang sudah diproses
    ├── models/               # File model terlatih (.joblib)
    └── notebooks/            # Jupyter Notebook untuk training model
```

---

## 👥 Tim Pengembang (PJK-RM116)

Aplikasi ini adalah hasil *Capstone Project* dari tim MSIB AI Engineer:

| Nama | ID Peserta | Email | Peran Utama |
|---|---|---|---|
| **Akbar Rezy Hanara Setiyawan** | APC284D6Y0339 | apc284d6y0339@student.devacademy.id | **Lead Full-Stack & Cloud Architect**<br>*(Frontend React, API FastAPI, Deployment Vercel/Render)* |
| **Anggi Permana** | APC907D6Y0019 | apc907d6y0019@student.devacademy.id | **Machine Learning Engineer**<br>*(Analisis Dataset, Feature Engineering, Training Model)* |
| **Padre Willi Evans Simarmata** | APC318D6Y0260 | apc318d6y0260@student.devacademy.id | **Machine Learning Engineer**<br>*(Analisis Dataset, Feature Engineering, Training Model)* |
| **Ria Adelina** | APC528D6X0470 | apc528d6x0470@student.devacademy.id | **Machine Learning Engineer**<br>*(Analisis Dataset, Feature Engineering, Training Model)* |