import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Clock, Target, CheckCircle, Circle, GripVertical } from 'lucide-react';
import { strengthTrainingExercises } from '@/data/strength-training';
import type { StrengthExercise } from '@/data/strength-training';
import { getStrengthExerciseImage } from '@/utils/strength-training-images';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface StrengthTrainingGridProps {
  onExerciseSelect?: (exercise: StrengthExercise) => void;
  completedExercises?: string[];
  showTitle?: boolean;
}

// Sortable Exercise Card Component
function SortableExerciseCard({ exercise, onExerciseSelect, isCompleted }: { 
  exercise: StrengthExercise; 
  onExerciseSelect?: (exercise: StrengthExercise) => void;
  isCompleted: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all cursor-pointer ${isDragging ? 'z-50' : ''}`}
      onClick={() => onExerciseSelect?.(exercise)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start gap-3">
          {/* Mobile: Drag handle at top, Desktop: Left side */}
          <div 
            {...attributes} 
            {...listeners}
            className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 order-1 sm:order-none self-start"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-white/60 hover:text-white" />
          </div>
          
          {/* Exercise Image */}
          <div className="flex-shrink-0 w-full sm:w-auto order-2 sm:order-none">
            <img 
              src={getStrengthExerciseImage(exercise.id, exercise.imageUrl, exercise.uploadedImageUrl)} 
              alt={exercise.name}
              className="w-full sm:w-32 h-32 object-contain rounded-lg bg-white/20 mx-auto sm:mx-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.emoji-fallback');
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
            <div className="emoji-fallback hidden text-4xl w-full sm:w-32 h-32 flex items-center justify-center bg-white/20 rounded-lg mx-auto sm:mx-0">
              {exercise.illustration}
            </div>
          </div>
          
          {/* Exercise Details */}
          <div className="flex-1 min-w-0 w-full order-3 sm:order-none">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-lg break-words">{exercise.name}</h4>
                <p className="text-base text-white/80 mt-1 break-words">{exercise.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Circle className="h-5 w-5 text-white/60" />
                )}
              </div>
            </div>
            
            {/* Exercise Info */}
            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              <div className="flex items-center gap-1 text-white/70">
                <Clock className="h-3 w-3" />
                <span className="break-words">{exercise.reps}</span>
              </div>
              <div className="flex items-center gap-1 text-white/70">
                <Target className="h-3 w-3" />
                <span className="break-words">{exercise.targetMuscles[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StrengthTrainingGrid({ onExerciseSelect, completedExercises = [], showTitle = true }: StrengthTrainingGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exercises, setExercises] = useState(strengthTrainingExercises);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setExercises((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between p-4 h-auto bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">💪</div>
            <div className="text-left">
              <div className="font-semibold text-xl">Strength Training</div>
              <div className="text-base text-white/80">6 exercises you can do daily to strengthen your legs and back</div>
            </div>
          </div>
          {isOpen ? 
            <ChevronDown className="h-5 w-5 text-white" /> : 
            <ChevronRight className="h-5 w-5 text-white" />
          }
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-3 mt-3">

        
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={exercises.map(exercise => exercise.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exercises.map((exercise) => (
                <SortableExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onExerciseSelect={onExerciseSelect}
                  isCompleted={completedExercises.includes(exercise.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CollapsibleContent>
    </Collapsible>
  );
}