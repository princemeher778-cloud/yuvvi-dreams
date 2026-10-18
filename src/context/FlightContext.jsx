import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { sound } from '../utils/audio';

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [flightState, setFlightState] = useState('idle'); // 'idle' | 'noticing' | 'flying' | 'revealing'
  const [activeDestination, setActiveDestination] = useState(null);
  const [originCoords, setOriginCoords] = useState({ x: 300, y: 300 });
  const [targetCoords, setTargetCoords] = useState({ x: 700, y: 400 });
  const [flightProgress, setFlightProgress] = useState(0); // 0 to 1
  const [cloudsParted, setCloudsParted] = useState(false);
  const [starRevealed, setStarRevealed] = useState(false);

  const animFrameRef = useRef(null);
  const timeoutRef = useRef(null);

  const cancelRunningFlight = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const startFlight = ({
    destination, // { id, title, route, tagline, description }
    originRect, // DOMRect of Yuvvi or starting element
    targetRect, // DOMRect of the clicked heading
    onNavigate
  }) => {
    cancelRunningFlight();

    const startX = originRect
      ? originRect.left + originRect.width * 0.7
      : window.innerWidth * 0.35;
    const startY = originRect
      ? originRect.top + originRect.height * 0.45
      : window.innerHeight * 0.45;

    const endX = targetRect
      ? targetRect.left + targetRect.width * 0.5
      : window.innerWidth * 0.7;
    const endY = targetRect
      ? targetRect.top + targetRect.height * 0.5
      : window.innerHeight * 0.45;

    setOriginCoords({ x: startX, y: startY });
    setTargetCoords({ x: endX, y: endY });
    setActiveDestination(destination);
    setFlightProgress(0);
    setCloudsParted(false);
    setStarRevealed(false);

    // Stage 1: User selects heading -> Yuvvi notices & lantern surges
    setFlightState('noticing');
    sound.playLanternGlow();

    // Stage 2: Take Flight after brief particle gather
    timeoutRef.current = setTimeout(() => {
      setFlightState('flying');
      sound.playFlightWhoosh();

      const startTime = performance.now();
      const flightDuration = 850; // ms for smooth, cinematic curved transit

      const animateFlight = (time) => {
        const elapsed = time - startTime;
        const rawProgress = Math.min(elapsed / flightDuration, 1);

        // Smooth cubic ease-in-out
        const progress =
          rawProgress < 0.5
            ? 4 * rawProgress * rawProgress * rawProgress
            : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

        setFlightProgress(progress);

        // Stage 4: Clouds part as Yuvvi approaches (at ~65% progress)
        if (progress > 0.65) {
          setCloudsParted(true);
        }

        if (rawProgress < 1) {
          animFrameRef.current = requestAnimationFrame(animateFlight);
        } else {
          // Stage 5: Hidden Star Appears
          setFlightState('revealing');
          setStarRevealed(true);
          sound.playStarReveal();

          // Stage 6: Destination opens automatically after short purposeful pause
          timeoutRef.current = setTimeout(() => {
            if (onNavigate) {
              onNavigate(destination.route);
            }
            // Reset to idle
            timeoutRef.current = setTimeout(() => {
              setFlightState('idle');
              setActiveDestination(null);
              setCloudsParted(false);
              setStarRevealed(false);
            }, 600);
          }, 450);
        }
      };

      animFrameRef.current = requestAnimationFrame(animateFlight);
    }, 280);
  };

  const skipFlight = (route, onNavigate) => {
    cancelRunningFlight();
    setFlightState('idle');
    setActiveDestination(null);
    if (onNavigate) onNavigate(route);
  };

  useEffect(() => {
    return () => cancelRunningFlight();
  }, []);

  return (
    <FlightContext.Provider
      value={{
        flightState,
        activeDestination,
        originCoords,
        targetCoords,
        flightProgress,
        cloudsParted,
        starRevealed,
        startFlight,
        skipFlight
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};

export const useFlight = () => useContext(FlightContext);
