import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Clock, MapPin } from 'lucide-react';
import { morningRoutine } from '@/data/morning-routine';
import type { MorningExercise } from '@/data/morning-routine';

interface DailyExercisesEasyProps {
  onExerciseSelect?: (exercise: MorningExercise) => void;
}

export default function DailyExercisesEasy({ onExerciseSelect }: DailyExercisesEasyProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between p-4 h-auto bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏃‍♂️</div>
            <div className="text-left">
              <div className="font-semibold text-xl">Daily Exercises Easy</div>
              <div className="text-base text-white/80">6 gentle movements to start your day</div>
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
          {morningRoutine.map((exercise) => (
            <Card 
              key={exercise.id} 
              className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all cursor-pointer"
              onClick={() => onExerciseSelect?.(exercise)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  {/* Exercise Image */}
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <img 
                      src={exercise.imageUrl} 
                      alt={exercise.name}
                      className="w-full sm:w-32 h-40 object-cover rounded-lg bg-white/20 mx-auto sm:mx-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.querySelector('.emoji-fallback')!.classList.remove('hidden');
                      }}
                    />
                    <div className="emoji-fallback hidden text-4xl w-full sm:w-32 h-40 flex items-center justify-center bg-white/20 rounded-lg mx-auto sm:mx-0">
                      {exercise.illustration}
                    </div>
                  </div>
                  
                  {/* Exercise Details */}
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="font-semibold text-white text-lg mb-1 break-words">
                      {exercise.name}
                    </h3>
                    <p className="text-white/80 text-base mb-2 break-words">
                      {exercise.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 text-sm text-white/70 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="break-words">{exercise.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="capitalize break-words">{exercise.position}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-200 rounded-full break-words">
                        {exercise.targetArea}
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
              Click any exercise above to view detailed instructions
            </p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}