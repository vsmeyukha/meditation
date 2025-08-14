import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { BreathContainer } from "@/features/breath-pacer/ui/BreathContainer";

export default function BreathPage() {
  return (
    <main className="min-h-svh">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Дыхание</CardTitle>
          </CardHeader>
          <CardContent>
            <BreathContainer />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
