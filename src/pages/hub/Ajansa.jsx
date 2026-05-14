import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Star, X, UploadCloud, CheckCircle, Trophy, Trash2, Video, Zap, Footprints, Mic, Camera, Layout, PlayCircle } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import PageLayout from '../../components/ortak/PageLayout';

const TYPES = [
  { id: 'victory', icon: <Trophy />, label: 'Satılan\nKiralanan', color: '#2ecc71' },
  { id: 'studio', icon: <Video />, label: 'Haber\nOnayla', color: '#ff4d4d', path: '/studio' },
  { id: 'selfie', icon: <Video />, label: 'Selfie\nStudio', color: '#3498db', path: '/selfie' },
  { id: 'reels', icon: <Camera />, label: 'Instagram\nReels', color: '#E1306C' },
  { id: 'post', icon: <Layout />, label: 'Instagram\nPost', color: '#833AB4' },
  { id: 'story', icon: <PlayCircle />, label: 'Instagram\nStory', color: '#F77737' },
  { id: 'qa', icon: <Video />, label: 'Soru\nCevaplar', color: 'var(--color-red)', heavy: true },
  { id: 'field', icon: <Zap />, label: 'Saha\nKesitleri', color: '#C026D3', heavy: true },
  { id: 'tour', icon: <Footprints />, label: 'Ev Gezi\nVideoları', color: 'var(--color-blue)', heavy: true },
  { id: 'podcast', icon: <Mic />, label: 'Müşteri\nPodcast', color: '#7C3AED', heavy: true },
  { id: 'photos', icon: <Image />, label: 'Kişisel\nHayat', color: '#059669' },
  { id: 'stars', icon: <Star />, label: 'Müşteri\nYorumları', color: '#D97706' },
  { id: 'suggestion', icon: <Zap />, label: 'Öneri\nBildir', color: '#D4AF37' },
];

const UI = {
  glass: { background: 'var(--color-glass)', border: '1px solid var(--color-border)', borderRadius: '8px', backdropFilter: 'blur(10px)' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', zIndex: 10000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
  box: { width: '100%', maxWidth: '440px', background: '#0a0a0a', borderBottom: '1px solid #333', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', padding: '1.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }
};

export default function Ajansa() {
  const navigate = useNavigate();
  const [sel, setSel] = useState(null);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('SATILDI');
  const [up, setUp] = useState({ state: 'idle', prog: 0 });
  const [form, setForm] = useState({ name: '', contact: '', message: '' });

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
      <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', padding: '0 0.5rem' }}>Ajans</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        {TYPES.map(t => (
          <button key={t.id} onClick={() => handleBtnClick(t)} style={{ ...UI.glass, padding: '1rem 0.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minHeight: '90px', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.2rem', color: t.color, filter: `drop-shadow(0 0 10px ${t.color}40)` }}>{t.icon}</div>
            <span style={{ color: '#fff', textAlign: 'center', whiteSpace: 'pre-line', fontSize: '0.6rem', fontWeight: '600', lineHeight: '1.1' }}>{t.label}</span>
          </button>
        ))}
      </div>

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
