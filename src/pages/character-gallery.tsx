import Navigation from "@/components/navigation";
import CharacterGallery from "@/components/character-gallery";
import { useState } from "react";

export default function CharacterGalleryPage() {
  const [selectedCharacter, setSelectedCharacter] = useState(() => {
    return localStorage.getItem('selectedCharacter') || 'max';
  });

  const [daysUsed, setDaysUsed] = useState(() => {
    const startDate = localStorage.getItem('appStartDate');
    if (!startDate) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('appStartDate', today);
      return 1;
    }
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  });

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
    localStorage.setItem('selectedCharacter', characterId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <CharacterGallery 
          daysUsed={daysUsed}
          onCharacterSelect={handleCharacterSelect}
          selectedCharacter={selectedCharacter}
        />
      </main>
    </div>
  );
}