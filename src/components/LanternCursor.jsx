import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const LanternCursor = () => {
  const { isDayMode } = useTheme();
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);
  const [touchPulses, setTouchPulses] = useState([]);
  const [isEnabled, setIsEnabled] = useState(() => {
    try {
      return localStorage.getItem('yuvvi_lantern_cursor') !== 'false';
    } catch {
      return true;
    }
  });

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion || !isEnabled) return;

    let animFrame = null;
    let targetX = -200;
    let targetY = -200;
    let currentX = -200;
    let currentY = -200;

    const handlePointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);
    };

    const handlePointerLeave = () => {
      setVisible(false);
    };

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const newPulse = {
        id: Date.now(),
        x: touch.clientX,
        y: touch.clientY
      };
      setTouchPulses((prev) => [...prev.slice(-3), newPulse]);

      setTimeout(() => {
        setTouchPulses((prev) => prev.filter((p) => p.id !== newPulse.id));
      }, 1600);
    };

    const renderLoop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setPos({ x: currentX, y: currentY });
      animFrame = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    animFrame = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isEnabled, prefersReducedMotion, visible]);

  if (!isEnabled || prefersReducedMotion) return null;

  return (
    <>
      {/* Desktop Following Lantern Light */}
      <div
        className="lantern-cursor-glow"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isDayMode ? '340px' : '380px',
          height: isDayMode ? '340px' : '380px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 85,
          opacity: visible ? (isDayMode ? 0.35 : 0.65) : 0,
          transform: `translate3d(${pos.x - (isDayMode ? 170 : 190)}px, ${pos.y - (isDayMode ? 170 : 190)}px, 0)`,
          background: isDayMode
            ? 'radial-gradient(circle, rgba(255, 235, 170, 0.45) 0%, rgba(255, 214, 110, 0.15) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 217, 133, 0.32) 0%, rgba(182, 164, 255, 0.16) 45%, rgba(21, 21, 45, 0) 70%)',
          filter: 'blur(10px)',
          mixBlendMode: 'screen',
          transition: 'opacity 0.3s ease',
          willChange: 'transform, opacity'
        }}
        aria-hidden="true"
      />

      {/* Touch Screen Tap Expanding Lantern Pulses */}
      {touchPulses.map((pulse) => (
        <div
          key={pulse.id}
          style={{
            position: 'fixed',
            left: `${pulse.x}px`,
            top: `${pulse.y}px`,
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 85,
            background: 'radial-gradient(circle, rgba(255, 217, 133, 0.45) 0%, rgba(182, 164, 255, 0.2) 40%, transparent 70%)',
            animation: 'destinationStarPulse 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            mixBlendMode: 'screen'
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
};
