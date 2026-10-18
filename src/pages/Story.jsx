import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CollectibleStar } from '../components/CollectibleStar';
import { YuvviCharacter } from '../components/YuvviCharacter';
import { Sparkles, ArrowRight, ArrowLeft, BookOpen, Flower2 } from 'lucide-react';
import { sound } from '../utils/audio';

const CHAPTERS = [
  {
    number: 'Chapter 1',
    title: 'A Dream Nobody Remembered',
    tagline: 'When night forgets, a tiny wonder begins.',
    body: `
      It happened on an ordinary Thursday at three in the morning.
      Someone in a quiet attic room was dreaming of building a castle out of clouds,
      but when their alarm clock chimed, the dream slipped away into the cool morning breeze.
      
      It drifted above silent chimneys and sleepy willow trees until it brushed against a fallen golden star.
      A soft spark flashed, not with fire, but with gentle curiosity.
      From that quiet collision of starlight and an abandoned daydream, Yuvvi opened two round, wondering eyes.
    `,
    sceneType: 'birth'
  },
  {
    number: 'Chapter 2',
    title: 'The Dream Collector',
    tagline: 'The lantern that knows the weight of wishes.',
    body: `
      Beside Yuvvi lay a tiny glass lantern with brass filigree.
      At first, it was completely dark. But whenever Yuvvi drifted near an old love letter,
      a child’s forgotten sketchbook, or an unfulfilled prayer tossed into the sea,
      the lantern began to pulse with warm golden light.
      
      Yuvvi realized what had to be done. Armed with a pocket of curiosity and a heart that felt every quiet sadness,
      Yuvvi began wandering the world, catching dreams before they could dissolve into the mist.
    `,
    sceneType: 'collector'
  },
  {
    number: 'Chapter 3',
    title: 'The Impossible Workshop',
    tagline: 'Where daydreams learn to tick and turn.',
    body: `
      High in the mountains stood an abandoned castle overlooking a sea of clouds.
      Inside its highest tower, Yuvvi set up a workshop unlike any the earth had ever known.
      
      Dreams of flying became mechanical hummingbirds that wound their own wings.
      Dreams of ocean kingdoms were preserved in luminous glass bottles.
      Dreams of second chances were tuned like delicate music boxes, playing melodies that could heal a heavy heart.
      For a long time, Yuvvi was proud of these solitary creations.
    `,
    sceneType: 'workshop'
  },
  {
    number: 'Chapter 4',
    title: 'The Night the Stars Went Missing',
    tagline: 'Dreams are not meant to be kept in glass jars.',
    body: `
      Then came the darkest winter night the world had ever seen.
      A heavy frost covered the sky, and one by one, the constellations vanished.
      Inside the castle, Yuvvi’s Dream Lantern began to flicker and turn cold.
      
      Sitting alone in the silence, Yuvvi finally understood: dreams were never meant to be collected like dried leaves in a book.
      A dream only shines when it is whispered to someone else.
      Yuvvi opened all the glass jars, threw open the castle shutters, and breathed on the lantern flame.
      Golden sparks leaped into the freezing air, climbing like dandelion seeds until the sky caught fire with starlight once again.
    `,
    sceneType: 'missing-stars'
  },
  {
    number: 'Chapter 5',
    title: 'One Dream for You',
    tagline: 'The circle is only complete with your wish.',
    body: `
      Now Yuvvi wanders not to hoard dreams, but to help people plant them where everyone can look up and see.
      Every constellation you see at night is kept warm by someone who dared to wish.
      
      And so Yuvvi stops beside your screen today, tilting that little head, eyes filled with wonder:
      "Somewhere inside you is a dream you almost gave up on.
      Will you give it to me? Together, we will make it shine in the sky forever."
    `,
    sceneType: 'final-wish'
  }
];

export const Story = () => {
  const navigate = useNavigate();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const scrollToChapter = (index) => {
    sound.playChime(659.25, 'sine', 0.4);
    setActiveChapterIndex(index);
    const el = document.getElementById(`chapter-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="story-page" style={{ paddingTop: '2.5rem', paddingBottom: '6.5rem', position: 'relative', zIndex: 5 }}>
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
              to="/dream-garden"
              className="btn btn-secondary"
              onClick={() => sound.playChime(659.25, 'sine', 0.4)}
              style={{ fontSize: '0.88rem', padding: '0.55rem 1.15rem' }}
            >
              <span>Plant Your Wish</span>
              <Flower2 size={16} />
            </Link>
          </div>
        </div>

        {/* Story Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
          <div className="badge badge-berry" style={{ marginBottom: '0.85rem' }}>
            <BookOpen size={15} />
            <span>The Illustrated Chronicle</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', marginBottom: '1rem' }}>
            Yuvvi’s Story
          </h1>
          <p style={{ fontSize: '1.16rem', color: 'var(--color-text-sub)', lineHeight: 1.68 }}>
            Five cinematic illustrated chapters following the journey of a tiny ghost who learned that forgotten dreams
            become constellations when they are shared.
          </p>

          {/* Chapter Quick Jump Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.6rem',
              marginTop: '1.6rem'
            }}
          >
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.number}
                onClick={() => scrollToChapter(idx)}
                className="btn"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.88rem',
                  backgroundColor: activeChapterIndex === idx ? 'var(--color-purple)' : 'rgba(30, 30, 59, 0.7)',
                  color: activeChapterIndex === idx ? '#FFFFFF' : 'var(--color-text-sub)',
                  border: activeChapterIndex === idx ? '1px solid var(--color-lavender)' : '1px solid var(--color-indigo-border)'
                }}
              >
                <span>{ch.number}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5 CHAPTERS SCROLLING STORYBOOK */}
        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3.8rem' }}>
          {CHAPTERS.map((chapter, idx) => {
            return (
              <article
                key={chapter.number}
                id={`chapter-${idx}`}
                className="story-card"
                style={{
                  padding: '2.8rem',
                  position: 'relative'
                }}
              >
                {/* Secret Collectible Star #5 (Starlight Memory in Chapter 4) */}
                {idx === 3 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '25px',
                      right: '25px',
                      zIndex: 10
                    }}
                  >
                    <CollectibleStar
                      id="story-star"
                      size={38}
                      hint="Look! High in Chapter 4's starry night sky hovers the Starlight Memory star! Click to gather."
                    />
                  </div>
                )}

                {/* Chapter Banner & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
                    {chapter.number}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--color-lavender)', fontFamily: 'var(--font-rounded)', fontWeight: 600 }}>
                    {chapter.tagline}
                  </span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)', color: 'var(--color-moon-blue)', marginBottom: '1.6rem' }}>
                  {chapter.title}
                </h2>

                {/* Illustrated Cinematic Scene Graphic */}
                <div
                  style={{
                    borderRadius: '16px',
                    height: '200px',
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
                  {/* Scene 1: Birth from Fallen Star */}
                  {idx === 0 && (
                    <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%' }}>
                      <circle cx="250" cy="90" r="48" fill="rgba(255, 217, 133, 0.3)" className="animate-pulse-glow" />
                      <polygon
                        points="250,55 258,78 282,78 262,94 270,118 250,102 230,118 238,94 218,78 242,78"
                        fill="#FFD985"
                      />
                      <circle cx="250" cy="85" r="5" fill="#FFFFFF" />
                      <path
                        d="M 235 85 C 235 60 265 60 265 85 C 265 105 258 108 250 105 C 242 108 235 105 235 85 Z"
                        fill="rgba(255, 255, 255, 0.85)"
                        className="animate-float"
                      />
                    </svg>
                  )}

                  {/* Scene 2: Dream Collector with Lantern */}
                  {idx === 1 && (
                    <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%' }}>
                      <path d="M 60 140 Q 120 100 200 120 T 360 110 T 480 130" stroke="#6D55A8" strokeWidth="2" fill="none" />
                      <g transform="translate(250, 80)">
                        <circle cx="0" cy="0" r="42" fill="rgba(255, 217, 133, 0.45)" className="animate-pulse-glow" />
                        <rect x="-15" y="-20" width="30" height="40" rx="6" fill="rgba(255, 255, 255, 0.7)" stroke="#FFD985" strokeWidth="2" />
                        <circle cx="0" cy="0" r="6" fill="#FFD985" />
                      </g>
                      <circle cx="150" cy="60" r="14" fill="rgba(217, 155, 203, 0.35)" className="animate-float" />
                      <circle cx="340" cy="70" r="18" fill="rgba(168, 217, 255, 0.35)" className="animate-float" />
                    </svg>
                  )}

                  {/* Scene 3: Castle Workshop */}
                  {idx === 2 && (
                    <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%' }}>
                      <rect x="210" y="70" width="80" height="90" fill="#1E1E3B" />
                      <polygon points="210,70 250,30 290,70" fill="#28224C" />
                      <rect x="235" y="95" width="30" height="40" rx="15" fill="#FFD985" opacity="0.85" />
                      <circle cx="160" cy="80" r="16" stroke="#FFD985" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                      <circle cx="330" cy="90" r="20" stroke="#FFD985" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                    </svg>
                  )}

                  {/* Scene 4: Starlight Memory Sky (with hidden star!) */}
                  {idx === 3 && (
                    <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%' }}>
                      <circle cx="120" cy="40" r="1.5" fill="#FFF" className="animate-twinkle" />
                      <circle cx="250" cy="30" r="2.5" fill="#FFD985" className="animate-twinkle" />
                      <circle cx="380" cy="50" r="1.5" fill="#FFF" className="animate-twinkle" />
                      <circle cx="180" cy="110" r="2" fill="#A8D9FF" className="animate-twinkle" />
                      <circle cx="320" cy="120" r="1.8" fill="#FFF" className="animate-twinkle" />
                      <g transform="translate(250, 110)">
                        <circle cx="0" cy="0" r="28" fill="rgba(255, 255, 255, 0.9)" />
                        <polygon points="0,-22 4,-10 16,-10 7,-2 11,10 0,2 -11,10 -7,-2 -16,-10 -4,-10" fill="#FFD985" />
                      </g>
                    </svg>
                  )}

                  {/* Scene 5: Yuvvi reaches out with starlight */}
                  {idx === 4 && (
                    <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%' }}>
                      <g transform="translate(250, 80)">
                        <circle cx="0" cy="0" r="48" fill="rgba(255, 217, 133, 0.35)" className="animate-pulse-glow" />
                        <circle cx="0" cy="0" r="28" fill="#FFFFFF" stroke="#B6A4FF" strokeWidth="3" />
                        <polygon points="0,-16 3,-5 12,-5 5,1 8,11 0,5 -8,11 -5,1 -12,-5 -3,-5" fill="#FFD985" />
                        <ellipse cx="-8" cy="-2" rx="2.5" ry="3.5" fill="#15152D" />
                        <ellipse cx="8" cy="-2" rx="2.5" ry="3.5" fill="#15152D" />
                        <path d="M -5 6 Q 0 10 5 6" stroke="#15152D" strokeWidth="1.8" fill="none" />
                      </g>
                      <text x="250" y="150" textAnchor="middle" fill="#FFD985" fontFamily="var(--font-rounded)" fontSize="13">
                        "Your turn to shine. ✨"
                      </text>
                    </svg>
                  )}
                </div>

                {/* Narrative Text */}
                <p
                  style={{
                    fontSize: '1.16rem',
                    color: 'var(--color-text-sub)',
                    lineHeight: 1.82,
                    whiteSpace: 'pre-line',
                    fontFamily: 'var(--font-serif)'
                  }}
                >
                  {chapter.body}
                </p>
              </article>
            );
          })}
        </div>

        {/* EMOTIONAL FINAL SCENE & CTA */}
        <div
          className="story-card"
          style={{
            maxWidth: '840px',
            margin: '4.5rem auto 0',
            textAlign: 'center',
            padding: '3.2rem 2.2rem',
            border: '2px solid var(--color-gold)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <YuvviCharacter size="medium" expression="waving" customMessage="I saved a spot in the sky for you! 🌟" />
          </div>

          <h2 style={{ fontSize: '2.2rem', color: 'var(--color-moon-blue)', marginBottom: '0.85rem' }}>
            "Will You Plant a Dream With Me?"
          </h2>

          <p
            style={{
              fontSize: '1.18rem',
              color: 'var(--color-text-sub)',
              maxWidth: '580px',
              margin: '0 auto 2.2rem',
              lineHeight: 1.68
            }}
          >
            Yuvvi’s sky is waiting. Share a hope, water it with starlight, and become part of this endless story.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.1rem', flexWrap: 'wrap' }}>
            <Link
              to="/dream-garden"
              className="btn btn-gold"
              onClick={() => sound.playWishPlanted()}
              style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}
            >
              <Sparkles size={18} />
              <span>Plant Your Dream</span>
            </Link>

            <Link to="/" className="btn btn-secondary" style={{ fontSize: '1.02rem', padding: '1rem 1.9rem' }}>
              <span>Back to Home Entrance</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
