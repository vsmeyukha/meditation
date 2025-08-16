"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";

interface AutoHeightProps {
  children: React.ReactNode;
  className?: string;
  durationMs?: number;
  easing?: string;
  trigger?: unknown;
}

export function AutoHeight({
  children,
  className,
  durationMs = 300,
  easing = "ease",
  trigger,
}: AutoHeightProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prevHeightRef = useRef<number | null>(null);

  // Initialize previous height on mount
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    prevHeightRef.current = el.scrollHeight;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const previous = prevHeightRef.current ?? el.scrollHeight;
    const next = el.scrollHeight;

    // If height didn't change, skip
    if (previous === next) return;

    el.style.overflow = "hidden";
    el.style.height = `${previous}px`;
    // Force reflow to apply starting height
    void el.offsetHeight;
    el.style.transition = `height ${durationMs}ms ${easing}`;

    requestAnimationFrame(() => {
      el.style.height = `${next}px`;
    });

    const handleEnd = () => {
      el.style.transition = "";
      el.style.height = "auto";
      el.style.overflow = "visible";
      prevHeightRef.current = next;
      el.removeEventListener("transitionend", handleEnd);
    };

    el.addEventListener("transitionend", handleEnd);
    // Fallback: ensure cleanup after duration
    const timeout = window.setTimeout(handleEnd, durationMs + 50);
    return () => window.clearTimeout(timeout);
  }, [trigger, durationMs, easing, children]);

  return (
    <div ref={ref} className={className} style={{ height: "auto" }}>
      {children}
    </div>
  );
}
