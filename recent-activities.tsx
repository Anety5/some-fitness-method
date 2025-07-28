import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, Clock } from 'lucide-react';

interface RecentActivitiesProps {
  userId: number;
  className?: string;
}

export default function RecentActivities({ userId, className = "" }: RecentActivitiesProps) {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/schedule', userId],
    select: (data: any[]) => {
      // Filter to only show auto-logged activities from today and yesterday
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      return data
        .filter(activity => {
          const completedDate = new Date(activity.completedAt);
          return activity.completed && completedDate >= twoDaysAgo;
        })
        .slice(0, 5); // Show last 5 activities
    }
  });

  if (isLoading) {
    return (
      <Card className={`bg-white/20 backdrop-blur-sm border-white/30 ${className}`}>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/10 rounded-lg p-3 animate-pulse">
                <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className={`bg-white/20 backdrop-blur-sm border-white/30 ${className}`}>
        
      </Card>
    );
  }

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return '🎵';
      case 'breathing': return '💨';
      case 'exercise': return '💪';
      case 'nutrition': return '🍎';
      case 'meditation': return '🧘';
      default: return '✨';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours >= 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours >= 1) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins >= 1) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <Card className={`bg-white/20 backdrop-blur-sm border-white/30 ${className}`}>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={activity.id || index} className="bg-white/10 rounded-lg p-3 border border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-lg">{getActivityTypeIcon(activity.activityType || 'exercise')}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {activity.sessionData?.title || 'Activity Completed'}
                    </p>
                    <p className="text-white/60 text-xs">
                      {activity.sessionData?.category || activity.activityType || 'General'}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-white/60 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(new Date(activity.completedAt))}
                </div>
              </div>
              {activity.sessionData?.duration && (
                <div className="mt-2 text-xs text-white/60">
                  Duration: {activity.sessionData.duration} min
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}