import Link from "next/link";
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

const gradients = [
  "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50",
  "bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50",
  "bg-gradient-to-br from-fuchsia-50 via-rose-50 to-sky-50",
  "bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100",
  "bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50",
  "bg-gradient-to-br from-rose-50 via-fuchsia-50 to-indigo-50",
];

export default function PracticePage() {
  return (
    <main className="min-h-[calc(100svh-3.5rem)]">
      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">Практика</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => (
            <Link key={t.href} href={t.href} className="block" prefetch={true}>
              <Card
                variant="practice"
                className={`h-full ${gradients[i % gradients.length]}`}
              >
                <CardHeader>
                  <CardTitle>{t.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-[hsl(277_36%_22%)]/75">
                  {t.desc}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
