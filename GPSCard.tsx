import React from 'react';
import { Link } from 'wouter';

export default function GPSCard() {
  return (
    <Link to="/gps-tracker">
      <div className="mb-6 rounded-xl bg-white/30 backdrop-blur p-4 shadow hover:bg-white/40 transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <img
            src="/assets/characters/kai-hiker.png"
            alt="Hiker icon"
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              // Fallback to regular Kai character if hiker variant fails
              (e.target as HTMLImageElement).src = "/assets/characters/kai.png";
              (e.target as HTMLImageElement).className = "w-10 h-10 rounded-full";
            }}
          />
          <div>
            <p className="text-gray-800 font-bold">Let's go for a mindful walk</p>
            <p className="text-gray-600 text-sm">Tap to enable GPS tracking</p>
          </div>
        </div>
      </div>
    </Link>
  );
}