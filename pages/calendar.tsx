import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Calendar as CalendarIcon, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import type { Activity, InsertScheduledActivity } from "@shared/schema";
import BotanicalDecorations from "@/components/botanical-decorations";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const { data: scheduledActivities = [] } = useQuery({
    queryKey: ['/api/schedule', user?.id, formatDate(selectedDate)],
    queryFn: async () => {
      const response = await fetch(`/api/schedule/${user?.id}?date=${formatDate(selectedDate)}`);
      if (!response.ok) throw new Error('Failed to fetch scheduled activities');
      return response.json();
    },
    enabled: !!user?.id
  });

  const scheduleActivity = useMutation({
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
      setIsScheduleDialogOpen(false);
      setSelectedActivityId("");
      setSelectedTime("09:00");
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to schedule activity', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const completeActivity = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/schedule/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true })
      });
      if (!response.ok) throw new Error('Failed to complete activity');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({ title: 'Activity completed!' });
    }
  });

  const handleScheduleActivity = () => {
    if (!selectedActivityId) {
      toast({ 
        title: 'Please select an activity',
        variant: 'destructive' 
      });
      return;
    }

    const scheduledDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    scheduleActivity.mutate({
      userId: user?.id || 0,
      activityId: parseInt(selectedActivityId),
      scheduledTime: scheduledDateTime
    });
  };

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00"
  ];

  const getActivityById = (id: number) => {
    return activities.find(activity => activity.id === id);
  };

  const getStatusColor = (scheduled: any) => {
    if (scheduled.completed) return "bg-green-100 text-green-700 border-green-200";
    const now = new Date();
    const scheduledTime = new Date(scheduled.scheduledTime);
    if (scheduledTime < now) return "bg-red-100 text-red-700 border-red-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getStatusIcon = (scheduled: any) => {
    if (scheduled.completed) return <CheckCircle className="h-4 w-4" />;
    const now = new Date();
    const scheduledTime = new Date(scheduled.scheduledTime);
    if (scheduledTime < now) return <AlertCircle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navigation />
      <BotanicalDecorations variant="page" elements={['wave', 'palm']} />
      
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Activity Calendar</h2>
            <p className="text-gray-600 mt-2">
              Plan and track your wellness activities throughout the week
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
                
                <div className="mt-6">
                  <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Activity
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule Activity</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Date</Label>
                          <p className="text-sm text-gray-600">
                            {selectedDate.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="activity">Activity</Label>
                          <Select value={selectedActivityId} onValueChange={setSelectedActivityId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose an activity" />
                            </SelectTrigger>
                            <SelectContent>
                              {activities.map((activity) => (
                                <SelectItem key={activity.id} value={activity.id.toString()}>
                                  {activity.title} ({activity.duration}m)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button 
                          onClick={handleScheduleActivity}
                          disabled={scheduleActivity.isPending}
                          className="w-full"
                        >
                          {scheduleActivity.isPending ? 'Scheduling...' : 'Schedule Activity'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Activities */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Activities for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scheduledActivities.length > 0 ? (
                  <div className="space-y-3">
                    {scheduledActivities
                      .sort((a: any, b: any) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                      .map((scheduled: any) => {
                        const activity = getActivityById(scheduled.activityId);
                        if (!activity) return null;
                        
                        return (
                          <div key={scheduled.id} className={`p-4 rounded-lg border ${getStatusColor(scheduled)}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getStatusIcon(scheduled)}
                                  <h4 className="font-medium">{activity.title}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {activity.category}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(scheduled.scheduledTime).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                  <span>{activity.duration} minutes</span>
                                  <span>{activity.difficulty}</span>
                                </div>
                              </div>
                              
                              {!scheduled.completed && (
                                <Button
                                  size="sm"
                                  onClick={() => completeActivity.mutate(scheduled.id)}
                                  disabled={completeActivity.isPending}
                                  className="ml-4"
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No activities scheduled</p>
                    <p>Click "Schedule Activity" to plan your wellness activities</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}