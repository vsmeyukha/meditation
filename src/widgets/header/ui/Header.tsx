import Link from "next/link";
import { Button } from "@/shared/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-sm header-gradient pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6">
        <Link href="/" className="font-semibold tracking-tight text-aurora">
          Вдох <span className="mx-2">🫧</span> выдох
        </Link>
        <nav className="hidden gap-4 sm:flex">
          <Link
            href="/practice"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
            prefetch={true}
          >
            Практика
          </Link>
          <Link
            href="/meditation-of-the-day"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
            prefetch={true}
          >
            Сегодня
          </Link>
          <Link
            href="/topics"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
            prefetch={true}
          >
            Темы
          </Link>
          <Link
            href="/help"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
            prefetch={true}
          >
            Помощь
          </Link>
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="outline" size="sm" asChild>
            <Link href="/signin">Войти</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
