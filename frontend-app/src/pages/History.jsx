// src/pages/History.jsx

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Wallet,
  Smartphone,
  Gift,
  Heart,
  Copy,
  Check,
  Receipt,
  Filter,
} from "lucide-react";
import { useApp } from "../context/AppContext";

// --- HELPER: Kategori Icon ---
const getProviderIcon = (category) => {
  switch (category) {
    case "E-Wallet":
      return Wallet;
    case "Pulsa":
      return Smartphone;
    case "Donasi":
      return Heart;
    default:
      return Gift;
  }
};

// --- HELPER: Status Style ---
const getStatusStyle = (status) => {
  switch (status) {
    case "success":
      return {
        bg: "bg-emerald-100 dark:bg-emerald-500/20",
        text: "text-emerald-600 dark:text-emerald-400",
        icon: CheckCircle2,
        label: "Berhasil",
      };
    case "process":
      return {
        bg: "bg-amber-100 dark:bg-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        icon: Clock,
        label: "Diproses",
      };
    case "failed":
      return {
        bg: "bg-red-100 dark:bg-red-500/20",
        text: "text-red-600 dark:text-red-400",
        icon: XCircle,
        label: "Gagal",
      };
    default:
      return {
        bg: "bg-slate-100",
        text: "text-slate-600",
        icon: Clock,
        label: "Unknown",
      };
  }
};

// --- HELPER: Format Grouping Tanggal ---
const formatDateGroup = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Riwayat";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hari Ini";
  if (date.toDateString() === yesterday.toDateString()) return "Kemarin";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const History = () => {
  const { state, actions } = useApp();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Ambil data transaksi dari User State
  const rawTransactions = state.user?.transactions || [];

  // --- LOGIC: Filter, Search & Grouping ---
  const groupedHistory = useMemo(() => {
    let data = [...rawTransactions];

    // 1. Sort: Terbaru di atas
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 2. Filter Status
    if (filter !== "all") {
      data = data.filter((item) => item.status === filter);
    }

    // 3. Search
    if (search) {
      const lower = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(lower) ||
          item.id.toLowerCase().includes(lower) ||
          item.category?.toLowerCase().includes(lower)
      );
    }

    // 4. Grouping by Date
    const groups = {};
    data.forEach((item) => {
      const groupName = formatDateGroup(item.date);
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(item);
    });

    return groups;
  }, [rawTransactions, filter, search]);

  const handleCopy = (id) => {
    // Fallback copy logic
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pt-safe-t pb-safe-b">
      {/* Background Ambient */}
      <div className="fixed top-0 right-0 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col">
        {/* --- HEADER (Sticky) --- */}
        <div className="sticky top-0 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => actions.setActiveTab("exchange")}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  Riwayat Transaksi
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aktivitas penukaran poin Anda
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative group mb-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Cari ID, Provider, atau Kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-white placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: "all", label: "Semua" },
                { id: "success", label: "Berhasil" },
                { id: "process", label: "Proses" },
                { id: "failed", label: "Gagal" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                    filter === f.id
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                      : "bg-white text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- CONTENT LIST --- */}
        <div className="flex-1 px-6 py-4 space-y-6 pb-24">
          {Object.keys(groupedHistory).length > 0 ? (
            Object.entries(groupedHistory).map(([date, items], groupIndex) => (
              <div
                key={date}
                className="animate-fade-in-up"
                style={{ animationDelay: `${groupIndex * 100}ms` }}
              >
                {/* Date Header */}
                <div className="flex items-center gap-2 mb-3 px-1 opacity-70">
                  <Calendar
                    size={12}
                    className="text-slate-500 dark:text-slate-400"
                  />
                  <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {date}
                  </h3>
                </div>

                {/* Cards Container */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const statusStyle = getStatusStyle(item.status);
                    const ProviderIcon = getProviderIcon(item.category);
                    const isCopied = copiedId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {/* Top Part: Icon & Title */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300">
                              <ProviderIcon size={18} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {item.category || "Umum"}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-lg text-[9px] font-bold border border-current/10 flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            <statusStyle.icon size={10} />
                            {statusStyle.label}
                          </div>
                        </div>

                        {/* Divider Line */}
                        <div className="border-t border-dashed border-slate-100 dark:border-slate-700 my-3"></div>

                        {/* Bottom Part: ID & Amount */}
                        <div className="flex items-end justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium ml-0.5">
                              ID Transaksi
                            </span>
                            <button
                              onClick={() => handleCopy(item.id)}
                              className="group flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-slate-50 dark:bg-slate-700/30 px-2 py-1 rounded-lg w-fit active:scale-95"
                            >
                              {item.id}
                              {isCopied ? (
                                <Check size={10} className="text-emerald-500" />
                              ) : (
                                <Copy
                                  size={10}
                                  className="opacity-40 group-hover:opacity-100 transition-opacity"
                                />
                              )}
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 mb-0.5 font-medium">
                              Total Penukaran
                            </span>
                            <span className="text-sm font-bold text-red-500 flex items-center justify-end gap-0.5">
                              -{item.amount.toLocaleString()}
                              <span className="text-[10px] opacity-70 font-medium">
                                pts
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 opacity-60 animate-fade-in">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Receipt size={32} className="text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Tidak ada riwayat
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px] text-center">
                Belum ada transaksi yang sesuai dengan filter pencarian Anda.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Inline Styles untuk animasi */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default History;
