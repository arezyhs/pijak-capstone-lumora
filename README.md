# Lumora Adaptive AI Learning Path

Lumora adalah inisiasi MVP untuk proyek capstone PJK-RM116: platform adaptive learning yang menganalisis performa belajar siswa dan memberi rekomendasi materi personal. Nama Lumora diambil dari "Lumen" yang berarti cahaya dan "Mora" yang merepresentasikan belajar.

## Fokus Tahap 1

- Menyiapkan monorepo untuk frontend, backend, machine learning, dan dokumentasi.
- Menyediakan kontrak API awal agar FE, BE, dan ML bisa berjalan paralel.
- Menyediakan dummy recommendation service untuk integrasi awal.
- Menyediakan dashboard React awal untuk siswa dan ringkasan monitoring guru.

## Struktur

```text
backend/  FastAPI REST API dan integration layer model
frontend/ React TypeScript dashboard
ml/       eksperimen, preprocessing, dan recommendation model
docs/     arsitektur, API contract, milestone, dan keputusan teknis
doc/      dokumen project plan asli
```

## Menjalankan Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs tersedia di `http://localhost:8000/docs`.

## Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend tersedia di `http://localhost:5173`.

## Tahap Berikutnya

1. Pilih dataset utama dan buat notebook EDA.
2. Finalisasi database schema dan autentikasi JWT.
3. Ganti recommendation service dummy dengan model hasil training.
4. Hubungkan frontend ke backend API secara penuh.