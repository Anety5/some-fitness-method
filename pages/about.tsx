import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, ArrowLeft, MapPin, Clock, Shield } from "lucide-react";
import { Link } from "wouter";
import BotanicalDecorations from "@/components/botanical-decorations";

export default function About() {
  return (
    <div className="min-h-screen tropical-day-background relative">
      <BotanicalDecorations variant="page" elements={['fern', 'palm']} />
      
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="page-header">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/resources">
                <Button className="wellness-btn-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Resources
                </Button>
              </Link>
            </div>
            <h1 className="page-title">Contact Us</h1>
            <p className="page-subtitle">
              Contact form - questions or comments welcome
            </p>
          </div>

          <div className="space-y-6">


            {/* Contact & Support */}
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Contact & Support</h2>
                    <p className="text-gray-700 text-sm">
                      Questions about the S.O.M.E Method or need support? We're here to help.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      General Support
                    </h3>
                    <p className="text-gray-900 mb-2">
                      <a href="mailto:somefitnessapp@gmail.com" className="text-blue-600 underline hover:text-blue-800">
                        somefitnessapp@gmail.com
                      </a>
                    </p>
                    <p className="text-gray-700 text-sm">
                      App features, technical issues, or account help
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-green-600" />
                      Wellness Guidance
                    </h3>
                    <p className="text-gray-900 mb-2">
                      <a href="mailto:somefitnessapp@gmail.com" className="text-green-600 underline hover:text-green-800">
                        somefitnessapp@gmail.com
                      </a>
                    </p>
                    <p className="text-gray-700 text-sm">
                      Exercise modifications, wellness coaching, and method questions
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    Response Times
                  </h3>
                  <ul className="text-gray-800 text-sm space-y-2">
                    <li>• <strong>Technical Support:</strong> Within 24 hours on weekdays</li>
                    <li>• <strong>Wellness Questions:</strong> Within 48 hours</li>
                    <li>• <strong>Urgent Health Concerns:</strong> Please contact your healthcare provider</li>
                  </ul>
                </div>



                <div className="text-center border-t border-gray-300 pt-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <p className="text-gray-800 text-sm font-medium">
                      Based in Hawaii • Created by a Physical Therapist
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <p className="text-gray-700 text-sm">
                      The S.O.M.E Method is for wellness tracking only and does not replace professional medical advice
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}