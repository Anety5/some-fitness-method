import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import AboutSOME from "@/components/AboutSOME";
import BotanicalDecorations from "@/components/botanical-decorations";

export default function AboutSOMEPage() {
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
        <BotanicalDecorations variant="page" elements={['wave']} />
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="page-header">
              <div className="flex items-center gap-4 mb-4">
                <Link href="/">
                  <Button className="wellness-btn-primary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* About S.O.M.E. Content */}
            <div className="wellness-section">
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <AboutSOME />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}