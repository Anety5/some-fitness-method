import { useTheme } from '@/hooks/use-theme';
import { useState, useEffect } from 'react';
import { Sun, Cloud, Moon, Star, Coffee, TreePine, Sunset } from 'lucide-react';
import { characters } from './character-selector';

interface WellnessCharacterProps {
  mood?: 'happy' | 'calm' | 'sleepy' | 'energetic';
  size?: 'sm' | 'md' | 'lg';
  characterId?: string;
}

export default function WellnessCharacter({ mood = 'happy', size = 'md', characterId = 'max' }: WellnessCharacterProps) {
  const { timeOfDay } = useTheme();
  const [animation, setAnimation] = useState('');
  
  const selectedCharacter = characters.find(c => c.id === characterId) || characters[0];

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const getCharacterEmoji = () => {
    return selectedCharacter.emoji;
  };

  const getCharacterMessage = () => {
    const characterMessages = {
      'max': {
        morning: {
          happy: "Good morning. I'm Max, your personal trainer and wellness guide. Let's begin today's session with focused breathing techniques.",
          calm: "Morning clarity starts with intentional awareness. I recommend we center ourselves through structured mindful breathing.",
          sleepy: "Still transitioning into your day? I'll guide you through gentle techniques to naturally increase your energy levels.",
          energetic: "Excellent morning energy. Let's strategically channel this vitality through purposeful movement and controlled breathing."
        },
        afternoon: {
          happy: "Afternoon check-in. How's your wellness journey progressing today? This is an optimal time for a structured mindfulness break.",
          calm: "Midday provides the perfect opportunity for intentional pause. I suggest we practice focused meditation techniques.",
          sleepy: "Experiencing afternoon fatigue? Let's implement targeted breathing exercises to naturally restore your energy.",
          energetic: "Strong energy levels detected. Let's harness this through systematic breathing and movement practices."
        },
        evening: {
          happy: "Evening wellness session. Let's transition into restorative practices that prepare your body for quality sleep.",
          calm: "Evening reflection is essential for wellness. This is the ideal time for structured breathing and relaxation techniques.",
          sleepy: "Perfect state for sleep preparation. I'll guide you through proven techniques for deep, restorative rest.",
          energetic: "Evening energy present. Let's transform this into purposeful preparation for optimal sleep recovery."
        }
      },
      'mia': {
        morning: {
          happy: "Good morning! I'm Mia, your high-energy fitness coach. Let's activate your body and mind for peak performance today.",
          calm: "Morning activation begins now. Ready to build positive momentum? Let's start with energizing breathwork techniques.",
          sleepy: "Time to ignite your natural energy systems. I'll guide you through proven activation techniques for optimal alertness.",
          energetic: "Excellent energy levels. Let's strategically amplify this vitality through dynamic breathing and movement protocols."
        },
        afternoon: {
          happy: "Afternoon performance check. How are your energy levels? Let's implement techniques to elevate them further.",
          calm: "Midday is perfect for energy restoration. Let's re-energize through structured dynamic breathing exercises.",
          sleepy: "Experiencing the afternoon energy dip? Let's counter this with targeted activation techniques for sustained vitality.",
          energetic: "Peak performance detected. Let's channel this energy into powerful, focused wellness practices."
        },
        evening: {
          happy: "Evening energy management session. Let's transition your daily vitality into restorative practices while maintaining inner strength.",
          calm: "Time to skillfully redirect your day's energy into peaceful yet empowering evening routines.",
          sleepy: "Ideal state for recovery preparation. Let's use gentle energy techniques to optimize your restorative sleep cycle.",
          energetic: "Strong evening energy present. Let's channel this into calming practices that maintain your inner power."
        }
      },
      'zeke': {
        morning: {
          happy: "Good morning. I'm Zeke, your soccer coach and movement specialist. How did your recovery sleep serve you?",
          calm: "Peaceful awakening indicates quality rest. Let's transition into today's activities with gentle, restorative movement practices.",
          sleepy: "Your body is processing yesterday's training. Let's honor this recovery state and ease into movement gradually.",
          energetic: "Excellent recovery has generated optimal energy levels. Let's maintain this athletic balance throughout your training day."
        },
        afternoon: {
          happy: "Midday energy assessment: How's your performance balance? Let's maintain athletic harmony for sustained performance.",
          calm: "Afternoon tranquility supports tonight's recovery cycle. I recommend implementing calming techniques to optimize rest quality.",
          sleepy: "Your body demonstrates athletic wisdom by seeking midday restoration. Let's engage in gentle recovery practices.",
          energetic: "Strong midday energy detected. Let's strategically balance this for optimal evening recovery and sleep quality."
        },
        evening: {
          happy: "Evening recovery protocol begins. Time to prepare your athletic system for healing, restorative sleep.",
          calm: "Ideal evening energy for recovery. Let's initiate your structured sleep preparation routine.",
          sleepy: "Your body has activated recovery mode. I'll guide you through proven techniques for deep, athletic restoration.",
          energetic: "Let's skillfully transform this evening energy into purposeful preparation for peak recovery sleep."
        }
      },
      'luna': {
        morning: {
          happy: "Good morning. I'm Luna, your meditation specialist and mindfulness guide. Let's attune to the natural rhythms supporting your wellness today.",
          calm: "Dawn provides optimal conditions for meditation practice. Let's align with nature's gentle morning energy flow.",
          sleepy: "Natural awakening follows organic rhythms. Let's honor this process and transition mindfully into your day.",
          energetic: "The morning's vibrant energy supports focused meditation practice. Let's channel this natural vitality through structured breathwork."
        },
        afternoon: {
          happy: "Midday mindfulness check. Can you sense the balanced energy available for meditation practice right now?",
          calm: "The natural world offers perfect stillness for afternoon meditation. Let's pause and connect with this peaceful moment.",
          sleepy: "Even nature demonstrates restorative cycles. Let's use this quiet energy for gentle mindfulness practice.",
          energetic: "Nature's peak energy creates ideal conditions for dynamic meditation. Let's channel this life force through intentional practice."
        },
        evening: {
          happy: "Evening meditation session begins. I'm here to guide you through twilight's natural transition into restful awareness.",
          calm: "Sunset demonstrates the art of gentle transitions. Let's learn from nature's rhythm and apply it to your evening practice.",
          sleepy: "Night falls naturally, bringing restorative energy. Let's prepare for rest through nature-inspired meditation techniques.",
          energetic: "Evening energy requires skillful grounding. Let's transform this vitality into peaceful, centered awareness."
        }
      },
      'kai': {
        morning: {
          happy: "Good morning. I'm Kai, your outdoor adventure specialist and wilderness guide. Each dawn offers new opportunities for exploration.",
          calm: "Morning clarity emerges from mindful stillness. Let's establish focus through proven techniques before today's adventures.",
          sleepy: "Wilderness wisdom teaches us to honor all natural states. Rest is as essential as movement for optimal performance.",
          energetic: "Morning vitality provides excellent energy for outdoor activities. Let's channel this life force through intentional preparation."
        },
        afternoon: {
          happy: "Midday check-in from the field. How are you applying today's outdoor wellness principles?",
          calm: "Experienced adventurers know that afternoon reflection deepens understanding and improves performance.",
          sleepy: "Sometimes wisdom comes through restorative rest. Let's embrace this natural state and prepare for future activities.",
          energetic: "Focused energy becomes effective action in the outdoors. Let's harness this power for purposeful movement."
        },
        evening: {
          happy: "Evening debrief: reflection transforms outdoor experiences into practical wisdom for future adventures.",
          calm: "Twilight provides optimal conditions for contemplation and planning tomorrow's activities.",
          sleepy: "Quality sleep is where outdoor wisdom integrates. Let's prepare your mind for this essential recovery time.",
          energetic: "Evening energy can fuel tomorrow's adventures. Let's channel it mindfully into preparation and planning."
        }
      },
      'nova': {
        morning: {
          happy: "Good morning. I'm Nova, your technology-enhanced yoga coach. Let's integrate modern wellness techniques with traditional practice.",
          calm: "Dawn provides optimal conditions for centered practice. Let's activate your inner awareness through systematic yoga techniques.",
          sleepy: "Even accomplished practitioners honor gentle energy states. Let's ease into today's practice with restorative methods.",
          energetic: "Excellent energy levels for dynamic yoga practice. Let's channel this vitality through structured movement sequences."
        },
        afternoon: {
          happy: "Midday wellness check. How is your energy flowing through today's yoga and movement practices?",
          calm: "Stillness creates space for deeper understanding. Let's engage in focused meditation and gentle yoga techniques.",
          sleepy: "Mindful rest is essential for balanced practice. Let's embrace this receptive state with restorative yoga approaches.",
          energetic: "Your energy is perfectly aligned for advanced practice. Let's direct this power through intentional yoga sequences."
        },
        evening: {
          happy: "Evening yoga session begins. Let's transition into practices that prepare your body-mind system for quality rest.",
          calm: "Evening provides ideal conditions for reflective practice. Let's connect with your inner awareness through gentle yoga.",
          sleepy: "Sleep preparation through yoga creates optimal conditions for restoration. Let's begin this essential transition.",
          energetic: "Evening energy requires skillful transformation. Let's alchemize this vitality into peaceful, centered awareness through yoga."
        }
      },
      'gunner': {
        morning: {
          happy: "Good morning. I'm Gunner, your loyal wellness companion. Ready to approach today's wellness goals with steady determination?",
          calm: "Each morning offers fresh opportunities for progress. Let's harness this renewal energy through consistent practice.",
          sleepy: "Rest is essential for sustainable wellness development. Let's honor this recovery phase and transition gently into activity.",
          energetic: "Strong morning energy detected. Let's channel this transformative power through focused, purposeful wellness practices."
        },
        afternoon: {
          happy: "Midday progress assessment. What positive changes are you implementing in your wellness journey today?",
          calm: "Sustained transformation develops through consistent, peaceful practice. Let's maintain this steady approach to wellness.",
          sleepy: "Even dedicated practitioners require restorative phases. Let's embrace this natural cycle and prepare for renewed activity.",
          energetic: "Your commitment energy is strong. Let's shape this dedication through intentional wellness practices and goal-focused activities."
        },
        evening: {
          happy: "Evening reflection session. Each day's end creates space for new wellness beginnings and continued growth.",
          calm: "Transformation deepens through evening reflection and preparation. Let's review today's progress and prepare for tomorrow.",
          sleepy: "Quality sleep supports all wellness transformations. Let's prepare your system for optimal recovery and renewal.",
          energetic: "Evening energy can fuel tomorrow's wellness commitment. Let's channel this dedication into purposeful preparation and planning."
        }
      }
    };

    const characterSpecific = characterMessages[selectedCharacter.id as keyof typeof characterMessages];
    if (characterSpecific) {
      return characterSpecific[timeOfDay][mood];
    }
    
    // Fallback to default messages
    return `Hello! I'm ${selectedCharacter.name}, your ${selectedCharacter.description.toLowerCase()}. ${selectedCharacter.personality}`;
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
    if (timeOfDay === 'morning') return <Sun className="w-4 h-4" />;
    if (timeOfDay === 'afternoon') return <Cloud className="w-4 h-4" />;
    return <Moon className="w-4 h-4" />;
  };

  useEffect(() => {
    setAnimation('animate-pulse');
    const timer = setTimeout(() => setAnimation(''), 2000);
    return () => clearTimeout(timer);
  }, [timeOfDay]);

  const getCharacterImagePath = () => {
    // Use specific avatar files for certain characters
    if (selectedCharacter.id === 'mia') {
      return '/assets/characters/mia-avatar.png';
    }
    if (selectedCharacter.id === 'kai') {
      return '/assets/characters/kai-hiker.png';
    }
    // Default to characters folder
    return `/assets/characters/${selectedCharacter.id}.png`;
  };

  return (
    <div className="relative">
      {/* Character Display */}
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-white/20 rounded-full border-2 border-white/30 overflow-hidden ${animation}`}>
        <img 
          src={getCharacterImagePath()}
          alt={selectedCharacter.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to emoji if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <span className={`text-4xl ${getCharacterColor()} hidden`}>
          {getCharacterEmoji()}
        </span>
      </div>

      {/* Character Name */}
      <div className="mt-2 text-center">
        <span className="text-sm font-semibold text-gray-700">
          {selectedCharacter.name}
        </span>
      </div>

      {/* Message tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap max-w-xs text-center">
          {getCharacterMessage()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
        </div>
      </div>
    </div>
  );
}