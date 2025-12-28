// src/pages/Scan.jsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  X,
  Zap,
  ZapOff,
  CheckCircle2,
  Loader2,
  CameraOff,
  ScanLine,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { API_URL } from "../config/constants";

const Scan = () => {
  const { actions } = useApp();

  // --- STATE MANAGEMENT ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanned, setIsScanned] = useState(false); // Efek visual flash & UI Sukses
  const [torchOn, setTorchOn] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // --- REFS ---
  // Lock untuk mencegah multiple scan dalam milidetik yang sama
  const scanLock = useRef(false);
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // --- CLEANUP ---
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // --- HELPER: PARSE QR CODE ---
  const parseQRCode = (rawValue) => {
    if (!rawValue) return null;
    try {
      // 1. Jika format URL (http://domain.com/device/ID_MESIN)
      if (rawValue.includes("http")) {
        const urlObj = new URL(rawValue);
        const pathSegments = urlObj.pathname.split("/").filter(Boolean);
        return pathSegments[pathSegments.length - 1];
      }
      // 2. Fallback: Ambil string murni
      return rawValue.trim();
    } catch (e) {
      // 3. Fallback Manual: Ambil segmen terakhir setelah '/'
      if (rawValue.includes("/")) {
        const parts = rawValue.split("/");
        return parts[parts.length - 1].trim();
      }
      return rawValue.trim();
    }
  };

  // --- HANDLER: ON SCAN ---
  const handleScan = useCallback(
    async (detectedCodes) => {
      // 1. Guard Clauses (Cegah spam scan)
      if (
        scanLock.current ||
        isProcessing ||
        isScanned ||
        !detectedCodes ||
        detectedCodes.length === 0
      ) {
        return;
      }

      const rawValue = detectedCodes[0].rawValue;
      if (!rawValue) return;

      // 2. Lock & Visual Feedback
      scanLock.current = true;
      setIsScanned(true); // Memicu flash putih
      actions.triggerHaptic(); // Getar pendek

      // Delay sedikit untuk efek shutter kamera
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 3. Persiapan Request
      setIsProcessing(true);
      const machineId = parseQRCode(rawValue);

      // Batalkan request sebelumnya jika ada
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      try {
        // 4. Simulasi / Eksekusi API
        console.log("Menghubungkan ke Mesin ID:", machineId);

        const response = await fetch(`${API_URL}/api/session/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ code: machineId }),
          signal: abortControllerRef.current.signal,
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
          // --- SUKSES ---
          setScanResult(machineId); // Update UI dengan ID Mesin
          actions.triggerHaptic(); // Getar lagi tanda sukses
          actions.showToast("Berhasil terhubung ke mesin!", "success");

          // Redirect setelah 1.5 detik
          timeoutRef.current = setTimeout(() => {
            actions.setActiveTab("home");
          }, 1500);
        } else {
          throw new Error(data.message || "QR Code tidak valid");
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Scan Error:", error);

        // Pesan error user friendly
        let msg = error.message;
        if (msg === "Failed to fetch") msg = "Gagal koneksi. Cek internet.";

        actions.showToast(msg, "error");

        // --- RESET STATE (Agar bisa scan ulang) ---
        timeoutRef.current = setTimeout(() => {
          setIsProcessing(false);
          setIsScanned(false);
          setScanResult(null);
          scanLock.current = false;
        }, 2000); // Delay error 2 detik
      }
    },
    [isProcessing, isScanned, actions]
  );

  // --- HANDLER: ERROR KAMERA ---
  const handleCameraError = (error) => {
    const msg = error?.message || "";
    // Hanya tangkap error fatal yang membuat kamera blank
    if (msg.includes("No video input") || msg.includes("device not found")) {
      setCameraError("Kamera tidak ditemukan.");
    } else if (msg.includes("permission") || msg.includes("denied")) {
      setCameraError("Izin kamera ditolak.");
    }
  };

  return (
    // Container: Fixed Full Screen, Hitam
    <div className="fixed inset-0 bg-black z-50 flex flex-col font-sans h-[100dvh] w-full overflow-hidden">
      {/* 1. LAYER KAMERA */}
      <div className="absolute inset-0 z-0 bg-black">
        {!cameraError && (
          <Scanner
            onScan={handleScan}
            onError={handleCameraError}
            formats={["qr_code"]}
            // Matikan audio bawaan, kita pakai haptic sendiri
            components={{
              audio: false,
              finder: false,
              onOff: false,
              tracker: false,
            }}
            // Pause scanner jika sedang processing/sukses untuk hemat baterai
            paused={isProcessing || !!scanResult}
            allowMultiple={true}
            scanDelay={500}
            styles={{
              container: { height: "100%", width: "100%" },
              video: { objectFit: "cover", height: "100%" },
            }}
            constraints={{
              facingMode: "environment",
              advanced: [{ torch: torchOn }],
            }}
          />
        )}
      </div>

      {/* 2. LAYER FLASH EFEK (Kedip Putih) */}
      <div
        className={`absolute inset-0 z-10 bg-white pointer-events-none transition-opacity duration-300 ${
          isScanned && !isProcessing && !scanResult ? "opacity-60" : "opacity-0"
        }`}
      ></div>

      {/* 3. LAYER GRADIENT OVERLAY (Agar teks UI terbaca) */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/70 via-transparent to-black/80"></div>

      {/* 4. LAYER UI CONTROLS */}
      <div className="relative z-20 flex-1 flex flex-col justify-between pt-safe-t pb-safe-b">
        {/* --- HEADER --- */}
        <div className="flex justify-between items-start px-6 pt-6">
          {/* Tombol Close */}
          <button
            onClick={() => actions.setActiveTab("home")}
            className="p-3 bg-black/20 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-95 transition-all shadow-lg hover:bg-white/10 group"
            aria-label="Tutup Scanner"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Status Pill */}
          <div className="mt-2 px-4 py-1.5 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
            <div
              className={`w-2 h-2 rounded-full ${
                isProcessing
                  ? "bg-emerald-400 animate-ping"
                  : "bg-red-500 animate-pulse"
              }`}
            ></div>
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">
              {isProcessing ? "MEMPROSES..." : "LIVE SCAN"}
            </span>
          </div>

          {/* Tombol Torch */}
          {!cameraError && (
            <button
              onClick={() => setTorchOn(!torchOn)}
              className={`p-3 rounded-full border transition-all active:scale-95 shadow-lg ${
                torchOn
                  ? "bg-yellow-400 text-black border-yellow-500 shadow-yellow-400/50"
                  : "bg-black/20 backdrop-blur-md text-white border-white/10 hover:bg-white/10"
              }`}
            >
              {torchOn ? (
                <Zap size={24} fill="currentColor" />
              ) : (
                <ZapOff size={24} />
              )}
            </button>
          )}
        </div>

        {/* --- CENTER AREA --- */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-12 px-6">
          {/* A. ERROR STATE */}
          {cameraError ? (
            <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-[2rem] border border-red-500/30 text-center animate-fade-in w-full max-w-xs shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <CameraOff className="text-red-500" size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                Akses Kamera Ditolak
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Mohon izinkan akses kamera di pengaturan browser Anda untuk
                memindai QR Code.
              </p>
              <button
                onClick={() => actions.setActiveTab("home")}
                className="w-full py-3 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform text-sm hover:bg-slate-200"
              >
                Kembali ke Beranda
              </button>
            </div>
          ) : (
            /* B. NORMAL / LOADING STATE */
            <div className="relative flex items-center justify-center w-full">
              {isProcessing || scanResult ? (
                // --- LOADING / SUCCESS CARD ---
                <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] flex flex-col items-center animate-fade-in border border-white/10 shadow-2xl min-w-[260px] transform transition-all">
                  {scanResult ? (
                    // Success UI
                    <>
                      <div className="relative mb-5">
                        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-50 rounded-full animate-pulse"></div>
                        <CheckCircle2 className="w-16 h-16 text-emerald-400 relative z-10 animate-bounce-in" />
                      </div>
                      <h3 className="text-white font-bold text-xl tracking-tight mb-1">
                        Terhubung!
                      </h3>
                      <p className="text-emerald-200/70 text-xs font-mono tracking-widest uppercase truncate max-w-[200px]">
                        ID: {scanResult}
                      </p>
                    </>
                  ) : (
                    // Loading UI
                    <>
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full animate-pulse"></div>
                        <Loader2 className="w-10 h-10 text-emerald-400 relative z-10 animate-spin" />
                      </div>
                      <h3 className="text-white font-bold text-lg">
                        Menghubungkan
                      </h3>
                      <p className="text-white/50 text-xs mt-1 font-medium tracking-wide">
                        Verifikasi Kode Mesin...
                      </p>
                    </>
                  )}
                </div>
              ) : (
                // --- VIEWFINDER FRAME ---
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 transition-all duration-300">
                  {/* Pojok Bingkai (Corner Borders) */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-[6px] border-l-[6px] border-emerald-500 rounded-tl-[2rem] shadow-sm drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-[6px] border-r-[6px] border-emerald-500 rounded-tr-[2rem] shadow-sm drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[6px] border-l-[6px] border-emerald-500 rounded-bl-[2rem] shadow-sm drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[6px] border-r-[6px] border-emerald-500 rounded-br-[2rem] shadow-sm drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>

                  {/* Animasi Laser (Menggunakan class custom dari tailwind.config.js) */}
                  <div className="absolute left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(52,211,153,1)] animate-laser z-10 rounded-full"></div>

                  {/* Grid Halus (Overlay) */}
                  <div className="absolute inset-0 border border-white/10 rounded-[1.8rem] grid grid-cols-2 grid-rows-2">
                    <div className="border-r border-b border-white/10"></div>
                    <div className="border-b border-white/10"></div>
                    <div className="border-r border-white/10"></div>
                  </div>

                  {/* Pulse Center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 bg-emerald-500/5 rounded-full animate-pulse-slow blur-xl"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- FOOTER INSTRUCTION --- */}
        {!isProcessing && !cameraError && (
          <div className="pb-10 px-6 text-center animate-fade-in-up delay-200">
            <div className="inline-flex items-center gap-3 bg-black/60 backdrop-blur-md pl-4 pr-6 py-3 rounded-full border border-white/10 shadow-xl">
              <div className="bg-emerald-500/20 p-1.5 rounded-full animate-pulse">
                <ScanLine size={18} className="text-emerald-400" />
              </div>
              <span className="text-white/90 text-xs font-bold tracking-wide">
                Arahkan ke QR Code Mesin
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scan;
