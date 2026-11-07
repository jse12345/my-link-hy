// 자주 사용하는 클래스 네임 병합 및 공통 유틸리티 함수
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
