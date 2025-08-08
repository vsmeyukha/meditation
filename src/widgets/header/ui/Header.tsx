import { TransitionLink } from "@/shared/ui/TransitionLink";
import { Button } from "@/shared/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-sm header-gradient pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6">
        <TransitionLink
          href="/"
          className="font-semibold tracking-tight text-aurora"
        >
          Вдох <span className="mx-2">🫧</span> выдох
        </TransitionLink>
        <nav className="hidden gap-4 sm:flex">
          <TransitionLink
            href="/practice"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
          >
            Практика
          </TransitionLink>
          <TransitionLink
            href="/meditation-of-the-day"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
          >
            Сегодня
          </TransitionLink>
          <TransitionLink
            href="/topics"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
          >
            Темы
          </TransitionLink>
          <TransitionLink
            href="/help"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
          >
            Помощь
          </TransitionLink>
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="outline" size="sm" asChild>
            <TransitionLink href="/signin">Войти</TransitionLink>
          </Button>
        </div>
      </div>
    </header>
  );
}
