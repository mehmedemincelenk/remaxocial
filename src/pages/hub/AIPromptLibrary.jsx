import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import GlassCard from '../../components/ortak/GlassCard';
import PageLayout from '../../components/ortak/PageLayout';
import MegaToggle from '../../components/ortak/MegaToggle';
import { promptMixer } from '../../utils/aiPrompts';

import cgptLogo from '../../assets/icons/cgpt_logo.svg';
import claudeLogo from '../../assets/icons/claude_logo.svg';
import geminiLogo from '../../assets/icons/gemini_logo.svg';

// Vite Proxy URL for CORS bypass
const REPLICATE_PROXY = "/replicate-api";

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
              transition: 'all 0.3s ease'
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

const COM_TYPES = [
  { id: 'com_office', icon: '🏢', label: 'Ofis' },
  { id: 'com_restaurant', icon: '🍽️', label: 'Restoran' },
  { id: 'com_coffee', icon: '☕', label: 'Kafe' },
  { id: 'com_boutique', icon: '👕', label: 'Butik' },
  { id: 'com_industrial', icon: '🏭', label: 'Sanayi/Depo' }
];

export default function AIPromptLibrary() {
  const [viewMode, setViewMode] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
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
      const finalPrompt = promptMixer(selectedIds, viewMode);
      const base64Image = await fileToBase64(images[0].file);
      
      // Step 1: Create Prediction using Model-based endpoint (Latest version automatically)
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
      console.log("Replicate Full Response:", prediction);

      if (!response.ok) {
        throw new Error(prediction.detail || prediction.error || `API Hatası: ${response.status}`);
      }

      if (!prediction.urls || !prediction.urls.get) {
        throw new Error("API yanıtı eksik (Polling URL bulunamadı)");
      }

      // Step 2: Poll for completion
      let pollUrl = prediction.urls.get.replace("https://api.replicate.com", REPLICATE_PROXY);

      const checkStatus = async () => {
        try {
          const res = await fetch(pollUrl, {
            headers: { "Authorization": `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}` }
          });
          const statusData = await res.json();
          console.log("Polling Status:", statusData.status);
          
          if (statusData.status === "succeeded") {
            setResult(statusData.output[0]);
            setLoading(false);
          } else if (statusData.status === "failed") {
            throw new Error("Görsel üretimi başarısız oldu: " + (statusData.error || ""));
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


  useEffect(() => {
    const handleClear = () => setSelectedIds([]);
    window.addEventListener('ai-selection-clear', handleClear);
    return () => window.removeEventListener('ai-selection-clear', handleClear);
  }, []);

  const dispatchUpdate = (ids, mode) => {
    window.dispatchEvent(new CustomEvent('ai-selection-changed', {
      detail: { count: ids.length, ids, mode }
    }));
  };

  const handleTabChange = (mode) => {
    setViewMode(mode);
    dispatchUpdate(selectedIds, mode);
  };

  const toggleSelection = (id) => {
    const isCommercial = COM_TYPES.map(c => c.id).includes(id);

    setSelectedIds(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(i => i !== id);
        dispatchUpdate(next, viewMode);
        return next;
      }

      let next = [...prev];

      if (isCommercial) {
        next = next.filter(i => !COM_TYPES.map(c => c.id).includes(i));
      } else {
        if (prev.length >= 3) return prev;
      }

      next = [...next, id];
      dispatchUpdate(next, viewMode);
      return next;
    });
  };

  const handleMasterCopy = (baseId) => {
    const allActive = Array.from(new Set([...selectedIds, baseId]));
    const finalPrompt = promptMixer(allActive, viewMode);
    navigator.clipboard.writeText(finalPrompt);
    setTimeout(() => setSelectedIds([]), 2000);
  };

  const hasIndoorSelected = selectedIds.some(id => ['removal', 'com_office', 'com_restaurant', 'com_coffee', 'com_boutique', 'com_industrial'].includes(id));
  const hasOutdoorSelected = selectedIds.some(id => ['drone', 'floorplan'].includes(id));

  const TOGGLE_OPTIONS = [
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

  const disabledToggleIds = hasOutdoorSelected ? ['indoor', 'commercial'] : (hasIndoorSelected ? ['outdoor'] : []);

  return (
    <PageLayout padding="0">

      {/* 1. TOP TOGGLE NAVIGATION */}
      <div style={{ padding: '1.2rem 0', display: 'flex', justifyContent: 'center' }}>
        <MegaToggle
          options={TOGGLE_OPTIONS}
          activeId={viewMode}
          onChange={handleTabChange}
          disabledIds={disabledToggleIds}
        />
      </div>

      {/* UPLOAD AREA */}
      <div style={{ padding: '0 1.5rem 0.5rem' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div 
            style={{ 
              flex: 1, 
              height: '80px', 
              border: '1px dashed rgba(255,255,255,0.2)', 
              borderRadius: '4px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '0 10px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <input type="file" multiple hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />
            
            {/* ADD BUTTON SLOT - Only show if less than 5 images */}
            {images.length < 5 && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ minWidth: '50px', height: '60px', borderRadius: '4px', border: '1px dashed rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ImageIcon size={20} style={{ opacity: 0.4 }} />
              </div>
            )}

            {/* IMAGE THUMBNAILS */}
            {images.map(img => (
              <motion.div 
                key={img.id}
                onClick={() => removeImage(img.id)}
                whileTap={{ scale: 0.9 }}
                style={{ minWidth: '50px', height: '60px', borderRadius: '4px', overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
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
              style={{ width: '40px', height: '80px', borderRadius: '4px', border: `1px solid ${result ? '#00ff00' : 'var(--color-accent)'}`, background: 'transparent', color: result ? '#00ff00' : 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
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
              style={{ width: '100%', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} 
              alt="Result" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

        {/* ORTAK MODE */}
        {viewMode === 'all' && (
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

        {/* INDOOR SECTION */}
        {viewMode === 'indoor' && (
          <>
            <PromptCard id="removal" title="Eşyaları Sıfırla" desc="İçeride ne varsa siler, odayı bomboş yaparım." icon="🗑️" isSelected={selectedIds.includes('removal')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('removal')} isSurgical={true} />
            <PromptCard id="lifestyle" title="Yaşam İzleri" desc="Mülke ruh katar, hayalindeki o yaşamı resmederim." icon="👪" isSelected={selectedIds.includes('lifestyle')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('lifestyle')} />

            <PromptCard id="ticari" title="₺" multiIcons={COM_TYPES} isSelected={selectedIds} onIconClick={toggleSelection} onCardClick={() => { }} />
          </>
        )}

        {/* OUTDOOR SECTION */}
        {viewMode === 'outdoor' && (
          <>
            <PromptCard id="drone" title="Drone Bakışı" desc="Sınırları parlatır, lüks bir drone çekimine çeviririm." icon="🛸" isSelected={selectedIds.includes('drone')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('drone')} />
            <PromptCard id="floorplan" title="Mimari Plan / Kroki" desc="Kötü çizimleri tertemiz 2D mimari plana çeviririm." icon="📐" isSelected={selectedIds.includes('floorplan')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('floorplan')} />

            <PromptCard id="ticari" title="₺" multiIcons={COM_TYPES} isSelected={selectedIds} onIconClick={toggleSelection} onCardClick={() => { }} />
          </>
        )}
      </div>
    </PageLayout>
  );
}
