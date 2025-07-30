import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mountain } from 'lucide-react';
import { useLocation } from 'wouter';
import { MapTracker } from '@/components/MapTracker';

export default function HikeTrackerPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: `url('/attached_assets/Tropical Sunset Over Mountain Island_1752440245041.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center'
         }}>
      
      {/* Soft overlay for contrast */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative min-h-screen flex flex-col">
        
        {/* Fixed Header */}
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="p-4">
            <Button 
              onClick={() => setLocation('/')}
              variant="outline" 
              className="mb-2 bg-white/80 hover:bg-white text-gray-900 border-gray-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mountain className="w-6 h-6 text-gray-900" />
                <h1 className="text-lg font-bold text-gray-900">GPS Hike & Walk Tracker</h1>
              </div>
              <p className="text-gray-600 text-sm">Track your outdoor activities with GPS mapping</p>
            </div>
          </div>
        </div>

        {/* GPS Tracker Content */}
        <div className="flex-1 p-4">
          <MapTracker />
        </div>
      </div>
    </div>
  );
}