import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { FaInstagram, FaWhatsapp, FaPhone } from 'react-icons/fa';
import Loading from '../../components/ortak/Loading';
import ValuationForm from '../../components/danisman/ValuationForm';
import consultantQA from '../../data/consultant_qa.json';
import GlassCard from '../../components/ortak/GlassCard';
import PageLayout from '../../components/ortak/PageLayout';
import useSupabase from '../../hooks/useSupabase';
import Marquee from '../../components/ortak/Marquee';
import remaxLogo from '../../assets/icons/remax_logo.svg';

const HookSection = ({ p, hook }) => (
  <section style={{ padding: '2rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
    <img src={remaxLogo} style={{ position: 'absolute', top: 10, right: -30, width: 200, opacity: 0.15, pointerEvents: 'none' }} />
    <h1 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.2rem' }}>{p.full_name}</h1>
    <p className="text-badge" style={{ color: 'var(--accent)' }}>{(p.title || 'GAYRİMENKUL DANIŞMANI')}</p>
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ width: '230px', height: '380px', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border)', margin: '1.5rem auto', position: 'relative', background: '#111' }}>
      <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={hook?.mediaUrl || p.video_url} />
    </motion.div>
  </section>
);

const ReviewsSection = ({ reviews }) => (
  <section style={{ padding: '1rem 0' }}>
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: '0.4rem' }}>{[...Array(5)].map((_, i) => <Star key={i} size={10} fill="var(--accent)" color="var(--accent)" />)}</div>
      <h2 className="text-heading">Müşteri Deneyimleri</h2>
    </div>
    <Marquee items={reviews} dur={25}>{(rev, i) => (
      rev.img ? (
        <div key={i} style={{ minWidth: '220px', height: '280px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
          <img src={rev.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div key={i} style={{ minWidth: '180px', height: '320px', borderRadius: '18px', overflow: 'hidden', background: '#111', border: '1px solid var(--border)' }}>
          {rev.mediaType === 'VIDEO' ? <video autoPlay muted loop playsInline src={rev.mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src={rev.mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
      )
    )}</Marquee>
  </section>
);

const RiskQASection = () => (
  <section style={{ padding: '2rem 0 0' }}>
    <Marquee items={[...consultantQA.filter(q => q.category?.includes('risk')), ...consultantQA.filter(q => q.category?.includes('risk'))]} dir="y" dur={80}>{(qa, i) => (
      <GlassCard key={i} padding="1.8rem" borderRadius="20px" style={{ width: '300px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'right' }}>{qa.question}</h3>
        <p className="text-body" style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '1rem' }}>{qa.answer}</p>
      </GlassCard>
    )}</Marquee>
    <p style={{ fontSize: '0.55rem', opacity: 0.2, textAlign: 'left', paddingLeft: '1.5rem', marginTop: '0.2rem', fontStyle: 'italic', letterSpacing: '0.5px' }}>...ve bilmediğiniz yüzlercesi..</p>
  </section>
);

const FinalCTA = ({ p }) => (
  <section style={{ padding: '1.5rem 1.5rem 1rem', textAlign: 'center', background: 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--accent) 5%, transparent))', borderTop: '1px solid var(--border)' }}>
    <h2 style={{ fontSize: '2.4rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '1rem' }}>Şansa değil, bize bırakın</h2>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
      {['MÜLKÜNÜZÜ TANITIN', 'STRATEJİ KURALIM', 'ZİRVEDE DEVREDİN'].map((t, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--accent)' }}>{i + 1}</div>
          <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--color-text-muted)' }}>{t}</span>
        </div>
      ))}
    </div>
    <ValuationForm profile={p} />
    <div style={{ marginTop: '2rem' }}>
      <p style={{ color: 'rgba(255,255,255,0.2)', fontWeight: '900', letterSpacing: '2px', marginBottom: '1.5rem' }}>VEYA</p>
      <button onClick={() => window.open(`https://wa.me/${p.whatsapp_num}?text=Merhaba, bilgi almak istiyorum.`, '_blank')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', padding: '0.7rem 1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--accent)', borderRadius: '14px', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>
        DOĞRUDAN İLETİŞİME GEÇİN <FaWhatsapp size={18} color="var(--accent)" />
      </button>
    </div>
  </section>
);

const ConsultantProfile = () => {
  const { slug } = useParams();
  const { data: p, loading: profileLoading } = useSupabase('consultants', { filter: { column: 'slug', operator: 'eq', value: slug }, single: true });
  const [f, setF] = useState({ hook: null, reviews: [] });
  const [feedLoading, setFeedLoading] = useState(false);

  useEffect(() => {
    if (p?.feed_url) {
      setTimeout(() => setFeedLoading(true), 0);
      fetch(p.feed_url)
        .then(res => res.json())
        .then(({ posts = [] }) => {
          setF({
            hook: posts.find(x => x.caption?.toLowerCase().includes('#wahook')),
            reviews: [...posts.filter(x => x.caption?.toLowerCase().includes('#wayorum')), ...posts.filter(x => x.caption?.toLowerCase().includes('#wayorum'))]
          });
        })
        .catch(console.error)
        .finally(() => setFeedLoading(false));
    }
  }, [p?.feed_url]);

  const l = profileLoading || feedLoading;

  if (l) return <Loading />;
  if (!p) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>Bulunamadı.</div>;

  return (
    <PageLayout withBottomNav={false} innerStyle={{ padding: 0 }}>
      <HookSection p={p} hook={f.hook} />
      <ReviewsSection reviews={f.reviews} />
      <section style={{ padding: '4rem 1.5rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '320px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem 1.5rem' }}>
          <p style={{ fontSize: '1rem', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '1rem' }}>"Mülkünüz sadece bir tapu kağıdı değil, yıllarınızın emeğidir."</p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>Bu değeri piyasanın deneme-yanılma tahtasına terk edemeyiz. Karşılaşabileceğiniz riskleri önceden görmek başarılı bir satışın ilk kuralıdır.</p>
        </div>
      </section>
      <RiskQASection />
      <FinalCTA p={p} />
      <footer style={{ padding: '5rem 1.5rem 3rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>"Gayrimenkulünüzü değil, geleceğinizi yönetiyoruz."</p>
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>{p.full_name}</h3>
          <p className="text-badge" style={{ color: 'var(--accent)' }}>Gayrimenkul Stratejisti</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid var(--border)', maxWidth: '300px', margin: '0 auto' }}>
          {[
            { id: 'w', url: `https://wa.me/${p.whatsapp_num}`, icon: <FaWhatsapp size={18} /> },
            { id: 'i', url: `https://instagram.com/${p.instagram_user}`, icon: <FaInstagram size={18} /> },
            { id: 'p', url: `tel:${p.whatsapp_num}`, icon: <FaPhone size={16} /> }
          ].map(l => <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)' }}>{l.icon}</a>)}
        </div>
      </footer>
    </PageLayout>
  );
};

export default ConsultantProfile;
