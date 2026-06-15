# Milestones Capstone Project

## Minggu 1 - Inisialisasi dan Perencanaan `[SELESAI]`
- Setup repository dan struktur monorepo.
- Dokumentasi arsitektur sistem.
- API contract awal.
- Wireframe/dashboard awal.
- Eksplorasi kandidat dataset.

## Minggu 2 - Pengembangan Awal (Model & Backend) `[SELESAI]`
- EDA dan preprocessing data dari Student Background & Behavioral Dataset.
- Training & eksport Baseline model (`student_behavior_model.joblib`).
- Pembuatan API FastAPI dan database SQLite untuk Autentikasi JWT.
- Integrasi CORS dan routing API dasar.

## Minggu 3 - Frontend UI/UX (Aesthetics) `[SELESAI]`
- Pembuatan sistem antarmuka berbasis React dengan *Vanilla CSS*.
- Penerapan desain *Notion-like* dengan *Split-screen* Auth, Sidebar, dan Dark Mode terintegrasi.
- Desain Dashboard responsif, halaman Onboarding, Material, Quiz, dan Teacher View.
- Modularisasi arsitektur CSS (`App.css` -> `Dashboard.css`, dsb) demi skalabilitas.

## Minggu 4 - Integrasi Sistem End-to-End `[SELESAI]`
- Frontend terkoneksi penuh dengan Backend API.
- Proses Registrasi -> Onboarding -> Dashboard tersambung.
- ML Service di Backend berhasil memproses data dari Frontend dan merekomendasikan Learning Path personal di Dashboard Siswa.
- Monitoring Guru menangkap metrik secara real-time dari database.

## Minggu 5 - Finalisasi & Deployment `[DALAM PROSES]`
- Bug fixing UI/UX (*Loading Screen Alignment*, *CSS Keyframes*).
- Pembersihan *hardcoded data* agar konten materi bisa fleksibel (Direncanakan).
- Deployment MVP ke server *Cloud* (Render untuk Backend API, Vercel untuk React Frontend).
- Penyusunan Laporan Akhir Capstone & Dokumentasi Proyek.
- Persiapan Video Demo produk dan persentasi akhir.
