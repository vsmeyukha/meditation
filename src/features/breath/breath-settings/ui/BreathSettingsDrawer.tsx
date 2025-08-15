"use client";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/shared/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/shared/ui/drawer";
import { Settings } from "lucide-react";
import { BreathingModeCard } from "./breathingModeCard";

interface BreathSettingsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isRunning: boolean;
  isHydrated: boolean;
}

export function BreathSettingsDrawer({
  isOpen,
  onOpenChange,
  isRunning,
  isHydrated,
}: BreathSettingsDrawerProps) {
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const openedOnSwipeRef = useRef(false);

  const breathingModes = [
    { name: "Default", description: "4:4:6:2" },
    { name: "Box", description: "1:1:1:1" },
    { name: "Relax", description: "2:0.5:3:0.5" },
    { name: "Coherent", description: "1:0:1:0" },
    { name: "4-7-8", description: "4:7:8:0" },
    { name: "Custom", description: "Свой ритм" },
  ];

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      dismissible={true}
      shouldScaleBackground={false}
    >
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Настройки дыхания</span>
        </Button>
      </DrawerTrigger>

      {/* Bottom swipe trigger rendered via portal to escape card's containing block */}
      {isHydrated &&
        createPortal(
          <DrawerTrigger asChild>
            <div
              className={`fixed bottom-0 left-0 right-0 h-20 transition-opacity duration-[2000ms] ease-in-out ${
                isRunning ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              style={{ zIndex: 9999 }}
              role="button"
              tabIndex={0}
              aria-label="Провести вверх для настроек"
              onTouchStart={(e) => {
                const t = e.touches[0];
                touchStartYRef.current = t.clientY;
                touchStartXRef.current = t.clientX;
                openedOnSwipeRef.current = false;
              }}
              onTouchMove={(e) => {
                if (touchStartYRef.current == null) return;
                const t = e.touches[0];
                const dy = touchStartYRef.current - t.clientY;
                const dx = Math.abs(
                  (touchStartXRef.current ?? t.clientX) - t.clientX,
                );
                if (!openedOnSwipeRef.current && dy > 40 && dx < 30) {
                  onOpenChange(true);
                  openedOnSwipeRef.current = true;
                  if (e.cancelable) e.preventDefault();
                }
              }}
              onTouchEnd={() => {
                touchStartYRef.current = null;
                touchStartXRef.current = null;
                openedOnSwipeRef.current = false;
              }}
            >
              {/* Visual handle indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-1 bg-gray-300/60 rounded-full mb-2" />
                  <div className="flex items-center justify-center w-16 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm">
                    <div className="w-6 h-0.5 bg-gray-400/70 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </DrawerTrigger>,
          document.body,
        )}

      <DrawerContent className="pb-6 bg-[#251b47] border-none">
        <div className="flex flex-col gap-6 px-4 pb-6">
          {/* Pattern Selection Cards */}
          <div className="space-y-4">
            {/* Horizontal scrolling pattern cards */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
              {breathingModes.map((mode) => (
                <BreathingModeCard key={mode.name} {...mode} />
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
