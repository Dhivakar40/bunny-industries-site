import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';

// Scroll target IDs for Quick Links — stay hardcoded (unsafe to expose via CMS)
const QUICK_LINK_IDS = ['hero', 'about', 'sectors', 'infrastructure', 'certifications'];

export default function Footer() {
  const { footer, legal } = useContent();
  const [activeModal, setActiveModal] = useState(null);
  // Map legal link labels → legal keys
  // Index 0 → privacy, 1 → disclaimer, 2 → terms
  const LEGAL_KEYS = ['privacy', 'disclaimer', 'terms'];

  const closeModal = () => setActiveModal(null);

  const getFooterTargetId = (label, i) => {
    const upper = (label || '').toUpperCase();
    if (upper.includes('HOME') || upper.includes('HERO')) return 'hero';
    if (upper.includes('ABOUT')) return 'about';
    if (upper.includes('SECTOR')) return 'sectors';
    if (upper.includes('INFRA') || upper.includes('SERVICE') || upper.includes('PORTFOLIO')) return 'infrastructure';
    if (upper.includes('CLIENT') || upper.includes('CUSTOMER') || upper.includes('VALUED') || upper.includes('PARTNER')) return 'clients';
    if (upper.includes('CERTIF')) return 'certifications';
    if (upper.includes('CONTACT')) return 'contact';
    return QUICK_LINK_IDS[i] || 'hero';
  };

  const scrollToSection = (id) => {
    const element =
      document.getElementById(id) ||
      (id === 'clients' ? (document.getElementById('clients') || document.getElementById('customers') || document.getElementById('valued-customers')) : null) ||
      (id === 'infrastructure' ? (document.getElementById('infrastructure') || document.getElementById('portfolio')) : null);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer style={{
        backgroundColor: '#050608', color: '#FFFFFF', padding: '80px 0 30px 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontFamily: '"Manrope", sans-serif', position: 'relative', overflow: 'hidden'
      }}>

        {/* Background faint overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% -20%, rgba(255,255,255,0.03), transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>

          {/* --- TOP GRID: LINKS & INFO --- */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '60px' }}>

            {/* COLUMN 1: BRAND & INFO */}
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{
                  fontFamily: '"Oswald", sans-serif', fontWeight: '900', textTransform: 'uppercase',
                  lineHeight: '1.05', fontSize: '2rem', margin: 0,
                  backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 40%, #E0E0E0 60%, #FFFFFF 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent'
                }}>
                  <span style={{ display: 'block' }}>{footer.brandLine1}</span>
                  <span style={{ display: 'block' }}>{footer.brandLine2}</span>
                </h1>

                <a
                  href={footer.unit1.mapLink || "https://maps.app.goo.gl/Sx3MX6EP6HndtSPq9?g_st=aw"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    color: '#A0A0A0',
                    lineHeight: '1.6',
                    fontSize: '0.9rem',
                    maxWidth: '320px',
                    marginTop: '15px',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#A0A0A0'; }}
                  title="Open Unit-1 in Google Maps"
                >
                  <strong style={{ color: '#FFF' }}>Unit-1:</strong> {footer.unit1.address}
                  <span style={{ display: 'inline-block', marginLeft: '6px', fontSize: '0.8rem', color: '#6B9BD0' }}>↗</span>
                </a>
              </div>

              <a
                href={footer.unit2.mapLink || "https://maps.app.goo.gl/VXAc7UpvBX72Likc8"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  color: '#A0A0A0',
                  lineHeight: '1.6',
                  fontSize: '0.9rem',
                  maxWidth: '320px',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#A0A0A0'; }}
                title="Open Unit-2 in Google Maps"
              >
                <strong style={{ color: '#FFF' }}>Unit-2:</strong> {footer.unit2.address}
                <span style={{ display: 'inline-block', marginLeft: '6px', fontSize: '0.8rem', color: '#6B9BD0' }}>↗</span>
              </a>
            </div>

            {/* COLUMN 2: QUICK LINKS */}
            <div>
              <h3 style={{ fontFamily: '"Oswald", sans-serif', textTransform: 'uppercase', marginBottom: '25px', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                {footer.columnHeadings.links}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {footer.quickLinks.map((item, i) => (
                  <li key={i}>
                    <button
                      onClick={() => scrollToSection(getFooterTargetId(item.label, i))}
                      style={{ background: 'transparent', border: 'none', color: '#CCC', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', padding: 0, transition: 'color 0.3s' }}
                      onMouseOver={(e) => e.target.style.color = '#FFF'}
                      onMouseOut={(e) => e.target.style.color = '#CCC'}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: OUR SERVICES */}
            <div>
              <h3 style={{ fontFamily: '"Oswald", sans-serif', textTransform: 'uppercase', marginBottom: '25px', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                {footer.columnHeadings.services}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {footer.servicesList.map((item, i) => (
                  <li key={i} style={{ color: '#CCC', fontSize: '0.9rem' }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* COLUMN 4: OUR COMPANY / LEGAL */}
            <div>
              <h3 style={{ fontFamily: '"Oswald", sans-serif', textTransform: 'uppercase', marginBottom: '25px', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                {footer.columnHeadings.company}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {footer.legalLinkLabels.map((label, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setActiveModal(LEGAL_KEYS[i])}
                      style={{ background: 'none', border: 'none', padding: 0, color: '#CCC', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.3s', textAlign: 'left' }}
                      onMouseOver={(e) => e.target.style.color = '#FFF'}
                      onMouseOut={(e) => e.target.style.color = '#CCC'}
                    >
                      {label}
                    </button>
                  </li>
                ))}

                <li style={{ marginTop: '20px' }}>
                  <button
                    onClick={() => scrollToSection('contact')}
                    style={{
                      background: '#FFF', color: '#000', border: 'none', padding: '10px 25px',
                      fontFamily: '"Oswald", sans-serif', textTransform: 'uppercase', fontSize: '0.8rem',
                      cursor: 'pointer', letterSpacing: '0.1em', transition: 'transform 0.2s ease', borderRadius: '2px'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {footer.contactCtaLabel}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- COPYRIGHT BAR --- */}
        <div style={{ maxWidth: '1400px', margin: '40px auto 0 auto', padding: '20px 40px 0 40px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: '#555', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} {footer.brandLine1} {footer.brandLine2}. All Rights Reserved.
        </div>
      </footer>

      {/* --- LEGAL MODAL OVERLAY — reads from content.legal --- */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ backgroundColor: '#15161A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', width: '100%', maxWidth: '800px', maxHeight: '85vh', overflowY: 'auto', padding: '40px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                style={{ position: 'absolute', top: '20px', right: '25px', background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseOver={(e) => e.target.style.color = '#FFF'}
                onMouseOut={(e) => e.target.style.color = '#888'}
              >
                ✕
              </button>

              <h2 style={{ fontFamily: '"Oswald", sans-serif', color: '#FFF', fontSize: '2rem', marginBottom: '20px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                {legal[activeModal]?.title}
              </h2>
              <div style={{ color: '#B0B0B0', lineHeight: '1.8', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {legal[activeModal]?.content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}