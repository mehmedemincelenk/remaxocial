import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/hub/Navbar';
import FloatingMenu from './components/hub/FloatingMenu';
import Home from './pages/hub/Home';
import Library from './pages/hub/Library';
import Ajansa from './pages/hub/Ajansa';
import VideoStudio from './pages/hub/VideoStudio';
import SelfieStudio from './pages/hub/SelfieStudio';
import VoiceTest from './pages/hub/VoiceTest';
import AIPromptLibrary from './pages/hub/AIPromptLibrary';
import ConsultantProfile from './pages/danisman/ConsultantProfile';
import DesktopWrapper from './components/ortak/DesktopWrapper';
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
  const isConsultantPage = location.pathname.startsWith('/d/');

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      background: '#000'
    }}>
      {!isConsultantPage && <Navbar />}

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
          <Route path="/akademi" element={<Home />} />
          <Route path="/ajansa" element={<Ajansa />} />
          <Route path="/ai" element={<AIPromptLibrary />} />
          <Route path="/kutuphane" element={<Library />} />
          <Route path="/studio" element={<VideoStudio />} />
          <Route path="/selfie" element={<SelfieStudio />} />
          <Route path="/voice-test" element={<VoiceTest />} />
        </Routes>
      </div>

      {!isConsultantPage && <FloatingMenu />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <DesktopWrapper>
        <AppContent />
      </DesktopWrapper>
    </Router>
  );
}

export default App;
