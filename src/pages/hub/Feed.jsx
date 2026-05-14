import { useState, useEffect, useMemo } from 'react';
import ContentCard from '../../components/hub/ContentCard';
import Loading from '../../components/ortak/Loading';
import PageLayout from '../../components/ortak/PageLayout';
import useSupabase from '../../hooks/useSupabase';

const Feed = () => {
  const [limit, setLimit] = useState(20);

  const { data: list, loading } = useSupabase('icerikler', { order: { column: 'created_at', ascending: false } });

  const [shuffled, setShuffled] = useState([]);

  useEffect(() => {
    if (list) {
      const timer = setTimeout(() => {
        setShuffled([...list].sort(() => 0.5 - Math.random()));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [list]);

  const filtered = useMemo(() => shuffled.filter(i => !(i.link?.includes('cdninstagram.com') && !i.link?.includes('instagram.com/p/'))).slice(0, limit), [shuffled, limit]);

  useEffect(() => {
    const obs = new IntersectionObserver(e => e[0].isIntersecting && setLimit(p => p + 20), { threshold: 0.1 });
    const el = document.getElementById('sentinel');
    if (el) obs.observe(el);
    return () => el && obs.unobserve(el);
  }, [filtered]);

  if (loading) return <Loading />;

  return (
    <PageLayout padding="1rem">
      <div className="grid">
        {filtered.map(i => <ContentCard key={i.id} item={i} onClick={o => window.open(o.link || o.url, '_blank')} />)}
        <div id="sentinel" style={{ height: '50px', width: '100%' }} />
      </div>
      <footer style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.1, fontSize: '0.6rem', letterSpacing: '2px' }}>RE/MAX INTELLIGENCE ENGINE V1.0</footer>
    </PageLayout>
  );
};

export default Feed;
