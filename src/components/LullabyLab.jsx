import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Music, Play, Pause, Square, Volume2, VolumeX, Moon, Sparkles, X, Clock } from 'lucide-react';

const TRACKS = [
  { id: 'starlight', title: 'Starlight Music Box', desc: 'Pentatonic crystalline chimes echoing across the night.' },
  { id: 'cloudCradle', title: 'Cloud Cradle Lullaby', desc: 'A slow waltz for resting tired thoughts on soft clouds.' },
  { id: 'midnightMoon', title: 'Midnight Moonbeam', desc: 'Gentle harp & bell harmonies inspired by sleeping constellations.' }
];

export const LullabyLab = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState('starlight');
  const [activeNoteIdx, setActiveNoteIdx] = useState(0);
  const [volume, setVolume] = useState(0.2);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null);
  const [timerRemainingSec, setTimerRemainingSec] = useState(null);

  useEffect(() => {
    setIsPlaying(sound.isLullabyPlaying());
  }, [isOpen]);

  // Handle note callback to animate music box tines
  const handleNote = (idx) => {
    setActiveNoteIdx(idx);
  };

  const togglePlay = () => {
    if (isPlaying) {
      sound.stopLullaby();
      setIsPlaying(false);
    } else {
      sound.startLullaby(activeTrack, handleNote);
      setIsPlaying(true);
    }
  };

  const selectTrack = (trackId) => {
    setActiveTrack(trackId);
    if (isPlaying) {
      sound.startLullaby(trackId, handleNote);
    }
  };

  const stopMusic = () => {
    sound.stopLullaby();
    setIsPlaying(false);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setLullabyVolume(val);
  };

  // Sleep timer countdown
  useEffect(() => {
    if (!sleepTimerMinutes || !isPlaying) {
      setTimerRemainingSec(null);
      return;
    }

    setTimerRemainingSec(sleepTimerMinutes * 60);

    const interval = setInterval(() => {
      setTimerRemainingSec((prev) => {
        if (!prev || prev <= 1) {
          sound.stopLullaby();
          setIsPlaying(false);
          setSleepTimerMinutes(null);
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMinutes, isPlaying]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 8, 17, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.2rem'
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Lullaby Lab - Sleepy Music Box"
      onClick={onClose}
    >
      <div
        className="lullaby-modal"
        style={{
          backgroundColor: 'var(--color-bg-base)',
          border: '1.5px solid var(--color-indigo-border)',
          borderRadius: '24px',
          maxWidth: '520px',
          width: '100%',
          padding: '2rem',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
          animation: 'riseIntoSky 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(182, 164, 255, 0.15)',
                border: '1.5px solid var(--color-lavender)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold)'
              }}
            >
              <Music size={22} className={isPlaying ? 'animate-twinkle' : ''} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--color-text-main)', fontFamily: 'var(--font-rounded)' }}>
                Yuvvi’s Lullaby Lab
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Soothing Web Audio music-box melodies
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Lullaby Lab"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Music Box Visualizer */}
        <div
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
            borderRadius: '18px',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated Winding Key */}
          <div
            style={{
              display: 'inline-block',
              transform: isPlaying ? `rotate(${activeNoteIdx * 15}deg)` : 'none',
              transition: 'transform 0.2s ease',
              marginBottom: '1rem'
            }}
          >
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="32" stroke="#FFD985" strokeWidth="4" strokeDasharray="6 4" />
              <path d="M 50 20 L 50 80 M 20 50 L 80 50" stroke="#B6A4FF" strokeWidth="3" />
              <circle cx="50" cy="50" r="10" fill="#FFD985" />
            </svg>
          </div>

          {/* Music Tine Bars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', height: '36px', alignItems: 'flex-end' }}>
            {[14, 22, 30, 26, 18, 32, 28, 20, 24, 16, 28, 22].map((height, i) => {
              const isHit = isPlaying && activeNoteIdx % 12 === i;
              return (
                <div
                  key={i}
                  style={{
                    width: '6px',
                    height: isHit ? `${height + 8}px` : `${height}px`,
                    backgroundColor: isHit ? '#FFD985' : 'rgba(182, 164, 255, 0.3)',
                    borderRadius: '4px',
                    boxShadow: isHit ? '0 0 10px #FFD985' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                />
              );
            })}
          </div>

          <p style={{ margin: '1rem 0 0', fontSize: '0.88rem', color: isPlaying ? 'var(--color-gold)' : 'var(--color-text-muted)', fontFamily: 'var(--font-rounded)' }}>
            {isPlaying ? '♪ Playing softly into the midnight air...' : 'Paused — Click play to wind the music box'}
          </p>
        </div>

        {/* Track Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
          {TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => selectTrack(track.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: activeTrack === track.id ? '1.5px solid var(--color-gold)' : '1px solid var(--color-card-border)',
                backgroundColor: activeTrack === track.id ? 'rgba(255, 217, 133, 0.1)' : 'var(--color-card-bg)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <span style={{ display: 'block', fontWeight: 600, fontSize: '0.92rem', color: activeTrack === track.id ? 'var(--color-gold)' : 'var(--color-text-main)' }}>
                  {track.title}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  {track.desc}
                </span>
              </div>
              {activeTrack === track.id && <Sparkles size={16} color="var(--color-gold)" />}
            </button>
          ))}
        </div>

        {/* Controls: Play/Pause, Volume, Timer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="btn btn-gold"
              onClick={togglePlay}
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.95rem' }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              <span>{isPlaying ? 'Pause' : 'Play Lullaby'}</span>
            </button>

            {isPlaying && (
              <button
                onClick={stopMusic}
                aria-label="Stop lullaby"
                style={{
                  background: 'none',
                  border: '1px solid var(--color-card-border)',
                  color: 'var(--color-text-sub)',
                  borderRadius: '10px',
                  padding: '8px',
                  cursor: 'pointer'
                }}
              >
                <Square size={16} />
              </button>
            )}
          </div>

          {/* Volume Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {volume === 0 ? <VolumeX size={16} color="var(--color-text-muted)" /> : <Volume2 size={16} color="var(--color-lavender)" />}
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.02"
              value={volume}
              onChange={handleVolumeChange}
              style={{ width: '90px', accentColor: 'var(--color-gold)', cursor: 'pointer' }}
              aria-label="Lullaby volume"
            />
          </div>
        </div>

        {/* Sleep Timer Toggle */}
        <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--color-card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            <Clock size={14} />
            <span>Sleep Timer:</span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[5, 15, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => setSleepTimerMinutes(sleepTimerMinutes === mins ? null : mins)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  borderRadius: '999px',
                  border: sleepTimerMinutes === mins ? '1px solid var(--color-gold)' : '1px solid var(--color-card-border)',
                  backgroundColor: sleepTimerMinutes === mins ? 'rgba(255, 217, 133, 0.2)' : 'transparent',
                  color: sleepTimerMinutes === mins ? 'var(--color-gold)' : 'var(--color-text-sub)',
                  cursor: 'pointer'
                }}
              >
                {mins}m
              </button>
            ))}
          </div>

          {timerRemainingSec && (
            <span style={{ fontSize: '0.78rem', color: 'var(--color-gold)', fontFamily: 'monospace' }}>
              {Math.floor(timerRemainingSec / 60)}:{(timerRemainingSec % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
