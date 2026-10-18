import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '../utils/audio';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDayMode, setIsDayMode] = useState(() => {
    try {
      const saved = localStorage.getItem('yuvvi_day_night_mode');
      return saved ? saved === 'day' : false; // default starry night
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('yuvvi_day_night_mode', isDayMode ? 'day' : 'night');
    } catch {
      // Storage unavailable
    }
    // Set theme attribute on html & body
    document.documentElement.setAttribute('data-theme', isDayMode ? 'day' : 'night');
  }, [isDayMode]);

  const toggleTheme = () => {
    sound.playChime(isDayMode ? 523.25 : 659.25, 'sine', 0.4);
    setIsDayMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDayMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
