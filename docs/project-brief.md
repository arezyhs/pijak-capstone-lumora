# Project Brief

## Nama Produk

**Lumora - Adaptive AI Learning Path.**

Nama Lumora diambil dari "Lumen" yang berarti cahaya dan "Mora" yang merepresentasikan belajar. Nama ini membawa gagasan produk sebagai cahaya penuntun untuk proses belajar yang lebih personal.

## Latar Belakang Masalah

Pembelajaran konvensional sering memakai pendekatan *one-size-fits-all* untuk semua siswa, padahal tingkat stres, kondisi kehidupan (pendapatan keluarga, akses internet, jam tidur), dan kecepatan pemahaman konsep setiap siswa sangat bervariasi. Hal ini menyebabkan banyak siswa yang tertinggal namun luput dari pantauan guru.

## Solusi Lumora

Platform pembelajaran adaptif berbasis **Machine Learning** yang menganalisis bukan hanya performa kuis siswa, melainkan kondisi keseharian dan demografi mereka. Model AI (Random Forest / KNN) dilatih untuk memprediksi "Risiko Siswa" dan secara otomatis menyesuaikan *learning path* (jalur belajar) serta memberikan peringatan dini (*early warning*) kepada guru di Dasbor Monitoring.

## Fitur Unggulan (MVP)

1. **Sistem Autentikasi & Onboarding**: Mengumpulkan data latar belakang siswa secara inklusif.
2. **Dashboard Siswa Interaktif**: Menampilkan metrik penyelesaian, riwayat aktivitas dengan grafik interaktif (Recharts), dan status *Check-in* kondisi harian siswa.
3. **Materi & Kuis Dinamis**: Modul belajar bergaya *Reader* minimalis, dilengkapi evaluasi kuis akhir.
4. **Dashboard Monitoring Guru**: Tabel data interaktif yang merangkum kesehatan mental dan performa kelas secara keseluruhan. Guru dapat langsung melihat siswa dengan "Tingkat Risiko Tinggi".
5. **Machine Learning Pipeline**: Rekomendasi tidak di-*hardcode*, melainkan disuntikkan secara dinamis oleh backend FastAPI yang melayani file `.joblib` model prediksi yang telah dilatih dengan *student background dataset*.

## Pertanyaan Riset Capstone

- Faktor eksternal apa (seperti jam tidur, tingkat stres, dan akses internet) yang paling memengaruhi performa skor kuis siswa?
- Bagaimana algoritma *Machine Learning* dapat mereduksi beban pemantauan guru secara signifikan?
- Seberapa besar efektivitas antarmuka *Notion-like* yang minimalis dalam meningkatkan fokus belajar (retensi) siswa?
