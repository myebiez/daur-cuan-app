// src/pages/Achievement.jsx

import React, { useMemo } from "react";
import {
  Leaf,
  Wind,
  Trophy,
  Lock,
  Star,
  Droplets,
  Award,
  Crown,
  Medal,
  Zap,
  ChevronRight,
  Share2,
  Target,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { APP_CONFIG } from "../config/constants";

// --- UTILS ---
const formatNumber = (num) => new Intl.NumberFormat("id-ID").format(num || 0);

// --- COMPONENT: GLOWING PROGRESS BAR ---
const ModernProgressBar = ({ current, max }) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  const remaining = max - current;

  return (
    <div className="w-full group">
      <div className="flex mb-2 items-end justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider mb-0.5 opacity-80">
            Progress Level
          </span>
          <span className="text-sm font-bold text-white font-mono tracking-tight">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-emerald-200 font-medium block">
            Target Selanjutnya
          </span>
          <span className="text-xs font-bold text-white tracking-wide tabular-nums">
            {formatNumber(remaining)}{" "}
            <span className="text-emerald-200/70 font-normal">XP lagi</span>
          </span>
        </div>
      </div>

      {/* Track Container */}
      <div className="h-3 w-full bg-black/20 rounded-full backdrop-blur-sm border border-white/10 relative overflow-hidden shadow-inner">
        {/* Animated Gradient Fill */}
        <div
          style={{ width: `${percentage}%` }}
          className="h-full absolute top-0 left-0 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(52,211,153,0.5)]"
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite] translate-x-[-100%]" />
        </div>

        {/* Ticks */}
        <div className="absolute inset-0 w-full h-full flex justify-between px-1 opacity-20 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-white/50" />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: STAT WIDGET (Bento Style) ---
const StatWidget = ({
  icon: Icon,
  label,
  value,
  unit,
  gradientClass,
  delay,
}) => (
  <div
    className={`relative overflow-hidden rounded-[1.25rem] p-4 border border-white/60 dark:border-slate-700/50 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group ${delay}`}
  >
    {/* Background Blob */}
    <div
      className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-xl group-hover:scale-150 transition-transform duration-700 ${gradientClass}`}
    ></div>

    <div className="flex flex-col justify-between h-full relative z-10">
      <div
        className={`p-2.5 w-fit rounded-xl mb-3 ${gradientClass} bg-opacity-10 dark:bg-opacity-20`}
      >
        <Icon size={20} className="text-slate-700 dark:text-white" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight tabular-nums">
            {formatNumber(value)}
          </span>
          <span className="text-xs font-semibold text-slate-400">{unit}</span>
        </div>
      </div>
    </div>
  </div>
);

// --- COMPONENT: BADGE ITEM ---
const BadgeItem = ({ badge, index }) => {
  return (
    <div
      className={`
        group relative w-full p-4 rounded-2xl border transition-all duration-500 animate-fade-in-up
        ${
          badge.unlocked
            ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-emerald-200/30 dark:hover:shadow-emerald-900/10 hover:border-emerald-200"
            : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 opacity-70 grayscale-[0.8]"
        }
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Icon Box */}
        <div
          className={`
          relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-md
          ${
            badge.unlocked
              ? `bg-gradient-to-br ${badge.bgGradient}`
              : "bg-slate-200 dark:bg-slate-700 inner-shadow text-slate-400"
          }
        `}
        >
          {badge.unlocked ? (
            <badge.icon
              className="text-white drop-shadow-md"
              size={26}
              strokeWidth={2}
            />
          ) : (
            <Lock className="text-slate-500 dark:text-slate-400" size={22} />
          )}

          {/* Active Glow */}
          {badge.unlocked && (
            <div className="absolute inset-0 rounded-2xl bg-white/20 blur-md animate-pulse-slow" />
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4
              className={`text-sm font-bold truncate ${
                badge.unlocked
                  ? "text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {badge.name}
            </h4>
            {badge.unlocked && (
              <Award size={14} className="text-amber-500 flex-shrink-0 ml-2" />
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {badge.desc}
          </p>

          {/* Status Pill */}
          <div className="mt-2.5 flex items-center gap-2">
            <div
              className={`h-1.5 flex-1 rounded-full overflow-hidden ${
                badge.unlocked
                  ? "bg-slate-100 dark:bg-slate-700"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  badge.unlocked ? "bg-emerald-500 w-full" : "bg-slate-400 w-0"
                }`}
              />
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                badge.unlocked
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400"
              }`}
            >
              {badge.unlocked ? "Selesai" : "Terkunci"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const Achievement = () => {
  const { state } = useApp();

  // Fallback data agar tidak crash saat loading
  const points = state?.wallet?.points ?? 0;
  const bottles = state?.wallet?.bottles ?? 0;
  const user = state?.user || {};

  const XP_PER_LEVEL = 1000;
  const currentLevel = Math.floor(points / XP_PER_LEVEL) + 1;
  const currentXP = points % XP_PER_LEVEL;

  const factorLand = APP_CONFIG?.GAME_LOGIC?.LAND_SAVED_PER_BOTTLE_M2 ?? 0.002;
  const factorCO2 = APP_CONFIG?.GAME_LOGIC?.CO2_PER_BOTTLE_KG ?? 0.05;

  const landSaved = (bottles * factorLand).toFixed(2);
  const co2Saved = (bottles * factorCO2).toFixed(1);

  // Memoize Badges agar tidak recalc setiap render
  const badges = useMemo(
    () => [
      {
        id: 1,
        name: "Pendaur Pemula",
        desc: "Mulai perjalanan hijau Anda (Level 1).",
        icon: Star,
        unlocked: currentLevel >= 1,
        bgGradient: "from-amber-400 to-orange-500",
      },
      {
        id: 2,
        name: "Kolektor 100",
        desc: "Kumpulkan total 100 botol plastik.",
        icon: Droplets,
        unlocked: bottles >= 100,
        bgGradient: "from-cyan-400 to-blue-500",
      },
      {
        id: 3,
        name: "Guardian of Earth",
        desc: "Cegah 10kg emisi Karbon (CO2).",
        icon: Leaf,
        unlocked: parseFloat(co2Saved) >= 10,
        bgGradient: "from-emerald-400 to-green-600",
      },
      {
        id: 4,
        name: "Sultan Poin",
        desc: "Miliki saldo dompet 50.000 Poin.",
        icon: Crown,
        unlocked: points >= 50000,
        bgGradient: "from-purple-500 to-indigo-600",
      },
      {
        id: 5,
        name: "Legend DaurCuan",
        desc: "Capai Level 10 yang prestisius.",
        icon: Medal,
        unlocked: currentLevel >= 10,
        bgGradient: "from-rose-500 to-red-600",
      },
    ],
    [currentLevel, bottles, points, co2Saved]
  );

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pb-32 pt-safe-t selection:bg-emerald-100 dark:selection:bg-emerald-900/30">
      {/* Decorative Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="relative z-10 px-6 pt-6 max-w-lg mx-auto">
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pencapaian
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Jejak langkah perubahanmu
            </p>
          </div>
          <button className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 hover:text-emerald-600 transition-all active:scale-95">
            <Share2 size={20} />
          </button>
        </div>

        <div className="space-y-8">
          {/* --- HERO: LEVEL CARD (Glassmorphism) --- */}
          <div className="relative group animate-scale-in">
            {/* Glow Behind */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2.2rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 dark:from-emerald-900 dark:to-teal-950 p-6 sm:p-7 text-white shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
              {/* Card Noise Texture */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light z-0"></div>
              {/* Abstract Light Orb */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    {/* Avatar Ring */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-yellow-300 to-amber-500 shadow-lg shadow-amber-500/20">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            className="w-full h-full rounded-full object-cover border-2 border-white/50 bg-slate-800"
                            alt="User"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-emerald-950 flex items-center justify-center text-emerald-100 font-bold text-lg border-2 border-white/30">
                            {user?.name?.[0] || "U"}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-sm border border-emerald-100">
                        Lv.{currentLevel}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="bg-white/20 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-emerald-50">
                          Member Basic
                        </span>
                      </div>
                      <h2 className="text-lg font-bold leading-tight truncate pr-2">
                        {user?.name || "Pengguna"}
                      </h2>
                    </div>
                  </div>

                  {/* Trophy Icon */}
                  <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shadow-lg group-hover:rotate-12 transition-transform duration-500">
                    <Trophy
                      className="text-yellow-300 drop-shadow-sm"
                      size={20}
                      fill="currentColor"
                    />
                  </div>
                </div>

                <ModernProgressBar current={currentXP} max={XP_PER_LEVEL} />
              </div>
            </div>
          </div>

          {/* --- STATS GRID (Bento) --- */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Zap size={14} className="text-amber-500 fill-current" />
                Dampak Lingkungan
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatWidget
                icon={Leaf}
                label="Lahan Selamat"
                value={landSaved}
                unit="m²"
                gradientClass="bg-emerald-500"
                delay="delay-100"
              />
              <StatWidget
                icon={Wind}
                label="Cegah CO2"
                value={co2Saved}
                unit="kg"
                gradientClass="bg-teal-500"
                delay="delay-200"
              />
            </div>
          </div>

          {/* --- BADGES LIST --- */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Target size={14} className="text-rose-500" />
                Milestones
              </h3>
              <button className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-0.5">
                Lihat Semua <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid gap-3">
              {badges.map((badge, idx) => (
                <BadgeItem key={badge.id} badge={badge} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievement;
