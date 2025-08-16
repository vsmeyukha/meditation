"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function SplashIntro() {
  const [isOpen, setIsOpen] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [titleColor, setTitleColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 3200);
    const closeTimer = setTimeout(() => setIsOpen(false), 3900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  // Sample the dominant purple from the image to color the title
  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = "/f.png";
    img.onload = () => {
      if (cancelled) return;
      const maxDim = 140;
      const width = Math.max(1, Math.floor(Math.min(maxDim, img.naturalWidth)));
      const height = Math.max(
        1,
        Math.floor((img.naturalHeight / img.naturalWidth) * width),
      );
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);
      const image = ctx.getImageData(0, 0, width, height);
      const data = image.data;

      function rgbToHsl(r: number, g: number, b: number) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b),
          min = Math.min(r, g, b);
        let h = 0,
          s = 0;
        const l = (max + min) / 2;
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max - min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            default:
              h = (r - g) / d + 4;
          }
          h /= 6;
        }
        return { h: h * 360, s, l };
      }

      let sumR = 0,
        sumG = 0,
        sumB = 0,
        count = 0;
      let backupSumR = 0,
        backupSumG = 0,
        backupSumB = 0,
        backupCount = 0;
      const step = 2; // sample every 2px in each axis
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          const r = data[idx],
            g = data[idx + 1],
            b = data[idx + 2],
            a = data[idx + 3];
          if (a < 40) continue; // skip mostly transparent
          const { h, s, l } = rgbToHsl(r, g, b);
          // Prefer vivid purples roughly matching contours
          if (s > 0.35 && l > 0.15 && l < 0.75 && h >= 250 && h <= 300) {
            sumR += r;
            sumG += g;
            sumB += b;
            count++;
          }
          backupSumR += r;
          backupSumG += g;
          backupSumB += b;
          backupCount++;
        }
      }

      const useCount = count > 50 ? count : backupCount;
      const rAvg = Math.round((count > 50 ? sumR : backupSumR) / useCount);
      const gAvg = Math.round((count > 50 ? sumG : backupSumG) / useCount);
      const bAvg = Math.round((count > 50 ? sumB : backupSumB) / useCount);
      const rgb = `rgb(${rAvg}, ${gAvg}, ${bAvg})`;
      setTitleColor(rgb);
    };
    return () => {
      cancelled = true;
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
          style={{ color: titleColor || undefined }}
        >
          F Meditation
        </div>
      </div>
    </div>
  );
}
