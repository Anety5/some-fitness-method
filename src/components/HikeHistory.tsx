import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Zap, TrendingUp, Calendar, Mountain, ArrowLeft } from "lucide-react";
import { formatDistance, formatDuration, formatPace } from "@shared/hiking-utils";
import type { HikeSession } from "@shared/schema";
import HikeSummary from "./HikeSummary";

interface HikeHistoryProps {
  sessions: HikeSession[];
  isLoading: boolean;
  onSwitchToTracker?: () => void;
}

export function HikeHistory({ sessions, isLoading, onSwitchToTracker }: HikeHistoryProps) {
  const [selectedHike, setSelectedHike] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Ensure sessions is always an array and filter out invalid entries
  const safeSessions = Array.isArray(sessions) ? sessions.filter(session => session && session.id) : [];

  const fetchHikeDetails = async (hikeId: number) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/hikes/${hikeId}/details`);
      if (response.ok) {
        const hikeDetails = await response.json();
        setSelectedHike(hikeDetails);
      }
    } catch (error) {
      // Error fetching hike details handled in UI
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = (session: HikeSession) => {
    fetchHikeDetails(session.id);
  };

  const handleBackToList = () => {
    setSelectedHike(null);
  };

  // If viewing details, show the HikeSummary component
  if (selectedHike) {
    return (
      <div className="space-y-4 overflow-hidden">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToList}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <HikeSummary hike={selectedHike} />
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (safeSessions.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardContent className="p-12 text-center">
          <Mountain className="w-12 h-12 text-white/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No hikes recorded yet</h3>
          <p className="text-white/70 mb-4">
            Start your first tracking session to see your adventure history here.
          </p>
          <Button onClick={onSwitchToTracker}>
            Start Your First Hike
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "hike": return "bg-green-600";
      case "walk": return "bg-blue-600";
      case "run": return "bg-red-600";
      case "bike": return "bg-purple-600";
      default: return "bg-gray-600";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "hike": return "🥾";
      case "walk": return "🚶";
      case "run": return "🏃";
      case "bike": return "🚴";
      default: return "📍";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Activity History</h2>
        <Badge variant="secondary" className="bg-white/10 text-white">
          {safeSessions.length} session{safeSessions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-4">
        {safeSessions.map((session) => (
          <Card key={session.id} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getActivityIcon(session.activityType)}</div>
                  <div>
                    <CardTitle className="text-white text-lg">{session.title}</CardTitle>
                    <CardDescription className="text-white/70 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(session.startTime).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={`${getActivityColor(session.activityType)} text-white border-0`}>
                    {session.activityType.charAt(0).toUpperCase() + session.activityType.slice(1)}
                  </Badge>
                  {session.difficulty && (
                    <Badge variant="outline" className="text-white border-white/30">
                      {session.difficulty}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-white/70 text-xs mb-1">
                    <MapPin className="w-3 h-3" />
                    Distance
                  </div>
                  <div className="text-white font-semibold">
                    {session.distanceKm ? formatDistance(session.distanceKm) : "—"}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-white/70 text-xs mb-1">
                    <Clock className="w-3 h-3" />
                    Duration
                  </div>
                  <div className="text-white font-semibold">
                    {session.totalDuration ? formatDuration(session.totalDuration) : "—"}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-white/70 text-xs mb-1">
                    <TrendingUp className="w-3 h-3" />
                    Avg Pace
                  </div>
                  <div className="text-white font-semibold">
                    {session.averagePace ? formatPace(parseFloat(session.averagePace)) : "—"}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-white/70 text-xs mb-1">
                    <Zap className="w-3 h-3" />
                    Calories
                  </div>
                  <div className="text-white font-semibold">
                    {session.calories || "—"}
                  </div>
                </div>
              </div>

              {session.notes && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-white/80 text-sm">{session.notes}</p>
                </div>
              )}

              {/* Elevation and Weather Info */}
              <div className="flex flex-wrap gap-4 mt-4">
                {session.elevationGain && parseFloat(session.elevationGain) > 0 && (
                  <div className="flex items-center gap-1 text-white/70 text-xs">
                    <Mountain className="w-3 h-3" />
                    +{Math.round(parseFloat(session.elevationGain))}m elevation
                  </div>
                )}
                {session.weatherConditions && (
                  <div className="text-white/70 text-xs">
                    🌤️ {session.weatherConditions}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-white/50 text-xs">
                  {session.status === "completed" ? "✅ Completed" : `📍 ${session.status}`}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/70 hover:text-white"
                  onClick={() => handleViewDetails(session)}
                  disabled={loadingDetails}
                >
                  {loadingDetails ? "Loading..." : "View Details"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length > 0 && (
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-white/60 text-sm">
              Showing recent activity sessions. Keep tracking to build your adventure log! 🏔️
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}