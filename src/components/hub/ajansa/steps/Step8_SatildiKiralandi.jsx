import { useState } from 'react';
import { Image, X, ChevronLeft } from 'lucide-react';
import { supabase } from '../../../../utils/supabaseClient';
import { GlassCard } from '../../../ortak';
import { useAppContext } from '../../../../context/AppContext';

export default function Step8_SatildiKiralandi({ sessionId, memberId, onComplete, onPrev }) {
  const { notify } = useAppContext();
  const [form, setForm] = useState({
    sehir: '',
    semt: '',
    sure: '',
    type: 'satildi', // 'satildi' or 'kiralandi'
    hasAds: true,
    musteriYorumu: ''
  });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExtraFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setExtraFiles(prev => [...prev, ...files]);
  };

  const removeExtraFile = (index) => {
    setExtraFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTransaction = () => {
    if (selectedTypes.length === 0) return notify('Lütfen en az bir konut tipi seçin.', 'error');
    if (!form.sehir.trim()) return notify('Lütfen şehir girin.', 'error');
    if (!form.semt.trim()) return notify('Lütfen semt girin.', 'error');
    if (!coverFile) return notify('Lütfen en iyi görseli (kapak) seçin.', 'error');

    const newTx = {
      id: Date.now(),
      form: { ...form },
      selectedTypes: [...selectedTypes],
      coverFile,
      extraFiles: [...extraFiles]
    };

    setTransactions(prev => [...prev, newTx]);

    // Reset Form
    setForm({
      sehir: '',
      semt: '',
      sure: '',
      type: 'satildi',
      hasAds: true,
      musteriYorumu: ''
    });
    setSelectedTypes([]);
    setCoverFile(null);
    setExtraFiles([]);
    notify('İşlem eklendi! Yenisini ekleyebilir ya da alttan kaydedip ilerleyebilirsiniz.', 'success');
  };

  const handleSave = async () => {
    let listToUpload = [...transactions];

    // If they have nothing added, but they filled out the form, add it automatically
    if (listToUpload.length === 0) {
      if (selectedTypes.length > 0 || form.sehir.trim() || form.semt.trim() || coverFile) {
        if (selectedTypes.length === 0) return notify('Lütfen konut tipi seçin.', 'error');
        if (!form.sehir.trim()) return notify('Lütfen şehir girin.', 'error');
        if (!form.semt.trim()) return notify('Lütfen semt girin.', 'error');
        if (!coverFile) return notify('Lütfen kapak görseli seçin.', 'error');
        
        listToUpload.push({
          id: Date.now(),
          form: { ...form },
          selectedTypes: [...selectedTypes],
          coverFile,
          extraFiles: [...extraFiles]
        });
      }
    }

    if (listToUpload.length === 0) {
      return onComplete('satildi_kiralandi_skipped');
    }

    setIsSubmitting(true);
    try {
      const ay = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

      for (const tx of listToUpload) {
        // 1. Upload Cover Image
        const coverFileName = `${memberId}-${Date.now()}-cover.${tx.coverFile.name.split('.').pop()}`;
        const coverFilePath = `${ay}/${coverFileName}`;
        let coverUrl = '';
        
        try {
          await supabase.storage.from('test-victory-images').upload(coverFilePath, tx.coverFile);
          const { data } = supabase.storage.from('test-victory-images').getPublicUrl(coverFilePath);
          coverUrl = data?.publicUrl || '';
        } catch {
          await supabase.storage.from('test-business-vibe').upload(coverFilePath, tx.coverFile);
          const { data } = supabase.storage.from('test-business-vibe').getPublicUrl(coverFilePath);
          coverUrl = data?.publicUrl || '';
        }

        // 2. Upload Extra Images
        const extraUrls = [];
        for (let i = 0; i < tx.extraFiles.length; i++) {
          const file = tx.extraFiles[i];
          const extraFileName = `${memberId}-${Date.now()}-extra-${i}.${file.name.split('.').pop()}`;
          const extraFilePath = `${ay}/${extraFileName}`;
          
          try {
            await supabase.storage.from('test-victory-images').upload(extraFilePath, file);
            const { data } = supabase.storage.from('test-victory-images').getPublicUrl(extraFilePath);
            if (data?.publicUrl) extraUrls.push(data.publicUrl);
          } catch {
            await supabase.storage.from('test-business-vibe').upload(extraFilePath, file);
            const { data } = supabase.storage.from('test-business-vibe').getPublicUrl(extraFilePath);
            if (data?.publicUrl) extraUrls.push(data.publicUrl);
          }
        }

        // 3. Write to test_victory_uploads or fallback table
        const payload = {
          session_id: sessionId,
          member_id: memberId,
          baslik: tx.selectedTypes.join(', '),
          konum: `${tx.form.sehir} / ${tx.form.semt}`,
          sure: tx.form.sure,
          type: tx.form.type,
          has_ads: tx.form.hasAds,
          musteri_yorumgu: tx.form.musteriYorumu,
          musteri_adi: '',
          cover_url: coverUrl,
          images_urls: extraUrls,
          cta_type: 'none',
          ay
        };

        await supabase.from('test_victory_uploads').insert([payload]);
      }

      onComplete('satildi_kiralandi');
    } catch (e) { 
      onComplete('satildi_kiralandi');
    } finally { 
      setIsSubmitting(false); 
    }
  };

  // Determine button state: "Ekle" or "Kaydet ve İlerle"
  const hasFormInput = selectedTypes.length > 0 || form.sehir.trim() || form.semt.trim() || coverFile;
  const isAddMode = hasFormInput || transactions.length === 0;

  return (
    <GlassCard padding="1rem" borderRadius="18px" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', color: '#fff', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
      {onPrev && (
        <button 
          onClick={onPrev} 
          style={{ 
            position: 'absolute', 
            top: '12px', 
            left: '12px', 
            background: 'transparent', 
            border: 'none', 
            color: '#aaa', 
            cursor: 'pointer',
            transition: 'color 0.2s',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; }}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '0.2rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>İşlemleriniz</h3>
      </div>

      {/* Form Customization Controls Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        
        {/* Toggle: Satıldı / Kiralandı */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => setForm(p => ({ ...p, type: 'satildi' }))}
            style={{
              flex: 1, padding: '6px 8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.72rem',
              background: form.type === 'satildi' ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: form.type === 'satildi' ? '#fff' : '#666',
              border: form.type === 'satildi' ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            SATILDI
          </button>
          <button
            onClick={() => setForm(p => ({ ...p, type: 'kiralandi' }))}
            style={{
              flex: 1, padding: '6px 8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.72rem',
              background: form.type === 'kiralandi' ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: form.type === 'kiralandi' ? '#fff' : '#666',
              border: form.type === 'kiralandi' ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            KİRALANDI
          </button>
        </div>

        {/* Category Chips Selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', width: '100%', padding: '2px 0 4px 0' }}>
          {['Konut', 'Villa', 'Arsa', 'Ticari', 'Rezidans'].map(t => {
            const isSelected = selectedTypes.includes(t);
            return (
              <button
                key={t}
                onClick={() => {
                  setSelectedTypes(prev => 
                    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
                  );
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  border: isSelected ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  background: isSelected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.01)',
                  color: isSelected ? '#fff' : '#888',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Şehir / Semt / Süre Grid Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '6px' }}>
          <input 
            placeholder="Şehir" 
            value={form.sehir} 
            onChange={e => setForm(p => ({ ...p, sehir: e.target.value }))} 
            style={inputStyle} 
          />
          <input 
            placeholder="Semt" 
            value={form.semt} 
            onChange={e => setForm(p => ({ ...p, semt: e.target.value }))} 
            style={inputStyle} 
          />
          <input 
            placeholder="Süre" 
            value={form.sure} 
            onChange={e => setForm(p => ({ ...p, sure: e.target.value }))} 
            style={inputStyle} 
          />
        </div>

        {/* Kapak & Galeri Upload Row */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {/* Cover File Picker */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={uploadBoxStyle(!!coverFile)}>
              <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} style={fileInputStyle} />
              <Image size={14} color={coverFile ? 'var(--color-accent)' : '#555'} />
              <span style={{ color: coverFile ? '#fff' : '#888', fontSize: '0.65rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }}>
                {coverFile ? coverFile.name : '1 ad. Kapak'}
              </span>
            </div>
          </div>
          
          {/* Gallery Picker */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={uploadBoxStyle(extraFiles.length > 0)}>
              <input type="file" multiple accept="image/*" onChange={handleExtraFilesChange} style={fileInputStyle} />
              <Image size={14} color={extraFiles.length > 0 ? 'var(--color-accent)' : '#555'} />
              <span style={{ color: extraFiles.length > 0 ? '#fff' : '#888', fontSize: '0.65rem' }}>
                {extraFiles.length > 0 ? `${extraFiles.length} Görsel` : 'Tümü'}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Extra Files Thumbnails */}
        {extraFiles.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '1px 0', scrollbarWidth: 'none' }}>
            {extraFiles.map((f, i) => (
              <div key={i} style={{ position: 'relative', width: '28px', height: '28px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', flexShrink: 0 }}>
                <img src={URL.createObjectURL(f)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => removeExtraFile(i)} 
                  style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#ff4d4d', width: '10px', height: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                >
                  <X size={5} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Client Testimonial Textarea */}
        <textarea 
          placeholder="Müşteri Memnuniyet Yorumu..." 
          value={form.musteriYorumu} 
          onChange={e => setForm(p => ({ ...p, musteriYorumu: e.target.value }))} 
          rows={2} 
          style={{ ...inputStyle, padding: '8px 12px', fontFamily: 'inherit', resize: 'none' }} 
        />

      </div>

      {/* Added Transactions List Panel */}
      {transactions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '10px', maxHeight: '110px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 'bold' }}>EKLENEN İŞLEMLER ({transactions.length})</div>
          {transactions.map((tx) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '4px 8px', borderRadius: '6px', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                🏠 {tx.selectedTypes.join(', ')} ({tx.form.sehir} / {tx.form.semt}) - {tx.form.type === 'satildi' ? 'Satıldı' : 'Kiralandı'}
              </span>
              <button 
                onClick={() => setTransactions(prev => prev.filter(x => x.id !== tx.id))} 
                style={{ background: 'rgba(255,77,77,0.15)', border: 'none', borderRadius: '6px', color: '#ff4d4d', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: '0.65rem' }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.3rem' }}>
        <button 
          onClick={() => onComplete('satildi_kiralandi_skipped')} 
          style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#aaa', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
        >
          Atla
        </button>
        <button 
          onClick={isAddMode ? handleAddTransaction : handleSave} 
          disabled={isSubmitting} 
          style={{ flex: 2, padding: '8px', background: 'var(--color-accent)', border: 'none', borderRadius: '10px', color: '#000', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem' }}
        >
          {isSubmitting ? '...' : (isAddMode ? 'Ekle' : 'Kaydet ve İlerle')}
        </button>
      </div>
    </GlassCard>
  );
}

const inputStyle = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '6px 10px', color: '#fff', fontSize: '0.75rem', outline: 'none', width: '100%', boxSizing: 'border-box' };
const uploadBoxStyle = (active) => ({ border: '1px dashed rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.01)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px', cursor: 'pointer', gap: '4px', height: '42px', boxSizing: 'border-box' });
const fileInputStyle = { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 };
