import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Clock, Target, Star, Lock } from 'lucide-react';
import { FREE_EXERCISES, FREE_ROUTINES, PREMIUM_ROUTINES, filterExercises, Exercise, ExerciseRoutine } from '@/utils/exerciseData';

interface ExerciseLibraryProps {
  isPremiumUser?: boolean;
  onPlayExercise: (exerciseId: string) => void;
  onPlayRoutine: (routineId: string) => void;
  onUpgrade?: () => void;
}

export default function ExerciseLibrary({ 
  isPremiumUser = false, 
  onPlayExercise, 
  onPlayRoutine, 
  onUpgrade 
}: ExerciseLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredExercises = filterExercises(FREE_EXERCISES, {
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    difficulty: selectedDifficulty === 'all' ? undefined : selectedDifficulty,
    isPremium: false
  });

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

  const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-300 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(exercise.category)}</span>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{exercise.name}</h3>
              <p className="text-xs text-gray-600">{exercise.description}</p>
            </div>
          </div>
          {exercise.isPremium && (
            <Lock className="w-4 h-4 text-amber-500" />
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getDifficultyColor(exercise.difficulty)}>
            {exercise.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {exercise.duration}min
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            {exercise.category}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {exercise.goals.slice(0, 3).map(goal => (
            <span key={goal} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {goal.replace('_', ' ')}
            </span>
          ))}
        </div>

        <Button 
          onClick={() => onPlayExercise(exercise.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Exercise
        </Button>
      </CardContent>
    </Card>
  );

  const RoutineCard = ({ routine }: { routine: ExerciseRoutine }) => (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-300 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              {routine.name}
              {routine.isPremium && <Lock className="w-4 h-4 text-amber-500" />}
            </h3>
            <p className="text-xs text-gray-600">{routine.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getDifficultyColor(routine.difficulty)}>
            {routine.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {routine.totalDuration}min
          </Badge>
          <Badge variant="outline" className="text-xs">
            {routine.exercises.length} exercises
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {routine.goals.slice(0, 3).map(goal => (
            <span key={goal} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              {goal.replace('_', ' ')}
            </span>
          ))}
        </div>

        {routine.isPremium && !isPremiumUser ? (
          <Button 
            onClick={onUpgrade}
            variant="outline"
            className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
            size="sm"
          >
            <Star className="w-4 h-4 mr-2" />
            Upgrade for Premium
          </Button>
        ) : (
          <Button 
            onClick={() => onPlayRoutine(routine.id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Routine
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const PremiumPreview = () => (
    <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
      <CardHeader>
        <CardTitle className="text-amber-800 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Premium Exercise Library
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-amber-700 mb-4">
          Unlock advanced workouts, guided video routines, and personalized training plans.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {PREMIUM_ROUTINES.slice(0, 2).map(routine => (
            <div key={routine.id} className="bg-white/50 p-3 rounded-lg">
              <h4 className="font-semibold text-amber-800 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {routine.name}
              </h4>
              <p className="text-xs text-amber-600 mt-1">{routine.description}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {routine.totalDuration}min
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {routine.difficulty}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button 
          onClick={onUpgrade}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Star className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Exercise Library</h1>
        <p className="text-gray-600">Discover workouts and routines for all fitness levels</p>
      </div>

      <Tabs defaultValue="routines" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="routines">Routines</TabsTrigger>
          <TabsTrigger value="exercises">Individual Exercises</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value="routines" className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Free Workout Routines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FREE_ROUTINES.map(routine => (
                <RoutineCard key={routine.id} routine={routine} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 p-4 bg-white/50 rounded-lg">
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Categories
              </Button>
              {['strength', 'cardio', 'yoga', 'meditation'].map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {getCategoryIcon(category)} {category}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty('all')}
              >
                All Levels
              </Button>
              {['beginner', 'intermediate', 'advanced'].map(difficulty => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map(exercise => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="premium" className="space-y-4">
          <PremiumPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
}