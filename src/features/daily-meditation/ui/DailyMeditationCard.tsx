import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

interface DailyMeditationCardProps {
  title: string;
  description: string;
}

export function DailyMeditationCard({ title, description }: DailyMeditationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <Button>Play</Button>
        <Button variant="outline">Save</Button>
      </CardContent>
    </Card>
  );
}


