import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Target, CheckCircle, Circle } from 'lucide-react';
import { yogaBeginner } from '@/data/yoga-beginner';
import type { YogaPose } from '@/data/yoga-beginner';
import { getYogaPoseImage } from '@/utils/yoga-images';

interface YogaPoseGridProps {
  onPoseSelect?: (pose: YogaPose) => void;
  completedPoses?: string[];
  showTitle?: boolean;
}

export default function YogaPoseGrid({ onPoseSelect, completedPoses = [], showTitle = true }: YogaPoseGridProps) {
  const [hoveredPose, setHoveredPose] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Yoga Flow Routine</h2>
          <p className="text-white/80">6 foundational poses for mind-body wellness</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {yogaBeginner.map((pose, index) => (
          <Card 
            key={pose.id}
            className="bg-white/15 backdrop-blur-sm border-white/20 hover:bg-white/25 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            onClick={() => onPoseSelect?.(pose)}
            onMouseEnter={() => setHoveredPose(pose.id)}
            onMouseLeave={() => setHoveredPose(null)}
          >
            <CardContent className="p-4 text-center">
              {/* Completion Status */}
              <div className="absolute top-2 right-2">
                {completedPoses.includes(pose.id) ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Circle className="h-5 w-5 text-white/40" />
                )}
              </div>

              {/* Pose Number */}
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-purple-500/30 text-purple-200 border-purple-400/30">
                  {index + 1}
                </Badge>
              </div>

              {/* Pose Illustration */}
              <div className="flex justify-center mb-3 mt-2">
                <div className="w-28 h-28 bg-white/10 rounded-lg p-3 flex items-center justify-center">
                  <img 
                    src={getYogaPoseImage(pose.id, pose.imageUrl)} 
                    alt={pose.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.querySelector('.emoji-fallback')!.classList.remove('hidden');
                    }}
                  />
                  <div className="emoji-fallback hidden text-2xl">
                    {pose.illustration}
                  </div>
                </div>
              </div>

              {/* Pose Name */}
              <h3 className="font-semibold text-white text-sm mb-2 group-hover:text-purple-200 transition-colors">
                {pose.name.replace(/\s*\([^)]*\)/, '')} {/* Remove Sanskrit names for cleaner display */}
              </h3>

              {/* Duration & Target */}
              <div className="space-y-1 text-xs text-white/70">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{pose.duration}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Target className="h-3 w-3" />
                  <span className="truncate">{pose.targetArea}</span>
                </div>
              </div>

              {/* Hover Overlay */}
              {hoveredPose === pose.id && (
                <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm flex items-center justify-center">
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPoseSelect?.(pose);
                    }}
                  >
                    Practice
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <p className="text-white/70 text-sm">
          Click any pose to view detailed instructions and benefits
        </p>
      </div>
    </div>
  );
}