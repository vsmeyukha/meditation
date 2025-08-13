"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ambientStore } from "@/shared/lib/ambientStore";
import { XIcon, PauseIcon, PlayIcon } from "lucide-react";

function isTouch() {
  return (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
}

export function FloatingAmbientButton() {
  const pathname = usePathname();
  const state = useSyncExternalStore(
    (cb) => ambientStore.subscribe(cb),
    () => ambientStore.getState(),
    () => ambientStore.getState(),
  );
  const [visible, setVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Hide on mixer page since it has its own controls
  const isOnMixerPage = pathname === "/practice/mixer";

  // Load state only on client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    const x = parseFloat(el.style.right || "16");
    const y = parseFloat(el.style.bottom || "24");

    function onStart(e: MouseEvent | TouchEvent) {
      dragging = true;
      const p = "touches" in e ? e.touches[0] : (e as MouseEvent);
      startX = p.clientX;
      startY = p.clientY;
      e.preventDefault();
    }
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging) return;
      const p = "touches" in e ? e.touches[0] : (e as MouseEvent);
      const dx = p.clientX - startX;
      const dy = p.clientY - startY;
      const nx = Math.max(
        8,
        Math.min(window.innerWidth - 64, window.innerWidth - (x + dx)),
      );
      const ny = Math.max(8, Math.min(window.innerHeight - 64, y + dy));
      el.style.right = `${nx}px`;
      el.style.bottom = `${ny}px`;
    }
    function onEnd() {
      dragging = false;
      const rect = el.getBoundingClientRect();
      const out =
        rect.right < 0 ||
        rect.left > window.innerWidth ||
        rect.top > window.innerHeight ||
        rect.bottom < 0;
      if (out) setVisible(false);
    }

    const startEv = isTouch() ? "touchstart" : "mousedown";
    const moveEv = isTouch() ? "touchmove" : "mousemove";
    const endEv = isTouch() ? "touchend" : "mouseup";
    el.addEventListener(startEv, onStart, { passive: false });
    window.addEventListener(moveEv, onMove, { passive: false });
    window.addEventListener(endEv, onEnd, { passive: false });
    return () => {
      el.removeEventListener(startEv, onStart as unknown as EventListener);
      window.removeEventListener(moveEv, onMove as unknown as EventListener);
      window.removeEventListener(endEv, onEnd as unknown as EventListener);
    };
  }, []);

  // Don't render during SSR to prevent hydration mismatch
  if (!isClient) return null;

  // Don't show if on mixer page (it has its own controls)
  if (isOnMixerPage) return null;

  // Don't show if user explicitly closed it
  if (!visible) return null;

  // Show the button only when music is currently playing
  const shouldShow = state.enabled;

  if (!shouldShow) return null;

  return (
    <div
      ref={ref}
      className="fixed z-50 right-4 bottom-6 flex items-center gap-2"
      style={{ right: 16, bottom: 24 }}
    >
      <button
        aria-label={state.enabled ? "pause ambient" : "play ambient"}
        onClick={() => ambientStore.setEnabled(!state.enabled)}
        className="size-12 rounded-full grid place-items-center shadow-lg bg-[hsl(277_36%_22%)] text-white/95"
      >
        {state.enabled ? (
          <PauseIcon className="size-6" />
        ) : (
          <PlayIcon className="size-6 ml-0.5" />
        )}
      </button>
      <button
        aria-label="close"
        onClick={() => {
          ambientStore.setEnabled(false);
          setVisible(false);
        }}
        className="grid size-8 rounded-full place-items-center bg-white text-[hsl(277_36%_22%)]/80 border"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}
