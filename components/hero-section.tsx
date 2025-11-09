"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ParticlesBackground } from "@/components/particles-background";
import { CreditCard, ListChecks, Shuffle, RotateCcw, LayoutDashboard } from "lucide-react";

export function HeroSection() {
  const [hasMistake, setHasMistake] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const historyRaw = window.localStorage.getItem("etec_history");
      if (!historyRaw) {
        setHasMistake(false);
        return;
      }
      const history = JSON.parse(historyRaw || "[]");
      setHasMistake(
        Array.isArray(history) && history.some((h: { mode?: string; isCorrect?: boolean }) => ["quiz", "random"].includes(h.mode || "") && h.isCorrect === false)
      );
    } catch (e) {
      setHasMistake(false);
    }
  }, []);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden px-6 py-16 sm:px-12">
      {/* 左上にホームボタンを固定表示 */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/" className="glass-panel flex items-center gap-2 rounded-full px-6 py-2 text-base font-medium text-white backdrop-blur-xl border border-white/10 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-sky-400 mr-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m5-11v11a1 1 0 001 1h5a1 1 0 001-1V10" /></svg>
          トップ
        </Link>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-grid [background-size:var(--grid-size)] opacity-40" aria-hidden />
      <ParticlesBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/95" aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
          <div />
          <div className="flex items-center gap-4" />
        </header>

        <div className="glass-panel relative rounded-card border border-white/10 p-10 sm:p-16 animate-in fade-in duration-700">
          <div className="absolute -inset-[1px] rounded-card border border-white/5 bg-gradient-to-r from-neon-cyan/30 via-transparent to-neon-magenta/20 blur-xl" aria-hidden />
          <div className="relative">
            <motion.h1
              className="text-4xl font-semibold leading-tight text-white md:text-6xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              ETEC Class2
            </motion.h1>

            <motion.p
              className="mt-6 max-w-2xl text-lg text-slate-300 md:text-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
            >
              学習を効率よく進めましょう。
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            >
              {/* 学習モード選択パネル */}
              <div className="flex flex-wrap gap-4">
                <motion.div
                  whileHover={{ boxShadow: "0 0 25px rgba(0, 255, 255, 0.65)", borderColor: "rgba(0,255,255,0.75)" }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full border border-white/10"
                >
                  <Link
                    href="/flashcard"
                    className="glass-panel flex items-center gap-2 rounded-full px-8 py-3 text-base font-medium text-white backdrop-blur-xl transition-colors"
                  >
                    <CreditCard size={20} className="text-neon-cyan" />
                    フラッシュカード
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ boxShadow: "0 0 25px rgba(0, 255, 0, 0.65)", borderColor: "rgba(0,255,0,0.75)" }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full border border-white/10"
                >
                  <Link
                    href="/quiz"
                    className="glass-panel flex items-center gap-2 rounded-full px-8 py-3 text-base font-medium text-white backdrop-blur-xl transition-colors"
                  >
                    <ListChecks size={20} className="text-neon-magenta" />
                    クイズ
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ boxShadow: "0 0 25px rgba(255, 255, 0, 0.65)", borderColor: "rgba(255,255,0,0.75)" }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full border border-white/10"
                >
                  <Link
                    href="/random"
                    className="glass-panel flex items-center gap-2 rounded-full px-8 py-3 text-base font-medium text-white backdrop-blur-xl transition-colors"
                  >
                    <Shuffle size={20} className="text-yellow-300" />
                    ランダム
                  </Link>
                </motion.div>

                {/* 復習ボタンは間違えた問題があるときだけ表示 */}
                {hasMistake && (
                  <motion.div
                    whileHover={{ boxShadow: "0 0 25px rgba(255, 0, 255, 0.65)", borderColor: "rgba(255,0,255,0.75)" }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-full border border-white/10"
                  >
                    <Link
                      href="/review"
                      className="glass-panel flex items-center gap-2 rounded-full px-8 py-3 text-base font-medium text-white backdrop-blur-xl transition-colors"
                    >
                      <RotateCcw size={20} className="text-emerald-400" />
                      復習
                    </Link>
                  </motion.div>
                )}

              </div>

              {/* ダッシュボードへのリンク */}
              <motion.div
                whileHover={{ boxShadow: "0 0 25px rgba(255, 0, 255, 0.65)", borderColor: "rgba(255,0,255,0.75)" }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-white/10"
              >
                <Link
                  href="/dashboard"
                  className="glass-panel flex items-center gap-2 rounded-full px-8 py-3 text-base font-medium text-white backdrop-blur-xl transition-colors"
                >
                  <LayoutDashboard size={20} className="text-sky-400" />
                  ダッシュボード
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
