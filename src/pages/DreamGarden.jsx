import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CollectibleStar } from '../components/CollectibleStar';
import { YuvviCharacter } from '../components/YuvviCharacter';
import { Flower2, Sparkles, ArrowLeft, BookOpen, Star, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const INITIAL_WISHES = [
  {
    id: 'seed-1',
    text: 'May everyone who feels lonely find a gentle friend who understands them without words.',
    color: '#FFD985',
    date: 'A quiet evening',
    x: 22,
    y: 28
  },
  {
    id: 'seed-2',
    text: 'I wish to finish the storybook I started writing three winters ago.',
    color: '#A8D9FF',
    date: 'Under a crescent moon',
    x: 48,
    y: 18
  },
  {
    id: 'seed-3',
    text: 'Hoping that wherever stray cats sleep tonight, the wind stays warm and soft.',
    color: '#D99BCB',
    date: 'Starlight whisper',
    x: 75,
    y: 32
  }
];

const STAR_COLORS = [
  { label: 'Starlight Gold', value: '#FFD985' },
  { label: 'Moonlight Blue', value: '#A8D9FF' },
  { label: 'Misty Lavender', value: '#B6A4FF' },
  { label: 'Soft Rose', value: '#D99BCB' }
];

export const DreamGarden = () => {
  const navigate = useNavigate();
  const [wishInput, setWishInput] = useState('');
  const [selectedColor, setSelectedColor] = useState(STAR_COLORS[0].value);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [justPlantedStar, setJustPlantedStar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbStatus, setDbStatus] = useState('local'); // 'connected' | 'offline' | 'local'

  const [wishes, setWishes] = useState(() => {
    try {
      const saved = localStorage.getItem('yuvvi_garden_wishes');
      return saved ? JSON.parse(saved) : INITIAL_WISHES;
    } catch {
      return INITIAL_WISHES;
    }
  });

  // Keep local storage synchronized as an offline resilience layer
  useEffect(() => {
    try {
      localStorage.setItem('yuvvi_garden_wishes', JSON.stringify(wishes));
    } catch {
      // Storage unavailable
    }
  }, [wishes]);

  // Fetch approved wishes from Supabase if configured; fall back gracefully to local storage
  useEffect(() => {
    let isMounted = true;

    async function loadWishes() {
      if (!isSupabaseConfigured() || !supabase) {
        if (isMounted) setDbStatus('local');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('dream_wishes')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(40);

        if (error) {
          console.warn('Supabase query error, fallback to local storage:', error.message);
          if (isMounted) setDbStatus('offline');
        } else if (data && data.length > 0) {
          if (isMounted) {
            const mapped = data.map((item) => ({
              id: item.id,
              text: item.text,
              color: item.color || item.hue || '#FFD985',
              x: Number(item.x) || 50,
              y: Number(item.y) || 30,
              date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Starlight'
            }));
            setWishes(mapped);
            setDbStatus('connected');
          }
        } else {
          // Connected, table exists
          if (isMounted) setDbStatus('connected');
        }
      } catch (err) {
        console.warn('Network issue reaching Supabase, using local wishes:', err);
        if (isMounted) setDbStatus('offline');
      }
    }

    loadWishes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePlantWish = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setConfirmationMessage('');

    const trimmed = wishInput.trim();
    if (!trimmed) {
      sound.playChime(392, 'sine', 0.4);
      setErrorMessage('Even the smallest whisper counts, but Yuvvi needs a few words to weave a star! 🌟');
      return;
    }

    if (trimmed.length < 4) {
      sound.playChime(392, 'sine', 0.4);
      setErrorMessage('Please share a tiny bit more so your wish can shine brightly. ✨');
      return;
    }

    // Play rising harp cascade and lantern glow
    sound.playWishPlanted();
    setIsSubmitting(true);

    const xPos = Math.floor(Math.random() * 70) + 15;
    const yPos = Math.floor(Math.random() * 45) + 15;

    const newStar = {
      id: `wish-${Date.now()}`,
      text: trimmed,
      color: selectedColor,
      date: 'Planted just now',
      x: xPos,
      y: yPos
    };

    setJustPlantedStar(newStar);
    setWishes((prev) => [newStar, ...prev]);
    setWishInput('');

    // Attempt Supabase insert if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('dream_wishes')
          .insert([
            {
              text: trimmed,
              color: selectedColor,
              x: xPos,
              y: yPos,
              is_approved: false
            }
          ]);

        if (error) {
          console.warn('Supabase insert error, reverting star:', error.message);
          setDbStatus('offline');
          setJustPlantedStar(null);
          setWishes((prev) => prev.filter((w) => w.id !== newStar.id));
          setErrorMessage(`Database submission could not be completed: ${error.message}`);
        } else {
          setDbStatus('connected');
          setConfirmationMessage('Your dream has been safely sent to Yuvvi’s sky! (Awaiting starlight blessing) ✨');
        }
      } catch (err) {
        console.warn('Network issue during insert:', err);
        setDbStatus('offline');
        setJustPlantedStar(null);
        setWishes((prev) => prev.filter((w) => w.id !== newStar.id));
        setErrorMessage('Network connection error: could not reach the cloud database. Please try again.');
      }
    } else {
      setConfirmationMessage('Your dream has found a little place in local star memory. ✨');
    }

    setIsSubmitting(false);

    setTimeout(() => {
      setJustPlantedStar(null);
    }, 3800);
  };

  const handleClearCustomWishes = () => {
    sound.playChime(523.25, 'sine', 0.3);
    setWishes(INITIAL_WISHES);
  };

  return (
    <div className="dream-garden-page" style={{ paddingTop: '2.5rem', paddingBottom: '5.5rem', position: 'relative', zIndex: 5 }}>
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
              to="/dream-library"
              className="btn btn-secondary"
              onClick={() => sound.playChime(659.25, 'sine', 0.4)}
              style={{ fontSize: '0.88rem', padding: '0.55rem 1.15rem' }}
            >
              <span>Revisit Dream Library</span>
              <BookOpen size={16} />
            </Link>
          </div>
        </div>

        {/* Hero Title & Atmosphere */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
            <div className="badge badge-moon">
              <Flower2 size={15} />
              <span>Sacred Sanctuary of Wishes</span>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-rounded)',
                backgroundColor:
                  dbStatus === 'connected'
                    ? 'rgba(85, 239, 196, 0.12)'
                    : dbStatus === 'offline'
                    ? 'rgba(255, 118, 117, 0.12)'
                    : 'rgba(255, 217, 133, 0.12)',
                border:
                  dbStatus === 'connected'
                    ? '1px solid rgba(85, 239, 196, 0.35)'
                    : dbStatus === 'offline'
                    ? '1px solid rgba(255, 118, 117, 0.35)'
                    : '1px solid rgba(255, 217, 133, 0.35)',
                color:
                  dbStatus === 'connected'
                    ? '#55efc4'
                    : dbStatus === 'offline'
                    ? '#ff7675'
                    : '#FFD985'
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor:
                    dbStatus === 'connected' ? '#55efc4' : dbStatus === 'offline' ? '#ff7675' : '#FFD985',
                  boxShadow:
                    dbStatus === 'connected' ? '0 0 8px #55efc4' : 'none'
                }}
              />
              <span>
                {dbStatus === 'connected'
                  ? 'Supabase Cloud Connected'
                  : dbStatus === 'offline'
                  ? 'Offline (Local Fallback)'
                  : 'Local Storage Memory'}
              </span>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.4rem)', marginBottom: '1rem' }}>
            Your Dream Garden
          </h1>
          <p style={{ fontSize: '1.14rem', color: 'var(--color-text-sub)', lineHeight: 1.68 }}>
            A dark, peaceful celestial garden with glowing nocturnal flowers and starlight soil.
            Whisper your wish, water it with belief, and watch Yuvvi follow it with the lantern as it becomes a star.
          </p>
        </div>

        {/* GARDEN & NIGHT SKY STAGE */}
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            background: 'linear-gradient(180deg, #090914 0%, #15152D 55%, #182422 100%)',
            border: '2px solid rgba(182, 164, 255, 0.22)',
            boxShadow: '0 25px 60px rgba(8, 8, 17, 0.9)',
            padding: '2.2rem',
            minHeight: '460px',
            overflow: 'hidden',
            marginBottom: '3.5rem'
          }}
        >
          {/* Secret Collectible Star #4 (Seed of Wonder) */}
          <div
            style={{
              position: 'absolute',
              bottom: '45px',
              left: '12%',
              zIndex: 20
            }}
          >
            <CollectibleStar
              id="garden-star"
              size={38}
              hint="Inside a glowing night lily at the garden edge, you spot the Seed of Wonder! Click to gather."
            />
          </div>

          {/* Moonlight & Constellation Sky Stars */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            aria-hidden="true"
          >
            {/* Soft Crescent Moon */}
            <g transform="translate(80, 70)">
              <circle cx="0" cy="0" r="32" fill="#FFF8DE" opacity="0.9" filter="drop-shadow(0 0 25px #FFD985)" />
              <circle cx="12" cy="-6" r="28" fill="#090914" />
            </g>

            {/* Background Twinkling Night Stars */}
            <circle cx="20%" cy="15%" r="1.5" fill="#FFF" className="animate-twinkle" />
            <circle cx="35%" cy="30%" r="2" fill="#FFD985" className="animate-twinkle" />
            <circle cx="65%" cy="18%" r="1.5" fill="#FFF" className="animate-twinkle" />
            <circle cx="85%" cy="25%" r="2" fill="#A8D9FF" className="animate-twinkle" />
            <circle cx="50%" cy="40%" r="1.2" fill="#FFF" className="animate-twinkle" />
          </svg>

          {/* Planted Wish Stars Floating in the Sky */}
          <div style={{ position: 'relative', height: '260px', zIndex: 10 }}>
            {wishes.map((w) => (
              <div
                key={w.id}
                title={`"${w.text}" (${w.date})`}
                style={{
                  position: 'absolute',
                  top: `${w.y}%`,
                  left: `${w.x}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div
                  className="animate-twinkle"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(30, 30, 59, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 20px ${w.color}`
                  }}
                >
                  <Star size={18} fill={w.color} stroke={w.color} />
                </div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: '#FFD985',
                    fontFamily: 'var(--font-rounded)',
                    marginTop: '2px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    maxWidth: '130px',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {w.text}
                </span>
              </div>
            ))}
            {wishes.length === 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'var(--color-lavender)',
                  fontFamily: 'var(--font-rounded)',
                  fontSize: '0.92rem',
                  opacity: 0.8
                }}
              >
                The sky is quiet and peaceful. Whisper a wish below to plant the first star! ✨
              </div>
            )}

            {/* Rising Star Animation for Just Planted Wish */}
            {justPlantedStar && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: `${justPlantedStar.x}%`,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  animation: 'riseIntoSky 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  zIndex: 30
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 217, 133, 0.5)',
                    boxShadow: '0 0 45px #FFD985, 0 0 90px #B6A4FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Star size={26} fill="#FFFFFF" stroke="#FFD985" />
                </div>
                <span
                  style={{
                    color: '#FFD985',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-rounded)',
                    fontWeight: 700,
                    textShadow: '0 0 10px #FFD985'
                  }}
                >
                  Yuvvi lifts your wish into the stars! ✨
                </span>
              </div>
            )}
          </div>

          {/* Garden Foreground Ground with Yuvvi & Night Flowers */}
          <div
            style={{
              position: 'relative',
              zIndex: 15,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              paddingTop: '1.25rem',
              borderTop: '1.5px solid rgba(182, 164, 255, 0.16)'
            }}
          >
            {/* Friendly Yuvvi in Garden */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <YuvviCharacter size="small" expression="happy" customMessage="Your wish makes the sky glow brighter! 🌱" />
              <div style={{ color: 'var(--color-text-sub)', fontSize: '0.92rem', maxWidth: '340px' }}>
                <span style={{ fontFamily: 'var(--font-rounded)', fontWeight: 600, color: 'var(--color-gold)', display: 'block' }}>
                  Yuvvi's Starlight Soil
                </span>
                Hover or tap any star above to read quiet wishes planted by dreamers.
              </div>
            </div>

            {/* Reset / Count Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--color-lavender)' }}>
                {wishes.length} stars blossoming
              </span>
              {wishes.length > 3 && (
                <button
                  onClick={handleClearCustomWishes}
                  title="Reset to default seed wishes"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem'
                  }}
                >
                  <Trash2 size={13} />
                  <span>Reset Sky</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* WISH SUBMISSION FORM SECTION */}
        <div className="container-narrow">
          <div className="story-card" style={{ padding: '2.8rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.9rem', color: 'var(--color-moon-blue)', marginBottom: '0.45rem' }}>
                Plant Your Starlight Wish
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-sub)' }}>
                Whisper a hope, a kindness for a stranger, or a creative dream you haven’t given up on.
              </p>
            </div>

            <form onSubmit={handlePlantWish}>
              {/* Text Input Field */}
              <div style={{ marginBottom: '1.4rem' }}>
                <label
                  htmlFor="wish-input"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-rounded)',
                    fontWeight: 600,
                    fontSize: '0.94rem',
                    color: 'var(--color-text-main)',
                    marginBottom: '0.6rem'
                  }}
                >
                  What wish would you like to plant in Yuvvi’s sky?
                </label>
                <textarea
                  id="wish-input"
                  rows={3}
                  value={wishInput}
                  onChange={(e) => {
                    setWishInput(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. May I find the courage to share my art with the world..."
                  maxLength={180}
                  style={{
                    width: '100%',
                    padding: '1.1rem',
                    borderRadius: '16px',
                    border: errorMessage ? '2px solid #D99BCB' : '1.5px solid rgba(182, 164, 255, 0.25)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.05rem',
                    lineHeight: 1.5,
                    backgroundColor: 'rgba(13, 13, 30, 0.85)',
                    color: 'var(--color-text-main)',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  <span>Safe & privacy conscious (No personal data required)</span>
                  <span>{wishInput.length}/180</span>
                </div>
              </div>

              {/* Star Color Choice */}
              <div style={{ marginBottom: '1.85rem' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-rounded)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'var(--color-text-main)',
                    marginBottom: '0.55rem'
                  }}
                >
                  Select Your Star's Starlight Hue:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                  {STAR_COLORS.map((c) => {
                    const isSelected = selectedColor === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setSelectedColor(c.value)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '0.5rem 1rem',
                          borderRadius: '999px',
                          border: isSelected ? `2px solid ${c.value}` : '1.5px solid var(--color-indigo-border)',
                          backgroundColor: isSelected ? 'rgba(30, 30, 59, 0.9)' : 'rgba(13, 13, 30, 0.65)',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.88rem',
                          color: isSelected ? c.value : 'var(--color-text-sub)'
                        }}
                      >
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: c.value,
                            display: 'inline-block',
                            boxShadow: isSelected ? `0 0 10px ${c.value}` : 'none'
                          }}
                        />
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div
                  role="alert"
                  style={{
                    padding: '0.9rem 1.2rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(217, 155, 203, 0.2)',
                    border: '1px solid var(--color-rose)',
                    color: 'var(--color-rose)',
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '1.35rem',
                    animation: 'riseIntoSky 0.3s ease-out'
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Confirmation Message */}
              {confirmationMessage && (
                <div
                  role="status"
                  style={{
                    padding: '0.9rem 1.2rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(109, 85, 168, 0.35)',
                    border: '1px solid var(--color-gold)',
                    color: 'var(--color-gold)',
                    fontSize: '0.94rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '1.35rem',
                    animation: 'riseIntoSky 0.3s ease-out'
                  }}
                >
                  <CheckCircle2 size={18} color="var(--color-gold)" />
                  <span>{confirmationMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  className="btn btn-gold"
                  disabled={isSubmitting}
                  style={{ fontSize: '1.08rem', padding: '0.95rem 2.6rem', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  <Sparkles size={18} />
                  <span>{isSubmitting ? 'Weaving Starlight...' : 'Plant My Star'}</span>
                </button>
              </div>

              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '1.25rem'
                }}
              >
                {dbStatus === 'connected'
                  ? '✨ Connected to Supabase: Your planted stars are stored in the cloud PostgreSQL database.'
                  : '✨ Graceful offline & local storage fallback active. (Connect your Supabase project in .env anytime)'}
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '3.8rem'
          }}
        >
          <Link
            to="/story"
            className="btn btn-primary"
            onClick={() => sound.playChime(659.25, 'sine', 0.5)}
            style={{ padding: '0.85rem 2.2rem' }}
          >
            <span>Read Yuvvi's Illustrated Story</span>
            <Sparkles size={18} />
          </Link>

          <Link to="/" className="btn btn-secondary" style={{ padding: '0.85rem 1.85rem' }}>
            <span>Back to Home Entrance</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
