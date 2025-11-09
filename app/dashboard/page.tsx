import { DashboardPageClient } from "./DashboardPageClient";

export default function DashboardPage() {
  // 最上部にトップへのリンクを追加し、DashboardPageClientも表示
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      <div className="fixed top-6 left-6 z-50">
        <a href="/" className="glass-panel flex items-center gap-2 rounded-full px-6 py-2 text-base font-medium text-white backdrop-blur-xl border border-white/10 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-sky-400 mr-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m5-11v11a1 1 0 001 1h5a1 1 0 001-1V10" /></svg>
          トップ
        </a>
      </div>
      <DashboardPageClient />
    </div>
  );
}
