import React from "react";
import { Mail } from "lucide-react";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  XTwitterIcon,
} from "@/components/icons";

export interface SocialLinksConfig {
  github?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  email?: string | null;
}

interface SocialBarProps {
  email?: string | null;
  username?: string | null;
  socials?: SocialLinksConfig;
}

export function SocialBar({ email, username, socials }: SocialBarProps = {}) {
  // 사용자의 계정 정보(username, email, socials)를 바탕으로 개인 맞춤 소셜 링크 생성
  const isSieunAccount =
    !username ||
    username === "sieun" ||
    username === "jse12345" ||
    email?.includes("used776655");

  // 1. GitHub URL 결정
  let userGithub = "https://github.com";
  if (socials?.github) {
    userGithub = socials.github.startsWith("http")
      ? socials.github
      : `https://github.com/${socials.github.replace(/^@/, "")}`;
  } else if (isSieunAccount) {
    userGithub = "https://github.com/jse12345";
  } else if (username) {
    userGithub = `https://github.com/${username}`;
  }

  // 2. 이메일 링크 결정
  const rawEmail = socials?.email || email || (isSieunAccount ? "used776655@gmail.com" : "");
  const emailUrl = rawEmail
    ? rawEmail.startsWith("mailto:")
      ? rawEmail
      : `mailto:${rawEmail}`
    : "#";

  // 3. 인스타그램 결정
  let userInstagram = "https://instagram.com";
  if (socials?.instagram) {
    userInstagram = socials.instagram.startsWith("http")
      ? socials.instagram
      : `https://instagram.com/${socials.instagram.replace(/^@/, "")}`;
  }

  // 4. X(트위터) 결정
  let userTwitter = "https://x.com";
  if (socials?.twitter) {
    userTwitter = socials.twitter.startsWith("http")
      ? socials.twitter
      : `https://x.com/${socials.twitter.replace(/^@/, "")}`;
  }

  // 5. 링크드인 결정
  let userLinkedin = "https://linkedin.com";
  if (socials?.linkedin) {
    userLinkedin = socials.linkedin.startsWith("http")
      ? socials.linkedin
      : `https://linkedin.com/in/${socials.linkedin.replace(/^@/, "")}`;
  }

  const socialLinks = [
    {
      id: "github",
      label: "GitHub",
      url: userGithub,
      icon: <GithubIcon className="w-5 h-5" />,
      bg: "bg-[#A7F3D0]",
    },
    {
      id: "instagram",
      label: "Instagram",
      url: userInstagram,
      icon: <InstagramIcon className="w-5 h-5" />,
      bg: "bg-[#FBCFE8]",
    },
    {
      id: "twitter",
      label: "X (Twitter)",
      url: userTwitter,
      icon: <XTwitterIcon className="w-5 h-5" />,
      bg: "bg-[#BAE6FD]",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      url: userLinkedin,
      icon: <LinkedinIcon className="w-5 h-5" />,
      bg: "bg-[#DDD6FE]",
    },
    {
      id: "email",
      label: "Email",
      url: emailUrl,
      icon: <Mail className="w-5 h-5" />,
      bg: "bg-[#FED7AA]",
    },
  ];

  return (
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
  );
}
