# API Contract

Base URL lokal: `http://localhost:8000`

## Health

`GET /health`

```json
{
  "status": "ok",
  "service": "lumora-api"
}
```

## Dashboard Siswa

`GET /api/v1/students/{student_id}/dashboard`

Mengembalikan progress, rekomendasi materi, hasil quiz terakhir, dan learning path.

## Rekomendasi Materi

`POST /api/v1/recommendations`

Request:

```json
{
  "student_id": "student-001",
  "subject": "Matematika",
  "quiz_score": 68,
  "completion_rate": 0.72,
  "weak_topics": ["Pecahan", "Persamaan Linear"]
}
```

Response:

```json
{
  "student_id": "student-001",
  "difficulty": "remedial",
  "recommended_topics": ["Pecahan", "Persamaan Linear"],
  "materials": [
    {
      "title": "Latihan Pecahan Bertahap",
      "type": "practice",
      "priority": 1
    }
  ],
  "reason": "Skor quiz menunjukkan penguatan konsep dasar masih diperlukan."
}
```

## Monitoring Guru

`GET /api/v1/teacher/overview`

Mengembalikan agregasi jumlah siswa, rata-rata progress, topik berisiko, dan siswa yang perlu perhatian.
