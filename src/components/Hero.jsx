import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

export default function Hero() {
  const { hero } = useContent();
  const [startAnimation, setStartAnimation] = useState(false);
  const [showSpark, setShowSpark] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Mobile Detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 2. Wait for page load, then start animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setStartAnimation(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // 3. Spark Trigger
  useEffect(() => {
    if (startAnimation && !isMobile) {
      const sparkTimer = setTimeout(() => { setShowSpark(true); }, 3200);
      return () => clearTimeout(sparkTimer);
    }
  }, [startAnimation, isMobile]);

  // 4. Background Slideshow — uses content-driven interval
  useEffect(() => {
    if (!startAnimation) return;
    const slideTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % hero.slideshowImages.length);
    }, hero.slideshowIntervalMs);
    return () => clearInterval(slideTimer);
  }, [startAnimation, hero.slideshowImages.length, hero.slideshowIntervalMs]);

  const getImageState = (index) => {
    if (index === currentIndex) return "active";
    const prevIndex = (currentIndex - 1 + hero.slideshowImages.length) % hero.slideshowImages.length;
    if (index === prevIndex) return "exit";
    return "inactive";
  };

  const titleFontSize = isMobile ? '3.5rem' : 'clamp(4.5rem, 8vw, 8.5rem)';

  return (
    <section
      id="hero"
      style={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0F1115',
        color: '#FFFFFF',
        margin: 0,
        padding: 0
      }}
    >
      {/* BACKGROUND */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        {hero.slideshowImages.map((imgSrc, i) => (
          <motion.img
            key={i}
            src={imgSrc}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={getImageState(i) === "active" ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5 }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              position: 'absolute'
            }}
          />
        ))}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          background: 'linear-gradient(to right, rgba(15, 17, 21, 0.8) 0%, rgba(15, 17, 21, 0.4) 100%)',
          backdropFilter: 'blur(2px)'
        }} />
      </motion.div>

      {/* CONTENT WRAPPER */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        width: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
      }}>
        {/* MAIN MOVING CONTAINER */}
        <motion.div
          style={{
            textAlign: isMobile ? 'center' : 'left',
            width: 'fit-content',
            height: 'fit-content',
            pointerEvents: 'auto',
            position: 'absolute',
            top: '50%',
            left: 0,
            maxWidth: '100%',
            padding: isMobile ? '0 20px' : '0',
            willChange: 'transform, opacity',
          }}
          initial={{
            y: "-50%",
            x: "calc(50vw - 50%)",
            scale: 1.5,
            opacity: 0
          }}
          animate={{
            y: "-50%",
            x: isMobile ? "calc(50vw - 50%)" : (startAnimation ? "10vw" : "calc(50vw - 50%)"),
            scale: startAnimation ? 1 : 1.5,
            opacity: 1
          }}
          transition={{
            opacity: { duration: 1.5, ease: "easeOut" },
            x: { duration: 2.5, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 2.5, ease: [0.16, 1, 0.3, 1] }
          }}
        >
          {/* 1. TITLE TEXT */}
          <motion.h1
            style={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: '900',
              textTransform: 'uppercase',
              lineHeight: '1.05',
              letterSpacing: isMobile ? '0.02em' : 'normal',
              fontSize: titleFontSize,
              margin: 0,
              whiteSpace: 'nowrap',
              backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 40%, #E0E0E0 60%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              position: 'relative',
              zIndex: 10
            }}
          >
            <span style={{ display: 'block' }}>{hero.titleLine1}</span>
            <span style={{ display: 'block' }}>{hero.titleLine2}</span>
          </motion.h1>

          {/* 2. HR & TAGLINE */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: startAnimation ? 1 : 0, x: startAnimation ? 0 : -100 }}
            transition={{ delay: 1.8, duration: 1 }}
            style={{
              marginTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.4)',
              paddingTop: '20px',
              width: '100%',
            }}
          >
            <p style={{
              fontFamily: '"Manrope", sans-serif',
              letterSpacing: '0.2em',
              fontSize: isMobile ? '0.95rem' : '1.7rem',
              lineHeight: isMobile ? '1.5' : '1.2',
              fontWeight: '600',
              margin: 0,
              color: '#EAEAEA',
              textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,1)'
            }}>
              {hero.tagline}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}