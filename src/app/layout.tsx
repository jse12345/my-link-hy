import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "정시은 | My Link",
  description: "정시은 님의 Neobrutalism 스타일 감각적인 개인 프로필 링크 모음",
  openGraph: {
    title: "정시은 | My Link",
    description: "안녕하세요! 바이브 코딩으로 가치 있는 서비스를 만드는 정시은입니다 ✨",
    type: "profile",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("h-full antialiased font-sans")}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
