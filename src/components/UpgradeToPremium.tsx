import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Lock, Zap, CheckCircle, Crown, Music, ChefHat, Dumbbell } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

interface UpgradeToPremiumProps {
  variant?: 'modal' | 'page';
  context?: 'audio' | 'recipes' | 'exercises' | 'general';
}

export default function UpgradeToPremium({ variant = 'modal', context = 'general' }: UpgradeToPremiumProps) {
  const { upgradeUser } = useUser();

  const handleUpgrade = async () => {
    const result = await upgradeUser();
    if (result.success) {
      window.location.reload(); // Refresh to show new premium content
    }
  };

  // Context-specific features
  const getContextFeatures = () => {
    switch (context) {
      case 'audio':
        return [
          { icon: <Music className="w-5 h-5" />, text: "All meditation and breathing tracks" },
          { icon: <Star className="w-5 h-5" />, text: "Binaural beats and sleep stories" },
          { icon: <CheckCircle className="w-5 h-5" />, text: "Exclusive guided meditations" },
        ];
      case 'recipes':
        return [
          { icon: <ChefHat className="w-5 h-5" />, text: "50+ diet-specific healthy recipes" },
          { icon: <Star className="w-5 h-5" />, text: "Chef-quality gourmet recipes" },
          { icon: <CheckCircle className="w-5 h-5" />, text: "Detailed nutritional breakdowns" },
        ];
      case 'exercises':
        return [
          { icon: <Dumbbell className="w-5 h-5" />, text: "Custom movement routines (coming soon)" },
          { icon: <Star className="w-5 h-5" />, text: "Advanced exercise library" },
          { icon: <CheckCircle className="w-5 h-5" />, text: "Personal workout analytics" },
        ];
      default:
        return [
          { icon: <Music className="w-5 h-5" />, text: "All meditation and breathing tracks" },
          { icon: <ChefHat className="w-5 h-5" />, text: "50+ diet-specific healthy recipes" },
          { icon: <Dumbbell className="w-5 h-5" />, text: "Custom movement routines (coming soon)" },
        ];
    }
  };

  const features = getContextFeatures();

  // Modal version for inline upgrades (as per user's specification)
  if (variant === 'modal') {
    return (
      <div className="p-4 bg-white rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">Unlock the Full Experience</h2>
        <ul className="list-disc ml-5 text-sm mb-4">
          {features.map((feature, index) => (
            <li key={index}>{feature.text}</li>
          ))}
        </ul>
        <Button 
          onClick={handleUpgrade} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full w-full"
        >
          Go Premium
        </Button>
      </div>
    );
  }

  // Full page version
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardHeader className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Crown className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-2">Upgrade to Premium</CardTitle>
          <p className="text-indigo-100">Unlock the full potential of your wellness journey</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 text-lg">
                50% OFF Launch Special
              </Badge>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                <span className="text-lg text-gray-500 line-through ml-2">$19.99</span>
                <span className="text-sm text-gray-600 block">per month</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 text-center">Premium Features</h3>
              <div className="grid gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-indigo-600">{feature.icon}</div>
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">30-Day Money Back Guarantee</span>
              </div>
              <p className="text-sm text-green-700">
                Try premium risk-free. Cancel anytime within 30 days for a full refund.
              </p>
            </div>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium Now
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By upgrading, you agree to our Terms of Service and Privacy Policy. 
              Subscription automatically renews unless cancelled.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}