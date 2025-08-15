"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { BreathExercise } from "@/features/breath/breath-exercise/ui/BreathExercise";
import { TapCalibrator } from "@/features/breath/tap-calibrator/ui/TapCalibrator";
import { BreathSettingsDrawer } from "@/features/breath/breath-settings/ui/BreathSettingsDrawer";
import {
  ratiosForProfile,
  durationsFromCycle,
  durationsFromCycleExact,
  type Profile,
} from "@/features/breath/breath-exercise/lib/ratios";
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
} from "@/features/breath/breath-settings/lib/breath-storage";
import { CardHeader, CardTitle, CardContent } from "@/shared/ui/card";

const defaultDurations = {
  inhaleSec: 4,
  holdTopSec: 4,
  exhaleSec: 6,
  holdBottomSec: 2,
};

export function BreathPracticeWidget() {
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
  const cardRef = useRef<HTMLDivElement>(null);

  // Load settings and presets after hydration
  useEffect(() => {
    setSettings(getBreathSettings());
    setPresets(getBreathPresets());
    setIsHydrated(true);

    // Show instructions toast only when card is rendered and positioned correctly
    setTimeout(() => {
      if (cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const toastTop = cardRect.bottom + 40;

        toast("Свайпните вверх, чтобы выбрать режим дыхания", {
          duration: 5000,
          position: "top-center",
          classNames: {
            toast: "toast-card-style",
          },
          style: {
            position: "fixed",
            top: `${toastTop}px`,
            left: `${cardRect.left}px`,
            width: `${cardRect.width}px`,
            transform: "none",
            zIndex: 50,
          },
        });
      }
      // No fallback - don't show misleading instructions if UI isn't ready
    }, 1500); // Small delay to ensure card is rendered
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

  return (
    <div ref={cardRef}>
      {/* Header with Title and Settings */}
      <CardHeader
        className={`transition-opacity duration-[2000ms] ease-in-out ${isRunning ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Дыхание</CardTitle>
          <BreathSettingsDrawer
            isOpen={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
            isRunning={isRunning}
            isHydrated={isHydrated}
            settings={settings}
            presets={presets}
            customName={customName}
            onCustomNameChange={setCustomName}
            onModeChange={handleModeChange}
            onPresetChange={handlePresetChange}
            onDeletePreset={handleDeletePreset}
            onProfileChange={handleProfileChange}
            onShowCalibrator={() => setShowCalibrator(true)}
          />
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          <BreathExercise
            {...currentDurations}
            onRunningChange={(running) => {
              setIsRunning(running);
              if (running) setIsSettingsOpen(false);
            }}
            onDoubleClick={() => {
              if (!isRunning) {
                setShowCalibrator(true);
              }
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
    </div>
  );
}
