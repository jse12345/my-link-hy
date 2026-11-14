import React from "react";
import {
  BookOpen,
  Mail,
  Sparkles,
  Layers,
  ArrowUpRight,
  Trash2,
  Zap,
  ExternalLink,
  FolderGit2,
  FileText,
  Eye,
  Flame,
  Pencil,
} from "lucide-react";
import type { LinkItem } from "@/data/links";
import { Badge } from "@/components/ui/badge";

interface LinkCardProps {
  link: LinkItem;
  onClick: (id: string) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
  onEdit?: (link: LinkItem, e: React.MouseEvent) => void;
  isOwner?: boolean;
  readonly?: boolean;
}

export function LinkCard({
  link,
  onClick,
  onDelete,
  onEdit,
  isOwner = false,
  readonly = false,
}: LinkCardProps) {
  // Walkthrough 명세: readonly 모드 지원 (readonly가 true이면 편집/삭제 숨김)
  const canModify = isOwner && !readonly;
  const getLinkIcon = () => {
    if (link.tag === "GITHUB" || link.url.includes("github.com")) {
      return <FolderGit2 className="w-5 h-5 text-black stroke-[2.5]" />;
    }
    if (link.tag === "HOT" || link.category === "project") {
      return <Sparkles className="w-5 h-5 text-amber-500 stroke-[2.5]" />;
    }
    if (link.tag === "BLOG" || link.category === "blog") {
      return <BookOpen className="w-5 h-5 text-sky-600 stroke-[2.5]" />;
    }
    if (link.tag === "RESUME") {
      return <FileText className="w-5 h-5 text-purple-600 stroke-[2.5]" />;
    }
    if (link.tag === "TECH" || link.category === "study") {
      return <Layers className="w-5 h-5 text-emerald-600 stroke-[2.5]" />;
    }
    if (link.category === "contact" || link.url.startsWith("mailto:")) {
      return <Mail className="w-5 h-5 text-orange-600 stroke-[2.5]" />;
    }
    if (link.category === "social") {
      return <Zap className="w-5 h-5 text-rose-500 stroke-[2.5]" />;
    }
    return <ExternalLink className="w-5 h-5 text-black stroke-[2.5]" />;
  };

  const renderBadge = () => {
    if (!link.tag) return null;
    if (link.tag === "HOT") {
      return (
        <Badge variant="hot">
          <Flame className="w-2.5 h-2.5 inline mr-0.5 fill-white" />
          HOT
        </Badge>
      );
    }
    if (link.tag === "GITHUB") {
      return <Badge variant="gold">GITHUB</Badge>;
    }
    if (link.tag === "NEW") {
      return <Badge variant="new">NEW</Badge>;
    }
    return <Badge variant="default">{link.tag}</Badge>;
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onClick(link.id)}
      className={`group flex items-center justify-between w-full p-3.5 sm:p-4 rounded-[12px] ${link.bgColor} border-[3px] border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-all`}
    >
      {/* 좌측 아이콘 박스 */}
      <div className="flex items-center justify-center w-11 h-11 rounded-[8px] bg-white border-[2.5px] border-black shadow-[2px_2px_0px_#000] shrink-0">
        {getLinkIcon()}
      </div>

      {/* 중앙 타이틀 & 서브 설명 & 통계 */}
      <div className="flex-1 text-left px-3 overflow-hidden">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h2 className="font-black text-sm sm:text-base text-black truncate max-w-[190px]">
            {link.title}
          </h2>
          {renderBadge()}
        </div>

        <p className="text-xs font-bold text-neutral-700 truncate mt-0.5">
          {link.subtitle}
        </p>

        {/* 실시간 링크 방문 통계 카운터 뱃지 */}
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="counter" size="sm">
            <Eye className="w-2.5 h-2.5 stroke-[2.5] mr-1" />
            {(link.clickCount ?? 0).toLocaleString()}회 방문
          </Badge>
        </div>
      </div>

      {/* 우측 액션: 주인(로그인)일 때만 수정/삭제 버튼 노출, 방문자/readonly일 땐 화살표만 노출 */}
      <div className="flex items-center gap-1.5 shrink-0">
        {canModify && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit?.(link, e);
              }}
              aria-label="링크 수정"
              className="w-8 h-8 rounded-[6px] bg-blue-500 hover:bg-blue-600 text-white border-[2px] border-black flex items-center justify-center transition-colors cursor-pointer shadow-[1px_1px_0px_#000]"
            >
              <Pencil className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(link.id, e);
              }}
              aria-label="링크 삭제"
              className="w-8 h-8 rounded-[6px] bg-rose-500 hover:bg-rose-600 text-white border-[2px] border-black flex items-center justify-center transition-colors cursor-pointer shadow-[1px_1px_0px_#000]"
            >
              <Trash2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          </>
        )}

        <div className="w-8 h-8 rounded-[6px] bg-black text-white flex items-center justify-center group-hover:bg-neutral-800 transition-colors">
          <ArrowUpRight className="w-4 h-4 stroke-[3]" />
        </div>
      </div>
    </a>
  );
}
