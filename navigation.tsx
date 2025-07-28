import React from "react";
import { Link, useLocation } from "wouter";
import { Bell, User, Home, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import WellnessCharacter from "@/components/wellness-character";
import { useTheme } from "@/hooks/use-theme";
import logoPath from "@assets/SOME fitness logo 1_1752967200752.png";

export default function Navigation() {
  const [location] = useLocation();
  const { timeOfDay } = useTheme();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const getNavGradient = () => {
    if (timeOfDay === 'morning') return 'morning-gradient';
    if (timeOfDay === 'afternoon') return 'afternoon-gradient';
    return 'evening-gradient';
  };

  return (
    <>
      <nav className={`${getNavGradient()} shadow-sm border-b border-white/20 relative z-10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3">
                <img 
                  src={logoPath} 
                  alt="S.O.M.E fitness" 
                  className="w-10 h-10 rounded-lg shadow-lg"
                />
                <h1 className="text-sm font-medium cursor-pointer drop-shadow-lg text-[#111827]" style={{ fontFamily: 'Inter, sans-serif' }}>Return to Dashboard</h1>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/") 
                    ? "text-white bg-white/20 backdrop-blur-sm" 
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}>
                  Dashboard
                </Link>
                <Link href="/resources" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/resources") 
                    ? "text-white bg-white/20 backdrop-blur-sm" 
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}>
                  Resources
                </Link>
                <Link href="/notifications" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/notifications") 
                    ? "text-white bg-white/20 backdrop-blur-sm" 
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}>
                  Schedule Reminders
                </Link>

              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <WellnessCharacter size="sm" mood="happy" />
          </div>
        </div>
      </div>
    </nav>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden mobile-nav-container">
        <div className="flex justify-around items-center px-2 py-2">
          <Link href="/" className={`mobile-nav-item ${
            isActive("/") ? "active" : ""
          }`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link href="/resources" className={`mobile-nav-item ${
            isActive("/resources") ? "active" : ""
          }`}>
            <BookOpen className="h-5 w-5" />
            <span className="text-xs mt-1">Resources</span>
          </Link>
          
          <Link href="/notifications" className={`mobile-nav-item ${
            isActive("/notifications") ? "active" : ""
          }`}>
            <Bell className="h-5 w-5" />
            <span className="text-xs mt-1">Reminders</span>
          </Link>
          
          <Link href="/profile" className={`mobile-nav-item ${
            isActive("/profile") ? "active" : ""
          }`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
}
