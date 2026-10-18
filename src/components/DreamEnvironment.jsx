import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const DreamEnvironment = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { isDayMode } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="dream-environment"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        transition: 'all 0.6s ease'
      }}
      aria-hidden="true"
    >
      {/* 1. Celestial Orb (Sun in Day, Moon in Night) */}
      {isDayMode ? (
        /* Dreamy Golden Sun with Warm Pastel Flare */
        <div
          style={{
            position: 'absolute',
            top: '5%',
            right: '9%',
            width: '170px',
            height: '170px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, #FFFDF0 0%, #FFE28A 45%, #FFB677 85%, transparent 100%)',
            boxShadow: '0 0 90px rgba(255, 214, 110, 0.5), 0 0 180px rgba(255, 179, 130, 0.3)',
            opacity: 0.9,
            transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -12}px)`,
            transition: 'transform 0.4s ease-out, opacity 0.5s ease'
          }}
        />
      ) : (
        /* Starry Crescent Moon */
        <div
          style={{
            position: 'absolute',
            top: '6%',
            right: '8%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #FFF8DE 0%, #FFE599 30%, #B6A4FF 75%, transparent 100%)',
            boxShadow: '0 0 80px rgba(182, 164, 255, 0.45), 0 0 160px rgba(168, 217, 255, 0.25)',
            opacity: 0.85,
            transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -12}px)`,
            transition: 'transform 0.4s ease-out, opacity 0.5s ease'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              boxShadow: 'inset -22px -22px 42px rgba(8, 8, 17, 0.7)'
            }}
          />
        </div>
      )}

      {/* 2. Floating Dream Islands in the Distance */}
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '4%',
          opacity: isDayMode ? 0.35 : 0.45,
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 10}px)`,
          transition: 'transform 0.6s ease-out, opacity 0.5s ease'
        }}
      >
        <svg width="220" height="100" viewBox="0 0 220 100" fill="none">
          <path
            d="M 20 50 Q 80 20 140 45 Q 190 35 210 55 C 200 80 150 90 100 85 C 50 80 20 70 20 50 Z"
            fill={isDayMode ? '#E8DBF0' : '#1E1E3B'}
          />
          <circle cx="100" cy="38" r="8" fill={isDayMode ? '#FFB677' : '#B6A4FF'} opacity="0.7" />
          <circle cx="140" cy="34" r="5" fill="#FFD985" opacity="0.8" />
        </svg>
      </div>

      {/* 3. Subtle Constellations (Night) / Cloud Spores (Day) */}
      {!isDayMode ? (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.65
          }}
        >
          <g stroke="rgba(182, 164, 255, 0.2)" strokeWidth="0.8" strokeDasharray="3 4">
            <line x1="12%" y1="18%" x2="22%" y2="12%" />
            <line x1="22%" y1="12%" x2="30%" y2="24%" />
            <line x1="30%" y1="24%" x2="38%" y2="16%" />
            <line x1="70%" y1="35%" x2="78%" y2="45%" />
            <line x1="78%" y1="45%" x2="88%" y2="38%" />
          </g>
          <circle cx="12%" cy="18%" r="2" fill="#FFD985" className="animate-twinkle" />
          <circle cx="22%" cy="12%" r="2.5" fill="#FFFFFF" className="animate-twinkle" />
          <circle cx="30%" cy="24%" r="2" fill="#A8D9FF" className="animate-twinkle" />
          <circle cx="38%" cy="16%" r="2.2" fill="#FFD985" className="animate-twinkle" />
          <circle cx="70%" cy="35%" r="2.2" fill="#B6A4FF" className="animate-twinkle" />
          <circle cx="78%" cy="45%" r="2.5" fill="#FFFFFF" className="animate-twinkle" />
          <circle cx="88%" cy="38%" r="2" fill="#FFD985" className="animate-twinkle" />
        </svg>
      ) : (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.5
          }}
        >
          <circle cx="15%" cy="20%" r="2" fill="#FFD985" className="animate-twinkle" />
          <circle cx="45%" cy="15%" r="1.8" fill="#FFB677" className="animate-twinkle" />
          <circle cx="75%" cy="30%" r="2.2" fill="#B6A4FF" className="animate-twinkle" />
          <circle cx="85%" cy="18%" r="1.5" fill="#FFD985" className="animate-twinkle" />
        </svg>
      )}

      {/* 4. Drifting Volumetric Cloud Layers */}
      <div
        className="animate-drift"
        style={{
          position: 'absolute',
          top: '15%',
          left: '-10%',
          width: '620px',
          height: '250px',
          background: isDayMode
            ? 'radial-gradient(ellipse at 50% 50%, rgba(255, 235, 220, 0.45) 0%, rgba(245, 225, 255, 0.2) 50%, transparent 75%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(109, 85, 168, 0.16) 0%, rgba(21, 21, 45, 0.08) 50%, transparent 75%)',
          filter: 'blur(35px)',
          borderRadius: '50%'
        }}
      />

      <div
        className="animate-drift"
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '-5%',
          width: '720px',
          height: '290px',
          background: isDayMode
            ? 'radial-gradient(ellipse at 50% 50%, rgba(220, 240, 255, 0.45) 0%, rgba(255, 220, 235, 0.25) 55%, transparent 80%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(168, 217, 255, 0.12) 0%, rgba(109, 85, 168, 0.06) 55%, transparent 80%)',
          filter: 'blur(45px)',
          borderRadius: '50%',
          animationDelay: '-16s'
        }}
      />
    </div>
  );
};
