# Lumora Frontend

Aplikasi frontend untuk Lumora dibangun menggunakan **React** + **TypeScript** dan dikonfigurasi menggunakan **Vite**. 

Lumora mengedepankan desain UI/UX yang modern, premium, dan intuitif menggunakan konsep *Glassmorphism*, palet warna *Indigo/Violet*, serta animasi mikro yang responsif untuk meningkatkan kenyamanan belajar siswa.

## Struktur & Komponen Utama
- `src/pages/Dashboard.tsx`: Pusat kontrol belajar siswa yang *actionable* (Prediksi AI, Peta Kurikulum interaktif, Topik Rekomendasi).
- `src/pages/MaterialView.tsx`: Mode membaca *fullscreen* ala Notion dengan parser Markdown terintegrasi untuk artikel dan daftar materi yang elegan.
- `src/pages/QuizView.tsx`: Mesin ujian interaktif dengan fitur navigasi soal dan kalkulasi skor otomatis.
- `src/pages/TeacherView.tsx`: Dashboard monitoring analitik untuk guru melihat tingkat penyelesaian siswa.

## Menjalankan Aplikasi

```bash
npm install
npm run dev
```

URL lokal default: `http://localhost:5173`.

## Membangun untuk Produksi

```bash
npm run build
```
