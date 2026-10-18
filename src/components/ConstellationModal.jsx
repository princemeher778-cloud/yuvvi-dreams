import React, { useEffect } from 'react';
import { useStars } from '../context/StarContext';
import { Sparkles, X, RotateCcw, Check, Star } from 'lucide-react';

export const ConstellationModal = () => {
  const {
    collected,
    total,
    isAllCollected,
    allStars,
    showConstellationModal,
    setShowConstellationModal,
    resetProgress,
    triggerConstellationConfetti
  } = useStars();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showConstellationModal) {
        setShowConstellationModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConstellationModal, setShowConstellationModal]);

  if (!showConstellationModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="constellation-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 8, 17, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={() => setShowConstellationModal(false)}
    >
      <div
        className="story-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#111124',
          border: '2px solid var(--color-gold)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 217, 133, 0.25)',
          padding: '2.4rem',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowConstellationModal(false)}
          aria-label="Close constellation modal"
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            borderRadius: '50%',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(182, 164, 255, 0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X size={22} color="var(--color-lavender)" />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.4rem 1.1rem',
              borderRadius: '999px',
              backgroundColor: isAllCollected ? 'rgba(109, 85, 168, 0.35)' : 'rgba(30, 30, 59, 0.8)',
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-rounded)',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '0.75rem',
              border: '1px solid rgba(255, 217, 133, 0.35)'
            }}
          >
            <Sparkles size={16} />
            <span>Forgotten Stars: {collected.length} of {total} Found</span>
          </div>

          <h2 id="constellation-title" style={{ fontSize: '1.9rem', color: 'var(--color-text-main)' }}>
            {isAllCollected ? "Yuvvi's Living Constellation" : "The Midnight Starlight Map"}
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-sub)', marginTop: '0.4rem' }}>
            {isAllCollected
              ? "All five lost dreams have returned to shine together in the night sky."
              : "Five delicate stars remain hidden across Yuvvi's world. Collect them all to unlock the secret message."}
          </p>
        </div>

        {/* Constellation Canvas SVG */}
        <div
          style={{
            background: 'linear-gradient(180deg, #090916 0%, #15152D 100%)',
            borderRadius: '16px',
            padding: '1.2rem',
            marginBottom: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            border: '1.5px solid rgba(182, 164, 255, 0.2)'
          }}
        >
          <svg viewBox="0 0 500 240" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Background Nebulae & Stars */}
            <circle cx="80" cy="40" r="1.5" fill="#FFFFFF" opacity="0.4" />
            <circle cx="180" cy="30" r="1.2" fill="#FFFFFF" opacity="0.5" />
            <circle cx="340" cy="50" r="1.8" fill="#FFFFFF" opacity="0.6" />
            <circle cx="440" cy="180" r="1.2" fill="#FFFFFF" opacity="0.3" />
            <circle cx="280" cy="200" r="1.5" fill="#FFFFFF" opacity="0.4" />
            <circle cx="60" cy="190" r="1.2" fill="#FFFFFF" opacity="0.5" />

            {/* Constellation Connection Lines */}
            {isAllCollected && (
              <g stroke="#FFD985" strokeWidth="2.2" strokeDasharray="4 4" opacity="0.9">
                <line x1="80" y1="160" x2="160" y2="60" />
                <line x1="160" y1="60" x2="280" y2="50" />
                <line x1="280" y1="50" x2="420" y2="100" />
                <line x1="420" y1="100" x2="320" y2="190" />
                <line x1="320" y1="190" x2="80" y2="160" />
                <line x1="160" y1="60" x2="320" y2="190" strokeOpacity="0.4" />
              </g>
            )}

            {/* Individual Star Nodes */}
            {[
              { id: 'home-star', x: 80, y: 160, label: 'Lantern' },
              { id: 'library-star', x: 160, y: 60, label: 'Folio' },
              { id: 'workshop-star', x: 280, y: 50, label: 'Workshop' },
              { id: 'garden-star', x: 420, y: 100, label: 'Garden' },
              { id: 'story-star', x: 320, y: 190, label: 'Starlight' }
            ].map((node) => {
              const isFound = collected.includes(node.id);
              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  {isFound ? (
                    <>
                      <circle cx="0" cy="0" r="18" fill="rgba(255, 217, 133, 0.25)" className="animate-twinkle" />
                      <circle cx="0" cy="0" r="8" fill="#FFD985" />
                      <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                      <text
                        x="0"
                        y="23"
                        textAnchor="middle"
                        fill="#FFD985"
                        fontSize="11"
                        fontFamily="var(--font-rounded)"
                        fontWeight="600"
                      >
                        {node.label} ⭐
                      </text>
                    </>
                  ) : (
                    <>
                      <circle cx="0" cy="0" r="7" fill="rgba(255, 255, 255, 0.15)" stroke="#6C6788" strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="2" fill="#8E89A8" />
                      <text
                        x="0"
                        y="22"
                        textAnchor="middle"
                        fill="#8E89A8"
                        fontSize="10"
                        fontFamily="var(--font-sans)"
                      >
                        {node.label} ?
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* All Collected Secret Box */}
        {isAllCollected && (
          <div
            style={{
              backgroundColor: 'rgba(109, 85, 168, 0.25)',
              border: '2px dashed var(--color-gold)',
              borderRadius: '16px',
              padding: '1.4rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              animation: 'riseIntoSky 0.4s ease-out'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🌟 💫 🌟</div>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
              Secret Whisper from Yuvvi
            </h3>
            <blockquote
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.18rem',
                color: 'var(--color-text-main)',
                lineHeight: 1.5,
                margin: '0.5rem 0'
              }}
            >
              "You found the dreams everyone else forgot. I think you're one of us now. ✨"
            </blockquote>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-lavender)', marginTop: '0.4rem', fontWeight: 600 }}>
              Honorary Title Granted: Keeper of the Forgotten Stars
            </p>
            <div style={{ marginTop: '0.85rem' }}>
              <button
                className="btn btn-gold"
                onClick={triggerConstellationConfetti}
                style={{ fontSize: '0.88rem', padding: '0.55rem 1.25rem' }}
              >
                <Sparkles size={16} /> Sprinkle Stardust Again
              </button>
            </div>
          </div>
        )}

        {/* Star List Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {allStars.map((s) => {
            const isFound = collected.includes(s.id);
            return (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: isFound ? 'rgba(255, 217, 133, 0.12)' : 'rgba(30, 30, 59, 0.5)',
                  border: isFound ? '1.5px solid var(--color-gold)' : '1px solid var(--color-indigo-border)'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isFound ? 'var(--color-gold)' : 'rgba(40, 40, 75, 0.8)',
                    color: isFound ? '#080811' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {isFound ? <Check size={16} strokeWidth={3} /> : <Star size={14} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-rounded)',
                        fontWeight: 600,
                        color: isFound ? 'var(--color-gold)' : 'var(--color-text-sub)',
                        fontSize: '0.95rem'
                      }}
                    >
                      {s.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: isFound ? 'var(--color-moon-blue)' : 'var(--color-text-muted)'
                      }}
                    >
                      {isFound ? 'Discovered ✨' : 'Undiscovered'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                    {isFound ? s.quote : `Hint: ${s.hint}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={resetProgress}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} /> Reset Star Journey
          </button>
          <button className="btn btn-secondary" onClick={() => setShowConstellationModal(false)}>
            Close Map
          </button>
        </div>
      </div>
    </div>
  );
};
