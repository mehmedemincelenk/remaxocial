import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, LayoutGrid, Newspaper, Zap, CheckSquare, Hash, Heart, MessageCircle } from 'lucide-react';
import Loading from '../../components/ortak/Loading';
import ValuationForm from '../../components/danisman/ValuationForm';
import GlassCard from '../../components/ortak/GlassCard';
import PageLayout from '../../components/ortak/PageLayout';
import FilterChip from '../../components/ortak/FilterChip';
import MegaToggle from '../../components/ortak/MegaToggle';
import useSupabase from '../../hooks/useSupabase';
import useLocalStorage from '../../hooks/useLocalStorage';
import sssData from '../../data/diamond_qa_master.json';
import objectionsData from '../../data/itirazlar.json';
import newsData from '../../api/news.json';
import feedData from '../../../wepscrp/data.json';

export default function Library() {
  const [tab, setTab] = useState('feed');
  const [isCatsOpen, setIsCatsOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [selCats, setSelCats] = useState({ feed: [], sss: [], objections: ['Seçtiklerim'] });
  const [favs, setFavs] = useLocalStorage('lib_favs', []);
  const [expandedNews, setExpandedNews] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const TABS = [
    {
      id: 'feed',
      label: 'AKIŞ',
      icon: <LayoutGrid size={18} />,
      table: null
    },
    {
      id: 'hashtags',
      label: 'HASHTAGLER',
      icon: <Hash size={18} />,
      table: null,
      renderItem: (item) => (
        <GlassCard padding="1rem 0.8rem 1rem 1.5rem" borderRadius="20px">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff', opacity: 0.7, letterSpacing: '0.02em' }}>
              #{item.etiket}
            </span>
            <div style={{ display: 'flex', gap: '0.1rem' }}>
              {[
                { id: 'ig', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, url: (tag) => `https://www.instagram.com/explore/search/keyword/?q=%23${tag}` },
                { id: 'yt', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.42-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>, url: (tag) => `https://www.youtube.com/hashtag/${tag}` },
                { id: 'li', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>, url: (tag) => `https://www.linkedin.com/search/results/all/?keywords=%23${tag}&origin=GLOBAL_SEARCH_HEADER` }
              ].map(social => (
                <motion.button
                  key={social.id}
                  whileHover={{ scale: 1.2, color: 'var(--color-accent)' }}
                  onClick={(e) => { e.stopPropagation(); window.open(social.url(item.etiket), '_blank'); }}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: '0.2s ease' }}
                >
                  {social.icon}
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>
      )
    },
    {
      id: 'news',
      label: 'HABERLER',
      icon: <Newspaper size={18} />,
      table: null
    },
    {
      id: 'objections',
      label: 'İTİRAZLAR',
      icon: <Zap size={18} />,
      table: 'objections'
    }
  ];

  const cur = TABS.find(t => t.id === tab);

  const { data: supabaseData, loading } = useSupabase(cur?.table);

  const data = useMemo(() => {
    if (tab === 'sss') {
      return [...(supabaseData || []), ...sssData];
    } else if (tab === 'objections') {
      return objectionsData;
    } else if (tab === 'news') {
      return newsData;
    } else if (tab === 'feed') {
      return [...feedData].sort(() => Math.random() - 0.5);
    } else {
      return supabaseData || [];
    }
  }, [supabaseData, tab]);

  const allCats = useMemo(() => {
    const raw = (tab === 'sss' || tab === 'objections' || tab === 'news')
      ? [...new Set(data.flatMap(i => {
        if (Array.isArray(i.category)) return i.category;
        if (Array.isArray(i.categories)) return i.categories;
        return i.category ? [i.category] : [];
      }))]
      : [];

    const currentSel = selCats[tab] || [];
    return [...new Set([...currentSel, ...raw])].sort((a, b) => currentSel.includes(b) - currentSel.includes(a));
  }, [data, tab, selCats]);

  const filtered = useMemo(() => data.filter(i => {
    const matches = (i.baslik || i.question || i.text || i.title || '').toLowerCase().includes(term.toLowerCase());
    const currentSel = selCats[tab] || [];
    if (tab === 'sss' || tab === 'objections') {
      const others = currentSel.filter(c => c !== 'Seçtiklerim');
      const mCat = !others.length || others.some(c => {
        const itemCats = i.category || i.categories || [];
        return Array.isArray(itemCats) ? itemCats.includes(c) : itemCats === c;
      });

      if (tab === 'objections' && currentSel.includes('Seçtiklerim')) {
        return matches && (favs.includes(i.id) || (others.length && mCat));
      }
      return matches && mCat;
    }
    return matches;
  }), [data, term, selCats, favs, tab]);

  return (
    <PageLayout innerStyle={{ padding: 0 }}>
      {/* HEADER */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}>
        <div style={{ padding: '1rem 1rem 0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* 1. TOP: MEGA TOGGLE */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <MegaToggle
              options={TABS}
              activeId={tab}
              onChange={(id) => setTab(id)}
            />
          </div>

          {/* 2. MIDDLE: SEARCH BAR */}
          {(tab !== 'news' && tab !== 'hashtags') && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '48px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                <input value={term} onChange={e => setTerm(e.target.value)} placeholder={`${cur?.label || ''} içinde ara...`} style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '0 3.2rem 0 2.8rem', color: '#fff', outline: 'none' }} />
                {(tab !== 'feed' && tab !== 'news') && (
                  <button onClick={() => setIsCatsOpen(!isCatsOpen)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, background: isCatsOpen ? '#fff' : 'transparent', borderRadius: 8, color: isCatsOpen ? '#000' : '#fff', border: 'none', transition: '0.3s' }}><ChevronDown size={14} style={{ transform: isCatsOpen ? 'rotate(180deg)' : '' }} /></button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* KATEGORİ BAR */}
        <AnimatePresence>
          {isCatsOpen && (tab !== 'feed' && tab !== 'news' && tab !== 'hashtags') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', padding: '0.4rem 1.2rem 1rem 1.2rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}
            >
              {allCats.map(c => (
                <FilterChip
                  key={c}
                  label={c}
                  active={(selCats[tab] || []).includes(c)}
                  color="#fff"
                  onClick={() => setSelCats(p => {
                    const list = p[tab] || [];
                    const newList = list.includes(c) ? list.filter(x => x !== c) : [...list, c];
                    return { ...p, [tab]: newList };
                  })}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '1rem 1.2rem', maxWidth: '800px', margin: '0 auto' }}>
        {loading ? <Loading /> : (
          tab === 'hashtags' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                'emlak', 'gayrimenkul', 'kiralik', 'satilik', 'yatirim', 
                'arsa', 'konut', 'luks', 'ticari', 'remax', 
                'danisman', 'pazarlama', 'strateji', 'daire', 'villa'
              ].map((tag, i) => (
                <div key={tag} style={{ width: '100%' }}>
                  {cur.renderItem({ etiket: tag }, i, { favs, setFavs })}
                </div>
              ))}
            </div>
          ) : tab === 'feed' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%' }}>
              {filtered.slice(0, visibleCount).map((item, i) => (
                <GlassCard key={item.id || i} padding="0" borderRadius="16px" style={{ overflow: 'hidden', height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ position: 'relative', paddingTop: '177.77%', background: '#000' }}>
                    <iframe
                      src={item.embed_url}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      title={item.title}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: '0.8rem' }}>
                    <h4 style={{ fontSize: '0.7rem', fontWeight: '600', color: '#fff', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2rem' }}>{item.title}</h4>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', opacity: 0.5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem' }}>
                        <Heart size={12} /> {item.likes || 0}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem' }}>
                        <MessageCircle size={12} /> {item.comments || 0}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
              {/* Infinite Scroll Sentinel */}
              {visibleCount < filtered.length && (
                <div 
                  ref={(el) => { 
                    if (el) { 
                      const observer = new IntersectionObserver((entries) => { 
                        if (entries[0].isIntersecting) { 
                          setVisibleCount(prev => prev + 10); 
                        } 
                      }, { threshold: 0.1 }); 
                      observer.observe(el); 
                    } 
                  }} 
                  style={{ height: '20px', gridColumn: 'span 2' }} 
                />
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {filtered.map((item, i) => (
                <div key={item.id || i} style={{ marginBottom: '1.2rem' }}>
                  {cur?.renderItem ? cur.renderItem(item, i, { favs, setFavs }) : null}
                  {(i + 1) % 8 === 0 && <div style={{ marginTop: '2rem' }}><ValuationForm /></div>}
                </div>
              ))}
            </div>
          )
        )}
        {!loading && filtered.length === 0 && <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.2 }}><Zap size={40} /><p>Sonuç bulunamadı.</p></div>}
      </div>
    </PageLayout>
  );
}
