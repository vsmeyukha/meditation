import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

interface BreathingModeCardProps {
  name: string;
  description: string;
  className?: string;
}

export function BreathingModeCard({
  name,
  description,
  className,
}: BreathingModeCardProps) {
  return (
    <Card
      className={cn(
        "flex-shrink-0 w-16 h-24 bg-purple-50 border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors",
        className,
      )}
    >
      <CardContent className="p-3">
        <div className="text-sm font-medium text-purple-800">{name}</div>
        <div className="text-xs text-purple-600 mt-1">{description}</div>
      </CardContent>
    </Card>
  );
}
