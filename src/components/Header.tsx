"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LogOut,
  User as UserIcon,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Settings,
  Mail,
  ShieldCheck,
} from "lucide-react";
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
    "사용자";

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

        {/* 우측 로그인 / 사용자 정보 및 프로필 드롭다운 */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* 프로필 버튼 (클릭 시 드롭다운 토글) */}
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 rounded-full px-3 py-1.5 shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="w-6 h-6 rounded-full border border-neutral-300 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center text-xs font-bold shrink-0">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
                <span className="text-xs md:text-sm font-bold text-neutral-800 truncate max-w-[120px]">
                  {displayName}님
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* [UI/UX 개선] 프로필 드롭다운 메뉴 */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                  {/* 1. 계정 정보 헤더 */}
                  <div className="p-3 bg-neutral-50 rounded-xl mb-1.5 border border-neutral-100">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={displayName}
                          className="w-10 h-10 rounded-full border border-neutral-300 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center text-sm font-bold shrink-0">
                          <UserIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div className="overflow-hidden flex-1 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-neutral-900 truncate">
                            {displayName}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="로그인 상태" />
                        </div>
                        <p className="text-xs text-neutral-500 truncate flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="truncate">{user.email || "이메일 정보 없음"}</span>
                        </p>
                      </div>
                    </div>
                    {/* Firestore UID 정보 */}
                    <div className="mt-2 pt-2 border-t border-neutral-200/80 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                      <span>UID:</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 font-medium">
                        {user.uid.slice(0, 10)}...
                      </span>
                    </div>
                  </div>

                  {/* 2. 링크 복사 */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Copy className="w-4 h-4 text-neutral-500" />
                      <span>내 링크 복사</span>
                    </div>
                    {copied ? (
                      <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>복사됨!</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400">클릭하여 복사</span>
                    )}
                  </button>

                  {/* 3. 미리보기 (내 프로필) */}
                  <Link
                    href="/"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span>내 마이링크 미리보기</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </Link>

                  {/* 4. 링크 관리자 (/mypage) */}
                  <Link
                    href="/mypage"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-neutral-500" />
                      <span>링크 관리자 (/mypage)</span>
                    </div>
                  </Link>

                  <div className="my-1 border-t border-neutral-100" />

                  {/* 5. 로그아웃 버튼 */}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              )}
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
