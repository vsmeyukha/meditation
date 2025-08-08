import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";

export default function HelpPage() {
  return (
    <main className="min-h-svh text-zinc-900">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Meditation Tips & Help</CardTitle>
            <CardDescription>Practical guidance for common situations</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="1">
                <AccordionTrigger>Racing thoughts</AccordionTrigger>
                <AccordionContent>
                  Try exhale-lengthening breathing: inhale 4, exhale 6–8. Label thoughts gently: “thinking,” then return to breath.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="2">
                <AccordionTrigger>Sleepiness during practice</AccordionTrigger>
                <AccordionContent>
                  Open your eyes slightly, sit more upright, or practice standing meditation for 2–3 minutes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="3">
                <AccordionTrigger>Strong emotions</AccordionTrigger>
                <AccordionContent>
                  Place a hand on the heart, breathe into the chest, and name the emotion kindly. Shorten the session if needed.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}


