import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, CheckCircle, Circle, Edit3, Trash2 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Activity, ScheduledActivity, InsertScheduledActivity } from '@shared/schema';

interface ActivitySchedulerProps {
  userId: number;
  selectedDate?: Date;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function ActivityScheduler({ userId, selectedDate, onClose, isOpen = false }: ActivitySchedulerProps) {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  const { toast } = useToast();

  // Format date for API and display
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Fetch available activities
  const { data: activities, isLoading: isLoadingActivities } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const response = await fetch('/api/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    }
  });

  // Fetch scheduled activities for the selected date
  const { data: scheduledActivities, isLoading: isLoadingScheduled } = useQuery<ScheduledActivity[]>({
    queryKey: ['/api/schedule', userId, formatDate(viewDate)],
    queryFn: async () => {
      const response = await fetch(`/api/schedule/${userId}?date=${formatDate(viewDate)}`);
      if (!response.ok) throw new Error('Failed to fetch scheduled activities');
      return response.json();
    }
  });

  // Schedule activity mutation
  const scheduleActivityMutation = useMutation({
    mutationFn: async (data: InsertScheduledActivity) => {
      return await apiRequest('/api/schedule', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({ title: 'Activity scheduled successfully!' });
      setIsAddingActivity(false);
      setSelectedActivity(null);
      setScheduledTime('');
      setNotes('');
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to schedule activity', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Complete activity mutation
  const completeActivityMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/schedule/${id}`, 'PATCH', { completedAt: new Date().toISOString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({ title: 'Activity completed!' });
    }
  });

  // Delete scheduled activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/schedule/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({ title: 'Activity removed from schedule' });
    }
  });

  const handleScheduleActivity = () => {
    if (!selectedActivity || !scheduledTime) {
      toast({ 
        title: 'Please select an activity and time',
        variant: 'destructive' 
      });
      return;
    }

    const scheduledDateTime = new Date(`${formatDate(viewDate)}T${scheduledTime}`);
    
    scheduleActivityMutation.mutate({
      userId,
      activityId: selectedActivity.id,
      scheduledTime: scheduledDateTime
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'yoga': return 'bg-purple-100 text-purple-800';
      case 'meditation': return 'bg-blue-100 text-blue-800';
      case 'cardio': return 'bg-red-100 text-red-800';
      case 'strength': return 'bg-orange-100 text-orange-800';
      case 'breathing': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Activity Scheduler
          </h2>
          <p className="text-gray-600">{formatDisplayDate(viewDate)}</p>
        </div>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>×</Button>
        )}
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="date">Select Date:</Label>
            <Input
              id="date"
              type="date"
              value={formatDate(viewDate)}
              onChange={(e) => setViewDate(new Date(e.target.value))}
              className="w-auto"
            />
            <Button
              variant="outline"
              onClick={() => setViewDate(new Date())}
            >
              Today
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add New Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Schedule Activity
            </CardTitle>
            <Button
              onClick={() => setIsAddingActivity(!isAddingActivity)}
              variant={isAddingActivity ? "outline" : "default"}
            >
              {isAddingActivity ? 'Cancel' : 'Add Activity'}
            </Button>
          </div>
        </CardHeader>
        
        {isAddingActivity && (
          <CardContent className="space-y-4">
            {/* Activity Selection */}
            <div className="space-y-2">
              <Label>Choose Activity:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {isLoadingActivities ? (
                  <p className="text-gray-500">Loading activities...</p>
                ) : activities?.map((activity) => (
                  <Card
                    key={activity.id}
                    className={`cursor-pointer transition-colors ${
                      selectedActivity?.id === activity.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getDifficultyColor(activity.difficulty)}>
                          {activity.difficulty}
                        </Badge>
                        <Badge className={getCategoryColor(activity.category)}>
                          {activity.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {activity.duration} min
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time:</Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional):</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes or reminders..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <Button 
              onClick={handleScheduleActivity}
              disabled={!selectedActivity || !scheduledTime || scheduleActivityMutation.isPending}
              className="w-full"
            >
              {scheduleActivityMutation.isPending ? 'Scheduling...' : 'Schedule Activity'}
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Scheduled Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingScheduled ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 h-16 rounded"></div>
              ))}
            </div>
          ) : scheduledActivities && scheduledActivities.length > 0 ? (
            <div className="space-y-3">
              {scheduledActivities.map((scheduled) => {
                const activity = activities?.find(a => a.id === scheduled.activityId);
                const scheduledTime = new Date(scheduled.scheduledFor);
                
                return (
                  <Card key={scheduled.id} className={`${scheduled.completedAt ? 'bg-green-50 border-green-200' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => completeActivityMutation.mutate(scheduled.id)}
                            disabled={!!scheduled.completedAt}
                          >
                            {scheduled.completedAt ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </Button>
                          
                          <div>
                            <h4 className={`font-medium ${scheduled.completedAt ? 'line-through text-gray-500' : ''}`}>
                              {activity?.title || 'Unknown Activity'}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              {scheduledTime.toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                              {activity && (
                                <>
                                  <span>•</span>
                                  <span>{activity.duration} min</span>
                                </>
                              )}
                            </div>
                            {scheduled.notes && (
                              <p className="text-sm text-gray-600 mt-1">{scheduled.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteActivityMutation.mutate(scheduled.id)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No activities scheduled for this date</p>
              <p className="text-sm">Click "Add Activity" to start planning your day</p>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}