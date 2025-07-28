import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import type { Activity } from "@shared/schema";
import FavoriteButton from "./favorite-button";

interface ActivityCardProps {
  activity: Activity;
  onStart?: (activityId: number) => void;
}

export default function ActivityCard({ activity, onStart }: ActivityCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-secondary/50 text-foreground";
      case "medium": return "bg-muted text-foreground";
      case "hard": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "exercise": return "bg-primary/20 text-primary";
      case "meditation": return "bg-accent/20 text-accent";
      case "breathing": return "bg-secondary/50 text-foreground";
      case "stretching": return "bg-muted text-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {activity.imageUrl && (
        <img 
          src={activity.imageUrl} 
          alt={activity.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={`text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
            {activity.difficulty.toUpperCase()}
          </Badge>
          <span className="text-sm text-gray-500">{activity.duration} min</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            {activity.caloriesBurned ? (
              <>
                <Flame className="h-4 w-4 mr-1" />
                <span>{activity.caloriesBurned} calories</span>
              </>
            ) : (
              <Badge className={getCategoryColor(activity.category)}>
                {activity.category}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => onStart?.(activity.id)}
            className="flex-1 bg-accent text-white hover:bg-emerald-600 transition-colors"
          >
            Start Now
          </Button>
          <FavoriteButton 
            userId={1}
            itemType="activity"
            itemId={activity.id}
            className="px-3"
          />
        </div>
      </CardContent>
    </Card>
  );
}
