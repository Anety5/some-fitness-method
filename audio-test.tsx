import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Volume2, AlertCircle } from 'lucide-react';

const testAudioFiles = [
  {
    id: 'rain-m4a',
    title: 'Light Rain (M4A)',
    src: '/assets/audio/ambient/Light rain_1752037783519.m4a',
    type: 'audio/mp4'
  },
  {
    id: 'rain-wav',
    title: 'Rain Loop (WAV)',
    src: '/assets/audio/ambient/mixkit-light-rain-loop-1253 (3).wav',
    type: 'audio/wav'
  },
  {
    id: 'breathing-mp3',
    title: '4-7-8 Breathing (MP3)',
    src: '/assets/audio/breathing/4-7-8-breathing.mp3',
    type: 'audio/mpeg'
  }
];

interface AudioTestProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioTest({ isOpen, onClose }: AudioTestProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const testAudio = async (file: typeof testAudioFiles[0]) => {
    try {
      setLoadingId(file.id);
      setErrors(prev => ({ ...prev, [file.id]: '' }));

      // Create new audio element for testing
      const audio = new Audio();
      audioRefs.current[file.id] = audio;

      audio.src = file.src;
      audio.preload = 'metadata';

      await new Promise((resolve, reject) => {
        const handleCanPlay = () => {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          resolve(undefined);
        };

        const handleError = (e: any) => {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          reject(new Error(`Failed to load audio: ${e.message || 'Unknown error'}`));
        };

        audio.addEventListener('canplaythrough', handleCanPlay);
        audio.addEventListener('error', handleError);
      });

      await audio.play();
      setPlayingId(file.id);

      audio.onended = () => {
        setPlayingId(null);
      };

    } catch (error: any) {
      // Audio test failed - handled in UI feedback
      setErrors(prev => ({ 
        ...prev, 
        [file.id]: error.message || 'Audio playback failed'
      }));
    } finally {
      setLoadingId(null);
    }
  };

  const stopAudio = (fileId: string) => {
    const audio = audioRefs.current[fileId];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setPlayingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Audio System Test</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Test different audio formats to identify compatibility issues:
          </p>
          
          {testAudioFiles.map((file) => (
            <div key={file.id} className="border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium">{file.title}</h4>
                  <p className="text-xs text-gray-500">{file.type}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loadingId === file.id}
                  onClick={() => {
                    if (playingId === file.id) {
                      stopAudio(file.id);
                    } else {
                      testAudio(file);
                    }
                  }}
                >
                  {loadingId === file.id ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  ) : playingId === file.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {errors[file.id] && (
                <div className="flex items-start space-x-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300">{errors[file.id]}</span>
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Troubleshooting Tips:</p>
            <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-xs">
              <li>• Make sure browser allows audio playback</li>
              <li>• Try clicking browser's audio permission icon</li>
              <li>• Check if files exist in the correct directory</li>
              <li>• Some browsers require user interaction before audio</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}