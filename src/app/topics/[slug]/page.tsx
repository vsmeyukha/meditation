import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

const content: Record<string, { title: string; description: string; sessions: { title: string; minutes: number }[] }> = {
  anxiety: {
    title: "Anxiety Relief",
    description: "Calming, grounding practices to soothe the nervous system.",
    sessions: [
      { title: "Box Breathing", minutes: 5 },
      { title: "Body Scan for Safety", minutes: 10 },
      { title: "Loving-Kindness for Fear", minutes: 12 },
    ],
  },
  apathy: {
    title: "Apathy & Low Motivation",
    description: "Gentle activation and reconnecting with purpose.",
    sessions: [
      { title: "Small Sparks", minutes: 7 },
      { title: "Values Check-in", minutes: 9 },
      { title: "Energy Awakening", minutes: 12 },
    ],
  },
  sleep: {
    title: "Sleep",
    description: "Wind down with breath, relaxation and soft attention.",
    sessions: [
      { title: "Breath Downshift", minutes: 8 },
      { title: "Progressive Relaxation", minutes: 12 },
    ],
  },
  focus: {
    title: "Focus",
    description: "Build steady attention and reduce distraction.",
    sessions: [
      { title: "Single-Point Focus", minutes: 8 },
      { title: "Counting the Breath", minutes: 10 },
    ],
  },
  "self-compassion": {
    title: "Self-Compassion",
    description: "Kind attention to inner experience and emotions.",
    sessions: [
      { title: "Soften, Soothe, Allow", minutes: 12 },
      { title: "Hand on Heart", minutes: 7 },
    ],
  },
  stress: {
    title: "Stress",
    description: "Release tension and create inner spaciousness.",
    sessions: [
      { title: "Tension Sweep", minutes: 6 },
      { title: "Exhale Lengthening", minutes: 5 },
    ],
  },
};

type Params = Promise<{ slug: string }>;

export default async function TopicPage(props: { params: Params }) {
  const { slug } = await props.params;
  const topic = content[slug];
  if (!topic) return notFound();

  return (
    <main className="min-h-svh text-zinc-900">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle>{topic.title}</CardTitle>
            <CardDescription>{topic.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topic.sessions.map((s) => (
              <div key={s.title} className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-sm text-zinc-600">{s.minutes} min</div>
                </div>
                <Button size="sm" asChild>
                  <Link href="/practice/breath">Begin</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}


