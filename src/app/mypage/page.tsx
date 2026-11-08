"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ExternalLink,
  Link2,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Sparkles,
  BookOpen,
  FileText,
  Layers,
  Mail,
  Zap,
} from "lucide-react";

import { DUMMY_LINKS, type LinkItem } from "@/data/links";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MyPage() {
  const [links, setLinks] = useState<LinkItem[]>(DUMMY_LINKS);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // 로컬스토리지에서 기존 링크 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("my-link-custom-links");
    if (saved) {
      try {
        setLinks(JSON.parse(saved));
        return;
      } catch {
        // parsing error fallback
      }
    }

    // 초기 링크 json fallback
    fetch("/data/links.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLinks(data);
          localStorage.setItem("my-link-custom-links", JSON.stringify(data));
        }
      })
      .catch(() => {
        // DUMMY_LINKS 유지
      });
  }, []);

  // 로컬스토리지 저장 함수
  const saveLinks = (updated: LinkItem[]) => {
    setLinks(updated);
    localStorage.setItem("my-link-custom-links", JSON.stringify(updated));
  };

  // 실습 2 & 3: 추가 버튼 클릭 시 검증 및 동작
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    // 검증 1: 제목 비어있으면 alert
    if (!trimmedTitle) {
      alert("제목을 입력해주세요");
      setErrorMessage("제목을 입력해주세요.");
      return;
    }

    // 검증 2: 주소 비어있으면 alert
    if (!trimmedUrl) {
      alert("주소를 입력해주세요");
      setErrorMessage("주소를 입력해주세요.");
      return;
    }

    // 검증 3: 주소 형식 체크
    let formattedUrl = trimmedUrl;
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://") &&
      !formattedUrl.startsWith("mailto:")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }

    // 간단한 URL 유효성 검사
    try {
      if (!formattedUrl.startsWith("mailto:")) {
        new URL(formattedUrl);
      }
    } catch {
      alert("올바른 주소를 입력해주세요");
      setErrorMessage("올바른 주소를 입력해주세요 (예: https://example.com)");
      return;
    }

    // 검증 통과 4: 목록에 추가
    const newLinkItem: LinkItem = {
      id: "link-" + Date.now().toString(),
      title: trimmedTitle,
      subtitle: "마이페이지에서 등록된 링크",
      url: formattedUrl,
      category: "project",
      tag: "MY",
      bgColor: "bg-white",
      clickCount: 0,
      isCustom: true,
    };

    saveLinks([newLinkItem, ...links]);

    // 입력 칸 자동 비우기
    setTitle("");
    setUrl("");
    setSuccessMessage("새 링크가 성공적으로 추가되었습니다!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // 링크 삭제 함수
  const handleDeleteLink = (id: string) => {
    if (confirm("정말 이 링크를 삭제하시겠습니까?")) {
      saveLinks(links.filter((item) => item.id !== id));
    }
  };

  const getLinkIcon = (link: LinkItem) => {
    if (link.tag === "GITHUB" || link.url.includes("github.com")) {
      return <FolderGit2 className="w-4 h-4 text-black stroke-[2.5]" />;
    }
    if (link.tag === "HOT" || link.category === "project") {
      return <Sparkles className="w-4 h-4 text-amber-500 stroke-[2.5]" />;
    }
    if (link.tag === "BLOG" || link.category === "blog") {
      return <BookOpen className="w-4 h-4 text-sky-600 stroke-[2.5]" />;
    }
    if (link.tag === "RESUME") {
      return <FileText className="w-4 h-4 text-purple-600 stroke-[2.5]" />;
    }
    if (link.tag === "TECH" || link.category === "study") {
      return <Layers className="w-4 h-4 text-emerald-600 stroke-[2.5]" />;
    }
    if (link.category === "contact" || link.url.startsWith("mailto:")) {
      return <Mail className="w-4 h-4 text-orange-600 stroke-[2.5]" />;
    }
    if (link.category === "social") {
      return <Zap className="w-4 h-4 text-rose-500 stroke-[2.5]" />;
    }
    return <Link2 className="w-4 h-4 text-black stroke-[2.5]" />;
  };

  return (
    <div className="min-h-screen min-w-[360px] bg-[#FEF08A] text-black flex flex-col justify-between selection:bg-black selection:text-[#FEF08A] font-sans relative overflow-x-auto">
      {/* 상단 네비게이션 티커 */}
      <div className="w-full bg-black text-[#FEF08A] py-2 border-b-[3px] border-black overflow-hidden whitespace-nowrap font-black text-xs tracking-wider select-none shadow-[0px_4px_0px_#000]">
        <div className="inline-block animate-[marquee_20s_linear_infinite]">
          ⚡ MY-LINK MANAGEMENT • NEXT.JS 16 & TYPESCRIPT • 내 링크 관리 페이지 • /mypage •&nbsp;
        </div>
        <div className="inline-block animate-[marquee_20s_linear_infinite]" aria-hidden="true">
          ⚡ MY-LINK MANAGEMENT • NEXT.JS 16 & TYPESCRIPT • 내 링크 관리 페이지 • /mypage •&nbsp;
        </div>
      </div>

      {/* 중앙 메인 컨테이너 (모바일 360px 보장, 태블릿 최대 480px, 데스크탑 400px 고정) */}
      <main className="w-full min-w-[360px] md:w-[80%] md:max-w-[480px] lg:w-[400px] mx-auto flex flex-col items-center py-6 px-4 flex-1">
        
        {/* 상단 헤더 영역 */}
        <header className="w-full mb-6">
          <div className="flex items-center justify-between mb-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 border-[2.5px] border-black rounded-[8px] shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] font-black text-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
              <span>메인 프로필로</span>
            </Link>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-[#FEF08A] border-[2px] border-black rounded-[6px] text-[11px] font-black tracking-tight">
              /mypage
            </span>
          </div>

          <div className="p-4 bg-white border-[3px] border-black rounded-[12px] shadow-[5px_5px_0px_#000] text-center">
            <h1 className="text-2xl font-black tracking-tight mb-1">
              내 링크 관리
            </h1>
            <p className="text-xs font-bold text-neutral-600">
              새로운 링크를 추가하고 목록을 관리해보세요!
            </p>
          </div>
        </header>

        {/* 중간: 링크 추가 폼 영역 */}
        <section className="w-full bg-white border-[3px] border-black rounded-[12px] shadow-[6px_6px_0px_#000] p-5 mb-6">
          <div className="flex items-center justify-between mb-4 border-b-[2.5px] border-black pb-2.5">
            <h2 className="font-black text-base flex items-center gap-2">
              <Plus className="w-5 h-5 stroke-[3]" />
              링크 추가하기
            </h2>
            <span className="text-[10px] font-black bg-[#DDD6FE] text-black px-2 py-0.5 rounded-[4px] border border-black">
              실습 1·2·3
            </span>
          </div>

          {/* 에러 및 성공 안내 메시지 */}
          {errorMessage && (
            <div className="mb-3 p-2.5 bg-rose-100 border-[2px] border-rose-600 rounded-[8px] flex items-center gap-2 text-rose-700 text-xs font-black">
              <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-3 p-2.5 bg-emerald-100 border-[2px] border-emerald-600 rounded-[8px] flex items-center gap-2 text-emerald-800 text-xs font-black">
              <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleAddLink} className="space-y-4">
            {/* 1. 제목 입력 칸 (세로 배치) */}
            <div>
              <label htmlFor="link-title" className="block text-xs font-black mb-1.5 text-neutral-900">
                1. 링크 제목 *
              </label>
              <input
                id="link-title"
                type="text"
                placeholder="예: 내 기술 블로그"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-full px-3.5 py-2.5 bg-white border-[2.5px] border-black rounded-[8px] shadow-[2px_2px_0px_#000] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-neutral-400"
              />
            </div>

            {/* 2. 주소 입력 칸 (세로 배치) */}
            <div>
              <label htmlFor="link-url" className="block text-xs font-black mb-1.5 text-neutral-900">
                2. 주소 (URL) *
              </label>
              <input
                id="link-url"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-full px-3.5 py-2.5 bg-white border-[2.5px] border-black rounded-[8px] shadow-[2px_2px_0px_#000] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-neutral-400"
              />
            </div>

            {/* 3. 추가 버튼 (보라색 #5B5FC7 스타일 요구사항 100% 반영) */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#5B5FC7] hover:bg-[#4a4ea5] text-white border-[3px] border-black rounded-[10px] shadow-[4px_4px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>추가하기</span>
              </button>
            </div>
          </form>
        </section>

        {/* 하단: 링크 목록 영역 */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-black text-base flex items-center gap-1.5">
              <span>내 링크 목록</span>
              <span className="text-xs px-2 py-0.5 bg-black text-[#FEF08A] rounded-full border border-black font-extrabold">
                {links.length}
              </span>
            </h2>
            <span className="text-[11px] font-bold text-neutral-700">
              실시간 반영 중
            </span>
          </div>

          <div className="space-y-3">
            {links.length === 0 ? (
              <div className="p-8 bg-white border-[3px] border-black rounded-[12px] shadow-[4px_4px_0px_#000] text-center">
                <p className="font-black text-sm text-neutral-600">
                  등록된 링크가 없습니다. 위에서 새 링크를 추가해보세요!
                </p>
              </div>
            ) : (
              links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3.5 bg-white border-[3px] border-black rounded-[12px] shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-0.5"
                >
                  {/* 좌측 아이콘 */}
                  <div className="w-9 h-9 rounded-[8px] bg-neutral-100 border-[2px] border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000]">
                    {getLinkIcon(link)}
                  </div>

                  {/* 중앙 제목 & URL */}
                  <div className="flex-1 text-left px-3 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-sm text-black truncate max-w-[160px]">
                        {link.title}
                      </h3>
                      {link.tag && (
                        <Badge variant="default" size="sm">
                          {link.tag}
                        </Badge>
                      )}
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-neutral-500 hover:text-black truncate block mt-0.5"
                    >
                      {link.url}
                    </a>
                  </div>

                  {/* 우측 버튼: 새창 열기 & 삭제 */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="링크 열기"
                      className="w-8 h-8 rounded-[6px] bg-neutral-100 hover:bg-neutral-200 border-[2px] border-black flex items-center justify-center transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      aria-label="링크 삭제"
                      className="w-8 h-8 rounded-[6px] bg-rose-100 hover:bg-rose-200 border-[2px] border-black flex items-center justify-center transition-colors cursor-pointer text-rose-600"
                    >
                      <Trash2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="text-center py-5 text-xs font-black text-neutral-800 border-t-[3px] border-black bg-white/70">
        <p>내 링크 관리자 페이지 • /mypage</p>
      </footer>
    </div>
  );
}
