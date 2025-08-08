import { TransitionLink } from "@/shared/ui/TransitionLink";
import { Button } from "@/shared/ui/button";
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/shared/ui/sheet";

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
            Practice
          </TransitionLink>
          <TransitionLink
            href="/meditation-of-the-day"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
          >
            Today
          </TransitionLink>
          <TransitionLink
            href="/topics"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
          >
            Topics
          </TransitionLink>
          <TransitionLink
            href="/help"
            className="text-sm text-[hsl(277_36%_22%)]/80 hover:text-[hsl(277_36%_22%)]"
          >
            Help
          </TransitionLink>
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
                <SheetClose asChild>
                  <TransitionLink
                    href="/practice"
                    className="text-base text-[hsl(277_36%_22%)]"
                  >
                    Practice
                  </TransitionLink>
                </SheetClose>
                <SheetClose asChild>
                  <TransitionLink
                    href="/meditation-of-the-day"
                    className="text-base text-[hsl(277_36%_22%)]"
                  >
                    Today
                  </TransitionLink>
                </SheetClose>
                <SheetClose asChild>
                  <TransitionLink
                    href="/topics"
                    className="text-base text-[hsl(277_36%_22%)]"
                  >
                    Topics
                  </TransitionLink>
                </SheetClose>
                <SheetClose asChild>
                  <TransitionLink
                    href="/help"
                    className="text-base text-[hsl(277_36%_22%)]"
                  >
                    Help
                  </TransitionLink>
                </SheetClose>
                <div className="pt-2">
                  <SheetClose asChild>
                    <Button variant="outline" asChild className="w-full">
                      <TransitionLink href="/signin">Sign in</TransitionLink>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="outline" size="sm" asChild>
            <TransitionLink href="/signin">Sign in</TransitionLink>
          </Button>
        </div>
      </div>
    </header>
  );
}
