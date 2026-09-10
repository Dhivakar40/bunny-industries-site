import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Clients from './components/Clients';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ContentProvider, useContent } from './context/ContentContext';

// ── Controller: lazy-loaded, dynamically imported ─────────────
// __CONTENT_PROVIDER_MODE__ and __INCLUDE_CONTROLLER__ are injected by Vite define:
//   vite.config.js (dev)       → mode='dev', include=true
//   vite.prod.config.js (site) → mode='site', include=false
const PROVIDER_MODE =
  typeof __CONTENT_PROVIDER_MODE__ !== 'undefined' ? __CONTENT_PROVIDER_MODE__ : 'dev';

const INCLUDE_CONTROLLER =
  typeof __INCLUDE_CONTROLLER__ !== 'undefined' ? __INCLUDE_CONTROLLER__ : true;

const ControllerRoute = INCLUDE_CONTROLLER
  ? lazy(() => import('./controller/ControllerRoute'))
  : null;

// ── Public site ───────────────────────────────────────────────
function SiteApp() {
  const content = useContent();

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Meta tag injection — reactive to CMS edits
  useEffect(() => {
    document.title = content.meta.title;

    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', content.meta.description);

    let kwTag = document.querySelector('meta[name="keywords"]');
    if (!kwTag) {
      kwTag = document.createElement('meta');
      kwTag.setAttribute('name', 'keywords');
      document.head.appendChild(kwTag);
    }
    kwTag.setAttribute('content', content.meta.keywords);
  }, [content.meta]);

  return (
    <div className="app-main">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Clients />
        <Certifications />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────
function App() {
  return (
    <ContentProvider mode={PROVIDER_MODE}>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<SiteApp />} />
            {INCLUDE_CONTROLLER && ControllerRoute && (
              <Route path="/controller/*" element={<ControllerRoute />} />
            )}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ContentProvider>
  );
}

export default App;
