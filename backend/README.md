# Lumora Backend API

Backend Lumora bertugas menyediakan REST API untuk frontend dan mengintegrasikan model Machine Learning untuk fitur rekomendasi cerdas. 
Dibuat dengan framework **FastAPI** yang sangat cepat dan didukung oleh tipe validasi menggunakan **Pydantic**.

## Fitur API Utama
- `/dashboard`: Endpoint komprehensif yang mengumpulkan data *progress* siswa, kuis terakhir, serta memanggil **AI Recommender** untuk mendapatkan kurikulum adaptif.
- `/quiz/submit`: Menerima hasil jawaban kuis, menghitung skor, dan menghasilkan tingkat kesulitan (difficulty) baru berbasis AI.
- Integrasi ke pipeline Machine Learning melalui `app/services/recommender.py`.

## Integrasi ML Model
Backend memuat model ML yang sudah dilatih (`ml/models/student_behavior_model.joblib`) secara otomatis saat startup. Saat endpoint AI dipanggil, backend akan memetakan *request payload* (skor, completion rate siswa) menjadi data turunan komprehensif, lalu mengirimkannya ke model *Random Forest* untuk mendapatkan prediksi (Remedial, Standard, Advanced) beserta persentase *confidence score* (Predict Proba).

## Menjalankan Backend

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Swagger UI untuk menguji API dan melihat skema interaktif tersedia di `http://localhost:8000/docs`.
