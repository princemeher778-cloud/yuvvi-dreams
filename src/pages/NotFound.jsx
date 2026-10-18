import React from 'react';
import { Link } from 'react-router-dom';
import { YuvviCharacter } from '../components/YuvviCharacter';
import { Home, Compass } from 'lucide-react';
import { sound } from '../utils/audio';

export const NotFound = () => {
  return (
    <div
      style={{
        paddingTop: '5rem',
        paddingBottom: '6.5rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 5
      }}
    >
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="story-card" style={{ padding: '3.2rem 2.2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <YuvviCharacter
              size="medium"
              expression="curious"
              customMessage="Don't worry, follow my lantern! 🏮"
            />
          </div>

          <span className="badge badge-berry" style={{ marginBottom: '0.85rem' }}>
            Page Not Found • 404
          </span>

          <h1 style={{ fontSize: '2.3rem', color: 'var(--color-moon-blue)', marginBottom: '0.85rem' }}>
            Lost in the Mist of Unremembered Things
          </h1>

          <p style={{ fontSize: '1.08rem', color: 'var(--color-text-sub)', lineHeight: 1.68, marginBottom: '2.2rem' }}>
            Even Yuvvi’s compass isn't sure where this path leads! But whenever you feel lost, the lantern's glow
            will guide you safely back into the starlight.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/"
              className="btn btn-gold"
              onClick={() => sound.playChime(659.25, 'sine', 0.5)}
              style={{ padding: '0.85rem 1.9rem' }}
            >
              <Home size={18} />
              <span>Return Safely Home</span>
            </Link>

            <Link
              to="/workshop"
              className="btn btn-secondary"
              onClick={() => sound.playChime(784, 'sine', 0.4)}
              style={{ padding: '0.85rem 1.7rem' }}
            >
              <Compass size={18} />
              <span>Visit The Workshop</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
