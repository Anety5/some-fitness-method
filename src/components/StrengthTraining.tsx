import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Timer, Play, Pause, RotateCcw, Dumbbell, Target, Clock } from "lucide-react";
import ExerciseImage from "@/components/ExerciseImage";

interface IsometricExercise {
  id: string;
  name: string;
  description: string;
  targetMuscles: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  defaultDuration: number; // seconds
  instructions: string[];
  benefits: string[];
  progressions: string[];
}

const isometricExercises: IsometricExercise[] = [
  {
    id: "wall-sit",
    name: "Wall Sit",
    description: "3 sets of 30-60 seconds, 3x/week",
    targetMuscles: ["Quadriceps", "Glutes", "Calves"],
    difficulty: "beginner",
    defaultDuration: 45,
    instructions: [
      "Sit against a wall with thighs parallel to ground",
      "Keep knees at 90-degree angle",
      "Hold position for 30-60 seconds",
      "Complete 3 sets, 3 times per week"
    ],
    benefits: ["Builds leg strength and endurance", "Improves core stability", "Low impact on joints"],
    progressions: ["Start with 30 seconds", "Progress to 60 seconds", "Try single-leg variations"]
  },
  {
    id: "lunges",
    name: "Lunges",
    description: "3 sets of 10-12 reps per leg, 3x/week",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    difficulty: "beginner",
    defaultDuration: 12,
    instructions: [
      "Step forward, lower back knee, keep front thigh parallel to ground",
      "Keep proper form throughout movement",
      "Complete 10-12 reps per leg",
      "Perform 3 sets, 3 times per week"
    ],
    benefits: ["Builds unilateral leg strength", "Improves balance and stability", "Enhances functional movement"],
    progressions: ["Start with bodyweight", "Add dumbbells when ready", "Try reverse or walking lunges"]
  },
  {
    id: "wall-push-up",
    name: "Wall Push-Up",
    description: "3 sets of 10-15 reps, 2-3x/week",
    targetMuscles: ["Chest", "Shoulders", "Triceps"],
    difficulty: "beginner",
    defaultDuration: 12,
    instructions: [
      "Lean into wall and push back, maintain straight body line",
      "Keep core engaged throughout movement",
      "Complete 10-15 reps per set",
      "Perform 3 sets, 2-3 times per week"
    ],
    benefits: ["Builds upper body strength", "Improves pushing mechanics", "Great for beginners"],
    progressions: ["Start with wall push-ups", "Progress to incline push-ups", "Advance to regular push-ups"]
  },
  {
    id: "bird-dog-single",
    name: "Bird Dog (Single Leg)",
    description: "3 sets of 10 reps per side, 3x/week",
    targetMuscles: ["Core", "Glutes", "Back"],
    difficulty: "intermediate",
    defaultDuration: 10,
    instructions: [
      "On all fours, extend one leg, hold briefly",
      "Maintain balance and core engagement",
      "Complete 10 reps per side",
      "Perform 3 sets, 3 times per week"
    ],
    benefits: ["Improves core stability", "Enhances balance and coordination", "Strengthens posterior chain"],
    progressions: ["Master single leg first", "Progress to opposite arm/leg", "Add resistance bands"]
  },
  {
    id: "bird-dog-opposite",
    name: "Bird Dog (Opposite Arm/Leg)",
    description: "3 sets of 10 reps per side, 3x/week",
    targetMuscles: ["Core", "Glutes", "Back", "Shoulders"],
    difficulty: "intermediate",
    defaultDuration: 10,
    instructions: [
      "Extend opposite arm and leg, hold briefly",
      "Maintain balance and coordination",
      "Complete 10 reps per side",
      "Perform 3 sets, 3 times per week"
    ],
    benefits: ["Full-body coordination", "Core and glute strengthening", "Improves spinal stability"],
    progressions: ["Start with shorter holds", "Focus on smooth movements", "Add ankle weights for progression"]
  },
  {
    id: "glute-bridge",
    name: "Glute Bridge",
    description: "3 sets of 12-15 reps, 3-4x/week",
    targetMuscles: ["Glutes", "Hamstrings", "Core"],
    difficulty: "beginner",
    defaultDuration: 13,
    instructions: [
      "Lie on back, lift hips to align with knees",
      "Squeeze glutes at the top position",
      "Complete 12-15 reps per set",
      "Perform 3 sets, 3-4 times per week"
    ],
    benefits: ["Strengthens glutes and hamstrings", "Improves hip mobility", "Counters sitting posture"],
    progressions: ["Start with bodyweight", "Try single-leg variations", "Add weight on hips"]
  }
];

export default function StrengthTraining() {
  const [selectedExercise, setSelectedExercise] = useState<IsometricExercise | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [currentSet, setCurrentSet] = useState(1);
  const [notes, setNotes] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's activity logs
  const { data: activityLogs = [] } = useQuery({
    queryKey: ["/api/activity-logs", user?.id],
    queryFn: async () => {
      const response = await apiRequest(`/api/activity-logs/${user?.id}`, "GET");
      return response;
    },
    enabled: !!user?.id
  });

  // Create activity log mutation
  const createLogMutation = useMutation({
    mutationFn: async (logData: any) => {
      return await apiRequest("/api/activity-logs", "POST", logData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activity-logs"] });
      toast({
        title: "Activity Logged",
        description: "Your strength training session has been recorded!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log activity. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (timer > 0) {
      setCompletedSets(prev => [...prev, timer]);
      setCurrentSet(prev => prev + 1);
    }
    setTimer(0);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  const resetSession = () => {
    resetTimer();
    setCompletedSets([]);
    setCurrentSet(1);
    setNotes("");
  };

  const saveWorkout = () => {
    if (!selectedExercise || completedSets.length === 0) {
      toast({
        title: "Incomplete Workout",
        description: "Please complete at least one set before saving.",
        variant: "destructive",
      });
      return;
    }

    const logData = {
      userId: user?.id || 0,
      activityType: "strength",
      activityName: selectedExercise.name,
      date: new Date().toISOString().split('T')[0],
      setsCompleted: completedSets.length,
      repsOrDuration: JSON.stringify(completedSets),
      timeMinutes: Math.floor(completedSets.reduce((sum, time) => sum + time, 0) / 60),
      notes: notes.trim() || undefined,
    };

    createLogMutation.mutate(logData);
    resetSession();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredExercises = isometricExercises.filter(exercise => 
    difficulty === "beginner" ? true : exercise.difficulty === difficulty
  );

  return (
    <div className="min-h-screen p-6" style={{ 
      backgroundImage: 'url(/assets/cliff-coastline.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Strength Training</h1>
          <p className="text-white/80 text-lg">
            Build strength with isometric exercises - holding static positions to challenge your muscles
          </p>
        </div>

        <Tabs defaultValue="exercises" className="space-y-6">
          <TabsList className="bg-white/90 border border-white/50 shadow-lg">
            <TabsTrigger value="exercises" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700 font-medium">
              <Dumbbell className="w-4 h-4 mr-2" />
              Exercises
            </TabsTrigger>
            <TabsTrigger value="workout" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700 font-medium">
              <Timer className="w-4 h-4 mr-2" />
              Active Workout
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-700 font-medium">
              <Clock className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="space-y-6">
            {/* Difficulty Filter */}
            <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Choose Your Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {["beginner", "intermediate", "advanced"].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      onClick={() => setDifficulty(level as any)}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exercise Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredExercises.map((exercise) => (
                <Card key={exercise.id} className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-gray-900">{exercise.name}</CardTitle>
                      <Badge variant={exercise.difficulty === "beginner" ? "secondary" : exercise.difficulty === "intermediate" ? "default" : "destructive"}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    <div className="flex justify-center my-3">
                      <ExerciseImage exerciseName={exercise.name} className="w-16 h-16" />
                    </div>
                    <p className="text-gray-600">{exercise.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Target Muscles:</h4>
                      <div className="flex flex-wrap gap-1">
                        {exercise.targetMuscles.map((muscle) => (
                          <Badge key={muscle} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Default Hold Time:</h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        {formatTime(exercise.defaultDuration)}
                      </Badge>
                    </div>

                    <Button 
                      onClick={() => setSelectedExercise(exercise)}
                      className="w-full"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Start Exercise
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workout" className="space-y-6">
            {selectedExercise ? (
              <>
                {/* Exercise Info */}
                <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">{selectedExercise.name}</CardTitle>
                    <p className="text-gray-600">{selectedExercise.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Instructions:</h4>
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <div className="flex justify-center mb-2">
                            <ExerciseImage exerciseName={selectedExercise.name} />
                          </div>
                          <p className="text-xs text-gray-600 text-center">{selectedExercise.name} demonstration</p>
                        </div>
                        <ul className="space-y-1 text-gray-700">
                          {selectedExercise.instructions.map((instruction, index) => (
                            <li key={index} className="text-sm">• {instruction}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                        <ul className="space-y-1 text-gray-700">
                          {selectedExercise.benefits.map((benefit, index) => (
                            <li key={index} className="text-sm">• {benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timer Display */}
                <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900">Set {currentSet}</h3>
                      <div className="text-6xl font-mono font-bold text-blue-600">
                        {formatTime(timer)}
                      </div>
                      <div className="flex justify-center gap-4">
                        {!isRunning ? (
                          <Button onClick={startTimer} size="lg">
                            <Play className="w-5 h-5 mr-2" />
                            Start
                          </Button>
                        ) : (
                          <>
                            <Button onClick={pauseTimer} variant="outline" size="lg">
                              <Pause className="w-5 h-5 mr-2" />
                              Pause
                            </Button>
                            <Button onClick={stopTimer} size="lg">
                              Stop Set
                            </Button>
                          </>
                        )}
                        <Button onClick={resetTimer} variant="destructive" size="lg">
                          <RotateCcw className="w-5 h-5 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Completed Sets */}
                {completedSets.length > 0 && (
                  <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Completed Sets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {completedSets.map((duration, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800">
                            Set {index + 1}: {formatTime(duration)}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notes and Save */}
                <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Session Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="How did this session feel? Any observations..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-20"
                    />
                    <div className="flex gap-4">
                      <Button onClick={saveWorkout} disabled={completedSets.length === 0} className="flex-1">
                        Save Workout
                      </Button>
                      <Button onClick={resetSession} variant="outline" className="flex-1">
                        Reset Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select an Exercise</h3>
                  <p className="text-gray-600">Choose an isometric exercise from the Exercises tab to begin your workout</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Workout History</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(activityLogs) && activityLogs.length > 0 ? (
                  <div className="space-y-4">
                    {activityLogs
                      .filter((log: any) => log.activityType === "strength")
                      .map((log: any) => (
                        <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{log.activityName}</h4>
                            <Badge>{log.date}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>Sets: {log.setsCompleted}</div>
                            <div>Total Time: {log.timeMinutes}m</div>
                            <div>
                              Durations: {JSON.parse(log.repsOrDuration || "[]").map((d: number) => formatTime(d)).join(", ")}
                            </div>
                            {log.notes && <div className="col-span-full">Notes: {log.notes}</div>}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No strength training sessions recorded yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}