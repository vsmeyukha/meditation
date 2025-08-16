"use client";
import { useRef } from "react";
import { createPortal } from "react-dom";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import { BreathingModeCard } from "./breathingModeCard";
import { type Profile } from "@/features/breath/breath-exercise/lib/ratios";
import { breathingModes } from "@/features/breath/config/modes";

interface BreathSettingsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isRunning: boolean;
  isHydrated: boolean;
  currentProfile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function BreathSettingsDrawer({
  isOpen,
  onOpenChange,
  isRunning,
  isHydrated,
  currentProfile,
  onProfileChange,
}: BreathSettingsDrawerProps) {
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const openedOnSwipeRef = useRef(false);

  const handleModeSelect = (profile: Profile | "custom") => {
    if (profile === "custom") {
      // TODO: Handle custom mode - will implement custom settings UI later
      return;
    }
    onProfileChange(profile);
    onOpenChange(false); // Close drawer after selection
  };

  const getCardClassName = (modeProfile: Profile | "custom") => {
    const isActive = currentProfile === modeProfile;
    const isCustom = modeProfile === "custom";

    const baseClass =
      breathingModes.find((mode) => mode.profile === modeProfile)
        ?.baseClassName || "";
    const activeClass = isActive ? "opacity-100 ring-2 ring-white/50" : "";
    const disabledClass = isCustom ? "opacity-50" : "";

    return `${baseClass} ${activeClass} ${disabledClass}`.trim();
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      dismissible={true}
      shouldScaleBackground={false}
    >
      {/* Bottom swipe trigger rendered via portal to escape card's containing block */}
      {isHydrated &&
        !isRunning &&
        !isOpen &&
        createPortal(
          <DrawerTrigger asChild>
            <div
              className="fixed bottom-0 left-0 right-0 h-20 transition-opacity duration-[2000ms] ease-in-out opacity-100"
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

      <DrawerContent className="pb-6 bg-[#251b47] border-none outline-none focus:outline-none focus-visible:outline-none">
        <DrawerTitle className="sr-only">Настройки дыхания</DrawerTitle>
        <DrawerDescription className="sr-only">
          Выберите режим дыхательного упражнения
        </DrawerDescription>
        <div className="flex flex-col gap-6 px-4 pb-6">
          {/* Pattern Selection Cards */}
          <div className="space-y-4">
            {/* Horizontal scrolling pattern cards */}
            <div className="flex gap-3 overflow-x-auto py-2 -mx-2 px-2 no-scrollbar">
              {breathingModes.map((mode) => (
                <BreathingModeCard
                  key={mode.name}
                  name={mode.name}
                  profile={mode.profile}
                  icon={mode.icon}
                  className={getCardClassName(mode.profile)}
                  onClick={() => handleModeSelect(mode.profile)}
                />
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
