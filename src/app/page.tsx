import Link from "next/link";
import { Button } from "@/shared/ui/button";

export default function Home() {
  return (
    <main className="min-h-svh text-zinc-900">
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-16 text-center sm:py-20">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-sm text-zinc-600 ring-1 ring-zinc-200 backdrop-blur">
          Daily calm for a clearer mind
        </div>
        <h1 className="text-balance font-semibold tracking-tight text-zinc-900 text-4xl sm:text-5xl md:text-6xl">
          Meditation for a lighter, spiritual day
        </h1>
        <p className="text-pretty max-w-2xl text-zinc-600">
          Breathe, ground, and gently return to yourself. Explore the meditation of the day, themed sessions, and practical tips for anxiety, apathy, and more.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/meditation-of-the-day">Start today’s meditation</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/topics">Browse topics</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
