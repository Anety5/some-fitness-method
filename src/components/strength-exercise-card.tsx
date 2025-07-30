import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Clock, Target, CheckCircle2, Play, Repeat, Calendar } from 'lucide-react';
import type { StrengthExercise } from '@/data/strength-training';
import { getStrengthExerciseImage } from '@/utils/strength-training-images';
import { useState, useRef, useCallback, useEffect } from 'react';

interface StrengthExerciseCardProps {
  exercise: StrengthExercise;
  onComplete?: (exerciseId: string) => void;
  isCompleted?: boolean;
}

export default function StrengthExerciseCard({ exercise, onComplete, isCompleted = false }: StrengthExerciseCardProps) {
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const lastTouchDistance = useRef<number>(0);
  const lastTouchCenter = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const getTouchDistance = (touches: React.TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const getTouchCenter = (touches: React.TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      lastTouchDistance.current = getTouchDistance(e.touches);
      lastTouchCenter.current = getTouchCenter(e.touches);
    } else if (e.touches.length === 1 && imageZoom > 1) {
      isDragging.current = true;
      lastTouchCenter.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, [imageZoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const currentCenter = getTouchCenter(e.touches);
      
      if (lastTouchDistance.current > 0) {
        const scale = currentDistance / lastTouchDistance.current;
        setImageZoom(prev => Math.max(0.5, Math.min(3, prev * scale)));
      }
      
      lastTouchDistance.current = currentDistance;
      lastTouchCenter.current = currentCenter;
    } else if (e.touches.length === 1 && isDragging.current && imageZoom > 1) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - lastTouchCenter.current.x;
      const deltaY = e.touches[0].clientY - lastTouchCenter.current.y;
      
      setImagePosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      lastTouchCenter.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, [imageZoom]);

  const handleTouchEnd = useCallback(() => {
    lastTouchDistance.current = 0;
    isDragging.current = false;
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (imageZoom === 1) {
      setImageZoom(2);
    } else {
      setImageZoom(1);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [imageZoom]);

  useEffect(() => {
    if (imageZoom === 1) {
      setImagePosition({ x: 0, y: 0 });
    }
  }, [imageZoom]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`w-full transition-all duration-200 hover:shadow-md ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-strong text-lg text-gray-900">{exercise.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
          </div>
          {isCompleted && <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge className={getDifficultyColor(exercise.difficulty)}>
            {exercise.difficulty}
          </Badge>
          <Badge variant="outline" className="bg-gray-50">
            <Repeat className="w-3 h-3 mr-1" />
            {exercise.sets}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            {exercise.reps}
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Calendar className="w-3 h-3 mr-1" />
            {exercise.frequency}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="instructions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="instructions" className="text-xl font-semibold">Instructions</TabsTrigger>
            <TabsTrigger value="benefits" className="text-xl font-semibold">Benefits</TabsTrigger>
            <TabsTrigger value="progression" className="text-xl font-semibold">Progression</TabsTrigger>
          </TabsList>
          
          <TabsContent value="instructions" className="space-y-4">
            <div className="flex flex-col gap-4 mb-4">
              <div className="relative w-full max-w-md mx-auto">
                <div 
                  ref={imageRef}
                  className="overflow-hidden rounded-lg shadow-sm bg-gray-50 h-80 flex items-center justify-center touch-none select-none"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onDoubleClick={handleDoubleClick}
                >
                  <img 
                    src={getStrengthExerciseImage(exercise.id, exercise.imageUrl, exercise.uploadedImageUrl)} 
                    alt={`${exercise.name} demonstration`} 
                    className="object-contain transition-transform duration-200 ease-out pointer-events-none"
                    style={{ 
                      transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.parentElement!.querySelector('.emoji-fallback')!.classList.remove('hidden');
                    }}
                  />
                </div>
                <div className="emoji-fallback hidden w-full max-w-md mx-auto h-80 flex items-center justify-center bg-gray-100 rounded-lg text-6xl">
                  {exercise.illustration}
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs text-gray-500">
                    Pinch to zoom • Double tap to toggle • Zoom: {Math.round(imageZoom * 100)}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2 text-base">Step-by-Step Guide</h4>
                <div className="space-y-2 text-left max-w-lg mx-auto">
                  {exercise.instructions.slice(0, 3).map((step, index) => (
                    <div key={index} className="text-base text-gray-700 flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-4 h-4 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {exercise.instructions.length > 3 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-2">Additional Steps</h5>
                <div className="space-y-1">
                  {exercise.instructions.slice(3).map((step, index) => (
                    <div key={index + 3} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-4 h-4 bg-gray-200 text-gray-800 rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
                        {index + 4}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h5 className="font-medium text-blue-900">Target Muscles</h5>
              </div>
              <div className="flex flex-wrap gap-1">
                {exercise.targetMuscles.map((muscle) => (
                  <Badge key={muscle} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="benefits" className="space-y-3">
            <div className="space-y-2">
              {exercise.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progression" className="space-y-3">
            <div className="space-y-2">
              {exercise.progressions.map((progression, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="inline-flex items-center justify-center w-4 h-4 bg-orange-100 text-orange-800 rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{progression}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-2 border-t">
          <Button 
            onClick={() => onComplete?.(exercise.id)}
            className={`flex-1 ${isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}`}
            variant={isCompleted ? 'default' : 'outline'}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Exercise
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}