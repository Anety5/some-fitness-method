// Simple workout viewer using localStorage

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function displayLogs() {
  const container = document.getElementById('logs');
  
  // Load workouts from localStorage
  const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
  displayWorkouts(workouts, container, false);
}

function displayWorkouts(workouts, container, isOffline) {
  if (workouts.length === 0) {
    container.innerHTML = '<p>No workout logs found.</p>';
    return;
  }

  // Sort workouts by date (newest first)
  workouts.sort((a, b) => new Date(b.date) - new Date(a.date));

  let html = isOffline ? '<p style="color: orange; font-weight: bold;">Offline Mode - Showing locally saved workouts</p>' : '';
  
  workouts.forEach((workout, index) => {
    html += `
      <div style="border: 1px solid #ccc; margin: 10px 0; padding: 15px; border-radius: 5px;">
        <h3>${workout.activity}</h3>
        <p><strong>Date:</strong> ${formatDate(workout.date)}</p>
        <p><strong>Distance:</strong> ${workout.distance_km || workout.distanceKm} km</p>
        <p><strong>Duration:</strong> ${workout.duration_min || workout.durationMin} minutes</p>
        <p><strong>Elevation Gain:</strong> ${workout.elevation_m || workout.elevationM} m</p>
        <p><strong>Calories Burned:</strong> ${workout.calories} kcal</p>
        <p><strong>MET Value:</strong> ${workout.met || workout.MET}</p>
        <p><strong>Weight:</strong> ${workout.weight} kg</p>
        <button onclick="deleteLog('${workout.id || index}', ${isOffline})" style="background: red; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function deleteLog(index) {
  if (!confirm('Delete this workout log?')) {
    return;
  }

  const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
  if (index >= 0 && index < workouts.length) {
    workouts.splice(index, 1);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    displayLogs();
  }
}

function exportJSON() {
  const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
  if (workouts.length === 0) {
    alert('No data to export');
    return;
  }
  exportData(workouts);
}

function exportData(workouts) {
  const dataStr = JSON.stringify(workouts, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `workout-logs-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function clearLogs() {
  if (confirm('Are you sure you want to delete all workout logs? This cannot be undone.')) {
    localStorage.removeItem('workouts');
    displayLogs();
  }
}

let currentChart = null;
let currentCalendar = null;

function showView(viewName) {
  // Hide all views
  document.getElementById('logsView').style.display = 'none';
  document.getElementById('chartView').style.display = 'none';
  document.getElementById('calendarView').style.display = 'none';
  
  // Remove active class from all tabs
  document.querySelectorAll('button[id$="Tab"]').forEach(tab => {
    tab.style.backgroundColor = '#f0f0f0';
    tab.style.color = '#333';
  });
  
  // Show selected view and highlight tab
  if (viewName === 'logs') {
    document.getElementById('logsView').style.display = 'block';
    document.getElementById('logsTab').style.backgroundColor = '#3182ce';
    document.getElementById('logsTab').style.color = 'white';
  } else if (viewName === 'chart') {
    document.getElementById('chartView').style.display = 'block';
    document.getElementById('chartTab').style.backgroundColor = '#3182ce';
    document.getElementById('chartTab').style.color = 'white';
    showAnalytics();
  } else if (viewName === 'calendar') {
    document.getElementById('calendarView').style.display = 'block';
    document.getElementById('calendarTab').style.backgroundColor = '#3182ce';
    document.getElementById('calendarTab').style.color = 'white';
    showCalendar();
  }
}

function showAnalytics() {
  const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
  
  if (workouts.length === 0) {
    document.getElementById('chartView').innerHTML = '<p>No workout data to display.</p>';
    return;
  }

  // Prepare data for chart
  const activityData = {};
  const caloriesData = [];
  const distanceData = [];
  const labels = [];

  workouts.forEach(workout => {
    // Count activities
    activityData[workout.activity] = (activityData[workout.activity] || 0) + 1;
    
    // Track calories and distance over time
    caloriesData.push(parseFloat(workout.calories));
    distanceData.push(parseFloat(workout.distanceKm));
    labels.push(new Date(workout.date).toLocaleDateString());
  });

  if (currentChart) {
    currentChart.destroy();
  }

  const ctx = document.getElementById('workoutChart').getContext('2d');
  currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(activityData),
      datasets: [{
        label: 'Number of Workouts',
        data: Object.values(activityData),
        backgroundColor: ['#38a169', '#3182ce', '#e53e3e', '#805ad5'],
        borderColor: ['#2f855a', '#2c5282', '#c53030', '#6b46c1'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function showCalendar() {
  const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
  
  if (currentCalendar) {
    currentCalendar.destroy();
  }

  // Convert workouts to calendar events
  const events = workouts.map(workout => ({
    title: `${workout.activity} - ${workout.distanceKm}km`,
    start: workout.date.split('T')[0], // Use just the date part
    backgroundColor: getActivityColor(workout.activity),
    extendedProps: {
      distance: workout.distanceKm,
      duration: workout.durationMin,
      calories: workout.calories,
      elevation: workout.elevationM
    }
  }));

  currentCalendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    initialView: 'dayGridMonth',
    height: 'auto',
    events: events,
    eventClick: function(info) {
      const props = info.event.extendedProps;
      alert(`${info.event.title}\nDuration: ${props.duration} min\nCalories: ${props.calories} kcal\nElevation: ${props.elevation} m`);
    }
  });

  currentCalendar.render();
}

function getActivityColor(activity) {
  const colors = {
    'Walking': '#38a169',
    'Hiking': '#3182ce', 
    'Running': '#e53e3e',
    'Cycling': '#805ad5'
  };
  return colors[activity] || '#718096';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  displayLogs();
  
  // Style the tab buttons
  document.querySelectorAll('button[id$="Tab"]').forEach(tab => {
    tab.style.padding = '10px 20px';
    tab.style.margin = '0 5px';
    tab.style.border = 'none';
    tab.style.borderRadius = '5px';
    tab.style.cursor = 'pointer';
    tab.style.backgroundColor = '#f0f0f0';
    tab.style.color = '#333';
  });
  
  // Set initial active tab
  document.getElementById('logsTab').style.backgroundColor = '#3182ce';
  document.getElementById('logsTab').style.color = 'white';
  
  // Load logs on page load
  displayLogs();
});