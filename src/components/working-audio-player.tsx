import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useActivityLogger } from '@/hooks/useActivityLogger';

interface WorkingAudioPlayerProps {
  src: string;
  title: string;
  className?: string;
  category?: string;
}

export default function WorkingAudioPlayer({ src, title, className = "", category = "meditation" }: WorkingAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { logAudioActivity } = useActivityLogger();

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
        audioRef.current = null;
      }
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        // Remove event listeners to prevent errors during cleanup
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.onloadstart = null;
        audioRef.current.oncanplay = null;
        audioRef.current = null;
      } catch (error) {
        // Silently handle any pause errors
        console.log('Audio stop handled gracefully');
      }
    }
    setIsPlaying(false);
  };

  const togglePlay = async () => {
    try {
      setError(null);
      
      if (!isPlaying) {
        // If no audio exists, create new one
        if (!audioRef.current) {
          const audio = new Audio();
          audio.src = src;
          audio.preload = 'metadata';
          audioRef.current = audio;
          
          audio.onended = () => {
            setIsPlaying(false);
            // Log activity when audio finishes playing
            if (startTime) {
              const duration = Date.now() - startTime;
              logAudioActivity(1, title, Math.round(duration / 1000), category);
            }
            setStartTime(null);
          };
          
          audio.onerror = (e) => {
            setError('Audio failed to load - file may not be compatible');
            setIsPlaying(false);
            audioRef.current = null;
          };

          audio.onloadstart = () => {
            console.log('Audio loading started for:', src);
          };

          audio.oncanplay = () => {
            console.log('Audio can play:', src);
          };

          audio.loop = false; // Disable looping so meditation tracks stop at the end
        }
        
        // Play the audio
        await audioRef.current.play();
        setIsPlaying(true);
        setStartTime(Date.now());
      } else {
        // Just pause the audio, don't destroy it
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
          
          // Log partial activity when user pauses audio manually
          if (startTime) {
            const duration = Date.now() - startTime;
            if (duration > 10000) { // Only log if listened for more than 10 seconds
              logAudioActivity(1, title, Math.round(duration / 1000), category);
            }
          }
          setStartTime(null);
        }
      }
    } catch (err: any) {
      setError(`Playback failed: ${err.message || 'Unknown error'}`);
      setIsPlaying(false);
    }
  };

  return (
    <div className={`${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={togglePlay}
        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        title={error || title}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      {error && (
        <div className="text-red-300 text-xs mt-1">
          {error}
        </div>
      )}
    </div>
  );
}