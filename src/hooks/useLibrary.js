import { useState, useMemo } from 'react';
import useSupabase from './useSupabase';
import useLocalStorage from './useLocalStorage';
import sssData from '../data/diamond_qa_master.json';
import objectionsData from '../data/itirazlar.json';
import newsData from '../api/news.json';
import feedData from '../data/feeds/shorts_detailed_full_premium.json';

export default function useLibrary(activeTabOverride) {
  const [localTab, setLocalTab] = useState('feed');
  const tab = activeTabOverride || localTab;
  const setTab = setLocalTab;

  const [term, setTerm] = useState('');
  const [isCatsOpen, setIsCatsOpen] = useState(false);
  const [selCats, setSelCats] = useState({ feed: [], sss: [], objections: ['Seçtiklerim'] });
  const [favs, setFavs] = useLocalStorage('lib_favs', []);
  const [visibleCount, setVisibleCount] = useState(10);

  const curTable = tab === 'objections' ? 'objections' : null;
  const { data: supabaseData, loading } = useSupabase(curTable);

  const [shuffledFeed] = useState(() => {
    return [...feedData].sort(() => Math.random() - 0.5);
  });

  const data = useMemo(() => {
    if (tab === 'sss') return [...(supabaseData || []), ...sssData];
    if (tab === 'objections') return objectionsData;
    if (tab === 'news') return newsData;
    if (tab === 'feed') {
      return shuffledFeed;
    }
    return supabaseData || [];
  }, [supabaseData, tab, shuffledFeed]);

  const allCats = useMemo(() => {
    const raw = (tab === 'sss' || tab === 'objections' || tab === 'news')
      ? [...new Set(data.flatMap(i => Array.isArray(i.category || i.categories) ? (i.category || i.categories) : (i.category ? [i.category] : [])))]
      : [];
    const currentSel = selCats[tab] || [];
    return [...new Set([...currentSel, ...raw])].sort((a, b) => currentSel.includes(b) - currentSel.includes(a));
  }, [data, tab, selCats]);

  const filtered = useMemo(() => data.filter(i => {
    const matches = (i.baslik || i.question || i.text || i.title || '').toLowerCase().includes(term.toLowerCase());
    const currentSel = selCats[tab] || [];
    if (['sss', 'objections'].includes(tab)) {
      const others = currentSel.filter(c => c !== 'Seçtiklerim');
      const mCat = !others.length || others.some(c => (i.category || i.categories || []).includes(c));
      return tab === 'objections' && currentSel.includes('Seçtiklerim') ? matches && (favs.includes(i.id) || (others.length && mCat)) : matches && mCat;
    }
    return matches;
  }), [data, term, selCats, favs, tab]);

  return { tab, setTab, term, setTerm, isCatsOpen, setIsCatsOpen, selCats, setSelCats, favs, setFavs, visibleCount, setVisibleCount, filtered, allCats, loading };
}
