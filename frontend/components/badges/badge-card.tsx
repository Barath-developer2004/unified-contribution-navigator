import React from 'react';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  title,
  description,
  icon,
  earned,
  progress = 0,
}) => {
  return (
    <Card className={`w-64 transition-all duration-300 ${earned ? 'bg-primary/10' : 'opacity-50'}`}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <span className="text-2xl" role="img" aria-label={title}>
            {icon}
          </span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {progress !== undefined && (
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <Badge variant={earned ? "default" : "outline"} className="mt-2">
          {earned ? "Earned" : "Locked"}
        </Badge>
      </CardContent>
    </Card>
  );
};
