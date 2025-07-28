import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Clock, Users, ChefHat, Utensils, FileText, Upload } from 'lucide-react';
import RecipeCard from '@/components/recipe-card';
import ContentViewer from '@/components/content-viewer';
import type { Recipe } from '@shared/schema';

interface RecipeFinderProps {
  onRecipeSelect?: (recipe: Recipe) => void;
}

export default function RecipeFinder({ onRecipeSelect }: RecipeFinderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('search');

  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes', selectedCategory === 'all' ? undefined : selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === 'all' 
        ? '/api/recipes' 
        : `/api/recipes?category=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch recipes');
      return response.json();
    }
  });

  const filteredRecipes = recipes?.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  const categories = [
    { value: 'all', label: 'All Recipes' },
    { value: 'stress-relief', label: 'Stress Relief' },
    { value: 'energy', label: 'Energy Boost' },
    { value: 'sleep', label: 'Better Sleep' },
    { value: 'focus', label: 'Mental Focus' },
    { value: 'immune', label: 'Immune Support' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snacks', label: 'Healthy Snacks' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <ChefHat className="h-6 w-6" />
          Find Recipe
        </h2>
        <p className="text-gray-600">Discover healthy recipes for your wellness journey</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search Recipes</TabsTrigger>
          <TabsTrigger value="collection">Recipe Collection</TabsTrigger>
          <TabsTrigger value="upload">Upload Recipes</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search recipes by name, ingredients, or benefits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={selectedCategory === category.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipe Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onView={onRecipeSelect}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse our recipe collection</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="collection" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recipe Collection from Assets */}
            <ContentViewer
              title="Stress-Relief Recipes"
              filePath="/assets/recipes/stress-relief-recipes.md"
              description="Calming foods and teas to reduce stress and anxiety"
            />
            
            <ContentViewer
              title="Energy-Boosting Meals"
              filePath="/assets/recipes/energy-boost-recipes.md"
              description="Nutritious recipes to naturally increase your energy levels"
            />
            
            <ContentViewer
              title="Sleep-Promoting Foods"
              filePath="/assets/recipes/sleep-recipes.md"
              description="Evening meals and snacks that support better sleep"
            />
            
            <ContentViewer
              title="Brain-Boosting Nutrition"
              filePath="/assets/recipes/focus-recipes.md"
              description="Foods that enhance mental clarity and concentration"
            />
            
            <ContentViewer
              title="Immune-Supporting Recipes"
              filePath="/assets/recipes/immune-recipes.md"
              description="Nutrient-dense meals to strengthen your immune system"
            />
            
            <Card className="border-dashed border-2 border-gray-300 flex items-center justify-center min-h-48">
              <div className="text-center space-y-2">
                <FileText className="h-8 w-8 mx-auto text-gray-400" />
                <p className="text-gray-500">More recipes coming soon</p>
                <Button variant="outline" onClick={() => setActiveTab('upload')}>
                  Upload Your Recipes
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Your Recipes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Share Your Wellness Recipes</h3>
                  <p className="text-gray-600 mb-4">Upload recipe files to expand the wellness recipe collection</p>
                  <Button onClick={() => window.location.href = '/content'}>
                    Go to Content Manager
                  </Button>
                </div>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Supported formats: .md, .txt, .pdf</p>
                  <p>Include ingredients, instructions, and wellness benefits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}