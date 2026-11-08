import React from "react";
import { Sparkles, Zap } from "lucide-react";
import { SocialBar } from "./SocialBar";

interface ProfileHeaderProps {
  name: string;
  bio: string;
  themeColor: string;
}

export function ProfileHeader({ name, bio, themeColor }: ProfileHeaderProps) {
  return (
    <section
      style={{ backgroundColor: themeColor }}
      className="w-full min-w-[280px] border-[3px] border-black rounded-[12px] shadow-[6px_6px_0px_#000] p-4 md:p-6 flex flex-col items-center text-center relative mb-5 transition-colors duration-300"
    >
      {/* 키치 스티커 배지 (좌측 상단 -12도 회전) */}
      <div className="absolute -top-3.5 -left-3.5 rotate-[-12deg] z-10">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F43F5E] text-white border-[2.5px] border-black rounded-[8px] shadow-[3px_3px_0px_#000] text-[11px] font-black tracking-tight whitespace-nowrap">
          <Zap className="w-3 h-3 fill-white stroke-[2.5]" />
          COOL!
        </span>
      </div>

      {/* 상단 상태 뱃지 */}
      <div className="w-full flex justify-end items-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border-[2.5px] border-black rounded-[6px] shadow-[2.5px_2.5px_0px_#000] text-[11px] font-black tracking-tight whitespace-nowrap">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] border-[1.5px] border-black animate-pulse" />
          ONLINE
        </span>
      </div>

      {/* 프로필 원형 아바타 (120px x 120px, 3px 테두리, 4px 하드 그림자) */}
      <div className="relative mb-4 shrink-0">
        <div className="w-[120px] h-[120px] rounded-full bg-[#E0E7FF] border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center overflow-hidden shrink-0">
          <span className="text-4xl font-black select-none tracking-tight text-black whitespace-nowrap">
            시은
          </span>
        </div>
        <div className="absolute bottom-0 right-0 bg-[#F43F5E] text-white p-2 rounded-full border-[2.5px] border-black shadow-[2px_2px_0px_#000]">
          <Sparkles className="w-4 h-4 fill-white stroke-[2.5]" />
        </div>
      </div>

      {/* 이름 (화면 좁혀져도 세로 쪼개짐 방지) */}
      <h1 className="text-3xl font-black tracking-tight text-black mb-1 whitespace-nowrap">
        {name}
      </h1>

      {/* 직함 뱃지 */}
      <div className="inline-block px-3 py-1 bg-black text-[#FEF08A] font-black text-xs rounded-[6px] tracking-wide mb-3 shadow-[2px_2px_0px_#fff] whitespace-nowrap">
        VIBE CODER ✨
      </div>

      {/* 한 줄 소개글 */}
      <p className="text-sm font-bold text-neutral-900 leading-relaxed max-w-xs break-keep mt-1">
        {bio}
      </p>

      {/* 소셜 링크 아이콘 바 */}
      <SocialBar />
    </section>
  );
}
