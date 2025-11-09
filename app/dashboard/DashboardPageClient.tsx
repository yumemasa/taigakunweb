"use client";

"use client";

import React, { useEffect, useState } from "react";

type HistoryItem = {
  mode: string;
  date: string;
  questionId?: number;
  category?: string;
  isCorrect?: boolean;
  correct?: number;
  total?: number;
};

export function DashboardPageClient() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("etec_history");
      if (raw) {
        setHistory(JSON.parse(raw));
      }
  // 学習時間は未使用のため取得しません
    }
  }, []);

  // サマリー（新旧履歴形式両対応） — 正答率は累積で計算する
  let totalAnswers = 0;
  let totalCorrect = 0;
  if (history.length > 0) {
    const hasIsCorrect = history.some((h) => typeof h.isCorrect === "boolean");
    if (hasIsCorrect) {
      const filtered = history.filter((h) => typeof h.isCorrect === "boolean");
      totalAnswers = filtered.length;
      totalCorrect = filtered.filter((h) => h.isCorrect === true).length;
    } else {
      totalAnswers = history.reduce((sum, h) => sum + (h.total ?? 0), 0);
      totalCorrect = history.reduce((sum, h) => sum + (h.correct ?? 0), 0);
    }
  }
  const accuracy = totalAnswers ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  // カテゴリ別統計（将来的にグラフを表示する場合はここを使います）

  // サマリーカード
  function SummaryCard({ title, value, unit, color }: { title: string; value: string | number; unit?: string; color?: string }) {
    return (
      <div className={`glass-panel flex flex-col items-center justify-center rounded-2xl border border-white/10 px-8 py-6 shadow-lg`} style={{ minWidth: 140 }}>
        <div className={`text-xs font-semibold mb-2 text-slate-400`}>{title}</div>
        <div className={`text-3xl font-bold mb-1`} style={{ color: color || "#00FFFF" }}>{value}{unit && <span className="text-base ml-1 text-slate-400">{unit}</span>}</div>
      </div>
    );
  }

  // 学習時間（hh:mm:ss表示） — 未実装のため関数は削除

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-neon-cyan">学習ダッシュボード</h1>
        <p className="text-slate-300">進捗・履歴・グラフ・ヒートマップをまとめて表示します。</p>
      </header>

      {/* サマリーカード */}
          <div className="flex flex-row gap-6 mb-8">
            <SummaryCard title="総解答数" value={totalAnswers} color="#00FFFF" />
            <SummaryCard title="正答率" value={accuracy} unit="%" color="#FF00FF" />
          </div>

      {/* アクティビティヒートマップ */}
          {/* Removed the RadarChart and GitHubCalendar sections */}
    </div>
  );
}
