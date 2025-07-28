// Utility functions for hiking/walking tracking

/**
 * Calculate the distance between two GPS coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in meters
}

/**
 * Calculate total distance from an array of GPS points
 * @param points Array of tracking points with latitude and longitude
 * @returns Total distance in meters
 */
export function calculateTotalDistance(points: Array<{latitude: number; longitude: number}>): number {
  if (points.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    totalDistance += haversineDistance(
      points[i-1].latitude,
      points[i-1].longitude,
      points[i].latitude,
      points[i].longitude
    );
  }
  return totalDistance;
}

/**
 * Calculate pace in minutes per kilometer
 * @param distanceMeters Distance in meters
 * @param durationMinutes Duration in minutes
 * @returns Pace in minutes per kilometer
 */
export function calculatePace(distanceMeters: number, durationMinutes: number): number {
  if (distanceMeters === 0) return 0;
  const distanceKm = distanceMeters / 1000;
  return durationMinutes / distanceKm;
}

/**
 * Calculate speed in kilometers per hour
 * @param distanceMeters Distance in meters
 * @param durationMinutes Duration in minutes
 * @returns Speed in km/h
 */
export function calculateSpeed(distanceMeters: number, durationMinutes: number): number {
  if (durationMinutes === 0) return 0;
  const distanceKm = distanceMeters / 1000;
  const durationHours = durationMinutes / 60;
  return distanceKm / durationHours;
}

/**
 * Format distance for display
 * @param meters Distance in meters
 * @returns Formatted string (e.g., "1.2 km" or "450 m")
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Format duration for display
 * @param minutes Duration in minutes
 * @returns Formatted string (e.g., "1h 23m" or "45m")
 */
export function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

/**
 * Format pace for display with bounds checking
 * @param minutesPerKm Pace in minutes per kilometer
 * @returns Formatted string (e.g., "5:30/km")
 */
export function formatPace(minutesPerKm: number): string {
  // Handle edge cases and unrealistic values
  if (!minutesPerKm || minutesPerKm <= 0) return "--:--/km";
  if (minutesPerKm > 60) return ">60:00/km"; // Slower than 1 hour per km
  if (minutesPerKm < 2) return "<2:00/km"; // Faster than 2 min/km (world record territory)
  
  const minutes = Math.floor(minutesPerKm);
  const seconds = Math.round((minutesPerKm - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
}

/**
 * Estimate calories burned based on activity type, duration, and user weight
 * @param activityType Type of activity (hike, walk, run, bike)
 * @param durationMinutes Duration in minutes
 * @param weightKg User weight in kilograms (default: 70kg)
 * @returns Estimated calories burned
 */
export function estimateCaloriesBurned(
  activityType: string, 
  durationMinutes: number, 
  weightKg: number = 70
): number {
  // MET (Metabolic Equivalent of Task) values for different activities
  const metValues: Record<string, number> = {
    walk: 3.5,      // Casual walking
    hike: 6.0,      // Hiking with backpack
    run: 8.0,       // Running 8 km/h
    bike: 7.5       // Cycling moderate effort
  };
  
  const metValue = metValues[activityType] || 4.0; // Default moderate activity
  
  // Calories = MET_value * weight_kg * (duration_minutes / 60)
  const calories = metValue * weightKg * (durationMinutes / 60);
  
  return Math.round(calories);
}

/**
 * Get current location using browser geolocation API
 * @returns Promise with current position
 */
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    // Check if we're in a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      console.warn('Geolocation requires HTTPS in production environments');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('GPS Location obtained:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp)
        });
        resolve(position);
      },
      (error) => {
        console.error('GPS Error:', error);
        let errorMessage = 'Location access failed';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your GPS/WiFi connection.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 20000, // Increased timeout for deployment environments
        maximumAge: 60000 // Allow slightly older cached position for reliability
      }
    );
  });
}

/**
 * Watch location changes for real-time tracking
 * @param callback Function to call when position changes
 * @returns Watch ID that can be used to stop watching
 */
export function watchLocation(
  callback: (position: GeolocationPosition) => void
): number {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser');
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      console.log('GPS Watch Update:', {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        heading: position.coords.heading
      });
      callback(position);
    },
    (error) => {
      console.error('Location tracking error:', error);
      // More detailed error logging
      if (error.code === 1) console.error('GPS permission denied - check browser location settings');
      if (error.code === 2) console.error('GPS position unavailable - check GPS/WiFi connection');
      if (error.code === 3) console.error('GPS timeout - location took too long to acquire');
    },
    {
      enableHighAccuracy: true,
      timeout: 15000, // Longer timeout for deployment environments
      maximumAge: 10000 // Allow slightly cached position for smoother tracking
    }
  );
}

/**
 * Stop watching location changes
 * @param watchId The watch ID returned by watchLocation
 */
export function stopWatchingLocation(watchId: number): void {
  navigator.geolocation.clearWatch(watchId);
}