"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 255, 0.35)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass-panel flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-neon-cyan/60"
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
      <span>{isDark ? "Dark" : "Light"}</span>
    </motion.button>
  );
}
