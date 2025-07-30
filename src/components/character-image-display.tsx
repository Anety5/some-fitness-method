import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface CharacterImageDisplayProps {
  characterId: string;
  characterName: string;
  characterEmoji: string;
  size?: 'small' | 'medium' | 'large';
  showUpload?: boolean;
}

export default function CharacterImageDisplay({ 
  characterId, 
  characterName, 
  characterEmoji,
  size = 'medium',
  showUpload = false 
}: CharacterImageDisplayProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16', 
    large: 'w-20 h-20'
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Create a URL for the uploaded image
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    // In a real app, you would upload to a server here
    // For now, we'll just store it locally
    localStorage.setItem(`character-image-${characterId}`, url);
    
    setIsUploading(false);
  };

  // Check for default image first, then stored image
  useEffect(() => {
    const loadImage = () => {
      // Try to load the PNG image from assets/characters first (user's images)
      const pngImagePath = `/assets/characters/${characterId}.png`;
      
      // Create an image element to test if the image exists
      const img = new Image();
      img.onload = () => {
        setImageUrl(pngImagePath);
      };
      img.onerror = () => {
        // If PNG doesn't exist, try SVG fallback
        const svgImagePath = `/assets/characters/${characterId}.svg`;
        const svgImg = new Image();
        svgImg.onload = () => {
          setImageUrl(svgImagePath);
        };
        svgImg.onerror = () => {
          // If neither exists, check localStorage
          const storedImage = localStorage.getItem(`character-image-${characterId}`);
          if (storedImage) {
            setImageUrl(storedImage);
          }
        };
        svgImg.src = svgImagePath;
      };
      img.src = pngImagePath;
    };
    
    loadImage();
  }, [characterId]);

  // If this is being used without upload features (like in CharacterDisplay), render simpler
  if (!showUpload) {
    return (
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden`}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={characterName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="text-2xl">{characterEmoji}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="inline-block">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className={`${sizeClasses[size]} rounded-full border-2 border-gray-200 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden`}>
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={characterName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-1">{characterEmoji}</div>
                <ImageIcon className="h-6 w-6 text-gray-400 mx-auto" />
              </div>
            )}
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-gray-900">{characterName}</h3>
            {showUpload && (
              <div className="mt-2">
                <label htmlFor={`upload-${characterId}`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isUploading}
                    className="cursor-pointer"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Uploading...' : imageUrl ? 'Update Image' : 'Upload Image'}
                    </span>
                  </Button>
                </label>
                <input
                  id={`upload-${characterId}`}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}