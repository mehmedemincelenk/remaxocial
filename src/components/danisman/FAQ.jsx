import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useDanismanData } from '../../hooks/useDanismanData';
import SectionHeader from '../ortak/SectionHeader';

const FAQ = ({ danismanId }) => {
  const [expId, setExpId] = useState(null);
  const { data: faqs } = useDanismanData('danisman_sss', danismanId, [
    { id: 1, question: 'Ekspertiz süreci nasıl işler?', answer: 'Ücretsiz yerinde inceleme yaparak, güncel pazar verileriyle mülkünüzün en doğru değerini 24 saat içinde raporluyoruz.' },
    { id: 2, question: 'Komisyon oranları nedir?', answer: 'Yasal sınırlar dahilinde, profesyonel pazarlama ve hukuki destek hizmetlerimizi kapsayan şeffaf bir modelle çalışıyoruz.' },
    { id: 3, question: 'Evim ne kadar sürede satılır?', answer: 'Doğru fiyatlandırma ve agresif pazarlama stratejimizle ortalama satış süremiz 35-45 gündür.' }
  ]);

  return (
    <section style={{ padding: '4rem 2rem' }}>
      <SectionHeader label="YARDIM" title="AKLINIZDAKİ SORULAR" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {faqs.map(f => (
          <div key={f.id} onClick={() => setExpId(expId === f.id ? null : f.id)} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '1.5rem', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: expId === f.id ? '#4ade80' : 'rgba(255,255,255,0.9)' }}>{f.question}</span>
              <motion.div animate={{ rotate: expId === f.id ? 180 : 0 }}><ChevronDown size={18} opacity={0.5} /></motion.div>
            </div>
            <AnimatePresence>
              {expId === f.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
