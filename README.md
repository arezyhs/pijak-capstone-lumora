# Lumora - Adaptive AI Learning Path (MVP)

Lumora adalah aplikasi *Adaptive Learning* interaktif berbasis AI yang menganalisis performa belajar siswa secara *real-time* dan memberikan rekomendasi materi belajar yang terpersonalisasi. Nama Lumora diambil dari "Lumen" (cahaya) dan "Mora" (belajar).

## Fitur Utama
- **Dashboard Pembelajaran AI:** Memberikan panduan langkah-demi-langkah bagi siswa (Peta Kurikulum) beserta prediksi performa (Remedial, Standard, Advanced) berdasarkan analitik skor dan partisipasi.
- **Rekomendasi Berbasis Machine Learning:** Menggunakan model Machine Learning *Random Forest Classifier* yang memprediksi kebutuhan belajar siswa menggunakan metrik seperti nilai tugas, skor kuis, dan kehadiran.
- **Materi Belajar Interaktif:** Halaman membaca materi yang terstruktur (berbasis kategori: Matematika, Sains, Logika) dengan antarmuka elegan *fullscreen* (Notion-style).
- **Simulasi Ujian/Kuis Adaptif:** Mesin kuis lengkap yang menyimpan hasil skor dan mengumpankannya kembali ke AI untuk rekomendasi berkelanjutan.
- **Monitoring Guru:** Panel analisis untuk memantau aktivitas, skor rata-rata, dan murid dengan risiko ketertinggalan belajar.

## Arsitektur & Teknologi

```text
backend/  FastAPI REST API, integrasi ML model (Joblib/Scikit-learn), Pydantic schemas.
frontend/ React + TypeScript, Vite, CSS Native, Lucide React (Desain Glassmorphism).
ml/       Dataset EDA, preprocessing, pipeline training Random Forest (student_behavior_model).
```

## Cara Menjalankan Aplikasi

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation (Swagger UI) tersedia di: `http://localhost:8000/docs`

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Buka aplikasi di browser: `http://localhost:5173`

## Pencapaian & Status Saat Ini
- ✅ Model ML (Random Forest) sudah dilatih dan terintegrasi untuk prediksi tingkat performa siswa secara transparan beserta confidence score-nya.
- ✅ Desain UI dirombak penuh menjadi lebih futuristik, elegan, dan *actionable*.
- ✅ Fitur Kuis nyata dan *Reader* materi sudah fungsional penuh.
- 🚧 Integrasi database persisten dan Auth sesungguhnya (masih menggunakan mock user `student1`).