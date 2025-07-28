export interface YogaPose {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetArea: string;
  benefits: string[];
  illustration: string;
  imageUrl: string;
  uploadedImageUrl?: string; // For actual uploaded images
  duration: string;
  breathingPattern?: string;
}

export const yogaBeginner: YogaPose[] = [
  {
    id: 'seated-meditation',
    name: 'Seated Meditation Pose',
    description: 'Simple seated position for mindful breathing and relaxation.',
    instructions: [
      'Sit cross-legged on your mat',
      'Keep spine straight',
      'Rest hands on knees',
      'Close eyes and breathe deeply',
      'Hold for 30 seconds, repeat twice'
    ],
    difficulty: 'beginner',
    targetArea: 'Mind-body connection',
    benefits: ['Calms the mind', 'Improves focus', 'Reduces stress'],
    illustration: '🧘‍♂️',
    imageUrl: '/yoga-mountain.svg',
    duration: '2 sets of 30 seconds',
    breathingPattern: 'Deep, mindful breaths'
  },
  {
    id: 'child-pose',
    name: 'Child\'s Pose (Balasana)',
    description: 'Kneel and sit back on your heels, then fold forward with arms extended or by your sides.',
    instructions: [
      'Start on hands and knees',
      'Sit back on your heels',
      'Fold forward, bringing forehead to the mat',
      'Extend arms forward or rest them by your sides',
      'Breathe deeply and relax',
      'Hold for 30 seconds'
    ],
    difficulty: 'beginner',
    targetArea: 'Hip flexors and lower back',
    benefits: ['Relieves stress', 'Stretches hips and thighs', 'Calms the mind'],
    illustration: '🧘‍♀️',
    imageUrl: '/yoga-child.svg',
    duration: '30 seconds',
    breathingPattern: 'Slow, calming breaths'
  },
  {
    id: 'cobra-pose',
    name: 'Cobra Pose (Bhujangasana)',
    description: 'Lie on your belly and gently lift your chest, opening the heart and strengthening the back.',
    instructions: [
      'Lie face down with forehead on the mat',
      'Place palms under shoulders',
      'Press palms down and slowly lift chest',
      'Keep hips grounded',
      'Draw shoulders away from ears',
      'Hold for 15-30 seconds'
    ],
    difficulty: 'beginner',
    targetArea: 'Back and chest',
    benefits: ['Strengthens back muscles', 'Opens chest', 'Improves posture'],
    illustration: '🐍',
    imageUrl: '/yoga-cobra.svg',
    duration: '15-30 seconds',
    breathingPattern: 'Steady, deep breaths'
  },
  {
    id: 'knee-to-chest',
    name: 'Single Knee-to-Chest Stretch',
    description: 'Lie on your back and gently draw one knee toward your chest for a gentle hip and lower back stretch.',
    instructions: [
      'Lie on your back with legs extended',
      'Draw one knee toward your chest',
      'Hold knee with both hands',
      'Keep the other leg straight on the mat',
      'Breathe deeply and relax',
      'Hold for 30 seconds each side'
    ],
    difficulty: 'beginner',
    targetArea: 'Hip flexors and lower back',
    benefits: ['Stretches hip flexors', 'Relieves lower back tension', 'Improves flexibility'],
    illustration: '🦵',
    imageUrl: '/yoga-knee-to-chest.svg',
    duration: '30 seconds each side',
    breathingPattern: 'Deep, relaxing breaths'
  },
  {
    id: 'double-knee-to-chest',
    name: 'Double Knee-to-Chest Pose',
    description: 'Lie on your back and draw both knees toward your chest for a deeper hip and lower back stretch.',
    instructions: [
      'Lie on your back with legs extended',
      'Draw both knees toward your chest',
      'Wrap arms around your shins',
      'Gently rock side to side if comfortable',
      'Keep head and shoulders relaxed on mat',
      'Hold for 30 seconds'
    ],
    difficulty: 'beginner',
    targetArea: 'Hip flexors and lower back',
    benefits: ['Deep hip flexor stretch', 'Releases lower back tension', 'Calms the nervous system'],
    illustration: '🤗',
    imageUrl: '/yoga-double-knee.svg',
    duration: '30 seconds',
    breathingPattern: 'Slow, calming breaths'
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Pose (Tabletop Flow)',
    description: 'Flow between arching and rounding your spine while on hands and knees.',
    instructions: [
      'Start on hands and knees in tabletop position',
      'Inhale: arch your back, lift chest and tailbone (Cow)',
      'Exhale: round your spine, tuck chin to chest (Cat)',
      'Move slowly between the two positions',
      'Coordinate movement with breath',
      'Repeat 5-10 times'
    ],
    difficulty: 'beginner',
    targetArea: 'Spine and core',
    benefits: ['Increases spinal flexibility', 'Massages internal organs', 'Relieves back tension'],
    illustration: '🐱',
    imageUrl: '/yoga-cat-cow.svg',
    duration: '5-10 repetitions',
    breathingPattern: 'Inhale on cow, exhale on cat'
  }
];