import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';

// --- Scroll target IDs stay hardcoded (unsafe to expose via CMS) ---
const NAV_TARGET_IDS = ['about', 'sectors', 'infrastructure', 'clients', 'certifications'];

import portfolioPDF from '../assets/portfolio.pdf';

export default function Navbar() {
  const { navbar } = useContent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 1. Detect Scroll for Glass Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Detect Mobile Screen Size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1100);
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 3. Smooth Scroll Logic with fallback
  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(targetId) || document.getElementById('infrastructure') || document.getElementById('portfolio');
    if (element) {
      window.scrollTo({ top: element.offsetTop - 90, behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  };

  // Ensure "SERVICES" is completely excluded from quicklinks
  const activeNavItems = (navbar.navItems || []).filter(
    (item) => !item.label.toUpperCase().includes('SERVICE')
  );

  const getTargetId = (label) => {
    const upper = label.toUpperCase();
    if (upper.includes('ABOUT')) return 'about';
    if (upper.includes('SECTOR')) return 'sectors';
    if (upper.includes('INFRA') || upper.includes('SERVICE') || upper.includes('PORTFOLIO')) return 'infrastructure';
    if (upper.includes('CLIENT')) return 'clients';
    if (upper.includes('CERTIF')) return 'certifications';
    return 'infrastructure';
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          padding: isMobile ? '12px 18px' : (isScrolled ? '12px 35px' : '16px 40px'),
          background: isScrolled ? 'rgba(10, 13, 18, 0.96)' : 'rgba(13, 17, 24, 0.88)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid',
          borderBottomColor: isScrolled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.12)',
          boxShadow: isScrolled ? '0 12px 36px rgba(0,0,0,0.7)' : '0 4px 25px rgba(0,0,0,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '15px' : '30px',
          transition: 'padding 0.3s ease, background-color 0.3s ease, border-bottom-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        {/* --- LEFT: BRAND LOGO --- */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', minWidth: 'max-content' }}>
          <div
            onClick={handleLogoClick}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', zIndex: 201 }}
          >
            <img
              src="/bunny_header_badge.png"
              alt={navbar.logoAlt}
              style={{
                height: isMobile ? '46px' : (isScrolled ? '62px' : '74px'),
                maxWidth: isMobile ? '280px' : '420px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                transition: 'all 0.3s ease',
                filter: 'drop-shadow(0px 3px 12px rgba(0, 0, 0, 0.7))'
              }}
            />
          </div>
        </div>

        {/* --- CENTER: DESKTOP NAVIGATION --- */}
        {!isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ul style={{
              display: 'flex',
              gap: '18px',
              listStyle: 'none',
              margin: 0,
              padding: '0 24px',
              height: '46px',
              alignItems: 'center',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: '50px',
              backgroundColor: 'rgba(20, 26, 36, 0.82)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
            }}>
              {activeNavItems.map((item) => {
                const targetId = getTargetId(item.label);
                return (
                  <li key={item.label} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <a
                      href={`#${targetId}`}
                      onClick={(e) => scrollToSection(e, targetId)}
                      style={{
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        opacity: 0.95,
                        transition: 'opacity 0.3s, color 0.3s',
                        fontWeight: '600',
                        position: 'relative',
                        display: 'block',
                        paddingBottom: '2px',
                        whiteSpace: 'nowrap'
                      }}
                      className="nav-link"
                      onMouseOver={(e) => { e.target.style.opacity = 1; e.target.style.color = '#6B9BD0'; }}
                      onMouseOut={(e) => { e.target.style.opacity = 0.95; e.target.style.color = '#FFFFFF'; }}
                    >
                      {item.label}
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '0%',
                        height: '1.5px',
                        backgroundColor: '#6B9BD0',
                        transition: 'width 0.3s ease-out'
                      }} className="hover-underline" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* --- RIGHT: ACTIONS --- */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', minWidth: 'max-content' }}>
          {!isMobile && (
            <>
              {/* SECONDARY CTA: GHOST BUTTON */}
              <a
                href={portfolioPDF}
                download={navbar.ctaBrochureFilename}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.8)',
                  color: '#FFF',
                  padding: isScrolled ? '10px 22px' : '12px 26px',
                  fontFamily: 'var(--font-serif)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
                  borderRadius: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = '#FFF'; }}
                onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(255,255,255,0.8)'; }}
              >
                {navbar.ctaBrochureLabel}
              </a>

              {/* PRIMARY CTA: SOLID WHITE BUTTON */}
              <button
                onClick={(e) => scrollToSection(e, 'contact')}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #FFFFFF',
                  color: '#000000',
                  padding: isScrolled ? '10px 22px' : '12px 26px',
                  fontFamily: 'var(--font-serif)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
                  borderRadius: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#FFFFFF'; }}
                onMouseOut={(e) => { e.target.style.background = '#FFFFFF'; e.target.style.color = '#000000'; }}
              >
                {navbar.ctaTalkLabel}
              </button>
            </>
          )}

          {isMobile && !menuOpen && (
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
                color: '#FFF',
                fontSize: '1.3rem',
                cursor: 'pointer',
                zIndex: 202,
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
          )}
        </div>
      </motion.nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#0F1115',
              zIndex: 190,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem'
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'absolute',
                top: '30px',
                right: '30px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                color: '#FFF',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
            >
              ✕
            </button>

            {activeNavItems.map((item) => {
              const targetId = getTargetId(item.label);
              return (
                <a
                  key={item.label}
                  href={`#${targetId}`}
                  onClick={(e) => scrollToSection(e, targetId)}
                  style={{
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                >
                  {item.label}
                </a>
              );
            })}

            {/* MOBILE DUAL ACTION CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px', width: '80%', maxWidth: '300px' }}>
              <a
                href={portfolioPDF}
                download={navbar.ctaBrochureFilename}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: '#FFF',
                  padding: '15px',
                  fontFamily: 'var(--font-serif)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontSize: '1rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  borderRadius: '2px',
                  fontWeight: '500'
                }}
              >
                {navbar.ctaBrochureLabel}
              </a>

              <button
                onClick={(e) => scrollToSection(e, 'contact')}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #FFFFFF',
                  color: '#000000',
                  padding: '15px',
                  fontFamily: 'var(--font-serif)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  fontWeight: '600'
                }}
              >
                {navbar.ctaTalkLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-link:hover .hover-underline {
          width: 100% !important;
        }
      `}</style>
    </>
  );
}