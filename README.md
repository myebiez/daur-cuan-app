🌱 DaurCuan System

Selamat datang di repository utama DaurCuan — sistem daur ulang pintar yang mengintegrasikan aplikasi web, server backend, dan mesin RVM (Reverse Vending Machine).

Daftar isi

- Deskripsi
- Struktur proyek
- Tech stack
- Persiapan (Prerequisites)
- Cara Menjalankan
- Konfigurasi penting
- Cara berkolaborasi (Git flow)
- Troubleshooting

## Deskripsi

DaurCuan adalah solusi untuk mengelola daur ulang botol secara digital: aplikasi frontend untuk pengguna, API backend untuk manajemen user dan poin, serta program RVM untuk simulasi/perangkat keras.

## Struktur proyek

- `frontend-app/` — Aplikasi (React + Vite + Tailwind CSS)
- `server-api/` — Backend API (Node.js + Express)
- `rvm-machine/` — Logika mesin/ simulasi (C++)

## Tech stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- RVM: C++ (g++)

## Persiapan (Prerequisites)

Pastikan environment berikut terpasang:

- Node.js & npm — cek dengan `node -v` dan `npm -v`
- Compiler C++ (g++) — Linux: `sudo apt install build-essential`
- Git

## Cara Menjalankan

Disarankan membuka 3 terminal (atau split terminal) untuk menjalankan masing-masing komponen.

1. Frontend (UI)

```bash
cd frontend-app
npm install    # sekali saja atau saat ada perubahan package
npm run dev
```

Buka browser pada alamat yang ditampilkan (mis. http://localhost:5173).

2. Backend (API)

```bash
cd server-api
npm install
node server.js
```

Default port biasanya `3001` (cek `server.js`).

3. Simulasi Mesin (RVM)

```bash
cd rvm-machine
g++ main.cpp -o main
./main
```

Di Windows gunakan MinGW atau WSL; hasil compile berupa `main.exe` di Windows.

## Konfigurasi Penting

Jika aplikasi frontend berjalan di perangkat/laptop lain dan ingin mengakses backend lokal, ganti URL API di frontend.

Edit: `frontend-app/src/App.jsx`
Cari variabel `API_URL` dan ubah sesuai IP server pada jaringan lokal.

Contoh jika IP server adalah `192.168.1.5`:

```js
const API_URL = "http://192.168.1.5:3001";
// Jika server & browser di mesin yang sama:
// const API_URL = "http://localhost:3001";
```

Untuk mengetahui IP lokal:

- Linux/Mac: `ip addr` atau `ifconfig`
- Windows: `ipconfig`

## Cara Berkolaborasi (Git flow)

- Selalu `git pull origin main` sebelum mulai bekerja.
- Commit perubahan lokal: `git add .` lalu `git commit -m "pesan"`.
- Push: `git push origin main`.

Jika terjadi konflik saat push: lakukan `git pull`, selesaikan konflik, lalu commit & push kembali.

## Troubleshooting

- Tampilan frontend berantakan/putih: hentikan dev server (`Ctrl+C`) lalu `npm run dev` kembali — kemungkinan Tailwind belum ter-build.
- Error "Module not found": masuk ke folder yang error dan jalankan `npm install`.
- Server tidak merespon: cek log terminal `server-api` dan port yang digunakan.

## Kontak / Lanjutan

Jika perlu, saya bisa:

- Membuat skrip `start-all` untuk menjalankan ketiga komponen secara bersamaan.
- Menambahkan file `.env.example` untuk konfigurasi `API_URL`.

Selamat mengembangkan! ♻️💰
