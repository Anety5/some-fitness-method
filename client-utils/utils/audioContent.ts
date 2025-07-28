// Audio Library with Premium Gating
export interface AudioContent {
  id: string;
  title: string;
  category: 'Breathing' | 'Meditation' | 'Sleep' | 'Nature' | 'Ambient';
  file: string;
  premium: boolean;
  duration?: string;
  description?: string;
  benefits?: string[];
}

export const audioLibrary: AudioContent[] = [
  // Free Breathing Exercises
  {
    id: 'box_breathing',
    title: "Box Breathing",
    category: "Breathing",
    file: "/audio/box-breathing.mp3",
    premium: false,
    duration: "5:00",
    description: "4-4-4-4 breathing pattern for stress relief and focus",
    benefits: ["Reduces anxiety", "Improves focus", "Calms nervous system"]
  },
  {
    id: 'deep_breathing',
    title: "Deep Breathing Exercise",
    category: "Breathing", 
    file: "/audio/deep-breathing.mp3",
    premium: false,
    duration: "3:30",
    description: "Simple deep breathing for relaxation",
    benefits: ["Reduces stress", "Lowers heart rate", "Easy for beginners"]
  },
  
  // Premium Breathing Exercises
  {
    id: 'breath_retraining',
    title: "Breath Retraining",
    category: "Breathing",
    file: "/audio/BreathingRetraining (2)_1752567023172.mp3",
    premium: true,
    duration: "8:15",
    description: "Advanced breathing retraining for anxiety and stress management",
    benefits: ["Therapeutic breathing", "Anxiety relief", "Stress management"]
  },
  {
    id: 'rain_relaxation_breathing',
    title: "Relaxation with Rain Audio",
    category: "Breathing",
    file: "/assets/audio/ambient/Light rain_1752037783519.m4a",
    premium: true,
    duration: "15:00",
    description: "Deep relaxation breathing exercise with soothing rain sounds",
    benefits: ["Deep relaxation", "Natural sound therapy", "Stress relief"]
  },
  {
    id: 'advanced_pranayama',
    title: "Advanced Pranayama",
    category: "Breathing",
    file: "/audio/advanced-pranayama.mp3", 
    premium: true,
    duration: "12:00",
    description: "Traditional yoga breathing techniques for energy and balance",
    benefits: ["Energy regulation", "Chakra balancing", "Advanced practice"]
  },

  // Free Meditation
  {
    id: 'basic_mindfulness',
    title: "Basic Mindfulness",
    category: "Meditation",
    file: "/audio/basic-mindfulness.mp3",
    premium: false,
    duration: "10:00", 
    description: "Introduction to mindfulness meditation",
    benefits: ["Stress reduction", "Present moment awareness", "Beginner friendly"]
  },
  {
    id: 'body_scan',
    title: "Body Scan Relaxation",
    category: "Meditation",
    file: "/audio/body-scan-relaxation.mp3",
    premium: false,
    duration: "15:00",
    description: "Progressive body scan for deep relaxation",
    benefits: ["Physical relaxation", "Body awareness", "Sleep preparation"]
  },

  // Premium Meditation
  {
    id: 'ten_breath_relaxation',
    title: "10-Breath Relaxation",
    category: "Meditation",
    file: "/audio/ten-breath-practice-benzo (2)_1752567023171.mp3",
    premium: true,
    duration: "4:30",
    description: "Intensive breath-focused meditation for deep calm",
    benefits: ["Deep relaxation", "Quick stress relief", "Advanced technique"]
  },
  {
    id: 'mindfulness_extended',
    title: "Mindfulness Meditation Extended",
    category: "Meditation", 
    file: "/audio/mindfulness-meditation-on-breath (3)_1752567023171.mp3",
    premium: true,
    duration: "23:00",
    description: "Extended mindfulness practice with breath awareness",
    benefits: ["Deep meditation", "Extended practice", "Advanced mindfulness"]
  },
  {
    id: 'loving_kindness',
    title: "Loving Kindness Meditation",
    category: "Meditation",
    file: "/audio/loving-kindness.mp3",
    premium: true,
    duration: "18:00", 
    description: "Cultivate compassion and emotional well-being",
    benefits: ["Emotional healing", "Compassion practice", "Heart opening"]
  },

  // Free Sleep Sounds
  {
    id: 'rain_sounds',
    title: "Gentle Rain",
    category: "Sleep",
    file: "/audio/rain-sounds.mp3",
    premium: false,
    duration: "60:00",
    description: "Soothing rain sounds for sleep and relaxation",
    benefits: ["Sleep aid", "Stress relief", "Natural sounds"]
  },
  {
    id: 'ocean_waves',
    title: "Ocean Waves",
    category: "Sleep",
    file: "/audio/ocean-waves.mp3", 
    premium: false,
    duration: "45:00",
    description: "Peaceful ocean waves for deep sleep",
    benefits: ["Deep sleep", "Relaxation", "Natural ambience"]
  },

  // Premium Sleep Content
  {
    id: 'binaural_beats',
    title: "Binaural Beats - Deep Sleep",
    category: "Sleep",
    file: "/audio/binaural-deep-sleep.mp3",
    premium: true,
    duration: "60:00",
    description: "Scientifically designed frequencies for deep sleep",
    benefits: ["Enhanced sleep quality", "Brainwave entrainment", "Deep rest"]
  },
  {
    id: 'sleep_story',
    title: "Guided Sleep Story",
    category: "Sleep", 
    file: "/audio/sleep-story.mp3",
    premium: true,
    duration: "30:00",
    description: "Narrated story designed to guide you to sleep",
    benefits: ["Sleep induction", "Peaceful stories", "Mind relaxation"]
  },

  // Free Nature Sounds
  {
    id: 'forest_ambience',
    title: "Forest Ambience",
    category: "Nature",
    file: "/audio/forest-sounds.mp3",
    premium: false,
    duration: "30:00",
    description: "Peaceful forest sounds with birds and rustling leaves",
    benefits: ["Natural relaxation", "Focus enhancement", "Stress relief"]
  },

  // Premium Nature & Ambient
  {
    id: 'tibetan_bowls',
    title: "Tibetan Singing Bowls",
    category: "Ambient",
    file: "/audio/047130_bright-tibetan-bell-ding-b-note-72289.mp3",
    premium: true,
    duration: "25:00",
    description: "Sacred Tibetan bowls for deep meditation and healing",
    benefits: ["Spiritual practice", "Energy healing", "Deep meditation"]
  },
  {
    id: 'crystal_bowls',
    title: "Crystal Bowl Healing",
    category: "Ambient",
    file: "/audio/crystal-bowls.mp3",
    premium: true,
    duration: "40:00",
    description: "Pure crystal bowl tones for chakra alignment",
    benefits: ["Chakra healing", "Energy balance", "Sound therapy"]
  }
];

// Helper functions
export const getFreeAudio = (): AudioContent[] => {
  return audioLibrary.filter(audio => !audio.premium);
};

export const getPremiumAudio = (): AudioContent[] => {
  return audioLibrary.filter(audio => audio.premium);
};

export const getAudioByCategory = (category: string, isPremium: boolean = false): AudioContent[] => {
  return audioLibrary.filter(audio => 
    audio.category === category && (isPremium || !audio.premium)
  );
};

export const getAudioById = (id: string): AudioContent | undefined => {
  return audioLibrary.find(audio => audio.id === id);
};

export const getAvailableAudio = (isPremium: boolean): AudioContent[] => {
  if (isPremium) {
    return audioLibrary;
  }
  return getFreeAudio();
};