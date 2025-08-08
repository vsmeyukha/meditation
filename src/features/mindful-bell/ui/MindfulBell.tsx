"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { playBell } from "@/shared/lib/audio";

interface MindfulBellProps {
  defaultMinutes?: number;
  defaultIntervalMin?: number;
}

export function MindfulBell({
  defaultMinutes = 10,
  defaultIntervalMin = 3,
}: MindfulBellProps) {
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [intervalMin, setIntervalMin] = useState(defaultIntervalMin);
  const [running, setRunning] = useState(false);
  const endRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const nextBellRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    const duration = minutes * 60 * 1000;
    const interval = Math.max(1, intervalMin) * 60 * 1000;
    endRef.current = start + duration;
    nextBellRef.current = start + interval;
    playBell();
    function loop(t: number) {
      if (!endRef.current) return;
      if (t >= endRef.current) {
        playBell();
        setRunning(false);
        return;
      }
      if (nextBellRef.current && t >= nextBellRef.current) {
        playBell();
        nextBellRef.current = t + interval;
      }
      tickRef.current = requestAnimationFrame(loop);
    }
    tickRef.current = requestAnimationFrame(loop);
    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      tickRef.current = null;
      endRef.current = null;
      nextBellRef.current = null;
    };
  }, [running, minutes, intervalMin]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs text-[hsl(277_36%_22%)]/70">
            Duration (min)
          </div>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value || "1"))}
          />
        </div>
        <div className="space-y-2">
          <div className="text-xs text-[hsl(277_36%_22%)]/70">
            Interval bell (min)
          </div>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            value={intervalMin}
            onChange={(e) => setIntervalMin(parseInt(e.target.value || "1"))}
          />
        </div>
      </div>
      {!running ? (
        <Button onClick={() => setRunning(true)}>Start</Button>
      ) : (
        <Button variant="outline" onClick={() => setRunning(false)}>
          Stop
        </Button>
      )}
    </div>
  );
}
