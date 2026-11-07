"use client";

import { useState } from "react";
import {
  ExternalLink,
  BookOpen,
  Mail,
  Share2,
  Check,
  Sparkles,
  Layers,
  ArrowUpRight,
  Code2,
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
  icon: React.ReactNode;
  tag?: string;
  bgColor: string;
}

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);

  const name = "정시은";
  const bio = "안녕하세요! 바이브 코딩으로 유쾌하고 가치 있는 서비스를 만드는 정시은입니다 ✨";

  const socialLinks = [
    {
      id: "github",
      label: "GitHub",
      url: "https://github.com/jse12345",
      icon: <GithubIcon className="w-5 h-5" />,
      bg: "bg-[#A7F3D0]", // 민트
    },
    {
      id: "instagram",
      label: "Instagram",
      url: "https://instagram.com",
      icon: <InstagramIcon className="w-5 h-5" />,
      bg: "bg-[#FBCFE8]", // 핑크
    },
    {
      id: "twitter",
      label: "X (Twitter)",
      url: "https://x.com",
      icon: <XTwitterIcon className="w-5 h-5" />,
      bg: "bg-[#BAE6FD]", // 스카이블루
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com",
      icon: <LinkedinIcon className="w-5 h-5" />,
      bg: "bg-[#DDD6FE]", // 퍼플
    },
    {
      id: "email",
      label: "Email",
      url: "mailto:used776655@gmail.com",
      icon: <Mail className="w-5 h-5" />,
      bg: "bg-[#FED7AA]", // 오렌지
    },
  ];

  const links: LinkItem[] = [
    {
      id: "github-link",
      title: "GitHub 저장소 방문하기",
      subtitle: "my-link-hy 소스 코드 & 개발 기록 보러가기",
      url: "https://github.com/jse12345/my-link-hy",
      icon: <GithubIcon className="w-5 h-5 text-black" />,
      tag: "HOT",
      bgColor: "bg-white",
    },
    {
      id: "portfolio",
      title: "바이브 코딩 포트폴리오",
      subtitle: "AI와 함께 만든 창의적인 프로젝트 모음",
      url: "https://github.com/jse12345",
      icon: <Sparkles className="w-5 h-5 text-black" />,
      tag: "NEW",
      bgColor: "bg-[#FDE047]", // 옐로우
    },
    {
      id: "blog",
      title: "공부 기록 & 블로그",
      subtitle: "Next.js, TypeScript, 디자인 시스템 학습 일지",
      url: "https://github.com/jse12345",
      icon: <BookOpen className="w-5 h-5 text-black" />,
      bgColor: "bg-[#BAE6FD]", // 하늘색
    },
    {
      id: "stack",
      title: "사용 기술 스택 & 환경",
      subtitle: "Next.js 16 · React 19 · Tailwind CSS · TypeScript",
      url: "https://nextjs.org",
      icon: <Layers className="w-5 h-5 text-black" />,
      bgColor: "bg-[#A7F3D0]", // 민트
    },
    {
      id: "contact",
      title: "이메일로 연락하기",
      subtitle: "used776655@gmail.com 으로 문의주세요",
      url: "mailto:used776655@gmail.com",
      icon: <Mail className="w-5 h-5 text-black" />,
      bgColor: "bg-[#FBCFE8]", // 베이비핑크
    },
  ];

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

  return (
    <div className="min-h-screen bg-[#FEF08A] text-black flex flex-col justify-between py-12 px-4 font-sans selection:bg-black selection:text-[#FEF08A]">
      {/* 중앙 메인 컨테이너 ([반응형 가이드] 모바일: 100% | 태블릿: 80%, 최대 480px | 데스크탑: 400px 고정) */}
      <div className="w-full md:w-[80%] md:max-w-[480px] lg:w-[400px] mx-auto flex flex-col items-center">
        {/* 프로필 카드 (모바일 패딩: 16px, 태블릿/데스크탑 패딩: 24px) */}
        <div className="w-full bg-[#FEF08A] border-[3px] border-black rounded-[12px] shadow-[6px_6px_0px_#000] p-4 md:p-6 flex flex-col items-center text-center relative mb-6">
          {/* 상단 뱃지 & 공유 버튼 */}
          <div className="w-full flex justify-between items-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-[2.5px] border-black rounded-[8px] shadow-[3px_3px_0px_#000] text-xs font-black tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] border border-black animate-pulse" />
              ONLINE
            </span>

            <button
              onClick={handleCopyLink}
              aria-label="링크 공유하기"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-neutral-100 border-[2.5px] border-black rounded-[8px] shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] text-xs font-black transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                  <span>복사됨!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  <span>공유</span>
                </>
              )}
            </button>
          </div>

          {/* 프로필 이미지 (가이드: 원형 120x120, border 3px solid black, shadow 4px 4px 0 black) */}
          <div className="relative mb-5">
            <div className="w-[120px] h-[120px] rounded-full bg-[#E0E7FF] border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center overflow-hidden">
              <span className="text-4xl font-black select-none tracking-tight text-black">
                시은
              </span>
            </div>
            <div className="absolute bottom-0 right-0 bg-[#F43F5E] text-white p-1.5 rounded-full border-[2.5px] border-black shadow-[2px_2px_0px_#000]">
              <Sparkles className="w-4 h-4 fill-white text-white stroke-[2.5]" />
            </div>
          </div>

          {/* 이름 */}
          <h1 className="text-3xl font-black tracking-tight text-black mb-1">
            {name}
          </h1>

          {/* 역할 태그 뱃지 */}
          <div className="inline-block px-3 py-0.5 bg-black text-[#FEF08A] font-extrabold text-xs rounded-[6px] tracking-wide mb-3">
            VIBE CODER
          </div>

          {/* 소개글 */}
          <p className="text-sm font-semibold text-neutral-800 leading-relaxed max-w-xs break-keep">
            {bio}
          </p>

          {/* 소셜 링크 아이콘 바 */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`p-2.5 rounded-[10px] ${social.bg} border-[2.5px] border-black shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 링크 카드 리스트 (Neobrutalism 스타일 적용) */}
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
                {link.icon}
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

              {/* 우측 화살표 아이콘 */}
              <div className="w-8 h-8 rounded-[6px] bg-black text-white flex items-center justify-center shrink-0 group-hover:bg-neutral-800 transition-colors">
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <footer className="text-center pt-10 text-xs font-bold text-neutral-800">
        <p className="inline-block px-3 py-1 bg-white border-[2px] border-black rounded-[6px] shadow-[2px_2px_0px_#000]">
          © 2026 {name} • My-Link Neobrutalism
        </p>
      </footer>
    </div>
  );
}
