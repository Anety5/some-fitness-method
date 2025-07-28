import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Award, CheckCircle } from 'lucide-react';
import { useActivityLogger } from '@/hooks/useActivityLogger';

interface BadgeDownloadProps {
  onClose?: () => void;
  badgeTitle?: string;
  badgeDescription?: string;
  badgeImagePath?: string;
}

export default function BadgeDownload({ 
  onClose, 
  badgeTitle = "S.O.M.E fitness method Achievement",
  badgeDescription = "Congratulations on completing your wellness journey milestone!",
  badgeImagePath = "/badge-achievement.png"
}: BadgeDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const { logBreathingActivity } = useActivityLogger();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateBadgeImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Create specific badge based on title
    if (badgeTitle === "Relaxed to da Max") {
      generateOctopusBadge(ctx);
    } else {
      generateDefaultBadge(ctx);
    }
  };

  const generateOctopusBadge = (ctx: CanvasRenderingContext2D) => {
    // Octopus badge with teal/turquoise theme
    const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
    gradient.addColorStop(0, '#0891b2'); // Cyan center
    gradient.addColorStop(0.5, '#0f766e'); // Teal middle  
    gradient.addColorStop(1, '#115e59'); // Dark teal edge

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Draw badge circle
    ctx.beginPath();
    ctx.arc(200, 200, 150, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#06b6d4'; // Cyan border
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw inner circle with octopus theme
    ctx.beginPath();
    ctx.arc(200, 200, 120, 0, 2 * Math.PI);
    ctx.fillStyle = '#e6fffa'; // Very light teal
    ctx.fill();

    // Add octopus emoji or character
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🐙', 200, 160);

    // Add text
    ctx.fillStyle = '#0f766e';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Relaxed to da Max', 200, 200);
    
    ctx.font = '14px Arial';
    ctx.fillText('Octopus Breathing Master', 200, 220);
    
    ctx.font = 'bold 12px Arial';
    ctx.fillText('S.O.M.E FITNESS METHOD', 200, 240);

    // Add decorative wave elements around the badge
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x = 200 + Math.cos(angle) * 135;
      const y = 200 + Math.sin(angle) * 135;
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
    }
  };

  const generateDefaultBadge = (ctx: CanvasRenderingContext2D) => {
    // Default S.O.M.E badge design
    const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
    gradient.addColorStop(0, '#1e40af'); // Blue center
    gradient.addColorStop(0.5, '#0f766e'); // Teal middle
    gradient.addColorStop(1, '#1e3a8a'); // Dark blue edge

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Draw badge circle
    ctx.beginPath();
    ctx.arc(200, 200, 150, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24'; // Gold border
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw inner circle
    ctx.beginPath();
    ctx.arc(200, 200, 120, 0, 2 * Math.PI);
    ctx.fillStyle = '#f0f9ff';
    ctx.fill();

    // Add text
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('S.O.M.E', 200, 180);
    
    ctx.font = '18px Arial';
    ctx.fillText('fitness method', 200, 205);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillText('ACHIEVEMENT', 200, 235);

    // Add decorative elements
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x = 200 + Math.cos(angle) * 135;
      const y = 200 + Math.sin(angle) * 135;
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
    }
  };

  const downloadBadge = async () => {
    setIsDownloading(true);
    
    try {
      // Generate the badge
      generateBadgeImage();
      
      // Wait a moment for generation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = badgeTitle === "Relaxed to da Max" 
          ? 'relaxed-to-da-max-octopus-badge.png'
          : 'some-fitness-achievement-badge.png';
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setDownloadComplete(true);
        logBreathingActivity(1, 'Badge Download', 1);
        
        setTimeout(() => {
          setDownloadComplete(false);
          setIsDownloading(false);
        }, 2000);
      }, 'image/png');
      
    } catch (error) {
      console.error('Download error:', error);
      setIsDownloading(false);
    }
  };

  const getAnimationClasses = () => {
    if (downloadComplete) {
      return "transform scale-110 animate-pulse";
    }
    if (isDownloading) {
      return "transform scale-105 animate-bounce";
    }
    return "transform scale-100 hover:scale-105 transition-all duration-300";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-900/90 via-teal-800/80 to-blue-900/90 border-blue-400/30">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-white flex items-center justify-center gap-2">
          <Award className="w-6 h-6 text-yellow-400" />
          Achievement Badge
        </CardTitle>
        <p className="text-blue-100 text-sm">
          {badgeDescription}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Badge Preview */}
        <div className="relative flex justify-center items-center h-48">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className={`w-32 h-32 rounded-full border-4 border-yellow-400/50 ${getAnimationClasses()}`}
              style={{ display: 'none' }}
            />
            
            {/* Badge display - show sticker for octopus badge */}
            {badgeTitle === "Relaxed to da Max" ? (
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-400 ${getAnimationClasses()}`}>
                <img 
                  src="/assets/relaxed-to-da-max-sticker.png" 
                  alt="Relaxed to da Max Sticker"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div 
                className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 to-teal-200 border-4 border-yellow-400 flex items-center justify-center ${getAnimationClasses()}`}
              >
                <div className="text-center">
                  <div className="text-blue-800 font-bold text-lg">S.O.M.E</div>
                  <div className="text-blue-700 text-xs">fitness method</div>
                  <div className="text-blue-800 font-bold text-xs mt-1">ACHIEVEMENT</div>
                </div>
              </div>
            )}
            
            {/* Completion checkmark */}
            {downloadComplete && (
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Badge Title */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            {badgeTitle}
          </h3>
          {downloadComplete && (
            <div className="text-green-200 text-sm">
              Badge downloaded successfully!
            </div>
          )}
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col gap-3">
          <Button 
            onClick={downloadBadge}
            disabled={isDownloading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2 px-6 py-3 w-full"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : downloadComplete ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Digital Badge
              </>
            )}
          </Button>

          {/* Physical Sticker Downloads */}
          {badgeTitle === "Relaxed to da Max" && (
            <Button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/sticker relaxed to the Max.png';
                link.download = 'relaxed-to-da-max-sticker.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 px-6 py-3 w-full"
            >
              <Download className="w-4 h-4" />
              Download Sticker Design
            </Button>
          )}

          {/* Pufferfish Badge Sticker Download */}
          {(badgeTitle === "Pufferfish Breather" || badgeTitle === "Good Job Breathing") && (
            <Button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/good-job-blowfish.png';
                link.download = 'good-job-blowfish-sticker.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2 px-6 py-3 w-full"
            >
              <Download className="w-4 h-4" />
              Download Sticker Design
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-blue-200 text-sm">
          <p>Share your S.O.M.E fitness method achievement with friends and family!</p>
          {(badgeTitle === "Relaxed to da Max" || badgeTitle === "Pufferfish Breather") ? (
            <div className="text-xs mt-1 text-blue-300">
              <p>Digital Badge: Generated achievement certificate</p>
              <p>Sticker Design: High-quality merchandise design</p>
            </div>
          ) : (
            <p className="text-xs mt-1 text-blue-300">
              High-quality PNG image • Perfect for social media
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}