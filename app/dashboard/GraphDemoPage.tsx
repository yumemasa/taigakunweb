"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["1日目", "2日目", "3日目", "4日目", "5日目"],
  datasets: [
    {
      label: "正答率(%)",
      data: [60, 70, 80, 90, 95],
      borderColor: "#06b6d4",
      backgroundColor: "rgba(6,182,212,0.2)",
      tension: 0.3,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: { color: "#fff" },
    },
    title: {
      display: true,
      text: "学習進捗グラフ",
      color: "#fff",
    },
  },
  scales: {
    x: { ticks: { color: "#fff" } },
    y: { ticks: { color: "#fff" }, min: 0, max: 100 },
  },
};

export default function GraphDemoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-900">
      <div className="w-full max-w-2xl p-8 glass-panel rounded-3xl border border-white/10 shadow-lg">
        <h1 className="text-2xl font-bold text-neon-cyan mb-6">学習進捗グラフデモ</h1>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
