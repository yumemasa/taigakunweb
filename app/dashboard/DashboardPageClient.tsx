"use client";

"use client";

import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import GitHubCalendar from "react-github-calendar";

// 日付ごとに解答数を集計してGitHubCalendarに渡すための関数
function getActivityData(history: any[]) {
  const dateMap: Record<string, number> = {};
  history.forEach((h) => {
    // 日付（yyyy-mm-dd）形式に変換
    const d = h.date ? h.date.split(" ")[0].replace(/[./]/g, "-") : "";
    if (d) {
      dateMap[d] = (dateMap[d] || 0) + 1;
    }
  });
  // GitHubCalendar用の配列 [{date: "2025-11-09", count: 3}, ...]
  return Object.entries(dateMap).map(([date, count]) => ({ date, count }));
}
import questions from "@/data/questions.json";

type HistoryItem = {
  mode: string;
  date: string;
  questionId?: number;
  category?: string;
  isCorrect?: boolean;
  correct?: number;
  total?: number;
};

const neonColors = ["#00FFFF", "#FF00FF", "#06b6d4", "#fb7185", "#38bdf8", "#a21caf"];

export function DashboardPageClient() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [studyTime, setStudyTime] = useState(0); // 仮: 秒数

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("etec_history");
      if (raw) {
        setHistory(JSON.parse(raw));
      }
      // 仮: 学習時間（localStorageに保存していれば取得）
      const timeRaw = window.localStorage.getItem("etec_study_time");
      if (timeRaw) setStudyTime(Number(timeRaw));
    }
  }, []);

  // サマリー（新旧履歴形式両対応）
  let totalAnswers = 0;
  let totalCorrect = 0;
  if (history.length > 0) {
    // 新形式（isCorrect）
    const hasIsCorrect = history.some(h => typeof h.isCorrect === "boolean");
    if (hasIsCorrect) {
      totalAnswers = history.filter(h => typeof h.isCorrect === "boolean").length;
      totalCorrect = history.filter(h => h.isCorrect === true).length;
    } else {
      // 旧形式（correct, total）
      totalAnswers = history.reduce((sum, h) => sum + (h.total ?? 0), 0);
      totalCorrect = history.reduce((sum, h) => sum + (h.correct ?? 0), 0);
    }
  }
  // 正答率は「最新の回答が正解なら100%、不正解なら0%」で表示（分母が増えて下がる現象を防ぐ）
  let accuracy = 0;
  if (history.length > 0) {
    const last = history[history.length - 1];
    if (typeof last.isCorrect === "boolean") {
      accuracy = last.isCorrect ? 100 : 0;
    } else if (typeof last.correct === "number" && typeof last.total === "number") {
      // 旧形式は最新履歴の正解数/総数で判定
      accuracy = last.correct === last.total ? 100 : 0;
    }
  }

  // 全カテゴリ一覧をquestions.jsonから取得
  const allCategories = Array.from(new Set((Array.isArray(questions) ? questions : []).map((q: any) => q.category))).filter(Boolean);
  // 履歴からカテゴリごとの正答率を集計
  const categoryStats: Record<string, { correct: number; total: number }> = {};
  history.forEach((h) => {
    if (!h.category) return;
    if (!categoryStats[h.category]) categoryStats[h.category] = { correct: 0, total: 0 };
    categoryStats[h.category].total += 1;
    if (h.isCorrect) categoryStats[h.category].correct += 1;
  });
  // 全カテゴリを網羅したレーダーデータを作成（履歴がなくても0%で表示）
  const radarData = allCategories.map((cat, i) => {
    const stat = categoryStats[cat] || { correct: 0, total: 0 };
    return {
      category: cat,
      accuracy: stat.total ? Math.round((stat.correct / stat.total) * 100) : 0,
      fill: neonColors[i % neonColors.length]
    };
  });

  // サマリーカード
  function SummaryCard({ title, value, unit, color }: { title: string; value: string | number; unit?: string; color?: string }) {
    return (
      <div className={`glass-panel flex flex-col items-center justify-center rounded-2xl border border-white/10 px-8 py-6 shadow-lg`} style={{ minWidth: 140 }}>
        <div className={`text-xs font-semibold mb-2 text-slate-400`}>{title}</div>
        <div className={`text-3xl font-bold mb-1`} style={{ color: color || "#00FFFF" }}>{value}{unit && <span className="text-base ml-1 text-slate-400">{unit}</span>}</div>
      </div>
    );
  }

  // 学習時間（hh:mm:ss表示）
  function formatTime(sec: number) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

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
