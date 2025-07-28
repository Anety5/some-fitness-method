// Exercise Library Data Structure
export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'strength' | 'cardio' | 'flexibility' | 'yoga' | 'meditation' | 'hiit';
  goals: string[]; // e.g., ['weight_loss', 'muscle_gain', 'flexibility', 'stress_relief']
  restrictions: string[]; // e.g., ['no_equipment', 'knee_friendly', 'back_safe']
  instructions: string[];
  benefits: string[];
  isPremium: boolean;
  videoUrl?: string;
  imageUrl?: string;
  equipment?: string[];
  targetMuscles?: string[];
}

export interface ExerciseRoutine {
  id: string;
  name: string;
  description: string;
  exercises: string[]; // Exercise IDs
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  isPremium: boolean;
  createdBy?: 'system' | 'user';
}

// Free Exercise Library
export const FREE_EXERCISES: Exercise[] = [
  {
    id: 'bodyweight_squats',
    name: 'Bodyweight Squats',
    description: 'Classic squats using only your body weight - 3 sets of 30 reps',
    duration: 4,
    difficulty: 'beginner',
    category: 'strength',
    goals: ['muscle_gain', 'lower_body', 'functional_fitness'],
    restrictions: ['no_equipment', 'knee_friendly'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body by bending at hips and knees',
      'Keep chest up and weight on heels',
      'Lower until thighs are parallel to floor',
      'Push through heels to return to start',
      '1 set: 30 squats, rest 45 seconds, repeat for 3 total sets'
    ],
    benefits: ['Strengthens quadriceps, glutes, and core', 'Improves functional movement', 'No equipment needed'],
    isPremium: false,
    equipment: [],
    targetMuscles: ['quadriceps', 'glutes', 'core']
  },
  {
    id: 'push_ups',
    name: 'Modified Push-Ups',
    description: 'Beginner-friendly push-ups with knees on floor - 3 sets of 15 reps',
    duration: 4,
    difficulty: 'beginner',
    category: 'strength',
    goals: ['muscle_gain', 'upper_body', 'functional_fitness'],
    restrictions: ['no_equipment', 'wrist_safe'],
    instructions: [
      'Start in plank position with hands under shoulders',
      'Lower knees to floor for support',
      'Keep straight line from head to knees',
      'Lower chest toward floor by bending elbows',
      'Push back up to starting position',
      '1 set: 15 modified push-ups, rest 45 seconds, repeat for 3 total sets'
    ],
    benefits: ['Builds chest, shoulder, and tricep strength', 'Perfect for beginners', 'Reduces stress on wrists and core'],
    isPremium: false,
    equipment: [],
    targetMuscles: ['chest', 'shoulders', 'triceps', 'core']
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    description: 'Dynamic cardio exercise for beginners - 3 sets of 20 reps',
    duration: 3,
    difficulty: 'beginner',
    category: 'cardio',
    goals: ['weight_loss', 'cardio_endurance', 'core_strength'],
    restrictions: ['no_equipment', 'moderate_intensity'],
    instructions: [
      'Start in plank position with hands under shoulders',
      'Drive right knee toward chest',
      'Return to plank, then bring left knee to chest',
      'Continue alternating legs at controlled pace',
      '1 set: 20 mountain climbers (10 per leg), rest 30 seconds, repeat for 3 total sets'
    ],
    benefits: ['Builds cardiovascular endurance', 'Strengthens core and shoulders', 'Beginner-friendly cardio movement'],
    isPremium: false,
    equipment: [],
    targetMuscles: ['core', 'shoulders', 'legs']
  },
  {
    id: 'plank_hold',
    name: 'Modified Plank Hold',
    description: 'Beginner-friendly plank with knees on floor - 4 sets of 20 seconds',
    duration: 4,
    difficulty: 'beginner',
    category: 'strength',
    goals: ['core_strength', 'stability', 'posture'],
    restrictions: ['no_equipment', 'back_safe'],
    instructions: [
      'Start in forearm plank position with elbows at 90 degrees',
      'Lower knees to floor for support',
      'Keep straight line from head to knees',
      'Engage core muscles and hold for 20 seconds',
      '1 set: 20-second hold, rest 30 seconds, repeat for 4 total sets',
      'Breathe normally throughout each hold'
    ],
    benefits: ['Builds core strength for beginners', 'Reduces stress on lower back', 'Perfect introduction to planks'],
    isPremium: false,
    equipment: [],
    targetMuscles: ['core', 'shoulders', 'glutes']
  },
  {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    description: 'Full-body cardio exercise for warming up and heart rate elevation',
    duration: 3,
    difficulty: 'beginner',
    category: 'cardio',
    goals: ['weight_loss', 'cardio_endurance', 'warm_up'],
    restrictions: ['no_equipment', 'knee_impact'],
    instructions: [
      'Start standing with feet together, arms at sides',
      'Jump while spreading legs shoulder-width apart',
      'Simultaneously raise arms overhead',
      'Jump back to starting position',
      'Maintain steady rhythm'
    ],
    benefits: ['Elevates heart rate quickly', 'Full-body movement', 'Great for warm-ups'],
    isPremium: false,
    equipment: [],
    targetMuscles: ['legs', 'shoulders', 'core']
  },
  {
    id: 'child_pose',
    name: "Child's Pose",
    description: 'Restorative yoga pose for relaxation and gentle stretching',
    duration: 3,
    difficulty: 'beginner',
    category: 'yoga',
    goals: ['flexibility', 'stress_relief', 'relaxation'],
    restrictions: ['no_equipment', 'knee_friendly', 'back_safe'],
    instructions: [
      'Kneel on floor with big toes touching',
      'Sit back on heels',
      'Separate knees about hip-width apart',
      'Fold forward, extending arms in front',
      'Rest forehead on floor, breathe deeply'
    ],
    benefits: ['Relieves stress and fatigue', 'Gently stretches hips and thighs', 'Calms the mind'],
    isPremium: false,
    equipment: [],
    targetMuscles: ['hips', 'thighs', 'back']
  },
  {
    id: 'deep_breathing',
    name: 'Deep Breathing Exercise',
    description: 'Mindful breathing for stress relief and relaxation',
    duration: 5,
    difficulty: 'beginner',
    category: 'meditation',
    goals: ['stress_relief', 'relaxation', 'mindfulness'],
    restrictions: ['no_equipment', 'accessible'],
    instructions: [
      'Sit comfortably with spine straight',
      'Place one hand on chest, one on belly',
      'Breathe in slowly through nose for 4 counts',
      'Hold breath for 4 counts',
      'Exhale slowly through mouth for 6 counts',
      'Repeat for 5-10 cycles'
    ],
    benefits: ['Reduces stress and anxiety', 'Lowers heart rate', 'Improves focus'],
    isPremium: false,
    equipment: [],
    targetMuscles: []
  }
];

// Premium Exercise Library (preview)
export const PREMIUM_EXERCISES: Exercise[] = [
  {
    id: 'kettlebell_swings',
    name: 'Kettlebell Swings',
    description: 'Dynamic full-body exercise with kettlebell - 3 sets of 15 reps',
    duration: 8,
    difficulty: 'intermediate',
    category: 'strength',
    goals: ['muscle_gain', 'cardio_endurance', 'functional_fitness'],
    restrictions: ['equipment_required'],
    instructions: [
      'Stand with feet shoulder-width apart, kettlebell between legs',
      'Hinge at hips, grab kettlebell with both hands',
      'Drive hips forward explosively, swing kettlebell to chest height',
      'Let kettlebell swing back between legs with control',
      '1 set: 15 swings, rest 60 seconds, repeat for 3 total sets'
    ],
    benefits: ['Full-body power development', 'Improves cardiovascular fitness', 'Builds posterior chain strength'],
    isPremium: true,
    equipment: ['kettlebell'],
    targetMuscles: ['glutes', 'hamstrings', 'core', 'shoulders']
  },
  {
    id: 'swiss_ball_bridges',
    name: 'Swiss Ball Bridges',
    description: 'Glute and core strengthening with swiss ball - 3 sets of 12 reps',
    duration: 6,
    difficulty: 'intermediate',
    category: 'strength',
    goals: ['muscle_gain', 'core_strength', 'stability'],
    restrictions: ['equipment_required'],
    instructions: [
      'Lie on back with heels on swiss ball',
      'Keep arms at sides for stability',
      'Squeeze glutes and lift hips off ground',
      'Hold for 2 seconds at top, lower with control',
      '1 set: 12 bridges, rest 45 seconds, repeat for 3 total sets'
    ],
    benefits: ['Strengthens glutes and hamstrings', 'Improves core stability', 'Enhances balance'],
    isPremium: true,
    equipment: ['swiss_ball'],
    targetMuscles: ['glutes', 'hamstrings', 'core']
  },
  {
    id: 'resistance_band_planks',
    name: 'Resistance Band Planks',
    description: 'Enhanced plank with resistance band - 3 sets of 30 seconds',
    duration: 6,
    difficulty: 'intermediate',
    category: 'strength',
    goals: ['core_strength', 'stability', 'upper_body'],
    restrictions: ['equipment_required'],
    instructions: [
      'Get in plank position with resistance band around wrists',
      'Maintain tension in band throughout exercise',
      'Keep body in straight line from head to heels',
      'Hold position while fighting band resistance',
      '1 set: 30-second hold, rest 45 seconds, repeat for 3 total sets'
    ],
    benefits: ['Increases core activation', 'Challenges shoulder stability', 'Improves anti-rotation strength'],
    isPremium: true,
    equipment: ['resistance_band'],
    targetMuscles: ['core', 'shoulders', 'chest']
  },
  {
    id: 'booty_band_fire_hydrants',
    name: 'Booty Band Fire Hydrants',
    description: 'Glute activation with booty band - 3 sets of 15 per side',
    duration: 8,
    difficulty: 'beginner',
    category: 'strength',
    goals: ['muscle_gain', 'lower_body', 'glute_activation'],
    restrictions: ['equipment_required'],
    instructions: [
      'Start on hands and knees with booty band around thighs',
      'Keep core engaged and back neutral',
      'Lift right leg out to side, keeping knee bent at 90 degrees',
      'Lower leg back to start with control',
      '1 set: 15 reps per side, rest 45 seconds, repeat for 3 total sets'
    ],
    benefits: ['Activates glute medius', 'Improves hip stability', 'Prevents knee injuries'],
    isPremium: true,
    equipment: ['booty_band'],
    targetMuscles: ['glutes', 'hip_abductors']
  },
  {
    id: 'kettlebell_goblet_squats',
    name: 'Kettlebell Goblet Squats',
    description: 'Deep squats holding kettlebell - 3 sets of 12 reps',
    duration: 7,
    difficulty: 'intermediate',
    category: 'strength',
    goals: ['muscle_gain', 'lower_body', 'functional_fitness'],
    restrictions: ['equipment_required'],
    instructions: [
      'Hold kettlebell at chest with both hands',
      'Stand with feet slightly wider than shoulder-width',
      'Lower into deep squat, keeping chest up',
      'Drive through heels to return to standing',
      '1 set: 12 squats, rest 60 seconds, repeat for 3 total sets'
    ],
    benefits: ['Builds leg and glute strength', 'Improves squat depth', 'Enhances core stability'],
    isPremium: true,
    equipment: ['kettlebell'],
    targetMuscles: ['quadriceps', 'glutes', 'core']
  },
  {
    id: 'swiss_ball_pike_rollouts',
    name: 'Swiss Ball Pike Rollouts',
    description: 'Advanced core exercise with swiss ball - 3 sets of 8 reps',
    duration: 8,
    difficulty: 'advanced',
    category: 'strength',
    goals: ['core_strength', 'stability', 'functional_fitness'],
    restrictions: ['equipment_required', 'advanced_movement'],
    instructions: [
      'Start in plank position with feet on swiss ball',
      'Keep arms straight and core engaged',
      'Roll ball toward hands by lifting hips up',
      'Slowly roll back to plank position',
      '1 set: 8 rollouts, rest 75 seconds, repeat for 3 total sets'
    ],
    benefits: ['Maximum core activation', 'Improves shoulder stability', 'Builds functional strength'],
    isPremium: true,
    equipment: ['swiss_ball'],
    targetMuscles: ['core', 'shoulders', 'hip_flexors']
  }
];

// Free Routine Templates
export const FREE_ROUTINES: ExerciseRoutine[] = [
  {
    id: 'beginner_strength',
    name: 'Beginner Strength Basics',
    description: 'Simple bodyweight exercises to build foundational strength',
    exercises: ['bodyweight_squats', 'push_ups', 'plank_hold'],
    totalDuration: 12,
    difficulty: 'beginner',
    goals: ['muscle_gain', 'functional_fitness'],
    isPremium: false,
    createdBy: 'system'
  },
  {
    id: 'quick_cardio',
    name: 'Quick Cardio Burst',
    description: 'Fast-paced cardio routine to get your heart pumping',
    exercises: ['jumping_jacks', 'mountain_climbers'],
    totalDuration: 6,
    difficulty: 'beginner',
    goals: ['weight_loss', 'cardio_endurance'],
    isPremium: false,
    createdBy: 'system'
  },
  {
    id: 'relaxation_routine',
    name: 'Stress Relief & Relaxation',
    description: 'Gentle routine to unwind and reduce stress',
    exercises: ['child_pose', 'deep_breathing'],
    totalDuration: 8,
    difficulty: 'beginner',
    goals: ['stress_relief', 'relaxation'],
    isPremium: false,
    createdBy: 'system'
  }
];

// Premium Routine Templates
export const PREMIUM_ROUTINES: ExerciseRoutine[] = [
  {
    id: 'kettlebell_power_workout',
    name: 'Kettlebell Power Circuit',
    description: 'Full-body strength and conditioning with kettlebell',
    exercises: ['kettlebell_swings', 'kettlebell_goblet_squats'],
    totalDuration: 15,
    difficulty: 'intermediate',
    goals: ['muscle_gain', 'functional_fitness', 'cardio_endurance'],
    isPremium: true,
    createdBy: 'system'
  },
  {
    id: 'resistance_band_routine',
    name: 'Resistance Band Strength',
    description: 'Portable strength training with resistance bands',
    exercises: ['resistance_band_planks'],
    totalDuration: 6,
    difficulty: 'intermediate',
    goals: ['core_strength', 'upper_body', 'stability'],
    isPremium: true,
    createdBy: 'system'
  },
  {
    id: 'swiss_ball_core_blast',
    name: 'Swiss Ball Core Workout',
    description: 'Advanced core strengthening with swiss ball',
    exercises: ['swiss_ball_bridges', 'swiss_ball_pike_rollouts'],
    totalDuration: 14,
    difficulty: 'advanced',
    goals: ['core_strength', 'stability', 'functional_fitness'],
    isPremium: true,
    createdBy: 'system'
  },
  {
    id: 'glute_activation_series',
    name: 'Booty Band Glute Activation',
    description: 'Targeted glute strengthening with booty bands',
    exercises: ['booty_band_fire_hydrants'],
    totalDuration: 8,
    difficulty: 'beginner',
    goals: ['muscle_gain', 'lower_body', 'glute_activation'],
    isPremium: true,
    createdBy: 'system'
  }
];

// Exercise Goals and Filters
export const EXERCISE_GOALS = [
  'weight_loss',
  'muscle_gain', 
  'flexibility',
  'stress_relief',
  'cardio_endurance',
  'core_strength',
  'upper_body',
  'lower_body',
  'functional_fitness',
  'relaxation',
  'energy',
  'mindfulness'
];

export const EXERCISE_RESTRICTIONS = [
  'no_equipment',
  'knee_friendly',
  'back_safe', 
  'wrist_safe',
  'high_intensity',
  'low_impact',
  'accessible'
];

export const EXERCISE_CATEGORIES = [
  'strength',
  'cardio', 
  'flexibility',
  'yoga',
  'meditation',
  'hiit'
];

// Helper functions
export const getExerciseById = (id: string): Exercise | undefined => {
  return [...FREE_EXERCISES, ...PREMIUM_EXERCISES].find(ex => ex.id === id);
};

export const getRoutineById = (id: string): ExerciseRoutine | undefined => {
  return [...FREE_ROUTINES, ...PREMIUM_ROUTINES].find(routine => routine.id === id);
};

export const filterExercises = (
  exercises: Exercise[],
  filters: {
    difficulty?: string;
    category?: string;
    goals?: string[];
    restrictions?: string[];
    isPremium?: boolean;
  }
): Exercise[] => {
  return exercises.filter(exercise => {
    if (filters.difficulty && exercise.difficulty !== filters.difficulty) return false;
    if (filters.category && exercise.category !== filters.category) return false;
    if (filters.isPremium !== undefined && exercise.isPremium !== filters.isPremium) return false;
    if (filters.goals && !filters.goals.some(goal => exercise.goals.includes(goal))) return false;
    if (filters.restrictions && !filters.restrictions.every(restriction => exercise.restrictions.includes(restriction))) return false;
    return true;
  });
};