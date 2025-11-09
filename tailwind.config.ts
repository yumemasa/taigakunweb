import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00FFFF",
          magenta: "#FF00FF"
        }
      },
      backgroundImage: {
        grid: "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)"
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.45)",
        neon: "0 0 20px rgba(0, 255, 255, 0.6)"
      },
      borderRadius: {
        card: "24px"
      }
    }
  },
  plugins: [animatePlugin]
};

export default config;
