"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/shared/ui/button";
import { vibrate } from "@/shared/lib/haptics";
import { logPractice } from "@/shared/lib/storage";

type Phase = "inhale" | "hold" | "exhale" | "rest";

interface BreathPacerProps {
  inhaleSec?: number;
  holdSec?: number;
  exhaleSec?: number;
  restSec?: number;
}

export function BreathPacer({ inhaleSec = 4, holdSec = 4, exhaleSec = 6, restSec = 2 }: BreathPacerProps) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [progress, setProgress] = useState(0); // 0..1 for current phase
  const [, setCycleMs] = useState((inhaleSec + holdSec + exhaleSec + restSec) * 1000);
  const requestRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const phaseTimes = useMemo(
    () => ({
      inhale: inhaleSec * 1000,
      hold: holdSec * 1000,
      exhale: exhaleSec * 1000,
      rest: restSec * 1000,
    }),
    [inhaleSec, holdSec, exhaleSec, restSec]
  );

  useEffect(() => {
    setCycleMs(phaseTimes.inhale + phaseTimes.hold + phaseTimes.exhale + phaseTimes.rest);
  }, [phaseTimes]);

  useEffect(() => {
    if (!running) return;
    let localPhase: Phase = "inhale";
    let elapsedPhase = 0;
    let lastT = 0;

    function vibrateCue(p: Phase) {
      if (p === "inhale") vibrate(20);
      if (p === "hold") vibrate([10, 40, 10]);
      if (p === "exhale") vibrate(20);
      if (p === "rest") vibrate(10);
    }

    function nextPhase(p: Phase): Phase {
      if (p === "inhale") return "hold";
      if (p === "hold") return "exhale";
      if (p === "exhale") return "rest";
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
    };
  }, [running, phaseTimes]);

  const size = 220;
  const ring = useMemo(() => {
    const p = phase === "inhale" ? progress : phase === "hold" ? 1 : phase === "exhale" ? 1 - progress : 0.05;
    const min = 0.6;
    const max = 1.0;
    const scale = min + (max - min) * p;
    return { scale };
  }, [phase, progress]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative grid place-items-center transition-transform duration-200 ease-out w-[min(75vw,220px)] h-[min(75vw,220px)]"
        style={{ transform: `scale(${ring.scale})` }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-200 to-white" />
        <div className="absolute inset-4 rounded-full bg-white shadow-inner" />
        <div className="relative z-10 text-center">
          <div className="text-xs uppercase tracking-wide text-zinc-500">Phase</div>
          <div className="text-2xl font-semibold capitalize">{phase}</div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        <div className="grid grid-cols-4 gap-3 text-xs text-zinc-600">
          <div>Inhale: {inhaleSec}s</div>
          <div>Hold: {holdSec}s</div>
          <div>Exhale: {exhaleSec}s</div>
          <div>Rest: {restSec}s</div>
        </div>
      </div>

      <div className="flex gap-3">
        {!running ? (
          <Button onClick={() => setRunning(true)}>Start</Button>
        ) : (
          <Button variant="outline" onClick={() => setRunning(false)}>
            Pause
          </Button>
        )}
      </div>
    </div>
  );
}


