import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/shared/ui/card";

interface BreathingModeCardProps {
  name: string;
  className?: string;
  icon: ReactNode;
}

export function BreathingModeCard({
  name,
  className,
  icon,
}: BreathingModeCardProps) {
  return (
    <Card
      variant="practice"
      className={cn(
        "flex-shrink-0 w-1/5 h-24 cursor-pointer transition-all duration-300 shadow-lg opacity-60 backdrop-blur-sm border-0 py-0 gap-0 hover:opacity-80",
        className,
      )}
    >
      <CardContent className="flex flex-col items-center justify-center h-full gap-2">
        {icon}
        <div
          className={`text-xs font-medium text-white text-center leading-none flex items-center justify-center ${name === "4-7-8" ? "font-mono tabular-nums" : ""}`}
        >
          {name}
        </div>
      </CardContent>
    </Card>
  );
}
