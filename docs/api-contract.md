# API Contract Lumora

Base URL lokal: `http://localhost:8000/api/v1`

## Autentikasi

### `POST /auth/register`
Mendaftarkan pengguna baru (Siswa atau Guru).
- **Request Body**: `{"username": "string", "password": "password", "name": "string", "role": "student|teacher"}`
- **Response**: `{"access_token": "jwt", "token_type": "bearer", "role": "student", "username": "...", "name": "...", "created_at": "...", "has_completed_onboarding": false}`

### `POST /auth/login`
Masuk dengan kredensial.
- **Request Body**: (Form Data) `username=...&password=...`
- **Response**: Sama seperti Register.

## Profil & Kondisi Siswa

### `PUT /students/{student_id}/profile`
Memperbarui profil statis siswa (Onboarding).
- **Request Body**: `{"department": "IPA", "age": 16, "gender": "L", "internet_access": 1, "family_income": 2, "parent_edu": 3, "extracurricular": 1}`
- **Response**: `{"status": "success", ...}`

### `POST /students/{student_id}/condition`
Mencatat log kondisi harian siswa (Check-in).
- **Request Body**: `{"sleep_hours": 6, "stress_level": 7}`
- **Response**: `{"status": "success", ...}`

## Dashboard & Pembelajaran Siswa

### `GET /students/{student_id}/dashboard`
Mengembalikan rangkuman performa siswa.
- **Response**: `{"summary": {...}, "recent_history": [...], "learning_path": {...}}`

### `POST /students/{student_id}/complete_material`
Menandai materi sebagai selesai.
- **Request Body**: `{"material_id": "string", "score": 100}`

### `POST /students/{student_id}/submit_quiz`
Mengumpulkan nilai kuis.
- **Request Body**: `{"subject": "Matematika", "topic": "Aljabar", "score": 85, "answers": [...]}`

### `GET /students/{student_id}/history`
Mengambil riwayat pembelajaran, kuis, dan kondisi.

## Rekomendasi ML

### `POST /recommendations`
Meminta rekomendasi AI.
- **Request Body**: `{"student_id": "string", "subject": "string", "quiz_score": 80, ...}`
- **Response**: `{"student_id": "...", "difficulty": "...", "recommended_topics": [...], "materials": [...], "reason": "..."}`

## Monitoring Guru / Admin

### `GET /teacher/overview`
Mengambil statistik kelas (hanya role teacher).
- **Response**: `{"total_students": 30, "average_progress": 0.8, "at_risk_count": 5, "students": [...]}`

### `POST /teacher/students`
Menambah siswa secara manual dari dasbor guru.

### `PUT /teacher/students/{student_id}`
Mengubah data profil/kondisi siswa dari dasbor guru.

### `DELETE /teacher/students/{student_id}`
Menghapus profil siswa.
