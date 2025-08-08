import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-sm pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight text-aurora">
          Meditation
        </Link>
        <nav className="hidden gap-4 sm:flex">
          <Link
            href="/practice"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
          >
            Practice
          </Link>
          <Link
            href="/meditation-of-the-day"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
          >
            Today
          </Link>
          <Link
            href="/topics"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
          >
            Topics
          </Link>
          <Link
            href="/help"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
          >
            Help
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="pb-[env(safe-area-inset-bottom)]"
            >
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3 p-4">
                <Link
                  href="/practice"
                  className="text-base text-[hsl(277_36%_22%)]"
                >
                  Practice
                </Link>
                <Link
                  href="/meditation-of-the-day"
                  className="text-base text-[hsl(277_36%_22%)]"
                >
                  Today
                </Link>
                <Link
                  href="/topics"
                  className="text-base text-[hsl(277_36%_22%)]"
                >
                  Topics
                </Link>
                <Link
                  href="/help"
                  className="text-base text-[hsl(277_36%_22%)]"
                >
                  Help
                </Link>
                <div className="pt-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/signin">Sign in</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="outline" size="sm" asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
