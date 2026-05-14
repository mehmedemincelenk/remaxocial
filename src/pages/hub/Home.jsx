import { useState, useEffect, useMemo } from 'react';
import { Book, Cpu, Lightbulb, ChevronDown, ChevronUp, Trophy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../../components/ortak/Loading';
import GlassCard from '../../components/ortak/GlassCard';
import PageLayout from '../../components/ortak/PageLayout';
import useSupabase from '../../hooks/useSupabase';
import useLocalStorage from '../../hooks/useLocalStorage';

const Home = () => {
  const [content, setContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const { data: tasks, loading: loadingTasks } = useSupabase('tasks');
  const [doneTasks, setDoneTasks] = useLocalStorage('lib_tasks_done', {});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/data/academy_content.json?t=${Date.now()}`);
        const data = await res.json();
        setContent(data[(new Date().getDate() - 1) % data.length]);
      } catch (e) { console.error(e); }
      setLoadingContent(false);
    })();
  }, []);

  const dailyTask = useMemo(() => {
    if (!tasks || tasks.length === 0) return null;
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return tasks[dayOfYear % tasks.length];
  }, [tasks]);

  const isDone = dailyTask && doneTasks[new Date().toLocaleDateString()] === dailyTask.id;

  const handleComplete = () => {
    const today = new Date().toLocaleDateString();
    setDoneTasks({ ...doneTasks, [today]: dailyTask.id });
  };

  if (loadingContent || loadingTasks || !content) return <Loading />;

  const sections = [
    { id: 'term', badge: 'TERİM', title: content.terim, icon: <Book size={12} />, accent: 'var(--color-blue)', body: content.terim_anlam, note: content.terim_uzman_notu },
    { id: 'ai', badge: 'YAPAY ZEKA', title: content.ai_baslik, icon: <Cpu size={12} />, accent: 'var(--color-accent)', body: content.ai_metod },
    { id: 'digital', badge: 'DİJİTAL UZMAN NOTU', title: content.dijital_uzman_notu_baslik, icon: <Lightbulb size={12} />, accent: 'var(--color-orange)', body: content.dijital_uzman_notu_icerik }
  ];

  return (
    <PageLayout padding="0.75rem" innerStyle={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {sections.map(sec => <HomeCard key={sec.id} {...sec} />)}

      {dailyTask && (
        <HomeCard 
          badge="GÜNÜN GÖREVİ" 
          title={dailyTask.title} 
          icon={<Trophy size={12} />} 
          accent="#ED1C24" 
          body={dailyTask.description} 
          note={dailyTask.note}
          isTask={true}
          isDone={isDone}
          onComplete={handleComplete}
        />
      )}
    </PageLayout>
  );
};

const HomeCard = ({ badge, title, icon, accent, body, note, isTask, isDone, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GlassCard 
      onClick={() => setIsOpen(!isOpen)}
      padding="0.75rem"
      borderRadius="10px"
      style={{ 
        border: `1px solid ${isOpen ? `color-mix(in srgb, ${accent} 60%, transparent)` : (isDone ? 'rgba(237, 28, 36, 0.3)' : 'var(--color-border)')}`, 
        cursor: 'pointer',
        transition: '0.3s'
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: accent, marginBottom: '0.3rem' }}>
        {isDone ? <CheckCircle2 size={12} /> : icon} 
        <span style={{ color: accent, fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.05em' }}>{isDone ? 'TAMAMLANDI' : badge}</span>
      </header>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.5 : 1, lineHeight: '1.2' }}>{title}</h2>
        <div style={{ color: 'rgba(255,255,255,0.2)' }}>{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p className="text-body" style={{ margin: 0 }}>{body}</p>
              {note && (
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: `3px solid ${accent}`, fontSize: '0.85rem', color: '#fff', fontStyle: 'italic' }}>
                  💡 {note}
                </div>
              )}
              
              {isTask && !isDone && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onComplete(); }}
                  style={{ 
                    marginTop: '0.5rem', width: '100%', height: '48px', borderRadius: '16px', border: 'none', 
                    background: '#ED1C24', color: '#fff', fontWeight: '800', fontSize: '0.9rem', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' 
                  }}
                >
                  <CheckCircle2 size={18} /> YAPTIM
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

export default Home;
