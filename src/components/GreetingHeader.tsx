import React, { useState, useEffect } from 'react';
import CharacterSelector from './character-selector';
import WellnessCharacter from './wellness-character';

interface Props {
  userName: string;
}

export default function GreetingHeader({ userName }: Props) {
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('max');
  const [daysUsed, setDaysUsed] = useState(1);

  useEffect(() => {
    // Load selected character from localStorage
    const savedCharacter = localStorage.getItem('selectedCharacter');
    if (savedCharacter) {
      setSelectedCharacter(savedCharacter);
    }

    // Calculate days used
    const startDate = localStorage.getItem('appStartDate');
    if (startDate) {
      const daysSinceStart = Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setDaysUsed(Math.max(1, daysSinceStart));
    } else {
      // First time - set start date
      localStorage.setItem('appStartDate', new Date().toISOString());
      setDaysUsed(1);
    }
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
    localStorage.setItem('selectedCharacter', characterId);
    setShowCharacterSelector(false);
  };

  return (
    <>
      <div className="text-center mt-8 mb-8">
        {/* Greeting and user info */}
        <h1 className="text-3xl font-bold text-gray-800 text-center drop-shadow mb-2">
          {getTimeBasedGreeting()}, {userName}!
        </h1>
        
        {/* Character Display - clickable to open selector - centered where name was */}
        <div 
          onClick={() => setShowCharacterSelector(true)}
          className="cursor-pointer hover:scale-105 transition-transform mb-4 flex justify-center"
        >
          <WellnessCharacter 
            characterId={selectedCharacter}
            size="lg"
            mood="happy"
          />
        </div>
        
        <p className="text-lg text-gray-600 mb-1">
          Day {daysUsed} active with S.O.M.E fitness method
        </p>
      </div>

      {/* Character Selector Modal */}
      <CharacterSelector
        isOpen={showCharacterSelector}
        onClose={() => setShowCharacterSelector(false)}
        currentCharacter={selectedCharacter}
        onCharacterSelect={handleCharacterSelect}
        daysUsed={daysUsed}
      />
    </>
  );
}