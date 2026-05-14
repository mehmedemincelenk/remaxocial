import { Eye, Heart, MessageSquare } from 'lucide-react';

const Metric = ({ Icon, value, color = '#fff' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color }}>
    <Icon size={10} />
    <span className="text-badge" style={{ color: '#fff', opacity: 0.8 }}>{value}</span>
  </div>
);

const ContentCard = ({ item, onClick }) => {
  const isYoutube = item.link?.includes('youtube.com');
  const isInstagram = item.link?.includes('instagram.com');
  const thumbUrl = (isInstagram && !item.thumbnail?.includes('img.youtube.com')) ? null : (item.thumbnail || (isYoutube ? `https://img.youtube.com/vi/${item.id}/maxresdefault.jpg` : null));

  const cardClass = thumbUrl ? 'card card-tall' : 'card card-short';

  const METRICS = [
    { icon: Eye, val: item.izlenme },
    { icon: Heart, val: item.begeni, color: 'var(--color-red)' },
    { icon: MessageSquare, val: item.yorum || 0 }
  ];

  return (
    <div className={cardClass} onClick={() => onClick(item)}>
      {thumbUrl && (
        <div style={{ flex: 1, width: '100%', overflow: 'hidden', borderBottom: '1px solid var(--color-border)', background: '#000' }}>
          <img src={thumbUrl} alt={item.baslik} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
        </div>
      )}
      <div className="card-body" style={{
        padding: thumbUrl ? '0.75rem' : '0.6rem 0.85rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 'none', width: '100%', minHeight: thumbUrl ? 'auto' : '100%'
      }}>
        <h3 className="text-title" style={{
          fontSize: thumbUrl ? '0.75rem' : '0.82rem', lineHeight: '1.35', margin: '0 0 0.5rem 0',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: 'left', maxHeight: '4.1em'
        }}>
          {item.baslik}
        </h3>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-glass)',
          padding: '0.25rem 0.45rem', borderRadius: '6px', border: '1px solid var(--color-border)', gap: '0.4rem', marginTop: 'auto'
        }}>
          {METRICS.map((m, i) => <Metric key={i} Icon={m.icon} value={m.val} color={m.color} />)}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
