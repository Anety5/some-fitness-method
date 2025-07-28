// Utility to map uploaded strength training exercise images to exercise IDs
// This allows easy integration of user-uploaded images without modifying the core data

export const uploadedStrengthImages: Record<string, string> = {
  // User-provided exercise images with proper form demonstrations
  'wall-squat': '/strengthening exercises/wall-squat.png',
  'lunges': '/strengthening exercises/lunges.png',
  'wall-push-up': '/strengthening exercises/wall-push-up.png',
  'bird-dog-single': '/strengthening exercises/bird-dog-single.png',
  'bird-dog-opposite': '/strengthening exercises/bird-dog-opposite.png',
  'glute-bridge': '/strengthening exercises/glute-bridge.png'
};

// Function to get the best available image for an exercise
export function getStrengthExerciseImage(exerciseId: string, defaultImageUrl: string, uploadedImageUrl?: string): string {
  // Priority: 1. uploadedImageUrl from exercise data, 2. uploadedStrengthImages mapping, 3. defaultImageUrl
  return uploadedImageUrl || uploadedStrengthImages[exerciseId] || defaultImageUrl;
}

// Function to register uploaded images
export function registerStrengthImage(exerciseId: string, imageUrl: string) {
  uploadedStrengthImages[exerciseId] = imageUrl;
}

// Quick function to update multiple exercises at once
export function registerMultipleStrengthImages(imageMap: Record<string, string>) {
  Object.assign(uploadedStrengthImages, imageMap);
}