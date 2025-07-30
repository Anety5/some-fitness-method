import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  subscriptionStatus: 'free' | 'premium' | 'trial' | 'expired';
  trialEndsAt?: Date;
}

// Mock user data - in a real app this would come from your auth system
const mockUser: User = {
  id: 'user_123',
  name: 'Guest User',
  email: 'guest@example.com',
  isPremium: false,
  subscriptionStatus: 'free'
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const loadUser = async () => {
      try {
        // In a real app, this would be an API call to get user data
        // For now, we'll check localStorage for premium status
        const premiumStatus = localStorage.getItem('user_premium_status');
        const userData = {
          ...mockUser,
          isPremium: premiumStatus === 'true',
          subscriptionStatus: premiumStatus === 'true' ? 'premium' as const : 'free' as const
        };
        
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(mockUser);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const upgradeUser = async () => {
    try {
      // In a real app, this would handle the payment flow
      // For demo purposes, we'll just update the local state
      localStorage.setItem('user_premium_status', 'true');
      
      if (user) {
        const updatedUser = {
          ...user,
          isPremium: true,
          subscriptionStatus: 'premium' as const,
          premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        };
        setUser(updatedUser);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error upgrading user:', error);
      return { success: false, error: 'Failed to upgrade account' };
    }
  };

  const cancelSubscription = async () => {
    try {
      localStorage.setItem('user_premium_status', 'false');
      
      if (user) {
        const updatedUser = {
          ...user,
          isPremium: false,
          subscriptionStatus: 'free' as const,
          premiumExpiresAt: undefined
        };
        setUser(updatedUser);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return { success: false, error: 'Failed to cancel subscription' };
    }
  };

  const togglePremium = () => {
    if (user) {
      const newStatus = !user.isPremium;
      localStorage.setItem('user_premium_status', newStatus.toString());
      
      const updatedUser = {
        ...user,
        isPremium: newStatus,
        subscriptionStatus: newStatus ? 'premium' as const : 'free' as const,
        premiumExpiresAt: newStatus ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined
      };
      setUser(updatedUser);
    }
  };

  return {
    user,
    isLoading,
    upgradeUser,
    cancelSubscription,
    togglePremium,
    isPremium: user?.isPremium || false,
    subscriptionStatus: user?.subscriptionStatus || 'free'
  };
}