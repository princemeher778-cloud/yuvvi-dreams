import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFlight } from '../context/FlightContext';
import { sound } from '../utils/audio';
import { Compass, BookOpen, Wrench, Flower2, ScrollText, Sparkles, Send } from 'lucide-react';

const STATIONS = [
  {
    id: 'home',
    title: 'Star Hearth',
    route: '/',
    tagline: 'Where forgotten daydreams awaken',
    x: 100,
    y: 90,
    icon: Compass,
    color: '#FFD985'
  },
  {
    id: 'dream-library',
    title: 'Dream Library',
    route: '/dream-library',
    tagline: 'Velvet volumes & ocean jars',
    x: 290,
    y: 50,
    icon: BookOpen,
    color: '#A8D9FF'
  },
  {
    id: 'workshop',
    title: 'Clockwork Castle',
    route: '/workshop',
    tagline: 'Mechanical wings & star projectors',
    x: 480,
    y: 90,
    icon: Wrench,
    color: '#FFB677'
  },
  {
    id: 'dream-garden',
    title: 'Wishing Garden',
    route: '/dream-garden',
    tagline: 'Starlight meadow of blooming hopes',
    x: 670,
    y: 50,
    icon: Flower2,
    color: '#D99BCB'
  },
  {
    id: 'story',
    title: 'Story Castle',
    route: '/story',
    tagline: 'Five illustrated chapters of belonging',
    x: 840,
    y: 90,
    icon: ScrollText,
    color: '#B6A4FF'
  }
];

export const DreamDeliveryMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startFlight } = useFlight();
  const [hoveredStation, setHoveredStation] = useState(null);

  // Active station based on current pathname
  const activeStation = STATIONS.find((s) => s.route === location.pathname) || STATIONS[0];

  const handleStationClick = (station, e) => {
    e.preventDefault();
    if (location.pathname === station.route) return;

    sound.playLanternGlow();
    const targetRect = e.currentTarget.getBoundingClientRect();

    startFlight({
      destination: {
        id: station.id,
        title: station.title,
        route: station.route,
        tagline: station.tagline,
        description: `Delivering dream package to ${station.title}...`
      },
      targetRect,
      onNavigate: (route) => navigate(route)
    });
  };

  return (
    <div
      className="dream-delivery-map-card"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        border: '1.5px solid var(--color-card-border)',
        borderRadius: '24px',
        padding: '2rem',
        margin: '2rem 0',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div className="badge badge-gold" style={{ marginBottom: '6px' }}>
            <Compass size={14} />
            <span>Interactive Dream Delivery Map</span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.45rem', color: 'var(--color-text-main)', fontFamily: 'var(--font-rounded)' }}>
            The Celestial Delivery Route
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--color-text-sub)' }}>
            Watch Yuvvi's lantern navigate between dream havens. Click any haven to fly there.
          </p>
        </div>

        {/* Current Destination Status */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.45rem 1rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(30, 30, 59, 0.6)',
            border: '1px solid var(--color-indigo-border)',
            fontSize: '0.84rem',
            color: 'var(--color-gold)'
          }}
        >
          <Sparkles size={14} />
          <span>Current Haven: <strong>{activeStation.title}</strong></span>
        </div>
      </div>

      {/* SVG Celestial Flight Map */}
      <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <svg
          viewBox="0 0 940 140"
          style={{
            width: '100%',
            minWidth: '700px',
            height: '140px',
            display: 'block'
          }}
        >
          {/* Constellation Curved Guide Path */}
          <path
            d="M 100 90 Q 195 20, 290 50 T 480 90 T 670 50 T 840 90"
            fill="none"
            stroke="rgba(182, 164, 255, 0.25)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Active Starlight Arc Progress */}
          <path
            d="M 100 90 Q 195 20, 290 50 T 480 90 T 670 50 T 840 90"
            fill="none"
            stroke="url(#deliveryGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="deliveryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD985" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#A8D9FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D99BCB" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Connecting Starlight Dust */}
          {[180, 380, 570, 760].map((cx, i) => (
            <circle
              key={i}
              cx={cx}
              cy={i % 2 === 0 ? 45 : 80}
              r="2"
              fill="#FFD985"
              className="animate-twinkle"
            />
          ))}

          {/* Station Nodes */}
          {STATIONS.map((station) => {
            const isActive = station.route === location.pathname;
            const isHovered = hoveredStation === station.id;

            return (
              <g
                key={station.id}
                transform={`translate(${station.x}, ${station.y})`}
                onClick={(e) => handleStationClick(station, e)}
                onMouseEnter={() => setHoveredStation(station.id)}
                onMouseLeave={() => setHoveredStation(null)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                aria-label={`Fly to ${station.title}: ${station.tagline}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleStationClick(station, e);
                }}
              >
                {/* Outer Glow Halo */}
                <circle
                  cx="0"
                  cy="0"
                  r={isActive ? 28 : isHovered ? 26 : 22}
                  fill={isActive ? 'rgba(255, 217, 133, 0.25)' : 'rgba(30, 30, 59, 0.5)'}
                  stroke={isActive ? '#FFD985' : station.color}
                  strokeWidth={isActive ? '2.5' : '1.5'}
                  style={{ transition: 'all 0.2s ease' }}
                />

                {/* Center Core Node */}
                <circle
                  cx="0"
                  cy="0"
                  r={isActive ? 16 : 12}
                  fill={isActive ? '#FFD985' : '#15152D'}
                  stroke={station.color}
                  strokeWidth="2"
                />

                {/* Yuvvi Flying Marker on Active Station */}
                {isActive && (
                  <g transform="translate(0, -32)" className="animate-float">
                    <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#B6A4FF" strokeWidth="2" />
                    <polygon points="0,-7 2,-2 7,-2 3,1 5,6 0,3 -5,6 -3,1 -7,-2 -2,-2" fill="#FFD985" />
                    <circle cx="-4" cy="1" r="1.5" fill="#15152D" />
                    <circle cx="4" cy="1" r="1.5" fill="#15152D" />
                  </g>
                )}

                {/* Station Label */}
                <text
                  x="0"
                  y={station.y > 60 ? 38 : -32}
                  textAnchor="middle"
                  fill={isActive ? '#FFD985' : 'var(--color-text-main)'}
                  fontFamily="var(--font-rounded)"
                  fontWeight={isActive ? 700 : 600}
                  fontSize="12.5"
                >
                  {station.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Info Pill for hovered / active station */}
      <div
        style={{
          marginTop: '1rem',
          padding: '0.85rem 1.25rem',
          borderRadius: '16px',
          backgroundColor: 'rgba(21, 21, 45, 0.65)',
          border: '1px solid var(--color-indigo-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.25rem' }}>🏮</span>
          <div>
            <span style={{ display: 'block', fontWeight: 700, color: 'var(--color-moon-blue)', fontSize: '0.94rem' }}>
              {(STATIONS.find((s) => s.id === hoveredStation) || activeStation).title}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-sub)' }}>
              {(STATIONS.find((s) => s.id === hoveredStation) || activeStation).tagline}
            </span>
          </div>
        </div>

        <button
          className="btn btn-secondary"
          onClick={(e) => handleStationClick((STATIONS.find((s) => s.id === hoveredStation) || activeStation), e)}
          style={{ padding: '0.45rem 1.1rem', fontSize: '0.84rem' }}
        >
          <Send size={14} />
          <span>Fly With Yuvvi</span>
        </button>
      </div>
    </div>
  );
};
