import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlowfishBreathingProps {
  size?: 'small' | 'medium' | 'large';
  breathingPattern?: '4-4' | '4-7-8' | 'box' | 'custom';
  customInhale?: number;
  customExhale?: number;
  customHold?: number;
  autoPlay?: boolean;
  showInstructions?: boolean;
  imagePath?: string;
  enableAudio?: boolean;
  audioVolume?: number;
  onBreathCycleComplete?: () => void;
}

const breathingPatterns = {
  '4-4': { inhale: 6000, exhale: 8000, hold: 0, holdEmpty: 0 },
  '4-7-8': { inhale: 6000, hold: 8000, exhale: 10000, holdEmpty: 0 },
  'box': { inhale: 6000, hold: 6000, exhale: 6000, holdEmpty: 6000 },
};

export default function BlowfishBreathing({
  size = 'large',
  breathingPattern = '4-4',
  customInhale,
  customExhale,
  customHold,
  autoPlay = true,
  showInstructions = true,
  imagePath = '/blowfish-puffed-royalty-free.svg',
  enableAudio = false,
  audioVolume = 0.4,
  onBreathCycleComplete
}: BlowfishBreathingProps) {
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdEmpty'>('inhale');
  const [scale, setScale] = useState(1);
  const [cycleCount, setCycleCount] = useState(0);
  const [isActive, setIsActive] = useState(autoPlay);

  // Audio refs removed to prevent crashes

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-40 h-40',
    large: 'w-56 h-56'
  };

  // Get breathing durations based on pattern or custom values
  const getDurations = () => {
    if (breathingPattern === 'custom') {
      return {
        inhale: customInhale || 4000,
        exhale: customExhale || 4000,
        hold: customHold || 0,
        holdEmpty: 0
      };
    }
    return breathingPatterns[breathingPattern];
  };

  const durations = getDurations();

  // Audio setup removed

  useEffect(() => {
    if (!isActive) return;

    let timeout: NodeJS.Timeout;

    // Audio disabled to prevent crashes

    const runBreathingCycle = () => {
      switch (breathingPhase) {
        case 'inhale':
          setScale(1.4);
          timeout = setTimeout(() => {
            if (durations.hold > 0) {
              setBreathingPhase('hold');
            } else {
              setBreathingPhase('exhale');
            }
          }, durations.inhale);
          break;

        case 'hold':
          timeout = setTimeout(() => {
            setBreathingPhase('exhale');
          }, durations.hold);
          break;

        case 'exhale':
          setScale(1);
          timeout = setTimeout(() => {
            if (durations.holdEmpty && durations.holdEmpty > 0) {
              setBreathingPhase('holdEmpty');
            } else {
              setBreathingPhase('inhale');
              setCycleCount(prev => prev + 1);
              if (onBreathCycleComplete) {
                onBreathCycleComplete();
              }
            }
          }, durations.exhale);
          break;

        case 'holdEmpty':
          timeout = setTimeout(() => {
            setBreathingPhase('inhale');
            setCycleCount(prev => prev + 1);
            if (onBreathCycleComplete) {
              onBreathCycleComplete();
            }
          }, durations.holdEmpty);
          break;
      }
    };

    runBreathingCycle();
    return () => clearTimeout(timeout);
  }, [breathingPhase, isActive, durations, onBreathCycleComplete, enableAudio]);

  const getInstructionText = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Inhale...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Exhale...';
      case 'holdEmpty': return 'Hold empty...';
      default: return 'Breathe...';
    }
  };

  const getPhaseColor = () => {
    switch (breathingPhase) {
      case 'inhale': return 'text-blue-600';
      case 'hold': return 'text-purple-600';
      case 'exhale': return 'text-green-600';
      case 'holdEmpty': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  };

  const toggleBreathing = () => {
    setIsActive(prev => {
      const newActive = !prev;
      
      // Audio will be handled by individual breathing phases
      
      return newActive;
    });
  };

  const resetBreathing = () => {
    setBreathingPhase('inhale');
    setScale(1);
    setCycleCount(0);
    setIsActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl">
      {showInstructions && (
        <h2 className="text-2xl font-bold mb-6 text-blue-900 text-center">
          Breathe with the Blowfish
        </h2>
      )}

      <div className="relative flex items-center justify-center mb-6">
        <motion.div
          className={`${sizeClasses[size]} relative cursor-pointer rounded-full overflow-hidden`}
          onClick={toggleBreathing}
          animate={{
            scale: scale,
          }}
          transition={{
            duration: breathingPhase === 'inhale' ? durations.inhale / 1000 : durations.exhale / 1000,
            ease: 'easeInOut'
          }}
          whileHover={{ scale: scale * 1.05 }}
          whileTap={{ scale: scale * 0.95 }}
        >
          {/* Realistic Blowfish Images */}
          <div className="w-full h-full relative">
            <motion.img 
              src="/bd8bd0cc-46db-449e-8890-5978d0e7bc0b.png"
              alt="Blowfish breathing guide"
              className="w-full h-full object-cover rounded-full border-4 border-cyan-300"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(79, 209, 197, 0.5))'
              }}
              animate={{
                opacity: 1
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
            />
            {false && (
              /* Enhanced Blowfish with breathing-focused design */
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 shadow-lg border-orange-600"
                animate={{
                  boxShadow: breathingPhase === 'inhale' 
                    ? '0 0 30px rgba(249, 115, 22, 0.6), 0 0 60px rgba(249, 115, 22, 0.3)'
                    : '0 0 15px rgba(249, 115, 22, 0.4)',
                  borderWidth: breathingPhase === 'inhale' ? '4px' : '2px'
                }}
              />
            )}

            {/* Breathing effects for non-SVG images */}
            {!imagePath.endsWith('.svg') && (
              <AnimatePresence>
                {(breathingPhase === 'inhale' || breathingPhase === 'hold') && (
                  <>
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-4 bg-gray-700 rounded-full origin-bottom"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${size === 'large' ? '28px' : size === 'medium' ? '22px' : '16px'})`
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.8 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ 
                          delay: i * 0.03, 
                          duration: 0.4,
                          ease: 'easeOut'
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            )}

            {/* Eyes and mouth for non-SVG images */}
            {!imagePath.endsWith('.svg') && (
              <>
                <motion.div 
                  className="absolute top-1/4 left-1/4 w-3 h-3 bg-black rounded-full"
                  animate={{
                    scaleY: (breathingPhase === 'hold' || breathingPhase === 'holdEmpty') ? 0.2 : 1
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div 
                  className="absolute top-1/4 right-1/4 w-3 h-3 bg-black rounded-full"
                  animate={{
                    scaleY: (breathingPhase === 'hold' || breathingPhase === 'holdEmpty') ? 0.2 : 1
                  }}
                  transition={{ duration: 0.2 }}
                />

                <motion.div
                  className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 bg-gray-700 rounded-full"
                  animate={{
                    width: breathingPhase === 'inhale' ? '8px' : '12px',
                    height: breathingPhase === 'inhale' ? '8px' : '4px',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </>
            )}

            {/* Breathing particles */}
            <AnimatePresence>
              {breathingPhase === 'exhale' && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-2 h-2 bg-cyan-300 rounded-full opacity-70"
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
      </div>

      {/* Breathing instructions and phase indicator */}
      {showInstructions && (
        <div className="text-center space-y-3">
          <motion.p 
            className={`text-xl font-semibold ${getPhaseColor()}`}
            animate={{ scale: breathingPhase === 'inhale' ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {getInstructionText()}
          </motion.p>
          
          <div className="text-sm text-gray-600">
            <p>Pattern: {breathingPattern.toUpperCase()}</p>
            <p>Cycles completed: {cycleCount}</p>
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={toggleBreathing}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
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
      </div>

      {!autoPlay && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          Click the blowfish to start/pause breathing exercise
        </p>
      )}

      {/* Audio removed to prevent crashes */}
    </div>
  );
}