import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

export default function MeditationOfTheDayPage() {
  return (
    <main className="min-h-svh text-zinc-900">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Today’s Meditation</CardTitle>
            <CardDescription>Grounding breath and awareness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-zinc-700">
              A 10-minute guided practice to soften tension and return to
              presence. Find a comfortable seat, close your eyes, and follow the
              breath.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/practice/breath">Play</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/topics">Browse topics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
