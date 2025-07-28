import React, { useState, useEffect } from 'react';
import './AnimatedBlowfish.css';
import GoodJobBadge from './GoodJobBadge';

export default function AnimatedBlowfish() {
  const [isInhaling, setIsInhaling] = useState(true);
  const [breathCount, setBreatheCount] = useState(0);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsInhaling(prev => {
        if (!prev) { // switching from exhale to inhale (completing a cycle)
          setBreatheCount(count => {
            const newCount = count + 1;
            if (newCount === 5 && !showBadge) {
              setShowBadge(true);
              setTimeout(() => setShowBadge(false), 3000); // hide after 3 seconds
            }
            return newCount;
          });
        }
        return !prev;
      });
    }, 8000); // 4s in, 4s out
    return () => clearInterval(interval);
  }, [showBadge]);

  return (
    <div className="blowfish-container">
      <div className={`blowfish ${isInhaling ? 'inhale' : 'exhale'}`}>
        <img
          src="/bd8bd0cc-46db-449e-8890-5978d0e7bc0b.png"
          alt="Blowfish"
          className="blowfish-img"
        />
        <div className="eye-blink left-eye" />
        <div className="eye-blink right-eye" />
      </div>
      <p className="breath-text">{isInhaling ? 'Inhale...' : 'Exhale...'}</p>
      
      {showBadge && (
        <GoodJobBadge 
          onClose={() => setShowBadge(false)}
          message="Great job completing 5 breaths!"
        />
      )}
      
      <div className="breath-counter">
        Breaths: {breathCount}
      </div>
    </div>
  );
}