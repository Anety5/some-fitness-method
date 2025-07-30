document.addEventListener('DOMContentLoaded', function () {
  // Simple dashboard using localStorage
  
  // Load workouts from localStorage
  let logs = JSON.parse(localStorage.getItem('workouts') || '[]');

  // ---------------- Calendar ----------------
  const calendarEl = document.getElementById('calendar');
  const events = logs.map((log, i) => ({
    title: `${log.activity} (${log.distance_km || log.distanceKm} km)`,
    date: log.date.split('T')[0],
  }));

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: events,
    height: 500
  });
  calendar.render();

  // ---------------- Charts ----------------
  const labels = logs.map(l => new Date(l.date).toLocaleDateString());

  new Chart(document.getElementById('distanceChart'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Distance (km)',
        data: logs.map(l => parseFloat(l.distance_km || l.distanceKm)),
        borderWidth: 2
      }]
    }
  });

  new Chart(document.getElementById('caloriesChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Calories Burned',
        data: logs.map(l => parseFloat(l.calories)),
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      }]
    }
  });

  new Chart(document.getElementById('elevationChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Elevation Gain (m)',
        data: logs.map(l => parseFloat(l.elevation_m || l.elevationM)),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    }
  });
});