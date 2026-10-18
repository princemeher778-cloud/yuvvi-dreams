import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useStars } from '../context/StarContext';
import { Volume2, VolumeX, Menu, X, Star, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { collected, total, setShowConstellationModal, soundMuted, toggleSound } = useStars();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dream-library', label: 'Dream Library' },
    { to: '/workshop', label: 'Workshop' },
    { to: '/dream-garden', label: 'Dream Garden' },
    { to: '/story', label: 'Story' }
  ];

  const handleNavClick = () => {
    sound.playChime(784, 'sine', 0.35);
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(8, 8, 17, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(182, 164, 255, 0.14)',
        transition: 'all 0.3s ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '78px'
        }}
      >
        {/* Brand / Logo */}
        <Link
          to="/"
          onClick={() => sound.playChime(659.25, 'sine', 0.45)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none'
          }}
          aria-label="Yuvvi Home"
        >
          {/* Glowing 3D-styled Avatar Mark */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#15152D',
              border: '1.5px solid rgba(182, 164, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(182, 164, 255, 0.3)',
              position: 'relative'
            }}
          >
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
              <path
                d="M50 15 C30 15 22 35 22 55 C22 75 28 85 36 80 C44 75 48 85 54 80 C60 75 66 85 74 78 C80 73 78 60 78 55 C78 35 70 15 50 15 Z"
                fill="#FFFFFF"
                stroke="#B6A4FF"
                strokeWidth="4"
              />
              <polygon points="50,22 52,27 57,28 53,32 54,37 50,34 46,37 47,32 43,28 48,27" fill="#FFD985" />
              <circle cx="42" cy="45" r="3.5" fill="#15152D" />
              <circle cx="58" cy="45" r="3.5" fill="#15152D" />
            </svg>
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                fontSize: '11px'
              }}
            >
              ✨
            </span>
          </div>

          <div>
            <span
              style={{
                fontFamily: 'var(--font-rounded)',
                fontWeight: 700,
                fontSize: '1.45rem',
                letterSpacing: '-0.02em',
                color: 'var(--color-moon-blue)',
                display: 'block',
                lineHeight: 1,
                textShadow: '0 0 15px rgba(168, 217, 255, 0.4)'
              }}
            >
              Yuvvi
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                color: 'var(--color-lavender)',
                letterSpacing: '0.06em',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}
            >
              The Living Dream World
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.85rem'
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => sound.playChime(698.46, 'sine', 0.25)}
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.96rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-gold)' : 'var(--color-text-sub)',
                position: 'relative',
                padding: '0.4rem 0.2rem',
                transition: 'color 0.2s ease'
              })}
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '10%',
                        right: '10%',
                        height: '2px',
                        background: 'linear-gradient(90deg, #FFD985, #B6A4FF)',
                        borderRadius: '99px',
                        boxShadow: '0 0 8px rgba(255, 217, 133, 0.8)'
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Forgotten Stars Counter Badge */}
          <button
            onClick={() => {
              sound.playChime(880, 'sine', 0.45);
              setShowConstellationModal(true);
            }}
            title="View Forgotten Stars Constellation Map"
            aria-label={`Collected ${collected.length} of ${total} Forgotten Stars. Click to view constellation map.`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.42rem 0.95rem',
              borderRadius: '999px',
              border: '1.5px solid rgba(255, 217, 133, 0.4)',
              backgroundColor: collected.length === total ? 'rgba(109, 85, 168, 0.45)' : 'rgba(30, 30, 59, 0.65)',
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-rounded)',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(255, 217, 133, 0.2)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(6px)'
            }}
          >
            <Star
              size={15}
              fill={collected.length > 0 ? '#FFD985' : 'transparent'}
              stroke="#FFD985"
            />
            <span>Stars: {collected.length}/{total}</span>
            {collected.length === total && <Sparkles size={14} className="animate-twinkle" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundMuted ? 'Turn Sound On' : 'Mute Sounds'}
            aria-label={soundMuted ? 'Turn Sound On' : 'Mute Sounds'}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1.5px solid var(--color-indigo-border)',
              backgroundColor: 'rgba(30, 30, 59, 0.65)',
              color: soundMuted ? 'var(--color-text-muted)' : 'var(--color-moon-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {soundMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              border: '1.5px solid var(--color-indigo-border)',
              backgroundColor: 'rgba(30, 30, 59, 0.8)',
              color: 'var(--color-text-main)',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(182, 164, 255, 0.15)',
            backgroundColor: 'rgba(13, 13, 30, 0.95)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            backdropFilter: 'blur(16px)'
          }}
          className="mobile-drawer"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleNavClick}
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '1.05rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-gold)' : 'var(--color-text-main)',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(109, 85, 168, 0.3)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              })}
            >
              <span>{link.label}</span>
              {location.pathname === link.to && <span style={{ color: 'var(--color-gold)' }}>✨</span>}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 820px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
