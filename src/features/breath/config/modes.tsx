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
      >
        <path
          d="M4 16 Q10 10 16 16 Q22 22 28 16"
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
    icon: <div className="text-white/70 font-bold text-md">4-7-8</div>,
  },
  {
    name: "Custom",
    profile: "custom",
    baseClassName: "bg-gradient-to-br from-indigo-500 to-purple-600",
    icon: (
      <div className="w-8 h-8 border-2 border-white/50 rounded-md border-dashed" />
    ),
  },
];
