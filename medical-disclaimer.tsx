import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Stethoscope } from "lucide-react";

interface MedicalDisclaimerProps {
  variant?: 'full' | 'vitals' | 'activities' | 'compact';
  className?: string;
}

export default function MedicalDisclaimer({ variant = 'full', className = '' }: MedicalDisclaimerProps) {
  if (variant === 'vitals') {
    return (
      <Card className={`bg-red-50 border-red-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-red-800">⚠️ Important Medical Safety Notice</h4>
              <div className="text-xs text-red-700 space-y-1">
                <p><strong>This app is not a medical device.</strong> All vitals measurements are for wellness tracking only and should never replace professional medical equipment or advice.</p>
                
                <div className="bg-red-100 p-2 rounded border-l-2 border-red-400 mt-2">
                  <p className="font-medium">🚨 Seek immediate medical attention if you experience:</p>
                  <ul className="mt-1 space-y-0.5 ml-4 list-disc">
                    <li>Oxygen saturation below 90%</li>
                    <li>Heart rate below 60 BPM or above 130 BPM (while at rest)</li>
                    <li>Persistent abnormal readings</li>
                    <li>Any concerning symptoms</li>
                  </ul>
                </div>

                <p className="mt-2"><strong>Before using this application:</strong> Consult your primary care physician or healthcare provider, especially if you have existing medical conditions.</p>
                
                <p><strong>Discontinue use immediately</strong> if you notice any worsening of symptoms or if readings cause concern.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'activities') {
    const isWhiteText = className?.includes('text-white');
    return (
      <Card className={`bg-orange-50 border-orange-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Stethoscope className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isWhiteText ? 'text-white' : 'text-orange-600'}`} />
            <div className="space-y-1">
              <h4 className={`text-sm font-semibold ${isWhiteText ? 'text-white' : 'text-orange-800'}`}>Medical Clearance Advisory</h4>
              <div className={`text-xs ${isWhiteText ? 'text-white/90' : 'text-orange-700'}`}>
                <p>These wellness activities are for general fitness and relaxation purposes only. They are not intended to diagnose, treat, cure, or prevent any medical condition.</p>
                <p className="mt-1"><strong>Consult your healthcare provider</strong> before beginning any new exercise or wellness program, especially if you have medical conditions, injuries, or concerns.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full disclaimer
  return (
    <Card className={`bg-blue-50 border-blue-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Stethoscope className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-800">Important Medical Disclaimer</h3>
            
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>The S.O.M.E Method Application is designed for wellness tracking and educational purposes only.</strong></p>
              
              <div className="bg-blue-100 p-3 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-medium text-blue-800 mb-2">This Application Does NOT:</h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Provide medical diagnosis, treatment, or advice</li>
                  <li>Replace professional medical equipment or consultations</li>
                  <li>Substitute for licensed healthcare provider guidance</li>
                  <li>Offer medical-grade accuracy in any measurements</li>
                </ul>
              </div>

              <p><strong>Before Using This Application:</strong> We strongly recommend obtaining medical clearance from your primary care physician or healthcare provider, particularly if you have existing medical conditions, take medications, or have concerns about your health.</p>

              <p><strong>Discontinue Use:</strong> Stop using this application immediately if you notice any worsening of symptoms, concerning vital sign readings, or if the app causes distress or anxiety.</p>

              <p className="text-xs italic mt-3">By using this application, you acknowledge that you understand these limitations and agree to consult healthcare professionals for all medical decisions and concerns.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}