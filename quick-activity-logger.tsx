import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Play, CheckCircle, Clock } from "lucide-react";

interface QuickActivityLoggerProps {
  userId: number;
}

export default function QuickActivityLogger({ userId }: QuickActivityLoggerProps) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const quickActivities = [
    { id: 'walk', name: 'Walk', emoji: '🚶‍♂️', duration: 20 },
    { id: 'stretch', name: 'Stretch', emoji: '🧘‍♀️', duration: 10 },
    { id: 'workout', name: 'Workout', emoji: '💪', duration: 30 },
    { id: 'yoga', name: 'Yoga', emoji: '🧘', duration: 25 },
    { id: 'run', name: 'Run', emoji: '🏃‍♂️', duration: 30 },
    { id: 'breathing', name: 'Breathing', emoji: '🌬️', duration: 5 }
  ];

  // Quick log mutation
  const quickLogMutation = useMutation({
    mutationFn: async (activityId: string) => {
      const activity = quickActivities.find(a => a.id === activityId);
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          date: new Date().toISOString(),
          energyLevel: 7, // Default good energy
          completedActivities: activityId,
          notes: `Quick logged: ${activity?.name}`,
          duration: activity?.duration || 15
        })
      });
      if (!response.ok) throw new Error('Failed to log activity');
      return response.json();
    },
    onSuccess: (_, activityId) => {
      const activity = quickActivities.find(a => a.id === activityId);
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      toast({ 
        title: `${activity?.name} logged!`,
        description: `${activity?.duration} minutes completed`
      });
      setIsLogging(false);
      setSelectedActivity(null);
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to log activity', 
        description: error.message,
        variant: 'destructive' 
      });
      setIsLogging(false);
    }
  });

  // Schedule for tomorrow mutation
  const scheduleMutation = useMutation({
    mutationFn: async (activityId: string) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0); // 9 AM tomorrow
      
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          activityId: 1, // Default activity ID
          scheduledTime: tomorrow.toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to schedule activity');
      return response.json();
    },
    onSuccess: (_, activityId) => {
      const activity = quickActivities.find(a => a.id === activityId);
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({ 
        title: `${activity?.name} scheduled!`,
        description: `Set for tomorrow at 9:00 AM`
      });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to schedule activity', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const handleQuickLog = (activityId: string) => {
    setSelectedActivity(activityId);
    setIsLogging(true);
    quickLogMutation.mutate(activityId);
  };

  const handleSchedule = (activityId: string) => {
    scheduleMutation.mutate(activityId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-green-600" />
          Quick Activity Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActivities.map((activity) => (
            <div key={activity.id} className="space-y-2">
              <Button
                onClick={() => handleQuickLog(activity.id)}
                disabled={quickLogMutation.isPending && selectedActivity === activity.id}
                className="w-full h-16 flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 border border-green-200 text-green-700"
                variant="outline"
              >
                {quickLogMutation.isPending && selectedActivity === activity.id ? (
                  <CheckCircle className="h-6 w-6 animate-pulse" />
                ) : (
                  <>
                    <span className="text-lg">{activity.emoji}</span>
                    <span className="text-xs font-medium">{activity.name}</span>
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.duration}m
                </Badge>
                <Button
                  onClick={() => handleSchedule(activity.id)}
                  disabled={scheduleMutation.isPending}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 hover:text-blue-700 h-6 px-2"
                >
                  Schedule
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Tap to log now • Click "Schedule" for tomorrow
          </p>
        </div>
      </CardContent>
    </Card>
  );
}