"use client";

import { useState, useEffect } from "react";
import {
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
  Zap,
  Star,
  ExternalLink,
} from "lucide-react";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  XTwitterIcon,
} from "@/components/icons";

import { DUMMY_LINKS, type LinkItem } from "@/data/links";

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
  const [links, setLinks] = useState<LinkItem[]>(DUMMY_LINKS);

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
      className="min-h-screen min-w-[360px] text-black flex flex-col justify-between selection:bg-black selection:text-[#FEF08A] transition-colors duration-300 font-sans relative overflow-x-auto"
    >
      {/* 상단 롤링 마퀴 띠 배너 (Neobrutalism 시그니처 롤링 티커) */}
      <div className="w-full bg-black text-[#FEF08A] py-2 border-b-[3px] border-black overflow-hidden whitespace-nowrap font-black text-xs tracking-wider select-none shadow-[0px_4px_0px_#000]">
        <div className="inline-block animate-[marquee_20s_linear_infinite]">
          ⚡ JEONG SI-EUN • MY-LINK 2026 • NEXT.JS 16 & TYPESCRIPT • VIBE CODING • OPEN TO CONNECT • ⚡ JEONG SI-EUN • MY-LINK 2026 • NEXT.JS 16 & TYPESCRIPT • VIBE CODING • OPEN TO CONNECT •&nbsp;
        </div>
        <div className="inline-block animate-[marquee_20s_linear_infinite]" aria-hidden="true">
          ⚡ JEONG SI-EUN • MY-LINK 2026 • NEXT.JS 16 & TYPESCRIPT • VIBE CODING • OPEN TO CONNECT • ⚡ JEONG SI-EUN • MY-LINK 2026 • NEXT.JS 16 & TYPESCRIPT • VIBE CODING • OPEN TO CONNECT •&nbsp;
        </div>
      </div>

      {/* 중앙 메인 컨테이너 (표준 규격: 모바일 360px 고정/100%, 태블릿 80% 최대 480px, 데스크탑/노트북 400px 고정) */}
      <main className="w-full min-w-[360px] md:w-[80%] md:max-w-[480px] lg:w-[400px] mx-auto flex flex-col items-center py-8 px-4 flex-1">
        {/* 상단 컨트롤 바 */}
        <header className="w-full flex items-center justify-between mb-4 px-1">
          {/* 테마 컬러 팔레트 */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white border-[3px] border-black rounded-[10px] shadow-[3px_3px_0px_#000]">
            <Palette className="w-3.5 h-3.5 ml-1 text-black shrink-0 stroke-[2.5]" />
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
              className="p-2 bg-white hover:bg-neutral-100 border-[3px] border-black rounded-[10px] shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* 공유 / 복사 버튼 */}
            <button
              onClick={handleCopyLink}
              aria-label="링크 공유하기"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-neutral-100 border-[3px] border-black rounded-[10px] shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] text-xs font-black transition-all cursor-pointer"
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
        </header>

        {/* 프로필 카드 (Neobrutalism 스타일 가이드 100% 일치) */}
        <section
          style={{ backgroundColor: themeColor }}
          className="w-full min-w-[280px] border-[3px] border-black rounded-[12px] shadow-[6px_6px_0px_#000] p-4 md:p-6 flex flex-col items-center text-center relative mb-5 transition-colors duration-300"
        >
          {/* 키치 스티커 배지 (왼쪽 위 45도 기울어진 스티커) */}
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

          {/* 프로필 이미지 (가이드: 원형 120x120, border 3px solid black, shadow 4px 4px 0 black) */}
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

          {/* 이름 (세로로 안 쪼개지도록 whitespace-nowrap 방어) */}
          <h1 className="text-3xl font-black tracking-tight text-black mb-1 whitespace-nowrap">
            {name}
          </h1>

          {/* 직함 뱃지 */}
          <div className="inline-block px-3 py-1 bg-black text-[#FEF08A] font-black text-xs rounded-[6px] tracking-wide mb-3 shadow-[2px_2px_0px_#fff] whitespace-nowrap">
            VIBE CODER ✨
          </div>

          {/* 소개글 */}
          <p className="text-sm font-bold text-neutral-900 leading-relaxed max-w-xs break-keep mt-1">
            {bio}
          </p>

          {/* 소셜 링크 아이콘 바 */}
          <div className="flex items-center justify-center gap-2.5 mt-5 flex-wrap">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`p-2.5 rounded-[10px] ${social.bg} border-[2.5px] border-black shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all shrink-0`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </section>

        {/* 새 링크 직접 추가 버튼 */}
        <div className="w-full mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-3.5 px-4 bg-white hover:bg-neutral-50 border-[3px] border-black rounded-[12px] shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>새 링크 직접 추가하기</span>
          </button>
        </div>

        {/* 링크 카드 리스트 (Neobrutalism 스타일) */}
        <div className="w-full space-y-3.5">
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
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-black bg-black text-white uppercase tracking-wider">
                      {link.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-neutral-600 truncate mt-0.5">
                  {link.subtitle}
                </p>
              </div>

              {/* 우측 액션 버튼 */}
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
      </main>

      {/* 새 링크 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border-[3px] border-black rounded-[14px] shadow-[8px_8px_0px_#000] p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-[6px] border-[2px] border-black cursor-pointer"
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
                  className="w-full px-3 py-2 border-[2.5px] border-black rounded-[8px] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1">설명 문구</label>
                <input
                  type="text"
                  placeholder="예: 일상 사진 구경하러 오세요"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border-[2.5px] border-black rounded-[8px] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black"
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
                  className="w-full px-3 py-2 border-[2.5px] border-black rounded-[8px] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black mb-1">태그 (선택)</label>
                <input
                  type="text"
                  placeholder="예: NEW, 추천"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 border-[2.5px] border-black rounded-[8px] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black"
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
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 border-[2.5px] border-black rounded-[8px] font-black text-xs cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FEF08A] hover:bg-[#FDE047] border-[2.5px] border-black rounded-[8px] font-black text-xs shadow-[2px_2px_0px_#000] cursor-pointer"
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
              className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-[6px] border-[2px] border-black cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>

            <h3 className="text-base font-black mb-1">내 링크 QR 코드</h3>
            <p className="text-xs text-neutral-600 font-bold mb-4">
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
              className="w-full py-2 bg-black text-white rounded-[8px] font-black text-xs hover:bg-neutral-800 cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 심플 푸터 */}
      <footer className="text-center py-6 text-xs font-black text-neutral-800 border-t-[3px] border-black bg-white/70">
        <p className="inline-flex items-center gap-1.5">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>by {name} • My-Link Neobrutalism</span>
        </p>
      </footer>
    </div>
  );
}
