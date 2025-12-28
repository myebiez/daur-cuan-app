const express = require("express");
const cors = require("cors");
const os = require("os");
const app = express();

// ==========================================
// 1. KONFIGURASI SERVER
// ==========================================
const PORT = 3001;
const MACHINE_ID = "RVM-LOBBY-01"; // HARUS SAMA dengan di C++
const SESSION_TIMEOUT_MS = 60000; // 60 Detik (Waktu habis jika tidak ada aktivitas)

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
  })
);

app.use(express.json());

// Middleware Logging
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] 📡 ${req.method} ${req.url}`);
  next();
});

// ==========================================
// 2. STATE MANAGEMENT (IN-MEMORY)
// ==========================================

// Variabel untuk Timer Auto-Close
let sessionTimeout = null;

// State Mesin RVM
let rvmState = {
  machineId: MACHINE_ID,
  status: "LOCKED", // LOCKED | ACTIVE
  session: {
    sessionId: null,
    user: null,
    startTime: null,
    sessionPoints: 0,
  },
};

// Data Dummy User (Simulasi Database)
let userStore = {
  name: "Fadhil Abie",
  email: "fadhil@daurcuan.id",
  balance: 500, // Saldo Awal
  history: [
    {
      id: 1,
      type: "EARN",
      title: "Bonus Pendaftaran",
      amount: 500,
      date: new Date().toISOString(),
    },
  ],
};

// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================

// Fungsi untuk menutup sesi (dipanggil oleh API atau Timer)
const closeSession = (reason = "USER_REQUEST") => {
  if (rvmState.status !== "ACTIVE") return null;

  const pointsEarned = rvmState.session.sessionPoints;

  // 1. Masukkan poin ke wallet user
  if (pointsEarned > 0) {
    userStore.balance += pointsEarned;

    userStore.history.unshift({
      id: Date.now(),
      type: "EARN",
      title: "Setor Botol RVM",
      amount: pointsEarned,
      date: new Date().toISOString(),
    });
  }

  console.log(
    `[SERVER] 🏁 Sesi Berakhir (${reason}). Poin: +${pointsEarned}. Saldo Baru: ${userStore.balance}`
  );

  // 2. Reset State Mesin
  rvmState.status = "LOCKED";
  rvmState.session = {
    sessionId: null,
    user: null,
    startTime: null,
    sessionPoints: 0,
  };

  // 3. Matikan Timer jika ada
  if (sessionTimeout) clearTimeout(sessionTimeout);

  return pointsEarned;
};

// Fungsi untuk mereset timer inactivity
const resetSessionTimer = () => {
  if (sessionTimeout) clearTimeout(sessionTimeout);

  console.log("[SERVER] ⏳ Timer Reset (60s remaining)");

  sessionTimeout = setTimeout(() => {
    console.log("[SERVER] ⏰ Waktu Habis! Auto-closing session...");
    closeSession("TIMEOUT");
  }, SESSION_TIMEOUT_MS);
};

// ==========================================
// 4. ENDPOINTS APLIKASI (REACT)
// ==========================================

// A. Start Sesi (Scan QR)
app.post("/api/session/start", (req, res) => {
  const { code } = req.body;

  // Validasi ID Mesin
  if (code !== rvmState.machineId) {
    console.log(
      `[SERVER] ❌ Scan Ditolak. QR: '${code}' != Config: '${rvmState.machineId}'`
    );
    return res.status(400).json({ status: "error", message: "QR Code salah!" });
  }

  // Jika sesi tertinggal aktif, tutup paksa dulu
  if (rvmState.status === "ACTIVE") {
    closeSession("FORCE_RESET");
  }

  // Mulai Sesi Baru
  const newSessionId = "SES-" + Date.now();
  rvmState.status = "ACTIVE";
  rvmState.session = {
    sessionId: newSessionId,
    user: userStore.name,
    startTime: Date.now(),
    sessionPoints: 0,
  };

  // Nyalakan Timer Auto-Close
  resetSessionTimer();

  console.log(`[SERVER] ✅ Sesi DIBUKA (ID: ${newSessionId})`);
  res.json({ status: "success", data: rvmState.session });
});

// B. End Sesi (Tombol Selesai di HP)
app.post("/api/session/end", (req, res) => {
  if (rvmState.status === "LOCKED") {
    return res.json({
      status: "already_closed",
      newBalance: userStore.balance,
    });
  }

  const points = closeSession("USER_APP");
  res.json({
    status: "closed",
    pointsAdded: points,
    newBalance: userStore.balance,
  });
});

// C. Polling Status (HP mengecek poin live)
app.get("/api/status", (req, res) => {
  res.json(rvmState);
});

// D. Ambil Data User (Profile & Wallet)
app.get("/api/user/profile", (req, res) => {
  res.json({
    user: {
      name: userStore.name,
      email: userStore.email,
    },
    wallet: {
      points: userStore.balance,
      bottles: Math.floor(userStore.balance / 50), // Simulasi jumlah botol
      history: userStore.history,
    },
  });
});

// E. Redeem Poin
app.post("/api/redeem", (req, res) => {
  const { amount, method } = req.body;

  if (userStore.balance < amount) {
    return res
      .status(400)
      .json({ success: false, message: "Poin tidak cukup!" });
  }

  userStore.balance -= amount;

  userStore.history.unshift({
    id: Date.now(),
    type: "REDEEM",
    title: `Tukar ke ${method}`,
    amount: amount,
    date: new Date().toISOString(),
  });

  console.log(`[SERVER] 🎁 Redeem Sukses: -${amount} (${method})`);
  res.json({ success: true, newBalance: userStore.balance });
});

// ==========================================
// 5. ENDPOINTS MESIN (ESP32 / C++)
// ==========================================

// Mesin mengecek apakah boleh menerima botol
app.get("/api/machine/check", (req, res) => {
  // Return string simple agar mudah diparse di C++
  res.send(rvmState.status);
});

// Mesin mengirim laporan botol masuk
app.post("/api/rvm/input", (req, res) => {
  if (rvmState.status !== "ACTIVE") {
    console.log("[MESIN] ❌ Input Ditolak (LOCKED)");
    return res.json({ status: "rejected", message: "Session locked" });
  }

  const points = parseInt(req.body.points);

  if (!points || points <= 0) {
    return res.json({ status: "error", message: "Invalid points" });
  }

  // Tambah poin sesi
  rvmState.session.sessionPoints += points;

  // PENTING: Reset timer auto-close karena user masih aktif
  resetSessionTimer();

  console.log(
    `[MESIN] ♻️ Botol Masuk (+${points}). Total Sesi: ${rvmState.session.sessionPoints}`
  );

  res.json({
    status: "ok",
    currentPoints: rvmState.session.sessionPoints,
  });
});

// ==========================================
// 6. START SERVER
// ==========================================
function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

app.listen(PORT, "0.0.0.0", () => {
  const ip = getLocalIp();
  console.log("\n========================================");
  console.log(` 🚀 DAURCUAN SERVER RUNNING`);
  console.log(` 🆔 Machine ID : ${MACHINE_ID}`);
  console.log(` ⏱️ Timeout    : ${SESSION_TIMEOUT_MS / 1000} Detik`);
  console.log(` 🏠 Local      : http://localhost:${PORT}`);
  console.log(` 📡 Network    : http://${ip}:${PORT}`);
  console.log("========================================\n");
});
