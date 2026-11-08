import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import type { LinkItem } from "@/data/links";
import { Button } from "@/components/ui/button";

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: LinkItem) => void;
}

export function AddLinkModal({ isOpen, onClose, onAdd }: AddLinkModalProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState<"project" | "blog" | "social" | "study" | "contact">("project");
  const [newBgColor, setNewBgColor] = useState("bg-white");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://") &&
      !formattedUrl.startsWith("mailto:")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }

    const newLinkItem: LinkItem = {
      id: "custom-" + Date.now().toString(),
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || "링크 바로가기",
      url: formattedUrl,
      category: newCategory,
      tag: newTag.trim() || "CUSTOM",
      bgColor: newBgColor,
      clickCount: 0,
      isCustom: true,
    };

    onAdd(newLinkItem);
    setNewTitle("");
    setNewSubtitle("");
    setNewUrl("");
    setNewTag("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white border-[3px] border-black rounded-[14px] shadow-[8px_8px_0px_#000] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-[6px] border-[2px] border-black cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <h3 className="text-lg font-black mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 stroke-[3]" />
          새 링크 추가
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
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
            <label className="block text-xs font-black mb-1">카테고리</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full px-3 py-2 border-[2.5px] border-black rounded-[8px] font-bold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="project">🚀 대표 프로젝트</option>
              <option value="blog">📝 기술 블로그 & 스터디</option>
              <option value="social">📫 소셜 & 연락처</option>
            </select>
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
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
            >
              등록 완료
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
