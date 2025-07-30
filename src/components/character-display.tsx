import { useTheme } from '@/hooks/use-theme';
import { useState, useEffect } from 'react';
import { Sun, Cloud, Moon, Star, Coffee, TreePine } from 'lucide-react';
import { characters, type Character } from './character-selector';
import CharacterImageDisplay from './character-image-display';

interface CharacterDisplayProps {
  characterId: string;
  size?: 'small' | 'medium' | 'large';
  mood?: 'happy' | 'calm' | 'sleepy' | 'energetic';
  showAnimation?: boolean;
}

export default function CharacterDisplay({ 
  characterId, 
  size = 'medium', 
  mood = 'happy', 
  showAnimation = false 
}: CharacterDisplayProps) {
  const { timeOfDay } = useTheme();
  const [animation, setAnimation] = useState('');
  
  const selectedCharacter = characters.find(c => c.id === characterId) || characters[0];

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  const nameSizeClasses = {
    small: 'text-[0.5rem]',
    medium: 'text-xs',
    large: 'text-sm'
  };

  const getCharacterDisplay = () => {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CharacterImageDisplay
          characterId={selectedCharacter.id}
          characterName={selectedCharacter.name}
          characterEmoji={selectedCharacter.emoji}
          size={size}
          showUpload={false}
        />
      </div>
    );
  };

  const getCharacterColor = () => {
    if (timeOfDay === 'morning') return 'text-orange-500';
    if (timeOfDay === 'afternoon') return 'text-blue-500';
    return 'text-purple-400';
  };

  const getBackgroundGradient = () => {
    if (timeOfDay === 'morning') return 'morning-gradient';
    if (timeOfDay === 'afternoon') return 'afternoon-gradient';
    return 'evening-gradient';
  };

  const getTimeIcon = () => {
    if (timeOfDay === 'morning') return <Sun className="w-3 h-3" />;
    if (timeOfDay === 'afternoon') return <Cloud className="w-3 h-3" />;
    return <Moon className="w-3 h-3" />;
  };

  useEffect(() => {
    if (showAnimation) {
      setAnimation('animate-bounce');
      const timer = setTimeout(() => setAnimation(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [timeOfDay, showAnimation]);

  return (
    <div className="relative">
      {/* Character Circle */}
      <div className={`
        ${sizeClasses[size]} 
        rounded-full 
        ${getBackgroundGradient()}
        flex items-center justify-center
        shadow-lg
        character-${timeOfDay}
        ${animation}
        border-2 border-white/20
        relative overflow-hidden
        transition-all duration-300
      `}>
        {/* Ambient particles for evening */}
        {timeOfDay === 'evening' && (
          <div className="absolute inset-0">
            <Star className="absolute top-1 left-1 w-1.5 h-1.5 text-yellow-300" />
            <Star className="absolute top-2 right-2 w-1 h-1 text-yellow-200" />
            <Star className="absolute bottom-2 left-2 w-0.5 h-0.5 text-yellow-100" />
          </div>
        )}

        {/* Morning elements */}
        {timeOfDay === 'morning' && (
          <div className="absolute inset-0">
            <Coffee className="absolute top-1 right-1 w-2 h-2 text-amber-600 opacity-30" />
            <Sun className="absolute bottom-1 left-1 w-2 h-2 text-yellow-500 opacity-40" />
          </div>
        )}

        {/* Afternoon elements */}
        {timeOfDay === 'afternoon' && (
          <div className="absolute inset-0">
            <TreePine className="absolute top-1 left-1 w-2 h-2 text-green-600 opacity-30" />
            <Cloud className="absolute bottom-1 right-1 w-2 h-2 text-sky-400 opacity-40" />
          </div>
        )}

        {/* Character Face and Name */}
        <div className="flex flex-col items-center justify-center z-10 relative w-full h-full">
          <div className="w-full h-full flex items-center justify-center">
            {getCharacterDisplay()}
          </div>
        </div>
      </div>


    </div>
  );
}