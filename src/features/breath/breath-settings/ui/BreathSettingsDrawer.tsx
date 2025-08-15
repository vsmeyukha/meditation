"use client";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerHeader,
} from "@/shared/ui/drawer";
import { Settings } from "lucide-react";
import { type Profile } from "@/features/breath/breath-exercise/lib/ratios";
import { type BreathPreset, type BreathSettings } from "../lib/breath-storage";

interface BreathSettingsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isRunning: boolean;
  isHydrated: boolean;
  settings: BreathSettings;
  presets: BreathPreset[];
  customName: string;
  onCustomNameChange: (name: string) => void;
  onModeChange: (mode: "default" | "custom") => void;
  onPresetChange: (presetId: string) => void;
  onDeletePreset: (presetId: string) => void;
  onProfileChange: (profile: Profile) => void;
  onShowCalibrator: () => void;
}

export function BreathSettingsDrawer({
  isOpen,
  onOpenChange,
  isRunning,
  isHydrated,
  settings,
  presets,
  customName,
  onCustomNameChange,
  onModeChange,
  onPresetChange,
  onDeletePreset,
  onProfileChange,
  onShowCalibrator,
}: BreathSettingsDrawerProps) {
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const openedOnSwipeRef = useRef(false);

  const selectedPreset = settings.selectedPresetId
    ? presets.find((p) => p.id === settings.selectedPresetId)
    : null;
  const hasPresets = presets.length > 0;

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
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
              <div className="flex-shrink-0 w-32 h-24 p-3 bg-purple-50 border border-purple-200 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                <div className="text-sm font-medium text-purple-800">
                  Default
                </div>
                <div className="text-xs text-purple-600 mt-1">4:4:6:2</div>
              </div>

              <div className="flex-shrink-0 w-32 h-24 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="text-sm font-medium text-gray-800">Box</div>
                <div className="text-xs text-gray-600 mt-1">1:1:1:1</div>
              </div>

              <div className="flex-shrink-0 w-32 h-24 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="text-sm font-medium text-gray-800">Relax</div>
                <div className="text-xs text-gray-600 mt-1">2:0.5:3:0.5</div>
              </div>

              <div className="flex-shrink-0 w-32 h-24 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="text-sm font-medium text-gray-800">
                  Coherent
                </div>
                <div className="text-xs text-gray-600 mt-1">1:0:1:0</div>
              </div>

              <div className="flex-shrink-0 w-32 h-24 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="text-sm font-medium text-gray-800">4-7-8</div>
                <div className="text-xs text-gray-600 mt-1">4:7:8:0</div>
              </div>

              <div className="flex-shrink-0 w-32 h-24 p-3 bg-indigo-50 border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                <div className="text-sm font-medium text-indigo-800">
                  Custom
                </div>
                <div className="text-xs text-indigo-600 mt-1">Свой ритм</div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
