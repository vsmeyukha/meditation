import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

const tools = [
  { href: "/practice/breath", title: "Breath Pacer", desc: "Inhale / Hold / Exhale guidance" },
  { href: "/practice/mood", title: "Mood Check‑in", desc: "2-tap journal → recommendations" },
  { href: "/practice/bell", title: "Mindful Bell Timer", desc: "Interval bells and end chime" },
  { href: "/practice/mixer", title: "Ambient Sound Mixer", desc: "Rain, stream, bowls" },
  { href: "/practice/streak", title: "Streak + Intention", desc: "Simple, privacy-first" },
];

export default function PracticePage() {
  return (
    <main className="min-h-svh text-zinc-900">
      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">Practice</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} className="block">
              <Card className="h-full transition hover:shadow-sm">
                <CardHeader>
                  <CardTitle>{t.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-600">{t.desc}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}


