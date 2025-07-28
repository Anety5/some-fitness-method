import React from 'react';
import { Link } from 'wouter';
import { Moon, Wind, PersonStanding, Apple } from 'lucide-react';

interface Props {
  label: string;
  color: string; // Tailwind background class like 'bg-purple-200'
  icon: 'sleep' | 'oxygen' | 'move' | 'eat';
  route: string; // Navigation route
}

const iconMap = {
  sleep: Moon,
  oxygen: Wind,
  move: PersonStanding,
  eat: Apple,
};

export default function SomeButton({ label, color, icon, route }: Props) {
  const IconComponent = iconMap[icon];
  
  return (
    <Link to={route}>
      <button
        className={`flex flex-col items-center justify-center h-28 rounded-2xl ${color} shadow-md hover:scale-105 transition-transform duration-200 w-full`}
      >
        <IconComponent className="w-8 h-8 text-gray-700" />
        <span className="mt-2 font-semibold text-gray-800">{label}</span>
      </button>
    </Link>
  );
}