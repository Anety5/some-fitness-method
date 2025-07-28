import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Moon, Apple, Activity, Leaf } from "lucide-react";
import { useLocation } from "wouter";

interface SomeMethodInfoProps {
  showDetailed?: boolean;
}

export default function SomeMethodInfo({ showDetailed = false }: SomeMethodInfoProps) {
  const [, setLocation] = useLocation();

  const methods = [
    {
      letter: "S",
      title: "Sleep",
      description: "Sleep prep with audio & techniques",
      icon: <Moon className="w-6 h-6" />,
      color: "text-black font-extrabold", 
      bgColor: "bg-gray-400 border-2 border-gray-600 shadow-lg",
      route: "/sleep-prep"
    },
    {
      letter: "O",
      title: "Oxygen", 
      description: "Breathing exercises & techniques",
      icon: <Wind className="w-6 h-6" />,
      color: "text-blue-800 font-extrabold", 
      bgColor: "bg-white border-2 border-blue-500 shadow-lg",
      route: "/breathing"
    },
    {
      letter: "M",
      title: "Move",
      description: "Mindful movement & exercises",
      icon: <Leaf className="w-6 h-6" />,
      color: "text-blue-800 font-extrabold", 
      bgColor: "bg-white border-2 border-blue-500 shadow-lg",
      route: "/activities"
    },
    {
      letter: "E",
      title: "Eat",
      description: "Nutrition recipes & healthy eating",
      icon: <Apple className="w-6 h-6" />,
      color: "text-black font-extrabold", 
      bgColor: "bg-orange-300 border-2 border-orange-500 shadow-lg",
      route: "/nutrition"
    }
  ];

  if (!showDetailed) {
    return (
      <div className="grid grid-cols-4 gap-2 mb-4">
        {methods.map((method) => (
          <div 
            key={method.letter} 
            className={`${method.bgColor} rounded-lg p-3 text-center cursor-pointer hover:scale-105 transition-transform`}
            onClick={() => setLocation(method.route)}
            style={{ 
              backgroundColor: method.letter === 'S' ? '#9CA3AF' : 
                              method.letter === 'O' ? '#FFFFFF' : 
                              method.letter === 'M' ? '#FFFFFF' : '#FED7AA',
              border: '2px solid',
              borderColor: method.letter === 'S' ? '#4B5563' : 
                          method.letter === 'O' ? '#3B82F6' : 
                          method.letter === 'M' ? '#3B82F6' : '#F97316'
            }}
          >
            <div 
              className={`text-xl drop-shadow-sm ${
                method.letter === 'O' ? 'some-letter-blue' :
                method.letter === 'M' ? 'some-letter-green' :
                'some-letter-black'
              }`}
            >
              {method.letter}
            </div>
            <div className="text-xs font-semibold mt-1" style={{ color: '#000000' }}>
              {method.title}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-center">The S.O.M.E fitness method</CardTitle>
        <p className="text-sm text-gray-600 text-center">
          A comprehensive approach to wellness tracking
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {methods.map((method) => (
            <div 
              key={method.letter} 
              className={`${method.bgColor} rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => setLocation(method.route)}
            >
              <div className="flex items-center space-x-3">
                <div className={`${method.color} w-12 h-12 rounded-full flex items-center justify-center text-xl bg-white shadow-md`}>
                  {method.letter}
                </div>
                <div>
                  <h3 className={`font-semibold ${method.color} drop-shadow-sm`}>{method.title}</h3>
                  <p className="text-sm text-black font-medium">{method.description}</p>
                </div>
              </div>
              <div className={`${method.color} mt-3 flex justify-center`}>
                {method.icon}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}