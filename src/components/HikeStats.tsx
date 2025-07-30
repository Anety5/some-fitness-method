import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Clock, Zap, TrendingUp, Calendar, Mountain, Target, Award } from "lucide-react";
import { formatDistance, formatDuration } from "@shared/hiking-utils";
import type { HikeSession } from "@shared/schema";

interface HikeStatsProps {
  sessions: HikeSession[];
}

export function HikeStats({ sessions }: HikeStatsProps) {
  // Ensure sessions is always an array and filter out invalid entries
  const safeSessions = Array.isArray(sessions) ? sessions.filter(session => session && session.id) : [];
  
  // Calculate aggregated statistics
  const completedSessions = safeSessions.filter(s => s.status === "completed");
  
  const totalDistance = completedSessions.reduce((sum, session) => {
    return sum + (session.distanceKm || 0);
  }, 0);
  
  const totalDuration = completedSessions.reduce((sum, session) => {
    return sum + (session.totalDuration || 0);
  }, 0);
  
  const totalCalories = completedSessions.reduce((sum, session) => {
    return sum + (session.calories || 0);
  }, 0);
  
  const totalElevation = completedSessions.reduce((sum, session) => {
    return sum + (session.elevationGain ? parseFloat(session.elevationGain) : 0);
  }, 0);

  // Activity type breakdown
  const activityCounts = completedSessions.reduce((counts, session) => {
    counts[session.activityType] = (counts[session.activityType] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Recent activity (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentSessions = completedSessions.filter(session => 
    new Date(session.startTime) >= thirtyDaysAgo
  );

  const recentDistance = recentSessions.reduce((sum, session) => {
    return sum + (session.distanceKm || 0);
  }, 0);

  // Achievements and goals
  const achievements = [
    { 
      name: "First Steps", 
      condition: completedSessions.length >= 1,
      description: "Complete your first tracking session",
      icon: "🚀"
    },
    { 
      name: "Explorer", 
      condition: totalDistance >= 10000, // 10km
      description: "Walk/hike 10km in total",
      icon: "🗺️"
    },
    { 
      name: "Mountain Climber", 
      condition: totalElevation >= 500,
      description: "Gain 500m total elevation",
      icon: "⛰️"
    },
    { 
      name: "Consistent Tracker", 
      condition: completedSessions.length >= 10,
      description: "Complete 10 tracking sessions",
      icon: "📊"
    },
    { 
      name: "Endurance", 
      condition: totalDuration >= 600, // 10 hours
      description: "Track 10 hours of activity",
      icon: "⏱️"
    },
    { 
      name: "Calorie Crusher", 
      condition: totalCalories >= 2000,
      description: "Burn 2000 calories",
      icon: "🔥"
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.condition);
  const nextAchievement = achievements.find(a => !a.condition);

  // Progress towards next distance milestone
  const distanceGoals = [1000, 5000, 10000, 25000, 50000, 100000]; // meters
  const currentGoal = distanceGoals.find(goal => totalDistance < goal) || distanceGoals[distanceGoals.length - 1];
  const previousGoal = distanceGoals[distanceGoals.indexOf(currentGoal) - 1] || 0;
  const goalProgress = totalDistance > 0 ? ((totalDistance - previousGoal) / (currentGoal - previousGoal)) * 100 : 0;

  if (completedSessions.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardContent className="p-12 text-center">
          <TrendingUp className="w-12 h-12 text-white/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No statistics available</h3>
          <p className="text-white/70 mb-4">
            Complete some tracking sessions to see your progress and achievements here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 text-white/70 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{formatDistance(totalDistance)}</div>
            <div className="text-sm text-white/70">Total Distance</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-white/70 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{formatDuration(totalDuration)}</div>
            <div className="text-sm text-white/70">Total Time</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-white/70 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalCalories.toLocaleString()}</div>
            <div className="text-sm text-white/70">Calories Burned</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardContent className="p-6 text-center">
            <Mountain className="w-8 h-8 text-white/70 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {totalElevation > 0 ? `${Math.round(totalElevation)}m` : "—"}
            </div>
            <div className="text-sm text-white/70">Elevation Gained</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity (30 days) */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Last 30 Days
          </CardTitle>
          <CardDescription className="text-white/70">
            Your recent activity summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{recentSessions.length}</div>
              <div className="text-sm text-white/70">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{formatDistance(recentDistance)}</div>
              <div className="text-sm text-white/70">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {recentSessions.length > 0 ? Math.round(recentDistance / recentSessions.length / 1000 * 10) / 10 + "km" : "—"}
              </div>
              <div className="text-sm text-white/70">Avg per Session</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Breakdown */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Activity Types</CardTitle>
          <CardDescription className="text-white/70">
            Breakdown of your activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(activityCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {type === "hike" ? "🥾" : type === "walk" ? "🚶" : type === "run" ? "🏃" : "🚴"}
                  </span>
                  <span className="text-white capitalize">{type}</span>
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white">
                  {count} session{count !== 1 ? 's' : ''}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distance Goal Progress */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Distance Goal
          </CardTitle>
          <CardDescription className="text-white/70">
            Progress towards {formatDistance(currentGoal)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/70">
              <span>{formatDistance(totalDistance)}</span>
              <span>{formatDistance(currentGoal)}</span>
            </div>
            <Progress value={Math.min(goalProgress, 100)} className="bg-white/20" />
            <div className="text-center text-white/70 text-sm">
              {formatDistance(currentGoal - totalDistance)} remaining
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
          <CardDescription className="text-white/70">
            {unlockedAchievements.length} of {achievements.length} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.name}
                className={`p-3 rounded-lg border ${
                  achievement.condition 
                    ? "bg-green-500/20 border-green-500/50" 
                    : "bg-white/5 border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className={`font-medium ${achievement.condition ? "text-green-300" : "text-white/70"}`}>
                      {achievement.name}
                    </div>
                    <div className="text-sm text-white/60">
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.condition && (
                    <Badge className="bg-green-600 text-white border-0">
                      ✓
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {nextAchievement && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="text-sm text-blue-300 font-medium">Next Achievement:</div>
              <div className="text-white">{nextAchievement.name}</div>
              <div className="text-white/70 text-sm">{nextAchievement.description}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}