import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Star, Headphones } from 'lucide-react';

interface LockedAudioProps {
  title: string;
  description?: string;
  duration?: string;
  onUpgradeClick: () => void;
}

export default function LockedAudio({ title, description, duration, onUpgradeClick }: LockedAudioProps) {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 relative overflow-hidden">
      <div className="absolute top-3 right-3">
        <Lock className="w-5 h-5 text-amber-600" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-amber-100 p-2 rounded-lg">
            <Headphones className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-amber-800">{title}</h4>
            {description && (
              <p className="text-sm text-amber-700 mt-1">{description}</p>
            )}
            {duration && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                  {duration}
                </Badge>
                <Badge className="bg-amber-200 text-amber-800">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-amber-100/50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-center text-amber-600">
            <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-center text-amber-700 text-sm mt-2">
            Premium audio content
          </p>
        </div>

        <Button 
          onClick={onUpgradeClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full w-full"
          size="sm"
        >
          Go Premium
        </Button>
      </CardContent>
    </Card>
  );
}