import React from "react";
import type { LinkItem } from "@/data/links";

export const CATEGORY_TABS = [
  { id: "all", label: "전체 보기", icon: "⭐" },
  { id: "project", label: "대표 프로젝트", icon: "🚀" },
  { id: "blog", label: "기술 블로그", icon: "📝" },
  { id: "social", label: "소셜 & 연락처", icon: "📫" },
] as const;

export type CategoryTabId = (typeof CATEGORY_TABS)[number]["id"];

interface CategoryTabsProps {
  activeCategory: CategoryTabId;
  onSelectCategory: (id: CategoryTabId) => void;
  links: LinkItem[];
}

export function CategoryTabs({
  activeCategory,
  onSelectCategory,
  links,
}: CategoryTabsProps) {
  return (
    <div className="w-full mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-neutral-900 border-[3px] border-black rounded-[12px] shadow-[4px_4px_0px_#000]">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          const count = links.filter((l) => {
            if (tab.id === "all") return true;
            if (tab.id === "project") return l.category === "project";
            if (tab.id === "blog") return l.category === "blog" || l.category === "study";
            if (tab.id === "social") return l.category === "social" || l.category === "contact";
            return true;
          }).length;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`py-2 px-2 rounded-[8px] text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                isActive
                  ? "bg-[#FEF08A] text-black border-[2px] border-black shadow-[2px_2px_0px_#fff]"
                  : "bg-transparent text-white hover:bg-neutral-800"
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              <span className="whitespace-nowrap truncate">{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full border border-black font-extrabold ${
                  isActive ? "bg-black text-[#FEF08A]" : "bg-neutral-700 text-neutral-200"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
