import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Star, ChefHat, Clock, Users } from 'lucide-react';

interface LockedRecipeProps {
  title: string;
  description?: string;
  prepTime?: string;
  difficulty?: string;
  dietary?: string[];
  onUpgradeClick: () => void;
}

export default function LockedRecipe({ 
  title, 
  description, 
  prepTime, 
  difficulty,
  dietary,
  onUpgradeClick 
}: LockedRecipeProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 relative overflow-hidden hover:shadow-lg transition-shadow">
      <div className="absolute top-3 right-3">
        <Lock className="w-5 h-5 text-amber-600" />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <ChefHat className="w-5 h-5" />
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex gap-2 mt-1">
              {difficulty && (
                <Badge className={getDifficultyColor(difficulty)}>
                  {difficulty}
                </Badge>
              )}
              <Badge className="bg-amber-200 text-amber-800">
                <Star className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {description && (
          <p className="text-amber-700 text-sm">{description}</p>
        )}
        
        <div className="flex items-center gap-4 text-sm text-amber-600">
          {prepTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{prepTime}</span>
            </div>
          )}
          {dietary && dietary.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{dietary.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="bg-amber-100/50 rounded-lg p-4">
          <div className="flex items-center justify-center text-amber-600 mb-3">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <p className="text-center text-amber-700 text-sm">
            Unlock premium recipes with detailed instructions, nutritional information, and chef tips
          </p>
        </div>

        <Button 
          onClick={onUpgradeClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full w-full"
          size="sm"
        >
          Go Premium
        </Button>
      </CardContent>
    </Card>
  );
}