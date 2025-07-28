import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, Target } from "lucide-react";

export default function StrengthTrainingLink() {
  return (
    <Link href="/strength-training">
      <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                <Dumbbell className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Strength Training</h3>
              <p className="text-gray-600 text-sm mb-3">
                Build strength with isometric exercises and static poses
              </p>
            </div>

            <div className="flex justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Target className="w-3 h-3 mr-1" />
                Isometric
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Timed
              </Badge>
            </div>

            <div className="text-xs text-gray-500">
              Hold static positions • Track progress • Build endurance
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}