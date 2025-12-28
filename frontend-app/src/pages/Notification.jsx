// src/pages/Notification.jsx

import React, { useState } from "react";
import {
  ChevronLeft,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Gift,
  Trash2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { useApp } from "../context/AppContext";

// --- MOCK DATA ---
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "success",
    title: "Poin Masuk!",
    message: "Anda mendapatkan +150 poin dari setoran botol di RVM-LOBBY-01.",
    date: "Baru saja",
    isRead: false,
  },
  {
    id: 2,
    type: "promo",
    title: "Promo Spesial Weekend",
    message:
      "Tukar poin ke GoPay diskon 50% hanya hari ini! Buruan cek menu tukar.",
    date: "2 jam lalu",
    isRead: false,
  },
  {
    id: 3,
    type: "security",
    title: "Login Terdeteksi",
    message: "Akun Anda login di perangkat baru (iPhone 13).",
    date: "Kemarin",
    isRead: true,
  },
  {
    id: 4,
    type: "info",
    title: "Maintenance Server",
    message: "Sistem akan maintenance pada tgl 25 Des pukul 00:00 - 02:00 WIB.",
    date: "2 hari lalu",
    isRead: true,
  },
  {
    id: 5,
    type: "system",
    title: "Selamat Datang!",
    message:
      "Terima kasih telah bergabung di DaurCuan. Mulai langkah hijaumu sekarang.",
    date: "1 minggu lalu",
    isRead: true,
  },
];

// --- HELPER: ICON & COLOR GENERATOR ---
const getNotificationStyle = (type) => {
  switch (type) {
    case "success":
      return {
        icon: CheckCircle2,
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        color: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
      };
    case "promo":
      return {
        icon: Gift,
        bg: "bg-purple-100 dark:bg-purple-900/30",
        color: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
      };
    case "security":
      return {
        icon: ShieldAlert,
        bg: "bg-red-100 dark:bg-red-900/30",
        color: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
      };
    case "info":
      return {
        icon: Info,
        bg: "bg-blue-100 dark:bg-blue-900/30",
        color: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
      };
    default:
      return {
        icon: Bell,
        bg: "bg-slate-100 dark:bg-slate-800",
        color: "text-slate-600 dark:text-slate-400",
        border: "border-slate-200 dark:border-slate-700",
      };
  }
};

// --- UTILS ---
const triggerHaptic = () => {
  if (typeof window !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(10);
    } catch (e) {
      // Ignore
    }
  }
};

// --- COMPONENT: NOTIFICATION ITEM ---
const NotificationItem = ({ item, onClick, index }) => {
  const style = getNotificationStyle(item.type);
  const Icon = style.icon;

  return (
    <button
      onClick={() => onClick(item.id)}
      className={`
        w-full text-left p-4 mb-3 rounded-[1.25rem] border transition-all duration-300 relative overflow-hidden group active:scale-[0.98] animate-fade-in-up
        ${
          item.isRead
            ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 opacity-70 hover:opacity-100"
            : `bg-white dark:bg-slate-800 ${style.border} shadow-sm ring-1 ring-inset ring-slate-900/5 dark:ring-white/5`
        }
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Indicator Unread (Dot) */}
      {!item.isRead && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
      )}

      <div className="flex gap-4 items-start">
        {/* Icon Box */}
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${style.bg} ${style.color}`}
        >
          <Icon size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 pr-4">
          <h4
            className={`text-sm font-bold mb-1 line-clamp-1 ${
              item.isRead
                ? "text-slate-600 dark:text-slate-300"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {item.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">
            {item.message}
          </p>
          <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
            <Clock size={10} />
            <span>{item.date}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

// --- MAIN COMPONENT ---
const Notification = () => {
  const { actions } = useApp();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Mark as read
  const handleRead = (id) => {
    const notif = notifications.find((n) => n.id === id);
    if (notif && !notif.isRead) {
      triggerHaptic();
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  // Clear All
  const handleClearAll = () => {
    if (notifications.length === 0) return;
    if (window.confirm("Hapus semua notifikasi?")) {
      triggerHaptic();
      setNotifications([]);
      if (actions.showToast)
        actions.showToast("Notifikasi dibersihkan", "success");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pb-safe-b">
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed top-[-10%] right-[-20%] w-[300px] h-[300px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse-slow z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse-slow z-0"></div>

      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 pt-safe-t px-6 pb-4 mb-4 transition-all">
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => actions.setActiveTab("profile")}
              className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-90"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                Notifikasi
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {unreadCount > 0
                  ? `${unreadCount} Pesan baru`
                  : "Semua pesan terbaca"}
              </p>
            </div>
          </div>

          <button
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className={`
              p-2.5 rounded-full transition-all active:scale-90
              ${
                notifications.length > 0
                  ? "bg-white dark:bg-slate-800 text-red-500 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
              }
            `}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="relative z-10 px-6 pb-20 w-full max-w-md mx-auto">
        {/* --- CONTENT --- */}
        <div className="space-y-1">
          {notifications.length > 0 ? (
            notifications.map((item, idx) => (
              <NotificationItem
                key={item.id}
                item={item}
                index={idx}
                onClick={handleRead}
              />
            ))
          ) : (
            // EMPTY STATE
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 relative">
                <Bell
                  size={32}
                  className="text-slate-300 dark:text-slate-600"
                />
                <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                Belum ada notifikasi
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 max-w-[200px] leading-relaxed">
                Tenang, kami akan memberi tahu jika ada kabar terbaru untukmu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
