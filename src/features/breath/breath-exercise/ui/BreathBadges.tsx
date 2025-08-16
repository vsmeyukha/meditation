import { Badge } from "@/shared/ui/badge";

interface PhaseLabel {
  phase: string;
  label: string;
  duration: number;
}

export function BreathBadges({ phaseLabels }: { phaseLabels: PhaseLabel[] }) {
  return (
    <div className="px-6">
      <div className="flex flex-row flex-wrap gap-2">
        {phaseLabels.map(({ phase: phaseKey, label, duration }) => (
          <Badge
            key={phaseKey}
            variant="default"
            className="h-6 px-2 rounded-2xl text-xs bg-foreground/10 text-foreground/70 border-transparent"
            aria-label={`${label}: ${duration} секунд`}
          >
            {label}: {duration}с
          </Badge>
        ))}
      </div>
    </div>
  );
}
