import { ReactNode } from "react";
import { type Profile } from "@/features/breath/breath-exercise/lib/ratios";

export interface BreathingMode {
  name: string;
  profile: Profile | "custom";
  icon: ReactNode;
  baseClassName: string;
}

export const breathingModes: BreathingMode[] = [
  {
    name: "Default",
    profile: "default",
    baseClassName: "bg-gradient-to-br from-purple-400 to-indigo-500",
    icon: <div className="w-8 h-8 border-2 border-white/70 rounded-full" />,
  },
  {
    name: "Box",
    profile: "box",
    baseClassName: "bg-gradient-to-br from-blue-400 to-blue-600",
    icon: <div className="w-8 h-8 border-2 border-white/70 rounded-sm" />,
  },
  {
    name: "Relax",
    profile: "relax",
    baseClassName: "bg-gradient-to-br from-orange-300 to-pink-400",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="text-white/70"
        aria-label="Relax wave"
      >
        <path
          d="M3 18 C7 12 13 12 16 16 C19 20 25 20 29 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: "Coherent",
    profile: "coherent",
    baseClassName: "bg-gradient-to-br from-teal-400 to-green-500",
    icon: (
      <div className="w-8 h-8 bg-white/30 rounded-lg border border-white/50" />
    ),
  },
  {
    name: "4-7-8",
    profile: "478",
    baseClassName: "bg-gradient-to-br from-purple-600 to-indigo-700",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="text-white/70"
        aria-label="4-7-8 pattern"
      >
        <defs>
          <linearGradient id="seg-card" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        {(() => {
          const r = 12;
          const cx = 16;
          const cy = 16;
          const C = 2 * Math.PI * r;
          const total = 4 + 7 + 8;
          const seg4 = (4 / total) * C;
          const seg7 = (7 / total) * C;
          const seg8 = (8 / total) * C;
          const gap = 2.5;
          const dash4 = `${Math.max(0, seg4 - gap)} ${C}`;
          const dash7 = `${Math.max(0, seg7 - gap)} ${C}`;
          const dash8 = `${Math.max(0, seg8 - gap)} ${C}`;
          const offset4 = 0;
          const offset7 = -(seg4 + gap);
          const offset8 = -(seg4 + seg7 + gap * 2);
          return (
            <g>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                stroke="currentColor"
                opacity="0.25"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                stroke="url(#seg-card)"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray={dash4}
                strokeDashoffset={offset4}
                strokeLinecap="round"
              />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                stroke="url(#seg-card)"
                strokeWidth="2.5"
                opacity="0.9"
                fill="none"
                strokeDasharray={dash7}
                strokeDashoffset={offset7}
                strokeLinecap="round"
              />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                stroke="url(#seg-card)"
                strokeWidth="2.5"
                opacity="0.7"
                fill="none"
                strokeDasharray={dash8}
                strokeDashoffset={offset8}
                strokeLinecap="round"
              />
            </g>
          );
        })()}
      </svg>
    ),
  },
  // {
  //   name: "Custom",
  //   profile: "custom",
  //   baseClassName: "bg-gradient-to-br from-indigo-500 to-purple-600",
  //   icon: (
  //     <div className="w-8 h-8 border-2 border-white/50 rounded-md border-dashed" />
  //   ),
  // },
];
