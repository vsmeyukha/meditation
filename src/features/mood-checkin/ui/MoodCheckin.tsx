"use client";
import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import {
  storageKeys,
  writeLocalStorage,
  readLocalStorage,
  MoodLogEntry,
} from "@/shared/lib/storage";
import { Badge } from "@/shared/ui/badge";

type Mood = MoodLogEntry["mood"];
type Energy = MoodLogEntry["energy"];

const moods: { value: Mood; label: string }[] = [
  { value: "bad", label: "Плохо" },
  { value: "okay", label: "Нормально" },
  { value: "good", label: "Хорошо" },
  { value: "great", label: "Отлично" },
];

const energies: { value: Energy; label: string }[] = [
  { value: "low", label: "Низкая" },
  { value: "medium", label: "Средняя" },
  { value: "high", label: "Высокая" },
];

export function MoodCheckin() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [moodDescription, setMoodDescription] = useState("");
  const [logs, setLogs] = useState<MoodLogEntry[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Helper functions to translate values to Russian
  const getMoodLabel = (mood: Mood): string => {
    const moodItem = moods.find((m) => m.value === mood);
    return moodItem ? moodItem.label : mood;
  };

  const getEnergyLabel = (energy: Energy): string => {
    const energyItem = energies.find((e) => e.value === energy);
    return energyItem ? energyItem.label : energy;
  };

  // Load logs from localStorage only on client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    const savedLogs = readLocalStorage<MoodLogEntry[]>(
      storageKeys.moodLogs,
      [],
    );
    setLogs(savedLogs);
  }, []);

  function submit() {
    if (!mood || !energy) return;
    const entry: MoodLogEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood,
      energy,
    };
    const newLogs = [entry, ...logs].slice(0, 50);
    writeLocalStorage(storageKeys.moodLogs, newLogs);
    setLogs(newLogs); // Update local state
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
      return { title: "Успокаивающее дыхание", href: "/topics/anxiety" };
    if (mood === "bad" && energy === "low")
      return { title: "Мягкая активация", href: "/topics/apathy" };
    if (mood === "okay" && energy !== "high")
      return { title: "Сканирование тела", href: "/meditation-of-the-day" };
    if (mood === "good" && energy === "high")
      return { title: "Практика концентрации", href: "/topics/focus" };
    return { title: "Самосострадание", href: "/topics/self-compassion" };
  }, [mood, energy]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 text-sm text-[hsl(277_36%_22%)]/70">
          Настроение
        </div>
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <Button
              key={m.value}
              variant={mood === m.value ? "default" : "outline"}
              onClick={() => setMood(m.value)}
            >
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm text-[hsl(277_36%_22%)]/70">Энергия</div>
        <div className="flex flex-wrap gap-2">
          {energies.map((e) => (
            <Button
              key={e.value}
              variant={energy === e.value ? "default" : "outline"}
              onClick={() => setEnergy(e.value)}
            >
              {e.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm text-[hsl(277_36%_22%)]/70">
          Опишите ваше настроение своими словами
        </div>
        <Textarea
          placeholder="Как вы себя чувствуете? Что происходит в вашей душе?"
          value={moodDescription}
          onChange={(e) => setMoodDescription(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        <div className="mt-2 text-xs text-[hsl(277_36%_22%)]/50">
          Теги: спокойствие, тревога, радость, усталость, вдохновение, грусть
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={submit} disabled={!mood || !energy}>
          Сохранить
        </Button>
        <Button
          variant="outline"
          onClick={generate}
          disabled={!mood || !energy}
        >
          Получить рекомендации
        </Button>
      </div>

      {recommendation && (
        <Card>
          <CardContent className="p-4 text-sm text-[hsl(277_36%_22%)]/80">
            Рекомендация:{" "}
            <a className="underline" href={recommendation.href}>
              {recommendation.title}
            </a>
          </CardContent>
        </Card>
      )}

      {isClient && logs.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-[hsl(277_36%_22%)]/70">
            Недавние записи
          </div>
          <div className="flex flex-wrap gap-2">
            {logs.slice(0, 10).map((l) => (
              <Badge key={l.id} variant="secondary">
                {new Date(l.date).toLocaleDateString()} · {getMoodLabel(l.mood)}
                /{getEnergyLabel(l.energy)}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
