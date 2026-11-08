import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QrModal({ isOpen, onClose }: QrModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xs bg-white border-[3px] border-black rounded-[14px] shadow-[8px_8px_0px_#000] p-6 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-[6px] border-[2px] border-black cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <h3 className="text-base font-black mb-1">내 링크 QR 코드</h3>
        <p className="text-xs text-neutral-600 font-bold mb-4">
          카메라로 스캔하면 바로 연결됩니다
        </p>

        <div className="p-3 bg-[#FEF08A] border-[2.5px] border-black rounded-[10px] inline-block shadow-[4px_4px_0px_#000] mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.href : "https://github.com/jse12345/my-link-hy"
            )}`}
            alt="QR Code"
            className="w-44 h-44 rounded-[6px] border-[2px] border-black"
          />
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-black text-white hover:bg-neutral-800"
        >
          닫기
        </Button>
      </div>
    </div>
  );
}
