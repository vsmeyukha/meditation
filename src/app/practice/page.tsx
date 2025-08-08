import { TransitionLink } from "@/shared/ui/TransitionLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

const tools = [
  {
    href: "/practice/breath",
    title: "Дыхание",
    desc: "Вдох / Задержка / Выдох",
  },
  {
    href: "/practice/mood",
    title: "Настроение",
    desc: "Дневник и рекомендации",
  },
  // {
  //   href: "/practice/bell",
  //   title: "Осознанный колокол",
  //   desc: "Интервальные звонки и финальный сигнал",
  // },
  {
    href: "/practice/mixer",
    title: "Эмбиент",
    desc: "Бесконечный звуковой поток",
  },
  // {
  //   href: "/practice/streak",
  //   title: "Мысль дня",
  //   desc: "Сохраните для себя",
  // },
];

export default function PracticePage() {
  return (
    <main className="min-h-svh">
      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">Практика</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <TransitionLink key={t.href} href={t.href} className="block">
              <Card variant="practice" className="h-full">
                <CardHeader>
                  <CardTitle>{t.title}</CardTitle>
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
