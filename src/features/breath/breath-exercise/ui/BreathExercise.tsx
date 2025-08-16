"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { vibrate } from "@/shared/lib/haptics";
import { logPractice } from "@/shared/lib/storage";
import { SoundEngine } from "../lib/sound-engine";
import { type Profile } from "../lib/ratios";

type Phase = "inhale" | "holdTop" | "exhale" | "holdBottom";

interface BreathExerciseProps {
  inhaleSec?: number;
  holdTopSec?: number;
  exhaleSec?: number;
  holdBottomSec?: number;
  profile?: Profile;
  onRunningChange?: (running: boolean) => void;
  onDoubleClick?: () => void;
}

export function BreathExercise({
  inhaleSec = 4,
  holdTopSec = 4,
  exhaleSec = 6,
  holdBottomSec = 2,
  profile = "default",
  onRunningChange,
  onDoubleClick,
}: BreathExerciseProps) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [progress, setProgress] = useState(0); // 0..1 for current phase
  const [, setCycleMs] = useState(
    (inhaleSec + holdTopSec + exhaleSec + holdBottomSec) * 1000,
  );
  const requestRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const soundEngineRef = useRef<SoundEngine | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);
  const phaseTimes = useMemo(
    () => ({
      inhale: inhaleSec * 1000,
      holdTop: holdTopSec * 1000,
      exhale: exhaleSec * 1000,
      holdBottom: holdBottomSec * 1000,
    }),
    [inhaleSec, holdTopSec, exhaleSec, holdBottomSec],
  );

  // Notify parent after commit to avoid setState during render in parent
  useEffect(() => {
    if (onRunningChange) onRunningChange(running);
  }, [running, onRunningChange]);

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
        await engine.loadAndLoop("/breathe/waves.WAV");
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

  // Get phase labels based on breathing profile
  const getPhaseLabelsForProfile = (profile: Profile) => {
    switch (profile) {
      case "box":
        return {
          inhale: "Вдох",
          holdTop: "Удержание",
          exhale: "Выдох",
          holdBottom: "Пауза",
        };
      case "coherent":
        return {
          inhale: "Вдох",
          holdTop: "Пауза",
          exhale: "Выдох",
          holdBottom: "Пауза",
        };
      case "relax":
        return {
          inhale: "Вдох",
          holdTop: "Небольшая пауза",
          exhale: "Медленный выдох",
          holdBottom: "Отдых",
        };
      case "478":
        return {
          inhale: "Вдох (4)",
          holdTop: "Задержка (7)",
          exhale: "Выдох (8)",
          holdBottom: "Пауза",
        };
      case "default":
      default:
        return {
          inhale: "Вдох",
          holdTop: "Держим",
          exhale: "Выдох",
          holdBottom: "Пауза",
        };
    }
  };

  // Translation helper for phase names
  const getPhaseText = (phase: Phase): string => {
    const labels = getPhaseLabelsForProfile(profile);
    return labels[phase] || phase;
  };

  const labels = getPhaseLabelsForProfile(profile);
  const phaseLabels = [
    { phase: "inhale" as const, label: labels.inhale, duration: inhaleSec },
    { phase: "holdTop" as const, label: labels.holdTop, duration: holdTopSec },
    { phase: "exhale" as const, label: labels.exhale, duration: exhaleSec },
    {
      phase: "holdBottom" as const,
      label: labels.holdBottom,
      duration: holdBottomSec,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative grid place-items-center transition-transform duration-200 ease-out w-[min(75vw,220px)] h-[min(75vw,220px)] cursor-pointer"
        style={{ transform: `scale(${ring.scale})` }}
        role="button"
        aria-label={
          running
            ? `Дыхательная визуализация, текущая фаза: ${getPhaseText(phase)}. Нажмите для остановки`
            : "Нажмите чтобы начать дыхательную практику"
        }
        onClick={() => {
          const now = Date.now();
          const timeDiff = now - lastClickTimeRef.current;

          if (timeDiff < 300) {
            // Double tap detected (within 300ms)
            clickCountRef.current = 0;
            onDoubleClick?.();
          } else {
            clickCountRef.current = 1;
            setTimeout(() => {
              if (clickCountRef.current === 1) {
                // Single tap action
                setRunning((prev) => !prev);
              }
            }, 300);
          }

          lastClickTimeRef.current = now;
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setRunning((prev) => !prev);
          }
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-purple-300 to-indigo-400 shadow-lg shadow-purple-200/30" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-purple-100/90 via-white/95 to-blue-50/90 shadow-inner border border-purple-200/40" />
        <div className="relative z-10 text-center">
          <div className="text-xs uppercase tracking-wide text-[hsl(277_36%_22%)]/70">
            {running ? "Фаза" : "Нажмите для начала"}
          </div>
          <div
            className="text-2xl font-semibold text-[hsl(277_36%_22%)]"
            aria-live="polite"
            aria-atomic="true"
          >
            {running ? getPhaseText(phase) : "Начать"}
          </div>
        </div>
      </div>

      <div
        className={`w-full max-w-md space-y-3 transition-all duration-[2000ms] ease-in-out ${
          running ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="grid grid-cols-4 gap-2 text-xs">
          {phaseLabels.map(({ phase: phaseKey, label, duration }) => (
            <div
              key={phaseKey}
              className={`text-center transition-all duration-700 ease-in-out ${
                running && phase === phaseKey
                  ? "text-purple-600"
                  : "text-[hsl(277_36%_22%)]/70"
              }`}
            >
              {label}: {duration}с
            </div>
          ))}
        </div>
      </div>

      <div
        className={`text-center text-sm transition-all duration-[2000ms] ease-in-out ${
          running ? "opacity-0 pointer-events-none" : "opacity-100"
        } text-[hsl(277_36%_22%)]/60`}
      >
        Нажмите на круг чтобы начать
      </div>
    </div>
  );
}
