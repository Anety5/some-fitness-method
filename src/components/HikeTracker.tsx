import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Square, MapPin, Camera, Save, Navigation, Edit2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { 
  getCurrentLocation, 
  watchLocation, 
  stopWatchingLocation,
  haversineDistance,
  formatDistance,
  formatDuration,
  formatPace,
  calculateSpeed,
  estimateCaloriesBurned
} from "@shared/hiking-utils";
import type { InsertHikeSession, InsertHikeTrackingPoint, InsertHikeWaypoint } from "@shared/schema";

interface TrackingPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp: Date;
  accuracy?: number;
  speed?: number;
}

interface Waypoint {
  latitude: number;
  longitude: number;
  name: string;
  description?: string;
  timestamp: Date;
}

export function HikeTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hikeSession, setHikeSession] = useState<any>(null);
  const [trackingPoints, setTrackingPoints] = useState<TrackingPoint[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [sessionTitle, setSessionTitle] = useState("");
  const [customTitle, setCustomTitle] = useState(false);
  const [hikeType, setHikeType] = useState<"hike" | "walk" | "run" | "bike">("walk");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [locationPermission, setLocationPermission] = useState<string>("prompt");
  
  const watchId = useRef<number | null>(null);
  const intervalId = useRef<number | null>(null);
  const queryClient = useQueryClient();

  // Calculate real-time stats with GPS noise filtering
  const totalDistance = trackingPoints.length > 1 ? 
    trackingPoints.reduce((total, point, index) => {
      if (index === 0) return 0;
      const prev = trackingPoints[index - 1];
      const segmentDistance = haversineDistance(prev.latitude, prev.longitude, point.latitude, point.longitude);
      
      // Filter out GPS noise - ignore movements over 100m in 5 seconds (unrealistic)
      const timeDiff = (point.timestamp.getTime() - prev.timestamp.getTime()) / 1000; // seconds
      const maxReasonableSpeed = 30; // 30 m/s = ~108 km/h (very fast running)
      
      if (timeDiff > 0 && segmentDistance / timeDiff > maxReasonableSpeed) {
        // GPS noise filtered - distance too small or speed unrealistic
        return total; // Skip this point
      }
      
      return total + segmentDistance;
    }, 0) : 0;

  // Calculate pace in minutes per kilometer - ensure we have reasonable values
  const averagePace = totalDistance > 10 && elapsedTime > 10 ? // Only calculate after 10m distance and 10s time
    (elapsedTime / 60) / (totalDistance / 1000) : 0;

  // Calculate speed with bounds checking
  const currentSpeed = totalDistance > 0 && elapsedTime > 5 ? // Wait at least 5 seconds
    Math.min(calculateSpeed(totalDistance, elapsedTime / 60), 50) : 0; // Cap at 50 km/h

  const estimatedCalories = estimateCaloriesBurned(hikeType, elapsedTime / 60);

  // Generate automatic session title
  const generateSessionTitle = (activityType: string, date: Date) => {
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
    const activityName = activityType.charAt(0).toUpperCase() + activityType.slice(1);
    return `${activityName} - ${dateStr} at ${timeStr}`;
  };

  // Update session title when activity type changes (only if not custom)
  useEffect(() => {
    if (!customTitle && startTime) {
      setSessionTitle(generateSessionTitle(hikeType, startTime));
    }
  }, [hikeType, startTime, customTitle]);

  // Mutations
  const createSessionMutation = useMutation({
    mutationFn: (data: InsertHikeSession) => apiRequest("/api/hikes", "POST", data),
    onSuccess: (session) => {
      setHikeSession(session);
      toast({
        title: "Session Started",
        description: "Your tracking session has begun!",
      });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<any> }) => 
      apiRequest(`/api/hikes/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hikes"] });
      toast({
        title: "Session Saved",
        description: "Your hike has been saved successfully!",
      });
    },
  });

  const addTrackingPointMutation = useMutation({
    mutationFn: (data: InsertHikeTrackingPoint) => 
      apiRequest(`/api/hikes/${hikeSession?.id}/tracking`, "POST", data),
  });

  const addWaypointMutation = useMutation({
    mutationFn: (data: InsertHikeWaypoint) => 
      apiRequest(`/api/hikes/${hikeSession?.id}/waypoints`, "POST", data),
  });

  // Check location permissions on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      // Try to get permission status (not supported in all browsers)
      if (navigator.permissions?.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          setLocationPermission(result.state);
        }).catch(() => {
          // Fallback: Try to get location to check if it works
          navigator.geolocation.getCurrentPosition(
            () => setLocationPermission("granted"),
            () => setLocationPermission("prompt"),
            { timeout: 1000 }
          );
        });
      } else {
        // Browser doesn't support permissions API, set to prompt
        setLocationPermission("prompt");
      }
    } else {
      setLocationPermission("denied");
    }
  }, []);

  // Timer for elapsed time
  useEffect(() => {
    if (isTracking && !isPaused && startTime) {
      intervalId.current = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    } else {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [isTracking, isPaused, startTime]);

  const requestLocationPermission = async () => {
    try {
      toast({
        title: "Requesting Location Access",
        description: "Please allow location access when prompted...",
      });
      
      // First check if geolocation is available
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser.");
      }
      
      const position = await getCurrentLocation();
      setCurrentLocation(position);
      setLocationPermission("granted");
      toast({
        title: "Location Access Granted",
        description: "GPS tracking is now available!",
      });
    } catch (error: any) {
      // Location error handled in UI feedback
      let errorMessage = "Please enable location services to track your hike.";
      let detailedInstructions = "";
      
      if (error.code === 1 || error.message?.includes('denied')) { // PERMISSION_DENIED
        errorMessage = "Location access was denied. Please enable location in your browser settings:";
        detailedInstructions = "1. Click the location icon in your browser's address bar\n2. Select 'Allow' for location access\n3. Refresh this page if needed\n4. Try again";
      } else if (error.code === 2) { // POSITION_UNAVAILABLE
        errorMessage = "Location information is unavailable. Please check your GPS/network connection.";
        detailedInstructions = "Make sure GPS is enabled on your device and you have a strong signal.";
      } else if (error.code === 3) { // TIMEOUT
        errorMessage = "Location request timed out. Please try again with better GPS signal.";
        detailedInstructions = "Move to an area with better GPS reception and try again.";
      }
      
      toast({
        title: "Location Access Issue",
        description: errorMessage + (detailedInstructions ? "\n\n" + detailedInstructions : ""),
        variant: "destructive",
      });
      setLocationPermission("denied");
    }
  };

  const startTracking = async () => {
    if (locationPermission !== "granted") {
      await requestLocationPermission();
      return;
    }

    try {
      const position = await getCurrentLocation();
      setCurrentLocation(position);
      
      const now = new Date();
      setStartTime(now);
      setElapsedTime(0);
      
      // Generate automatic title if not custom
      let title = sessionTitle;
      if (!customTitle || !sessionTitle.trim()) {
        title = generateSessionTitle(hikeType, now);
        setSessionTitle(title);
      }
      
      // Create session in database
      createSessionMutation.mutate({
        userId: "1", // Demo user - string format
        title: title,
        activityType: hikeType,
        startTime: now.toISOString(),
        status: "active",
      });

      // Start location tracking
      watchId.current = watchLocation((position) => {
        if (!isPaused) {
          const newPoint: TrackingPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || undefined,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || undefined,
            timestamp: new Date(),
          };
          
          setTrackingPoints(prev => [...prev, newPoint]);
          setCurrentLocation(position);

          // Add to database if session exists
          if (hikeSession) {
            addTrackingPointMutation.mutate({
              hikeSessionId: hikeSession.id,
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              altitude: position.coords.altitude?.toString(),
              accuracy: position.coords.accuracy?.toString(),
              speed: position.coords.speed?.toString(),
              timestamp: Date.now(), // Unix timestamp as number
            });
          }
        }
      });

      setIsTracking(true);
      setIsPaused(false);
      
    } catch (error) {
      toast({
        title: "Failed to Start Tracking",
        description: "Could not access your location. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const pauseTracking = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Tracking Resumed" : "Tracking Paused",
      description: isPaused ? "Location tracking has resumed." : "Location tracking is paused.",
    });
  };

  const stopTracking = () => {
    if (watchId.current) {
      stopWatchingLocation(watchId.current);
      watchId.current = null;
    }

    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }

    // Update session with final stats
    if (hikeSession) {
      updateSessionMutation.mutate({
        id: hikeSession.id,
        data: {
          endTime: new Date().toISOString(),
          totalDistance: totalDistance.toString(),
          totalDuration: Math.floor(elapsedTime / 60),
          averagePace: averagePace.toString(),
          maxSpeed: currentSpeed.toString(),
          caloriesBurned: estimatedCalories,
          status: "completed",
        },
      });
    }

    setIsTracking(false);
    setIsPaused(false);
    setElapsedTime(0);
    setStartTime(null);
    setTrackingPoints([]);
    setWaypoints([]);
    setHikeSession(null);
    setSessionTitle("");
  };

  const addWaypoint = () => {
    if (!currentLocation || !hikeSession) return;

    const name = prompt("Enter waypoint name (e.g., 'Summit', 'Rest Stop'):");
    if (!name) return;

    const description = prompt("Enter waypoint description (optional):");

    const waypoint: Waypoint = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      name,
      description: description || undefined,
      timestamp: new Date(),
    };

    setWaypoints(prev => [...prev, waypoint]);

    // Save to database
    addWaypointMutation.mutate({
      hikeSessionId: hikeSession.id,
      latitude: currentLocation.coords.latitude.toString(),
      longitude: currentLocation.coords.longitude.toString(),
      lat: currentLocation.coords.latitude,
      lng: currentLocation.coords.longitude,
      name,
      description,
    });

    toast({
      title: "Waypoint Added",
      description: `"${name}" has been marked on your route.`,
    });
  };

  if (locationPermission === "denied" || locationPermission === "prompt") {
    return (
      <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-gray-900">
            Enable Location Access
          </CardTitle>
          <CardDescription className="text-gray-600">
            {locationPermission === "denied" 
              ? "Location was blocked. Please enable it in your browser settings to track your activity."
              : "Allow location access to track your route, distance, and pace during activities."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {locationPermission === "denied" && (
            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>Click the location icon (🔒) in your browser's address bar</p>
              <p>Select "Allow" and refresh the page</p>
            </div>
          )}
          
          <Button 
            onClick={requestLocationPermission} 
            className="w-full" 
            size="lg"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {locationPermission === "denied" ? "Try Again" : "Enable Location"}
          </Button>
          
          <p className="text-xs text-center text-gray-400">
            Your location stays private and is only used for tracking
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Setup */}
      {!isTracking && (
        <Card className="bg-white backdrop-blur-sm border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Start New Session</CardTitle>
            <CardDescription className="text-gray-600">
              Configure your tracking session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-900">Session Title</Label>
              <div className="flex gap-2">
                <Input
                  id="title"
                  value={sessionTitle}
                  onChange={(e) => {
                    setSessionTitle(e.target.value);
                    setCustomTitle(true);
                  }}
                  placeholder={generateSessionTitle(hikeType, new Date())}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const autoTitle = generateSessionTitle(hikeType, new Date());
                    setSessionTitle(autoTitle);
                    setCustomTitle(false);
                  }}
                  className="px-3"
                  title="Use automatic title"
                >
                  Auto
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Leave empty to auto-generate: "{generateSessionTitle(hikeType, new Date())}"
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-900">Activity Type</Label>
              <Select value={hikeType} onValueChange={(value: any) => setHikeType(value)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walk">Walk</SelectItem>
                  <SelectItem value="hike">Hike</SelectItem>
                  <SelectItem value="run">Run</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={startTracking} 
              className="w-full" 
              size="lg"
              disabled={createSessionMutation.isPending}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Tracking
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Session */}
      {isTracking && (
        <>
          {/* Real-time Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{formatDuration(Math.floor(elapsedTime / 60))}</div>
                <div className="text-sm text-gray-600 font-medium">Duration</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{formatDistance(totalDistance)}</div>
                <div className="text-sm text-gray-600 font-medium">Distance</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {averagePace > 0 ? formatPace(averagePace) : "--"}
                </div>
                <div className="text-sm text-gray-600 font-medium">Avg Pace</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{estimatedCalories}</div>
                <div className="text-sm text-gray-600 font-medium">Calories</div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={pauseTracking} 
                  variant={isPaused ? "default" : "secondary"}
                  className="flex-1"
                >
                  {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                  {isPaused ? "Resume" : "Pause"}
                </Button>
                
                <Button onClick={addWaypoint} variant="outline" className="flex-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  Add Waypoint
                </Button>
                
                <Button onClick={stopTracking} variant="destructive" className="flex-1">
                  <Square className="w-4 h-4 mr-2" />
                  Stop & Save
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-gray-900 pr-2">{sessionTitle}</CardTitle>
                  <CardDescription className="text-gray-700">
                    <Badge variant="secondary" className="mr-2">
                      {hikeType.charAt(0).toUpperCase() + hikeType.slice(1)}
                    </Badge>
                    {isPaused && <Badge variant="destructive">Paused</Badge>}
                    {!isPaused && <Badge variant="default" className="bg-green-600">Active</Badge>}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newTitle = prompt("Edit session title:", sessionTitle);
                    if (newTitle && newTitle.trim()) {
                      setSessionTitle(newTitle.trim());
                      setCustomTitle(true);
                    }
                  }}
                  className="text-gray-600 hover:text-gray-900"
                  title="Edit session title"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-700">
                <div>Tracking Points: {trackingPoints.length}</div>
                <div>Waypoints: {waypoints.length}</div>
                {currentLocation && (
                  <div className="text-xs">
                    Current: {currentLocation.coords.latitude.toFixed(6)}, {currentLocation.coords.longitude.toFixed(6)}
                    {currentLocation.coords.accuracy && ` (±${Math.round(currentLocation.coords.accuracy)}m)`}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}