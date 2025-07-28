import React from 'react';
import './GoodJobBadge.css';

interface GoodJobBadgeProps {
  onClose: () => void;
  message?: string;
  stickerType?: 'octopus' | 'pufferfish';
}

export default function GoodJobBadge({ onClose, message = "Great job completing your breathing session!", stickerType = 'pufferfish' }: GoodJobBadgeProps) {
  return (
    <div className="badge-overlay">
      <div className="badge-popup">
        <img 
          src={stickerType === 'octopus' ? '/sticker relaxed to the Max.png' : '/good-job-blowfish.png'} 
          alt={stickerType === 'octopus' ? 'Relaxed to the Max!' : 'Good Job!'} 
          className="w-32 h-32 mx-auto mb-4"
        />
        <p>{message}</p>
        <a
          href={stickerType === 'octopus' ? '/sticker relaxed to the Max.png' : '/good-job-blowfish.png'}
          download={stickerType === 'octopus' ? 'relaxed-to-da-max-sticker.png' : 'good-job-blowfish-sticker.png'}
          className="download-link"
        >
          🎁 Download Your Sticker
        </a>
        <button onClick={onClose}>Continue</button>
      </div>
    </div>
  );
}