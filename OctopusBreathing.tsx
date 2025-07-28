import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import GoodJobBadge from './GoodJobBadge';

interface OctopusBreathingProps {
  onClose?: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

export default function OctopusBreathing({ onClose }: OctopusBreathingProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('pause');
  const [cycleCount, setCycleCount] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [totalCycles] = useState(4);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showBadge, setShowBadge] = useState(false);
  const [scale, setScale] = useState(1);
  const { logBreathingActivity } = useActivityLogger();
  
  const inhaleAudioRef = useRef<HTMLAudioElement | null>(null);
  const exhaleAudioRef = useRef<HTMLAudioElement | null>(null);
  const bubbleAudioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // 4-7-8 breathing pattern timings (in seconds)
  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 2
  };

  const phaseInstructions = {
    inhale: 'Inhale...',
    hold: 'Hold...',
    exhale: 'Exhale...',
    pause: 'Rest...'
  };

  const playPhaseAudio = (phase: BreathingPhase) => {
    if (!audioEnabled) return;
    
    try {
      switch (phase) {
        case 'inhale':
          if (inhaleAudioRef.current) {
            inhaleAudioRef.current.currentTime = 0;
            inhaleAudioRef.current.volume = 0.3;
            inhaleAudioRef.current.play().catch(() => {});
          }
          break;
        case 'exhale':
          if (exhaleAudioRef.current) {
            exhaleAudioRef.current.currentTime = 0;
            exhaleAudioRef.current.volume = 0.3;
            exhaleAudioRef.current.play().catch(() => {});
          }
          // Play bubble sounds during exhale
          if (bubbleAudioRef.current) {
            setTimeout(() => {
              if (bubbleAudioRef.current && audioEnabled) {
                bubbleAudioRef.current.currentTime = 0;
                bubbleAudioRef.current.volume = 0.3;
                bubbleAudioRef.current.play().catch(() => {});
              }
            }, 2000);
            setTimeout(() => {
              if (bubbleAudioRef.current && audioEnabled) {
                bubbleAudioRef.current.currentTime = 0;
                bubbleAudioRef.current.volume = 0.3;
                bubbleAudioRef.current.play().catch(() => {});
              }
            }, 4000);
          }
          break;
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const getOctopusImage = () => {
    switch (currentPhase) {
      case 'inhale':
        return '/octopus closed.png'; // Closed/contracted state for inhale
      case 'hold':
        return '/octopus closed.png'; // Keep closed during hold
      case 'exhale':
        return '/octopus pus open.png'; // Open/expanded state for exhale (note: filename has typo "pus")
      case 'pause':
        return '/octopus closed.png'; // Pause state
      default:
        return '/octopus closed.png';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'text-teal-600';
      case 'hold': return 'text-blue-600';
      case 'exhale': return 'text-cyan-600';
      case 'pause': return 'text-gray-600';
      default: return 'text-teal-600';
    }
  };

  useEffect(() => {
    if (isActive && cycleCount < totalCycles) {
      const currentDuration = phaseDurations[currentPhase];
      setPhaseTimeLeft(currentDuration);
      
      // Update scale based on breathing phase
      switch (currentPhase) {
        case 'inhale':
          setScale(1.4);
          break;
        case 'hold':
          setScale(1.3);
          break;
        case 'exhale':
          setScale(1.0);
          break;
        case 'pause':
          setScale(1.1);
          break;
      }
      
      intervalRef.current = setInterval(() => {
        setPhaseTimeLeft(prev => {
          if (prev <= 1) {
            // Show badge after completing all cycles
            if (cycleCount >= totalCycles - 1 && currentPhase === 'pause') {
              setShowBadge(true);
            }
            // Move to next phase
            switch (currentPhase) {
              case 'inhale':
                setCurrentPhase('hold');
                playPhaseAudio('hold');
                break;
              case 'hold':
                setCurrentPhase('exhale');
                playPhaseAudio('exhale');
                break;
              case 'exhale':
                setCurrentPhase('pause');
                playPhaseAudio('pause');
                break;
              case 'pause':
                if (cycleCount < totalCycles - 1) {
                  setCurrentPhase('inhale');
                  setCycleCount(prev => prev + 1);
                  playPhaseAudio('inhale');
                } else {
                  setIsActive(false);
                  handleStop();
                }
                break;
            }
            return prev - 1;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentPhase, isActive, cycleCount, totalCycles, audioEnabled]);

  const startBreathing = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setCycleCount(0);
    startTimeRef.current = Date.now();
    playPhaseAudio('inhale');
  };

  const pauseBreathing = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentPhase('pause');
    setCycleCount(0);
    setPhaseTimeLeft(0);
    setScale(1);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Log the activity
    if (startTimeRef.current > 0) {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      logBreathingActivity(1, '4-7-8 Octopus Breathing', duration);
      startTimeRef.current = 0;
    }
    
    // Stop all audio
    try {
      [inhaleAudioRef.current, exhaleAudioRef.current, bubbleAudioRef.current].forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    } catch (error) {
      // Silent error handling
    }
  };

  const resetBreathing = () => {
    handleStop();
    setCurrentPhase('pause');
  };

  const toggleBreathing = () => {
    if (isActive) {
      pauseBreathing();
    } else {
      startBreathing();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-teal-900 text-center">
        4-7-8 Octopus Breathing
      </h2>

      <div className="relative flex flex-col items-center justify-center mb-6">
        <motion.div
          className="w-56 h-56 relative cursor-pointer rounded-full overflow-hidden mb-4"
          onClick={toggleBreathing}
          animate={{
            scale: scale,
          }}
          transition={{
            duration: phaseDurations[currentPhase] || 1,
            ease: 'easeInOut'
          }}
          whileHover={{ scale: scale * 1.05 }}
          whileTap={{ scale: scale * 0.95 }}
        >
          {/* Octopus Image */}
          <div className="w-full h-full relative">
            <motion.img 
              src={getOctopusImage()}
              alt={`Octopus ${currentPhase}`}
              className="w-full h-full object-cover rounded-full border-4 border-teal-300"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(13, 148, 136, 0.5))'
              }}
              animate={{
                opacity: 1
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
            />

            {/* Breathing particles for octopus */}
            <AnimatePresence>
              {currentPhase === 'exhale' && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-2 h-2 bg-teal-300 rounded-full opacity-70"
                      style={{
                        left: `${45 + i * 3}%`,
                        top: `${30 + i * 5}%`
                      }}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1, 0.5],
                        x: [0, 20 + i * 10, 40 + i * 15],
                        y: [0, -10 - i * 5, -20 - i * 8],
                        opacity: [0, 0.8, 0]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        ease: 'easeOut'
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>


          </div>
        </motion.div>

        {/* Breathing instructions and phase indicator - moved below circle */}
        <div className="text-center space-y-3">
          <motion.p 
            className={`text-xl font-semibold ${getPhaseColor()}`}
            animate={{ scale: currentPhase === 'inhale' ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {phaseInstructions[currentPhase]}
          </motion.p>
          
          {isActive && (
            <p className="text-lg text-teal-600">
              {phaseTimeLeft}s remaining
            </p>
          )}
          
          <div className="text-sm text-gray-600">
            <p>Pattern: 4-7-8</p>
            <p>Cycle {cycleCount}/{totalCycles}</p>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={toggleBreathing}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-teal-500 hover:bg-teal-600 text-white'
          }`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetBreathing}
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          Reset
        </button>

        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
        >
          {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Click the octopus to start/pause breathing exercise
      </p>

      {/* Completion Message */}
      {cycleCount >= totalCycles && !isActive && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mt-4">
          <div className="text-green-800 font-semibold">
            🎉 Breathing session complete!
          </div>
          <div className="text-green-600 text-sm mt-1">
            You've completed {totalCycles} cycles of deep relaxation
          </div>
        </div>
      )}

      {/* Good Job Badge for completing cycles */}
      {showBadge && (
        <GoodJobBadge 
          onClose={() => setShowBadge(false)}
          message="Amazing! You completed 4 octopus breathing cycles! 🐙"
          stickerType="octopus"
        />
      )}

      {/* Audio Files for Breathing Sounds */}
      <audio ref={inhaleAudioRef} preload="metadata" style={{ display: 'none' }}>
        <source src="/breath-in-242641.mp3" type="audio/mpeg" />
      </audio>
      
      <audio ref={exhaleAudioRef} preload="metadata" style={{ display: 'none' }}>
        <source src="/breath-out-242642.mp3" type="audio/mpeg" />
      </audio>
      
      <audio ref={bubbleAudioRef} preload="metadata" style={{ display: 'none' }}>
        <source src="/bubble-sound-43207.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}