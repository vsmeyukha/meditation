import { Card } from "@/shared/ui/card";
import { BreathContainer } from "@/features/breath-pacer/ui/BreathContainer";

export default function BreathPage() {
  return (
    <main className="min-h-[calc(100svh-3.5rem)]">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card>
          <BreathContainer />
        </Card>
      </section>
    </main>
  );
}
