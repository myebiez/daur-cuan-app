// src/pages/Profile.jsx

import React, { useState, useEffect, useCallback, memo } from "react";
import {
  User,
  Settings,
  CreditCard,
  ChevronRight,
  Moon,
  Sun,
  Bell,
  Gift,
  ShieldCheck,
  Camera,
  X,
  Loader2,
  LogOut,
  Copy,
  CheckCircle2,
  HelpCircle,
  FileText,
  Crown,
} from "lucide-react";
import { useApp } from "../context/AppContext";

// --- UTILS ---
const triggerHaptic = () => {
  if (typeof window !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(10);
    } catch (e) {
      // Ignore unsupported devices
    }
  }
};

const formatNumber = (num) => new Intl.NumberFormat("id-ID").format(num || 0);

// --- COMPONENT: MENU ITEM PRO ---
const MenuItem = memo(
  ({ icon: Icon, label, subLabel, onClick, badge, isDestructive, delay }) => (
    <button
      onClick={() => {
        triggerHaptic();
        onClick();
      }}
      // FIX: Added transition-all duration-300 for smooth background/border change
      className={`w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all duration-300 group active:scale-[0.99] animate-fade-in-up ${delay}`}
    >
      <div className="flex items-center gap-4">
        <div
          // FIX: Added transition-colors
          className={`p-2.5 rounded-2xl transition-colors duration-300 shadow-sm ${
            isDestructive
              ? "bg-red-50 text-red-500 group-hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400"
              : "bg-slate-50 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:bg-slate-700/50 dark:text-slate-400 dark:group-hover:bg-emerald-900/20 dark:group-hover:text-emerald-400"
          }`}
        >
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div className="text-left">
          {/* FIX: Added transition-colors for text */}
          <span
            className={`font-bold text-sm block tracking-wide transition-colors duration-300 ${
              isDestructive
                ? "text-red-600 dark:text-red-400"
                : "text-slate-700 group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-white"
            }`}
          >
            {label}
          </span>
          {subLabel && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 block transition-colors duration-300">
              {subLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {badge && (
          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-[10px] font-bold text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 shadow-sm transition-colors duration-300">
            {badge}
          </span>
        )}
        {!isDestructive && (
          <ChevronRight
            size={16}
            className="text-slate-300 group-hover:text-slate-400 dark:text-slate-600 transition-colors duration-300 group-hover:translate-x-1"
          />
        )}
      </div>
    </button>
  )
);

MenuItem.displayName = "MenuItem";

// --- COMPONENT: MENU GROUP ---
const MenuGroup = ({ title, children, className }) => (
  <div className={`mb-6 ${className}`}>
    {title && (
      <h3 className="px-4 mb-3 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 transition-colors duration-300">
        {title}
      </h3>
    )}
    {/* FIX: Added transition-all duration-300 for smooth container changes */}
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 dark:border-slate-700/60 shadow-sm bg-white dark:bg-slate-800 transition-all duration-300 ease-in-out">
      {children}
    </div>
  </div>
);

// --- COMPONENT: EDIT MODAL ---
const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [name, setName] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(user?.name || "");
      setPreviewAvatar(user?.avatar || null);
    }
  }, [isOpen, user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewAvatar(objectUrl);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || loading) return;
    triggerHaptic();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      await onSave({ ...user, name: name.trim(), avatar: previewAvatar });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
      {/* FIX: Backdrop transition */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* FIX: Modal window transitions */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-t-[2rem] sm:rounded-[2rem] p-6 relative animate-slide-up sm:animate-scale-in shadow-2xl border-t sm:border border-white/10 z-10 transition-colors duration-300">
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6 sm:hidden transition-colors duration-300"></div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">
            Edit Profil
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xl">
                {/* FIX: Avatar border transition */}
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 relative transition-colors duration-300">
                  {previewAvatar ? (
                    <img
                      src={previewAvatar}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-300 transition-colors duration-300">
                      <User size={40} />
                    </div>
                  )}
                </div>
              </div>
              <label className="absolute bottom-1 right-1 p-2.5 bg-slate-900 text-white rounded-full border-[3px] border-white dark:border-slate-900 cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-lg z-20">
                <Camera size={16} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <div className="space-y-5 mb-8">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1 transition-colors duration-300">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 rounded-2xl px-4 py-3.5 font-bold text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 placeholder:text-slate-400 placeholder:font-normal"
                placeholder="Masukkan nama anda"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1 transition-colors duration-300">
                Alamat Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-transparent border-2 border-transparent px-4 py-3.5 font-bold text-slate-400 cursor-not-allowed select-none transition-colors duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const Profile = () => {
  const { state, actions } = useApp();
  const { user, isDarkMode, wallet } = state;
  const [showEdit, setShowEdit] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTabChange = useCallback(
    (tab) => actions.setActiveTab(tab),
    [actions]
  );

  const handleLogout = () => {
    if (window.confirm("Apakah anda yakin ingin keluar?")) actions.logout();
  };

  const copyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      setCopied(true);
      triggerHaptic();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    // FIX: Main Container transition colors
    <div className="min-h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 ease-in-out font-sans pt-safe-t pb-safe-b">
      {/* --- HEADER ACTIONS --- */}
      {/* FIX: Header background transition */}
      <div className="sticky top-0 z-30 px-6 py-4 flex justify-end bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md animate-fade-in transition-colors duration-300">
        <button
          onClick={() => {
            triggerHaptic();
            actions.toggleTheme();
          }}
          // FIX: Toggle button transition
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-yellow-400 shadow-sm active:scale-90 transition-all duration-300 hover:shadow-md"
        >
          {isDarkMode ? (
            <Sun
              size={20}
              className="fill-current animate-[spin_0.5s_ease-out]"
            />
          ) : (
            <Moon
              size={20}
              className="fill-current animate-[spin_0.5s_ease-out]"
            />
          )}
        </button>
      </div>

      <div className="px-6 pb-24 max-w-md mx-auto">
        {/* --- HERO PROFILE CARD --- */}
        <div className="mb-8 relative animate-scale-in">
          {/* Main Card */}
          {/* FIX: Card background and border transition */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden z-10 group transition-all duration-300 ease-in-out">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light z-0 pointer-events-none"></div>

            <div className="flex flex-col items-center relative z-10">
              {/* Avatar Section */}
              <div className="relative mb-5 group-hover:scale-105 transition-transform duration-500">
                <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 shadow-2xl shadow-emerald-500/20">
                  {/* FIX: Avatar inner border and bg transition */}
                  <div className="w-full h-full rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-700 transition-all duration-300">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 font-bold text-4xl transition-colors duration-300">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                {/* Badge Icon */}
                <div className="absolute bottom-1 right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-1.5 rounded-full border-[3px] border-white dark:border-slate-800 shadow-md transition-all duration-300">
                  <Crown size={14} fill="currentColor" />
                </div>
              </div>

              {/* Identity Section */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1.5 transition-colors duration-300">
                  {user?.name || "Guest User"}
                </h2>
                <button
                  onClick={copyEmail}
                  // FIX: Email button background transition
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-50 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 active:scale-95 group/email"
                >
                  <span className="truncate max-w-[150px]">
                    {user?.email || "guest@daurcuan.id"}
                  </span>
                  {copied ? (
                    <CheckCircle2
                      size={12}
                      className="text-emerald-500 animate-bounce-in"
                    />
                  ) : (
                    <Copy
                      size={12}
                      className="group-hover/email:text-slate-800 dark:group-hover/email:text-white transition-colors duration-300"
                    />
                  )}
                </button>
              </div>

              {/* Mini Stats (Pill Style) */}
              <div className="flex items-center justify-center gap-3 w-full">
                {/* FIX: Stats Pill Transitions */}
                <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all duration-300">
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1 transition-colors duration-300">
                    Poin
                  </p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums leading-none transition-colors duration-300">
                    {formatNumber(wallet?.points)}
                  </p>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all duration-300">
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1 transition-colors duration-300">
                    Botol
                  </p>
                  <p className="text-lg font-black text-teal-600 dark:text-teal-400 tabular-nums leading-none transition-colors duration-300">
                    {formatNumber(wallet?.bottles)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-emerald-500/20 blur-[80px] rounded-full -z-0 pointer-events-none transition-opacity duration-300"></div>
        </div>

        {/* --- MENUS --- */}
        <div>
          <MenuGroup
            title="Dompet & Hadiah"
            className="animate-fade-in-up delay-100"
          >
            <MenuItem
              icon={Gift}
              label="Tukar Poin"
              subLabel="Voucher, Pulsa & E-Wallet"
              onClick={() => handleTabChange("exchange")}
              badge="Promo"
              delay="delay-[150ms]"
            />
            <MenuItem
              icon={CreditCard}
              label="Akun Bank"
              subLabel="Kelola metode penarikan"
              onClick={() => handleTabChange("bank")}
              delay="delay-[200ms]"
            />
          </MenuGroup>

          <MenuGroup
            title="Pengaturan Akun"
            className="animate-fade-in-up delay-200"
          >
            <MenuItem
              icon={User}
              label="Edit Profil"
              onClick={() => setShowEdit(true)}
              delay="delay-[250ms]"
            />
            <MenuItem
              icon={Bell}
              label="Notifikasi"
              badge="2"
              onClick={() => handleTabChange("notification")}
              delay="delay-[300ms]"
            />
            <MenuItem
              icon={ShieldCheck}
              label="Privasi & Keamanan"
              onClick={() => handleTabChange("settings")}
              delay="delay-[350ms]"
            />
          </MenuGroup>

          <MenuGroup title="Bantuan" className="animate-fade-in-up delay-300">
            <MenuItem
              icon={HelpCircle}
              label="Pusat Bantuan"
              onClick={() => {}}
              delay="delay-[400ms]"
            />
            <MenuItem
              icon={FileText}
              label="Syarat & Ketentuan"
              onClick={() => {}}
              delay="delay-[450ms]"
            />
          </MenuGroup>

          {/* FIX: Logout button transition */}
          <button
            onClick={handleLogout}
            className="w-full py-4 mt-6 rounded-[1.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-red-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-300 active:scale-95 shadow-sm animate-fade-in-up delay-500"
          >
            <LogOut size={18} /> Keluar Aplikasi
          </button>

          <div className="text-center mt-8 pb-4 animate-fade-in">
            <p className="text-[10px] font-bold text-slate-300 dark:text-slate-700 tracking-[0.2em] uppercase transition-colors duration-300">
              DaurCuan v2.5.0
            </p>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        user={user}
        onSave={actions.updateProfile}
      />
    </div>
  );
};

export default Profile;
