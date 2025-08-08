"use client";
import { useEffect, useState } from "react";
import { Slider } from "@/shared/ui/slider";
import { Card, CardContent } from "@/shared/ui/card";
import { readLocalStorage, storageKeys, writeLocalStorage, MixerState } from "@/shared/lib/storage";
import { setAmbientVolumes, setEnabledAmbient } from "@/shared/lib/ambientEngine";
import { Switch } from "@/shared/ui/switch";

export function AmbientMixer() {
  const [state, setState] = useState<MixerState>(
    readLocalStorage<MixerState>(storageKeys.mixer, { rain: 0.3, stream: 0.2, bowls: 0.1, enabled: false })
  );
  useEffect(() => {
    writeLocalStorage(storageKeys.mixer, state);
  }, [state]);

  useEffect(() => {
    void setEnabledAmbient(state.enabled, { rain: state.rain, stream: state.stream, bowls: state.bowls });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.enabled]);

  useEffect(() => {
    if (!state.enabled) return;
    setAmbientVolumes({ rain: state.rain, stream: state.stream, bowls: state.bowls });
  }, [state.rain, state.stream, state.bowls, state.enabled]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-700">Enable ambient</div>
        <Switch checked={state.enabled} onCheckedChange={(v) => setState((s) => ({ ...s, enabled: v }))} />
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
          {(
            [
              { key: "rain" as const, label: "Rain" },
              { key: "stream" as const, label: "Stream" },
              { key: "bowls" as const, label: "Singing bowls" },
            ]
          ).map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-600">
                <span>{label}</span>
                <span>{Math.round(state[key] * 100)}%</span>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[state[key]]}
                onValueChange={([v]) => setState((s) => ({ ...s, [key]: v }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


