import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Settings } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export default function PremiumToggle() {
  const { isPremium, togglePremium } = useUser();

  return (
    <div className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
      <Settings className="w-5 h-5 text-white" />
      <div className="flex items-center gap-2">
        <span className="text-white font-medium">Demo Mode:</span>
        <Badge variant={isPremium ? "default" : "outline"} className={
          isPremium 
            ? "bg-green-600 text-white" 
            : "bg-gray-600 text-white"
        }>
          {isPremium ? "Premium" : "Free"}
        </Badge>
      </div>
      <Button 
        onClick={togglePremium}
        variant="outline"
        size="sm"
        className="bg-white/10 border-white/30 text-white hover:bg-white/20"
      >
        {isPremium ? (
          <>Switch to Free</>
        ) : (
          <>
            <Crown className="w-4 h-4 mr-1" />
            Switch to Premium
          </>
        )}
      </Button>
    </div>
  );
}