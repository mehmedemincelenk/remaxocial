import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Star, X, UploadCloud, CheckCircle, Trophy, Trash2, Video, Zap, Footprints, Mic, Camera, Layout, PlayCircle, Clapperboard, Image as ImageIcon, Loader2, Check, PenLine } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import { supabase } from '../../utils/supabaseClient';
import PageLayout from '../../components/ortak/PageLayout';
import GlassCard from '../../components/ortak/GlassCard';
import MegaToggle from '../../components/ortak/MegaToggle';
import { promptMixer } from '../../utils/aiPrompts';

import cgptLogo from '../../assets/icons/cgpt_logo.svg';
import claudeLogo from '../../assets/icons/claude_logo.svg';
import geminiLogo from '../../assets/icons/gemini_logo.svg';

const REPLICATE_PROXY = "/replicate-api";

const COM_TYPES = [
  { id: 'com_office', icon: '🏢', label: 'Ofis' },
  { id: 'com_restaurant', icon: '🍽️', label: 'Restoran' },
  { id: 'com_coffee', icon: '☕', label: 'Kafe' },
  { id: 'com_boutique', icon: '👕', label: 'Butik' },
  { id: 'com_industrial', icon: '🏭', label: 'Sanayi/Depo' }
];

const PromptCard = ({ id, title, desc, icon, isSelected, onIconClick, onCardClick, isSurgical, multiIcons }) => {
  const [copied, setCopied] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const timerRef = useRef(null);

  const handleLocalCardClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onCardClick();
    setCopied(true);
    setIsFlashing(true);
    timerRef.current = setTimeout(() => { setCopied(false); setIsFlashing(false); }, 3000);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
      {!multiIcons ? (
        <>
          <GlassCard
            onClick={handleLocalCardClick} isMotion={true} whileTap={{ scale: 0.98 }} padding="0.75rem 1.25rem" borderRadius="20px"
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer',
              border: ((typeof isSelected === 'boolean' ? isSelected : isSelected.some(id => multiIcons?.map(m => m.id).includes(id))) || copied) ? '1px solid #fff' : '1px solid var(--color-border)',
              boxShadow: ((typeof isSelected === 'boolean' ? isSelected : isSelected.some(id => multiIcons?.map(m => m.id).includes(id))) || copied) ? '0 0 15px rgba(255,255,255,0.1)' : 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.03)'
            }}
          >
            <div style={{ textAlign: 'left', width: '100%', opacity: copied ? 0.2 : 1, transition: 'opacity 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', margin: 0, color: isSurgical ? '#ff4d4d' : 'inherit' }}>{title}</h4>
              {desc && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '2px', fontWeight: '500' }}>{desc}</p>}
            </div>
            <AnimatePresence>
              {copied && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', zIndex: 100 }}
                >
                  <button onClick={(e) => { e.stopPropagation(); window.open('https://chat.openai.com', '_blank'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <img src={cgptLogo} style={{ width: '28px', height: '28px' }} alt="GPT" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); window.open('https://gemini.google.com', '_blank'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <img src={geminiLogo} style={{ width: '28px', height: '28px' }} alt="Gemini" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); window.open('https://claude.ai', '_blank'); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <img src={claudeLogo} style={{ width: '28px', height: '28px' }} alt="Claude" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => onIconClick(id)}
              style={{ width: '40px', height: '40px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'all 0.3s ease', opacity: (isSelected || isFlashing) ? 1 : 0.35, transform: (isSelected || isFlashing) ? 'scale(1.15)' : 'scale(1)', filter: (isSelected || isFlashing) ? `drop-shadow(0 0 8px ${isSurgical ? 'rgba(255,77,77,0.4)' : 'rgba(255,255,255,0.4)'})` : 'none' }}
            >
              {icon}
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
          <div style={{ width: '100%', height: '1px', background: 'var(--border)', marginBottom: '1.5rem', opacity: 0.6 }} />
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            {multiIcons.map(m => (
              <button key={m.id} onClick={() => onIconClick(m.id)}
                style={{
                  width: '42px', height: '42px', background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: (Array.isArray(isSelected) && isSelected.includes(m.id)) ? 1 : 0.15,
                  transform: (Array.isArray(isSelected) && isSelected.includes(m.id)) ? 'scale(1.3)' : 'scale(1)',
                  filter: (Array.isArray(isSelected) && isSelected.includes(m.id)) ? 'drop-shadow(0 0 12px rgba(255,255,255,0.4))' : 'none'
                }}
                title={m.label}
              >
                {m.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TYPES = [
  { id: 'victory', icon: <Trophy />, label: 'Satılan\nKiralanan', color: '#2ecc71', tags: ['reels', 'post', 'story', 'ads'] },
  { id: 'studio', icon: <Video />, label: 'Haber\nOnayla', color: '#ff4d4d', path: '/studio', tags: ['reels'] },
  { id: 'selfie', icon: <Video />, label: 'Selfie\nStudio', color: '#3498db', path: '/selfie', tags: ['reels', 'story'] },
  { id: 'reels', icon: <Clapperboard />, label: 'Instagram\nReels', color: '#E1306C', tags: ['reels'] },
  { id: 'post', icon: <Layout />, label: 'Instagram\nPost', color: '#833AB4', tags: ['post'] },
  { id: 'story', icon: <PlayCircle />, label: 'Instagram\nStory', color: '#F77737', tags: ['story'] },
  { id: 'qa', icon: <Video />, label: 'Soru\nCevaplar', color: 'var(--color-red)', heavy: true, tags: ['reels'] },
  { id: 'field', icon: <Zap />, label: 'Saha\nKesitleri', color: '#C026D3', heavy: true, tags: ['reels'] },
  { id: 'tour', icon: <Footprints />, label: 'Ev Gezi\nVideoları', color: 'var(--color-blue)', heavy: true, tags: ['reels', 'ads'] },
  { id: 'podcast', icon: <Mic />, label: 'Müşteri\nPodcast', color: '#7C3AED', heavy: true, tags: ['reels'] },
  { id: 'photos', icon: <Image />, label: 'Kişisel\nHayat', color: '#059669', tags: ['post', 'story'] },
  { id: 'stars', icon: <Star />, label: 'Müşteri\nYorumları', color: '#D97706', tags: ['post', 'story'] },
  { id: 'suggestion', icon: <Zap />, label: 'Öneri\nBildir', color: '#D4AF37', tags: ['post', 'story'] },
];

const UI = {
  glass: { background: 'var(--color-glass)', border: '1px solid var(--color-border)', borderRadius: '8px', backdropFilter: 'blur(10px)' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', zIndex: 10000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
  box: { width: '100%', maxWidth: '440px', background: '#0a0a0a', borderBottom: '1px solid #333', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', padding: '1.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }
};

export default function Ajansa() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState('insta'); // 'insta' or 'ads'
  const [instaTab, setInstaTab] = useState('reels'); // 'reels', 'post', 'story'
  const [aiTab, setAiTab] = useState('all'); // 'indoor', 'outdoor', 'all'
  
  const [sel, setSel] = useState(null);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('SATILDI');
  const [up, setUp] = useState({ state: 'idle', prog: 0 });
  const [form, setForm] = useState({ name: '', contact: '', message: '' });

  // AI STUDIO STATES (Exact copy from AIPromptLibrary)
  const [selectedIds, setSelectedIds] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const MAIN_TOGGLE_OPTIONS = [
    { id: 'insta', icon: <FaInstagram size={18} />, label: 'Instagram' },
    { id: 'ads', icon: <Image size={18} />, label: 'İlanlar' },
    { id: 'writer', icon: <PenLine size={18} />, label: 'Metinler' },
  ];

  const INSTA_SUB_OPTIONS = [
    { id: 'reels', label: 'R' },
    { id: 'post', label: 'P' },
    { id: 'story', label: 'S' },
  ];

  const AI_SUB_OPTIONS = [
    { id: 'indoor', label: 'İç Mekan', customRender: (active) => <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: active ? '#fff' : 'rgba(255,255,255,0.2)' }} /> },
    { id: 'outdoor', label: 'Dış Mekan', customRender: (active) => <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: active ? '2px solid #fff' : '2px solid rgba(255,255,255,0.2)', background: 'transparent' }} /> },
    {
      id: 'all', label: 'Ortak', icon: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', marginTop: '2px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20V12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12V20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      )
    }
  ];

  const filteredTypes = useMemo(() => {
    return TYPES.filter(t => t.tags.includes(mainTab === 'insta' ? instaTab : 'ads'));
  }, [mainTab, instaTab]);

  // AI STUDIO LOGIC (Exact copy from AIPromptLibrary)
  const handleAIUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file
    }));
    setImages(prev => [...prev, ...newImgs].slice(0, 5));
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleGenerate = async () => {
    if (selectedIds.length === 0 || images.length === 0) return;
    setLoading(true);
    setResult(null);
    try {
      const finalPrompt = promptMixer(selectedIds, aiTab);
      const base64Image = await fileToBase64(images[0].file);
      const response = await fetch(`${REPLICATE_PROXY}/v1/models/black-forest-labs/flux-dev/predictions`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            prompt: finalPrompt,
            image: base64Image,
            prompt_strength: 0.45,
            guidance: 3.5,
            num_inference_steps: 28,
            output_format: "webp"
          }
        })
      });
      const prediction = await response.json();
      if (!response.ok) throw new Error(prediction.detail || prediction.error || `API Hatası: ${response.status}`);
      let pollUrl = prediction.urls.get.replace("https://api.replicate.com", REPLICATE_PROXY);
      const checkStatus = async () => {
        try {
          const res = await fetch(pollUrl, { headers: { "Authorization": `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}` } });
          const statusData = await res.json();
          if (statusData.status === "succeeded") {
            setResult(statusData.output[0]);
            setLoading(false);
          } else if (statusData.status === "failed") {
            throw new Error("Görsel üretimi başarısız oldu");
          } else {
            setTimeout(checkStatus, 2000);
          }
        } catch (pollErr) {
          console.error("Polling Error:", pollErr);
          setLoading(false);
        }
      };
      checkStatus();
    } catch (err) {
      console.error("Detailed AI Error:", err);
      alert(`Hata: ${err.message || "Bilinmeyen bir hata oluştu"}`);
      setLoading(false);
    }
  };

  const dispatchUpdate = (ids, mode) => {
    window.dispatchEvent(new CustomEvent('ai-selection-changed', {
      detail: { count: ids.length, ids, mode }
    }));
  };

  const toggleSelection = (id) => {
    const isCommercial = COM_TYPES.map(c => c.id).includes(id);
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(i => i !== id);
        dispatchUpdate(next, aiTab);
        return next;
      }
      let next = [...prev];
      if (isCommercial) {
        next = next.filter(i => !COM_TYPES.map(c => c.id).includes(i));
      } else {
        if (prev.length >= 3) return prev;
      }
      next = [...next, id];
      dispatchUpdate(next, aiTab);
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

  const reset = () => { setSel(null); setFiles([]); setStatus('SATILDI'); setUp({ state: 'idle', prog: 0 }); setForm({ name: '', contact: '', message: '' }); };

  const handleUpload = async () => {
    setUp({ state: 'uploading', prog: 0 });
    try {
      const urls = [];
      for (let i = 0; i < files.length; i++) {
        const path = `${sel.id}/${Date.now()}_${i}.${files[i].name.split('.').pop()}`;
        await supabase.storage.from('agency-media').upload(path, files[i]);
        urls.push(supabase.storage.from('agency-media').getPublicUrl(path).data.publicUrl);
        setUp(p => ({ ...p, prog: Math.round(((i + 1) / files.length) * 100) }));
      }
      const requestData = { 
        category: sel.label.replace('\n', ' '), 
        message: sel.id === 'victory' ? `[${status}]` : form.message, 
        files: urls, 
        status: 'pending',
        customer_name: form.name,
        customer_contact: form.contact || 'Mutlu Müşterimiz'
      };
      await supabase.from('agency_requests').insert([requestData]);
      setUp({ state: 'success', prog: 100 });
      setTimeout(reset, 3000);
    } catch (error) {
      console.error('Agency request error:', error);
      setUp({ state: 'error', prog: 0 });
    }
  };

  const handleBtnClick = (t) => {
    if (t.heavy) window.open(`https://t.me/remax_ajans_bot?start=${t.id}`, '_blank');
    else if (t.path) navigate(t.path);
    else setSel(t);
  };

  const previews = useMemo(() => files.map(f => URL.createObjectURL(f)), [files]);

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
          {mainTab === 'insta' && (
            <motion.div
              key="insta-sub"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{ margin: 0 }}
            >
              <MegaToggle 
                options={INSTA_SUB_OPTIONS}
                activeId={instaTab}
                onChange={setInstaTab}
              />
            </motion.div>
          )}
          
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

      {mainTab === 'ads' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ai-studio-container">
          {/* UPLOAD AREA */}
          <div style={{ padding: '0 1.5rem 0.5rem' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div 
                style={{ 
                  flex: 1, 
                  height: '80px', 
                  border: '1px dashed rgba(255,255,255,0.2)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  padding: '0 10px',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <input type="file" multiple hidden ref={fileInputRef} onChange={handleAIUpload} accept="image/*" />
                {images.length < 5 && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ minWidth: '50px', height: '60px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <ImageIcon size={20} style={{ opacity: 0.4 }} />
                  </div>
                )}
                {images.map(img => (
                  <motion.div 
                    key={img.id}
                    onClick={() => removeImage(img.id)}
                    whileTap={{ scale: 0.9 }}
                    style={{ minWidth: '50px', height: '60px', borderRadius: '8px', overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                      <X size={14} color="#fff" />
                    </div>
                  </motion.div>
                ))}
              </div>
              {images.length > 0 && selectedIds.length > 0 && (
                <motion.button 
                  onClick={result ? () => window.open(result, '_blank') : handleGenerate}
                  disabled={loading}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ width: '40px', height: '80px', borderRadius: '12px', border: `1px solid ${result ? '#00ff00' : 'var(--color-accent)'}`, background: 'transparent', color: result ? '#00ff00' : 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : (result ? <ImageIcon size={20} /> : <Check size={20} />)}
                </motion.button>
              )}
            </div>
          </div>

          {/* RESULT PREVIEW */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '0 1.5rem 1rem' }}>
                <img 
                  src={result} 
                  style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} 
                  alt="Result" 
                />
              </motion.div>
            )}
          </AnimatePresence>

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
                <PromptCard id="ticari" title="₺" multiIcons={COM_TYPES} isSelected={selectedIds} onIconClick={toggleSelection} onCardClick={() => { }} />
              </>
            )}
            {aiTab === 'outdoor' && (
              <>
                <PromptCard id="drone" title="Drone Bakışı" desc="Sınırları parlatır, lüks bir drone çekimine çeviririm." icon="🛸" isSelected={selectedIds.includes('drone')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('drone')} />
                <PromptCard id="floorplan" title="Mimari Plan / Kroki" desc="Kötü çizimleri tertemiz 2D mimari plana çeviririm." icon="📐" isSelected={selectedIds.includes('floorplan')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('floorplan')} />
                <PromptCard id="ticari" title="₺" multiIcons={COM_TYPES} isSelected={selectedIds} onIconClick={toggleSelection} onCardClick={() => { }} />
              </>
            )}
          </div>
          
          <div style={{ height: '2rem' }} />
        </motion.div>
      ) : (
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

      <AnimatePresence>
        {sel && (
          <div style={UI.modal} onClick={reset}>
            <motion.div initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ type: 'spring', damping: 25 }} onClick={e => e.stopPropagation()} style={UI.box}>
              <button onClick={reset} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}><X size={18} /></button>
              
              {up.state === 'success' ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle size={64} color="#2ecc71" style={{ marginBottom: '1.25rem' }} />
                  <h3 style={{ color: '#fff' }}>İşlem Tamam!</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>İçeriğin mutfak ekibine iletildi.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', color: sel.color }}>{sel.icon}</div><h3 style={{ color: '#fff', marginTop: '0.5rem' }}>{sel.label.replace('\n', ' ')}</h3></div>

                  {sel.id === 'stars' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <input placeholder="Müşteri Adı Soyadı" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ background: '#111', border: '1px solid #222', padding: '1rem', borderRadius: '16px', color: '#fff', fontSize: '0.85rem' }} />
                      <input placeholder="İletişim (E-posta veya @instagram)" value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} style={{ background: '#111', border: '1px solid #222', padding: '1rem', borderRadius: '16px', color: '#fff', fontSize: '0.85rem' }} />
                      <textarea placeholder="Müşteri Mesajı..." rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ background: '#111', border: '1px solid #222', padding: '1rem', borderRadius: '16px', color: '#fff', fontSize: '0.85rem', resize: 'none' }} />
                      <p style={{ fontSize: '0.7rem', color: '#555', margin: '0 5px' }}>İsterseniz ilan veya mülk fotoğraflarını aşağıdan ekleyebilirsiniz.</p>
                    </div>
                  )}

                  {sel.id === 'victory' && (
                    <div style={{ display: 'flex', background: '#111', padding: '4px', borderRadius: '16px' }}>
                      {['SATILDI', 'KİRALANDI'].map(s => (
                        <button key={s} onClick={() => setStatus(s)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: status === s ? '#2ecc71' : 'transparent', color: status === s ? '#fff' : '#666', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>{s}</button>
                      ))}
                    </div>
                  )}

                  {sel.id !== 'stars' && (
                    <>
                      {files.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                          {previews.map((p, i) => (
                            <div key={i} onClick={() => setFiles(f => f.filter((_, idx) => idx !== i))} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', background: '#000', cursor: 'pointer' }}>
                              <img src={p} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                          ))}
                          <label style={{ aspectRatio: '1/1', borderRadius: '8px', border: '1px dashed #444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <input type="file" multiple onChange={e => setFiles(f => [...f, ...Array.from(e.target.files)])} style={{ display: 'none' }} /><UploadCloud size={14} color="#666" />
                          </label>
                        </div>
                      ) : (
                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem 2rem', border: '2px dashed #333', borderRadius: '24px', cursor: 'pointer', background: 'rgba(255,0,0,0.02)' }}>
                          <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files))} style={{ display: 'none' }} />
                          <UploadCloud size={28} color="#666" /><div style={{ textAlign: 'center' }}><span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '600' }}>Medyaları Seç</span></div>
                        </label>
                      )}
                    </>
                  )}

                  {up.state === 'uploading' && <div style={{ height: '6px', width: '100%', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}><motion.div initial={{ width: 0 }} animate={{ width: `${up.prog}%` }} style={{ height: '100%', background: '#2ecc71' }} /></div>}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setFiles([])} disabled={!files.length} style={{ width: '60px', padding: '1rem', borderRadius: '20px', background: 'rgba(255,0,0,0.1)', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}><Trash2 size={20} /></button>
                    <button 
                      onClick={handleUpload} 
                      disabled={up.state === 'uploading' || (sel.id === 'stars' && (!form.name || !form.message)) || (sel.id === 'victory' && (files.length === 0 || files.length > 10)) || (sel.id !== 'stars' && sel.id !== 'victory' && !files.length)} 
                      style={{ flex: 1, padding: '1.25rem', borderRadius: '20px', background: ((sel.id === 'stars' && form.name && form.message) || (sel.id === 'victory' && files.length > 0 && files.length <= 10) || (sel.id !== 'stars' && sel.id !== 'victory' && files.length > 0)) ? '#fff' : '#1a1a1a', color: ((sel.id === 'stars' && form.name && form.message) || (sel.id === 'victory' && files.length > 0 && files.length <= 10) || (sel.id !== 'stars' && sel.id !== 'victory' && files.length > 0)) ? '#000' : '#444', fontWeight: '800', border: 'none', cursor: 'pointer' }}
                    >
                      {up.state === 'uploading' ? 'Gönderiliyor...' : 'Sonraki'}
                    </button>
                  </div>
                  
                  {(sel.id === 'victory' && files.length > 10) && <p style={{ color: '#ff4d4d', fontSize: '0.7rem', textAlign: 'center', marginTop: '-0.5rem' }}>Maksimum 10 fotoğraf yükleyebilirsiniz.</p>}
                </div>
              )}
              <div style={{ width: '36px', height: '4px', background: '#333', borderRadius: '2px', margin: '1.5rem auto 0' }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
