import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Clock, Target, Wind } from 'lucide-react';
import { yogaBeginner } from '@/data/yoga-beginner';
import type { YogaPose } from '@/data/yoga-beginner';
import { getYogaPoseImage } from '@/utils/yoga-images';

interface YogaBeginnerProps {
  onPoseSelect?: (pose: YogaPose) => void;
}

export default function YogaBeginner({ onPoseSelect }: YogaBeginnerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between p-4 h-auto bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">🧘‍♀️</div>
            <div className="text-left">
              <div className="font-semibold text-xl">Yoga Beginner</div>
              <div className="text-base text-white/80">6 foundational yoga poses for beginners</div>
            </div>
          </div>
          {isOpen ? 
            <ChevronDown className="h-5 w-5 text-white" /> : 
            <ChevronRight className="h-5 w-5 text-white" />
          }
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-3 mt-3">


        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {yogaBeginner.map((pose) => (
            <Card 
              key={pose.id} 
              className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300 cursor-pointer group"
              onClick={() => onPoseSelect?.(pose)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  {/* Pose Illustration */}
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <img 
                      src={getYogaPoseImage(pose.id, pose.imageUrl)} 
                      alt={pose.name}
                      className="w-full sm:w-32 h-32 object-contain rounded-lg bg-white/10 p-2 mx-auto sm:mx-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.querySelector('.emoji-fallback')!.classList.remove('hidden');
                      }}
                    />
                    <div className="emoji-fallback hidden text-4xl w-full sm:w-32 h-32 flex items-center justify-center bg-white/20 rounded-lg mx-auto sm:mx-0">
                      {pose.illustration}
                    </div>
                  </div>
                  
                  {/* Pose Details */}
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="font-semibold text-white text-lg mb-1 break-words">
                      {pose.name}
                    </h3>
                    <p className="text-white/80 text-base mb-2 break-words">
                      {pose.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 text-sm text-white/70 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="break-words">{pose.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="h-3 w-3" />
                        <span className="capitalize break-words">{pose.difficulty}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-purple-500/20 text-purple-200 rounded-full break-words">
                        {pose.targetArea}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {isOpen && (
          <div className="text-center pt-2">
            <p className="text-white/70 text-sm">
              Click any pose above to view detailed instructions and benefits
            </p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}