import BlowfishBreathing from '../components/BlowfishBreathing';

export default function BreathingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <BlowfishBreathing 
          size="large"
          breathingPattern="4-4"
          autoPlay={true}
          showInstructions={true}
          imagePath="/blowfish-puffed-royalty-free.svg"
          enableAudio={true}
          audioVolume={0.3}
        />
      </div>
    </div>
  );
}