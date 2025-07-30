import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { Heart, Clock, Star, Settings, User, ArrowLeft, Navigation, MapPin, Target, Plus, Calendar, CheckCircle, TrendingUp, Trophy, ChevronDown, ChevronRight, BarChart3, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Recipe, Activity, MoodLog, SleepLog, Vital } from "@shared/schema";
import BotanicalDecorations from "@/components/botanical-decorations";
import { Progress } from "@/components/ui/progress";
import { HikeTracker } from "@/components/HikeTracker";
import { MapTracker } from "@/components/MapTracker";
import { HikeHistory } from "@/components/HikeHistory";
import { HikeStats } from "@/components/HikeStats";
import AchievementBadges from "@/components/AchievementBadges";
import ProgressChart from "@/components/progress-chart";
import WellnessGoals from "@/components/wellness-goals";


export default function Profile() {
  const [activeTab, setActiveTab] = useState("favorites");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // User data - in real app would come from auth context
  const user = {
    id: 1,
    name: "Wellness User",
    email: "user@example.com",
    joinDate: "2024-01-01",
    avatar: null,
    streak: 7,
    totalActivities: 42,
  };

  // Fetch user favorites
  const { data: favoriteRecipes = [] } = useQuery({
    queryKey: ["favorites", user.id, "recipe"],
    queryFn: async () => {
      const response = await fetch(`/api/favorites/${user.id}?type=recipe`);
      return response.json();
    },
  });

  const { data: favoriteActivities = [] } = useQuery({
    queryKey: ["favorites", user.id, "activity"],
    queryFn: async () => {
      const response = await fetch(`/api/favorites/${user.id}?type=activity`);
      return response.json();
    },
  });

  const { data: recipes = [] } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  // Filter recipes and activities to show only favorited ones
  const favoriteRecipeDetails = recipes.filter((recipe: Recipe) => 
    favoriteRecipes.some((fav: any) => fav.itemId === recipe.id)
  );

  const favoriteActivityDetails = activities.filter((activity: Activity) => 
    favoriteActivities.some((fav: any) => fav.itemId === activity.id)
  );

  // Progress data queries
  const { data: moodLogs } = useQuery<MoodLog[]>({
    queryKey: ["/api/mood", user.id]
  });

  const { data: sleepLogs } = useQuery<SleepLog[]>({
    queryKey: ["/api/sleep", user.id]
  });

  const { data: vitals } = useQuery<Vital[]>({
    queryKey: ["/api/vitals", user.id]
  });

  // Progress insights generation
  const generateInsights = () => {
    const insights = [];
    
    // Mock data for demonstration
    const moodSleepData = [
      { label: "Mon", value: 3.8 },
      { label: "Tue", value: 4.0 },
      { label: "Wed", value: 3.3 },
      { label: "Thu", value: 3.9 },
      { label: "Fri", value: 4.1 },
      { label: "Sat", value: 4.3 },
      { label: "Sun", value: 3.9 }
    ];
    
    const moodAverage = moodSleepData.reduce((sum, day) => sum + day.value, 0) / moodSleepData.length;
    const recentMoodDays = moodSleepData.slice(-3);
    const earlierMoodDays = moodSleepData.slice(0, 3);
    const recentMoodAvg = recentMoodDays.reduce((sum, day) => sum + day.value, 0) / recentMoodDays.length;
    const earlierMoodAvg = earlierMoodDays.reduce((sum, day) => sum + day.value, 0) / earlierMoodDays.length;
    const moodTrend = recentMoodAvg - earlierMoodAvg;

    if (moodTrend > 0.3) {
      insights.push({
        type: "achievement",
        icon: <Trophy className="h-5 w-5" />,
        title: "Mood Improvement!",
        description: `Your mood has been trending upward this week with an average of ${moodAverage.toFixed(1)}/5. Keep up the positive momentum!`,
        color: "green"
      });
    } else if (moodTrend < -0.3) {
      insights.push({
        type: "recommendation",
        icon: <Lightbulb className="h-5 w-5" />,
        title: "Mood Support",
        description: `Your mood has dipped recently. Consider trying some breathing exercises or meditation to help lift your spirits.`,
        color: "blue"
      });
    }

    return insights;
  };

  const insights = generateInsights();



  const toggleFavorite = useMutation({
    mutationFn: async ({ type, id, isFavorite }: { type: 'recipe' | 'activity', id: number, isFavorite: boolean }) => {
      // In real app, this would update user preferences in database
      console.log(`${isFavorite ? 'Removing' : 'Adding'} ${type} ${id} ${isFavorite ? 'from' : 'to'} favorites`);
      return { success: true };
    },
    onSuccess: (_, { type, id, isFavorite }) => {
      toast({
        title: `${isFavorite ? 'Removed from' : 'Added to'} favorites`,
        description: `${type} has been ${isFavorite ? 'removed from' : 'added to'} your favorites`
      });
    }
  });

  const getDaysUsed = () => {
    const joinDate = new Date(user.joinDate);
    const today = new Date();
    return Math.floor((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: `url('/images/tropical-day-coast.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center',
           imageRendering: 'auto'
         }}>
      {/* Clear overlay for contrast without blur */}
      <div className="absolute inset-0 bg-white/30"></div>
      <div className="relative min-h-screen">
      <BotanicalDecorations variant="page" elements={['wave']} />
      
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back to Dashboard Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="bg-white/90 hover:bg-white border-gray-300 text-gray-900 shadow-lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          {/* Profile Header */}
          <Card className="mb-6 bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="text-xl bg-emerald-100 text-emerald-700">
                    WU
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900">Wellness User</h1>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  📅 {user.streak} day streak
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  ⭐ {user.totalActivities} activities
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  Day {getDaysUsed()}
                </Badge>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="self-start"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </Button>
            </CardHeader>
          </Card>

          {/* Edit Profile Form */}
          {isEditingProfile && (
            <Card className="mb-6 bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your wellness journey..."
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fitness Level
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Goals
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="weight-loss">Weight Loss</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="endurance">Endurance</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="wellness">Overall Wellness</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Profile Updated",
                        description: "Your profile has been successfully updated."
                      });
                      setIsEditingProfile(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Section - Collapsible */}
          <Collapsible open={progressOpen} onOpenChange={setProgressOpen}>
            <Card className="mb-6 bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Progress & Analytics
                    </CardTitle>
                    {progressOpen ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Track your wellness journey with detailed analytics</p>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {/* Period Selection */}
                  <div className="flex gap-2 mb-6">
                    {["week", "month", "3months"].map((period) => (
                      <Button
                        key={period}
                        variant={selectedPeriod === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                        className="text-xs"
                      >
                        {period === "3months" ? "3 Months" : period.charAt(0).toUpperCase() + period.slice(1)}
                      </Button>
                    ))}
                  </div>

                  {/* Progress Charts */}
                  <div className="space-y-4 mb-6">
                    <div className="w-full overflow-hidden">
                      <ProgressChart
                        data={[
                          { label: "Mon", value: 68 },
                          { label: "Tue", value: 72 },
                          { label: "Wed", value: 70 },
                          { label: "Thu", value: 69 },
                          { label: "Fri", value: 71 },
                          { label: "Sat", value: 67 },
                          { label: "Sun", value: 70 }
                        ]}
                        title="Heart Rate Trends"
                        color="blue"
                      />
                    </div>

                    <div className="w-full overflow-hidden">
                      <ProgressChart
                        data={[
                          { label: "Mon", value: 3.8 },
                          { label: "Tue", value: 4.0 },
                          { label: "Wed", value: 3.3 },
                          { label: "Thu", value: 3.9 },
                          { label: "Fri", value: 4.1 },
                          { label: "Sat", value: 4.3 },
                          { label: "Sun", value: 3.9 }
                        ]}
                        title="Mood & Sleep Quality"
                        color="green"
                        maxScale={5}
                      />
                    </div>
                  </div>

                  {/* Progress Insights */}
                  {insights.length > 0 && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-base text-gray-900">Weekly Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {insights.map((insight, index) => (
                            <div key={index} className={`flex items-start p-4 bg-${insight.color}-50 rounded-lg border border-${insight.color}-200`}>
                              <div className={`w-8 h-8 bg-${insight.color}-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 text-${insight.color}-600`}>
                                {insight.icon}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Wellness Goals */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-gray-900 flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-600" />
                        Wellness Goals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WellnessGoals userId={user.id} />
                    </CardContent>
                  </Card>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Profile Tabs */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Button
                variant={activeTab === "favorites" ? "default" : "outline"}
                onClick={() => setActiveTab("favorites")}
                className="text-sm py-2 px-3"
              >
                <Heart className="h-4 w-4 mr-1" />
                Favorites
              </Button>
              <Button
                variant={activeTab === "gps" ? "default" : "outline"}
                onClick={() => setActiveTab("gps")}
                className="text-sm py-2 px-3"
              >
                <img 
                  src="/assets/characters/kai-hiker.png" 
                  alt="Hiker icon" 
                  className="w-4 h-4 mr-1 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/characters/kai.png";
                  }}
                />
                Walks & Hikes
              </Button>
              <Button
                variant={activeTab === "progress" ? "default" : "outline"}
                onClick={() => setActiveTab("progress")}
                className="text-sm py-2 px-3"
              >
                <Star className="h-4 w-4 mr-1" />
                Progress
              </Button>
              <Button
                variant={activeTab === "goals" ? "default" : "outline"}
                onClick={() => setActiveTab("goals")}
                className="text-sm py-2 px-3"
              >
                <Target className="h-4 w-4 mr-1" />
                Goals
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Favorite Recipes */}
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Heart className="h-5 w-5 text-red-500" />
                      Favorite Recipes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {favoriteRecipes.length > 0 ? (
                      <div className="space-y-3">
                        {favoriteRecipes.map((recipe: any) => (
                          <div key={recipe.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{recipe.title}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs flex-shrink-0">
                                  {recipe.category}
                                </Badge>
                                <span className="text-sm text-gray-500 flex items-center flex-shrink-0">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {recipe.prepTime}m
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0 ml-2"
                              onClick={() => toggleFavorite.mutate({ 
                                type: 'recipe', 
                                id: recipe.id, 
                                isFavorite: true 
                              })}
                            >
                              <Heart className="h-4 w-4 text-red-500 fill-current" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-600">
                        <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-900">No favorite recipes yet</p>
                        <p className="text-sm text-gray-600">Heart recipes you love to save them here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Favorite Activities */}
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Favorite Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {favoriteActivities.length > 0 ? (
                      <div className="space-y-3">
                        {favoriteActivities.map((activity: any) => (
                          <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs flex-shrink-0">
                                  {activity.category}
                                </Badge>
                                <span className="text-sm text-gray-500 flex items-center flex-shrink-0">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {activity.duration}m
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0 ml-2"
                              onClick={() => toggleFavorite.mutate({ 
                                type: 'activity', 
                                id: activity.id, 
                                isFavorite: true 
                              })}
                            >
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-600">
                        <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-900">No favorite activities yet</p>
                        <p className="text-sm text-gray-600">Star activities you enjoy to save them here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* GPS History Tab */}
            <TabsContent value="gps" className="space-y-6">
              <div className="grid gap-6">
                {/* Activity History Card */}
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <img 
                        src="/assets/characters/kai-hiker.png" 
                        alt="Hiker icon" 
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/characters/kai.png";
                        }}
                      />
                      Activity History
                    </CardTitle>
                    <p className="text-sm text-gray-600">View your walking and hiking adventures</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center text-gray-600 py-8">
                        <img 
                          src="/assets/characters/kai-hiker.png" 
                          alt="Hiker" 
                          className="w-12 h-12 mx-auto mb-4 opacity-50 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/characters/kai.png";
                          }}
                        />
                        <p className="text-gray-900 font-medium">No activities yet</p>
                        <p className="text-sm text-gray-600 mb-4">Start tracking your walks and hikes</p>
                        <div className="text-xs text-gray-500">
                          <p>• Find GPS tracker in Dashboard or Move section</p>
                          <p>• Track walks, hikes, runs, and bike rides</p>
                          <p>• View your history and stats here</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Walks & Hikes Stats */}
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <img 
                        src="/assets/characters/kai-hiker.png" 
                        alt="Hiker icon" 
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/characters/kai.png";
                        }}
                      />
                      Activity Stats
                    </CardTitle>
                    <p className="text-sm text-gray-600">Track your progress and achievements</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">0</div>
                        <div className="text-xs text-gray-600">Total Walks</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-xs text-gray-600">Total Hikes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">0km</div>
                        <div className="text-xs text-gray-600">Distance</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">0</div>
                        <div className="text-xs text-gray-600">Calories</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <AchievementBadges />
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              {/* Goals Overview Cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
                    <div className="text-sm text-gray-600">Active Goals</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">1</div>
                    <div className="text-sm text-gray-600">Completed This Month</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">67%</div>
                    <div className="text-sm text-gray-600">Average Progress</div>
                  </CardContent>
                </Card>
              </div>

              {/* Goals List */}
              <div className="space-y-4">
                {/* Daily Check-ins Goal */}
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 mb-2 flex items-center gap-2">
                          <span className="text-xl">🌟</span>
                          Daily Check-ins for 30 Days
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-3">Complete daily wellness check-ins consistently</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                            wellness
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due Feb 25, 2025
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          12 / 30 days
                        </div>
                        <div className="text-xs text-gray-500">
                          40% complete
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <Progress value={40} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Started Jan 25, 2025</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Breathing Exercises Goal */}
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 mb-2 flex items-center gap-2">
                          <span className="text-xl">🫁</span>
                          Breathing Exercises Weekly
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-3">Practice breathing exercises 5 times per week</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            oxygen
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due Mar 1, 2025
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          3 / 5 sessions/week
                        </div>
                        <div className="text-xs text-gray-500">
                          60% complete
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <Progress value={60} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Started Jan 20, 2025</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Morning Movement Goal */}
                <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 mb-2 flex items-center gap-2">
                          <span className="text-xl">🏃</span>
                          Morning Movement Routine
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-3">Complete morning exercises 6 days a week</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            move
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due Feb 15, 2025
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          4 / 6 days/week
                        </div>
                        <div className="text-xs text-gray-500">
                          67% complete
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <Progress value={67} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Started Jan 15, 2025</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      </div>
    </div>
  );
}