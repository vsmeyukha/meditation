import Link from "next/link";
import { Button } from "@/shared/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur border-b border-zinc-200">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">Meditation</Link>
        <nav className="hidden gap-4 sm:flex">
          <Link href="/practice" className="text-sm text-zinc-700 hover:text-zinc-900">Practice</Link>
          <Link href="/meditation-of-the-day" className="text-sm text-zinc-700 hover:text-zinc-900">Today</Link>
          <Link href="/topics" className="text-sm text-zinc-700 hover:text-zinc-900">Topics</Link>
          <Link href="/help" className="text-sm text-zinc-700 hover:text-zinc-900">Help</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}


