import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';

// ── Shrunken cert (click to open PDF) ────────────────────────
const ShrunkenCertLogo = ({ cert, index, onClick }) => (
  <motion.div
    initial="initial"
    whileInView="inView"
    whileHover="hover"
    viewport={{ once: true }}
    variants={{
      initial: { opacity: 0, y: 30 },
      inView: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] } }
    }}
    onClick={onClick}
    style={{
      position: 'relative', padding: '2rem 1.5rem', color: '#FFFFFF', fontFamily: 'inherit',
      cursor: 'pointer', background: 'rgba(255,255,255,0.02)', textAlign: 'center',
      minWidth: '240px', maxWidth: '280px', borderRadius: '16px', overflow: 'visible'
    }}
  >
    <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', zIndex: 0 }} />

    <motion.div
      animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute', inset: -1,
        background: `linear-gradient(90deg, transparent, transparent 30%, ${cert.color}, transparent 70%, transparent)`,
        backgroundSize: '200% 100%',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor', maskComposite: 'exclude',
        padding: '1px', borderRadius: '16px', opacity: 0.5, zIndex: 1, pointerEvents: 'none'
      }}
    />

    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div
        variants={{
          initial: { scale: 1, filter: "brightness(1) drop-shadow(0 0 0px transparent)" },
          hover: { scale: 1.1, filter: `brightness(1.1) drop-shadow(0 0 15px ${cert.color}60)` }
        }}
        transition={{ duration: 0.4 }}
        style={{
          width: '90px', height: '90px', marginBottom: '1.25rem', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `radial-gradient(circle at center, ${cert.color}20 0%, transparent 70%)`, borderRadius: '50%'
        }}
      >
        <img src={cert.img} alt={cert.text} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.5))' }} />
      </motion.div>

      <motion.h3
        variants={{ initial: { color: '#FFFFFF' }, hover: { color: cert.color, textShadow: `0 0 20px ${cert.color}40` } }}
        transition={{ duration: 0.3 }}
        style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.05em', margin: '0 0 0.5rem 0' }}
      >
        {cert.text}
      </motion.h3>

      <p style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: 0 }}>
        {cert.desc}
      </p>

      <motion.div
        variants={{ initial: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.2 }}
        style={{
          marginTop: '1rem', fontSize: '0.8rem', fontWeight: '700', color: cert.color,
          textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.05)',
          padding: '6px 12px', borderRadius: '20px', border: `1px solid ${cert.color}40`,
          boxShadow: `0 0 10px ${cert.color}20`
        }}
      >
        click to view
      </motion.div>
    </div>
  </motion.div>
);

// ── Display-only cert logo ────────────────────────────────────
const CertLogo = ({ cert, index }) => (
  <motion.div
    initial="initial"
    whileInView="inView"
    whileHover="hover"
    viewport={{ once: true }}
    variants={{
      initial: { opacity: 0, y: 30 },
      inView: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] } }
    }}
    style={{
      position: 'relative', padding: '3rem 2rem', color: '#FFFFFF', fontFamily: 'inherit',
      cursor: 'pointer', background: 'rgba(255,255,255,0.02)', textAlign: 'center',
      minWidth: '280px', borderRadius: '16px', overflow: 'visible'
    }}
  >
    <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', zIndex: 0 }} />

    <motion.div
      animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute', inset: -1,
        background: `linear-gradient(90deg, transparent, transparent 30%, ${cert.color}, transparent 70%, transparent)`,
        backgroundSize: '200% 100%',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor', maskComposite: 'exclude',
        padding: '1px', borderRadius: '16px', opacity: 0.5, zIndex: 1, pointerEvents: 'none'
      }}
    />

    <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div
        variants={{
          initial: { scale: 1, filter: "brightness(1) drop-shadow(0 0 0px transparent)" },
          hover: { scale: 1.1, filter: `brightness(1.1) drop-shadow(0 0 15px ${cert.color}60)` }
        }}
        transition={{ duration: 0.4 }}
        style={{
          width: '120px', height: '120px', marginBottom: '1.5rem', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `radial-gradient(circle at center, ${cert.color}20 0%, transparent 70%)`, borderRadius: '50%'
        }}
      >
        <img src={cert.img} alt={cert.text} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.5))' }} />
      </motion.div>

      <motion.h3
        variants={{ initial: { color: '#FFFFFF' }, hover: { color: cert.color, textShadow: `0 0 20px ${cert.color}40` } }}
        transition={{ duration: 0.3 }}
        style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '0.05em', margin: '0 0 0.5rem 0' }}
      >
        {cert.text}
      </motion.h3>

      <p style={{ fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: 0 }}>
        {cert.desc}
      </p>
    </div>
  </motion.div>
);

// ── Main Component ────────────────────────────────────────────
export default function Certifications() {
  const { certifications: certs, theme } = useContent();
  const [selectedPdf, setSelectedPdf] = useState(null);

  return (
    <section
      id="certifications"
      style={{
        backgroundColor: '#0A0F1C', padding: '120px 0',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        position: 'relative', overflow: 'hidden'
      }}
    >
      {/* Background Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '80px 80px', opacity: 0.4
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>

        {/* --- HEADER --- */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.85rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: '600' }}
          >
            {certs.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '700', letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}
          >
            {certs.heading}
          </motion.h2>
          <div style={{ width: '100px', height: '3px', background: 'rgba(255,255,255,0.1)', margin: '2rem auto', position: 'relative', overflow: 'hidden' }}>
            <motion.div
              animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, #FFFFFF, transparent)' }}
            />
          </div>
        </div>

        {/* --- LOGOS GRID --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
          {/* Row 1 — display-only certs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', width: '100%', maxWidth: '800px' }}>
            {certs.certifications.map((cert, index) => (
              <CertLogo key={index} cert={cert} index={index} />
            ))}
          </div>

          {/* Row 2 — click-to-open PDF certs (2 cards) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', width: '100%', maxWidth: '800px' }}>
            {certs.newCertificates.map((cert, index) => (
              <ShrunkenCertLogo key={index} cert={cert} index={index} onClick={() => setSelectedPdf(cert)} />
            ))}
          </div>
        </div>

        {/* --- PDF VIEWING MODAL --- */}
        <AnimatePresence>
          {selectedPdf && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
                zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
              }}
              onClick={() => setSelectedPdf(null)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                  backgroundColor: '#15161A', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', width: '90%', maxWidth: '1000px', height: '85vh',
                  display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 style={{ fontFamily: '"Oswald", sans-serif', color: '#FFF', fontSize: '1.5rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {selectedPdf.text}
                  </h3>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <a
                      href={selectedPdf.pdf} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.target.style.color = '#FFF'; e.target.style.borderColor = '#FFF'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
                      onMouseOut={(e) => { e.target.style.color = '#aaa'; e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.02)'; }}
                    >
                      Open in New Tab
                    </a>
                    <button
                      onClick={() => setSelectedPdf(null)}
                      style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer', transition: 'color 0.2s', padding: '5px' }}
                      onMouseOver={(e) => e.target.style.color = '#FFF'}
                      onMouseOut={(e) => e.target.style.color = '#888'}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div style={{ flex: 1, width: '100%', height: '100%', background: '#2E3138' }}>
                  <iframe src={`${selectedPdf.pdf}#toolbar=0`} width="100%" height="100%" style={{ border: 'none' }} title={selectedPdf.text} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- QUALITY COMMITMENT SECTION --- */}
        <div style={{ marginTop: '120px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 60px auto' }}
          >
            <h3 style={{ fontFamily: '"Oswald", sans-serif', fontSize: '2.5rem', color: '#FFF', marginBottom: '20px' }}>
              {certs.qualityHeading}
            </h3>
            <p style={{ color: '#AAA', fontSize: '1.1rem', lineHeight: '1.6' }}>
              {certs.qualityBody}
            </p>
          </motion.div>

          {/* Quality Focus Points Grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {certs.qualityFocusPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                  padding: '30px', borderRadius: '12px',
                  borderLeft: `3px solid ${i % 2 === 0 ? theme.accentGlow : theme.accentGold}`,
                  flex: '1 1 300px', maxWidth: '360px'
                }}
              >
                <div style={{ fontFamily: '"Oswald", sans-serif', fontSize: '1.2rem', color: '#FFF', marginBottom: '10px', letterSpacing: '0.05em' }}>
                  {point.title}
                </div>
                <p style={{ margin: 0, color: '#888', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {point.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}