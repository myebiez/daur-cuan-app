/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // Konfigurasi container agar rapi di layar desktop
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      // Breakpoint untuk HP kecil (iPhone SE / Android kecil)
      screens: {
        xxs: "320px",
        xs: "375px",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      // Warna Brand DaurCuan
      colors: {
        primary: {
          50: "#effcf5",
          100: "#dcfce9",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
      },
      // Safe Area (Poni HP) dengan fallback 0px
      spacing: {
        "safe-t": "env(safe-area-inset-top, 0px)",
        "safe-b": "env(safe-area-inset-bottom, 0px)",
        "safe-l": "env(safe-area-inset-left, 0px)",
        "safe-r": "env(safe-area-inset-right, 0px)",
      },
      // --- ANIMATION CONFIGURATION ---
      animation: {
        // Basic Fades
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "fade-in-up": "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-down":
          "fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",

        // Slides (untuk Modal / Bottom Sheet / Toast)
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards", // Penting untuk Toast!

        // Interactions
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "bounce-in": "bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",

        // Loops / Effects
        "pulse-slow": "pulse-slow 3s infinite ease-in-out",
        wave: "wave 2.5s infinite",
        laser: "laser 2s cubic-bezier(0.4, 0, 0.2, 1) infinite", // Untuk Scanner
      },
      keyframes: {
        // 1. Fade Opacity Only
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },

        // 2. Fade + Slide Kecil (Subtle)
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },

        // 3. Slides Besar (Untuk Modal/Sheet)
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(100%)" }, // Dari bawah layar
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Khusus Toast (Posisi centered X)
        slideDown: {
          "0%": { opacity: "0", transform: "translate(-50%, -20px)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0)" },
        },

        // 4. Scales (Pop up effect)
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },

        // 5. Effects Loop
        wave: {
          "0%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        laser: {
          "0%": { top: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
