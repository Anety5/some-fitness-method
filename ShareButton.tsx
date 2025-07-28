import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Instagram, Copy, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from '@/hooks/useUser';

interface ShareButtonProps {
  type: 'app' | 'recipe';
  data?: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    category: string;
    prepTime: number;
    calories: number;
    protein: number;
    fiber: number;
  };
  premium?: boolean;
}

export default function ShareButton({ type, data, premium = false }: ShareButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const { isPremium } = useUser();

  const shareToInstagram = () => {
    if (type === 'app') {
      const appText = "Check out S.O.M.E fitness method - the wellness app that tracks Sleep, Oxygen, Movement, and Eating! 🌟 #wellness #healthylifestyle #somefitness";
      navigator.clipboard.writeText(appText);
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Text copied! Now paste it in your Instagram post.';
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg z-50';
      document.body.appendChild(successMsg);
      setTimeout(() => document.body.removeChild(successMsg), 3000);
      
      const instagramUrl = `https://www.instagram.com/`;
      window.open(instagramUrl, '_blank');
    } else if (data) {
      const recipeText = `Just found this amazing ${data.category} recipe: ${data.title}! 🍽️\n\nReady in ${data.prepTime} minutes with ${data.calories} calories.\n\nGet this recipe and more on S.O.M.E fitness method app! #healthyeating #wellness #somefitness`;
      navigator.clipboard.writeText(recipeText);
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Recipe text copied! Now paste it in your Instagram post.';
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg z-50';
      document.body.appendChild(successMsg);
      setTimeout(() => document.body.removeChild(successMsg), 3000);
      
      const instagramUrl = `https://www.instagram.com/`;
      window.open(instagramUrl, '_blank');
    }
    setShowOptions(false);
  };

  const copyLink = () => {
    if (type === 'app') {
      const appUrl = window.location.origin;
      navigator.clipboard.writeText(`${appUrl} - S.O.M.E fitness method: Track your Sleep, Oxygen, Movement, and Eating for optimal wellness!`);
    } else if (data) {
      const recipeText = `${data.title}\n\n${data.description}\n\nIngredients:\n${data.ingredients.map(ing => `• ${ing}`).join('\n')}\n\nInstructions:\n${data.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}\n\nNutrition: ${data.calories} cal, ${data.protein}g protein, ${data.fiber}g fiber\nPrep time: ${data.prepTime} minutes\n\nFrom S.O.M.E fitness method app`;
      navigator.clipboard.writeText(recipeText);
    }
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.textContent = type === 'app' ? 'App link copied!' : 'Recipe copied to clipboard!';
    successMsg.className = 'fixed top-4 right-4 bg-blue-500 text-white p-3 rounded-lg z-50';
    document.body.appendChild(successMsg);
    setTimeout(() => document.body.removeChild(successMsg), 3000);
    setShowOptions(false);
  };

  const downloadRecipe = () => {
    if (!data || !isPremium) return;
    
    const recipeContent = `${data.title}
${data.description}

Category: ${data.category}
Prep Time: ${data.prepTime} minutes
Calories: ${data.calories}
Protein: ${data.protein}g
Fiber: ${data.fiber}g

INGREDIENTS:
${data.ingredients.map(ing => `• ${ing}`).join('\n')}

INSTRUCTIONS:
${data.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

---
From S.O.M.E fitness method app
Visit: ${window.location.origin}
`;

    const blob = new Blob([recipeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.textContent = 'Recipe downloaded successfully!';
    successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg z-50';
    document.body.appendChild(successMsg);
    setTimeout(() => document.body.removeChild(successMsg), 3000);
    setShowOptions(false);
  };

  const shareNative = () => {
    if (navigator.share) {
      const shareData = type === 'app' 
        ? {
            title: 'S.O.M.E fitness method',
            text: 'Track your Sleep, Oxygen, Movement, and Eating for optimal wellness!',
            url: window.location.origin
          }
        : {
            title: data?.title || 'Recipe',
            text: `Check out this ${data?.category} recipe: ${data?.title}! Ready in ${data?.prepTime} minutes.`,
            url: window.location.href
          };
      
      navigator.share(shareData);
      setShowOptions(false);
    } else {
      copyLink();
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      
      {showOptions && (
        <Card className="absolute top-10 right-0 z-10 w-48 bg-white border shadow-lg">
          <CardContent className="p-2 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={shareToInstagram}
              className="w-full justify-start"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={shareNative}
              className="w-full justify-start"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share App
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={copyLink}
              className="w-full justify-start"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Text
            </Button>
            
            {type === 'recipe' && data && (
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadRecipe}
                disabled={!isPremium}
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
                {!isPremium && <Badge variant="secondary" className="ml-2 text-xs">Premium</Badge>}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}