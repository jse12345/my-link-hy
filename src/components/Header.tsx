"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LogOut,
  User as UserIcon,
  ChevronDown,
  Copy,
  Check,
  Eye,
  Settings,
  Mail,
  Sparkles,
} from "lucide-react";
import { GoogleIcon } from "@/components/icons";
import type { AuthUser } from "@/hooks/useAuth";

interface HeaderProps {
  user: AuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ user, onLogin, onLogout }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 링크 복사 기능
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayName =
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "정시은";

  return (
    <header className="w-full bg-[#FEF08A] border-b-[3px] border-black px-4 py-3 sticky top-0 z-40">
      <div className="max-w-[800px] mx-auto flex items-center justify-between">
        {/* 네오브루탈리즘 MyLink 로고 */}
        <Link
          href="/"
          className="flex items-center gap-1.5 font-black text-base md:text-lg tracking-tight text-black hover:opacity-85 transition-opacity"
        >
          <span className="p-1 bg-black text-[#FEF08A] rounded-[6px] border border-black shadow-[2px_2px_0px_#000]">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="font-extrabold text-lg">MyLink</span>
          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-black text-white rounded-[4px] ml-1">
            HY
          </span>
        </Link>

        {/* 우측 로그인 / 사용자 정보 영역 (Step 3, 4, 5 체크리스트 규격) */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              {/* 사용자 이름 및 프로필 버튼 (클릭 시 드롭다운) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 bg-white hover:bg-neutral-50 border-[2.5px] border-black rounded-[10px] px-3 py-1.5 shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={displayName}
                      className="w-5 h-5 rounded-full border border-black object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#A7F3D0] border border-black flex items-center justify-center text-xs font-black shrink-0">
                      <UserIcon className="w-3 h-3" />
                    </div>
                  )}
                  <span className="text-xs font-black text-black truncate max-w-[120px]">
                    {displayName}님
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 stroke-[3] text-black transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* 프로필 드롭다운 메뉴 */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white border-[3px] border-black rounded-[14px] shadow-[6px_6px_0px_#000] z-50 p-3 space-y-2 text-left animate-in fade-in duration-150">
                    {/* 1. 계정 정보 헤더 */}
                    <div className="p-3 bg-[#FEF08A]/50 border-[2px] border-black rounded-[10px]">
                      <div className="flex items-center gap-2.5">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={displayName}
                            className="w-9 h-9 rounded-full border-[2px] border-black object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#A7F3D0] border-[2px] border-black flex items-center justify-center text-xs font-black shrink-0">
                            <UserIcon className="w-5 h-5" />
                          </div>
                        )}
                        <div className="overflow-hidden flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-black truncate">
                              {displayName}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 border border-black shrink-0" title="온라인" />
                          </div>
                          <p className="text-[11px] font-bold text-neutral-600 truncate flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-neutral-500 shrink-0" />
                            <span className="truncate">{user.email || "이메일 정보 없음"}</span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-black/20 flex items-center justify-between text-[10px] font-mono font-bold text-neutral-700">
                        <span>경로:</span>
                        <span className="bg-white px-1.5 py-0.5 rounded border border-black text-[10px]">
                          users/{user.uid.slice(0, 8)}...
                        </span>
                      </div>
                    </div>

                    {/* 2. 링크 복사 */}
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="w-full flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100 border-[2px] border-black rounded-[8px] text-xs font-black text-black transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Copy className="w-4 h-4 stroke-[2.5]" />
                        <span>내 링크 주소 복사</span>
                      </div>
                      {copied ? (
                        <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>복사됨!</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-500 font-bold">클릭</span>
                      )}
                    </button>

                    {/* 3. 미리보기 */}
                    <Link
                      href="/"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100 border-[2px] border-black rounded-[8px] text-xs font-black text-black transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 stroke-[2.5]" />
                        <span>내 마이링크 미리보기</span>
                      </div>
                      <span className="text-[10px] bg-black text-[#FEF08A] px-1.5 py-0.5 rounded font-black">
                        VIEW
                      </span>
                    </Link>

                    {/* 4. 링크 관리자 */}
                    <Link
                      href="/mypage"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center justify-between p-2.5 bg-[#5B5FC7] hover:bg-[#4a4ea5] text-white border-[2px] border-black rounded-[8px] text-xs font-black transition-colors cursor-pointer shadow-[2px_2px_0px_#000]"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 stroke-[2.5]" />
                        <span>링크 관리자 (/mypage)</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Step 4 & 5 체크리스트: 헤더 상시 노출 [로그아웃] 버튼 */}
              <button
                type="button"
                onClick={onLogout}
                className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 border-[2px] border-black rounded-[8px] text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            /* Step 4 & 5 체크리스트: 헤더 상시 노출 [Google로 로그인] 버튼 */
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
