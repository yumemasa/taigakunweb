import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const noto = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto" });

export const metadata: Metadata = {
  title: "ETEC Class2 Ultimate Guide",
  description: "組込みソフトウェア技術者試験（ETEC）合格のための学習プラットフォーム"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} ${noto.variable} min-h-screen bg-slate-950 text-slate-100 antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
