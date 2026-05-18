import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Library, UploadCloud, 
  Sparkles, Lightbulb, GraduationCap
} from 'lucide-react';
import { GlassCard } from '../../components/ortak';

// Import actual live operational UI components
import LibraryPage from './Library';
import IcerikGunuFlow from '../../components/hub/ajansa/IcerikGunuFlow';
import AiStudio from '../../components/hub/ajansa/AiStudio';
import FikirKutusu from '../../components/hub/ajansa/FikirKutusu';
import Akademi from '../../components/hub/ajansa/Akademi';

// Styling definitions
const contentBoxStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1.5rem', width: '100%' };
const navBtnStyle = { 
  width: '56px', height: '56px', borderRadius: '18px', 
  background: 'rgba(255,255,255,0.04)', color: '#fff', cursor: 'pointer', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', 
  border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s' 
};
const dockItemStyle = {
  width: '76px', height: '76px', borderRadius: '22px',
  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
  transition: 'all 0.3s ease'
};

// Tall and Narrow Smartphone Proportion Frame (Perfect 9:16 Aspect Ratio)
const mobileFrameStyle = {
  width: '280px',
  height: '440px',
  background: '#000000',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '32px',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative'
};

// Highly scaled content (0.55x scale for premium compact phone viewport simulation)
const scaledContentStyle = {
  width: '509px',
  height: '800px',
  transform: 'scale(0.55)',
  transformOrigin: 'center center',
  flexShrink: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '20px',
  textAlign: 'left'
};

// Local Vertical Menu Mock-up Component for Slides
const RenderVerticalMenuMock = ({ activeId }) => {
  const items = [
    { id: 'library', icon: <Library size={22} />, label: 'Kütüphane' },
    { id: 'upload', icon: <UploadCloud size={22} />, label: 'İçerik Günü' },
    { id: 'ads', icon: <Sparkles size={22} />, label: 'İlanlar' },
    { id: 'fikir', icon: <Lightbulb size={22} />, label: 'Fikir Kutusu' },
    { id: 'akademi', icon: <GraduationCap size={22} />, label: 'Görevler' },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '12px', 
      background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)',
      padding: '14px', borderRadius: '28px', boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
      width: '74px', alignItems: 'center'
    }}>
      {items.map(item => {
        const isActive = item.id === activeId;
        return (
          <motion.div 
            key={item.id}
            animate={isActive ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{
              width: '48px', height: '48px', borderRadius: '15px',
              background: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.02)',
              color: isActive ? '#000' : 'rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: isActive ? 'none' : '1px solid rgba(255,255,255,0.04)',
              transition: 'all 0.3s ease',
              boxShadow: isActive ? '0 0 20px var(--color-accent)' : 'none'
            }}
          >
            {item.icon}
          </motion.div>
        );
      })}
    </div>
  );
};

const SLIDES = [
  {
    id: 'wheel',
    breadcrumb: '',
    content: (
      <div style={contentBoxStyle}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '900', letterSpacing: '-0.03em', margin: 0, textTransform: 'uppercase' }}>MASTER KOKPİT</h1>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '1rem 2rem', borderRadius: '32px' }}>
          <div style={dockItemStyle}><Library size={32} color="#fff" /></div>
          <div style={dockItemStyle}><UploadCloud size={32} color="#fff" /></div>
          <div style={{ ...dockItemStyle, background: 'var(--color-accent)', color: '#000', border: 'none', boxShadow: '0 0 25px var(--color-accent)' }}><Sparkles size={32} /></div>
          <div style={dockItemStyle}><Lightbulb size={32} color="#fff" /></div>
          <div style={dockItemStyle}><GraduationCap size={32} color="#fff" /></div>
        </div>
      </div>
    )
  },
  {
    id: 'library-feed',
    breadcrumb: 'kütüphane / akış',
    content: (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', minHeight: '440px' }}>
        {/* Absolutely positioned far-left Float Menu Dock */}
        <div style={{ position: 'absolute', left: '1rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <RenderVerticalMenuMock activeId="library" />
          <div style={{ width: '1px', height: '360px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
        {/* Absolutely Centered Phone Mockup - Library Feed Tab */}
        <div style={mobileFrameStyle}>
          <div className="no-scrollbar" style={scaledContentStyle}>
            <LibraryPage tabOverride="feed" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'library-hashtags',
    breadcrumb: 'kütüphane / hashtagler',
    content: (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', minHeight: '440px' }}>
        {/* Absolutely positioned far-left Float Menu Dock */}
        <div style={{ position: 'absolute', left: '1rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <RenderVerticalMenuMock activeId="library" />
          <div style={{ width: '1px', height: '360px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
        {/* Absolutely Centered Phone Mockup - Library Hashtags Tab */}
        <div style={mobileFrameStyle}>
          <div className="no-scrollbar" style={scaledContentStyle}>
            <LibraryPage tabOverride="hashtags" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'library-news',
    breadcrumb: 'kütüphane / haberler',
    content: (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', minHeight: '440px' }}>
        {/* Absolutely positioned far-left Float Menu Dock */}
        <div style={{ position: 'absolute', left: '1rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <RenderVerticalMenuMock activeId="library" />
          <div style={{ width: '1px', height: '360px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
        {/* Absolutely Centered Phone Mockup - Library News Tab */}
        <div style={mobileFrameStyle}>
          <div className="no-scrollbar" style={scaledContentStyle}>
            <LibraryPage tabOverride="news" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'library-objections',
    breadcrumb: 'kütüphane / itirazlar',
    content: (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', minHeight: '440px' }}>
        {/* Absolutely positioned far-left Float Menu Dock */}
        <div style={{ position: 'absolute', left: '1rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <RenderVerticalMenuMock activeId="library" />
          <div style={{ width: '1px', height: '360px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
        {/* Absolutely Centered Phone Mockup - Library Objections Tab */}
        <div style={mobileFrameStyle}>
          <div className="no-scrollbar" style={scaledContentStyle}>
            <LibraryPage tabOverride="objections" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'upload',
    breadcrumb: 'kütüphane / akışlar',
    content: (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', minHeight: '440px' }}>
        {/* Absolutely positioned far-left Float Menu Dock */}
        <div style={{ position: 'absolute', left: '1rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <RenderVerticalMenuMock activeId="upload" />
          <div style={{ width: '1px', height: '360px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
        {/* Absolutely Centered Phone Mockup - Content Day */}
        <div style={mobileFrameStyle}>
          <div className="no-scrollbar" style={scaledContentStyle}>
            <IcerikGunuFlow />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'ads',
    breadcrumb: 'ilan stüdyosu / yapay zeka',
    content: (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', minHeight: '440px' }}>
        {/* Absolutely positioned far-left Float Menu Dock */}
        <div style={{ position: 'absolute', left: '1rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <RenderVerticalMenuMock activeId="ads" />
          <div style={{ width: '1px', height: '360px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
        {/* Absolutely Centered Phone Mockup - AI Studio */}
        <div style={mobileFrameStyle}>
          <div className="no-scrollbar" style={scaledContentStyle}>
            <AiStudio />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'fikir',
    breadcrumb: 'ajans / fikir kutusu',
    content: (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', minHeight: '440px' }}>
        {/* Absolutely positioned far-left Float Menu Dock */}
        <div style={{ position: 'absolute', left: '1rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <RenderVerticalMenuMock activeId="fikir" />
          <div style={{ width: '1px', height: '360px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
        {/* Absolutely Centered Phone Mockup - Idea Box */}
        <div style={mobileFrameStyle}>
          <div className="no-scrollbar" style={scaledContentStyle}>
            <FikirKutusu />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'akademi',
    breadcrumb: 'akademi / günlük görevler',
    content: (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', minHeight: '440px' }}>
        {/* Absolutely positioned far-left Float Menu Dock */}
        <div style={{ position: 'absolute', left: '1rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <RenderVerticalMenuMock activeId="akademi" />
          <div style={{ width: '1px', height: '360px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
        {/* Absolutely Centered Phone Mockup - Tasks */}
        <div style={mobileFrameStyle}>
          <div className="no-scrollbar" style={scaledContentStyle}>
            <Akademi />
          </div>
        </div>
      </div>
    )
  }
];

export default function Sunum() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Keyboard navigation support (ArrowRight / ArrowLeft / Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <div style={{ 
      width: '100vw', height: '100vh', background: '#000000', 
      display: 'flex', flexDirection: 'column', color: '#fff', 
      fontFamily: "'Outfit', 'Inter', sans-serif", overflow: 'hidden', 
      position: 'fixed', top: 0, left: 0, zIndex: 99999
    }}>
      
      {/* Global CSS to hide ugly scrollbars inside phone viewport */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
      
      {/* Top Slide Progress Indicator */}
      <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.03)', position: 'relative' }}>
        <motion.div 
          layoutId="progress"
          style={{ 
            height: '100%', background: 'var(--color-accent)', 
            width: `${((currentSlide + 1) / SLIDES.length) * 100}%`,
            transition: 'width 0.4s ease' 
          }} 
        />
      </div>

      {/* Main Slide Container */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ width: '100%', maxWidth: '900px' }}
          >
            <GlassCard padding="4rem" borderRadius="40px" style={{ minHeight: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 40px 90px rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
              {/* Top-Left Breadcrumb */}
              {slide.breadcrumb && (
                <div style={{ position: 'absolute', top: '2rem', left: '2rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', fontFamily: "'Outfit', sans-serif", letterSpacing: '1px', textTransform: 'lowercase' }}>
                  {slide.breadcrumb}
                </div>
              )}
              {slide.content}
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Buttons */}
      <div style={{ position: 'absolute', bottom: '2rem', right: '3rem', display: 'flex', gap: '1rem', pointerEvents: 'all' }}>
        <button 
          onClick={prevSlide} 
          disabled={currentSlide === 0}
          style={{ ...navBtnStyle, opacity: currentSlide === 0 ? 0.2 : 1 }}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide} 
          disabled={currentSlide === SLIDES.length - 1}
          style={{ ...navBtnStyle, opacity: currentSlide === SLIDES.length - 1 ? 0.2 : 1 }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Presenter Mode Hint */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '3rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }}>
        Klavye Yön Tuşları (← / →) veya Boşluk tuşu ile ilerleyin.
      </div>
    </div>
  );
}
