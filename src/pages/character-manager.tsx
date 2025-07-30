import { useState, useEffect } from 'react';
import Navigation from '@/components/navigation';
import FileImporter from '@/components/file-importer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Image, Star, Trophy, Users, Settings } from 'lucide-react';
import { characters, type Character } from '@/components/character-selector';

export default function CharacterManager() {
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: string}>({});
  const [showUploader, setShowUploader] = useState(false);

  // Load any previously uploaded character images from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('character-images');
    if (saved) {
      try {
        setUploadedImages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load character images:', e);
      }
    }
  }, []);

  const handleFileImported = (fileName: string, url: string) => {
    // Extract character name from filename (e.g., "max.jpg" -> "max")
    const characterName = fileName.split('.')[0].toLowerCase();
    
    // Check if this is a valid character
    const validCharacter = characters.find(c => c.id === characterName);
    if (!validCharacter) {
      alert(`File "${fileName}" doesn't match any character names. Please name files: ${characters.map(c => c.id).join(', ')}`);
      return;
    }

    // Save to state and localStorage
    const newImages = { ...uploadedImages, [characterName]: url };
    setUploadedImages(newImages);
    localStorage.setItem('character-images', JSON.stringify(newImages));
    
    // Show success message
    console.log(`Character image for ${validCharacter.name} uploaded successfully!`);
  };

  const removeCharacterImage = (characterId: string) => {
    const newImages = { ...uploadedImages };
    if (newImages[characterId]) {
      URL.revokeObjectURL(newImages[characterId]); // Clean up blob URL
      delete newImages[characterId];
      setUploadedImages(newImages);
      localStorage.setItem('character-images', JSON.stringify(newImages));
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Users className="w-3 h-3" />;
      case 'rare': return <Star className="w-3 h-3" />;
      case 'epic': return <Trophy className="w-3 h-3" />;
      case 'legendary': return <Trophy className="w-3 h-3 text-yellow-600" />;
      default: return <Users className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-cyan-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Character Manager</h1>
              <p className="text-gray-600 mt-1">Upload and manage character images for your wellness journey</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Gallery */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Character Gallery
                  </CardTitle>
                  <Button 
                    onClick={() => setShowUploader(!showUploader)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {showUploader ? 'Hide Uploader' : 'Upload Images'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {characters.map(character => {
                    const hasCustomImage = uploadedImages[character.id];
                    
                    return (
                      <div key={character.id} className="group relative">
                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
                          <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                            {hasCustomImage ? (
                              <img 
                                src={uploadedImages[character.id]}
                                alt={character.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-4xl">{character.emoji}</div>
                            )}
                            
                            {/* Rarity Badge */}
                            <div className="absolute top-2 left-2">
                              <Badge className={`${getRarityColor(character.rarity)} flex items-center gap-1`}>
                                {getRarityIcon(character.rarity)}
                                {character.rarity}
                              </Badge>
                            </div>
                            
                            {/* Custom Image Indicator */}
                            {hasCustomImage && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  <Image className="w-3 h-3 mr-1" />
                                  Custom
                                </Badge>
                              </div>
                            )}
                            
                            {/* Remove Button */}
                            {hasCustomImage && (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeCharacterImage(character.id)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          
                          <div className="p-3">
                            <h3 className="font-semibold text-gray-900">{character.name}</h3>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {character.description}
                            </p>
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                Day {character.unlockRequirement}+
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Panel & Instructions */}
          <div className="space-y-6">
            {/* File Uploader */}
            {showUploader && (
              <FileImporter 
                category="characters"
                onFileImported={handleFileImported}
              />
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Upload Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">File Naming</h4>
                  <p className="text-sm text-blue-800 mb-2">Name your files exactly as the character names:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-blue-700">
                    {characters.map(char => (
                      <div key={char.id}>• {char.id}.jpg</div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Image Tips</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Square aspect ratio (1:1) works best</li>
                    <li>• High resolution (512x512+)</li>
                    <li>• Clear, well-lit portraits</li>
                    <li>• JPG, PNG, GIF, or WebP format</li>
                    <li>• Maximum 5MB per file</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Character Rarities</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-gray-600" />
                      <span className="text-purple-800">Common (Max, Mia)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-blue-600" />
                      <span className="text-purple-800">Rare (Zeke, Luna)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3 h-3 text-purple-600" />
                      <span className="text-purple-800">Epic (Kai, Nova)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3 h-3 text-yellow-600" />
                      <span className="text-purple-800">Legendary (Gunner)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Characters:</span>
                    <span className="font-medium">{characters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Custom Images:</span>
                    <span className="font-medium text-green-600">
                      {Object.keys(uploadedImages).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-blue-600">
                      {characters.length - Object.keys(uploadedImages).length}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(Object.keys(uploadedImages).length / characters.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      {Math.round((Object.keys(uploadedImages).length / characters.length) * 100)}% Complete
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}