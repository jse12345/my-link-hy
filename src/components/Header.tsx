"use client";

import Link from "next/link";
import { Sparkles, LogOut, ShieldCheck, User as UserIcon } from "lucide-react";
import { GoogleIcon } from "@/components/icons";
import type { AuthUser } from "@/hooks/useAuth";

interface HeaderProps {
  user: AuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ user, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="w-full bg-[#FEF08A] border-b-[3px] border-black px-4 py-3 sticky top-0 z-40">
      <div className="max-w-[800px] mx-auto flex items-center justify-between">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center gap-1.5 font-black text-base md:text-lg tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="p-1 bg-black text-[#FEF08A] rounded-[6px] border border-black shadow-[2px_2px_0px_#000]">
            <Sparkles className="w-4 h-4" />
          </span>
          <span>마이링크</span>
          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-black text-white rounded-[4px] ml-1">
            HY
          </span>
        </Link>

        {/* 우측 로그인 / 사용자 정보 영역 */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-white border-[2.5px] border-black rounded-[10px] px-2.5 py-1.5 shadow-[3px_3px_0px_#000]">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "프로필"}
                  className="w-6 h-6 rounded-full border border-black object-cover shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#A7F3D0] border border-black flex items-center justify-center text-xs font-black shrink-0">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-black leading-tight max-w-[100px] truncate">
                  {user.displayName || "사용자"}님
                </span>
                {user.isMock && (
                  <span className="text-[9px] font-bold text-amber-600 leading-tight">
                    테스트 모드
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="ml-1 px-2 py-1 bg-neutral-100 hover:bg-neutral-200 border-[1.5px] border-black rounded-[6px] text-[11px] font-black flex items-center gap-1 cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
                title="로그아웃"
              >
                <LogOut className="w-3 h-3 stroke-[2.5]" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 border-[2.5px] border-black rounded-[10px] shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] text-xs font-black cursor-pointer transition-all"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Google로 로그인</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
