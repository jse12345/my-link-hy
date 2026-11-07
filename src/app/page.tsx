"use client";

import { useState } from "react";
import {
  Globe,
  ExternalLink,
  BookOpen,
  Mail,
  Share2,
  Check,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  XTwitterIcon,
} from "@/components/icons";

interface SimpleLink {
  id: string;
  title: string;
  url: string;
  icon?: React.ReactNode;
}

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);

  const name = "정시은";
  const bio = "안녕하세요! 바이브 코딩으로 가치 있는 서비스를 만드는 정시은입니다 ✨";

  const socialLinks = [
    {
      id: "github",
      label: "GitHub",
      url: "https://github.com/jse12345",
      icon: <GithubIcon className="w-5 h-5" />,
    },
    {
      id: "instagram",
      label: "Instagram",
      url: "https://instagram.com",
      icon: <InstagramIcon className="w-5 h-5" />,
    },
    {
      id: "twitter",
      label: "X (Twitter)",
      url: "https://x.com",
      icon: <XTwitterIcon className="w-5 h-5" />,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com",
      icon: <LinkedinIcon className="w-5 h-5" />,
    },
    {
      id: "email",
      label: "Email",
      url: "mailto:used776655@gmail.com",
      icon: <Mail className="w-5 h-5" />,
    },
  ];

  const links: SimpleLink[] = [
    {
      id: "github-link",
      title: "GitHub 저장소 방문하기",
      url: "https://github.com",
      icon: <GithubIcon className="w-5 h-5" />,
    },
    {
      id: "blog",
      title: "공부 기록 & 블로그",
      url: "https://blog.example.com",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "portfolio",
      title: "바이브 코딩 프로젝트 포트폴리오",
      url: "https://portfolio.example.com",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: "contact",
      title: "이메일로 연락하기",
      url: "mailto:gildong@example.com",
      icon: <Mail className="w-5 h-5" />,
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 flex flex-col justify-between py-12 px-4 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      {/* 본문 콘텐츠 중앙 컨테이너 */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* 상단 공유 버튼 */}
        <div className="w-full flex justify-end mb-6">
          <button
            onClick={handleCopyLink}
            aria-label="링크 공유하기"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 shadow-2xs transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">복사됨</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>공유</span>
              </>
            )}
          </button>
        </div>

        {/* 프로필 이미지 / 아바타 */}
        <div className="relative mb-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-850 dark:to-neutral-800 border-2 border-white dark:border-neutral-900 shadow-md flex items-center justify-center">
            <span className="text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-neutral-100 select-none">
              시
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-1.5 rounded-full shadow-sm">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 이름 */}
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {name}
        </h1>

        {/* 소개글 (중앙 정렬) */}
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xs sm:max-w-sm break-keep">
          {bio}
        </p>

        {/* 소셜 링크 아이콘 목록 (중앙 정렬) */}
        <div className="flex items-center justify-center gap-3 mt-6 mb-8">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-2.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 shadow-2xs hover:scale-105 active:scale-95 transition-all"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* 심플 링크 버튼 리스트 (중앙 정렬 & 풀 위드 카드) */}
        <div className="w-full space-y-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm active:scale-[0.99] transition-all"
            >
              <div className="w-5 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors">
                {link.icon || <Globe className="w-5 h-5" />}
              </div>

              <span className="font-medium text-sm sm:text-base text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors flex-1 text-center px-2">
                {link.title}
              </span>

              <div className="w-5 flex justify-end text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 심플 푸터 */}
      <footer className="text-center pt-10 text-xs text-neutral-400 dark:text-neutral-600">
        <p>© 2026 {name} • My-Link</p>
      </footer>
    </div>
  );
}
