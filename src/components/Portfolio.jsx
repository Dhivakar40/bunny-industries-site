import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';

const DEFAULT_QA_INSTRUMENTS = [
  {
    name: "Carl Zeiss CMM",
    desc: "3D Coordinate Measuring Machine for GD&T verification, profile analysis & 3D coordinate checks."
  },
  {
    name: "ATQ VMM",
    desc: "Optical Video Measuring Machine for non-contact 2D micro-geometry, pitch, and profile inspection."
  },
  {
    name: "Tesa Height Master",
    desc: "Ultra-precise digital height gauge system for reliable height, step, and flatness dimensioning."
  },
  {
    name: "Standard Metrology",
    desc: "Comprehensive range of calibrated bore gauges, slip gauge sets, pin gauges, micrometers & verniers."
  }
];

export default function Portfolio() {
  const { portfolio, theme } = useContent();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1100);
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const instruments = portfolio.qaInstruments && portfolio.qaInstruments.length > 0
    ? portfolio.qaInstruments
    : DEFAULT_QA_INSTRUMENTS;

  const qaSubtitle = portfolio.qaSubtitle || "Zero-Defect Quality Discipline Backed by Advanced Measurement Systems";
  const visibleMachines = portfolio.machines || [];

  return (
    <section
      id="infrastructure"
      style={{ backgroundColor: '#0F1115', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background Subtle Grid Pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '70px 70px', opacity: 0.5, pointerEvents: 'none'
      }} />

      {/* --- HEADER --- */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '100px 20px 40px', position: 'relative', zIndex: 1 }}>
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: '5rem' }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ display: 'block', height: '3px', background: '#FFFFFF', marginBottom: '2rem' }}
        />
        <h2 style={{
          fontSize: 'clamp(3rem, 5vw, 5rem)',
          fontFamily: '"Oswald", sans-serif',
          textTransform: 'uppercase',
          lineHeight: '1',
          margin: 0,
          letterSpacing: '0.02em'
        }}>
          {portfolio.heading || 'INFRASTRUCTURE'}
        </h2>

        {qaSubtitle && (
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1.15rem, 2.2vw, 1.6rem)',
              fontFamily: '"Oswald", sans-serif',
              fontStyle: 'italic',
              fontWeight: '500',
              color: '#D4AF37',
              letterSpacing: '0.03em',
              marginTop: '22px',
              marginBottom: '14px',
              lineHeight: 1.3
            }}
          >
            {qaSubtitle}
          </motion.h3>
        )}

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            maxWidth: '1000px',
            marginTop: '10px',
            color: '#A8B3BF',
            fontSize: '1.05rem',
            lineHeight: '1.7',
            fontFamily: '"Manrope", sans-serif'
          }}
        >
          {portfolio.subtext}
        </motion.p>
      </div>

      {/* --- METROLOGY & QA INSTRUMENTS CARDS --- */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(270px, 1fr))',
        gap: '24px',
        padding: '0 20px',
        maxWidth: '1400px',
        margin: '10px auto 80px',
        position: 'relative',
        zIndex: 1
      }}>
        {instruments.map((item, i) => (
          <motion.div
            key={item.name || i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6, borderColor: 'rgba(107, 155, 208, 0.4)', boxShadow: '0 16px 35px rgba(0,0,0,0.6)' }}
            style={{
              background: 'linear-gradient(150deg, #171C26 0%, #0D1017 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '30px 26px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Top Cyan/Blue Accent Line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '3px',
              background: `linear-gradient(90deg, ${theme.accentPrimary || '#6B9BD0'}, ${theme.accentGlow || '#00ffcc'})`
            }} />

            <h4 style={{
              fontFamily: '"Oswald", sans-serif',
              fontSize: '1.45rem',
              color: '#FFFFFF',
              letterSpacing: '0.03em',
              margin: '0 0 14px 0',
              fontWeight: '700'
            }}>
              {item.name}
            </h4>

            <p style={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: '0.95rem',
              color: '#9EABB8',
              lineHeight: '1.65',
              margin: 0
            }}>
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* --- MACHINE INFRASTRUCTURE SUBSECTION --- */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 120px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <span style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15))' }}></span>
          <h3 style={{
            fontFamily: '"Oswald", sans-serif', fontSize: '2rem', textAlign: 'center',
            margin: 0, color: '#FFF', letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>
            {portfolio.infraHeading || 'MACHINE INFRASTRUCTURE'}
          </h3>
          <span style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.15))' }}></span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'repeat(4, 1fr)',
          gap: '30px'
        }}>
          <AnimatePresence initial={false}>
            {visibleMachines.map((cat) => (
              <motion.div
                layout
                key={cat.category}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                style={{
                  background: 'linear-gradient(145deg, #1A1A1A 0%, #0F1115 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px', position: 'relative', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                {/* Top Accent Line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
                  background: `linear-gradient(90deg, ${theme.accentGlow || '#00ffcc'}, transparent)`, zIndex: 10
                }} />

                {/* IMAGE BANNER */}
                <img
                  src={cat.img}
                  alt={cat.category}
                  onError={(e) => { e.target.style.display = 'none'; }}
                  style={{
                    width: '100%', height: '180px', objectFit: 'cover', objectPosition: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.05)', filter: 'brightness(0.95)'
                  }}
                />

                {/* CONTENT WRAPPER */}
                <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'flex-start' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ color: '#FFFFFF', margin: 0, fontFamily: '"Oswald", sans-serif', fontSize: '1.2rem', letterSpacing: '0.05em' }}>
                      {cat.category}
                    </h4>
                    <span style={{
                      background: `${theme.accentGlow || '#00ffcc'}1A`,
                      color: theme.accentGlow || '#00ffcc',
                      padding: '4px 10px', borderRadius: '4px',
                      fontSize: '0.8rem', fontFamily: '"Oswald", sans-serif'
                    }}>
                      {cat.count} {cat.count > 1 ? 'UNITS' : 'UNIT'}
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {cat.items.map((item, j) => (
                      <li key={j} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        borderBottom: j !== cat.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        padding: '10px 0', fontSize: '0.9rem'
                      }}>
                        <div>
                          <span style={{ display: 'block', color: '#FFF', fontWeight: '500', marginBottom: '2px' }}>{item.make}</span>
                          <span style={{ color: '#777', fontSize: '0.75rem', fontFamily: '"Manrope", sans-serif' }}>{item.capacity}</span>
                        </div>
                        {item.count > 1 && (
                          <span style={{ color: '#AAA', fontSize: '0.85rem' }}>x{item.count}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}