export interface BreathPreset {
  id: string;
  name: string;
  inhaleSec: number;
  holdTopSec: number;
  exhaleSec: number;
  holdBottomSec: number;
  createdAt: number;
}

export interface BreathSettings {
  currentMode: "default" | "custom";
  selectedPresetId?: string;
  selectedProfile: "default" | "box" | "coherent" | "relax" | "478";
}

const STORAGE_KEYS = {
  PRESETS: "breath-presets",
  SETTINGS: "breath-settings",
} as const;

const DEFAULT_SETTINGS: BreathSettings = {
  currentMode: "default",
  selectedProfile: "default",
};

export function saveBreathPreset(
  preset: Omit<BreathPreset, "id" | "createdAt">,
): BreathPreset {
  const presets = getBreathPresets();
  const newPreset: BreathPreset = {
    ...preset,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  const updatedPresets = [...presets, newPreset];
  localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(updatedPresets));

  return newPreset;
}

export function updateBreathPreset(
  id: string,
  updates: Partial<Omit<BreathPreset, "id" | "createdAt">>,
): BreathPreset | null {
  const presets = getBreathPresets();
  const presetIndex = presets.findIndex((preset) => preset.id === id);

  if (presetIndex === -1) return null;

  const updatedPreset = {
    ...presets[presetIndex],
    ...updates,
  };

  const updatedPresets = [...presets];
  updatedPresets[presetIndex] = updatedPreset;

  localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(updatedPresets));

  return updatedPreset;
}

export function getBreathPresets(): BreathPreset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function deleteBreathPreset(id: string): void {
  const presets = getBreathPresets();
  const filtered = presets.filter((preset) => preset.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(filtered));

  // If we deleted the currently selected preset, reset settings
  const settings = getBreathSettings();
  if (settings.selectedPresetId === id) {
    saveBreathSettings({
      ...settings,
      currentMode: "default",
      selectedPresetId: undefined,
    });
  }
}

export function getBreathSettings(): BreathSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveBreathSettings(settings: BreathSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getPresetById(id: string): BreathPreset | undefined {
  const presets = getBreathPresets();
  return presets.find((preset) => preset.id === id);
}
