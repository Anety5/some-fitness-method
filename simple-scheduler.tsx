import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { Activity, InsertScheduledActivity } from '@shared/schema';

interface SimpleSchedulerProps {
  userId: number;
  onClose?: () => void;
}

export default function SimpleScheduler({ userId, onClose }: SimpleSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get activities
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const response = await fetch('/api/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
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
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to schedule activity');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({ title: 'Activity scheduled successfully!' });
      // Reset form
      setSelectedActivityId('');
      setSelectedTime('09:00');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      onClose?.();
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to schedule activity', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const handleSchedule = () => {
    if (!selectedActivityId || !selectedDate || !selectedTime) {
      toast({ 
        title: 'Please fill in all fields',
        variant: 'destructive' 
      });
      return;
    }

    // Create full datetime
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    
    scheduleActivityMutation.mutate({
      userId,
      activityId: parseInt(selectedActivityId),
      scheduledTime: scheduledDateTime
    });
  };

  // Get time options
  const timeOptions = [];
  for (let hour = 6; hour < 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(time);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Activity
            </CardTitle>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Activity Selection */}
          <div className="space-y-2">
            <Label>Choose Activity</Label>
            <Select value={selectedActivityId} onValueChange={setSelectedActivityId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an activity..." />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Loading activities...</SelectItem>
                ) : activities.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id.toString()}>
                    {activity.title} ({activity.duration} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time..." />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Schedule Button */}
          <Button 
            onClick={handleSchedule} 
            className="w-full"
            disabled={scheduleActivityMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            {scheduleActivityMutation.isPending ? 'Scheduling...' : 'Schedule Activity'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}