import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Tetap 'true' agar server bisa mendengarkan semua alamat IP (0.0.0.0).
    // Ini berguna jika kamu menjalankan 'npm run dev' atau 'npm run preview' di VPS.
    host: true,

    // Opsional: Kunci port di 5173 agar tidak berubah-ubah
    port: 5173,
  },
});
