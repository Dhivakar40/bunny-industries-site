import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

// ── Rendering helper: turns the stored richtext string (with
// literal <strong> tags) back into JSX with dangerouslySetInnerHTML.
// This is safe because the content is owned/authored internally —
// it never comes from untrusted user input. ──────────────────────
const RichText = ({ html, style }) => (
  <span dangerouslySetInnerHTML={{ __html: html }} style={style} />
);

// ── Animation variants ────────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function About() {
  const { about, theme } = useContent();

  return (
    <section
      id="about"
      style={{
        padding: '100px 20px',
        backgroundColor: '#0F1115',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Grid Accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '400px', height: '400px',
        background: `radial-gradient(circle, ${theme.accentPrimary}0D 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* --- TOP SECTION: INTRO --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center', marginBottom: '80px' }}>

          {/* LEFT SIDE: Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span style={{ color: theme.accentPrimary, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '1.2rem', display: 'block', marginBottom: '1rem', fontWeight: '600' }}>
              {about.eyebrow}
            </span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: '"Oswald", sans-serif', textTransform: 'uppercase', lineHeight: '1.1', marginBottom: '1.5rem' }}>
              {about.heading}
            </h2>
            <p style={{ color: '#B0B0B0', lineHeight: '2.0', fontSize: '1.1rem', marginBottom: '1rem' }}>
              <RichText html={about.paragraph1} />
            </p>
            <p style={{ color: '#B0B0B0', lineHeight: '2.0', fontSize: '1.1rem', marginBottom: '2rem' }}>
              <RichText html={about.paragraph2} />
            </p>
          </motion.div>

          {/* RIGHT SIDE: Mission/Vision/Values Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{ display: 'grid', gap: '20px' }}
          >
            {about.cards.map((card) => (
              <motion.div
                key={card.title}
                variants={cardVariant}
                whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderLeftWidth: '8px' }}
                transition={{ duration: 0.3 }}
                style={{
                  padding: '25px',
                  background: 'rgba(255,255,255,0.02)',
                  borderLeftColor: theme.accentPrimary,
                  borderLeftStyle: 'solid',
                  borderLeftWidth: '3px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <h3 style={{ fontFamily: '"Oswald", sans-serif', color: '#FFF', margin: '0 0 5px 0', letterSpacing: '0.05em' }}>
                  {card.title}
                </h3>
                <p style={{ color: '#AAA', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {card.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* --- QUALITY POLICY BANNER --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(90deg, #1A1A1A, #0F1115)',
            padding: '50px 20px',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '80px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}
        >
          <h3 style={{ fontFamily: '"Oswald", sans-serif', fontSize: '1.5rem', color: theme.accentPrimary, marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {about.qualityBannerHeading}
          </h3>
          <p style={{ color: '#EAEAEA', fontSize: '1.15rem', fontStyle: 'italic', maxWidth: '900px', margin: '0 auto', lineHeight: '1.8' }}>
            <RichText html={about.qualityBannerBody} />
          </p>
        </motion.div>
      </div>
    </section>
  );
}