import React, { useEffect, useState, useRef } from 'react';
import { sound } from '../utils/audio';
import { Sparkles, Moon, Compass, Heart, Stars } from 'lucide-react';

const SCENES = [
  {
    step: 'I',
    title: 'The Silent Hour',
    subtitle: 'Where Forgotten Daydreams Drift',
    quote: '"At three in the morning, sleep claims the heavy thoughts, and light dreams float away into the willow trees."',
    icon: Moon,
    color: '#A8D9FF',
    details: 'Every day, thousands of quiet hopes are left behind — castles drawn on napkins, songs half-sung, wishes whispered into pillowcases. They linger in the mist like lost fireflies.'
  },
  {
    step: 'II',
    title: 'The Spark of Starlight',
    subtitle: 'A Collision of Wonder',
    quote: '"Not a spark of heat, but a spark of curiosity. From starlight and an abandoned dream, two round eyes opened."',
    icon: Stars,
    color: '#FFD985',
    details: 'Yuvvi awakened standing on a companion cloud with a quiet heart that felt every unspoken longing. Beside him rested an ancient brass lantern waiting for its first spark of courage.'
  },
  {
    step: 'III',
    title: 'The Gathering Journey',
    subtitle: 'Catching Whispers from the Mist',
    quote: '"A dream collected is a promise that wonder never truly disappears."',
    icon: Compass,
    color: '#D99BCB',
    details: 'From ocean harbors to mountain castles, Yuvvi gathered dreams: mechanical wings that could wind themselves, gentle sea bottles holding ocean melodies, and music boxes tuned to heal heavy hearts.'
  },
  {
    step: 'IV',
    title: 'The Living Constellation',
    subtitle: 'Dreams Shine Brightest When Shared',
    quote: '"When the stars went missing on the darkest winter night, Yuvvi realized dreams were never meant to be kept in glass jars."',
    icon: Heart,
    color: '#B6A4FF',
    details: 'By tossing the dreams back into the night sky, every whispered hope became a warm golden constellation. Now, Yuvvi guides visitors to plant their own wishes in the sky.'
  }
];

export const ScrollStoryJourney = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const topOffset = window.innerHeight * 0.45;
      const progress = THREE_clamp((topOffset - rect.top) / rect.height, 0, 1);
      const stepIndex = Math.min(Math.floor(progress * SCENES.length), SCENES.length - 1);

      if (stepIndex !== activeStep && progress > 0.05 && progress < 0.95) {
        sound.playChime(523.25 + stepIndex * 85, 'sine', 0.35);
        setActiveStep(stepIndex);
      }
    };

    const THREE_clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeStep]);

  return (
    <section
      ref={containerRef}
      className="scroll-story-journey"
      style={{
        paddingTop: '4.5rem',
        paddingBottom: '5.5rem',
        position: 'relative'
      }}
    >
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="badge badge-berry" style={{ marginBottom: '0.85rem' }}>
            <Sparkles size={14} />
            <span>Scroll-Driven Narrative Journey</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', marginBottom: '0.85rem' }}>
            The Path of Forgotten Dreams
          </h2>
          <p style={{ fontSize: '1.12rem', color: 'var(--color-text-sub)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.65 }}>
            Scroll gently to travel through the moments that shaped Yuvvi’s world, from midnight mist to starry constellations.
          </p>
        </div>

        {/* Narrative Steps Timeline */}
        <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
          {/* Glowing Vertical Progression Spine */}
          <div
            style={{
              position: 'absolute',
              left: '18px',
              top: '20px',
              bottom: '20px',
              width: '3px',
              background: 'linear-gradient(180deg, #A8D9FF 0%, #FFD985 35%, #D99BCB 70%, #B6A4FF 100%)',
              borderRadius: '99px',
              boxShadow: '0 0 12px rgba(182, 164, 255, 0.4)'
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            {SCENES.map((scene, idx) => {
              const IconComp = scene.icon;
              const isPassed = idx <= activeStep;

              return (
                <div
                  key={scene.step}
                  style={{
                    position: 'relative',
                    transition: 'all 0.4s ease',
                    opacity: isPassed ? 1 : 0.72
                  }}
                >
                  {/* Timeline Bead */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-2.5rem',
                      top: '12px',
                      transform: 'translateX(-50%)',
                      width: isPassed ? '36px' : '28px',
                      height: isPassed ? '36px' : '28px',
                      borderRadius: '50%',
                      backgroundColor: isPassed ? scene.color : 'rgba(30, 30, 59, 0.9)',
                      border: '2.5px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isPassed ? `0 0 20px ${scene.color}` : 'none',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      zIndex: 3
                    }}
                  >
                    <IconComp size={isPassed ? 16 : 13} color={isPassed ? '#15152D' : scene.color} />
                  </div>

                  {/* Narrative Card */}
                  <div
                    className="story-card"
                    style={{
                      padding: '2.2rem 2.4rem',
                      borderLeft: isPassed ? `4px solid ${scene.color}` : '1px solid var(--color-card-border)',
                      backgroundColor: isPassed ? 'var(--color-card-bg)' : 'rgba(21, 21, 45, 0.45)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.45rem' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.78rem' }}>
                        Scene {scene.step}
                      </span>
                      <span style={{ fontSize: '0.84rem', color: scene.color, fontFamily: 'var(--font-rounded)', fontWeight: 600 }}>
                        {scene.subtitle}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.65rem', color: 'var(--color-text-main)', margin: '0.4rem 0 1rem', fontFamily: 'var(--font-serif)' }}>
                      {scene.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        fontSize: '1.14rem',
                        color: scene.color,
                        lineHeight: 1.6,
                        marginBottom: '1rem',
                        borderLeft: `2px solid ${scene.color}`,
                        paddingLeft: '1rem'
                      }}
                    >
                      {scene.quote}
                    </p>

                    <p style={{ fontSize: '1.02rem', color: 'var(--color-text-sub)', lineHeight: 1.7, margin: 0 }}>
                      {scene.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
