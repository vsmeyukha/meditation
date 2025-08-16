import { Card } from "@/shared/ui/card";
import { BreathPracticeWidget } from "@/widgets/breath-practice/ui/BreathPracticeWidget";

export default function BreathPage() {
  return (
    <main className="min-h-[calc(100svh-3.5rem)]">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card className="overflow-hidden">
          <BreathPracticeWidget />
        </Card>
      </section>
    </main>
  );
}
