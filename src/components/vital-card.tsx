import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, Check, AlertTriangle } from "lucide-react";

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  status: string;
  statusColor: "red" | "blue" | "green" | "yellow" | "indigo";
  icon: React.ReactNode;
  isLive?: boolean;
}

export default function VitalCard({ 
  title, 
  value, 
  unit, 
  status, 
  statusColor, 
  icon,
  isLive = false 
}: VitalCardProps) {
  const statusColors = {
    red: "text-red-600 bg-red-100",
    blue: "text-blue-600 bg-blue-100", 
    green: "text-green-600 bg-green-100",
    yellow: "text-yellow-600 bg-yellow-100",
    indigo: "text-indigo-600 bg-indigo-100"
  };

  const statusIconColors = {
    red: "text-red-500",
    blue: "text-blue-500",
    green: "text-green-500", 
    yellow: "text-yellow-500",
    indigo: "text-indigo-500"
  };

  // Check for critical biometric thresholds
  const isCritical = () => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (title.toLowerCase().includes('heart') && unit === 'BPM') {
      return numValue < 60 || numValue > 130;
    }
    if (title.toLowerCase().includes('oxygen') && unit === '%') {
      return numValue < 90;
    }
    return false;
  };

  const critical = isCritical();

  return (
    <Card className={`hover:shadow-md transition-shadow ${critical ? 'border-red-500 border-2' : ''}`}>
      <CardContent className="p-6">
        {critical && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center text-red-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-xs font-medium">⚠️ Seek medical attention immediately</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusColors[statusColor]}`}>
            {icon}
          </div>
          <span className="text-sm text-gray-500">
            {isLive ? "Live" : "Last"}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <span className="text-sm text-gray-500 ml-1">{unit}</span>
          </div>
          <div className="flex items-center text-sm">
            {critical ? (
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
            ) : statusColor === "green" ? (
              <Check className={`h-4 w-4 ${statusIconColors[statusColor]} mr-1`} />
            ) : (
              <ArrowUp className={`h-4 w-4 ${statusIconColors[statusColor]} mr-1`} />
            )}
            <span className={critical ? 'text-red-500 font-medium' : statusIconColors[statusColor]}>
              {critical ? 'Critical - Seek Help' : status}
            </span>
          </div>
        </div>
        
        {critical && (
          <div className="mt-3 text-xs text-red-600">
            <p className="font-medium">This reading exceeds safe thresholds. Contact healthcare provider immediately.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
