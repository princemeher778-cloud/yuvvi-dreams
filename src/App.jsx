import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { StarProvider } from './context/StarContext';
import { FlightProvider } from './context/FlightContext';
import { DreamEnvironment } from './components/DreamEnvironment';
import { LivingFlightOverlay } from './components/LivingFlightOverlay';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ConstellationModal } from './components/ConstellationModal';
import { StarToast } from './components/StarToast';
import { LanternCursor } from './components/LanternCursor';
import { VisitorMemory } from './components/VisitorMemory';
import { YuvviChatbot } from './components/YuvviChatbot';
import { LullabyLab } from './components/LullabyLab';

import { Home } from './pages/Home';
import { DreamLibrary } from './pages/DreamLibrary';
import { Workshop } from './pages/Workshop';
import { DreamGarden } from './pages/DreamGarden';
import { Story } from './pages/Story';
import { NotFound } from './pages/NotFound';

// Helper component to smoothly scroll to top on page navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App = () => {
  const [lullabyOpen, setLullabyOpen] = useState(false);

  return (
    <ThemeProvider>
      <StarProvider>
        <FlightProvider>
          <BrowserRouter>
            <ScrollToTop />
            {/* Layered Cinematic Dream Environment */}
            <DreamEnvironment />

            {/* Living Flight Magical Line Overlay */}
            <LivingFlightOverlay />

            {/* Flashlight / Nightlight Cursor */}
            <LanternCursor />

            <div className="yuvvi-app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
              <Navbar onOpenLullaby={() => setLullabyOpen(true)} />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home onOpenLullaby={() => setLullabyOpen(true)} />} />
                  <Route path="/dream-library" element={<DreamLibrary />} />
                  <Route path="/workshop" element={<Workshop />} />
                  <Route path="/dream-garden" element={<DreamGarden />} />
                  <Route path="/story" element={<Story />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <ConstellationModal />
              <StarToast />
              <VisitorMemory />
              <YuvviChatbot />
              <LullabyLab isOpen={lullabyOpen} onClose={() => setLullabyOpen(false)} />
            </div>
          </BrowserRouter>
        </FlightProvider>
      </StarProvider>
    </ThemeProvider>
  );
};

export default App;
