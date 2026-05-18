import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, LayoutGrid, Newspaper, Zap, Hash, Heart, MessageCircle, Copy, Check } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from '../../components/ortak/Icons';
import { GlassCard, PageLayout, FilterChip, MegaToggle, Loading, AuthGuard, MegaInput, MegaButton } from '../../components/ortak';
import useLibrary from '../../hooks/useLibrary';

const NewsCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard padding="1.2rem" borderRadius="18px" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--color-accent)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
            {item.category?.toUpperCase() || 'HABER'}
          </span>
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', lineHeight: '1.4', color: '#fff', margin: '0' }}>
          {item.title}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', fontWeight: '500', margin: '0' }}>
          {item.summary}
        </p>

        {item.script && (
          <div style={{ marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.6rem' }}>
            <button 
              onClick={() => setExpanded(!expanded)} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', opacity: 0.8, padding: 0 }}
            >
              VİDEO SENARYOSU <ChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : '', transition: '0.3s' }} />
            </button>
            
            <AnimatePresence>
              {expanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', marginTop: '0.6rem', position: 'relative' }}>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: '0 0 2.5rem 0', whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
                      "{item.script}"
                    </p>
                    <button 
                      onClick={handleCopy} 
                      style={{ 
                        position: 'absolute', bottom: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '6px', 
                        padding: '6px 12px', background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)', 
                        border: copied ? '1px solid #4ADE80' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', 
                        color: copied ? '#4ADE80' : '#fff', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', transition: '0.3s' 
                      }}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'KOPYALANDI' : 'SENARYOYU KOPYALA'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

const ObjectionCard = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard padding="1.2rem" borderRadius="18px" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {(item.categories || []).map(cat => (
            <span key={cat} style={{ fontSize: '0.6rem', fontWeight: '900', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>
              #{cat.toUpperCase()}
            </span>
          ))}
        </div>

        <div style={{ margin: '0.4rem 0', paddingLeft: '0.75rem', borderLeft: '3px solid #ff4d4d' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', margin: 0 }}>
            "{item.text}"
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1rem', position: 'relative' }}>
          <span style={{ fontSize: '0.55rem', fontWeight: '900', color: 'var(--color-accent)', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>ÖNERİLEN SAVUNMA / CEVAP</span>
          <p style={{ fontSize: '0.82rem', color: '#fff', lineHeight: '1.5', margin: '0 0 2.5rem 0', fontWeight: '500' }}>
            {item.answer}
          </p>
          <button 
            onClick={handleCopy} 
            style={{ 
              position: 'absolute', bottom: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '6px', 
              padding: '6px 12px', background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)', 
              border: copied ? '1px solid #4ADE80' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', 
              color: copied ? '#4ADE80' : '#fff', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', transition: '0.3s' 
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'KOPYALANDI' : 'CEVABI KOPYALA'}
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

const FeedItem = ({ item, i }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef(null);

  const handlePlayPause = () => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    if (isPlaying) {
      iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      setIsPlaying(false);
    } else {
      iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setIsPlaying(true);
    }
  };

  const embedUrl = `${item.embed_url}?enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&disablekb=1`;

  return (
    <GlassCard padding="0" borderRadius="16px" style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
      <div style={iframeContainer}>
        <iframe 
          ref={iframeRef}
          src={embedUrl} 
          style={iframeStyle} 
          loading="lazy" 
        />
        <div 
          onClick={handlePlayPause}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            cursor: 'pointer',
          }}
        />
      </div>
      <div style={{ padding: '0.8rem' }}>
        <h4 style={feedTitleStyle}>{item.title}</h4>
        <div style={feedMetaStyle}>
          <Heart size={12} /> {item.likes || 0} 
          <MessageCircle size={12} style={{ marginLeft: 8 }} /> {item.comments || 0}
        </div>
      </div>
    </GlassCard>
  );
};

export default function Library({ tabOverride }) {
  const h = useLibrary(tabOverride);
  const activeTab = h.tab;
  const TABS = [{ id: 'feed', label: 'AKIŞ', icon: <LayoutGrid size={18} /> }, { id: 'hashtags', label: 'HASHTAGLER', icon: <Hash size={18} /> }, { id: 'news', label: 'HABERLER', icon: <Newspaper size={18} /> }, { id: 'objections', label: 'İTİRAZLAR', icon: <Zap size={18} /> }];

  const renderHashtag = (tag) => (
    <GlassCard key={tag} padding="1rem 1.5rem" borderRadius="20px">
      <div style={flexBetStyle}>
        <span style={tagStyle}>#{tag}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ id: 'ig', icon: <InstagramIcon size={16} />, url: `https://instagram.com/explore/search/keyword/?q=%23${tag}` }, { id: 'yt', icon: <YoutubeIcon size={18} />, url: `https://youtube.com/hashtag/${tag}` }, { id: 'li', icon: <LinkedinIcon size={16} />, url: `https://linkedin.com/search/results/all/?keywords=%23${tag}` }].map(s => (
            <button key={s.id} onClick={() => window.open(s.url, '_blank')} style={iconBtnStyle}>{s.icon}</button>
          ))}
        </div>
      </div>
    </GlassCard>
  );

  return (
    <PageLayout innerStyle={{ padding: 0 }}>
      <div style={stickyHeader}>
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MegaToggle options={TABS} activeId={activeTab} onChange={h.setTab} />
          {!['news', 'hashtags'].includes(activeTab) && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
              <div style={{ flex: 1 }}>
                <MegaInput 
                  icon={Search} 
                  value={h.term} 
                  onChange={e => h.setTerm(e.target.value)} 
                  placeholder="Ara..." 
                />
              </div>
              {['sss', 'objections'].includes(activeTab) && (
                <button 
                  onClick={() => h.setIsCatsOpen(!h.isCatsOpen)} 
                  style={{
                    background: h.isCatsOpen ? '#fff' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: h.isCatsOpen ? '#000' : '#fff',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flexShrink: 0
                  }}
                >
                  <ChevronDown size={18} style={{ transform: h.isCatsOpen ? 'rotate(180deg)' : '', transition: 'all 0.3s ease' }} />
                </button>
              )}
            </div>
          )}
        </div>
        <AnimatePresence>{h.isCatsOpen && !['feed', 'news', 'hashtags'].includes(activeTab) && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={catWrap}>
            {h.allCats.map(c => <FilterChip key={c} label={c} active={(h.selCats[activeTab] || []).includes(c)} onClick={() => h.setSelCats(p => ({ ...p, [activeTab]: (p[activeTab] || []).includes(c) ? p[activeTab].filter(x => x !== c) : [...(p[activeTab] || []), c] }))} />)}
          </motion.div>
        )}</AnimatePresence>
      </div>

      <div style={contentWrap}>
        {h.loading ? <Loading /> : activeTab === 'hashtags' ? (
          <div style={listStyle}>
            {[
              'emlak', 'gayrimenkul', 'satilikdaire', 'kiralikdaire', 'satilikvilla', 
              'ticarigayrimenkul', 'imarliarsa', 'yatirimliktarla', 'luksresidence', 
              'evturu', 'gayrimenkuldanismani', 'remax', 'denizmanzarali', 'mustakilev', 
              'yatirimfirsati', 'konutprojesi', 'tapu', 'kentseldonusum', 'ekspertiz', 
              'konutkredisi', 'bodrumyazlik', 'portfoy', 'plazakiralik', 'hobibahcesi', 
              'emlakofisi', 'luxurylifestyle', 'gayrimenkuldegerleme', 'remaxsocial'
            ].map(renderHashtag)}
          </div>
        ) : (
          <div style={activeTab === 'feed' ? gridStyle : listStyle}>
            {activeTab === 'feed' && h.filtered.slice(0, h.visibleCount).map((item, i) => <FeedItem key={item.id || i} item={item} i={i} />)}
            {activeTab === 'news' && (
              <AuthGuard>
                {h.filtered.slice(0, h.visibleCount).map((item, i) => <NewsCard key={item.id || i} item={item} />)}
              </AuthGuard>
            )}
            {activeTab === 'objections' && (
              <AuthGuard>
                {h.filtered.slice(0, h.visibleCount).map((item, i) => <ObjectionCard key={item.id || i} item={item} />)}
              </AuthGuard>
            )}
          </div>
        )}

        {/* Load More or Completion Status */}
        {!h.loading && activeTab !== 'hashtags' && h.filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
            {h.filtered.length > h.visibleCount ? (
              <MegaButton 
                onClick={() => h.setVisibleCount(p => p + 10)} 
                style={{ maxWidth: '220px' }}
              >
                Daha Fazla Yükle
              </MegaButton>
            ) : (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '8px 16px',
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '0.78rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>Tüm içerikler başarıyla yüklendi</span>
                <span>🌟</span>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

const stickyHeader = { position: 'sticky', top: 0, zIndex: 10, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' };
const catWrap = { overflow: 'hidden', padding: '0 1.2rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem' };
const contentWrap = { padding: '1rem', maxWidth: '800px', margin: '0 auto' };
const flexBetStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' };
const tagStyle = { fontSize: '0.8rem', fontWeight: '600', color: '#fff', opacity: 0.7 };
const iconBtnStyle = { 
  width: '36px', 
  height: '36px', 
  background: 'transparent', 
  border: 'none', 
  color: '#fff', 
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  flexShrink: 0
};
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' };
const listStyle = { display: 'flex', flexDirection: 'column', gap: '0.8rem' };
const iframeContainer = { position: 'relative', paddingTop: '177.77%', background: '#000' };
const iframeStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' };
const feedTitleStyle = { fontSize: '0.7rem', fontWeight: '600', color: '#fff', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' };
const feedMetaStyle = { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', opacity: 0.5, marginTop: 4 };
