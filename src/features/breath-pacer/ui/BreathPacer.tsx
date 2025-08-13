"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/shared/ui/button";
import { vibrate } from "@/shared/lib/haptics";
import { logPractice } from "@/shared/lib/storage";
import { SoundEngine } from "../lib/sound-engine";

type Phase = "inhale" | "holdTop" | "exhale" | "holdBottom";

interface BreathPacerProps {
  inhaleSec?: number;
  holdTopSec?: number;
  exhaleSec?: number;
  holdBottomSec?: number;
}

export function BreathPacer({
  inhaleSec = 4,
  holdTopSec = 4,
  exhaleSec = 6,
  holdBottomSec = 2,
}: BreathPacerProps) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [progress, setProgress] = useState(0); // 0..1 for current phase
  const [, setCycleMs] = useState(
    (inhaleSec + holdTopSec + exhaleSec + holdBottomSec) * 1000,
  );
  const requestRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const soundEngineRef = useRef<SoundEngine | null>(null);
  const phaseTimes = useMemo(
    () => ({
      inhale: inhaleSec * 1000,
      holdTop: holdTopSec * 1000,
      exhale: exhaleSec * 1000,
      holdBottom: holdBottomSec * 1000,
    }),
    [inhaleSec, holdTopSec, exhaleSec, holdBottomSec],
  );

  useEffect(() => {
    setCycleMs(
      phaseTimes.inhale +
        phaseTimes.holdTop +
        phaseTimes.exhale +
        phaseTimes.holdBottom,
    );
  }, [phaseTimes]);

  useEffect(() => {
    if (!running) {
      // Stop sound when pausing
      if (soundEngineRef.current) {
        soundEngineRef.current.stop(1.0);
        soundEngineRef.current = null;
      }
      return;
    }

    // Initialize and start sound engine
    async function startSound() {
      try {
        const engine = new SoundEngine();
        await engine.init();
        await engine.loadAndLoop("/breathe/ocean-waves-112906.mp3");
        engine.start(1.5);
        engine.scheduleBreathCycle({
          inhale: inhaleSec,
          holdTop: holdTopSec,
          exhale: exhaleSec,
          holdBottom: holdBottomSec,
        });
        soundEngineRef.current = engine;
      } catch (error) {
        console.log(
          "Sound initialization failed (probably no user gesture yet):",
          error,
        );
      }
    }

    startSound();
    let localPhase: Phase = "inhale";
    let elapsedPhase = 0;
    let lastT = 0;

    function vibrateCue(p: Phase) {
      if (p === "inhale") vibrate(20);
      if (p === "holdTop") vibrate([10, 40, 10]);
      if (p === "exhale") vibrate(20);
      if (p === "holdBottom") vibrate([5, 20, 5]); // Softer vibration for bottom hold
    }

    function nextPhase(p: Phase): Phase {
      if (p === "inhale") return "holdTop";
      if (p === "holdTop") return "exhale";
      if (p === "exhale") return "holdBottom";
      if (p === "holdBottom") return "inhale";
      return "inhale";
    }

    function tick(t: number) {
      if (!startRef.current) startRef.current = t;
      if (!lastT) lastT = t;
      const dt = t - lastT;
      lastT = t;
      elapsedPhase += dt;
      const target = phaseTimes[localPhase];
      setPhase(localPhase);
      setProgress(Math.min(1, elapsedPhase / target));
      if (elapsedPhase >= target) {
        localPhase = nextPhase(localPhase);
        elapsedPhase = 0;
        vibrateCue(localPhase);
        if (localPhase === "inhale") {
          logPractice();
        }
      }
      requestRef.current = requestAnimationFrame(tick);
    }
    vibrateCue(localPhase);
    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
      startRef.current = null;
      // Stop sound on cleanup
      if (soundEngineRef.current) {
        soundEngineRef.current.stop(1.0);
        soundEngineRef.current = null;
      }
    };
  }, [running, phaseTimes, inhaleSec, holdTopSec, exhaleSec, holdBottomSec]);

  const ring = useMemo(() => {
    const p =
      phase === "inhale"
        ? progress // 0 → 1 (expanding)
        : phase === "holdTop"
          ? 1 // Stay at max
          : phase === "exhale"
            ? 1 - progress // 1 → 0 (contracting)
            : phase === "holdBottom"
              ? 0 // Stay at min (relaxed)
              : 0.6;
    const min = 0.6;
    const max = 1.0;
    const scale = min + (max - min) * p;
    return { scale };
  }, [phase, progress]);

  // Translation helper for phase names
  const getPhaseText = (phase: Phase): string => {
    switch (phase) {
      case "inhale":
        return "Вдох";
      case "holdTop":
        return "Задержка";
      case "exhale":
        return "Выдох";
      case "holdBottom":
        return "Пауза";
      default:
        return phase;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative grid place-items-center transition-transform duration-200 ease-out w-[min(75vw,220px)] h-[min(75vw,220px)]"
        style={{ transform: `scale(${ring.scale})` }}
        role="img"
        aria-label={`Дыхательная визуализация, текущая фаза: ${getPhaseText(phase)}`}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-purple-300 to-indigo-400 shadow-lg shadow-purple-200/30" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-purple-100/90 via-white/95 to-blue-50/90 shadow-inner border border-purple-200/40" />
        <div className="relative z-10 text-center">
          <div className="text-xs uppercase tracking-wide text-[hsl(277_36%_22%)]/70">
            Фаза
          </div>
          <div
            className="text-2xl font-semibold text-[hsl(277_36%_22%)]"
            aria-live="polite"
            aria-atomic="true"
          >
            {getPhaseText(phase)}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        <div className="grid grid-cols-4 gap-2 text-xs text-[hsl(277_36%_22%)]/70">
          <div className="text-center">Вдох: {inhaleSec}с</div>
          <div className="text-center">Задержка: {holdTopSec}с</div>
          <div className="text-center">Выдох: {exhaleSec}с</div>
          <div className="text-center">Пауза: {holdBottomSec}с</div>
        </div>
      </div>

      <div className="flex gap-3">
        {!running ? (
          <Button onClick={() => setRunning(true)}>Начать</Button>
        ) : (
          <Button variant="outline" onClick={() => setRunning(false)}>
            Пауза
          </Button>
        )}
      </div>
    </div>
  );
}
