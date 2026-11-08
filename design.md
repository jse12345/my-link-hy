# 🎨 마이링크 디자인 시스템 가이드 (design.md)

> **프로젝트명**: 마이링크 (MyLink / `my-link-hy`)  
> **문서 경로**: `docs/design.md` & `design.md`  
> **작성자**: 정시은  
> **스타일 테마**: Neobrutalism (네오브루탈리즘)  
> **기술 스택**: Next.js 16, React 19, Tailwind CSS v4, shadcn/ui  

---

## 1. 디자인 토큰 및 기본 스타일 규격

### 1.1 컬러 시스템 (Color Palette)
- **메인 시그니처 배경**: 선샤인 옐로우 (`#FEF08A`)
- **서브 파스텔 테마 (5색 체인저 지원)**:
  - 프레시 민트: `#A7F3D0`
  - 버블검 핑크: `#FBCFE8`
  - 쿨 스카이: `#BAE6FD`
  - 드림 라벤더: `#DDD6FE`
- **베이스 및 포인트 컬러**:
  - 딥 블랙 (Ink Black): `#000000` (테두리, 하드 그림자, 타이포그래피)
  - 퓨어 화이트: `#FFFFFF` (아이콘 박스, 모달 배경)
  - 핫 핑크 (Point Red/Rose): `#F43F5E` (COOL! 스티커, HOT 뱃지)
  - 라이브 그린 (Live Emerald): `#22C55E` (ONLINE 상태 펄스 뱃지)

### 1.2 모서리 둥글기 (Border Radius)
네오브루탈리즘의 특성을 살려 요소의 역할과 크기에 따라 최적의 둥글기(Radius)를 표준화합니다:
- **메인 프로필 카드 및 링크 카드**: `12px` (`rounded-[12px]`)
- **공통 버튼 (Button)**: `10px` (`rounded-[10px]` - Default) / `8px` (`rounded-[8px]` - Small)
- **아이콘 박스 (Icon Box)**: `8px` (`rounded-[8px]`)
- **뱃지 (Badge)**: `4px` (`rounded-[4px]`) / `6px` (`rounded-[6px]`)
- **프로필 아바타 (Avatar)**: 완전 원형 (`rounded-full`)

### 1.3 테두리 및 그림자 (Border & Hard Shadow)
블러(Blur)가 없는 선명한 검정색 하드 그림자와 볼드한 검정 테두리를 적용합니다:
- **메인 테두리**: `3px solid black` (`border-[3px] border-black`)
- **컴포넌트/버튼 테두리**: `2.5px ~ 3px solid black`
- **하드 그림자 계층**:
  - `shadow-lg (Profile / Modal)`: `6px 6px 0px #000000` ~ `8px 8px 0px #000000`
  - `shadow-md (LinkCard / Container)`: `4px 4px 0px #000000`
  - `shadow-sm (Button / Badge)`: `2px 2px 0px #000000` ~ `3px 3px 0px #000000`
  - **인터랙션(Hover/Active)**:
    - Hover: `hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000]`
    - Active: `active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000]`

### 1.4 반응형 규격 (Responsive Breakpoints)
- **모바일 (360px ~ 767px)**: 너비 `100%`, `min-w-[360px]` 강제 잠금으로 텍스트 세로 쪼개짐 방어, 패딩 `16px` (`p-4`)
- **태블릿 (768px ~ 1023px)**: 너비 `80%`, 최대 `480px` 중앙 정렬, 패딩 `24px` (`p-6`)
- **데스크탑/노트북 (1024px ~)**: 너비 `400px` 고정 (링크트리 전용 모바일 뷰 락)

---

## 2. shadcn/ui 컴포넌트 구성 및 매핑

### 2.1 Button (`src/components/ui/button.tsx`)
- Neobrutalism 스타일을 기본 탑재한 버튼 컴포넌트
- **Variants**:
  - `default`: `#FEF08A` 배경, 3px 검정 테두리, 3px 하드 그림자
  - `outline`: 화이트 배경, 3px 검정 테두리, 3px 하드 그림자, 호버 시 살짝 부유 모션
  - `secondary`: 중립 배경, 2.5px 검정 테두리
  - `destructive`: 로즈 배경, 2px 검정 테두리
- **Radius**: `10px` (`rounded-[10px]`) / Small `8px` (`rounded-[8px]`)

### 2.2 Badge (`src/components/ui/badge.tsx`)
- 상태 알림 및 링크 카테고리 태그 뱃지
- **Variants**:
  - `hot`: `#F43F5E` 배경 + 불꽃 아이콘 + 1px 검정 테두리
  - `gold`: 블랙 배경 + `#FEF08A` 옐로우 텍스트
  - `new`: `#22C55E` 그린 배경 + 화이트 텍스트
  - `counter`: 실시간 방문 수 표시용 반투명 화이트 뱃지 (`👀 128회 방문`)
- **Radius**: `4px` (`rounded-[4px]`)

### 2.3 Card (`src/components/ui/card.tsx`)
- 네오브루탈리즘 카드의 표준 래퍼
- 3px 검정 테두리, 4px 하드 그림자, 12px 둥근 모서리(`rounded-[12px]`)

---

## 3. 도메인 모듈 컴포넌트 분리

| 컴포넌트 | 경로 | 주요 스타일 및 역할 |
| :--- | :--- | :--- |
| **MarqueeTicker** | `src/components/profile/MarqueeTicker.tsx` | 상단 블랙 롤링 티커 배너 (무한 마퀴 애니메이션) |
| **ControlBar** | `src/components/profile/ControlBar.tsx` | 5색 테마 팔레트 선택기, QR 모달 버튼, URL 복사 버튼 |
| **ProfileHeader** | `src/components/profile/ProfileHeader.tsx` | 120px 원형 아바타, COOL! 스티커, 온라인 펄스 뱃지, 이름, 직함, 소개글 |
| **SocialBar** | `src/components/profile/SocialBar.tsx` | 5대 소셜 채널 (GitHub, Instagram, X, LinkedIn, Email) 아이콘 바 |
| **CategoryTabs** | `src/components/profile/CategoryTabs.tsx` | 전체 / 프로젝트 / 블로그 / 소셜 4개 탭 및 실시간 개수 뱃지 |
| **LinkCard** | `src/components/profile/LinkCard.tsx` | 맞춤형 아이콘, 볼드 타이틀, 설명, 태그 뱃지, 방문 통계 카운터, 화살표 버튼 |
| **AddLinkModal** | `src/components/profile/AddLinkModal.tsx` | 새 링크 추가 팝업 입력 모달 (로컬 스토리지 동기화) |
| **QrModal** | `src/components/profile/QrModal.tsx` | 스마트폰 카메라 스캔용 실시간 QR 코드 팝업 |
