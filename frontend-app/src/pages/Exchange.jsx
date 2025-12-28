// src/pages/Exchange.jsx

import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  Wallet,
  Smartphone,
  Gift,
  Heart,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  X,
  AlertCircle,
  History,
  Search,
  Tag,
  Zap,
} from "lucide-react";
import { useApp } from "../context/AppContext";

// --- CONFIGURATION ---
const PROVIDER_THEMES = {
  blue: "from-blue-500 to-indigo-600",
  sky: "from-sky-500 to-blue-600",
  purple: "from-purple-500 to-violet-600",
  red: "from-red-500 to-rose-600",
  orange: "from-orange-500 to-red-500",
  pink: "from-pink-500 to-rose-500",
  teal: "from-teal-500 to-emerald-600",
  indigo: "from-indigo-500 to-blue-700",
};

const PROVIDERS = [
  {
    id: "gopay",
    name: "GoPay",
    category: "E-Wallet",
    icon: Wallet,
    color: PROVIDER_THEMES.sky,
    shadow: "shadow-sky-500/30",
    denominations: [10000, 20000, 50000, 100000],
  },
  {
    id: "ovo",
    name: "OVO",
    category: "E-Wallet",
    icon: Wallet,
    color: PROVIDER_THEMES.purple,
    shadow: "shadow-purple-500/30",
    denominations: [10000, 25000, 50000, 100000],
  },
  {
    id: "dana",
    name: "DANA",
    category: "E-Wallet",
    icon: Wallet,
    color: PROVIDER_THEMES.blue,
    shadow: "shadow-blue-500/30",
    denominations: [10000, 20000, 50000],
  },
  {
    id: "shopee",
    name: "ShopeePay",
    category: "E-Wallet",
    icon: Wallet,
    color: PROVIDER_THEMES.orange,
    shadow: "shadow-orange-500/30",
    denominations: [10000, 50000],
  },
  {
    id: "tsel",
    name: "Telkomsel",
    category: "Pulsa",
    icon: Smartphone,
    color: PROVIDER_THEMES.red,
    shadow: "shadow-red-600/30",
    denominations: [5000, 10000, 25000, 50000],
  },
  {
    id: "xl",
    name: "XL Axiata",
    category: "Pulsa",
    icon: Smartphone,
    color: PROVIDER_THEMES.indigo,
    shadow: "shadow-indigo-500/30",
    denominations: [5000, 10000, 25000],
  },
  {
    id: "alfamart",
    name: "Alfamart",
    category: "Voucher",
    icon: Gift,
    color: PROVIDER_THEMES.red,
    shadow: "shadow-red-500/30",
    denominations: [10000, 25000, 50000],
  },
  {
    id: "indomaret",
    name: "Indomaret",
    category: "Voucher",
    icon: Gift,
    color: PROVIDER_THEMES.blue,
    shadow: "shadow-blue-500/30",
    denominations: [10000, 25000, 50000],
  },
  {
    id: "kitabisa",
    name: "KitaBisa",
    category: "Donasi",
    icon: Heart,
    color: PROVIDER_THEMES.pink,
    shadow: "shadow-pink-500/30",
    denominations: [5000, 10000, 20000, 50000],
  },
];

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

const formatNumber = (num) => new Intl.NumberFormat("id-ID").format(num || 0);

// --- COMPONENT: SKELETON LOADER ---
const ExchangeSkeleton = () => (
  <div className="p-6 pt-safe-t space-y-6 animate-pulse min-h-screen bg-slate-50 dark:bg-slate-900">
    <div className="flex justify-between items-center mb-4">
      <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
    </div>
    <div className="h-44 w-full bg-slate-200 dark:bg-slate-800 rounded-[2rem]"></div>
    <div className="flex gap-3 overflow-hidden">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-9 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"
        ></div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-32 bg-slate-200 dark:bg-slate-800 rounded-[1.5rem]"
        ></div>
      ))}
    </div>
  </div>
);

// --- COMPONENT: TOAST NOTIFICATION ---
const Toast = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] w-full max-w-xs px-4 animate-fade-in-up pointer-events-none">
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md ${
          type === "error"
            ? "bg-rose-50/95 border-rose-200 text-rose-800 dark:bg-rose-900/90 dark:border-rose-800 dark:text-rose-100"
            : "bg-emerald-50/95 border-emerald-200 text-emerald-800 dark:bg-emerald-900/90 dark:border-emerald-800 dark:text-emerald-100"
        }`}
      >
        <AlertCircle size={20} />
        <span className="text-sm font-bold">{message}</span>
      </div>
    </div>
  );
};

// --- COMPONENT: REDEEM BOTTOM SHEET ---
const RedeemModal = ({
  provider,
  currentPoints,
  onClose,
  onConfirm,
  onError,
}) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    if (!selectedAmount) return;
    if (currentPoints < selectedAmount) {
      onError("Saldo poin tidak mencukupi!");
      return;
    }
    triggerHaptic();
    setLoading(true);
    try {
      const result = await onConfirm(selectedAmount);
      if (!result) {
        setLoading(false);
        onError("Gagal menukar poin.");
      }
    } catch (err) {
      setLoading(false);
      onError("Terjadi kesalahan sistem.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white dark:bg-slate-950 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col animate-slide-up sm:animate-scale-in overflow-hidden border border-white/10 relative z-10 max-h-[85vh]">
        {/* Header Gradient */}
        <div
          className={`relative bg-gradient-to-br ${provider.color} p-6 pb-10`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>

          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                <provider.icon className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">
                  Redeem
                </p>
                <h2 className="text-2xl font-bold text-white tracking-tight leading-none">
                  {provider.name}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors backdrop-blur-md"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 -mt-6 rounded-t-[2.5rem] relative z-20">
          <div className="flex justify-between items-center mb-5 px-1">
            <h3 className="text-slate-800 dark:text-white font-bold text-sm uppercase tracking-wider">
              Pilih Nominal
            </h3>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2.5 py-1 rounded-full tabular-nums border border-slate-300 dark:border-slate-700">
              Saldo: {formatNumber(currentPoints)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {provider.denominations.map((amount) => {
              const isSelected = selectedAmount === amount;
              const isAffordable = currentPoints >= amount;

              return (
                <button
                  key={amount}
                  onClick={() => {
                    if (isAffordable) {
                      triggerHaptic();
                      setSelectedAmount(amount);
                    }
                  }}
                  disabled={!isAffordable}
                  className={`
                    relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-1 overflow-hidden
                    ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    }
                    ${
                      !isAffordable
                        ? "opacity-40 grayscale cursor-not-allowed border-dashed"
                        : "hover:border-emerald-300 dark:hover:border-emerald-700 active:scale-[0.98]"
                    }
                  `}
                >
                  <span
                    className={`text-lg font-black tabular-nums ${
                      isSelected
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {amount / 1000}k
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                    {formatNumber(amount)} Poin
                  </span>

                  {isSelected && (
                    <div className="absolute top-2 right-2 text-emerald-500 animate-scale-in">
                      <CheckCircle2
                        size={16}
                        fill="currentColor"
                        className="text-white"
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleRedeem}
            disabled={!selectedAmount || loading}
            className="w-full py-4 rounded-2xl font-bold text-white bg-slate-900 dark:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 dark:shadow-emerald-900/30 active:scale-[0.98] transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Tukar Sekarang"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: SUCCESS RECEIPT ---
const SuccessReceipt = ({ provider, amount, onClose }) => (
  <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-fade-in">
    <div
      className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
      onClick={onClose}
    />
    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 relative overflow-hidden text-center shadow-2xl animate-bounce-in border border-white/10 z-[121]">
      {/* Confetti / Decor */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/10 animate-scale-in">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2 tracking-tight">
          Berhasil!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">
          Penukaran poin ke{" "}
          <span className="text-slate-900 dark:text-white font-bold">
            {provider.name}
          </span>{" "}
          sedang diproses.
        </p>

        {/* Ticket Detail */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-dashed border-slate-300 dark:border-slate-700 mb-8 relative">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-900 rounded-full"></div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-900 rounded-full"></div>

          <div className="flex justify-between text-sm mb-3">
            <span className="text-slate-500 font-medium">Nominal</span>
            <span className="font-bold text-slate-800 dark:text-white tabular-nums">
              Rp {formatNumber(amount)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Poin Terpakai</span>
            <span className="font-bold text-red-500 tabular-nums">
              -{formatNumber(amount)}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
        >
          Selesai
        </button>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const Exchange = () => {
  const { state, actions } = useApp();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [toast, setToast] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);

  // Data Safe Access
  const points = state?.wallet?.points ?? 0;
  const userName = state?.user?.name || "Member";

  // Simulate Page Load
  useEffect(() => {
    const timer = setTimeout(() => setLoadingInit(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter Logic
  const filteredProviders = useMemo(() => {
    let result = PROVIDERS;
    if (activeCategory !== "Semua")
      result = result.filter((p) => p.category === activeCategory);
    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  // Handle Redeem Logic
  const handleConfirmRedeem = async (amount) => {
    if (!selectedProvider) return false;
    try {
      let isSuccess = false;
      // Gunakan actions dari context jika ada, jika tidak simulasi sukses
      if (actions.redeemPoints) {
        isSuccess = await actions.redeemPoints(amount, selectedProvider.name);
      } else {
        await new Promise((r) => setTimeout(r, 1500)); // Simulasi network
        isSuccess = true;
      }

      if (isSuccess) {
        setSuccessData({ provider: selectedProvider, amount });
        setSelectedProvider(null);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  if (loadingInit) return <ExchangeSkeleton />;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pb-32 overflow-x-hidden">
      {/* --- STICKY HEADER WRAPPER --- */}
      {/* Menggabungkan Header, Search, dan Tabs dalam satu sticky container agar tidak ada gap saat scroll */}
      <div className="sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 pt-safe-t animate-fade-in shadow-sm">
        <div className="px-6 pb-2">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => actions.setActiveTab("home")}
                className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 active:scale-95 transition-transform shadow-sm"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Tukar Poin
                </h1>
              </div>
            </div>
            <button
              onClick={() => actions.setActiveTab("history")}
              className="p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-600 transition-colors active:scale-95 shadow-sm"
            >
              <History size={20} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-1 mb-2">
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Cari e-wallet, pulsa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:text-white placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="-mx-6 px-6 pt-2 pb-3 overflow-x-auto no-scrollbar mask-gradient">
            <div className="flex gap-2.5">
              {["Semua", "E-Wallet", "Pulsa", "Voucher", "Donasi"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      triggerHaptic();
                      setActiveCategory(cat);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shadow-sm active:scale-95 ${
                      activeCategory === cat
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white"
                        : "bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6 max-w-md mx-auto">
        {/* --- HERO CARD (Points Info) --- */}
        <div className="relative w-full aspect-[2/1] rounded-[2rem] p-6 overflow-hidden shadow-2xl shadow-emerald-900/10 dark:shadow-black/50 group transition-all duration-500 animate-scale-in">
          {/* Background Layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 dark:from-emerald-900 dark:via-slate-900 dark:to-black z-0"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0"></div>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/30 rounded-full blur-[60px] z-10 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/20 rounded-full blur-[50px] z-10"></div>

          {/* Content */}
          <div className="relative z-20 flex flex-col justify-between h-full text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5 mb-2 opacity-90">
                  <Sparkles
                    size={12}
                    className="text-yellow-300 fill-yellow-300"
                  />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-100">
                    Saldo Aktif
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-4xl font-black tracking-tighter tabular-nums drop-shadow-sm">
                    {formatNumber(points)}
                  </h2>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                <Zap className="text-yellow-300 fill-yellow-300" size={20} />
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 border border-white/20 flex items-center justify-center text-[10px] font-bold">
                  {userName.charAt(0)}
                </div>
                <span className="text-xs font-medium tracking-wide opacity-90">
                  {userName.split(" ")[0]}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-70">
                <span className="text-[10px] font-mono">DC-REWARDS</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- PROVIDER GRID --- */}
        <div className="min-h-[300px]">
          {filteredProviders.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredProviders.map((provider, idx) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    triggerHaptic();
                    setSelectedProvider(provider);
                  }}
                  className="group relative bg-white dark:bg-slate-900 rounded-[1.8rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden active:scale-[0.98] animate-fade-in-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Decorative Gradient Top */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${provider.color} opacity-80`}
                  ></div>

                  <div className="mb-4 mt-2 relative">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${provider.color} ${provider.shadow} flex items-center justify-center text-white mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}
                    >
                      <provider.icon size={22} />
                    </div>

                    {/* Arrow hint */}
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                      <ArrowRight
                        size={16}
                        className="text-slate-300 dark:text-slate-600"
                      />
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-white leading-tight text-sm mb-0.5">
                      {provider.name}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      {provider.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg w-fit group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors">
                    <Tag size={10} />
                    <span>{provider.denominations.length} Opsi</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 opacity-60">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Provider tidak ditemukan
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- OVERLAYS --- */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {selectedProvider && (
        <RedeemModal
          provider={selectedProvider}
          currentPoints={points}
          onClose={() => setSelectedProvider(null)}
          onConfirm={handleConfirmRedeem}
          onError={(msg) => setToast({ message: msg, type: "error" })}
        />
      )}

      {successData && (
        <SuccessReceipt
          provider={successData.provider}
          amount={successData.amount}
          onClose={() => setSuccessData(null)}
        />
      )}
    </div>
  );
};

export default Exchange;
