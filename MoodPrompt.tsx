import React from 'react';
import { Link } from 'wouter';

export default function MoodPrompt() {
  return (
    <Link to="/daily-checkin">
      <div className="mb-6 rounded-xl bg-white/30 backdrop-blur p-4 shadow hover:bg-white/40 transition-colors cursor-pointer">
        <div className="flex justify-between items-center">
          <span className="text-gray-800 font-medium">How are you feeling today?</span>
          <span className="text-xl">😊</span>
        </div>
      </div>
    </Link>
  );
}