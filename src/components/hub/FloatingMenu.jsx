import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, BookOpen, Sparkles, X, Phone, HelpCircle, Trash2, Copy, Video, Mic, Radio, Trophy } from 'lucide-react';
import useSupabase from '../../hooks/useSupabase';
import { promptMixer, writerPromptMixer } from '../../utils/aiPrompts';

import cgptLogo from '../../assets/icons/cgpt_logo.svg';
import geminiLogo from '../../assets/icons/gemini_logo.svg';
import claudeLogo from '../../assets/icons/claude_logo.svg';

const MenuBtn = ({ item, onClick, active, isSmall = true, isAI = false, badge = 0 }) => (
  <button
    onClick={onClick}
    style={{
      width: isSmall ? '42px' : '52px', height: isSmall ? '42px' : '52px',
      borderRadius: isSmall ? '14px' : '18px', border: isSmall ? 'none' : '1px solid var(--color-border)',
      background: !isSmall && active ? '#fff' : 'var(--color-glass)',
      color: (!isSmall && active) ? '#000' : (active ? 'var(--color-accent)' : 'rgba(255,255,255,0.4)'),
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: 'all', position: 'relative'
    }}
    title={item.label}
  >
    {item.icon}
    {badge > 0 && !isAI && (
      <div style={{ position: 'absolute', top: '-5px', left: '-5px', background: '#fff', color: '#000', fontSize: '10px', fontWeight: '800', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(0,0,0,0.5)' }}>
        {badge}
      </div>
    )}
  </button>
);

export default function FloatingMenu() {
  const navigate = useNavigate();
  const loc = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [aiData, setAiData] = useState({ count: 0, ids: [], mode: 'all', type: 'photo', formData: null });

  const isP = loc.pathname.startsWith('/p/');
  const slug = isP ? loc.pathname.split('/')[2] : null;
  const { data: profile } = useSupabase(slug ? 'consultants' : null, { filter: slug ? { column: 'slug', operator: 'eq', value: slug } : null, single: true });

  useEffect(() => {
    const handleAIChange = (e) => setAiData(e.detail);
    window.addEventListener('ai-selection-changed', handleAIChange);
    return () => window.removeEventListener('ai-selection-changed', handleAIChange);
  }, []);

  const handleAIAction = (type) => {
    if (type === 'clear') {
      window.dispatchEvent(new CustomEvent('ai-selection-clear'));
      setAiData({ count: 0, ids: [], mode: 'all', type: 'photo', formData: null });
      return;
    }

    let finalPrompt = "";
    if (aiData.type === 'writer') {
      // Writer prompts are single selection usually, but we join if multiple are selected
      finalPrompt = aiData.ids.map(id => writerPromptMixer(id, aiData.formData)).join("\n\n---\n\n");
    } else {
      finalPrompt = promptMixer(aiData.ids, aiData.mode);
    }

    navigator.clipboard.writeText(finalPrompt);
    if (type === 'gpt') window.open('https://chat.openai.com', '_blank');
    if (type === 'gemini') window.open('https://gemini.google.com', '_blank');
    if (type === 'claude') window.open('https://claude.ai', '_blank');
    setIsOpen(false);
  };

  const hubItems = [
    { id: 'home', path: '/akademi', icon: <Trophy size={20} />, label: 'Ana Sayfa' },
    { id: 'library', path: '/', icon: <BookOpen size={20} />, label: 'Kütüphane' },
    { id: 'ajansa', path: '/ajansa', icon: <Radio size={20} />, label: 'Ajansa' },
  ];

  const navItems = isP ? [
    { id: 'home', path: `/p/${slug}`, icon: <LayoutGrid size={20} />, label: 'Profil' },
    { id: 'news', path: `/`, icon: <HelpCircle size={20} />, label: 'Tüm Sorular' },
    { id: 'call', type: 'ext', url: profile ? `tel:${profile.phone_num}` : '#', icon: <Phone size={20} />, label: 'Ara' }
  ] : hubItems;

  const current = navItems.find(i => loc.pathname === i.path) || navItems[0];
  const others = navItems.filter(i => i.id !== current.id);

  return (
    <div style={{ position: 'absolute', bottom: '16px', right: '12px', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', pointerEvents: 'none' }}>

      {/* AI ACTIONS OVERLAY */}
      {aiData.count > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--color-glass-heavy)', backdropFilter: 'blur(30px)', padding: '5px', borderRadius: '18px', border: '1px solid var(--color-border-heavy)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', transform: `translateX(${isOpen ? '0' : '80px'})`, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', marginBottom: '4px' }}>
          <button onClick={() => handleAIAction('gpt')} style={{ width: '42px', height: '42px', borderRadius: '14px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={cgptLogo} style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} alt="GPT" />
          </button>
          <button onClick={() => handleAIAction('gemini')} style={{ width: '42px', height: '42px', borderRadius: '14px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={geminiLogo} style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} alt="Gemini" />
          </button>
          <button onClick={() => handleAIAction('claude')} style={{ width: '42px', height: '42px', borderRadius: '14px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={claudeLogo} style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} alt="Claude" />
          </button>
          <button onClick={() => handleAIAction('copy')} style={{ width: '42px', height: '42px', borderRadius: '14px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Copy size={20} />
          </button>
          <button onClick={() => handleAIAction('clear')} style={{ width: '42px', height: '42px', borderRadius: '14px', border: 'none', background: 'transparent', color: '#ff4d4d', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>
            <Trash2 size={20} />
          </button>
        </div>
      )}

      {/* REGULAR NAV ACTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--color-glass-heavy)', backdropFilter: 'blur(30px)', padding: '5px', borderRadius: '18px', border: '1px solid var(--color-border-heavy)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', transform: `translateX(${isOpen ? '0' : '80px'})`, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {others.map(i => (
          <MenuBtn 
            key={i.id} 
            item={i} 
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation();
              navigate(i.path); 
              setIsOpen(false); 
            }} 
            active={false} 
          />
        ))}
      </div>

      {/* MAIN TRIGGER */}
      <div style={{ pointerEvents: 'all' }}>
        <MenuBtn 
          item={current} 
          onClick={(e) => { 
            e.stopPropagation();
            setIsOpen(!isOpen); 
          }} 
          active={isOpen} 
          isSmall={false} 
          badge={aiData.count} 
        />
      </div>
    </div>
  );
}
