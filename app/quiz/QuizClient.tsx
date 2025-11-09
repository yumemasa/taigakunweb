"use client";

import React, { useState, useEffect } from "react";
import questions from "@/data/questions.json";

function getRandomOptions(correctMeaning: string, allMeanings: string[], count: number) {
  const incorrect = allMeanings.filter((m) => m !== correctMeaning);
  const shuffled = incorrect.sort(() => Math.random() - 0.5).slice(0, count - 1);
  const options = [...shuffled, correctMeaning].sort(() => Math.random() - 0.5);
  return options;
}

export function QuizClient() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const total = questions.length;
  const q = questions[index];
  const allMeanings = questions.map((q) => q.meaning);
  const [options, setOptions] = useState<string[]>(() => getRandomOptions(q.meaning, allMeanings, 4));

  // indexが変わった時だけ選択肢を再生成
  React.useEffect(() => {
    setOptions(getRandomOptions(questions[index].meaning, allMeanings, 4));
  }, [index]);

  const handleSelect = (opt: string) => {
    setSelected(opt);
    setIsAnswered(true);
    if (opt === q.meaning) setCorrectCount((c) => c + 1);
  };

  // 履歴保存（問題ID・カテゴリ・正解情報付き）
  useEffect(() => {
    if (isAnswered && selected !== null) {
      const historyRaw = typeof window !== "undefined" ? window.localStorage.getItem("etec_history") : null;
      let history = [];
      if (historyRaw) {
        try { history = JSON.parse(historyRaw); } catch {}
      }
      history.push({
        mode: "quiz",
        date: new Date().toLocaleString(),
        questionId: q.ID ?? null,
        questionIndex: index,
        category: q.category,
        isCorrect: selected === q.meaning
      });
      window.localStorage.setItem("etec_history", JSON.stringify(history));
    }
  }, [isAnswered, selected]);
  const handleNext = () => {
    setIndex((i) => (i < total - 1 ? i + 1 : 0));
    setSelected(null);
    setIsAnswered(false);
    // 選択肢はuseEffectで自動更新
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      {/* 左上にトップへのリンクを固定表示 */}
      <div className="fixed top-6 left-6 z-50">
        <a href="/" className="glass-panel flex items-center gap-2 rounded-full px-6 py-2 text-base font-medium text-white backdrop-blur-xl border border-white/10 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-sky-400 mr-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m5-11v11a1 1 0 001 1h5a1 1 0 001-1V10" /></svg>
          トップ
        </a>
      </div>
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-white/10 p-10 text-center shadow-lg flex relative">
        <div className="flex-1">
          <div className="mb-2 text-xs text-slate-400">{q.category}</div>
          <div className="mb-2 text-sm text-slate-400">{index + 1}/{total}</div>
          <div className="mb-8 text-2xl font-bold text-neon-cyan">{q.words}</div>
          <div className="grid gap-4">
            {options.map((opt, i) => {
              let label = "";
              let labelColor = "";
              let showLabel = false;
              if (isAnswered) {
                if (opt === q.meaning) {
                  label = "○";
                  labelColor = "text-emerald-400";
                  showLabel = true;
                } else if (opt === selected) {
                  label = "×";
                  labelColor = "text-rose-400";
                  showLabel = true;
                }
              }
              return (
                <div className="relative w-full">
                  <button
                    key={opt}
                    onClick={() => { if (!isAnswered) handleSelect(opt); }}
                    className={`glass-panel w-full rounded-xl border px-4 py-3 text-base text-white transition-colors flex flex-row items-center justify-between ${isAnswered ? (opt === q.meaning ? "border-emerald-400 bg-emerald-500/20" : opt === selected ? "border-rose-400 bg-rose-500/20" : "border-white/10 bg-slate-900/60") : "border-white/10 bg-slate-900/60 hover:border-neon-magenta/70"}`}
                    disabled={isAnswered}
                  >
                    <span className="mb-1">{opt}</span>
                  </button>
                  {showLabel && (
                    <span className={`absolute -bottom-3 -right-3 text-sm font-bold ${labelColor} bg-slate-900 rounded-full px-2 py-0.5`}>
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-full flex justify-center items-center gap-6 pt-6">
          <div className="mt-6">
            <span className="text-slate-400">
              正答率: {isAnswered ? Math.round((correctCount / (index + 1)) * 100) : (index > 0 ? Math.round((correctCount / index) * 100) : 0)}%
            </span>
          </div>
            <button
              onClick={() => {
                setIndex((i) => (i > 0 ? i - 1 : total - 1));
                setSelected(null);
                setIsAnswered(false);
              }}
              className="glass-panel rounded-full border border-white/10 px-6 py-2 text-base text-white hover:border-neon-magenta/70"
            >
              前へ
            </button>
            <button
              onClick={handleNext}
              className="glass-panel rounded-full border border-white/10 px-6 py-2 text-base text-white hover:border-neon-cyan/70"
            >
              次へ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
