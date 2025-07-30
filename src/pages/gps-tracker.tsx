import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { MapTracker } from '@/components/MapTracker';

export default function GPSTracker() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: `url('/images/tropical-day-coast.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center'
         }}>
      
      {/* Soft overlay for contrast */}
      <div className="absolute inset-0 bg-white/30"></div>
      
      <div className="relative min-h-screen flex flex-col">
        
        {/* Fixed Header - Always Visible */}
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
              <h1 className="text-lg font-bold text-gray-900">GPS Activity Tracker</h1>
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