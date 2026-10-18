import React from 'react';
import { useStars } from '../context/StarContext';
import { Star, X } from 'lucide-react';

export const StarToast = () => {
  const { recentStar, closeRecentToast, setShowConstellationModal, collected, total } = useStars();

  if (!recentStar) return null;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 900,
        backgroundColor: 'rgba(21, 21, 45, 0.94)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid var(--color-gold)',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        boxShadow: '0 15px 45px rgba(8, 8, 17, 0.85), 0 0 25px rgba(255, 217, 133, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        maxWidth: '380px',
        animation: 'riseIntoSky 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 217, 133, 0.25)',
          border: '1px solid var(--color-gold)',
          color: 'var(--color-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        className="animate-twinkle"
      >
        <Star size={20} fill="#FFD985" stroke="#FFD985" />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'var(--font-rounded)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-gold)' }}>
            Forgotten Star Found!
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-lavender)', fontWeight: 600 }}>
            ({collected.length}/{total})
          </span>
        </div>
        <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
          {recentStar.title}
        </p>
        <button
          onClick={() => {
            closeRecentToast();
            setShowConstellationModal(true);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-moon-blue)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            marginTop: '4px',
            textDecoration: 'underline'
          }}
        >
          View in Constellation Map →
        </button>
      </div>

      <button
        onClick={closeRecentToast}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-muted)',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};
