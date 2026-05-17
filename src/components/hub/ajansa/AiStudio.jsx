import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, PenLine, Copy } from 'lucide-react';
import MegaToggle from '../../ortak/MegaToggle';
import FilterChip from '../../ortak/FilterChip';
import GlassCard from '../../ortak/GlassCard';
import PromptCard from './PromptCard';
import { promptMixer, COM_TYPES } from '../../../utils/aiPrompts';

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

export default function AiStudio() {
  const [aiTab, setAiTab] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [writerForm, setWriterForm] = useState({ title: '', details: '', location: '', extra: '' });
  const [writerRevealed, setWriterRevealed] = useState({ title: false, details: false, location: false, extra: false });
  const [writerResult, setWriterResult] = useState('');

  const toggleReveal = (field) => setWriterRevealed(p => ({ ...p, [field]: !p[field] }));

  const dispatchUpdate = (ids, mode, type = 'photo') => {
    window.dispatchEvent(new CustomEvent('ai-selection-changed', {
      detail: { count: ids.length, ids, mode, type, formData: type === 'writer' ? writerForm : null }
    }));
  };

  const toggleSelection = (id) => {
    const isCommercial = COM_TYPES.map(c => c.id).includes(id);
    setSelectedIds(prev => {
      let next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev];
      if (!prev.includes(id)) {
        if (isCommercial) next = [...next.filter(i => !COM_TYPES.map(c => c.id).includes(i)), id];
        else if (prev.length < 3) next = [...next, id];
      }
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <MegaToggle options={AI_SUB_OPTIONS} activeId={aiTab} onChange={setAiTab} disabledIds={disabledToggleIds} />
      </div>

      {aiTab === 'writer' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 0.5rem' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
            <FilterChip label="Başlık +" active={writerRevealed.title} onClick={() => toggleReveal('title')} color="#3498db" />
            <FilterChip label="Detay +" active={writerRevealed.details} onClick={() => toggleReveal('details')} color="var(--color-accent)" />
            <FilterChip label="Konum +" active={writerRevealed.location} onClick={() => toggleReveal('location')} color="#e67e22" />
            <FilterChip label="Notlar +" active={writerRevealed.extra} onClick={() => toggleReveal('extra')} color="var(--color-accent)" />
          </div>

          <AnimatePresence>
            {Object.entries(writerRevealed).map(([key, revealed]) => revealed && (
              <motion.div key={key} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: '1rem' }}>
                {key === 'details' || key === 'extra' ? (
                  <textarea placeholder={key === 'details' ? 'Mülk Detayları...' : 'Ekstra Notlar...'} rows={key === 'details' ? 3 : 2} value={writerForm[key]} onChange={e => setWriterForm(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} />
                ) : (
                  <input placeholder={key === 'title' ? 'İlan Başlığı' : 'İl / İlçe / Mahalle'} value={writerForm[key]} onChange={e => setWriterForm(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <PromptCard id="write_title" title="Başlık" desc="Merak uyandıran 5 farklı başlık." icon="🎯" isSelected={selectedIds.includes('write_title')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('write_title')} />
            <PromptCard id="write_summary" title="Açıklama" desc="WhatsApp/Story için vurucu kısa metin." icon="⚡" isSelected={selectedIds.includes('write_summary')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('write_summary')} />
            <PromptCard id="write_full" title="Tam Detay" desc="Portal için profesyonel tam metin." icon="💎" isSelected={selectedIds.includes('write_full')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('write_full')} />
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {aiTab === 'all' && PROMPTS_ALL.map(p => <PromptCard key={p.id} {...p} isSelected={selectedIds.includes(p.id)} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy(p.id)} />)}
          {aiTab === 'indoor' && (
            <>
              {PROMPTS_INDOOR.map(p => <PromptCard key={p.id} {...p} isSelected={selectedIds.includes(p.id)} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy(p.id)} />)}
              <PromptCard id="ticari" title="Ticari" multiIcons={COM_TYPES} isSelected={selectedIds} onIconClick={toggleSelection} onCardClick={() => { }} />
            </>
          )}
          {aiTab === 'outdoor' && (
            <>
              {PROMPTS_OUTDOOR.map(p => <PromptCard key={p.id} {...p} isSelected={selectedIds.includes(p.id)} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy(p.id)} />)}
              <PromptCard id="ticari" title="Ticari" multiIcons={COM_TYPES} isSelected={selectedIds} onIconClick={toggleSelection} onCardClick={() => { }} />
            </>
          )}
        </motion.div>
      )}

      {/* RESULT AREA FOR WRITER */}
      <AnimatePresence>
        {writerResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', padding: '0 0.5rem' }}>
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
    </div>
  );
}

const inputStyle = { background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '100%', resize: 'none' };

const PROMPTS_ALL = [
  { id: 'upscale', title: 'Kristal Berraklık', desc: 'Bulanıklığı siler, 8K keskinlik ve detay eklerim.', icon: '💎' },
  { id: 'privacy', title: 'Önce Güvenlik', desc: 'Plakaları, yüzleri ve özel evrakları profesyonelce gizlerim.', icon: '🛡️' },
  { id: 'expand', title: 'Geniş Açı Operasyonu', desc: 'Mekanı veya manzarayı profesyonelce genişletirim.', icon: '🔍' },
  { id: 'lifestyle', title: 'Yaşam İzleri', desc: 'Mülke ruh katar, hayalindeki o yaşamı resmederim.', icon: '👪' },
  { id: 'cleaning', title: 'Cerrahi Temizlik', desc: 'Dağınıklığı yok eder, her yeri tertemiz yaparım.', icon: '🧹', isSurgical: true },
  { id: 'light', title: 'Gün Işığı', desc: 'Ferah, parlak ve doğal bir ışık operasyonu.', icon: '☀️' },
  { id: 'twilight', title: 'Akşam Işığı', desc: 'Gündüzü büyüleyici bir alacakaranlığa çeviririm.', icon: '🌆' },
  { id: 'neg_people', title: 'Sıfır İnsan', desc: 'Tüm figürleri siler, mekanı boşaltırım.', icon: '🚫', isSurgical: true },
  { id: 'neg_text', title: 'Sıfır Marka/Metin', desc: 'Yazıları ve logoları cerrahi titizlikle silerim.', icon: '✍️', isSurgical: true },
];

const PROMPTS_INDOOR = [
  { id: 'removal', title: 'Eşyaları Sıfırla', desc: 'İçeride ne varsa siler, odayı bomboş yaparım.', icon: '🗑️', isSurgical: true },
  { id: 'lifestyle', title: 'Yaşam İzleri', desc: 'Mülke ruh katar, hayalindeki o yaşamı resmederim.', icon: '👪' },
];

const PROMPTS_OUTDOOR = [
  { id: 'drone', title: 'Drone Bakışı', desc: 'Sınırları parlatır, lüks bir drone çekimine çeviririm.', icon: '🛸' },
  { id: 'floorplan', title: 'Mimari Plan / Kroki', desc: 'Kötü çizimleri tertemiz 2D mimari plana çeviririm.', icon: '📐' },
];
