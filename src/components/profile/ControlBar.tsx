import React from "react";
import { Palette, QrCode, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ThemePalette {
  id: string;
  name: string;
  bg: string;
  code: string;
}

interface ControlBarProps {
  palettes: ThemePalette[];
  currentTheme: string;
  onSelectTheme: (code: string) => void;
  onOpenQr: () => void;
  onCopyLink: () => void;
  copied: boolean;
}

export function ControlBar({
  palettes,
  currentTheme,
  onSelectTheme,
  onOpenQr,
  onCopyLink,
  copied,
}: ControlBarProps) {
  return (
    <header className="w-full flex items-center justify-between mb-4 px-1">
      {/* 테마 컬러 팔레트 */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border-[3px] border-black rounded-[10px] shadow-[3px_3px_0px_#000]">
        <Palette className="w-3.5 h-3.5 ml-1 text-black shrink-0 stroke-[2.5]" />
        {palettes.map((palette) => (
          <button
            key={palette.id}
            onClick={() => onSelectTheme(palette.code)}
            aria-label={palette.name}
            className={`w-4 h-4 rounded-full border-[2px] border-black transition-transform cursor-pointer ${palette.bg} ${
              currentTheme === palette.code ? "scale-125 ring-2 ring-black" : "hover:scale-110"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        {/* QR 코드 버튼 */}
        <Button
          variant="outline"
          size="icon"
          onClick={onOpenQr}
          aria-label="QR 코드 보기"
          className="p-0 size-9"
        >
          <QrCode className="w-4 h-4 stroke-[2.5]" />
        </Button>

        {/* 공유 / 복사 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={onCopyLink}
          aria-label="링크 공유하기"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
              <span>복사됨!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>공유</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
