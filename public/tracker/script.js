// Simple GPS tracker with Supabase integration

// Supabase configuration
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
// Note: supabase will be available from the CDN script
let supabase = null;

// Fixed request function with proper parameter handling
async function request(url, method, data) {
  try {
    const res = await fetch(url, {
      method: method, // ✅ Use the correct `method` argument passed to this function
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
    });
    return res;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

let map, routeLine, watchId;
let route = [], totalDistance = 0, totalElevation = 0;
let previousElevation = null;
let startTime;
let durationInterval;
let isAuthed = false, userId = null;

async function initMap() {
  try {
    console.log('Initializing map...');
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      throw new Error('Map element not found');
    }
    
    map = L.map('map').setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    routeLine = L.polyline([], { color: 'blue' }).addTo(map);
    console.log('Map initialized successfully');
  } catch (error) {
    console.error('Map initialization failed:', error);
    throw error;
  }
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateDuration() {
  if (startTime) {
    const elapsed = Date.now() - startTime;
    document.getElementById('duration').textContent = formatDuration(elapsed);
  }
}

function convertWeight() {
  const weightInput = document.getElementById('weight');
  const unitSelect = document.getElementById('weightUnit');
  const currentValue = parseFloat(weightInput.value);
  
  if (isNaN(currentValue)) return;
  
  if (unitSelect.value === 'kg') {
    // Converting from lbs to kg
    const kgValue = (currentValue / 2.20462).toFixed(1);
    weightInput.value = kgValue;
    weightInput.min = "30";
    weightInput.max = "200";
  } else {
    // Converting from kg to lbs  
    const lbsValue = (currentValue * 2.20462).toFixed(0);
    weightInput.value = lbsValue;
    weightInput.min = "66";
    weightInput.max = "440";
  }
}

function getWeightInKg() {
  const weight = parseFloat(document.getElementById('weight').value);
  const unit = document.getElementById('weightUnit').value;
  
  if (unit === 'lbs') {
    return weight / 2.20462; // Convert lbs to kg
  }
  return weight; // Already in kg
}

function saveToLocalStorage() {
  const weightKg = getWeightInKg();
  const workoutData = {
    activity: document.getElementById("activity").options[document.getElementById("activity").selectedIndex].text,
    MET: parseFloat(document.getElementById("activity").value),
    weight: weightKg.toFixed(1), // Store weight in kg for consistency
    weightUnit: document.getElementById("weightUnit").value, // Store original unit
    date: new Date().toISOString(),
    distanceKm: totalDistance.toFixed(2),
    elevationM: Math.round(totalElevation),
    durationMin: ((Date.now() - startTime) / 60000).toFixed(1),
    calories: (parseFloat(document.getElementById("activity").value) *
               weightKg *
               ((Date.now() - startTime) / 3600000)).toFixed(1),
    route: route
  };

  // Save to localStorage for now
  let workouts = JSON.parse(localStorage.getItem("workouts") || "[]");
  workouts.push(workoutData);
  localStorage.setItem("workouts", JSON.stringify(workouts));
  
  alert(`Activity Saved!\nDistance: ${workoutData.distanceKm} km\nElevation: ${workoutData.elevationM} m\nCalories: ${workoutData.calories} kcal`);
}

function saveToLocalStorageBackup(workoutData) {
  // Backup to localStorage if Supabase fails
  let workouts = JSON.parse(localStorage.getItem("workouts_backup") || "[]");
  workouts.push(workoutData);
  localStorage.setItem("workouts_backup", JSON.stringify(workouts));
}

function getActivityName(metValue) {
  const activities = {
    '3.5': 'Walking',
    '6.0': 'Hiking', 
    '9.8': 'Running',
    '7.5': 'Cycling'
  };
  return activities[metValue] || 'Unknown';
}

function shareHike() {
  const activity = document.getElementById("activity").options[document.getElementById("activity").selectedIndex].text;
  const weight = document.getElementById("weight").value;
  
  const shareText = `Hey! Want to join me for some ${activity.toLowerCase()}? I'm using this GPS fitness tracker to monitor our progress. We can track distance, elevation, and calories burned together!`;
  
  // Create shareable URL with invite parameter
  const shareUrl = `${window.location.origin}${window.location.pathname}?invite=${encodeURIComponent(activity)}`;
  
  // Try to use the Web Share API if available (mobile devices)
  if (navigator.share) {
    navigator.share({
      title: 'Join My Fitness Activity',
      text: shareText,
      url: shareUrl
    }).catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback: copy to clipboard and show sharing options
    const fullShareText = `${shareText}\n\nTracker: ${shareUrl}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullShareText).then(() => {
        alert('Invitation copied to clipboard! Share it with your friend via text, email, or messaging.');
      });
    } else {
      // Ultimate fallback - show share dialog
      const shareOptions = [
        `mailto:?subject=Join My Fitness Activity&body=${encodeURIComponent(fullShareText)}`,
        `sms:?body=${encodeURIComponent(fullShareText)}`,
        `https://wa.me/?text=${encodeURIComponent(fullShareText)}`
      ];
      
      const choice = prompt(`Choose sharing method:\n1. Email\n2. SMS\n3. WhatsApp\n\nEnter number (1-3):`);
      
      if (choice >= 1 && choice <= 3) {
        window.open(shareOptions[choice - 1], '_blank');
      }
    }
  }
}

function startTracking() {
  try {
    route = [];
    totalDistance = 0;
    totalElevation = 0;
    previousElevation = null;
    startTime = Date.now();
    
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;

    const weightKg = getWeightInKg();
    const MET = parseFloat(document.getElementById('activity').value);

    // Start duration timer
    durationInterval = setInterval(updateDuration, 1000);

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

  watchId = navigator.geolocation.watchPosition(pos => {
    try {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const ele = pos.coords.altitude; // Can be null if unsupported

      route.push([lat, lon]);
      if (route.length > 1) {
        const prev = route[route.length - 2];
        const dist = haversine(prev[0], prev[1], lat, lon);
        totalDistance += dist;
      }

      // Track elevation gain
      if (ele !== null) {
        if (previousElevation !== null && ele > previousElevation) {
          totalElevation += ele - previousElevation;
        }
        previousElevation = ele;
      }

      routeLine.setLatLngs(route);
      map.setView([lat, lon]);
      document.getElementById('distance').textContent = totalDistance.toFixed(2);
      document.getElementById('elevation').textContent = Math.round(totalElevation);

      const durationMinutes = (Date.now() - startTime) / 60000;
      const calories = MET * weightKg * (durationMinutes / 60);
      document.getElementById('calories').textContent = calories.toFixed(1);
    } catch (error) {
      console.error('Error in GPS position callback:', error);
    }
  }, err => {
    console.error("GPS error:", err);
    alert("GPS error: " + err.message);
  }, { enableHighAccuracy: true });
  } catch (error) {
    console.error('Error starting tracking:', error);
    alert('Error starting tracking: ' + error.message);
  }
}

function stopTracking() {
  navigator.geolocation.clearWatch(watchId);
  clearInterval(durationInterval);
  
  document.getElementById('startBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;
  
  const weightKg = getWeightInKg();
  const MET = parseFloat(document.getElementById('activity').value);
  const duration = Date.now() - startTime;
  const durationMinutes = duration / 60000;
  const calories = MET * weightKg * (durationMinutes / 60);

  // Save workout to localStorage
  saveToLocalStorage();
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', async function() {
  try {
    console.log('Starting GPS Tracker initialization...');
    
    // Initialize Supabase client when available
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase client initialized');
      } catch (supabaseError) {
        console.warn('Supabase initialization failed, continuing in demo mode:', supabaseError);
      }
    } else {
      console.log('Running in demo mode without Supabase - using localStorage only');
    }
    
    // Initialize the map
    await initMap();
    
    // Add event listeners
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    if (startBtn && stopBtn) {
      startBtn.addEventListener('click', startTracking);
      stopBtn.addEventListener('click', stopTracking);
      console.log('Event listeners attached successfully');
    } else {
      throw new Error('Start or Stop button not found in DOM');
    }
    
    console.log('GPS Tracker initialized successfully');
  } catch (error) {
    console.error('Error initializing GPS tracker:', {
      error: error,
      message: error.message,
      stack: error.stack
    });
    // Don't alert in case of initialization errors, just log them
  }
});