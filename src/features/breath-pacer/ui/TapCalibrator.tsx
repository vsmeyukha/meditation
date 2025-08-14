"use client";
import { useRef, useState } from "react";
import { vibrate } from "@/shared/lib/haptics";

interface TapCalibratorProps {
  onClose: () => void;
  onCalibrated: (cycleSec: number) => void;
  minSec?: number;
  maxSec?: number;
}

export function TapCalibrator({
  onClose,
  onCalibrated,
  minSec = 6,
  maxSec = 24,
}: TapCalibratorProps) {
  const [tapCount, setTapCount] = useState(0);
  const [hint, setHint] = useState("Тапни в момент начала вдоха");
  const firstTapRef = useRef<number | null>(null);

  const onTap = () => {
    const now = performance.now();

    if (tapCount === 0) {
      firstTapRef.current = now;
      setTapCount(1);
      setHint("Ещё раз — в начале следующего вдоха");
      vibrate(10);
      return;
    }

    if (!firstTapRef.current) return;

    const totalSec = (now - firstTapRef.current) / 1000;
    vibrate([8, 24, 8]);

    if (totalSec < minSec || totalSec > maxSec) {
      setHint(
        `Цикл ${totalSec.toFixed(1)}с вне диапазона ${minSec}–${maxSec}с. Попробуй ещё раз`,
      );
      setTapCount(0);
      firstTapRef.current = null;
      return;
    }

    onCalibrated(totalSec);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTap();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 text-white"
      onClick={onTap}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-label="Калибровка дыхания"
    >
      <div
        className="text-center space-y-3 px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-sm opacity-80">Калибровка дыхания</div>
        <div className="text-xl font-semibold max-w-sm">{hint}</div>
        <div className="text-xs opacity-70 max-w-md">
          Дважды тапни в свой ритм (от вдоха до следующего вдоха)
        </div>
        {tapCount > 0 && (
          <div className="text-sm text-purple-300 animate-pulse">
            Готов к следующему тапу...
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="mt-6 rounded-full px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors text-sm"
          aria-label="Отменить калибровку"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
