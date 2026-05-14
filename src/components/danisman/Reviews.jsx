import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useDanismanData } from '../../hooks/useDanismanData';
import SectionHeader from '../ortak/SectionHeader';

const Reviews = ({ danismanId }) => {
  const { data: revs } = useDanismanData('danisman_yorumları', danismanId, [
    { id: 1, name: 'Murat K.', comment: 'Evimi beklediğimden çok daha hızlı ve profesyonel bir şekilde sattı.', rating: 5 },
    { id: 2, name: 'Ayşe T.', comment: 'Süreç boyunca her soruma anında yanıt aldım. Remax kalitesini hissettirdi.', rating: 5 },
    { id: 3, name: 'Selim V.', comment: 'Yatırım tavsiyeleri sayesinde çok karlı bir mülk aldım.', rating: 5 }
  ]);

  return (
    <section style={{ padding: '4rem 2rem' }}>
      <SectionHeader label="BAŞARI HİKAYELERİ" title="MÜŞTERİ DENEYİMLERİ" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {revs.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem' }}>
              {[...Array(r.rating)].map((_, j) => <Star key={j} size={14} fill="#4ade80" color="#4ade80" opacity={0.8} />)}
            </div>
            <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>"{r.comment}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '900', color: '#4ade80' }}>{r.name[0]}</div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)' }}>{r.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
