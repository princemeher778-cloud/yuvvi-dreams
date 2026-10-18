import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

export const Footer = () => {
  const [sparkleCount, setSparkleCount] = useState(0);

  const handleSparkle = () => {
    sound.playChime(1046.5, 'sine', 0.6);
    setSparkleCount((c) => c + 1);
  };

  return (
    <footer
      style={{
        backgroundColor: '#070710',
        borderTop: '1.5px solid rgba(182, 164, 255, 0.14)',
        paddingTop: '3.8rem',
        paddingBottom: '2.5rem',
        marginTop: '6rem',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Identity & Story Message */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-rounded)',
                  fontWeight: 700,
                  fontSize: '1.65rem',
                  color: 'var(--color-moon-blue)',
                  textShadow: '0 0 15px rgba(168, 217, 255, 0.4)'
                }}
              >
                Yuvvi
              </span>
              <span className="badge badge-gold">Small Ghost. Endless Wonders.</span>
            </div>
            <p style={{ fontSize: '0.94rem', color: 'var(--color-text-sub)', lineHeight: 1.65, maxWidth: '340px' }}>
              Between the dreams you remember and the dreams you almost forget, Yuvvi gathers lost wonders and turns them
              into impossible little inventions.
            </p>
          </div>

          {/* Storybook Destinations */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-rounded)',
                fontSize: '1.05rem',
                color: 'var(--color-text-main)',
                marginBottom: '1rem',
                fontWeight: 600
              }}
            >
              Dream Destinations
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { to: '/', label: 'Home Entrance' },
                { to: '/dream-library', label: 'The Dream Library' },
                { to: '/workshop', label: "Yuvvi's Workshop" },
                { to: '/dream-garden', label: 'Your Dream Garden' },
                { to: '/story', label: "Yuvvi's Illustrated Story" }
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => sound.playChime(784, 'sine', 0.25)}
                    style={{
                      textDecoration: 'none',
                      color: 'var(--color-text-sub)',
                      fontSize: '0.92rem',
                      transition: 'color 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-sub)')}
                  >
                    <span style={{ color: 'var(--color-lavender)' }}>✦</span> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Star Wish / Little Wonder */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-rounded)',
                fontSize: '1.05rem',
                color: 'var(--color-text-main)',
                marginBottom: '0.75rem',
                fontWeight: 600
              }}
            >
              Touch of Magic
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-sub)', marginBottom: '1rem' }}>
              Send a gentle wave of stardust into the quiet air.
            </p>
            <button
              className="btn btn-secondary"
              onClick={handleSparkle}
              style={{
                fontSize: '0.9rem',
                padding: '0.65rem 1.3rem',
                gap: '8px'
              }}
            >
              <Sparkles size={16} color="var(--color-gold)" />
              <span>Sparkle a Little Star</span>
              {sparkleCount > 0 && (
                <span className="badge badge-gold" style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem' }}>
                  +{sparkleCount}
                </span>
              )}
            </button>
            <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Tip: Five forgotten stars are hidden across the website!
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(182, 164, 255, 0.1)',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.86rem',
            color: 'var(--color-text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted with</span>
            <Heart size={14} fill="var(--color-rose)" color="var(--color-rose)" />
            <span>and stardust for dreamers everywhere.</span>
          </div>

          <div>
            <span>Yuvvi 2.0 • The Living Dream World ✨</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
