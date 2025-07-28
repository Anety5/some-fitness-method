import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, Play, Star, Lock } from 'lucide-react';
import { 
  FREE_EXERCISES, 
  PREMIUM_EXERCISES, 
  EXERCISE_GOALS, 
  EXERCISE_RESTRICTIONS, 
  EXERCISE_CATEGORIES,
  Exercise, 
  ExerciseRoutine,
  filterExercises 
} from '@/utils/exerciseData';

interface ExerciseBuilderProps {
  isPremiumUser: boolean;
  onSaveRoutine: (routine: ExerciseRoutine) => void;
  onPlayRoutine: (routineId: string) => void;
  onUpgrade?: () => void;
}

export default function ExerciseBuilder({ 
  isPremiumUser, 
  onSaveRoutine, 
  onPlayRoutine, 
  onUpgrade 
}: ExerciseBuilderProps) {
  const [routineName, setRoutineName] = useState('');
  const [routineDescription, setRoutineDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [routineDifficulty, setRoutineDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [routineGoals, setRoutineGoals] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  // Get all available exercises based on user tier
  const availableExercises = isPremiumUser 
    ? [...FREE_EXERCISES, ...PREMIUM_EXERCISES]
    : FREE_EXERCISES;

  // Filter exercises based on current filters
  const filteredExercises = filterExercises(availableExercises, {
    category: filterCategory === 'all' ? undefined : filterCategory,
    difficulty: filterDifficulty === 'all' ? undefined : filterDifficulty
  });

  const selectedExerciseObjects = selectedExercises
    .map(id => availableExercises.find(ex => ex.id === id))
    .filter(Boolean) as Exercise[];

  const totalDuration = selectedExerciseObjects.reduce((sum, ex) => sum + ex.duration, 0);

  const handleExerciseToggle = (exerciseId: string) => {
    setSelectedExercises(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleGoalToggle = (goal: string) => {
    setRoutineGoals(prev => 
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleSaveRoutine = () => {
    if (!routineName.trim() || selectedExercises.length === 0) {
      alert('Please provide a routine name and select at least one exercise.');
      return;
    }

    const routine: ExerciseRoutine = {
      id: `custom_${Date.now()}`,
      name: routineName.trim(),
      description: routineDescription.trim(),
      exercises: selectedExercises,
      totalDuration,
      difficulty: routineDifficulty,
      goals: routineGoals,
      isPremium: false,
      createdBy: 'user'
    };

    onSaveRoutine(routine);
    
    // Reset form
    setRoutineName('');
    setRoutineDescription('');
    setSelectedExercises([]);
    setRoutineGoals([]);
  };

  const handlePlayRoutine = () => {
    if (selectedExercises.length === 0) {
      alert('Please select at least one exercise to preview.');
      return;
    }

    // Create temporary routine for preview
    const tempRoutine: ExerciseRoutine = {
      id: 'preview_routine',
      name: routineName || 'Preview Routine',
      description: routineDescription,
      exercises: selectedExercises,
      totalDuration,
      difficulty: routineDifficulty,
      goals: routineGoals,
      isPremium: false,
      createdBy: 'user'
    };

    // Save temporarily and play
    onSaveRoutine(tempRoutine);
    onPlayRoutine('preview_routine');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return '💪';
      case 'cardio': return '❤️';
      case 'yoga': return '🧘';
      case 'flexibility': return '🤸';
      case 'meditation': return '🧠';
      case 'hiit': return '⚡';
      default: return '🏃';
    }
  };

  // Premium gate for non-premium users
  if (!isPremiumUser) {
    return (
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Premium Feature: Exercise Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-amber-700">
            Create custom workout routines tailored to your specific goals and preferences with our Exercise Builder.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Custom Routines</h4>
              <p className="text-sm text-amber-600">Build personalized workouts from our exercise library</p>
            </div>
            <div className="bg-white/50 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Advanced Exercises</h4>
              <p className="text-sm text-amber-600">Access premium exercises and guided videos</p>
            </div>
            <div className="bg-white/50 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Goal-Based Planning</h4>
              <p className="text-sm text-amber-600">AI-powered routine suggestions based on your goals</p>
            </div>
            <div className="bg-white/50 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Progress Tracking</h4>
              <p className="text-sm text-amber-600">Track your custom routine performance over time</p>
            </div>
          </div>

          <Button 
            onClick={onUpgrade}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            size="lg"
          >
            <Star className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Star className="w-6 h-6 text-amber-500" />
          Exercise Builder
        </h1>
        <p className="text-gray-600">Create custom workout routines tailored to your goals</p>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">Build Routine</TabsTrigger>
          <TabsTrigger value="preview">Preview & Save</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {/* Routine Details */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-300">
            <CardHeader>
              <CardTitle>Routine Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="routine-name">Routine Name *</Label>
                <Input
                  id="routine-name"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  placeholder="My Custom Workout"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="routine-description">Description</Label>
                <Textarea
                  id="routine-description"
                  value={routineDescription}
                  onChange={(e) => setRoutineDescription(e.target.value)}
                  placeholder="Describe your routine goals and focus areas..."
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Difficulty Level</Label>
                  <Select value={routineDifficulty} onValueChange={(value: any) => setRoutineDifficulty(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Total Duration</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {totalDuration} minutes
                  </div>
                </div>
              </div>

              <div>
                <Label>Fitness Goals</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {EXERCISE_GOALS.map(goal => (
                    <label key={goal} className="flex items-center space-x-2 text-sm">
                      <Checkbox
                        checked={routineGoals.includes(goal)}
                        onCheckedChange={() => handleGoalToggle(goal)}
                      />
                      <span>{goal.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Selection */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-300">
            <CardHeader>
              <CardTitle>Select Exercises ({selectedExercises.length} selected)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {EXERCISE_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {getCategoryIcon(category)} {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exercise List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {filteredExercises.map(exercise => (
                  <div
                    key={exercise.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedExercises.includes(exercise.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleExerciseToggle(exercise.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(exercise.category)}</span>
                        <div>
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            {exercise.name}
                            {exercise.isPremium && <Star className="w-3 h-3 text-amber-500" />}
                          </h4>
                          <p className="text-xs text-gray-600">{exercise.duration} min • {exercise.category}</p>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedExercises.includes(exercise.id)}
                        onCheckedChange={() => handleExerciseToggle(exercise.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {/* Routine Summary */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-300">
            <CardHeader>
              <CardTitle>Routine Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{routineName || 'Untitled Routine'}</h3>
                <p className="text-gray-600">{routineDescription}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={getDifficultyColor(routineDifficulty)}>
                  {routineDifficulty}
                </Badge>
                <Badge variant="outline">
                  {totalDuration} minutes
                </Badge>
                <Badge variant="outline">
                  {selectedExercises.length} exercises
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Goals</h4>
                <div className="flex flex-wrap gap-1">
                  {routineGoals.map(goal => (
                    <span key={goal} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                      {goal.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exercise List */}
              <div>
                <h4 className="font-semibold mb-2">Exercises</h4>
                <div className="space-y-2">
                  {selectedExerciseObjects.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-lg">{getCategoryIcon(exercise.category)}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{exercise.name}</p>
                        <p className="text-xs text-gray-600">{exercise.duration} min • {exercise.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handlePlayRoutine}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={selectedExercises.length === 0}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Preview Routine
                </Button>
                <Button 
                  onClick={handleSaveRoutine}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!routineName.trim() || selectedExercises.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Routine
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}