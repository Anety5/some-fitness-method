import { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Clock, User, MapPin } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { ScheduledActivity, Activity, InsertScheduledActivity } from '@shared/schema';
import ActivityScheduler from './activity-scheduler';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource?: ScheduledActivity;
  allDay?: boolean;
  activityData?: Activity;
}

interface InteractiveCalendarProps {
  userId: number;
}

export default function InteractiveCalendar({ userId }: InteractiveCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [view, setView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const queryClient = useQueryClient();

  // Fetch scheduled activities
  const { data: scheduledActivities = [] } = useQuery<ScheduledActivity[]>({
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

  // Create activity map for quick lookup
  const activityMap = useMemo(() => {
    const map = new Map<number, Activity>();
    activities.forEach(activity => map.set(activity.id, activity));
    return map;
  }, [activities]);

  // Delete scheduled activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId: number) => {
      return apiRequest('DELETE', `/api/schedule/${activityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule', userId] });
      setIsEventDialogOpen(false);
      setSelectedEvent(null);
    }
  });

  // Convert scheduled activities to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return scheduledActivities.map(scheduledActivity => {
      const activity = activityMap.get(scheduledActivity.activityId);
      const startTime = new Date(scheduledActivity.scheduledTime);
      const endTime = new Date(startTime.getTime() + (activity?.duration || 30) * 60000);
      
      return {
        id: scheduledActivity.id,
        title: activity?.title || 'Unknown Activity',
        start: startTime,
        end: endTime,
        resource: scheduledActivity,
        activityData: activity,
        allDay: false
      };
    });
  }, [scheduledActivities, activityMap]);

  // Handle slot selection (clicking on empty calendar slot)
  const handleSelectSlot = useCallback((slotInfo: any) => {
    setSelectedDate(slotInfo.start);
    setIsSchedulerOpen(true);
  }, []);

  // Handle event selection (clicking on existing event)
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  }, []);

  // Handle navigation
  const handleNavigate = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  // Handle view change
  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  // Event style getter
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const activity = event.activityData;
    let backgroundColor = '#3174ad';
    
    if (activity?.category === 'exercise') backgroundColor = '#059669';
    else if (activity?.category === 'meditation') backgroundColor = '#7c3aed';
    else if (activity?.category === 'breathing') backgroundColor = '#0891b2';
    else if (activity?.category === 'stretching') backgroundColor = '#ea580c';
    
    const isCompleted = event.resource?.status === 'completed';
    
    return {
      style: {
        backgroundColor: isCompleted ? '#6b7280' : backgroundColor,
        borderRadius: '6px',
        opacity: isCompleted ? 0.7 : 1,
        color: 'white',
        border: '0px',
        display: 'block',
        textDecoration: isCompleted ? 'line-through' : 'none'
      }
    };
  }, []);

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteActivityMutation.mutate(selectedEvent.id);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'exercise': return 'text-emerald-600';
      case 'meditation': return 'text-purple-600';
      case 'breathing': return 'text-cyan-600';
      case 'stretching': return 'text-orange-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Interactive Calendar</CardTitle>
            <Button 
              onClick={() => setIsSchedulerOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="p-6">
          <div className="calendar-container" style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              onNavigate={handleNavigate}
              onView={handleViewChange}
              selectable
              popup
              view={view}
              date={currentDate}
              eventPropGetter={eventStyleGetter}
              step={15}
              timeslots={4}
              views={['month', 'week', 'day', 'agenda']}
              messages={{
                next: 'Next',
                previous: 'Prev',
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
                agenda: 'Agenda',
                noEventsInRange: 'No activities scheduled for this period.',
                showMore: (total) => `+${total} more`
              }}
              formats={{
                timeGutterFormat: 'HH:mm',
                eventTimeRangeFormat: ({ start, end }) => 
                  `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
                agendaTimeRangeFormat: ({ start, end }) => 
                  `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
                agendaDateFormat: 'ddd, MMM DD',
                dayHeaderFormat: 'dddd, MMMM DD',
                dayRangeHeaderFormat: ({ start, end }) => 
                  `${moment(start).format('MMM DD')} - ${moment(end).format('MMM DD, YYYY')}`
              }}
              components={{
                toolbar: (props) => (
                  <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => props.onNavigate('PREV')}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => props.onNavigate('TODAY')}
                      >
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => props.onNavigate('NEXT')}
                      >
                        Next
                      </Button>
                    </div>
                    
                    <h2 className="text-lg font-semibold text-gray-900">
                      {props.label}
                    </h2>
                    
                    <div className="flex items-center space-x-1">
                      {['month', 'week', 'day', 'agenda'].map((viewName) => (
                        <Button
                          key={viewName}
                          variant={props.view === viewName ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => props.onView(viewName as View)}
                        >
                          {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Activity Scheduler Dialog */}
      <ActivityScheduler
        userId={userId}
        selectedDate={selectedDate || undefined}
        onClose={() => {
          setIsSchedulerOpen(false);
          setSelectedDate(null);
        }}
        isOpen={isSchedulerOpen}
      />

      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                <Badge className={getStatusColor(selectedEvent.resource?.status)}>
                  {selectedEvent.resource?.status || 'scheduled'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {moment(selectedEvent.start).format('MMM DD, YYYY HH:mm')} - 
                    {moment(selectedEvent.end).format('HH:mm')}
                  </span>
                </div>
                
                {selectedEvent.activityData && (
                  <>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {selectedEvent.activityData.duration} minutes • {selectedEvent.activityData.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm font-medium ${getCategoryColor(selectedEvent.activityData.category)}`}>
                        {selectedEvent.activityData.category?.charAt(0).toUpperCase() + selectedEvent.activityData.category?.slice(1)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        {selectedEvent.activityData.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEventDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteEvent}
                  disabled={deleteActivityMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}