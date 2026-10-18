import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { YuvviCharacter } from '../components/YuvviCharacter';
import { DreamDestinationHeading } from '../components/DreamDestinationHeading';
import { CollectibleStar } from '../components/CollectibleStar';
import { useFlight } from '../context/FlightContext';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Compass,
  Flower2,
  ScrollText,
  Heart,
  Feather,
  Stars,
  Moon
} from 'lucide-react';
import { sound } from '../utils/audio';

export const Home = () => {
  const navigate = useNavigate();
  const introRef = useRef(null);
  const heroCharacterRef = useRef(null);
  const { startFlight, flightState } = useFlight();

  // Primary Action: "Enter the Dream World"
  // Yuvvi takes flight and reveals the first destination (Dream Library)
  const handleEnterDreamWorld = (e) => {
    e.preventDefault();
    sound.playLanternGlow();

    const libraryHeading = document.getElementById('dest-heading-library');
    const targetRect = libraryHeading ? libraryHeading.getBoundingClientRect() : null;
    const originRect = heroCharacterRef.current ? heroCharacterRef.current.getBoundingClientRect() : null;

    startFlight({
      destination: {
        id: 'dream-library',
        title: 'The Dream Library',
        route: '/dream-library',
        tagline: 'Every forgotten dream has a story.',
        description: 'Antique velvet volumes and glowing sea jars humming with dreams of flight.'
      },
      originRect,
      targetRect,
      onNavigate: (route) => navigate(route)
    });
  };

  // Secondary Action: "Meet Yuvvi" -> Flies to Story / Character
  const handleMeetYuvvi = (e) => {
    e.preventDefault();
    sound.playChime(659.25, 'sine', 0.45);

    const storyHeading = document.getElementById('dest-heading-story');
    const targetRect = storyHeading ? storyHeading.getBoundingClientRect() : null;
    const originRect = heroCharacterRef.current ? heroCharacterRef.current.getBoundingClientRect() : null;

    startFlight({
      destination: {
        id: 'story',
        title: "Yuvvi's Story",
        route: '/story',
        tagline: 'Discover how a forgotten dream became Yuvvi.',
        description: 'An illustrated five-chapter tale of starlight and finding belonging.'
      },
      originRect,
      targetRect,
      onNavigate: (route) => navigate(route)
    });
  };

  return (
    <div className="home-page" style={{ position: 'relative', zIndex: 5 }}>
      {/* 1. CINEMATIC OPENING HERO SECTION */}
      <section
        style={{
          position: 'relative',
          paddingTop: '4.5rem',
          paddingBottom: '5.5rem',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center'
            }}
          >
            {/* Hero Story Text */}
            <div style={{ maxWidth: '600px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.45rem 1.15rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(30, 30, 59, 0.75)',
                  border: '1px solid rgba(182, 164, 255, 0.3)',
                  marginBottom: '1.4rem',
                  boxShadow: '0 0 20px rgba(182, 164, 255, 0.18)'
                }}
              >
                <Stars size={16} color="var(--color-gold)" />
                <span
                  style={{
                    fontFamily: 'var(--font-rounded)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--color-gold)'
                  }}
                >
                  Yuvvi — The Little Collector of Forgotten Dreams
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-text-main)',
                  lineHeight: 1.16,
                  marginBottom: '1.35rem'
                }}
              >
                Somewhere, a <span style={{ color: 'var(--color-moon-blue)' }}>Forgotten Dream</span> Is Waiting for You.
              </h1>

              <p
                style={{
                  fontSize: '1.2rem',
                  color: 'var(--color-text-sub)',
                  lineHeight: 1.68,
                  marginBottom: '2.4rem'
                }}
              >
                Follow the little ghost who turns forgotten dreams into impossible wonders.
                When a daydream wanders into the midnight breeze, Yuvvi gathers it up, keeps it safe in a glowing lantern,
                and guides you to where dreams become stars.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.1rem', alignItems: 'center' }}>
                <button
                  className="btn btn-gold"
                  onClick={handleEnterDreamWorld}
                  id="btn-enter-dream-world"
                  style={{ fontSize: '1.05rem', padding: '0.9rem 2.2rem' }}
                >
                  <Sparkles size={18} />
                  <span>Enter the Dream World</span>
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={handleMeetYuvvi}
                  id="btn-meet-yuvvi"
                  style={{ fontSize: '1rem', padding: '0.85rem 1.85rem' }}
                >
                  <Heart size={17} color="var(--color-lavender)" />
                  <span>Meet Yuvvi</span>
                </button>
              </div>

              {/* Atmospheric Tip */}
              <div
                style={{
                  marginTop: '1.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  color: 'var(--color-lavender)'
                }}
              >
                <Moon size={15} color="var(--color-gold)" />
                <span>Tip: Click any destination heading below to watch Yuvvi take flight!</span>
              </div>
            </div>

            {/* 3D Character Hero Stage */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                minHeight: '400px'
              }}
            >
              {/* Ethereal Glow Behind Yuvvi */}
              <div
                style={{
                  position: 'absolute',
                  width: '360px',
                  height: '360px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(182, 164, 255, 0.25) 0%, rgba(109, 85, 168, 0.1) 50%, transparent 75%)',
                  filter: 'blur(50px)',
                  zIndex: 0
                }}
              />

              {/* Secret Collectible Star #1 (Lantern's Spark) */}
              <div
                style={{
                  position: 'absolute',
                  top: '8%',
                  right: '15%',
                  zIndex: 10
                }}
              >
                <CollectibleStar
                  id="home-star"
                  size={38}
                  hint="Look! The Lantern's Spark is drifting right beside Yuvvi! Click to collect."
                />
              </div>

              {/* 3D Yuvvi Character */}
              <div ref={heroCharacterRef} style={{ zIndex: 2 }}>
                <YuvviCharacter
                  size="hero"
                  expression="happy"
                  interactive={true}
                  flightPose={flightState === 'noticing'}
                />
              </div>

              {/* Interactive Floating Base Cloud */}
              <div
                style={{
                  marginTop: '-15px',
                  padding: '0.55rem 1.4rem',
                  borderRadius: '999px',
                  background: 'rgba(30, 30, 59, 0.75)',
                  border: '1px solid rgba(182, 164, 255, 0.25)',
                  boxShadow: '0 8px 25px rgba(8, 8, 17, 0.6)',
                  fontSize: '0.86rem',
                  color: 'var(--color-text-sub)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 3,
                  backdropFilter: 'blur(8px)'
                }}
              >
                <span className="animate-twinkle">✨</span>
                <span>Click 3D Yuvvi or the glowing lantern</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE EMBEDDED DREAM WORLD DESTINATION HEADINGS */}
      <section style={{ paddingTop: '3.5rem', paddingBottom: '5.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <div className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
              <Compass size={15} />
              <span>Embedded Story Scenery</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '0.85rem' }}>
              Four Portals to Wonder
            </h2>
            <p style={{ fontSize: '1.12rem', color: 'var(--color-text-sub)', lineHeight: 1.65 }}>
              Choose a destination. Yuvvi will notice your choice, take flight with the lantern, part the clouds,
              and guide you into the dream world.
            </p>
          </div>

          {/* 4 Embedded Destinations Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {/* 1. Dream Library */}
            <div id="dest-heading-library">
              <DreamDestinationHeading
                id="dream-library"
                title="The Dream Library"
                tagline="Every forgotten dream has a story."
                description="Shelves drifting in the midnight mist, holding velvet volumes and illuminated glass jars of flight and ocean depths."
                route="/dream-library"
                sceneryType="clouds"
                icon={BookOpen}
                badgeText="Clouds & Mist"
              />
            </div>

            {/* 2. Yuvvi's Workshop */}
            <div id="dest-heading-workshop">
              <DreamDestinationHeading
                id="workshop"
                title="Yuvvi's Workshop"
                tagline="Where impossible ideas come to life."
                description="A floating castle island with glowing blueprints, clockwork lanterns, and the Dreamscape Code star map."
                route="/workshop"
                sceneryType="island"
                icon={Compass}
                badgeText="Clockwork Island"
              />
            </div>

            {/* 3. Your Dream Garden */}
            <div id="dest-heading-garden">
              <DreamDestinationHeading
                id="dream-garden"
                title="Your Dream Garden"
                tagline="A little place for the dreams you still believe in."
                description="A moonlit sanctuary where you can plant a gentle wish into starlight soil and watch it ascend into the sky."
                route="/dream-garden"
                sceneryType="constellation"
                icon={Flower2}
                badgeText="Starlight Meadow"
              />
            </div>

            {/* 4. Yuvvi's Story */}
            <div id="dest-heading-story">
              <DreamDestinationHeading
                id="story"
                title="Yuvvi's Story"
                tagline="Discover how a forgotten dream became Yuvvi."
                description="Five cinematic illustrated chapters: the fallen golden star, the darkest night, and learning dreams shine brightest when shared."
                route="/story"
                sceneryType="castle"
                icon={ScrollText}
                badgeText="Moonlit Castle"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHARACTER INTRODUCTION SECTION */}
      <section
        ref={introRef}
        style={{
          paddingTop: '4.5rem',
          paddingBottom: '4.5rem',
          backgroundColor: 'rgba(13, 13, 30, 0.7)',
          borderTop: '1px solid rgba(182, 164, 255, 0.12)',
          borderBottom: '1px solid rgba(182, 164, 255, 0.12)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            {/* Illustrated 3D Vignette */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                className="story-card"
                style={{
                  padding: '2.5rem',
                  textAlign: 'center',
                  maxWidth: '380px',
                  width: '100%',
                  borderColor: 'rgba(182, 164, 255, 0.25)'
                }}
              >
                <YuvviCharacter size="medium" expression="curious" showLantern={true} />
                <div style={{ marginTop: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--color-moon-blue)' }}>Yuvvi</h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-rounded)',
                      color: 'var(--color-gold)',
                      fontWeight: 600,
                      fontSize: '0.94rem',
                      marginTop: '4px'
                    }}
                  >
                    The Little Collector of Forgotten Dreams
                  </p>
                </div>
              </div>
            </div>

            {/* Story Text & Personality Highlights */}
            <div>
              <div className="badge badge-berry" style={{ marginBottom: '1rem' }}>
                <Feather size={14} />
                <span>Character Story</span>
              </div>

              <h2 style={{ marginBottom: '1.25rem', lineHeight: 1.25 }}>
                "Yuvvi lives between the dreams people remember and the dreams they almost forget."
              </h2>

              <p style={{ fontSize: '1.12rem', color: 'var(--color-text-sub)', lineHeight: 1.68, marginBottom: '1.6rem' }}>
                Curious, gentle, playful, and quietly brave, Yuvvi believes no hope is ever too small to matter.
                When you choose where you wish to explore, Yuvvi's lantern sparks to life, clearing the mist and
                lighting the path before you.
              </p>

              {/* 3 Core Traits */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}
              >
                <div
                  style={{
                    padding: '1.1rem',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(30, 30, 59, 0.65)',
                    border: '1px solid rgba(182, 164, 255, 0.18)'
                  }}
                >
                  <span style={{ fontSize: '1.35rem' }}>⭐</span>
                  <h4 style={{ fontFamily: 'var(--font-rounded)', fontSize: '1rem', margin: '4px 0 2px', color: 'var(--color-gold)' }}>
                    Golden Forehead Star
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    Born from a fallen shooting star that touched a forgotten wish.
                  </p>
                </div>

                <div
                  style={{
                    padding: '1.1rem',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(30, 30, 59, 0.65)',
                    border: '1px solid rgba(182, 164, 255, 0.18)'
                  }}
                >
                  <span style={{ fontSize: '1.35rem' }}>🏮</span>
                  <h4 style={{ fontFamily: 'var(--font-rounded)', fontSize: '1rem', margin: '4px 0 2px', color: 'var(--color-moon-blue)' }}>
                    The Dream Lantern
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    Glows warmer whenever an unremembered dream is nearby.
                  </p>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleMeetYuvvi}
              >
                <span>Read Yuvvi's Full Story</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
