import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Compass, Flower2, ScrollText, ArrowRight, Wand2 } from 'lucide-react';
import { sound } from '../utils/audio';

const DESTINATIONS = [
  {
    id: 'dream-library',
    title: 'Dream Library',
    tagline: 'Every forgotten dream has a story.',
    description: 'Explore antique velvet volumes, glowing sea jars, and dreams of flight that people once cherished.',
    route: '/dream-library',
    icon: BookOpen,
    color: '#A34063',
    // SVG Destination Point on canvas (desktop view)
    targetX: 680,
    targetY: 60,
    pathD: 'M 90 190 C 250 190, 360 60, 680 60'
  },
  {
    id: 'workshop',
    title: 'Yuvvi\'s Workshop',
    tagline: 'Where impossible ideas come to life.',
    description: 'Watch Yuvvi transform lost daydreams into clockwork lanterns, emotional companions, and world maps.',
    route: '/workshop',
    icon: Compass,
    color: '#B3822E',
    targetX: 740,
    targetY: 150,
    pathD: 'M 90 190 C 280 190, 420 150, 740 150'
  },
  {
    id: 'dream-garden',
    title: 'Your Dream Garden',
    tagline: 'A little place for the dreams you still believe in.',
    description: 'Plant your own quiet wish into moonlit soil and watch it rise as a permanent star in the night sky.',
    route: '/dream-garden',
    icon: Flower2,
    color: '#4B7B58',
    targetX: 730,
    targetY: 240,
    pathD: 'M 90 190 C 280 190, 420 240, 730 240'
  },
  {
    id: 'story',
    title: 'Yuvvi\'s Story',
    tagline: 'Discover how a forgotten dream became Yuvvi.',
    description: 'An illustrated five-chapter tale of starlight, a lonely castle, missing stars, and finding belonging.',
    route: '/story',
    icon: ScrollText,
    color: '#5C4033',
    targetX: 670,
    targetY: 330,
    pathD: 'M 90 190 C 250 190, 360 330, 670 330'
  }
];

export const LivingDreamTrail = ({ id = 'dream-trail' }) => {
  const [selectedId, setSelectedId] = useState('dream-library');
  const [isAnimating, setIsAnimating] = useState(false);
  const [sparkProgress, setSparkProgress] = useState(1); // 0 to 1
  const navigate = useNavigate();
  const animRef = useRef(null);

  const activeDest = DESTINATIONS.find((d) => d.id === selectedId) || DESTINATIONS[0];

  const handleSelectDestination = (destId, playAudio = true) => {
    if (destId === selectedId && !isAnimating) {
      // Re-trigger spark animation
    }
    setSelectedId(destId);
    setIsAnimating(true);
    setSparkProgress(0);

    if (playAudio) {
      sound.playLanternGlow();
    }

    const startTime = performance.now();
    const duration = 900; // ms

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setSparkProgress(eased);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        sound.playChime(880, 'sine', 0.5);
      }
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Compute point along cubic bezier path for active destination
  // Path formula approx based on M(90, 190) -> C(cp1x, cp1y, cp2x, cp2y) -> P3(targetX, targetY)
  const getCoordinatesAlongActivePath = (t) => {
    const p0 = { x: 90, y: 190 };
    const p3 = { x: activeDest.targetX, y: activeDest.targetY };
    let p1, p2;

    if (activeDest.id === 'dream-library') {
      p1 = { x: 250, y: 190 };
      p2 = { x: 360, y: 60 };
    } else if (activeDest.id === 'workshop') {
      p1 = { x: 280, y: 190 };
      p2 = { x: 420, y: 150 };
    } else if (activeDest.id === 'dream-garden') {
      p1 = { x: 280, y: 190 };
      p2 = { x: 420, y: 240 };
    } else {
      p1 = { x: 250, y: 190 };
      p2 = { x: 360, y: 330 };
    }

    const cx = 3 * (p1.x - p0.x);
    const bx = 3 * (p2.x - p1.x) - cx;
    const ax = p3.x - p0.x - cx - bx;

    const cy = 3 * (p1.y - p0.y);
    const by = 3 * (p2.y - p1.y) - cy;
    const ay = p3.y - p0.y - cy - by;

    const x = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
    const y = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;

    return { x, y };
  };

  const currentSparkCoords = getCoordinatesAlongActivePath(sparkProgress);

  return (
    <section id={id} style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
          <div className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
            <Wand2 size={15} />
            <span>Signature Feature</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '0.85rem' }}>
            Yuvvi’s Living Dream Trail
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-cocoa-light)', lineHeight: 1.6 }}>
            Choose a destination, and let the spark from Yuvvi’s lantern weave a living thread of golden stardust
            to illuminate the path.
          </p>
        </div>

        {/* Trail Quick Selector Buttons (Tabs) */}
        <div
          role="tablist"
          aria-label="Story destinations"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}
        >
          {DESTINATIONS.map((dest) => {
            const isSelected = dest.id === selectedId;
            const Icon = dest.icon;
            return (
              <button
                key={dest.id}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`panel-${dest.id}`}
                onClick={() => handleSelectDestination(dest.id)}
                className="btn"
                style={{
                  backgroundColor: isSelected ? 'var(--color-berry)' : 'var(--color-white)',
                  color: isSelected ? 'var(--color-white)' : 'var(--color-cocoa)',
                  border: isSelected ? '1.5px solid var(--color-berry)' : '1.5px solid var(--color-peach-border)',
                  boxShadow: isSelected ? 'var(--shadow-berry)' : 'var(--shadow-sm)',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.92rem'
                }}
              >
                <Icon size={16} color={isSelected ? '#FFF8F1' : dest.color} />
                <span>{dest.title}</span>
                {isSelected && <Sparkles size={14} className="animate-twinkle" />}
              </button>
            );
          })}
        </div>

        {/* Interactive SVG Canvas & Desktop Dream Map Stage */}
        <div
          className="story-card"
          style={{
            padding: '2rem',
            backgroundColor: '#FFFDF9',
            border: '2px solid var(--color-peach-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              backgroundColor: 'rgba(244, 201, 107, 0.12)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}
          />

          {/* Desktop SVG Visual Map */}
          <div className="trail-desktop-view" style={{ width: '100%', position: 'relative' }}>
            <svg
              viewBox="0 0 860 380"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              aria-hidden="true"
            >
              <defs>
                {/* Active Trail Golden Gradient */}
                <linearGradient id="activeTrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F4C96B" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#F4C96B" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#FFE082" stopOpacity="1" />
                </linearGradient>

                {/* Golden Spark Radial Glow */}
                <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#FFF1B8" />
                  <stop offset="70%" stopColor="#F4C96B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F4C96B" stopOpacity="0" />
                </radialGradient>

                <filter id="trailGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" />
                </filter>
              </defs>

              {/* Inactive paths (soft dotted lines) */}
              {DESTINATIONS.map((d) => (
                <path
                  key={`bg-path-${d.id}`}
                  d={d.pathD}
                  fill="none"
                  stroke={d.id === selectedId ? '#E2C380' : '#EAD9C9'}
                  strokeWidth={d.id === selectedId ? '3' : '1.8'}
                  strokeDasharray="6 6"
                  opacity={d.id === selectedId ? '0.8' : '0.45'}
                  style={{ transition: 'stroke 0.4s ease' }}
                />
              ))}

              {/* Active Glowing Path with animated dash */}
              <path
                d={activeDest.pathD}
                fill="none"
                stroke="url(#activeTrailGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                filter="url(#trailGlowFilter)"
                style={{
                  transition: 'd 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
              <path
                d={activeDest.pathD}
                fill="none"
                stroke="#FFE59E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Yuvvi's Origin Lantern Station (Left) */}
              <g transform="translate(50, 150)">
                <circle cx="40" cy="40" r="32" fill="rgba(244, 201, 107, 0.22)" className="animate-pulse-glow" />
                <circle cx="40" cy="40" r="22" fill="#FFF8F1" stroke="#C8963E" strokeWidth="2" />
                {/* Mini Lantern Icon */}
                <path d="M 34 32 L 46 32 L 48 48 L 32 48 Z" fill="#F4C96B" stroke="#8C6200" strokeWidth="1.2" />
                <circle cx="40" cy="40" r="4" fill="#FFFFFF" />
                <text
                  x="40"
                  y="74"
                  textAnchor="middle"
                  fill="var(--color-cocoa)"
                  fontSize="12"
                  fontFamily="var(--font-rounded)"
                  fontWeight="600"
                >
                  Yuvvi's Lantern
                </text>
              </g>

              {/* Destination Station Nodes (Right) */}
              {DESTINATIONS.map((d) => {
                const isSelected = d.id === selectedId;
                return (
                  <g
                    key={`node-${d.id}`}
                    transform={`translate(${d.targetX}, ${d.targetY})`}
                    onClick={() => handleSelectDestination(d.id)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${d.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSelectDestination(d.id);
                      }
                    }}
                  >
                    {/* Glowing pulse ring if selected */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="34"
                        fill="none"
                        stroke="#F4C96B"
                        strokeWidth="2"
                        className="animate-pulse-glow"
                      />
                    )}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? '24' : '18'}
                      fill={isSelected ? 'var(--color-berry)' : '#FFF8F1'}
                      stroke={isSelected ? '#F4C96B' : 'var(--color-peach-border)'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                    <circle cx="0" cy="0" r={isSelected ? '6' : '3.5'} fill={isSelected ? '#FFE082' : d.color} />
                    <text
                      x="34"
                      y="5"
                      fill={isSelected ? 'var(--color-berry)' : 'var(--color-cocoa)'}
                      fontSize="14"
                      fontFamily="var(--font-rounded)"
                      fontWeight={isSelected ? '700' : '500'}
                    >
                      {d.title}
                    </text>
                  </g>
                );
              })}

              {/* The Travelling Golden Spark (Living Light Particle) */}
              <g transform={`translate(${currentSparkCoords.x}, ${currentSparkCoords.y})`}>
                {/* Outer Glow */}
                <circle cx="0" cy="0" r="22" fill="url(#sparkGlow)" />
                {/* Inner Core */}
                <circle cx="0" cy="0" r="7" fill="#FFFFFF" filter="url(#trailGlowFilter)" />
                <circle cx="0" cy="0" r="4.5" fill="#FFF9C4" />
                {/* Tiny Sparkle Cross */}
                <path
                  d="M 0 -10 L 0 10 M -10 0 L 10 0"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  opacity={isAnimating ? 1 : 0.8}
                />
              </g>
            </svg>
          </div>

          {/* Destination Detail Card Reveal */}
          <div
            id={`panel-${activeDest.id}`}
            role="tabpanel"
            style={{
              marginTop: '1.75rem',
              padding: '1.75rem',
              borderRadius: '20px',
              backgroundColor: 'var(--color-cream-soft)',
              border: '2px solid var(--color-gold)',
              boxShadow: '0 8px 30px rgba(244, 201, 107, 0.25)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              animation: 'riseIntoSky 0.3s ease-out'
            }}
          >
            <div style={{ flex: '1 1 340px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                <span className="badge badge-berry" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Illuminated Story Destination
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 600 }}>✦ ✦ ✦</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--color-cocoa)', marginBottom: '0.35rem' }}>
                {activeDest.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  color: 'var(--color-berry)',
                  marginBottom: '0.5rem'
                }}
              >
                "{activeDest.tagline}"
              </p>
              <p style={{ fontSize: '0.98rem', color: 'var(--color-cocoa-light)', lineHeight: 1.55 }}>
                {activeDest.description}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => handleSelectDestination(activeDest.id)}
                style={{ fontSize: '0.9rem', padding: '0.75rem 1.25rem' }}
              >
                <Sparkles size={16} color="var(--color-gold)" />
                <span>Cast Spark Again</span>
              </button>

              <button
                className="btn btn-primary"
                onClick={() => {
                  sound.playChime(987.77, 'sine', 0.5);
                  navigate(activeDest.route);
                }}
                style={{
                  fontSize: '1rem',
                  padding: '0.85rem 1.75rem',
                  boxShadow: 'var(--shadow-berry)'
                }}
              >
                <span>Enter {activeDest.title}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .trail-desktop-view {
            overflow-x: auto;
          }
          .trail-desktop-view svg {
            min-width: 600px;
          }
        }
      `}</style>
    </section>
  );
};
