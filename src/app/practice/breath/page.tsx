import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { BreathPacer } from "@/features/breath-pacer/ui/BreathPacer";

export default function BreathPage() {
  return (
    <main className="min-h-svh text-zinc-900">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Breath Pacer</CardTitle>
          </CardHeader>
          <CardContent>
            <BreathPacer />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}


