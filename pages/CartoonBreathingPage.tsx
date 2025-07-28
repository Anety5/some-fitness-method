import FloatingBlowfish from '../components/FloatingBlowfish';

export default function CartoonBreathingPage() {
  return (
    <div style={{ '--breathing-duration': '6s' } as React.CSSProperties}>
      <FloatingBlowfish 
        imageStyle="cartoon" 
        breathingDuration={6000} 
      />
    </div>
  );
}