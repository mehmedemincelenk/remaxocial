import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, Check } from 'lucide-react';
import Loading from '../ortak/Loading';

const s = { 
  in: { width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: '#fff', textAlign: 'center', marginBottom: '1.5rem', outline: 'none' },
  btn: { flex: 1, height: '55px', borderRadius: '15px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none' }
};

const ValuationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ type: '', city: 'İstanbul', district: '', neighborhood: '', m2: '', name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [showTick, setShowTick] = useState(false);

  const steps = [
    { t: "Hangi mülkünüzün gerçek değerini bulalım?", s: "ADIM 1 / 7", k: "type" },
    { t: "Mülkünüz hangi şehirde yer alıyor?", s: "ADIM 2 / 7", k: "city" },
    { t: "Peki, hangi ilçede?", s: "ADIM 3 / 7", k: "district" },
    { t: "Süreç için mahalle bilgisi?", s: "ADIM 4 / 7", k: "neighborhood" },
    { t: "Mülkünüz yaklaşık kaç m²?", s: "ADIM 5 / 7", k: "m2", typ: "number" },
    { t: "Analizi kime iletmemizi istersiniz?", s: "ADIM 6 / 7", k: "name" },
    { t: "Son olarak, telefon numaranız?", s: "SON ADIM", k: "phone", typ: "tel" }
  ];

  const handleNext = () => step < 7 ? setStep(step + 1) : (setSubmitted(true), setTimeout(() => setShowTick(true), 2000));
  
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem 1.5rem', maxWidth: '400px', margin: '0 auto', minHeight: '340px', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: '900', color: '#4ADE80', letterSpacing: '2px', marginBottom: '0.5rem' }}>{steps[step-1].s}</p>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem' }}>{steps[step-1].t}</h3>
            {step === 1 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[{l:'Daire',i:'🏢'}, {l:'Villa',i:'🏡'}, {l:'Ticari',i:'🏬'}, {l:'Arsa',i:'🌳'}].map(o => (
                  <button key={o.l} onClick={() => { setFormData({...formData, type: o.l}); setStep(2); }} style={{ padding: '1.5rem', background: formData.type === o.l ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${formData.type === o.l ? '#4ADE80' : 'rgba(255,255,255,0.1)'}`, borderRadius: '20px', color: '#fff', cursor: 'pointer' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{o.i}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '900', color: formData.type === o.l ? '#4ADE80' : '#fff' }}>{o.l.toUpperCase()}</div>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <input type={steps[step-1].typ || "text"} autoFocus style={s.in} value={formData[steps[step-1].k]} onChange={e => setFormData({...formData, [steps[step-1].k]: e.target.value})} />
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button onClick={() => setStep(step - 1)} style={{ ...s.btn, width: '55px', flex: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff' }}><ChevronLeft size={20}/></button>
                  <button onClick={handleNext} style={{ ...s.btn, background: step === 7 ? '#4ADE80' : '#fff', color: '#000' }}>{step === 7 ? 'ANALİZİ BAŞLAT' : 'DEVAM ET'} <ArrowRight size={18}/></button>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            {!showTick ? <div style={{ padding: '2rem' }}><Loading /></div> : (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div style={{ width: '80px', height: '80px', background: '#4ADE80', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 10px 30px rgba(74, 222, 128, 0.3)' }}><Check size={42} color="#000" strokeWidth={3} /></div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValuationForm;
