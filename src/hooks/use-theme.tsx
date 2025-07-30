import { createContext, useContext, useEffect, useState } from 'react';

type TimeOfDay = 'morning' | 'afternoon' | 'evening';
type DesertTheme = 'sunrise' | 'midday' | 'twilight';

interface ThemeContextType {
  timeOfDay: TimeOfDay;
  desertTheme: DesertTheme;
  theme: string;
  setTimeOfDay: (time: TimeOfDay) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getThemeByTime = (): DesertTheme => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'sunrise';
  if (hour >= 11 && hour < 17) return 'midday';
  return 'twilight';
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [desertTheme, setDesertTheme] = useState<DesertTheme>(() => getThemeByTime());

  const getTimeOfDay = (): TimeOfDay => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  useEffect(() => {
    const currentTime = getTimeOfDay();
    const currentDesertTheme = getThemeByTime();
    setTimeOfDay(currentTime);
    setDesertTheme(currentDesertTheme);

    // Set up interval to check time every minute
    const interval = setInterval(() => {
      const newTime = getTimeOfDay();
      const newDesertTheme = getThemeByTime();
      if (newTime !== timeOfDay) {
        setTimeOfDay(newTime);
      }
      if (newDesertTheme !== desertTheme) {
        setDesertTheme(newDesertTheme);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [timeOfDay, desertTheme]);

  const theme = `theme-${timeOfDay}`;

  return (
    <ThemeContext.Provider value={{ timeOfDay, desertTheme, theme, setTimeOfDay }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}