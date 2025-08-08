"use client";
import { useEffect, useState } from "react";
import {
  storageKeys,
  readLocalStorage,
  writeLocalStorage,
  StreakState,
} from "@/shared/lib/storage";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";

export function StreakIntention() {
  const [intention, setIntention] = useState<string>(
    readLocalStorage<string>(storageKeys.intention, "I intend to be present."),
  );
  const streak = readLocalStorage<StreakState>(storageKeys.streak, {
    streakDays: 0,
  });

  useEffect(() => {
    writeLocalStorage(storageKeys.intention, intention);
  }, [intention]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs text-[hsl(277_36%_22%)]/70">
          Daily intention
        </div>
        <Input
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
        />
      </div>
      <div className="text-sm text-[hsl(277_36%_22%)]/85">Current streak</div>
      <Badge variant="secondary">
        {streak.streakDays} day{streak.streakDays === 1 ? "" : "s"}
      </Badge>
    </div>
  );
}
