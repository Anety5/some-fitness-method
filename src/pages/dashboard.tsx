import React from 'react';
import GreetingHeader from '@/components/GreetingHeader';
import MoodPrompt from '@/components/MoodPrompt';
import SomeButton from '@/components/SomeButton';
import GPSCard from '@/components/GPSCard';
import QuoteCard from '@/components/QuoteCard';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Dumbbell, Star, Info } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { isPremium } = useUser();

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: `url('/images/tropical-day-coast.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center',
           imageRendering: 'auto'
         }}>
      
      {/* Clear overlay for contrast without blur */}
      <div className="absolute inset-0 bg-white/30"></div>
      
      <div className="relative min-h-screen flex flex-col">
        
        <div className="flex-1 p-6">
          <GreetingHeader userName="Guest" />
          <MoodPrompt />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <SomeButton label="Sleep" color="bg-purple-400/90" icon="sleep" route="/sleep-prep" />
            <SomeButton label="Oxygen" color="bg-teal-200/80" icon="oxygen" route="/breathing" />
            <SomeButton label="Move" color="bg-green-400/90" icon="move" route="/morning-routine" />
            <SomeButton label="Eat" color="bg-orange-200/80" icon="eat" route="/nutrition" />
          </div>

          {/* Exercise Library Section */}
          <div className="mb-6">
            <Button 
              onClick={() => setLocation('/exercise-library')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg mb-4"
            >
              <Dumbbell className="w-6 h-6 mr-3" />
              Exercise Library
              <div className="ml-2 flex items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isPremium 
                    ? 'bg-green-400 text-green-900' 
                    : 'bg-yellow-400 text-yellow-900'
                }`}>
                  <Star className="w-3 h-3 mr-1 inline" />
                  {isPremium ? 'Premium Active' : 'Free & Premium'}
                </span>
              </div>
            </Button>

          </div>

          <GPSCard />
          <QuoteCard />
        </div>
      </div>
    </div>
  );
}