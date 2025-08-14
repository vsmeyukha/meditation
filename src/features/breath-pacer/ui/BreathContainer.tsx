"use client";
import { useEffect, useMemo, useState } from "react";
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

  // Load settings and presets after hydration
  useEffect(() => {
    setSettings(getBreathSettings());
    setPresets(getBreathPresets());
    setIsHydrated(true);
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
    <div className="flex flex-col items-center gap-6">
      <BreathPacer {...currentDurations} />

      {/* Mode Selection */}
      <Tabs
        value={settings.currentMode}
        onValueChange={(value) =>
          handleModeChange(value as "default" | "custom")
        }
        className="w-full max-w-md"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default">Стандарт</TabsTrigger>
          <TabsTrigger value="custom">Свой ритм</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Custom Mode Controls */}
      {settings.currentMode === "custom" && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          {/* Existing Presets Selection */}
          {hasPresets && (
            <div className="flex items-center gap-3 w-full">
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
                  onClick={() => handleDeletePreset(selectedPreset.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  ✕
                </Button>
              )}
            </div>
          )}

          {/* Calibration Controls */}
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex items-center gap-3 w-full">
              <input
                type="text"
                placeholder="Название паттерна (опционально)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white/60 backdrop-blur-sm"
              />

              <Button
                onClick={() => setShowCalibrator(true)}
                className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white"
                size="sm"
              >
                Калибровать
              </Button>
            </div>

            {/* Profile Selection */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Профиль:</span>
              <Select
                value={settings.selectedProfile}
                onValueChange={handleProfileChange}
              >
                <SelectTrigger className="w-40">
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
          </div>
        </div>
      )}

      {/* Show current pattern info */}
      <div className="text-xs text-center text-muted-foreground max-w-md">
        {settings.currentMode === "default" ? (
          <p>Стандартный паттерн: Вдох 4с → Пауза 4с → Выдох 6с → Пауза 2с</p>
        ) : selectedPreset ? (
          <p>
            {selectedPreset.name}: Вдох {selectedPreset.inhaleSec}с → Пауза{" "}
            {selectedPreset.holdTopSec}с → Выдох {selectedPreset.exhaleSec}с →
            Пауза {selectedPreset.holdBottomSec}с
          </p>
        ) : (
          <p>Создайте свой первый паттерн с помощью калибровки</p>
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
  );
}
