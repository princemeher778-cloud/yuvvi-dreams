import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { Sparkles, Play, RotateCcw, Trophy, Star, ArrowLeft, ArrowRight, Heart } from 'lucide-react';

const ITEMS_CONFIG = [
  { type: 'star', label: '⭐ Golden Star', points: 15, color: '#FFD985', speed: 2.2, r: 16 },
  { type: 'bubble', label: '🫧 Dream Bubble', points: 10, color: '#A8D9FF', speed: 1.8, r: 18 },
  { type: 'wish', label: '✨ Wish Spark', points: 20, color: '#D99BCB', speed: 2.6, r: 14 },
  { type: 'puff', label: '☁️ Cloud Spore', points: 5, color: '#FFFFFF', speed: 1.5, r: 20 }
];

export const DreamCatcherGame = ({ onClose }) => {
  const [gameState, setGameState] = useState('menu'); // 'menu' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('yuvvi_dreamcatcher_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);

  const canvasRef = useRef(null);
  const playerRef = useRef({ x: 250, targetX: 250, width: 80, height: 40 });
  const itemsRef = useRef([]);
  const animFrameRef = useRef(null);
  const lastSpawnRef = useRef(0);

  const startGame = () => {
    sound.playLanternGlow();
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    itemsRef.current = [];
    playerRef.current.x = 250;
    playerRef.current.targetX = 250;
    lastSpawnRef.current = performance.now();
    setGameState('playing');
  };

  const restartGame = () => {
    startGame();
  };

  // Keyboard navigation
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      const step = 38;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        playerRef.current.targetX = Math.max(50, playerRef.current.targetX - step);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        playerRef.current.targetX = Math.min(450, playerRef.current.targetX + step);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main Game Loop (Canvas based)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const finishGame = () => {
      sound.playConstellationFanfare();
      setGameState('gameover');

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe confetti fallback
      }
    };

    let running = true;

    const loop = (time) => {
      if (!running) return;

      // 1. Clear background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. Smoothly lerp player toward targetX
      playerRef.current.x += (playerRef.current.targetX - playerRef.current.x) * 0.22;

      // 3. Spawn falling dream items
      if (time - lastSpawnRef.current > 720) {
        lastSpawnRef.current = time;
        const config = ITEMS_CONFIG[Math.floor(Math.random() * ITEMS_CONFIG.length)];
        itemsRef.current.push({
          ...config,
          id: Math.random(),
          x: 40 + Math.random() * (canvas.width - 80),
          y: -20,
          vy: config.speed + Math.random() * 0.8
        });
      }

      // 4. Update and draw items
      const player = playerRef.current;
      const playerY = canvas.height - 45;

      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];
        item.y += item.vy;

        // Draw falling dream item
        ctx.save();
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 12;
        ctx.fill();

        // Inner sparkle highlight
        ctx.beginPath();
        ctx.arc(item.x - item.r * 0.3, item.y - item.r * 0.3, item.r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        ctx.restore();

        // Collision Check with Yuvvi's Cloud Platform
        const inX = item.x >= player.x - 45 && item.x <= player.x + 45;
        const inY = item.y >= playerY - 20 && item.y <= playerY + 30;

        if (inX && inY) {
          // Catch!
          sound.playChime(587.33 + Math.min(item.points * 20, 400), 'sine', 0.4);
          setScore((s) => {
            const next = s + item.points;
            if (next > highScore) {
              setHighScore(next);
              try {
                localStorage.setItem('yuvvi_dreamcatcher_highscore', next.toString());
              } catch {}
            }
            return next;
          });
          setCombo((c) => c + 1);
          itemsRef.current.splice(i, 1);
          continue;
        }

        // Out of bounds
        if (item.y > canvas.height + 30) {
          itemsRef.current.splice(i, 1);
          setCombo(0);
        }
      }

      // 5. Draw Yuvvi on his Puffy Floating Cloud at player position
      ctx.save();
      ctx.translate(player.x, playerY);

      // Puffy Cloud Platform
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#B6A4FF';
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.arc(0, 8, 22, 0, Math.PI * 2);
      ctx.arc(-24, 12, 18, 0, Math.PI * 2);
      ctx.arc(24, 12, 18, 0, Math.PI * 2);
      ctx.fill();

      // Yuvvi miniature ghost body
      ctx.beginPath();
      ctx.arc(0, -12, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Forehead star
      ctx.beginPath();
      ctx.arc(0, -18, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD985';
      ctx.fill();

      // Cheerful Eyes
      ctx.fillStyle = '#15152D';
      ctx.beginPath();
      ctx.arc(-5, -12, 2, 0, Math.PI * 2);
      ctx.arc(5, -12, 2, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Lantern in front
      ctx.fillStyle = 'rgba(255, 217, 133, 0.4)';
      ctx.beginPath();
      ctx.arc(22, -8, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD985';
      ctx.fillRect(19, -12, 6, 9);

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      clearInterval(timerInterval);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, highScore]);

  // Pointer / Touch tracking on canvas
  const handlePointerMove = (e) => {
    if (gameState !== 'playing' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const scale = canvasRef.current.width / rect.width;
    playerRef.current.targetX = Math.max(45, Math.min(canvasRef.current.width - 45, x * scale));
  };

  const handleTouchMove = (e) => {
    if (gameState !== 'playing' || !canvasRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const scale = canvasRef.current.width / rect.width;
    playerRef.current.targetX = Math.max(45, Math.min(canvasRef.current.width - 45, x * scale));
  };

  return (
    <div
      className="dream-catcher-game-modal"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        border: '1.5px solid var(--color-card-border)',
        borderRadius: '24px',
        padding: '2rem',
        maxWidth: '560px',
        margin: '2rem auto',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        textAlign: 'center'
      }}
    >
      {/* Game Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--color-gold)" />
          <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--color-text-main)', fontFamily: 'var(--font-rounded)' }}>
            Yuvvi's Dream Catcher
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.84rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Trophy size={14} /> High: {highScore}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close Mini-Game"
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Play Area */}
      <div
        style={{
          position: 'relative',
          borderRadius: '18px',
          overflow: 'hidden',
          backgroundColor: '#0a0a18',
          border: '1.5px solid var(--color-indigo-border)',
          touchAction: 'none'
        }}
      >
        <canvas
          ref={canvasRef}
          width={500}
          height={380}
          onPointerMove={handlePointerMove}
          onTouchMove={handleTouchMove}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            cursor: gameState === 'playing' ? 'none' : 'default'
          }}
        />

        {/* HUD Overlay when playing */}
        {gameState === 'playing' && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '14px',
              right: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              fontFamily: 'var(--font-rounded)',
              fontSize: '1rem',
              fontWeight: 700
            }}
          >
            <div style={{ color: '#FFD985', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              Score: {score} {combo > 2 && <span style={{ color: '#D99BCB', fontSize: '0.85rem' }}>({combo}x combo!)</span>}
            </div>
            <div style={{ color: timeLeft <= 5 ? '#FF6B6B' : '#A8D9FF', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              Time: {timeLeft}s
            </div>
          </div>
        )}

        {/* Start Screen Overlay */}
        {gameState === 'menu' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(8, 8, 17, 0.88)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
          >
            <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏮</span>
            <h4 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem', color: 'var(--color-moon-blue)', fontFamily: 'var(--font-rounded)' }}>
              Catch the Falling Daydreams!
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-sub)', maxWidth: '380px', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Glide Yuvvi's floating companion cloud with your mouse, arrow keys, or finger to gather falling stars and dream bubbles before the night ends.
            </p>

            <button className="btn btn-gold" onClick={startGame} style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
              <Play size={18} />
              <span>Start Dream Catching</span>
            </button>
          </div>
        )}

        {/* Game Over Screen Overlay */}
        {gameState === 'gameover' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(8, 8, 17, 0.92)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
          >
            <span style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>⭐</span>
            <h4 style={{ fontSize: '1.6rem', margin: '0 0 0.2rem', color: '#FFD985', fontFamily: 'var(--font-rounded)' }}>
              Night Complete!
            </h4>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', margin: '0 0 0.5rem', fontWeight: 600 }}>
              Final Score: {score} points
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-lavender)', marginBottom: '1.5rem', fontFamily: 'var(--font-rounded)' }}>
              {score >= 250 ? '🌟 Grand Starlight Collector!' : score >= 150 ? '✨ Master Dream Weaver!' : '🌙 Gentle Starlight Gatherer!'}
            </p>

            <button className="btn btn-gold" onClick={restartGame} style={{ padding: '0.7rem 1.8rem', fontSize: '0.96rem' }}>
              <RotateCcw size={16} />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>

      {/* On-Screen Mobile Touch Controls */}
      {gameState === 'playing' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
          <button
            onPointerDown={() => {
              playerRef.current.targetX = Math.max(50, playerRef.current.targetX - 45);
            }}
            className="btn btn-secondary"
            style={{ padding: '0.6rem 1.4rem' }}
            aria-label="Move Yuvvi Left"
          >
            <ArrowLeft size={18} />
            <span>Left</span>
          </button>
          <button
            onPointerDown={() => {
              playerRef.current.targetX = Math.min(450, playerRef.current.targetX + 45);
            }}
            className="btn btn-secondary"
            style={{ padding: '0.6rem 1.4rem' }}
            aria-label="Move Yuvvi Right"
          >
            <span>Right</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Footer Instructions */}
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        Controls: Move mouse, swipe on mobile, or use <kbd>←</kbd> and <kbd>→</kbd> arrow keys.
      </div>
    </div>
  );
};
