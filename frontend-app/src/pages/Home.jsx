// src/pages/Home.jsx

import React, { useMemo, memo } from "react";
import {
  Leaf,
  Wind,
  Smartphone,
  Wallet,
  Gift,
  Heart,
  History,
  ArrowUpRight,
  Sparkles,
  Zap,
  TrendingUp,
  CreditCard,
  ChevronRight,
  Loader2,
  Scan,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { APP_CONFIG } from "../config/constants";

// ==========================================
// 1. UTILS & CONSTANTS
// ==========================================

const formatters = {
  number: new Intl.NumberFormat("id-ID"),
  // FIX: Menggunakan DateTimeFormat, bukan NumberFormat
  date: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }),
};

const formatNumber = (num) => formatters.number.format(num || 0);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
};

// Safe haptic trigger
const triggerHaptic = () => {
  if (typeof window !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(10);
    } catch (e) {
      // Ignore errors on unsupported devices
    }
  }
};

const MENU_SHORTCUTS = [
  {
    id: "pulsa",
    name: "Pulsa",
    icon: Smartphone,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    id: "ewallet",
    name: "E-Wallet",
    icon: Wallet,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
  },
  {
    id: "voucher",
    name: "Voucher",
    icon: Gift,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-500/10",
  },
  {
    id: "donasi",
    name: "Donasi",
    icon: Heart,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/10",
  },
];

// ==========================================
// 2. SUB-COMPONENTS (Pure UI)
// ==========================================

const WalletCard = memo(({ points }) => (
  <div className="relative w-full aspect-[1.65/1] rounded-[2.5rem] p-7 mb-8 overflow-hidden shadow-2xl shadow-emerald-900/20 dark:shadow-black/40 group transition-all duration-300 hover:shadow-emerald-800/30 ring-1 ring-white/10 dark:ring-white/5 transform will-change-transform">
    {/* Background Effects */}
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 z-0"></div>
    {/* Noise Texture */}
    <div className="absolute inset-0 opacity-20 mix-blend-overlay z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

    {/* Animated Blobs */}
    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/40 rounded-full blur-[80px] mix-blend-overlay animate-pulse-slow"></div>
    <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-teal-300/30 rounded-full blur-[60px] mix-blend-overlay"></div>

    {/* Card Content */}
    <div className="relative z-20 flex flex-col justify-between h-full text-white">
      <div className="flex justify-between items-start">
        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full shadow-inner">
          <Sparkles size={10} className="text-yellow-300 fill-yellow-300" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-50">
            Platinum Member
          </span>
        </div>
        {/* Chip Sim */}
        <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-amber-200 via-yellow-400 to-yellow-600 shadow-lg border border-yellow-300/50 relative overflow-hidden opacity-90">
          <div className="absolute inset-0 bg-white opacity-10"></div>
          <div className="absolute top-1/2 w-full h-[1px] bg-black/20"></div>
          <div className="absolute left-1/3 h-full w-[1px] bg-black/20"></div>
          <div className="absolute right-1/3 h-full w-[1px] bg-black/20"></div>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-emerald-100/70 text-[11px] font-medium tracking-wider uppercase mb-1">
          Total Poin DaurCuan
        </p>
        <h2 className="text-[42px] font-black tracking-tighter drop-shadow-sm leading-none tabular-nums">
          {formatNumber(points)}
        </h2>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-[8px] text-emerald-200/60 font-bold uppercase tracking-widest mb-0.5">
            Valid Thru
          </p>
          <p className="font-mono text-sm text-white/90 font-medium tracking-widest">
            12/28
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-80 mix-blend-screen">
          <CreditCard size={16} />
          <span className="text-xs font-bold italic tracking-wider">
            DC World
          </span>
        </div>
      </div>
    </div>
  </div>
));

const StatCard = memo(({ icon: Icon, title, value, unit, colorClass }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col items-start gap-3 relative overflow-hidden group hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-colors">
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-500">
      <Icon size={60} />
    </div>
    <div className={`p-2.5 rounded-2xl ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider mb-0.5">
        {title}
      </p>
      <div className="flex items-baseline gap-1">
        <p className="text-xl font-black text-slate-800 dark:text-white tabular-nums">
          {value}
        </p>
        <span className="text-xs font-bold text-slate-400">{unit}</span>
      </div>
    </div>
  </div>
));

const StatsGrid = memo(({ co2, land }) => (
  <div className="grid grid-cols-2 gap-4 mb-8">
    <StatCard
      icon={Leaf}
      title="Lahan Selamat"
      value={land}
      unit="m²"
      colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
    />
    <StatCard
      icon={Wind}
      title="Jejak Karbon"
      value={co2}
      unit="kg"
      colorClass="bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
    />
  </div>
));

const ShortcutsGrid = memo(({ onAction }) => (
  <div className="grid grid-cols-4 gap-4">
    {MENU_SHORTCUTS.map((item) => (
      <button
        key={item.id}
        onClick={() => {
          triggerHaptic();
          onAction();
        }}
        className="group flex flex-col items-center gap-2.5 active:scale-95 transition-all duration-200 outline-none focus:scale-95"
      >
        <div
          className={`w-[60px] h-[60px] rounded-[24px] flex items-center justify-center transition-all duration-300 shadow-sm border border-transparent ${item.bg} group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-slate-100 dark:group-hover:border-slate-700 relative overflow-hidden`}
        >
          <item.icon
            size={26}
            className={`${item.color} relative z-10`}
            strokeWidth={2}
          />
        </div>
        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {item.name}
        </span>
      </button>
    ))}
  </div>
));

const ActivityItem = memo(({ item }) => {
  const isEarn = (item?.type || "").toLowerCase() === "earn";
  const dateObj = new Date(item?.date || Date.now());
  const dateStr = formatters.date.format(dateObj); // Menggunakan formatter yang sudah diperbaiki

  return (
    <div className="group flex items-center justify-between p-4 mb-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm active:scale-[0.99] transition-all duration-200 hover:border-emerald-500/20">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0 ${
            isEarn
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
          }`}
        >
          {isEarn ? (
            <Zap size={18} className="fill-current" />
          ) : (
            <ArrowUpRight size={18} />
          )}
        </div>
        <div className="overflow-hidden">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-0.5 truncate pr-2 line-clamp-1">
            {item?.title || "Transaksi"}
          </h4>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {dateStr}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <span
          className={`font-bold text-sm block tracking-tight ${
            isEarn
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-800 dark:text-slate-200"
          }`}
        >
          {isEarn ? "+" : "-"} {formatNumber(item?.amount)}
        </span>
        <span className="text-[10px] font-semibold text-slate-400/80 uppercase tracking-wide">
          POIN
        </span>
      </div>
    </div>
  );
});

// ==========================================
// 3. CUSTOM HOOK
// ==========================================

const useHomeLogic = () => {
  const { state, actions } = useApp();
  const { wallet = {}, user } = state || {};

  const CO2_FACTOR = APP_CONFIG?.GAME_LOGIC?.CO2_PER_BOTTLE_KG || 0.05;
  const LAND_FACTOR = APP_CONFIG?.GAME_LOGIC?.LAND_SAVED_PER_BOTTLE_M2 || 0.002;

  const stats = useMemo(
    () => ({
      co2: ((wallet.bottles || 0) * CO2_FACTOR).toFixed(1),
      land: ((wallet.bottles || 0) * LAND_FACTOR).toFixed(3),
    }),
    [wallet.bottles, CO2_FACTOR, LAND_FACTOR]
  );

  const recentActivity = useMemo(() => {
    if (!wallet.history?.length) return [];
    return [...wallet.history]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [wallet.history]);

  const handlers = useMemo(
    () => ({
      onProfile: () => {
        triggerHaptic();
        actions.setActiveTab("profile");
      },
      onScan: () => {
        triggerHaptic();
        actions.setActiveTab("scan");
      },
      onExchange: () => {
        triggerHaptic();
        actions.setActiveTab("exchange");
      },
    }),
    [actions]
  );

  return {
    isLoading: !user,
    user: user || {}, // Fallback object
    wallet,
    stats,
    recentActivity,
    session: {
      isActive: state?.isSessionActive,
      points: state?.livePoints || 0,
    },
    handlers,
  };
};

// ==========================================
// 4. MAIN COMPONENT
// ==========================================

const Home = () => {
  const { isLoading, user, wallet, stats, recentActivity, session, handlers } =
    useHomeLogic();

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
          <Loader2
            className="animate-spin text-emerald-600 dark:text-emerald-500 relative z-10"
            size={40}
          />
        </div>
        <p className="text-slate-400 text-xs font-semibold mt-4 tracking-widest uppercase animate-pulse">
          Memuat Aplikasi...
        </p>
      </div>
    );
  }

  // Gunakan optional chaining untuk menghindari error jika nama user null
  const firstName = user.name ? user.name.split(" ")[0] : "User";
  const initial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pt-safe-t pb-24 overflow-x-hidden selection:bg-emerald-500/30">
      {/* Decorative Background */}
      <div className="fixed top-[-150px] left-[-100px] w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none dark:opacity-20 z-0 will-change-transform"></div>
      <div className="fixed top-[20%] right-[-150px] w-[300px] h-[300px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none dark:opacity-10 z-0 will-change-transform"></div>

      <div className="relative z-10 max-w-md mx-auto px-6 mt-4">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8 animate-fade-in-up">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1.5 opacity-90">
              {getGreeting()}
            </p>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none flex items-center gap-2">
              {firstName}
              <span className="animate-wave origin-bottom-right inline-block text-2xl">
                👋
              </span>
            </h1>
          </div>
          <button
            onClick={handlers.onProfile}
            aria-label="Profil Pengguna"
            className="relative p-1 rounded-full border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 shadow-sm active:scale-95 transition-all group"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={firstName}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 group-hover:ring-emerald-500/50 transition-all"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg ring-2 ring-white dark:ring-slate-800">
                {initial}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
          </button>
        </header>

        {/* Live Session Alert */}
        {session.isActive && (
          <div
            onClick={handlers.onScan}
            className="mb-8 cursor-pointer group animate-scale-in"
          >
            <div className="relative p-[1px] rounded-[24px] bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-emerald-900 dark:to-emerald-950 shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="bg-slate-900/95 backdrop-blur-sm rounded-[23px] p-4 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Scan className="animate-pulse text-white" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      <p className="font-bold text-white text-sm tracking-wide">
                        Sesi Aktif
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium group-hover:text-emerald-400 transition-colors">
                      Ketuk untuk lanjut scan
                    </p>
                  </div>
                </div>
                <div className="text-right pr-2">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase mb-0.5">
                    Potensi
                  </p>
                  <p className="text-2xl font-black text-white leading-none">
                    +{formatNumber(session.points)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Stats Area */}
        <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <WalletCard points={wallet.points} />
          <StatsGrid co2={stats.co2} land={stats.land} />
        </div>

        {/* Shortcuts / Menu */}
        <section
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex justify-between items-end mb-5 px-1">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
              Tukar Poin
            </h3>
            <button
              onClick={handlers.onExchange}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-xl transition-colors active:scale-95"
            >
              Semua <ChevronRight size={14} />
            </button>
          </div>
          <ShortcutsGrid onAction={handlers.onExchange} />
        </section>

        {/* Recent Transactions */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex justify-between items-center mb-5 px-1">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp
                size={16}
                className="text-emerald-500"
                strokeWidth={2.5}
              />{" "}
              Aktivitas
            </h3>
            <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Lengkap
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {recentActivity.length === 0 ? (
              <EmptyState />
            ) : (
              recentActivity.map((item, idx) => (
                <ActivityItem key={item.id || idx} item={item} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

// Component kecil untuk state kosong (Empty State)
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700/80">
    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-3 shadow-inner">
      <History size={24} className="text-slate-400" />
    </div>
    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
      Belum ada transaksi
    </p>
    <p className="text-[10px] text-slate-400 mt-1">
      Mulai daur ulang sekarang!
    </p>
  </div>
);

export default Home;
