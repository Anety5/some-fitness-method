import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sun, Mountain, MapPin } from 'lucide-react';
import { useLocation } from 'wouter';
import MorningRoutineCard from '@/components/morning-routine-card';
import YogaPoseCard from '@/components/yoga-pose-card';
import StrengthExerciseCard from '@/components/strength-exercise-card';
import DailyExercisesEasy from '@/components/daily-exercises-easy';
import YogaBeginner from '@/components/yoga-beginner';
import StrengthTrainingGrid from '@/components/strength-training-grid';
import MedicalDisclaimer from '@/components/medical-disclaimer';
import { morningRoutine } from '@/data/morning-routine';
import { yogaBeginner } from '@/data/yoga-beginner';
import { strengthTrainingExercises } from '@/data/strength-training';
import type { MorningExercise } from '@/data/morning-routine';
import type { YogaPose } from '@/data/yoga-beginner';
import type { StrengthExercise } from '@/data/strength-training';
import { useActivityLogger } from '@/hooks/useActivityLogger';


export default function MorningRoutine() {
  const [, setLocation] = useLocation();
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [completedPoses, setCompletedPoses] = useState<string[]>([]);
  const [completedStrengthExercises, setCompletedStrengthExercises] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<MorningExercise | null>(null);
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const [selectedStrengthExercise, setSelectedStrengthExercise] = useState<StrengthExercise | null>(null);
  const { logExerciseActivity } = useActivityLogger();

  // Load completed exercises and poses from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedExercises = localStorage.getItem(`morning-routine-${today}`);
    const savedPoses = localStorage.getItem(`yoga-poses-${today}`);
    const savedStrengthExercises = localStorage.getItem(`strength-exercises-${today}`);
    if (savedExercises) {
      setCompletedExercises(JSON.parse(savedExercises));
    }
    if (savedPoses) {
      setCompletedPoses(JSON.parse(savedPoses));
    }
    if (savedStrengthExercises) {
      setCompletedStrengthExercises(JSON.parse(savedStrengthExercises));
    }
  }, []);

  // Save completed exercises to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`morning-routine-${today}`, JSON.stringify(completedExercises));
  }, [completedExercises]);

  // Save completed poses to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`yoga-poses-${today}`, JSON.stringify(completedPoses));
  }, [completedPoses]);

  // Save completed strength exercises to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`strength-exercises-${today}`, JSON.stringify(completedStrengthExercises));
  }, [completedStrengthExercises]);

  const handleExerciseComplete = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises(prev => [...prev, exerciseId]);
      
      // Log the exercise activity
      const exercise = morningRoutine.find(e => e.id === exerciseId);
      if (exercise) {
        logExerciseActivity(1, exercise.name, 'morning routine');
      }
    }
  };

  const handlePoseComplete = (poseId: string) => {
    if (!completedPoses.includes(poseId)) {
      setCompletedPoses(prev => [...prev, poseId]);
      
      // Log the yoga pose activity
      const pose = yogaBeginner.find(p => p.id === poseId);
      if (pose) {
        logExerciseActivity(1, pose.name, 'yoga');
      }
    }
  };

  const handleStrengthExerciseComplete = (exerciseId: string) => {
    if (!completedStrengthExercises.includes(exerciseId)) {
      setCompletedStrengthExercises(prev => [...prev, exerciseId]);
      
      // Log the strength exercise activity
      const exercise = strengthTrainingExercises.find(e => e.id === exerciseId);
      if (exercise) {
        logExerciseActivity(1, exercise.name, 'strength training');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: `url('/images/tropical-day-coast.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center',
           imageRendering: 'crisp-edges'
         }}>
      {/* Soft overlay for contrast */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/50"></div>
      <div className="relative min-h-screen">
      <div className="min-h-screen bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 text-white">
                <Sun className="w-6 h-6" />
                <h1 className="text-2xl font-playfair font-bold text-white bg-transparent">Daily Movement & Adventure Hub</h1>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="mb-6">
            <MedicalDisclaimer variant="activities" className="bg-orange-50/10 border-orange-200/20 text-white" />
          </div>

          {/* Movement Sections */}
          {!selectedExercise && !selectedPose && !selectedStrengthExercise ? (
            <div className="space-y-6">
              <DailyExercisesEasy onExerciseSelect={setSelectedExercise} />
              <YogaBeginner onPoseSelect={setSelectedPose} />
              <StrengthTrainingGrid 
                onExerciseSelect={setSelectedStrengthExercise} 
                completedExercises={completedStrengthExercises} 
              />
              
              {/* GPS Hiking/Walking Tracker */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/assets/icon-hiker.png" 
                      alt="Hiker icon" 
                      className="w-12 h-12"
                      onError={(e) => {
                        // Fallback to Kai character if icon fails
                        (e.target as HTMLImageElement).src = "/assets/characters/kai-hiker.png";
                      }}
                    />
                    <Mountain className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">GPS Hike & Walk Tracker</h3>
                      <p className="text-white/70 text-sm">Track your outdoor adventures with real-time GPS</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-white/70 text-xs mb-4 text-center">
                  GPS tracking • Distance • Pace • Waypoints • Calories • History
                </div>
                
                <Button 
                  onClick={() => setLocation('/hike-tracker')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Start GPS Tracking
                </Button>
              </div>
              
              {/* Quick Stats & Progress */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {completedExercises.length}/6
                    </div>
                    <div className="text-white/70 text-sm">Exercises</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {completedPoses.length}/6
                    </div>
                    <div className="text-white/70 text-sm">Yoga Poses</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">
                      {completedStrengthExercises.length}/6
                    </div>
                    <div className="text-white/70 text-sm">Strength</div>
                  </div>
                </div>
                
                {/* Overall Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/80">
                    <span>Overall Progress</span>
                    <span>{Math.round(((completedExercises.length + completedPoses.length + completedStrengthExercises.length) / 18) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 via-purple-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((completedExercises.length + completedPoses.length + completedStrengthExercises.length) / 18) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Completion Message */}
                {(completedExercises.length + completedPoses.length + completedStrengthExercises.length) === 18 && (
                  <div className="mt-3 text-center text-green-300 text-sm font-medium">
                    🎉 Excellent! You've completed your full movement routine!
                  </div>
                )}
              </div>
            </div>
          ) : selectedExercise ? (
            <div className="space-y-4">
              {/* Back to Exercise List */}
              <Button
                variant="outline"
                onClick={() => setSelectedExercise(null)}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Movement Options
              </Button>
              
              {/* Selected Exercise Detail */}
              <MorningRoutineCard
                exercise={selectedExercise}
                onComplete={handleExerciseComplete}
                isCompleted={completedExercises.includes(selectedExercise.id)}
              />
            </div>
          ) : selectedPose ? (
            <div className="space-y-4">
              {/* Back to Pose List */}
              <Button
                variant="outline"
                onClick={() => setSelectedPose(null)}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Movement Options
              </Button>
              
              {/* Selected Pose Detail */}
              <YogaPoseCard
                pose={selectedPose}
                onComplete={handlePoseComplete}
                isCompleted={completedPoses.includes(selectedPose.id)}
              />
            </div>
          ) : selectedStrengthExercise ? (
            <div className="space-y-4">
              {/* Back to Strength Exercise List */}
              <Button
                variant="outline"
                onClick={() => setSelectedStrengthExercise(null)}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Movement Options
              </Button>
              
              {/* Selected Strength Exercise Detail */}
              <StrengthExerciseCard
                exercise={selectedStrengthExercise}
                onComplete={handleStrengthExerciseComplete}
                isCompleted={completedStrengthExercises.includes(selectedStrengthExercise.id)}
              />
            </div>
          ) : null}
        </div>
      </div>
      </div>
    </div>
  );
}