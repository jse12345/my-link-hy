"use client";

import { useState, useEffect, useCallback } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isMock?: boolean;
}

const MOCK_STORAGE_KEY = "my-link-mock-user";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Firebase Auth 실시간 인증 상태 감지 + 로컬 Mock fallback 감지
  useEffect(() => {
    // 로컬 Mock 유저 확인
    const savedMock = typeof window !== "undefined" ? localStorage.getItem(MOCK_STORAGE_KEY) : null;
    if (savedMock) {
      try {
        const parsed = JSON.parse(savedMock);
        setUser(parsed);
        setLoading(false);
      } catch {
        // ignore
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Firebase 실제 로그인 유저
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || "사용자",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          isMock: false,
        });
        localStorage.removeItem(MOCK_STORAGE_KEY);
      } else {
        // Firebase 로그아웃 상태일 때 Mock 유저가 없으면 null
        const mock = localStorage.getItem(MOCK_STORAGE_KEY);
        if (!mock) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. 구글 팝업 로그인
  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      setUser({
        uid: result.user.uid,
        displayName: result.user.displayName || "사용자",
        email: result.user.email,
        photoURL: result.user.photoURL,
        isMock: false,
      });
      localStorage.removeItem(MOCK_STORAGE_KEY);
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setLoading(false);
        return;
      }

      if (err.code === "auth/configuration-not-found" || err.code === "auth/operation-not-allowed") {
        const wantMock = window.confirm(
          "⚠️ Firebase 콘솔에서 Authentication이 아직 활성화되지 않았습니다!\n\n" +
          "콘솔 설정 전에도 바로 화면을 확인하실 수 있도록\n" +
          "'정시은' 테스트 계정으로 즉시 로그인하시겠습니까?\n\n" +
          "(확인: 테스트 계정으로 로그인 / 취소: 닫기)"
        );
        if (wantMock) {
          loginWithTestUser("정시은");
          return;
        }
      } else {
        alert("로그인 중 오류가 발생했습니다: " + (err.message || err.code));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. 테스트 계정 로그인 (Firebase 콘솔 미설정 시 즉시 테스트 지원)
  const loginWithTestUser = useCallback((name: string = "정시은") => {
    const mockUser: AuthUser = {
      uid: "user-jse12345",
      displayName: name,
      email: "jse12345@hanyang.ac.kr",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=jse",
      isMock: true,
    };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
  }, []);

  // 4. 로그아웃
  const logout = useCallback(async () => {
    try {
      localStorage.removeItem(MOCK_STORAGE_KEY);
      await signOut(auth);
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    loginWithGoogle,
    loginWithTestUser,
    logout,
  };
}
