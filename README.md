# 🌟 Lumora - Adaptive AI Learning Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

**Lumora** adalah platform pembelajaran adaptif berbasis *Artificial Intelligence* (AI) mutakhir. Aplikasi ini bertindak layaknya tutor pribadi cerdas yang secara konstan menganalisis performa akademis, metrik kebiasaan (seperti durasi tidur dan beban stres), hingga pola interaksi siswa untuk merancang **Jalur Belajar (Learning Path)** yang terpersonalisasi secara *real-time*.

---

## 🚀 Live Demo

Aplikasi ini telah mengudara dan dapat diakses publik:
- **Web App (Frontend)**: [pijak-capstone-lumora.vercel.app]

*(Catatan: Karena menggunakan *tier* gratis di Render, panggilan API pertama kali mungkin memakan waktu 30-50 detik untuk membangunkan server dari mode tidur).*

---

## ✨ Fitur Unggulan

### 🎓 Untuk Siswa (Student Hub)
- **AI-Driven Dashboard**: Menampilkan metrik kemajuan dan rekomendasi gaya belajar yang dipilihkan khusus oleh algoritma *Machine Learning*.
- **Dynamic Learning Paths**: Siswa secara otomatis diarahkan ke program spesifik (misal: *Fast-Track*, *Visual Learning*, atau *Fundamental Mode*) berdasarkan performa dan profil stres mereka.
- **Daily Check-ins**: Pemantauan harian terhadap tingkat stres dan durasi tidur yang langsung menjadi umpan silang (*feedback loop*) bagi prediksi AI.
- **Interactive Quizzes & Modules**: Evaluasi kuis instan yang skornya menentukan kesulitan materi bacaan di sesi berikutnya.

### 👨‍🏫 Untuk Pengajar (Teacher Dashboard)
- **Classroom Analytics**: Pandangan mata elang terhadap seluruh performa siswa dalam satu layar *dashboard* yang rapi.
- **Early Warning System**: AI akan memberikan penanda bahaya (🚨) pada profil siswa yang diprediksi berisiko mengalami penurunan nilai (berdasarkan analisis perilaku dan nilai kuis).
- **Student Management (CRUD)**: Kendali penuh bagi guru untuk memantau, memperbarui, atau mendaftarkan profil siswa baru ke dalam sistem.

---

## 🏗️ Arsitektur Sistem (Split Deployment)

Aplikasi ini dirancang menggunakan arsitektur *microservices* modern dan *serverless* untuk menjamin kecepatan tinggi dan penanganan beban komputasi AI yang stabil.

1. **Frontend (UI & Interaksi)** 
   - Dirancang menggunakan **React 19 + TypeScript + Vite**.
   - Dihosting pada sistem *serverless* **Vercel** untuk responsibilitas global dan memuat aset statis secara kilat (*Single Page Application*).

2. **Backend (Logika Bisnis & Mesin AI)**
   - Dibangun di atas fondasi **Python FastAPI** yang sangat cepat (*asynchronous*).
   - Diperkuat dengan **scikit-learn** dan **pandas** untuk memuat model `student_behavior_model.joblib`.
   - Dihosting sebagai *Web Service* mandiri di **Render.com** guna menampung pustaka komputasi *Data Science* yang ukurannya melampaui batas *cloud functions* biasa.

3. **Database**
   - Menggunakan relasional **PostgreSQL** awan (Supabase/Neon) dengan integrasi **SQLAlchemy** (ORM).

---

## 📂 Struktur Direktori

```text
pijak-capstone-lumora/
├── backend/                  # REST API & AI Server
│   ├── app/                  # FastAPI Application
│   │   ├── api/              # API Endpoints (Routes)
│   │   ├── core/             # Database & Security Configs
│   │   ├── models/           # SQLAlchemy Schemas
│   │   └── services/         # Business Logic & AI Recommender
│   ├── requirements.txt      # Backend Dependencies (scikit-learn, etc)
│   └── uvicorn.err.log
├── frontend/                 # Web User Interface
│   ├── src/
│   │   ├── api/              # Axios Client
│   │   ├── components/       # Reusable React Components (Sidebar, UI)
│   │   ├── pages/            # View Pages (Dashboard, Login, Quiz, dll)
│   │   └── ...               
│   ├── vercel.json           # Vercel SPA Routing Rules
│   └── package.json          # Frontend Dependencies
└── ml/                       # Machine Learning Pipeline (Training)
    ├── data/                 # Datasets
    ├── models/               # Dumped Models (.joblib) & Plots
    └── notebooks/            # Jupyter Notebooks untuk EDA & Training
```

---

## 💻 Cara Menjalankan Secara Lokal (Local Development)

Ingin mengembangkan Lumora di komputer Anda sendiri? Ikuti langkah-langkah berikut:

### 1. Menyiapkan Backend
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
*Backend akan berjalan di `http://localhost:8000` (menggunakan basis data SQLite lokal secara otomatis).*

### 2. Menyiapkan Frontend
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```
*Frontend akan dapat diakses di `http://localhost:5173`.*

---

## 🔬 Ekosistem AI (Machine Learning)
Model AI di balik Lumora dilatih secara independen menggunakan *pipeline* klasifikasi. Model ini menganalisis nilai kuis terdahulu, absensi, durasi tidur harian, survei stres, dan waktu akses materi untuk memprediksi probabilitas siswa menguasai suatu kompetensi, yang kemudian memicu logika penentuan **Gaya Belajar**. Seluruh kode pelatihannya, mulai dari *Exploratory Data Analysis* (EDA) hingga metrik akurasi dapat Anda telusuri di dalam folder `/ml`.

---

<div align="center">
  <b>Dibangun dengan ❤️ untuk masa depan pendidikan yang lebih cerdas dan personal.</b>
</div>