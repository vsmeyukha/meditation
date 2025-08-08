import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

const topics = [
  {
    slug: "anxiety",
    title: "Anxiety Relief",
    hint: "Soften the nervous system",
  },
  {
    slug: "apathy",
    title: "Apathy & Low Motivation",
    hint: "Gentle activation",
  },
  { slug: "sleep", title: "Sleep", hint: "Wind down and rest" },
  { slug: "focus", title: "Focus", hint: "Clear, steady attention" },
  {
    slug: "self-compassion",
    title: "Self-Compassion",
    hint: "Kindness inward",
  },
  { slug: "stress", title: "Stress", hint: "Release and ease" },
];

export default function TopicsPage() {
  return (
    <main className="min-h-svh text-zinc-900">
      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">
          Meditations by Topic
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <Link key={t.slug} href={`/topics/${t.slug}`} className="block">
              <Card className="h-full transition hover:shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle>{t.title}</CardTitle>
                    <Badge
                      variant="secondary"
                      className="hidden sm:inline-flex"
                    >
                      {t.hint}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-zinc-600">{t.hint}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
