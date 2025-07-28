import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ActivityLog {
  userId: number;
  activityType: 'audio' | 'breathing' | 'exercise' | 'nutrition' | 'manual';
  title: string;
  description: string;
  category: string;
  duration?: number;
  sessionData?: any;
}

export function useActivityLogger() {
  const queryClient = useQueryClient();

  const logActivity = useMutation({
    mutationFn: async (activity: ActivityLog) => {
      // Create a scheduled activity that is immediately completed (auto-logged)
      const scheduledActivity = {
        userId: activity.userId,
        activityId: 2, // Use existing Mindful Breathing activity ID
        scheduledTime: new Date(),
        completed: true,
        completedAt: new Date(),
        status: 'completed'
      };

      return await apiRequest('POST', '/api/schedule', scheduledActivity);
    },
    onSuccess: () => {
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
    },
  });

  // Convenience functions for different activity types
  const logAudioActivity = (userId: number, audioTitle: string, duration: number, category: string) => {
    logActivity.mutate({
      userId,
      activityType: 'audio',
      title: audioTitle,
      description: `Listened to ${audioTitle}`,
      category,
      duration: Math.round(duration / 60), // Convert seconds to minutes
      sessionData: {
        audioTrack: audioTitle,
        actualDuration: duration
      }
    });
  };

  const logBreathingActivity = (userId: number, exerciseTitle: string, duration: number) => {
    logActivity.mutate({
      userId,
      activityType: 'breathing',
      title: exerciseTitle,
      description: `Completed ${exerciseTitle} breathing exercise`,
      category: 'breathing',
      duration: Math.round(duration / 60),
      sessionData: {
        exerciseType: exerciseTitle,
        actualDuration: duration
      }
    });
  };

  const logExerciseActivity = (userId: number, exerciseTitle: string, exerciseType: string) => {
    logActivity.mutate({
      userId,
      activityType: 'exercise',
      title: exerciseTitle,
      description: `Completed ${exerciseTitle}`,
      category: exerciseType,
      duration: 5, // Default duration for exercises
      sessionData: {
        exerciseType,
        exerciseName: exerciseTitle
      }
    });
  };

  const logNutritionActivity = (userId: number, recipeTitle: string, mealType: string) => {
    logActivity.mutate({
      userId,
      activityType: 'nutrition',
      title: `Viewed Recipe: ${recipeTitle}`,
      description: `Viewed ${recipeTitle} recipe`,
      category: mealType,
      duration: 2, // Default viewing time
      sessionData: {
        recipeTitle,
        mealType
      }
    });
  };

  return {
    logAudioActivity,
    logBreathingActivity,
    logExerciseActivity,
    logNutritionActivity,
    isLogging: logActivity.isPending
  };
}