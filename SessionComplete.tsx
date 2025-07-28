import { useState } from 'react';
import GoodJobBadge from './GoodJobBadge';

export default function SessionComplete() {
  const [showBadge, setShowBadge] = useState(false);

  const handleSessionEnd = () => {
    // logic for finishing session
    setShowBadge(true);
  };

  return (
    <>
      <button onClick={handleSessionEnd}>Finish Breathing</button>
      {showBadge && <GoodJobBadge onClose={() => setShowBadge(false)} />}
    </>
  );
}