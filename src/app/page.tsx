import { Button } from "@/shared/ui/button";

export default function Home() {
  return (
    <main className="min-h-svh">
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-16 text-center sm:py-20">
        <Button
          size="icon"
          className="h-32 w-32 p-0 whitespace-nowrap text-lg font-semibold text-[hsl(277_36%_22%)] bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-[length:200%_200%] animate-gradient-x shadow-lg shadow-white/20 backdrop-blur-sm transition-all duration-300 hover:from-purple-300 hover:to-blue-300 hover:shadow-white/40 !rounded-full"
        >
          Погрузиться
        </Button>
      </section>
    </main>
  );
}
