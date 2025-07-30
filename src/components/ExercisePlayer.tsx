import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, SkipForward, RotateCcw, Clock, Target, CheckCircle } from 'lucide-react';
import { getExerciseById, getRoutineById, Exercise, ExerciseRoutine } from '@/utils/exerciseData';

interface ExercisePlayerProps {
  exerciseId?: string;
  routineId?: string;
  onComplete: () => void;
  onExit: () => void;
}

export default function ExercisePlayer({ exerciseId, routineId, onComplete, onExit }: ExercisePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Get exercise or routine data
  const exercise = exerciseId ? getExerciseById(exerciseId) : null;
  const routine = routineId ? getRoutineById(routineId) : null;
  const routineExercises = routine ? routine.exercises.map(id => getExerciseById(id)).filter(Boolean) as Exercise[] : [];
  
  const currentExercise = exercise || (routineExercises[currentExerciseIndex]);
  const totalDuration = exercise ? exercise.duration * 60 : (routine ? routine.totalDuration * 60 : 0);
  const exerciseDuration = currentExercise ? currentExercise.duration * 60 : 0;

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTime < totalDuration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // For routines, check if current exercise is complete
          if (routine && newTime >= exerciseDuration && currentExerciseIndex < routineExercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            return 0; // Reset timer for next exercise
          }
          
          // Check if entire workout is complete
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            setIsCompleted(true);
            return totalDuration;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalDuration, exerciseDuration, routine, currentExerciseIndex, routineExercises.length]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentExerciseIndex(0);
  };
  const handleRestart = () => {
    setCurrentTime(0);
    setCurrentExerciseIndex(0);
    setIsCompleted(false);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (routine && currentExerciseIndex < routineExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentTime(0);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (!currentExercise) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-300">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Exercise not found</p>
          <Button onClick={onExit} variant="outline" className="mt-4">
            Back to Library
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-300">
        <CardContent className="p-6 text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Workout Complete!</h2>
          <p className="text-gray-600">
            Great job completing {exercise ? exercise.name : routine?.name}!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
            <Button onClick={handleRestart} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Do Again
            </Button>
            <Button onClick={onExit} variant="outline">
              Back to Library
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-3xl">{getCategoryIcon(currentExercise.category)}</span>
            <div>
              <h1 className="text-xl text-gray-900">{currentExercise.name}</h1>
              {routine && (
                <p className="text-sm text-gray-600">
                  Exercise {currentExerciseIndex + 1} of {routineExercises.length} • {routine.name}
                </p>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Timer and Progress */}
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-300">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-gray-900">
              {formatTime(exerciseDuration - currentTime)}
            </div>
            <Progress 
              value={(currentTime / exerciseDuration) * 100} 
              className="w-full h-3"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(exerciseDuration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-3 mt-6">
            {!isPlaying ? (
              <Button onClick={handlePlay} size="lg" className="bg-green-600 hover:bg-green-700">
                <Play className="w-6 h-6 mr-2" />
                {currentTime === 0 ? 'Start' : 'Resume'}
              </Button>
            ) : (
              <Button onClick={handlePause} size="lg" variant="secondary">
                <Pause className="w-6 h-6 mr-2" />
                Pause
              </Button>
            )}
            
            <Button onClick={handleStop} size="lg" variant="outline">
              <Square className="w-6 h-6 mr-2" />
              Stop
            </Button>

            {routine && currentExerciseIndex < routineExercises.length - 1 && (
              <Button onClick={handleNext} size="lg" variant="outline">
                <SkipForward className="w-6 h-6 mr-2" />
                Next
              </Button>
            )}

            <Button onClick={onExit} size="lg" variant="outline">
              Exit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Details */}
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-300">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={getDifficultyColor(currentExercise.difficulty)}>
              {currentExercise.difficulty}
            </Badge>
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {currentExercise.duration} min
            </Badge>
            <Badge variant="outline">
              <Target className="w-3 h-3 mr-1" />
              {currentExercise.category}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{currentExercise.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
            <ol className="list-decimal list-inside space-y-1">
              {currentExercise.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-600 text-sm">{instruction}</li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
            <ul className="list-disc list-inside space-y-1">
              {currentExercise.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-600 text-sm">{benefit}</li>
              ))}
            </ul>
          </div>

          {currentExercise.targetMuscles && currentExercise.targetMuscles.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Target Muscles</h3>
              <div className="flex flex-wrap gap-2">
                {currentExercise.targetMuscles.map(muscle => (
                  <span key={muscle} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Routine Progress */}
      {routine && (
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-300">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Routine Progress</h3>
            <div className="space-y-2">
              {routineExercises.map((ex, index) => (
                <div key={ex.id} className={`flex items-center gap-3 p-2 rounded ${
                  index === currentExerciseIndex ? 'bg-blue-50 border border-blue-200' : 
                  index < currentExerciseIndex ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index < currentExerciseIndex ? 'bg-green-600 text-white' :
                    index === currentExerciseIndex ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentExerciseIndex ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{ex.name}</p>
                    <p className="text-xs text-gray-600">{ex.duration} min • {ex.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}