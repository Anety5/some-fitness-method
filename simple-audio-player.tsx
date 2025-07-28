import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SimpleAudioPlayerProps {
  src: string;
  title: string;
  autoPlay?: boolean;
}

export default function SimpleAudioPlayer({ src, title, autoPlay = false }: SimpleAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => setIsPlaying(false);
    const handleError = () => {
      setError("Audio file could not be loaded");
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      setError(null);
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      setError("Failed to play audio. Check browser permissions.");
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <audio ref={audioRef} preload="metadata">
        <source src={src} />
        Your browser does not support the audio element.
      </audio>

      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium">{title}</h4>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={togglePlay}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-300 text-xs mb-2 p-2 bg-red-500/20 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-3 text-white/70 text-sm">
        <VolumeX className="w-4 h-4" />
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="flex-1"
        />
        <Volume2 className="w-4 h-4" />
      </div>

      <div className="flex items-center justify-between mt-2 text-white/50 text-xs">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}