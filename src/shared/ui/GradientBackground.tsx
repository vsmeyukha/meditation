"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type Palette = [string, string, string, string?];

const palettes: Palette[] = [
  [
    "hsl(258 91% 66%)",
    "hsl(271 83% 64%)",
    "hsl(230 76% 58%)",
    "hsl(250 80% 60%)",
  ],
  [
    "hsl(268 87% 68%)",
    "hsl(290 72% 62%)",
    "hsl(220 72% 54%)",
    "hsl(240 80% 58%)",
  ],
  [
    "hsl(255 85% 65%)",
    "hsl(275 78% 62%)",
    "hsl(225 70% 56%)",
    "hsl(260 70% 60%)",
  ],
  [
    "hsl(245 80% 64%)",
    "hsl(265 80% 60%)",
    "hsl(210 72% 52%)",
    "hsl(235 72% 56%)",
  ],
];

function choosePalette(seed: string): Palette {
  let acc = 0;
  for (let i = 0; i < seed.length; i++)
    acc = (acc * 31 + seed.charCodeAt(i)) >>> 0;
  const p = palettes[acc % palettes.length];
  return p;
}

export function GradientBackground() {
  const pathname = usePathname();
  const [, setTick] = useState(0);

  // Change palette on route; tick is used to trigger CSS transition
  useEffect(() => {
    setTick((t) => t + 1);
  }, [pathname]);

  const [c1, c2, c3, c4] = useMemo(
    () => choosePalette(pathname || "/"),
    [pathname],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-30 transition-opacity duration-700"
      style={{
        // CSS variables consumed by globals gradient class
        ["--g1" as unknown as string]: c1,
        ["--g2" as unknown as string]: c2,
        ["--g3" as unknown as string]: c3,
        ["--g4" as unknown as string]: c4 ?? c2,
      }}
    >
      <div className="absolute inset-0 bg-animated-gradient" />
      {/* subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_120%,hsl(0_0%_0%/_0.25),transparent)]" />
    </div>
  );
}
