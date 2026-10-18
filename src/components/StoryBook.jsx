import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { CollectibleStar } from './CollectibleStar';
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, Feather } from 'lucide-react';

export const StoryBook = ({ chapters, chapterImages }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const totalPages = chapters.length;

  const goToPage = (pageIdx) => {
    if (pageIdx < 0 || pageIdx >= totalPages || isFlipping) return;
    sound.playChime(659.25, 'sine', 0.4);
    setIsFlipping(true);
    setCurrentPage(pageIdx);
    setTimeout(() => {
      setIsFlipping(false);
    }, 350);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFlipping]);

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      nextPage();
    } else if (diff < -50) {
      prevPage();
    }
    setTouchStartX(null);
  };

  const chapter = chapters[currentPage];
  const image = chapterImages[currentPage];

  return (
    <div
      className="storybook-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '1rem',
        userSelect: 'none'
      }}
    >
      {/* Book Ribbon Header Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} color="var(--color-gold)" />
          <span style={{ fontFamily: 'var(--font-rounded)', fontWeight: 600, color: 'var(--color-gold)' }}>
            Storybook Mode • Chapter {currentPage + 1} of {totalPages}
          </span>
        </div>

        {/* Quick Chapter Selector Dots */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {chapters.map((ch, idx) => (
            <button
              key={ch.number}
              onClick={() => goToPage(idx)}
              aria-label={`Jump to ${ch.number}: ${ch.title}`}
              style={{
                width: idx === currentPage ? '28px' : '10px',
                height: '10px',
                borderRadius: '999px',
                backgroundColor: idx === currentPage ? 'var(--color-gold)' : 'rgba(182, 164, 255, 0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: 0
              }}
            />
          ))}
        </div>
      </div>

      {/* Two-Page Storybook Cover & Binding */}
      <div
        className="storybook-spread"
        style={{
          background: 'var(--color-card-bg)',
          borderRadius: '24px',
          border: '2px solid var(--color-card-border)',
          boxShadow: 'var(--shadow-lg), 0 0 50px rgba(109, 85, 168, 0.2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          overflow: 'hidden',
          minHeight: '520px',
          position: 'relative',
          transition: 'opacity 0.25s ease',
          opacity: isFlipping ? 0.7 : 1
        }}
      >
        {/* Center Book Spine Shadow (Desktop) */}
        <div
          className="storybook-spine"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: '24px',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(90deg, rgba(8, 8, 17, 0.2) 0%, rgba(8, 8, 17, 0.45) 50%, rgba(8, 8, 17, 0.2) 100%)',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        />

        {/* Secret Collectible Star #5 in Chapter 4 */}
        {currentPage === 3 && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 25
            }}
          >
            <CollectibleStar
              id="story-star"
              size={36}
              hint="Look! In Chapter 4's starry night sky hovers the Starlight Memory star! Click to gather."
            />
          </div>
        )}

        {/* LEFT PAGE: Illustrated Anime Artwork */}
        <div
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(12, 12, 26, 0.75)',
            borderRight: '1px solid var(--color-card-border)',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(8, 8, 17, 0.6)',
              border: '1.5px solid var(--color-card-border)',
              position: 'relative'
            }}
          >
            <img
              src={image}
              alt={`Illustration for ${chapter.number}: ${chapter.title}`}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '380px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>

          <span
            style={{
              marginTop: '1rem',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-rounded)',
              color: 'var(--color-lavender)',
              textAlign: 'center'
            }}
          >
            Illustration {currentPage + 1} • {chapter.tagline}
          </span>
        </div>

        {/* RIGHT PAGE: Chapter Text & Navigation */}
        <div
          style={{
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.8rem' }}>
                {chapter.number}
              </span>
              <span style={{ fontSize: '0.84rem', color: 'var(--color-gold)', fontFamily: 'var(--font-rounded)', fontWeight: 600 }}>
                {chapter.tagline}
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.7rem, 2.8vw, 2.2rem)',
                color: 'var(--color-moon-blue)',
                marginBottom: '1.4rem',
                fontFamily: 'var(--font-serif)'
              }}
            >
              {chapter.title}
            </h2>

            <div
              style={{
                fontSize: '1.1rem',
                color: 'var(--color-text-sub)',
                lineHeight: 1.85,
                fontFamily: 'var(--font-serif)',
                whiteSpace: 'pre-line'
              }}
            >
              {chapter.body}
            </div>
          </div>

          {/* Turn Page Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '2rem',
              paddingTop: '1.2rem',
              borderTop: '1px solid var(--color-card-border)'
            }}
          >
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="btn btn-secondary"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.86rem',
                opacity: currentPage === 0 ? 0.35 : 1,
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous Chapter</span>
            </button>

            <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-rounded)' }}>
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="btn btn-gold"
              style={{
                padding: '0.5rem 1.2rem',
                fontSize: '0.86rem',
                opacity: currentPage === totalPages - 1 ? 0.35 : 1,
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <span>Next Chapter</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard & Swipe Hint */}
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
        Tip: Use your keyboard's <kbd>←</kbd> and <kbd>→</kbd> arrow keys or swipe left/right on touchscreens to turn pages.
      </div>
    </div>
  );
};
