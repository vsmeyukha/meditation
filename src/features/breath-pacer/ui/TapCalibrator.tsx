"use client";
import { useRef, useState, useEffect } from "react";
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
  const [calibrationStage, setCalibrationStage] = useState(0); // 0: waiting for first double-tap, 1: waiting for second double-tap
  const [hint, setHint] = useState("Дважды тапни в момент начала вдоха");
  const firstDoubleTapRef = useRef<number | null>(null);
  const lastTapRef = useRef<number | null>(null);
  const doubleTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onTap = () => {
    const now = performance.now();

    // Check if this is potentially the second tap of a double-tap
    if (lastTapRef.current && now - lastTapRef.current < 300) {
      // This is a double-tap!
      if (doubleTapTimeoutRef.current) {
        clearTimeout(doubleTapTimeoutRef.current);
        doubleTapTimeoutRef.current = null;
      }

      if (calibrationStage === 0) {
        // First double-tap - start timing
        firstDoubleTapRef.current = now;
        setCalibrationStage(1);
        setHint("Дважды тапни в начале следующего вдоха");
        vibrate([10, 50, 10]);
      } else {
        // Second double-tap - complete calibration
        if (!firstDoubleTapRef.current) return;

        const totalSec = (now - firstDoubleTapRef.current) / 1000;
        vibrate([8, 24, 8, 24, 8]);

        if (totalSec < minSec || totalSec > maxSec) {
          setHint(
            `Цикл ${totalSec.toFixed(1)}с вне диапазона ${minSec}–${maxSec}с. Попробуй ещё раз`,
          );
          setCalibrationStage(0);
          firstDoubleTapRef.current = null;
          return;
        }

        onCalibrated(totalSec);
        onClose();
      }
      lastTapRef.current = null;
    } else {
      // This is the first tap, wait for potential second tap
      lastTapRef.current = now;
      doubleTapTimeoutRef.current = setTimeout(() => {
        lastTapRef.current = null;
        doubleTapTimeoutRef.current = null;
      }, 300);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (doubleTapTimeoutRef.current) {
        clearTimeout(doubleTapTimeoutRef.current);
      }
    };
  }, []);

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
      <div className="text-center space-y-3 px-6 pointer-events-none">
        <div className="text-sm opacity-80">Калибровка дыхания</div>
        <div className="text-xl font-semibold max-w-sm">{hint}</div>
        <div className="text-xs opacity-70 max-w-md">
          {calibrationStage === 0
            ? "Дважды тапни в момент начала первого вдоха"
            : "Дважды тапни в момент начала следующего вдоха"}
        </div>
        {calibrationStage === 1 && (
          <div className="text-sm text-purple-300 animate-pulse">
            Готов к следующему двойному тапу...
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="mt-6 rounded-full px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors text-sm pointer-events-auto"
          aria-label="Отменить калибровку"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
