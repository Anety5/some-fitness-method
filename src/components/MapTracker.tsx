import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Square, MapPin, Navigation, Mountain } from "lucide-react";
import { getCurrentLocation } from "@shared/hiking-utils";

// Define Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

// Haversine distance calculation
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// MET values for different activities
const MET_VALUES = {
  walk: 3.5,
  hike: 6.0,
  run: 9.8,
  bike: 7.5
};

const ACTIVITY_OPTIONS = [
  { value: 'walk', label: 'Walking', met: 3.5 },
  { value: 'hike', label: 'Hiking', met: 6.0 },
  { value: 'run', label: 'Running', met: 9.8 },
  { value: 'bike', label: 'Cycling', met: 7.5 }
];

interface TrackingPoint {
  lat: number;
  lng: number;
  altitude?: number;
  timestamp: number;
}

interface MapTrackerProps {
  onSessionStart?: (sessionId: string) => void;
  onSessionEnd?: (data: any) => void;
  activityType?: "hike" | "walk" | "run" | "bike";
}

export function MapTracker({ onSessionStart, onSessionEnd, activityType = "walk" }: MapTrackerProps) {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [route, setRoute] = useState<TrackingPoint[]>([]);
  const [totalDistance, setTotalDistance] = useState(0); // In km
  const [totalElevation, setTotalElevation] = useState(0); // In meters
  const [previousElevation, setPreviousElevation] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number; altitude?: number; timestamp?: number} | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [weight, setWeight] = useState(154); // Default weight 154 lbs ≈ 70 kg
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [selectedActivity, setSelectedActivity] = useState('hike');

  // Load Leaflet CSS and JS
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Load CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }

        // Load JS
        if (!window.L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = () => {
              setLeafletLoaded(true);
              resolve(window.L);
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
        } else {
          setLeafletLoaded(true);
        }
      } catch (error) {
        // Leaflet loading handled gracefully
      }
    };

    loadLeaflet().catch(error => {
      // Leaflet failed to load - continuing without map visualization
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return;

    const map = window.L.map(mapRef.current, {
      center: [34.0522, -118.2437], // Default to LA
      zoom: 15,
      zoomControl: true,
      attributionControl: false, // Remove Leaflet attribution/logo
    });

    // Add tile layer without attribution
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '' // Remove attribution text
    }).addTo(map);

    mapInstanceRef.current = map;

    // Get current location and center map
    getCurrentLocation()
      .then((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map.setView([lat, lng], 15);
        
        // Add current location marker
        const marker = window.L.marker([lat, lng])
          .addTo(map)
          .bindPopup('Your current location');
        currentMarkerRef.current = marker;
        
        setCurrentLocation({ lat, lng, timestamp: Date.now() });
      })
      .catch((error) => {
        // Location access handled in UI
      });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Update route visualization and distance calculation
  useEffect(() => {
    if (!mapInstanceRef.current || route.length < 2) return;

    // Remove existing route layer
    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
    }

    // Create new route polyline using lat/lng coordinates
    const latLngs = route.map(point => [point.lat, point.lng]);
    const polyline = window.L.polyline(latLngs, {
      color: 'blue',
      weight: 4,
      opacity: 0.8
    }).addTo(mapInstanceRef.current);

    routeLayerRef.current = polyline;
  }, [route]);

  const startTracking = async () => {
    if (!navigator.geolocation) {
      // Geolocation not supported - handled in UI
      return;
    }

    // Check secure context for deployed apps
    if (!window.isSecureContext) {
      console.warn('Location access requires HTTPS in production. Current protocol:', window.location.protocol);
    }

    // First, try to get initial position
    try {
      const initialPosition = await getCurrentLocation();
      console.log('Initial GPS position acquired:', {
        lat: initialPosition.coords.latitude,
        lng: initialPosition.coords.longitude,
        accuracy: initialPosition.coords.accuracy
      });

      // Center map on initial position
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([
          initialPosition.coords.latitude,
          initialPosition.coords.longitude
        ], 16);
      }
    } catch (error) {
      console.error('Failed to get initial GPS position:', error);
      // Continue with tracking even if initial position fails
    }

    // Reset tracking state
    setRoute([]);
    setTotalDistance(0);
    setTotalElevation(0);
    setPreviousElevation(null);
    setStartTime(Date.now());
    setIsTracking(true);
    setIsPaused(false);

    // Start GPS tracking with enhanced error handling
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (isPaused) return; // Skip updates when paused

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const ele = position.coords.altitude; // Can be null if unsupported
        
        console.log('GPS Watch Position Update:', {
          lat, lng, accuracy: position.coords.accuracy, altitude: ele
        });
        
        setRoute(prev => {
          const newPoint: TrackingPoint = {
            lat,
            lng,
            altitude: ele || undefined,
            timestamp: Date.now()
          };
          const newRoute = [...prev, newPoint];
          
          // Calculate distance if we have more than one point
          if (newRoute.length > 1) {
            const prevPoint = newRoute[newRoute.length - 2];
            const distance = haversine(prevPoint.lat, prevPoint.lng, lat, lng);
            
            // Filter GPS noise - ignore unrealistic movements
            const timeDiff = (Date.now() - prevPoint.timestamp) / 1000; // seconds
            const maxSpeed = 30; // 30 m/s = ~108 km/h max reasonable speed
            
            if (timeDiff > 2 && distance / timeDiff < maxSpeed) { // Only add if realistic
              console.log('Adding distance:', distance.toFixed(1), 'm over', timeDiff.toFixed(1), 's');
              setTotalDistance(prevTotal => prevTotal + distance);
            } else if (distance / timeDiff >= maxSpeed) {
              console.warn('GPS noise filtered:', { 
                distance: distance.toFixed(1), 
                time: timeDiff.toFixed(1), 
                speed: (distance/timeDiff).toFixed(1) 
              });
            }
          }
          
          return newRoute;
        });

        // Track elevation gain using previousElevation logic
        if (ele !== null) {
          setPreviousElevation(prevEle => {
            if (prevEle !== null && ele > prevEle) {
              setTotalElevation(prevTotal => prevTotal + (ele - prevEle));
            }
            return ele;
          });
        }

        // Update current location and map view
        setCurrentLocation({ lat, lng, altitude: ele || undefined, timestamp: Date.now() });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng]);
          
          // Update or create current location marker
          if (currentMarkerRef.current) {
            currentMarkerRef.current.setLatLng([lat, lng]);
          } else {
            currentMarkerRef.current = window.L.marker([lat, lng])
              .addTo(mapInstanceRef.current)
              .bindPopup('Current location');
          }
        }
      },
      (error) => {
        console.error('GPS Tracking Error:', error);
        let errorMsg = 'GPS tracking error';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission denied. Please enable location in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'GPS position unavailable. Check GPS/WiFi connection.';
            break;
          case error.TIMEOUT:
            errorMsg = 'GPS timeout. Location taking too long to acquire.';
            break;
        }
        console.error(errorMsg);
        // Continue tracking despite errors - don't stop the session
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000
      }
    );

    watchIdRef.current = watchId;
    onSessionStart?.(`session_${Date.now()}`);
  };

  const pauseTracking = () => {
    setIsPaused(!isPaused);
    // Note: GPS continues tracking but we ignore position updates when paused
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // Calculate final stats
    const durationMinutes = startTime ? (Date.now() - startTime) / 60000 : 0;
    const MET = MET_VALUES[selectedActivity as keyof typeof MET_VALUES] || 6.0;
    const calories = MET * weight * (durationMinutes / 60);

    // Prepare session data matching your model
    const sessionData = {
      userId: "abc123", // Replace with actual user ID
      activityType: selectedActivity,
      startTime: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
      endTime: new Date().toISOString(),
      distanceKm: totalDistance,
      elevationGain: Math.round(totalElevation),
      route: route,
      location: "GPS Tracked Route", 
      calories: Math.round(calories),
      notes: `${selectedActivity.charAt(0).toUpperCase() + selectedActivity.slice(1)} tracked with GPS`
    };

    onSessionEnd?.(sessionData);
    
    alert(`Activity Saved!\nDistance: ${totalDistance.toFixed(2)} km\nElevation: ${Math.round(totalElevation)} m`);

    // Reset state
    setIsTracking(false);
    setIsPaused(false);
    setStartTime(null);
    setRoute([]);
    setTotalDistance(0);
    setTotalElevation(0);
    setPreviousElevation(null);

    // Clear route from map
    if (routeLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
  };

  // Helper function to get weight in kg for calculations
  const getWeightInKg = () => {
    return weightUnit === 'lbs' ? weight * 0.453592 : weight;
  };

  // Calculate real-time calories
  const durationMinutes = startTime ? (Date.now() - startTime) / 60000 : 0;
  const MET = MET_VALUES[selectedActivity as keyof typeof MET_VALUES] || 6.0;
  const calories = isTracking ? Math.round(MET * getWeightInKg() * (durationMinutes / 60)) : 0;

  // Handle weight unit conversion
  const handleWeightUnitChange = (newUnit: 'lbs' | 'kg') => {
    if (newUnit !== weightUnit) {
      if (newUnit === 'kg' && weightUnit === 'lbs') {
        setWeight(Math.round(weight * 0.453592));
      } else if (newUnit === 'lbs' && weightUnit === 'kg') {
        setWeight(Math.round(weight * 2.20462));
      }
      setWeightUnit(newUnit);
    }
  };

  return (
    <div className="space-y-4">
      {/* Compact Stats Header */}
      <div className="grid grid-cols-4 gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-300">
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">
            {Math.floor(durationMinutes)}:{String(Math.floor((durationMinutes % 1) * 60)).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-600">Time</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">{totalDistance.toFixed(2)}</div>
          <div className="text-xs text-gray-600">km</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">{Math.round(totalElevation)}</div>
          <div className="text-xs text-gray-600">elev m</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">{calories}</div>
          <div className="text-xs text-gray-600">kcal</div>
        </div>
      </div>

      <Card className="bg-white/90 backdrop-blur-sm border border-gray-300 shadow-lg">
        <CardContent className="p-4 space-y-4">
        {/* Compact Configuration */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-900 text-xs">Activity</Label>
            <Select value={selectedActivity} onValueChange={setSelectedActivity} disabled={isTracking}>
              <SelectTrigger className="bg-white border border-gray-300 text-gray-900 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-900 text-xs">Weight</Label>
            <div className="flex gap-1">
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                min={weightUnit === 'lbs' ? 66 : 30}
                max={weightUnit === 'lbs' ? 440 : 200}
                disabled={isTracking}
                className="bg-white border border-gray-300 text-gray-900 h-8 text-xs flex-1"
              />
              <Select value={weightUnit} onValueChange={handleWeightUnitChange} disabled={isTracking}>
                <SelectTrigger className="bg-white border border-gray-300 text-gray-900 h-8 w-14 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">lbs</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Compact Map Container */}
        <div className="bg-gray-100 rounded-lg overflow-hidden relative">
          <div 
            ref={mapRef} 
            className="h-48 w-full bg-gray-800"
            style={{ 
              minHeight: '192px',
              touchAction: 'pan-x pan-y'
            }}
          />
          {/* Map Overlay Controls */}
          {isTracking && (
            <div className="absolute top-2 right-2 z-30">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
                  <span className="font-semibold text-gray-800">
                    {isPaused ? 'PAUSED' : 'TRACKING'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* GPS Permission Status */}
        {!currentLocation && !isTracking && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded text-center">
            ⚠️ GPS permission required for tracking. Location will be requested when you start.
          </div>
        )}

        {/* Large Control Buttons */}
        <div className="space-y-2">
          {!isTracking ? (
            <Button onClick={startTracking} className="w-full bg-green-600 hover:bg-green-700 h-12 text-base">
              <Play className="w-5 h-5 mr-2" />
              Start GPS Tracking
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={pauseTracking} 
                variant={isPaused ? "default" : "secondary"}
                className="h-12"
              >
                {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button onClick={stopTracking} variant="destructive" className="h-12">
                <Square className="w-4 h-4 mr-1" />
                Stop & Save
              </Button>
            </div>
          )}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}