// src/context/AppContext.jsx

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { API_URL, APP_CONFIG } from "../config/constants";

const AppContext = createContext();

// --- DEFAULT STATES ---

const DEFAULT_USER = {
  name: "Guest User",
  email: "guest@daurcuan.id",
  avatar: "",
  bankAccount: null,
  // Menambahkan array untuk menyimpan riwayat penukaran (Exchange History)
  transactions: [],
};

const DEFAULT_WALLET = {
  points: 0,
  bottles: 0,
  // History ini untuk grafik/chart (pemasukan & pengeluaran simpel)
  history: [],
};

export const AppProvider = ({ children }) => {
  // ==============================
  // 1. SETUP STATE (PERSISTENCE)
  // ==============================

  // User Data
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("user_data");
        // Merge dengan default agar field baru (transactions) tidak undefined pada user lama
        return savedUser
          ? { ...DEFAULT_USER, ...JSON.parse(savedUser) }
          : DEFAULT_USER;
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  // Wallet Data
  const [wallet, setWallet] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedWallet = localStorage.getItem("wallet_data");
        return savedWallet ? JSON.parse(savedWallet) : DEFAULT_WALLET;
      } catch (e) {
        return DEFAULT_WALLET;
      }
    }
    return DEFAULT_WALLET;
  });

  // UI States
  const [activeTab, setActiveTab] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modal, setModal] = useState({ type: null, data: null });
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // RVM Session States (Real-time)
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [livePoints, setLivePoints] = useState(0);

  // Refs
  const lastSessionPointsRef = useRef(0);

  // ==============================
  // 2. EFFECTS (AUTO-SAVE)
  // ==============================

  useEffect(() => {
    if (user) localStorage.setItem("user_data", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (wallet) localStorage.setItem("wallet_data", JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // ==============================
  // 3. HELPERS (ACTIONS)
  // ==============================

  const triggerHaptic = useCallback(() => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  }, []);

  // ==============================
  // 4. BUSINESS LOGIC
  // ==============================

  const saveBankInfo = useCallback(
    (bankData) => {
      setUser((prev) => ({ ...prev, bankAccount: bankData }));
      showToast("Rekening berhasil disimpan", "success");
      setActiveTab("profile");
    },
    [showToast]
  );

  const updateProfile = useCallback(
    (newData) => {
      setUser((prev) => ({ ...prev, ...newData }));
      showToast("Profil diperbarui", "success");
      setModal({ type: null });
    },
    [showToast]
  );

  // --- NEW: Add Transaction Logic ---
  const addTransaction = useCallback((newTx) => {
    setUser((prev) => ({
      ...prev,
      // Tambahkan transaksi baru di awal array
      transactions: [newTx, ...(prev.transactions || [])],
    }));
  }, []);

  // --- Updated Redeem Logic ---
  const redeemPoints = useCallback(
    (amount, method) => {
      return new Promise((resolve) => {
        if (amount > wallet.points) {
          showToast("Poin tidak cukup!", "error");
          resolve(false);
          return;
        }

        // 1. Kurangi Poin di Wallet
        setWallet((prev) => ({
          ...prev,
          points: prev.points - amount,
          history: [
            {
              id: Date.now(),
              title: `Tukar ${method}`,
              date: new Date().toISOString(),
              amount: amount,
              type: "spend",
            },
            ...prev.history,
          ],
        }));

        // 2. Tambahkan ke User Transactions (Agar muncul di halaman History)
        // Note: Kita panggil addTransaction terpisah di Exchange.jsx agar ID-nya konsisten,
        // tapi logika pengurangan saldo WAJIB di sini.

        showToast(`Berhasil tukar ke ${method}!`, "success");
        resolve(true);
      });
    },
    [wallet.points, showToast]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("user_data");
    localStorage.removeItem("wallet_data");
    setUser(DEFAULT_USER);
    setWallet(DEFAULT_WALLET);
    setActiveTab("home");
    showToast("Berhasil keluar", "success");
  }, [showToast]);

  // ==============================
  // 5. INTELLIGENT POLLING (RVM)
  // ==============================
  useEffect(() => {
    if (user.email === DEFAULT_USER.email) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/status`, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) return;
        const data = await res.json();

        const serverIsActive = data.status === "ACTIVE";
        const currentServerPoints = parseInt(data.session?.sessionPoints) || 0;

        if (serverIsActive !== isSessionActive) {
          setIsSessionActive(serverIsActive);
          if (serverIsActive) {
            lastSessionPointsRef.current = 0;
            setLivePoints(0);
          } else {
            if (lastSessionPointsRef.current > 0) {
              showToast("Sesi RVM Selesai. Poin disimpan.", "info");
            }
            setLivePoints(0);
          }
        }

        if (serverIsActive) {
          setLivePoints(currentServerPoints);
          const prevPoints = lastSessionPointsRef.current;

          if (currentServerPoints > prevPoints) {
            const diff = currentServerPoints - prevPoints;
            const pointsPerBottle =
              APP_CONFIG?.GAME_LOGIC?.POINTS_PER_BOTTLE || 50;

            setWallet((prev) => ({
              ...prev,
              points: prev.points + diff,
              bottles: prev.bottles + Math.floor(diff / pointsPerBottle),
              history: [
                {
                  id: Date.now(),
                  title: "Setoran Mesin RVM",
                  date: new Date().toISOString(),
                  amount: diff,
                  type: "earn",
                },
                ...prev.history,
              ],
            }));

            triggerHaptic();
            showToast(`+${diff} Poin Masuk!`, "success");
            lastSessionPointsRef.current = currentServerPoints;
          }
        }
      } catch (err) {
        // Silent catch
      }
    };

    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, [isSessionActive, user.email, triggerHaptic, showToast]);

  // ==============================
  // 6. EXPORT
  // ==============================
  const value = {
    state: {
      user,
      wallet,
      activeTab,
      isDarkMode,
      modal,
      toast,
      isSessionActive,
      livePoints,
    },
    actions: {
      setActiveTab,
      toggleTheme,
      showToast,
      triggerHaptic,
      saveBankInfo,
      updateProfile,
      redeemPoints,
      addTransaction, // <--- NEW EXPORT
      logout,
      openModal: (type, data) => setModal({ type, data }),
      closeModal: () => setModal({ type: null, data: null }),
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
