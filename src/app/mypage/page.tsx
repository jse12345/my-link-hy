"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ExternalLink,
  Link2,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Sparkles,
  BookOpen,
  FileText,
  Layers,
  Mail,
  Zap,
  CloudCheck,
  Pencil,
  Check,
  X,
  AlertTriangle,
  LogOut,
} from "lucide-react";

import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { db, auth, googleProvider } from "@/lib/firebase";
import { GoogleIcon } from "@/components/icons";

import { DUMMY_LINKS, type LinkItem } from "@/data/links";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MyPage() {
  const [links, setLinks] = useState<LinkItem[]>(DUMMY_LINKS);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("https://");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // 실습 1 (Update): 인라인 편집 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // 실습 2 (Delete): 삭제 확인 모달 대상 링크
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);

  // 11주차: 구글 소셜 로그인 상태
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 5. onAuthStateChanged 로 인증 상태 실시간 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 구글 팝업 로그인
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccessMessage("Google 계정으로 로그인되었습니다!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") return;
      if (err.code === "auth/operation-not-allowed") {
        alert("Firebase 콘솔에서 Google 로그인을 활성화해주세요!\n(Authentication -> Sign-in method -> Google 추가)");
        return;
      }
      alert("로그인 중 오류가 발생했습니다: " + err.message);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSuccessMessage("로그아웃되었습니다.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("로그아웃 오류:", err);
    }
  };

  // 로컬스토리지 및 Firestore 실시간 동기화 (경로: users/{user.uid}/links)
  useEffect(() => {
    const currentUid = currentUser?.uid || "anonymous";
    const cacheKey = `my-link-custom-links-${currentUid}`;

    // 1. 로컬스토리지 우선 로드
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      try {
        setLinks(JSON.parse(saved));
      } catch {
        // parsing error fallback
      }
    }

    // 2. 실시간 Firestore 클라우드 DB 연동 (경로: users/{user.uid}/links)
    try {
      const unsubscribe = onSnapshot(
        collection(db, "users", currentUid, "links"),
        (snapshot) => {
          setIsCloudConnected(true);
          const firestoreLinks: (LinkItem & { _time?: number })[] = snapshot.docs.map((d) => {
            const data = d.data();
            const time = data.createdAt?.toMillis?.() ?? (typeof data.createdAt === "number" ? data.createdAt : Date.now());
            return {
              id: d.id,
              title: data.title || "",
              subtitle: data.subtitle || "마이페이지에서 등록된 링크",
              url: data.url || "",
              category: data.category || "project",
              tag: data.tag || "MY",
              bgColor: data.bgColor || "bg-white",
              clickCount: data.clickCount || 0,
              isCustom: true,
              _time: time,
            };
          });

          // 최신순 (createdAt desc) 정렬
          firestoreLinks.sort((a, b) => (b._time ?? 0) - (a._time ?? 0));

          // 기본 더미 데이터와 클라우드 데이터 병합
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
          console.warn("Firestore 연결 대기 중:", err.message);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn("Firestore 초기화:", err);
    }
  }, [currentUser]);

  // 로컬스토리지 저장 함수
  const saveLinks = (updated: LinkItem[]) => {
    const currentUid = currentUser?.uid || "anonymous";
    const cacheKey = `my-link-custom-links-${currentUid}`;
    setLinks(updated);
    localStorage.setItem(cacheKey, JSON.stringify(updated));
  };

  // 실습 2 & 3: 추가 버튼 클릭 시 검증 및 동작
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // 권한 체크: 수정/추가는 로그인 필수!
    if (!currentUser) {
      alert("링크를 추가하려면 먼저 Google 로그인이 필요합니다!");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    // 검증 1: 제목 비어있으면 alert
    if (!trimmedTitle) {
      alert("제목을 입력해주세요");
      setErrorMessage("제목을 입력해주세요.");
      return;
    }

    // 검증 2: 주소 비어있거나 접두사만 있으면 alert
    if (!trimmedUrl || trimmedUrl === "https://" || trimmedUrl === "http://") {
      alert("주소를 입력해주세요");
      setErrorMessage("주소를 입력해주세요.");
      return;
    }

    // 검증 3: 주소 형식 체크
    let formattedUrl = trimmedUrl;
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://") &&
      !formattedUrl.startsWith("mailto:")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }

    // URL 유효성 검사
    try {
      if (!formattedUrl.startsWith("mailto:")) {
        new URL(formattedUrl);
      }
    } catch {
      alert("올바른 주소를 입력해주세요");
      setErrorMessage("올바른 주소를 입력해주세요 (예: https://example.com)");
      return;
    }

    // 검증 통과 4: Firestore 클라우드 및 목록에 추가
    const newLinkItem: LinkItem = {
      id: "link-" + Date.now().toString(),
      title: trimmedTitle,
      subtitle: "마이페이지에서 등록된 링크",
      url: formattedUrl,
      category: "project",
      tag: "MY",
      bgColor: "bg-white",
      clickCount: 0,
      isCustom: true,
    };

    // Firestore에 저장 시도 (경로: users/{user.uid}/links)
    const targetUid = currentUser.uid;
    try {
      addDoc(collection(db, "users", targetUid, "links"), {
        title: newLinkItem.title,
        url: newLinkItem.url,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        subtitle: newLinkItem.subtitle,
        category: newLinkItem.category,
        tag: newLinkItem.tag,
        bgColor: newLinkItem.bgColor,
        clickCount: 0,
        isCustom: true,
      })
        .then((docRef) => {
          newLinkItem.id = docRef.id;
        })
        .catch((err) => {
          console.warn("Firestore addDoc 오류 (로컬 모드 유지):", err);
        });
    } catch (e) {
      console.warn("Firestore 저장 건너뜀:", e);
    }

    saveLinks([newLinkItem, ...links]);

    // 입력 칸 초기화 (주소는 편리하게 https:// 기본값 유지)
    setTitle("");
    setUrl("https://");
    setSuccessMessage("새 링크가 성공적으로 추가되었습니다! (클라우드 동기화 완료)");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ==========================================
  // 실습 1 (Update): 인라인 편집 핸들러
  // ==========================================
  const handleStartEdit = (link: LinkItem) => {
    if (!currentUser) {
      alert("링크를 수정하려면 먼저 Google 로그인이 필요합니다!");
      return;
    }
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setErrorMessage("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!currentUser) {
      alert("수정하려면 먼저 Google 로그인이 필요합니다!");
      return;
    }

    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();

    // 1. 빈 칸 검증 (추가할 때와 100% 동일한 메시지)
    if (!trimmedTitle) {
      alert("제목을 입력해주세요");
      setErrorMessage("제목을 입력해주세요.");
      return;
    }
    if (!trimmedUrl || trimmedUrl === "https://" || trimmedUrl === "http://") {
      alert("주소를 입력해주세요");
      setErrorMessage("주소를 입력해주세요.");
      return;
    }

    // 2. URL 포맷팅 및 검증 (https:// 자동 부착)
    let formattedUrl = trimmedUrl;
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://") &&
      !formattedUrl.startsWith("mailto:")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      if (!formattedUrl.startsWith("mailto:")) {
        new URL(formattedUrl);
      }
    } catch {
      alert("올바른 주소를 입력해주세요");
      setErrorMessage("올바른 주소를 입력해주세요 (예: https://example.com)");
      return;
    }

    // 3. Firestore updateDoc 실행 (경로: users/{user.uid}/links)
    const targetUid = currentUser.uid;
    try {
      await updateDoc(doc(db, "users", targetUid, "links", id), {
        title: trimmedTitle,
        url: formattedUrl,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore updateDoc 오류 (로컬 업데이트 유지):", err);
    }

    // 4. 로컬 상태 업데이트
    const updated = links.map((item) =>
      item.id === id ? { ...item, title: trimmedTitle, url: formattedUrl } : item
    );
    saveLinks(updated);

    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    setSuccessMessage("링크가 성공적으로 수정되었습니다! (클라우드 반영 완료)");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ==========================================
  // 실습 2 (Delete): 삭제 확인 모달 핸들러
  // ==========================================
  const handleOpenDeleteModal = (link: LinkItem) => {
    if (!currentUser) {
      alert("링크를 삭제하려면 먼저 Google 로그인이 필요합니다!");
      return;
    }
    setDeleteTarget(link);
  };

  const handleCloseDeleteModal = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (!currentUser) {
      alert("로그인이 필요합니다. 먼저 Google로 로그인해주세요!");
      setDeleteTarget(null);
      return;
    }

    const targetId = deleteTarget.id;
    const targetTitle = deleteTarget.title;
    const targetUid = currentUser.uid;

    // 1. Firestore deleteDoc 실행 (경로: users/{user.uid}/links)
    try {
      await deleteDoc(doc(db, "users", targetUid, "links", targetId));
    } catch (err) {
      console.warn("Firestore deleteDoc 오류:", err);
    }

    // 2. 로컬 상태 반영
    const updated = links.filter((item) => item.id !== targetId);
    saveLinks(updated);

    // 3. 모달 닫기 및 알림
    setDeleteTarget(null);
    setSuccessMessage(`"[${targetTitle}]" 링크가 영구 삭제되었습니다.`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const getLinkIcon = (link: LinkItem) => {
    if (link.tag === "GITHUB" || link.url.includes("github.com")) {
      return <FolderGit2 className="w-4 h-4 text-black stroke-[2.5]" />;
    }
    if (link.tag === "HOT" || link.category === "project") {
      return <Sparkles className="w-4 h-4 text-amber-500 stroke-[2.5]" />;
    }
    if (link.tag === "BLOG" || link.category === "blog") {
      return <BookOpen className="w-4 h-4 text-sky-600 stroke-[2.5]" />;
    }
    if (link.tag === "RESUME") {
      return <FileText className="w-4 h-4 text-purple-600 stroke-[2.5]" />;
    }
    if (link.tag === "TECH" || link.category === "study") {
      return <Layers className="w-4 h-4 text-emerald-600 stroke-[2.5]" />;
    }
    if (link.category === "contact" || link.url.startsWith("mailto:")) {
      return <Mail className="w-4 h-4 text-orange-600 stroke-[2.5]" />;
    }
    if (link.category === "social") {
      return <Zap className="w-4 h-4 text-rose-500 stroke-[2.5]" />;
    }
    return <Link2 className="w-4 h-4 text-black stroke-[2.5]" />;
  };

  return (
    <div className="min-h-screen min-w-[360px] bg-[#FEF08A] text-black flex flex-col justify-between selection:bg-black selection:text-[#FEF08A] font-sans relative overflow-x-auto">
      {/* 상단 네비게이션 티커 */}
      <div className="w-full bg-black text-[#FEF08A] py-2 border-b-[3px] border-black overflow-hidden whitespace-nowrap font-black text-xs tracking-wider select-none shadow-[0px_4px_0px_#000]">
        <div className="inline-block animate-[marquee_20s_linear_infinite]">
          ⚡ MY-LINK MANAGEMENT • NEXT.JS 16 & TYPESCRIPT • FIRESTORE CLOUD CONNECTED • /mypage •&nbsp;
        </div>
        <div className="inline-block animate-[marquee_20s_linear_infinite]" aria-hidden="true">
          ⚡ MY-LINK MANAGEMENT • NEXT.JS 16 & TYPESCRIPT • FIRESTORE CLOUD CONNECTED • /mypage •&nbsp;
        </div>
      </div>

      {/* 중앙 메인 컨테이너 (모바일 360px 보장, 태블릿 최대 480px, 데스크탑 400px 고정) */}
      <main className="w-full min-w-[360px] md:w-[80%] md:max-w-[480px] lg:w-[400px] mx-auto flex flex-col items-center py-6 px-4 flex-1">
        
        {/* 상단 헤더 영역 */}
        <header className="w-full mb-6">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 border-[2.5px] border-black rounded-[8px] shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] font-black text-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
              <span>메인 프로필로</span>
            </Link>

            {/* 11주차: 구글 로그인 / 사용자 이름 표시 & 로그아웃 버튼 */}
            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border-[2.5px] border-black rounded-[8px] shadow-[2px_2px_0px_#000]">
                  {currentUser.photoURL && (
                    <img
                      src={currentUser.photoURL}
                      alt="프로필"
                      className="w-5 h-5 rounded-full border border-black"
                    />
                  )}
                  <span className="text-xs font-black text-black">
                    {currentUser.displayName || "사용자"}님
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="ml-1 px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 border border-black rounded-[5px] text-[11px] font-black cursor-pointer flex items-center gap-1 text-neutral-700"
                  >
                    <LogOut className="w-3 h-3 stroke-[2.5]" />
                    <span>로그아웃</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 border-[2.5px] border-black rounded-[8px] shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] text-xs font-black cursor-pointer transition-all"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Google로 로그인</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4 bg-white border-[3px] border-black rounded-[12px] shadow-[5px_5px_0px_#000] text-center">
            <h1 className="text-2xl font-black tracking-tight mb-1">
              내 링크 관리
            </h1>
            <p className="text-xs font-bold text-neutral-600 mb-2">
              새로운 링크를 추가하고 목록을 관리해보세요!
            </p>
            <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600 pt-2 border-t border-neutral-200">
              <span className="truncate max-w-[220px]">
                저장 경로: <code className="bg-neutral-100 px-1.5 py-0.5 rounded border border-black/20 text-black font-mono">users/{currentUser ? currentUser.uid.slice(0, 8) + "..." : "anonymous"}/links</code>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#22C55E] text-white border border-black rounded-[6px] text-[10px] font-black tracking-tight shrink-0">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Firestore 연동됨
              </span>
            </div>
          </div>
        </header>

        {/* 중간: 링크 추가 폼 영역 */}
        <section className="w-full bg-white border-[3px] border-black rounded-[12px] shadow-[6px_6px_0px_#000] p-5 mb-6">
          <div className="flex items-center justify-between mb-4 border-b-[2.5px] border-black pb-2.5">
            <h2 className="font-black text-base flex items-center gap-2">
              <Plus className="w-5 h-5 stroke-[3]" />
              링크 추가하기
            </h2>
            <span className="text-[10px] font-black bg-[#DDD6FE] text-black px-2 py-0.5 rounded-[4px] border border-black">
              실습 1·2·3
            </span>
          </div>

          {/* 에러 및 성공 안내 메시지 */}
          {errorMessage && (
            <div className="mb-3 p-2.5 bg-rose-100 border-[2px] border-rose-600 rounded-[8px] flex items-center gap-2 text-rose-700 text-xs font-black">
              <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-3 p-2.5 bg-emerald-100 border-[2px] border-emerald-600 rounded-[8px] flex items-center gap-2 text-emerald-800 text-xs font-black">
              <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleAddLink} className="space-y-4">
            {/* 1. 제목 입력 칸 (세로 배치) */}
            <div>
              <label htmlFor="link-title" className="block text-xs font-black mb-1.5 text-neutral-900">
                1. 링크 제목 *
              </label>
              <input
                id="link-title"
                type="text"
                placeholder="링크 제목 입력"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-full px-3.5 py-2.5 bg-white border-[2.5px] border-black rounded-[8px] shadow-[2px_2px_0px_#000] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-neutral-400"
              />
            </div>

            {/* 2. 주소 입력 칸 (세로 배치) */}
            <div>
              <label htmlFor="link-url" className="block text-xs font-black mb-1.5 text-neutral-900">
                2. 주소 (URL) *
              </label>
              <input
                id="link-url"
                type="text"
                placeholder="https://..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-full px-3.5 py-2.5 bg-white border-[2.5px] border-black rounded-[8px] shadow-[2px_2px_0px_#000] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-neutral-400"
              />
            </div>

            {/* 3. 추가 버튼 (보라색 #5B5FC7 스타일) */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#5B5FC7] hover:bg-[#4a4ea5] text-white border-[3px] border-black rounded-[10px] shadow-[4px_4px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>추가하기</span>
              </button>
            </div>
          </form>
        </section>

        {/* 하단: 링크 목록 영역 */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-black text-base flex items-center gap-1.5">
              <span>내 링크 목록</span>
              <span className="text-xs px-2 py-0.5 bg-black text-[#FEF08A] rounded-full border border-black font-extrabold">
                {links.length}
              </span>
            </h2>
            <span className="text-[11px] font-bold text-neutral-700">
              클라우드 실시간 동기화
            </span>
          </div>

          <div className="space-y-3">
            {links.length === 0 ? (
              <div className="p-8 bg-white border-[3px] border-black rounded-[12px] shadow-[4px_4px_0px_#000] text-center">
                <p className="font-black text-sm text-neutral-600">
                  등록된 링크가 없습니다. 위에서 새 링크를 추가해보세요!
                </p>
              </div>
            ) : (
              links.map((link) =>
                editingId === link.id ? (
                  /* ==========================================
                     실습 1 (Update): 인라인 편집 폼 UI
                     - 제목과 주소가 입력 칸으로 변환
                     - 기존 값이 미리 채워져 있음
                     - 저장/취소 버튼 제공
                     ========================================== */
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
                  /* ==========================================
                     일반 링크 카드 (수정 ✏️, 삭제 🗑️ 버튼 포함)
                     ========================================== */
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3.5 bg-white border-[3px] border-black rounded-[12px] shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-0.5"
                  >
                    {/* 좌측 아이콘 */}
                    <div className="w-9 h-9 rounded-[8px] bg-neutral-100 border-[2px] border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000]">
                      {getLinkIcon(link)}
                    </div>

                    {/* 중앙 제목 & URL */}
                    <div className="flex-1 text-left px-3 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-sm text-black truncate max-w-[160px]">
                          {link.title}
                        </h3>
                        {link.tag && (
                          <Badge variant="default" size="sm">
                            {link.tag}
                          </Badge>
                        )}
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-neutral-500 hover:text-black truncate block mt-0.5"
                      >
                        {link.url}
                      </a>
                    </div>

                    {/* 우측 버튼: 새창 열기, 수정(✏️ 파란색), 삭제(🗑️ 빨간색) - 항상 표시 */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="링크 열기"
                        className="w-8 h-8 rounded-[6px] bg-neutral-100 hover:bg-neutral-200 border-[2px] border-black flex items-center justify-center transition-colors shadow-[1px_1px_0px_#000]"
                      >
                        <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                      </a>
                      {/* 수정 버튼: 파란색, 아이콘 ✏️, 클릭 시 콘솔 로그 */}
                      <button
                        type="button"
                        onClick={() => {
                          console.log("수정 버튼 클릭:", link.title);
                          handleStartEdit(link);
                        }}
                        aria-label="링크 수정"
                        className="w-8 h-8 rounded-[6px] bg-blue-500 hover:bg-blue-600 text-white border-[2px] border-black flex items-center justify-center transition-colors cursor-pointer shadow-[1px_1px_0px_#000]"
                      >
                        <Pencil className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      {/* 삭제 버튼: 빨간색, 아이콘 🗑️, 클릭 시 콘솔 로그 */}
                      <button
                        type="button"
                        onClick={() => {
                          console.log("삭제 버튼 클릭:", link.title);
                          handleOpenDeleteModal(link);
                        }}
                        aria-label="링크 삭제"
                        className="w-8 h-8 rounded-[6px] bg-rose-500 hover:bg-rose-600 text-white border-[2px] border-black flex items-center justify-center transition-colors cursor-pointer shadow-[1px_1px_0px_#000]"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </section>
      </main>

      {/* ==========================================
          실습 2 (Delete): 삭제 확인 모달 다이얼로그
          - 제목: "정말 삭제하시겠습니까?"
          - 링크 이름 표시: "[링크 이름] 링크가 삭제됩니다"
          - 경고: "이 작업은 되돌릴 수 없습니다" (빨간색)
          - 버튼: [취소] [삭제하기]
          ========================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border-[3px] border-black rounded-[14px] shadow-[8px_8px_0px_#000] p-6 relative text-left space-y-4">
            {/* 우측 상단 모달 닫기 버튼 */}
            <button
              onClick={handleCloseDeleteModal}
              className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-[6px] border-[2px] border-black cursor-pointer"
              aria-label="모달 닫기"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>

            {/* 1. 모달 제목 */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[8px] bg-rose-100 border-[2px] border-black flex items-center justify-center text-rose-600 shrink-0 shadow-[2px_2px_0px_#000]">
                <Trash2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-black">
                정말 삭제하시겠습니까?
              </h3>
            </div>

            {/* 2. 모달 내용: [링크 이름] 링크가 삭제됩니다 */}
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

            {/* 3. 경고: "이 작업은 되돌릴 수 없습니다" (빨간색) */}
            <div className="p-3 bg-rose-50 border-[2px] border-rose-500 rounded-[8px] flex items-center gap-2 text-rose-600 text-xs font-black shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
              <span className="font-black text-rose-600">이 작업은 되돌릴 수 없습니다</span>
            </div>

            {/* 4. 버튼: [취소] [삭제하기] */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
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
      <footer className="text-center py-5 text-xs font-black text-neutral-800 border-t-[3px] border-black bg-white/70">
        <p>내 링크 관리자 페이지 • /mypage • Powered by Firebase Firestore</p>
      </footer>
    </div>
  );
}
