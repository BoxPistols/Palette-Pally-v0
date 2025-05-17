import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayoutWrapper } from "./client-layout-wrapper"; // 新しいコンポーネントをインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Palette Pally - カラーパレット作成ツール",
  description: "カラーパレットの作成・管理・アクセシビリティチェックを簡単に行えるツール",
  icons: {
    icon: "/favicon.png",
  },
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* 
          metadata.icons でファビコンが指定されている場合、Next.js が自動的にリンクを挿入するため、
          この手動の <link> タグは冗長になる可能性があります。
          クリーンな状態を保つため、ここでは削除しておくことを推奨します。
        */}
        {/* <link rel="icon" href="/favicon.png" type="image/png" /> */}
      </head>
      <body className={inter.className}>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
