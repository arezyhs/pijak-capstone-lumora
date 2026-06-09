# Lumora Machine Learning Workspace

Workspace ini difokuskan untuk memproses dataset, melakukan EDA (Exploratory Data Analysis), dan melatih model AI *Adaptive Learning*.

## Arsitektur Model

- **Algoritma:** Random Forest Classifier.
- **Output (Class):** Memprediksi level performa siswa ke dalam tiga kategori: `Remedial`, `Standard`, atau `Advanced`.
- **Fitur Utama yang Digunakan:** `Department` (Kategori Pelajaran), `Quizzes_Avg` (Rata-rata Kuis), `Assignments_Avg` (Penyelesaian Materi), `Attendance (%)`, `Study_Hours_per_Week`, dan `Participation_Score`.

## Struktur Direktori

- `data/`: Dataset CSV dan JSON (termasuk *Students Performance Dataset* raksasa).
- `notebooks/`: Jupyter Notebook untuk Analisis Data Eksploratif dan tuning algoritma (direncanakan).
- `src/`: 
  - `train.py`: Script pipeline pelatihan model (Data Loading → Preprocessing → Random Forest → Model Export).
  - `eda.py`: Analitik dataset awal (Pandas profiling).
- `models/`: Tempat penyimpanan artefak model yang diekspor (`student_behavior_model.joblib`) yang akan dibaca langsung oleh Backend FastAPI untuk di-*serve* ke production.

## Melatih Ulang Model

Jika ada data baru, Anda dapat menjalankan ulang skrip *training* untuk memperbarui file `.joblib`:

```bash
python src/train.py
```
Model baru akan otomatis ditimpa ke folder `models/` dan siap digunakan secara langsung oleh Backend.
