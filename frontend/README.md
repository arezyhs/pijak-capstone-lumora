# Lumora Frontend

Antarmuka pengguna Lumora dibangun menggunakan React dengan TypeScript dan dikonfigurasi menggunakan Vite. Aplikasi ini dirancang dengan antarmuka yang modern dan responsif untuk memberikan pengalaman belajar yang nyaman dan intuitif.

## Struktur dan Komponen Utama

- Dashboard: Pusat kendali belajar siswa yang menampilkan prediksi AI, peta kurikulum interaktif, dan rekomendasi topik pembelajaran.
- Material View: Halaman membaca materi dengan mode layar penuh dan parser Markdown terintegrasi untuk menampilkan teks pembelajaran secara terstruktur.
- Quiz View: Halaman evaluasi interaktif yang dilengkapi fitur navigasi soal dan perhitungan skor secara otomatis.
- Teacher View: Dashboard pemantauan analitik bagi pengajar untuk melihat tingkat partisipasi dan perkembangan penyelesaian tugas siswa.

## Cara Menjalankan Aplikasi

Instal seluruh dependensi yang dibutuhkan lalu jalankan server pengembangan dengan perintah berikut:

```bash
npm install
npm run dev
```

Aplikasi akan berjalan secara lokal dan dapat diakses melalui: `http://localhost:5173`

## Membangun untuk Produksi

Untuk menghasilkan versi yang siap digunakan di lingkungan produksi, gunakan perintah:

```bash
npm run build
```
