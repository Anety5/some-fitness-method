import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Star, Target, Heart, Zap, Download } from 'lucide-react';
import BadgeDownload from './BadgeDownload';

interface BadgeData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requirement: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  color: string;
  category: 'breathing' | 'fitness' | 'nutrition' | 'sleep';
}

export default function AchievementBadges() {
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [showDownload, setShowDownload] = useState(false);

  // Mock user progress data (would come from real activity tracking)
  const userProgress = {
    breathingSessions: 15,
    exercisesCompleted: 8,
    recipesViewed: 12,
    daysActive: 7,
    meditationMinutes: 180,
    workoutMinutes: 240
  };

  const badges: BadgeData[] = [
    // Breathing Badges - Pufferfish and Octopus themed
    {
      id: 'pufferfish-breather',
      title: 'Pufferfish Breather',
      description: 'Master the pufferfish breathing technique',
      icon: <span className="text-xl">🐡</span>,
      requirement: 'Complete 5 pufferfish breathing sessions',
      unlocked: userProgress.breathingSessions >= 5,
      progress: Math.min(userProgress.breathingSessions, 5),
      maxProgress: 5,
      color: 'from-blue-500 to-cyan-500',
      category: 'breathing'
    },
    {
      id: 'octopus-master',
      title: 'Relaxed to da Max',
      description: 'Master the 4-7-8 octopus breathing technique',
      icon: <span className="text-xl">🐙</span>,
      requirement: 'Complete 10 octopus breathing sessions',
      unlocked: userProgress.breathingSessions >= 10,
      progress: Math.min(userProgress.breathingSessions, 10),
      maxProgress: 10,
      color: 'from-blue-600 to-teal-600',
      category: 'breathing'
    },

    // Exercise/Movement Badges
    {
      id: 'morning-mover',
      title: 'Morning Mover',
      description: 'Complete your first morning routine',
      icon: <span className="text-xl">🌅</span>,
      requirement: 'Complete 1 morning exercise routine',
      unlocked: userProgress.exercisesCompleted >= 1,
      progress: Math.min(userProgress.exercisesCompleted, 1),
      maxProgress: 1,
      color: 'from-green-500 to-emerald-500',
      category: 'fitness'
    },
    {
      id: 'strength-builder',
      title: 'Strength Builder',
      description: 'Build strength with consistent training',
      icon: <span className="text-xl">💪</span>,
      requirement: 'Complete 15 strength exercises',
      unlocked: userProgress.exercisesCompleted >= 15,
      progress: Math.min(userProgress.exercisesCompleted, 15),
      maxProgress: 15,
      color: 'from-green-600 to-lime-600',
      category: 'fitness'
    },
    {
      id: 'movement-master',
      title: 'Movement Master',
      description: 'Achieve movement mastery',
      icon: <span className="text-xl">🏃</span>,
      requirement: 'Complete 30 total exercises',
      unlocked: userProgress.exercisesCompleted >= 30,
      progress: Math.min(userProgress.exercisesCompleted, 30),
      maxProgress: 30,
      color: 'from-green-700 to-emerald-700',
      category: 'fitness'
    },

    // Nutrition/Recipe Badges
    {
      id: 'recipe-explorer',
      title: 'Recipe Explorer',
      description: 'Discover healthy island recipes',
      icon: <span className="text-xl">🥗</span>,
      requirement: 'View 5 healthy recipes',
      unlocked: userProgress.recipesViewed >= 5,
      progress: Math.min(userProgress.recipesViewed, 5),
      maxProgress: 5,
      color: 'from-orange-500 to-red-500',
      category: 'nutrition'
    },
    {
      id: 'meal-planner',
      title: 'Meal Planner',
      description: 'Save recipes for meal planning',
      icon: <span className="text-xl">🍽️</span>,
      requirement: 'Save 3 favorite recipes',
      unlocked: userProgress.recipesViewed >= 12, // Assuming some saved
      progress: Math.min(Math.floor(userProgress.recipesViewed / 4), 3),
      maxProgress: 3,
      color: 'from-orange-600 to-amber-600',
      category: 'nutrition'
    },
    {
      id: 'nutrition-guru',
      title: 'Nutrition Guru',
      description: 'Master healthy eating habits',
      icon: <span className="text-xl">🥑</span>,
      requirement: 'Explore 20 recipes across all categories',
      unlocked: userProgress.recipesViewed >= 20,
      progress: Math.min(userProgress.recipesViewed, 20),
      maxProgress: 20,
      color: 'from-orange-700 to-red-700',
      category: 'nutrition'
    },

    // Sleep/Rest Badges
    {
      id: 'sleep-starter',
      title: 'Sleep Starter',
      description: 'Begin your sleep wellness journey',
      icon: <span className="text-xl">😴</span>,
      requirement: 'Use sleep preparation techniques 3 times',
      unlocked: userProgress.meditationMinutes >= 30, // Assuming sleep audio usage
      progress: Math.min(Math.floor(userProgress.meditationMinutes / 10), 3),
      maxProgress: 3,
      color: 'from-purple-500 to-indigo-500',
      category: 'sleep'
    },
    {
      id: 'rest-master',
      title: 'Rest Master',
      description: 'Master the art of quality rest',
      icon: <span className="text-xl">🌙</span>,
      requirement: 'Complete 60 minutes of sleep audio',
      unlocked: userProgress.meditationMinutes >= 60,
      progress: Math.min(userProgress.meditationMinutes, 60),
      maxProgress: 60,
      color: 'from-purple-600 to-violet-600',
      category: 'sleep'
    },
    {
      id: 'dream-guardian',
      title: 'Dream Guardian',
      description: 'Protect and enhance your sleep quality',
      icon: <span className="text-xl">⭐</span>,
      requirement: 'Complete 120 minutes of sleep preparation',
      unlocked: userProgress.meditationMinutes >= 120,
      progress: Math.min(userProgress.meditationMinutes, 120),
      maxProgress: 120,
      color: 'from-purple-700 to-indigo-700',
      category: 'sleep'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Badges', count: badges.length },
    { id: 'breathing', label: 'Breathing', count: badges.filter(b => b.category === 'breathing').length },
    { id: 'fitness', label: 'Movement', count: badges.filter(b => b.category === 'fitness').length },
    { id: 'nutrition', label: 'Nutrition', count: badges.filter(b => b.category === 'nutrition').length },
    { id: 'sleep', label: 'Sleep', count: badges.filter(b => b.category === 'sleep').length }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const progressPercentage = (unlockedCount / badges.length) * 100;

  const generateBadgeCanvas = (badge: BadgeData) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Create gradient background
    const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
    const colors = badge.color.match(/from-(\w+-\d+)\s+to-(\w+-\d+)/);
    gradient.addColorStop(0, badge.unlocked ? '#1e40af' : '#6b7280');
    gradient.addColorStop(1, badge.unlocked ? '#1e3a8a' : '#374151');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Draw badge circle
    ctx.beginPath();
    ctx.arc(200, 200, 150, 0, 2 * Math.PI);
    ctx.fillStyle = badge.unlocked ? '#ffffff' : '#9ca3af';
    ctx.fill();
    ctx.strokeStyle = badge.unlocked ? '#fbbf24' : '#6b7280';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Add text
    ctx.fillStyle = badge.unlocked ? '#1e40af' : '#6b7280';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(badge.title, 200, 190);
    
    ctx.font = '14px Arial';
    ctx.fillText(badge.unlocked ? 'UNLOCKED' : 'LOCKED', 200, 220);

    return canvas;
  };

  const downloadBadge = (badge: BadgeData) => {
    if (!badge.unlocked) return;
    
    const canvas = generateBadgeCanvas(badge);
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${badge.id}-achievement-badge.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  if (showDownload && selectedBadge) {
    return (
      <div className="space-y-4">
        <Button 
          onClick={() => setShowDownload(false)}
          variant="outline"
          className="mb-4"
        >
          ← Back to Badges
        </Button>
        <BadgeDownload 
          badgeTitle={selectedBadge.title}
          badgeDescription={selectedBadge.description}
          onClose={() => setShowDownload(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-300/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-white">
              <span>Badges Unlocked</span>
              <span className="font-bold">{unlockedCount} / {badges.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-white/80 text-sm">
              Keep using S.O.M.E fitness method to unlock more achievements!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`${
              selectedCategory === category.id 
                ? "bg-blue-600 text-white" 
                : "bg-white/10 text-white border-white/30 hover:bg-white/20"
            }`}
          >
            {category.label} ({category.count})
          </Button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => (
          <Card 
            key={badge.id} 
            className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
              badge.unlocked 
                ? `bg-gradient-to-br ${badge.color}/20 border-yellow-400/50` 
                : 'bg-gray-700/20 border-gray-500/30'
            }`}
          >
            {badge.unlocked && (
              <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                <Trophy className="w-4 h-4 text-white" />
              </div>
            )}
            
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  badge.unlocked 
                    ? `bg-gradient-to-br ${badge.color}` 
                    : 'bg-gray-600'
                }`}>
                  <div className={badge.unlocked ? 'text-white' : 'text-gray-400'}>
                    {badge.icon}
                  </div>
                </div>
                <div>
                  <CardTitle className={`text-lg ${badge.unlocked ? 'text-white' : 'text-gray-400'}`}>
                    {badge.title}
                  </CardTitle>
                  <Badge variant={badge.unlocked ? "default" : "secondary"} className="mt-1">
                    {badge.unlocked ? 'Unlocked' : 'Locked'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className={`text-sm ${badge.unlocked ? 'text-white/90' : 'text-gray-400'}`}>
                {badge.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={badge.unlocked ? 'text-white/80' : 'text-gray-400'}>
                    Progress
                  </span>
                  <span className={badge.unlocked ? 'text-white' : 'text-gray-400'}>
                    {badge.progress} / {badge.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      badge.unlocked 
                        ? `bg-gradient-to-r ${badge.color}` 
                        : 'bg-gray-600'
                    }`}
                    style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
              
              <p className={`text-xs ${badge.unlocked ? 'text-white/70' : 'text-gray-500'}`}>
                {badge.requirement}
              </p>

              {badge.unlocked && (
                <Button
                  onClick={() => downloadBadge(badge)}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Badge
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}