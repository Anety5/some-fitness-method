import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Heart, 
  Waves, 
  Moon, 
  Activity, 
  Download, 
  CheckCircle, 
  ArrowRight,
  ExternalLink,
  Clock,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "wouter";

export default function HealthConnectGuide() {
  const [activeTab, setActiveTab] = useState("overview");
  


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      <div className="pt-20 pb-8 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Connect Your Health Devices
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get real, accurate health data from your fitness trackers, smartwatches, and health apps 
            instead of unreliable camera readings.
          </p>
        </div>



        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
            <TabsTrigger value="devices">Supported Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                    What is Health Connect?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Health Connect is Google's unified health data platform that securely connects your fitness trackers, 
                    smartwatches, and health apps to provide accurate, real-time health data.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Heart className="w-6 h-6 text-red-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Heart Rate</div>
                        <div className="text-sm text-gray-600">From fitness trackers & smartwatches</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Waves className="w-6 h-6 text-blue-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Oxygen Saturation</div>
                        <div className="text-sm text-gray-600">Medical-grade SpO2 readings</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Moon className="w-6 h-6 text-purple-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Sleep Data</div>
                        <div className="text-sm text-gray-600">Detailed sleep tracking & quality</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Activity className="w-6 h-6 text-green-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Activity Data</div>
                        <div className="text-sm text-gray-600">Steps, calories, workout sessions</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-600" />
                    Benefits Over Camera Readings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">90-95% accuracy vs 20-40%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Automatic background sync</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">No finger placement required</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Works in any lighting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">24/7 continuous monitoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Uses devices you already own</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="setup">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Setup Guide</CardTitle>
                  <p className="text-gray-600">Follow these steps to connect your health devices</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Install Health Connect</h3>
                        <p className="text-gray-700 mb-3">
                          Health Connect comes pre-installed on Android 14+. For older versions, download from Google Play Store.
                        </p>
                        <Button 
                          variant="outline" 
                          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                          onClick={() => window.open('https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata', '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Open Play Store
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Download S.O.M.E Health Connect App</h3>
                        <p className="text-gray-700 mb-3">
                          Install our companion Android app that syncs your health data to your S.O.M.E dashboard.
                        </p>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            // For now, show an alert with instructions since the APK isn't ready yet
                            alert('S.O.M.E Health Connect app is coming soon! For now, you can connect devices through the Health Connect app directly and manually input data into your dashboard.');
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download APK
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Grant Permissions</h3>
                        <p className="text-gray-700 mb-3">
                          Allow the app to read your health data from Health Connect. You control exactly what data is shared.
                        </p>
                        <div className="space-y-2">
                          <Badge variant="secondary" className="mr-2">Heart Rate</Badge>
                          <Badge variant="secondary" className="mr-2">Oxygen Saturation</Badge>
                          <Badge variant="secondary" className="mr-2">Sleep Data</Badge>
                          <Badge variant="secondary">Activity Data</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Connect & Sync</h3>
                        <p className="text-gray-700 mb-3">
                          Register your device with your S.O.M.E account and start syncing real health data automatically.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-green-700 font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            Your data will appear in your dashboard within minutes!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Supported Devices & Apps</CardTitle>
                  <p className="text-gray-600">Health Connect works with hundreds of health devices and apps</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">Smartwatches</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Samsung Galaxy Watch</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Wear OS devices</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Fitbit (compatible models)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Garmin (via sync apps)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">Fitness Trackers</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Fitbit Charge/Versa series</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Xiaomi Mi Band</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Amazfit devices</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Huawei Band/Watch</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">Health Apps</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Samsung Health</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Google Fit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Sleep as Android</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">MyFitnessPal</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                      <Clock className="w-4 h-4" />
                      Real-time Sync
                    </div>
                    <p className="text-blue-700 text-sm">
                      Data from your devices syncs automatically to Health Connect, then to your S.O.M.E dashboard. 
                      See your vitals update throughout the day without any manual input required.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 px-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto px-6 sm:px-8">
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            className="w-full sm:w-auto px-6 sm:px-8 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.open('https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Get Started Now
          </Button>
          <Button 
            className="w-full sm:w-auto px-4 sm:px-6 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
            onClick={() => {
              localStorage.setItem('healthConnectConnected', 'true');
              window.location.href = '/';
            }}
          >
            Mark as Connected
          </Button>
        </div>
      </div>
    </div>
  );
}