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

      <DrawerContent className="min-h-[95vh]">
        <DrawerHeader>
          <DrawerTitle>Настройки дыхания</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-6 px-4 pb-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Режим дыхания</h3>
            <Tabs
              value={settings.currentMode}
              onValueChange={(value) =>
                onModeChange(value as "default" | "custom")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="default">Стандарт</TabsTrigger>
                <TabsTrigger value="custom">Свой ритм</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Current pattern detailed info */}
            <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg">
              {settings.currentMode === "default" ? (
                <p>
                  Стандартный паттерн: Вдох 4с → Пауза 4с → Выдох 6с → Пауза 2с
                </p>
              ) : selectedPreset ? (
                <p>
                  {selectedPreset.name}: Вдох {selectedPreset.inhaleSec}с →
                  Пауза {selectedPreset.holdTopSec}с → Выдох{" "}
                  {selectedPreset.exhaleSec}с → Пауза{" "}
                  {selectedPreset.holdBottomSec}с
                </p>
              ) : (
                <p>Создайте свой первый паттерн с помощью калибровки</p>
              )}
            </div>
          </div>

          {/* Custom Mode Controls */}
          {settings.currentMode === "custom" && (
            <div className="space-y-6">
              {/* Existing Presets Section */}
              {hasPresets && (
                <div className="space-y-3">
                  <h4 className="text-md font-medium">Сохранённые паттерны</h4>
                  <div className="flex items-center gap-3">
                    <Select
                      value={settings.selectedPresetId}
                      onValueChange={onPresetChange}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите паттерн" />
                      </SelectTrigger>
                      <SelectContent>
                        {presets.map((preset) => (
                          <SelectItem key={preset.id} value={preset.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{preset.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {preset.inhaleSec}/{preset.holdTopSec}/
                                {preset.exhaleSec}/{preset.holdBottomSec}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedPreset && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeletePreset(selectedPreset.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Create New Pattern Section */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">Создать новый паттерн</h4>

                {/* Profile Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Профиль соотношений:
                  </label>
                  <Select
                    value={settings.selectedProfile}
                    onValueChange={onProfileChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default 4:4:6:2</SelectItem>
                      <SelectItem value="box">Box 1:1:1:1</SelectItem>
                      <SelectItem value="coherent">Coherent 1:0:1:0</SelectItem>
                      <SelectItem value="relax">Relax 2:0.5:3:0.5</SelectItem>
                      <SelectItem value="478">4-7-8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Calibration */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">
                    Калибровка по вашему ритму:
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Название паттерна (опционально)"
                      value={customName}
                      onChange={(e) => onCustomNameChange(e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white/60 backdrop-blur-sm"
                    />
                    <Button
                      onClick={onShowCalibrator}
                      className="rounded-md bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      Калибровать
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Калибровка поможет создать паттерн на основе вашего
                    естественного ритма дыхания
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
