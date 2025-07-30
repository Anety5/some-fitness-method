export interface StrengthExercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  progressions: string[];
  illustration: string;
  imageUrl: string;
  uploadedImageUrl?: string; // For actual uploaded images
  defaultDuration: number;
  sets: string;
  reps: string;
  frequency: string;
}

export const strengthTrainingExercises: StrengthExercise[] = [
  {
    id: "wall-squat",
    name: "Wall Squat",
    description: "3 sets of 10-30s hold",
    instructions: [
      "Stand with your back against a wall, feet shoulder-width apart",
      "Slide down the wall until thighs are parallel to the ground",
      "Keep your knees at 90-degree angle directly above ankles",
      "Hold the position for 10-30 seconds",
      "Complete 3 sets with rest between each hold"
    ],
    targetMuscles: ["Quadriceps", "Glutes", "Core", "Calves"],
    difficulty: "beginner",
    benefits: ["Builds leg strength and endurance", "Improves core stability", "Perfect form training", "Low impact on joints"],
    progressions: ["Start with 10 seconds", "Progress to 30 seconds", "Add single-leg variations"],
    illustration: "🧱",
    imageUrl: "/exercise-images/wall-squat.svg",
    uploadedImageUrl: "/strengthening exercises/WallSquat.png",
    defaultDuration: 20,
    sets: "3 sets",
    reps: "10-30s hold",
    frequency: "Daily"
  },
  {
    id: "lunges",
    name: "Lunges",
    description: "Forward lunges with proper form - 3 sets of 10-12 per leg",
    instructions: [
      "Stand with feet hip-width apart, hands on hips or at sides",
      "Step forward with one leg, lowering your hips until both knees are bent at 90 degrees",
      "Keep front knee directly above ankle, not pushed out past toes",
      "Keep the weight in your heels as you push back up to starting position",
      "Alternate legs or complete all reps on one side before switching"
    ],
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
    difficulty: "beginner",
    benefits: ["Builds unilateral leg strength", "Improves balance and stability", "Enhances functional movement", "Strengthens core"],
    progressions: ["Start with bodyweight", "Add dumbbells when ready", "Try reverse or walking lunges"],
    illustration: "🏃‍♂️",
    imageUrl: "/exercise-images/lunges.svg",
    uploadedImageUrl: "/strengthening exercises/Lunges.png",
    defaultDuration: 12,
    sets: "3 sets",
    reps: "10-12 per leg",
    frequency: "Daily"
  },
  {
    id: "wall-push-up",
    name: "Wall Push-Up",
    description: "Upper body strengthening using wall support - 3 sets of 10-15 reps",
    instructions: [
      "Stand arm's length away from a wall with feet shoulder-width apart",
      "Place palms flat against the wall at shoulder height and width",
      "Keep your body in a straight line from head to heels",
      "Lean into the wall by bending your elbows, keeping them close to your body",
      "Push back to starting position in a controlled motion",
      "Keep core engaged throughout the entire movement"
    ],
    targetMuscles: ["Chest", "Shoulders", "Triceps", "Core"],
    difficulty: "beginner",
    benefits: ["Builds upper body strength", "Improves pushing mechanics", "Perfect for beginners", "Low impact on joints"],
    progressions: ["Start with wall push-ups", "Progress to incline push-ups", "Advance to regular push-ups"],
    illustration: "🤲",
    imageUrl: "/exercise-images/wall-push-up.svg",
    uploadedImageUrl: "/strengthening exercises/Wall PushUp.png",
    defaultDuration: 12,
    sets: "3 sets",
    reps: "10-15",
    frequency: "Daily"
  },
  {
    id: "bird-dog-single",
    name: "Bird Dog (Single Leg)",
    description: "Core stability exercise with single leg extension - Hold for 2-3 sec",
    instructions: [
      "Start on hands and knees with wrists under shoulders and knees under hips",
      "Keep your spine in neutral position and core engaged",
      "Slowly extend one leg straight back, keeping hips level",
      "Hold the position for 2-3 seconds while maintaining balance",
      "Return to starting position with control",
      "Complete all reps on one side before switching to the other leg"
    ],
    targetMuscles: ["Core", "Glutes", "Lower Back", "Shoulders"],
    difficulty: "intermediate",
    benefits: ["Improves core stability", "Enhances balance and coordination", "Strengthens posterior chain", "Improves spinal alignment"],
    progressions: ["Master single leg first", "Progress to opposite arm/leg", "Add resistance bands"],
    illustration: "🐕",
    imageUrl: "/exercise-images/bird-dog-single.svg",
    uploadedImageUrl: "/strengthening exercises/birdogsingleleg.png",
    defaultDuration: 10,
    sets: "3 sets",
    reps: "10 per side",
    frequency: "Daily"
  },
  {
    id: "bird-dog-opposite",
    name: "Bird Dog (Opposite Arm/Leg)",
    description: "Advanced core stability with opposite arm and leg extension - Hold for 2-3 sec",
    instructions: [
      "Start on hands and knees with wrists under shoulders and knees under hips",
      "Keep your spine in neutral position and core engaged",
      "Simultaneously extend your right arm forward and left leg back",
      "Hold the position for 2-3 seconds while maintaining balance",
      "Return to starting position with control",
      "Switch to left arm and right leg for the next rep",
      "Focus on keeping hips level throughout the movement"
    ],
    targetMuscles: ["Core", "Glutes", "Lower Back", "Shoulders", "Hip Stabilizers"],
    difficulty: "intermediate",
    benefits: ["Full-body coordination", "Core and glute strengthening", "Improves spinal stability", "Enhances balance"],
    progressions: ["Master single limb first", "Focus on smooth movements", "Add ankle weights for progression"],
    illustration: "🐕‍🦺",
    imageUrl: "/exercise-images/bird-dog-opposite.svg",
    uploadedImageUrl: "/strengthening exercises/Birdogarmandleg.png",
    defaultDuration: 10,
    sets: "3 sets",
    reps: "10 per side",
    frequency: "Daily"
  },
  {
    id: "glute-bridge",
    name: "Glute Bridge",
    description: "2 sets of 10, 5 sec hold",
    instructions: [
      "Lie on your back with knees bent and feet flat on the floor, hip-width apart",
      "Keep your arms at your sides with palms down for stability",
      "Engage your core and squeeze your glutes as you lift your hips up",
      "Create a straight line from your knees to your shoulders",
      "Hold the position for 5 seconds while squeezing your glutes",
      "Lower your hips back down with control",
      "Complete 10 reps with 5-second holds for 2 sets"
    ],
    targetMuscles: ["Glutes", "Hamstrings", "Core", "Hip Flexors"],
    difficulty: "beginner",
    benefits: ["Strengthens glutes and hamstrings", "Improves hip mobility", "Counters sitting posture", "Enhances posterior chain"],
    progressions: ["Start with shorter holds", "Try single-leg variations", "Add weight on hips"],
    illustration: "🌉",
    imageUrl: "/exercise-images/glute-bridge.svg",
    uploadedImageUrl: "/strengthening exercises/Bridging.png",
    defaultDuration: 13,
    sets: "2 sets",
    reps: "10 (5 sec hold)",
    frequency: "Daily"
  }
];