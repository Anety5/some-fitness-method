import React, { useState, useEffect } from 'react';
import './FloatingBlowfish.css'; // <- Create this CSS file

interface FloatingBlowfishProps {
  imageStyle?: 'realistic' | 'cartoon';
  breathingDuration?: number; // in milliseconds per cycle (default 8000)
}

export default function FloatingBlowfish({ 
  imageStyle = 'realistic',
  breathingDuration = 8000 
}: FloatingBlowfishProps) {
  const [isInhaling, setIsInhaling] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsInhaling(prev => !prev);
    }, breathingDuration); // Configurable breathing cycle

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="breathing-container">
      <div
        className={`blowfish-wrapper ${isInhaling ? 'inhale' : 'exhale'}`}
      >
        <img 
          src={imageStyle === 'cartoon' ? '/cartoon-pufferfish.png' : '/realistic-pufferfish.png'} 
          alt="Blowfish" 
          className={`blowfish-image ${imageStyle === 'cartoon' ? 'cartoon-style' : 'realistic-style'}`} 
        />
        <div className="fin left-fin" />
        <div className="fin right-fin" />
      </div>
      <p className="breath-label">{isInhaling ? 'Inhale...' : 'Exhale...'}</p>
    </div>
  );
}