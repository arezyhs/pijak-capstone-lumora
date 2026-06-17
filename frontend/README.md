# Lumora Frontend 🎨

Antarmuka pengguna (UI) Lumora dibangun menggunakan ekosistem **React + TypeScript** dan dikonfigurasi menggunakan **Vite** untuk performa kompilasi yang super cepat. Aplikasi ini mengusung filosofi desain yang modern, *Notion-style*, dinamis, dan responsif—sepenuhnya dikembangkan menggunakan Vanilla CSS untuk memastikan fleksibilitas gaya dan animasi tingkat piksel.

---

## 🏗 Struktur Direktori Utama

- `src/api/`: Berisi klien HTTP (`client.ts`) yang mengatur seluruh komunikasi *fetch* data ke *Backend* secara terpusat.
- `src/components/`: Kumpulan komponen UI yang dapat digunakan ulang (*reusable*), seperti Sidebar interaktif, kartu profil, serta sistem *routing* utama.
- `src/pages/`: Representasi utuh untuk setiap halaman dalam aplikasi Lumora.
- `src/types/`: Definisi tipe data TypeScript (`index.ts`) untuk memastikan integritas data (DTO) dari dan ke *Backend*.

---

## 📱 Fitur & Halaman Inti

### 🧑‍🎓 Modul Siswa (Student View)
1. **Dasbor Belajar (`Dashboard.tsx`):** Pusat kendali siswa yang menampilkan progres belajar, nilai rata-rata, grafik performa, dan tip adaptif (berdasarkan analisis model ML *Backend*).
2. **Pembaca Materi (`MaterialView.tsx`):** Halaman membaca yang imersif dan mendukung teks berbasis *Markdown*.
3. **Sistem Evaluasi Kuis (`QuizView.tsx`):** Halaman pengerjaan kuis interaktif dengan navigasi nomor, pengunci jawaban otomatis, dan skor seketika.
4. **Onboarding (`OnboardingView.tsx`):** Pengumpulan data psikologis awal (seperti jam tidur & tingkat stres) untuk personalisasi profil.

### 👨‍🏫 Modul Guru (Teacher View)
Sistem Guru menggunakan arsitektur *Modular* untuk mempermudah navigasi:
1. **Teacher Dashboard (`TeacherDashboard.tsx`):** Dasbor analitik tinggi untuk memantau performa kelas secara agregat dan daftar "Siswa Prioritas" yang butuh perhatian.
2. **Manajemen Siswa (`TeacherStudents.tsx`):** Tabel daftar seluruh siswa lengkap beserta hasil evaluasi.
3. **Manajemen Konten Kuis (`TeacherQuizzes.tsx`):** Sistem manajemen konten (CMS) bagi guru untuk menambahkan bank soal baru ke dalam *database*.

---

## 🚀 Panduan Instalasi & Pengembangan

Aplikasi dikonfigurasi untuk langsung merujuk ke API *Production* atau *Local* berdasarkan environment. 

1. **Instalasi Dependensi**
   Pastikan Anda menggunakan Node.js versi LTS terbaru.
   ```bash
   npm install
   ```

2. **Menjalankan Mode Pengembangan (Development)**
   Akan menjalankan server *hot-reload* bawaan Vite.
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui: `http://localhost:5173`

3. **Membangun untuk Produksi (Build)**
   Menghasilkan *bundle* statis siap deploy di direktori `dist/`.
   ```bash
   npm run build
   ```
