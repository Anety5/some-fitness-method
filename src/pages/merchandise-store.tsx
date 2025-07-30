import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MerchandiseStore from '@/components/MerchandiseStore';
import BotanicalDecorations from '@/components/botanical-decorations';

export default function MerchandiseStorePage() {
  const handlePurchase = (itemId: string, quantity: number) => {
    // Integration with Stripe or payment processor
    console.log(`Purchasing ${quantity} of item ${itemId}`);
    
    // For now, simulate purchase completion
    alert(`Thank you for your purchase! ${quantity} item(s) will be shipped to you soon.`);
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: `url('/images/tropical-day-coast.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center',
           imageRendering: 'auto'
         }}>
      {/* Clear overlay for contrast */}
      <div className="absolute inset-0 bg-white/30"></div>
      <div className="relative min-h-screen">
        <BotanicalDecorations variant="page" elements={['fern', 'palm']} />
        
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="page-header">
              <div className="flex items-center gap-4 mb-6">
                <Link href="/">
                  <Button className="bg-white/90 hover:bg-white text-gray-900 border border-gray-300 shadow-md font-semibold">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            <MerchandiseStore onPurchase={handlePurchase} />
          </div>
        </section>
      </div>
    </div>
  );
}