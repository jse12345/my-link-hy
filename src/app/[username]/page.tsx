"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  User as UserIcon,
  Sparkles,
} from "lucide-react";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserByDisplayName } from "@/lib/user";
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

function UserProfileContent() {
  const routeParams = useParams();
  const rawParam = typeof routeParams?.username === "string" ? routeParams.username : "";
  const rawUsername = decodeURIComponent(rawParam).toLowerCase();

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

  // 프로필 정보 상태
  const [profileUid, setProfileUid] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(rawUsername);
  const [bio, setBio] = useState(
    `안녕하세요! ${rawUsername}의 마이링크 페이지입니다 ✨`
  );
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  // 현재 로그인한 사용자가 이 프로필의 주인인지 확인
  const isOwner = !!user && (user.uid === profileUid || user.email?.split("@")[0].toLowerCase() === rawUsername);

  // 1. username 기반으로 Firestore에서 유저 프로필 조회
  useEffect(() => {
    let isMounted = true;

    async function loadUserProfile() {
      setLoadingProfile(true);

      // 캐시 확인
      const cached = localStorage.getItem(`my-link-user-${rawUsername}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (isMounted) {
            setDisplayName(parsed.displayName || rawUsername);
            setBio(parsed.bio || "");
            setProfileUid(parsed.uid || null);
          }
        } catch {
          // ignore
        }
      }

      try {
        // Walkthrough 명세: user.ts의 getUserByDisplayName 활용
        const userProf = await getUserByDisplayName(rawUsername);
        if (userProf) {
          if (isMounted) {
            setUserNotFound(false);
            setProfileUid(userProf.uid);
            setDisplayName(userProf.displayName);
            if (userProf.bio) setBio(userProf.bio);
            localStorage.setItem(
              `my-link-user-${rawUsername}`,
              JSON.stringify({
                displayName: userProf.displayName,
                bio: userProf.bio,
                uid: userProf.uid,
              })
            );
          }
          return;
        }

        let foundUid: string | null = null;
        let foundName = rawUsername;
        let foundBio = "";

        // 1) usernames/{username} 매핑 문서 조회
        const userMapSnap = await getDoc(doc(db, "usernames", rawUsername));
        if (userMapSnap.exists()) {
          foundUid = userMapSnap.data().uid;
          foundName = userMapSnap.data().displayName || rawUsername;
        }

        // 2) Step 2 슬라이드 명세: username으로 userId 검색 (where 쿼리)
        if (!foundUid) {
          const qUsername = query(collection(db, "users"), where("username", "==", rawUsername));
          const qSnap = await getDocs(qUsername);
          if (!qSnap.empty) {
            foundUid = qSnap.docs[0].id;
            const uData = qSnap.docs[0].data();
            foundName = uData.displayName || uData.username || rawUsername;
            foundBio = uData.bio || "";
          }
        }

        // 3) profile.username where 쿼리 검색
        if (!foundUid) {
          const qProfUsername = query(collection(db, "users"), where("profile.username", "==", rawUsername));
          const qSnap2 = await getDocs(qProfUsername);
          if (!qSnap2.empty) {
            foundUid = qSnap2.docs[0].id;
            const uData = qSnap2.docs[0].data();
            foundName = uData.displayName || uData.profile?.displayName || rawUsername;
            foundBio = uData.bio || uData.profile?.bio || "";
          }
        }

        // 4) Image 3/4 슬라이드 명세: displayName으로 유저 검색 (where 쿼리)
        if (!foundUid) {
          const qDisplayName = query(collection(db, "users"), where("displayName", "==", rawUsername));
          const qSnap3 = await getDocs(qDisplayName);
          if (!qSnap3.empty) {
            foundUid = qSnap3.docs[0].id;
            const uData = qSnap3.docs[0].data();
            foundName = uData.displayName || rawUsername;
            foundBio = uData.bio || "";
          }
        }

        // 5) 유저를 찾은 경우: 프로필 상세 정보 동기화
        if (foundUid) {
          if (isMounted) {
            setUserNotFound(false);
            setProfileUid(foundUid);
          }

          // users/{foundUid}/profile/info 문서 조회
          const profileSnap = await getDoc(doc(db, "users", foundUid, "profile", "info"));
          if (profileSnap.exists()) {
            const pData = profileSnap.data();
            foundName = pData.displayName || foundName;
            foundBio = pData.bio || foundBio;
          }

          if (isMounted) {
            setDisplayName(foundName);
            setBio(foundBio || `안녕하세요! ${foundName}입니다 ✨`);
            localStorage.setItem(
              `my-link-user-${rawUsername}`,
              JSON.stringify({
                displayName: foundName,
                bio: foundBio,
                uid: foundUid,
              })
            );
          }
        } else if (rawUsername === "sieun" || rawUsername === "jse12345" || rawUsername === "used776655" || rawUsername === "정시은") {
          // 기본 프로필 폴백 (정시은 님 기본값)
          if (isMounted) {
            setUserNotFound(false);
            setDisplayName("정시은");
            setBio("안녕하세요! 바이브 코딩으로 유쾌하고 가치 있는 서비스를 만드는 정시은입니다 ✨");
          }
        } else {
          // 3차시 Step 2 요구사항: 일치하는 유저가 없으면 404 페이지 표시
          if (isMounted) {
            setUserNotFound(true);
          }
        }
      } catch (err) {
        console.warn("프로필 조회 오류:", err);
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    }

    loadUserProfile();
    return () => {
      isMounted = false;
    };
  }, [rawUsername]);

  // 2. 해당 유저의 링크 목록 실시간 동기화
  useEffect(() => {
    const targetUid = profileUid || user?.uid || "anonymous";

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
              subtitle: data.subtitle || "등록된 링크",
              url: data.url || "",
              category: data.category || "project",
              tag: data.tag || "LINK",
              bgColor: data.bgColor || "bg-white",
              clickCount: data.clickCount || 0,
              isCustom: true,
              _time: time,
            };
          });

          firestoreLinks.sort((a, b) => (b._time ?? 0) - (a._time ?? 0));

          const combined = [
            ...firestoreLinks,
            ...DUMMY_LINKS.filter(
              (dummy) => !firestoreLinks.some((fl) => fl.url === dummy.url)
            ),
          ];
          setLinks(combined);
        },
        (err) => {
          console.warn("Firestore 실시간 링크 대기:", err.message);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn("Firestore 링크 연결 실패:", err);
    }
  }, [profileUid, user]);

  const handleLinkClick = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, clickCount: (l.clickCount ?? 0) + 1 } : l))
    );
  };

  const handleAddLink = (newLinkItem: LinkItem) => {
    if (!user) return;
    setLinks([newLinkItem, ...links]);
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
    if (!isOwner) return;
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
    setLinks((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleStartEdit = (link: LinkItem) => {
    if (!isOwner) return;
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
    let formattedUrl = editUrl.trim();

    if (!trimmedTitle || !formattedUrl) {
      alert("제목과 주소를 입력해주세요");
      return;
    }

    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, title: trimmedTitle, url: formattedUrl } : l))
    );

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

  const filteredLinks = links.filter((link) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "project") return link.category === "project";
    if (activeCategory === "blog")
      return link.category === "blog" || link.category === "study";
    if (activeCategory === "social")
      return link.category === "social" || link.category === "contact";
    return true;
  });

  // 3차시 요구사항: username을 찾지 못하면 404 페이지 표시
  if (!loadingProfile && userNotFound) {
    return (
      <div
        style={{ backgroundColor: "#FEF08A" }}
        className="min-h-screen min-w-[360px] text-black flex flex-col justify-between selection:bg-black selection:text-[#FEF08A] font-sans"
      >
        <MarqueeTicker />
        <Header user={user} onLogin={loginWithGoogle} onLogout={logout} />

        <main className="w-full max-w-[420px] mx-auto flex flex-col items-center justify-center py-16 px-4 flex-1 text-center">
          <div className="w-full bg-white border-[3px] border-black rounded-[14px] shadow-[6px_6px_0px_#000] p-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FEE2E2] border-[3px] border-black flex items-center justify-center text-3xl font-black shadow-[3px_3px_0px_#000]">
              😢
            </div>
            <div className="inline-block px-3 py-1 bg-black text-[#FEF08A] font-black text-xs rounded border border-black font-mono">
              404 NOT FOUND
            </div>
            <h1 className="text-xl font-black text-neutral-900">
              사용자를 찾을 수 없습니다
            </h1>
            <p className="text-xs font-bold text-neutral-600 leading-relaxed">
              <span className="font-mono font-black text-black bg-neutral-100 px-1.5 py-0.5 rounded border border-black/20">
                /{rawUsername}
              </span>{" "}
              사용자는 아직 생성되지 않았거나 존재하지 않는 주소입니다.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="w-full py-3 px-4 bg-[#FEF08A] hover:bg-[#fde047] text-black border-[2.5px] border-black rounded-[8px] shadow-[3px_3px_0px_#000] font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>🏠 메인 대문으로 돌아가기</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="min-h-screen min-w-[360px] text-black flex flex-col justify-between selection:bg-black selection:text-[#FEF08A] transition-colors duration-300 font-sans relative overflow-x-auto"
    >
      <MarqueeTicker />

      <Header user={user} onLogin={loginWithGoogle} onLogout={logout} />

      <main className="w-full min-w-[360px] md:w-[80%] md:max-w-[480px] lg:w-[420px] mx-auto flex flex-col items-center py-6 px-4 flex-1">
        {/* 상단 URL 뱃지 안내 */}
        <div className="w-full mb-3 p-2.5 bg-white border-[2.5px] border-black rounded-[10px] shadow-[3px_3px_0px_#000] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-mono font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              /{rawUsername}
            </span>
            <span className="font-black text-black truncate">
              {displayName}님의 공개 마이링크
            </span>
          </div>
          {isOwner && (
            <span className="px-2 py-0.5 bg-[#22C55E] text-white border border-black rounded font-black text-[10px] shrink-0">
              👑 내 페이지
            </span>
          )}
        </div>

        <ControlBar
          palettes={THEME_PALETTES}
          currentTheme={themeColor}
          onSelectTheme={setThemeColor}
          onOpenQr={() => setShowQrModal(true)}
          onCopyLink={handleCopyLink}
          copied={copied}
        />

        {/* 동적 프로필 헤더 */}
        <ProfileHeader name={displayName} bio={bio} themeColor={themeColor} />

        {/* 주인이 접속했을 때만 나타나는 관리 버튼 */}
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
              <span>프로필·링크 수정 (/mypage)</span>
            </Link>
          </div>
        )}

        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          links={links}
        />

        {/* 링크 목록 */}
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
                  readonly={!isOwner}
                />
              )
            )
          )}
        </div>
      </main>

      <AddLinkModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLink}
      />

      <QrModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

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

      <footer className="text-center py-6 text-xs font-black text-neutral-800 border-t-[3px] border-black bg-white/70">
        <p className="inline-flex items-center gap-1.5">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>by {displayName} • /{rawUsername}</span>
        </p>
      </footer>
    </div>
  );
}


export default function UserProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FEF08A] flex items-center justify-center font-black text-sm">
          마이링크 불러오는 중...
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  );
}
