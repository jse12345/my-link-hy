"use client";

import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";
import { GoogleIcon } from "@/components/icons";
import type { AuthUser } from "@/hooks/useAuth";

interface HeaderProps {
  user: AuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ user, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* 로고: MyLink */}
        <Link
          href="/"
          className="flex items-center gap-1 font-black text-xl md:text-2xl tracking-tight text-blue-600 hover:opacity-90 transition-opacity"
        >
          <span>MyLink</span>
        </Link>

        {/* 우측 로그인 / 사용자 정보 영역 */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5 bg-neutral-50 border border-neutral-200 rounded-full px-3 py-1.5 shadow-sm">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "프로필"}
                  className="w-6 h-6 rounded-full border border-neutral-300 object-cover shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center text-xs font-bold shrink-0">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="text-xs md:text-sm font-bold text-neutral-800 truncate max-w-[120px]">
                {user.displayName || "사용자"}님
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="ml-1 px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-full text-xs font-semibold text-neutral-600 flex items-center gap-1 cursor-pointer transition-all"
                title="로그아웃"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs md:text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
