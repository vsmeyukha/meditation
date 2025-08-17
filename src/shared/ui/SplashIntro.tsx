"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const TITLE_PURPLE = "#8E6AE2";

export function SplashIntro() {
  const [isOpen, setIsOpen] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 3200);
    const closeTimer = setTimeout(() => setIsOpen(false), 3900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      {/* Animated dark purple gradient background used across the app */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-animated-gradient opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a102a]/90 via-[#0c0a1a]/90 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_120%,hsl(0_0%_0%/_0.35),transparent)]" />
      </div>

      {/* Centered logo/image and title */}
      <div
        className={`relative flex flex-col items-center transition-all duration-500 ${isFading ? "scale-95" : "scale-100"}`}
      >
        <Image
          src="/f.png"
          alt="Meditation"
          width={250}
          height={250}
          priority
          className="drop-shadow-2xl"
        />
        <div
          className="mt-10 text-4xl md:text-3xl tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          style={{ color: TITLE_PURPLE }}
        >
          F Meditation
        </div>
      </div>
    </div>
  );
}
