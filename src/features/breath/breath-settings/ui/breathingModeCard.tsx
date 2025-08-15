import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/shared/ui/card";

interface BreathingModeCardProps {
  name: string;
  className?: string;
}

export function BreathingModeCard({ name, className }: BreathingModeCardProps) {
  return (
    <Card
      variant="practice"
      className={cn(
        "flex-shrink-0 w-1/5 h-24 cursor-pointer transition-all duration-300 shadow-lg opacity-60 backdrop-blur-sm border-0 py-0 gap-0",
        className,
      )}
    >
      <CardContent className="p-3">
        <div className="text-sm font-medium text-white">{name}</div>
      </CardContent>
    </Card>
  );
}
