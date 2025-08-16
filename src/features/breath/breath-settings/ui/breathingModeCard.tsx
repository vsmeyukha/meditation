import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/shared/ui/card";

import { type Profile } from "@/features/breath/breath-exercise/lib/ratios";

interface BreathingModeCardProps {
  name: string;
  icon: ReactNode;
  className?: string;
  profile: Profile | "custom"; // Used for typing breathingModes array
  onClick?: () => void;
}

export function BreathingModeCard({
  name,
  className,
  icon,
  profile,
  onClick,
}: BreathingModeCardProps) {
  return (
    <Card
      variant="practice"
      onClick={onClick}
      className={cn(
        "flex-shrink-0 w-20 h-28 cursor-pointer transition-all duration-300 shadow-lg opacity-60 backdrop-blur-sm border-0 py-0 gap-0 hover:opacity-80",
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
