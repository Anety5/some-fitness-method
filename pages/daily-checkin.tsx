import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
// @ts-ignore
import WellnessCheckIn from "../../../components/WellnessCheckIn";

export default function DailyCheckIn() {
  const [, setLocation] = useLocation();

  const handleCheckInComplete = (data: any) => {
    console.log('Daily check-in completed:', data);
    
    // If this is a manual navigation request (clicking Return to S.O.M.E button)
    if (data.navigateBack) {
      setLocation('/');
      return;
    }
    
    // Track completed check-in dates for activity-based day counting
    if (data.date) {
      const checkinDates = JSON.parse(localStorage.getItem('checkinDates') || '[]');
      if (!checkinDates.includes(data.date)) {
        checkinDates.push(data.date);
        localStorage.setItem('checkinDates', JSON.stringify(checkinDates));
      }
    }
    
    // Wait 12 seconds to show encouraging message, then navigate back to dashboard
    setTimeout(() => {
      setLocation('/');
    }, 12000);
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: `url('/images/tropical-day-coast.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center',
           imageRendering: 'crisp-edges'
         }}>
      {/* Soft overlay for contrast */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/50"></div>
      <div className="relative min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-white bg-white/20 hover:bg-white/30 border-white/30 mb-4"
            onClick={() => setLocation('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <WellnessCheckIn onComplete={handleCheckInComplete} />
      </div>
      </div>
    </div>
  );
}