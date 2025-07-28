import { useState } from "react";

interface ExerciseImageProps {
  exerciseName: string;
  className?: string;
}

// Exercise emoji mapping for visual representation
const exerciseEmojis: Record<string, string> = {
  "Wall Sit": "🧱",
  "Lunges": "🏃‍♂️",
  "Wall Push-Up": "🤲",
  "Bird Dog (Single Leg)": "🐕",
  "Bird Dog (Opposite Arm/Leg)": "🐕‍🦺",
  "Glute Bridge": "🌉",
  // Add more as needed
};

// Exercise color mapping for backgrounds
const exerciseColors: Record<string, string> = {
  "Wall Sit": "from-blue-200 to-blue-300",
  "Lunges": "from-green-200 to-green-300", 
  "Wall Push-Up": "from-yellow-200 to-yellow-300",
  "Bird Dog (Single Leg)": "from-purple-200 to-purple-300",
  "Bird Dog (Opposite Arm/Leg)": "from-orange-200 to-orange-300",
  "Glute Bridge": "from-pink-200 to-pink-300",
};

export default function ExerciseImage({ exerciseName, className = "w-24 h-24" }: ExerciseImageProps) {
  const [hasError, setHasError] = useState(false);
  
  const emoji = exerciseEmojis[exerciseName] || "💪";
  const colorClass = exerciseColors[exerciseName] || "from-gray-200 to-gray-300";
  
  // Try to load actual exercise image first (supports multiple formats)
  const baseFileName = exerciseName.toLowerCase().replace(/\s+/g, '-');
  const imagePath = `/exercise-images/${baseFileName}`;
  
  if (!hasError) {
    return (
      <div className={`${className} rounded-lg overflow-hidden border-2 border-gray-200 bg-white`}>
        <img 
          src={`${imagePath}.png`}
          alt={`${exerciseName} demonstration`}
          className="w-full h-full object-contain"
          onError={() => {
            // Try SVG fallback
            const imgElement = document.createElement('img');
            imgElement.src = `${imagePath}.svg`;
            imgElement.onload = () => {
              // SVG exists, update src
              const currentImg = document.querySelector(`img[alt="${exerciseName} demonstration"]`) as HTMLImageElement;
              if (currentImg) currentImg.src = `${imagePath}.svg`;
            };
            imgElement.onerror = () => setHasError(true);
          }}
        />
      </div>
    );
  }
  
  // Fallback to emoji if image fails to load
  return (
    <div className={`bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center ${className}`}>
      <span className="text-2xl">{emoji}</span>
    </div>
  );
}