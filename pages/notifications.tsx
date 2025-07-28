import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bell, Smartphone, Monitor, Volume2 } from "lucide-react";
import { Link } from "wouter";
import BotanicalDecorations from "@/components/botanical-decorations";
import NotificationScheduler from "@/components/NotificationScheduler";

export default function Notifications() {
  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: `url('/images/tropical-day-coast.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center',
           imageRendering: 'auto'
         }}>
      
      {/* Clear overlay for contrast without blur */}
      <div className="absolute inset-0 bg-white/30"></div>
      
      <div className="relative min-h-screen">
        <BotanicalDecorations variant="page" elements={['fern', 'palm']} />
      
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="page-header">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/">
                <Button className="bg-white/90 hover:bg-white text-gray-900 border border-gray-300 shadow-md font-semibold">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Wellness Reminders</h1>
            <p className="text-lg text-gray-700">
              Schedule notifications to stay on track with your wellness routine
            </p>
          </div>

          <div className="space-y-6">
            {/* Notification Scheduler - Main Interface */}
            <NotificationScheduler />



            {/* Privacy & Permissions - Collapsible */}
            <details className="bg-white/90 backdrop-blur-sm border border-gray-300 shadow-lg rounded-lg">
              <summary className="p-4 cursor-pointer hover:bg-gray-50 rounded-lg font-medium text-gray-900">
                Privacy & Permissions
              </summary>
              <div className="px-4 pb-4 space-y-3">
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>Browser Permissions:</strong> We request notification permission to send you 
                    wellness reminders at your scheduled times. You can revoke this permission at any time 
                    in your browser settings.
                  </p>
                  <p>
                    <strong>Data Storage:</strong> Your reminder preferences are stored locally on your device 
                    using browser localStorage. No personal information is sent to external servers.
                  </p>
                  <p>
                    <strong>Sound Files:</strong> Notification sounds are played from local audio files within 
                    the app. No external audio services are used.
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}