import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
} from "react";
import {
  Home,
  MapPin,
  ScanLine,
  Trophy,
  User,
  Leaf,
  Wallet,
  ChevronRight,
  Settings,
  LogOut,
  Info,
  CreditCard,
  QrCode,
  X,
  Search,
  ArrowUpRight,
  Wind,
  ArrowLeft,
  Bell,
} from "lucide-react";

/* ==========================================
  1. CONFIG & KONSTANTA
  ==========================================
*/

// --- PENTING: GANTI IP INI SESUAI IP LAPTOP KAMU ---
// Cara cek IP: Buka CMD -> ketik 'ipconfig' (Windows) atau 'ip addr' (Linux)
const API_URL = "http://192.168.18.227:3001";

const APP_CONFIG = {
  APP_NAME: "DaurCuan",
  VERSION: "2.1.0-Beta",
  CURRENCY: "pts",
  GAME_LOGIC: {
    POINTS_PER_BOTTLE: 50,
    CO2_PER_BOTTLE_KG: 0.05,
    LAND_SAVED_PER_BOTTLE_M2: 0.002,
    LEVEL_THRESHOLD: 1000,
    MIN_REDEEM_POINTS: 1000,
  },
};

const MOCK_LOCATIONS = [
  {
    id: 1,
    name: "Vending Machine UGM",
    address: "Gedung Pusat UGM, Bulaksumur",
    dist: "0.8 km",
    status: "Active",
    mapsQuery: "Gedung Pusat UGM",
  },
  {
    id: 2,
    name: "RVM Amikom Yogyakarta",
    address: "Gd. 5 Lantai 1, Universitas Amikom",
    dist: "1.2 km",
    status: "Active",
    mapsQuery: "Universitas Amikom Yogyakarta",
  },
  {
    id: 3,
    name: "Malioboro Point 1",
    address: "Depan Mall Malioboro",
    dist: "2.5 km",
    status: "Full",
    mapsQuery: "Malioboro Mall Yogyakarta",
  },
];

/* ==========================================
  2. STATE MANAGEMENT (CONTEXT)
  ==========================================
*/

const AppContext = createContext();

const AppProvider = ({ children }) => {
  // --- UI State ---
  const [activeTab, setActiveTab] = useState("home");
  const [modal, setModal] = useState({ type: null, data: null });
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // --- Data State ---
  const [user, setUser] = useState({
    name: "User Demo",
    email: "user@daurcuan.id",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    bankAccount: null,
  });

  const [wallet, setWallet] = useState({
    points: 0,
    bottles: 0,
    history: [],
  });

  // --- Actions ---
  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const closeModal = () => setModal({ type: null, data: null });
  const openModal = (type, data = null) => setModal({ type, data });

  const updateProfile = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
    showToast("Profil berhasil diperbarui");
    closeModal();
  };

  const saveBankInfo = (bankData) => {
    setUser((prev) => ({ ...prev, bankAccount: bankData }));
    showToast("Rekening berhasil disimpan");
    setActiveTab("profile");
  };

  const redeemPoints = (amount, method) => {
    if (amount > wallet.points) return showToast("Poin tidak cukup", "error");
    if (amount < APP_CONFIG.GAME_LOGIC.MIN_REDEEM_POINTS)
      return showToast(
        `Minimal ${APP_CONFIG.GAME_LOGIC.MIN_REDEEM_POINTS} poin`,
        "error"
      );

    setWallet((prev) => ({
      ...prev,
      points: prev.points - amount,
      history: [
        {
          id: Date.now(),
          title: `Redeem ${method}`,
          date: "Baru saja",
          amount,
          type: "spend",
        },
        ...prev.history,
      ],
    }));
    showToast(`Redeem ${method} sukses!`);
    closeModal();
  };

  const value = {
    state: { activeTab, modal, toast, user, wallet },
    actions: {
      setActiveTab,
      openModal,
      closeModal,
      updateProfile,
      saveBankInfo,
      redeemPoints,
    },
  };

  // --- POLLING DATA DARI SERVER ---
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/api/status`)
        .then((res) => res.json())
        .then((data) => {
          if (data.totalPoints !== wallet.points) {
            const diff = data.totalPoints - wallet.points;
            if (diff > 0) {
              setWallet((prev) => ({
                ...prev,
                points: data.totalPoints,
                bottles: Math.floor(data.totalPoints / 50),
                history: [
                  {
                    id: Date.now(),
                    title: "Setoran RVM (Live)",
                    date: "Baru saja",
                    amount: diff,
                    type: "earn",
                  },
                  ...prev.history,
                ],
              }));
              showToast(`Poin Masuk +${diff}!`, "success");
            }
          }
        })
        .catch((err) => console.log("Menunggu server...", err));
    }, 1000); // Cek setiap 1 detik

    return () => clearInterval(interval);
  }, [wallet.points]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

/* ==========================================
  3. UI COMPONENTS (ATOMS & MOLECULES)
  ==========================================
*/

const Button = ({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  className = "",
}) => {
  const baseStyle =
    "px-4 py-3 rounded-2xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary:
      "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700",
    secondary: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    outline: "border-2 border-emerald-600 text-emerald-600",
    ghost: "text-slate-500 hover:bg-slate-100",
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", noPadding = false, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-3xl shadow-sm border border-slate-100 ${
      noPadding ? "" : "p-5"
    } ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, color = "emerald" }) => {
  const colors = {
    emerald: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${colors[color]}`}
    >
      {children}
    </span>
  );
};

const InputGroup = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-slate-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
    />
  </div>
);

const Modal = () => {
  const { state, actions } = useApp();
  const { modal } = state;
  if (!modal.type) return null;

  let title = "",
    content = null;
  if (modal.type === "redeem") {
    title = `Redeem ${modal.data?.method}`;
    content = <RedeemForm method={modal.data?.method} />;
  } else if (modal.type === "editProfile") {
    title = "Edit Profil";
    content = <EditProfileForm />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={actions.closeModal}>
            <X size={18} />
          </button>
        </div>
        {content}
      </div>
    </div>
  );
};

const RedeemForm = ({ method }) => {
  const { state, actions } = useApp();
  const [amount, setAmount] = useState("");
  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-800 text-sm">
        Saldo: <b>{state.wallet.points} pts</b>
      </div>
      <InputGroup
        label="Nominal Poin"
        type="number"
        placeholder="Min 1000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button
        fullWidth
        onClick={() => actions.redeemPoints(parseInt(amount), method)}
      >
        Redeem
      </Button>
    </div>
  );
};

const EditProfileForm = () => {
  const { state, actions } = useApp();
  const [form, setForm] = useState({
    name: state.user.name,
    email: state.user.email,
  });
  return (
    <div className="space-y-4">
      <InputGroup
        label="Nama"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <InputGroup
        label="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Button fullWidth onClick={() => actions.updateProfile(form)}>
        Simpan
      </Button>
    </div>
  );
};

const Toast = () => {
  const { state } = useApp();
  if (!state.toast.visible) return null;
  const color =
    state.toast.type === "error"
      ? "bg-red-50 text-red-700 border-red-100"
      : "bg-emerald-50 text-emerald-700 border-emerald-100";
  return (
    <div className="fixed top-4 left-0 right-0 flex justify-center z-[60] px-4">
      <div
        className={`px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium w-full max-w-xs text-center ${color}`}
      >
        {state.toast.message}
      </div>
    </div>
  );
};

/* ==========================================
  4. PAGE VIEWS
  ==========================================
*/

const HomeView = () => {
  const { state, actions } = useApp();
  const redeemOptions = [
    { id: "gopay", name: "Gopay", bg: "bg-blue-50", color: "text-blue-500" },
    { id: "ovo", name: "OVO", bg: "bg-purple-50", color: "text-purple-500" },
    { id: "dana", name: "Dana", bg: "bg-sky-50", color: "text-sky-500" },
    { id: "bank", name: "Bank", bg: "bg-orange-50", color: "text-orange-500" },
  ];

  return (
    <div className="pb-24 animate-fade-in">
      <div className="flex justify-between items-center mb-6 pt-2">
        <div>
          <p className="text-slate-500 text-sm">Halo,</p>
          <h1 className="text-2xl font-bold">{state.user.name} 👋</h1>
        </div>
        <img
          src={state.user.avatar}
          alt="User"
          className="w-10 h-10 rounded-full border"
        />
      </div>

      <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
        <p className="text-emerald-100 mb-1">Total Poin</p>
        <h2 className="text-4xl font-bold mb-6">
          {state.wallet.points.toLocaleString()}
        </h2>
        <div className="flex gap-4">
          <div className="bg-white/20 p-3 rounded-xl flex-1 flex items-center gap-2">
            <Leaf size={16} />{" "}
            <div>
              <p className="text-xs opacity-80">Botol</p>
              <p className="font-bold">{state.wallet.bottles}</p>
            </div>
          </div>
          <div className="bg-white/20 p-3 rounded-xl flex-1 flex items-center gap-2">
            <Wind size={16} />{" "}
            <div>
              <p className="text-xs opacity-80">CO2</p>
              <p className="font-bold">
                {(state.wallet.bottles * 0.05).toFixed(1)}kg
              </p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-lg mb-4">Tukar Poin</h3>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {redeemOptions.map((item) => (
          <button
            key={item.id}
            onClick={() => actions.openModal("redeem", { method: item.name })}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center`}
            >
              <Wallet size={24} className={item.color} />
            </div>
            <span className="text-xs font-medium text-slate-600">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      <h3 className="font-bold text-lg mb-4">Riwayat</h3>
      <div className="space-y-3">
        {state.wallet.history.map((item) => (
          <Card
            key={item.id}
            className="flex justify-between items-center !p-4"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  item.type === "earn"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {item.type === "earn" ? (
                  <ScanLine size={20} />
                ) : (
                  <ArrowUpRight size={20} />
                )}
              </div>
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </div>
            </div>
            <span
              className={`font-bold ${
                item.type === "earn" ? "text-emerald-600" : "text-slate-800"
              }`}
            >
              {item.type === "earn" ? "+" : "-"}
              {item.amount}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};

const LocationsView = () => {
  const [query, setQuery] = useState("");
  // --- FIX: Logic Google Maps yang benar ---
  const openMap = (loc) => {
    const q = loc ? loc.mapsQuery : "RVM+terdekat";
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        q
      )}`,
      "_blank"
    );
  };

  const filtered = MOCK_LOCATIONS.filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="pb-24 h-full flex flex-col animate-fade-in">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-bold">Lokasi RVM</h1>
        <p className="text-slate-500 text-sm">Temukan mesin terdekat</p>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Cari lokasi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border rounded-2xl py-3 pl-12 pr-4"
        />
      </div>
      <div className="bg-slate-200 h-48 rounded-3xl mb-6 flex items-center justify-center relative overflow-hidden">
        <MapPin size={48} className="text-slate-400 opacity-50" />
        <Button
          variant="secondary"
          className="absolute"
          onClick={() => openMap(null)}
        >
          Buka Maps
        </Button>
      </div>
      <div className="space-y-3">
        {filtered.map((loc) => (
          <Card
            key={loc.id}
            onClick={() => openMap(loc)}
            className="flex items-center gap-4 cursor-pointer active:bg-slate-50"
          >
            <div className="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <ScanLine size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{loc.name}</h4>
              <p className="text-xs text-slate-500">{loc.address}</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-emerald-600 text-sm">
                {loc.dist}
              </span>
              <Badge color={loc.status === "Active" ? "emerald" : "red"}>
                {loc.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ScanView = () => {
  const { actions } = useApp();

  // --- FIX: Fetch menggunakan API_URL konstan ---
  const handleSimulateScan = () => {
    fetch(`${API_URL}/api/session/start`, { method: "POST" })
      .then((res) => res.json())
      .then(() => {
        actions.setActiveTab("home");
        // Kita beri sedikit delay toast agar muncul di Home
        setTimeout(
          () => alert("Berhasil! Silakan masukkan botol ke mesin."),
          100
        );
      })
      .catch((err) =>
        alert("Gagal koneksi ke mesin. Pastikan IP benar & Server nyala.")
      );
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <button
          onClick={() => actions.setActiveTab("home")}
          className="absolute top-6 left-6 p-2 bg-black/30 rounded-full text-white"
        >
          <X />
        </button>
        <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-[scan_2s_infinite]"></div>
        </div>
        <p className="text-white mt-8 bg-black/30 px-4 py-2 rounded-full">
          Arahkan QR Code
        </p>
      </div>
      <div className="bg-white p-6 rounded-t-3xl pb-12">
        <h3 className="font-bold text-lg mb-4">Mulai Daur Ulang</h3>
        <Button onClick={handleSimulateScan} fullWidth className="py-4 text-lg">
          <QrCode className="mr-2" /> Simulasi Scan
        </Button>
      </div>
    </div>
  );
};

const AchievementView = () => {
  const { state } = useApp();
  return (
    <div className="pb-24 pt-2 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Misi Saya</h1>
      <div className="bg-emerald-800 rounded-3xl p-6 text-center text-white mb-6 shadow-lg">
        <h2 className="text-3xl font-extrabold mb-2">
          PLASTIC <span className="text-yellow-400">HERO</span>
        </h2>
        <p className="text-emerald-100 text-sm">Level 3: Eco Warrior</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-emerald-50">
          <Leaf className="text-emerald-600 mb-2" />
          <p className="text-xs">Lahan</p>
          <h3 className="text-2xl font-bold">
            {(state.wallet.bottles * 0.002).toFixed(3)}m²
          </h3>
        </Card>
        <Card className="bg-teal-50">
          <Wind className="text-teal-600 mb-2" />
          <p className="text-xs">Karbon</p>
          <h3 className="text-2xl font-bold">
            {(state.wallet.bottles * 0.05).toFixed(1)}kg
          </h3>
        </Card>
      </div>
    </div>
  );
};

const ProfileView = () => {
  const { state, actions } = useApp();
  const Menu = ({ icon: I, label, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 border-b last:border-0 hover:bg-slate-50"
    >
      <div className="flex items-center gap-3">
        <I size={20} className="text-slate-400" />{" "}
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-300" />
    </button>
  );

  return (
    <div className="pb-24 pt-2 animate-fade-in">
      <div className="text-center mb-8">
        <img
          src={state.user.avatar}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
        />
        <h2 className="text-2xl font-bold">{state.user.name}</h2>
        <p className="text-slate-500">{state.user.email}</p>
      </div>
      <Card noPadding>
        <Menu
          icon={User}
          label="Edit Profil"
          onClick={() => actions.openModal("editProfile")}
        />
        <Menu
          icon={Settings}
          label="Pengaturan"
          onClick={() => actions.setActiveTab("settings")}
        />
        <Menu
          icon={CreditCard}
          label="Rekening Bank"
          onClick={() => actions.setActiveTab("bank")}
        />
      </Card>
      <div className="mt-6">
        <Button variant="outline" fullWidth onClick={() => alert("Logout")}>
          <LogOut size={18} /> Keluar
        </Button>
      </div>
    </div>
  );
};

/* ==========================================
  5. MAIN APP
  ==========================================
*/

const AppContent = () => {
  const { state, actions } = useApp();
  const tabs = [
    { id: "home", icon: Home, label: "Beranda" },
    { id: "locations", icon: MapPin, label: "Lokasi" },
    { id: "scan", icon: ScanLine, label: "Scan", isFab: true },
    { id: "achievement", icon: Trophy, label: "Misi" },
    { id: "profile", icon: User, label: "Akun" },
  ];

  const renderPage = () => {
    switch (state.activeTab) {
      case "locations":
        return <LocationsView />;
      case "scan":
        return <ScanView />;
      case "achievement":
        return <AchievementView />;
      case "profile":
        return <ProfileView />;
      case "settings":
        return (
          <div className="p-6">
            <h1 className="font-bold text-2xl mb-4">Pengaturan</h1>
            <Button onClick={() => actions.setActiveTab("profile")}>
              Kembali
            </Button>
          </div>
        );
      case "bank":
        return (
          <div className="p-6">
            <h1 className="font-bold text-2xl mb-4">Bank</h1>
            <Button onClick={() => actions.setActiveTab("profile")}>
              Kembali
            </Button>
          </div>
        );
      default:
        return <HomeView />;
    }
  };

  return (
    <main className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl relative overflow-hidden flex flex-col font-sans text-slate-800">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {renderPage()}
      </div>

      {state.activeTab !== "scan" && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex justify-between items-center z-40 rounded-t-3xl shadow-lg">
          {tabs.map((item) =>
            item.isFab ? (
              <button
                key={item.id}
                onClick={() => actions.setActiveTab(item.id)}
                className="bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center -mt-8 shadow-lg hover:scale-105 transition-transform"
              >
                <item.icon />
              </button>
            ) : (
              <button
                key={item.id}
                onClick={() => actions.setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 ${
                  state.activeTab === item.id
                    ? "text-emerald-600"
                    : "text-slate-400"
                }`}
              >
                <item.icon size={22} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          )}
        </div>
      )}

      <Modal />
      <Toast />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
      `}</style>
      <AppContent />
    </AppProvider>
  );
}
