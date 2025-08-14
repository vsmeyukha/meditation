"use client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { BreathPacer } from "./BreathPacer";
import { TapCalibrator } from "./TapCalibrator";
import {
  ratiosForProfile,
  durationsFromCycle,
  durationsFromCycleExact,
  type Profile,
} from "../lib/ratios";
import {
  saveBreathPreset,
  getBreathPresets,
  getBreathSettings,
  saveBreathSettings,
  getPresetById,
  deleteBreathPreset,
  updateBreathPreset,
  type BreathPreset,
  type BreathSettings,
} from "../lib/breath-storage";
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
import { CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Settings } from "lucide-react";

const defaultDurations = {
  inhaleSec: 4,
  holdTopSec: 4,
  exhaleSec: 6,
  holdBottomSec: 2,
};

export function BreathContainer() {
  const [settings, setSettings] = useState<BreathSettings>(() => ({
    currentMode: "default",
    selectedProfile: "default",
  }));
  const [presets, setPresets] = useState<BreathPreset[]>([]);
  const [showCalibrator, setShowCalibrator] = useState(false);
  const [customName, setCustomName] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle swipe gestures for bottom drawer handle
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      const deltaY = startY - moveTouch.clientY;

      // If swiped up more than 50px, open drawer
      if (deltaY > 50) {
        setIsSettingsOpen(true);
        cleanup();
      }
    };

    const handleTouchEnd = () => {
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
  };

  // Load settings and presets after hydration
  useEffect(() => {
    setSettings(getBreathSettings());
    setPresets(getBreathPresets());
    setIsHydrated(true);
    setMounted(true);
  }, []);

  // Get current durations based on mode and selected preset
  const currentDurations = useMemo(() => {
    if (settings.currentMode === "custom" && settings.selectedPresetId) {
      const preset = getPresetById(settings.selectedPresetId);
      if (preset) {
        return {
          inhaleSec: preset.inhaleSec,
          holdTopSec: preset.holdTopSec,
          exhaleSec: preset.exhaleSec,
          holdBottomSec: preset.holdBottomSec,
        };
      }
    }
    return defaultDurations;
  }, [settings.currentMode, settings.selectedPresetId]);

  // Update settings and persist
  const updateSettings = (updates: Partial<typeof settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    if (isHydrated) {
      saveBreathSettings(newSettings);
    }
  };

  // Handle calibration completion
  const handleCalibrated = (cycleSec: number) => {
    const ratios = ratiosForProfile(settings.selectedProfile);
    const durations = durationsFromCycle(cycleSec, ratios);

    const presetName =
      customName ||
      `Паттерн ${new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}`;
    const newPreset = saveBreathPreset({
      name: presetName,
      ...durations,
    });

    setPresets(getBreathPresets());
    updateSettings({
      currentMode: "custom",
      selectedPresetId: newPreset.id,
    });
    setCustomName("");
  };

  // Handle mode switching
  const handleModeChange = (mode: "default" | "custom") => {
    if (mode === "default") {
      updateSettings({ currentMode: "default" });
    } else {
      // Switch to custom mode - select first preset if available, otherwise no preset
      updateSettings({
        currentMode: "custom",
        selectedPresetId: presets.length > 0 ? presets[0].id : undefined,
      });
    }
  };

  // Handle preset selection
  const handlePresetChange = (presetId: string) => {
    updateSettings({
      currentMode: "custom",
      selectedPresetId: presetId,
    });
  };

  // Handle preset deletion
  const handleDeletePreset = (presetId: string) => {
    deleteBreathPreset(presetId);
    setPresets(getBreathPresets());
  };

  // Handle profile change with automatic preset update
  const handleProfileChange = (newProfile: Profile) => {
    updateSettings({ selectedProfile: newProfile });

    // If we're in custom mode with a selected preset, update it with new ratios
    if (
      settings.currentMode === "custom" &&
      settings.selectedPresetId &&
      isHydrated
    ) {
      const currentPreset = getPresetById(settings.selectedPresetId);
      if (currentPreset) {
        // Calculate current total cycle time
        const totalTime =
          currentPreset.inhaleSec +
          currentPreset.holdTopSec +
          currentPreset.exhaleSec +
          currentPreset.holdBottomSec;

        // Apply new profile ratios to the same total time
        const newRatios = ratiosForProfile(newProfile);
        const newDurations = durationsFromCycleExact(totalTime, newRatios);

        // Update the preset with new durations
        updateBreathPreset(settings.selectedPresetId, newDurations);

        // Refresh presets list to reflect changes
        setPresets(getBreathPresets());
      }
    }
  };

  const selectedPreset = settings.selectedPresetId
    ? getPresetById(settings.selectedPresetId)
    : null;
  const hasPresets = presets.length > 0;

  return (
    <>
      {/* Header with Title and Settings */}
      <CardHeader
        className={`transition-opacity duration-[2000ms] ease-in-out ${isRunning ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Дыхание</CardTitle>
          <Drawer open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
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
                      handleModeChange(value as "default" | "custom")
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
                        Стандартный паттерн: Вдох 4с → Пауза 4с → Выдох 6с →
                        Пауза 2с
                      </p>
                    ) : selectedPreset ? (
                      <p>
                        {selectedPreset.name}: Вдох {selectedPreset.inhaleSec}с
                        → Пауза {selectedPreset.holdTopSec}с → Выдох{" "}
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
                        <h4 className="text-md font-medium">
                          Сохранённые паттерны
                        </h4>
                        <div className="flex items-center gap-3">
                          <Select
                            value={settings.selectedPresetId}
                            onValueChange={handlePresetChange}
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
                              onClick={() =>
                                handleDeletePreset(selectedPreset.id)
                              }
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
                      <h4 className="text-md font-medium">
                        Создать новый паттерн
                      </h4>

                      {/* Profile Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Профиль соотношений:
                        </label>
                        <Select
                          value={settings.selectedProfile}
                          onValueChange={handleProfileChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">
                              Default 4:4:6:2
                            </SelectItem>
                            <SelectItem value="box">Box 1:1:1:1</SelectItem>
                            <SelectItem value="coherent">
                              Coherent 1:0:1:0
                            </SelectItem>
                            <SelectItem value="relax">
                              Relax 2:0.5:3:0.5
                            </SelectItem>
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
                            onChange={(e) => setCustomName(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white/60 backdrop-blur-sm"
                          />
                          <Button
                            onClick={() => setShowCalibrator(true)}
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
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          <BreathPacer
            {...currentDurations}
            onRunningChange={(running) => {
              setIsRunning(running);
              if (running) setIsSettingsOpen(false);
            }}
          />

          <div
            className={`w-full transition-opacity duration-[2000ms] ease-in-out ${
              isRunning ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            aria-hidden={isRunning}
          >
            {/* Current pattern info - minimal display */}
            <div className="text-sm text-center text-muted-foreground">
              {settings.currentMode === "default" ? (
                <p>Стандартный паттерн дыхания</p>
              ) : selectedPreset ? (
                <p>{selectedPreset.name}</p>
              ) : (
                <p>Настройте свой ритм в настройках</p>
              )}
            </div>

            {/* Tap Calibrator Modal */}
            {showCalibrator && (
              <TapCalibrator
                onClose={() => setShowCalibrator(false)}
                onCalibrated={handleCalibrated}
              />
            )}
          </div>
        </div>
      </CardContent>

      {/* Bottom Swipe Handle - Portaled to body to escape positioning context */}
      {mounted &&
        createPortal(
          <div
            className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 z-40 transition-opacity duration-[2000ms] ease-in-out ${
              isRunning ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            onTouchStart={handleTouchStart}
            role="button"
            tabIndex={0}
            aria-label="Провести вверх для настроек"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsSettingsOpen(true);
              }
            }}
          >
            <div className="flex flex-col items-center pb-4 pt-2 px-8">
              {/* Handle area */}
              <div className="flex items-center justify-center w-16 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm">
                <div className="w-6 h-0.5 bg-gray-400/70 rounded-full" />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
