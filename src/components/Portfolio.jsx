import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';

export default function Portfolio() {
  const { portfolio, theme } = useContent();
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1100);
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const visibleProjects = showAllProjects ? portfolio.projects : portfolio.projects.slice(0, 3);
  const visibleMachines = portfolio.machines;

  return (
    <>
      <section
        id="portfolio"
        style={{ backgroundColor: '#0F1115', color: '#FFFFFF', position: 'relative' }}
      >
        {/* --- HEADER --- */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '100px 20px 60px' }}>
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: '5rem' }}
            transition={{ duration: 1 }}
            style={{ display: 'block', height: '3px', background: '#FFFFFF', marginBottom: '2rem' }}
          />
          <h2 style={{
            fontSize: 'clamp(3rem, 5vw, 5rem)',
            fontFamily: '"Oswald", sans-serif',
            textTransform: 'uppercase',
            lineHeight: '1',
            margin: 0
          }}>
            {portfolio.heading}
          </h2>
          <p style={{ maxWidth: '600px', marginTop: '30px', color: '#A0A0A0', fontSize: '1.1rem', lineHeight: '1.6' }}>
            {portfolio.subtext}
          </p>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '30px',
          padding: '0 20px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <AnimatePresence initial={false}>
            {visibleProjects.map((project, i) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
                transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                style={{
                  position: 'relative',
                  height: '450px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: '#151515',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                {/* BACKGROUND IMAGE */}
                <div style={{ width: '100%', height: '100%' }}>
                  <img
                    src={project.img}
                    alt={project.title}
                    onError={(e) => { e.target.style.display = 'none'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%) brightness(0.8)' }}
                  />
                </div>

                {/* CONTENT OVERLAY */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, width: '100%',
                  padding: '40px 30px 30px', zIndex: 10,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 60%, transparent 100%)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                }}>
                  <h3 style={{
                    fontFamily: '"Oswald", sans-serif', fontSize: '1.8rem', textTransform: 'uppercase',
                    margin: '0 0 12px 0', color: '#FFF', lineHeight: 1.1, letterSpacing: '0.05em'
                  }}>
                    {project.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#B0B0B0', fontFamily: '"Manrope", sans-serif', lineHeight: '1.6' }}>
                    {project.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- EXPAND BUTTON --- */}
        <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '100px' }}>
          <motion.button
            onClick={() => setShowAllProjects(prev => !prev)}
            whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF', color: '#000000' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'transparent', color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.4)', padding: '16px 45px',
              fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em',
              cursor: 'pointer', fontFamily: '"Oswald", sans-serif', transition: 'background-color 0.3s, color 0.3s'
            }}
          >
            {showAllProjects ? portfolio.viewLessLabel : portfolio.viewMoreLabel}
          </motion.button>
        </div>
      </section>

      {/* --- INFRASTRUCTURE SECTION --- */}
      <section id="infrastructure" style={{ backgroundColor: '#0F1115', paddingBottom: '120px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <span style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, #333)' }}></span>
            <h3 style={{
              fontFamily: '"Oswald", sans-serif', fontSize: '2rem', textAlign: 'center',
              margin: 0, color: '#FFF', letterSpacing: '0.1em'
            }}>
              {portfolio.infraHeading}
            </h3>
            <span style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, #333)' }}></span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(auto-fit, minmax(300px, 1fr))' : 'repeat(4, 1fr)',
            gap: '30px'
          }}>
            <AnimatePresence initial={false}>
              {visibleMachines.map((cat, i) => (
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
                    background: `linear-gradient(90deg, ${theme.accentGlow}, transparent)`, zIndex: 10
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
                        background: `${theme.accentGlow}1A`,
                        color: theme.accentGlow,
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
    </>
  );
}