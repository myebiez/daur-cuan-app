const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let rvmState = {
  totalPoints: 12500,
  machineStatus: "LOCKED",
  currentSessionUser: null,
};

app.post("/api/session/start", (req, res) => {
  rvmState.machineStatus = "ACTIVE";
  rvmState.currentSessionUser = "User Demo";
  console.log("[SERVER] HP Scan QR Berhasil. Membuka Mesin...");
  res.json({ status: "success", message: "Mesin Terbuka" });
});

app.get("/api/machine/check", (req, res) => {
  res.send(rvmState.machineStatus);
});

app.post("/api/rvm/input", (req, res) => {
  const points = req.body.points || 0;
  if (rvmState.machineStatus === "ACTIVE") {
    rvmState.totalPoints += points;
    console.log(
      `[SERVER] Botol diterima +${points}. Total: ${rvmState.totalPoints}`
    );
    res.json({ status: "ok" });
  } else {
    res.json({ status: "rejected", message: "Sesi belum mulai" });
  }
});

app.get("/api/status", (req, res) => {
  res.json(rvmState);
});

app.post("/api/session/end", (req, res) => {
  rvmState.machineStatus = "LOCKED";
  console.log("[SERVER] Sesi Selesai. Mesin Terkunci.");
  res.json({ status: "closed" });
});

app.listen(3001, "0.0.0.0", () => {
  console.log("Server IoT Ready di port 3001");
});
