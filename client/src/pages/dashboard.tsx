import React from 'react';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white/95 p-8 rounded-2xl shadow-xl text-center max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">S.O.M.E fitness method</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => setLocation('/sleep-prep')}
            className="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg transition-colors"
          >
            <span className="text-2xl block mb-2">😴</span>
            <div className="text-sm font-semibold">Sleep</div>
          </button>
          
          <button 
            onClick={() => setLocation('/breathing')}
            className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg transition-colors"
          >
            <span className="text-2xl block mb-2">🫁</span>
            <div className="text-sm font-semibold">Oxygen</div>
          </button>
          
          <button 
            onClick={() => setLocation('/morning-routine')}
            className="bg-green-100 hover:bg-green-200 p-4 rounded-lg transition-colors"
          >
            <span className="text-2xl block mb-2">🏃</span>
            <div className="text-sm font-semibold">Move</div>
          </button>
          
          <button 
            onClick={() => setLocation('/nutrition')}
            className="bg-orange-100 hover:bg-orange-200 p-4 rounded-lg transition-colors"
          >
            <span className="text-2xl block mb-2">🍎</span>
            <div className="text-sm font-semibold">Eat</div>
          </button>
        </div>
        
        <p className="text-lg text-gray-600 mb-4">Your complete wellness tracking platform</p>
        <p className="text-sm text-gray-500">Click the sections above to explore features</p>
      </div>
    </div>
  );
}
