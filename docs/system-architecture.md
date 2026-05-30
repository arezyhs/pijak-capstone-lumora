# System Architecture

## Komponen

```text
Student/Guru Browser
        |
        v
React Frontend
        |
        v
FastAPI Backend
        |
        +--> Database: users, quizzes, progress, recommendations
        |
        +--> ML Service: performance analysis, recommendation, difficulty adaptation
```

## Alur Data Awal

1. Siswa menyelesaikan quiz atau aktivitas belajar.
2. Frontend mengirim hasil aktivitas ke backend.
3. Backend menyimpan progress dan meminta rekomendasi ke ML service.
4. ML service mengembalikan materi prioritas, alasan, dan tingkat kesulitan berikutnya.
5. Frontend menampilkan learning path personal.

## Batas Tahap 1

- Database belum permanen; backend memakai data contoh agar integrasi awal bisa diuji.
- Model ML belum training dari dataset final; service memakai rule-based baseline.
- API contract sudah disiapkan agar implementasi berikutnya tidak berubah drastis.
