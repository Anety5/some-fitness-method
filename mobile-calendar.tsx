import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { ScheduledActivity, Activity } from '@shared/schema';
import ActivityScheduler from './activity-scheduler';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface MobileCalendarProps {
  userId: number;
}

export default function MobileCalendar({ userId }: MobileCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch scheduled activities
  const { data: scheduledActivities = [], isLoading } = useQuery<ScheduledActivity[]>({
    queryKey: ['/api/schedule', userId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/schedule/${userId}`);
      return response.json();
    }
  });

  // Fetch all activities for reference
  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/activities');
      return response.json();
    }
  });

  // Delete scheduled activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId: number) => {
      return apiRequest('DELETE', `/api/schedule/${activityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule', userId] });
    }
  });

  // Create activity map for quick lookup
  const activityMap = useMemo(() => {
    const map = new Map<number, Activity>();
    activities.forEach(activity => map.set(activity.id, activity));
    return map;
  }, [activities]);

  // Get activities for selected date
  const selectedDateActivities = useMemo(() => {
    const dateStr = selectedDate.toDateString();
    return scheduledActivities.filter(activity => {
      const activityDate = new Date(activity.scheduledTime).toDateString();
      return activityDate === dateStr;
    });
  }, [scheduledActivities, selectedDate]);

  // Get activities for a specific date (for tile content)
  const getActivitiesForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return scheduledActivities.filter(activity => {
      const activityDate = new Date(activity.scheduledTime).toDateString();
      return activityDate === dateStr;
    });
  };

  // Tile content for calendar dates
  const tileContent = ({ date }: { date: Date }) => {
    const dayActivities = getActivitiesForDate(date);
    if (dayActivities.length === 0) return null;

    return (
      <div className="flex justify-center mt-1">
        <div className="flex space-x-1">
          {dayActivities.slice(0, 3).map((activity, index) => {
            const activityData = activityMap.get(activity.activityId);
            const color = getCategoryColor(activityData?.category);
            return (
              <div
                key={activity.id}
                className={`w-1.5 h-1.5 rounded-full ${color}`}
              />
            );
          })}
          {dayActivities.length > 3 && (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          )}
        </div>
      </div>
    );
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'exercise': return 'bg-emerald-500';
      case 'meditation': return 'bg-purple-500';
      case 'breathing': return 'bg-cyan-500';
      case 'stretching': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  const getCategoryColorText = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'exercise': return 'text-emerald-600';
      case 'meditation': return 'text-purple-600';
      case 'breathing': return 'text-cyan-600';
      case 'stretching': return 'text-orange-600';
      default: return 'text-blue-600';
    }
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading calendar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Schedule Calendar
            </CardTitle>
            <Button 
              onClick={() => setIsSchedulerOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mobile-calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={tileContent}
              className="w-full"
              showNavigation={true}
              showNeighboringMonth={false}
              formatShortWeekday={(locale, date) => {
                const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                return days[date.getDay()];
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {formatSelectedDate(selectedDate)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-4">
                <CalendarIcon className="w-12 h-12 mx-auto text-gray-300" />
              </div>
              <p className="text-gray-600 mb-2">No activities scheduled for this day</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSchedulerOpen(true)}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Activity
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateActivities
                .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                .map(activity => {
                  const activityData = activityMap.get(activity.activityId);
                  const time = new Date(activity.scheduledTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  });
                  
                  return (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${getCategoryColor(activityData?.category)}`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{activityData?.title}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{time}</span>
                            <span>•</span>
                            <span>{activityData?.duration} min</span>
                            <span>•</span>
                            <span className={getCategoryColorText(activityData?.category)}>
                              {activityData?.category?.charAt(0).toUpperCase() + activityData?.category?.slice(1)}
                            </span>
                          </div>
                          {activity.notes && (
                            <p className="text-sm text-gray-500 mt-1">{activity.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                          {activity.status || 'scheduled'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteActivityMutation.mutate(activity.id)}
                          disabled={deleteActivityMutation.isPending}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Scheduler Modal */}
      <ActivityScheduler
        userId={userId}
        selectedDate={selectedDate}
        onClose={() => setIsSchedulerOpen(false)}
        isOpen={isSchedulerOpen}
      />
    </div>
  );
}