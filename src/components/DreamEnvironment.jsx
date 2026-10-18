import React, { useEffect, useState } from 'react';

export const DreamEnvironment = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize from -1 to 1
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
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      {/* 1. Distant Moon / Celestial Orb with Atmospheric Halo */}
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
          transition: 'transform 0.4s ease-out'
        }}
      >
        {/* Soft Moon Crescent Detail */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            boxShadow: 'inset -20px -20px 40px rgba(8, 8, 17, 0.65)'
          }}
        />
      </div>

      {/* 2. Floating Dream Islands in the Distance */}
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '4%',
          opacity: 0.45,
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 10}px)`,
          transition: 'transform 0.6s ease-out'
        }}
      >
        <svg width="220" height="100" viewBox="0 0 220 100" fill="none">
          <path
            d="M 20 50 Q 80 20 140 45 Q 190 35 210 55 C 200 80 150 90 100 85 C 50 80 20 70 20 50 Z"
            fill="url(#islandGrad)"
          />
          {/* Glowing starlight tree / foliage on island */}
          <circle cx="100" cy="38" r="8" fill="#B6A4FF" opacity="0.6" />
          <circle cx="140" cy="34" r="5" fill="#FFD985" opacity="0.7" />
          <defs>
            <linearGradient id="islandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E1E3B" />
              <stop offset="100%" stopColor="#080811" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '2%',
          opacity: 0.35,
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -15}px)`,
          transition: 'transform 0.6s ease-out'
        }}
      >
        <svg width="150" height="70" viewBox="0 0 150 70" fill="none">
          <path
            d="M 15 35 Q 60 15 100 30 Q 135 25 145 40 C 135 55 90 65 60 60 C 30 55 15 45 15 35 Z"
            fill="#181832"
          />
          <circle cx="70" cy="24" r="4" fill="#A8D9FF" opacity="0.7" />
        </svg>
      </div>

      {/* 3. Subtle Constellations & Distant Stars */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.65
        }}
      >
        {/* Constellation Lines */}
        <g stroke="rgba(182, 164, 255, 0.2)" strokeWidth="0.8" strokeDasharray="3 4">
          <line x1="12%" y1="18%" x2="22%" y2="12%" />
          <line x1="22%" y1="12%" x2="30%" y2="24%" />
          <line x1="30%" y1="24%" x2="38%" y2="16%" />
          <line x1="70%" y1="35%" x2="78%" y2="45%" />
          <line x1="78%" y1="45%" x2="88%" y2="38%" />
        </g>

        {/* Constellation Star Vertices */}
        <circle cx="12%" cy="18%" r="2" fill="#FFD985" className="animate-twinkle" />
        <circle cx="22%" cy="12%" r="2.5" fill="#FFFFFF" className="animate-twinkle" />
        <circle cx="30%" cy="24%" r="2" fill="#A8D9FF" className="animate-twinkle" />
        <circle cx="38%" cy="16%" r="2.2" fill="#FFD985" className="animate-twinkle" />
        <circle cx="70%" cy="35%" r="2.2" fill="#B6A4FF" className="animate-twinkle" />
        <circle cx="78%" cy="45%" r="2.5" fill="#FFFFFF" className="animate-twinkle" />
        <circle cx="88%" cy="38%" r="2" fill="#FFD985" className="animate-twinkle" />

        {/* Scattered Ambient Starlight */}
        <circle cx="5%" cy="45%" r="1" fill="#FFFFFF" opacity="0.4" />
        <circle cx="18%" cy="65%" r="1.5" fill="#FFD985" opacity="0.5" />
        <circle cx="45%" cy="8%" r="1" fill="#A8D9FF" opacity="0.4" />
        <circle cx="55%" cy="30%" r="1.2" fill="#FFFFFF" opacity="0.3" />
        <circle cx="62%" cy="75%" r="1.5" fill="#B6A4FF" opacity="0.5" />
        <circle cx="82%" cy="85%" r="1" fill="#FFFFFF" opacity="0.4" />
        <circle cx="94%" cy="20%" r="1.2" fill="#A8D9FF" opacity="0.5" />
      </svg>

      {/* 4. Drifting Volumetric Cloud Layers */}
      <div
        className="animate-drift"
        style={{
          position: 'absolute',
          top: '15%',
          left: '-10%',
          width: '600px',
          height: '240px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(109, 85, 168, 0.16) 0%, rgba(21, 21, 45, 0.08) 50%, transparent 75%)',
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
          width: '700px',
          height: '280px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(168, 217, 255, 0.12) 0%, rgba(109, 85, 168, 0.06) 55%, transparent 80%)',
          filter: 'blur(45px)',
          borderRadius: '50%',
          animationDelay: '-16s'
        }}
      />

      {/* 5. Subtle Celestial Light Rays */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: '15%',
          width: '320px',
          height: '600px',
          background: 'linear-gradient(135deg, rgba(255, 217, 133, 0.04) 0%, rgba(182, 164, 255, 0.02) 60%, transparent 100%)',
          transform: 'rotate(-25deg)',
          filter: 'blur(30px)'
        }}
      />
    </div>
  );
};
