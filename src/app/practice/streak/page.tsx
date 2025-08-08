import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { StreakIntention } from "@/features/streak-intention/ui/StreakIntention";

export default function StreakPage() {
  return (
    <main className="min-h-svh">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-aurora">Streak & Intention</CardTitle>
          </CardHeader>
          <CardContent>
            <StreakIntention />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
