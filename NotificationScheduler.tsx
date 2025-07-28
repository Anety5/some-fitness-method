import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Clock, Volume2, Trash2, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduledReminder {
  id: string;
  time: string;
  sound: string;
  enabled: boolean;
  activityType: string;
  created: number;
}

const SOOTHING_SOUNDS = [
  { id: 'bell-meditation', name: 'Bell Meditation', file: '/audio/notification/bell-meditation-75335.mp3' },
  { id: 'tibetan-bell-ding', name: 'Bright Tibetan Bell Ding', file: '/audio/notification/047130_bright-tibetan-bell-ding-b-note-72289.mp3' },
  { id: 'tibetan-singing-bowl', name: 'Tibetan Singing Bowl', file: '/audio/notification/e-flat-tibetan-singing-bowl-struck-38746.mp3' },
  { id: 'classical-stretching', name: 'Classical (Stretching/Walk)', file: '/audio/notification/mixkit-classical-1-708.mp3' }
];

const ACTIVITY_TYPES = [
  'Morning Stretches',
  'Breathing Exercise',
  'Mindful Break',
  'Movement Practice',
  'Sleep Preparation',
  'Wellness Check-in'
];

const formatTimeTo12Hour = (time24: string) => {
  const [hour, minute] = time24.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
};

export default function NotificationScheduler() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);

  const [newTime, setNewTime] = useState('09:00');
  const [newSound, setNewSound] = useState('bell-meditation');
  const [newActivityType, setNewActivityType] = useState('Morning Stretches');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [browserSupported, setBrowserSupported] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    setBrowserSupported('Notification' in window);
    
    // Load existing reminders
    loadReminders();
    
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Register service worker for notifications
    if ('serviceWorker' in navigator && browserSupported) {
      registerServiceWorker();
    }
  }, []);

  const loadReminders = () => {
    try {
      const stored = localStorage.getItem('wellnessReminders');
      if (stored) {
        const parsed = JSON.parse(stored);
        setReminders(parsed);
        // Reschedule active reminders if notifications are supported
        if (browserSupported && Notification.permission === 'granted') {
          parsed.forEach((reminder: ScheduledReminder) => {
            if (reminder.enabled) {
              scheduleNotification(reminder);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const saveReminders = (updatedReminders: ScheduledReminder[]) => {
    try {
      localStorage.setItem('wellnessReminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
    } catch (error) {
      console.error('Error saving reminders:', error);
      toast({
        title: "Storage Error",
        description: "Could not save reminder. Please try again.",
        variant: "destructive"
      });
    }
  };

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/notification-worker.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if (!browserSupported) {
      toast({
        title: "Alternative Reminder Options",
        description: "Browser notifications aren't available, but you can still schedule reminders and check them manually.",
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive wellness reminders at your scheduled times.",
        });
        return true;
      } else {
        toast({
          title: "Manual Reminders Available",
          description: "You can still create reminders and check them manually. Consider enabling notifications in browser settings for automatic alerts.",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Alternative Options Available",
        description: "Browser notifications may not be available, but you can still use manual reminders.",
      });
      return false;
    }
  };

  const scheduleNotification = (reminder: ScheduledReminder) => {
    if (!browserSupported || notificationPermission !== 'granted') return;
    
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    // If the time has passed today, schedule for tomorrow
    if (scheduledTime < now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      showNotification(reminder);
      // Reschedule for next day
      setTimeout(() => scheduleNotification(reminder), 24 * 60 * 60 * 1000);
    }, timeUntilNotification);
  };

  const showNotification = (reminder: ScheduledReminder) => {
    if (!browserSupported || notificationPermission !== 'granted') return;

    // Play notification sound
    playNotificationSound(reminder.sound);

    // Show browser notification
    const notification = new Notification(`Time for ${reminder.activityType}!`, {
      body: `Your ${reminder.activityType.toLowerCase()} reminder`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: reminder.id,
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      // Navigate to appropriate page based on activity type
      const activityRoutes: Record<string, string> = {
        'Morning Stretches': '/morning-routine',
        'Breathing Exercise': '/breathing',
        'Mindful Break': '/breathing',
        'Movement Practice': '/morning-routine',
        'Sleep Preparation': '/sleep-prep',
        'Wellness Check-in': '/daily-checkin'
      };
      
      const route = activityRoutes[reminder.activityType] || '/dashboard';
      window.location.href = route;
      notification.close();
    };
  };

  const playNotificationSound = (soundId: string) => {
    try {
      const sound = SOOTHING_SOUNDS.find(s => s.id === soundId);
      if (sound) {
        const audio = new Audio(sound.file);
        audio.volume = 0.5;
        audio.loop = false; // Prevent looping
        audio.preload = 'auto';
        
        // Stop notification sound after 2 seconds
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 2000);
        
        // Add user interaction check for mobile
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Audio played successfully
            })
            .catch(error => {
              console.log('Audio play failed:', error);
            });
        }
      }
    } catch (error) {
      console.log('Sound play error:', error);
    }
  };

  const playPreviewSound = (soundId: string) => {
    const sound = SOOTHING_SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    // Create audio element and try to play
    const audio = new Audio(sound.file);
    audio.volume = 0.5;
    audio.loop = false; // Prevent looping
    
    // Stop audio after 3 seconds for preview
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 3000);
    
    // Attempt to play immediately (works if user has interacted)
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Audio played successfully
          toast({
            title: "Sound Preview",
            description: `Playing ${sound.name} (3 second preview)`,
            duration: 2000,
          });
        })
        .catch(error => {
          // Fallback for mobile - show helpful message
          toast({
            title: "Audio Preview",
            description: `Tap the play button to hear ${sound.name} sound`,
            duration: 3000,
          });
          console.log('Audio play failed, user interaction may be required:', error);
        });
    }
  };

  const addReminder = () => {
    if (!newTime || newTime === '') {
      toast({
        title: "Missing Information",
        description: "Please select a time for your reminder.",
        variant: "destructive"
      });
      return;
    }

    const newReminder: ScheduledReminder = {
      id: Date.now().toString(),
      time: newTime,
      sound: newSound,
      enabled: true,
      activityType: newActivityType,
      created: Date.now()
    };

    const updatedReminders = [...reminders, newReminder];
    saveReminders(updatedReminders);

    // Schedule the notification if permissions are granted
    if (browserSupported && notificationPermission === 'granted') {
      scheduleNotification(newReminder);
    }

    // Reset form
    setNewTime('09:00');
    setNewSound('bell-meditation');
    setNewActivityType('Morning Stretches');

    toast({
      title: "Reminder Added",
      description: `${newActivityType} scheduled for ${formatTimeTo12Hour(newTime)}`,
    });
  };

  const toggleReminder = (id: string) => {
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    );
    saveReminders(updatedReminders);

    const toggledReminder = updatedReminders.find(r => r.id === id);
    if (toggledReminder?.enabled && browserSupported && notificationPermission === 'granted') {
      scheduleNotification(toggledReminder);
    }
  };

  const deleteReminder = (id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    saveReminders(updatedReminders);
    
    toast({
      title: "Reminder Deleted",
      description: "The reminder has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      

      {/* Add New Reminder */}
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-300 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Clock className="w-5 h-5" />
            Schedule New Reminder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reminder-activity" className="text-gray-900 font-semibold">Activity Type</Label>
              <Select value={newActivityType} onValueChange={setNewActivityType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((activity) => (
                    <SelectItem key={activity} value={activity}>
                      {activity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reminder-time" className="text-gray-900 font-semibold">Time</Label>
              <div className="flex gap-2 mt-1">
                <Select 
                  value={newTime.split(':')[0] || '09'} 
                  onValueChange={(hour) => {
                    const minute = newTime.split(':')[1] || '00';
                    setNewTime(`${hour}:${minute}`);
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      const displayHour = i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`;
                      return (
                        <SelectItem key={hour} value={hour}>
                          {displayHour}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Select 
                  value={newTime.split(':')[1] || '00'} 
                  onValueChange={(minute) => {
                    const hour = newTime.split(':')[0] || '09';
                    setNewTime(`${hour}:${minute}`);
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {['00', '15', '30', '45'].map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        :{minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="notification-sound" className="text-gray-900 font-semibold">Notification Sound</Label>
              <div className="flex gap-2 mt-1">
                <Select value={newSound} onValueChange={setNewSound}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOOTHING_SOUNDS.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id}>
                        {sound.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => playPreviewSound(newSound)}
                  className="px-3"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={addReminder} className="flex-1">
              Add Reminder
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Reminders */}
      {reminders.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-300 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Volume2 className="w-5 h-5" />
              Your Reminders ({reminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{reminder.activityType}</p>
                        <p className="text-sm text-gray-600">
                          {formatTimeTo12Hour(reminder.time)} • {SOOTHING_SOUNDS.find(s => s.id === reminder.sound)?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => playPreviewSound(reminder.sound)}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}