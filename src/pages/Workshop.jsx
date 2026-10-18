import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CollectibleStar } from '../components/CollectibleStar';
import { YuvviCharacter } from '../components/YuvviCharacter';
import { DreamCatcherGame } from '../components/DreamCatcherGame';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MapPin,
  RefreshCw,
  Scroll,
  Heart,
  Shield,
  Lightbulb,
  Flower2
} from 'lucide-react';
import { sound } from '../utils/audio';

const LANTERN_DREAMS = [
  {
    dreamer: 'A quiet baker before sunrise',
    message: 'To bake bread so warm and airy that whoever tastes it remembers their very first picnic by the willow tree.'
  },
  {
    dreamer: 'An old bridge architect',
    message: 'A bridge made of river stones that only appears when two separated friends walk toward each other.'
  },
  {
    dreamer: 'A schoolgirl on a rainy Tuesday',
    message: 'Pockets deep enough to hold three fluffy clouds and a pocket-sized rainbow for rainy days.'
  },
  {
    dreamer: 'A weary sailor under Orion',
    message: 'A lighthouse whose beam plays a gentle lullaby for tired whales and migrating sea turtles.'
  },
  {
    dreamer: 'A bookbinder in autumn',
    message: 'A diary whose pages smell of spiced apples and turn themselves to comforting poems when you feel lonely.'
  },
  {
    dreamer: 'A child counting shooting stars',
    message: 'To build a ladder made of braided starlight to visit the moon and have chamomile tea with the craters.'
  }
];

const DREAM_WORLDS = [
  {
    id: 'cloud-isles',
    name: 'The Cloud Archipelago of Lost Laughter',
    coords: { x: 18, y: 35 },
    climate: 'Soft breeze & lemon daylight',
    description: 'Floating islands woven from forgotten chuckles. The trees bear fruit that sounds like wind chimes when ripe.',
    vignette: 'Islands drifted past like white swans, each carrying quiet swings and dandelion fields.'
  },
  {
    id: 'starlight-observatory',
    name: 'The Starlight Observatory of What-Ifs',
    coords: { x: 50, y: 22 },
    climate: 'Midnight violet & cosmic quiet',
    description: 'A spiraling brass tower perched atop a meteor. Its giant lens peers into alternate paths people never took.',
    vignette: 'Looking into the brass eyepiece, you catch a glimpse of the symphony you might have composed.'
  },
  {
    id: 'deep-forest',
    name: 'The Blanket Fort Woods',
    coords: { x: 82, y: 40 },
    climate: 'Cozy amber lantern warmth',
    description: 'An ancient pine forest where the canopies are patchwork quilts and the rivers flow with warm spiced cider.',
    vignette: 'Flashlight beams dance across pillow moss where tiny woodland mice read fairy tales.'
  },
  {
    id: 'velvet-ocean',
    name: 'The Velvet Ocean of Midnight Lullabies',
    coords: { x: 32, y: 75 },
    climate: 'Phosphorescent tide & lilac mist',
    description: 'A sea so calm that reflection and reality trade places. Glowing paper boats carry unspoken wishes across the horizon.',
    vignette: 'Gentle waves ripple in time with the heartbeat of whoever stands along the shore.'
  },
  {
    id: 'clocktower',
    name: 'The Clocktower of Frozen Moments',
    coords: { x: 68, y: 78 },
    climate: 'Golden sunset paused forever',
    description: 'A grand clock face where the pendulum sways gently between 5:44 PM and 5:45 PM—the exact minute school let out for summer.',
    vignette: 'Golden sunbeams dust the copper bells, and nobody is ever in a rush to leave.'
  }
];

const ADVENTURE_THEMES = [
  {
    id: 'curiosity',
    label: 'Curiosity',
    icon: Lightbulb,
    color: '#FFD985',
    lead: 'Yuvvi discovers an antique brass key in your pocket that hums in B-minor.',
    story: `
      "Listen!" whispers Yuvvi, tapping the key against the Dream Lantern.
      A tiny door appears in the trunk of an oak tree, glowing with peach-colored light.
      Inside, you find a miniature workshop filled with clockwork fireflies.
      Each firefly carries a tiny compass pointing toward a dream you had when you were six years old.
      Yuvvi hands you a small magnifying glass made of quartz: "Every mystery is just a dream waiting to be opened."
    `
  },
  {
    id: 'courage',
    label: 'Courage',
    icon: Shield,
    color: '#D99BCB',
    lead: 'The lantern flickers as a shadow of doubt passes over the moonlit path.',
    story: `
      You step forward first, holding out a single cupped hand.
      Yuvvi floats close to your shoulder, his golden star shining brightly on his forehead.
      Together, you realize the shadow isn't a monster at all—it's a forgotten dream of riding a thundercloud!
      Yuvvi hands you reins woven of morning dew. You take a breath, leap into the saddle, and steer the cloud
      safely into a peaceful rain shower that waters a thirsty village below.
    `
  },
  {
    id: 'friendship',
    label: 'Friendship',
    icon: Heart,
    color: '#A8D9FF',
    lead: 'Yuvvi notices a silver thread trailing behind you, connecting to someone far away.',
    story: `
      Yuvvi gently winds the silver thread around a brass bobbin.
      With every gentle turn, a warm memory echoes softly: a shared secret umbrella, laughing until your stomach hurt,
      and sharing the last cookie.
      Yuvvi knots a golden star onto the end and releases it into the wind:
      "True friends share the same constellation, no matter how many miles lie between their windows."
    `
  },
  {
    id: 'wonder',
    label: 'Wonder',
    icon: Sparkles,
    color: '#B6A4FF',
    lead: 'You look up and notice that the stars aren\'t fixed—they are singing in slow harmony.',
    story: `
      Yuvvi catches a single falling note in a glass vial.
      When uncorked, the sound blossoms into a miniature aurora borealis that fills the room with violet and teal light.
      Tiny paper constellations flutter around your head like curious moths.
      "See?" Yuvvi beams with rosy cheeks. "The universe is always telling stories. We just have to listen with our hearts."
    `
  }
];

export const Workshop = () => {
  const navigate = useNavigate();

  // Invention 1: Dream Lantern state
  const [currentLanternIndex, setCurrentLanternIndex] = useState(0);
  const [lanternExpanded, setLanternExpanded] = useState(false);

  // Invention 2: Dreamscape Code state
  const [activeWorldId, setActiveWorldId] = useState('cloud-isles');
  const activeWorld = DREAM_WORLDS.find((w) => w.id === activeWorldId) || DREAM_WORLDS[0];

  // Invention 3: The Starry Companion state
  const [selectedThemeId, setSelectedThemeId] = useState('wonder');
  const [adventureKey, setAdventureKey] = useState(0);
  const activeAdventure = ADVENTURE_THEMES.find((t) => t.id === selectedThemeId) || ADVENTURE_THEMES[0];

  const handleLanternClick = () => {
    sound.playLanternGlow();
    setLanternExpanded(true);
    setCurrentLanternIndex((prev) => (prev + 1) % LANTERN_DREAMS.length);
  };

  const handleNextDream = () => {
    sound.playChime(784, 'sine', 0.4);
    setCurrentLanternIndex((prev) => (prev + 1) % LANTERN_DREAMS.length);
    setLanternExpanded(true);
  };

  const handleSelectWorld = (worldId) => {
    sound.playChime(698.46, 'sine', 0.35);
    setActiveWorldId(worldId);
  };

  const handleSelectTheme = (themeId) => {
    sound.playChime(659.25, 'sine', 0.35);
    setSelectedThemeId(themeId);
    setAdventureKey((k) => k + 1);
  };

  const activeDream = LANTERN_DREAMS[currentLanternIndex];

  return (
    <div className="workshop-page" style={{ paddingTop: '2.5rem', paddingBottom: '5.5rem', position: 'relative', zIndex: 5 }}>
      <div className="container">
        {/* Navigation & Header */}
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
              to="/dream-garden"
              className="btn btn-secondary"
              onClick={() => sound.playChime(659.25, 'sine', 0.4)}
              style={{ fontSize: '0.88rem', padding: '0.55rem 1.15rem' }}
            >
              <span>Plant a Star in Dream Garden</span>
              <Flower2 size={16} />
            </Link>
          </div>
        </div>

        {/* Title Section */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
          <div className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
            <Compass size={15} />
            <span>Interactive Dream Laboratory</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.4rem)', marginBottom: '1rem' }}>
            Yuvvi’s Workshop
          </h1>
          <p style={{ fontSize: '1.14rem', color: 'var(--color-text-sub)', lineHeight: 1.68 }}>
            Inside a floating moonlit castle tower, Yuvvi gathers lost dreams and turns them into whimsical inventions.
            Select any prototype below to see Yuvvi illuminate its clockwork wonder.
          </p>
        </div>

        {/* =========================================================================
            INVENTION 1: THE DREAM LANTERN
            ========================================================================= */}
        <section style={{ marginBottom: '4.5rem', position: 'relative' }}>
          {/* Secret Collectible Star #3 (Clockwork Spark) */}
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              right: '20px',
              zIndex: 10
            }}
          >
            <CollectibleStar
              id="workshop-star"
              size={38}
              hint="Between the brass spools and copper cogs, you spot the Clockwork Spark! Click to gather."
            />
          </div>

          <div className="story-card" style={{ padding: '2.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span className="badge badge-gold">Invention 01</span>
              <span style={{ fontSize: '0.86rem', color: 'var(--color-lavender)', fontWeight: 600 }}>
                Prototype: The Dream Revealing Lantern
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2.5rem',
                alignItems: 'center',
                marginTop: '1.5rem'
              }}
            >
              {/* Interactive Lantern Stage */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2.2rem',
                  borderRadius: '24px',
                  backgroundColor: 'rgba(30, 30, 59, 0.65)',
                  border: '1.5px solid rgba(182, 164, 255, 0.2)',
                  position: 'relative'
                }}
              >
                {/* Glowing Lantern Button */}
                <button
                  onClick={handleLanternClick}
                  aria-label="Click to tap Yuvvi's Dream Lantern and reveal a forgotten dream"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '1rem',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <svg
                    width="140"
                    height="190"
                    viewBox="0 0 140 190"
                    fill="none"
                    style={{
                      filter: lanternExpanded
                        ? 'drop-shadow(0 0 40px rgba(255, 217, 133, 0.95))'
                        : 'drop-shadow(0 0 20px rgba(255, 217, 133, 0.5))',
                      transition: 'filter 0.5s ease'
                    }}
                  >
                    <circle cx="70" cy="22" r="14" stroke="#D4A137" strokeWidth="4" fill="none" />
                    <path d="M 50 38 C 50 30, 90 30, 90 38 L 100 52 L 40 52 Z" fill="#D4A137" />
                    <rect
                      x="35"
                      y="52"
                      width="70"
                      height="85"
                      rx="10"
                      fill="rgba(255, 250, 235, 0.2)"
                      stroke="#FFD985"
                      strokeWidth="3.5"
                    />
                    <g transform="translate(70, 95)">
                      <circle
                        cx="0"
                        cy="0"
                        r={lanternExpanded ? 36 : 24}
                        fill="rgba(255, 217, 133, 0.45)"
                        className="animate-pulse-glow"
                      />
                      <polygon points="0,-16 5,-5 16,0 5,5 0,16 -5,5 -16,0 -5,-5" fill="#FFD985" />
                      <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
                    </g>
                    <path d="M 30 137 L 110 137 L 102 154 L 38 154 Z" fill="#D4A137" />
                  </svg>
                </button>

                <p
                  style={{
                    fontFamily: 'var(--font-rounded)',
                    fontSize: '0.9rem',
                    color: 'var(--color-gold)',
                    fontWeight: 600,
                    marginTop: '0.75rem',
                    textAlign: 'center'
                  }}
                >
                  ✦ Tap lantern to kindle another dream ✦
                </p>
              </div>

              {/* Revealed Dream Box */}
              <div>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--color-moon-blue)', marginBottom: '0.5rem' }}>
                  The Dream Revealing Lantern
                </h3>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-sub)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  Whenever Yuvvi holds this lantern close to night air, its flame resonates with the frequency of an
                  unremembered wish. Click the lantern or the button below to awaken one!
                </p>

                {/* Dream Card */}
                <div
                  style={{
                    padding: '1.6rem',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(109, 85, 168, 0.25)',
                    border: '1.5px dashed var(--color-gold)',
                    marginBottom: '1.6rem',
                    animation: 'riseIntoSky 0.3s ease-out'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-rounded)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--color-gold)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Dreamer: {activeDream.dreamer}
                  </div>
                  <blockquote
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.2rem',
                      color: 'var(--color-text-main)',
                      lineHeight: 1.55,
                      fontStyle: 'italic'
                    }}
                  >
                    "{activeDream.message}"
                  </blockquote>
                </div>

                <button className="btn btn-gold" onClick={handleNextDream}>
                  <RefreshCw size={16} />
                  <span>Discover Another Dream</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            INVENTION 2: DREAMSCAPE CODE (The Interactive Galaxy Map)
            ========================================================================= */}
        <section style={{ marginBottom: '4.5rem' }}>
          <div className="story-card" style={{ padding: '2.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span className="badge badge-berry">Invention 02</span>
              <span style={{ fontSize: '0.86rem', color: 'var(--color-lavender)', fontWeight: 600 }}>
                Dreamscape Code (Atlas of Lost Dimensions)
              </span>
            </div>

            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-moon-blue)', marginBottom: '0.4rem' }}>
              The Dreamscape Map
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-sub)', lineHeight: 1.65, marginBottom: '1.85rem' }}>
              Click on the golden star beacons on the map below to chart secret dream realms and examine their climates.
            </p>

            {/* Illustrated Map Canvas */}
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #090916 0%, #15152D 100%)',
                padding: '1.5rem',
                minHeight: '360px',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.7)',
                border: '1.5px solid rgba(182, 164, 255, 0.25)'
              }}
            >
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                aria-hidden="true"
              >
                <line x1="18%" y1="35%" x2="50%" y2="22%" stroke="rgba(255, 217, 133, 0.25)" strokeDasharray="4 4" />
                <line x1="50%" y1="22%" x2="82%" y2="40%" stroke="rgba(255, 217, 133, 0.25)" strokeDasharray="4 4" />
                <line x1="50%" y1="22%" x2="68%" y2="78%" stroke="rgba(255, 217, 133, 0.25)" strokeDasharray="4 4" />
                <line x1="18%" y1="35%" x2="32%" y2="75%" stroke="rgba(255, 217, 133, 0.25)" strokeDasharray="4 4" />
                <line x1="32%" y1="75%" x2="68%" y2="78%" stroke="rgba(255, 217, 133, 0.25)" strokeDasharray="4 4" />
                <circle cx="10%" cy="15%" r="1.5" fill="#FFF" opacity="0.4" />
                <circle cx="90%" cy="85%" r="1.5" fill="#FFF" opacity="0.4" />
                <circle cx="40%" cy="50%" r="2" fill="#FFD985" opacity="0.5" />
              </svg>

              {DREAM_WORLDS.map((world) => {
                const isSelected = world.id === activeWorldId;
                return (
                  <button
                    key={world.id}
                    onClick={() => handleSelectWorld(world.id)}
                    aria-label={`Select dream world: ${world.name}`}
                    style={{
                      position: 'absolute',
                      top: `${world.coords.y}%`,
                      left: `${world.coords.x}%`,
                      transform: 'translate(-50%, -50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      zIndex: 5
                    }}
                  >
                    <div
                      style={{
                        width: isSelected ? '42px' : '28px',
                        height: isSelected ? '42px' : '28px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#FFD985' : 'rgba(30, 30, 59, 0.85)',
                        border: isSelected ? '3px solid #FFFFFF' : '2px solid #FFD985',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isSelected
                          ? '0 0 30px rgba(255, 217, 133, 0.95)'
                          : '0 0 12px rgba(255, 217, 133, 0.35)',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    >
                      <MapPin size={isSelected ? 20 : 14} color={isSelected ? '#080811' : '#FFD985'} />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-rounded)',
                        fontSize: isSelected ? '0.86rem' : '0.76rem',
                        fontWeight: 600,
                        color: isSelected ? '#FFD985' : '#B6A4FF',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {world.name.split(' ')[1] || world.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected World Detail Panel */}
            <div
              style={{
                marginTop: '1.6rem',
                padding: '1.6rem',
                borderRadius: '16px',
                backgroundColor: 'rgba(30, 30, 59, 0.6)',
                border: '1.5px solid rgba(182, 164, 255, 0.2)',
                animation: 'riseIntoSky 0.3s ease-out'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge badge-purple">{activeWorld.climate}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  Coordinates: Lat {activeWorld.coords.x}° / Long {activeWorld.coords.y}°
                </span>
              </div>
              <h4 style={{ fontSize: '1.45rem', color: 'var(--color-moon-blue)', margin: '0.65rem 0 0.35rem' }}>
                {activeWorld.name}
              </h4>
              <p style={{ fontSize: '0.98rem', color: 'var(--color-text-sub)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
                {activeWorld.description}
              </p>
              <blockquote
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '0.98rem',
                  color: 'var(--color-gold)',
                  borderLeft: '3px solid var(--color-gold)',
                  paddingLeft: '0.85rem',
                  margin: 0
                }}
              >
                "{activeWorld.vignette}"
              </blockquote>
            </div>
          </div>
        </section>

        {/* =========================================================================
            INVENTION 3: THE STARRY COMPANION
            ========================================================================= */}
        <section style={{ marginBottom: '4.5rem' }}>
          <div className="story-card" style={{ padding: '2.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span className="badge badge-gold">Invention 03</span>
              <span style={{ fontSize: '0.86rem', color: 'var(--color-lavender)', fontWeight: 600 }}>
                The Starry Companion
              </span>
            </div>

            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-moon-blue)', marginBottom: '0.4rem' }}>
              The Starry Companion Adventure Weaver
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-sub)', lineHeight: 1.65, marginBottom: '1.85rem' }}>
              Select a feeling or wish you are carrying tonight. Yuvvi’s pocket compass will weave a bespoke mini-adventure
              featuring you and Yuvvi in the world of dreams.
            </p>

            {/* Feeling Selector Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.85rem',
                marginBottom: '1.85rem'
              }}
            >
              {ADVENTURE_THEMES.map((theme) => {
                const isSelected = theme.id === selectedThemeId;
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className="btn"
                    style={{
                      backgroundColor: isSelected ? 'rgba(109, 85, 168, 0.45)' : 'rgba(30, 30, 59, 0.65)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-main)',
                      border: isSelected ? '1.5px solid var(--color-lavender)' : '1.5px solid var(--color-indigo-border)',
                      boxShadow: isSelected ? '0 0 20px rgba(182, 164, 255, 0.35)' : 'none',
                      padding: '0.7rem 1.35rem',
                      fontSize: '0.94rem'
                    }}
                  >
                    <Icon size={16} color={isSelected ? '#FFD985' : theme.color} />
                    <span>{theme.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Generated Adventure Scroll */}
            <div
              key={adventureKey}
              style={{
                padding: '2.2rem',
                borderRadius: '18px',
                backgroundColor: 'rgba(21, 21, 45, 0.85)',
                border: '2px solid var(--color-gold)',
                boxShadow: 'var(--shadow-md)',
                animation: 'riseIntoSky 0.35s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
                <Scroll size={18} color="var(--color-gold)" />
                <span
                  style={{
                    fontFamily: 'var(--font-rounded)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--color-gold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Your Tailored Storybook Scroll • {activeAdventure.label}
                </span>
              </div>

              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-moon-blue)', marginBottom: '0.85rem' }}>
                {activeAdventure.lead}
              </h4>

              <p style={{ fontSize: '1.08rem', color: 'var(--color-text-sub)', lineHeight: 1.78, whiteSpace: 'pre-line' }}>
                {activeAdventure.story}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1.6rem',
                  paddingTop: '1.1rem',
                  borderTop: '1px solid rgba(182, 164, 255, 0.15)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <YuvviCharacter size="small" expression="waving" showLantern={false} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--color-lavender)', fontStyle: 'italic' }}>
                    Yuvvi traveled beside you on this adventure!
                  </span>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    sound.playChime(880, 'sine', 0.4);
                    setAdventureKey((k) => k + 1);
                  }}
                  style={{ fontSize: '0.88rem', padding: '0.55rem 1.15rem' }}
                >
                  <RefreshCw size={15} />
                  <span>Try a Different Variation</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            INVENTION 3: THE DREAM CATCHER TEST BENCH (MINI-GAME)
            ========================================================================= */}
        <section style={{ marginBottom: '4.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="badge badge-berry" style={{ marginBottom: '0.6rem' }}>
              <Sparkles size={14} />
              <span>Interactive Workshop Test Bench</span>
            </div>
            <h3 style={{ fontSize: '1.9rem', color: 'var(--color-moon-blue)', margin: '0 0 0.5rem', fontFamily: 'var(--font-rounded)' }}>
              Test Bench: Yuvvi’s Dream Catcher
            </h3>
            <p style={{ color: 'var(--color-text-sub)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
              Test the agility of Yuvvi's floating companion cloud by catching daydreams and falling starlight before the night is over!
            </p>
          </div>

          <DreamCatcherGame />
        </section>

        {/* Bottom Destination Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '2rem'
          }}
        >
          <Link
            to="/dream-garden"
            className="btn btn-primary"
            onClick={() => sound.playChime(659.25, 'sine', 0.5)}
            style={{ padding: '0.85rem 2.2rem' }}
          >
            <span>Visit The Dream Garden Next</span>
            <ArrowRight size={18} />
          </Link>

          <Link to="/" className="btn btn-secondary" style={{ padding: '0.85rem 1.85rem' }}>
            <span>Back to Home Entrance</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
