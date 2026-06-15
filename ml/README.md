# Lumora Machine Learning Workspace

Direktori ini difokuskan untuk pemrosesan dataset, analisis data eksploratif (EDA), dan pelatihan model kecerdasan buatan untuk sistem pembelajaran adaptif.

## Arsitektur Model

- Algoritma: Random Forest Classifier.
- Target Prediksi: Mengklasifikasikan tingkat performa siswa ke dalam tiga kategori, yaitu Remedial, Standard, dan Advanced.
- Fitur Utama: Model menggunakan parameter seperti kategori pelajaran, rata-rata nilai kuis, tingkat penyelesaian materi, persentase kehadiran, jam belajar mingguan, dan skor partisipasi.

## Struktur Direktori

- `data/`: Menyimpan dataset mentah dan data historis dalam format CSV atau JSON.
- `notebooks/`: Menyimpan dokumen Jupyter Notebook untuk eksperimen, eksplorasi data, dan penyetelan parameter model.
- `src/`: Berisi skrip utama Python.
  - `train.py`: Skrip untuk menjalankan proses pelatihan model, mulai dari pemuatan data, prapemrosesan, hingga penyimpanan artefak model.
  - `eda.py`: Skrip untuk menghasilkan profil data dan analisis statistik dasar.
- `models/`: Tempat penyimpanan artefak model yang telah dilatih (berformat .joblib) agar dapat diakses langsung oleh layanan backend.

## Melatih Ulang Model

Jika terdapat data baru atau pembaruan konfigurasi, Anda dapat melatih ulang model dengan menjalankan perintah berikut:

```bash
python src/train.py
```

Skrip ini akan memperbarui artefak model di dalam folder `models/` secara otomatis, sehingga layanan backend dapat langsung menggunakan model versi terbaru.
