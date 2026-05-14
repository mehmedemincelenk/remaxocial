import { motion } from 'framer-motion';
import { useDanismanData } from '../../hooks/useDanismanData';
import SectionHeader from '../ortak/SectionHeader';

const InfoCards = ({ danismanId }) => {
  const { data: cards } = useDanismanData('danisman_icgoruleri', danismanId, [
    { id: 1, title: 'Bölge Analizi', content: 'Beylikdüzü son 1 yılda %80 değer kazandı. Yatırım için doğru zaman.' },
    { id: 2, title: 'Neden Şimdi?', content: 'Faiz oranları düşmeden alım yapmak, maliyet avantajı sağlar.' },
    { id: 3, title: 'Uzman Tüyo', content: 'Manzaralı evlerin kira dönüş hızı %20 daha yüksektir.' }
  ]);

  return (
    <section style={{ padding: '4rem 0 3rem' }}>
      <SectionHeader label="İÇGÖRÜLER" title="STRATEJİK ANALİZLER" style={{ padding: '0 2rem' }} />
      <div style={{ display: 'flex', overflowX: 'auto', gap: '1.2rem', padding: '0 2rem 2rem', scrollbarWidth: 'none' }}>
        {cards.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ minWidth: '300px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '28px', padding: '2.5rem', backdropFilter: 'blur(15px)' }}>
            <div style={{ height: '2px', width: '30px', background: '#4ade80', marginBottom: '1.5rem' }} />
            <h3 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '900', marginBottom: '1rem' }}>{c.title.toUpperCase()}</h3>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.6)' }}>{c.content}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default InfoCards;
