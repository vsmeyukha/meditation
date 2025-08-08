import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { MoodCheckin } from "@/features/mood-checkin/ui/MoodCheckin";

export default function MoodPage() {
  return (
    <main className="min-h-svh text-zinc-900">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Mood Check‑in</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodCheckin />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}


