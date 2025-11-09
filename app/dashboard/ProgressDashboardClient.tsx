"use client";

import { useState } from "react";

export function ProgressDashboardClient() {
  // 仮の進捗データ（本番は zustand や localStorage で管理）
  const quizCorrect = 0;
  const quizTotal = 0;
  const randomCorrect = 0;
  const randomTotal = 0;
  const reviewCorrect = 0;
  const reviewTotal = 0;

  // 進捗率計算
  const quizRate = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : 0;
  const randomRate = randomTotal ? Math.round((randomCorrect / randomTotal) * 100) : 0;
  const reviewRate = reviewTotal ? Math.round((reviewCorrect / reviewTotal) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      <div className="w-full max-w-2xl flex justify-end mb-2">
        <a href="/" className="glass-panel rounded-full border border-white/10 px-5 py-2 text-base text-white hover:border-neon-cyan/70 transition">トップへ</a>
      </div>
      <h1 className="text-3xl font-bold text-neon-cyan mb-8">学習進捗ダッシュボード</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <a href="/quiz" className="glass-panel rounded-3xl border border-white/10 p-8 text-center hover:border-neon-cyan/70 transition">
          <div className="mb-2 text-lg text-slate-400">クイズ形式</div>
          <div className="text-4xl font-bold text-neon-cyan">{quizRate}%</div>
          <div className="mt-2 text-slate-400">{quizCorrect} / {quizTotal} 正解</div>
          <div className="mt-4 text-neon-cyan text-sm">→ 問題を解く</div>
        </a>
        <a href="/random" className="glass-panel rounded-3xl border border-white/10 p-8 text-center hover:border-neon-magenta/70 transition">
          <div className="mb-2 text-lg text-slate-400">ランダム出題</div>
          <div className="text-4xl font-bold text-neon-magenta">{randomRate}%</div>
          <div className="mt-2 text-slate-400">{randomCorrect} / {randomTotal} 正解</div>
          <div className="mt-4 text-neon-magenta text-sm">→ 問題を解く</div>
        </a>
        <a href="/review" className="glass-panel rounded-3xl border border-white/10 p-8 text-center hover:border-emerald-400/70 transition">
          <div className="mb-2 text-lg text-slate-400">反復復習</div>
          <div className="text-4xl font-bold text-emerald-400">{reviewRate}%</div>
          <div className="mt-2 text-slate-400">{reviewCorrect} / {reviewTotal} 正解</div>
          <div className="mt-4 text-emerald-400 text-sm">→ 問題を解く</div>
        </a>
      </div>
      <div className="mt-8 text-slate-400">※本番は全学習モードの進捗・正答率を自動集計します</div>

      {/* 履歴表示エリア */}
      <div className="mt-12 w-full max-w-2xl glass-panel rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-neon-cyan mb-4">過去の学習履歴</h2>
        <ul className="text-slate-300 text-sm space-y-2">
          <li>2025/11/08 クイズ 10問正解 / 15問</li>
          <li>2025/11/07 ランダム 8問正解 / 10問</li>
          <li>2025/11/06 復習 5問正解 / 7問</li>
          {/* 本番はlocalStorageやDBから履歴を取得して表示 */}
        </ul>
      </div>
    </div>
  );
}
