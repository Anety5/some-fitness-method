// Service Worker for handling push notifications and background scheduling

const CACHE_NAME = 'wellness-notifications-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Notification Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Notification Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'snooze') {
    // Schedule snooze notification (10 minutes)
    setTimeout(() => {
      self.registration.showNotification('Wellness Reminder (Snoozed)', {
        body: event.notification.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: event.notification.tag + '-snooze',
        requireInteraction: true
      });
    }, 10 * 60 * 1000); // 10 minutes
    return;
  }

  // Default action or 'open' action
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window is open, open a new one
      if (clients.openWindow) {
        const targetUrl = determineTargetUrl(event.notification.data?.activityType);
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});

// Handle push events (for future server-sent notifications)
self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  let notificationData = {
    title: 'Wellness Reminder',
    body: 'Time for your scheduled wellness activity!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'wellness-reminder',
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Start Now' },
      { action: 'snooze', title: 'Remind in 10 min' }
    ]
  };

  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Determine target URL based on activity type
function determineTargetUrl(activityType) {
  const baseUrl = self.location.origin;
  
  const activityRoutes = {
    'Morning Stretches': '/morning-routine',
    'Breathing Exercise': '/breathing',
    'Mindful Break': '/breathing',
    'Movement Practice': '/morning-routine',
    'Sleep Preparation': '/sleep-prep',
    'Wellness Check-in': '/daily-checkin'
  };

  return baseUrl + (activityRoutes[activityType] || '/dashboard');
}

// Handle sync events (for future offline support)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event);
  
  if (event.tag === 'wellness-reminder-sync') {
    event.waitUntil(syncWellnessReminders());
  }
});

async function syncWellnessReminders() {
  try {
    // Future: Sync with server for cross-device reminders
    console.log('Syncing wellness reminders...');
  } catch (error) {
    console.error('Error syncing reminders:', error);
  }
}

// Periodic background sync for wellness reminders
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'wellness-check') {
    event.waitUntil(checkScheduledReminders());
  }
});

async function checkScheduledReminders() {
  try {
    // Check if any reminders should fire
    // This is a fallback for setTimeout-based scheduling
    console.log('Checking scheduled reminders...');
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}