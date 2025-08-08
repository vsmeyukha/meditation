import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { MindfulBell } from "@/features/mindful-bell/ui/MindfulBell";

export default function BellPage() {
  return (
    <main className="min-h-svh">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-aurora">Mindful Bell Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <MindfulBell />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
