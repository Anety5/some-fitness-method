import React from 'react';

const wellnessQuotes = [
  {
    text: "A healthy outside starts from the inside.",
    author: "Robert Urich"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "Physical fitness is not only one of the most important keys to a healthy body, it is the basis of dynamic and creative intellectual activity.",
    author: "John F. Kennedy"
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt"
  },
  {
    text: "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
    author: "Buddha"
  },
  {
    text: "Health is a state of complete harmony of the body, mind and spirit.",
    author: "B.K.S. Iyengar"
  },
  {
    text: "The greatest wealth is health.",
    author: "Virgil"
  }
];

export default function QuoteCard() {
  // Get quote based on day of year for consistent daily quote
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const quote = wellnessQuotes[dayOfYear % wellnessQuotes.length];

  return (
    <div className="mb-6 rounded-xl bg-white/90 backdrop-blur p-4 shadow">
      <p className="text-sm italic text-gray-700 text-center font-medium mb-2">"{quote.text}"</p>
      <p className="text-xs text-gray-500 text-center">— {quote.author}</p>
    </div>
  );
}