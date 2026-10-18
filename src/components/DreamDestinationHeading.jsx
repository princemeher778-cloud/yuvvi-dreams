import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlight } from '../context/FlightContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

export const DreamDestinationHeading = ({
  id,
  title,
  tagline,
  description,
  route,
  sceneryType = 'clouds', // 'clouds' | 'island' | 'constellation' | 'castle'
  icon: Icon,
  badgeText = 'Dream World',
  initialSceneryRevealed = false
}) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const {
    startFlight,
    flightState,
    activeDestination,
    cloudsParted,
    starRevealed
  } = useFlight();

  const isCurrentTarget = activeDestination && activeDestination.id === id;
  const isRevealed = initialSceneryRevealed || (isCurrentTarget && (cloudsParted || starRevealed));

  const handleClick = (e) => {
    e.preventDefault();
    if (flightState === 'flying' && isCurrentTarget) return;

    sound.playChime(698.46, 'sine', 0.35);

    const targetRect = containerRef.current
      ? containerRef.current.getBoundingClientRect()
      : null;

    startFlight({
      destination: { id, title, route, tagline, description },
      targetRect,
      onNavigate: (targetRoute) => {
        navigate(targetRoute);
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className={`dream-destination-scenery scenery-${sceneryType}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      aria-label={`Enter ${title}: ${tagline}`}
      style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '2.4rem',
        cursor: 'pointer',
        background: isHovered
          ? 'linear-gradient(145deg, rgba(30, 30, 59, 0.85) 0%, rgba(21, 21, 45, 0.95) 100%)'
          : 'linear-gradient(145deg, rgba(21, 21, 45, 0.75) 0%, rgba(13, 13, 30, 0.85) 100%)',
        border: isCurrentTarget
          ? '2px solid var(--color-gold)'
          : isHovered
          ? '1.5px solid var(--color-lavender)'
          : '1.5px solid var(--color-indigo-border)',
        boxShadow: isCurrentTarget
          ? '0 16px 50px rgba(8, 8, 17, 0.9), 0 0 35px rgba(255, 217, 133, 0.35)'
          : isHovered
          ? '0 12px 35px rgba(8, 8, 17, 0.8), 0 0 25px rgba(182, 164, 255, 0.2)'
          : 'var(--shadow-md)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '290px'
      }}
    >
      {/* 1. SCENERY BACKGROUND EMBEDMENT */}
      {/* A. Floating Clouds (Dream Library) */}
      {sceneryType === 'clouds' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          {/* Cloud Bank Left */}
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              left: isRevealed ? '-70px' : '-20px',
              width: '220px',
              height: '140px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(182, 164, 255, 0.18) 0%, rgba(109, 85, 168, 0.05) 60%, transparent 75%)',
              filter: 'blur(18px)',
              opacity: isRevealed ? 0.2 : 0.85,
              transform: isRevealed ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
          {/* Cloud Bank Right */}
          <div
            style={{
              position: 'absolute',
              bottom: '-15%',
              right: isRevealed ? '-70px' : '-20px',
              width: '260px',
              height: '160px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168, 217, 255, 0.18) 0%, rgba(21, 21, 45, 0.05) 60%, transparent 75%)',
              filter: 'blur(22px)',
              opacity: isRevealed ? 0.2 : 0.85,
              transform: isRevealed ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>
      )}

      {/* B. Floating Island with Clockwork (Workshop) */}
      {sceneryType === 'island' && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            pointerEvents: 'none',
            opacity: isRevealed ? 0.9 : 0.45,
            transition: 'opacity 0.6s ease'
          }}
        >
          <svg width="120" height="70" viewBox="0 0 120 70" fill="none">
            <ellipse cx="60" cy="45" rx="50" ry="18" fill="#1E1E3B" stroke="rgba(255, 217, 133, 0.3)" strokeWidth="1" />
            <circle cx="50" cy="30" r="14" stroke="#D4A137" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="75" cy="32" r="8" stroke="#FFD985" strokeWidth="1" />
          </svg>
        </div>
      )}

      {/* C. Constellation of Stars (Garden) */}
      {sceneryType === 'constellation' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: isRevealed ? 0.85 : 0.4
          }}
        >
          <svg width="100%" height="100%">
            <line x1="20%" y1="20%" x2="50%" y2="40%" stroke="rgba(168, 217, 255, 0.25)" strokeDasharray="2 3" />
            <line x1="50%" y1="40%" x2="80%" y2="25%" stroke="rgba(168, 217, 255, 0.25)" strokeDasharray="2 3" />
            <circle cx="20%" cy="20%" r="2" fill="#FFD985" className="animate-twinkle" />
            <circle cx="50%" cy="40%" r="2.5" fill="#A8D9FF" className="animate-twinkle" />
            <circle cx="80%" cy="25%" r="2" fill="#FFFFFF" className="animate-twinkle" />
          </svg>
        </div>
      )}

      {/* D. Moonlit Castle Silhouette (Story) */}
      {sceneryType === 'castle' && (
        <div
          style={{
            position: 'absolute',
            bottom: '5px',
            right: '15px',
            pointerEvents: 'none',
            opacity: isRevealed ? 0.75 : 0.35,
            transition: 'opacity 0.5s ease'
          }}
        >
          <svg width="90" height="75" viewBox="0 0 90 75" fill="none">
            <rect x="25" y="30" width="40" height="45" fill="#1E1E3B" />
            <polygon points="25,30 45,5 65,30" fill="#28224C" />
            <circle cx="45" cy="18" r="4" fill="#FFD985" opacity="0.8" />
          </svg>
        </div>
      )}

      {/* 2. CARD CONTENT */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        {/* Top Badge & Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: isCurrentTarget
                ? 'rgba(255, 217, 133, 0.25)'
                : 'rgba(109, 85, 168, 0.3)',
              color: isCurrentTarget ? 'var(--color-gold)' : 'var(--color-lavender)',
              border: isCurrentTarget
                ? '1.5px solid var(--color-gold)'
                : '1px solid rgba(182, 164, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(8, 8, 17, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {Icon && <Icon size={26} />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-purple">{badgeText}</span>
            {isRevealed && (
              <span className="animate-twinkle" style={{ color: 'var(--color-gold)', fontSize: '0.9rem' }}>
                ⭐
              </span>
            )}
          </div>
        </div>

        {/* Embedded Scenery Heading */}
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.65rem',
            color: isHovered || isCurrentTarget ? 'var(--color-moon-blue)' : 'var(--color-text-main)',
            marginBottom: '0.45rem',
            transition: 'color 0.3s ease'
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-rounded)',
            color: 'var(--color-gold)',
            fontSize: '0.95rem',
            fontWeight: 600,
            marginBottom: '0.75rem'
          }}
        >
          "{tagline}"
        </p>

        <p style={{ fontSize: '0.96rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>

      {/* 3. INVITATION CTA FOOTER */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(182, 164, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span
          style={{
            fontSize: '0.88rem',
            color: isCurrentTarget ? 'var(--color-gold)' : 'var(--color-lavender)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={14} />
          {isCurrentTarget ? 'Yuvvi is flying here...' : 'Invite Yuvvi to fly here'}
        </span>

        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: isHovered || isCurrentTarget
              ? 'var(--color-gold)'
              : 'rgba(30, 30, 59, 0.8)',
            color: isHovered || isCurrentTarget ? 'var(--color-midnight)' : 'var(--color-lavender)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          <ArrowRight size={17} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};
