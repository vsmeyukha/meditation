"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/shared/ui/drawer";
import { Progress } from "@/shared/ui/progress";
import { type Profile } from "../lib/ratios";
import { breathingModes } from "@/features/breath/config/modes";

interface BreathTechniqueStoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  autoCloseMs?: number;
}

const profileMeta: Record<
  Profile,
  { title: string; subtitle?: string; description: string; image: string }
> = {
  default: {
    title: "Default — Базовый",
    subtitle: "Чувствуй себя в настоящем",
    description:
      "Это простой ритм: вдох — пауза — выдох. Идеально для тех, кто только начинает: помогает переключиться с мыслей, глубже почувствовать себя и медленно войти в состояние осознанности.",
    image: "/breathe/default.png",
  },
  box: {
    title: "Box Breathing — Квадратное (4-4-4-4)",
    subtitle: "Примени технику военного спокойствия",
    description:
      "Эта техника использована спецназом ВМС США — Navy SEALs — для сохранения фокуса в экстремальных ситуациях . Четкая структура дыхания успокаивает нервную систему и возвращает контроль, даже когда вокруг хаос.",
    image: "/breathe/box.png",
  },
  coherent: {
    title: "Coherent Breathing — Когерентное (резонансное)",
    subtitle: "Баланс внутри, сила снаружи",
    description:
      "Техника основана на научных исследованиях влияния медленного дыхания (примерно 5–6 вдохов/минуту) на вариабельность сердечного ритма (HRV) и улучшение адаптивности организма. Помогает выровнять ритмы дыхания и сердца, став прихотью науки и души.",
    image: "/breathe/coherent.png",
  },
  relax: {
    title: "Relax — Расслабляющий ритм",
    subtitle: "Мягко отпусти напряжение",
    description:
      "Короткий вдох, слегка длинный выдох — как вздох на вершине волны. Это не древнее учение и не ракетная наука, но работает как мгновенный переключатель: расслабляет мышцы, успокаивает мысли и помогает уйти от напряженной активности.",
    image: "/breathe/relax.png",
  },
  "478": {
    title: "4-7-8 — Дыхание от йогов через медицину к тебе",
    subtitle: "Древняя мудрость, адаптированная врачом",
    description:
      "Корни уходят в йогическую пранаяму, но популяризатор этого паттерна — доктор Эндрю Вейл, великий сторонник интегративной медицины. Он назвал это «тело-транквилизатором»: дыхание, которое помогает заснуть, справиться с тревогой и заполнить тело умиротворением.",
    image: "/breathe/4-7-8.png",
  },
};

export function BreathTechniqueStory({
  open,
  onOpenChange,
  profile,
  autoCloseMs = 10000,
}: BreathTechniqueStoryProps) {
  const meta = useMemo(() => profileMeta[profile], [profile]);
  const bgClass = useMemo(() => {
    return (
      breathingModes.find((m) => m.profile === profile)?.baseClassName ||
      "bg-gradient-to-br from-purple-500 to-indigo-700"
    );
  }, [profile]);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const elapsedRef = useRef(0);
  const startTsRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      setIsPaused(false);
      isPausedRef.current = false;
      elapsedRef.current = 0;
      startTsRef.current = null;
      return;
    }
    const start = performance.now();
    startTsRef.current = start;
    const tick = (t: number) => {
      if (startTsRef.current == null) startTsRef.current = t;
      const elapsedSinceResume = isPausedRef.current
        ? 0
        : t - startTsRef.current;
      const totalElapsed = Math.max(0, elapsedRef.current + elapsedSinceResume);
      const v = Math.min(100, (totalElapsed / autoCloseMs) * 100);
      setProgress(v);
      if (!isPausedRef.current && totalElapsed >= autoCloseMs) {
        onOpenChange(false);
        return;
      }
      timerRef.current = requestAnimationFrame(tick);
    };
    timerRef.current = requestAnimationFrame(tick);
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    };
  }, [open, autoCloseMs, onOpenChange]);

  // Sync pause state to refs and capture elapsed so far when pausing
  useEffect(() => {
    isPausedRef.current = isPaused;
    const now = performance.now();
    if (open) {
      if (isPaused) {
        if (startTsRef.current != null) {
          elapsedRef.current += now - startTsRef.current;
        }
        startTsRef.current = now;
      } else {
        startTsRef.current = now;
      }
    }
  }, [isPaused, open]);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
    >
      <DrawerContent
        showHandle={false}
        className={`${bgClass} text-white border-none rounded-none p-0`}
        style={{
          height: "100svh",
          maxHeight: "100svh",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <DrawerTitle className="sr-only">{meta.title}</DrawerTitle>
        <DrawerDescription className="sr-only">
          {meta.description}
        </DrawerDescription>
        <div
          className="flex h-full w-full flex-col items-center gap-4 px-4 pt-4 pb-6"
          onPointerDown={() => setIsPaused(true)}
          onPointerUp={() => setIsPaused(false)}
          onPointerCancel={() => setIsPaused(false)}
          onPointerLeave={() => setIsPaused(false)}
        >
          {/* Progress (no card) */}
          <div className="w-full max-w-md">
            <Progress
              value={progress}
              indicatorClassName="bg-white/80"
              className="bg-white/20 h-px rounded-none"
            />
          </div>

          {/* Image card */}
          <div className="w-full max-w-md rounded-lg bg-black/70 backdrop-blur-sm border border-none p-3 shadow-md">
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={meta.image}
                alt={meta.title}
                fill
                className="rounded-lg object-contain"
                priority
                sizes="(max-width: 640px) 90vw, 480px"
              />
            </div>
          </div>

          {/* Text card */}
          <div className="w-full max-w-md rounded-lg bg-black/70 backdrop-blur-sm border border-none p-4 shadow-md text-white/70">
            <div className="text-lg font-semibold">{meta.title}</div>
            {meta.subtitle && (
              <div className="text-sm mt-1 opacity-70">{meta.subtitle}</div>
            )}
            <p className="leading-relaxed text-base mt-2 opacity-90">
              {meta.description}
            </p>
          </div>

          {/* Spacer to allow swipe area at bottom */}
          <div className="mt-auto h-6" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
