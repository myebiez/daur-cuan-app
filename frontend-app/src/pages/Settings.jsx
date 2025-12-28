import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ArrowLeft,
  Bell,
  Moon,
  Globe,
  Shield,
  ChevronRight,
  LogOut,
  Smartphone,
  HelpCircle,
  FileText,
  RotateCcw,
  Loader2,
  X,
  Mail,
  Copy,
  Lock,
  CheckCircle2,
} from "lucide-react";

// --- HELPER: Haptic ---
const triggerHaptic = () => {
  if (navigator.vibrate) navigator.vibrate(10);
};

// --- COMPONENT: CARD WRAPPER ---
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

// --- COMPONENT: TOGGLE SWITCH ---
const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      triggerHaptic();
      onChange(!enabled);
    }}
    className={`w-11 h-6 rounded-full p-1 transition-all duration-300 focus:outline-none flex items-center ${
      enabled
        ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
        : "bg-slate-200 dark:bg-slate-600"
    }`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
        enabled ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

// --- COMPONENT: SETTING ITEM ---
const SettingItem = ({
  icon: Icon,
  label,
  value,
  type = "arrow",
  onClick,
  isToggled,
  onToggle,
  variant = "default",
  delay = 0,
}) => (
  <div
    onClick={type === "toggle" ? () => onToggle(!isToggled) : onClick}
    style={{ animationDelay: `${delay}ms` }}
    className={`
      flex items-center justify-between p-4 transition-all duration-200 animate-slide-in opacity-0
      ${
        type !== "toggle" && onClick
          ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 active:bg-slate-100 dark:active:bg-slate-700/50"
          : ""
      }
    `}
  >
    <div className="flex items-center gap-4">
      <div
        className={`p-2.5 rounded-xl transition-colors ${
          variant === "danger"
            ? "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400"
            : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
        }`}
      >
        <Icon size={18} />
      </div>
      <div>
        <p
          className={`font-semibold text-sm ${
            variant === "danger"
              ? "text-red-600 dark:text-red-400"
              : "text-slate-700 dark:text-white"
          }`}
        >
          {label}
        </p>
        {value && type !== "value" && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
            {value}
          </p>
        )}
      </div>
    </div>

    <div>
      {type === "toggle" ? (
        <Toggle enabled={isToggled} onChange={onToggle} />
      ) : type === "value" ? (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
          {value}
        </span>
      ) : (
        <ChevronRight
          size={16}
          className="text-slate-300 dark:text-slate-600"
        />
      )}
    </div>
  </div>
);

// --- COMPONENT: SECTION HEADER ---
const SectionHeader = ({ title }) => (
  <h3 className="px-4 mb-2 mt-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 animate-fade-in">
    {title}
  </h3>
);

// --- COMPONENT: INFO MODAL (Help & Terms) ---
const InfoModal = ({ isOpen, onClose, title, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-6 relative animate-bounce-in shadow-2xl border border-white/10 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
          {type === "help" ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-2 font-medium">
                Butuh bantuan dengan akunmu?
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Silakan hubungi tim support kami melalui email di bawah ini.
              </p>

              <div
                className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3 group active:scale-[0.98] transition-transform cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText("admin@daurcuan.id");
                  triggerHaptic();
                }}
              >
                <span className="font-mono font-bold text-slate-800 dark:text-white select-all">
                  admin@daurcuan.id
                </span>
                <Copy
                  size={16}
                  className="text-slate-400 group-hover:text-emerald-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>1. Pendahuluan</strong>
                <br />
                Selamat datang di aplikasi DaurCuan. Dengan menggunakan aplikasi
                ini, Anda menyetujui syarat dan ketentuan yang berlaku.
              </p>
              <p>
                <strong>2. Pengumpulan Data</strong>
                <br />
                Kami mengumpulkan data lokasi dan penggunaan RVM untuk
                meningkatkan layanan daur ulang.
              </p>
              <p>
                <strong>3. Poin & Rewards</strong>
                <br />
                Poin yang didapatkan tidak dapat diuangkan secara langsung,
                namun dapat ditukarkan dengan voucher mitra kami.
              </p>
              <p>
                <strong>4. Penyalahgunaan</strong>
                <br />
                Segala bentuk kecurangan dalam scan QR code atau manipulasi
                mesin RVM akan mengakibatkan pemblokiran akun permanen.
              </p>
              <p className="text-xs text-slate-400 mt-4 italic">
                Terakhir diperbarui: 20 Desember 2025
              </p>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: SECURITY MODAL ---
const SecurityModal = ({ isOpen, onClose, actions }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form"); // form | success

  if (!isOpen) return null;

  const handleSave = async () => {
    triggerHaptic();
    setLoading(true);
    // Simulasi API
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("success");
    actions.showToast("Kata sandi berhasil diubah", "success");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-6 relative animate-bounce-in shadow-2xl border border-white/10">
        {step === "form" ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Ganti Password
              </h3>
              <button
                onClick={onClose}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Password Lama
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="password"
                    placeholder="••••••"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Password Baru
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="password"
                    placeholder="••••••"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Berhasil!
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Password akun Anda telah diperbarui. Silakan login kembali jika
              diperlukan.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENT: LOGOUT MODAL ---
const LogoutModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={!isLoading ? onClose : null}
      ></div>
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2rem] p-6 animate-slide-up relative z-10 border-t border-white/10">
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Keluar dari Akun?
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm px-8">
            Anda harus login kembali untuk mengakses poin dan fitur lainnya.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => {
              triggerHaptic();
              onConfirm();
            }}
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Keluar...
              </>
            ) : (
              "Ya, Keluar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Settings = () => {
  const { state, actions } = useApp();

  // State Lokal
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);

  // State Modals
  const [modalType, setModalType] = useState(null); // 'logout', 'help', 'terms', 'security'
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // --- LOGIC HANDLERS ---
  const handleTogglePush = (newVal) => {
    setPushNotif(newVal);
    actions.showToast(
      newVal ? "Push Notifikasi Diaktifkan" : "Push Notifikasi Dinonaktifkan",
      "info"
    );
  };

  const handleToggleEmail = (newVal) => {
    setEmailNotif(newVal);
    actions.showToast(
      newVal ? "Email Newsletter Diaktifkan" : "Email Newsletter Dinonaktifkan",
      "info"
    );
  };

  const handleResetSettings = () => {
    triggerHaptic();
    setPushNotif(true);
    setEmailNotif(false);
    actions.showToast("Pengaturan dikembalikan ke default", "success");
  };

  const handleThemeToggle = () => {
    triggerHaptic();
    actions.toggleTheme();
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoggingOut(false);
    setModalType(null);
    actions.showToast("Anda berhasil keluar", "success");
    actions.setActiveTab("home");
  };

  const handleComingSoon = (feature) => {
    triggerHaptic();
    actions.showToast(`Fitur ${feature} akan segera hadir`, "info");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans animate-fade-in">
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed top-[-10%] left-[-20%] w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-normal animate-pulse-slow z-0"></div>

      <div className="relative z-10 px-6 pt-8 pb-32 w-full max-w-md mx-auto">
        {/* --- Header --- */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => actions.setActiveTab("profile")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-90 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Pengaturan
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kelola preferensi akun
            </p>
          </div>
        </div>

        {/* --- Content --- */}
        <div className="space-y-1">
          {/* Section: Umum */}
          <SectionHeader title="Umum" />
          <Card className="divide-y divide-slate-50 dark:divide-slate-700/50">
            <SettingItem
              icon={Moon}
              label="Mode Gelap"
              type="toggle"
              isToggled={state.isDarkMode}
              onToggle={handleThemeToggle}
              value={state.isDarkMode ? "Aktif" : "Mati"}
              delay={0}
            />
            <SettingItem
              icon={Globe}
              label="Bahasa Aplikasi"
              type="value"
              value="Indonesia"
              onClick={() => handleComingSoon("Bahasa")}
              delay={50}
            />
          </Card>

          {/* Section: Notifikasi */}
          <SectionHeader title="Notifikasi" />
          <Card className="divide-y divide-slate-50 dark:divide-slate-700/50">
            <SettingItem
              icon={Bell}
              label="Push Notifikasi"
              value="Info promo & transaksi"
              type="toggle"
              isToggled={pushNotif}
              onToggle={handleTogglePush}
              delay={100}
            />
            <SettingItem
              icon={Smartphone}
              label="Email Newsletter"
              value="Berita bulanan"
              type="toggle"
              isToggled={emailNotif}
              onToggle={handleToggleEmail}
              delay={150}
            />
          </Card>

          {/* Section: Keamanan */}
          <SectionHeader title="Keamanan" />
          <Card className="divide-y divide-slate-50 dark:divide-slate-700/50">
            <SettingItem
              icon={Shield}
              label="Ganti PIN / Password"
              onClick={() => setModalType("security")}
              delay={200}
            />
            <SettingItem
              icon={Smartphone}
              label="Perangkat Terhubung"
              value="iPhone 13 Pro"
              type="value"
              onClick={() => handleComingSoon("Device Manager")}
              delay={250}
            />
          </Card>

          {/* Section: Info */}
          <SectionHeader title="Lainnya" />
          <Card className="divide-y divide-slate-50 dark:divide-slate-700/50">
            <SettingItem
              icon={HelpCircle}
              label="Pusat Bantuan"
              onClick={() => setModalType("help")}
              delay={300}
            />
            <SettingItem
              icon={FileText}
              label="Syarat & Ketentuan"
              onClick={() => setModalType("terms")}
              delay={350}
            />
          </Card>

          {/* Actions */}
          <div
            className="mt-8 mb-6 space-y-3 animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            <button
              onClick={handleResetSettings}
              className="w-full py-3.5 rounded-xl font-bold text-slate-500 dark:text-slate-400 bg-transparent border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <RotateCcw size={18} />
              Reset Pengaturan
            </button>

            <button
              onClick={() => {
                triggerHaptic();
                setModalType("logout");
              }}
              className="w-full py-3.5 rounded-xl font-bold text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <LogOut size={18} />
              Keluar dari Akun
            </button>
          </div>

          {/* Version Info */}
          <div
            className="text-center pb-8 opacity-60 animate-fade-in"
            style={{ animationDelay: "500ms" }}
          >
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              DaurCuan App v2.1.0
            </p>
            <p className="text-slate-300 dark:text-slate-600 text-[9px] mt-1 font-mono">
              Build ID: 2025.12.23
            </p>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <LogoutModal
        isOpen={modalType === "logout"}
        isLoading={isLoggingOut}
        onClose={() => setModalType(null)}
        onConfirm={confirmLogout}
      />

      <InfoModal
        isOpen={modalType === "help"}
        onClose={() => setModalType(null)}
        title="Pusat Bantuan"
        type="help"
      />

      <InfoModal
        isOpen={modalType === "terms"}
        onClose={() => setModalType(null)}
        title="Syarat & Ketentuan"
        type="terms"
      />

      <SecurityModal
        isOpen={modalType === "security"}
        onClose={() => setModalType(null)}
        actions={actions}
      />

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes bounceIn {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default Settings;
