import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Trophy, Video, Zap, Image as ImageIcon, Loader2, Check, PenLine, Copy, Database } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import { supabase } from '../../utils/supabaseClient';
import PageLayout from '../../components/ortak/PageLayout';
import GlassCard from '../../components/ortak/GlassCard';
import MegaToggle from '../../components/ortak/MegaToggle';
import FilterChip from '../../components/ortak/FilterChip';
import PromptCard from '../../components/hub/ajansa/PromptCard';
import { promptMixer, COM_TYPES } from '../../utils/aiPrompts';

const TYPES = [
  { id: 'victory', icon: <Trophy />, label: 'Satılan\nKiralanan', color: '#2ecc71', tags: ['reels', 'post', 'story', 'ads'] },
  { id: 'data', icon: <Database />, label: 'Veri\nAnalizi', color: '#3498db', tags: ['reels', 'post', 'story'] },
  { id: 'suggestion', icon: <Zap />, label: 'Öneri\nBildir', color: '#D4AF37', tags: ['post', 'story'] },
];

const UI = {
  glass: { background: 'var(--color-glass)', border: '1px solid var(--color-border)', borderRadius: '8px', backdropFilter: 'blur(10px)' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', zIndex: 10000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
  box: { width: '100%', maxWidth: '440px', background: '#0a0a0a', borderBottom: '1px solid #333', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', padding: '1.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }
};

export default function Ajansa() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState('insta'); // 'insta', 'ads', or 'writer'
  const [aiTab, setAiTab] = useState('all'); // 'indoor', 'outdoor', 'all'

  // WRITER STATES
  const [writerForm, setWriterForm] = useState({ 
    title: '', 
    details: '', 
    location: '', 
    extra: '' 
  });
  const [writerRevealed, setWriterRevealed] = useState({ 
    title: false, 
    details: false, 
    location: false, 
    extra: false 
  });
  const [writerResult, setWriterResult] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  const toggleReveal = (field) => setWriterRevealed(p => ({ ...p, [field]: !p[field] }));

  // AI STUDIO STATES (Exact copy from AIPromptLibrary)
  const [selectedIds, setSelectedIds] = useState([]);
  const fileInputRef = useRef(null);

  const MAIN_TOGGLE_OPTIONS = [
    { id: 'insta', icon: <FaInstagram size={18} />, label: 'Instagram' },
    { id: 'ads', icon: <Image size={18} />, label: 'İlanlar' },
  ];

  const AI_SUB_OPTIONS = [
    { id: 'indoor', label: 'Inside', customRender: (active) => <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: active ? '#fff' : 'rgba(255,255,255,0.2)' }} /> },
    { id: 'outdoor', label: 'Outside', customRender: (active) => <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: active ? '2px solid #fff' : '2px solid rgba(255,255,255,0.2)', background: 'transparent' }} /> },
    {
      id: 'all', label: 'All', icon: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', marginTop: '2px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20V12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12V20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      )
    },
    { id: 'writer', label: 'Writer', icon: <PenLine size={14} /> }
  ];

  const filteredTypes = useMemo(() => {
    if (mainTab === 'insta') {
      return TYPES.filter(t => t.tags.some(tag => ['reels', 'post', 'story'].includes(tag)));
    }
    return TYPES.filter(t => t.tags.includes('ads'));
  }, [mainTab]);

  const dispatchUpdate = (ids, mode, type = 'photo') => {
    window.dispatchEvent(new CustomEvent('ai-selection-changed', {
      detail: { 
        count: ids.length, 
        ids, 
        mode, 
        type,
        formData: type === 'writer' ? writerForm : null
      }
    }));
  };

  const toggleSelection = (id) => {
    const isCommercial = COM_TYPES.map(c => c.id).includes(id);
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(i => i !== id);
        dispatchUpdate(next, aiTab, aiTab === 'writer' ? 'writer' : 'photo');
        return next;
      }
      let next = [...prev];
      if (isCommercial) {
        next = next.filter(i => !COM_TYPES.map(c => c.id).includes(i));
      } else {
        if (prev.length >= 3) return prev;
      }
      next = [...next, id];
      dispatchUpdate(next, aiTab, aiTab === 'writer' ? 'writer' : 'photo');
      return next;
    });
  };

  const handleMasterCopy = (baseId) => {
    const allActive = Array.from(new Set([...selectedIds, baseId]));
    const finalPrompt = promptMixer(allActive, aiTab);
    navigator.clipboard.writeText(finalPrompt);
    setTimeout(() => setSelectedIds([]), 2000);
  };

  const hasIndoorSelected = selectedIds.some(id => ['removal', 'com_office', 'com_restaurant', 'com_coffee', 'com_boutique', 'com_industrial'].includes(id));
  const hasOutdoorSelected = selectedIds.some(id => ['drone', 'floorplan'].includes(id));
  const disabledToggleIds = hasOutdoorSelected ? ['indoor', 'commercial'] : (hasIndoorSelected ? ['outdoor'] : []);

  const handleBtnClick = (t) => {
    if (t.path) navigate(t.path);
  };

  return (
    <PageLayout padding="1rem">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
        <div style={{ margin: 0 }}>
          <MegaToggle 
            options={MAIN_TOGGLE_OPTIONS}
            activeId={mainTab}
            onChange={setMainTab}
          />
        </div>
        
        <AnimatePresence mode="popLayout">
          {mainTab === 'ads' && (
            <motion.div
              key="ads-sub"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{ margin: 0 }}
            >
              <MegaToggle 
                options={AI_SUB_OPTIONS}
                activeId={aiTab}
                onChange={setAiTab}
                disabledIds={disabledToggleIds}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {mainTab === 'ads' && aiTab === 'writer' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="writer-container" style={{ padding: '0 0.5rem' }}>
          {/* REVEAL TRIGGERS (FilterChips) */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
            <FilterChip label="Başlık +" active={writerRevealed.title} onClick={() => toggleReveal('title')} color="#3498db" />
            <FilterChip label="Detay +" active={writerRevealed.details} onClick={() => toggleReveal('details')} color="var(--color-accent)" />
            <FilterChip label="Konum +" active={writerRevealed.location} onClick={() => toggleReveal('location')} color="#e67e22" />
            <FilterChip label="Notlar +" active={writerRevealed.extra} onClick={() => toggleReveal('extra')} color="var(--color-accent)" />
          </div>

          {/* SECONDARY FIELDS (Expandable) */}
          <AnimatePresence>
            {writerRevealed.title && (
              <motion.div initial={{ height: 0, opacity: 0, marginBottom: 0 }} animate={{ height: 'auto', opacity: 1, marginBottom: '1rem' }} exit={{ height: 0, opacity: 0, marginBottom: 0 }} style={{ overflow: 'hidden' }}>
                <input 
                  placeholder="İlan Başlığı" 
                  value={writerForm.title} 
                  onChange={e => setWriterForm(p => ({ ...p, title: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '100%' }} 
                />
              </motion.div>
            )}

            {writerRevealed.details && (
              <motion.div initial={{ height: 0, opacity: 0, marginBottom: 0 }} animate={{ height: 'auto', opacity: 1, marginBottom: '1rem' }} exit={{ height: 0, opacity: 0, marginBottom: 0 }} style={{ overflow: 'hidden' }}>
                <textarea 
                  placeholder="Mülk Detayları ve Özellikleri..." 
                  rows={3}
                  value={writerForm.details} 
                  onChange={e => setWriterForm(p => ({ ...p, details: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', resize: 'none', outline: 'none', width: '100%' }} 
                />
              </motion.div>
            )}

            {writerRevealed.location && (
              <motion.div initial={{ height: 0, opacity: 0, marginBottom: 0 }} animate={{ height: 'auto', opacity: 1, marginBottom: '1rem' }} exit={{ height: 0, opacity: 0, marginBottom: 0 }} style={{ overflow: 'hidden' }}>
                <input 
                  placeholder="İl / İlçe / Mahalle" 
                  value={writerForm.location} 
                  onChange={e => setWriterForm(p => ({ ...p, location: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '100%' }} 
                />
              </motion.div>
            )}

            {writerRevealed.extra && (
              <motion.div initial={{ height: 0, opacity: 0, marginBottom: 0 }} animate={{ height: 'auto', opacity: 1, marginBottom: '1rem' }} exit={{ height: 0, opacity: 0, marginBottom: 0 }} style={{ overflow: 'hidden' }}>
                <textarea 
                  placeholder="Ekstra Notlar veya Hedef Kitle..." 
                  rows={2}
                  value={writerForm.extra} 
                  onChange={e => setWriterForm(p => ({ ...p, extra: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', resize: 'none', outline: 'none', width: '100%' }} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* TRANSFORMER CARDS - Functional Output Focused */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <PromptCard 
              id="write_title" title="Başlık" desc="Sadece en çok tıklanan, merak uyandıran 5 farklı başlık üretir." 
              icon="🎯" isSelected={selectedIds.includes('write_title')} 
              onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('write_title')} 
            />
            <PromptCard 
              id="write_summary" title="Açıklama" desc="WhatsApp veya Story için en vurucu 3 özelliği öne çıkaran kısa metin." 
              icon="⚡" isSelected={selectedIds.includes('write_summary')} 
              onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('write_summary')} 
            />
            <PromptCard 
              id="write_full" title="Tam Detaylı Açıklama" desc="Portallar için profesyonel, teknik ve ikna edici tam metin." 
              icon="💎" isSelected={selectedIds.includes('write_full')} 
              onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('write_full')} 
            />
          </div>

          {/* RESULT AREA */}
          <AnimatePresence>
            {writerResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem' }}>
                <GlassCard padding="1.25rem" borderRadius="20px" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-accent)', textTransform: 'uppercase' }}>Yeni Nesil Metin</span>
                    <button onClick={() => navigator.clipboard.writeText(writerResult)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><Copy size={16} /></button>
                  </div>
                  <p style={{ color: '#fff', fontSize: '0.85rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{writerResult}</p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
          <div style={{ height: '2rem' }} />
        </motion.div>
      )}

      {mainTab === 'ads' && aiTab !== 'writer' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ai-studio-container">
          {/* PROMPT CARDS - Pixel Perfect copy from AIPromptLibrary */}
          <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {aiTab === 'all' && (
              <>
                <PromptCard id="upscale" title="Kristal Berraklık" desc="Bulanıklığı siler, 8K keskinlik ve detay eklerim." icon="💎" isSelected={selectedIds.includes('upscale')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('upscale')} />
                <PromptCard id="privacy" title="Önce Güvenlik" desc="Plakaları, yüzleri ve özel evrakları profesyonelce gizlerim." icon="🛡️" isSelected={selectedIds.includes('privacy')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('privacy')} />
                <PromptCard id="expand" title="Geniş Açı Operasyonu" desc="Mekanı veya manzarayı profesyonelce genişletirim." icon="🔍" isSelected={selectedIds.includes('expand')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('expand')} />
                <PromptCard id="lifestyle" title="Yaşam İzleri" desc="Mülke ruh katar, hayalindeki o yaşamı resmederim." icon="👪" isSelected={selectedIds.includes('lifestyle')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('lifestyle')} />
                <PromptCard id="cleaning" title="Cerrahi Temizlik" desc="Dağınıklığı yok eder, her yeri tertemiz yaparım." icon="🧹" isSelected={selectedIds.includes('cleaning')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('cleaning')} isSurgical={true} />
                <PromptCard id="light" title="Gün Işığı" desc="Ferah, parlak ve doğal bir ışık operasyonu." icon="☀️" isSelected={selectedIds.includes('light')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('light')} />
                <PromptCard id="twilight" title="Akşam Işığı" desc="Gündüzü büyüleyici bir alacakaranlığa çeviririm." icon="🌆" isSelected={selectedIds.includes('twilight')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('twilight')} />
                <PromptCard id="neg_people" title="Sıfır İnsan" desc="Tüm figürleri siler, mekanı boşaltırım." icon="🚫" isSelected={selectedIds.includes('neg_people')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('neg_people')} isSurgical={true} />
                <PromptCard id="neg_text" title="Sıfır Marka/Metin" desc="Yazıları ve logoları cerrahi titizlikle silerim." icon="✍️" isSelected={selectedIds.includes('neg_text')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('neg_text')} isSurgical={true} />
              </>
            )}
            {aiTab === 'indoor' && (
              <>
                <PromptCard id="removal" title="Eşyaları Sıfırla" desc="İçeride ne varsa siler, odayı bomboş yaparım." icon="🗑️" isSelected={selectedIds.includes('removal')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('removal')} isSurgical={true} />
                <PromptCard id="lifestyle" title="Yaşam İzleri" desc="Mülke ruh katar, hayalindeki o yaşamı resmederim." icon="👪" isSelected={selectedIds.includes('lifestyle')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('lifestyle')} />
                <PromptCard id="ticari" title="ticari" multiIcons={COM_TYPES} isSelected={selectedIds} onIconClick={toggleSelection} onCardClick={() => { }} />
              </>
            )}
            {aiTab === 'outdoor' && (
              <>
                <PromptCard id="drone" title="Drone Bakışı" desc="Sınırları parlatır, lüks bir drone çekimine çeviririm." icon="🛸" isSelected={selectedIds.includes('drone')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('drone')} />
                <PromptCard id="floorplan" title="Mimari Plan / Kroki" desc="Kötü çizimleri tertemiz 2D mimari plana çeviririm." icon="📐" isSelected={selectedIds.includes('floorplan')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('floorplan')} />
                <PromptCard id="ticari" title="ticari" multiIcons={COM_TYPES} isSelected={selectedIds} onIconClick={toggleSelection} onCardClick={() => { }} />
              </>
            )}
          </div>
          
          <div style={{ height: '2rem' }} />
        </motion.div>
      )}

      {mainTab === 'insta' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {filteredTypes.map(t => (
            <motion.button 
              layout
              key={t.id} 
              onClick={() => handleBtnClick(t)} 
              style={{ ...UI.glass, padding: '1rem 0.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minHeight: '90px', cursor: 'pointer' }}
            >
              <div style={{ fontSize: '1.2rem', color: t.color, filter: `drop-shadow(0 0 10px ${t.color}40)` }}>{t.icon}</div>
              <span style={{ color: '#fff', textAlign: 'center', whiteSpace: 'pre-line', fontSize: '0.6rem', fontWeight: '600', lineHeight: '1.1' }}>{t.label}</span>
            </motion.button>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
