// src/App.jsx

import React, { useMemo } from "react";
import { AppProvider, useApp } from "./context/AppContext";

// --- PAGES ---
import Home from "./pages/Home";
import Locations from "./pages/Locations";
import Scan from "./pages/Scan";
import Achievement from "./pages/Achievement";
import Profile from "./pages/Profile";

// --- SUB-PAGES ---
import Exchange from "./pages/Exchange";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Bank from "./pages/Bank";
import Notification from "./pages/Notification";

// --- SHARED COMPONENTS ---
import Modal from "./components/shared/Modal";
import Toast from "./components/shared/Toast";
import BottomNav from "./components/shared/BottomNav";

// Daftar halaman yang menutupi Bottom Navigation
const FULL_SCREEN_PAGES = [
  "scan",
  "bank",
  "exchange",
  "history",
  "notification",
  "settings",
  "help",
];

const AppContent = () => {
  const { state } = useApp();

  // Cek apakah tab saat ini mode fullscreen
  const isFullScreen = useMemo(
    () => FULL_SCREEN_PAGES.includes(state.activeTab),
    [state.activeTab]
  );

  const renderPage = () => {
    switch (state.activeTab) {
      // Main Tabs
      case "home":
        return <Home />;
      case "locations":
        return <Locations />;
      case "scan":
        return <Scan />;
      case "achievement":
        return <Achievement />;
      case "profile":
        return <Profile />;

      // Sub-pages
      case "exchange":
        return <Exchange />;
      case "history":
        return <History />;
      case "bank":
        return <Bank />;
      case "notification":
        return <Notification />;
      case "settings":
        return <Settings />;

      default:
        return <Home />;
    }
  };

  return (
    // Main Wrapper: Mensimulasikan layar HP (max-w-md)
    // FIX: Added 'ease-in-out' agar transisi dark mode background body selaras dengan index.css
    <main className="w-full max-w-md mx-auto h-[100dvh] relative overflow-hidden flex flex-col font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 ease-in-out shadow-2xl ring-1 ring-slate-900/5">
      {/* 1. CONTENT AREA */}
      {/* custom-scrollbar dari index.css agar rapi di desktop */}
      <div className="flex-1 w-full relative overflow-y-auto custom-scrollbar scroll-smooth">
        {/* KEY PROP PENTING:
          Memaksa React me-mount ulang div ini saat tab berubah.
          Ini memicu animasi 'animate-fade-in' setiap ganti halaman.
        */}
        <div
          key={state.activeTab}
          className="min-h-full animate-fade-in pb-safe-b"
        >
          {renderPage()}

          {/* Spacer dinamis: Memberi ruang di bawah agar konten tidak tertutup nav */}
          {!isFullScreen && <div className="h-24" />}
        </div>
      </div>

      {/* 2. BOTTOM NAVIGATION */}
      {/* FIX: Added 'will-change-transform' untuk performa animasi slide yang lebih mulus di HP */}
      <div
        className={`absolute bottom-0 left-0 w-full z-40 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) will-change-transform ${
          isFullScreen ? "translate-y-[120%]" : "translate-y-0"
        }`}
      >
        <BottomNav />
      </div>

      {/* 3. GLOBAL OVERLAYS */}

      {/* Layer Modal (Tengah) */}
      <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
        <div className="pointer-events-auto w-full max-w-sm">
          <Modal />
        </div>
      </div>

      {/* Layer Toast (Notifikasi) */}
      {/* FIX: Posisi Toast Dinamis.
         Jika FullScreen (Nav hilang) -> Toast turun ke 'bottom-6'.
         Jika Nav ada -> Toast naik ke 'bottom-24' agar tidak tertutup Nav.
      */}
      <div
        className={`absolute left-0 w-full z-[60] pointer-events-none flex justify-center px-4 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isFullScreen ? "bottom-6" : "bottom-24"
        }`}
      >
        <div className="pointer-events-auto">
          <Toast />
        </div>
      </div>
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
