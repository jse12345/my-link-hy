import React from "react";
import { Mail } from "lucide-react";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  XTwitterIcon,
} from "@/components/icons";

export function SocialBar() {
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
