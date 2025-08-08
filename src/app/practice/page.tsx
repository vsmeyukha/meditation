import { TransitionLink } from "@/shared/ui/TransitionLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

const tools = [
  {
    href: "/practice/breath",
    title: "Breath Pacer",
    desc: "Inhale / Hold / Exhale guidance",
  },
  {
    href: "/practice/mood",
    title: "Mood Check‑in",
    desc: "2-tap journal → recommendations",
  },
  {
    href: "/practice/bell",
    title: "Mindful Bell Timer",
    desc: "Interval bells and end chime",
  },
  {
    href: "/practice/mixer",
    title: "Ambient Sound Mixer",
    desc: "Rain, stream, bowls",
  },
  {
    href: "/practice/streak",
    title: "Streak + Intention",
    desc: "Simple, privacy-first",
  },
];

export default function PracticePage() {
  return (
    <main className="min-h-svh">
      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">Практика</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <TransitionLink key={t.href} href={t.href} className="block">
              <Card className="h-full bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-[length:200%_200%] animate-gradient-x shadow-lg shadow-white/20 backdrop-blur-sm transition-all duration-300 hover:from-purple-300 hover:to-blue-300 hover:shadow-white/40 border-0">
                <CardHeader>
                  <CardTitle className="text-[hsl(277_36%_22%)]">
                    {t.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[hsl(277_36%_22%)]/75">
                  {t.desc}
                </CardContent>
              </Card>
            </TransitionLink>
          ))}
        </div>
      </section>
    </main>
  );
}
