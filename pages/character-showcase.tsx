import Navigation from "@/components/navigation";
import CharacterImageDisplay from "@/components/character-image-display";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

const characters = [
  { id: 'max', name: 'Max', emoji: '🏃‍♂️', description: 'Personal Trainer' },
  { id: 'mia', name: 'Mia', emoji: '🏋️‍♀️', description: 'Fitness Coach' },
  { id: 'zeke', name: 'Zeke', emoji: '⚽', description: 'Soccer Coach' },
  { id: 'luna', name: 'Luna', emoji: '🧘‍♀️', description: 'Meditation Specialist' },
  { id: 'kai', name: 'Kai', emoji: '🏔️', description: 'Outdoorsman' },
  { id: 'nova', name: 'Nova', emoji: '💫', description: 'Tech Yoga Coach' },
  { id: 'gunner', name: 'Gunner', emoji: '🐕', description: 'Loyal Companion' }
];

export default function CharacterShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/character-gallery">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Character Showcase</h1>
          <p className="text-gray-600">Upload and display your generated character images</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {characters.map((character) => (
            <Card key={character.id} className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">{character.name}</CardTitle>
                <Badge variant="outline" className="w-fit mx-auto">
                  {character.description}
                </Badge>
              </CardHeader>
              <CardContent>
                <CharacterImageDisplay
                  characterId={character.id}
                  characterName={character.name}
                  characterEmoji={character.emoji}
                  size="large"
                  showUpload={true}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-3">How to Use</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Generate your character images using the detailed prompts from the Character Gallery</p>
            <p>• Click "Upload Image" on any character to add their generated image</p>
            <p>• Images are stored locally and will appear throughout the app</p>
            <p>• For best results, use square images (recommended: 512x512 pixels)</p>
          </div>
        </div>
      </main>
    </div>
  );
}