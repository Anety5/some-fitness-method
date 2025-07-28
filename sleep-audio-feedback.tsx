import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

const tracks = {
  // Pink Noise Options
  rain: {
    label: "Light Rain Sounds (Pink Noise)",
    src: "/assets/audio/ambient/Light rain_1752037783519.m4a",
    description: "Gentle rainfall for peaceful relaxation - Pink noise for memory consolidation"
  },
  extendedRain: {
    label: "Extended Rain Session (Pink Noise)", 
    src: "/assets/audio/ambient/Longer rain_1752037782489.m4a",
    description: "Longer rainfall for deep sleep preparation - Enhanced pink noise"
  },

  flowingWater: {
    label: "Flowing Water (Pink Noise)",
    src: "/assets/audio/ambient/mixkit-water-flowing-ambience-loop-3126 (1).wav",
    description: "Continuous water flow - Pure pink noise for deep relaxation"
  },
  waterfall: {
    label: "Forest Waterfall (Pink Noise)",
    src: "/assets/audio/ambient/mixkit-waterfall-in-the-woods-2517 (1).wav",
    description: "Forest waterfall sounds - Rich pink noise spectrum"
  },
  // Brown Noise Options
  campfire: {
    label: "Campfire & Night Wind (Brown Noise)",
    src: "/assets/audio/ambient/mixkit-campfire-night-wind-1736 (1).wav", 
    description: "Crackling fire with gentle evening breeze - Brown noise for grounding"
  },
  oceanWaves: {
    label: "Ocean Waves (Brown Noise)",
    src: "/assets/audio/ambient/mixkit-ocean-of-love-1113.mp3",
    description: "Deep ocean waves - Soothing brown noise frequencies"
  },
  harborWaves: {
    label: "Harbor Waves (Brown Noise)",
    src: "/assets/audio/ambient/mixkit-small-waves-harbor-rocks-1208.wav",
    description: "Gentle harbor waves - Rhythmic brown noise for deep sleep"
  },
  // White Noise Options
  chillaxAmbient: {
    label: "Chillax Ambient (White Noise)",
    src: "/assets/audio/ambient/mixkit-chillax-655.mp3",
    description: "Synthesized relaxation tones - White noise characteristics"
  },
  harpRelax: {
    label: "Harp Relaxation (White Noise)",
    src: "/assets/audio/ambient/mixkit-harp-relax-669.mp3",
    description: "Soft harp melodies - High-frequency white noise elements"
  },
  valleySunset: {
    label: "Valley Sunset (White Noise)",
    src: "/assets/audio/ambient/mixkit-valley-sunset-127.mp3",
    description: "Ambient nature soundscape - Balanced white noise spectrum"
  }
};

interface SleepAudioFeedbackProps {
  userId?: number;
}

export default function SleepAudioFeedback({ userId = 1 }: SleepAudioFeedbackProps) {
  const [selected, setSelected] = useState("rain");
  const [isPlaying, setIsPlaying] = useState(false);
  const [mood, setMood] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [audioError, setAudioError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      setIsLoading(true);
      setAudioError(false);
      
      if (audio.paused) {
        // Ensure audio is loaded before playing
        if (audio.readyState < 2) {
          await new Promise((resolve, reject) => {
            const handleCanPlay = () => {
              audio.removeEventListener('canplay', handleCanPlay);
              audio.removeEventListener('error', handleError);
              resolve(undefined);
            };
            const handleError = () => {
              audio.removeEventListener('canplay', handleCanPlay);
              audio.removeEventListener('error', handleError);
              reject(new Error('Audio failed to load'));
            };
            audio.addEventListener('canplay', handleCanPlay);
            audio.addEventListener('error', handleError);
            audio.load();
          });
        }
        
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      // Audio playback error handled in UI
      setAudioError(true);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackChange = (value: string) => {
    setSelected(value);
    setIsPlaying(false);
    setAudioError(false);
    setIsLoading(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0] / 100;
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const stopAllAudio = () => {
    // Stop the current sleep audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    
    // Stop all audio elements in the app
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    console.log("All audio stopped for sleep preparation");
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 space-y-4 p-6">
      

      {audioError && (
        <div className="bg-amber-500/20 border border-amber-500/30 rounded p-3 mb-4">
          <p className="text-amber-200 text-sm">
            <strong>Audio Playback Issue:</strong> Click the play button to start audio. If issues persist, try:
          </p>
          <ul className="text-amber-200 text-xs mt-2 space-y-1 ml-4 list-disc">
            <li>Refreshing the page and clicking play again</li>
            <li>Using headphones or different speakers</li>
            <li>Checking browser audio permissions</li>
            <li>Trying a different browser if the problem continues</li>
          </ul>
        </div>
      )}

      

      <audio
        ref={audioRef}
        preload="metadata"
        controls={false}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.log("Audio error occurred:", e);
          setAudioError(true);
          setIsPlaying(false);
          setIsLoading(false);
        }}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onLoadedData={() => setIsLoading(false)}
      >
        <source src={tracks[selected as keyof typeof tracks].src} />
        Your browser does not support the audio element.
      </audio>

      {/* Sleep Readiness Message */}
      <div 
        className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-500/30 transition-colors"
        onClick={stopAllAudio}
      >
        <p className="text-blue-200 font-medium">
          Ready for sleep? Click here to turn all audio off and prepare for sleep
        </p>
      </div>

      
    </Card>
  );
}