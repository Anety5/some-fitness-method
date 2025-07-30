import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat } from "lucide-react";
import BotanicalDecorations from "@/components/botanical-decorations";
import FavoriteButton from "@/components/favorite-button";
import ShareButton from "@/components/ShareButton";
import type { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  onView?: (id: number) => void;
}

export default function RecipeCard({ recipe, onView }: RecipeCardProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDietaryColor = (dietary: string | null) => {
    switch (dietary) {
      case "vegan": return "bg-green-50 text-green-700 border-green-200";
      case "vegetarian": return "bg-blue-50 text-blue-700 border-blue-200";
      case "peanut_free": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "regular": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatPrepTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 relative h-full">
      <BotanicalDecorations variant="card" elements={['hibiscus']} />
      <CardContent className="p-4 bg-card h-full flex flex-col relative">
        <div className="space-y-2 flex-grow">
          {/* Header with title and action buttons */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-base text-black flex-1 leading-tight">{recipe.title}</h3>
            <div className="flex space-x-1 ml-2">
              <FavoriteButton 
                userId={1}
                itemType="recipe"
                itemId={recipe.id}
                className="px-1"
              />
              <ShareButton
                type="recipe"
                data={{
                  title: recipe.title,
                  description: recipe.description,
                  ingredients: recipe.ingredients,
                  instructions: recipe.instructions,
                  category: recipe.category,
                  prepTime: recipe.prepTime,
                  calories: recipe.calories,
                  protein: recipe.protein,
                  fiber: recipe.fiber
                }}
                premium={recipe.premium || false}
              />
            </div>
          </div>

          {/* Description */}
          <p className="italic text-xs text-gray-700 line-clamp-2">{recipe.description}</p>

          {/* Quick-view badges */}
          <div className="flex items-center gap-1 flex-wrap">
            <Badge 
              variant="outline" 
              className={`${getDifficultyColor(recipe.difficulty)} text-xs`}
            >
              {recipe.difficulty || 'easy'}
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
              {formatPrepTime(recipe.prepTime)}
            </Badge>
            {recipe.dietary && (
              <Badge variant="outline" className={`${getDietaryColor(recipe.dietary)} text-xs`}>
                {recipe.dietary === "peanut_free" ? "Peanut Free" : recipe.dietary}
              </Badge>
            )}
          </div>

          {/* Nutrition info */}
          <div className="text-xs text-gray-600">
            <span className="font-medium">{recipe.calories} cal</span> • 
            <span>{recipe.protein}g protein</span> • 
            <span>{recipe.fiber}g fiber</span>
          </div>
          
          {/* Ingredients preview */}
          <div className="mt-auto">
            <p className="text-xs text-gray-600">
              <strong>Ingredients:</strong> {recipe.ingredients.slice(0, 2).join(', ')}
              {recipe.ingredients.length > 2 && '...'}
            </p>
            
            {/* Instructions toggle */}
            <button 
              className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 cursor-pointer bg-transparent border-none" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Recipe button clicked for:", recipe.title);
                setShowInstructions(!showInstructions);
                if (onView && !showInstructions) {
                  onView(recipe.id);
                }
              }}
            >
              {showInstructions ? "Hide Recipe" : "View Recipe"}
            </button>
            
            {showInstructions && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                <div className="mb-2">
                  <strong>All Ingredients:</strong>
                  <ul className="mt-1 space-y-0.5">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>• {ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Instructions:</strong>
                  <ol className="mt-1 space-y-0.5 list-decimal list-inside">
                    {recipe.instructions.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
