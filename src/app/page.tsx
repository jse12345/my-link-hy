"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Heart, Settings } from "lucide-react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { DUMMY_LINKS, type LinkItem } from "@/data/links";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarqueeTicker } from "@/components/profile/MarqueeTicker";
import { ControlBar, type ThemePalette } from "@/components/profile/ControlBar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import {
  CategoryTabs,
  type CategoryTabId,
} from "@/components/profile/CategoryTabs";
import { LinkCard } from "@/components/profile/LinkCard";
import { AddLinkModal } from "@/components/profile/AddLinkModal";
import { QrModal } from "@/components/profile/QrModal";

const THEME_PALETTES: ThemePalette[] = [
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
  const [activeCategory, setActiveCategory] = useState<CategoryTabId>("all");

  const name = "정시은";
  const bio = "안녕하세요! 바이브 코딩으로 유쾌하고 가치 있는 서비스를 만드는 정시은입니다 ✨";

  // 로컬스토리지 및 Firestore 실시간 동기화
  useEffect(() => {
    // 1. 로컬스토리지 캐시 우선 로드
    const saved = localStorage.getItem("my-link-custom-links");
    if (saved) {
      try {
        setLinks(JSON.parse(saved));
      } catch {
        // parsing error fallback
      }
    }

    // 2. 실시간 Firestore 클라우드 DB 연동 (경로: users/anonymous/links)
    try {
      const unsubscribe = onSnapshot(
        collection(db, "users", "anonymous", "links"),
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreLinks: LinkItem[] = snapshot.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                title: data.title || "",
                subtitle: data.subtitle || "새로 추가된 링크",
                url: data.url || "",
                category: data.category || "project",
                tag: data.tag || "NEW",
                bgColor: data.bgColor || "bg-white",
                clickCount: data.clickCount || 0,
                isCustom: true,
              };
            });

            // 기본 더미 데이터와 병합 (중복 URL 방지)
            const combined = [
              ...firestoreLinks,
              ...DUMMY_LINKS.filter(
                (dummy) => !firestoreLinks.some((fl) => fl.url === dummy.url)
              ),
            ];
            setLinks(combined);
            localStorage.setItem("my-link-custom-links", JSON.stringify(combined));
          }
        },
        (err) => {
          console.warn("Firestore 실시간 동기화 대기:", err.message);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn("Firestore 연결 실패:", err);
    }
  }, []);

  const saveLinks = (updatedLinks: LinkItem[]) => {
    setLinks(updatedLinks);
    localStorage.setItem("my-link-custom-links", JSON.stringify(updatedLinks));
  };

  const handleLinkClick = (id: string) => {
    const updated = links.map((l) =>
      l.id === id ? { ...l, clickCount: (l.clickCount ?? 0) + 1 } : l
    );
    saveLinks(updated);
  };

  const handleAddLink = (newLinkItem: LinkItem) => {
    saveLinks([newLinkItem, ...links]);
    try {
      addDoc(collection(db, "users", "anonymous", "links"), {
        title: newLinkItem.title,
        url: newLinkItem.url,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        subtitle: newLinkItem.subtitle || "새로 추가된 링크",
        category: newLinkItem.category || "project",
        tag: newLinkItem.tag || "NEW",
        bgColor: newLinkItem.bgColor || "bg-white",
        clickCount: 0,
        isCustom: true,
      }).catch((err) => console.warn("Firestore addDoc 오류:", err));
    } catch (e) {
      console.warn("Firestore 저장 건너뜀:", e);
    }
  };

  const handleDeleteLink = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      deleteDoc(doc(db, "users", "anonymous", "links", id)).catch(() => {});
    } catch {}
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

  // 카테고리 필터링
  const filteredLinks = links.filter((link) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "project") return link.category === "project";
    if (activeCategory === "blog")
      return link.category === "blog" || link.category === "study";
    if (activeCategory === "social")
      return link.category === "social" || link.category === "contact";
    return true;
  });

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="min-h-screen min-w-[360px] text-black flex flex-col justify-between selection:bg-black selection:text-[#FEF08A] transition-colors duration-300 font-sans relative overflow-x-auto"
    >
      {/* 1. 상단 롤링 마퀴 배너 (Neobrutalism 시그니처) */}
      <MarqueeTicker />

      {/* 2. 중앙 메인 컨테이너 (모바일 360px 보장, 태블릿 80%/480px, 데스크탑 400px) */}
      <main className="w-full min-w-[360px] md:w-[80%] md:max-w-[480px] lg:w-[400px] mx-auto flex flex-col items-center py-8 px-4 flex-1">
        {/* 상단 컨트롤 바 */}
        <ControlBar
          palettes={THEME_PALETTES}
          currentTheme={themeColor}
          onSelectTheme={setThemeColor}
          onOpenQr={() => setShowQrModal(true)}
          onCopyLink={handleCopyLink}
          copied={copied}
        />

        {/* 프로필 카드 섹션 */}
        <ProfileHeader name={name} bio={bio} themeColor={themeColor} />

        {/* 새 링크 직접 추가 버튼 & 마이페이지 링크 관리 */}
        <div className="w-full mb-4 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAddModal(true)}
            className="w-full py-5 font-black text-xs flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>새 링크 추가</span>
          </Button>
          <Link
            href="/mypage"
            className="w-full py-2.5 px-3 bg-[#5B5FC7] hover:bg-[#4a4ea5] text-white border-[3px] border-black rounded-[10px] shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] font-black text-xs flex items-center justify-center gap-1.5 transition-all text-center justify-center"
          >
            <Settings className="w-4 h-4 stroke-[2.5]" />
            <span>링크 관리 (/mypage)</span>
          </Link>
        </div>

        {/* 카테고리 분류 탭 */}
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          links={links}
        />

        {/* 링크 카드 목록 */}
        <div className="w-full space-y-3.5">
          {filteredLinks.length === 0 ? (
            <Card className="w-full p-8 text-center bg-white">
              <p className="font-black text-sm text-neutral-600">
                선택한 카테고리에 등록된 링크가 없습니다.
              </p>
            </Card>
          ) : (
            filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onClick={handleLinkClick}
                onDelete={handleDeleteLink}
              />
            ))
          )}
        </div>
      </main>

      {/* 새 링크 추가 모달 */}
      <AddLinkModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLink}
      />

      {/* QR 코드 모달 */}
      <QrModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

      {/* 푸터 */}
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
