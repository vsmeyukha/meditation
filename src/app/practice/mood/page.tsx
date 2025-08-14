import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { MoodCheckin } from "@/features/mood-checkin/ui/MoodCheckin";

export default function MoodPage() {
  return (
    <main className="min-h-[calc(100svh-3.5rem)]">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Проверка настроения</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodCheckin />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
