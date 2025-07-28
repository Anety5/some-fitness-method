import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Target, Wind, Heart, CheckCircle, Circle } from 'lucide-react';
import type { YogaPose } from '@/data/yoga-beginner';
import { getYogaPoseImage } from '@/utils/yoga-images';

interface YogaPoseCardProps {
  pose: YogaPose;
  onComplete?: (poseId: string) => void;
  isCompleted?: boolean;
}

export default function YogaPoseCard({ pose, onComplete, isCompleted = false }: YogaPoseCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const lastTouchDistance = useRef<number>(0);
  const lastTouchCenter = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleStartPose = () => {
    setIsActive(true);
    if (onComplete) {
      setTimeout(() => {
        onComplete(pose.id);
        setIsActive(false);
      }, 2000); // Auto-complete after 2 seconds for demo
    }
  };

  const getTouchDistance = (touches: TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const getTouchCenter = (touches: TouchList) => {
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

  return (
    <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg">{pose.name}</CardTitle>
            <p className="text-white/80 text-sm mt-1">{pose.description}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isCompleted ? (
              <CheckCircle className="h-6 w-6 text-green-400" />
            ) : (
              <Circle className="h-6 w-6 text-white/60" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pose Info */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-white/80">
            <Clock className="h-4 w-4" />
            <span>{pose.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-white/80">
            <Target className="h-4 w-4" />
            <span>{pose.targetArea}</span>
          </div>
          <div className="flex items-center gap-1 text-white/80">
            <Wind className="h-4 w-4" />
            <span>{pose.breathingPattern}</span>
          </div>
        </div>

        <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
          {pose.difficulty}
        </Badge>

        <Tabs defaultValue="instructions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/20">
            <TabsTrigger value="instructions" className="text-white data-[state=active]:bg-white/30 text-xl font-semibold">
              Instructions
            </TabsTrigger>
            <TabsTrigger value="benefits" className="text-white data-[state=active]:bg-white/30 text-xl font-semibold">
              Benefits
            </TabsTrigger>
            <TabsTrigger value="breathing" className="text-white data-[state=active]:bg-white/30 text-xl font-semibold">
              Breathing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instructions" className="mt-4 space-y-4">
            <div className="flex flex-col gap-4 mb-4">
              <div className="relative w-full max-w-md mx-auto">
                <div 
                  ref={imageRef}
                  className="overflow-hidden rounded-lg bg-white/10 p-2 shadow-sm h-64 flex items-center justify-center touch-none select-none"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onDoubleClick={handleDoubleClick}
                >
                  <img 
                    src={getYogaPoseImage(pose.id, pose.imageUrl)} 
                    alt={`${pose.name} demonstration`} 
                    className="object-contain transition-transform duration-200 ease-out pointer-events-none"
                    style={{ 
                      transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                      transformOrigin: 'center center'
                    }}
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement?.parentElement?.querySelector('.emoji-fallback-large');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                </div>
                <div className="emoji-fallback-large hidden text-5xl w-full max-w-md mx-auto h-64 flex items-center justify-center bg-white/20 rounded-lg">
                  {pose.illustration}
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs text-white/60">
                    Pinch to zoom • Double tap to toggle • Zoom: {Math.round(imageZoom * 100)}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-white mb-2 text-base">Step-by-Step Guide</h4>
                <p className="text-base text-white/80">{pose.description}</p>
              </div>
            </div>
            
            <ol className="space-y-3">
              {pose.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-base text-white/90 flex-1">{instruction}</span>
                </li>
              ))}
            </ol>
          </TabsContent>

          <TabsContent value="benefits" className="mt-4">
            <ul className="space-y-2">
              {pose.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-base text-white/90">
                  <Heart className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="breathing" className="mt-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-white">Breathing Pattern</span>
              </div>
              <p className="text-white/90 text-sm">
                {pose.breathingPattern || 'Focus on deep, steady breaths throughout the pose.'}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <div className="pt-4">
          {!isCompleted ? (
            <Button
              onClick={handleStartPose}
              disabled={isActive}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isActive ? 'Practicing...' : 'Start Pose'}
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-200 font-medium">Completed</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}