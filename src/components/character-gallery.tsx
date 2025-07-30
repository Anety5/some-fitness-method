import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Star, Trophy, Calendar, Heart, Eye } from 'lucide-react';
import CharacterImageDisplay from './character-image-display';

interface Character {
  id: string;
  name: string;
  emoji: string;
  description: string;
  personality: string;
  unlockRequirement: number;
  unlockDescription: string;
  specialties: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  detailedPrompt?: string;
}

const characters: Character[] = [
  {
    id: 'max',
    name: 'Max',
    emoji: '💪',
    description: 'Athletic and upbeat personal trainer',
    personality: 'Athletic, upbeat, and encouraging. Always ready with a positive attitude and motivational energy.',
    unlockRequirement: 0,
    unlockDescription: 'Available from start',
    specialties: ['Personal Training', 'Motivation', 'General Fitness'],
    rarity: 'common',
    detailedPrompt: 'DISTINCT from Zeke: Athletic and upbeat personal trainer, wearing casual joggers and hoodie (NOT soccer gear), giving a friendly wave or thumbs up. Clean-cut appearance, no cap, simple and positive posture. Focus on gym/fitness aesthetic rather than sports.'
  },
  {
    id: 'mia',
    name: 'Mia',
    emoji: '🏋️‍♀️',
    description: 'High-energy personal trainer and fitness coach',
    personality: 'Fit, energetic, and dynamic. Loves resistance training and keeping your energy levels high.',
    unlockRequirement: 0,
    unlockDescription: 'Available from start',
    specialties: ['Strength Training', 'Resistance Workouts', 'High-Energy Fitness'],
    rarity: 'common',
    detailedPrompt: 'Fit and energetic, wearing athletic leggings and tank top, resistance band in one hand, mid-action stance or high-energy smile.'
  },
  {
    id: 'zeke',
    name: 'Zeke',
    emoji: '⚽',
    description: 'Athletic soccer coach and professional player',
    personality: 'Athletic, confident, and team-oriented. Brings professional sports expertise and competitive spirit.',
    unlockRequirement: 14,
    unlockDescription: 'Use app for 2 weeks',
    specialties: ['Cardio Training', 'Team Sports', 'Athletic Performance'],
    rarity: 'rare',
    detailedPrompt: 'DISTINCT from Max: Professional soccer player, wearing official soccer uniform (jersey, shorts, cleats), with a soccer ball under one foot. Distinctive backwards RED cap, sports-focused posture. Emphasis on team sports gear and soccer-specific equipment.'
  },
  {
    id: 'luna',
    name: 'Luna',
    emoji: '🧘‍♀️',
    description: 'Serene meditation and sound therapy specialist',
    personality: 'Calm, serene, and spiritually grounded. Expert in meditation, mindfulness, and sound healing.',
    unlockRequirement: 21,
    unlockDescription: 'Use app for 3 weeks',
    specialties: ['Meditation', 'Sound Therapy', 'Mindfulness', 'Inner Peace'],
    rarity: 'rare',
    detailedPrompt: 'Calm and serene, sitting in a meditation pose with a pink lotus flower glowing near her. Wearing relaxed yoga clothes and a headband, eyes closed in peace.'
  },
  {
    id: 'kai',
    name: 'Kai',
    emoji: '🏔️',
    description: 'Rugged outdoorsman and adventure wellness coach',
    personality: 'Rugged but friendly, grounded, and adventurous. Expert in outdoor activities and natural wellness.',
    unlockRequirement: 28,
    unlockDescription: 'Use app for 4 weeks',
    specialties: ['Outdoor Adventures', 'Nature Fitness', 'Wilderness Therapy'],
    rarity: 'epic',
    detailedPrompt: 'Rugged but friendly look, wearing cargo pants, boots, green shirt, and backpack. Headband and sunglasses, in a natural pose.'
  },
  {
    id: 'nova',
    name: 'Nova',
    emoji: '💫',
    description: 'Tech-savvy yoga coach and digital wellness expert',
    personality: 'Non-binary, tech-savvy, and centered. Blends modern technology with ancient wellness practices.',
    unlockRequirement: 42,
    unlockDescription: 'Use app for 6 weeks',
    specialties: ['Tech-Enhanced Yoga', 'Digital Wellness', 'Smart Fitness'],
    rarity: 'epic',
    detailedPrompt: 'Non-binary, short dark hair, wearing a sleek hoodie and smart watch. Standing calmly with a floating digital frisbee above their palm and light tech-themed holograms around. Confident and centered.'
  },
  {
    id: 'gunner',
    name: 'Gunner',
    emoji: '🐕',
    description: 'Loyal companion Dog Argentino representing ultimate dedication',
    personality: 'Friendly, loyal, and confident. Symbolizes unwavering dedication to your wellness journey.',
    unlockRequirement: 56,
    unlockDescription: 'Use app for 8 weeks',
    specialties: ['Loyalty', 'Companionship', 'Dedication', 'Emotional Support'],
    rarity: 'legendary',
    detailedPrompt: 'A friendly white Dog Argentino with a black collar, sitting upright and smiling, symbolizing loyalty. He should have a confident yet kind expression.'
  }
];

interface CharacterGalleryProps {
  daysUsed: number;
  onCharacterSelect?: (characterId: string) => void;
  selectedCharacter?: string;
}

export default function CharacterGallery({ daysUsed, onCharacterSelect, selectedCharacter }: CharacterGalleryProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="h-3 w-3" />;
      case 'rare': return <Trophy className="h-3 w-3" />;
      case 'epic': return <Heart className="h-3 w-3" />;
      case 'legendary': return <Calendar className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  const isCharacterUnlocked = (character: Character) => {
    return daysUsed >= character.unlockRequirement;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Character Gallery</h2>
        <p className="text-gray-600">Your wellness companions unlock as you continue your journey</p>
        <Badge className="mt-2 bg-blue-100 text-blue-800">
          Day {daysUsed} of your wellness journey
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character) => {
          const unlocked = isCharacterUnlocked(character);
          const isSelected = selectedCharacter === character.id;

          return (
            <Card 
              key={character.id} 
              className={`relative transition-all duration-200 ${
                unlocked 
                  ? isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'hover:shadow-md cursor-pointer' 
                  : 'opacity-60'
              }`}
              onClick={() => unlocked && onCharacterSelect?.(character.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col items-center space-y-3">
                  <CharacterImageDisplay
                    characterId={character.id}
                    characterName={character.name}
                    characterEmoji={character.emoji}
                    size="medium"
                    showUpload={unlocked}
                  />
                  <div className="text-center">
                    <CardTitle className="text-lg">{character.name}</CardTitle>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <Badge className={`text-xs ${getRarityColor(character.rarity)}`}>
                        {getRarityIcon(character.rarity)}
                        <span className="ml-1">{character.rarity}</span>
                      </Badge>
                      {unlocked ? (
                        <Unlock className="h-4 w-4 text-green-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {character.description}
                </p>

                {unlocked && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Personality:</p>
                    <p className="text-sm text-gray-800 italic leading-relaxed">
                      {character.personality}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-600 mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {character.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {unlocked && character.detailedPrompt && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Character Design:</p>
                    <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-2 rounded">
                      {character.detailedPrompt}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t">
                  {unlocked ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600 font-medium">Unlocked!</span>
                      {onCharacterSelect && (
                        <Button 
                          variant={isSelected ? "default" : "outline"} 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCharacterSelect(character.id);
                          }}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      <Lock className="h-3 w-3 inline mr-1" />
                      {character.unlockDescription}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        <Eye className="h-4 w-4 inline mr-1" />
        Continue your wellness journey to unlock more characters and companions
      </div>
    </div>
  );
}