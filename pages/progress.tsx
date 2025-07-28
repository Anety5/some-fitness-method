import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProgressChart from "@/components/progress-chart";
import WellnessGoals from "@/components/wellness-goals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Lightbulb, TrendingUp, Trophy, BarChart3, Target, X, ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { MoodLog, SleepLog, Vital } from "@shared/schema";

export default function Progress() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [activeTab, setActiveTab] = useState("analytics");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const userId = 1; // Demo user ID

  const { data: moodLogs } = useQuery<MoodLog[]>({
    queryKey: ["/api/mood", userId]
  });

  const { data: sleepLogs } = useQuery<SleepLog[]>({
    queryKey: ["/api/sleep", userId]
  });

  const { data: vitals } = useQuery<Vital[]>({
    queryKey: ["/api/vitals", userId]
  });

  const periods = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "3months", label: "3 Months" }
  ];

  // Mock data for charts (in real app, this would be processed from actual data)
  const heartRateData = [
    { label: "Mon", value: 68 },
    { label: "Tue", value: 72 },
    { label: "Wed", value: 70 },
    { label: "Thu", value: 69 },
    { label: "Fri", value: 71 },
    { label: "Sat", value: 67 },
    { label: "Sun", value: 70 }
  ];

  const moodSleepData = [
    { label: "Mon", value: 3.8 },
    { label: "Tue", value: 4.0 },
    { label: "Wed", value: 3.3 },
    { label: "Thu", value: 3.9 },
    { label: "Fri", value: 4.1 },
    { label: "Sat", value: 4.3 },
    { label: "Sun", value: 3.9 }
  ];

  // Handle chart click to show detailed data
  const handleChartClick = (metric: string) => {
    setSelectedMetric(metric);
    setShowDetailModal(true);
  };

  // Get detailed data for selected metric
  const getDetailedData = (metric: string) => {
    switch (metric) {
      case "heartRate":
        return {
          title: "Heart Rate Detailed Data",
          data: heartRateData.map((item, index) => ({
            date: `Jan ${15 + index}`,
            value: item.value,
            trend: index > 0 ? (item.value > heartRateData[index - 1].value ? "up" : "down") : "stable",
            activities: ["Morning Walk", "Yoga Session", "Strength Training"][Math.floor(Math.random() * 3)]
          })),
          unit: "BPM"
        };
      case "moodSleep":
        return {
          title: "Mood & Sleep Quality Data",
          data: moodSleepData.map((item, index) => ({
            date: `Jan ${15 + index}`,
            value: item.value,
            trend: index > 0 ? (item.value > moodSleepData[index - 1].value ? "up" : "down") : "stable",
            activities: ["Daily Check-in", "Meditation", "Breathing Exercise"][Math.floor(Math.random() * 3)]
          })),
          unit: "/5"
        };
      default:
        return { title: "", data: [], unit: "" };
    }
  };

  // Generate personalized insights based on user data
  const generateInsights = () => {
    const insights = [];
    
    // Calculate mood trend from data
    const moodAverage = moodSleepData.reduce((sum, day) => sum + day.value, 0) / moodSleepData.length;
    const recentMoodDays = moodSleepData.slice(-3);
    const earlierMoodDays = moodSleepData.slice(0, 3);
    const recentMoodAvg = recentMoodDays.reduce((sum, day) => sum + day.value, 0) / recentMoodDays.length;
    const earlierMoodAvg = earlierMoodDays.reduce((sum, day) => sum + day.value, 0) / earlierMoodDays.length;
    const moodTrend = recentMoodAvg - earlierMoodAvg;

    // Mood trend insight
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

    // Sleep quality insight
    const sleepAverage = moodSleepData.reduce((sum, day) => sum + day.value, 0) / moodSleepData.length;
    if (sleepAverage >= 4.0) {
      insights.push({
        type: "achievement",
        icon: <Trophy className="h-5 w-5" />,
        title: "Excellent Sleep Quality!",
        description: `Your sleep quality average of ${sleepAverage.toFixed(1)}/5 shows you're getting restorative rest. This supports your overall wellness.`,
        color: "green"
      });
    } else if (sleepAverage < 3.0) {
      insights.push({
        type: "recommendation",
        icon: <Lightbulb className="h-5 w-5" />,
        title: "Sleep Optimization",
        description: `Your sleep quality could use improvement (${sleepAverage.toFixed(1)}/5). Try our sleep preparation techniques or establish a consistent bedtime routine.`,
        color: "blue"
      });
    }

    // Heart rate insight based on data
    const heartRateAvg = heartRateData.reduce((sum, day) => sum + day.value, 0) / heartRateData.length;
    if (heartRateAvg <= 70) {
      insights.push({
        type: "progress",
        icon: <TrendingUp className="h-5 w-5" />,
        title: "Heart Health Progress",
        description: `Your average resting heart rate of ${heartRateAvg.toFixed(1)} BPM indicates good cardiovascular fitness. Consistent activity is paying off!`,
        color: "yellow"
      });
    }

    // Consistency insight based on data availability
    if (moodLogs && moodLogs.length >= 5) {
      insights.push({
        type: "achievement",
        icon: <Trophy className="h-5 w-5" />,
        title: "Consistency Achievement!",
        description: `You've been consistently tracking your wellness metrics. This regular monitoring helps identify patterns and progress.`,
        color: "green"
      });
    }

    // Default insights if none generated
    if (insights.length === 0) {
      insights.push({
        type: "recommendation",
        icon: <Lightbulb className="h-5 w-5" />,
        title: "Keep Tracking",
        description: "Continue logging your daily wellness metrics to unlock personalized insights about your health patterns.",
        color: "blue"
      });
    }

    return insights.slice(0, 3); // Limit to 3 insights
  };

  const insights = generateInsights();

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
      
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Progress</h2>
            <p className="text-gray-600 mt-2">
              Track your wellness journey with detailed analytics and insights
            </p>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-16">
              <TabsTrigger value="analytics" className="flex items-center gap-3 h-14 text-lg font-bold text-black data-[state=active]:text-black">
                <BarChart3 className="h-5 w-5" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-3 h-14 text-lg font-bold text-black data-[state=active]:text-black">
                <Target className="h-5 w-5 text-red-600" />
                Goals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-8">
              {/* Time Period Selector */}
              <div className="flex space-x-2">
                {periods.map((period) => (
                  <Button
                    key={period.value}
                    variant={selectedPeriod === period.value ? "default" : "outline"}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={selectedPeriod === period.value 
                      ? "bg-primary text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  >
                    {period.label}
                  </Button>
                ))}
              </div>

          {/* Progress Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="cursor-pointer hover:scale-105 transition-transform" onClick={() => handleChartClick("heartRate")}>
              <ProgressChart
                title="Heart Rate Trends"
                data={heartRateData}
                color="red"
                unit="BPM"
                average={69.5}
              />
              <p className="text-center text-sm text-gray-500 mt-2">Click to view detailed data</p>
            </div>
            
            <div className="cursor-pointer hover:scale-105 transition-transform" onClick={() => handleChartClick("moodSleep")}>
              <ProgressChart
                title="Mood & Sleep Quality"
                data={moodSleepData}
                color="purple"
                unit="/5"
                average={3.9}
                maxScale={5}
              />
              <p className="text-center text-sm text-gray-500 mt-2">Click to view detailed data</p>
            </div>
          </div>

          {/* Weekly Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="h-8 w-8" />
                  <span className="text-sm opacity-90">This Week</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium opacity-90">Activities Completed</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">12</span>
                    <span className="text-sm opacity-75 ml-1">/ 15 planned</span>
                  </div>
                  <div className="flex items-center text-sm opacity-90">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+3 from last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="h-8 w-8" />
                  <span className="text-sm opacity-90">Weekly Avg</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium opacity-90">Mood Score</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">3.6</span>
                    <span className="text-sm opacity-75 ml-1">/ 5</span>
                  </div>
                  <div className="flex items-center text-sm opacity-90">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+0.3 improvement</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="h-8 w-8" />
                  <span className="text-sm opacity-90">Weekly Avg</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium opacity-90">Sleep Quality</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">4.1</span>
                    <span className="text-sm opacity-75 ml-1">/ 5</span>
                  </div>
                  <div className="flex items-center text-sm opacity-90">
                    <span>Stable</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="h-8 w-8" />
                  <span className="text-sm opacity-90">This Week</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium opacity-90">Calories Burned</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">1,850</span>
                    <span className="text-sm opacity-75 ml-1">kcal</span>
                  </div>
                  <div className="flex items-center text-sm opacity-90">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+180 from goal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

              {/* Progress Insights */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Insights</h3>
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
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <WellnessGoals userId={userId} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Detailed Data Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedMetric && getDetailedData(selectedMetric).title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMetric && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedMetric === "heartRate" ? "69.5" : "3.9"} 
                        <span className="text-sm font-normal ml-1">
                          {getDetailedData(selectedMetric).unit}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">Weekly Average</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">7</div>
                      <div className="text-sm text-gray-600">Days Tracked</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedMetric === "heartRate" ? "↗" : "→"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedMetric === "heartRate" ? "Improving" : "Stable"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Daily Data */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Daily Breakdown</h3>
                  <div className="space-y-3">
                    {getDetailedData(selectedMetric).data.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-gray-900">{item.date}</div>
                          <div className="flex items-center gap-2">
                            {item.trend === "up" && <ArrowUp className="h-4 w-4 text-green-500" />}
                            {item.trend === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
                            {item.trend === "stable" && <Minus className="h-4 w-4 text-gray-500" />}
                            <span className="text-lg font-semibold">
                              {item.value}{getDetailedData(selectedMetric).unit}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                          {item.activities}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Insights */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Activity Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Most Active Days</h4>
                      <p className="text-sm text-blue-700">
                        {selectedMetric === "heartRate" 
                          ? "Your heart rate shows the most activity on weekdays, indicating consistent morning routines."
                          : "Your mood and sleep quality are highest on weekends when you have more relaxation time."
                        }
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Progress Notes</h4>
                      <p className="text-sm text-green-700">
                        {selectedMetric === "heartRate"
                          ? "Regular exercise routine is improving your cardiovascular fitness over time."
                          : "Consistent meditation and breathing exercises are supporting stable mental wellness."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
