// src/pages/Bank.jsx

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Building2,
  Smartphone,
  User,
  Wifi,
  Loader2,
  AlertCircle,
  Save,
  CreditCard,
  CheckCircle2,
  Info,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";

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

// --- COMPONENT: TOAST NOTIFICATION ---
const Toast = ({ type, message }) => (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xs px-4 animate-fade-in-up pointer-events-none">
    <div
      className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border backdrop-blur-md ${
        type === "error"
          ? "bg-red-50/95 text-red-800 border-red-200 dark:bg-red-900/90 dark:border-red-800 dark:text-red-100"
          : "bg-emerald-50/95 text-emerald-800 border-emerald-200 dark:bg-emerald-900/90 dark:border-emerald-800 dark:text-emerald-100"
      }`}
    >
      {type === "error" ? (
        <AlertCircle size={20} />
      ) : (
        <CheckCircle2 size={20} />
      )}
      <span className="text-sm font-bold leading-tight">{message}</span>
    </div>
  </div>
);

// --- COMPONENT: INPUT FIELD ---
const InputGroup = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
          <Icon size={18} />
        </div>
      )}
      <input
        className={`
          w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 
          text-slate-900 dark:text-white rounded-xl py-3.5 
          ${Icon ? "pl-11 pr-4" : "px-4"} 
          focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
          transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 
          font-semibold text-sm tabular-nums
        `}
        {...props}
      />
    </div>
  </div>
);

// --- COMPONENT: PREMIUM CARD PREVIEW ---
const BankCardPreview = ({ bankName, number, holder }) => {
  // Format nomor kartu: 4 digit spasi 4 digit
  const formattedNumber =
    number
      ?.replace(/\D/g, "")
      .match(/.{1,4}/g)
      ?.join(" ") || number;

  return (
    <div className="relative w-full aspect-[1.586/1] rounded-[1.8rem] overflow-hidden shadow-2xl shadow-slate-300 dark:shadow-black/50 transition-all duration-500 hover:scale-[1.02] group select-none cursor-default">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-[#1a1a1a] z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-900 to-black opacity-90 z-0"></div>

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-20 z-0 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Glossy Effect */}
      <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none group-hover:translate-x-10 group-hover:translate-y-10 transition-transform duration-700"></div>

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
        {/* Top: Bank Name & Type */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5 mb-1 opacity-70">
              <ShieldCheck size={10} className="text-emerald-400" />
              <span className="text-[9px] uppercase tracking-widest font-bold">
                Secure Debit
              </span>
            </div>
            <h3 className="text-lg font-bold tracking-wider font-mono uppercase truncate max-w-[180px] text-emerald-50">
              {bankName || "BANK NAME"}
            </h3>
          </div>
          <div className="text-emerald-400 opacity-80">
            <CreditCard size={24} />
          </div>
        </div>

        {/* Middle: Chip & Number */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {/* Realistic Chip Graphic */}
            <div className="w-11 h-8 rounded-[6px] bg-gradient-to-b from-[#ffdb7c] to-[#d4af37] relative overflow-hidden shadow-sm border border-[#b8952b]">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20"></div>
              <div className="absolute left-1/2 top-0 w-[1px] h-full bg-black/20"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-black/20 rounded-[4px]"></div>
            </div>
            <Wifi size={20} className="rotate-90 text-slate-400" />
          </div>

          <p className="font-mono text-xl sm:text-2xl tracking-widest text-white drop-shadow-md tabular-nums truncate">
            {formattedNumber || "•••• •••• •••• ••••"}
          </p>
        </div>

        {/* Bottom: Holder & Brand */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Card Holder
            </p>
            <p className="font-medium tracking-widest uppercase text-sm truncate max-w-[200px] text-slate-100">
              {holder || "YOUR NAME"}
            </p>
          </div>
          <div className="flex items-center gap-1 opacity-80">
            <Sparkles size={12} className="text-emerald-400 fill-emerald-400" />
            <span className="font-bold italic text-sm">DaurCuan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const Bank = () => {
  const { state, actions } = useApp();

  // Lazy init form state from context
  const [form, setForm] = useState(
    () => state?.user?.bankAccount || { bankName: "", number: "", holder: "" }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync data from context only if user hasn't edited yet
  useEffect(() => {
    if (state.user?.bankAccount && !hasChanges) {
      const current = JSON.stringify(form);
      const incoming = JSON.stringify(state.user.bankAccount);
      // Update local form jika berbeda dengan data global
      if (current !== incoming && form.bankName === "") {
        setForm(state.user.bankAccount);
      }
    }
  }, [state.user, hasChanges, form]);

  const handleFormChange = (field, value) => {
    // Efek getar setiap input 4 digit (hanya untuk nomor)
    if (
      field === "number" &&
      value.length > 0 &&
      value.replace(/\s/g, "").length % 4 === 0
    ) {
      triggerHaptic();
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type === "success") {
      triggerHaptic();
      setHasChanges(false);
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    triggerHaptic();

    // Validation
    if (!form.bankName.trim())
      return showToast("Nama bank wajib diisi", "error");
    if (!form.number.trim())
      return showToast("Nomor rekening wajib diisi", "error");
    if (!form.holder.trim())
      return showToast("Nama pemilik wajib diisi", "error");

    setIsLoading(true);
    try {
      // Fake API Delay
      await new Promise((r) => setTimeout(r, 1000));

      if (actions.saveBankInfo) {
        await actions.saveBankInfo(form);
        showToast("Rekening berhasil disimpan!");
      } else {
        // Fallback jika actions belum siap
        showToast("Disimpan (Mode Demo)!");
      }
    } catch (error) {
      console.error(error);
      showToast("Gagal menyimpan data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pt-safe-t pb-10">
      {/* Header Sticky */}
      <div className="px-6 pt-6 mb-6 flex items-center gap-4 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md z-20 pb-4 border-b border-transparent transition-all">
        <button
          onClick={() => actions.setActiveTab("profile")}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 shadow-sm active:scale-90 transition-transform hover:shadow-md"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Rekening Saya
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Atur metode pencairan dana
          </p>
        </div>
      </div>

      <div className="px-6 max-w-md mx-auto space-y-8 pb-safe-b">
        {/* Card Preview Section */}
        <div className="animate-scale-in">
          <BankCardPreview {...form} />
          <div className="flex justify-center mt-4 opacity-70">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
              <Info size={12} /> Mode Pratinjau
            </span>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-6 animate-fade-in-up delay-100">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50 dark:border-slate-700/50">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide">
              Detail Rekening
            </h3>
          </div>

          <InputGroup
            label="Bank / E-Wallet"
            placeholder="Contoh: BCA, GoPay, OVO"
            value={form.bankName}
            onChange={(e) =>
              handleFormChange("bankName", e.target.value.toUpperCase())
            }
            disabled={isLoading}
            icon={Building2}
          />
          <InputGroup
            label="Nomor Rekening"
            placeholder="0812xxxx / 1234xxxx"
            type="tel"
            inputMode="numeric"
            value={form.number}
            onChange={(e) => handleFormChange("number", e.target.value)}
            disabled={isLoading}
            icon={Smartphone}
          />
          <InputGroup
            label="Nama Pemilik"
            placeholder="NAMA SESUAI AKUN"
            value={form.holder}
            onChange={(e) =>
              handleFormChange("holder", e.target.value.toUpperCase())
            }
            disabled={isLoading}
            icon={User}
          />
        </div>

        {/* Footer Action */}
        <div>
          {hasChanges && (
            <div className="mb-4 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl animate-fade-in">
              <AlertCircle
                size={18}
                className="text-amber-500 mt-0.5 shrink-0"
              />
              <p className="text-xs text-amber-700 dark:text-amber-500 font-medium leading-relaxed">
                Anda memiliki perubahan data yang belum disimpan. Pastikan data
                benar sebelum menyimpan.
              </p>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            className={`
                 w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-95
                 ${
                   isLoading || !hasChanges
                     ? "bg-slate-300 dark:bg-slate-700 text-slate-50 dark:text-slate-500 shadow-none cursor-not-allowed transform-none"
                     : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30 hover:shadow-emerald-500/50"
                 }
              `}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save size={20} /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
};

export default Bank;
