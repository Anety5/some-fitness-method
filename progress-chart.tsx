import { Card, CardContent } from "@/components/ui/card";

interface ProgressChartProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  color: string;
  unit?: string;
  average?: number;
  maxScale?: number;
}

export default function ProgressChart({ 
  title, 
  data, 
  color, 
  unit = "", 
  average,
  maxScale 
}: ProgressChartProps) {
  const maxValue = maxScale || Math.max(...data.map(d => d.value));
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <div className={`w-3 h-3 bg-${color}-500 rounded-full mr-2`}></div>
            <span>Data</span>
          </div>
        </div>
        
        <div className="h-48 sm:h-64 bg-gray-50 rounded-lg flex items-end justify-between p-2 sm:p-4 space-x-1 sm:space-x-2 overflow-hidden">
          {data.map((point, index) => (
            <div key={index} className="flex flex-col items-center flex-1 min-w-0">
              <div 
                className={`w-full bg-${color}-500 rounded-t min-h-[4px] transition-all duration-300 max-w-full`}
                style={{ height: `${(point.value / maxValue) * 160}px` }}
              ></div>
              <span className="text-xs text-gray-500 mt-1 sm:mt-2 truncate w-full text-center">{point.label}</span>
            </div>
          ))}
        </div>
        
        {average && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Average: <span className="font-semibold">{average.toFixed(1)} {unit}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
