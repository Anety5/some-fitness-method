import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ErrorBoundary } from "react-error-boundary";

// Simple components for initial deployment
function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white/95 p-8 rounded-2xl shadow-xl text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">S.O.M.E fitness method</h1>
        <div className="flex justify-center space-x-4 mb-6">
          <div className="bg-slate-100 px-4 py-2 rounded-lg">
            <span className="text-2xl">😴</span>
            <div className="text-sm font-semibold">Sleep</div>
          </div>
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <span className="text-2xl">🫁</span>
            <div className="text-sm font-semibold">Oxygen</div>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-lg">
            <span className="text-2xl">🏃</span>
            <div className="text-sm font-semibold">Move</div>
          </div>
          <div className="bg-orange-100 px-4 py-2 rounded-lg">
            <span className="text-2xl">🍎</span>
            <div className="text-sm font-semibold">Eat</div>
          </div>
        </div>
        <p className="text-lg text-gray-600 mb-4">Your complete wellness tracking platform</p>
        <p className="text-sm text-gray-500">Track sleep quality, breathing exercises, movement activities, and nutrition habits</p>
        <div className="mt-8 space-y-2">
          <div className="text-xs text-gray-400">✓ GPS hiking and outdoor activity tracking</div>
          <div className="text-xs text-gray-400">✓ Guided breathing exercises and meditation</div>
          <div className="text-xs text-gray-400">✓ Character progression and motivation system</div>
          <div className="text-xs text-gray-400">✓ Comprehensive nutrition and recipe database</div>
        </div>
        <div className="mt-6 text-xs text-gray-500">
          Ready for Google Play Store deployment
        </div>
      </div>
    </div>
  );
}

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
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route>
            <Dashboard />
          </Route>
        </Switch>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
