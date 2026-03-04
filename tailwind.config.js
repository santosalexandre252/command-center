/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d8edff",
          200: "#b9deff",
          300: "#89c9ff",
          400: "#52a9ff",
          500: "#2a85ff",
          600: "#1466f5",
          700: "#0d50e1",
          800: "#1141b6",
          900: "#143a8f",
        },
        surface: {
          0: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9",
          800: "#1e2028",
          850: "#181a20",
          900: "#111318",
          950: "#0b0d10",
        },
        burnout: {
          green: "#22c55e",
          amber: "#f59e0b",
          red: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
