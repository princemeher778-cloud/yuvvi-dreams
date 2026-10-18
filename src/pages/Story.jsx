import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CollectibleStar } from '../components/CollectibleStar';
import { YuvviCharacter } from '../components/YuvviCharacter';
import { StoryBook } from '../components/StoryBook';
import { Sparkles, ArrowRight, ArrowLeft, BookOpen, Flower2, ScrollText, BookMarked } from 'lucide-react';
import { sound } from '../utils/audio';

import chapter1Img from '../assets/chapter1.jpg';
import chapter2Img from '../assets/chapter2.jpg';
import chapter3Img from '../assets/chapter3.jpg';
import chapter4Img from '../assets/chapter4.jpg';
import chapter5Img from '../assets/chapter5.jpg';

const CHAPTER_IMAGES = [chapter1Img, chapter2Img, chapter3Img, chapter4Img, chapter5Img];

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
  const [mode, setMode] = useState('storybook'); // 'storybook' | 'scroll'
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
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
          <div className="badge badge-berry" style={{ marginBottom: '0.85rem' }}>
            <BookOpen size={15} />
            <span>The Illustrated Storybook</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', marginBottom: '1rem' }}>
            Yuvvi’s Story
          </h1>
          <p style={{ fontSize: '1.16rem', color: 'var(--color-text-sub)', lineHeight: 1.68 }}>
            Five illustrated anime chapters following the journey of a tiny ghost who learned that forgotten dreams
            become constellations when they are shared.
          </p>

          {/* Mode Switcher: Interactive Storybook vs Scroll Chronicle */}
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              borderRadius: '999px',
              backgroundColor: 'rgba(30, 30, 59, 0.7)',
              border: '1px solid var(--color-indigo-border)',
              marginTop: '1.4rem'
            }}
          >
            <button
              onClick={() => {
                sound.playChime(659.25, 'sine', 0.25);
                setMode('storybook');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.45rem 1.25rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: mode === 'storybook' ? 'var(--color-gold)' : 'transparent',
                color: mode === 'storybook' ? '#15152D' : 'var(--color-text-sub)',
                fontWeight: mode === 'storybook' ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-rounded)',
                fontSize: '0.88rem',
                transition: 'all 0.2s ease'
              }}
            >
              <BookMarked size={16} />
              <span>Interactive Storybook</span>
            </button>

            <button
              onClick={() => {
                sound.playChime(587.33, 'sine', 0.25);
                setMode('scroll');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.45rem 1.25rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: mode === 'scroll' ? 'var(--color-purple)' : 'transparent',
                color: mode === 'scroll' ? '#FFFFFF' : 'var(--color-text-sub)',
                fontWeight: mode === 'scroll' ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-rounded)',
                fontSize: '0.88rem',
                transition: 'all 0.2s ease'
              }}
            >
              <ScrollText size={16} />
              <span>Scroll Chronicle</span>
            </button>
          </div>
        </div>

        {/* INTERACTIVE STORYBOOK MODE */}
        {mode === 'storybook' ? (
          <StoryBook chapters={CHAPTERS} chapterImages={CHAPTER_IMAGES} />
        ) : (
          /* CLASSIC SCROLLING CHRONICLE MODE */
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

                {/* Genuine Anime Chapter Illustration */}
                <div
                  style={{
                    borderRadius: '18px',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '2rem',
                    boxShadow: 'var(--shadow-md)',
                    border: '1.5px solid var(--color-card-border)',
                    backgroundColor: 'rgba(15, 15, 30, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxHeight: '440px'
                  }}
                >
                  <img
                    src={CHAPTER_IMAGES[idx]}
                    alt={`Illustration for ${chapter.number}: ${chapter.title}`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '440px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  {/* Gentle gradient vignette overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(8, 8, 17, 0.08) 0%, rgba(8, 8, 17, 0.25) 100%)',
                      pointerEvents: 'none'
                    }}
                  />
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
        )}

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
