"use client";

import { useState, useEffect } from "react";
import {
  ExternalLink,
  BookOpen,
  Mail,
  Share2,
  Check,
  Sparkles,
  Layers,
  ArrowUpRight,
  Plus,
  Trash2,
  QrCode,
  X,
  Palette,
  Heart,
} from "lucide-react";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  XTwitterIcon,
} from "@/components/icons";

interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  tag?: string;
  bgColor: string;
  isCustom?: boolean;
}

const DEFAULT_LINKS: LinkItem[] = [
  {
    id: "github-link",
    title: "GitHub 저장소 방문하기",
    subtitle: "my-link-hy 소스 코드 & 개발 기록 보러가기",
    url: "https://github.com/jse12345/my-link-hy",
    tag: "HOT",
    bgColor: "bg-white",
  },
  {
    id: "portfolio",
    title: "바이브 코딩 포트폴리오",
    subtitle: "AI와 함께 만든 창의적인 프로젝트 모음",
    url: "https://github.com/jse12345",
    tag: "NEW",
    bgColor: "bg-[#FDE047]", // 옐로우
  },
  {
    id: "blog",
    title: "공부 기록 & 기술 블로그",
    subtitle: "Next.js 16, TypeScript, 디자인 시스템 학습 일지",
    url: "https://github.com/jse12345",
    bgColor: "bg-[#BAE6FD]", // 하늘색
  },
  {
    id: "stack",
    title: "사용 기술 스택 & 환경",
    subtitle: "Next.js 16 · React 19 · Tailwind CSS · TypeScript",
    url: "https://nextjs.org",
    bgColor: "bg-[#A7F3D0]", // 민트
  },
  {
    id: "contact",
    title: "이메일로 연락하기",
    subtitle: "used776655@gmail.com 으로 문의주세요",
    url: "mailto:used776655@gmail.com",
    bgColor: "bg-[#FBCFE8]", // 베이비핑크
  },
];

const THEME_PALETTES = [
  { id: "yellow", name: "선샤인 옐로우", bg: "bg-[#FEF08A]", code: "#FEF08A" },
  { id: "mint", name: "프레시 민트", bg: "bg-[#A7F3D0]", code: "#A7F3D0" },
  { id: "pink", name: "버블검 핑크", bg: "bg-[#FBCFE8]", code: "#FBCFE8" },
  { id: "sky", name: "쿨 스카이", bg: "bg-[#BAE6FD]", code: "#BAE6FD" },
  { id: "lavender", name: "드림 라벤더", bg: "bg-[#DDD6FE]", code: "#DDD6FE" },
];

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [themeColor, setThemeColor] = useState("#FEF08A");
  const [links, setLinks] = useState<LinkItem[]>(DEFAULT_LINKS);

  // 새 링크 입력 폼 상태
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newBgColor, setNewBgColor] = useState("bg-white");

  const name = "정시은";
  const bio = "안녕하세요! 바이브 코딩으로 유쾌하고 가치 있는 서비스를 만드는 정시은입니다 ✨";

  // 로컬스토리지 동기화
  useEffect(() => {
    const saved = localStorage.getItem("my-link-custom-links");
    if (saved) {
      try {
        setLinks(JSON.parse(saved));
      } catch {
        // 기본값 유지
      }
    }
  }, []);

  const saveLinks = (updatedLinks: LinkItem[]) => {
    setLinks(updatedLinks);
    localStorage.setItem("my-link-custom-links", JSON.stringify(updatedLinks));
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://") && !formattedUrl.startsWith("mailto:")) {
      formattedUrl = "https://" + formattedUrl;
    }

    const newLinkItem: LinkItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || "링크 바로가기",
      url: formattedUrl,
      tag: newTag.trim() || undefined,
      bgColor: newBgColor,
      isCustom: true,
    };

    saveLinks([newLinkItem, ...links]);
    setNewTitle("");
    setNewSubtitle("");
    setNewUrl("");
    setNewTag("");
    setShowAddModal(false);
  };

  const handleDeleteLink = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveLinks(links.filter((l) => l.id !== id));
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const socialLinks = [
    {
      id: "github",
      label: "GitHub",
      url: "https://github.com/jse12345",
      icon: <GithubIcon className="w-5 h-5" />,
      bg: "bg-[#A7F3D0]",
    },
    {
      id: "instagram",
      label: "Instagram",
      url: "https://instagram.com",
      icon: <InstagramIcon className="w-5 h-5" />,
      bg: "bg-[#FBCFE8]",
    },
    {
      id: "twitter",
      label: "X (Twitter)",
      url: "https://x.com",
      icon: <XTwitterIcon className="w-5 h-5" />,
      bg: "bg-[#BAE6FD]",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com",
      icon: <LinkedinIcon className="w-5 h-5" />,
      bg: "bg-[#DDD6FE]",
    },
    {
      id: "email",
      label: "Email",
      url: "mailto:used776655@gmail.com",
      icon: <Mail className="w-5 h-5" />,
      bg: "bg-[#FED7AA]",
    },
  ];

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="min-h-screen text-black flex flex-col justify-between py-10 px-4 font-sans selection:bg-black selection:text-white transition-colors duration-300"
    >
      {/* 중앙 메인 컨테이너 (반응형: 모바일 100%, 태블릿 80% 최대 480px, 데스크탑 400px 고정) */}
      <div className="w-full md:w-[80%] md:max-w-[480px] lg:w-[400px] mx-auto flex flex-col items-center">
        {/* 상단 툴바: 테마 컬러 팔레트 & QR코드 & 공유 */}
        <div className="w-full flex items-center justify-between mb-4 px-1">
          {/* 테마 컬러 변경 원버튼들 */}
          <div className="flex items-center gap-1.5 p-1 bg-white border-[2.5px] border-black rounded-[10px] shadow-[3px_3px_0px_#000]">
            <Palette className="w-3.5 h-3.5 ml-1 text-black shrink-0" />
            {THEME_PALETTES.map((palette) => (
              <button
                key={palette.id}
                onClick={() => setThemeColor(palette.code)}
                aria-label={palette.name}
                className={`w-4 h-4 rounded-full border-[2px] border-black transition-transform cursor-pointer ${palette.bg} ${
                  themeColor === palette.code ? "scale-125 ring-2 ring-black" : "hover:scale-110"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* QR 코드 버튼 */}
            <button
              onClick={() => setShowQrModal(true)}
              aria-label="QR 코드 보기"
              className="p-1.5 bg-white hover:bg-neutral-100 border-[2.5px] border-black rounded-[8px] shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* 공유 / 복사 버튼 */}
            <button
              onClick={handleCopyLink}
              aria-label="링크 공유하기"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 border-[2.5px] border-black rounded-[8px] shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] text-xs font-black transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                  <span>복사됨!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>공유</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 프로필 카드 (Neobrutalism 스타일: 모바일 p-4, 태블릿/데스크탑 p-6) */}
        <div
          style={{ backgroundColor: themeColor }}
          className="w-full border-[3px] border-black rounded-[12px] shadow-[6px_6px_0px_#000] p-4 md:p-6 flex flex-col items-center text-center relative mb-5 transition-colors duration-300"
        >
          {/* 상단 뱃지 */}
          <div className="w-full flex justify-between items-center mb-5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border-[2.5px] border-black rounded-[6px] shadow-[2.5px_2.5px_0px_#000] text-[11px] font-black tracking-tight">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] border border-black animate-ping" />
              ONLINE
            </span>
            <span className="px-2.5 py-1 bg-black text-white text-[11px] font-black rounded-[6px]">
              VIBE CODER
            </span>
          </div>

          {/* 프로필 이미지 (가이드: 120x120 원형, border 3px solid black, shadow 4px 4px 0 black) */}
          <div className="relative mb-4">
            <div className="w-[120px] h-[120px] rounded-full bg-[#E0E7FF] border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center overflow-hidden">
              <span className="text-4xl font-black select-none tracking-tight text-black">
                시은
              </span>
            </div>
            <div className="absolute bottom-0 right-0 bg-[#F43F5E] text-white p-1.5 rounded-full border-[2.5px] border-black shadow-[2px_2px_0px_#000]">
              <Sparkles className="w-4 h-4 fill-white stroke-[2.5]" />
            </div>
          </div>

          {/* 이름 */}
          <h1 className="text-3xl font-black tracking-tight text-black mb-1">
            {name}
          </h1>

          {/* 소개글 */}
          <p className="text-sm font-semibold text-neutral-800 leading-relaxed max-w-xs break-keep mt-2">
            {bio}
          </p>

          {/* 소셜 링크 아이콘 바 */}
          <div className="flex items-center justify-center gap-2.5 mt-5">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`p-2 rounded-[8px] ${social.bg} border-[2.5px] border-black shadow-[2.5px_2.5px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 새 링크 추가 버튼 */}
        <div className="w-full mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-3 px-4 bg-white hover:bg-neutral-50 border-[3px] border-black rounded-[12px] shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>새 링크 직접 추가하기</span>
          </button>
        </div>

        {/* 링크 카드 리스트 (Neobrutalism 스타일) */}
        <div className="w-full space-y-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-between w-full p-4 rounded-[12px] ${link.bgColor} border-[3px] border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-all`}
            >
              {/* 좌측 아이콘 박스 */}
              <div className="flex items-center justify-center w-11 h-11 rounded-[8px] bg-white border-[2.5px] border-black shadow-[2px_2px_0px_#000] shrink-0">
                <BookOpen className="w-5 h-5 text-black stroke-[2.5]" />
              </div>

              {/* 중앙 타이틀 & 서브타이틀 */}
              <div className="flex-1 text-left px-3.5 overflow-hidden">
                <div className="flex items-center gap-2">
                  <h2 className="font-black text-sm sm:text-base text-black truncate">
                    {link.title}
                  </h2>
                  {link.tag && (
                    <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-black bg-black text-[#FEF08A] uppercase tracking-wider">
                      {link.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-neutral-600 truncate mt-0.5">
                  {link.subtitle}
                </p>
              </div>

              {/* 우측 액션: 사용자 추가 링크는 삭제 버튼, 기본 링크는 화살표 */}
              <div className="flex items-center gap-1.5 shrink-0">
                {link.isCustom && (
                  <button
                    onClick={(e) => handleDeleteLink(link.id, e)}
                    aria-label="링크 삭제"
                    className="w-8 h-8 rounded-[6px] bg-rose-100 hover:bg-rose-200 border-[2px] border-black flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600 stroke-[2.5]" />
                  </button>
                )}
                <div className="w-8 h-8 rounded-[6px] bg-black text-white flex items-center justify-center group-hover:bg-neutral-800 transition-colors">
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 새 링크 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border-[3px] border-black rounded-[14px] shadow-[8px_8px_0px_#000] p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-[6px] border-[2px] border-black"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>

            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 stroke-[3]" />
              새 링크 추가
            </h3>

            <form onSubmit={handleAddLink} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-black mb-1">링크 제목 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 내 인스타그램"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border-[2.5px] border-black rounded-[8px] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1">설명 문구</label>
                <input
                  type="text"
                  placeholder="예: 일상 사진 구경하러 오세요"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border-[2.5px] border-black rounded-[8px] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1">URL 주소 *</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 border-[2.5px] border-black rounded-[8px] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1">태그 (선택)</label>
                <input
                  type="text"
                  placeholder="예: NEW, 추천"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 border-[2.5px] border-black rounded-[8px] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1">카드 색상</label>
                <div className="flex gap-2">
                  {[
                    { bg: "bg-white", name: "화이트" },
                    { bg: "bg-[#FDE047]", name: "옐로우" },
                    { bg: "bg-[#A7F3D0]", name: "민트" },
                    { bg: "bg-[#FBCFE8]", name: "핑크" },
                    { bg: "bg-[#BAE6FD]", name: "스카이" },
                  ].map((color) => (
                    <button
                      key={color.bg}
                      type="button"
                      onClick={() => setNewBgColor(color.bg)}
                      className={`w-7 h-7 rounded-[6px] border-[2px] border-black ${color.bg} ${
                        newBgColor === color.bg ? "ring-2 ring-black scale-110" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 border-[2.5px] border-black rounded-[8px] font-black text-xs"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FEF08A] hover:bg-[#FDE047] border-[2.5px] border-black rounded-[8px] font-black text-xs shadow-[2px_2px_0px_#000]"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR 코드 모달 */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white border-[3px] border-black rounded-[14px] shadow-[8px_8px_0px_#000] p-6 text-center relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-[6px] border-[2px] border-black"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>

            <h3 className="text-base font-black mb-1">내 링크 QR 코드</h3>
            <p className="text-xs text-neutral-600 font-semibold mb-4">
              카메라로 스캔하면 바로 연결됩니다
            </p>

            <div className="p-3 bg-[#FEF08A] border-[2.5px] border-black rounded-[10px] inline-block shadow-[4px_4px_0px_#000] mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : "https://github.com/jse12345/my-link-hy"
                )}`}
                alt="QR Code"
                className="w-44 h-44 rounded-[6px] border-[2px] border-black"
              />
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-black text-white rounded-[8px] font-black text-xs hover:bg-neutral-800"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 심플 푸터 */}
      <footer className="text-center pt-8 text-xs font-black text-neutral-800">
        <p className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-[2px] border-black rounded-[6px] shadow-[2px_2px_0px_#000]">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>by {name} • My-Link</span>
        </p>
      </footer>
    </div>
  );
}
