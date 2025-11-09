"use client";

import React, { useState, useEffect } from "react";
import questions from "@/data/questions.json";

type Question = { ID?: number; category?: string; words?: string; meaning?: string };

// ジェネリックなシャッフル
function shuffle<T>(array: T[]): T[] {
  return array.map((v) => [Math.random(), v] as [number, T]).sort((a, b) => a[0] - b[0]).map((v) => v[1]);
}

function getRandomOptions(correctMeaning: string, allMeanings: string[], count: number) {
  const incorrect = allMeanings.filter((m) => m !== correctMeaning);
  const shuffled = shuffle(incorrect).slice(0, count - 1);
  const options = shuffle([...shuffled, correctMeaning]);
  return options;
}

function RandomQuizClient() {
  const [order, setOrder] = useState(() => shuffle([...Array(questions.length).keys()]));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const total = questions.length;
  const q = questions[order[index]];
  const allMeanings = questions.map((q: Question) => q.meaning as string);
  const [options, setOptions] = useState<string[]>(() => getRandomOptions(q.meaning, allMeanings, 4));

  // indexまたはorderが変わった時だけ選択肢を再生成
  React.useEffect(() => {
    setOptions(getRandomOptions(questions[order[index]].meaning, allMeanings, 4));
  }, [index, order]);

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
        mode: "random",
        date: new Date().toLocaleString(),
        questionId: q.ID ?? null,
        questionIndex: order[index],
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
    if (index + 1 === total) setOrder(shuffle([...Array(questions.length).keys()]));
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
          {/* 正答率を左上に表示 */}
          <div className="absolute top-4 left-4">
            <span className="text-slate-400 text-sm">
              正答率: {isAnswered ? Math.round((correctCount / (index + 1)) * 100) : (index > 0 ? Math.round((correctCount / index) * 100) : 0)}%
            </span>
          </div>
          <div className="mb-8 text-2xl font-bold text-neon-cyan">{q.words}</div>
          <div className="grid gap-4">
            {options.map((opt) => {
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
                <div key={opt} className="relative w-full">
                    <button
                      onClick={() => { if (!isAnswered) handleSelect(opt); }}
                      className={`glass-panel w-full rounded-xl border px-4 py-3 text-base text-white transition-colors flex flex-row items-center justify-between ${isAnswered ? (opt === q.meaning ? "border-emerald-400 bg-emerald-500/20" : opt === selected ? "border-rose-400 bg-rose-500/20" : "border-white/10 bg-slate-900/60") : "border-white/10 bg-slate-900/60 hover:border-neon-magenta/70"}`}
                      disabled={isAnswered}
                      style={{ position: "relative" }}
                    >
                      <span className="mb-1">{opt}</span>
                      {showLabel && (
                        <span
                          className={`absolute text-sm font-bold ${labelColor} bg-slate-900 rounded-full px-2 py-0.5`}
                          style={{ right: -8, bottom: -8 }}
                        >
                          {label}
                        </span>
                      )}
                    </button>
                </div>
              );
            })}
          </div>
          <div className="w-full flex justify-center items-center gap-6 pt-6">
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

export default RandomQuizClient;
