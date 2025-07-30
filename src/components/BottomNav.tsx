import React from 'react';
import { Home, BookOpen, Heart, Bell, Target, User } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function BottomNav() {
  const [location] = useLocation();
  const isActive = (path: string) => location === path || location.startsWith(path);

  return (
    <nav className="sticky bottom-0 backdrop-blur border-t bg-white/70 p-2 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link to="/" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
          isActive('/') && location === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'
        }`}>
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/resources" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
          isActive('/resources') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'
        }`}>
          <BookOpen className="w-5 h-5" />
          <span className="text-xs mt-1">Resources</span>
        </Link>
        
        <Link to="/health-connect-guide" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
          isActive('/health-connect-guide') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'
        }`}>
          <Heart className="w-5 h-5" />
          <span className="text-xs mt-1">Health</span>
        </Link>
        
        <Link to="/notifications" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
          isActive('/notifications') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'
        }`}>
          <Bell className="w-5 h-5" />
          <span className="text-xs mt-1">Schedule</span>
        </Link>
        

        <Link to="/profile" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
          isActive('/profile') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'
        }`}>
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}