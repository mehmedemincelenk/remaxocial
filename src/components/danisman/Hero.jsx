import { motion } from 'framer-motion';

const Hero = ({ videoUrl, name, title }) => (
  <section style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '2rem' }}>
    <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
      <source src={videoUrl} type="video/mp4" />
    </video>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)' }} />
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 2, width: '100%' }}>
      <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '0.5rem', lineHeight: 1, letterSpacing: '-1px' }}>{name}</h1>
      <p style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase' }}>{title}</p>
      <div style={{ marginTop: '2rem', height: '1px', width: '60px', background: 'linear-gradient(to right, #4ade80, transparent)' }} />
    </motion.div>
  </section>
);

export default Hero;
