import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, Lock, Star } from 'lucide-react';
import { AudioContent } from '@/utils/audioContent';
import { useUser } from '@/hooks/useUser';

interface PremiumAudioPlayerProps {
  audio: AudioContent;
  onUpgrade?: () => void;
}

export default function PremiumAudioPlayer({ audio, onUpgrade }: PremiumAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isPremium } = useUser();

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const updateTime = () => setCurrentTime(audioElement.currentTime);
    const updateDuration = () => setDuration(audioElement.duration);
    const handleEnd = () => setIsPlaying(false);

    audioElement.addEventListener('timeupdate', updateTime);
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.addEventListener('ended', handleEnd);

    return () => {
      audioElement.removeEventListener('timeupdate', updateTime);
      audioElement.removeEventListener('loadedmetadata', updateDuration);
      audioElement.removeEventListener('ended', handleEnd);
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Breathing': return 'bg-blue-100 text-blue-800';
      case 'Meditation': return 'bg-purple-100 text-purple-800';
      case 'Sleep': return 'bg-indigo-100 text-indigo-800';
      case 'Nature': return 'bg-green-100 text-green-800';
      case 'Ambient': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Breathing': return '🫁';
      case 'Meditation': return '🧘';
      case 'Sleep': return '😴';
      case 'Nature': return '🌿';
      case 'Ambient': return '🎵';
      default: return '🎧';
    }
  };

  // Premium content that user doesn't have access to
  if (audio.premium && !isPremium) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 relative overflow-hidden">
        <div className="absolute top-2 right-2">
          <Lock className="w-5 h-5 text-amber-600" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <span className="text-2xl">{getCategoryIcon(audio.category)}</span>
            <div>
              <h3 className="text-lg font-semibold">{audio.title}</h3>
              <div className="flex gap-2 mt-1">
                <Badge className={getCategoryColor(audio.category)}>
                  {audio.category}
                </Badge>
                <Badge className="bg-amber-200 text-amber-800">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-amber-700">{audio.description}</p>
          
          {audio.benefits && (
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Benefits:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                {audio.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-amber-200">
            <div className="text-sm text-amber-600">
              Duration: {audio.duration}
            </div>
            <Button 
              onClick={onUpgrade}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              <Star className="w-4 h-4 mr-2" />
              Upgrade for Access
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Regular audio player for free content or premium users
  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-300 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(audio.category)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{audio.title}</h3>
              <div className="flex gap-2 mt-1">
                <Badge className={getCategoryColor(audio.category)}>
                  {audio.category}
                </Badge>
                {audio.premium && (
                  <Badge className="bg-green-200 text-green-800">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Volume2 className="w-5 h-5 text-gray-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">{audio.description}</p>

        {/* Audio Element */}
        <audio ref={audioRef} src={audio.file} preload="metadata" />

        {/* Play Controls */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={togglePlayPause}
            size="lg"
            className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </Button>
          
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{duration ? formatTime(duration) : audio.duration}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        {audio.benefits && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
            <div className="flex flex-wrap gap-2">
              {audio.benefits.map((benefit, index) => (
                <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}