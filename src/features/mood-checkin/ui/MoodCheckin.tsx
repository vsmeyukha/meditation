"use client";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  storageKeys,
  writeLocalStorage,
  readLocalStorage,
  MoodLogEntry,
} from "@/shared/lib/storage";
import { Badge } from "@/shared/ui/badge";

type Mood = MoodLogEntry["mood"];
type Energy = MoodLogEntry["energy"];

const moods: Mood[] = ["bad", "okay", "good", "great"];
const energies: Energy[] = ["low", "medium", "high"];

export function MoodCheckin() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [energy, setEnergy] = useState<Energy | null>(null);
  const logs = readLocalStorage<MoodLogEntry[]>(storageKeys.moodLogs, []);

  function submit() {
    if (!mood || !energy) return;
    const entry: MoodLogEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood,
      energy,
    };
    writeLocalStorage(storageKeys.moodLogs, [entry, ...logs].slice(0, 50));
  }

  async function generate() {
    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mood, energy }),
      });
      const data = (await resp.json()) as { content?: string };
      if (data.content) {
        const blob = new Blob([data.content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "guided-meditation.txt";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // ignore
    }
  }

  const recommendation = useMemo(() => {
    if (!mood || !energy) return null;
    if (mood === "bad" && energy === "high")
      return { title: "Calming breath", href: "/topics/anxiety" };
    if (mood === "bad" && energy === "low")
      return { title: "Gentle activation", href: "/topics/apathy" };
    if (mood === "okay" && energy !== "high")
      return { title: "Body scan", href: "/meditation-of-the-day" };
    if (mood === "good" && energy === "high")
      return { title: "Focus practice", href: "/topics/focus" };
    return { title: "Self-compassion", href: "/topics/self-compassion" };
  }, [mood, energy]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 text-sm text-[hsl(277_36%_22%)]/70">Mood</div>
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <Button
              key={m}
              variant={mood === m ? "default" : "outline"}
              onClick={() => setMood(m)}
            >
              {m}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm text-[hsl(277_36%_22%)]/70">Energy</div>
        <div className="flex flex-wrap gap-2">
          {energies.map((e) => (
            <Button
              key={e}
              variant={energy === e ? "default" : "outline"}
              onClick={() => setEnergy(e)}
            >
              {e}
            </Button>
          ))}
        </div>
      </div>
      <Button onClick={submit} disabled={!mood || !energy}>
        Save Check‑in
      </Button>
      <Button variant="outline" onClick={generate} disabled={!mood || !energy}>
        Generate guidance
      </Button>
      {recommendation && (
        <Card>
          <CardContent className="p-4 text-sm text-[hsl(277_36%_22%)]/80">
            Recommended:{" "}
            <a className="underline" href={recommendation.href}>
              {recommendation.title}
            </a>
          </CardContent>
        </Card>
      )}
      {logs.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-[hsl(277_36%_22%)]/70">Recent</div>
          <div className="flex flex-wrap gap-2">
            {logs.slice(0, 10).map((l) => (
              <Badge key={l.id} variant="secondary">
                {new Date(l.date).toLocaleDateString()} · {l.mood}/{l.energy}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
