import { useState, useEffect } from 'react';
import PageLayout from '../../components/ortak/PageLayout';
import MegaToggle from '../../components/ortak/MegaToggle';
import PromptCard from '../../components/hub/ajansa/PromptCard';
import { promptMixer, COM_TYPES } from '../../utils/aiPrompts';

export default function AIPromptLibrary() {
  const [viewMode, setViewMode] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const handleClear = () => setSelectedIds([]);
    window.addEventListener('ai-selection-clear', handleClear);
    return () => window.removeEventListener('ai-selection-clear', handleClear);
  }, []);

  const dispatchUpdate = (ids, mode) => {
    window.dispatchEvent(new CustomEvent('ai-selection-changed', {
      detail: { count: ids.length, ids, mode, type: 'photo' }
    }));
  };

  const handleTabChange = (mode) => {
    setViewMode(mode);
    dispatchUpdate(selectedIds, mode);
  };

  const toggleSelection = (id) => {
    const isCommercial = COM_TYPES.map(c => c.id).includes(id);
    setSelectedIds(prev => {
      let next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev];
      if (!prev.includes(id)) {
        if (isCommercial) {
          next = [...next.filter(i => !COM_TYPES.map(c => c.id).includes(i)), id];
        } else if (prev.length < 3) {
          next = [...next, id];
        }
      }
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

  const TOGGLE_OPTIONS = [
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
    }
  ];

  const hasIndoorSelected = selectedIds.some(id => ['removal', 'com_office', 'com_restaurant', 'com_coffee', 'com_boutique', 'com_industrial'].includes(id));
  const hasOutdoorSelected = selectedIds.some(id => ['drone', 'floorplan'].includes(id));
  const disabledToggleIds = hasOutdoorSelected ? ['indoor', 'commercial'] : (hasIndoorSelected ? ['outdoor'] : []);

  return (
    <PageLayout padding="0">
      <div style={{ padding: '1.2rem 0', display: 'flex', justifyContent: 'center' }}>
        <MegaToggle
          options={TOGGLE_OPTIONS}
          activeId={viewMode}
          onChange={handleTabChange}
          disabledIds={disabledToggleIds}
        />
      </div>

      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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

        {viewMode === 'indoor' && (
          <>
            <PromptCard id="removal" title="Eşyaları Sıfırla" desc="İçeride ne varsa siler, odayı bomboş yaparım." icon="🗑️" isSelected={selectedIds.includes('removal')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('removal')} isSurgical={true} />
            <PromptCard id="lifestyle" title="Yaşam İzleri" desc="Mülke ruh katar, hayalindeki o yaşamı resmederim." icon="👪" isSelected={selectedIds.includes('lifestyle')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('lifestyle')} />
            <PromptCard id="ticari" title="ticari" multiIcons={COM_TYPES} isSelected={selectedIds} onIconClick={toggleSelection} onCardClick={() => { }} />
          </>
        )}

        {viewMode === 'outdoor' && (
          <>
            <PromptCard id="drone" title="Drone Bakışı" desc="Sınırları parlatır, lüks bir drone çekimine çeviririm." icon="🛸" isSelected={selectedIds.includes('drone')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('drone')} />
            <PromptCard id="floorplan" title="Mimari Plan / Kroki" desc="Kötü çizimleri tertemiz 2D mimari plana çeviririm." icon="📐" isSelected={selectedIds.includes('floorplan')} onIconClick={toggleSelection} onCardClick={() => handleMasterCopy('floorplan')} />
            <PromptCard id="ticari" title="ticari" multiIcons={COM_TYPES} isSelected={selectedIds} onIconClick={toggleSelection} onCardClick={() => { }} />
          </>
        )}
      </div>
      <div style={{ height: '2rem' }} />
    </PageLayout>
  );
}