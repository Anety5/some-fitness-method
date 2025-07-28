import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Lock, Unlock } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  description: string;
  personality: string;
  unlockRequirement: number; // days of app usage
  unlockDescription: string;
  specialties: string[];
}

// Character unlock logic - following the established approach
const CHARACTER_UNLOCK_SCHEDULE = {
  max: 0, mia: 0, kai: 28, zeke: 14, luna: 21, nova: 42, gunner: 56
};

const getUnlockedCharacters = (wellnessJourneyStartDate: Date) => {
  const daysSinceStart = Math.floor((Date.now() - wellnessJourneyStartDate.getTime()) / (1000 * 60 * 60 * 24));
  return Object.entries(CHARACTER_UNLOCK_SCHEDULE)
    .filter(([_, days]) => daysSinceStart >= days)
    .map(([character, _]) => character);
};

export const characters: Character[] = [
  {
    id: 'max',
    name: 'Max',
    emoji: '🏃‍♂️',
    image: '/assets/characters/max.png',
    description: 'Friendly personal trainer focused on overall wellness',
    personality: 'Encouraging, patient, and motivational. Focuses on building healthy habits and personal growth.',
    unlockRequirement: 0,
    unlockDescription: 'Available from start',
    specialties: ['Personal Training', 'Motivation', 'Habit Building']
  },
  {
    id: 'mia',
    name: 'Mia',
    emoji: '🏋️‍♀️',
    image: '/assets/characters/mia-avatar.png',
    description: 'High-energy personal trainer and fitness coach',
    personality: 'Fit, energetic, and dynamic. Loves resistance training and keeping your energy levels high.',
    unlockRequirement: 0,
    unlockDescription: 'Available from start',
    specialties: ['Strength Training', 'Resistance Workouts', 'High-Energy Fitness']
  },
  {
    id: 'zeke',
    name: 'Zeke',
    emoji: '⚽',
    image: '/assets/characters/zeke.png',
    description: 'Professional soccer coach specializing in athletic performance',
    personality: 'Competitive, energetic, and team-focused. Brings elite sports training and performance optimization.',
    unlockRequirement: 14,
    unlockDescription: 'Use app for 2 weeks',
    specialties: ['Soccer Training', 'Athletic Performance', 'Team Dynamics']
  },
  {
    id: 'luna',
    name: 'Luna',
    emoji: '🧘‍♀️',
    image: '/assets/characters/luna.png',
    description: 'Serene meditation and sound therapy specialist',
    personality: 'Calm, serene, and spiritually grounded. Expert in meditation, mindfulness, and sound healing.',
    unlockRequirement: 21,
    unlockDescription: 'Use app for 3 weeks',
    specialties: ['Meditation', 'Sound Therapy', 'Mindfulness', 'Inner Peace']
  },
  {
    id: 'kai',
    name: 'Kai',
    emoji: '🏔️',
    image: '/assets/characters/kai-hiker.png',
    description: 'Rugged outdoorsman and adventure wellness coach',
    personality: 'Rugged but friendly, grounded, and adventurous. Expert in outdoor activities and natural wellness.',
    unlockRequirement: 28,
    unlockDescription: 'Use app for 4 weeks',
    specialties: ['Outdoor Adventures', 'Nature Fitness', 'Wilderness Therapy']
  },
  {
    id: 'nova',
    name: 'Nova',
    emoji: '💫',
    image: '/assets/characters/nova.png',
    description: 'Tech-savvy yoga coach and digital wellness expert',
    personality: 'Non-binary, tech-savvy, and centered. Blends modern technology with ancient wellness practices.',
    unlockRequirement: 42,
    unlockDescription: 'Use app for 6 weeks',
    specialties: ['Tech-Enhanced Yoga', 'Digital Wellness', 'Smart Fitness']
  },
  {
    id: 'gunner',
    name: 'Gunner',
    emoji: '🐕',
    image: '/assets/characters/gunner.png',
    description: 'Loyal companion Dog Argentino representing ultimate dedication',
    personality: 'Friendly, loyal, and confident. Symbolizes unwavering dedication to your wellness journey.',
    unlockRequirement: 56,
    unlockDescription: 'Use app for 8 weeks',
    specialties: ['Loyalty', 'Companionship', 'Dedication', 'Emotional Support']
  }
];

interface CharacterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentCharacter: string;
  onCharacterSelect: (characterId: string) => void;
  daysUsed: number;
}

export default function CharacterSelector({ 
  isOpen, 
  onClose, 
  currentCharacter, 
  onCharacterSelect, 
  daysUsed 
}: CharacterSelectorProps) {
  const [selectedCharacter, setSelectedCharacter] = useState(currentCharacter);
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: string}>({});

  // Load uploaded character images
  useEffect(() => {
    const saved = localStorage.getItem('character-images');
    if (saved) {
      try {
        setUploadedImages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load character images:', e);
      }
    }
  }, [isOpen]);

  // Calculate wellness journey start date
  const wellnessJourneyStartDate = new Date();
  wellnessJourneyStartDate.setDate(wellnessJourneyStartDate.getDate() - daysUsed + 1);

  // Get unlocked character IDs using the established logic
  const unlockedCharacterIds = getUnlockedCharacters(wellnessJourneyStartDate);



  const isCharacterUnlocked = (character: Character) => {
    return unlockedCharacterIds.includes(character.id);
  };

  const handleSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
    onCharacterSelect(characterId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Wellness Companion</h2>
              <p className="text-gray-600">You've been using the app for {daysUsed} days</p>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {characters.map((character) => {
              const unlocked = isCharacterUnlocked(character);
              const isSelected = selectedCharacter === character.id;
              
              return (
                <Card 
                  key={character.id} 
                  className={`cursor-pointer transition-all relative ${
                    unlocked 
                      ? isSelected 
                        ? 'ring-2 ring-blue-500 shadow-lg' 
                        : 'hover:shadow-lg border-2 border-transparent hover:border-blue-200'
                      : 'cursor-not-allowed bg-gray-50'
                  }`}
                  onClick={() => unlocked && handleSelect(character.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${!unlocked ? 'grayscale opacity-30' : ''}`}>
                          {uploadedImages[character.id] ? (
                            <img 
                              src={uploadedImages[character.id]} 
                              alt={character.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : character.image ? (
                            <img 
                              src={character.image} 
                              alt={character.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="text-3xl">{character.emoji}</div>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {character.name}
                            {!unlocked && <Lock className="h-4 w-4 text-gray-400" />}
                            {unlocked && isSelected && <Unlock className="h-4 w-4 text-green-500" />}
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">{character.description}</p>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Personality:</h4>
                        <p className="text-xs text-gray-600">{character.personality}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {character.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        {unlocked ? (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Unlock className="h-4 w-4" />
                            <span>Unlocked!</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Lock className="h-4 w-4" />
                            <span>{character.unlockDescription}</span>
                          </div>
                        )}
                      </div>

                      {unlocked && (
                        <Button 
                          onClick={() => handleSelect(character.id)}
                          variant={isSelected ? "default" : "outline"}
                          className="w-full"
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                  
                  {/* Locked overlay */}
                  {!unlocked && (
                    <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🔒</div>
                        <div className="text-sm font-medium text-gray-700">
                          {character.unlockRequirement - daysUsed} days to unlock
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Day {character.unlockRequirement} required
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Keep using the app daily to unlock more companions! 
              Next unlock: {characters.find(c => c.unlockRequirement > daysUsed)?.name || "All unlocked!"} 
              {characters.find(c => c.unlockRequirement > daysUsed) && 
                ` in ${characters.find(c => c.unlockRequirement > daysUsed)!.unlockRequirement - daysUsed} days`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CHARACTER_UNLOCK_SCHEDULE, getUnlockedCharacters };
export type { Character };