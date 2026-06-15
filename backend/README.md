# Lumora Backend API

Backend Lumora menyediakan REST API untuk frontend dan mengintegrasikan model Machine Learning untuk fitur rekomendasi cerdas. Layanan ini dibangun menggunakan framework FastAPI untuk performa tinggi dan Pydantic untuk validasi tipe data.

## Fitur Utama

- `/dashboard`: Endpoint untuk mengumpulkan data perkembangan siswa, hasil kuis terakhir, dan memanggil layanan rekomendasi AI untuk menyusun kurikulum adaptif.
- `/quiz/submit`: Endpoint untuk menerima jawaban kuis, menghitung skor akhir, dan menyesuaikan tingkat kesulitan soal berikutnya berdasarkan evaluasi AI.
- Integrasi Machine Learning: Endpoint terhubung langsung dengan pipeline Machine Learning untuk melakukan inferensi secara otomatis.

## Integrasi Model Machine Learning

Backend memuat model Machine Learning yang telah dilatih (format joblib) secara otomatis pada saat sistem dimulai. Saat layanan rekomendasi dipanggil, backend akan memproses data permintaan (seperti skor dan tingkat penyelesaian materi) menjadi parameter yang sesuai, lalu mengirimkannya ke model Random Forest. Hasil yang dikembalikan berupa prediksi performa (Remedial, Standard, Advanced) beserta tingkat kepercayaan prediksi.

## Cara Menjalankan Backend

Jalankan perintah berikut untuk menginisiasi dan menjalankan server backend:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Anda dapat menguji API dan melihat skema interaktif melalui Swagger UI pada alamat: `http://localhost:8000/docs`
