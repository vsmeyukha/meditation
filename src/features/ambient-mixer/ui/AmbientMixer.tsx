"use client";
import { useSyncExternalStore } from "react";
import { Slider } from "@/shared/ui/slider";
import { Card, CardContent } from "@/shared/ui/card";
import { ambientStore } from "@/shared/lib/ambientStore";
import { PlayIcon, PauseIcon } from "lucide-react";

export function AmbientMixer() {
  const state = useSyncExternalStore(
    (cb) => ambientStore.subscribe(cb),
    () => ambientStore.getState(),
    () => ambientStore.getState(),
  );

  return (
    <div className="space-y-6">
      {/* Central Play/Pause Button */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => ambientStore.setEnabled(!state.enabled)}
          className={`
            size-20 rounded-full grid place-items-center shadow-lg transition-all duration-300
            ${
              state.enabled
                ? "bg-gradient-to-br from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700"
                : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 hover:from-gray-300 hover:to-gray-400"
            }
          `}
        >
          {state.enabled ? (
            <PauseIcon className="size-8" />
          ) : (
            <PlayIcon className="size-8 ml-1" />
          )}
        </button>
        <div className="text-sm text-[hsl(277_36%_22%)]/75">
          {state.enabled ? "Воспроизводится" : "На паузе"}
        </div>
      </div>

      {/* Volume Controls */}
      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="text-sm font-medium text-[hsl(277_36%_22%)]/85 mb-4">
            Громкость звуков
          </div>
          {[
            { key: "rain" as const, label: "Дождь" },
            { key: "stream" as const, label: "Ручей" },
            { key: "bowls" as const, label: "Поющие чаши" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-3">
              <div className="flex justify-between text-sm text-[hsl(277_36%_22%)]/70">
                <span>{label}</span>
                <span>{Math.round(state[key] * 100)}%</span>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[state[key]]}
                onValueChange={([v]) => ambientStore.setVolume(key, v)}
                className="purple-slider"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
