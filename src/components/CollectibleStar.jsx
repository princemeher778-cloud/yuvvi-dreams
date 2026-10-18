import React, { useState } from 'react';
import { useStars } from '../context/StarContext';

export const CollectibleStar = ({ id, size = 32, style = {}, hint = 'Click to collect this forgotten star' }) => {
  const { isCollected, collectStar } = useStars();
  const collected = isCollected(id);
  const [justCollected, setJustCollected] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!collected) {
      collectStar(id);
      setJustCollected(true);
      setTimeout(() => setJustCollected(false), 2000);
    }
  };

  return (
    <button
      className={`collectible-star-btn ${collected ? 'is-collected' : ''}`}
      onClick={handleClick}
      title={collected ? 'Star already safely gathered in your constellation!' : hint}
      aria-label={collected ? 'Collected forgotten star' : 'Uncollected forgotten star. Click to gather.'}
      style={{
        ...style,
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative'
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: collected
            ? 'drop-shadow(0 0 4px rgba(244, 201, 107, 0.5))'
            : 'drop-shadow(0 0 8px rgba(244, 201, 107, 0.8))',
          transform: justCollected ? 'scale(1.4) rotate(72deg)' : 'scale(1)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Glowing pulse ring for uncollected star */}
        {!collected && (
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="#F4C96B"
            strokeWidth="1.2"
            opacity="0.4"
            className="animate-twinkle"
          />
        )}
        <polygon
          points="12,2 15,9 22,9.5 17,14.5 18.5,21.5 12,17.5 5.5,21.5 7,14.5 2,9.5 9,9"
          fill={collected ? '#FFE8A3' : '#F4C96B'}
          stroke="#D4A137"
          strokeWidth="1.2"
        />
        <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" opacity={collected ? 0.9 : 1} />
      </svg>

      {/* Tiny Sparkle Indicator */}
      {!collected && (
        <span
          className="animate-twinkle"
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            fontSize: '10px',
            pointerEvents: 'none'
          }}
        >
          ✨
        </span>
      )}
    </button>
  );
};
