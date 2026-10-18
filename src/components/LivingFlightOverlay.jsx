import React from 'react';
import { useFlight } from '../context/FlightContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FastForward } from 'lucide-react';

export const LivingFlightOverlay = () => {
  const {
    flightState,
    activeDestination,
    originCoords,
    targetCoords,
    flightProgress,
    starRevealed,
    skipFlight
  } = useFlight();

  const navigate = useNavigate();

  if (flightState === 'idle' || !activeDestination) return null;

  // Bezier curve control points (arcing gently upward)
  const x0 = originCoords.x;
  const y0 = originCoords.y;
  const x1 = targetCoords.x;
  const y1 = targetCoords.y;

  const dx = x1 - x0;
  const dy = y1 - y0;

  const cp1x = x0 + dx * 0.35;
  const cp1y = Math.min(y0, y1) - Math.max(Math.abs(dx) * 0.22, 60);

  const cp2x = x0 + dx * 0.75;
  const cp2y = y1 - 25;

  // Compute point P(t) along cubic bezier
  const t = flightProgress;
  const mt = 1 - t;

  const currentX =
    mt * mt * mt * x0 +
    3 * mt * mt * t * cp1x +
    3 * mt * t * t * cp2x +
    t * t * t * x1;

  const currentY =
    mt * mt * mt * y0 +
    3 * mt * mt * t * cp1y +
    3 * mt * t * t * cp2y +
    t * t * t * y1;

  // Compute tangent derivative for rotation tilt
  const tangentX =
    3 * mt * mt * (cp1x - x0) +
    6 * mt * t * (cp2x - cp1x) +
    3 * t * t * (x1 - cp2x);

  const tangentY =
    3 * mt * mt * (cp1y - y0) +
    6 * mt * t * (cp2y - cp1y) +
    3 * t * t * (y1 - cp2y);

  const tiltAngle = Math.atan2(tangentY, tangentX) * (180 / Math.PI);
  // Soft clamp tilt angle
  const clampedTilt = Math.max(-35, Math.min(35, tiltAngle * 0.65));

  const pathD = `M ${x0} ${y0} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 950,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {/* SVG Canvas for the Living Magical Line */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <defs>
          {/* Glowing Trail Gradient (Moonlight Blue to Lavender to Gold) */}
          <linearGradient id="magicFlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A8D9FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#B6A4FF" stopOpacity="0.85" />
            <stop offset="90%" stopColor="#FFD985" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <filter id="flightTrailBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
        </defs>

        {/* Trail Glow Path */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#magicFlightGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="1600"
          strokeDashoffset={1600 * (1 - flightProgress)}
          filter="url(#flightTrailBlur)"
        />

        {/* Crisp Starlight Core Path */}
        <path
          d={pathD}
          fill="none"
          stroke="#FFF9DE"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1600"
          strokeDashoffset={1600 * (1 - flightProgress)}
        />

        {/* Particles Floating in Yuvvi's Wake */}
        {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
          if (flightProgress < ratio) return null;
          const subT = ratio;
          const subMt = 1 - subT;
          const px =
            subMt * subMt * subMt * x0 +
            3 * subMt * subMt * subT * cp1x +
            3 * subMt * subT * subT * cp2x +
            subT * subT * subT * x1;
          const py =
            subMt * subMt * subMt * y0 +
            3 * subMt * subMt * subT * cp1y +
            3 * subMt * subT * subT * cp2y +
            subT * subT * subT * y1;

          return (
            <g key={ratio} transform={`translate(${px}, ${py})`} className="animate-twinkle">
              <circle cx="0" cy="0" r="3" fill="#FFD985" opacity="0.85" />
              <polygon
                points="0,-6 1.8,-1.8 6,0 1.8,1.8 0,6 -1.8,1.8 -6,0 -1.8,-1.8"
                fill="#B6A4FF"
                opacity="0.7"
              />
            </g>
          );
        })}
      </svg>

      {/* FLYING 3D YUVVI AVATAR (Follows current point P(t)) */}
      <div
        style={{
          position: 'absolute',
          left: `${currentX}px`,
          top: `${currentY}px`,
          transform: `translate(-50%, -50%) rotate(${clampedTilt}deg)`,
          transition: 'transform 0.08s linear',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Leading Golden Starlight Spark */}
        <div
          style={{
            position: 'absolute',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FFFFFF 0%, #FFD985 50%, transparent 80%)',
            boxShadow: '0 0 25px #FFD985',
            top: '25px',
            right: '-10px',
            animation: 'pulseGlow 0.4s infinite alternate'
          }}
        />

        {/* Miniature Flying Ghost SVG with Lantern held forward */}
        <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
          {/* Ghost Body */}
          <path
            d="M 50 18 C 32 18, 22 36, 22 55 C 22 74, 28 82, 36 78 C 44 74, 48 82, 54 78 C 60 74, 66 82, 74 76 C 80 72, 78 60, 78 55 C 78 36, 68 18, 50 18 Z"
            fill="#FFFFFF"
            stroke="#B6A4FF"
            strokeWidth="2.5"
            filter="drop-shadow(0 6px 12px rgba(8, 8, 17, 0.6))"
          />
          {/* Forehead Star */}
          <polygon points="50,23 52,28 57,29 53,33 54,38 50,35 46,38 47,33 43,29 48,28" fill="#FFD985" />
          {/* Eyes (Happy squinting flying eyes) */}
          <path d="M 40 46 Q 44 40 48 46" stroke="#15152D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 54 46 Q 58 40 62 46" stroke="#15152D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Cheeks */}
          <ellipse cx="38" cy="52" rx="4" ry="2.5" fill="#D99BCB" opacity="0.6" />
          <ellipse cx="64" cy="52" rx="4" ry="2.5" fill="#D99BCB" opacity="0.6" />
          {/* Flying Lantern held forward */}
          <g transform="translate(68, 48)">
            <circle cx="10" cy="12" r="14" fill="rgba(255, 217, 133, 0.4)" />
            <rect x="5" y="4" width="10" height="15" rx="3" fill="rgba(255, 255, 255, 0.8)" stroke="#D4A137" strokeWidth="1.5" />
            <circle cx="10" cy="11" r="3" fill="#FFD985" />
          </g>
        </svg>

        {/* Small Trail Dust Tag */}
        <span
          style={{
            fontFamily: 'var(--font-rounded)',
            fontSize: '0.74rem',
            color: '#FFD985',
            fontWeight: 700,
            textShadow: '0 2px 6px rgba(0,0,0,0.8)',
            letterSpacing: '0.04em',
            marginTop: '-6px'
          }}
        >
          Guiding to {activeDestination.title}...
        </span>
      </div>

      {/* DESTINATION STAR EXPANSION PULSE (When Yuvvi Arrives) */}
      {starRevealed && (
        <div
          style={{
            position: 'absolute',
            left: `${targetCoords.x}px`,
            top: `${targetCoords.y}px`,
            transform: 'translate(-50%, -50%)',
            animation: 'destinationStarPulse 0.5s ease-out forwards',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFFFFF 0%, #FFD985 45%, rgba(182, 164, 255, 0.3) 70%, transparent 100%)',
              boxShadow: '0 0 45px #FFD985, 0 0 90px #B6A4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={32} color="#FFFFFF" />
          </div>
        </div>
      )}

      {/* Skip Button (Immediate Navigation fallback) */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={() => skipFlight(activeDestination.route, (r) => navigate(r))}
          className="btn btn-secondary"
          style={{
            padding: '0.45rem 1rem',
            fontSize: '0.82rem',
            background: 'rgba(21, 21, 45, 0.85)',
            borderColor: 'var(--color-indigo-border)'
          }}
        >
          <FastForward size={14} />
          <span>Skip Flight Animation</span>
        </button>
      </div>
    </div>
  );
};
