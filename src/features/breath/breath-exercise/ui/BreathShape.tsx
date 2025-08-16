"use client";
import React, { useMemo } from "react";
import { type Profile } from "../lib/ratios";

interface BreathShapeProps {
  profile: Profile;
  inhaleSec: number;
  holdTopSec: number;
  exhaleSec: number;
  holdBottomSec: number;
}

export function BreathShape({
  profile,
  inhaleSec,
  holdTopSec,
  exhaleSec,
  holdBottomSec,
}: BreathShapeProps) {
  // Rounded shape classes for non-relax, non-4-7-8 shapes
  const shapeClasses = useMemo(() => {
    switch (profile) {
      case "box":
        return { outer: "rounded-sm", inner: "rounded-sm" };
      case "coherent":
        return { outer: "rounded-lg", inner: "rounded-lg" };
      case "default":
      case "relax":
      case "478":
      default:
        return { outer: "rounded-full", inner: "rounded-full" };
    }
  }, [profile]);

  if (profile === "relax") {
    return (
      <svg
        className="absolute inset-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="relax-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <filter
            id="relax-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="6"
              floodColor="#c4b5fd55"
            />
          </filter>
        </defs>
        <g className="transition-opacity duration-200 ease-in-out">
          <path
            d="M5 60 C 20 35, 35 35, 50 60 S 80 85, 95 60"
            fill="none"
            stroke="url(#relax-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#relax-shadow)"
          />
        </g>
      </svg>
    );
  }

  if (profile === "478") {
    return (
      <svg className="absolute inset-0" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <linearGradient id="seg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        {(() => {
          const cx = 50;
          const cy = 50;
          const r = 40;
          const circumference = 2 * Math.PI * r;
          const a = inhaleSec + holdTopSec + exhaleSec + holdBottomSec;
          const segInhale = (inhaleSec / a) * circumference;
          const segHoldTop = (holdTopSec / a) * circumference;
          const segExhale = (exhaleSec / a) * circumference;
          const gapLen = 8;
          const dInhale = `${Math.max(0, segInhale - gapLen)} ${circumference}`;
          const dHoldTop = `${Math.max(0, segHoldTop - gapLen)} ${circumference}`;
          const dExhale = `${Math.max(0, segExhale - gapLen)} ${circumference}`;
          const offInhale = -gapLen;
          const offHoldTop = -(segInhale + gapLen);
          const offExhale = -(segInhale + segHoldTop + gapLen);
          return (
            <g className="transition-opacity duration-200 ease-in-out">
              <circle
                cx={cx}
                cy={cy}
                r={r}
                stroke="url(#seg-grad)"
                strokeWidth="5"
                fill="none"
                strokeDasharray={dInhale}
                strokeDashoffset={offInhale}
                strokeLinecap="round"
              />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                stroke="url(#seg-grad)"
                strokeWidth="5"
                fill="none"
                strokeDasharray={dHoldTop}
                strokeDashoffset={offHoldTop}
                strokeLinecap="round"
                opacity="0.9"
              />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                stroke="url(#seg-grad)"
                strokeWidth="5"
                fill="none"
                strokeDasharray={dExhale}
                strokeDashoffset={offExhale}
                strokeLinecap="round"
                opacity="0.8"
              />
            </g>
          );
        })()}
      </svg>
    );
  }

  // Default layered shape
  return (
    <>
      <div
        className={`absolute inset-0 ${shapeClasses.outer} bg-gradient-to-br from-purple-400 via-purple-300 to-indigo-400 shadow-lg shadow-purple-200/30`}
      />
      <div
        className={`absolute inset-4 ${shapeClasses.inner} bg-gradient-to-tl from-purple-100/90 via-white/95 to-blue-50/90 shadow-inner border border-purple-200/40`}
      />
    </>
  );
}
