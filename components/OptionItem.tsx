"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

export type OptionItemProps = {
  optionText: string;
  index?: number;
  isSelected?: boolean;
  isCorrect?: boolean;
  isRevealed?: boolean;
  onSelect?: () => void;
};

export function OptionItem({ optionText, index = 0, isSelected, isCorrect, isRevealed, onSelect }: OptionItemProps) {
  const highlightState = (() => {
    if (!isRevealed) {
      return isSelected ? "border-neon-magenta/70 bg-white/5" : "border-white/10 bg-white/5";
    }
    if (isCorrect) {
      return "border-emerald-400/80 bg-emerald-500/20";
    }
    if (isSelected && !isCorrect) {
      return "border-rose-400/80 bg-rose-500/20";
    }
    return "border-white/5 bg-slate-900/60";
  })();

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.01, boxShadow: isSelected ? "0 0 24px rgba(255, 0, 255, 0.45)" : "0 0 18px rgba(255, 0, 255, 0.25)" }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "glass-panel group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition",
        highlightState,
        isSelected && !isRevealed ? "shadow-[0_0_22px_rgba(255,0,255,0.35)]" : "shadow-none",
        isRevealed && isCorrect ? "text-emerald-200" : isRevealed && isSelected ? "text-rose-100" : "text-slate-200"
      )}
      aria-pressed={isSelected}
      aria-label={`選択肢 ${String.fromCharCode(65 + index)}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-sm font-semibold uppercase tracking-widest text-white/80">
        {String.fromCharCode(65 + index)}
      </span>
      <span className="flex-1 text-base leading-relaxed">{optionText}</span>
    </motion.button>
  );
}
