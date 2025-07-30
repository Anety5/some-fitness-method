import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Play, Pause, Volume2, Waves, Heart, Clock, RotateCcw, ShoppingCart, ChevronDown } from 'lucide-react';
import FavoriteButton from "./favorite-button";

interface AudioTrack {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: 'nature' | 'guided' | 'binaural' | 'ambient';
  benefits: string[];
  audioSrc?: string; 
  isPremium?: boolean;
  price?: string;
  sampleUrl?: string;
  noiseColor?: 'white' | 'pink' | 'brown' | 'blue' | 'grey';
}

const meditationTracks: AudioTrack[] = [
  {
    id: 'calm-with-me-gentle',
    title: 'Calm With Me - Gentle Sleep',
    description: 'Soft lyrical song with white noise ambience for deep relaxation',
    duration: 180, // 3 minutes
    category: 'guided',
    benefits: ['Promotes deep sleep', 'Calming lyrics', 'White noise background'],
    audioSrc: '/assets/audio/meditation/My Song_20250712_1616 (1).mp3',
    isPremium: true,
    price: '0.99',
    sampleUrl: '/assets/audio/samples/calm-with-me-sample.mp3',
    noiseColor: 'white'
  },
  {
    id: 'mindfulness-guided',
    title: 'Mindfulness Meditation',
    description: 'Guided mindfulness practice for present moment awareness',
    duration: 600, // 10 minutes
    category: 'guided',
    benefits: ['Enhances mindfulness', 'Present moment awareness', 'Mental clarity'],
    audioSrc: '/assets/audio/meditation/mindfulness-meditation-updated.mp3'
  },
  {
    id: 'mindfulness-breath-extensive',
    title: 'Mindfulness Meditation on Breath - Extended',
    description: 'Comprehensive guided meditation focusing on breath awareness and mindfulness practice',
    duration: 1200, // 20 minutes (estimated based on 23MB file size)
    category: 'guided',
    benefits: ['Deep breath awareness', 'Extended mindfulness practice', 'Comprehensive guidance'],
    audioSrc: '/assets/audio/meditation/mindfulness-meditation-updated.mp3'
  },
  {
    id: 'ten-breath-practice',
    title: 'Ten Breath Practice',
    description: 'Focused breathing exercise with ten conscious breaths for centering and calm',
    duration: 300, // 5 minutes (estimated based on 3.2MB file size)
    category: 'guided',
    benefits: ['Quick centering', 'Breath awareness', 'Immediate calm'],
    audioSrc: '/assets/audio/breathing/ten-breath-practice-updated.mp3'
  },
  {
    id: 'progressive-muscle-relaxation',
    title: 'Progressive Muscle Relaxation',
    description: 'Guided progressive muscle relaxation to release tension from head to toe',
    duration: 180, // 3 minutes
    category: 'guided',
    benefits: ['Deep physical relaxation', 'Tension release', 'Better sleep preparation'],
    audioSrc: '/assets/audio/meditation/Progressive Muscle Relaxation Technique.mp3'
  },
  {
    id: 'loving-kindness',
    title: 'Loving Kindness Meditation',
    description: 'Heart-opening meditation for compassion and self-love',
    duration: 720, // 12 minutes
    category: 'guided',
    benefits: ['Develops compassion', 'Reduces self-criticism', 'Heart opening'],
    audioSrc: '/assets/audio/meditation/mixkit-nature-meditation-345.mp3'
  },
  {
    id: 'walking-meditation',
    title: 'Walking Meditation',
    description: 'Mindful movement meditation for active practice',
    duration: 900, // 15 minutes
    category: 'guided',
    benefits: ['Combines movement and mindfulness', 'Body awareness', 'Active meditation'],
    audioSrc: '/assets/audio/meditation/mixkit-spiritual-moment-525.mp3'
  },
  {
    id: 'nature-meditation',
    title: 'Nature Meditation',
    description: 'Meditation with natural soundscape',
    duration: 600, // 10 minutes
    category: 'nature',
    benefits: ['Nature connection', 'Peaceful ambience', 'Outdoor meditation feel'],
    audioSrc: '/assets/audio/meditation/mixkit-nature-meditation-345.mp3'
  },
  {
    id: 'spiritual-moment',
    title: 'Spiritual Moment',
    description: 'Contemplative meditation for spiritual reflection',
    duration: 480, // 8 minutes
    category: 'guided',
    benefits: ['Spiritual connection', 'Inner reflection', 'Transcendent experience'],
    audioSrc: '/assets/audio/meditation/mixkit-spiritual-moment-525.mp3'
  },
  // Brown Noise Collection
  {
    id: 'campfire-night',
    title: 'Campfire & Night Wind',
    description: 'Crackling fire with gentle night breeze - Brown noise for grounding',
    duration: 900, // 15 minutes
    category: 'nature',
    benefits: ['Brown noise grounding', 'Creates warmth', 'Evening relaxation'],
    audioSrc: '/assets/audio/ambient/mixkit-campfire-night-wind-1736 (1).wav',
    noiseColor: 'brown'
  },
  {
    id: 'ocean-waves',
    title: 'Ocean of Love',
    description: 'Deep ocean waves meditation - Brown noise frequencies',
    duration: 900, // 15 minutes
    category: 'nature',
    benefits: ['Deep brown noise', 'Ocean meditation', 'Grounding practice'],
    audioSrc: '/assets/audio/ambient/mixkit-ocean-of-love-1113.mp3',
    noiseColor: 'brown'
  },
  {
    id: 'harbor-waves',
    title: 'Small Waves on Rocks',
    description: 'Gentle harbor waves - Rhythmic brown noise meditation',
    duration: 600, // 10 minutes
    category: 'nature',
    benefits: ['Rhythmic brown noise', 'Coastal meditation', 'Natural rhythm'],
    audioSrc: '/assets/audio/ambient/mixkit-small-waves-harbor-rocks-1208.wav',
    noiseColor: 'brown'
  },
  // Pink Noise Collection
  {
    id: 'flowing-water-birds',
    title: 'Flowing Water & Birds',
    description: 'Natural water flow with bird sounds - Pink noise meditation',
    duration: 900, // 15 minutes
    category: 'nature',
    benefits: ['Pink noise benefits', 'Memory consolidation', 'Natural harmony'],
    audioSrc: '/assets/audio/ambient/mixkit-natural-ambience-with-flowing-water-and-birds-61 (1).wav',
    noiseColor: 'pink'
  },
  {
    id: 'water-flowing',
    title: 'Water Flowing Ambience',
    description: 'Continuous water flow - Pure pink noise meditation',
    duration: 720, // 12 minutes
    category: 'nature',
    benefits: ['Pure pink noise', 'Deep relaxation', 'Focus enhancement'],
    audioSrc: '/assets/audio/ambient/mixkit-water-flowing-ambience-loop-3126 (1).wav',
    noiseColor: 'pink'
  },
  {
    id: 'waterfall-woods',
    title: 'Waterfall in Woods',
    description: 'Forest waterfall meditation - Rich pink noise spectrum',
    duration: 600, // 10 minutes
    category: 'nature',
    benefits: ['Rich pink noise', 'Forest meditation', 'Mental clarity'],
    audioSrc: '/assets/audio/ambient/mixkit-waterfall-in-the-woods-2517 (1).wav',
    noiseColor: 'pink'
  },
  // White Noise Collection
  {
    id: 'chillax-ambient',
    title: 'Chillax Ambient',
    description: 'Synthesized relaxation tones - White noise meditation',
    duration: 600, // 10 minutes
    category: 'ambient',
    benefits: ['White noise masking', 'Deep focus', 'Environmental masking'],
    audioSrc: '/assets/audio/ambient/mixkit-chillax-655.mp3'
  },
  {
    id: 'harp-relax',
    title: 'Harp Relaxation',
    description: 'Soft harp melodies - High-frequency white noise elements',
    duration: 480, // 8 minutes
    category: 'ambient',
    benefits: ['White noise tones', 'Harp meditation', 'Higher consciousness'],
    audioSrc: '/assets/audio/ambient/mixkit-harp-relax-669.mp3'
  },
  {
    id: 'valley-sunset',
    title: 'Valley Sunset',
    description: 'Ambient nature soundscape - Balanced white noise spectrum',
    duration: 720, // 12 minutes
    category: 'ambient',
    benefits: ['Balanced white noise', 'Sunset meditation', 'Evening practice'],
    audioSrc: '/assets/audio/ambient/mixkit-valley-sunset-127.mp3'
  },
  {
    id: 'a-distant-star',
    title: 'A Distant Star',
    description: 'Meditative ambient tones - White noise with harmonic overtones',
    duration: 600, // 10 minutes
    category: 'ambient',
    benefits: ['Harmonic white noise', 'Celestial meditation', 'Spiritual connection'],
    audioSrc: '/assets/audio/ambient/mixkit-yoga-song-444.mp3',
    noiseColor: 'white'
  },
  // Blue/Grey Noise Collection
  {
    id: 'morning-birds',
    title: 'Morning Birds',
    description: 'Bird songs for energizing meditation - Blue noise characteristics',
    duration: 600, // 10 minutes
    category: 'nature',
    benefits: ['Blue noise alertness', 'Morning meditation', 'Nature connection'],
    audioSrc: '/assets/audio/ambient/mixkit-morning-birds-2472 (1).wav'
  },
  {
    id: 'garden-morning',
    title: 'Garden Morning Sounds',
    description: 'Garden birds and insects - Grey noise for natural balance',
    duration: 720, // 12 minutes
    category: 'nature',
    benefits: ['Grey noise balance', 'Garden meditation', 'Natural harmony'],
    audioSrc: '/assets/audio/ambient/mixkit-morning-sound-in-a-garden-2464 (1).wav'
  },
  {
    id: 'movement-flow',
    title: 'Movement Flow Sounds',
    description: 'Nature sounds for mindful movement and exercise',
    duration: 900, // 15 minutes
    category: 'nature',
    benefits: ['Enhances movement focus', 'Natural rhythm', 'Mind-body connection'],
    audioSrc: '/assets/audio/ambient/mixkit-natural-ambience-with-flowing-water-and-birds-61 (1).wav'
  },
  {
    id: 'exercise-energy',
    title: 'Morning Energy Boost',
    description: 'Uplifting bird sounds for active movement',
    duration: 600, // 10 minutes
    category: 'nature',
    benefits: ['Boosts energy', 'Motivates movement', 'Natural awakening'],
    audioSrc: '/assets/audio/ambient/mixkit-morning-birds-2472 (1).wav'
  },
  {
    id: 'garden-sounds',
    title: 'Garden Ambience',
    description: 'Peaceful garden sounds for mindfulness',
    duration: 720, // 12 minutes
    category: 'nature',
    benefits: ['Enhances mindfulness', 'Reduces anxiety', 'Nature connection'],
    audioSrc: '/assets/audio/ambient/mixkit-morning-sound-in-a-garden-2464 (1).wav'
  },
  {
    id: 'flowing-water',
    title: 'Flowing Water & Birds',
    description: 'Natural water flow with bird sounds',
    duration: 900, // 15 minutes
    category: 'nature',
    benefits: ['Deep relaxation', 'Mental clarity', 'Stress reduction'],
    audioSrc: '/assets/audio/ambient/mixkit-natural-ambience-with-flowing-water-and-birds-61 (1).wav'
  },
  {
    id: 'mindfulness-meditation',
    title: 'Mindfulness Meditation',
    description: 'Guided mindfulness practice',
    duration: 600, // 10 minutes
    category: 'guided',
    benefits: ['Improves focus', 'Reduces anxiety', 'Teaches mindfulness'],
    audioSrc: '/assets/audio/meditation/mindfulness.mp3'
  },
  {
    id: 'loving-kindness',
    title: 'Loving Kindness Meditation',
    description: 'Cultivate compassion and kindness',
    duration: 900, // 15 minutes
    category: 'guided',
    benefits: ['Increases empathy', 'Reduces negativity', 'Improves relationships'],
    audioSrc: '/assets/audio/meditation/loving-kindness.mp3'
  },
  {
    id: 'walking-meditation',
    title: 'Walking Meditation',
    description: 'Mindful movement and awareness practice',
    duration: 1200, // 20 minutes
    category: 'guided',
    benefits: ['Integrates mindfulness with movement', 'Improves awareness', 'Reduces restlessness'],
    audioSrc: '/assets/audio/meditation/walking-meditation.mp3'
  }
];

interface AudioMeditationPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioMeditationPlayer({ isOpen, onClose }: AudioMeditationPlayerProps) {
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([50]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying && selectedTrack) {
      const timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= selectedTrack.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, selectedTrack]);

  const playTrack = (track: AudioTrack) => {
    setSelectedTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetTrack = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nature': return <Waves className="h-4 w-4" />;
      case 'guided': return <Volume2 className="h-4 w-4" />;
      case 'binaural': return <Heart className="h-4 w-4" />;
      default: return <Volume2 className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nature': return 'bg-green-100 text-green-800';
      case 'guided': return 'bg-blue-100 text-blue-800';
      case 'binaural': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {!selectedTrack ? (
          // Track Selection
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Meditation Audio Library</h2>
              <Button variant="ghost" onClick={onClose}>×</Button>
            </div>
            
            <div className="space-y-4">
              {/* Pink Noise Section */}
              <Collapsible className="bg-pink-50 rounded-lg border border-pink-200">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-pink-100 rounded-lg hover:bg-pink-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌸</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-pink-900">Pink Noise Meditation</h3>
                      <p className="text-pink-700 text-sm">Memory consolidation & deep relaxation</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-pink-700" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <div className="grid gap-4">
                    {meditationTracks.filter(track => track.noiseColor === 'pink').map((track) => (
                      <Card key={track.id} className="cursor-pointer hover:shadow-lg transition-shadow bg-pink-25 border-pink-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-pink-900 mb-1">{track.title}</h4>
                              <p className="text-sm text-pink-700 mb-2">{track.description}</p>
                              <div className="flex items-center gap-2 text-sm text-pink-600">
                                <Clock className="h-3 w-3" />
                                {Math.floor(track.duration / 60)} minutes
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                onClick={() => playTrack(track)}
                                variant="outline"
                                size="sm"
                                className="border-pink-300 text-pink-700 hover:bg-pink-100"
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Play
                              </Button>
                              <FavoriteButton 
                                userId={1}
                                itemType="activity"
                                itemId={400 + parseInt(track.id.slice(-1)) || 400}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Brown Noise Section */}
              <Collapsible className="bg-orange-50 rounded-lg border border-orange-200">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏔️</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-orange-900">Brown Noise Meditation</h3>
                      <p className="text-orange-700 text-sm">Grounding & deep calm frequencies</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-orange-700" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <div className="grid gap-4">
                    {meditationTracks.filter(track => track.noiseColor === 'brown').map((track) => (
                      <Card key={track.id} className="cursor-pointer hover:shadow-lg transition-shadow bg-orange-25 border-orange-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-orange-900 mb-1">{track.title}</h4>
                              <p className="text-sm text-orange-700 mb-2">{track.description}</p>
                              <div className="flex items-center gap-2 text-sm text-orange-600">
                                <Clock className="h-3 w-3" />
                                {Math.floor(track.duration / 60)} minutes
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                onClick={() => playTrack(track)}
                                variant="outline"
                                size="sm"
                                className="border-orange-300 text-orange-700 hover:bg-orange-100"
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Play
                              </Button>
                              <FavoriteButton 
                                userId={1}
                                itemType="activity"
                                itemId={400 + parseInt(track.id.slice(-1)) || 400}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* White Noise Section */}
              <Collapsible className="bg-gray-50 rounded-lg border border-gray-200">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚪</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">White Noise Meditation</h3>
                      <p className="text-gray-700 text-sm">Environmental masking & focus</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-700" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <div className="grid gap-4">
                    {meditationTracks.filter(track => track.noiseColor === 'white').map((track) => (
                      <Card key={track.id} className="cursor-pointer hover:shadow-lg transition-shadow bg-gray-25 border-gray-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">{track.title}</h4>
                                {track.isPremium && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded border border-yellow-300">
                                    Premium ${track.price}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{track.description}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-3 w-3" />
                                {Math.floor(track.duration / 60)} minutes
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {track.isPremium ? (
                                <Button 
                                  onClick={() => playTrack(track)}
                                  variant="outline"
                                  size="sm"
                                  className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                                >
                                  <ShoppingCart className="h-3 w-3 mr-1" />
                                  ${track.price}
                                </Button>
                              ) : (
                                <Button 
                                  onClick={() => playTrack(track)}
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Play
                                </Button>
                              )}
                              <FavoriteButton 
                                userId={1}
                                itemType="activity"
                                itemId={400 + parseInt(track.id.slice(-1)) || 400}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Guided & Other Meditations */}
              <Collapsible className="bg-blue-50 rounded-lg border border-blue-200">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧘</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-blue-900">Guided & Nature Meditation</h3>
                      <p className="text-blue-700 text-sm">Voice-guided & ambient nature practices</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-blue-700" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <div className="grid gap-4">
                    {meditationTracks.filter(track => !track.noiseColor).map((track) => (
                      <Card key={track.id} className="cursor-pointer hover:shadow-lg transition-shadow bg-blue-25 border-blue-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-900 mb-1">{track.title}</h4>
                              <p className="text-sm text-blue-700 mb-2">{track.description}</p>
                              <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Clock className="h-3 w-3" />
                                {Math.floor(track.duration / 60)} minutes
                                <Badge className={getCategoryColor(track.category)}>
                                  <div className="flex items-center gap-1">
                                    {getCategoryIcon(track.category)}
                                    <span className="capitalize">{track.category}</span>
                                  </div>
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                onClick={() => playTrack(track)}
                                variant="outline"
                                size="sm"
                                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Play
                              </Button>
                              <FavoriteButton 
                                userId={1}
                                itemType="activity"
                                itemId={400 + parseInt(track.id.slice(-1)) || 400}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        ) : (
          // Audio Player
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedTrack.title}</h2>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setSelectedTrack(null)}>
                  ← Back
                </Button>
                <Button variant="ghost" onClick={onClose}>×</Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Audio Player Controls */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{selectedTrack.title}</h3>
                      <p className="text-sm text-gray-600">{selectedTrack.description}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(selectedTrack.duration)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(currentTime / selectedTrack.duration) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" onClick={resetTrack}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button onClick={togglePlayPause} size="lg">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2 max-w-xs mx-auto">
                      <Volume2 className="h-4 w-4" />
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">{volume[0]}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Track Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Benefits of this Audio</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedTrack.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}