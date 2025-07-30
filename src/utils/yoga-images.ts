// Utility to map uploaded yoga pose images to pose IDs
// This allows easy integration of user-uploaded images without modifying the core data

export const uploadedYogaImages: Record<string, string> = {
  // Map pose IDs to uploaded image paths
  'child-pose': '/assets/Child\'s Pose on Navy Yoga Mat_1752566544365.png',
  'cat-cow': '/assets/Focused Yoga Practice in Camel Pose_1752566521268.png', 
  'cobra-pose': '/assets/Cobra Pose on Navy Mat_1752566536080.png',
  'knee-to-chest': '/assets/Single Knee-to-Chest Yoga Stretch_1752566476932.png',
  'seated-meditation': '/assets/Stretching Focused and Calm_1752566513262.png',
  'double-knee-to-chest': '/assets/Serene Yoga Pose on Blue Mat_1752566488087.png'
};

// Function to get the best available image for a pose
export function getYogaPoseImage(poseId: string, defaultImageUrl: string): string {
  return uploadedYogaImages[poseId] || defaultImageUrl;
}

// Function to register uploaded images
export function registerYogaImage(poseId: string, imageUrl: string) {
  uploadedYogaImages[poseId] = imageUrl;
}

// Quick function to update multiple poses at once
export function registerMultipleYogaImages(imageMap: Record<string, string>) {
  Object.assign(uploadedYogaImages, imageMap);
}