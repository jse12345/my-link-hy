// 공통 TypeScript 인터페이스 및 타입 정의
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'instagram' | 'email' | 'blog' | 'youtube';
  url: string;
  label: string;
}

export interface ProfileLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  isFeatured?: boolean;
  badge?: string;
  clicks?: number;
}

export interface UserProfile {
  name: string;
  handle: string;
  bio: string;
  location?: string;
  email?: string;
  avatarUrl?: string;
  badges: string[];
  socialLinks: SocialLink[];
  links: ProfileLink[];
}
