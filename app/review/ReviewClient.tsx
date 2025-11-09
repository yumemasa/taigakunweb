"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import questions from "@/data/questions.json";

function shuffle<T>(array: T[]): T[] {
  return array.map((v) => [Math.random(), v] as [number, T]).sort((a, b) => a[0] - b[0]).map((v) => v[1]);
}

function getRandomOptions(correctMeaning: string, allMeanings: string[], count: number) {
  const incorrect = allMeanings.filter((m) => m !== correctMeaning);
  const shuffled = shuffle(incorrect).slice(0, count - 1);
  const options = shuffle([...shuffled, correctMeaning]);
  return options;
}

const ReviewClient = () => {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [reviewOrder, setReviewOrder] = useState<number[]>([]);
  const [pendingRemovalIndex, setPendingRemovalIndex] = useState<number | null>(null);
  const [reviewLoaded, setReviewLoaded] = useState(false);

  // 復習問題の初期読み込み完了フラグのみ管理（自動でトップへ戻す挙動は廃止）
  useEffect(() => {
    // 何もしない。redirectは表示側で制御する。
  }, [mounted, reviewOrder, reviewLoaded]);

  // クイズ・ランダムで間違えた問題IDを履歴から抽出
  useEffect(() => {
    if (!mounted) return;
    const historyRaw = typeof window !== "undefined" ? window.localStorage.getItem("etec_history") : null;
    let history = [];
    if (historyRaw) {
      try { history = JSON.parse(historyRaw); } catch {}
    }
  // quiz, random, review で間違えた履歴エントリから questions のインデックスを抽出（後方互換対応）
  const mistakeEntries = history.filter((h: any) => ["quiz", "random", "review"].includes(h.mode) && h.isCorrect === false);
    const mistakeIndexes: number[] = mistakeEntries.map((h: any) => {
      // 優先: 明示的に保存された questionIndex を使う
      if (typeof h.questionIndex === "number" && h.questionIndex >= 0 && h.questionIndex < questions.length) {
        return h.questionIndex;
      }
      // 後方互換: 古い履歴は questionId (legacy ID) を持っている場合がある -> find first match
      if (typeof h.questionId === "number") {
        return questions.findIndex((q: any) => q.ID === h.questionId);
      }
      return -1;
  }).filter((idx: number) => idx !== -1);
    // 重複除去（同一問題が複数回間違いとして記録されている場合）
    const uniqueIndexes = Array.from(new Set(mistakeIndexes));
    // 出題順はランダムでも良いのでシャッフルしてセット
  setReviewOrder(shuffle(uniqueIndexes));
    setReviewLoaded(true);
  }, [mounted]);
  // 履歴保存（問題Index・ID・カテゴリ・正解情報付き）
  useEffect(() => {
    if (isAnswered && selected !== null) {
      if (!q) return;
      const historyRaw = typeof window !== "undefined" ? window.localStorage.getItem("etec_history") : null;
      let history = [];
      if (historyRaw) {
        try { history = JSON.parse(historyRaw); } catch {}
      }
      history.push({
        mode: "review",
        date: new Date().toLocaleString(),
        questionId: q.ID ?? null,
        questionIndex: reviewOrder.length > 0 ? reviewOrder[index] : index,
        category: q.category,
        isCorrect: selected === q.meaning
      });
      window.localStorage.setItem("etec_history", JSON.stringify(history));
    }
  }, [isAnswered, selected]);
  const allMeanings = questions.map((q) => q.meaning);
  // 復習対象がある場合はそのインデックスリストから問題を取り出す。ない場合は空配列（クイズモードへのフォールバックを行わない）
  const reviewQuestions = reviewOrder.length > 0 ? reviewOrder.map((i) => questions[i]) : [];
  const q = reviewQuestions.length > 0 ? reviewQuestions[index % reviewQuestions.length] : null;
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && reviewQuestions.length > 0) {
      if (!q) return;
      setOptions(getRandomOptions(q.meaning, allMeanings, 4));
    }
  }, [mounted, index]);

  // 再描画時に reviewOrder が変わったら options を更新する
  useEffect(() => {
    if (mounted && reviewQuestions.length > 0) {
      if (!q) return;
      setOptions(getRandomOptions(q.meaning, allMeanings, 4));
    }
  }, [reviewOrder]);

  if (!questions || questions.length === 0) return null;
  // 復習対象が初期読み込み済みでかつ空なら、復習するものが無い旨を表示
  if (reviewLoaded && reviewOrder.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto mt-8 text-center text-slate-300">
        <div className="glass-panel p-8 rounded-2xl">
          <div className="text-xl font-semibold mb-4">復習する問題はありません</div>
          <div className="mb-4 text-slate-400">現在、間違えた問題が記録されていません。クイズやランダムで間違えると復習に追加されます。</div>
          <a href="/" className="inline-block glass-panel rounded-full border border-white/10 px-6 py-2 text-base text-white">トップへ戻る</a>
        </div>
      </div>
    );
  }
  if (!reviewQuestions || reviewQuestions.length === 0) return null;
  if (!q) return null;
  if (!reviewOrder || (reviewOrder.length > 0 && reviewOrder.map((i) => questions[i]).length === 0)) return null;
  if (!mounted) {
    return <div className="w-full max-w-xl mx-auto mt-8 text-center text-slate-400">読み込み中...</div>;
  }
  if (options.length === 0) return null;

  const handleSelect = (opt: string) => {
    // 選択肢をロック
    setSelected(opt);
    setIsAnswered(true);

  // 回答フラグは isAnswered で管理（answeredCount は不要）

    // 正誤判定
    const isCorrect = opt === q.meaning;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);

      // reviewOrder がある（復習モード）の場合は、該当問題を localStorage からクリーンアップして
      // 「次に削除する予定」としてマークする（実際の削除・次移動はユーザーが「次へ」を押したときに行う）
      if (reviewOrder.length > 0) {
        const originalIndex = reviewOrder[index];
        try {
          if (typeof window !== "undefined") {
            const historyRaw = window.localStorage.getItem("etec_history");
            let history: any[] = [];
            if (historyRaw) {
              history = JSON.parse(historyRaw);
            }
            const filtered = history.filter((h) => {
              if (["quiz", "random"].includes(h.mode) && h.isCorrect === false && h.questionId === questions[originalIndex].ID) {
                return false;
              }
              return true;
            });
            const reviewEntry = {
              mode: "review",
              date: new Date().toLocaleString(),
              questionId: questions[originalIndex].ID,
              category: questions[originalIndex].category,
              isCorrect: true,
            };
            const newHistory = [...filtered, reviewEntry];
            window.localStorage.setItem("etec_history", JSON.stringify(newHistory));
          }
        } catch {
          // ignore storage errors
        }

        // 自動で削除・遷移はせず、削除予定としてマークする
        setPendingRemovalIndex(index);
      }
    } else {
      // 不正解は記録しておく
      // 履歴には review の不正解を保存しておく (次回の復習で再出題されるようにする)
      if (typeof window !== "undefined") {
        try {
          const historyRaw2 = window.localStorage.getItem("etec_history");
          let history2: any[] = [];
          if (historyRaw2) history2 = JSON.parse(historyRaw2);
          history2.push({ mode: "review", date: new Date().toLocaleString(), questionId: q.ID ?? null, questionIndex: reviewOrder.length > 0 ? reviewOrder[index] : index, category: q.category, isCorrect: false });
          window.localStorage.setItem("etec_history", JSON.stringify(history2));
        } catch {
          // ignore
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      <div className="fixed top-6 left-6 z-50">
        <a href="/" className="glass-panel flex items-center gap-2 rounded-full px-6 py-2 text-base font-medium text-white backdrop-blur-xl border border-white/10 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-sky-400 mr-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m5-11v11a1 1 0 001 1h5a1 1 0 001-1V10" /></svg>
          トップ
        </a>
      </div>
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-white/10 p-10 text-center shadow-lg flex relative">
        <div className="flex-1">
          <div className="mb-2 text-xs text-slate-400">{q.category}</div>
          <div className="mb-2 text-sm text-slate-400">{index + 1}/{reviewQuestions.length}</div>
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
          <div className="w-full grid grid-cols-[1fr_auto] items-start gap-6 pt-6">
            <div className="flex flex-col items-start gap-3">
              <div className="mt-6">
                <span className="text-slate-400">正答率: {isAnswered ? Math.round((correctCount / (index + 1)) * 100) : (index > 0 ? Math.round((correctCount / index) * 100) : 0)}%</span>
              </div>
              <button
                onClick={() => {
                  setIndex((i) => (i > 0 ? i - 1 : reviewQuestions.length - 1));
                  setSelected(null);
                  setIsAnswered(false);
                  setPendingRemovalIndex(null);
                }}
                className="glass-panel rounded-full border border-white/10 px-6 py-2 text-base text-white hover:border-neon-magenta/70"
              >
                前へ
              </button>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  // 次へボタン押下時の挙動:
                  // - もし直前に正解して削除予定(pendingRemovalIndex)がセットされていれば、それをreviewOrderから削除して
                  //   次の問題を表示する（削除後に残り0ならトップへ）。
                  // - そうでなければ単純に次の問題へ進む。
                  if (pendingRemovalIndex !== null && reviewOrder.length > 0) {
                    const newOrder = [...reviewOrder];
                    // pendingRemovalIndexは現在の index を想定
                    newOrder.splice(pendingRemovalIndex, 1);
                    // すべて終わったらトップへ
                    if (newOrder.length === 0) {
                      setReviewOrder(newOrder);
                      if (typeof window !== "undefined") window.location.href = "/";
                      return;
                    }
                    // 新しい index を調整
                    const newIndex = pendingRemovalIndex >= newOrder.length ? 0 : pendingRemovalIndex;
                    setReviewOrder(newOrder);
                    setIndex(newIndex);
                    setSelected(null);
                    setIsAnswered(false);
                    setPendingRemovalIndex(null);
                    // 新しい問題の選択肢を即時設定
                    const nextQ = questions[newOrder[newIndex]];
                    setOptions(getRandomOptions(nextQ.meaning, allMeanings, 4));
                  } else {
                    // 通常の次へ: 最後の問題ならセッションを終了してトップへ戻す
                    if (index >= reviewQuestions.length - 1) {
                      if (typeof window !== "undefined") window.location.href = "/";
                      return;
                    }
                    setIndex((i) => {
                      const next = i < reviewQuestions.length - 1 ? i + 1 : i;
                      setSelected(null);
                      setIsAnswered(false);
                      setPendingRemovalIndex(null);
                      return next;
                    });
                  }
                }}
                className="glass-panel rounded-full border border-white/10 px-6 py-2 text-base text-white hover:border-neon-cyan/70"
              >
                次へ
              </button>
            </div>
          </div>
          <div className="mt-6">
            <span className="text-slate-400">正答率: {isAnswered ? Math.round((correctCount / (index + 1)) * 100) : (index > 0 ? Math.round((correctCount / index) * 100) : 0)}%</span>
            {reviewOrder.length > 0 && (
              <div className="mt-4 text-sm text-neon-magenta">間違えた問題だけで再挑戦中！</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewClient;
