// src/config/constants.js

/* ==========================================================================
   GLOBAL CONFIGURATION
   Pusat pengaturan koneksi server, logika game, dan data dummy lokasi.
   ========================================================================== */

// --- 1. KONEKSI SERVER ---
// PENTING: Pilih SATU saja (Uncomment yang dipakai).
// Pastikan TIDAK ada akhiran "/api" agar tidak double saat dipanggil (misal: /api/api/status).

// ✅ OPSI A: Mode PRODUCTION (Domain Utama / VPS)
export const API_URL = "https://daurcuan.web.id";

// 🚧 OPSI B: Mode TESTING (Ngrok - Untuk HP beda jaringan)
// export const API_URL = "https://subdomain-kamu.ngrok-free.app";

// 💻 OPSI C: Mode LOKAL (Simulator / Emulator di Laptop yang sama)
// export const API_URL = "http://localhost:3001";

// 📱 OPSI D: Mode LOKAL (HP & Laptop di WiFi yang sama)
// export const API_URL = "http://192.168.1.10:3001"; // Ganti dengan IP Laptop (ipconfig)

// --- 2. LOGIKA APLIKASI ---
export const APP_CONFIG = {
  APP_NAME: "DaurCuan",
  VERSION: "2.1.0-Beta",
  CURRENCY: "pts",
  GAME_LOGIC: {
    POINTS_PER_BOTTLE: 50, // Poin per botol (Harus sinkron dengan C++ ESP32)
    CO2_PER_BOTTLE_KG: 0.05, // 1 Botol = 0.05kg Jejak Karbon dikurangi
    LAND_SAVED_PER_BOTTLE_M2: 0.002, // 1 Botol = 0.002m² Lahan diselamatkan
    MIN_REDEEM_POINTS: 1000, // Batas minimal tukar poin
  },
};

// --- 3. DATA LOKASI RVM (YOGYAKARTA AREA) ---
// Digunakan di halaman Locations.jsx
export const MOCK_LOCATIONS = [
  {
    id: 1,
    name: "Universitas AMIKOM Yogyakarta",
    address: "Jl. Ring Road Utara, Condongcatur, Sleman",
    coords: { lat: -7.7599, lng: 110.4083 },
    status: "Active",
    type: "Campus",
    capacity: 45,
  },
  {
    id: 2,
    name: "Universitas Gadjah Mada (UGM)",
    address: "Bulaksumur, Caturtunggal, Sleman",
    coords: { lat: -7.7705, lng: 110.3775 },
    status: "Active",
    type: "Campus",
    capacity: 82,
  },
  {
    id: 3,
    name: "UPN 'Veteran' Yogyakarta",
    address: "Jl. SWK 104 (Lingkar Utara), Depok, Sleman",
    coords: { lat: -7.7615, lng: 110.409 },
    status: "Active",
    type: "Campus",
    capacity: 65,
  },
  {
    id: 4,
    name: "Kawasan Malioboro",
    address: "Jl. Malioboro, Sosromenduran, Kota Yogyakarta",
    coords: { lat: -7.7926, lng: 110.3658 },
    status: "Full",
    type: "Public Area",
    capacity: 100,
  },
  {
    id: 5,
    name: "Universitas Muhammadiyah Yogyakarta (UMY)",
    address: "Jl. Brawijaya, Kasihan, Bantul",
    coords: { lat: -7.8113, lng: 110.3207 },
    status: "Maintenance",
    type: "Campus",
    capacity: 15,
  },
  {
    id: 6,
    name: "Candi Prambanan Park",
    address: "Jl. Raya Solo - Yogyakarta No.16, Kranggan",
    coords: { lat: -7.752, lng: 110.4914 },
    status: "Active",
    type: "Tourism",
    capacity: 30,
  },
];

// --- 4. OPSI PENUKARAN (Fallback Data) ---
// Opsi dasar jika API belum siap
export const REDEEM_OPTIONS = [
  {
    id: "gopay",
    name: "GoPay",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    color: "text-blue-500",
  },
  {
    id: "ovo",
    name: "OVO",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    color: "text-purple-500",
  },
  {
    id: "dana",
    name: "DANA",
    bg: "bg-sky-50 dark:bg-sky-900/20",
    color: "text-sky-500",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    color: "text-orange-500",
  },
];
