import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

export default function Services() {
  const { services } = useContent();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1100);
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      id="sectors"
      style={{
        backgroundColor: '#0F1115',
        color: '#FFFFFF',
        position: 'relative',
        paddingBottom: '100px',
        minHeight: '100vh'
      }}
    >
      {/* --- MATERIALS MARQUEE --- */}
      <div style={{
        width: '100%',
        background: '#1A1A1A',
        borderBottom: '1px solid #333',
        overflow: 'hidden',
        padding: '15px 0',
        marginBottom: '80px',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}>
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          style={{
            whiteSpace: 'nowrap',
            fontSize: '0.9rem',
            fontFamily: '"Oswald", sans-serif',
            letterSpacing: '0.2em',
            color: '#888',
            display: 'flex',
            gap: '40px'
          }}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i}>{services.materialsMarqueeText}</span>
          ))}
        </motion.div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>

        {/* --- HEADER --- */}
        <div style={{ marginBottom: '60px', paddingLeft: '20px' }}>
          <span style={{ display: 'block', width: '5rem', height: '3px', background: '#FFFFFF', marginBottom: '2rem' }}></span>
          <h2 style={{
            fontSize: 'clamp(3rem, 5vw, 5rem)',
            fontFamily: '"Oswald", sans-serif',
            lineHeight: '1',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>
            {services.heading}
          </h2>
          <p style={{ maxWidth: '600px', color: '#A0A0A0', lineHeight: '1.6', fontSize: '1.1rem' }}>
            {services.subtext}
          </p>
        </div>

        {/* --- GRID CONTAINER --- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '60px' : '25px',
          width: '100%',
          alignItems: 'stretch'
        }}>
          {services.capabilities.map((service, i) => (
            <motion.div
              layout
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover="hover"
              style={{
                position: 'relative',
                width: '100%',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {/* TEXT CONTENT WRAPPER */}
              <div style={{
                marginBottom: '1.5rem',
                position: 'relative',
                zIndex: 1,
                paddingRight: '10px',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* NUMBER */}
                <span style={{
                  fontSize: '4.5rem',
                  fontFamily: '"Oswald", sans-serif',
                  opacity: 0.2,
                  fontWeight: 'bold',
                  lineHeight: 1,
                  marginBottom: '10px'
                }}>
                  {service.id}
                </span>

                {/* TITLE */}
                <h3 style={{
                  fontSize: '1.8rem',
                  fontFamily: '"Oswald", sans-serif',
                  marginBottom: '1rem',
                  color: '#FFF',
                  lineHeight: 1.2,
                  marginTop: '20px',
                  minHeight: isMobile ? 'auto' : '70px'
                }}>
                  {service.title}
                </h3>

                {/* DESCRIPTION */}
                <p style={{
                  fontSize: '0.95rem',
                  color: '#B0B0B0',
                  lineHeight: '1.6',
                  maxWidth: '95%',
                  margin: 0
                }}>
                  {service.desc}
                </p>
              </div>

              {/* FRAME IMAGE */}
              <motion.div
                variants={{
                  initial: { scale: 1, y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)", zIndex: 1, border: '1px solid rgba(255,255,255,0.1)' },
                  hover: { scale: 1.03, y: -10, boxShadow: "0 30px 60px rgba(0,0,0,0.5)", zIndex: 10, border: '1px solid rgba(255,255,255,0.4)' }
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  width: '100%',
                  aspectRatio: '4/5',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  background: '#000',
                  flexShrink: 0
                }}
              >
                <motion.img
                  src={service.image}
                  alt={service.title}
                  variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
                  transition={{ duration: 0.4 }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}