import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Clock, Heart, Volume2, Waves } from 'lucide-react';
import FavoriteButton from "./favorite-button";
import WorkingAudioPlayer from '@/components/working-audio-player';

interface BreathingExercise {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  inhaleCount: number;
  holdCount?: number;
  exhaleCount: number;
  holdEmptyCount?: number;
  benefits: string[];
  instructions: string[];
  audioType?: 'nature' | 'guided' | 'binaural';
  audioDescription?: string;
  audioFile?: string;
}

const breathingExercises: BreathingExercise[] = [
  {
    id: '4-7-8',
    title: '4-7-8 Breathing Technique',
    description: 'Guided anxiety relief technique with soothing audio support',
    duration: 300, // 5 minutes
    difficulty: 'Easy',
    inhaleCount: 4,
    holdCount: 7,
    exhaleCount: 8,
    benefits: [
      'Reduces anxiety and stress',
      'Promotes better sleep',
      'Activates parasympathetic nervous system',
      'Improves focus and concentration'
    ],
    audioType: 'guided',
    audioDescription: 'Guided 4-7-8 breathing with gentle background sounds',
    audioFile: '/assets/audio/breathing/4-7-8-breathing.mp3',
    instructions: [
      'Sit comfortably with your back straight',
      'Put on headphones for the guided audio',
      'Close your mouth and inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale completely through your mouth for 8 counts',
      'Follow the audio guidance and repeat the cycle'
    ]
  },

  {
    id: 'mindfulness-breath',
    title: 'Mindfulness Meditation on Breath',
    description: 'Guided breath awareness meditation',
    duration: 900, // 15 minutes
    difficulty: 'Easy',
    inhaleCount: 4,
    exhaleCount: 4,
    benefits: [
      'Develops breath awareness',
      'Improves concentration',
      'Reduces mind wandering',
      'Builds meditation foundation'
    ],
    audioType: 'guided',
    audioDescription: 'Breath awareness with gentle rain sounds',
    audioFile: '/assets/audio/breathing/mindfulness-meditation-on-breath (2).mp3',
    instructions: [
      'Sit comfortably with straight posture',
      'Close your eyes and relax',
      'Follow the guided instructions',
      'Focus attention on your natural breath',
      'Gently return when mind wanders',
      'Continue for 10-20 minutes'
    ]
  },
  {
    id: 'breathing-retraining',
    title: 'Breathing Retraining',
    description: 'Therapeutic breathing technique for anxiety',
    duration: 600, // 10 minutes
    difficulty: 'Medium',
    inhaleCount: 4,
    exhaleCount: 6,
    benefits: [
      'Retrains breathing patterns',
      'Reduces hyperventilation',
      'Calms nervous system',
      'Therapeutic for anxiety'
    ],
    audioType: 'guided',
    audioDescription: 'Clinical breathing retraining guidance',
    audioFile: '/assets/audio/breathing/breathing-retraining-updated.mp3',
    instructions: [
      'Sit or lie down comfortably',
      'Place one hand on chest, one on belly',
      'Follow the therapeutic guidance',
      'Breathe slowly and deeply',
      'Focus on belly movement',
      'Practice regularly for best results'
    ]
  },
  {
    id: 'ten-breath-practice',
    title: 'Ten Breath Practice',
    description: 'Calming practice for stress and anxiety relief',
    duration: 300, // 5 minutes
    difficulty: 'Easy',
    inhaleCount: 3,
    exhaleCount: 5,
    benefits: [
      'Quick stress relief',
      'Accessible anywhere',
      'Builds breathing skills',
      'Effective for beginners'
    ],
    audioType: 'guided',
    audioDescription: 'Simple ten-breath calming technique',
    audioFile: '/assets/audio/breathing/ten-breath-practice-updated.mp3',
    instructions: [
      'Find a comfortable position',
      'Take a moment to settle',
      'Follow the ten breath sequence',
      'Count each breath mindfully',
      'Use whenever you need calm',
      'Perfect for quick breaks'
    ]
  },
  {
    id: 'diaphragmatic',
    title: 'Diaphragmatic Breathing',
    description: 'Strengthens the diaphragm with guided audio instruction',
    duration: 900, // 15 minutes
    difficulty: 'Medium',
    inhaleCount: 6,
    exhaleCount: 8,
    benefits: [
      'Strengthens diaphragm muscle',
      'Improves oxygen exchange',
      'Reduces blood pressure',
      'Enhances relaxation response'
    ],
    instructions: [
      'Lie down with knees bent, feet flat on floor',
      'Place one hand on chest, one on belly',
      'Breathe slowly through nose',
      'Focus on expanding belly, not chest',
      'Exhale slowly through pursed lips',
      'Practice for 10-20 minutes daily'
    ]
  },
  {
    id: 'coherent',
    title: 'Coherent Breathing (5-5 Rhythm)',
    description: 'Balances heart rate variability and optimizes heart-brain coherence',
    duration: 1200, // 20 minutes
    difficulty: 'Easy',
    inhaleCount: 5,
    exhaleCount: 5,
    benefits: [
      'Balances heart rate variability',
      'Reduces stress and anxiety',
      'Improves emotional regulation',
      'Enhances mental clarity'
    ],
    audioType: 'nature',
    audioDescription: 'Coherent breathing with flowing water sounds',
    audioFile: '/assets/audio/ambient/mixkit-natural-ambience-with-flowing-water-and-birds-61 (1).wav',
    instructions: [
      'Sit comfortably with eyes closed',
      'Inhale for 5 seconds through nose',
      'Exhale for 5 seconds through nose',
      'Maintain steady, smooth rhythm',
      'Continue for 10-20 minutes',
      'Focus on the counting rhythm'
    ]
  }
];

interface BreathingExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BreathingExerciseModal({ isOpen, onClose }: BreathingExerciseModalProps) {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdEmpty'>('inhale');
  const [countdown, setCountdown] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Cleanup audio when modal closes or component unmounts
  useEffect(() => {
    if (!isOpen && audio) {
      audio.pause();
      audio.src = '';
      audio.load();
      setAudio(null);
    }
  }, [isOpen, audio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
        audio.load();
      }
    };
  }, []);

  useEffect(() => {
    if (!isRunning || !selectedExercise) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Move to next phase
          switch (currentPhase) {
            case 'inhale':
              if (selectedExercise.holdCount) {
                setCurrentPhase('hold');
                return selectedExercise.holdCount;
              } else {
                setCurrentPhase('exhale');
                return selectedExercise.exhaleCount;
              }
            case 'hold':
              setCurrentPhase('exhale');
              return selectedExercise.exhaleCount;
            case 'exhale':
              if (selectedExercise.holdEmptyCount) {
                setCurrentPhase('holdEmpty');
                return selectedExercise.holdEmptyCount;
              } else {
                setCurrentPhase('inhale');
                setCycleCount(c => c + 1);
                return selectedExercise.inhaleCount;
              }
            case 'holdEmpty':
              setCurrentPhase('inhale');
              setCycleCount(c => c + 1);
              return selectedExercise.inhaleCount;
          }
        }
        return prev - 1;
      });

      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, currentPhase, selectedExercise]);

  const startExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setIsRunning(true);
    setCurrentPhase('inhale');
    setCountdown(exercise.inhaleCount);
    setCycleCount(0);
    setTimeRemaining(exercise.duration);
    
    // Initialize audio if available
    if (exercise.audioFile && audioEnabled) {
      try {
        const audioElement = new Audio(exercise.audioFile);
        audioElement.loop = false; // NO LOOPING to prevent stuck audio
        audioElement.volume = 0.6;
        setAudio(audioElement);
        
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Audio playback failed:', error);
          });
        }
      } catch (error) {
        console.log('Audio creation failed:', error);
      }
    }
  };

  const pauseResume = () => {
    setIsRunning(!isRunning);
  };

  const resetExercise = () => {
    setIsRunning(false);
    setCurrentPhase('inhale');
    setCountdown(0);
    setCycleCount(0);
    setTimeRemaining(0);
    
    // Stop and cleanup audio immediately
    if (audio) {
      audio.pause();
      audio.src = '';
      audio.load();
      setAudio(null);
    }
    setSelectedExercise(null);
    
    // Stop audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    if (audio) {
      if (audioEnabled) {
        audio.pause();
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Audio toggle failed:', error);
          });
        }
      }
    }
  };

  const getPhaseInstructions = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'holdEmpty':
        return 'Hold Empty';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'bg-gradient-to-br from-blue-400 to-blue-600';
      case 'hold':
        return 'bg-gradient-to-br from-purple-400 to-purple-600';
      case 'exhale':
        return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'holdEmpty':
        return 'bg-gradient-to-br from-orange-400 to-orange-600';
    }
  };

  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'scale-125';
      case 'hold':
        return 'scale-110';
      case 'exhale':
        return 'scale-75';
      case 'holdEmpty':
        return 'scale-90';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {!selectedExercise ? (
          // Exercise Selection
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Choose Breathing Exercise</h2>
              <Button variant="ghost" onClick={() => {
                resetExercise();
                onClose();
              }}>×</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {breathingExercises.map((exercise) => (
                <Card key={exercise.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{exercise.title}</CardTitle>
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{exercise.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {Math.floor(exercise.duration / 60)} minutes
                      </div>
                      {exercise.audioType && (
                        <div className="flex items-center gap-1">
                          {exercise.audioType === 'nature' && <Waves className="h-4 w-4" />}
                          {exercise.audioType === 'guided' && <Volume2 className="h-4 w-4" />}
                          {exercise.audioType === 'binaural' && <Heart className="h-4 w-4" />}
                          <span className="capitalize">{exercise.audioType}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Benefits:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {exercise.benefits.slice(0, 2).map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        {exercise.audioFile && (
                          <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            <span>🎵 Audio available</span>
                            <Button
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAudioEnabled(!audioEnabled);
                              }}
                              className="h-auto p-1"
                            >
                              <Volume2 className={`h-3 w-3 ${audioEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                            </Button>
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => startExercise(exercise)}
                            className="flex-1"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Exercise
                          </Button>
                          <FavoriteButton 
                            userId={1}
                            itemType="activity"
                            itemId={exercise.id.length > 10 ? 300 + parseInt(exercise.id.slice(-1)) : 300} 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Exercise Session
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedExercise.title}</h2>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={resetExercise}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => {
                  resetExercise();
                  onClose();
                }}>×</Button>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-8">
              {/* Breathing Circle */}
              <div className="relative flex items-center justify-center">
                {/* Outer glow ring */}
                <div className={`absolute w-64 h-64 rounded-full ${getPhaseColor()} opacity-20 ${getCircleScale()} transition-all duration-1000 ease-in-out`}></div>
                
                {/* Main breathing circle */}
                <div 
                  className={`w-48 h-48 rounded-full ${getPhaseColor()} transition-all duration-1000 ease-in-out flex items-center justify-center text-white shadow-2xl ${getCircleScale()}`}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold drop-shadow-lg">{countdown}</div>
                    <div className="text-xl font-medium drop-shadow-md">{getPhaseInstructions()}</div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{cycleCount}</div>
                  <div className="text-sm text-gray-600">Cycles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Time Left</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                <Button onClick={pauseResume} size="lg">
                  {isRunning ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </Button>
                <Button variant="outline" onClick={resetExercise} size="lg">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Instructions */}
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-lg">Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index}>
                        <span className="font-medium">{index + 1}.</span> {instruction}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}