# System Architecture Lumora

Aplikasi web Lumora dirancang menggunakan arsitektur modern *Client-Server* dengan sistem pemisahan antara Frontend (React) dan Backend (FastAPI + Machine Learning).

## Komponen Utama

```text
       [ User (Browser) ]
              |
              | (HTTPS)
              v
[ Frontend (Vercel) ] -- React, Vite, TS, Recharts, Lucide
              |
              | (REST API / JSON)
              v
[ Backend (Render) ]  -- FastAPI, Python, JWT Auth
              |
      +-------+-------+
      |               |
      v               v
[ Database ]    [ ML Engine ] -- Scikit-Learn (student_behavior_model.joblib)
 (SQLite / Local JSON / DB)
```

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite.
- **Bahasa**: TypeScript.
- **Styling**: Vanilla CSS (Modular) tanpa library eksternal berlebih, dioptimalkan untuk konsistensi desain *Notion-like*.
- **Routing**: `react-router-dom`.
- **Visualisasi Data**: `recharts`.
- **Ikon**: `lucide-react`.
- **State Management**: React Hooks + LocalStorage (untuk Session/Auth/Theme).

### Backend
- **Framework**: FastAPI (Python).
- **Machine Learning**: `scikit-learn`, `joblib` (Model klasifikasi Random Forest / KNN untuk memprediksi tingkat kesulitan & risiko siswa).
- **Autentikasi**: JWT (JSON Web Tokens) via `passlib` & `PyJWT`.
- **Database**: SQLAlchemy (ORM) dengan SQLite bawaan untuk kemudahan deployment.

## Alur Data & Machine Learning

1. **Onboarding & Check-in**: Siswa mengisi formulir profil (umur, gender, akses internet, aktivitas) dan mengisi check-in harian (jam tidur, tingkat stres). Data ini disimpan ke database.
2. **Aktivitas Belajar**: Siswa membaca modul materi dan menyelesaikan kuis.
3. **Analisis Backend**: Setiap kali aktivitas terjadi (atau dasbor dimuat), Backend mengagregasi *completion rate*, rata-rata kuis, stres, dll.
4. **Machine Learning Pipeline**: Data agregasi dikirim ke modul Recommender (`app.services.recommender`). Modul ini mengonversi JSON menjadi DataFrame, dan memprediksi "Status Risiko Siswa" (Rendah/Menengah/Tinggi) menggunakan `student_behavior_model.joblib`.
5. **Rekomendasi Personal**: Backend memberikan daftar urutan materi yang sesuai secara dinamis ke Frontend.
6. **Dashboard Guru**: Guru mengambil statistik gabungan seluruh siswa untuk memonitor perkembangan dan memberikan intervensi manual jika prediksi ML menyatakan siswa berada di zona "Risiko Tinggi".
