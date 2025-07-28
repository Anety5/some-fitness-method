import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistance, formatDuration } from "../../../shared/hiking-utils";

type HikeSummaryProps = {
  hike: {
    id: string;
    title?: string;
    startTime: string;
    duration: number;
    distance: number;
    elevationGain: number;
    calories: number;
    route: [number, number][]; // lat/lng
    elevation: number[];       // elevation profile
  };
};

export default function HikeSummary({ hike }: HikeSummaryProps) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    const date = new Date(hike.startTime).toLocaleDateString();
    setTitle(hike.title || `Hike on ${date}`);
  }, [hike]);

  return (
    <Card className="max-w-full bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-white break-words">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-white">
          <div className="break-words">⏱️ Duration: {formatDuration(hike.duration)}</div>
          <div className="break-words">📏 Distance: {formatDistance(hike.distance)}</div>
          <div className="break-words">⛰️ Elevation Gain: {hike.elevationGain} m</div>
          <div className="break-words">🔥 Calories: {Math.round(hike.calories)} kcal</div>
        </div>

        {/* Route Information */}
        {hike.route && hike.route.length > 0 && (
          <div className="bg-white/10 rounded-lg p-3 sm:p-4 max-w-full overflow-hidden">
            <h3 className="font-medium mb-2 text-white">Route Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-white/80">
              <div className="break-words">📍 Start: {hike.route[0][0].toFixed(4)}, {hike.route[0][1].toFixed(4)}</div>
              <div className="break-words">🏁 End: {hike.route[hike.route.length - 1][0].toFixed(4)}, {hike.route[hike.route.length - 1][1].toFixed(4)}</div>
              <div className="break-words">📊 Total Points: {hike.route.length}</div>
              <div className="break-words">⏰ Started: {new Date(hike.startTime).toLocaleTimeString()}</div>
            </div>
          </div>
        )}

        {/* Elevation Profile */}
        {hike.elevation && hike.elevation.length > 0 && (
          <div className="bg-white/10 rounded-lg p-3 sm:p-4 max-w-full overflow-hidden">
            <h3 className="font-medium mb-2 text-white">Elevation Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-white/80">
              <div className="break-words">📈 Max: {Math.max(...hike.elevation)} m</div>
              <div className="break-words">📉 Min: {Math.min(...hike.elevation)} m</div>
              <div className="break-words">📊 Points: {hike.elevation.length}</div>
            </div>
            {/* Simple ASCII-style elevation visualization */}
            <div className="mt-2 p-2 bg-black/20 rounded font-mono text-xs text-white/70 overflow-x-auto">
              <div className="whitespace-nowrap">
                {hike.elevation.slice(0, 20).map((elev, i) => (
                  <span key={i} className="inline-block mr-1">
                    {Math.round(elev / 100) || '·'}
                  </span>
                ))}
                {hike.elevation.length > 20 && '...'}
              </div>
            </div>
          </div>
        )}

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/5 rounded p-3 text-center">
            <div className="text-white/70">Start Time</div>
            <div className="text-white font-medium">
              {new Date(hike.startTime).toLocaleString()}
            </div>
          </div>
          <div className="bg-white/5 rounded p-3 text-center">
            <div className="text-white/70">Activity ID</div>
            <div className="text-white font-medium text-xs">
              {hike.id.slice(0, 8)}...
            </div>
          </div>
          <div className="bg-white/5 rounded p-3 text-center">
            <div className="text-white/70">Data Points</div>
            <div className="text-white font-medium">
              {(hike.route?.length || 0) + (hike.elevation?.length || 0)}
            </div>
          </div>
          <div className="bg-white/5 rounded p-3 text-center">
            <div className="text-white/70">Status</div>
            <div className="text-white font-medium">
              ✅ Complete
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}