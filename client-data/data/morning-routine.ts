export interface MorningExercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  position: 'seated' | 'lying' | 'standing';
  targetArea: string;
  benefits: string[];
  illustration: string;
  imageUrl: string;
  duration: string;
}

export const morningRoutine: MorningExercise[] = [
  {
    id: 'knee-to-chest',
    name: 'Supine Piriformis Stretch',
    description: 'Lie on your back, bring one knee toward your chest, and hold for a gentle lower back stretch.',
    instructions: [
      'Lie flat on your back on a comfortable surface',
      'Keep your left leg extended on the ground',
      'Bring your right knee toward your chest',
      'Gently pull with both hands behind the thigh',
      'Hold for 15-30 seconds, feeling stretch in lower back',
      'Switch legs and repeat'
    ],
    position: 'lying',
    targetArea: 'Lower back and hip flexors',
    benefits: ['Relieves lower back tension', 'Improves hip mobility', 'Gentle spinal stretch'],
    illustration: '🛏️',
    imageUrl: '/supinepiriformis.png',
    duration: '2 reps each side 15-30 sec'
  },
  {
    id: 'sit-to-stand',
    name: 'Sit to Stand Exercise',
    description: 'Start seated, lean forward, and push through your heels to stand. Slowly return to sitting.',
    instructions: [
      'Sit in a sturdy chair with feet flat on floor',
      'Place feet shoulder-width apart',
      'Lean forward slightly from your hips',
      'Push through your heels to stand up',
      'Avoid using your hands for assistance if possible',
      'Slowly lower back down to seated position',
      'Repeat 5-10 times'
    ],
    position: 'seated',
    targetArea: 'Legs, glutes, and core',
    benefits: ['Strengthens leg muscles', 'Improves functional movement', 'Builds core stability'],
    illustration: '⬆️',
    imageUrl: '/sittostands.png',
    duration: '5-10 repetitions'
  },
  {
    id: 'standing-back-extension',
    name: 'Standing Lumbar Extension',
    description: 'Place your hands on your hips, gently arch your back and look upward. Hold for gentle back stretch.',
    instructions: [
      'Stand tall with feet hip-width apart',
      'Place your hands on your hips',
      'Gently arch your back backwards',
      'Look upward toward the ceiling',
      'Hold for 5 seconds',
      'Return to starting position slowly',
      'Keep the movement gentle and controlled'
    ],
    position: 'standing',
    targetArea: 'Lower back and spine',
    benefits: ['Counteracts forward posture', 'Strengthens back muscles', 'Improves spinal mobility'],
    illustration: '🔄',
    imageUrl: '/standinglumbarextension.png',
    duration: '5 seconds repeat 3-5 times'
  },
  {
    id: 'standing-march',
    name: 'Standing Marching',
    description: 'Lift one knee at a time as if marching, keeping the posture upright. This activates leg muscles.',
    instructions: [
      'Stand tall with feet hip-width apart',
      'Keep your core engaged and posture upright',
      'Lift your right knee toward your chest',
      'Lower it back down with control',
      'Lift your left knee toward your chest',
      'Continue alternating for 20 total lifts (10 each leg)',
      'Keep arms moving naturally or place hands on hips'
    ],
    position: 'standing',
    targetArea: 'Legs, core, and balance',
    benefits: ['Activates leg muscles', 'Improves balance', 'Increases circulation'],
    illustration: '🚶',
    imageUrl: '/runnersmarch.png',
    duration: '20 reps'
  },
  {
    id: 'seated-figure-4',
    name: 'Seated Piriformis Stretch',
    description: 'Sit tall in a chair, cross your ankle over the opposite knee. Gently press the top knee down.',
    instructions: [
      'Sit tall in a chair with feet flat on the floor',
      'Cross your right ankle over your left knee',
      'Gently press the top knee down with your hand',
      'Hold for 15-30 seconds, feeling stretch in hip',
      'Switch sides and repeat',
      'Keep your back straight throughout'
    ],
    position: 'seated',
    targetArea: 'Hip flexors and glutes',
    benefits: ['Improves hip mobility', 'Reduces lower back tension', 'Enhances flexibility'],
    illustration: '🪑',
    imageUrl: '/Seatedpiriformis.png',
    duration: '15-30 sec'
  },
  {
    id: 'seated-hamstring',
    name: 'Seated Hamstring Stretch',
    description: 'Extend one leg straight, heel on the ground, and gently lean forward, keeping the back straight.',
    instructions: [
      'Sit on the edge of a chair',
      'Extend your right leg straight out, heel on the ground',
      'Keep your left foot flat on the floor',
      'Gently lean forward from your hips',
      'Keep your back straight, don\'t round it',
      'Hold for 15-30 seconds, switch sides'
    ],
    position: 'seated',
    targetArea: 'Hamstrings and calves',
    benefits: ['Stretches back of legs', 'Improves flexibility', 'Reduces leg stiffness'],
    illustration: '🦵',
    imageUrl: '/seatedhamstringstretch.png',
    duration: '15-30 sec'
  }
];