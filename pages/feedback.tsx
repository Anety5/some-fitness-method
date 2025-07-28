import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, MessageSquare, Star, Eye, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Feedback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState({
    overall: '',
    liked: '',
    disliked: '',
    legibility: '',
    mobile: '',
    suggestions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Submit feedback to database
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          overallRating: parseInt(feedback.overall),
          liked: feedback.liked,
          disliked: feedback.disliked,
          legibility: feedback.legibility,
          mobile: feedback.mobile,
          suggestions: feedback.suggestions,
        }),
      });

      if (response.ok) {
        toast({
          title: "Feedback Submitted!",
          description: "Thank you for your feedback. It has been saved successfully.",
        });
        
        // Reset form
        setFeedback({
          overall: '',
          liked: '',
          disliked: '',
          legibility: '',
          mobile: '',
          suggestions: ''
        });
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen tropical-day-background relative">
      <div className="min-h-screen bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="text-white hover:bg-white/20 border border-white/30"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2 text-white">
              <MessageSquare className="w-6 h-6" />
              <h1 className="text-2xl font-playfair font-bold">App Feedback</h1>
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5" />
                Help Us Improve the S.O.M.E Method App
              </CardTitle>
              <p className="text-white/80 text-sm">
                Your feedback is valuable! Please share your experience testing this wellness app.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Overall Rating */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Overall Experience (1-5 stars)</Label>
                  <RadioGroup 
                    value={feedback.overall} 
                    onValueChange={(value) => setFeedback(prev => ({ ...prev, overall: value }))}
                    className="flex gap-4"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                        <Label htmlFor={`rating-${rating}`} className="text-white cursor-pointer">
                          {rating} ⭐
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* What they liked */}
                <div className="space-y-2">
                  <Label htmlFor="liked" className="text-white font-medium">
                    What did you like about the app?
                  </Label>
                  <Textarea
                    id="liked"
                    value={feedback.liked}
                    onChange={(e) => setFeedback(prev => ({ ...prev, liked: e.target.value }))}
                    placeholder="Features, design, ease of use, specific sections..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    rows={3}
                  />
                </div>

                {/* What they didn't like */}
                <div className="space-y-2">
                  <Label htmlFor="disliked" className="text-white font-medium">
                    What didn't you like or found confusing?
                  </Label>
                  <Textarea
                    id="disliked"
                    value={feedback.disliked}
                    onChange={(e) => setFeedback(prev => ({ ...prev, disliked: e.target.value }))}
                    placeholder="Issues, confusing parts, things that didn't work..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    rows={3}
                  />
                </div>

                {/* Text Legibility */}
                <div className="space-y-3">
                  <Label className="text-white font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    How was the text readability?
                  </Label>
                  <RadioGroup 
                    value={feedback.legibility} 
                    onValueChange={(value) => setFeedback(prev => ({ ...prev, legibility: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="legibility-excellent" />
                      <Label htmlFor="legibility-excellent" className="text-white cursor-pointer">
                        Excellent - Easy to read everywhere
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="legibility-good" />
                      <Label htmlFor="legibility-good" className="text-white cursor-pointer">
                        Good - Mostly readable
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fair" id="legibility-fair" />
                      <Label htmlFor="legibility-fair" className="text-white cursor-pointer">
                        Fair - Some sections hard to read
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poor" id="legibility-poor" />
                      <Label htmlFor="legibility-poor" className="text-white cursor-pointer">
                        Poor - Text was difficult to see
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Mobile Experience */}
                <div className="space-y-3">
                  <Label className="text-white font-medium flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    How was the mobile experience? (if tested on phone)
                  </Label>
                  <RadioGroup 
                    value={feedback.mobile} 
                    onValueChange={(value) => setFeedback(prev => ({ ...prev, mobile: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="great" id="mobile-great" />
                      <Label htmlFor="mobile-great" className="text-white cursor-pointer">
                        Great - Worked perfectly on mobile
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="okay" id="mobile-okay" />
                      <Label htmlFor="mobile-okay" className="text-white cursor-pointer">
                        Okay - Usable but some issues
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="difficult" id="mobile-difficult" />
                      <Label htmlFor="mobile-difficult" className="text-white cursor-pointer">
                        Difficult - Hard to use on mobile
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-tested" id="mobile-not-tested" />
                      <Label htmlFor="mobile-not-tested" className="text-white cursor-pointer">
                        Didn't test on mobile
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Suggestions */}
                <div className="space-y-2">
                  <Label htmlFor="suggestions" className="text-white font-medium">
                    Suggestions or additional comments
                  </Label>
                  <Textarea
                    id="suggestions"
                    value={feedback.suggestions}
                    onChange={(e) => setFeedback(prev => ({ ...prev, suggestions: e.target.value }))}
                    placeholder="Ideas for improvement, bugs you found, features you'd like to see..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Submit Feedback
                </Button>
              </form>

              <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/20">
                <p className="text-blue-200 text-sm">
                  💡 <strong>Note:</strong> Your feedback is saved automatically. You can also email us directly at <a href="mailto:somefitnessapp@gmail.com" className="text-blue-100 underline hover:text-white"><strong>somefitnessapp@gmail.com</strong></a> for immediate support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}