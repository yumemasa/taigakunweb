"use client";

import { useState, useEffect } from "react";
import questions from "@/data/questions.json";

export function FlashcardClient() {
  const [index, setIndex] = useState(0);
  const total = questions.length;
  const card = questions[index];
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handlePrev = () => setIndex((i) => (i > 0 ? i - 1 : total - 1));
  const handleNext = () => setIndex((i) => (i < total - 1 ? i + 1 : 0));

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      {/* 左上にトップへのリンクを固定表示 */}
      <div className="fixed top-6 left-6 z-50">
        <a href="/" className="glass-panel flex items-center gap-2 rounded-full px-6 py-2 text-base font-medium text-white backdrop-blur-xl border border-white/10 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-sky-400 mr-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m5-11v11a1 1 0 001 1h5a1 1 0 001-1V10" /></svg>
          トップ
        </a>
      </div>
      <div className="glass-panel relative w-full max-w-xl rounded-3xl border border-white/10 p-10 text-center shadow-lg flex flex-col" style={{ minHeight: 340 }}>
        <div className="mb-6 text-xs text-slate-400">{card.category}</div>
        <div className="mb-8 text-3xl font-bold text-neon-cyan">{card.words}</div>
        <div className="flex-1 flex items-center justify-center">
          <div
            className="text-lg text-slate-100 break-words w-full px-2"
            style={{ minHeight: 120, maxHeight: 240, overflowY: 'auto' }}
          >
            {card.meaning}
          </div>
        </div>
        <div className="absolute left-0 bottom-0 w-full flex justify-center items-center gap-6 pb-4 pointer-events-auto bg-gradient-to-t from-slate-950/80 via-transparent to-transparent">
          <button
            onClick={handlePrev}
            className="glass-panel rounded-full border border-white/10 px-6 py-2 text-base text-white hover:border-neon-magenta/70"
          >
            前へ
          </button>
          <span className="text-slate-400">{index + 1} / {total}</span>
          <button
            onClick={handleNext}
            className="glass-panel rounded-full border border-white/10 px-6 py-2 text-base text-white hover:border-neon-cyan/70"
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
}
