import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

const StarContext = createContext();

export const ALL_STARS = [
  {
    id: 'home-star',
    title: "Lantern's Spark",
    location: 'Home Page (Beside Yuvvi\'s Lantern)',
    hint: 'Glows softly near Yuvvi\'s gentle floating lantern on the entrance page.',
    quote: 'The spark that kindles when someone looks up at the evening sky.'
  },
  {
    id: 'library-star',
    title: 'Whispering Folio',
    location: 'Dream Library (Behind the Antique Codex)',
    hint: 'Tucked between floating velvet books of tales that were almost forgotten.',
    quote: 'A word spoken only once, saved on a parchment of starlight.'
  },
  {
    id: 'workshop-star',
    title: 'Clockwork Spark',
    location: 'Workshop (Between Brass Gears)',
    hint: 'Resting in Yuvvi\'s workshop where inventions take their first breath.',
    quote: 'The curiosity that wonders: what if stars could turn like music boxes?'
  },
  {
    id: 'garden-star',
    title: 'Seed of Wonder',
    location: 'Dream Garden (Inside the Night Blossom)',
    hint: 'Hidden within the moonlit flowers where quiet wishes take root.',
    quote: 'A wish so gentle that even the evening dew didn\'t disturb it.'
  },
  {
    id: 'story-star',
    title: 'Starlight Memory',
    location: 'Story Page (Chapter 4 Night Sky)',
    hint: 'Hovering in the deep blue sky where Yuvvi learned dreams brighten when shared.',
    quote: 'The secret that no light is truly lost as long as someone remembers.'
  }
];

export const StarProvider = ({ children }) => {
  const [collected, setCollected] = useState(() => {
    try {
      const saved = localStorage.getItem('yuvvi_collected_stars');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentStar, setRecentStar] = useState(null);
  const [showConstellationModal, setShowConstellationModal] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('yuvvi_collected_stars', JSON.stringify(collected));
    } catch {
      // Storage unavailable
    }
  }, [collected]);

  const toggleSound = () => {
    const next = sound.toggleMute();
    setSoundMuted(next);
  };

  const collectStar = (id) => {
    if (collected.includes(id)) return;

    const starData = ALL_STARS.find((s) => s.id === id);
    const updated = [...collected, id];
    setCollected(updated);
    setRecentStar(starData);

    // Audio effect
    sound.playStarCollect();

    // Check if this completes the collection
    if (updated.length === ALL_STARS.length) {
      setTimeout(() => {
        sound.playConstellationFanfare();
        triggerConstellationConfetti();
        setShowConstellationModal(true);
      }, 500);
    }
  };

  const triggerConstellationConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#F4C96B', '#FFE082', '#A34063', '#FFF8F1', '#F5E8DC']
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors: ['#F4C96B', '#A34063', '#FFF8F1']
        });
      }, 250);
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors: ['#F4C96B', '#A34063', '#FFF8F1']
        });
      }, 400);
    } catch {
      // Confetti fallback
    }
  };

  const isCollected = (id) => collected.includes(id);

  const resetProgress = () => {
    setCollected([]);
    try {
      localStorage.removeItem('yuvvi_collected_stars');
    } catch {
      // Storage unavailable
    }
  };

  const closeRecentToast = () => setRecentStar(null);

  return (
    <StarContext.Provider
      value={{
        collected,
        total: ALL_STARS.length,
        isAllCollected: collected.length === ALL_STARS.length,
        collectStar,
        isCollected,
        allStars: ALL_STARS,
        recentStar,
        closeRecentToast,
        showConstellationModal,
        setShowConstellationModal,
        resetProgress,
        triggerConstellationConfetti,
        soundMuted,
        toggleSound
      }}
    >
      {children}
    </StarContext.Provider>
  );
};

export const useStars = () => useContext(StarContext);
