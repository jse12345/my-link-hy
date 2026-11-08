export interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  category?: "project" | "blog" | "social" | "study" | "contact";
  tag?: string;
  bgColor: string;
  clickCount?: number;
  featured?: boolean;
  isCustom?: boolean;
}

export const DUMMY_LINKS: LinkItem[] = [
  {
    id: "link-1",
    title: "GitHub 메인 프로필 & 저장소",
    subtitle: "my-link-hy 및 프론트엔드 토이 프로젝트 소스 코드",
    url: "https://github.com/jse12345/my-link-hy",
    category: "project",
    tag: "GITHUB",
    bgColor: "bg-white",
    clickCount: 128,
    featured: true,
  },
  {
    id: "link-2",
    title: "바이브 코딩 인터랙티브 포트폴리오",
    subtitle: "AI와 함께 빌드한 Next.js 16 풀스택 웹 애플리케이션 모음",
    url: "https://github.com/jse12345",
    category: "project",
    tag: "HOT",
    bgColor: "bg-[#FDE047]", // 옐로우
    clickCount: 254,
    featured: true,
  },
  {
    id: "link-3",
    title: "정시은의 기술 공부 블로그 & 회고",
    subtitle: "React 19, TypeScript, 디자인 시스템 학습 일지와 문제 해결기",
    url: "https://github.com/jse12345",
    category: "blog",
    tag: "BLOG",
    bgColor: "bg-[#BAE6FD]", // 스카이블루
    clickCount: 89,
  },
  {
    id: "link-4",
    title: "노션(Notion) 이력서 & 자기소개서",
    subtitle: "상세 학력, 프로젝트 경험, 수상 및 자격증 이력 한눈에 보기",
    url: "https://notion.so",
    category: "project",
    tag: "RESUME",
    bgColor: "bg-[#DDD6FE]", // 라벤더
    clickCount: 67,
    featured: true,
  },
  {
    id: "link-5",
    title: "사용한 프론트엔드 기술 스택 맵",
    subtitle: "Next.js 16 · React 19 · Tailwind CSS v4 · shadcn/ui",
    url: "https://nextjs.org",
    category: "study",
    tag: "TECH",
    bgColor: "bg-[#A7F3D0]", // 민트
    clickCount: 43,
  },
  {
    id: "link-6",
    title: "공식 인스타그램 일상 & 개발 스토리",
    subtitle: "코딩 일상과 스터디 라이프를 공유하는 인스타 채널",
    url: "https://instagram.com",
    category: "social",
    tag: "SNS",
    bgColor: "bg-[#FBCFE8]", // 핑크
    clickCount: 112,
  },
  {
    id: "link-7",
    title: "커피챗 & 프로젝트 협업 문의 메일",
    subtitle: "used776655@gmail.com 으로 자유롭게 제안 및 연락주세요",
    url: "mailto:used776655@gmail.com",
    category: "contact",
    tag: "CONTACT",
    bgColor: "bg-[#FED7AA]", // 오렌지
    clickCount: 35,
  },
];

// 카테고리 탭 목록 정의
export const LINK_CATEGORIES = [
  { id: "all", label: "전체 보기" },
  { id: "project", label: "🚀 대표 프로젝트" },
  { id: "blog", label: "📝 블로그 & 스터디" },
  { id: "social", label: "🌐 소셜 & 연락처" },
] as const;
