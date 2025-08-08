import { Button } from "@/shared/ui/button";
import { TransitionLink } from "@/shared/ui/TransitionLink";

export default function Home() {
  return (
    <main className="h-svh">
      <section className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
        <TransitionLink href="/practice">
          <Button
            size="icon"
            className="meditation-button h-32 w-32 p-0 whitespace-nowrap text-lg font-semibold text-[hsl(277_36%_22%)] bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-[length:200%_200%] animate-gradient-x shadow-lg shadow-white/20 backdrop-blur-sm transition-all duration-300 hover:from-purple-300 hover:to-blue-300 hover:shadow-white/40 !rounded-full"
          >
            Погрузиться
          </Button>
        </TransitionLink>
      </section>
    </main>
  );
}
