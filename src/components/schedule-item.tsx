import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import type { ScheduledActivity, Activity } from "@shared/schema";

interface ScheduleItemProps {
  scheduledActivity: ScheduledActivity;
  activity?: Activity;
  onComplete?: (id: number) => void;
  onStart?: (id: number) => void;
}

export default function ScheduleItem({ 
  scheduledActivity, 
  activity, 
  onComplete, 
  onStart 
}: ScheduleItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-secondary/30 border-secondary";
      case "scheduled": return "bg-primary/20 border-primary";
      default: return "bg-muted border-border";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed": return "text-foreground bg-secondary/50";
      case "scheduled": return "text-primary bg-primary/20";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getActivityIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "exercise": return "fas fa-running";
      case "meditation": return "fas fa-lotus-position";
      case "breathing": return "fas fa-wind";
      case "stretching": return "fas fa-stretching";
      default: return "fas fa-dumbbell";
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`flex items-center p-4 rounded-lg border ${getStatusColor(scheduledActivity.status || "scheduled")}`}>
      <div className={`w-10 h-10 bg-${activity?.category === 'meditation' ? 'purple' : activity?.category === 'exercise' ? 'blue' : 'green'}-100 rounded-lg flex items-center justify-center mr-4`}>
        <i className={`${getActivityIcon(activity?.category)} text-${activity?.category === 'meditation' ? 'purple' : activity?.category === 'exercise' ? 'blue' : 'green'}-600`}></i>
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">
          {activity?.title || "Activity"}
        </h4>
        <p className="text-sm text-gray-600">
          {activity?.duration} minutes • {activity?.difficulty} level
        </p>
      </div>
      <div className="text-right">
        <span className="text-sm font-medium text-gray-900">
          {formatTime(scheduledActivity.scheduledTime)}
        </span>
        <div className="flex items-center mt-1">
          <Badge className={`text-xs ${getStatusBadgeColor(scheduledActivity.status || "scheduled")}`}>
            {scheduledActivity.status === "completed" ? "Completed" : 
             scheduledActivity.status === "scheduled" ? "Upcoming" : "Scheduled"}
          </Badge>
          {scheduledActivity.status !== "completed" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStart?.(scheduledActivity.id)}
              className="ml-2 h-6 px-2"
            >
              <Play className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
