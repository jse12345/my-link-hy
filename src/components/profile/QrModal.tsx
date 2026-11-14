import React, { useState } from "react";
import { X, Globe, Smartphone, Info } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QrModal({ isOpen, onClose }: QrModalProps) {
  // 1: 라이브 웹 배포 링크 (누구나 접속 가능), 2: GitHub 저장소
  const [selectedTarget, setSelectedTarget] = useState<"live" | "github">("live");

  if (!isOpen) return null;

  const liveUrl = "https://my-link-hy-fgy1.vercel.app";
  const githubUrl = "https://github.com";

  const currentUrl = selectedTarget === "live" ? liveUrl : githubUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xs bg-white border-[3px] border-black rounded-[14px] shadow-[8px_8px_0px_#000] p-5 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-[6px] border-[2px] border-black cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <h3 className="text-base font-black mb-1">스마트폰 연결 QR 코드</h3>
        <p className="text-xs text-neutral-600 font-bold mb-3">
          스마트폰 기본 카메라로 스캔하세요
        </p>

        {/* 대상 선택 탭 */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 border-[2px] border-black rounded-[8px] mb-3">
          <button
            type="button"
            onClick={() => setSelectedTarget("live")}
            className={`py-1.5 px-2 rounded-[6px] text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
              selectedTarget === "live"
                ? "bg-[#FEF08A] text-black border border-black shadow-[1px_1px_0px_#000]"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>웹 링크 (전국)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTarget("github")}
            className={`py-1.5 px-2 rounded-[6px] text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
              selectedTarget === "github"
                ? "bg-black text-[#FEF08A] border border-black shadow-[1px_1px_0px_#000]"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </button>
        </div>

        {/* QR 코드 이미지 */}
        <div className="p-3 bg-[#FEF08A] border-[2.5px] border-black rounded-[10px] inline-block shadow-[4px_4px_0px_#000] mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
              currentUrl
            )}`}
            alt="QR Code"
            className="w-40 h-40 rounded-[6px] border-[2px] border-black bg-white"
          />
        </div>

        {/* URL 및 안내 문구 */}
        <div className="p-2 bg-neutral-50 border-[2px] border-black rounded-[8px] text-[11px] font-bold text-neutral-800 mb-4 text-left leading-tight">
          <div className="flex items-center gap-1 text-black font-black mb-0.5 truncate">
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{currentUrl}</span>
          </div>
          {selectedTarget === "live" ? (
            <p className="text-[10px] text-emerald-700 font-bold flex items-start gap-1 mt-1">
              <Info className="w-3 h-3 shrink-0 mt-0.5 text-emerald-600" />
              <span>
                LTE/5G, 각자 집 등 <strong>어디서나 스캔해도 바로 열리는 공식 주소</strong>입니다!
              </span>
            </p>
          ) : (
            <p className="text-[10px] text-neutral-600 mt-1">
              LTE/5G 모바일 데이터에서도 언제나 열리는 깃허브 페이지입니다.
            </p>
          )}
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-black text-white hover:bg-neutral-800 h-9 text-xs"
        >
          닫기
        </Button>
      </div>
    </div>
  );
}
