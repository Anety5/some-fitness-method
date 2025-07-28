import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Moon, Volume2, Clock, ChevronDown } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import AudioMeditationPlayer from "@/components/audio-meditation-player";
import FavoriteButton from "@/components/favorite-button";
import SleepAudioFeedback from "@/components/sleep-audio-feedback";
import PremiumAudioPlayer from "@/components/PremiumAudioPlayer";
import LockedAudio from "@/components/LockedAudio";
import UpgradeToPremium from "@/components/UpgradeToPremium";
import PremiumToggle from "@/components/PremiumToggle";
import { useUser } from '@/hooks/useUser';
import { audioLibrary } from '@/utils/audioContent';

import WorkingAudioPlayer from "@/components/working-audio-player";

import MedicalDisclaimer from "@/components/medical-disclaimer";

interface SleepTechnique {
  id: number;
  title: string;
  description: string;
  duration: string;
  audioSrc?: string;
  instructions: string[];
}

const sleepTechniques: SleepTechnique[] = [
  {
    id: 1,
    title: "Progressive Muscle Relaxation",
    description: "Release tension from head to toe",
    duration: "3:20",
    audioSrc: "/assets/audio/meditation/Progressive%20Muscle%20Relaxation%20Technique.mp4",
    instructions: [
      "Start by tensing your toes for 5 seconds, then release",
      "Move up to your calves, thighs, and continue upward",
      "Tense each muscle group for 5 seconds, then relax",
      "End with your face and scalp muscles"
    ]
  },
  {
    id: 2,
    title: "Body Scan Meditation",
    description: "Mindful awareness to prepare for sleep",
    duration: "3:14",
    audioSrc: "/assets/audio/meditation/Body%20Scan%20Relaxation%20w%20bells%20-%20Made%20with%20Clipchamp.mp4", 
    instructions: [
      "Lie down comfortably and close your eyes",
      "Focus on your breathing for a few moments",
      "Slowly scan from your toes to your head",
      "Notice any tension and let it melt away"
    ]
  },
  {
    id: 3,
    title: "Sleep Visualization",
    description: "Guided imagery for peaceful sleep",
    duration: "3:47",
    audioSrc: "/assets/audio/meditation/Visualization%20for%20Sleep.mp4",
    instructions: [
      "Close your eyes and imagine a peaceful place",
      "Focus on the details - colors, sounds, sensations",
      "Allow yourself to feel completely safe and calm",
      "Let the visualization naturally fade into sleep"
    ]
  }
];

const sleepAudio = [
  {
    id: 1,
    title: "Calm With Me - Gentle Sleep",
    description: "Soft lyrical song with white noise ambience for deep relaxation",
    duration: "3 minutes (loops)",
    category: "premium",
    noiseColor: "guided",
    audioSrc: "/assets/audio/meditation/calmwithme.mp3",
    isPremium: false,
    price: "0.00"
  },
  {
    id: 21,
    title: "Whispers of Rain",
    description: "Relaxing music that gently drifts you away to sleep with binaural beats",
    duration: "Extended session",
    category: "premium",
    noiseColor: "guided",
    audioSrc: "/assets/audio/meditation/Whispers%20of%20Rain_20250713_1437(1)_1752648029405.mp3",
    isPremium: false,
    price: "0.00"
  },

  // Pink Sound Collection (Free + Premium)
  {
    id: 5,
    title: "Flowing Water & Birds",
    description: "Natural water flow with bird sounds - Pink/Brown sound blend",
    duration: "3 minutes (loops)",
    category: "nature",
    noiseColor: "pink",
    audioSrc: "/assets/audio/ambient/mixkit-natural-ambience-with-flowing-water-and-birds-61 (1).wav",
    isPremium: true
  },
  {
    id: 6,
    title: "Water Flowing Ambience",
    description: "Continuous water flow - Pure pink sound for deep relaxation",
    duration: "2 minutes (loops)",
    category: "nature",
    noiseColor: "pink",
    audioSrc: "/assets/audio/ambient/mixkit-water-flowing-ambience-loop-3126 (1).wav",
    isPremium: true
  },
  {
    id: 7,
    title: "Waterfall in Woods",
    description: "Forest waterfall sounds - Rich pink sound spectrum",
    duration: "2 minutes (loops)",
    category: "nature",
    noiseColor: "pink",
    audioSrc: "/assets/audio/ambient/mixkit-waterfall-in-the-woods-2517 (1).wav",
    isPremium: true
  },
  // Brown Sound Collection (Free + Premium)
  {
    id: 8,
    title: "Campfire & Night Wind",
    description: "Crackling fire with gentle breeze - Brown sound for grounding",
    duration: "2 minutes (loops)",
    category: "nature",
    noiseColor: "brown",
    audioSrc: "/assets/audio/ambient/mixkit-campfire-night-wind-1736 (1).wav",
    isPremium: false
  },
  {
    id: 9,
    title: "Ocean of Love",
    description: "Deep ocean waves - Soothing brown sound frequencies",
    duration: "3 minutes (loops)",
    category: "nature",
    noiseColor: "brown",
    audioSrc: "/assets/audio/ambient/mixkit-chillax-655.mp3",
    isPremium: true
  },
  {
    id: 10,
    title: "Small Waves on Rocks",
    description: "Gentle harbor waves - Rhythmic brown sound for deep sleep",
    duration: "2 minutes (loops)",
    category: "nature",
    noiseColor: "brown",
    audioSrc: "/assets/audio/ambient/mixkit-small-waves-harbor-rocks-1208.wav",
    isPremium: true
  },
  // White Sound & Ambient Collection (Free + Premium)
  {
    id: 11,
    title: "Nature Meditation",
    description: "Ambient nature soundscape - Balanced white sound spectrum",
    duration: "3 minutes (loops)",
    category: "ambient",
    noiseColor: "white",
    audioSrc: "/assets/audio/meditation/mixkit-nature-meditation-345.mp3",
    isPremium: false
  },
  {
    id: 12,
    title: "Chillax Ambient",
    description: "Synthesized relaxation tones - White sound characteristics",
    duration: "3 minutes (loops)",
    category: "ambient",
    noiseColor: "white",
    audioSrc: "/assets/audio/ambient/mixkit-chillax-655.mp3",
    isPremium: true
  },
  {
    id: 14,
    title: "Spiritual Moment",
    description: "Meditative ambient tones - White sound with harmonic overtones",
    duration: "2 minutes (loops)",
    category: "ambient",
    noiseColor: "white",
    audioSrc: "/assets/audio/meditation/mixkit-spiritual-moment-525.mp3",
    isPremium: true
  },

  // Blue & Grey Sound Collection (Free + Premium)
  {
    id: 15,
    title: "Morning Birds",
    description: "Dawn bird chorus - Blue sound characteristics for alertness",
    duration: "2 minutes (loops)",
    category: "nature",
    noiseColor: "blue",
    audioSrc: "/assets/audio/ambient/mixkit-morning-birds-2472 (1).wav",
    isPremium: false
  },
  {
    id: 16,
    title: "Garden Morning Sounds",
    description: "Garden birds and insects - Grey sound for natural balance",
    duration: "3 minutes (loops)",
    category: "nature",
    noiseColor: "grey",
    audioSrc: "/assets/audio/ambient/mixkit-morning-sound-in-a-garden-2464 (1).wav",
    isPremium: true
  }
];

export default function SleepPrep() {
  const [, setLocation] = useLocation();
  const [selectedTechnique, setSelectedTechnique] = useState<number | null>(null);
  const [audioPlayerOpen, setAudioPlayerOpen] = useState(false);
  const [expandedGuidelines, setExpandedGuidelines] = useState(false);
  const { isPremium, upgradeUser } = useUser();
  

  
  const handleUpgrade = async () => {
    const result = await upgradeUser();
    if (result.success) {
      window.location.reload();
    }
  };


  return (
    <div className="min-h-screen sleep-night-background relative">
      <div className="min-h-screen bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60">
        <div className="container mx-auto px-4 py-6">
        <div className="page-header">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button className="wellness-btn-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="page-title">Sleep</h1>
          <p className="page-subtitle">
            Effective relaxation techniques, guided meditation, and sleep sound therapy for deeper rest
          </p>
          
          {/* Premium Toggle for Demo */}
          <div className="mt-4">
            <PremiumToggle />
          </div>
        </div>

        {/* Sleep Preparation Guidelines */}
        <div className="mb-8">
          <Collapsible open={expandedGuidelines} onOpenChange={setExpandedGuidelines}>
            <CollapsibleTrigger asChild>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <Moon className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Sleep Preparation Guidelines</h3>
                        <p className="text-white/70 text-sm">Evidence-based recommendations for better sleep</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-white/70 transition-transform ${expandedGuidelines ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-2">
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Pre-Sleep Routine (1-2 hours before bed)
                      </h4>
                      <ul className="space-y-2 text-white/80 text-sm">
                        <li>• <strong>Dim Lights:</strong> Reduce light exposure to signal bedtime to your brain</li>
                        <li>• <strong>Screen Time:</strong> Stop using phones, tablets, and computers 1-2 hours before sleep</li>
                        <li>• <strong>Blue Light:</strong> Use blue light filters or glasses if screen use is necessary</li>
                        <li>• <strong>Room Temperature:</strong> Keep bedroom cool (65-68°F) for optimal sleep</li>
                        <li>• <strong>Relaxation Time:</strong> Engage in calming activities like reading or gentle stretching</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Sleep Sound Application
                      </h4>
                      <ul className="space-y-2 text-white/80 text-sm">
                        <li>• <strong>Volume Control:</strong> Start with lower volumes (20-30%) and adjust gradually</li>
                        <li>• <strong>Consistency:</strong> Combine with consistent sleep hygiene practices</li>
                        <li>• <strong>Adaptation Period:</strong> Allow 7-14 days for nervous system adaptation</li>
                        <li>• <strong>Timing:</strong> Begin playing sounds 15-30 minutes before intended sleep time</li>
                        <li>• <strong>Gradual Reduction:</strong> Use timer functions to reduce dependency over time</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Deep Sleep Preparation Techniques - Top Priority */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <Moon className="w-6 h-6 mr-2" />
            Guided Sleep Preparation
          </h2>
          <p className="text-white/70 text-sm mb-6">
            Start with these guided techniques to prepare your mind and body for deep, restorative sleep.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sleepTechniques.map((technique) => (
              <Card key={technique.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => setSelectedTechnique(
                        selectedTechnique === technique.id ? null : technique.id
                      )}
                    >
                      <CardTitle className="text-white">{technique.title}</CardTitle>
                      <p className="text-white/70 text-sm">{technique.description}</p>
                      <div className="flex items-center text-white/60 mt-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{technique.duration}</span>
                      </div>
                    </div>
                    <FavoriteButton 
                      userId={1}
                      itemType="activity"
                      itemId={technique.id + 100}
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 ml-2"
                    />
                  </div>
                </CardHeader>
                {selectedTechnique === technique.id && (
                  <CardContent className="text-white/80">
                    {technique.audioSrc && (
                      <div className="mb-4 p-3 bg-white/10 rounded-lg border border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-medium">Guided Audio</span>
                          </div>
                          <WorkingAudioPlayer
                            src={technique.audioSrc}
                            title={technique.title}
                            category="sleep"
                          />
                        </div>
                        <p className="text-white/70 text-xs mt-2">Follow along with the guided {technique.title.toLowerCase()} audio</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {technique.instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-white/60 text-sm mr-2">{index + 1}.</span>
                          <span className="text-sm">{instruction}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Sound Recommendations & Color Guide - Collapsible */}
        <div className="mb-6">
          <Collapsible>
            <CollapsibleTrigger className="w-full text-left">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-white flex items-center">
                      🎧 Color of Sound Guide & Recommendations
                    </h2>
                    <ChevronDown className="h-5 w-5 text-white/70" />
                  </div>
                  <p className="text-white/80 text-sm mt-2">Tap to view sound color benefits and recommendations</p>
                </CardContent>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-2">
                <CardContent className="p-6">
                  <p className="text-white/80 mb-4">Choose your optimal sound color for sleep enhancement. Each offers unique benefits:</p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-pink-400 rounded-full"></span>
                        <strong className="text-pink-200">Pink Sound:</strong> <span className="text-white/90">Natural rain, gentle for light sleepers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-amber-600 rounded-full"></span>
                        <strong className="text-amber-200">Brown Sound:</strong> <span className="text-white/90">Deep forest, fire crackles for nervous system calm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                        <strong className="text-gray-200">White Sound:</strong> <span className="text-white/90">Static, masks urban noise effectively</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                        <strong className="text-blue-200">Blue/Grey Sound:</strong> <span className="text-white/90">Ocean waves, higher frequencies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                        <strong className="text-purple-200">Binaural/Ambient:</strong> <span className="text-white/90">Brain wave entrainment for deep sleep</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">
                    <strong>Quick Guide:</strong> Light sleepers → Pink/Brown | Urban environments → White | Deep meditation → Brown/Binaural | Restless minds → Binaural beats
                  </p>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>



        {/* Sleep Audio - Color Sounds with Quick Access */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <Volume2 className="w-6 h-6 mr-2" />
            Color Sound Options
          </h2>
          <p className="text-white/80 text-sm mb-6">
            Click any sound color to access audio options. Each color supports different sleep needs and environments.
          </p>
          
          <div className="space-y-4">
              {/* Calming Songs Section */}
              <Collapsible className="bg-white/5 rounded-lg border border-white/10">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎵</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Calming Songs</h3>
                      <p className="text-purple-200 text-sm">Gentle melodies for sleep</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2">
                  <div className="space-y-2">
                    {sleepAudio.filter(audio => audio.category === 'premium').map((audio) => (
                      <Card key={audio.id} className="bg-purple-500/10 border-purple-400/20">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-white text-sm">{audio.title}</h4>
                              </div>
                              <p className="text-purple-100 text-xs">{audio.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <WorkingAudioPlayer
                                src={audio.audioSrc}
                                title={audio.title}
                              />
                              <FavoriteButton 
                                userId={1}
                                itemType="activity"
                                itemId={audio.id + 200}
                                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Premium Sleep Collection */}
              <Collapsible className="bg-white/5 rounded-lg border border-white/10">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg hover:from-yellow-500/30 hover:to-orange-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">✨</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Premium Sleep Collection</h3>
                      <p className="text-yellow-200 text-sm">Exclusive calming music & meditation stories</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2">
                  <div className="space-y-2">
                    <LockedAudio
                      title="Ocean Dreams"
                      description="Gentle piano melodies with ocean waves - Not available yet"
                      onUpgradeClick={handleUpgrade}
                    />
                    <LockedAudio
                      title="Mountain Breeze"
                      description="Soft acoustic guitar with mountain wind sounds - Not available yet"
                      onUpgradeClick={handleUpgrade}
                    />
                    <LockedAudio
                      title="Starlight Lullaby"
                      description="Ambient synthesizer with gentle night sounds - Not available yet"
                      onUpgradeClick={handleUpgrade}
                    />
                    <LockedAudio
                      title="Forest Whispers"
                      description="Calming flute melodies with forest ambience - Not available yet"
                      onUpgradeClick={handleUpgrade}
                    />
                    <LockedAudio
                      title="Peaceful Dreams Story"
                      description="5-minute narrated meditation story with soft music - Not available yet"
                      onUpgradeClick={handleUpgrade}
                    />
                    <LockedAudio
                      title="Twilight Journey Story"
                      description="8-minute guided sleep story with nature sounds - Not available yet"
                      onUpgradeClick={handleUpgrade}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Pink Sound Section */}
              <Collapsible className="bg-white/5 rounded-lg border border-white/10">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-pink-500/20 rounded-lg hover:bg-pink-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌸</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Pink Sound</h3>
                      <p className="text-pink-200 text-sm">Memory & deep sleep</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2">
                  <div className="space-y-2">
                    {sleepAudio.filter(audio => audio.noiseColor === 'pink').map((audio) => (
                      isPremium || !audio.isPremium ? (
                        <Card key={audio.id} className="bg-pink-500/10 border-pink-400/20">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-white text-sm">{audio.title}</h4>
                                <p className="text-pink-100 text-xs">{audio.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <WorkingAudioPlayer
                                  src={audio.audioSrc}
                                  title={audio.title}
                                />
                                <FavoriteButton 
                                  userId={1}
                                  itemType="activity"
                                  itemId={audio.id + 200}
                                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <LockedAudio
                          key={audio.id}
                          title={audio.title}
                          description={audio.description}
                          duration={audio.duration}
                          onUpgradeClick={handleUpgrade}
                        />
                      )
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Brown Sound Section */}
              <Collapsible className="bg-white/5 rounded-lg border border-white/10">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-orange-500/20 rounded-lg hover:bg-orange-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏔️</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Brown Sound</h3>
                      <p className="text-orange-200 text-sm">Grounding & calm</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2">
                  <div className="space-y-2">
                    {sleepAudio.filter(audio => audio.noiseColor === 'brown').map((audio) => (
                      isPremium || !audio.isPremium ? (
                        <Card key={audio.id} className="bg-orange-500/10 border-orange-400/20">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-white text-sm">{audio.title}</h4>
                                <p className="text-orange-100 text-xs">{audio.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <WorkingAudioPlayer
                                  src={audio.audioSrc}
                                  title={audio.title}
                                />
                                <FavoriteButton 
                                  userId={1}
                                  itemType="activity"
                                  itemId={audio.id + 200}
                                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <LockedAudio
                          key={audio.id}
                          title={audio.title}
                          description={audio.description}
                          duration={audio.duration}
                          onUpgradeClick={handleUpgrade}
                        />
                      )
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* White Sound Section */}
              <Collapsible className="bg-white/5 rounded-lg border border-white/10">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-500/20 rounded-lg hover:bg-gray-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚪</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">White Sound</h3>
                      <p className="text-gray-200 text-sm">Masking & focus</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2">
                  <div className="space-y-2">
                    {sleepAudio.filter(audio => audio.noiseColor === 'white').map((audio) => (
                      isPremium || !audio.isPremium ? (
                        <Card key={audio.id} className="bg-gray-500/10 border-gray-400/20">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-white text-sm">{audio.title}</h4>
                                <p className="text-gray-100 text-xs">{audio.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <WorkingAudioPlayer
                                  src={audio.audioSrc}
                                  title={audio.title}
                                />
                                <FavoriteButton 
                                  userId={1}
                                  itemType="activity"
                                  itemId={audio.id + 200}
                                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <LockedAudio
                          key={audio.id}
                          title={audio.title}
                          description={audio.description}
                          duration={audio.duration}
                          onUpgradeClick={handleUpgrade}
                        />
                      )
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>



              {/* Blue/Grey Sound Section */}
              <Collapsible className="bg-white/5 rounded-lg border border-white/10">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌅</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Blue & Grey Sound</h3>
                      <p className="text-blue-200 text-sm">Alertness & balance</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2">
                  <div className="space-y-2">
                    {sleepAudio.filter(audio => audio.noiseColor === 'blue' || audio.noiseColor === 'grey').map((audio) => (
                      isPremium || !audio.isPremium ? (
                        <Card key={audio.id} className="bg-blue-500/10 border-blue-400/20">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-white text-sm">{audio.title}</h4>
                                <p className="text-blue-100 text-xs">{audio.description}</p>
                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                                  audio.noiseColor === 'blue' ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-800'
                                }`}>
                                  {audio.noiseColor} sound
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <WorkingAudioPlayer
                                  src={audio.audioSrc}
                                  title={audio.title}
                                />
                                <FavoriteButton 
                                  userId={1}
                                  itemType="activity"
                                  itemId={audio.id + 200}
                                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <LockedAudio
                          key={audio.id}
                          title={audio.title}
                          description={audio.description}
                          duration={audio.duration}
                          onUpgradeClick={handleUpgrade}
                        />
                      )
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              
            </div>
          </div>

        <AudioMeditationPlayer
          isOpen={audioPlayerOpen}
          onClose={() => setAudioPlayerOpen(false)}
        />

        </div>
      </div>
    </div>
  );
}