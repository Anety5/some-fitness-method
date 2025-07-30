import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Play, Pause, RotateCcw, Wind, Volume2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useLocation, Link } from 'wouter';
import BreathingExerciseModal from "@/components/breathing-exercise";
import FavoriteButton from "@/components/favorite-button";
import MedicalDisclaimer from "@/components/medical-disclaimer";
import PremiumAudioPlayer from "@/components/PremiumAudioPlayer";
import LockedAudio from "@/components/LockedAudio";
import UpgradeToPremium from "@/components/UpgradeToPremium";
import PremiumToggle from "@/components/PremiumToggle";
import BlowfishBreathing from '@/components/BlowfishBreathing';
import OctopusBreathing from '@/components/OctopusBreathing';

import VideoPlayer from '@/components/VideoPlayer';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { useUser } from '@/hooks/useUser';
import { audioLibrary } from '@/utils/audioContent';

// Breathing exercises organized by benefits
const breathingCategories = {
  "Stress Relief & Relaxation": [
    {
      id: 4,
      title: "Relaxation Breathing with Rain",
      description: "Guided breathing with rain audio for deep relaxation",
      duration: "15 minutes",
      difficulty: "Easy",
      inhale: 6,
      exhale: 8,
      benefits: ["Deep relaxation", "Stress relief", "Mindful awareness"],
      instructions: "Breathe in for 6 counts, breathe out for 8 counts. Let the rain sounds guide your rhythm.",
      audioAvailable: true,
      audioPath: "/assets/audio/ambient/Longer rain_1752037782489.m4a"
    }
  ],
  "Sleep & Anxiety Relief": [
    {
      id: 2,
      title: "6-8-10 Technique",
      description: "Powerful relaxation breathing for sleep and anxiety",
      duration: "3 minutes",
      difficulty: "Easy",
      inhale: 6,
      hold: 8,
      exhale: 10,
      benefits: ["Quick relaxation", "Better sleep", "Anxiety relief"],
      instructions: "Inhale through nose for 6, hold for 8, exhale through mouth for 10. Perfect for bedtime.",
      audioAvailable: false,
      audioPath: ""
    },
    {
      id: 3,
      title: "Coherent Breathing",
      description: "5-second in, 5-second out for emotional balance",
      duration: "10 minutes",
      difficulty: "Medium",
      inhale: 6,
      exhale: 6,
      benefits: ["Heart rate variability", "Emotional balance", "Deep relaxation"],
      instructions: "Breathe in for 6 seconds, breathe out for 6 seconds. Find your natural rhythm.",
      audioAvailable: false,
      audioPath: ""
    }
  ],
  "Energy & Focus": [
    {
      id: 1,
      title: "Box Breathing (6-6-6-6)",
      description: "Navy SEAL technique for focus and stress management",
      duration: "5 minutes",
      difficulty: "Easy",
      inhale: 6,
      hold: 6,
      exhale: 6,
      holdEmpty: 6,
      benefits: ["Improved focus", "Stress reduction", "Mental clarity", "Enhanced performance"],
      instructions: "Inhale for 6 counts, hold for 6, exhale for 6, hold empty for 6. Perfect square pattern.",
      audioAvailable: false,
      audioPath: ""
    },
    {
      id: 5,
      title: "Bellows Breath",
      description: "Energizing rapid breathing for mental clarity",
      duration: "2 minutes",
      difficulty: "Hard",
      inhale: 3,
      exhale: 3,
      benefits: ["Increases energy", "Mental clarity", "Awakens nervous system"],
      instructions: "Quick, rhythmic breathing through nose. 3 seconds in, 3 seconds out. Stop if dizzy.",
      audioAvailable: false,
      audioPath: ""
    }
  ],

};

export default function Breathing() {
  const [, setLocation] = useLocation();
  const [activeExercise, setActiveExercise] = useState<any | null>(null);
  const [breathingTimers, setBreathingTimers] = useState<{[key: number]: {phase: string, countdown: number, isActive: boolean}}>({});
  const [exerciseStartTime, setExerciseStartTime] = useState<number | null>(null);
  const { logBreathingActivity } = useActivityLogger();
  const { isPremium, upgradeUser } = useUser();
  
  // Filter breathing audio content
  const breathingAudio = audioLibrary.filter(track => track.category === 'Breathing');
  
  const handleUpgrade = async () => {
    const result = await upgradeUser();
    if (result.success) {
      window.location.reload();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-white bg-green-700';
      case 'Medium': return 'text-white bg-orange-700';
      case 'Hard': return 'text-white bg-red-700';
      default: return 'text-white bg-gray-700';
    }
  };

  const startExercise = (exercise: any) => {
    setActiveExercise(exercise);
    setExerciseStartTime(Date.now());
    startBreathingAnimation(exercise);
  };

  const startBreathingAnimation = (exercise: any) => {
    setBreathingTimers(prev => ({
      ...prev,
      [exercise.id]: {
        phase: 'inhale',
        countdown: exercise.inhale,
        isActive: true
      }
    }));

    let currentPhase = 'inhale';
    let currentCountdown = exercise.inhale;

    const updateTimer = () => {
      setBreathingTimers(prev => ({
        ...prev,
        [exercise.id]: {
          ...prev[exercise.id],
          phase: currentPhase,
          countdown: currentCountdown,
          isActive: true
        }
      }));
    };

    const runCycle = () => {
      if (currentCountdown > 0) {
        currentCountdown--;
        updateTimer();
        return;
      }

      // Move to next phase when countdown reaches 0
      switch (currentPhase) {
        case 'inhale':
          if (exercise.hold) {
            currentPhase = 'hold';
            currentCountdown = exercise.hold;
          } else {
            currentPhase = 'exhale';
            currentCountdown = exercise.exhale;
          }
          break;
        case 'hold':
          currentPhase = 'exhale';
          currentCountdown = exercise.exhale;
          break;
        case 'exhale':
          if (exercise.holdEmpty) {
            currentPhase = 'holdEmpty';
            currentCountdown = exercise.holdEmpty;
          } else {
            currentPhase = 'inhale';
            currentCountdown = exercise.inhale;
          }
          break;
        case 'holdEmpty':
          currentPhase = 'inhale';
          currentCountdown = exercise.inhale;
          break;
      }
      
      updateTimer();
    };

    const interval = setInterval(runCycle, 1000); // Update every second
    
    // Clean up after exercise duration
    setTimeout(() => {
      clearInterval(interval);
      setBreathingTimers(prev => ({...prev, [exercise.id]: {...prev[exercise.id], isActive: false}}));
    }, 300000); // 5 minutes
  };

  const stopExercise = () => {
    if (activeExercise && exerciseStartTime) {
      setBreathingTimers(prev => ({...prev, [activeExercise.id]: {...prev[activeExercise.id], isActive: false}}));
      
      // Log the breathing activity
      const duration = Date.now() - exerciseStartTime;
      if (duration > 15000) { // Only log if practiced for more than 15 seconds
        logBreathingActivity(1, activeExercise.title, Math.round(duration / 1000));
      }
    }
    setActiveExercise(null);
    setExerciseStartTime(null);
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'bg-gradient-to-br from-blue-400 to-blue-700';
      case 'hold': return 'bg-gradient-to-br from-purple-400 to-purple-700';
      case 'exhale': return 'bg-gradient-to-br from-red-400 to-red-700';
      case 'holdEmpty': return 'bg-gradient-to-br from-orange-400 to-orange-700';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  const getCircleScale = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'scale-150';
      case 'hold': return 'scale-125';
      case 'exhale': return 'scale-75';
      case 'holdEmpty': return 'scale-90';
      default: return 'scale-100';
    }
  };

  const getPhaseInstruction = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'holdEmpty': return 'Hold Empty';
      default: return 'Ready';
    }
  };

  return (
    <div className="min-h-screen tropical-day-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-white bg-white/20 hover:bg-white/30 border-white/30">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white">Breathing Exercises</h1>
          
          {/* Premium Toggle for Demo */}
          <div className="mt-4">
            <PremiumToggle />
          </div>
        </div>

        {/* Featured Breathing Retraining for Anxiety */}
        <Card className="mb-8 bg-gradient-to-br from-blue-700/80 to-indigo-700/80 backdrop-blur-sm border-blue-300/30 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-400/30 p-3 rounded-full">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Breathing Retraining for Anxiety</h3>
                <p className="text-white/90 text-base mb-4">
                  Evidence-based breathing technique for anxiety relief. Uses proven 4-second inhale, 2-second hold, 6-second exhale pattern for therapeutic effect.
                </p>
                
                {/* Breathing Pattern Display */}
                <div className="bg-white/10 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-3 text-white">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-200">4</div>
                      <div className="text-xs">Inhale</div>
                    </div>
                    <div className="text-white/60">→</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-200">2</div>
                      <div className="text-xs">Hold</div>
                    </div>
                    <div className="text-white/60">→</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-200">6</div>
                      <div className="text-xs">Exhale</div>
                    </div>
                  </div>
                </div>

                {/* Research Summary */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-3 mb-4">
                  <h4 className="text-white font-semibold mb-1">🔬 Research Backed</h4>
                  <p className="text-white/90 text-sm">75% of breathing interventions significantly reduce anxiety (PMC Brain Sciences, 2023)</p>
                </div>

                {/* Audio Player */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-base mb-3">🎵 Guided Breathing Retraining Audio</p>
                  <audio controls className="w-full" preload="metadata">
                    <source src="/breathing-retraining.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/70">
                    <span className="font-medium">Clinical Source:</span> Centre for Clinical Interventions
                    <br />
                    <span className="text-white/60">
                      <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9954474/" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="text-blue-300 hover:text-blue-200 underline">
                        PMC Research: Breathwork for Anxiety Disorders
                      </a>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <FavoriteButton 
                      userId={1}
                      itemType="activity"
                      itemId={999}
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ten Breath Practice */}
        <Card className="mb-8 bg-gradient-to-br from-green-700/80 to-teal-700/80 backdrop-blur-sm border-green-300/30 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-400/30 p-3 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Ten Breath Practice</h3>
                <p className="text-white/90 text-base mb-4">
                  Focused breathing with guided ten conscious breaths for quick centering and immediate calm.
                  Mayo Clinic recommended technique for stress relief and mental clarity.
                </p>
                
                {/* Breathing Pattern Display */}
                <div className="bg-white/10 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-3 text-white">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-200">4</div>
                      <div className="text-xs">Inhale</div>
                    </div>
                    <div className="text-white/60">→</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-200">6</div>
                      <div className="text-xs">Exhale</div>
                    </div>
                  </div>
                  <div className="text-center mt-2 text-white/80 text-base">
                    Count ten full breaths mindfully. Focus entirely on each inhale and exhale.
                  </div>
                </div>

                {/* Audio Player */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-base mb-1">🎵 Guided Ten Breath Practice Audio</p>
                  <p className="text-white/70 text-sm mb-3">Narrated by Dr. Roberto P. Benzo, Mayo Clinic</p>
                  <audio controls className="w-full" preload="metadata">
                    <source src="/ten-breath-practice.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/70">
                    <span className="font-medium">Clinical Source:</span> Mayo Clinic Mindful Breathing Lab
                    <br />
                    <span className="text-white/60">
                      <a href="https://www.mayo.edu/research/labs/mindful-breathing/audio-files" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="text-blue-300 hover:text-blue-200 underline">
                        Mayo Research Audio Files
                      </a>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <FavoriteButton 
                      userId={1}
                      itemType="activity"
                      itemId={998}
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Blowfish Breathing Section */}
        <Card className="mb-8 bg-gradient-to-br from-orange-400/20 to-orange-600/20 backdrop-blur-sm border-orange-300/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              🐡 Interactive Blowfish Breathing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BlowfishBreathing 
              size="large"
              breathingPattern="4-4"
              autoPlay={false}
              showInstructions={true}
              imagePath="/blowfish-puffed-royalty-free.svg"
              enableAudio={true}
              audioVolume={0.3}
              onBreathCycleComplete={() => {
                logBreathingActivity(1, 'Blowfish Breathing', 30);
              }}
            />
            <div className="mt-4 text-center">
              <p className="text-white/90 text-sm">
                Follow the blowfish's natural breathing rhythm. Click "Start" to begin breathing with audio cues.
                The fish inflates during inhale and deflates during exhale with matching breathing sounds and bubble effects.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Premium Octopus 4-7-8 Breathing */}
        {isPremium ? (
          <Card className="mb-8 bg-gradient-to-br from-teal-700/80 to-blue-800/80 backdrop-blur-sm border-teal-300/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                🐙 Premium Octopus 4-7-8 Breathing
                <Badge className="bg-yellow-600 text-yellow-100 ml-2">Premium</Badge>
              </CardTitle>
              <p className="text-teal-100 text-sm mt-2">
                Parasympathetic nervous system activation with underwater octopus guide
              </p>
            </CardHeader>
            <CardContent>
              <OctopusBreathing />
              <div className="mt-4 text-center">
                <p className="text-white/90 text-sm">
                  Follow the octopus's tentacle movements through a 4-7-8 breathing pattern. 
                  This technique activates your parasympathetic nervous system for deep relaxation and stress relief.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 bg-gradient-to-br from-teal-700/60 to-blue-800/60 backdrop-blur-sm border-teal-300/30 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🔒</div>
                <h3 className="text-white font-semibold mb-2">Premium Feature</h3>
                <p className="text-white/80 text-sm mb-4">Unlock the Octopus 4-7-8 Breathing technique</p>
                <Button 
                  onClick={handleUpgrade}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Upgrade to Premium
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 opacity-50">
                🐙 Premium Octopus 4-7-8 Breathing
                <Badge className="bg-yellow-600 text-yellow-100 ml-2">Premium</Badge>
              </CardTitle>
              <p className="text-teal-100 text-sm mt-2 opacity-50">
                Parasympathetic nervous system activation with underwater octopus guide
              </p>
            </CardHeader>
            <CardContent className="opacity-50">
              <div className="h-48 bg-teal-900/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-white/60">
                  <div className="text-6xl mb-2">🐙</div>
                  <p className="text-sm">4-7-8 Breathing Pattern</p>
                  <p className="text-xs mt-1">Inhale 4s → Hold 7s → Exhale 8s</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-white/60 text-sm">
                  Premium underwater breathing experience with animated octopus guide and ambient sounds
                </p>
              </div>
            </CardContent>
          </Card>
        )}





        <div className="space-y-8">
          {/* Show active exercise animation */}
          {activeExercise && (
            <Card className="bg-indigo-900/80 backdrop-blur-sm border-indigo-600/40 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-white text-lg font-semibold mb-4 text-center">{activeExercise.title}</h3>
                <div className="bg-violet-800/40 rounded-lg p-6 flex items-center justify-center border border-violet-600/30">
                  {breathingTimers[activeExercise.id]?.isActive ? (
                    <div className="relative flex items-center justify-center">
                      {/* Outer glow ring */}
                      <div className={`absolute w-32 h-32 rounded-full ${getPhaseColor(breathingTimers[activeExercise.id]?.phase)} opacity-20 ${getCircleScale(breathingTimers[activeExercise.id]?.phase)} transition-all duration-1000 ease-in-out`}></div>
                      
                      {/* Main breathing circle */}
                      <div className={`w-24 h-24 rounded-full ${getPhaseColor(breathingTimers[activeExercise.id]?.phase)} transition-all duration-1000 ease-in-out flex items-center justify-center text-white shadow-xl ${getCircleScale(breathingTimers[activeExercise.id]?.phase)}`}>
                        <div className="text-center">
                          <div className="text-lg font-bold">{breathingTimers[activeExercise.id]?.countdown}</div>
                          <div className="text-xs font-medium">{getPhaseInstruction(breathingTimers[activeExercise.id]?.phase)}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-white text-center">
                      <p>Ready to begin {activeExercise.title}</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={() => setActiveExercise(null)}
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/20"
                  >
                    Stop Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <MedicalDisclaimer variant="activities" />
      </div>
    </div>
  );
}