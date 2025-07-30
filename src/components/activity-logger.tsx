import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Play, Calendar as CalendarIcon, Activity, TrendingUp } from "lucide-react";
import type { Activity as ActivityType, InsertScheduledActivity } from "@shared/schema";

interface ActivityLoggerProps {
  userId: number;
  onClose?: () => void;
}

export default function ActivityLogger({ userId, onClose }: ActivityLoggerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [energyLevel, setEnergyLevel] = useState([5]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventRepeat, setEventRepeat] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available activities
  const { data: activities = [] } = useQuery<ActivityType[]>({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const response = await fetch('/api/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    }
  });

  // Fetch user's scheduled activities for selected date
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  const { data: scheduledActivities = [] } = useQuery({
    queryKey: ['/api/schedule', userId, formatDate(selectedDate)],
    queryFn: async () => {
      const response = await fetch(`/api/schedule/${userId}?date=${formatDate(selectedDate)}`);
      if (!response.ok) throw new Error('Failed to fetch scheduled activities');
      return response.json();
    }
  });

  // Activity logging mutation
  const logActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          date: selectedDate.toISOString(),
          energyLevel: energyLevel[0],
          completedActivities: completedActivities.join(','),
          notes,
          duration: parseInt(duration) || 0
        })
      });
      if (!response.ok) throw new Error('Failed to log activity');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      toast({ title: 'Activity logged successfully!' });
      // Reset form
      setCompletedActivities([]);
      setNotes("");
      setDuration("");
      setEnergyLevel([5]);
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to log activity', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Schedule activity mutation
  const scheduleActivityMutation = useMutation({
    mutationFn: async (data: InsertScheduledActivity) => {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          scheduledTime: data.scheduledTime.toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to schedule activity');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({ title: 'Activity scheduled successfully!' });
      setEventTitle("");
      setEventRepeat(false);
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to schedule activity', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const toggleActivity = (activityId: string) => {
    setCompletedActivities(prev =>
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleLogActivity = () => {
    if (completedActivities.length === 0) {
      toast({ 
        title: 'Please select at least one activity',
        variant: 'destructive' 
      });
      return;
    }
    logActivityMutation.mutate({});
  };

  const handleScheduleEvent = () => {
    if (!eventTitle.trim()) {
      toast({ 
        title: 'Please enter an event title',
        variant: 'destructive' 
      });
      return;
    }

    // Create a generic activity entry for custom events
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(9, 0, 0, 0); // Default to 9 AM

    scheduleActivityMutation.mutate({
      userId,
      activityId: 1, // Use a default activity ID for custom events
      scheduledTime: scheduledDateTime
    });
  };

  const quickActivities = [
    { id: 'walk', name: 'Walk', category: 'cardio' },
    { id: 'stretch', name: 'Stretch', category: 'stretching' },
    { id: 'workout', name: 'Workout', category: 'exercise' },
    { id: 'yoga', name: 'Yoga', category: 'yoga' },
    { id: 'run', name: 'Run', category: 'cardio' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Activity Logger & Scheduler</h1>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>

          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar 
                mode="single"
                selected={selectedDate} 
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Activity Logging */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Log Completed Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Activity Buttons */}
              <div>
                <label className="block font-medium mb-2">Quick Activities</label>
                <div className="flex gap-2 flex-wrap">
                  {quickActivities.map((activity) => (
                    <Button
                      key={activity.id}
                      variant={completedActivities.includes(activity.id) ? "default" : "outline"}
                      onClick={() => toggleActivity(activity.id)}
                      className="flex items-center gap-1"
                    >
                      <Play className="h-3 w-3" />
                      {activity.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Available Activities from Database */}
              {activities.length > 0 && (
                <div>
                  <label className="block font-medium mb-2">Available Movement Activities</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {activities.slice(0, 8).map((activity) => (
                      <Button
                        key={activity.id}
                        variant={completedActivities.includes(activity.id.toString()) ? "default" : "outline"}
                        onClick={() => toggleActivity(activity.id.toString())}
                        className="text-left justify-start text-sm"
                        size="sm"
                      >
                        {activity.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Energy Level */}
              <div>
                <label className="block font-medium mb-2">Energy Level: {energyLevel[0]}/10</label>
                <Slider 
                  min={1} 
                  max={10} 
                  value={energyLevel} 
                  onValueChange={setEnergyLevel}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block font-medium mb-2">Duration (minutes)</label>
                <Input 
                  type="number"
                  placeholder="30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-medium mb-2">Notes (optional)</label>
                <Textarea
                  placeholder="How did it feel? Any observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleLogActivity}
                disabled={logActivityMutation.isPending}
              >
                {logActivityMutation.isPending ? 'Logging...' : 'Log Activity'}
              </Button>
            </CardContent>
          </Card>

          {/* Event Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Schedule Future Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="Activity or event title" 
                value={eventTitle} 
                onChange={(e) => setEventTitle(e.target.value)} 
              />
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={eventRepeat} 
                  onCheckedChange={(checked) => setEventRepeat(checked === true)} 
                />
                <span className="text-sm">Repeat this activity weekly</span>
              </div>
              <Button 
                onClick={handleScheduleEvent}
                disabled={scheduleActivityMutation.isPending}
                className="w-full"
              >
                {scheduleActivityMutation.isPending ? 'Scheduling...' : 'Schedule Activity'}
              </Button>
            </CardContent>
          </Card>

          {/* Today's Scheduled Activities */}
          {scheduledActivities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Scheduled for {selectedDate.toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {scheduledActivities.map((scheduled: any) => (
                    <div key={scheduled.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">
                        {new Date(scheduled.scheduledTime).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <Badge variant={scheduled.completed ? "default" : "secondary"}>
                        {scheduled.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}