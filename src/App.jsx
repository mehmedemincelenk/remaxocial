import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/hub/Navbar';
import FloatingMenu from './components/hub/FloatingMenu';

import Library from './pages/hub/Library';
import Ajansa from './pages/hub/Ajansa';
import VideoStudio from './pages/hub/VideoStudio';
import VoiceTest from './pages/hub/VoiceTest';
import AIPromptLibrary from './pages/hub/AIPromptLibrary';
import ConsultantProfile from './pages/danisman/ConsultantProfile';
import DesktopWrapper from './components/ortak/DesktopWrapper';
import { AppProvider, useAppContext } from './context/AppContext';
import { Toast, DevTools } from './components/ortak';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const AppContent = () => {
  const location = useLocation();
  const { toast, notify } = useAppContext();
  const isConsultantPage = location.pathname.startsWith('/d/');
  const showNavAndMenu = !isConsultantPage;

  return (
    <div id="app-viewport" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      background: '#000'
    }}>
      {showNavAndMenu && <Navbar />}

      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        WebkitOverflowScrolling: 'touch'
      }}>
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/d/:slug" element={<ConsultantProfile />} />

          <Route path="/ajansa" element={<Ajansa />} />
          <Route path="/ai" element={<AIPromptLibrary />} />
          <Route path="/kutuphane" element={<Library />} />
          <Route path="/studio" element={<VideoStudio />} />
          <Route path="/voice-test" element={<VoiceTest />} />
        </Routes>
      </div>

      <DevTools />
      {showNavAndMenu && <FloatingMenu />}

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => notify(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <DesktopWrapper>
          <AppContent />
        </DesktopWrapper>
      </Router>
    </AppProvider>
  );
}

export default App;
