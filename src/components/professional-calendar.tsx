import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Clock, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { ScheduledActivity, Activity } from '@shared/schema';
import ActivityScheduler from './activity-scheduler';

interface ProfessionalCalendarProps {
  userId: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ProfessionalCalendar({ userId }: ProfessionalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
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

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Get activities for a specific date
  const getActivitiesForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return scheduledActivities.filter(activity => {
      const activityDate = new Date(activity.scheduledTime).toDateString();
      return activityDate === dateStr;
    });
  };

  // Get activities for selected date
  const selectedDateActivities = useMemo(() => {
    return getActivitiesForDate(selectedDate);
  }, [scheduledActivities, selectedDate]);

  const days = generateCalendarDays();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
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
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold min-w-[200px] text-center">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
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
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {DAYS.map(day => (
              <div key={day} className="text-center font-medium text-gray-500 py-2 text-sm">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day[0]}</span>
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((date, index) => {
              const dayActivities = getActivitiesForDate(date);
              const isCurrentMonthDay = isCurrentMonth(date);
              const isTodayDate = isToday(date);
              const isSelected = isSelectedDate(date);
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border rounded-lg cursor-pointer transition-all duration-200
                    ${isCurrentMonthDay ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 text-gray-400'}
                    ${isTodayDate ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                    ${isSelected && !isTodayDate ? 'ring-2 ring-purple-500 bg-purple-50' : ''}
                    ${dayActivities.length > 0 ? 'border-blue-200' : 'border-gray-200'}
                    hover:shadow-md
                  `}
                  onClick={() => handleDateClick(date)}
                >
                  <div className={`
                    text-sm font-medium mb-1 
                    ${isTodayDate ? 'text-blue-600 font-bold' : ''}
                    ${isSelected && !isTodayDate ? 'text-purple-600 font-bold' : ''}
                  `}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayActivities.slice(0, 2).map(activity => {
                      const activityData = activityMap.get(activity.activityId);
                      const time = new Date(activity.scheduledTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });
                      
                      return (
                        <div
                          key={activity.id}
                          className={`
                            text-xs p-1 rounded text-white truncate
                            ${getCategoryColor(activityData?.category)}
                          `}
                          title={`${activityData?.title} at ${time}`}
                        >
                          <span className="hidden sm:inline">{time} - </span>
                          {activityData?.title}
                        </div>
                      );
                    })}
                    
                    {dayActivities.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayActivities.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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