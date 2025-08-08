import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { AmbientMixer } from "@/features/ambient-mixer/ui/AmbientMixer";

export default function MixerPage() {
  return (
    <main className="min-h-svh">
      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-aurora">Ambient Sound Mixer</CardTitle>
          </CardHeader>
          <CardContent>
            <AmbientMixer />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
