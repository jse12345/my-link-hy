"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Heart,
  Settings,
  Trash2,
  AlertTriangle,
  X,
  Pencil,
  Check,
  ShieldCheck,
} from "lucide-react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";

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
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();

  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [themeColor, setThemeColor] = useState("#FEF08A");
  const [links, setLinks] = useState<LinkItem[]>(DUMMY_LINKS);
  const [activeCategory, setActiveCategory] = useState<CategoryTabId>("all");
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const isOwner = !!user;

  // 사용자 이름: 로그인한 사용자 이름 (비로그인 시에는 기본 프로필명 '정시은')
  const displayName =
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "정시은";
  const bio = "안녕하세요! 바이브 코딩으로 유쾌하고 가치 있는 서비스를 만드는 정시은입니다 ✨";

  // Firestore 실시간 동기화
  useEffect(() => {
    const targetUid = user?.uid || "anonymous";
    const cacheKey = `my-link-custom-links-${targetUid}`;

    // 1. 로컬스토리지 캐시 우선 로드
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      try {
        setLinks(JSON.parse(saved));
      } catch {
        // ignore
      }
    }

    // 2. 실시간 Firestore 클라우드 DB 연동
    try {
      const unsubscribe = onSnapshot(
        collection(db, "users", targetUid, "links"),
        (snapshot) => {
          const firestoreLinks: (LinkItem & { _time?: number })[] = snapshot.docs.map((d) => {
            const data = d.data();
            const time =
              data.createdAt?.toMillis?.() ??
              (typeof data.createdAt === "number" ? data.createdAt : Date.now());
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
              _time: time,
            };
          });

          // 최신순 (createdAt desc) 정렬
          firestoreLinks.sort((a, b) => (b._time ?? 0) - (a._time ?? 0));

          // 기본 더미 데이터와 병합 (중복 URL 방지)
          const combined = [
            ...firestoreLinks,
            ...DUMMY_LINKS.filter(
              (dummy) => !firestoreLinks.some((fl) => fl.url === dummy.url)
            ),
          ];
          setLinks(combined);
          localStorage.setItem(cacheKey, JSON.stringify(combined));
        },
        (err) => {
          console.warn("Firestore 실시간 동기화 대기:", err.message);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn("Firestore 연결 실패:", err);
    }
  }, [user]);

  const saveLinks = (updatedLinks: LinkItem[]) => {
    const targetUid = user?.uid || "anonymous";
    const cacheKey = `my-link-custom-links-${targetUid}`;
    setLinks(updatedLinks);
    localStorage.setItem(cacheKey, JSON.stringify(updatedLinks));
  };

  const handleLinkClick = (id: string) => {
    const updated = links.map((l) =>
      l.id === id ? { ...l, clickCount: (l.clickCount ?? 0) + 1 } : l
    );
    saveLinks(updated);
  };

  const handleAddLink = (newLinkItem: LinkItem) => {
    if (!user) return;
    saveLinks([newLinkItem, ...links]);
    try {
      addDoc(collection(db, "users", user.uid, "links"), {
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
    if (!user) return;
    const target = links.find((l) => l.id === id);
    if (target) {
      setDeleteTarget(target);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "links", deleteTarget.id));
    } catch (err) {
      console.warn("Firestore deleteDoc 오류:", err);
    }
    saveLinks(links.filter((l) => l.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleStartEdit = (link: LinkItem) => {
    if (!user) return;
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!user) return;

    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();

    if (!trimmedTitle) {
      alert("제목을 입력해주세요");
      return;
    }
    if (!trimmedUrl || trimmedUrl === "https://" || trimmedUrl === "http://") {
      alert("주소를 입력해주세요");
      return;
    }

    let formattedUrl = trimmedUrl;
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://") &&
      !formattedUrl.startsWith("mailto:")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }

    const updated = links.map((l) =>
      l.id === id ? { ...l, title: trimmedTitle, url: formattedUrl } : l
    );
    saveLinks(updated);

    try {
      await updateDoc(doc(db, "users", user.uid, "links", id), {
        title: trimmedTitle,
        url: formattedUrl,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore updateDoc 오류:", err);
    }

    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
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
      {/* 1. 상단 롤링 마퀴 배너 (네오브루탈리즘 공통) */}
      <MarqueeTicker />

      {/* 2. 네오브루탈리즘 공통 상단 헤더 (비로그인: [Google로 로그인] / 로그인: [내이름] + [로그아웃]) */}
      <Header user={user} onLogin={loginWithGoogle} onLogout={logout} />

      {/* 3. 중앙 메인 컨테이너 */}
      <main className="w-full min-w-[360px] md:w-[80%] md:max-w-[480px] lg:w-[420px] mx-auto flex flex-col items-center py-6 px-4 flex-1">
        {/* 주인(로그인)일 때만 나타나는 개인화 관리자 상태 바 */}
        {isOwner && (
          <div className="w-full mb-3 p-2.5 bg-white border-[2.5px] border-black rounded-[10px] shadow-[3px_3px_0px_#000] flex items-center justify-between text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span className="font-black text-black truncate">
                {displayName}님의 관리자 모드
              </span>
            </div>
            <div className="px-2 py-0.5 bg-neutral-100 border border-black rounded font-mono text-[10px] font-black text-neutral-700 shrink-0">
              users/{user.uid.slice(0, 8)}...
            </div>
          </div>
        )}

        {/* 상단 컨트롤 바 (테마 변경, QR 모달, 링크 복사) - 누구나 이용 가능 */}
        <ControlBar
          palettes={THEME_PALETTES}
          currentTheme={themeColor}
          onSelectTheme={setThemeColor}
          onOpenQr={() => setShowQrModal(true)}
          onCopyLink={handleCopyLink}
          copied={copied}
        />

        {/* [방식 1: 깔끔한 프로필] 프로필 카드 섹션 */}
        <ProfileHeader name={displayName} bio={bio} themeColor={themeColor} />

        {/* 주인(로그인)일 때만 짠! 하고 나타나는 링크 추가 & 관리 버튼 */}
        {isOwner && (
          <div className="w-full mb-4 grid grid-cols-2 gap-2 animate-in fade-in duration-200">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(true)}
              className="w-full py-5 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
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
        )}

        {/* 카테고리 분류 탭 */}
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          links={links}
        />

        {/* [방식 1] 실제 링크 카드 목록 */}
        {/* 비로그인 방문자: ✏️, 🗑️ 없이 깔끔한 링크 카드 (클릭해서 바로 이동!) */}
        {/* 로그인한 주인: 각 카드마다 ✏️ 수정, 🗑️ 삭제 버튼이 활성화됨! */}
        <div className="w-full space-y-3.5">
          {filteredLinks.length === 0 ? (
            <Card className="w-full p-8 text-center bg-white">
              <p className="font-black text-sm text-neutral-600">
                등록된 링크가 없습니다.
              </p>
            </Card>
          ) : (
            filteredLinks.map((link) =>
              editingId === link.id ? (
                <div
                  key={link.id}
                  className="p-4 bg-[#FEF9C3] border-[3px] border-black rounded-[12px] shadow-[4px_4px_0px_#000] space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b-[2px] border-black/20">
                    <span className="text-xs font-black flex items-center gap-1.5 text-black">
                      <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>링크 인라인 수정</span>
                    </span>
                    <span className="text-[10px] font-black bg-black text-[#FEF08A] px-2 py-0.5 rounded-[4px]">
                      수정 중
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-black mb-1 text-neutral-900">
                        링크 제목 *
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="수정할 제목 입력"
                        className="w-full px-3 py-2 bg-white border-[2.5px] border-black rounded-[8px] font-bold text-xs focus:outline-none focus:ring-2 focus:ring-black shadow-[1.5px_1.5px_0px_#000]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black mb-1 text-neutral-900">
                        링크 주소 (URL) *
                      </label>
                      <input
                        type="text"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-white border-[2.5px] border-black rounded-[8px] font-bold text-xs focus:outline-none focus:ring-2 focus:ring-black shadow-[1.5px_1.5px_0px_#000]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="py-1.5 px-3 bg-white hover:bg-neutral-100 border-[2px] border-black rounded-[6px] text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(link.id)}
                      className="py-1.5 px-3.5 bg-[#22C55E] hover:bg-[#16a34a] text-white border-[2px] border-black rounded-[6px] text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>저장</span>
                    </button>
                  </div>
                </div>
              ) : (
                <LinkCard
                  key={link.id}
                  link={link}
                  onClick={handleLinkClick}
                  onDelete={handleDeleteLink}
                  onEdit={handleStartEdit}
                  isOwner={isOwner}
                />
              )
            )
          )}
        </div>
      </main>

      {/* 새 링크 추가 모달 (주인 전용) */}
      <AddLinkModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLink}
      />

      {/* QR 코드 모달 */}
      <QrModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

      {/* 삭제 확인 모달 다이얼로그 (주인 전용) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border-[3px] border-black rounded-[14px] shadow-[8px_8px_0px_#000] p-6 relative text-left space-y-4">
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-[6px] border-[2px] border-black cursor-pointer"
              aria-label="모달 닫기"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[8px] bg-rose-100 border-[2px] border-black flex items-center justify-center text-rose-600 shrink-0 shadow-[2px_2px_0px_#000]">
                <Trash2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-black">
                정말 삭제하시겠습니까?
              </h3>
            </div>

            <div className="p-3 bg-neutral-50 border-[2.5px] border-black rounded-[8px]">
              <p className="text-sm font-bold text-neutral-800">
                <span className="font-black text-black bg-rose-100 px-1 py-0.5 rounded border border-rose-300">
                  [{deleteTarget.title}]
                </span>{" "}
                링크가 삭제됩니다.
              </p>
              <p className="text-xs text-neutral-500 truncate mt-1">
                {deleteTarget.url}
              </p>
            </div>

            <div className="p-3 bg-amber-50 border-[2px] border-amber-500 rounded-[8px] flex items-center gap-2 text-amber-900 text-xs font-black shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
              <span>⚠️ 이 작업은 되돌릴 수 없습니다</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="w-full py-2.5 px-3 bg-white hover:bg-neutral-100 border-[2.5px] border-black rounded-[8px] font-black text-xs shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-2.5 px-3 bg-rose-500 hover:bg-rose-600 text-white border-[2.5px] border-black rounded-[8px] font-black text-xs shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>삭제하기</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="text-center py-6 text-xs font-black text-neutral-800 border-t-[3px] border-black bg-white/70">
        <p className="inline-flex items-center gap-1.5">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>by {displayName} • My-Link Neobrutalism</span>
        </p>
      </footer>
    </div>
  );
}
