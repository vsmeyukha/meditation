"use client";
import { useSyncExternalStore } from "react";
import { Slider } from "@/shared/ui/slider";
import { Card, CardContent } from "@/shared/ui/card";
import { ambientStore } from "@/shared/lib/ambientStore";
import { Switch } from "@/shared/ui/switch";
import { Button } from "@/shared/ui/button";

export function AmbientMixer() {
  const state = useSyncExternalStore(
    (cb) => ambientStore.subscribe(cb),
    () => ambientStore.getState(),
    () => ambientStore.getState()
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-700">Enable ambient</div>
        <Switch checked={state.enabled} onCheckedChange={(v) => ambientStore.setEnabled(v)} />
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-zinc-700">Status: {state.enabled ? "Playing" : "Paused"}</div>
            {!state.enabled ? (
              <Button size="sm" onClick={() => ambientStore.setEnabled(true)}>Play</Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => ambientStore.setEnabled(false)}>Pause</Button>
            )}
          </div>
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
                onValueChange={([v]) => ambientStore.setVolume(key, v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


