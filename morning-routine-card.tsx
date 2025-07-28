import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Clock, Target, CheckCircle2, Play } from 'lucide-react';
import type { MorningExercise } from '@/data/morning-routine';
import { useState, useRef, useCallback, useEffect } from 'react';

interface MorningRoutineCardProps {
  exercise: MorningExercise;
  onComplete?: (exerciseId: string) => void;
  isCompleted?: boolean;
}

export default function MorningRoutineCard({ exercise, onComplete, isCompleted = false }: MorningRoutineCardProps) {
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

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'seated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lying': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'standing': return 'bg-green-100 text-green-800 border-green-200';
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
          <Badge className={getPositionColor(exercise.position)}>
            {exercise.position}
          </Badge>
          <Badge variant="outline" className="bg-gray-50">
            <Clock className="w-3 h-3 mr-1" />
            {exercise.duration}
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Target className="w-3 h-3 mr-1" />
            {exercise.targetArea}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="instructions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instructions" className="text-xl font-semibold">Instructions</TabsTrigger>
            <TabsTrigger value="benefits" className="text-xl font-semibold">Benefits</TabsTrigger>
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
                    src={exercise.imageUrl} 
                    alt={`${exercise.name} demonstration`} 
                    className="object-contain transition-transform duration-200 ease-out pointer-events-none"
                    style={{ 
                      transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs text-gray-500">
                    Pinch to zoom • Double tap to toggle • Zoom: {Math.round(imageZoom * 100)}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2 text-base">Step-by-Step Guide</h4>
                <p className="text-base text-gray-600">{exercise.description}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {exercise.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-base text-gray-700 flex-1">{instruction}</p>
                </div>
              ))}
            </div>
            
            {onComplete && (
              <Button 
                onClick={() => onComplete(exercise.id)}
                className="w-full mt-4"
                disabled={isCompleted}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </>
                )}
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="benefits" className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-base">Exercise Benefits</h4>
              <ul className="text-base text-gray-600 space-y-1">
                {exercise.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Target Area</h5>
              <p className="text-sm text-blue-800">{exercise.targetArea}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}