import React, { useState, useEffect } from 'react';
import { useStars } from '../context/StarContext';
import { Sparkles, Moon, RotateCcw, X, Heart, Shield } from 'lucide-react';
import { sound } from '../utils/audio';

export const VisitorMemory = () => {
  const { collected, total } = useStars();
  const [profile, setProfile] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('yuvvi_visitor_memory');
      const now = Date.now();

      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = {
          ...parsed,
          visitCount: (parsed.visitCount || 1) + 1,
          lastSeen: now
        };
        localStorage.setItem('yuvvi_visitor_memory', JSON.stringify(updated));
        setProfile(updated);
      } else {
        const initial = {
          firstSeen: now,
          visitCount: 1,
          lastSeen: now
        };
        localStorage.setItem('yuvvi_visitor_memory', JSON.stringify(initial));
        setProfile(initial);
      }
    } catch {
      // Storage unavailable fallback
    }
  }, []);

  const handleReset = () => {
    sound.playChime(523.25, 'sine', 0.4);
    try {
      localStorage.removeItem('yuvvi_visitor_memory');
      localStorage.removeItem('yuvvi_collected_stars');
      localStorage.removeItem('yuvvi_dream_guestbook');
      localStorage.removeItem('yuvvi_day_night_mode');
    } catch {}

    setResetDone(true);
    setTimeout(() => {
      setProfile(null);
      setDismissed(true);
    }, 1800);
  };

  if (!profile || dismissed) return null;

  // Only show special welcome back greeting for returning visitors (visitCount > 1)
  const isReturning = profile.visitCount > 1;

  return (
    <aside
      className="visitor-memory-toast"
      aria-label="Personalized Dreamer Greeting"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        maxWidth: '380px',
        zIndex: 880,
        backgroundColor: 'var(--color-card-bg)',
        border: '1.5px solid var(--color-lavender)',
        borderRadius: '20px',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-lg)',
        backdropFilter: 'blur(16px)',
        animation: 'riseIntoSky 0.4s ease-out'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.3rem' }}>🏮</span>
          <h4 style={{ margin: 0, fontSize: '0.98rem', color: 'var(--color-moon-blue)', fontFamily: 'var(--font-rounded)' }}>
            {isReturning ? 'Welcome Back, Dreamer!' : 'Welcome to Yuvvi’s World!'}
          </h4>
        </div>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss greeting"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '2px'
          }}
        >
          <X size={16} />
        </button>
      </div>

      <p style={{ margin: '0 0 10px', fontSize: '0.86rem', color: 'var(--color-text-sub)', lineHeight: 1.5 }}>
        {isReturning
          ? `Yuvvi kept your lantern glowing. This is your visit #${profile.visitCount}. You’ve found ${collected.length} of ${total} Forgotten Stars.`
          : `Yuvvi is delighted you stopped by! Explore the Dream Library, plant a wish in the garden, and gather secret stars.`}
      </p>

      {/* Memory Details & Privacy Reset */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--color-card-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
          <Shield size={12} />
          <span>Local memory only</span>
        </div>

        <button
          onClick={handleReset}
          title="Clear all saved preferences and cookies"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: '0.74rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'underline'
          }}
        >
          <RotateCcw size={11} />
          <span>{resetDone ? 'Memory Cleared ✨' : 'Reset My Memory'}</span>
        </button>
      </div>
    </aside>
  );
};
