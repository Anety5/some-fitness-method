import { Route, Switch } from "wouter";
import Dashboard from "./pages/dashboard";
import BreathingPage from "./pages/breathing";
import GPSTracker from "./pages/gps-tracker";
import HikeTrackerPage from "./pages/hike-tracker";
import MorningRoutine from "./pages/morning-routine";
import Nutrition from "./pages/nutrition";
import Profile from "./pages/profile";
import Resources from "./pages/resources";
import SleepPrep from "./pages/sleep-prep";
import DailyCheckIn from "./pages/daily-checkin";
import ExerciseLibraryPage from "./pages/exercise-library";

import HealthConnectGuide from "./pages/health-connect-guide";
import Notifications from "./pages/notifications";
import Progress from "./pages/progress";
import BottomNav from "./components/BottomNav";
import { ThemeProvider } from "./hooks/use-theme";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload App
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <div className="min-h-screen" style={{
            backgroundImage: `url('/attached_assets/Tropical Sunset Over Mountain Island_1752440245041.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}>
            <div className="min-h-screen bg-black/20">
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/breathing" component={BreathingPage} />
                <Route path="/gps-tracker" component={GPSTracker} />
                <Route path="/hike-tracker" component={HikeTrackerPage} />
                <Route path="/morning-routine" component={MorningRoutine} />
                <Route path="/nutrition" component={Nutrition} />
                <Route path="/profile" component={Profile} />
                <Route path="/resources" component={Resources} />
                <Route path="/sleep-prep" component={SleepPrep} />
                <Route path="/daily-checkin" component={DailyCheckIn} />
                <Route path="/exercise-library" component={ExerciseLibraryPage} />

                <Route path="/health-connect-guide" component={HealthConnectGuide} />
                <Route path="/notifications" component={Notifications} />
                <Route path="/progress" component={Progress} />
              </Switch>
              <BottomNav />
            </div>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}