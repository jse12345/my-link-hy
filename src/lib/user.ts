import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  displayName: string;
  username: string;
  bio?: string;
  photoURL?: string;
  email?: string;
}

/**
 * displayName 또는 username으로 Firestore에서 사용자 정보 조회
 * (Walkthrough 명세: getUserByDisplayName)
 */
export async function getUserByDisplayName(displayName: string): Promise<UserProfile | null> {
  if (!displayName) return null;
  const decoded = decodeURIComponent(displayName).trim();
  const lower = decoded.toLowerCase();

  try {
    // 1. users 컬렉션에서 displayName 일치 조회
    const qName = query(collection(db, "users"), where("displayName", "==", decoded));
    const snapName = await getDocs(qName);
    if (!snapName.empty) {
      const d = snapName.docs[0];
      const data = d.data();
      return {
        uid: d.id,
        displayName: data.displayName || decoded,
        username: data.username || lower,
        bio: data.bio || "",
        photoURL: data.photoURL || "",
        email: data.email || "",
      };
    }

    // 2. users 컬렉션에서 username 일치 조회
    const qUser = query(collection(db, "users"), where("username", "==", lower));
    const snapUser = await getDocs(qUser);
    if (!snapUser.empty) {
      const d = snapUser.docs[0];
      const data = d.data();
      const prof = data.profile || data;
      return {
        uid: d.id,
        displayName: prof.displayName || data.displayName || decoded,
        username: prof.username || data.username || lower,
        bio: prof.bio || data.bio || "",
        photoURL: prof.photoURL || data.photoURL || "",
        email: prof.email || data.email || "",
      };
    }

    // 2-1. users 컬렉션에서 profile.username 일치 조회 (Slide 3 명세)
    const qProfileUser = query(collection(db, "users"), where("profile.username", "==", lower));
    const snapProfileUser = await getDocs(qProfileUser);
    if (!snapProfileUser.empty) {
      const d = snapProfileUser.docs[0];
      const data = d.data();
      const prof = data.profile || data;
      return {
        uid: d.id,
        displayName: prof.displayName || data.displayName || decoded,
        username: prof.username || data.username || lower,
        bio: prof.bio || data.bio || "",
        photoURL: prof.photoURL || data.photoURL || "",
        email: prof.email || data.email || "",
      };
    }

    // 3. usernames/{username} 매핑 문서 조회
    const mapSnap = await getDoc(doc(db, "usernames", lower));
    if (mapSnap.exists()) {
      const mapData = mapSnap.data();
      const uid = mapData.uid;
      const profSnap = await getDoc(doc(db, "users", uid, "profile", "info"));
      const profData = profSnap.exists() ? profSnap.data() : {};
      return {
        uid,
        displayName: profData.displayName || mapData.displayName || decoded,
        username: profData.username || lower,
        bio: profData.bio || "",
        photoURL: profData.photoURL || "",
        email: profData.email || "",
      };
    }

    // 4. 기본 프로필 폴백 (정시은 계정)
    if (["sieun", "jse12345", "used776655", "정시은"].includes(lower) || decoded === "정시은") {
      return {
        uid: "sieun-default",
        displayName: "정시은",
        username: "sieun",
        bio: "안녕하세요! 바이브 코딩으로 유쾌하고 가치 있는 서비스를 만드는 정시은입니다 ✨",
      };
    }

    return null;
  } catch (err) {
    console.error("getUserByDisplayName 에러:", err);
    return null;
  }
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  return getUserByDisplayName(username);
}
