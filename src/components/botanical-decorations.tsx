interface BotanicalDecorationsProps {
  variant?: 'page' | 'card' | 'section';
  elements?: ('fern' | 'hibiscus' | 'wave' | 'palm')[];
  className?: string;
}

export default function BotanicalDecorations({ 
  variant = 'page', 
  elements = ['fern', 'hibiscus'], 
  className = '' 
}: BotanicalDecorationsProps) {
  
  const getPositioning = (element: string, index: number) => {
    const positions = {
      fern: [
        { top: '10%', left: '-10px', transform: 'scale(0.7)' },
        { bottom: '20%', right: '-15px', transform: 'scale(0.5) scaleX(-1)' }
      ],
      hibiscus: [
        { top: '15%', right: '5%', transform: 'scale(0.4)' },
        { bottom: '10%', left: '3%', transform: 'scale(0.3)' }
      ],
      wave: [
        { bottom: '5%', left: '20%', transform: 'scale(0.6)' },
        { top: '70%', right: '10%', transform: 'scale(0.4) rotate(180deg)' }
      ],
      palm: [
        { top: '5%', left: '2%', transform: 'scale(0.4)' },
        { bottom: '15%', right: '5%', transform: 'scale(0.3)' }
      ]
    };
    
    const elementPositions = positions[element as keyof typeof positions];
    return elementPositions[index % elementPositions.length];
  };

  if (variant === 'card') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {elements.slice(0, 2).map((element, index) => (
          <div
            key={`${element}-${index}`}
            className={`botanical-${element}`}
            style={{
              ...getPositioning(element, index),
              position: 'absolute',
              zIndex: -1,
              opacity: 0.3
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {elements.map((element, index) => (
          <div
            key={`${element}-${index}`}
            className={`botanical-${element}`}
            style={{
              ...getPositioning(element, index),
              position: 'absolute',
              zIndex: 0,
              opacity: 0.15
            }}
          />
        ))}
      </div>
    );
  }

  // Default 'page' variant
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {elements.map((element, index) => (
        <div
          key={`${element}-${index}`}
          className={`botanical-${element}`}
          style={{
            ...getPositioning(element, index),
            position: 'fixed',
            zIndex: -1,
            opacity: 0.1
          }}
        />
      ))}
    </div>
  );
}