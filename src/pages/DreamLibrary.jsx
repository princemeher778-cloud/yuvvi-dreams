import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CollectibleStar } from '../components/CollectibleStar';
import { YuvviCharacter } from '../components/YuvviCharacter';
import {
  BookOpen,
  X,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Compass,
  Feather,
  Waves,
  Moon,
  Cloud
} from 'lucide-react';
import { sound } from '../utils/audio';

const DREAMS_DATA = [
  {
    id: 'flying-dream',
    title: 'The Flying Dream',
    badge: 'Skyward Memories',
    preview: 'A dream about soaring effortlessly above cotton-candy clouds without an airplane.',
    fullStory: `
      Long ago, a young child looked out of an evening train window and imagined leaping into the pink twilight.
      In this dream, gravity was nothing more than a suggestion. You simply tilted your chin toward the stars,
      spread your arms, and your feet lifted quietly from the grass. The breeze smelled of honey and rain,
      and cool evening clouds parted softly like silk scarves.
    `,
    icon: Cloud,
    color: '#D99BCB',
    ambientType: 'clouds',
    quote: '"If you believe for just five seconds, the sky will hold you."'
  },
  {
    id: 'ocean-dream',
    title: 'The Ocean Dream',
    badge: 'Deep Sea Glass',
    preview: 'A dream about discovering a glowing miniature underwater kingdom tucked inside a coral grove.',
    fullStory: `
      Someone once fell asleep listening to rain tapping on the windowpane and found themselves breathing comfortably
      under turquoise ocean water. Deep below the surface, bioluminescent sea anemones glowed in violet and gold.
      Tiny glass seahorses swam alongside, guiding you to a castle built entirely of iridescent oyster pearls and
      singing conch shells.
    `,
    icon: Waves,
    color: '#A8D9FF',
    ambientType: 'ocean',
    quote: '"The ocean remembers every song the rain ever whispered to it."'
  },
  {
    id: 'moon-garden',
    title: 'The Moon Garden',
    badge: 'Lunar Petals',
    preview: 'A dream about planting silver seeds in moon dust and watching phosphorescent flowers unfurl.',
    fullStory: `
      In an old telescope observatory, an astronomer dreamed of stepping onto the quiet surface of the moon with
      a small brass watering can. Where their boots left silver footprints, midnight-blue lilies and glowing starlight
      roses began to bloom. Without wind or gravity, each petal unfurled in slow, hypnotic ballet, releasing perfumed
      stardust across the craters.
    `,
    icon: Moon,
    color: '#B6A4FF',
    ambientType: 'moon',
    quote: '"Flowers don\'t need sunshine when they are nourished by wonder."'
  },
  {
    id: 'clockwork-butterfly',
    title: 'The Clockwork Butterfly',
    badge: 'Mechanical Daydream',
    preview: 'A dream of a tiny brass butterfly that winds its own gears whenever someone laughs.',
    fullStory: `
      A watchmaker once stayed awake late into the night, dreaming of an invention that didn't just measure seconds,
      but preserved joy. From tiny gears and gossamer wire, a little butterfly emerged. When it flew, its brass
      wings produced the melody of an antique music box, leaving a trail of golden gear-teeth in the air.
    `,
    icon: Feather,
    color: '#FFD985',
    ambientType: 'gears',
    quote: '"Time was never meant to tick away; it was meant to dance."'
  }
];

export const DreamLibrary = () => {
  const [selectedDream, setSelectedDream] = useState(null);
  const [approachAnim, setApproachAnim] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedDream) {
        setSelectedDream(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDream]);

  const handleOpenDream = (dream) => {
    sound.playLanternGlow();
    setApproachAnim(true);
    setTimeout(() => {
      sound.playStarReveal();
      setSelectedDream(dream);
      setApproachAnim(false);
    }, 400);
  };

  return (
    <div className="dream-library-page" style={{ paddingTop: '2.5rem', paddingBottom: '5.5rem', position: 'relative', zIndex: 5 }}>
      <div className="container">
        {/* Navigation & Breadcrumb */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <button
            className="btn btn-ghost"
            onClick={() => {
              sound.playChime(587.33, 'sine', 0.3);
              navigate('/');
            }}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Home</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/workshop"
              className="btn btn-secondary"
              onClick={() => sound.playChime(659.25, 'sine', 0.4)}
              style={{ fontSize: '0.88rem', padding: '0.55rem 1.15rem' }}
            >
              <span>Visit Yuvvi's Workshop</span>
              <Compass size={16} />
            </Link>
          </div>
        </div>

        {/* Hero Title & Atmosphere */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
          <div className="badge badge-berry" style={{ marginBottom: '0.85rem' }}>
            <BookOpen size={15} />
            <span>Archive of Lost Daydreams</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.4rem)', marginBottom: '1rem' }}>
            The Dream Library
          </h1>
          <p style={{ fontSize: '1.14rem', color: 'var(--color-text-sub)', lineHeight: 1.68 }}>
            Hidden among drifting clouds and velvet-bound tomes, here rest the dreams people once imagined before morning.
            Select any dream jar to watch Yuvvi illuminate its memories.
          </p>

          {/* Interactive instruction pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(30, 30, 59, 0.75)',
              padding: '0.45rem 1.15rem',
              borderRadius: '999px',
              border: '1px solid rgba(182, 164, 255, 0.25)',
              marginTop: '1.3rem',
              fontSize: '0.86rem',
              color: 'var(--color-gold)'
            }}
          >
            <span>✨ Tap any dream jar to part the clouds and awaken its story.</span>
          </div>
        </div>

        {/* DREAM JARS GRID */}
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.2rem',
            marginBottom: '4.5rem'
          }}
        >
          {/* Secret Collectible Star #2 (Whispering Folio) */}
          <div
            style={{
              position: 'absolute',
              top: '-35px',
              right: '25px',
              zIndex: 10
            }}
          >
            <CollectibleStar
              id="library-star"
              size={38}
              hint="Look closely behind the floating bookshelf! Click to gather the Whispering Folio star."
            />
          </div>

          {DREAMS_DATA.map((dream) => {
            const Icon = dream.icon;
            return (
              <div
                key={dream.id}
                className="story-card"
                role="button"
                tabIndex={0}
                onClick={() => handleOpenDream(dream)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenDream(dream);
                  }
                }}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `3px solid ${dream.color}`
                }}
                aria-label={`Open dream details: ${dream.title}`}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(30, 30, 59, 0.8)',
                        border: `2px solid ${dream.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: dream.color,
                        boxShadow: `0 0 20px ${dream.color}44`
                      }}
                    >
                      <Icon size={28} />
                    </div>

                    <span className="badge" style={{ fontSize: '0.78rem' }}>
                      {dream.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.45rem', marginBottom: '0.65rem', color: 'var(--color-text-main)' }}>
                    {dream.title}
                  </h3>

                  <p style={{ fontSize: '0.96rem', color: 'var(--color-text-sub)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {dream.preview}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid rgba(182, 164, 255, 0.12)'
                  }}
                >
                  <span style={{ fontSize: '0.86rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                    Inspect Dream Jar
                  </span>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(109, 85, 168, 0.35)',
                      color: 'var(--color-lavender)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Sparkles size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Yuvvi Story Companion Box */}
        <div
          className="story-card"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2.5rem',
            padding: '2.8rem'
          }}
        >
          <div style={{ flex: '1 1 360px' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
              Library Lore
            </span>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.75rem' }}>
              "How does Yuvvi catch a dream?"
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-sub)', lineHeight: 1.68 }}>
              Dreams are made of quiet weight. When someone awakens and forgets what made them smile in sleep,
              the dream drifts upward toward the clouds. Yuvvi catches them using brass nets spun from stardust,
              places them in glass jars, and sings them lullabies until they are ready to be reinvented in the Workshop.
            </p>
            <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/workshop" className="btn btn-primary" onClick={() => sound.playChime(659.25, 'sine', 0.4)}>
                <span>Travel to the Workshop</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/" className="btn btn-secondary">
                <span>Back to Home</span>
              </Link>
            </div>
          </div>

          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <YuvviCharacter size="medium" expression="curious" customMessage="Every book here has a heartbeat! 📖" />
          </div>
        </div>

        {/* ACCESSIBLE DREAM DETAIL MODAL */}
        {selectedDream && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dream-modal-title"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(8, 8, 17, 0.88)',
              backdropFilter: 'blur(14px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem'
            }}
            onClick={() => setSelectedDream(null)}
          >
            <div
              className="story-card"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '700px',
                maxHeight: '90vh',
                overflowY: 'auto',
                backgroundColor: '#111124',
                border: `2px solid ${selectedDream.color}`,
                boxShadow: `0 25px 70px rgba(0, 0, 0, 0.95), 0 0 35px ${selectedDream.color}44`,
                padding: '2.5rem',
                position: 'relative',
                animation: 'riseIntoSky 0.3s ease-out'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDream(null)}
                aria-label="Close dream details"
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

              {/* Dream Animated Scene Banner */}
              <div
                style={{
                  height: '190px',
                  borderRadius: '16px',
                  backgroundColor: '#090916',
                  position: 'relative',
                  overflow: 'hidden',
                  marginBottom: '1.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(182, 164, 255, 0.2)'
                }}
              >
                {selectedDream.ambientType === 'clouds' && (
                  <svg viewBox="0 0 400 160" style={{ width: '100%', height: '100%' }}>
                    <path
                      d="M 50 110 Q 70 80 110 90 Q 140 70 170 95 Q 200 80 230 110 Z"
                      fill="#8E73CE"
                      opacity="0.4"
                      className="animate-float"
                    />
                    <path
                      d="M 210 130 Q 240 100 280 110 Q 310 90 350 120 Z"
                      fill="#B6A4FF"
                      opacity="0.5"
                      className="animate-lantern"
                    />
                    <g transform="translate(190, 60)" className="animate-float">
                      <path d="M -20 0 Q -10 -15 0 0 Q 10 -15 20 0" stroke="#FFD985" strokeWidth="3" fill="none" />
                      <circle cx="0" cy="-2" r="3" fill="#FFFFFF" />
                    </g>
                    <circle cx="100" cy="40" r="2" fill="#FFD985" className="animate-twinkle" />
                    <circle cx="290" cy="50" r="2.5" fill="#A8D9FF" className="animate-twinkle" />
                  </svg>
                )}

                {selectedDream.ambientType === 'ocean' && (
                  <svg viewBox="0 0 400 160" style={{ width: '100%', height: '100%' }}>
                    <path d="M 0 140 Q 100 120 200 135 T 400 130 L 400 160 L 0 160 Z" fill="#152B3A" opacity="0.8" />
                    <circle cx="120" cy="90" r="6" fill="rgba(168,217,255,0.4)" className="animate-float" />
                    <circle cx="130" cy="50" r="4" fill="rgba(168,217,255,0.5)" className="animate-float" />
                    <circle cx="280" cy="70" r="8" fill="rgba(168,217,255,0.3)" className="animate-float" />
                    <polygon
                      points="200,80 204,92 216,92 206,100 210,112 200,104 190,112 194,100 184,92 196,92"
                      fill="#FFD985"
                      className="animate-twinkle"
                    />
                  </svg>
                )}

                {selectedDream.ambientType === 'moon' && (
                  <svg viewBox="0 0 400 160" style={{ width: '100%', height: '100%' }}>
                    <ellipse cx="200" cy="180" rx="260" ry="80" fill="#1C1838" />
                    <g transform="translate(200, 105)" className="animate-pulse-glow">
                      <path d="M 0 35 L 0 10" stroke="#B6A4FF" strokeWidth="2.5" />
                      <ellipse cx="-12" cy="5" rx="10" ry="16" fill="#FFD985" opacity="0.8" />
                      <ellipse cx="12" cy="5" rx="10" ry="16" fill="#FFD985" opacity="0.8" />
                      <ellipse cx="0" cy="0" rx="8" ry="18" fill="#FFFFFF" />
                      <circle cx="0" cy="0" r="3.5" fill="#FFE082" />
                    </g>
                    <circle cx="160" cy="70" r="2" fill="#FFFFFF" className="animate-twinkle" />
                    <circle cx="240" cy="65" r="2.5" fill="#A8D9FF" className="animate-twinkle" />
                  </svg>
                )}

                {selectedDream.ambientType === 'gears' && (
                  <svg viewBox="0 0 400 160" style={{ width: '100%', height: '100%' }}>
                    <circle cx="200" cy="80" r="30" stroke="#FFD985" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                    <circle cx="200" cy="80" r="14" stroke="#B6A4FF" strokeWidth="2" fill="none" />
                    <path d="M 200 80 Q 160 40 180 80 Q 160 120 200 80" fill="#FFD985" opacity="0.75" />
                    <path d="M 200 80 Q 240 40 220 80 Q 240 120 200 80" fill="#FFD985" opacity="0.75" />
                    <circle cx="200" cy="80" r="4" fill="#FFFFFF" />
                  </svg>
                )}

                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '16px',
                    color: 'var(--color-gold)',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-rounded)'
                  }}
                >
                  Memory Resonance ✨
                </span>
              </div>

              {/* Title & Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                <span className="badge badge-purple">
                  {selectedDream.badge}
                </span>
              </div>
              <h2 id="dream-modal-title" style={{ fontSize: '1.95rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                {selectedDream.title}
              </h2>

              <blockquote
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.12rem',
                  color: 'var(--color-gold)',
                  marginBottom: '1.35rem',
                  borderLeft: '3px solid var(--color-gold)',
                  paddingLeft: '0.85rem'
                }}
              >
                {selectedDream.quote}
              </blockquote>

              <p style={{ fontSize: '1.05rem', color: 'var(--color-text-sub)', lineHeight: 1.72, marginBottom: '2.2rem' }}>
                {selectedDream.fullStory}
              </p>

              {/* Action Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    sound.playChime(784, 'sine', 0.5);
                    setSelectedDream(null);
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Library</span>
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    sound.playChime(880, 'sine', 0.5);
                    navigate('/workshop');
                  }}
                >
                  <span>Build with this Dream in Workshop</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
