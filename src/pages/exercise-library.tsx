import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import ExerciseLibrary from '@/components/ExerciseLibrary';
import ExercisePlayer from '@/components/ExercisePlayer';
import ExerciseBuilder from '@/components/ExerciseBuilder';
import UpgradeToPremium from '@/components/UpgradeToPremium';
import { ExerciseRoutine } from '@/utils/exerciseData';
import { useUser } from '@/hooks/useUser';

type ViewMode = 'library' | 'player' | 'builder';

export default function ExerciseLibraryPage() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [currentExerciseId, setCurrentExerciseId] = useState<string | undefined>();
  const [currentRoutineId, setCurrentRoutineId] = useState<string | undefined>();
  const [customRoutines, setCustomRoutines] = useState<ExerciseRoutine[]>([]);
  
  const { user, isPremium, upgradeUser, isLoading } = useUser();

  const handlePlayExercise = (exerciseId: string) => {
    setCurrentExerciseId(exerciseId);
    setCurrentRoutineId(undefined);
    setViewMode('player');
  };

  const handlePlayRoutine = (routineId: string) => {
    setCurrentRoutineId(routineId);
    setCurrentExerciseId(undefined);
    setViewMode('player');
  };

  const handleSaveRoutine = (routine: ExerciseRoutine) => {
    setCustomRoutines(prev => [...prev, routine]);
    alert('Routine saved successfully!');
  };

  const handleComplete = () => {
    // Track completion here
    alert('Great job completing your workout!');
    setViewMode('library');
  };

  const handleExitPlayer = () => {
    setViewMode('library');
    setCurrentExerciseId(undefined);
    setCurrentRoutineId(undefined);
  };

  const handleUpgrade = async () => {
    const result = await upgradeUser();
    if (result.success) {
      alert('Successfully upgraded to Premium! Enjoy your new features.');
      setViewMode('library'); // Return to library to see premium features
    } else {
      alert('Upgrade failed. Please try again.');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    switch (viewMode) {
      case 'player':
        return (
          <ExercisePlayer
            exerciseId={currentExerciseId}
            routineId={currentRoutineId}
            onComplete={handleComplete}
            onExit={handleExitPlayer}
          />
        );
      case 'builder':
        if (isPremium) {
          return (
            <ExerciseBuilder
              isPremiumUser={isPremium}
              onSaveRoutine={handleSaveRoutine}
              onPlayRoutine={handlePlayRoutine}
              onUpgrade={handleUpgrade}
            />
          );
        } else {
          return (
            <UpgradeToPremium 
              onUpgrade={handleUpgrade}
              featureContext="the Exercise Builder"
            />
          );
        }
      default:
        return (
          <ExerciseLibrary
            isPremiumUser={isPremium}
            onPlayExercise={handlePlayExercise}
            onPlayRoutine={handlePlayRoutine}
            onUpgrade={handleUpgrade}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: `url('/images/tropical-day-coast.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center'
         }}>
      
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-white/30"></div>
      
      <div className="relative min-h-screen">
        
        {/* Header Navigation */}
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <Button 
                onClick={() => setLocation('/')}
                variant="outline" 
                className="bg-white/80 hover:bg-white text-gray-900 border-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              
              {viewMode === 'library' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setViewMode('library')}
                    variant={viewMode === 'library' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Library
                  </Button>
                  <Button
                    onClick={() => setViewMode('builder')}
                    variant="outline"
                    size="sm"
                    className={!isPremium ? 'text-amber-600 border-amber-300' : ''}
                  >
                    Builder {!isPremium && '(Premium)'}
                  </Button>
                </div>
              )}
              
              {viewMode !== 'library' && (
                <Button
                  onClick={() => setViewMode('library')}
                  variant="outline"
                  size="sm"
                >
                  Back to Library
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}