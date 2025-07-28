import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import RecipeCard from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, ArrowLeft, Home, BarChart3, Utensils, User, Star, Volume2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import BotanicalDecorations from "@/components/botanical-decorations";
import ShareButton from "@/components/ShareButton";

import PremiumToggle from "@/components/PremiumToggle";
import type { Recipe } from "@shared/schema";
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { useUser } from '@/hooks/useUser';

export default function Nutrition() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDietary, setSelectedDietary] = useState("all");
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const { logNutritionActivity } = useActivityLogger();
  const { isPremium } = useUser();

  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
  });

  const categories = [
    { value: "all", label: "All Recipes" },
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Snacks" },
    { value: "smoothie", label: "Smoothies" },
    { value: "dessert", label: "Desserts" }
  ];

  const dietaryFilters = [
    { value: "all", label: "All Diets", emoji: "🍽️" },
    { value: "vegan", label: "Vegan", emoji: "🌱" },
    { value: "vegetarian", label: "Vegetarian", emoji: "🥬" },
    { value: "peanut_free", label: "Peanut Free", emoji: "🥜" }
  ];

  const handleViewRecipe = (recipeId: number) => {
    console.log("Viewing recipe:", recipeId);
    // Find the recipe and log activity
    if (recipes) {
      const recipe = recipes.find(r => r.id === recipeId);
      if (recipe) {
        logNutritionActivity(1, recipe.title, recipe.category);
      }
    }
  };

  const getFilteredRecipes = () => {
    if (!recipes) return [];
    
    let filtered = recipes;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }
    
    if (selectedDietary !== "all") {
      filtered = filtered.filter(recipe => recipe.dietary === selectedDietary);
    }
    
    return filtered;
  };

  const getRecipesByCategory = (category: string) => {
    const filtered = getFilteredRecipes();
    return category === "all" ? filtered : filtered.filter(recipe => recipe.category === category);
  };

  const getCategoryCount = (category: string) => {
    return getRecipesByCategory(category).length;
  };

  const getDietaryCount = (dietary: string) => {
    if (!recipes) return 0;
    return dietary === "all" ? recipes.length : recipes.filter(recipe => recipe.dietary === dietary).length;
  };

  // toggleSection removed - no longer needed for collapsible sections

  const categoryFilteredRecipes = (category: string) => {
    if (!recipes) return [];
    // Map plural UI categories to singular database categories
    const dbCategory = category === "desserts" ? "dessert" : 
                      category === "smoothies" ? "smoothie" : 
                      category === "snacks" ? "snack" : category;
    
    let filtered = recipes.filter(recipe => 
      recipe.category === dbCategory && 
      (selectedDietary === "all" || recipe.dietary === selectedDietary)
    );

    // Filter premium content for free users
    if (!isPremium) {
      filtered = filtered.filter(recipe => !recipe.premium);
      // Also limit free users to 3 recipes per meal type
      filtered = filtered.slice(0, 3);
    }
    
    return filtered;
  };



  const mealTypeOptions = [
    { value: "breakfast", label: "Breakfast", emoji: "🌅" },
    { value: "lunch", label: "Lunch", emoji: "🌞" },
    { value: "dinner", label: "Dinner", emoji: "🌙" },
    { value: "snack", label: "Snack", emoji: "🍎" },
    { value: "smoothies", label: "Smoothies", emoji: "🥤" },
    { value: "desserts", label: "Desserts", emoji: "🍪" }
  ];

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: `url('/images/tropical-day-coast.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center',
           imageRendering: 'auto'
         }}>
      {/* Clear overlay for contrast without blur */}
      <div className="absolute inset-0 bg-white/30"></div>
      <div className="relative min-h-screen">
      <BotanicalDecorations variant="page" elements={['wave']} />
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="page-header">
            <div className="flex items-center justify-between gap-4 mb-4">
              <Link href="/">
                <Button className="wellness-btn-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <ShareButton type="app" />
            </div>
            <h1 className="page-title">Nutritious Recipes</h1>
            <p className="page-subtitle">
              Healthy, delicious recipes personalized to support your wellness goals
            </p>
            
            {/* Premium Toggle for Demo */}
            <div className="mt-4">
              <PremiumToggle />
            </div>
          </div>



          {/* Meal Type Selection */}
          <div className="wellness-section">
            <div className="wellness-card">
              <div className="wellness-card-content">
                <div className="flex items-center gap-2 mb-3">
                  <ChefHat className="h-5 w-5 text-white" />
                  <h3 className="text-section-title text-white">Browse by Meal Type</h3>
                </div>
                <p className="text-white/80 text-sm mb-3">
                  Select a meal category to see available recipes
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {mealTypeOptions.map((meal) => (
                    <Button
                      key={meal.value}
                      variant={selectedMealType === meal.value ? "default" : "outline"}
                      onClick={() => setSelectedMealType(meal.value)}
                      size="sm"
                      className="text-sm"
                    >
                      <span className="mr-2">{meal.emoji}</span>
                      {meal.label}
                      <span className="ml-1 text-xs">({categoryFilteredRecipes(meal.value).length})</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>



          {/* Dietary Filter - Smaller */}
          <div className="wellness-subsection">
            <div className="wellness-card">
              <div className="wellness-card-content">
                <h3 className="text-card-title text-white mb-2">Dietary Preference</h3>
                <div className="flex flex-wrap gap-2">
                  {dietaryFilters.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={selectedDietary === filter.value ? "default" : "outline"}
                      onClick={() => setSelectedDietary(filter.value)}
                      size="sm"
                      className="text-sm"
                    >
                      <span className="mr-1">{filter.emoji}</span>
                      {filter.label}
                      {recipes && (
                        <span className="ml-1 text-xs">({getDietaryCount(filter.value)})</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Sections */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Recipe Display - Based on Fridge Selection */
            <div className="space-y-6">
              {/* Only show dietary filter if not "all" */}
              {selectedDietary !== "all" && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Showing {dietaryFilters.find(d => d.value === selectedDietary)?.emoji} {dietaryFilters.find(d => d.value === selectedDietary)?.label} recipes only
                  </p>
                </div>
              )}

              {/* Recipe Grid - Shows selected meal type from fridge */}
              <div className="wellness-card">
                <div className="wellness-card-content">
                  <h3 className="text-section-title text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">
                    {mealTypeOptions.find(m => m.value === selectedMealType)?.emoji}
                  </span>
                  {mealTypeOptions.find(m => m.value === selectedMealType)?.label} Recipes
                  <span className="text-sm text-white/70 font-normal">
                    ({categoryFilteredRecipes(selectedMealType).length} available)
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {categoryFilteredRecipes(selectedMealType).map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onView={handleViewRecipe} />
                  ))}
                </div>
                
                {/* Premium upgrade prompt for free users */}
                {!isPremium && recipes && recipes.filter(recipe => {
                  const dbCategory = selectedMealType === "desserts" ? "dessert" : 
                                   selectedMealType === "smoothies" ? "smoothie" : 
                                   selectedMealType === "snacks" ? "snack" : selectedMealType;
                  return recipe.category === dbCategory && 
                         (selectedDietary === "all" || recipe.dietary === selectedDietary);
                }).length > 3 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-orange-600" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-orange-800">Unlock More {mealTypeOptions.find(m => m.value === selectedMealType)?.label} Recipes</h4>
                        <p className="text-sm text-orange-700">
                          You're seeing 3 of {recipes.filter(recipe => {
                            const dbCategory = selectedMealType === "desserts" ? "dessert" : 
                                             selectedMealType === "smoothies" ? "smoothie" : 
                                             selectedMealType === "snacks" ? "snack" : selectedMealType;
                            return recipe.category === dbCategory && 
                                   (selectedDietary === "all" || recipe.dietary === selectedDietary);
                          }).length} available recipes. Upgrade to premium for full access.
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => {
                          // Toggle premium demo mode
                          const toggleEvent = new CustomEvent('togglePremium');
                          window.dispatchEvent(toggleEvent);
                        }}
                      >
                        Upgrade
                      </Button>
                    </div>
                  </div>
                )}
                
                  {categoryFilteredRecipes(selectedMealType).length === 0 && (
                    <p className="text-center text-white/70 py-8">
                      No {selectedMealType} recipes found with your current dietary filter.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      </div>
    </div>
  );
}
