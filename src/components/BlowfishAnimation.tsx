import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlowfishAnimationProps {
  size?: 'small' | 'medium' | 'large';
  autoPlay?: boolean;
  onAnimationComplete?: () => void;
}

export default function BlowfishAnimation({ 
  size = 'medium', 
  autoPlay = true,
  onAnimationComplete 
}: BlowfishAnimationProps) {
  const [isInflated, setIsInflated] = useState(false);
  const [animationCycle, setAnimationCycle] = useState(0);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24', 
    large: 'w-32 h-32'
  };

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setIsInflated(prev => !prev);
      setAnimationCycle(prev => prev + 1);
      
      if (onAnimationComplete && animationCycle > 0 && animationCycle % 2 === 0) {
        onAnimationComplete();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [autoPlay, animationCycle, onAnimationComplete]);

  const handleClick = () => {
    if (!autoPlay) {
      setIsInflated(prev => !prev);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} cursor-pointer relative`}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isInflated ? 'inflated' : 'normal'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              duration: 0.6,
              ease: "easeInOut",
              type: "spring",
              stiffness: 200
            }}
            className="w-full h-full relative"
          >
            {/* Blowfish Body */}
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 shadow-lg ${
                isInflated ? 'border-4 border-orange-600' : 'border-2 border-orange-400'
              }`}
              animate={{
                scale: isInflated ? 1.3 : 1,
                rotateY: isInflated ? 10 : 0
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* Spikes when inflated */}
            <AnimatePresence>
              {isInflated && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-3 bg-gray-600 rounded-full origin-bottom"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${size === 'large' ? '20px' : size === 'medium' ? '16px' : '12px'})`
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Eyes */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-black rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-black rounded-full"></div>

            {/* Mouth */}
            <motion.div
              className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-gray-700 rounded-full"
              animate={{
                scaleX: isInflated ? 0.6 : 1,
                scaleY: isInflated ? 1.5 : 1
              }}
            />

            {/* Fins */}
            <motion.div
              className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-4 bg-orange-400 rounded-r-full"
              animate={{
                scaleX: isInflated ? 0.7 : 1,
                x: isInflated ? -2 : 0
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Bubble effects */}
        <AnimatePresence>
          {isInflated && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`bubble-${i}`}
                  className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-60"
                  style={{
                    left: `${30 + i * 15}%`,
                    top: `${20 + i * 10}%`
                  }}
                  initial={{ scale: 0, y: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    y: [-10, -20, -30],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Animation controls hint */}
      {!autoPlay && (
        <div className="ml-4 text-sm text-gray-600">
          Click to {isInflated ? 'deflate' : 'inflate'}
        </div>
      )}
    </div>
  );
}