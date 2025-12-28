// src/components/BottomNav.jsx

import React from "react";
import { Home, MapPin, ScanLine, Trophy, User } from "lucide-react";
import { useApp } from "../../context/AppContext";

// 1. Static Data (Performance Optimization)
const NAV_ITEMS = [
  { id: "home", icon: Home, label: "Beranda" },
  { id: "locations", icon: MapPin, label: "Lokasi" },
  { id: "scan", icon: ScanLine, label: "Scan", isFab: true },
  { id: "achievement", icon: Trophy, label: "Misi" },
  { id: "profile", icon: User, label: "Akun" },
];

const BottomNav = () => {
  const { state, actions } = useApp();

  // Helper: Haptic Feedback saat navigasi
  const handleNavClick = (id) => {
    if (state.activeTab === id) return;

    // Getar halus (jika browser support)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }

    actions.setActiveTab(id);
  };

  // Sembunyikan navigasi saat mode kamera/scan aktif
  if (state.activeTab === "scan") return null;

  return (
    // 2. Container Fixed di Bawah
    // pointer-events-none agar area kosong di kiri/kanan (pada desktop) tidak memblokir klik
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      {/* 3. Wrapper Lebar Aplikasi (max-w-md) */}
      {/* pointer-events-auto mengaktifkan klik hanya pada area navigasi */}
      <div className="w-full max-w-md pointer-events-auto relative">
        {/* Background Glassmorphism & Safe Area Padding */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200/60 dark:border-slate-800 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] pb-[env(safe-area-inset-bottom)] transition-colors duration-300">
          {/* Grid Layout */}
          <div className="grid grid-cols-5 h-[64px] items-end relative">
            {NAV_ITEMS.map((item) => {
              const isActive = state.activeTab === item.id;

              // --- A. TOMBOL SCAN (FAB - Floating Action Button) ---
              if (item.isFab) {
                return (
                  <div
                    key={item.id}
                    className="relative flex justify-center h-full pointer-events-none"
                    role="presentation"
                  >
                    {/* Lift Button Up */}
                    <div className="absolute -top-6 pointer-events-auto">
                      <button
                        onClick={() => handleNavClick(item.id)}
                        aria-label="Scan QR Code"
                        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/40 border-[4px] border-slate-50 dark:border-slate-900 active:scale-95 transition-transform duration-300 ease-out"
                      >
                        {/* Ping Animation (Attention Seeker) */}
                        <span className="absolute inset-0 rounded-full border border-white/20 animate-[ping_2.5s_ease-in-out_infinite] opacity-50"></span>

                        {/* Icon */}
                        <item.icon
                          size={28}
                          strokeWidth={2}
                          className="relative z-10 drop-shadow-sm transition-transform group-hover:scale-110"
                        />
                      </button>
                    </div>
                  </div>
                );
              }

              // --- B. TOMBOL NAVIGASI BIASA ---
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-label={item.label}
                  aria-selected={isActive}
                  role="tab"
                  className={`group relative flex flex-col items-center justify-center h-full pb-2 transition-colors duration-300 active:scale-95 cursor-pointer ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  {/* Top Active Indicator Line */}
                  <span
                    className={`absolute top-0 w-8 h-1 bg-emerald-500 rounded-b-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-300 ease-out ${
                      isActive
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0"
                    }`}
                  />

                  {/* Icon with Bounce Effect */}
                  <div
                    className={`transition-transform duration-300 ease-out ${
                      isActive ? "-translate-y-1.5" : "translate-y-0.5"
                    }`}
                  >
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>

                  {/* Label with Slide Up Effect */}
                  <div
                    className={`absolute bottom-1.5 overflow-hidden transition-all duration-300 ease-out ${
                      isActive
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-2 scale-75"
                    }`}
                  >
                    <span className="text-[10px] font-bold tracking-tight">
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
